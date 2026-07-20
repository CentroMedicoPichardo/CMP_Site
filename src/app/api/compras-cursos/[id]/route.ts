// src/app/api/compras-cursos/[id]/route.ts

import { NextResponse } from "next/server";
import {
  and,
  asc,
  eq,
} from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

import {
  compraParticipantes,
  comprasCursos,
  cursos,
  estadosCompra,
  metodosPagoCursos,
  pagosCursos,
  participantes,
} from "@/lib/schema";


import type {
  CompraCursoDetalleResponse,
  SexoParticipante,
} from "@/types/compras-cursos";


import { SEXOS_PARTICIPANTE } from "@/types/compras-cursos";

interface CompraCursoRouteContext {
  params: Promise<{
    id: string;
  }>;
}

class CompraConsultaError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
    this.name = "CompraConsultaError";
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
    throw new CompraConsultaError(
      `El valor de ${fieldName} no es válido`,
      500
    );
  }

  return converted;
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

  throw new CompraConsultaError(
    `No fue posible obtener ${fieldName}`,
    500
  );
}

function isSexoParticipante(
  value: unknown
): value is SexoParticipante {
  return (
    typeof value === "string" &&
    SEXOS_PARTICIPANTE.some(
      (sexo) => sexo === value
    )
  );
}

function normalizarSexoParticipante(
  value: string | null
): SexoParticipante | null {
  if (value === null) {
    return null;
  }

  if (!isSexoParticipante(value)) {
    throw new CompraConsultaError(
      "El sexo almacenado para un participante no es válido",
      500
    );
  }

  return value;
}

