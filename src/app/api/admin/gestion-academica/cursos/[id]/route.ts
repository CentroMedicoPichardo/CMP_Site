import {
  asc,
  eq,
  sql,
} from "drizzle-orm";
import { NextResponse } from "next/server";

import {
  requireApiRole,
} from "@/lib/auth";
import { db } from "@/lib/db";
import {
  categoriasCursos,
  cursos,
  instructores,
  modalidades,
  sesionesCurso,
  ubicacionesCursos,
  vwDetalleParticipantesCursos,
  vwSeguimientoAcademicoCursos,
} from "@/lib/schema";
import type {
  CursoGestionAcademicaDetalleResponse,
  EstadoSesionCurso,
} from "@/types/gestion-academica";

export const dynamic =
  "force-dynamic";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

function parsePositiveId(
  value: string
): number | null {
  const parsed = Number(value);

  if (
    !Number.isSafeInteger(parsed) ||
    parsed <= 0
  ) {
    return null;
  }

  return parsed;
}

function numberOrZero(
  value:
    | number
    | string
    | bigint
    | null
    | undefined
): number {
  const parsed = Number(value ?? 0);

  return Number.isFinite(parsed)
    ? parsed
    : 0;
}

function safeBigintNumber(
  value: bigint
): number {
  const parsed = Number(value);

  if (!Number.isSafeInteger(parsed)) {
    throw new Error(
      "El identificador supera el rango permitido"
    );
  }

  return parsed;
}

function textOrDefault(
  value: string | null | undefined,
  fallback: string
): string {
  const normalized = value?.trim();

  return normalized
    ? normalized
    : fallback;
}

