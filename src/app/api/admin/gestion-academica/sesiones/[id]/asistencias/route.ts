import {
  and,
  asc,
  eq,
  inArray,
  sql,
} from "drizzle-orm";
import { NextResponse } from "next/server";

import { requireApiRole } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  asistenciasCurso,
  cursos,
  inscripcionesCursos,
  modalidades,
  participantes,
  sesionesCurso,
  ubicacionesCursos,
  usuarios,
} from "@/lib/schema";
import type {
  AsistenciaSesionResponse,
  EstadoAsistenciaCurso,
  EstadoSesionCurso,
  RegistroAsistenciaInput,
} from "@/types/gestion-academica";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

interface ParsedSessionId {
  bigintId: bigint;
  numberId: number;
}

interface ValidationSuccess {
  success: true;
  data: RegistroAsistenciaInput;
}

interface ValidationError {
  success: false;
  error: string;
}

type ValidationResult = ValidationSuccess | ValidationError;

const ESTADOS_ASISTENCIA: EstadoAsistenciaCurso[] = [
  "Pendiente",
  "Presente",
  "Ausente",
  "Retardo",
  "Falta justificada",
  "Salida anticipada",
];

function parseSessionId(value: string): ParsedSessionId | null {
  try {
    const bigintId = BigInt(value);
    const numberId = Number(bigintId);

    if (
      bigintId <= BigInt(0) ||
      !Number.isSafeInteger(numberId)
    ) {
      return null;
    }

    return {
      bigintId,
      numberId,
    };
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function numberOrZero(
  value: number | string | bigint | null | undefined
): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function nullableSafeNumber(
  value: number | bigint | null | undefined
): number | null {
  if (value === null || value === undefined) {
    return null;
  }

  const parsed = Number(value);
  return Number.isSafeInteger(parsed) ? parsed : null;
}

function textOrDefault(
  value: string | null | undefined,
  fallback: string
): string {
  const normalized = value?.trim();
  return normalized ? normalized : fallback;
}

function optionalText(value: unknown): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function normalizeTime(value: unknown): string | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value !== "string") {
    return null;
  }

  const match = value.trim().match(
    /^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/
  );

  if (!match) {
    return null;
  }

  return `${match[1]}:${match[2]}:${match[3] ?? "00"}`;
}

function timeToSeconds(value: string): number {
  const [hours, minutes, seconds] = value.split(":").map(Number);
  return hours * 3600 + minutes * 60 + seconds;
}

function validateAttendance(value: unknown): ValidationResult {
  if (!isRecord(value)) {
    return {
      success: false,
      error: "Uno de los registros de asistencia no es válido",
    };
  }

  const idInscripcion = Number(value.idInscripcion);

  if (!Number.isSafeInteger(idInscripcion) || idInscripcion <= 0) {
    return {
      success: false,
      error: "La inscripción de un participante no es válida",
    };
  }

  if (
    typeof value.estadoAsistencia !== "string" ||
    !ESTADOS_ASISTENCIA.includes(
      value.estadoAsistencia as EstadoAsistenciaCurso
    )
  ) {
    return {
      success: false,
      error: "El estado de asistencia seleccionado no es válido",
    };
  }

  const estadoAsistencia =
    value.estadoAsistencia as EstadoAsistenciaCurso;
  const horaEntrada = normalizeTime(value.horaEntrada);
  const horaSalida = normalizeTime(value.horaSalida);

  if (
    value.horaEntrada !== null &&
    value.horaEntrada !== undefined &&
    value.horaEntrada !== "" &&
    horaEntrada === null
  ) {
    return {
      success: false,
      error: "Una hora de entrada no es válida",
    };
  }

  if (
    value.horaSalida !== null &&
    value.horaSalida !== undefined &&
    value.horaSalida !== "" &&
    horaSalida === null
  ) {
    return {
      success: false,
      error: "Una hora de salida no es válida",
    };
  }

  if (
    horaEntrada !== null &&
    horaSalida !== null &&
    timeToSeconds(horaSalida) < timeToSeconds(horaEntrada)
  ) {
    return {
      success: false,
      error: "La hora de salida no puede ser anterior a la entrada",
    };
  }

  let minutosRetardo: number | null = null;

  if (estadoAsistencia === "Retardo") {
    minutosRetardo = Number(value.minutosRetardo);

    if (
      !Number.isSafeInteger(minutosRetardo) ||
      minutosRetardo < 0
    ) {
      return {
        success: false,
        error: "Debes indicar los minutos de retardo",
      };
    }
  }

  const motivoJustificacion = optionalText(
    value.motivoJustificacion
  );

  if (
    estadoAsistencia === "Falta justificada" &&
    motivoJustificacion === null
  ) {
    return {
      success: false,
      error: "Debes indicar el motivo de la falta justificada",
    };
  }

  return {
    success: true,
    data: {
      idInscripcion,
      estadoAsistencia,
      horaEntrada,
      horaSalida,
      minutosRetardo,
      motivoJustificacion:
        estadoAsistencia === "Falta justificada"
          ? motivoJustificacion
          : null,
      comprobanteJustificacion:
        estadoAsistencia === "Falta justificada"
          ? optionalText(value.comprobanteJustificacion)
          : null,
      observaciones: optionalText(value.observaciones),
    },
  };
}

