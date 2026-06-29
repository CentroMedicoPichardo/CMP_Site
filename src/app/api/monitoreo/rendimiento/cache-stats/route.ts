// src/app/api/monitoreo/rendimiento/cache-stats/route.ts
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
    const hitResult = await db.execute(sql`
      SELECT
        COALESCE(SUM(heap_blks_hit), 0) AS read_hit,
        COALESCE(SUM(heap_blks_read), 0) AS read_miss
      FROM pg_statio_user_tables
      WHERE schemaname IN ('clinica', 'seguridad', 'academia')
    `);

    const bufferResult = await db.execute(sql`
      SELECT
        current_setting('shared_buffers') AS buffers_total,
        COALESCE(pg_stat_bgwriter.buffers_alloc, 0) AS buffers_used
      FROM pg_stat_bgwriter
      LIMIT 1
    `);

    const hitRows = obtenerFilas(hitResult);
    const bufferRows = obtenerFilas(bufferResult);

    const hitRow = hitRows[0] ?? {};
    const bufferRow = bufferRows[0] ?? {};

    const readHit = numero(hitRow.read_hit);
    const readMiss = numero(hitRow.read_miss);
    const total = readHit + readMiss;

    const hitRatio = total > 0 ? (readHit / total) * 100 : 0;

    return NextResponse.json(
      {
        hit_ratio: Math.round(hitRatio),
        read_hit: readHit,
        read_miss: readMiss,
        buffers_used: numero(bufferRow.buffers_used),
        buffers_total: String(bufferRow.buffers_total ?? "0"),
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Error obteniendo estadísticas de caché:", error);

    return NextResponse.json(
      { error: "Error al obtener estadísticas de caché" },
      { status: 500 }
    );
  }
}