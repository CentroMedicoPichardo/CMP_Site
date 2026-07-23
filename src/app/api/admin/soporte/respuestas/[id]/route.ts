import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { requireApiRole } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  preguntasUsuarios,
  respuestasAyuda,
} from "@/lib/schema/index";
import { parseIdPositivo } from "@/lib/soporte/validaciones";

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
    const idRespuesta = parseIdPositivo(id);

    if (idRespuesta === null) {
      return NextResponse.json(
        { error: "El identificador de la respuesta no es válido." },
        { status: 400 },
      );
    }

    const body = (await request.json()) as { esSolucion?: unknown };

    if (typeof body.esSolucion !== "boolean") {
      return NextResponse.json(
        { error: "Debes indicar si la respuesta es la solución." },
        { status: 400 },
      );
    }

    const esSolucion = body.esSolucion;

    const actualizada = await db.transaction(async (tx) => {
      const [respuesta] = await tx
        .select({
          idRespuesta: respuestasAyuda.idRespuesta,
          idPregunta: respuestasAyuda.idPregunta,
        })
        .from(respuestasAyuda)
        .where(eq(respuestasAyuda.idRespuesta, idRespuesta))
        .limit(1);

      if (!respuesta) {
        return null;
      }

      if (esSolucion) {
        await tx
          .update(respuestasAyuda)
          .set({ esSolucion: false })
          .where(eq(respuestasAyuda.idPregunta, respuesta.idPregunta));
      }

      const [resultado] = await tx
        .update(respuestasAyuda)
        .set({ esSolucion: esSolucion })
        .where(eq(respuestasAyuda.idRespuesta, idRespuesta))
        .returning();

      if (esSolucion) {
        await tx
          .update(preguntasUsuarios)
          .set({
            estado: "respondida",
            updatedAt: new Date().toISOString(),
          })
          .where(eq(preguntasUsuarios.idPregunta, respuesta.idPregunta));
      }

      return resultado;
    });

    if (!actualizada) {
      return NextResponse.json(
        { error: "Respuesta no encontrada." },
        { status: 404 },
      );
    }

    return NextResponse.json(actualizada);
  } catch (errorActualizacion: unknown) {
    console.error("Error al actualizar solución:", errorActualizacion);
    return NextResponse.json(
      { error: "No fue posible actualizar la solución." },
      { status: 500 },
    );
  }
}
