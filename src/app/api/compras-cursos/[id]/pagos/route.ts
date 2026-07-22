// src/app/api/compras-cursos/[id]/pagos/route.ts

import { NextResponse } from "next/server";
import {
  and,
  eq,
  inArray,
  sql,
} from "drizzle-orm";

import { auth } from "@/lib/auth";
import {
  expirarComprasVencidas,
} from "@/lib/compras-cursos/expirar-compras";
import { db } from "@/lib/db";
import { withUserEmail } from "@/lib/db-with-user";
import {
  comprasCursos,
  estadosCompra,
  historialEstadosCompra,
  metodosPagoCursos,
  pagosCursos,
} from "@/lib/schema";
import {
  hasPostgresCode,
  type ValidationResult,
} from "@/lib/validators/common";
import {
  validarReportarPagoCurso,
} from "@/lib/validators/pagos-cursos";
import type {
  CanalComprobanteCurso,
  ReportarPagoCursoInput,
  ReportarPagoCursoResponse,
} from "@/types/compras-cursos";

interface PagoRouteContext {
  params: Promise<{
    id: string;
  }>;
}

interface DatosComprobanteNormalizados {
  canalComprobante: CanalComprobanteCurso;
  rutaComprobante: string | null;
  nombreArchivoOriginal: string | null;
  tipoArchivo: string | null;
  comprobanteConfirmado: boolean;
  fechaEnvioWhatsapp: string | null;
  observaciones: string | null;
}

const ESTADO_COMPRA_PENDIENTE =
  "Pendiente de pago";
const ESTADO_COMPRA_PAGO_REPORTADO =
  "Pago reportado";

const ESTADOS_COMPRA_REPORTABLES = [
  ESTADO_COMPRA_PENDIENTE,
  ESTADO_COMPRA_PAGO_REPORTADO,
] as const;

const ESTADOS_PAGO_ACUMULABLES = [
  "Reportado",
  "En revisión",
  "Aprobado",
] as const;

const TIPOS_IMAGEN_PERMITIDOS = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

const CLOUDINARY_COMPROBANTES_ROOT =
  "centro-medico/comprobantes-cursos";

class ReportePagoError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
    this.name = "ReportePagoError";
  }
}

function parsePositiveId(
  value: string
): number | null {
  const parsed = Number(value);

  if (
    !Number.isSafeInteger(parsed) ||
    parsed <= 0
  ) {
    return null;
  }

  return parsed;
}

function idToSafeNumber(
  value: number | bigint,
  fieldName: string
): number {
  const converted = Number(value);

  if (
    !Number.isSafeInteger(converted) ||
    converted <= 0
  ) {
    throw new ReportePagoError(
      `El valor de ${fieldName} no es válido`,
      500
    );
  }

  return converted;
}

function parseCanalComprobante(
  value: string
): CanalComprobanteCurso {
  switch (value) {
    case "Imagen":
    case "URL":
    case "WhatsApp":
    case "Sin comprobante":
      return value;

    default:
      throw new ReportePagoError(
        "La base de datos devolvió un canal de comprobante inválido",
        500
      );
  }
}

function validationErrorResponse<T>(
  result: Extract<
    ValidationResult<T>,
    { success: false }
  >
) {
  return NextResponse.json(
    {
      error: result.error,
      details: result.fieldErrors,
    },
    { status: 400 }
  );
}

function decimalToCents(
  value: string | number
): number {
  const normalized = String(value).trim();

  if (
    !/^\d+(?:\.\d{1,2})?$/.test(
      normalized
    )
  ) {
    throw new ReportePagoError(
      "Se encontró un monto inválido",
      500
    );
  }

  const [integerPart, decimalPart = ""] =
    normalized.split(".");

  const cents =
    Number(integerPart) * 100 +
    Number(
      decimalPart
        .padEnd(2, "0")
        .slice(0, 2)
    );

  if (
    !Number.isSafeInteger(cents) ||
    cents < 0
  ) {
    throw new ReportePagoError(
      "El monto excede el rango permitido",
      500
    );
  }

  return cents;
}

