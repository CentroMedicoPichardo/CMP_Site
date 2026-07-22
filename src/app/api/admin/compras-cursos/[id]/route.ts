// src/app/api/admin/compras-cursos/[id]/route.ts

import { asc, eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { NextResponse } from "next/server";

import { requireApiRole } from "@/lib/auth";
import {
  expirarComprasVencidas,
} from "@/lib/compras-cursos/expirar-compras";
import { db } from "@/lib/db";
import {
  compraParticipantes,
  comprasCursos,
  cursos,
  estadosCompra,
  historialEstadosCompra,
  metodosPagoCursos,
  pagosCursos,
  participantes,
  usuarios,
} from "@/lib/schema";
import type {
  CompraCursoAdminDetalleResponse,
  HistorialEstadoCompraAdmin,
} from "@/types/admin-compras-cursos";
import type {
  CanalComprobanteCurso,
  CompraParticipanteResumen,
  MetodoPagoCurso,
  PagoCursoResumen,
  SexoParticipante,
} from "@/types/compras-cursos";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

const ESTADOS_PAGO_REPORTADOS = [
  "Reportado",
  "En revisión",
  "Aprobado",
] as const;

const estadoAnterior = alias(
  estadosCompra,
  "estado_anterior_historial"
);

const estadoNuevo = alias(
  estadosCompra,
  "estado_nuevo_historial"
);

const usuarioResponsable = alias(
  usuarios,
  "usuario_responsable_historial"
);

function isSexoParticipante(
  value: string | null
): value is SexoParticipante {
  return (
    value === "Masculino" ||
    value === "Femenino" ||
    value === "Otro" ||
    value === "Prefiere no indicar"
  );
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
      throw new Error(
        `Canal de comprobante inválido: ${value}`
      );
  }
}

function idToSafeNumber(
  value: bigint | number,
  fieldName: string
): number {
  const result =
    typeof value === "bigint"
      ? Number(value)
      : value;

  if (
    !Number.isSafeInteger(result) ||
    result <= 0
  ) {
    throw new Error(
      `El campo ${fieldName} no contiene un ID válido`
    );
  }

  return result;
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

  throw new Error(
    `No fue posible obtener ${fieldName}`
  );
}

function moneyToFixed(
  value: string | number | null
): string {
  const amount = Number(value ?? 0);

  return Number.isFinite(amount)
    ? amount.toFixed(2)
    : "0.00";
}

