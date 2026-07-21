// src/app/api/admin/compras-cursos/route.ts

import {
  and,
  asc,
  count,
  desc,
  eq,
  inArray,
  or,
  sql,
} from "drizzle-orm";
import { NextResponse } from "next/server";

import { requireApiRole } from "@/lib/auth";
import {
  expirarComprasVencidas,
} from "@/lib/compras-cursos/expirar-compras";
import { db } from "@/lib/db";
import {
  comprasCursos,
  cursos,
  estadosCompra,
  pagosCursos,
  usuarios,
} from "@/lib/schema";
import type {
  CompraCursoAdminListaItem,
  FiltroComprasCursosAdmin,
  ListarComprasCursosAdminResponse,
} from "@/types/admin-compras-cursos";

const ESTADOS_COMPRA = [
  "Pendiente de pago",
  "Pago reportado",
  "En validación",
  "Pago validado",
  "Inscripciones generadas",
  "Rechazada",
  "Cancelada",
  "Expirada",
] as const;

const ESTADOS_PENDIENTES_REVISION = [
  "Pago reportado",
  "En validación",
] as const;

const ESTADOS_APROBADOS = [
  "Pago validado",
  "Inscripciones generadas",
] as const;

const PAGE_SIZES_PERMITIDOS = [
  5,
  10,
  20,
] as const;

const FILTROS_PERMITIDOS:
  readonly FiltroComprasCursosAdmin[] = [
    "todos",
    "pendientes_revision",
    "pendiente_pago",
    "inscripciones_generadas",
    "rechazada",
    "cancelada",
    "expirada",
  ];

const ESTADO_POR_FILTRO: Partial<
  Record<FiltroComprasCursosAdmin, string>
> = {
  pendiente_pago: "Pendiente de pago",
  inscripciones_generadas:
    "Inscripciones generadas",
  rechazada: "Rechazada",
  cancelada: "Cancelada",
  expirada: "Expirada",
};

function parsePositiveInteger(
  value: string | null,
  fallback: number
): number {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);

  return Number.isSafeInteger(parsed) &&
    parsed > 0
    ? parsed
    : fallback;
}

function parsePageSize(
  value: string | null
): number {
  const parsed = parsePositiveInteger(
    value,
    10
  );

  return PAGE_SIZES_PERMITIDOS.some(
    (item) => item === parsed
  )
    ? parsed
    : 10;
}

function parseFiltro(
  value: string | null
): FiltroComprasCursosAdmin {
  return FILTROS_PERMITIDOS.includes(
    value as FiltroComprasCursosAdmin
  )
    ? (value as FiltroComprasCursosAdmin)
    : "todos";
}

