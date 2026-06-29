// src/app/api/monitoreo/rendimiento/estado-db/route.ts
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

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 Bytes";
  }

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.min(
    Math.floor(Math.log(bytes) / Math.log(k)),
    sizes.length - 1
  );

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export async function GET() {
  const { error } = await requireApiRole("admin");

  if (error) {
    return error;
  }

  try {
    const tableCountResult = await db.execute(sql`
      SELECT COUNT(*) AS count
      FROM information_schema.tables
      WHERE table_schema IN ('clinica', 'seguridad', 'academia')
      AND table_type = 'BASE TABLE'
    `);

    const indexCountResult = await db.execute(sql`
      SELECT COUNT(*) AS count
      FROM pg_indexes
      WHERE schemaname IN ('clinica', 'seguridad', 'academia')
    `);

    const tableSizesResult = await db.execute(sql`
      SELECT
        schemaname,
        tablename,
        COALESCE(n_live_tup, 0) AS rows,
        pg_size_pretty(
          pg_total_relation_size(
            (quote_ident(schemaname) || '.' || quote_ident(tablename))::regclass
          )
        ) AS total_size,
        pg_size_pretty(
          pg_relation_size(
            (quote_ident(schemaname) || '.' || quote_ident(tablename))::regclass
          )
        ) AS data_size,
        pg_size_pretty(
          pg_indexes_size(
            (quote_ident(schemaname) || '.' || quote_ident(tablename))::regclass
          )
        ) AS index_size
      FROM pg_stat_user_tables
      WHERE schemaname IN ('clinica', 'seguridad', 'academia')
      ORDER BY pg_total_relation_size(
        (quote_ident(schemaname) || '.' || quote_ident(tablename))::regclass
      ) DESC
    `);

    const dbSizeResult = await db.execute(sql`
      SELECT pg_database_size(current_database()) AS size
    `);

    const totalRecordsResult = await db.execute(sql`
      SELECT COALESCE(SUM(n_live_tup), 0) AS total
      FROM pg_stat_user_tables
      WHERE schemaname IN ('clinica', 'seguridad', 'academia')
    `);

    const tableCountRows = obtenerFilas(tableCountResult);
    const indexCountRows = obtenerFilas(indexCountResult);
    const tableSizesRows = obtenerFilas(tableSizesResult);
    const dbSizeRows = obtenerFilas(dbSizeResult);
    const totalRecordsRows = obtenerFilas(totalRecordsResult);

    const tableCount = numero(tableCountRows[0]?.count);
    const indexCount = numero(indexCountRows[0]?.count);
    const dbSizeBytes = numero(dbSizeRows[0]?.size);
    const totalRecords = numero(totalRecordsRows[0]?.total);

    const tables = tableSizesRows.map((row) => ({
      table: String(row.tablename ?? "desconocido"),
      schema: String(row.schemaname ?? "desconocido"),
      rows: numero(row.rows),
      data_size: String(row.data_size ?? "0 bytes"),
      index_size: String(row.index_size ?? "0 bytes"),
      total_size: String(row.total_size ?? "0 bytes"),
    }));

    return NextResponse.json(
      {
        databaseSize: formatBytes(dbSizeBytes),
        tableCount,
        totalRecords,
        indexCount,
        tables,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Error obteniendo estado de la BD:", error);

    return NextResponse.json(
      { error: "Error al obtener estado de la base de datos" },
      { status: 500 }
    );
  }
}