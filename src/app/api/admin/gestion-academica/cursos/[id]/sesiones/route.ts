import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { requireApiRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { recalcularProgresoCurso } from "@/lib/gestion-academica/recalcular-progreso";
import { validarSesionCurso } from "@/lib/gestion-academica/validar-sesion";
import { cursos, sesionesCurso } from "@/lib/schema";

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

function isDatabaseError(
  value: unknown
): value is {
  code?: string;
} {
  return typeof value === "object" && value !== null;
}

export async function POST(
  request: Request,
  context: RouteContext
) {
  const { error } = await requireApiRole("admin");

  if (error) {
    return error;
  }

  const { id } = await context.params;
  const cursoId = parsePositiveId(id);

  if (cursoId === null) {
    return NextResponse.json(
      {
        success: false,
        error: "El identificador del curso no es válido",
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
    const [curso] = await db
      .select({
        idCurso: cursos.idCurso,
      })
      .from(cursos)
      .where(eq(cursos.idCurso, cursoId))
      .limit(1);

    if (!curso) {
      return NextResponse.json(
        {
          success: false,
          error: "No se encontró el curso",
        },
        { status: 404 }
      );
    }

    const [sesion] = await db
      .insert(sesionesCurso)
      .values({
        cursoId,
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
        estado: "Programada",
      })
      .returning({
        idSesion: sesionesCurso.idSesion,
      });

    const progreso = await recalcularProgresoCurso(cursoId);

    return NextResponse.json(
      {
        success: true,
        message: "Sesión creada correctamente",
        idSesion: Number(sesion.idSesion),
        progreso,
      },
      { status: 201 }
    );
  } catch (requestError: unknown) {
    console.error("Error al crear sesión:", requestError);

    if (
      isDatabaseError(requestError) &&
      requestError.code === "23505"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Ya existe una sesión con ese número para este curso",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "No fue posible crear la sesión",
      },
      { status: 500 }
    );
  }
}