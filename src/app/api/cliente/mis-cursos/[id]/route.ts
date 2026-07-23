import {
  asc,
  eq,
  sql,
} from "drizzle-orm";
import { NextResponse } from "next/server";

import { requireApiAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  asistenciasCurso,
  categoriasCursos,
  compraParticipantes,
  comprasCursos,
  cursos,
  inscripcionesCursos,
  instructores,
  modalidades,
  participantes,
  progresoCurso,
  sesionesCurso,
  ubicacionesCursos,
} from "@/lib/schema";
import type {
  MiCursoDetalleResponse,
  SesionMiCursoDetalle,
  SituacionCursoCliente,
} from "@/types/mis-cursos";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

function parsePositiveId(value: string): number | null {
  const parsed = Number(value);

  if (!Number.isSafeInteger(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

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

export async function GET(
  _request: Request,
  context: RouteContext
) {
  const { session, error } = await requireApiAuth();

  if (error || !session) {
    return error;
  }

  const { id } = await context.params;
  const idInscripcion = parsePositiveId(id);

  if (idInscripcion === null) {
    return NextResponse.json(
      {
        success: false,
        error: "La inscripción solicitada no es válida",
      },
      { status: 400 }
    );
  }

  try {
    const usuarioId = session.user.id;

    const [filaCurso] = await db
      .select({
        idInscripcion: inscripcionesCursos.idInscripcion,
        estadoInscripcion: inscripcionesCursos.estado,
        fechaInscripcion: inscripcionesCursos.fechaInscripcion,
        origenInscripcion: inscripcionesCursos.origenInscripcion,
        participanteId: inscripcionesCursos.participanteId,
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
        participanteCorreo: participantes.correo,
        participanteTelefono: participantes.telefono,
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
        instructorEspecialidad: instructores.especialidad,
        categoriaNombre: categoriasCursos.nombreCategoria,
        modalidadNombre: modalidades.nombreModalidad,
        ubicacionNombre: ubicacionesCursos.nombreUbicacion,
        direccionCompleta: ubicacionesCursos.direccionCompleta,
        fechaInicio: cursos.fechaInicio,
        fechaFin: cursos.fechaFin,
        horario: cursos.horario,
        situacionCurso: sql<SituacionCursoCliente>`
          CASE
            WHEN CURRENT_DATE < ${cursos.fechaInicio}
              THEN 'Próximamente'
            WHEN CURRENT_DATE > ${cursos.fechaFin}
              THEN 'Finalizado'
            ELSE 'En curso'
          END
        `,
        sesionesTotales: progresoCurso.sesionesTotales,
        sesionesCompletadas: progresoCurso.sesionesCompletadas,
        porcentajeAvance: progresoCurso.porcentajeAvance,
        porcentajeAsistencia: progresoCurso.porcentajeAsistencia,
        estadoAcademico: progresoCurso.estadoAcademico,
        fechaUltimaActividad: progresoCurso.fechaUltimaActividad,
        fechaFinalizacion: progresoCurso.fechaFinalizacion,
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
        ubicacionesCursos,
        eq(cursos.idUbicacion, ubicacionesCursos.idUbicacion)
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
        sql`
          ${inscripcionesCursos.idInscripcion} = ${idInscripcion}
          AND (
            ${inscripcionesCursos.usuarioId} = ${usuarioId}
            OR ${participantes.usuarioId} = ${usuarioId}
            OR ${comprasCursos.idusuario} = ${usuarioId}
          )
        `
      )
      .limit(1);

    if (!filaCurso) {
      return NextResponse.json(
        {
          success: false,
          error: "No se encontró el curso o no tienes permiso para consultarlo",
        },
        { status: 404 }
      );
    }

    const filasSesiones = await db
      .select({
        idSesion: sesionesCurso.idSesion,
        numeroSesion: sesionesCurso.numeroSesion,
        titulo: sesionesCurso.titulo,
        descripcion: sesionesCurso.descripcion,
        fecha: sesionesCurso.fecha,
        horaInicio: sesionesCurso.horaInicio,
        horaFin: sesionesCurso.horaFin,
        estado: sesionesCurso.estado,
        modalidadNombre: modalidades.nombreModalidad,
        ubicacionNombre: ubicacionesCursos.nombreUbicacion,
        direccionCompleta: ubicacionesCursos.direccionCompleta,
        enlaceVirtual: sesionesCurso.enlaceVirtual,
        estadoAsistencia: asistenciasCurso.estadoAsistencia,
        horaEntrada: asistenciasCurso.horaEntrada,
        horaSalida: asistenciasCurso.horaSalida,
        minutosRetardo: asistenciasCurso.minutosRetardo,
        justificada: asistenciasCurso.justificada,
        motivoJustificacion: asistenciasCurso.motivoJustificacion,
        observacionesAsistencia: asistenciasCurso.observaciones,
      })
      .from(sesionesCurso)
      .leftJoin(
        modalidades,
        eq(sesionesCurso.modalidadId, modalidades.idModalidad)
      )
      .leftJoin(
        ubicacionesCursos,
        eq(sesionesCurso.ubicacionId, ubicacionesCursos.idUbicacion)
      )
      .leftJoin(
        asistenciasCurso,
        sql`
          ${asistenciasCurso.sesionId} = ${sesionesCurso.idSesion}
          AND ${asistenciasCurso.inscripcionId} = ${idInscripcion}
        `
      )
      .where(eq(sesionesCurso.cursoId, filaCurso.idCurso))
      .orderBy(
        asc(sesionesCurso.fecha),
        asc(sesionesCurso.horaInicio),
        asc(sesionesCurso.numeroSesion)
      );

    const sesiones: SesionMiCursoDetalle[] = filasSesiones.map((sesion) => {
      const idSesion = positiveNumberOrNull(sesion.idSesion);

      if (idSesion === null) {
        throw new Error("La sesión tiene un identificador fuera de rango");
      }

      return {
        idSesion,
        numeroSesion: sesion.numeroSesion,
        titulo: sesion.titulo,
        descripcion: sesion.descripcion,
        fecha: sesion.fecha,
        horaInicio: sesion.horaInicio,
        horaFin: sesion.horaFin,
        estado: sesion.estado,
        modalidadNombre: sesion.modalidadNombre,
        ubicacionNombre: sesion.ubicacionNombre,
        direccionCompleta: sesion.direccionCompleta,
        enlaceVirtual: sesion.enlaceVirtual,
        estadoAsistencia: textOrDefault(
          sesion.estadoAsistencia,
          "Pendiente"
        ),
        horaEntrada: sesion.horaEntrada,
        horaSalida: sesion.horaSalida,
        minutosRetardo: sesion.minutosRetardo,
        justificada: sesion.justificada ?? false,
        motivoJustificacion: sesion.motivoJustificacion,
        observacionesAsistencia: sesion.observacionesAsistencia,
      };
    });

    const response: MiCursoDetalleResponse = {
      success: true,
      curso: {
        idInscripcion: filaCurso.idInscripcion,
        estadoInscripcion: textOrDefault(
          filaCurso.estadoInscripcion,
          "Activo"
        ),
        fechaInscripcion: filaCurso.fechaInscripcion,
        origenInscripcion: filaCurso.origenInscripcion,
        participanteId: positiveNumberOrNull(filaCurso.participanteId),
        participanteNombre: textOrDefault(
          filaCurso.participanteNombre,
          session.user.nombreCompleto
        ),
        participanteCorreo: filaCurso.participanteCorreo,
        participanteTelefono: filaCurso.participanteTelefono,
        idCurso: filaCurso.idCurso,
        tituloCurso: filaCurso.tituloCurso,
        descripcion: filaCurso.descripcion,
        urlImagenPortada: filaCurso.urlImagenPortada,
        instructorNombre: textOrDefault(
          filaCurso.instructorNombre,
          "Instructor no asignado"
        ),
        instructorEspecialidad: filaCurso.instructorEspecialidad,
        categoriaNombre: filaCurso.categoriaNombre,
        modalidadNombre: filaCurso.modalidadNombre,
        ubicacionNombre: filaCurso.ubicacionNombre,
        direccionCompleta: filaCurso.direccionCompleta,
        fechaInicio: filaCurso.fechaInicio,
        fechaFin: filaCurso.fechaFin,
        horario: filaCurso.horario,
        situacionCurso: filaCurso.situacionCurso,
        sesionesTotales: numberOrZero(filaCurso.sesionesTotales),
        sesionesCompletadas: numberOrZero(
          filaCurso.sesionesCompletadas
        ),
        porcentajeAvance: numberOrZero(filaCurso.porcentajeAvance),
        porcentajeAsistencia: numberOrZero(
          filaCurso.porcentajeAsistencia
        ),
        estadoAcademico: textOrDefault(
          filaCurso.estadoAcademico,
          "No iniciado"
        ),
        fechaUltimaActividad: filaCurso.fechaUltimaActividad,
        fechaFinalizacion: filaCurso.fechaFinalizacion,
        sesiones,
      },
    };

    return NextResponse.json(response);
  } catch (errorValue) {
    console.error("Error al cargar el detalle de Mi Curso:", errorValue);

    return NextResponse.json(
      {
        success: false,
        error: "No fue posible cargar el detalle del curso",
      },
      { status: 500 }
    );
  }
}
