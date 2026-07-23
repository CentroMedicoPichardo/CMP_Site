import {
  and,
  desc,
  eq,
  gte,
  or,
  sql,
} from "drizzle-orm";

import { db } from "@/lib/db";
import {
  categoriasCursos,
  compraParticipantes,
  comprasCursos,
  cursos,
  estadosCompra,
  inscripcionesCursos,
  instructores,
  modalidades,
  participantes,
  preguntasUsuarios,
  progresoCurso,
} from "@/lib/schema";
import type { Session } from "@/lib/auth";
import type {
  AlertaDashboardCliente,
  ClienteDashboardResponse,
  CompraResumenDashboardCliente,
  CursoRecienteDashboardCliente,
  CursoResumenDashboardCliente,
  SoporteResumenDashboardCliente,
} from "@/types/cliente-dashboard";

const ESTADOS_COMPRA_PENDIENTES = [
  "Pendiente de pago",
  "Pago reportado",
  "En validación",
] as const;

const ESTADOS_SOPORTE_ATENDIDOS = [
  "respondida",
  "cerrada",
  "convertida_faq",
] as const;

function numberOrZero(
  value: string | number | bigint | null | undefined,
): number {
  const result = Number(value ?? 0);
  return Number.isFinite(result) ? result : 0;
}

function positiveSafeNumber(
  value: string | number | bigint,
  fieldName: string,
): number {
  const result = Number(value);

  if (!Number.isSafeInteger(result) || result <= 0) {
    throw new Error(`${fieldName} no contiene un identificador válido`);
  }

  return result;
}

function stringOrFallback(
  value: string | null | undefined,
  fallback: string,
): string {
  const normalized = value?.trim();
  return normalized ? normalized : fallback;
}

function fechaToString(
  value: string | Date | null | undefined,
): string | null {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  return value;
}

function crearAlertas(
  compras: CompraResumenDashboardCliente[],
  cursosUsuario: CursoResumenDashboardCliente[],
  soporte: SoporteResumenDashboardCliente,
): AlertaDashboardCliente[] {
  const alertas: AlertaDashboardCliente[] = [];

  compras
    .filter((compra) =>
      ESTADOS_COMPRA_PENDIENTES.some(
        (estado) => estado === compra.estado,
      ),
    )
    .slice(0, 2)
    .forEach((compra) => {
      alertas.push({
        id: `compra-${compra.idCompra}`,
        tipo: "pago",
        nivel: "warning",
        titulo: compra.estado,
        descripcion: `${compra.tituloCurso} · ${compra.folioCompra}`,
        href: `/mis-compras/cursos/${compra.idCompra}`,
        accion: "Revisar compra",
        fecha: compra.fechaLimitePago ?? compra.fechaCompra,
      });
    });

  const ahora = new Date();
  const limiteProximo = new Date();
  limiteProximo.setDate(limiteProximo.getDate() + 10);

  cursosUsuario
    .filter((curso) => {
      if (curso.situacionCurso !== "Próximamente") {
        return false;
      }

      const fechaInicio = new Date(`${curso.fechaInicio}T00:00:00`);

      return (
        !Number.isNaN(fechaInicio.getTime()) &&
        fechaInicio >= ahora &&
        fechaInicio <= limiteProximo
      );
    })
    .slice(0, 2)
    .forEach((curso) => {
      alertas.push({
        id: `curso-${curso.idInscripcion}`,
        tipo: "curso",
        nivel: "info",
        titulo: "Tu curso inicia pronto",
        descripcion: curso.tituloCurso,
        href: `/mis-cursos/${curso.idInscripcion}`,
        accion: "Ver curso",
        fecha: curso.fechaInicio,
      });
    });

  if (soporte.ultimaAtendida) {
    alertas.push({
      id: `soporte-${soporte.ultimaAtendida.idPregunta}`,
      tipo: "soporte",
      nivel: "success",
      titulo: "Tu pregunta ha sido atendida",
      descripcion: soporte.ultimaAtendida.titulo,
      href: `/ayuda/preguntas/${soporte.ultimaAtendida.idPregunta}`,
      accion: "Ver respuesta",
      fecha: soporte.ultimaAtendida.fecha,
    });
  }

  return alertas.slice(0, 5);
}

