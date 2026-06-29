// src/app/api/backups/[id]/route.ts
import { NextResponse } from "next/server";
import { Pool } from "pg";
import { existsSync, readFileSync, unlinkSync } from "fs";
import path from "path";
import { requireApiRole } from "@/lib/auth";

export const runtime = "nodejs";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

function validarId(id: string) {
  const idBackup = Number(id);
  return Number.isInteger(idBackup) && idBackup > 0 ? idBackup : null;
}

function obtenerNombreArchivoSeguro(archivoUrl: unknown) {
  if (typeof archivoUrl !== "string" || !archivoUrl.trim()) {
    return null;
  }

  const nombreArchivo = path.basename(archivoUrl);

  if (!nombreArchivo || nombreArchivo.includes("..")) {
    return null;
  }

  if (!nombreArchivo.endsWith(".sql")) {
    return null;
  }

  return nombreArchivo;
}

function obtenerRutaSegura(nombreArchivo: string) {
  const backupDir = path.resolve(process.cwd(), "storage", "backups");
  const fullPath = path.resolve(backupDir, nombreArchivo);

  if (!fullPath.startsWith(backupDir)) {
    return null;
  }

  return fullPath;
}

function obtenerRutaLegacy(nombreArchivo: string) {
  const legacyDir = path.resolve(process.cwd(), "public", "backups");
  const fullPath = path.resolve(legacyDir, nombreArchivo);

  if (!fullPath.startsWith(legacyDir)) {
    return null;
  }

  return fullPath;
}

async function obtenerBackupPorId(idBackup: number) {
  const result = await pool.query(
    `
    SELECT id, archivo_url
    FROM auditoria.backups
    WHERE id = $1
    LIMIT 1
    `,
    [idBackup]
  );

  return result.rows[0] ?? null;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireApiRole("admin");

  if (error) {
    return error;
  }

  try {
    const { id } = await params;
    const idBackup = validarId(id);

    if (!idBackup) {
      return NextResponse.json(
        { error: "ID de respaldo inválido" },
        { status: 400 }
      );
    }

    const backup = await obtenerBackupPorId(idBackup);

    if (!backup) {
      return NextResponse.json(
        { error: "Respaldo no encontrado" },
        { status: 404 }
      );
    }

    const nombreArchivo = obtenerNombreArchivoSeguro(backup.archivo_url);

    if (!nombreArchivo) {
      return NextResponse.json(
        { error: "Archivo de respaldo inválido" },
        { status: 400 }
      );
    }

    const rutaPrincipal = obtenerRutaSegura(nombreArchivo);
    const rutaLegacy = obtenerRutaLegacy(nombreArchivo);

    const rutaArchivo =
      rutaPrincipal && existsSync(rutaPrincipal)
        ? rutaPrincipal
        : rutaLegacy && existsSync(rutaLegacy)
          ? rutaLegacy
          : null;

    if (!rutaArchivo) {
      return NextResponse.json(
        { error: "Archivo de respaldo no encontrado" },
        { status: 404 }
      );
    }

    const fileContent = readFileSync(rutaArchivo);

    return new NextResponse(new Uint8Array(fileContent), {
      headers: {
        "Content-Disposition": `attachment; filename="backup-${idBackup}.sql"`,
        "Content-Type": "application/sql; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error en GET backup:", error);

    return NextResponse.json(
      { error: "Error al descargar el respaldo" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireApiRole("admin");

  if (error) {
    return error;
  }

  try {
    const { id } = await params;
    const idBackup = validarId(id);

    if (!idBackup) {
      return NextResponse.json(
        { error: "ID de respaldo inválido" },
        { status: 400 }
      );
    }

    const backup = await obtenerBackupPorId(idBackup);

    if (!backup) {
      return NextResponse.json(
        { error: "Respaldo no encontrado" },
        { status: 404 }
      );
    }

    const nombreArchivo = obtenerNombreArchivoSeguro(backup.archivo_url);

    if (nombreArchivo) {
      const rutaPrincipal = obtenerRutaSegura(nombreArchivo);
      const rutaLegacy = obtenerRutaLegacy(nombreArchivo);

      for (const ruta of [rutaPrincipal, rutaLegacy]) {
        if (ruta && existsSync(ruta)) {
          try {
            unlinkSync(ruta);
          } catch {
            console.warn("No se pudo eliminar físicamente un archivo de respaldo");
          }
        }
      }
    }

    await pool.query(
      `
      DELETE FROM auditoria.backups
      WHERE id = $1
      `,
      [idBackup]
    );

    return NextResponse.json({
      success: true,
      message: "Respaldo eliminado correctamente",
    });
  } catch (error) {
    console.error("Error en DELETE backup:", error);

    return NextResponse.json(
      { error: "Error al eliminar el respaldo" },
      { status: 500 }
    );
  }
}