function decimalToCents(
  value: string | number
): number {
  const normalized = String(value).trim();

  if (
    !/^\d+(?:\.\d{1,2})?$/.test(normalized)
  ) {
    throw new CompraConsultaError(
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
    throw new CompraConsultaError(
      "El monto excede el rango permitido",
      500
    );
  }

  return cents;
}

function centsToDecimal(
  cents: number
): string {
  if (
    !Number.isSafeInteger(cents) ||
    cents < 0
  ) {
    throw new CompraConsultaError(
      "El monto calculado no es válido",
      500
    );
  }

  const integerPart =
    Math.floor(cents / 100);

  const decimalPart = String(
    cents % 100
  ).padStart(2, "0");

  return `${integerPart}.${decimalPart}`;
}

const ESTADOS_PAGO_CONTABILIZABLES = [
  "Reportado",
  "En revisión",
  "Aprobado",
] as const;

export async function GET(
  _request: Request,
  { params }: CompraCursoRouteContext
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

    const comprasEncontradas = await db
      .select({
        idCompra:
          comprasCursos.idcompra,
        folioCompra:
          comprasCursos.foliocompra,
        usuarioId:
          comprasCursos.idusuario,
        cursoId:
          comprasCursos.idcurso,
        tituloCurso:
          cursos.tituloCurso,
        cantidadCupos:
          comprasCursos.cantidadcupos,
        precioUnitario:
          comprasCursos.preciounitario,
        subtotal:
          comprasCursos.subtotal,
        descuento:
          comprasCursos.descuento,
        total:
          comprasCursos.total,
        estado:
          estadosCompra.nombre,
        fechaCompra:
          comprasCursos.fechacompra,
        fechaLimitePago:
          comprasCursos.fechalimitepago,
        observaciones:
          comprasCursos.observaciones,
      })
      .from(comprasCursos)
      .innerJoin(
        cursos,
        eq(
          comprasCursos.idcurso,
          cursos.idCurso
        )
      )
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

    const compraEncontrada =
      comprasEncontradas[0];

    if (!compraEncontrada) {
      return NextResponse.json(
        {
          error: "Compra no encontrada",
        },
        { status: 404 }
      );
    }

    const participantesEncontrados =
      await db
        .select({
          idCompraParticipante:
            compraParticipantes.idCompraParticipante,
          numeroCupo:
            compraParticipantes.numeroCupo,
          estado:
            compraParticipantes.estado,
          observaciones:
            compraParticipantes.observaciones,

          idParticipante:
            participantes.idParticipante,
          participanteUsuarioId:
            participantes.usuarioId,
          nombre:
            participantes.nombre,
          apellidoPaterno:
            participantes.apellidoPaterno,
          apellidoMaterno:
            participantes.apellidoMaterno,
          fechaNacimiento:
            participantes.fechaNacimiento,
          sexo:
            participantes.sexo,
          telefono:
            participantes.telefono,
          correo:
            participantes.correo,
          activo:
            participantes.activo,
        })
        .from(compraParticipantes)
        .innerJoin(
          participantes,
          eq(
            compraParticipantes.idParticipante,
            participantes.idParticipante
          )
        )
        .where(
          eq(
            compraParticipantes.idCompra,
            compraId
          )
        )
        .orderBy(
          asc(
            compraParticipantes.numeroCupo
          )
        );

    if (
      participantesEncontrados.length !==
      compraEncontrada.cantidadCupos
    ) {
      throw new CompraConsultaError(
        "La compra no contiene todos los participantes esperados",
        500
      );
    }

    const metodosPagoEncontrados =
    await db
        .select({
        idMetodoPago:
            metodosPagoCursos.idMetodoPago,
        nombre:
            metodosPagoCursos.nombre,
        descripcion:
            metodosPagoCursos.descripcion,
        requiereComprobante:
            metodosPagoCursos.requiereComprobante,
        instrucciones:
            metodosPagoCursos.instrucciones,
        })
        .from(metodosPagoCursos)
        .where(
        eq(
            metodosPagoCursos.activo,
            true
        )
        )
        .orderBy(
        asc(
            metodosPagoCursos.idMetodoPago
        )
        );

    const pagosEncontrados = await db
        .select({
            idPago:
            pagosCursos.idPago,
            idCompra:
            pagosCursos.idCompra,
            idMetodoPago:
            pagosCursos.idMetodoPago,
            metodoPago:
            metodosPagoCursos.nombre,
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
        })
        .from(pagosCursos)
        .innerJoin(
            metodosPagoCursos,
            eq(
            pagosCursos.idMetodoPago,
            metodosPagoCursos.idMetodoPago
            )
        )
        .where(
            eq(
            pagosCursos.idCompra,
            compraId
            )
        )
        .orderBy(
            asc(pagosCursos.fechaReporte)
        );

    const totalCompraCents =
    decimalToCents(
        compraEncontrada.total
    );

    const totalReportadoCents =
    pagosEncontrados
        .filter((pago) =>
        ESTADOS_PAGO_CONTABILIZABLES.some(
            (estado) => estado === pago.estado
        )
        )
        .reduce(
        (total, pago) =>
            total +
            decimalToCents(pago.monto),
        0
        );

    const saldoPendienteCents =
    Math.max(
        totalCompraCents -
        totalReportadoCents,
    0
  );

    const response: CompraCursoDetalleResponse =
      {
        compra: {
          idCompra: idToSafeNumber(
            compraEncontrada.idCompra,
            "idCompra"
          ),
          folioCompra:
            compraEncontrada.folioCompra,
          cursoId:
            compraEncontrada.cursoId,
          tituloCurso:
            compraEncontrada.tituloCurso,
          cantidadCupos:
            compraEncontrada.cantidadCupos,
          precioUnitario:
            compraEncontrada.precioUnitario,
          subtotal:
            compraEncontrada.subtotal,
          descuento:
            compraEncontrada.descuento,
          total:
            compraEncontrada.total,
          estado:
            compraEncontrada.estado,
          fechaCompra: fechaToString(
            compraEncontrada.fechaCompra,
            "la fecha de compra"
          ),
          fechaLimitePago: fechaToString(
            compraEncontrada.fechaLimitePago,
            "la fecha límite de pago"
          ),
          observaciones:
            compraEncontrada.observaciones,
        },

        participantes:
          participantesEncontrados.map(
            (registro) => ({
              idCompraParticipante:
                idToSafeNumber(
                  registro.idCompraParticipante,
                  "idCompraParticipante"
                ),
              numeroCupo:
                registro.numeroCupo,
              estado:
                registro.estado,
              observaciones:
                registro.observaciones,

              participante: {
                idParticipante:
                  idToSafeNumber(
                    registro.idParticipante,
                    "idParticipante"
                  ),
                usuarioId:
                  registro.participanteUsuarioId,
                nombre:
                  registro.nombre,
                apellidoPaterno:
                  registro.apellidoPaterno,
                apellidoMaterno:
                  registro.apellidoMaterno,
                fechaNacimiento:
                  registro.fechaNacimiento,
                sexo:
                  normalizarSexoParticipante(
                    registro.sexo
                  ),
                telefono:
                  registro.telefono,
                correo:
                  registro.correo,
                activo:
                  registro.activo,
              },
            })
          ),
        metodosPago: metodosPagoEncontrados,
        pagos: pagosEncontrados.map(
            (pago) => ({
                idPago: idToSafeNumber(
                pago.idPago,
                "idPago"
                ),
                idCompra:
                pago.idCompra,
                idMetodoPago:
                pago.idMetodoPago,
                metodoPago:
                pago.metodoPago,
                monto:
                pago.monto,
                referencia:
                pago.referencia,
                rutaComprobante:
                pago.rutaComprobante,
                nombreArchivoOriginal:
                pago.nombreArchivoOriginal,
                tipoArchivo:
                pago.tipoArchivo,
                estado:
                pago.estado,
                fechaPago:
                fechaToString(
                    pago.fechaPago,
                    "la fecha del pago"
                ),
                fechaReporte:
                fechaToString(
                    pago.fechaReporte,
                    "la fecha del reporte"
                ),
                observaciones:
                pago.observaciones,
            })
            ),

            resumenPago: {
            totalCompra:
                centsToDecimal(
                totalCompraCents
                ),
            totalReportado:
                centsToDecimal(
                totalReportadoCents
                ),
            saldoPendiente:
                centsToDecimal(
                saldoPendienteCents
                ),
            pagoCompletoReportado:
                saldoPendienteCents === 0,
            },
      };


    return NextResponse.json(response, {
      headers: {
        "Cache-Control":
          "private, no-store, max-age=0",
      },
    });
  } catch (error: unknown) {
    console.error(
      "Error consultando compra de curso:",
      error
    );

    if (
      error instanceof CompraConsultaError
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

    return NextResponse.json(
      {
        error:
          "Error interno al consultar la compra",
      },
      { status: 500 }
    );
  }
}