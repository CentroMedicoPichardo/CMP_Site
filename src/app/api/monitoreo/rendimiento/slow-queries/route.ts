// src/app/api/monitoreo/rendimiento/slow-queries/route.ts
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

function fechaISO(valor: unknown) {
  if (!valor) {
    return new Date().toISOString();
  }

  const fecha = new Date(String(valor));

  if (Number.isNaN(fecha.getTime())) {
    return new Date().toISOString();
  }

  return fecha.toISOString();
}

export async function GET() {
  const { error } = await requireApiRole("admin");

  if (error) {
    return error;
  }

  try {
    const result = await db.execute(sql`
      SELECT
        pid,
        usename AS usuario,
        LEFT(query, 200) AS query,
        EXTRACT(EPOCH FROM (NOW() - query_start)) * 1000 AS tiempo_ejecucion,
        query_start AS fecha
      FROM pg_stat_activity
      WHERE datname = current_database()
      AND state = 'active'
      AND pid != pg_backend_pid()
      AND EXTRACT(EPOCH FROM (NOW() - query_start)) > 1
      AND query NOT ILIKE '%pg_stat_activity%'
      ORDER BY tiempo_ejecucion DESC
      LIMIT 10
    `);

    const rows = obtenerFilas(result);

    const queries = rows.map((row) => ({
      pid: numero(row.pid),
      usuario: String(row.usuario ?? "desconocido"),
      query: String(row.query ?? "Sin consulta"),
      tiempo_ejecucion: Math.round(numero(row.tiempo_ejecucion)),
      fecha: fechaISO(row.fecha),
      plan: "EXPLAIN ANALYZE pendiente",
    }));

    return NextResponse.json(queries, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error obteniendo consultas lentas:", error);

    return NextResponse.json(
      { error: "Error al obtener consultas lentas" },
      { status: 500 }
    );
  }
}