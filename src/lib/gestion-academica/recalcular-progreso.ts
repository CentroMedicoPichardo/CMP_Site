import { and, count, eq, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import { inscripcionesCursos } from "@/lib/schema";

export interface ResultadoRecalculoProgreso {
  cursoId: number;
  totalInscripciones: number;
  totalActualizadas: number;
}

function validarCursoId(cursoId: number): void {
  if (!Number.isSafeInteger(cursoId) || cursoId <= 0) {
    throw new Error("El identificador del curso no es válido");
  }
}

/**
 * Reconstruye el progreso de todas las inscripciones activas de un curso.
 *
 * Reglas:
 * - Sesiones totales: sesiones que no están canceladas.
 * - Sesiones completadas: sesiones finalizadas con asistencia distinta de Pendiente.
 * - Asistencia positiva: Presente, Retardo o Salida anticipada.
 * - Pendiente no entra en el denominador de asistencia.
 */
export async function recalcularProgresoCurso(
  cursoId: number
): Promise<ResultadoRecalculoProgreso> {
  validarCursoId(cursoId);

  const [resumenInscripciones] = await db
    .select({
      total: count(),
    })
    .from(inscripcionesCursos)
    .where(
      and(
        eq(inscripcionesCursos.cursoId, cursoId),
        sql`LOWER(COALESCE(${inscripcionesCursos.estado}, '')) NOT IN ('cancelado', 'cancelada')`
      )
    );

  const totalInscripciones = Number(
    resumenInscripciones?.total ?? 0
  );

  await db.execute(sql`
    WITH inscripciones_objetivo AS (
      SELECT
        ic.id_inscripcion,
        ic.curso_id
      FROM academia.inscripciones_cursos AS ic
      WHERE ic.curso_id = ${cursoId}
        AND LOWER(COALESCE(ic.estado, '')) NOT IN ('cancelado', 'cancelada')
    ),
    sesiones_validas AS (
      SELECT
        sc.id_sesion,
        sc.curso_id,
        sc.estado
      FROM academia.sesiones_curso AS sc
      WHERE sc.curso_id = ${cursoId}
        AND sc.estado <> 'Cancelada'
    ),
    metricas AS (
      SELECT
        io.id_inscripcion,
        COUNT(sv.id_sesion)::smallint AS sesiones_totales,
        COUNT(sv.id_sesion) FILTER (
          WHERE sv.estado = 'Finalizada'
            AND ac.estado_asistencia IS NOT NULL
            AND ac.estado_asistencia <> 'Pendiente'
        )::smallint AS sesiones_completadas,
        COUNT(sv.id_sesion) FILTER (
          WHERE sv.estado = 'Finalizada'
            AND ac.estado_asistencia IS NOT NULL
            AND ac.estado_asistencia <> 'Pendiente'
        )::integer AS asistencias_registradas,
        COUNT(sv.id_sesion) FILTER (
          WHERE sv.estado = 'Finalizada'
            AND ac.estado_asistencia IN (
              'Presente',
              'Retardo',
              'Salida anticipada'
            )
        )::integer AS asistencias_positivas
      FROM inscripciones_objetivo AS io
      LEFT JOIN sesiones_validas AS sv
        ON sv.curso_id = io.curso_id
      LEFT JOIN academia.asistencias_curso AS ac
        ON ac.inscripcion_id = io.id_inscripcion
       AND ac.sesion_id = sv.id_sesion
      GROUP BY io.id_inscripcion
    ),
    valores AS (
      SELECT
        m.id_inscripcion,
        m.sesiones_totales,
        m.sesiones_completadas,
        CASE
          WHEN m.sesiones_totales = 0 THEN 0::numeric
          ELSE ROUND(
            (m.sesiones_completadas::numeric / m.sesiones_totales::numeric) * 100,
            2
          )
        END AS porcentaje_avance,
        CASE
          WHEN m.asistencias_registradas = 0 THEN 0::numeric
          ELSE ROUND(
            (m.asistencias_positivas::numeric / m.asistencias_registradas::numeric) * 100,
            2
          )
        END AS porcentaje_asistencia,
        CASE
          WHEN m.sesiones_totales = 0 OR m.sesiones_completadas = 0
            THEN 'No iniciado'
          WHEN m.sesiones_completadas >= m.sesiones_totales
            THEN 'Completado'
          ELSE 'En progreso'
        END AS estado_academico
      FROM metricas AS m
    )
    INSERT INTO academia.progreso_curso (
      inscripcion_id,
      sesiones_totales,
      sesiones_completadas,
      porcentaje_avance,
      porcentaje_asistencia,
      estado_academico,
      fecha_inicio,
      fecha_ultima_actividad,
      fecha_finalizacion,
      created_at,
      updated_at
    )
    SELECT
      v.id_inscripcion,
      v.sesiones_totales,
      v.sesiones_completadas,
      v.porcentaje_avance,
      v.porcentaje_asistencia,
      v.estado_academico,
      CASE
        WHEN v.sesiones_completadas > 0 THEN CURRENT_TIMESTAMP
        ELSE NULL
      END,
      CASE
        WHEN v.sesiones_completadas > 0 THEN CURRENT_TIMESTAMP
        ELSE NULL
      END,
      CASE
        WHEN v.sesiones_totales > 0
         AND v.sesiones_completadas >= v.sesiones_totales
          THEN CURRENT_TIMESTAMP
        ELSE NULL
      END,
      CURRENT_TIMESTAMP,
      CURRENT_TIMESTAMP
    FROM valores AS v
    ON CONFLICT (inscripcion_id)
    DO UPDATE SET
      sesiones_totales = EXCLUDED.sesiones_totales,
      sesiones_completadas = EXCLUDED.sesiones_completadas,
      porcentaje_avance = EXCLUDED.porcentaje_avance,
      porcentaje_asistencia = EXCLUDED.porcentaje_asistencia,
      estado_academico = EXCLUDED.estado_academico,
      fecha_inicio = CASE
        WHEN EXCLUDED.estado_academico = 'No iniciado' THEN NULL
        ELSE COALESCE(
          academia.progreso_curso.fecha_inicio,
          EXCLUDED.fecha_inicio
        )
      END,
      fecha_ultima_actividad = EXCLUDED.fecha_ultima_actividad,
      fecha_finalizacion = EXCLUDED.fecha_finalizacion,
      updated_at = CURRENT_TIMESTAMP
  `);

  return {
    cursoId,
    totalInscripciones,
    totalActualizadas: totalInscripciones,
  };
}