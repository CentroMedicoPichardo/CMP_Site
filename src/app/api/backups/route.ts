// src/app/api/backups/route.ts
import { NextResponse } from "next/server";
import { Pool } from "pg";
import { writeFileSync, mkdirSync } from "fs";
import path from "path";
import { execFile } from "child_process";
import { promisify } from "util";
import { requireApiRole } from "@/lib/auth";

export const runtime = "nodejs";

const execFileAsync = promisify(execFile);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

type TipoBackup = "completo" | "parcial";

function esTipoBackupValido(tipo: unknown): tipo is TipoBackup {
  return tipo === "completo" || tipo === "parcial";
}

function crearNombreArchivo(tipo: TipoBackup) {
  const fecha = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  return `backup-${tipo}-${fecha}.sql`;
}

function obtenerDirectorioBackups() {
  return path.join(process.cwd(), "storage", "backups");
}

function obtenerTamañoKB(contenido: string) {
  return `${(Buffer.byteLength(contenido, "utf8") / 1024).toFixed(2)} KB`;
}

export async function GET() {
  const { error } = await requireApiRole("admin");

  if (error) {
    return error;
  }

  try {
    const result = await pool.query(
      `
      SELECT id, fecha, tipo, tamaño, estado
      FROM auditoria.backups
      ORDER BY fecha DESC
      `
    );

    const backups = result.rows.map((row) => ({
      id: String(row.id),
      fecha: row.fecha instanceof Date ? row.fecha.toISOString() : row.fecha,
      tipo: row.tipo,
      tamaño: row.tamaño || "N/A",
      estado: row.estado,
    }));

    return NextResponse.json(
      { backups },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Error en GET backups:", error);

    return NextResponse.json(
      { error: "Error al obtener historial de respaldos" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { error } = await requireApiRole("admin");

  if (error) {
    return error;
  }

  try {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      return NextResponse.json(
        { error: "La conexión a la base de datos no está configurada" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const tipo = body?.tipo;

    if (!esTipoBackupValido(tipo)) {
      return NextResponse.json(
        { error: "Tipo de respaldo inválido" },
        { status: 400 }
      );
    }

    const pgDumpArgs = [
      "--clean",
      "--if-exists",
      "--no-owner",
      "--no-privileges",
    ];

    if (tipo === "parcial") {
      const client = await pool.connect();

      try {
        const tablasExcluidas = await client.query(
          `
          SELECT tablename
          FROM pg_tables
          WHERE schemaname = 'public'
          AND tablename IN ('logs', 'auditoria', 'sesiones')
          `
        );

        for (const row of tablasExcluidas.rows) {
          if (typeof row.tablename === "string" && row.tablename.trim()) {
            pgDumpArgs.push(`--exclude-table=public.${row.tablename}`);
          }
        }
      } finally {
        client.release();
      }
    }

    pgDumpArgs.push(databaseUrl);

    const { stdout, stderr } = await execFileAsync("pg_dump", pgDumpArgs, {
      maxBuffer: 50 * 1024 * 1024,
    });

    if (stderr) {
      console.warn("pg_dump terminó con advertencias");
    }

    const sqlDump = stdout;

    if (!sqlDump || !sqlDump.trim()) {
      return NextResponse.json(
        { error: "No se pudo generar el respaldo" },
        { status: 500 }
      );
    }

    const backupDir = obtenerDirectorioBackups();
    mkdirSync(backupDir, { recursive: true });

    const fileName = crearNombreArchivo(tipo);
    const filePath = path.join(backupDir, fileName);

    writeFileSync(filePath, sqlDump, "utf8");

    const tamañoKB = obtenerTamañoKB(sqlDump);

    const insertRes = await pool.query(
      `
      INSERT INTO auditoria.backups (tipo, tamaño, archivo_url, estado)
      VALUES ($1, $2, $3, $4)
      RETURNING id
      `,
      [tipo, tamañoKB, `backups/${fileName}`, "completado"]
    );

    const backupId = insertRes.rows[0]?.id;

    if (!backupId) {
      return NextResponse.json(
        { error: "No se pudo registrar el respaldo" },
        { status: 500 }
      );
    }

    return new NextResponse(Buffer.from(sqlDump, "utf8"), {
      headers: {
        "Content-Disposition": `attachment; filename="backup-${backupId}.sql"`,
        "Content-Type": "application/sql; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error en POST backups:", error);

    return NextResponse.json(
      { error: "Error al generar respaldo" },
      { status: 500 }
    );
  }
}