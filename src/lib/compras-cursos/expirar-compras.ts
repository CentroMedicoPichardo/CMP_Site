// src/lib/compras-cursos/expirar-compras.ts

import {
  and,
  eq,
  inArray,
  sql,
} from "drizzle-orm";

import { db } from "@/lib/db";
import {
  compraParticipantes,
  comprasCursos,
  estadosCompra,
  historialEstadosCompra,
  pagosCursos,
} from "@/lib/schema";

const ESTADO_PENDIENTE_PAGO =
  "Pendiente de pago";

const ESTADO_EXPIRADA =
  "Expirada";

const ESTADOS_PAGO_CANCELABLES = [
  "Reportado",
  "En revisión",
] as const;

type Transaction = Parameters<
  Parameters<typeof db.transaction>[0]
>[0];

interface ExpirarComprasVencidasOptions {
  usuarioId?: number;
  compraId?: number;
}

export interface ExpirarComprasVencidasResult {
  totalExpiradas: number;
  comprasExpiradas: number[];
}

class ExpiracionCompraError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ExpiracionCompraError";
  }
}

function validarId(
  value: number,
  fieldName: string
): void {
  if (
    !Number.isSafeInteger(value) ||
    value <= 0
  ) {
    throw new ExpiracionCompraError(
      `${fieldName} no contiene un identificador válido`
    );
  }
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
    throw new ExpiracionCompraError(
      `${fieldName} no contiene un identificador válido`
    );
  }

  return converted;
}

async function obtenerEstadoExpirada(
  tx: Transaction
): Promise<{
  idEstado: number;
  nombre: string;
}> {
  const [estado] = await tx
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
          ESTADO_EXPIRADA
        ),
        eq(
          estadosCompra.activo,
          true
        )
      )
    )
    .limit(1);

  if (!estado) {
    throw new ExpiracionCompraError(
      `No existe el estado activo "${ESTADO_EXPIRADA}"`
    );
  }

  return estado;
}

/**
 * Expira compras pendientes cuyo plazo de pago ya venció.
 *
 * Modos de uso:
 * - {}: expira todas las compras vencidas.
 * - { usuarioId }: expira las compras vencidas de un usuario.
 * - { compraId }: expira una compra concreta si está vencida.
 * - { usuarioId, compraId }: limita por usuario y compra.
 *
 * No modifica cursos.cuposOcupados porque las compras
 * pendientes todavía no generaron inscripciones.
 */
export async function expirarComprasVencidas(
  tx: Transaction,
  options: ExpirarComprasVencidasOptions = {}
): Promise<ExpirarComprasVencidasResult> {
  if (options.usuarioId !== undefined) {
    validarId(
      options.usuarioId,
      "usuarioId"
    );
  }

  if (options.compraId !== undefined) {
    validarId(
      options.compraId,
      "compraId"
    );
  }

  const usuarioIdFiltro =
    options.usuarioId ?? null;

  const compraIdFiltro =
    options.compraId ?? null;

  await tx.execute(sql`
    SELECT cc.idcompra
    FROM academia.comprascursosinacademia AS cc
    INNER JOIN academia.estadocomprainacademia AS ec
      ON ec.idestadocompra = cc.idestadocompra
    WHERE (
        ${usuarioIdFiltro}::integer IS NULL
        OR cc.idusuario = ${usuarioIdFiltro}
      )
      AND ec.nombre = ${ESTADO_PENDIENTE_PAGO}
      AND cc.fechalimitepago <= CURRENT_TIMESTAMP
      AND (
        ${compraIdFiltro}::bigint IS NULL
        OR cc.idcompra = ${compraIdFiltro}
      )
    FOR UPDATE OF cc
  `);

  const condiciones = [
    eq(
      estadosCompra.nombre,
      ESTADO_PENDIENTE_PAGO
    ),
    sql`
      ${comprasCursos.fechalimitepago}
      <= CURRENT_TIMESTAMP
    `,
  ];

  if (options.usuarioId !== undefined) {
    condiciones.push(
      eq(
        comprasCursos.idusuario,
        options.usuarioId
      )
    );
  }

  if (options.compraId !== undefined) {
    condiciones.push(
      eq(
        comprasCursos.idcompra,
        BigInt(options.compraId)
      )
    );
  }

  const comprasVencidas = await tx
    .select({
      idCompra:
        comprasCursos.idcompra,
      idEstadoAnterior:
        comprasCursos.idestadocompra,
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
      and(...condiciones)
    );

  if (comprasVencidas.length === 0) {
    return {
      totalExpiradas: 0,
      comprasExpiradas: [],
    };
  }

  const estadoExpirada =
    await obtenerEstadoExpirada(tx);

  const comprasExpiradas =
    comprasVencidas.map(
      (compra) =>
        idToSafeNumber(
          compra.idCompra,
          "idCompra"
        )
    );

  await tx
    .update(comprasCursos)
    .set({
      idestadocompra:
        estadoExpirada.idEstado,
    })
    .where(
      inArray(
        comprasCursos.idcompra,
        comprasVencidas.map(
          (compra) =>
            compra.idCompra
        )
      )
    );

  await tx
    .update(compraParticipantes)
    .set({
      estado: "Cancelado",
      updatedAt:
        sql`CURRENT_TIMESTAMP`,
    })
    .where(
      inArray(
        compraParticipantes.idCompra,
        comprasExpiradas
      )
    );

  await tx
    .update(pagosCursos)
    .set({
      estado: "Cancelado",
      updatedAt:
        sql`CURRENT_TIMESTAMP`,
    })
    .where(
      and(
        inArray(
          pagosCursos.idCompra,
          comprasExpiradas
        ),
        inArray(
          pagosCursos.estado,
          [...ESTADOS_PAGO_CANCELABLES]
        )
      )
    );

  await tx
    .insert(
      historialEstadosCompra
    )
    .values(
      comprasVencidas.map(
        (compra) => ({
          idCompra:
            idToSafeNumber(
              compra.idCompra,
              "idCompra"
            ),
          idEstadoAnterior:
            compra.idEstadoAnterior,
          idEstadoNuevo:
            estadoExpirada.idEstado,
          usuarioResponsable:
            null,
          origenCambio:
            "Sistema",
          motivo:
            "Compra expirada por vencimiento del plazo de pago",
          observaciones:
            "La compra no recibió un pago reportado antes de la fecha límite.",
        })
      )
    );

  return {
    totalExpiradas:
      comprasExpiradas.length,
    comprasExpiradas,
  };
}