export async function GET(
  _request: Request,
  context: RouteContext
) {
  const { error } =
    await requireApiRole("admin");

  if (error) {
    return error;
  }

  const { id } =
    await context.params;

  const cursoId =
    parsePositiveId(id);

  if (cursoId === null) {
    return NextResponse.json(
      {
        success: false,
        error:
          "El identificador del curso no es válido",
      },
      { status: 400 }
    );
  }

  try {
    const [curso] = await db
      .select({
        idCurso:
          cursos.idCurso,
        tituloCurso:
          cursos.tituloCurso,
        descripcion:
          cursos.descripcion,

        instructorNombre:
          sql<string>`
            TRIM(
              CONCAT_WS(
                ' ',
                ${instructores.nombre},
                ${instructores.apellidoPaterno},
                ${instructores.apellidoMaterno}
              )
            )
          `,

        instructorEspecialidad:
          instructores.especialidad,

        categoriaNombre:
          categoriasCursos
            .nombreCategoria,

        modalidadNombre:
          modalidades
            .nombreModalidad,

        ubicacionNombre:
          ubicacionesCursos
            .nombreUbicacion,

        fechaInicio:
          cursos.fechaInicio,

        fechaFin:
          cursos.fechaFin,

        horario:
          cursos.horario,

        activo:
          cursos.activo,

        cupoMaximo:
          cursos.cupoMaximo,

        cuposOcupados:
          cursos.cuposOcupados,

        totalInscripciones:
          vwSeguimientoAcademicoCursos
            .totalInscripciones,

        totalSesiones:
          vwSeguimientoAcademicoCursos
            .totalSesiones,

        sesionesProgramadas:
          vwSeguimientoAcademicoCursos
            .sesionesProgramadas,

        sesionesEnCurso:
          vwSeguimientoAcademicoCursos
            .sesionesEnCurso,

        sesionesFinalizadas:
          vwSeguimientoAcademicoCursos
            .sesionesFinalizadas,

        sesionesCanceladas:
          vwSeguimientoAcademicoCursos
            .sesionesCanceladas,

        promedioAvance:
          vwSeguimientoAcademicoCursos
            .promedioAvance,

        promedioAsistencia:
          vwSeguimientoAcademicoCursos
            .promedioAsistencia,

        situacionAcademica:
          vwSeguimientoAcademicoCursos
            .situacionAcademica,
      })
      .from(cursos)
      .leftJoin(
        instructores,
        eq(
          cursos.idInstructor,
          instructores.idInstructor
        )
      )
      .leftJoin(
        categoriasCursos,
        eq(
          cursos.idCategoria,
          categoriasCursos.idCategoria
        )
      )
      .leftJoin(
        modalidades,
        eq(
          cursos.idModalidad,
          modalidades.idModalidad
        )
      )
      .leftJoin(
        ubicacionesCursos,
        eq(
          cursos.idUbicacion,
          ubicacionesCursos.idUbicacion
        )
      )
      .leftJoin(
        vwSeguimientoAcademicoCursos,
        eq(
          cursos.idCurso,
          vwSeguimientoAcademicoCursos
            .cursoId
        )
      )
      .where(
        eq(cursos.idCurso, cursoId)
      )
      .limit(1);

    if (!curso) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No se encontró el curso solicitado",
        },
        { status: 404 }
      );
    }

    const [
      filasSesiones,
      filasParticipantes,
      filasModalidades,
      filasUbicaciones,
    ] = await Promise.all([
      db
        .select({
          idSesion:
            sesionesCurso.idSesion,
          cursoId:
            sesionesCurso.cursoId,
          numeroSesion:
            sesionesCurso.numeroSesion,
          titulo:
            sesionesCurso.titulo,
          descripcion:
            sesionesCurso.descripcion,
          fecha:
            sesionesCurso.fecha,
          horaInicio:
            sesionesCurso.horaInicio,
          horaFin:
            sesionesCurso.horaFin,
          modalidadId:
            sesionesCurso.modalidadId,
          modalidadNombre:
            modalidades.nombreModalidad,
          ubicacionId:
            sesionesCurso.ubicacionId,
          ubicacionNombre:
            ubicacionesCursos
              .nombreUbicacion,
          enlaceVirtual:
            sesionesCurso.enlaceVirtual,
          estado:
            sesionesCurso.estado,
          observaciones:
            sesionesCurso.observaciones,
        })
        .from(sesionesCurso)
        .leftJoin(
          modalidades,
          eq(
            sesionesCurso.modalidadId,
            modalidades.idModalidad
          )
        )
        .leftJoin(
          ubicacionesCursos,
          eq(
            sesionesCurso.ubicacionId,
            ubicacionesCursos.idUbicacion
          )
        )
        .where(
          eq(
            sesionesCurso.cursoId,
            cursoId
          )
        )
        .orderBy(
          asc(
            sesionesCurso.numeroSesion
          )
        ),

      db
        .select({
          idInscripcion:
            vwDetalleParticipantesCursos
              .idInscripcion,

          participanteId:
            vwDetalleParticipantesCursos
              .participanteId,

          nombreParticipante:
            vwDetalleParticipantesCursos
              .nombreParticipante,

          correoParticipante:
            vwDetalleParticipantesCursos
              .correoParticipante,

          telefonoParticipante:
            vwDetalleParticipantesCursos
              .telefonoParticipante,

          estadoInscripcion:
            vwDetalleParticipantesCursos
              .estadoInscripcion,

          origenInscripcion:
            vwDetalleParticipantesCursos
              .origenInscripcion,

          estadoAcademico:
            vwDetalleParticipantesCursos
              .estadoAcademico,

          porcentajeAvance:
            vwDetalleParticipantesCursos
              .porcentajeAvance,

          porcentajeAsistencia:
            vwDetalleParticipantesCursos
              .porcentajeAsistencia,

          asistenciasPresentes:
            vwDetalleParticipantesCursos
              .asistenciasPresentes,

          retardos:
            vwDetalleParticipantesCursos
              .retardos,

          ausencias:
            vwDetalleParticipantesCursos
              .ausencias,

          faltasJustificadas:
            vwDetalleParticipantesCursos
              .faltasJustificadas,
        })
        .from(
          vwDetalleParticipantesCursos
        )
        .where(
          eq(
            vwDetalleParticipantesCursos
              .cursoId,
            cursoId
          )
        )
        .orderBy(
          asc(
            vwDetalleParticipantesCursos
              .nombreParticipante
          )
        ),

      db
        .select({
          idModalidad:
            modalidades.idModalidad,
          nombreModalidad:
            modalidades.nombreModalidad,
        })
        .from(modalidades)
        .orderBy(
          asc(
            modalidades.nombreModalidad
          )
        ),

      db
        .select({
          idUbicacion:
            ubicacionesCursos.idUbicacion,
          nombreUbicacion:
            ubicacionesCursos
              .nombreUbicacion,
          direccionCompleta:
            ubicacionesCursos
              .direccionCompleta,
        })
        .from(ubicacionesCursos)
        .where(
          eq(
            ubicacionesCursos.activo,
            true
          )
        )
        .orderBy(
          asc(
            ubicacionesCursos
              .nombreUbicacion
          )
        ),
    ]);

    const response:
      CursoGestionAcademicaDetalleResponse = {
      success: true,

      curso: {
        idCurso:
          curso.idCurso,

        tituloCurso:
          curso.tituloCurso,

        descripcion:
          curso.descripcion,

        instructorNombre:
          textOrDefault(
            curso.instructorNombre,
            "Instructor no asignado"
          ),

        instructorEspecialidad:
          curso.instructorEspecialidad,

        categoriaNombre:
          curso.categoriaNombre,

        modalidadNombre:
          curso.modalidadNombre,

        ubicacionNombre:
          curso.ubicacionNombre,

        fechaInicio:
          curso.fechaInicio,

        fechaFin:
          curso.fechaFin,

        horario:
          curso.horario,

        activo:
          curso.activo ?? false,

        cupoMaximo:
          numberOrZero(
            curso.cupoMaximo
          ),

        cuposOcupados:
          numberOrZero(
            curso.cuposOcupados
          ),

        totalInscripciones:
          numberOrZero(
            curso.totalInscripciones
          ),

        totalSesiones:
          numberOrZero(
            curso.totalSesiones
          ),

        sesionesProgramadas:
          numberOrZero(
            curso.sesionesProgramadas
          ),

        sesionesEnCurso:
          numberOrZero(
            curso.sesionesEnCurso
          ),

        sesionesFinalizadas:
          numberOrZero(
            curso.sesionesFinalizadas
          ),

        sesionesCanceladas:
          numberOrZero(
            curso.sesionesCanceladas
          ),

        promedioAvance:
          numberOrZero(
            curso.promedioAvance
          ),

        promedioAsistencia:
          numberOrZero(
            curso.promedioAsistencia
          ),

        situacionAcademica:
          textOrDefault(
            curso.situacionAcademica,
            "Sin seguimiento"
          ),
      },

      sesiones:
        filasSesiones.map(
          (sesion) => ({
            idSesion:
              safeBigintNumber(
                sesion.idSesion
              ),

            cursoId:
              sesion.cursoId,

            numeroSesion:
              sesion.numeroSesion,

            titulo:
              sesion.titulo,

            descripcion:
              sesion.descripcion,

            fecha:
              sesion.fecha,

            horaInicio:
              sesion.horaInicio,

            horaFin:
              sesion.horaFin,

            modalidadId:
              sesion.modalidadId,

            modalidadNombre:
              sesion.modalidadNombre,

            ubicacionId:
              sesion.ubicacionId,

            ubicacionNombre:
              sesion.ubicacionNombre,

            enlaceVirtual:
              sesion.enlaceVirtual,

            estado:
              sesion.estado as EstadoSesionCurso,

            observaciones:
              sesion.observaciones,
          })
        ),

      participantes:
        filasParticipantes.map(
          (participante) => ({
            idInscripcion:
              numberOrZero(
                participante.idInscripcion
              ),

            participanteId:
              participante.participanteId,

            nombreParticipante:
              textOrDefault(
                participante
                  .nombreParticipante,
                "Participante sin nombre"
              ),

            correoParticipante:
              participante
                .correoParticipante,

            telefonoParticipante:
              participante
                .telefonoParticipante,

            estadoInscripcion:
              textOrDefault(
                participante
                  .estadoInscripcion,
                "Sin estado"
              ),

            origenInscripcion:
              textOrDefault(
                participante
                  .origenInscripcion,
                "Sin origen"
              ),

            estadoAcademico:
              textOrDefault(
                participante
                  .estadoAcademico,
                "No iniciado"
              ),

            porcentajeAvance:
              numberOrZero(
                participante
                  .porcentajeAvance
              ),

            porcentajeAsistencia:
              numberOrZero(
                participante
                  .porcentajeAsistencia
              ),

            asistenciasPresentes:
              numberOrZero(
                participante
                  .asistenciasPresentes
              ),

            retardos:
              numberOrZero(
                participante.retardos
              ),

            ausencias:
              numberOrZero(
                participante.ausencias
              ),

            faltasJustificadas:
              numberOrZero(
                participante
                  .faltasJustificadas
              ),
          })
        ),

      modalidades:
        filasModalidades,

      ubicaciones:
        filasUbicaciones,
    };

    return NextResponse.json(
      response
    );
  } catch (error) {
    console.error(
      "Error al cargar detalle académico:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "No fue posible cargar el detalle académico",
      },
      { status: 500 }
    );
  }
}