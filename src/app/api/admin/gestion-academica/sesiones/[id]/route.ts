import { count, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { requireApiRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { recalcularProgresoCurso } from "@/lib/gestion-academica/recalcular-progreso";
import { validarSesionCurso } from "@/lib/gestion-academica/validar-sesion";
import {
  asistenciasCurso,
  evaluacionesCurso,
  notificacionesAcademicas,
  sesionesCurso,
} from "@/lib/schema";
import type { EstadoSesionCurso } from "@/types/gestion-academica";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

interface ParsedSessionId {
  bigintId: bigint;
  numberId: number;
}

const ESTADOS_VALIDOS: EstadoSesionCurso[] = [
  "Programada",
  "En curso",
  "Finalizada",
  "Cancelada",
  "Reprogramada",
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

function isDatabaseError(
  value: unknown
): value is {
  code?: string;
} {
  return typeof value === "object" && value !== null;
}

export async function PUT(
  request: Request,
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

  const validation = validarSesionCurso(payload);

  if (!validation.success) {
    return NextResponse.json(
      {
        success: false,
        error: validation.error,
      },
      { status: 400 }
    );
  }

  try {
    const [actual] = await db
      .select({
        cursoId: sesionesCurso.cursoId,
        fecha: sesionesCurso.fecha,
        horaInicio: sesionesCurso.horaInicio,
        horaFin: sesionesCurso.horaFin,
        estado: sesionesCurso.estado,
      })
      .from(sesionesCurso)
      .where(eq(sesionesCurso.idSesion, parsedId.bigintId))
      .limit(1);

    if (!actual) {
      return NextResponse.json(
        {
          success: false,
          error: "No se encontró la sesión",
        },
        { status: 404 }
      );
    }

    const horarioCambio =
      actual.fecha !== validation.data.fecha ||
      actual.horaInicio !== validation.data.horaInicio ||
      actual.horaFin !== validation.data.horaFin;

    const nuevoEstado =
      horarioCambio &&
      actual.estado !== "Finalizada" &&
      actual.estado !== "Cancelada"
        ? "Reprogramada"
        : actual.estado;

    await db
      .update(sesionesCurso)
      .set({
        numeroSesion: validation.data.numeroSesion,
        titulo: validation.data.titulo,
        descripcion: validation.data.descripcion,
        fecha: validation.data.fecha,
        horaInicio: validation.data.horaInicio,
        horaFin: validation.data.horaFin,
        modalidadId: validation.data.modalidadId,
        ubicacionId: validation.data.ubicacionId,
        enlaceVirtual: validation.data.enlaceVirtual,
        observaciones: validation.data.observaciones,
        estado: nuevoEstado,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(sesionesCurso.idSesion, parsedId.bigintId));

    const progreso = await recalcularProgresoCurso(actual.cursoId);

    return NextResponse.json({
      success: true,
      message: horarioCambio
        ? "Sesión actualizada y marcada como reprogramada"
        : "Sesión actualizada correctamente",
      progreso,
    });
  } catch (requestError: unknown) {
    console.error("Error al actualizar sesión:", requestError);

    if (
      isDatabaseError(requestError) &&
      requestError.code === "23505"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Ya existe una sesión con ese número",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "No fue posible actualizar la sesión",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
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

  if (
    !isRecord(payload) ||
    typeof payload.estado !== "string" ||
    !ESTADOS_VALIDOS.includes(payload.estado as EstadoSesionCurso)
  ) {
    return NextResponse.json(
      {
        success: false,
        error: "El estado seleccionado no es válido",
      },
      { status: 400 }
    );
  }

  const estado = payload.estado as EstadoSesionCurso;

  try {
    const [sesion] = await db
      .update(sesionesCurso)
      .set({
        estado,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(sesionesCurso.idSesion, parsedId.bigintId))
      .returning({
        idSesion: sesionesCurso.idSesion,
        cursoId: sesionesCurso.cursoId,
      });

    if (!sesion) {
      return NextResponse.json(
        {
          success: false,
          error: "No se encontró la sesión",
        },
        { status: 404 }
      );
    }

    const progreso = await recalcularProgresoCurso(sesion.cursoId);

    return NextResponse.json({
      success: true,
      message: "Estado actualizado correctamente",
      progreso,
    });
  } catch (requestError: unknown) {
    console.error("Error al cambiar estado de sesión:", requestError);

    return NextResponse.json(
      {
        success: false,
        error: "No fue posible cambiar el estado de la sesión",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
    const [sesionActual] = await db
      .select({
        cursoId: sesionesCurso.cursoId,
      })
      .from(sesionesCurso)
      .where(eq(sesionesCurso.idSesion, parsedId.bigintId))
      .limit(1);

    if (!sesionActual) {
      return NextResponse.json(
        {
          success: false,
          error: "No se encontró la sesión",
        },
        { status: 404 }
      );
    }

    const [[asistencias], [evaluaciones], [notificaciones]] =
      await Promise.all([
        db
          .select({ total: count() })
          .from(asistenciasCurso)
          .where(eq(asistenciasCurso.sesionId, parsedId.numberId)),

        db
          .select({ total: count() })
          .from(evaluacionesCurso)
          .where(eq(evaluacionesCurso.sesionId, parsedId.numberId)),

        db
          .select({ total: count() })
          .from(notificacionesAcademicas)
          .where(
            eq(
              notificacionesAcademicas.sesionId,
              parsedId.numberId
            )
          ),
      ]);

    const tieneReferencias =
      Number(asistencias.total) > 0 ||
      Number(evaluaciones.total) > 0 ||
      Number(notificaciones.total) > 0;

    if (tieneReferencias) {
      return NextResponse.json(
        {
          success: false,
          error:
            "La sesión ya tiene información relacionada. Debes cancelarla en lugar de eliminarla.",
        },
        { status: 409 }
      );
    }

    await db
      .delete(sesionesCurso)
      .where(eq(sesionesCurso.idSesion, parsedId.bigintId));

    const progreso = await recalcularProgresoCurso(
      sesionActual.cursoId
    );

    return NextResponse.json({
      success: true,
      message: "Sesión eliminada correctamente",
      progreso,
    });
  } catch (requestError: unknown) {
    console.error("Error al eliminar sesión:", requestError);

    return NextResponse.json(
      {
        success: false,
        error: "No fue posible eliminar la sesión",
      },
      { status: 500 }
    );
  }
}