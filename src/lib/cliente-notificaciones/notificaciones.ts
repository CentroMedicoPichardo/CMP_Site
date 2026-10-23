import { and, eq, inArray, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import {
  inscripcionesCursos,
  notificacionesAcademicas,
} from "@/lib/schema";

// Alcance (dos filtros):
// 1. Solo se exponen notificaciones ligadas a una
//    inscripción (inscripcion_id no nulo), cuyo dueño se
//    obtiene por inscripciones_cursos.usuario_id.
//    Las notificaciones de solo curso_id (avisos a todo el
//    curso) NO se exponen por ahora: estado_envio y
//    fecha_lectura son compartidos por toda la fila, y el
//    esquema actual no permite registrar la lectura por
//    usuario. El INNER JOIN con la inscripción las excluye.
// 2. Solo se exponen las enviadas o leídas. Pendiente,
//    Procesando, Fallida y Cancelada son estados internos
//    del envío: no tienen fecha_envio, no se pueden marcar
//    como leídas (chk_notificacion_enviada) y contarlas en
//    unreadCount dejaría un contador imposible de bajar.

export const ESTADO_LEIDA = "Leída";

export const ESTADOS_VISIBLES_CLIENTE = [
  "Enviada",
  ESTADO_LEIDA,
];

// Condición para listar y contar solo lo visible al cliente.
export function condicionEstadoVisible() {
  return inArray(
    notificacionesAcademicas.estadoEnvio,
    ESTADOS_VISIBLES_CLIENTE
  );
}

export const camposNotificacion = {
  idNotificacion:
    notificacionesAcademicas.idNotificacion,
  cursoId: notificacionesAcademicas.cursoId,
  inscripcionId:
    notificacionesAcademicas.inscripcionId,
  sesionId: notificacionesAcademicas.sesionId,
  evaluacionId:
    notificacionesAcademicas.evaluacionId,
  tipoNotificacion:
    notificacionesAcademicas.tipoNotificacion,
  titulo: notificacionesAcademicas.titulo,
  mensaje: notificacionesAcademicas.mensaje,
  canal: notificacionesAcademicas.canal,
  estadoEnvio:
    notificacionesAcademicas.estadoEnvio,
  fechaProgramada:
    notificacionesAcademicas.fechaProgramada,
  fechaEnvio: notificacionesAcademicas.fechaEnvio,
  fechaLectura:
    notificacionesAcademicas.fechaLectura,
};

type FilaNotificacion = {
  idNotificacion: bigint | number;
  cursoId: number | null;
  inscripcionId: number | null;
  sesionId: number | null;
  evaluacionId: number | null;
  tipoNotificacion: string;
  titulo: string;
  mensaje: string;
  canal: string;
  estadoEnvio: string;
  fechaProgramada: string | null;
  fechaEnvio: string | null;
  fechaLectura: string | null;
};

// Las columnas son timestamp sin zona y se manejan
// en UTC; se serializan como ISO 8601.
function aIso(valor: string | null): string | null {
  if (!valor) {
    return null;
  }

  const texto = valor.replace(" ", "T");

  return new Date(
    /(Z|[+-]\d{2}(:?\d{2})?)$/.test(texto)
      ? texto
      : `${texto}Z`
  ).toISOString();
}

export function aNotificacionDto(
  fila: FilaNotificacion
) {
  return {
    id: Number(fila.idNotificacion),
    courseId: fila.cursoId,
    enrollmentId: fila.inscripcionId,
    sessionId: fila.sesionId,
    evaluationId: fila.evaluacionId,
    type: fila.tipoNotificacion,
    title: fila.titulo,
    message: fila.mensaje,
    channel: fila.canal,
    deliveryStatus: fila.estadoEnvio,
    scheduledAt: aIso(fila.fechaProgramada),
    sentAt: aIso(fila.fechaEnvio),
    readAt: aIso(fila.fechaLectura),
  };
}

// Notificación del usuario indicado, o undefined si no
// existe o pertenece a otro usuario.
export async function buscarNotificacionDelUsuario(
  idNotificacion: number,
  usuarioId: number
) {
  const resultados = await db
    .select(camposNotificacion)
    .from(notificacionesAcademicas)
    .innerJoin(
      inscripcionesCursos,
      eq(
        notificacionesAcademicas.inscripcionId,
        inscripcionesCursos.idInscripcion
      )
    )
    .where(
      and(
        eq(
          notificacionesAcademicas.idNotificacion,
          BigInt(idNotificacion)
        ),
        eq(inscripcionesCursos.usuarioId, usuarioId)
      )
    )
    .limit(1);

  return resultados[0];
}

export const totalesNotificaciones = {
  total: sql<number>`count(*)::int`,
  noLeidas: sql<number>`(count(*) filter (where ${notificacionesAcademicas.estadoEnvio} <> ${ESTADO_LEIDA}))::int`,
};
