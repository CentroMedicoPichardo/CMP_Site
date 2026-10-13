
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

function responder(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

/**
 * A17 - Diagnóstico de impacto indirecto.
 *
 * Identifica registros académicos,
 * participantes compartidos y referencias
 * a archivos relacionados con una cuenta.
 *
 * No modifica ni elimina información.
 */
export async function GET(
  _request: Request,
  { params }: Contexto
) {
  const { session, error } =
    await requireApiRole("admin");

  if (error) return error;

  if (!session) {
    return responder(
      { message: "No autenticado" },
      401
    );
  }

  const { id } = await params;
  const solicitudId = Number(id);

  if (
    !Number.isSafeInteger(solicitudId) ||
    solicitudId <= 0
  ) {
    return responder(
      { message: "Identificador inválido" },
      400
    );
  }

  try {
    const [solicitud] = await db
      .select({
        id: preguntasUsuarios.idPregunta,
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
      return responder(
        { message: "Solicitud ARCO no encontrada" },
        404
      );
    }

    const usuarioId = solicitud.usuarioId;

    /*
     * Agrupamos compras, inscripciones
     * y participantes vinculados.
     *
     * También se consideran relaciones
     * indirectas mediante compra_participantes.
     */
    const [resultado] = await postgresClient`
      WITH compras_usuario AS (
        SELECT c.idcompra
        FROM academia.comprascursosinacademia c
        WHERE c.idusuario = ${usuarioId}
      ),

      inscripciones_usuario AS (
        SELECT i.id_inscripcion
        FROM academia.inscripciones_cursos i
        WHERE
          i.usuario_id = ${usuarioId}
          OR EXISTS (
            SELECT 1
            FROM academia.compra_participantes cp
            INNER JOIN compras_usuario cu
              ON cu.idcompra = cp.id_compra
            WHERE
              cp.id_compra_participante =
                i.compra_participante_id
          )
      ),

      participantes_usuario AS (
        SELECT p.id_participante
        FROM academia.participantes p
        WHERE
          p.usuario_id = ${usuarioId}
          OR EXISTS (
            SELECT 1
            FROM academia.compra_participantes cp
            INNER JOIN compras_usuario cu
              ON cu.idcompra = cp.id_compra
            WHERE
              cp.id_participante =
                p.id_participante
          )
      )

      SELECT
        (
          SELECT COUNT(*)::int
          FROM compras_usuario
        ) AS "compras",

        (
          SELECT COUNT(*)::int
          FROM academia.pagos_cursos p
          WHERE p.id_compra IN (
            SELECT idcompra FROM compras_usuario
          )
        ) AS "pagos",

        (
          SELECT COUNT(*)::int
          FROM inscripciones_usuario
        ) AS "inscripciones",

        (
          SELECT COUNT(*)::int
          FROM participantes_usuario
        ) AS "participantes",

        (
          SELECT COUNT(*)::int
          FROM academia.asistencias_curso a
          WHERE a.inscripcion_id IN (
            SELECT id_inscripcion
            FROM inscripciones_usuario
          )
        ) AS "asistencias",

        (
          SELECT COUNT(*)::int
          FROM academia.progreso_curso p
          WHERE p.inscripcion_id IN (
            SELECT id_inscripcion
            FROM inscripciones_usuario
          )
        ) AS "progreso",

        (
          SELECT COUNT(*)::int
          FROM academia.resultados_evaluaciones r
          WHERE r.inscripcion_id IN (
            SELECT id_inscripcion
            FROM inscripciones_usuario
          )
        ) AS "evaluaciones",

        (
          SELECT COUNT(*)::int
          FROM academia.certificados_curso c
          WHERE c.inscripcion_id IN (
            SELECT id_inscripcion
            FROM inscripciones_usuario
          )
        ) AS "certificados",

        (
          SELECT COUNT(*)::int
          FROM academia.notificaciones_academicas n
          WHERE n.inscripcion_id IN (
            SELECT id_inscripcion
            FROM inscripciones_usuario
          )
        ) AS "notificaciones",

        (
          SELECT COUNT(*)::int
          FROM academia.pagos_cursos p
          WHERE
            p.id_compra IN (
              SELECT idcompra
              FROM compras_usuario
            )
            AND NULLIF(
              BTRIM(p.ruta_comprobante),
              ''
            ) IS NOT NULL
        ) AS "comprobantesPago",

        (
          SELECT COUNT(*)::int
          FROM academia.certificados_curso c
          WHERE
            c.inscripcion_id IN (
              SELECT id_inscripcion
              FROM inscripciones_usuario
            )
            AND NULLIF(
              BTRIM(c.ruta_archivo),
              ''
            ) IS NOT NULL
        ) AS "archivosCertificado",

        (
          SELECT COUNT(*)::int
          FROM academia.resultados_evaluaciones r
          WHERE
            r.inscripcion_id IN (
              SELECT id_inscripcion
              FROM inscripciones_usuario
            )
            AND NULLIF(
              BTRIM(r.evidencia_url),
              ''
            ) IS NOT NULL
        ) AS "evidenciasEvaluacion",

        (
          SELECT COUNT(*)::int
          FROM academia.asistencias_curso a
          WHERE
            a.inscripcion_id IN (
              SELECT id_inscripcion
              FROM inscripciones_usuario
            )
            AND NULLIF(
              BTRIM(a.comprobante_justificacion),
              ''
            ) IS NOT NULL
        ) AS "evidenciasAsistencia",

        (
          SELECT COUNT(DISTINCT p.id_participante)::int
          FROM participantes_usuario p

          INNER JOIN academia.compra_participantes cp
            ON cp.id_participante =
              p.id_participante

          INNER JOIN academia.comprascursosinacademia c
            ON c.idcompra = cp.id_compra

          WHERE c.idusuario <> ${usuarioId}
        ) AS "participantesCompartidos"
    `;

    const numero = (campo: string): number => {
      return Number(resultado?.[campo] ?? 0);
    };

    return responder({
      solicitud: {
        id: solicitud.id,
        usuarioId,
        estado: solicitud.estado,
      },

      registros: {
        compras: numero("compras"),
        pagos: numero("pagos"),
        inscripciones: numero("inscripciones"),
        participantes: numero("participantes"),
        asistencias: numero("asistencias"),
        progreso: numero("progreso"),
        evaluaciones: numero("evaluaciones"),
        certificados: numero("certificados"),
        notificaciones: numero("notificaciones"),
      },

      archivosReferenciados: {
        comprobantesPago: numero("comprobantesPago"),
        archivosCertificado: numero("archivosCertificado"),
        evidenciasEvaluacion:
          numero("evidenciasEvaluacion"),
        evidenciasAsistencia:
          numero("evidenciasAsistencia"),
      },

      alertas: {
        participantesCompartidos:
          numero("participantesCompartidos"),

        requiereRevisionDeParticipantes: true,
        requiereRevisionDeDocumentos: true,
      },

      procesamiento: {
        eliminacionEjecutada: false,
        eliminacionAutorizada: false,
        mensaje:
          "Diagnóstico de solo lectura. " +
          "No se ha eliminado ni anonimizado información.",
      },

      limitaciones: [
        "Se revisaron las relaciones académicas especificadas.",
        "Las referencias a archivos no garantizan que esos archivos existan.",
        "No se inspeccionaron contenidos de texto libre ni registros externos.",
        "Los participantes compartidos no deben modificarse automáticamente.",
      ],
    });
  } catch (errorConsulta) {
    console.error(
      "Error en diagnóstico de impacto ARCO:",
      errorConsulta
    );

    return responder(
      {
        message:
          "No fue posible evaluar las dependencias indirectas",
      },
      500
    );
  }
}
