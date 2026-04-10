// src/app/api/inscripciones/[id]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { inscripcionesCursos, cursos } from "@/lib/schema/index";
import { eq, sql } from "drizzle-orm";
import { withUserEmail, getUserEmailFromRequest } from "@/lib/db-with-user";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const idNum = Number(id);
    const userEmail = getUserEmailFromRequest(request);

    if (isNaN(idNum)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const updateData: any = {
      estado: body.estado,
    };

    if (body.montoPagado !== undefined && body.montoPagado !== null && body.montoPagado !== "") {
      updateData.montoPagado = body.montoPagado.toString();
    } else {
      updateData.montoPagado = null;
    }

    if (body.metodoPago !== undefined && body.metodoPago !== null && body.metodoPago !== "") {
      updateData.metodoPago = body.metodoPago;
    } else {
      updateData.metodoPago = null;
    }

    const actualizada = await withUserEmail(userEmail, async () => {
      return await db
        .update(inscripcionesCursos)
        .set(updateData)
        .where(eq(inscripcionesCursos.idInscripcion, idNum))
        .returning();
    });

    if (!actualizada.length) {
      return NextResponse.json({ error: "Inscripción no encontrada" }, { status: 404 });
    }

    return NextResponse.json(actualizada[0]);
  } catch (error: any) {
    console.error("🔥 ERROR PUT INSCRIPCIÓN:", error);
    return NextResponse.json({ error: "Error al actualizar inscripción", detalle: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idNum = Number(id);
    const userEmail = getUserEmailFromRequest(request);

    if (isNaN(idNum)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    // Obtener la inscripción antes de eliminarla
    const inscripcion = await db
      .select({ cursoId: inscripcionesCursos.cursoId })
      .from(inscripcionesCursos)
      .where(eq(inscripcionesCursos.idInscripcion, idNum))
      .limit(1);

    if (!inscripcion.length) {
      return NextResponse.json({ error: "Inscripción no encontrada" }, { status: 404 });
    }

    const eliminada = await withUserEmail(userEmail, async () => {
      return await db.transaction(async (tx) => {
        // Eliminar inscripción
        const resultado = await tx
          .delete(inscripcionesCursos)
          .where(eq(inscripcionesCursos.idInscripcion, idNum))
          .returning();

        // Actualizar cupos ocupados (solo si no es nulo)
        await tx
          .update(cursos)
          .set({ cuposOcupados: sql`${cursos.cuposOcupados} - 1` })
          .where(eq(cursos.idCurso, inscripcion[0].cursoId));

        return resultado;
      });
    });

    return NextResponse.json({ message: "Inscripción eliminada correctamente" });
  } catch (error: any) {
    console.error("🔥 ERROR DELETE INSCRIPCIÓN:", error);
    return NextResponse.json({ error: "Error al eliminar inscripción", detalle: error.message }, { status: 500 });
  }
}