export async function GET(
  _request: Request,
  context: RouteContext
) {
  const { error } =
    await requireApiRole("admin");

  if (error) {
    return error;
  }

  const { id } = await context.params;
  const compraId = Number(id);

  if (
    !Number.isSafeInteger(compraId) ||
    compraId <= 0
  ) {
    return NextResponse.json(
      {
        error:
          "El identificador de la compra no es válido",
      },
      { status: 400 }
    );
  }

  const compraIdBigInt = BigInt(compraId);

  try {
    const [compraPropietaria] = await db
      .select({
        usuarioId:
          comprasCursos.idusuario,
      })
      .from(comprasCursos)
      .where(
        eq(
          comprasCursos.idcompra,
          compraIdBigInt
        )
      )
      .limit(1);

    if (!compraPropietaria) {
      return NextResponse.json(
        {
          error: "Compra no encontrada",
        },
        { status: 404 }
      );
    }

    await db.transaction(async (tx) => {
      await expirarComprasVencidas(
        tx,
        {
          usuarioId:
            compraPropietaria.usuarioId,
          compraId,
        }
      );
    });

    const [compra] = await db
      .select({
        idCompra:
          comprasCursos.idcompra,
        folioCompra:
          comprasCursos.foliocompra,
        usuarioId:
          comprasCursos.idusuario,
        compradorNombre:
          usuarios.nombre,
        compradorApellidoPaterno:
          usuarios.apellidoPaterno,
        compradorApellidoMaterno:
          usuarios.apellidoMaterno,
        compradorCorreo:
          usuarios.correo,
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
        usuarios,
        eq(
          comprasCursos.idusuario,
          usuarios.id
        )
      )
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
        eq(
          comprasCursos.idcompra,
          compraIdBigInt
        )
      )
      .limit(1);

    if (!compra) {
      return NextResponse.json(
        {
          error: "Compra no encontrada",
        },
        { status: 404 }
      );
    }

    const filasParticipantes = await db
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
        usuarioId:
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

    const participantesResponse:
      CompraParticipanteResumen[] =
      filasParticipantes.map((fila) => ({
        idCompraParticipante:
          idToSafeNumber(
            fila.idCompraParticipante,
            "idCompraParticipante"
          ),
        numeroCupo:
          fila.numeroCupo,
        estado:
          fila.estado,
        observaciones:
          fila.observaciones,
        participante: {
          idParticipante:
            idToSafeNumber(
              fila.idParticipante,
              "idParticipante"
            ),
          usuarioId:
            fila.usuarioId,
          nombre:
            fila.nombre,
          apellidoPaterno:
            fila.apellidoPaterno,
          apellidoMaterno:
            fila.apellidoMaterno,
          fechaNacimiento:
            fila.fechaNacimiento,
          sexo:
            isSexoParticipante(
              fila.sexo
            )
              ? fila.sexo
              : null,
          telefono:
            fila.telefono,
          correo:
            fila.correo,
          activo:
            fila.activo,
        },
      }));

    const filasMetodos = await db
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
          metodosPagoCursos.nombre
        )
      );

    const metodosPago:
      MetodoPagoCurso[] =
      filasMetodos.map((fila) => ({
        idMetodoPago:
          fila.idMetodoPago,
        nombre:
          fila.nombre,
        descripcion:
          fila.descripcion,
        requiereComprobante:
          fila.requiereComprobante,
        instrucciones:
          fila.instrucciones,
      }));

    const filasPagos = await db
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
        motivoRechazo:
          pagosCursos.motivoRechazo,
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
        asc(
          pagosCursos.fechaReporte
        ),
        asc(
          pagosCursos.idPago
        )
      );

    const pagos:
      PagoCursoResumen[] =
      filasPagos.map((fila) => ({
        idPago:
          idToSafeNumber(
            fila.idPago,
            "idPago"
          ),
        idCompra:
          idToSafeNumber(
            fila.idCompra,
            "idCompra"
          ),
        idMetodoPago:
          fila.idMetodoPago,
        metodoPago:
          fila.metodoPago,
        monto:
          fila.monto,
        referencia:
          fila.referencia,
        rutaComprobante:
          fila.rutaComprobante,
        nombreArchivoOriginal:
          fila.nombreArchivoOriginal,
        tipoArchivo:
          fila.tipoArchivo,
        canalComprobante:
          parseCanalComprobante(
            fila.canalComprobante
          ),
        comprobanteConfirmado:
          fila.comprobanteConfirmado,
        fechaEnvioWhatsapp:
          fila.fechaEnvioWhatsapp
            ? fechaToString(
                fila.fechaEnvioWhatsapp,
                "la fecha de envío por WhatsApp"
              )
            : null,
        estado:
          fila.estado,
        fechaPago:
          fechaToString(
            fila.fechaPago,
            "la fecha del pago"
          ),
        fechaReporte:
          fechaToString(
            fila.fechaReporte,
            "la fecha del reporte"
          ),
        motivoRechazo:
          fila.motivoRechazo,
        observaciones:
          fila.observaciones,
      }));

    const filasHistorial = await db
      .select({
        idHistorial:
          historialEstadosCompra.idHistorialEstado,
        estadoAnterior:
          estadoAnterior.nombre,
        estadoNuevo:
          estadoNuevo.nombre,
        fechaCambio:
          historialEstadosCompra.fechaCambio,
        origenCambio:
          historialEstadosCompra.origenCambio,
        usuarioResponsableId:
          historialEstadosCompra.usuarioResponsable,
        responsableNombre:
          usuarioResponsable.nombre,
        responsableApellidoPaterno:
          usuarioResponsable.apellidoPaterno,
        responsableApellidoMaterno:
          usuarioResponsable.apellidoMaterno,
        motivo:
          historialEstadosCompra.motivo,
        observaciones:
          historialEstadosCompra.observaciones,
      })
      .from(historialEstadosCompra)
      .leftJoin(
        estadoAnterior,
        eq(
          historialEstadosCompra.idEstadoAnterior,
          estadoAnterior.idestadocompra
        )
      )
      .innerJoin(
        estadoNuevo,
        eq(
          historialEstadosCompra.idEstadoNuevo,
          estadoNuevo.idestadocompra
        )
      )
      .leftJoin(
        usuarioResponsable,
        eq(
          historialEstadosCompra.usuarioResponsable,
          usuarioResponsable.id
        )
      )
      .where(
        eq(
          historialEstadosCompra.idCompra,
          compraId
        )
      )
      .orderBy(
        asc(
          historialEstadosCompra.fechaCambio
        ),
        asc(
          historialEstadosCompra.idHistorialEstado
        )
      );

    const historialEstados:
      HistorialEstadoCompraAdmin[] =
      filasHistorial.map((fila) => {
        const usuarioResponsableNombre = [
          fila.responsableNombre,
          fila.responsableApellidoPaterno,
          fila.responsableApellidoMaterno,
        ]
          .filter(
            (value): value is string =>
              typeof value === "string" &&
              value.trim().length > 0
          )
          .join(" ");

        return {
          idHistorial:
            idToSafeNumber(
              fila.idHistorial,
              "idHistorial"
            ),
          estadoAnterior:
            fila.estadoAnterior,
          estadoNuevo:
            fila.estadoNuevo,
          fechaCambio:
            fechaToString(
              fila.fechaCambio,
              "la fecha del cambio de estado"
            ),
          origenCambio:
            fila.origenCambio,
          usuarioResponsableId:
            fila.usuarioResponsableId,
          usuarioResponsableNombre:
            usuarioResponsableNombre ||
            null,
          motivo:
            fila.motivo,
          observaciones:
            fila.observaciones,
        };
      });

    const totalCompra = Number(
      compra.total
    );

    const totalReportado =
      filasPagos.reduce(
        (total, pago) => {
          if (
            !ESTADOS_PAGO_REPORTADOS.includes(
              pago.estado as
                (typeof ESTADOS_PAGO_REPORTADOS)[number]
            )
          ) {
            return total;
          }

          const monto = Number(
            pago.monto
          );

          return Number.isFinite(monto)
            ? total + monto
            : total;
        },
        0
      );

    const saldoPendiente = Math.max(
      0,
      totalCompra - totalReportado
    );

    const compradorNombre = [
      compra.compradorNombre,
      compra.compradorApellidoPaterno,
      compra.compradorApellidoMaterno,
    ]
      .filter(
        (value): value is string =>
          typeof value === "string" &&
          value.trim().length > 0
      )
      .join(" ");

    const response:
      CompraCursoAdminDetalleResponse = {
        compra: {
          idCompra:
            idToSafeNumber(
              compra.idCompra,
              "idCompra"
            ),
          folioCompra:
            compra.folioCompra,
          usuarioId:
            compra.usuarioId,
          compradorNombre,
          compradorCorreo:
            compra.compradorCorreo,
          cursoId:
            compra.cursoId,
          tituloCurso:
            compra.tituloCurso,
          cantidadCupos:
            compra.cantidadCupos,
          precioUnitario:
            compra.precioUnitario,
          subtotal:
            compra.subtotal,
          descuento:
            compra.descuento,
          total:
            compra.total,
          estado:
            compra.estado,
          fechaCompra:
            fechaToString(
              compra.fechaCompra,
              "la fecha de compra"
            ),
          fechaLimitePago:
            fechaToString(
              compra.fechaLimitePago,
              "la fecha límite de pago"
            ),
          observaciones:
            compra.observaciones,
        },
        participantes:
          participantesResponse,
        metodosPago,
        pagos,
        historialEstados,
        resumenPago: {
          totalCompra:
            moneyToFixed(totalCompra),
          totalReportado:
            moneyToFixed(
              totalReportado
            ),
          saldoPendiente:
            moneyToFixed(
              saldoPendiente
            ),
          pagoCompletoReportado:
            totalReportado >=
            totalCompra,
        },
      };

    return NextResponse.json(
      response,
      {
        status: 200,
        headers: {
          "Cache-Control":
            "no-store",
        },
      }
    );
  } catch (error: unknown) {
    console.error(
      "Error obteniendo el detalle administrativo de la compra:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Error interno al obtener el detalle de la compra",
      },
      { status: 500 }
    );
  }
}