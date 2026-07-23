import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { requireApiRole } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  categoriasAyuda,
  preguntasFrecuentes,
  preguntasUsuarios,
} from "@/lib/schema/index";
import {
  normalizarTags,
  parseIdPositivo,
  validarPreguntaFaq,
  validarRespuestaFaq,
} from "@/lib/soporte/validaciones";

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
    const idPreguntaUsuario = parseIdPositivo(id);

    if (idPreguntaUsuario === null) {
      return NextResponse.json(
        { error: "El identificador de la pregunta no es válido." },
        { status: 400 },
      );
    }

    const body = (await request.json()) as {
      idCategoria?: unknown;
      pregunta?: unknown;
      respuesta?: unknown;
      esDestacada?: unknown;
      tags?: unknown;
    };

    const idCategoria = parseIdPositivo(
      body.idCategoria as string | number | null | undefined,
    );
    const errorPregunta = validarPreguntaFaq(body.pregunta);
    const errorRespuesta = validarRespuestaFaq(body.respuesta);

    if (idCategoria === null || errorPregunta || errorRespuesta) {
      return NextResponse.json(
        {
          error:
            idCategoria === null
              ? "Selecciona una categoría válida."
              : errorPregunta ?? errorRespuesta,
        },
        { status: 400 },
      );
    }

    const faq = await db.transaction(async (tx) => {
      const [preguntaUsuario] = await tx
        .select({
          idPregunta: preguntasUsuarios.idPregunta,
          idPreguntaFaq: preguntasUsuarios.idPreguntaFaq,
        })
        .from(preguntasUsuarios)
        .where(eq(preguntasUsuarios.idPregunta, idPreguntaUsuario))
        .limit(1);

      if (!preguntaUsuario) {
        return null;
      }

      if (preguntaUsuario.idPreguntaFaq) {
        throw new Error("YA_CONVERTIDA");
      }

      const [categoria] = await tx
        .select({ idCategoria: categoriasAyuda.idCategoria })
        .from(categoriasAyuda)
        .where(eq(categoriasAyuda.idCategoria, idCategoria))
        .limit(1);

      if (!categoria) {
        throw new Error("CATEGORIA_NO_EXISTE");
      }

      const [creada] = await tx
        .insert(preguntasFrecuentes)
        .values({
          idCategoria,
          pregunta: String(body.pregunta).trim(),
          respuesta: String(body.respuesta).trim(),
          esDestacada: body.esDestacada === true,
          activo: true,
          orden: 0,
          tags: normalizarTags(body.tags),
          creadoPor: session.user.id,
          updatedAt: new Date().toISOString(),
        })
        .returning();

      await tx
        .update(preguntasUsuarios)
        .set({
          estado: "convertida_faq",
          idPreguntaFaq: creada.idPregunta,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(preguntasUsuarios.idPregunta, idPreguntaUsuario));

      return creada;
    });

    if (!faq) {
      return NextResponse.json(
        { error: "Pregunta no encontrada." },
        { status: 404 },
      );
    }

    return NextResponse.json(faq, { status: 201 });
  } catch (errorConversion: unknown) {
    if (errorConversion instanceof Error) {
      if (errorConversion.message === "YA_CONVERTIDA") {
        return NextResponse.json(
          { error: "Esta pregunta ya fue convertida en FAQ." },
          { status: 409 },
        );
      }

      if (errorConversion.message === "CATEGORIA_NO_EXISTE") {
        return NextResponse.json(
          { error: "La categoría seleccionada no existe." },
          { status: 400 },
        );
      }
    }

    console.error("Error al convertir pregunta en FAQ:", errorConversion);
    return NextResponse.json(
      { error: "No fue posible convertir la pregunta en FAQ." },
      { status: 500 },
    );
  }
}
