// src/app/api/monitoreo/rendimiento/unused-indexes/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
import { requireApiRole } from "@/lib/auth";

type DbRow = Record<string, unknown>;

function obtenerFilas(resultado: unknown): DbRow[] {
  if (Array.isArray(resultado)) {
    return resultado as DbRow[];
  }

  if (
    resultado &&
    typeof resultado === "object" &&
    "rows" in resultado &&
    Array.isArray((resultado as { rows?: unknown }).rows)
  ) {
    return (resultado as { rows: DbRow[] }).rows;
  }

  return [];
}

function numero(valor: unknown) {
  const convertido = Number(valor);
  return Number.isFinite(convertido) ? convertido : 0;
}

export async function GET() {
  const { error } = await requireApiRole("admin");

  if (error) {
    return error;
  }

  try {
    const result = await db.execute(sql`
      SELECT
        schemaname,
        relname AS tablename,
        indexrelname AS indexname,
        pg_size_pretty(pg_relation_size(indexrelid)) AS index_size,
        idx_scan
      FROM pg_stat_user_indexes
      WHERE idx_scan = 0
      AND schemaname IN ('clinica', 'seguridad', 'academia')
      ORDER BY pg_relation_size(indexrelid) DESC
      LIMIT 20
    `);

    const rows = obtenerFilas(result);

    const indexes = rows.map((row) => ({
      schemaname: String(row.schemaname ?? ""),
      tablename: String(row.tablename ?? ""),
      indexname: String(row.indexname ?? ""),
      index_size: String(row.index_size ?? "0 bytes"),
      idx_scan: numero(row.idx_scan),
    }));

    return NextResponse.json(indexes, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error obteniendo índices no utilizados:", error);

    return NextResponse.json(
      { error: "Error al obtener índices no utilizados" },
      { status: 500 }
    );
  }
}