function fechaToString(
  value: string | Date | null,
  fieldName: string
): string {
  if (value instanceof Date) {
    return value.toISOString();
  }

  if (
    typeof value === "string" &&
    value.trim().length > 0
  ) {
    return value;
  }

  throw new ReportePagoError(
    `No fue posible obtener ${fieldName}`,
    500
  );
}

function normalizeNullableText(
  value: string | null | undefined
): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();

  return normalized.length > 0
    ? normalized
    : null;
}

function validateHttpsUrl(
  value: string,
  fieldName: string
): string {
  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new ReportePagoError(
      `${fieldName} no contiene una URL válida`,
      400
    );
  }

  if (url.protocol !== "https:") {
    throw new ReportePagoError(
      `${fieldName} debe usar HTTPS`,
      400
    );
  }

  if (
    !url.hostname ||
    url.username ||
    url.password
  ) {
    throw new ReportePagoError(
      `${fieldName} no contiene una URL permitida`,
      400
    );
  }

  return url.toString();
}

function validarUrlImagenCloudinary(
  value: string,
  compraId: number,
  usuarioId: number
): string {
  const normalizedUrl =
    validateHttpsUrl(
      value,
      "La URL de la imagen"
    );

  const url = new URL(
    normalizedUrl
  );

  const cloudName =
    (
      process.env.CLOUDINARY_CLOUD_NAME ??
      process.env
        .NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ??
      ""
    ).trim();

  if (!cloudName) {
    throw new ReportePagoError(
      "Cloudinary no está configurado en el servidor",
      500
    );
  }

  if (
    url.hostname !==
    "res.cloudinary.com"
  ) {
    throw new ReportePagoError(
      "La imagen debe proceder de Cloudinary",
      400
    );
  }

  const decodedPath =
    decodeURIComponent(
      url.pathname
    );

  const cloudinaryPrefix =
    `/${cloudName}/image/upload/`;

  const expectedAssetPath =
    `/${CLOUDINARY_COMPROBANTES_ROOT}/compra-${compraId}/comprobante-compra-${compraId}-usuario-${usuarioId}-`;

  if (
    !decodedPath.includes(
      cloudinaryPrefix
    ) ||
    !decodedPath.includes(
      expectedAssetPath
    )
  ) {
    throw new ReportePagoError(
      "El comprobante no pertenece a esta compra",
      400
    );
  }

  return normalizedUrl;
}

function normalizarComprobante(
  input: ReportarPagoCursoInput,
  requiereComprobante: boolean,
  compraId: number,
  usuarioId: number
): DatosComprobanteNormalizados {
  const canal = input.canalComprobante;
  const observaciones =
    normalizeNullableText(
      input.observaciones
    );

  if (canal === "Sin comprobante") {
    if (requiereComprobante) {
      throw new ReportePagoError(
        "Este método de pago requiere comprobante",
        400
      );
    }

    return {
      canalComprobante:
        "Sin comprobante",
      rutaComprobante: null,
      nombreArchivoOriginal: null,
      tipoArchivo: null,
      comprobanteConfirmado: false,
      fechaEnvioWhatsapp: null,
      observaciones,
    };
  }

  if (canal === "Imagen") {
    const ruta = normalizeNullableText(
      input.rutaComprobante
    );
    const nombreArchivo =
      normalizeNullableText(
        input.nombreArchivoOriginal
      );
    const tipoArchivo =
      normalizeNullableText(
        input.tipoArchivo
      );

    if (
      !ruta ||
      !nombreArchivo ||
      !tipoArchivo
    ) {
      throw new ReportePagoError(
        "Para enviar una imagen debes cargar el comprobante completo",
        400
      );
    }

    if (
      !TIPOS_IMAGEN_PERMITIDOS.some(
        (tipo) => tipo === tipoArchivo
      )
    ) {
      throw new ReportePagoError(
        "La imagen debe ser JPG, PNG o WEBP",
        400
      );
    }

    return {
      canalComprobante: "Imagen",
      rutaComprobante:
        validarUrlImagenCloudinary(
          ruta,
          compraId,
          usuarioId
        ),
      nombreArchivoOriginal:
        nombreArchivo.slice(0, 255),
      tipoArchivo,
      comprobanteConfirmado: true,
      fechaEnvioWhatsapp: null,
      observaciones,
    };
  }

  if (canal === "URL") {
    const ruta = normalizeNullableText(
      input.rutaComprobante
    );

    if (!ruta) {
      throw new ReportePagoError(
        "Debes proporcionar la URL del comprobante",
        400
      );
    }

    return {
      canalComprobante: "URL",
      rutaComprobante:
        validateHttpsUrl(
          ruta,
          "La URL del comprobante"
        ),
      nombreArchivoOriginal: null,
      tipoArchivo: null,
      comprobanteConfirmado: true,
      fechaEnvioWhatsapp: null,
      observaciones,
    };
  }

  if (canal === "WhatsApp") {
    if (
      input.comprobanteConfirmado !==
      true
    ) {
      throw new ReportePagoError(
        "Debes confirmar que ya enviaste el comprobante por WhatsApp",
        400
      );
    }

    const notaWhatsapp =
      "El cliente indicó que envió el comprobante por WhatsApp.";

    return {
      canalComprobante:
        "WhatsApp",
      rutaComprobante: null,
      nombreArchivoOriginal: null,
      tipoArchivo: null,
      comprobanteConfirmado: false,
      fechaEnvioWhatsapp:
        new Date().toISOString(),
      observaciones:
        observaciones
          ? `${notaWhatsapp}\n${observaciones}`
          : notaWhatsapp,
    };
  }

  throw new ReportePagoError(
    "El canal de comprobante no es válido",
    400
  );
}

