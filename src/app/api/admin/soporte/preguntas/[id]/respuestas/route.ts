import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { requireApiRole } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  preguntasUsuarios,
  respuestasAyuda,
} from "@/lib/schema/index";
import {
  parseIdPositivo,
  validarContenidoRespuesta,
} from "@/lib/soporte/validaciones";
import type { CrearRespuestaDTO } from "@/types/help";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error } = await requireApiRole("admin");

  if (error) {
    return error;
  }

  if (!session) {
    return NextResponse.json(
      { message: "No autenticado" },
      { status: 401 },
    );
  }

  try {
    const { id } = await params;
    const idPregunta = parseIdPositivo(id);

    if (idPregunta === null) {
      return NextResponse.json(
        { error: "El identificador de la pregunta no es válido." },
        { status: 400 },
      );
    }

    const body = (await request.json()) as CrearRespuestaDTO;
    const errorContenido = validarContenidoRespuesta(body.contenido);

    if (errorContenido) {
      return NextResponse.json(
        { error: errorContenido },
        { status: 400 },
      );
    }

    const respuesta = await db.transaction(async (tx) => {
      const [pregunta] = await tx
        .select({
          idPregunta: preguntasUsuarios.idPregunta,
          estado: preguntasUsuarios.estado,
        })
        .from(preguntasUsuarios)
        .where(eq(preguntasUsuarios.idPregunta, idPregunta))
        .limit(1);

      if (!pregunta) {
        return null;
      }

      if (pregunta.estado === "convertida_faq") {
        throw new Error("CONVERTIDA_FAQ");
      }

      const esSolucion = body.esSolucion === true;

      if (esSolucion) {
        await tx
          .update(respuestasAyuda)
          .set({ esSolucion: false })
          .where(eq(respuestasAyuda.idPregunta, idPregunta));
      }

      const [creada] = await tx
        .insert(respuestasAyuda)
        .values({
          idPregunta,
          idUsuario: session.user.id,
          contenido: body.contenido.trim(),
          esRespuestaAdmin: true,
          esSolucion,
        })
        .returning();

      await tx
        .update(preguntasUsuarios)
        .set({
          estado: "respondida",
          updatedAt: new Date().toISOString(),
        })
        .where(eq(preguntasUsuarios.idPregunta, idPregunta));

      return creada;
    });

    if (!respuesta) {
      return NextResponse.json(
        { error: "Pregunta no encontrada." },
        { status: 404 },
      );
    }

    return NextResponse.json(respuesta, { status: 201 });
  } catch (errorCreacion: unknown) {
    if (
      errorCreacion instanceof Error &&
      errorCreacion.message === "CONVERTIDA_FAQ"
    ) {
      return NextResponse.json(
        { error: "La solicitud ya fue convertida en FAQ." },
        { status: 409 },
      );
    }

    console.error("Error al responder solicitud:", errorCreacion);
    return NextResponse.json(
      { error: "No fue posible registrar la respuesta." },
      { status: 500 },
    );
  }
}
