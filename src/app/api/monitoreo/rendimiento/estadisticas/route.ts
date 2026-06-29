// src/app/api/monitoreo/rendimiento/estadisticas/route.ts
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
    const slowQueriesResult = await db.execute(sql`
      SELECT COUNT(*) AS count
      FROM seguridad.monitoreo_rendimiento
      WHERE tiempo_ejecucion_ms > 1000
      AND fecha_hora > NOW() - INTERVAL '1 hour'
    `);

    const unusedIndexesResult = await db.execute(sql`
      SELECT COUNT(*) AS count
      FROM pg_stat_user_indexes
      WHERE idx_scan = 0
    `);

    const fragmentedTablesResult = await db.execute(sql`
      SELECT COUNT(*) AS count
      FROM pg_stat_user_tables
      WHERE n_live_tup > 0
      AND n_dead_tup > n_live_tup * 0.1
    `);

    const cacheStatsResult = await db.execute(sql`
      SELECT
        COALESCE(SUM(heap_blks_hit), 0) AS read_hit,
        COALESCE(SUM(heap_blks_read), 0) AS read_miss
      FROM pg_statio_user_tables
      WHERE schemaname IN ('clinica', 'seguridad', 'academia')
    `);

    const slowQueries = obtenerFilas(slowQueriesResult);
    const unusedIndexes = obtenerFilas(unusedIndexesResult);
    const fragmentedTables = obtenerFilas(fragmentedTablesResult);
    const cacheStats = obtenerFilas(cacheStatsResult);

    const slowCount = numero(slowQueries[0]?.count);
    const unusedCount = numero(unusedIndexes[0]?.count);
    const fragCount = numero(fragmentedTables[0]?.count);

    const readHit = numero(cacheStats[0]?.read_hit);
    const readMiss = numero(cacheStats[0]?.read_miss);
    const totalReads = readHit + readMiss;

    const hitRatio =
      totalReads > 0 ? Math.round((readHit / totalReads) * 100) : 0;

    return NextResponse.json(
      {
        slowQueries: slowCount,
        unusedIndexes: unusedCount,
        fragmentedTables: fragCount,
        cacheHitRatio: hitRatio,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Error en estadísticas de rendimiento:", error);

    return NextResponse.json(
      { error: "Error al obtener estadísticas de rendimiento" },
      { status: 500 }
    );
  }
}