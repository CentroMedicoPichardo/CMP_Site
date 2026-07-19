import { NextResponse } from "next/server";

import { requireApiRole } from "@/lib/auth";
import { postgresClient } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function validarId(id: string) {
  if (!/^\d+$/.test(id)) {
    return null;
  }

  const idBackup = Number(id);

  return Number.isSafeInteger(idBackup) && idBackup > 0
    ? idBackup
    : null;
}

function obtenerNombreArchivoSeguro(
  nombreArchivo: unknown,
  idBackup: number
) {
  if (
    typeof nombreArchivo !== "string" ||
    !nombreArchivo.trim()
  ) {
    return `backup-${idBackup}.sql.gz`;
  }

  const nombre = nombreArchivo.trim();

  /*
   * Solamente permitimos nombres de archivo simples.
   * No se permiten carpetas, rutas relativas ni caracteres
   * que puedan modificar los encabezados HTTP.
   */
  if (
    !/^[a-zA-Z0-9._-]+\.sql\.gz$/i.test(nombre)
  ) {
    return `backup-${idBackup}.sql.gz`;
  }

  return nombre;
}

/**
 * Descarga el respaldo comprimido almacenado dentro
 * de auditoria.backups.contenido.
 */
export async function GET(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
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
        {
          error: "ID de respaldo inválido",
        },
        {
          status: 400,
        }
      );
    }

    console.log("[BACKUP][DOWNLOAD] Buscando respaldo", {
      idBackup,
    });

    const filas = await postgresClient<
      {
        id: number;
        nombre_archivo: string | null;
        contenido: Uint8Array | null;
        estado: string;
        tamaño_bytes: number | string | null;
      }[]
    >`
      SELECT
        id,
        nombre_archivo,
        contenido,
        estado,
        tamaño_bytes
      FROM auditoria.backups
      WHERE id = ${idBackup}
      LIMIT 1
    `;

    const respaldo = filas[0];

    if (!respaldo) {
      return NextResponse.json(
        {
          error: "Respaldo no encontrado",
        },
        {
          status: 404,
        }
      );
    }

    if (respaldo.estado !== "exitoso") {
      return NextResponse.json(
        {
          error:
            "El respaldo no se encuentra disponible para descargar",
          estado: respaldo.estado,
        },
        {
          status: 409,
        }
      );
    }

    /*
     * Los respaldos antiguos solamente tienen archivo_url,
     * pero no contienen los bytes dentro de PostgreSQL.
     */
    if (
      !respaldo.contenido ||
      respaldo.contenido.byteLength === 0
    ) {
      return NextResponse.json(
        {
          error:
            "El archivo de este respaldo no está disponible",
          detail:
            "Este registro pertenece al sistema anterior o no contiene el archivo guardado.",
        },
        {
          status: 410,
        }
      );
    }

    const nombreArchivo = obtenerNombreArchivoSeguro(
      respaldo.nombre_archivo,
      idBackup
    );

    const contenido = Buffer.from(respaldo.contenido);

    console.log("[BACKUP][DOWNLOAD] Descargando", {
      idBackup,
      nombreArchivo,
      tamañoBytes: contenido.length,
    });

    /*
     * No se agrega Content-Encoding: gzip porque queremos
     * que el navegador descargue el archivo .gz sin
     * descomprimirlo automáticamente.
     */
    return new NextResponse(
      new Uint8Array(contenido),
      {
        status: 200,
        headers: {
          "Content-Type": "application/gzip",
          "Content-Disposition":
            `attachment; filename="${nombreArchivo}"`,
          "Content-Length": String(contenido.length),
          "Cache-Control":
            "private, no-store, no-cache, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
          "X-Content-Type-Options": "nosniff",
        },
      }
    );
  } catch (error) {
    console.error("[BACKUP][DOWNLOAD] Error:", error);

    const detalle =
      error instanceof Error
        ? error.message
        : "Error desconocido";

    return NextResponse.json(
      {
        error: "Error al descargar el respaldo",
        detail: detalle,
      },
      {
        status: 500,
      }
    );
  }
}

/**
 * Elimina completamente el respaldo.
 *
 * Como el archivo está dentro de PostgreSQL, eliminar el
 * registro también elimina su contenido BYTEA.
 */
export async function DELETE(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
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
        {
          error: "ID de respaldo inválido",
        },
        {
          status: 400,
        }
      );
    }

    console.log("[BACKUP][DELETE] Eliminando respaldo", {
      idBackup,
    });

    const filasEliminadas = await postgresClient<
      {
        id: number;
        nombre_archivo: string | null;
        disponible: boolean;
      }[]
    >`
      DELETE FROM auditoria.backups
      WHERE id = ${idBackup}
      RETURNING
        id,
        nombre_archivo,
        contenido IS NOT NULL AS disponible
    `;

    const respaldoEliminado = filasEliminadas[0];

    if (!respaldoEliminado) {
      return NextResponse.json(
        {
          error: "Respaldo no encontrado",
        },
        {
          status: 404,
        }
      );
    }

    console.log("[BACKUP][DELETE] Respaldo eliminado", {
      idBackup: respaldoEliminado.id,
      nombreArchivo:
        respaldoEliminado.nombre_archivo,
      conteníaArchivo:
        respaldoEliminado.disponible,
    });

    return NextResponse.json({
      success: true,
      message: "Respaldo eliminado correctamente",
      backup: {
        id: String(respaldoEliminado.id),
        nombreArchivo:
          respaldoEliminado.nombre_archivo,
      },
    });
  } catch (error) {
    console.error("[BACKUP][DELETE] Error:", error);

    const detalle =
      error instanceof Error
        ? error.message
        : "Error desconocido";

    return NextResponse.json(
      {
        error: "Error al eliminar el respaldo",
        detail: detalle,
      },
      {
        status: 500,
      }
    );
  }
}