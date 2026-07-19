// src/app/api/soporte/faq/[id]/valorar/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { valoracionesFaq, preguntasFrecuentes } from "@/lib/schema/index";
import { eq, and, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // 👈 1. Corregido: Ahora es Promise<>
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Debes iniciar sesión para valorar" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const esUtil = body.esUtil === true;

    // 👈 2. Corregido: Se espera la promesa con await antes de leer 'id'
    const { id } = await params;
    const idPregunta = parseInt(id);

    // Verificar que la FAQ existe
    const [faq] = await db
      .select()
      .from(preguntasFrecuentes)
      .where(eq(preguntasFrecuentes.idPregunta, idPregunta));

    if (!faq) {
      return NextResponse.json(
        { error: "FAQ no encontrada" },
        { status: 404 }
      );
    }

    // Verificar si ya valoró
    const [valoracionExistente] = await db
      .select()
      .from(valoracionesFaq)
      .where(
        and(
          eq(valoracionesFaq.idPreguntaFaq, idPregunta),
          eq(valoracionesFaq.idUsuario, Number(session.user.id))
        )
      );

    if (valoracionExistente) {
      return NextResponse.json(
        { error: "Ya has valorado esta FAQ" },
        { status: 400 }
      );
    }

    // Insertar valoración
    await db.insert(valoracionesFaq).values({
      idPreguntaFaq: idPregunta,
      idUsuario: Number(session.user.id),
      esUtil,
    });

    // Actualizar contador
    if (esUtil) {
      await db
        .update(preguntasFrecuentes)
        .set({
          vecesUtil: sql`${preguntasFrecuentes.vecesUtil} + 1`,
        })
        .where(eq(preguntasFrecuentes.idPregunta, idPregunta));
    } else {
      await db
        .update(preguntasFrecuentes)
        .set({
          vecesNoUtil: sql`${preguntasFrecuentes.vecesNoUtil} + 1`,
        })
        .where(eq(preguntasFrecuentes.idPregunta, idPregunta));
    }

    return NextResponse.json({ mensaje: "Valoración registrada exitosamente" });
  } catch (error) {
    console.error("Error al valorar FAQ:", error);
    return NextResponse.json(
      { error: "Error al registrar la valoración" },
      { status: 500 }
    );
  }
}