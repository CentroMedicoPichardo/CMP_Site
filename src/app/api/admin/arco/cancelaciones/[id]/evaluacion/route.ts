
import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

import { requireApiRole } from "@/lib/auth";
import { db, postgresClient } from "@/lib/db";
import { preguntasUsuarios } from "@/lib/schema";

const TITULO_ARCO =
  "Solicitud ARCO - Eliminacion de cuenta";

type Contexto = {
  params: Promise<{ id: string }>;
};

type Referencia = {
  esquema: string;
  tabla: string;
  columna: string;
  regla: string;
  registros: number;
  tratamientoAlBorrar: string;
};

/**
 * Protege nombres de tablas y columnas
 * recibidos del catálogo de PostgreSQL.
 *
 * Los valores del usuario nunca se
 * concatenan directamente en SQL.
 */
function citarIdentificador(valor: string): string {
  return `"${valor.replace(/"/g, '""')}"`;
}

function interpretarRegla(regla: string): string {
  switch (regla) {
    case "c":
      return "CASCADE: podría borrar registros relacionados";

    case "n":
      return "SET NULL: desvincula los registros";

    case "d":
      return "SET DEFAULT: utiliza el valor predeterminado";

    case "r":
      return "RESTRICT: impide el borrado si existen referencias";

    case "a":
      return "NO ACTION: puede impedir el borrado";

    default:
      return "Regla de eliminación no reconocida";
  }
}

/**
 * A17 - Evaluación avanzada de Cancelación.
 *
 * Revisa las claves foráneas que apuntan
 * directamente a seguridad.usuarios.
 *
 * Solo permite consultas administrativas.
 *
 * No modifica ni elimina información.
 */
export async function GET(
  _request: Request,
  { params }: Contexto
) {
  const { session, error } =
    await requireApiRole("admin");

  if (error) {
    return error;
  }

  if (!session) {
    return NextResponse.json(
      { message: "No autenticado" },
      { status: 401 }
    );
  }

  const { id } = await params;
  const solicitudId = Number(id);

  if (
    !Number.isSafeInteger(solicitudId) ||
    solicitudId <= 0
  ) {
    return NextResponse.json(
      { message: "Identificador inválido" },
      { status: 400 }
    );
  }

  try {
    const [solicitud] = await db
      .select({
        solicitudId: preguntasUsuarios.idPregunta,
        usuarioId: preguntasUsuarios.idUsuario,
        estado: preguntasUsuarios.estado,
      })
      .from(preguntasUsuarios)
      .where(
        and(
          eq(preguntasUsuarios.idPregunta, solicitudId),
          eq(preguntasUsuarios.titulo, TITULO_ARCO),
          eq(preguntasUsuarios.esPrivada, true)
        )
      )
      .limit(1);

    if (!solicitud) {
      return NextResponse.json(
        { message: "Solicitud ARCO no encontrada" },
        { status: 404 }
      );
    }

    /*
     * Consultamos las relaciones reales
     * de PostgreSQL, no solamente las
     * declaradas en el esquema de Drizzle.
     *
     * Se consideran claves foráneas
     * simples hacia seguridad.usuarios.
     */
    const relaciones = await postgresClient`
      SELECT
        n.nspname AS esquema,
        c.relname AS tabla,
        a.attname AS columna,
        k.confdeltype AS regla
      FROM pg_constraint AS k

      JOIN pg_class AS c
        ON c.oid = k.conrelid

      JOIN pg_namespace AS n
        ON n.oid = c.relnamespace

      JOIN pg_attribute AS a
        ON a.attrelid = k.conrelid
        AND a.attnum = k.conkey[1]

      WHERE
        k.contype = 'f'
        AND k.confrelid =
          'seguridad.usuarios'::regclass
        AND cardinality(k.conkey) = 1
        AND cardinality(k.confkey) = 1

      ORDER BY
        n.nspname,
        c.relname,
        a.attname
    `;

    const referencias: Referencia[] = [];

    /*
     * Evaluamos las relaciones en grupos
     * pequeños para no lanzar demasiadas
     * consultas simultáneas.
     */
    for (let i = 0; i < relaciones.length; i += 5) {
      const grupo = relaciones.slice(i, i + 5);

      const resultados = await Promise.all(
        grupo.map(async (relacion) => {
          const esquema = String(relacion.esquema);
          const tabla = String(relacion.tabla);
          const columna = String(relacion.columna);
          const regla = String(relacion.regla);

          const consulta = `
            SELECT COUNT(*)::int AS total
            FROM ${citarIdentificador(esquema)}.${citarIdentificador(tabla)}
            WHERE ${citarIdentificador(columna)} = $1
          `;

          const filas = await postgresClient.unsafe(
            consulta,
            [solicitud.usuarioId]
          );

          return {
            esquema,
            tabla,
            columna,
            regla,
            registros: Number(filas[0]?.total ?? 0),
            tratamientoAlBorrar:
              interpretarRegla(regla),
          };
        })
      );

      referencias.push(...resultados);
    }

    const referenciasConRegistros =
      referencias.filter(
        (referencia) => referencia.registros > 0
      );

    return NextResponse.json(
      {
        solicitud: {
          id: solicitud.solicitudId,
          usuarioId: solicitud.usuarioId,
          estado: solicitud.estado,
        },

        resumen: {
          relacionesDetectadas: referencias.length,
          relacionesConRegistros:
            referenciasConRegistros.length,
          referenciasSinRegistros:
            referencias.length -
            referenciasConRegistros.length,
        },

        referencias,

        evaluacion: {
          eliminacionPermitida: false,
          eliminacionEjecutada: false,
          requiereRevision: true,

          observaciones: [
            "Los resultados muestran relaciones directas mediante claves foráneas simples.",
            "Pueden existir datos personales en tablas sin claves foráneas o relacionados indirectamente.",
            "Los conteos representan el estado de la base de datos al momento de consultar.",
            "No se autorizan eliminaciones automáticas.",
          ],
        },
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (errorConsulta) {
    console.error(
      "Error evaluando dependencias ARCO:",
      errorConsulta
    );

    return NextResponse.json(
      {
        message:
          "No fue posible completar la evaluación de dependencias",
      },
      { status: 500 }
    );
  }
}