export async function obtenerDashboardCliente(
  session: Session,
): Promise<ClienteDashboardResponse> {
  const usuarioId = Number(session.user.id);

  if (!Number.isSafeInteger(usuarioId) || usuarioId <= 0) {
    throw new Error("La sesión no contiene un usuario válido");
  }

  const filasCursos = await db
    .select({
      idInscripcion: inscripcionesCursos.idInscripcion,
      idCurso: cursos.idCurso,
      tituloCurso: cursos.tituloCurso,
      urlImagenPortada: cursos.urlImagenPortada,
      fechaInicio: cursos.fechaInicio,
      fechaFin: cursos.fechaFin,
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
      estadoAcademico: progresoCurso.estadoAcademico,
      porcentajeAvance: progresoCurso.porcentajeAvance,
      porcentajeAsistencia: progresoCurso.porcentajeAsistencia,
      situacionCurso: sql<"Próximamente" | "En curso" | "Finalizado">`
        CASE
          WHEN CURRENT_DATE < ${cursos.fechaInicio} THEN 'Próximamente'
          WHEN CURRENT_DATE > ${cursos.fechaFin} THEN 'Finalizado'
          ELSE 'En curso'
        END
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
    })
    .from(inscripcionesCursos)
    .innerJoin(cursos, eq(inscripcionesCursos.cursoId, cursos.idCurso))
    .leftJoin(
      participantes,
      sql`${inscripcionesCursos.participanteId} = ${participantes.idParticipante}`,
    )
    .leftJoin(
      compraParticipantes,
      sql`${inscripcionesCursos.compraParticipanteId} = ${compraParticipantes.idCompraParticipante}`,
    )
    .leftJoin(
      comprasCursos,
      sql`${compraParticipantes.idCompra} = ${comprasCursos.idcompra}`,
    )
    .leftJoin(
      progresoCurso,
      eq(progresoCurso.inscripcionId, inscripcionesCursos.idInscripcion),
    )
    .where(
      or(
        eq(inscripcionesCursos.usuarioId, usuarioId),
        eq(participantes.usuarioId, usuarioId),
        eq(comprasCursos.idusuario, usuarioId),
      ),
    )
    .orderBy(desc(cursos.fechaInicio), desc(inscripcionesCursos.idInscripcion));

  const todosLosCursos: CursoResumenDashboardCliente[] = filasCursos.map(
    (fila) => ({
      idInscripcion: fila.idInscripcion,
      idCurso: fila.idCurso,
      tituloCurso: fila.tituloCurso,
      participanteNombre: stringOrFallback(
        fila.participanteNombre,
        session.user.nombreCompleto,
      ),
      urlImagenPortada: fila.urlImagenPortada,
      fechaInicio: fila.fechaInicio,
      fechaFin: fila.fechaFin,
      estadoAcademico: stringOrFallback(
        fila.estadoAcademico,
        "No iniciado",
      ),
      situacionCurso: fila.situacionCurso,
      porcentajeAvance: numberOrZero(fila.porcentajeAvance),
      porcentajeAsistencia: numberOrZero(fila.porcentajeAsistencia),
      proximaSesion:
        fila.proximaSesionTitulo &&
        fila.proximaSesionFecha &&
        fila.proximaSesionHoraInicio
          ? {
              titulo: fila.proximaSesionTitulo,
              fecha: fila.proximaSesionFecha,
              horaInicio: fila.proximaSesionHoraInicio,
            }
          : null,
    }),
  );

  const filasCompras = await db
    .select({
      idCompra: comprasCursos.idcompra,
      folioCompra: comprasCursos.foliocompra,
      cursoId: comprasCursos.idcurso,
      tituloCurso: cursos.tituloCurso,
      estado: estadosCompra.nombre,
      total: comprasCursos.total,
      fechaCompra: comprasCursos.fechacompra,
      fechaLimitePago: comprasCursos.fechalimitepago,
    })
    .from(comprasCursos)
    .innerJoin(cursos, eq(comprasCursos.idcurso, cursos.idCurso))
    .innerJoin(
      estadosCompra,
      eq(comprasCursos.idestadocompra, estadosCompra.idestadocompra),
    )
    .where(eq(comprasCursos.idusuario, usuarioId))
    .orderBy(desc(comprasCursos.fechacompra), desc(comprasCursos.idcompra));

  const todasLasCompras: CompraResumenDashboardCliente[] = filasCompras.map(
    (fila) => ({
      idCompra: positiveSafeNumber(fila.idCompra, "idCompra"),
      folioCompra: fila.folioCompra,
      cursoId: fila.cursoId,
      tituloCurso: fila.tituloCurso,
      estado: fila.estado,
      total: String(fila.total ?? "0"),
      fechaCompra: fechaToString(fila.fechaCompra) ?? new Date().toISOString(),
      fechaLimitePago: fechaToString(fila.fechaLimitePago),
    }),
  );

  const filasSoporte = await db
    .select({
      idPregunta: preguntasUsuarios.idPregunta,
      titulo: preguntasUsuarios.titulo,
      estado: preguntasUsuarios.estado,
      createdAt: preguntasUsuarios.createdAt,
      updatedAt: preguntasUsuarios.updatedAt,
    })
    .from(preguntasUsuarios)
    .where(eq(preguntasUsuarios.idUsuario, usuarioId))
    .orderBy(
      desc(preguntasUsuarios.updatedAt),
      desc(preguntasUsuarios.createdAt),
    );

  const pendientesSoporte = filasSoporte.filter(
    (pregunta) => pregunta.estado === "pendiente",
  ).length;

  const atendidasSoporte = filasSoporte.filter((pregunta) =>
    ESTADOS_SOPORTE_ATENDIDOS.some(
      (estado) => estado === pregunta.estado,
    ),
  ).length;

  const ultimaAtendida = filasSoporte.find((pregunta) =>
    ESTADOS_SOPORTE_ATENDIDOS.some(
      (estado) => estado === pregunta.estado,
    ),
  );

  const soporte: SoporteResumenDashboardCliente = {
    total: filasSoporte.length,
    pendientes: pendientesSoporte,
    atendidas: atendidasSoporte,
    ultimaAtendida: ultimaAtendida
      ? {
          idPregunta: ultimaAtendida.idPregunta,
          titulo: ultimaAtendida.titulo,
          estado: ultimaAtendida.estado ?? "respondida",
          fecha:
            fechaToString(ultimaAtendida.updatedAt) ??
            fechaToString(ultimaAtendida.createdAt),
        }
      : null,
  };

  const filasCursosRecientes = await db
    .select({
      idCurso: cursos.idCurso,
      tituloCurso: cursos.tituloCurso,
      descripcion: cursos.descripcion,
      categoriaNombre: categoriasCursos.nombreCategoria,
      modalidadNombre: modalidades.nombreModalidad,
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
      fechaInicio: cursos.fechaInicio,
      fechaFin: cursos.fechaFin,
      horario: cursos.horario,
      costo: cursos.costo,
      cupoMaximo: cursos.cupoMaximo,
      cuposOcupados: cursos.cuposOcupados,
      urlImagenPortada: cursos.urlImagenPortada,
      createdAt: cursos.createdAt,
    })
    .from(cursos)
    .leftJoin(
      categoriasCursos,
      eq(cursos.idCategoria, categoriasCursos.idCategoria),
    )
    .leftJoin(modalidades, eq(cursos.idModalidad, modalidades.idModalidad))
    .leftJoin(
      instructores,
      eq(cursos.idInstructor, instructores.idInstructor),
    )
    .where(
      and(
        eq(cursos.activo, true),
        gte(cursos.fechaInicio, sql`CURRENT_DATE`),
        sql`NOT EXISTS (
          SELECT 1
          FROM academia.inscripciones_cursos ic
          LEFT JOIN academia.participantes p
            ON p.id_participante = ic.participante_id
          LEFT JOIN academia.compra_participantes cp
            ON cp.id_compra_participante = ic.compra_participante_id
          LEFT JOIN academia.comprascursosinacademia cc
            ON cc.idcompra = cp.id_compra
          WHERE ic.curso_id = ${cursos.idCurso}
            AND (
              ic.usuario_id = ${usuarioId}
              OR p.usuario_id = ${usuarioId}
              OR cc.idusuario = ${usuarioId}
            )
        )`,
        sql`NOT EXISTS (
          SELECT 1
          FROM academia.comprascursosinacademia cc
          INNER JOIN academia.estadocomprainacademia ec
            ON ec.idestadocompra = cc.idestadocompra
          WHERE cc.idcurso = ${cursos.idCurso}
            AND cc.idusuario = ${usuarioId}
            AND ec.nombre NOT IN ('Cancelada', 'Rechazada', 'Expirada')
        )`,
      ),
    )
    .orderBy(desc(cursos.createdAt), desc(cursos.idCurso))
    .limit(8);

  const cursosRecientes: CursoRecienteDashboardCliente[] =
    filasCursosRecientes.map((fila) => {
      const cupoMaximo = numberOrZero(fila.cupoMaximo);
      const cuposOcupados = numberOrZero(fila.cuposOcupados);

      return {
        idCurso: fila.idCurso,
        tituloCurso: fila.tituloCurso,
        descripcion: fila.descripcion,
        categoriaNombre: fila.categoriaNombre,
        modalidadNombre: fila.modalidadNombre,
        instructorNombre: stringOrFallback(
          fila.instructorNombre,
          "Instructor por confirmar",
        ),
        fechaInicio: fila.fechaInicio,
        fechaFin: fila.fechaFin,
        horario: fila.horario,
        costo: String(fila.costo ?? "0"),
        cupoMaximo,
        cuposOcupados,
        cuposDisponibles: Math.max(cupoMaximo - cuposOcupados, 0),
        urlImagenPortada: fila.urlImagenPortada,
        createdAt: fechaToString(fila.createdAt),
      };
    });

  const resumen = {
    cursosEnCurso: todosLosCursos.filter(
      (curso) => curso.situacionCurso === "En curso",
    ).length,
    cursosProximos: todosLosCursos.filter(
      (curso) => curso.situacionCurso === "Próximamente",
    ).length,
    cursosCompletados: todosLosCursos.filter(
      (curso) => curso.estadoAcademico === "Completado",
    ).length,
    comprasPendientes: todasLasCompras.filter((compra) =>
      ESTADOS_COMPRA_PENDIENTES.some(
        (estado) => estado === compra.estado,
      ),
    ).length,
    preguntasPendientes: soporte.pendientes,
    preguntasAtendidas: soporte.atendidas,
  };

  return {
    success: true,
    usuario: {
      id: usuarioId,
      nombre: session.user.nombre,
      nombreCompleto: session.user.nombreCompleto,
    },
    resumen,
    alertas: crearAlertas(todasLasCompras, todosLosCursos, soporte),
    misCursos: todosLosCursos.slice(0, 3),
    comprasRecientes: todasLasCompras.slice(0, 4),
    soporte,
    cursosRecientes,
    generadoEn: new Date().toISOString(),
  };
}
