import { NextRequest, NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { requireApiRole } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  categoriasAyuda,
  preguntasFrecuentes,
} from "@/lib/schema/index";
import {
  normalizarTags,
  parseEnteroNoNegativo,
  parseIdPositivo,
  validarPreguntaFaq,
  validarRespuestaFaq,
} from "@/lib/soporte/validaciones";
import type { ActualizarFaqDTO } from "@/types/help";

export async function PATCH(
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
        { error: "El identificador de la FAQ no es válido." },
        { status: 400 },
      );
    }

    const body = (await request.json()) as ActualizarFaqDTO;
    const cambios: {
      idCategoria?: number;
      pregunta?: string;
      respuesta?: string;
      orden?: number;
      activo?: boolean;
      esDestacada?: boolean;
      tags?: string[] | null;
      updatedAt: string;
    } = { updatedAt: new Date().toISOString() };

    if (body.idCategoria !== undefined) {
      const idCategoria = parseIdPositivo(body.idCategoria);
      if (idCategoria === null) {
        return NextResponse.json(
          { error: "La categoría seleccionada no es válida." },
          { status: 400 },
        );
      }

      const [categoria] = await db
        .select({ idCategoria: categoriasAyuda.idCategoria })
        .from(categoriasAyuda)
        .where(eq(categoriasAyuda.idCategoria, idCategoria))
        .limit(1);

      if (!categoria) {
        return NextResponse.json(
          { error: "La categoría seleccionada no existe." },
          { status: 400 },
        );
      }
      cambios.idCategoria = idCategoria;
    }

    if (body.pregunta !== undefined) {
      const errorPregunta = validarPreguntaFaq(body.pregunta);
      if (errorPregunta) {
        return NextResponse.json(
          { error: errorPregunta },
          { status: 400 },
        );
      }
      cambios.pregunta = body.pregunta.trim();
    }

    if (body.respuesta !== undefined) {
      const errorRespuesta = validarRespuestaFaq(body.respuesta);
      if (errorRespuesta) {
        return NextResponse.json(
          { error: errorRespuesta },
          { status: 400 },
        );
      }
      cambios.respuesta = body.respuesta.trim();
    }

    if (body.orden !== undefined) {
      cambios.orden = parseEnteroNoNegativo(body.orden, 0);
    }
    if (body.activo !== undefined) {
      cambios.activo = body.activo === true;
    }
    if (body.esDestacada !== undefined) {
      cambios.esDestacada = body.esDestacada === true;
    }
    if (body.tags !== undefined) {
      cambios.tags = normalizarTags(body.tags);
    }

    const [actualizada] = await db
      .update(preguntasFrecuentes)
      .set(cambios)
      .where(eq(preguntasFrecuentes.idPregunta, idPregunta))
      .returning();

    if (!actualizada) {
      return NextResponse.json(
        { error: "FAQ no encontrada." },
        { status: 404 },
      );
    }

    return NextResponse.json(actualizada);
  } catch (errorActualizacion: unknown) {
    console.error("Error al actualizar FAQ:", errorActualizacion);
    return NextResponse.json(
      { error: "No fue posible actualizar la FAQ." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
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
        { error: "El identificador de la FAQ no es válido." },
        { status: 400 },
      );
    }

    const [referencias] = await db
      .select({
        valoraciones: sql<number>`(
          SELECT count(*)::int
          FROM soporte.valoraciones_faq v
          WHERE v.id_pregunta_faq = ${idPregunta}
        )`,
        preguntas: sql<number>`(
          SELECT count(*)::int
          FROM soporte.preguntas_usuarios p
          WHERE p.id_pregunta_faq = ${idPregunta}
        )`,
      })
      .from(preguntasFrecuentes)
      .where(eq(preguntasFrecuentes.idPregunta, idPregunta))
      .limit(1);

    if (!referencias) {
      return NextResponse.json(
        { error: "FAQ no encontrada." },
        { status: 404 },
      );
    }

    if (referencias.valoraciones > 0 || referencias.preguntas > 0) {
      return NextResponse.json(
        {
          error:
            "La FAQ tiene valoraciones o solicitudes relacionadas. Desactívala en lugar de eliminarla.",
        },
        { status: 409 },
      );
    }

    await db
      .delete(preguntasFrecuentes)
      .where(eq(preguntasFrecuentes.idPregunta, idPregunta));

    return NextResponse.json({ mensaje: "FAQ eliminada." });
  } catch (errorEliminacion: unknown) {
    console.error("Error al eliminar FAQ:", errorEliminacion);
    return NextResponse.json(
      { error: "No fue posible eliminar la FAQ." },
      { status: 500 },
    );
  }
}
