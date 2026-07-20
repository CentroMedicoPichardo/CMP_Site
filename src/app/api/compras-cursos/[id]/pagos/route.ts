// src/app/api/compras-cursos/[id]/pagos/route.ts

import { NextResponse } from "next/server";
import {
  and,
  eq,
  inArray,
  sql,
} from "drizzle-orm";

import { auth } from "@/lib/auth";
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
  ReportarPagoCursoInput,
  ReportarPagoCursoResponse,
} from "@/types/compras-cursos";

interface PagoRouteContext {
  params: Promise<{
    id: string;
  }>;
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

export async function POST(
  request: Request,
  { params }: PagoRouteContext
) {
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      {
        error: "No autenticado",
      },
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
        {
          error: "ID de compra inválido",
        },
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
          /*
           * Bloqueamos la compra para evitar dos reportes
           * concurrentes que superen el total.
           */
          await tx.execute(sql`
            SELECT idcompra
            FROM academia.comprascursosinacademia
            WHERE idcompra = ${compraId}
            FOR UPDATE
          `);

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
            ) ||
            limitePago.getTime() <
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

          if (
            metodoPago.requiereComprobante &&
            !input.rutaComprobante
          ) {
            throw new ReportePagoError(
              "Este método de pago requiere comprobante",
              400
            );
          }

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
                  input.rutaComprobante,
                nombreArchivoOriginal:
                  input.nombreArchivoOriginal,
                tipoArchivo:
                  input.tipoArchivo,
                estado: "Reportado",
                fechaPago:
                  input.fechaPago,
                observaciones:
                  input.observaciones,
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
                  input.observaciones,
              });
          }

          const response:
            ReportarPagoCursoResponse = {
            message:
              "Pago reportado correctamente. Queda pendiente de revisión administrativa.",

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
        {
          error: error.message,
        },
        {
          status: error.status,
        }
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