async function getSession(parsedId: ParsedSessionId) {
  const [sesion] = await db
    .select({
      idSesion: sesionesCurso.idSesion,
      cursoId: sesionesCurso.cursoId,
      tituloCurso: cursos.tituloCurso,
      numeroSesion: sesionesCurso.numeroSesion,
      tituloSesion: sesionesCurso.titulo,
      fecha: sesionesCurso.fecha,
      horaInicio: sesionesCurso.horaInicio,
      horaFin: sesionesCurso.horaFin,
      estadoSesion: sesionesCurso.estado,
      modalidadNombre: modalidades.nombreModalidad,
      ubicacionNombre: ubicacionesCursos.nombreUbicacion,
      enlaceVirtual: sesionesCurso.enlaceVirtual,
    })
    .from(sesionesCurso)
    .innerJoin(cursos, eq(sesionesCurso.cursoId, cursos.idCurso))
    .leftJoin(
      modalidades,
      eq(sesionesCurso.modalidadId, modalidades.idModalidad)
    )
    .leftJoin(
      ubicacionesCursos,
      eq(sesionesCurso.ubicacionId, ubicacionesCursos.idUbicacion)
    )
    .where(eq(sesionesCurso.idSesion, parsedId.bigintId))
    .limit(1);

  return sesion ?? null;
}

