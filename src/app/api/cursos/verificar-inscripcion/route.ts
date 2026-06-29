// src/app/api/cursos/verificar-inscripcion/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
import { auth } from "@/lib/auth";

function obtenerFilas(resultado: any): any[] {
  if (Array.isArray(resultado)) {
    return resultado;
  }

  if (Array.isArray(resultado?.rows)) {
    return resultado.rows;
  }

  if (Array.isArray(resultado?.[0])) {
    return resultado[0];
  }

  return [];
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cursoId = searchParams.get("cursoId");

    const cursoIdNum = Number(cursoId);

    if (!cursoId || !Number.isFinite(cursoIdNum) || cursoIdNum <= 0) {
      return NextResponse.json(
        { error: "Curso ID requerido o inválido" },
        { status: 400 }
      );
    }

    const session = await auth();

    if (!session) {
      return NextResponse.json({
        inscrito: false,
        inscripcionId: null,
      });
    }

    const usuarioId = session.user.id;

    const resultado = await db.execute(sql`
      SELECT id_inscripcion, estado
      FROM academia.inscripciones_cursos
      WHERE curso_id = ${cursoIdNum}
      AND usuario_id = ${usuarioId}
      AND estado = 'activo'
      LIMIT 1
    `);

    const inscripcion = obtenerFilas(resultado);

    return NextResponse.json({
      inscrito: inscripcion.length > 0,
      inscripcionId: inscripcion[0]?.id_inscripcion ?? null,
    });
  } catch (error) {
    console.error("Error verificando inscripción:", error);

    return NextResponse.json(
      {
        inscrito: false,
        inscripcionId: null,
        error: "Error al verificar inscripción",
      },
      { status: 500 }
    );
  }
}