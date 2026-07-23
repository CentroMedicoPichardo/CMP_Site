import { NextRequest, NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { requireApiAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  preguntasFrecuentes,
  valoracionesFaq,
} from "@/lib/schema/index";
import { parseIdPositivo } from "@/lib/soporte/validaciones";

class ValoracionDuplicadaError extends Error {}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error } = await requireApiAuth();

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

    const body = (await request.json()) as { esUtil?: unknown };

    if (typeof body.esUtil !== "boolean") {
      return NextResponse.json(
        { error: "La valoración debe indicar si fue útil o no." },
        { status: 400 },
      );
    }

    const esUtil = body.esUtil;

    const resultado = await db.transaction(async (tx) => {
      const [faq] = await tx
        .select({
          idPregunta: preguntasFrecuentes.idPregunta,
          activo: preguntasFrecuentes.activo,
        })
        .from(preguntasFrecuentes)
        .where(eq(preguntasFrecuentes.idPregunta, idPregunta))
        .limit(1);

      if (!faq || !faq.activo) {
        return null;
      }

      const insertadas = await tx
        .insert(valoracionesFaq)
        .values({
          idPreguntaFaq: idPregunta,
          idUsuario: session.user.id,
          esUtil: esUtil,
        })
        .onConflictDoNothing({
          target: [
            valoracionesFaq.idPreguntaFaq,
            valoracionesFaq.idUsuario,
          ],
        })
        .returning({ idValoracion: valoracionesFaq.idValoracion });

      if (insertadas.length === 0) {
        throw new ValoracionDuplicadaError();
      }

      const [actualizada] = await tx
        .update(preguntasFrecuentes)
        .set(
          esUtil
            ? {
                vecesUtil: sql<number>`COALESCE(${preguntasFrecuentes.vecesUtil}, 0) + 1`,
                updatedAt: sql`CURRENT_TIMESTAMP`,
              }
            : {
                vecesNoUtil: sql<number>`COALESCE(${preguntasFrecuentes.vecesNoUtil}, 0) + 1`,
                updatedAt: sql`CURRENT_TIMESTAMP`,
              },
        )
        .where(eq(preguntasFrecuentes.idPregunta, idPregunta))
        .returning({
          vecesUtil: preguntasFrecuentes.vecesUtil,
          vecesNoUtil: preguntasFrecuentes.vecesNoUtil,
        });

      return actualizada;
    });

    if (!resultado) {
      return NextResponse.json(
        { error: "La FAQ no existe o no está disponible." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      mensaje: "Valoración registrada correctamente.",
      esUtil: esUtil,
      vecesUtil: resultado.vecesUtil ?? 0,
      vecesNoUtil: resultado.vecesNoUtil ?? 0,
    });
  } catch (errorValoracion: unknown) {
    if (errorValoracion instanceof ValoracionDuplicadaError) {
      return NextResponse.json(
        { error: "Ya has valorado esta FAQ." },
        { status: 409 },
      );
    }

    console.error("Error al valorar FAQ:", errorValoracion);
    return NextResponse.json(
      { error: "No fue posible registrar la valoración." },
      { status: 500 },
    );
  }
}
