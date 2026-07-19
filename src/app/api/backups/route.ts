import { NextResponse } from "next/server";
import { gzipSync } from "node:zlib";

import { requireApiRole } from "@/lib/auth";
import { postgresClient } from "@/lib/db";
import {
  esTipoBackupValido,
  type TipoBackup,
} from "@/lib/backups/backup-config";
import { generarSqlBackup } from "@/lib/backups/sql-generator";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function crearNombreArchivo(tipo: TipoBackup) {
  const fecha = new Date()
    .toISOString()
    .replace(/[:.]/g, "-")
    .slice(0, 19);

  return `backup-${tipo}-${fecha}.sql.gz`;
}

function obtenerTamañoKB(bytes: number) {
  return `${(bytes / 1024).toFixed(2)} KB`;
}

/**
 * Obtiene el historial de respaldos.
 *
 * El contenido BYTEA no se incluye para evitar enviar
 * los archivos completos en la consulta del historial.
 */
export async function GET() {
  const { error } = await requireApiRole("admin");

  if (error) {
    return error;
  }

  try {
    console.log("[BACKUP][GET] Consultando historial");

    const filas = await postgresClient<
      {
        id: number;
        fecha: Date | string;
        tipo: TipoBackup;
        tamaño: string | null;
        estado: string;
        disponible: boolean;
      }[]
    >`
      SELECT
        id,
        fecha,
        tipo,
        "tamaño",
        estado,
        (
          contenido IS NOT NULL
          AND nombre_archivo IS NOT NULL
        ) AS disponible
      FROM auditoria.backups
      ORDER BY fecha DESC
    `;

    const backups = filas.map((fila) => ({
      id: String(fila.id),

      fecha:
        fila.fecha instanceof Date
          ? fila.fecha.toISOString()
          : fila.fecha,

      tipo: fila.tipo,
      tamaño: fila.tamaño ?? "N/A",
      estado: fila.estado,
      disponible: fila.disponible,
    }));

    console.log("[BACKUP][GET] Historial obtenido", {
      total: backups.length,
    });

    return NextResponse.json(
      { backups },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("[BACKUP][GET] Error:", error);

    return NextResponse.json(
      {
        error:
          "Error al obtener el historial de respaldos",
      },
      {
        status: 500,
      }
    );
  }
}

/**
 * Genera un respaldo, lo comprime con GZIP y guarda
 * el archivo completo dentro de auditoria.backups.
 */
export async function POST(request: Request) {
  const { error } = await requireApiRole("admin");

  if (error) {
    return error;
  }

  try {
    const body = await request.json().catch(() => null);
    const tipo = body?.tipo;

    if (!esTipoBackupValido(tipo)) {
      return NextResponse.json(
        {
          error:
            "El tipo debe ser completo o parcial",
        },
        {
          status: 400,
        }
      );
    }

    console.log("[BACKUP][POST] Iniciando respaldo", {
      tipo,
    });

    /*
     * REPEATABLE READ permite que todas las consultas del
     * respaldo vean una versión consistente de los datos.
     *
     * READ ONLY impide modificaciones accidentales durante
     * la generación.
     */
    const resultado = await postgresClient.begin(
      async (sql) => {
        await sql.unsafe(
          [
            "SET TRANSACTION",
            "ISOLATION LEVEL REPEATABLE READ",
            "READ ONLY",
          ].join(" ")
        );

        return generarSqlBackup(sql, tipo);
      }
    );

    const contenidoOriginal = Buffer.from(
      resultado.sql,
      "utf8"
    );

    const contenidoComprimido = gzipSync(
      contenidoOriginal,
      {
        level: 9,
      }
    );

    if (contenidoComprimido.length === 0) {
      throw new Error(
        "El contenido comprimido del respaldo está vacío"
      );
    }

    const nombreArchivo = crearNombreArchivo(tipo);
    const tamaño = obtenerTamañoKB(
      contenidoComprimido.length
    );

    console.log("[BACKUP][POST] Respaldo comprimido", {
      tipo,
      nombreArchivo,
      tamañoOriginalBytes: contenidoOriginal.length,
      tamañoComprimidoBytes:
        contenidoComprimido.length,
      totalTablas: resultado.totalTablas,
      totalRegistros: resultado.totalRegistros,
    });

    const filasInsertadas = await postgresClient<
      {
        id: number;
        fecha: Date | string;
        tipo: TipoBackup;
        tamaño: string;
        estado: string;
      }[]
    >`
      INSERT INTO auditoria.backups (
        tipo,
        "tamaño",
        tamaño_bytes,
        nombre_archivo,
        contenido,
        archivo_url,
        estado
      )
      VALUES (
        ${tipo},
        ${tamaño},
        ${contenidoComprimido.length},
        ${nombreArchivo},
        ${contenidoComprimido},
        ${null},
        ${"exitoso"}
      )
      RETURNING
        id,
        fecha,
        tipo,
        "tamaño",
        estado
    `;

    const respaldo = filasInsertadas[0];

    if (!respaldo) {
      throw new Error(
        "PostgreSQL no devolvió el registro del respaldo"
      );
    }

    console.log("[BACKUP][POST] Respaldo guardado", {
      id: respaldo.id,
      nombreArchivo,
      tamaño,
    });

    /*
     * Ahora el POST devuelve JSON.
     * En el siguiente paso el frontend utilizará el ID
     * para descargarlo desde /api/backups/[id].
     */
    return NextResponse.json(
      {
        success: true,
        message: "Respaldo generado correctamente",

        backup: {
          id: String(respaldo.id),

          fecha:
            respaldo.fecha instanceof Date
              ? respaldo.fecha.toISOString()
              : respaldo.fecha,

          tipo: respaldo.tipo,
          tamaño: respaldo.tamaño,
          estado: respaldo.estado,
          disponible: true,
          nombreArchivo,

          downloadUrl:
            `/api/backups/${respaldo.id}`,
        },

        resumen: {
          totalTablas: resultado.totalTablas,
          totalRegistros: resultado.totalRegistros,
          tamañoOriginalBytes:
            contenidoOriginal.length,
          tamañoComprimidoBytes:
            contenidoComprimido.length,
        },
      },
      {
        status: 201,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("[BACKUP][POST] Error:", error);

    const detalle =
      error instanceof Error
        ? error.message
        : "Error desconocido";

    return NextResponse.json(
      {
        error: "Error al generar el respaldo",
        detail: detalle,
      },
      {
        status: 500,
      }
    );
  }
}