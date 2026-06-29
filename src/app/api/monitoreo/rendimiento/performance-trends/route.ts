// src/app/api/monitoreo/rendimiento/performance-trends/route.ts
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
        DATE_TRUNC('hour', fecha_hora) AS hora,
        COALESCE(AVG(tiempo_ejecucion_ms), 0) AS tiempo_promedio,
        COUNT(*) AS total_consultas,
        COUNT(CASE WHEN tiempo_ejecucion_ms > 1000 THEN 1 END) AS consultas_lentas
      FROM seguridad.monitoreo_rendimiento
      WHERE fecha_hora > NOW() - INTERVAL '24 hours'
      GROUP BY DATE_TRUNC('hour', fecha_hora)
      ORDER BY hora DESC
      LIMIT 24
    `);

    const rows = obtenerFilas(result);

    const trends = rows
      .map((row) => ({
        hora: fechaISO(row.hora),
        tiempo_promedio: Math.round(numero(row.tiempo_promedio)),
        total_consultas: numero(row.total_consultas),
        consultas_lentas: numero(row.consultas_lentas),
      }))
      .reverse();

    return NextResponse.json(trends, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error obteniendo tendencias:", error);

    return NextResponse.json(
      { error: "Error al obtener tendencias de rendimiento" },
      { status: 500 }
    );
  }
}