export async function GET(
  _request: Request,
  context: RouteContext
) {
  const { error } = await requireApiRole("admin");

  if (error) {
    return error;
  }

  const { id } = await context.params;
  const parsedId = parseSessionId(id);

  if (!parsedId) {
    return NextResponse.json(
      {
        success: false,
        error: "El identificador de la sesión no es válido",
      },
      { status: 400 }
    );
  }

  try {
    const sesion = await getSession(parsedId);

    if (!sesion) {
      return NextResponse.json(
        {
          success: false,
          error: "No se encontró la sesión solicitada",
        },
        { status: 404 }
      );
    }

    const filas = await db
      .select({
        idInscripcion: inscripcionesCursos.idInscripcion,
        participanteId: inscripcionesCursos.participanteId,
        nombreParticipante: sql<string>`
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
            NULLIF(
              TRIM(
                CONCAT_WS(
                  ' ',
                  ${usuarios.nombre},
                  ${usuarios.apellidoPaterno},
                  ${usuarios.apellidoMaterno}
                )
              ),
              ''
            ),
            'Participante sin nombre'
          )
        `,
        correoParticipante: sql<string | null>`
          COALESCE(${participantes.correo}, ${usuarios.correo})
        `,
        telefonoParticipante: sql<string | null>`
          COALESCE(${participantes.telefono}, ${usuarios.telefono})
        `,
        estadoInscripcion: inscripcionesCursos.estado,
        idAsistencia: asistenciasCurso.idAsistencia,
        estadoAsistencia: asistenciasCurso.estadoAsistencia,
        horaEntrada: asistenciasCurso.horaEntrada,
        horaSalida: asistenciasCurso.horaSalida,
        minutosRetardo: asistenciasCurso.minutosRetardo,
        justificada: asistenciasCurso.justificada,
        motivoJustificacion: asistenciasCurso.motivoJustificacion,
        comprobanteJustificacion:
          asistenciasCurso.comprobanteJustificacion,
        observaciones: asistenciasCurso.observaciones,
        fechaRegistro: asistenciasCurso.fechaRegistro,
      })
      .from(inscripcionesCursos)
      .leftJoin(
        participantes,
        eq(inscripcionesCursos.participanteId, participantes.idParticipante)
      )
      .leftJoin(
        usuarios,
        eq(inscripcionesCursos.usuarioId, usuarios.id)
      )
      .leftJoin(
        asistenciasCurso,
        and(
          eq(
            asistenciasCurso.inscripcionId,
            inscripcionesCursos.idInscripcion
          ),
          eq(asistenciasCurso.sesionId, parsedId.numberId)
        )
      )
      .where(
        and(
          eq(inscripcionesCursos.cursoId, sesion.cursoId),
          sql`LOWER(COALESCE(${inscripcionesCursos.estado}, '')) NOT IN ('cancelado', 'cancelada')`
        )
      )
      .orderBy(
        asc(participantes.apellidoPaterno),
        asc(participantes.nombre),
        asc(usuarios.apellidoPaterno),
        asc(usuarios.nombre)
      );

    const participantesRespuesta = filas.map((fila) => ({
      idInscripcion: fila.idInscripcion,
      participanteId: nullableSafeNumber(fila.participanteId),
      nombreParticipante: textOrDefault(
        fila.nombreParticipante,
        "Participante sin nombre"
      ),
      correoParticipante: fila.correoParticipante,
      telefonoParticipante: fila.telefonoParticipante,
      estadoInscripcion: textOrDefault(
        fila.estadoInscripcion,
        "Sin estado"
      ),
      idAsistencia: nullableSafeNumber(fila.idAsistencia),
      estadoAsistencia:
        (fila.estadoAsistencia as EstadoAsistenciaCurso | null) ??
        "Pendiente",
      horaEntrada: fila.horaEntrada,
      horaSalida: fila.horaSalida,
      minutosRetardo: fila.minutosRetardo,
      justificada: fila.justificada ?? false,
      motivoJustificacion: fila.motivoJustificacion,
      comprobanteJustificacion: fila.comprobanteJustificacion,
      observaciones: fila.observaciones,
      fechaRegistro: fila.fechaRegistro,
    }));

    const resumen = participantesRespuesta.reduce(
      (accumulator, participante) => {
        accumulator.total += 1;

        switch (participante.estadoAsistencia) {
          case "Presente":
            accumulator.presentes += 1;
            break;
          case "Ausente":
            accumulator.ausentes += 1;
            break;
          case "Retardo":
            accumulator.retardos += 1;
            break;
          case "Falta justificada":
            accumulator.justificadas += 1;
            break;
          case "Salida anticipada":
            accumulator.salidasAnticipadas += 1;
            break;
          default:
            accumulator.pendientes += 1;
        }

        return accumulator;
      },
      {
        total: 0,
        pendientes: 0,
        presentes: 0,
        ausentes: 0,
        retardos: 0,
        justificadas: 0,
        salidasAnticipadas: 0,
      }
    );

    const response: AsistenciaSesionResponse = {
      success: true,
      sesion: {
        idSesion: numberOrZero(sesion.idSesion),
        cursoId: sesion.cursoId,
        tituloCurso: sesion.tituloCurso,
        numeroSesion: sesion.numeroSesion,
        tituloSesion: sesion.tituloSesion,
        fecha: sesion.fecha,
        horaInicio: sesion.horaInicio,
        horaFin: sesion.horaFin,
        estadoSesion: sesion.estadoSesion as EstadoSesionCurso,
        modalidadNombre: sesion.modalidadNombre,
        ubicacionNombre: sesion.ubicacionNombre,
        enlaceVirtual: sesion.enlaceVirtual,
      },
      participantes: participantesRespuesta,
      resumen,
    };

    return NextResponse.json(response);
  } catch (requestError: unknown) {
    console.error("Error al consultar asistencias:", requestError);

    return NextResponse.json(
      {
        success: false,
        error: "No fue posible cargar la asistencia de la sesión",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: RouteContext
) {
  const { session, error } = await requireApiRole("admin");

  if (error) {
    return error;
  }

  if (!session) {
    return NextResponse.json(
      {
        success: false,
        error: "No autenticado",
      },
      { status: 401 }
    );
  }

  const { id } = await context.params;
  const parsedId = parseSessionId(id);

  if (!parsedId) {
    return NextResponse.json(
      {
        success: false,
        error: "El identificador de la sesión no es válido",
      },
      { status: 400 }
    );
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "El cuerpo de la solicitud no contiene JSON válido",
      },
      { status: 400 }
    );
  }

  if (!isRecord(payload) || !Array.isArray(payload.asistencias)) {
    return NextResponse.json(
      {
        success: false,
        error: "La lista de asistencias es obligatoria",
      },
      { status: 400 }
    );
  }

  const validated: RegistroAsistenciaInput[] = [];
  const uniqueIds = new Set<number>();

  for (const item of payload.asistencias) {
    const validation = validateAttendance(item);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error,
        },
        { status: 400 }
      );
    }

    if (uniqueIds.has(validation.data.idInscripcion)) {
      return NextResponse.json(
        {
          success: false,
          error: "Una inscripción aparece más de una vez",
        },
        { status: 400 }
      );
    }

    uniqueIds.add(validation.data.idInscripcion);
    validated.push(validation.data);
  }

  if (validated.length === 0) {
    return NextResponse.json(
      {
        success: false,
        error: "No hay registros de asistencia para guardar",
      },
      { status: 400 }
    );
  }

  try {
    const sesion = await getSession(parsedId);

    if (!sesion) {
      return NextResponse.json(
        {
          success: false,
          error: "No se encontró la sesión solicitada",
        },
        { status: 404 }
      );
    }

    if (sesion.estadoSesion === "Cancelada") {
      return NextResponse.json(
        {
          success: false,
          error: "No se puede registrar asistencia en una sesión cancelada",
        },
        { status: 409 }
      );
    }

    const enrollmentIds = validated.map(
      (attendance) => attendance.idInscripcion
    );

    const eligibleEnrollments = await db
      .select({
        idInscripcion: inscripcionesCursos.idInscripcion,
      })
      .from(inscripcionesCursos)
      .where(
        and(
          eq(inscripcionesCursos.cursoId, sesion.cursoId),
          inArray(inscripcionesCursos.idInscripcion, enrollmentIds),
          sql`LOWER(COALESCE(${inscripcionesCursos.estado}, '')) NOT IN ('cancelado', 'cancelada')`
        )
      );

    const eligibleIds = new Set(
      eligibleEnrollments.map((item) => item.idInscripcion)
    );

    const invalidEnrollment = validated.find(
      (attendance) => !eligibleIds.has(attendance.idInscripcion)
    );

    if (invalidEnrollment) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Uno de los participantes no pertenece a este curso o su inscripción está cancelada",
        },
        { status: 409 }
      );
    }

    const now = new Date().toISOString();

    await db.transaction(async (tx) => {
      for (const attendance of validated) {
        const isJustified =
          attendance.estadoAsistencia === "Falta justificada";

        await tx
          .insert(asistenciasCurso)
          .values({
            inscripcionId: attendance.idInscripcion,
            sesionId: parsedId.numberId,
            estadoAsistencia: attendance.estadoAsistencia,
            horaEntrada: attendance.horaEntrada ?? null,
            horaSalida: attendance.horaSalida ?? null,
            minutosRetardo:
              attendance.estadoAsistencia === "Retardo"
                ? attendance.minutosRetardo ?? 0
                : null,
            justificada: isJustified,
            motivoJustificacion: isJustified
              ? attendance.motivoJustificacion ?? null
              : null,
            comprobanteJustificacion: isJustified
              ? attendance.comprobanteJustificacion ?? null
              : null,
            usuarioRegistra: session.user.id,
            observaciones: attendance.observaciones ?? null,
            updatedAt: now,
          })
          .onConflictDoUpdate({
            target: [
              asistenciasCurso.inscripcionId,
              asistenciasCurso.sesionId,
            ],
            set: {
              estadoAsistencia: attendance.estadoAsistencia,
              horaEntrada: attendance.horaEntrada ?? null,
              horaSalida: attendance.horaSalida ?? null,
              minutosRetardo:
                attendance.estadoAsistencia === "Retardo"
                  ? attendance.minutosRetardo ?? 0
                  : null,
              justificada: isJustified,
              motivoJustificacion: isJustified
                ? attendance.motivoJustificacion ?? null
                : null,
              comprobanteJustificacion: isJustified
                ? attendance.comprobanteJustificacion ?? null
                : null,
              usuarioRegistra: session.user.id,
              observaciones: attendance.observaciones ?? null,
              updatedAt: now,
            },
          });
      }
    });

    return NextResponse.json({
      success: true,
      message: "Asistencia guardada correctamente",
      totalGuardados: validated.length,
    });
  } catch (requestError: unknown) {
    console.error("Error al guardar asistencias:", requestError);

    return NextResponse.json(
      {
        success: false,
        error: "No fue posible guardar la asistencia",
      },
      { status: 500 }
    );
  }
}
