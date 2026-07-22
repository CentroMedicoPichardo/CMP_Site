import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { requireApiRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { recalcularProgresoCurso } from "@/lib/gestion-academica/recalcular-progreso";
import { cursos } from "@/lib/schema";

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

export async function POST(
  _request: Request,
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

  try {
    const [curso] = await db
      .select({
        idCurso: cursos.idCurso,
        tituloCurso: cursos.tituloCurso,
      })
      .from(cursos)
      .where(eq(cursos.idCurso, cursoId))
      .limit(1);

    if (!curso) {
      return NextResponse.json(
        {
          success: false,
          error: "No se encontró el curso solicitado",
        },
        { status: 404 }
      );
    }

    const resultado = await recalcularProgresoCurso(cursoId);

    return NextResponse.json({
      success: true,
      message: "Progreso académico recalculado correctamente",
      curso: {
        idCurso: curso.idCurso,
        tituloCurso: curso.tituloCurso,
      },
      resultado,
    });
  } catch (requestError: unknown) {
    console.error(
      "Error al recalcular el progreso académico:",
      requestError
    );

    return NextResponse.json(
      {
        success: false,
        error: "No fue posible recalcular el progreso académico",
      },
      { status: 500 }
    );
  }
}