export async function POST(
  request: Request,
  { params }: PagoRouteContext
) {
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { error: "No autenticado" },
      { status: 401 }
    );
  }

  const usuarioId = Number(
    session.user.id
  );

  if (
    !Number.isSafeInteger(usuarioId) ||
    usuarioId <= 0
  ) {
    return NextResponse.json(
      {
        error:
          "La sesión no contiene un usuario válido",
      },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const compraId = parsePositiveId(id);

    if (!compraId) {
      return NextResponse.json(
        { error: "ID de compra inválido" },
        { status: 400 }
      );
    }

    const body: unknown =
      await request.json();

    const validation =
      validarReportarPagoCurso(body);

    if (!validation.success) {
      return validationErrorResponse(
        validation
      );
    }

    const input: ReportarPagoCursoInput =
      validation.data;

    const resultado = await withUserEmail(
      session.user.correo,
      async () =>
        db.transaction(async (tx) => {
          await expirarComprasVencidas(
            tx,
            {
              usuarioId,
              compraId,
            }
          );

          const comprasEncontradas =
            await tx
              .select({
                idCompra:
                  comprasCursos.idcompra,
                usuarioId:
                  comprasCursos.idusuario,
                estadoId:
                  comprasCursos.idestadocompra,
                estado:
                  estadosCompra.nombre,
                total:
                  comprasCursos.total,
                fechaLimitePago:
                  comprasCursos.fechalimitepago,
              })
              .from(comprasCursos)
              .innerJoin(
                estadosCompra,
                eq(
                  comprasCursos.idestadocompra,
                  estadosCompra.idestadocompra
                )
              )
              .where(
                and(
                  eq(
                    comprasCursos.idcompra,
                    BigInt(compraId)
                  ),
                  eq(
                    comprasCursos.idusuario,
                    usuarioId
                  )
                )
              )
              .limit(1);

          const compra =
            comprasEncontradas[0];

          if (!compra) {
            throw new ReportePagoError(
              "Compra no encontrada",
              404
            );
          }

          if (
            compra.estado === "Expirada"
          ) {
            throw new ReportePagoError(
              "La fecha límite de pago ya venció y la compra fue marcada como expirada",
              409
            );
          }

          if (
            !ESTADOS_COMPRA_REPORTABLES.some(
              (estado) =>
                estado === compra.estado
            )
          ) {
            throw new ReportePagoError(
              `No se puede reportar un pago cuando la compra está en estado "${compra.estado}"`,
              409
            );
          }

          const limitePago = new Date(
            compra.fechaLimitePago
          );

          if (
            Number.isNaN(
              limitePago.getTime()
            )
          ) {
            throw new ReportePagoError(
              "La fecha límite de pago almacenada no es válida",
              500
            );
          }

          if (
            limitePago.getTime() <=
            Date.now()
          ) {
            throw new ReportePagoError(
              "La fecha límite de pago ya venció",
              409
            );
          }

          const metodosEncontrados =
            await tx
              .select({
                idMetodoPago:
                  metodosPagoCursos.idMetodoPago,
                nombre:
                  metodosPagoCursos.nombre,
                requiereComprobante:
                  metodosPagoCursos.requiereComprobante,
              })
              .from(metodosPagoCursos)
              .where(
                and(
                  eq(
                    metodosPagoCursos.idMetodoPago,
                    input.idMetodoPago
                  ),
                  eq(
                    metodosPagoCursos.activo,
                    true
                  )
                )
              )
              .limit(1);

          const metodoPago =
            metodosEncontrados[0];

          if (!metodoPago) {
            throw new ReportePagoError(
              "El método de pago no existe o no está disponible",
              400
            );
          }

          const comprobante =
            normalizarComprobante(
              input,
              metodoPago.requiereComprobante,
              compraId,
              usuarioId
            );

          const pagosExistentes =
            await tx
              .select({
                totalReportado: sql<string>`
                  COALESCE(
                    SUM(${pagosCursos.monto}),
                    0
                  )::text
                `,
              })
              .from(pagosCursos)
              .where(
                and(
                  eq(
                    pagosCursos.idCompra,
                    compraId
                  ),
                  inArray(
                    pagosCursos.estado,
                    [...ESTADOS_PAGO_ACUMULABLES]
                  )
                )
              );

          const totalCompraCents =
            decimalToCents(compra.total);
          const totalReportadoCents =
            decimalToCents(
              pagosExistentes[0]
                ?.totalReportado ?? "0.00"
            );
          const nuevoPagoCents =
            decimalToCents(input.monto);

          if (
            totalReportadoCents +
              nuevoPagoCents >
            totalCompraCents
          ) {
            const restanteCents = Math.max(
              totalCompraCents -
                totalReportadoCents,
              0
            );

            const restante =
              `${Math.floor(
                restanteCents / 100
              )}.${String(
                restanteCents % 100
              ).padStart(2, "0")}`;

            throw new ReportePagoError(
              `El monto reportado supera el saldo pendiente de ${restante}`,
              409
            );
          }

          const estadosEncontrados =
            await tx
              .select({
                idEstado:
                  estadosCompra.idestadocompra,
                nombre:
                  estadosCompra.nombre,
              })
              .from(estadosCompra)
              .where(
                and(
                  eq(
                    estadosCompra.nombre,
                    ESTADO_COMPRA_PAGO_REPORTADO
                  ),
                  eq(
                    estadosCompra.activo,
                    true
                  )
                )
              )
              .limit(1);

          const estadoPagoReportado =
            estadosEncontrados[0];

          if (!estadoPagoReportado) {
            throw new ReportePagoError(
              `No existe el estado "${ESTADO_COMPRA_PAGO_REPORTADO}"`,
              500
            );
          }

          const pagosInsertados =
            await tx
              .insert(pagosCursos)
              .values({
                idCompra: compraId,
                idMetodoPago:
                  input.idMetodoPago,
                monto: input.monto,
                referencia:
                  input.referencia,
                rutaComprobante:
                  comprobante.rutaComprobante,
                nombreArchivoOriginal:
                  comprobante.nombreArchivoOriginal,
                tipoArchivo:
                  comprobante.tipoArchivo,
                canalComprobante:
                  comprobante.canalComprobante,
                comprobanteConfirmado:
                  comprobante.comprobanteConfirmado,
                fechaEnvioWhatsapp:
                  comprobante.fechaEnvioWhatsapp,
                estado: "Reportado",
                fechaPago:
                  input.fechaPago,
                observaciones:
                  comprobante.observaciones,
              })
              .returning({
                idPago:
                  pagosCursos.idPago,
                idCompra:
                  pagosCursos.idCompra,
                idMetodoPago:
                  pagosCursos.idMetodoPago,
                monto:
                  pagosCursos.monto,
                referencia:
                  pagosCursos.referencia,
                rutaComprobante:
                  pagosCursos.rutaComprobante,
                nombreArchivoOriginal:
                  pagosCursos.nombreArchivoOriginal,
                tipoArchivo:
                  pagosCursos.tipoArchivo,
                canalComprobante:
                  pagosCursos.canalComprobante,
                comprobanteConfirmado:
                  pagosCursos.comprobanteConfirmado,
                fechaEnvioWhatsapp:
                  pagosCursos.fechaEnvioWhatsapp,
                estado:
                  pagosCursos.estado,
                fechaPago:
                  pagosCursos.fechaPago,
                fechaReporte:
                  pagosCursos.fechaReporte,
                observaciones:
                  pagosCursos.observaciones,
              });

          const pagoInsertado =
            pagosInsertados[0];

          if (!pagoInsertado) {
            throw new ReportePagoError(
              "No se pudo registrar el pago",
              500
            );
          }

          if (
            compra.estado !==
            ESTADO_COMPRA_PAGO_REPORTADO
          ) {
            const actualizadas =
              await tx
                .update(comprasCursos)
                .set({
                  idestadocompra:
                    estadoPagoReportado.idEstado,
                  fechapago:
                    input.fechaPago,
                })
                .where(
                  eq(
                    comprasCursos.idcompra,
                    BigInt(compraId)
                  )
                )
                .returning({
                  idCompra:
                    comprasCursos.idcompra,
                });

            if (!actualizadas[0]) {
              throw new ReportePagoError(
                "No se pudo actualizar el estado de la compra",
                500
              );
            }

            await tx
              .insert(
                historialEstadosCompra
              )
              .values({
                idCompra: compraId,
                idEstadoAnterior:
                  compra.estadoId,
                idEstadoNuevo:
                  estadoPagoReportado.idEstado,
                usuarioResponsable:
                  usuarioId,
                origenCambio:
                  "Usuario",
                motivo:
                  "Pago reportado por el usuario",
                observaciones:
                  comprobante.observaciones,
              });
          }

          const response:
            ReportarPagoCursoResponse = {
            message:
              comprobante.canalComprobante ===
              "WhatsApp"
                ? "Pago reportado correctamente. El administrador verificará el comprobante enviado por WhatsApp."
                : "Pago reportado correctamente. Queda pendiente de revisión administrativa.",

            pago: {
              idPago: idToSafeNumber(
                pagoInsertado.idPago,
                "idPago"
              ),
              idCompra:
                pagoInsertado.idCompra,
              idMetodoPago:
                pagoInsertado.idMetodoPago,
              metodoPago:
                metodoPago.nombre,
              monto:
                pagoInsertado.monto,
              referencia:
                pagoInsertado.referencia,
              rutaComprobante:
                pagoInsertado.rutaComprobante,
              nombreArchivoOriginal:
                pagoInsertado.nombreArchivoOriginal,
              tipoArchivo:
                pagoInsertado.tipoArchivo,
              canalComprobante:
                parseCanalComprobante(
                  pagoInsertado.canalComprobante
                ),
              comprobanteConfirmado:
                pagoInsertado.comprobanteConfirmado,
              fechaEnvioWhatsapp:
                pagoInsertado.fechaEnvioWhatsapp,
              estado:
                pagoInsertado.estado,
              fechaPago:
                fechaToString(
                  pagoInsertado.fechaPago,
                  "la fecha del pago"
                ),
              fechaReporte:
                fechaToString(
                  pagoInsertado.fechaReporte,
                  "la fecha del reporte"
                ),
              observaciones:
                pagoInsertado.observaciones,
              motivoRechazo: null,
            },

            estadoCompra:
              estadoPagoReportado.nombre,
          };

          return response;
        })
    );

    return NextResponse.json(
      resultado,
      {
        status: 201,
        headers: {
          "Cache-Control":
            "private, no-store, max-age=0",
        },
      }
    );
  } catch (error: unknown) {
    console.error(
      "Error reportando pago:",
      error
    );

    if (
      error instanceof ReportePagoError
    ) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }

    if (
      hasPostgresCode(
        error,
        "23503"
      )
    ) {
      return NextResponse.json(
        {
          error:
            "La compra o el método de pago relacionado no existe",
        },
        { status: 409 }
      );
    }

    if (
      hasPostgresCode(
        error,
        "23514"
      )
    ) {
      return NextResponse.json(
        {
          error:
            "El reporte de pago no cumple las reglas de la base de datos",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error:
          "Error interno al reportar el pago",
      },
      { status: 500 }
    );
  }
}