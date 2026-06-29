// src/app/api/monitoreo/rendimiento/fragmentation/route.ts
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

function formatearFecha(valor: unknown) {
  if (!valor) {
    return "Nunca";
  }

  const fecha = new Date(String(valor));

  if (Number.isNaN(fecha.getTime())) {
    return "Nunca";
  }

  return fecha.toLocaleDateString("es-MX");
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
        tablename,
        COALESCE(n_live_tup, 0) AS live_tuples,
        COALESCE(n_dead_tup, 0) AS dead_tuples,
        CASE
          WHEN n_live_tup > 0 THEN (n_dead_tup::float / n_live_tup) * 100
          ELSE 0
        END AS dead_ratio,
        last_vacuum,
        last_autovacuum
      FROM pg_stat_user_tables
      WHERE schemaname IN ('clinica', 'seguridad', 'academia')
      AND n_dead_tup > 0
      ORDER BY dead_ratio DESC
      LIMIT 20
    `);

    const rows = obtenerFilas(result);

    const tables = rows.map((row) => ({
      schemaname: String(row.schemaname ?? ""),
      tablename: String(row.tablename ?? ""),
      live_tuples: numero(row.live_tuples),
      dead_tuples: numero(row.dead_tuples),
      dead_ratio: numero(row.dead_ratio),
      last_vacuum: formatearFecha(row.last_vacuum),
      last_autovacuum: formatearFecha(row.last_autovacuum),
    }));

    return NextResponse.json(tables, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error obteniendo fragmentación:", error);

    return NextResponse.json(
      { error: "Error al obtener fragmentación de tablas" },
      { status: 500 }
    );
  }
}