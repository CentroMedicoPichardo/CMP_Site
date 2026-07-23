import {
  desc,
  eq,
  or,
  sql,
} from "drizzle-orm";
import { NextResponse } from "next/server";

import { requireApiAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  categoriasCursos,
  compraParticipantes,
  comprasCursos,
  cursos,
  inscripcionesCursos,
  instructores,
  modalidades,
  participantes,
  progresoCurso,
} from "@/lib/schema";
import type {
  MiCursoResumen,
  MisCursosResponse,
  SituacionCursoCliente,
} from "@/types/mis-cursos";

export const dynamic = "force-dynamic";

function numberOrZero(
  value: string | number | bigint | null | undefined
): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function positiveNumberOrNull(
  value: string | number | bigint | null | undefined
): number | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = Number(value);

  return Number.isSafeInteger(parsed) && parsed > 0
    ? parsed
    : null;
}

function textOrDefault(
  value: string | null | undefined,
  fallback: string
): string {
  const normalized = value?.trim();
  return normalized ? normalized : fallback;
}

export async function GET() {
  const { session, error } = await requireApiAuth();

  if (error || !session) {
    return error;
  }

  try {
    const usuarioId = session.user.id;

    const filas = await db
      .select({
        idInscripcion: inscripcionesCursos.idInscripcion,
        idCurso: cursos.idCurso,
        tituloCurso: cursos.tituloCurso,
        descripcion: cursos.descripcion,
        urlImagenPortada: cursos.urlImagenPortada,
        instructorNombre: sql<string>`
          TRIM(
            CONCAT_WS(
              ' ',
              ${instructores.nombre},
              ${instructores.apellidoPaterno},
              ${instructores.apellidoMaterno}
            )
          )
        `,
        categoriaNombre: categoriasCursos.nombreCategoria,
        modalidadNombre: modalidades.nombreModalidad,
        fechaInicio: cursos.fechaInicio,
        fechaFin: cursos.fechaFin,
        horario: cursos.horario,
        participanteNombre: sql<string>`
          COALESCE(
            NULLIF(
              TRIM(
                CONCAT_WS(
                  ' ',
                  ${participantes.nombre},
                  ${participantes.apellidoPaterno},
                  ${participantes.apellidoMaterno}
                )
              ),
              ''
            ),
            ${session.user.nombreCompleto}
          )
        `,
        estadoInscripcion: inscripcionesCursos.estado,
        estadoAcademico: progresoCurso.estadoAcademico,
        sesionesTotales: progresoCurso.sesionesTotales,
        sesionesCompletadas: progresoCurso.sesionesCompletadas,
        porcentajeAvance: progresoCurso.porcentajeAvance,
        porcentajeAsistencia: progresoCurso.porcentajeAsistencia,
        situacionCurso: sql<SituacionCursoCliente>`
          CASE
            WHEN CURRENT_DATE < ${cursos.fechaInicio}
              THEN 'Próximamente'
            WHEN CURRENT_DATE > ${cursos.fechaFin}
              THEN 'Finalizado'
            ELSE 'En curso'
          END
        `,
        proximaSesionId: sql<string | null>`
          (
            SELECT sc.id_sesion::text
            FROM academia.sesiones_curso sc
            WHERE sc.curso_id = ${cursos.idCurso}
              AND sc.estado IN ('Programada', 'Reprogramada', 'En curso')
              AND sc.fecha >= CURRENT_DATE
            ORDER BY sc.fecha ASC, sc.hora_inicio ASC
            LIMIT 1
          )
        `,
        proximaSesionNumero: sql<number | null>`
          (
            SELECT sc.numero_sesion
            FROM academia.sesiones_curso sc
            WHERE sc.curso_id = ${cursos.idCurso}
              AND sc.estado IN ('Programada', 'Reprogramada', 'En curso')
              AND sc.fecha >= CURRENT_DATE
            ORDER BY sc.fecha ASC, sc.hora_inicio ASC
            LIMIT 1
          )
        `,
        proximaSesionTitulo: sql<string | null>`
          (
            SELECT sc.titulo
            FROM academia.sesiones_curso sc
            WHERE sc.curso_id = ${cursos.idCurso}
              AND sc.estado IN ('Programada', 'Reprogramada', 'En curso')
              AND sc.fecha >= CURRENT_DATE
            ORDER BY sc.fecha ASC, sc.hora_inicio ASC
            LIMIT 1
          )
        `,
        proximaSesionFecha: sql<string | null>`
          (
            SELECT sc.fecha::text
            FROM academia.sesiones_curso sc
            WHERE sc.curso_id = ${cursos.idCurso}
              AND sc.estado IN ('Programada', 'Reprogramada', 'En curso')
              AND sc.fecha >= CURRENT_DATE
            ORDER BY sc.fecha ASC, sc.hora_inicio ASC
            LIMIT 1
          )
        `,
        proximaSesionHoraInicio: sql<string | null>`
          (
            SELECT sc.hora_inicio::text
            FROM academia.sesiones_curso sc
            WHERE sc.curso_id = ${cursos.idCurso}
              AND sc.estado IN ('Programada', 'Reprogramada', 'En curso')
              AND sc.fecha >= CURRENT_DATE
            ORDER BY sc.fecha ASC, sc.hora_inicio ASC
            LIMIT 1
          )
        `,
        proximaSesionHoraFin: sql<string | null>`
          (
            SELECT sc.hora_fin::text
            FROM academia.sesiones_curso sc
            WHERE sc.curso_id = ${cursos.idCurso}
              AND sc.estado IN ('Programada', 'Reprogramada', 'En curso')
              AND sc.fecha >= CURRENT_DATE
            ORDER BY sc.fecha ASC, sc.hora_inicio ASC
            LIMIT 1
          )
        `,
        proximaSesionEstado: sql<string | null>`
          (
            SELECT sc.estado
            FROM academia.sesiones_curso sc
            WHERE sc.curso_id = ${cursos.idCurso}
              AND sc.estado IN ('Programada', 'Reprogramada', 'En curso')
              AND sc.fecha >= CURRENT_DATE
            ORDER BY sc.fecha ASC, sc.hora_inicio ASC
            LIMIT 1
          )
        `,
      })
      .from(inscripcionesCursos)
      .innerJoin(cursos, eq(inscripcionesCursos.cursoId, cursos.idCurso))
      .leftJoin(
        instructores,
        eq(cursos.idInstructor, instructores.idInstructor)
      )
      .leftJoin(
        categoriasCursos,
        eq(cursos.idCategoria, categoriasCursos.idCategoria)
      )
      .leftJoin(
        modalidades,
        eq(cursos.idModalidad, modalidades.idModalidad)
      )
      .leftJoin(
        participantes,
        sql`${inscripcionesCursos.participanteId} = ${participantes.idParticipante}`
      )
      .leftJoin(
        compraParticipantes,
        sql`${inscripcionesCursos.compraParticipanteId} = ${compraParticipantes.idCompraParticipante}`
      )
      .leftJoin(
        comprasCursos,
        sql`${compraParticipantes.idCompra} = ${comprasCursos.idcompra}`
      )
      .leftJoin(
        progresoCurso,
        eq(progresoCurso.inscripcionId, inscripcionesCursos.idInscripcion)
      )
      .where(
        or(
          eq(inscripcionesCursos.usuarioId, usuarioId),
          eq(participantes.usuarioId, usuarioId),
          eq(comprasCursos.idusuario, usuarioId)
        )
      )
      .orderBy(desc(cursos.fechaInicio), desc(inscripcionesCursos.idInscripcion));

    const cursosUsuario: MiCursoResumen[] = filas.map((fila) => {
      const proximaSesionId = positiveNumberOrNull(fila.proximaSesionId);

      return {
        idInscripcion: fila.idInscripcion,
        idCurso: fila.idCurso,
        tituloCurso: fila.tituloCurso,
        descripcion: fila.descripcion,
        urlImagenPortada: fila.urlImagenPortada,
        instructorNombre: textOrDefault(
          fila.instructorNombre,
          "Instructor no asignado"
        ),
        categoriaNombre: fila.categoriaNombre,
        modalidadNombre: fila.modalidadNombre,
        fechaInicio: fila.fechaInicio,
        fechaFin: fila.fechaFin,
        horario: fila.horario,
        participanteNombre: textOrDefault(
          fila.participanteNombre,
          session.user.nombreCompleto
        ),
        estadoInscripcion: textOrDefault(
          fila.estadoInscripcion,
          "Activo"
        ),
        estadoAcademico: textOrDefault(
          fila.estadoAcademico,
          "No iniciado"
        ),
        sesionesTotales: numberOrZero(fila.sesionesTotales),
        sesionesCompletadas: numberOrZero(fila.sesionesCompletadas),
        porcentajeAvance: numberOrZero(fila.porcentajeAvance),
        porcentajeAsistencia: numberOrZero(fila.porcentajeAsistencia),
        situacionCurso: fila.situacionCurso,
        proximaSesion:
          proximaSesionId !== null &&
          fila.proximaSesionNumero !== null &&
          fila.proximaSesionTitulo !== null &&
          fila.proximaSesionFecha !== null &&
          fila.proximaSesionHoraInicio !== null &&
          fila.proximaSesionHoraFin !== null
            ? {
                idSesion: proximaSesionId,
                numeroSesion: fila.proximaSesionNumero,
                titulo: fila.proximaSesionTitulo,
                fecha: fila.proximaSesionFecha,
                horaInicio: fila.proximaSesionHoraInicio,
                horaFin: fila.proximaSesionHoraFin,
                estado: textOrDefault(
                  fila.proximaSesionEstado,
                  "Programada"
                ),
              }
            : null,
      };
    });

    const resumen = cursosUsuario.reduce(
      (acumulado, curso) => ({
        totalInscripciones: acumulado.totalInscripciones + 1,
        cursosProximos:
          acumulado.cursosProximos +
          (curso.situacionCurso === "Próximamente" ? 1 : 0),
        cursosEnCurso:
          acumulado.cursosEnCurso +
          (curso.situacionCurso === "En curso" ? 1 : 0),
        cursosFinalizados:
          acumulado.cursosFinalizados +
          (curso.situacionCurso === "Finalizado" ? 1 : 0),
        cursosCompletados:
          acumulado.cursosCompletados +
          (curso.estadoAcademico === "Completado" ? 1 : 0),
      }),
      {
        totalInscripciones: 0,
        cursosProximos: 0,
        cursosEnCurso: 0,
        cursosFinalizados: 0,
        cursosCompletados: 0,
      }
    );

    const response: MisCursosResponse = {
      success: true,
      resumen,
      cursos: cursosUsuario,
    };

    return NextResponse.json(response);
  } catch (errorValue) {
    console.error("Error al cargar Mis Cursos:", errorValue);

    return NextResponse.json(
      {
        success: false,
        error: "No fue posible cargar tus cursos",
      },
      { status: 500 }
    );
  }
}