function idToSafeNumber(
  value: bigint | number,
  fieldName: string
): number {
  const result = Number(value);

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

function fechaNullableToString(
  value: string | Date | null
): string | null {
  if (value instanceof Date) {
    return value.toISOString();
  }

  if (
    typeof value === "string" &&
    value.trim().length > 0
  ) {
    return value;
  }

  return null;
}

export async function GET(
  request: Request
) {
  const { error } =
    await requireApiRole("admin");

  if (error) {
    return error;
  }

  const url = new URL(request.url);
  const requestedPage =
    parsePositiveInteger(
      url.searchParams.get("page"),
      1
    );
  const pageSize = parsePageSize(
    url.searchParams.get("pageSize")
  );
  const filtro = parseFiltro(
    url.searchParams.get("filtro")
  );
  const search =
    url.searchParams
      .get("search")
      ?.trim()
      .slice(0, 120) ?? "";

  try {
    await db.transaction(async (tx) => {
      await expirarComprasVencidas(
        tx,
        {}
      );
    });

    const pagosAgregados = db
      .select({
        idCompra:
          pagosCursos.idCompra,
        cantidadPagos: sql<number>`
          COUNT(*) FILTER (
            WHERE ${pagosCursos.estado}
              IN (
                'Reportado',
                'En revisión',
                'Aprobado'
              )
          )::int
        `.as("cantidad_pagos"),
        totalReportado: sql<string>`
          COALESCE(
            SUM(${pagosCursos.monto}) FILTER (
              WHERE ${pagosCursos.estado}
                IN (
                  'Reportado',
                  'En revisión',
                  'Aprobado'
                )
            ),
            0
          )::text
        `.as("total_reportado"),
        fechaUltimoReporte: sql<
          string | Date | null
        >`
          MAX(${pagosCursos.fechaReporte})
        `.as("fecha_ultimo_reporte"),
      })
      .from(pagosCursos)
      .groupBy(
        pagosCursos.idCompra
      )
      .as("pagos_agregados");

    const conditions = [
      inArray(
        estadosCompra.nombre,
        [...ESTADOS_COMPRA]
      ),
    ];

    if (search) {
      const pattern = `%${search}%`;

      conditions.push(
        or(
          sql`${comprasCursos.foliocompra} ILIKE ${pattern}`,
          sql`${cursos.tituloCurso} ILIKE ${pattern}`,
          sql`${usuarios.nombre} ILIKE ${pattern}`,
          sql`${usuarios.apellidoPaterno} ILIKE ${pattern}`,
          sql`${usuarios.apellidoMaterno} ILIKE ${pattern}`,
          sql`${usuarios.correo} ILIKE ${pattern}`
        )!
      );
    }

    if (
      filtro === "pendientes_revision"
    ) {
      conditions.push(
        inArray(
          estadosCompra.nombre,
          [...ESTADOS_PENDIENTES_REVISION]
        )
      );
    }

    const estadoFiltro =
      ESTADO_POR_FILTRO[filtro];

    if (estadoFiltro) {
      conditions.push(
        eq(
          estadosCompra.nombre,
          estadoFiltro
        )
      );
    }

    const whereCondition =
      and(...conditions);

    const [conteo] = await db
      .select({
        totalItems:
          count(
            comprasCursos.idcompra
          ),
        pendientesRevision: sql<number>`
          COUNT(*) FILTER (
            WHERE ${estadosCompra.nombre}
              IN (
                'Pago reportado',
                'En validación'
              )
          )::int
        `,
        aprobadas: sql<number>`
          COUNT(*) FILTER (
            WHERE ${estadosCompra.nombre}
              IN (
                'Pago validado',
                'Inscripciones generadas'
              )
          )::int
        `,
        expiradas: sql<number>`
          COUNT(*) FILTER (
            WHERE ${estadosCompra.nombre}
              = 'Expirada'
          )::int
        `,
        montoReportado: sql<string>`
          COALESCE(
            SUM(
              COALESCE(
                ${pagosAgregados.totalReportado},
                '0'
              )::numeric
            ),
            0
          )::text
        `,
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
      .leftJoin(
        pagosAgregados,
        sql`
          ${pagosAgregados.idCompra}
          =
          ${comprasCursos.idcompra}
        `
      )
      .where(whereCondition);

    const totalItems = Number(
      conteo?.totalItems ?? 0
    );

    const totalPages = Math.max(
      1,
      Math.ceil(
        totalItems / pageSize
      )
    );

    const page = Math.min(
      requestedPage,
      totalPages
    );

    const offset =
      (page - 1) * pageSize;

    const filas = await db
      .select({
        idCompra:
          comprasCursos.idcompra,
        folioCompra:
          comprasCursos.foliocompra,
        usuarioId:
          comprasCursos.idusuario,
        compradorNombre: sql<string>`
          TRIM(
            CONCAT(
              ${usuarios.nombre},
              ' ',
              ${usuarios.apellidoPaterno},
              ' ',
              COALESCE(
                ${usuarios.apellidoMaterno},
                ''
              )
            )
          )
        `,
        compradorCorreo:
          usuarios.correo,
        cursoId:
          comprasCursos.idcurso,
        tituloCurso:
          cursos.tituloCurso,
        cantidadCupos:
          comprasCursos.cantidadcupos,
        total:
          comprasCursos.total,
        estado:
          estadosCompra.nombre,
        fechaCompra:
          comprasCursos.fechacompra,
        fechaLimitePago:
          comprasCursos.fechalimitepago,
        cantidadPagos: sql<number>`
          COALESCE(
            ${pagosAgregados.cantidadPagos},
            0
          )::int
        `,
        totalReportado: sql<string>`
          COALESCE(
            ${pagosAgregados.totalReportado},
            '0'
          )::text
        `,
        fechaUltimoReporte:
          pagosAgregados.fechaUltimoReporte,
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
      .leftJoin(
        pagosAgregados,
        sql`
          ${pagosAgregados.idCompra}
          =
          ${comprasCursos.idcompra}
        `
      )
      .where(whereCondition)
      .orderBy(
        asc(sql`
          CASE
            WHEN ${estadosCompra.nombre}
              IN (
                'Pago reportado',
                'En validación'
              )
            THEN 0
            ELSE 1
          END
        `),
        desc(
          pagosAgregados.fechaUltimoReporte
        ),
        desc(
          comprasCursos.fechacompra
        ),
        desc(
          comprasCursos.idcompra
        )
      )
      .limit(pageSize)
      .offset(offset);

    const compras:
      CompraCursoAdminListaItem[] =
      filas.map((fila) => ({
        idCompra:
          idToSafeNumber(
            fila.idCompra,
            "idCompra"
          ),
        folioCompra:
          fila.folioCompra,
        usuarioId:
          fila.usuarioId,
        compradorNombre:
          fila.compradorNombre,
        compradorCorreo:
          fila.compradorCorreo,
        cursoId:
          fila.cursoId,
        tituloCurso:
          fila.tituloCurso,
        cantidadCupos:
          fila.cantidadCupos,
        total:
          fila.total,
        estado:
          fila.estado,
        fechaCompra:
          fechaToString(
            fila.fechaCompra,
            "la fecha de compra"
          ),
        fechaLimitePago:
          fechaToString(
            fila.fechaLimitePago,
            "la fecha límite de pago"
          ),
        cantidadPagos:
          Number(
            fila.cantidadPagos ?? 0
          ),
        totalReportado:
          fila.totalReportado ??
          "0.00",
        fechaUltimoReporte:
          fechaNullableToString(
            fila.fechaUltimoReporte
          ),
      }));

    const response:
      ListarComprasCursosAdminResponse = {
        compras,
        pagination: {
          page,
          pageSize,
          totalItems,
          totalPages,
        },
        resumen: {
          total: totalItems,
          pendientesRevision:
            Number(
              conteo?.pendientesRevision ??
                0
            ),
          aprobadas:
            Number(
              conteo?.aprobadas ?? 0
            ),
          expiradas:
            Number(
              conteo?.expiradas ?? 0
            ),
          montoReportado:
            conteo?.montoReportado ??
            "0.00",
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
  } catch (errorValue: unknown) {
    console.error(
      "Error listando compras administrativas:",
      errorValue
    );

    return NextResponse.json(
      {
        error:
          "Error interno al obtener el historial de compras",
      },
      { status: 500 }
    );
  }
}