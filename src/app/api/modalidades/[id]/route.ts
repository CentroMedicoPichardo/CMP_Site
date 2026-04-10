// src/app/api/modalidades/[id]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { modalidades } from "@/lib/schema/index";
import { eq } from "drizzle-orm";
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

    const actualizada = await withUserEmail(userEmail, async () => {
      return await db
        .update(modalidades)
        .set({
          nombreModalidad: body.nombreModalidad,
          descripcion: body.descripcion,
        })
        .where(eq(modalidades.idModalidad, idNum))
        .returning();
    });

    if (!actualizada.length) {
      return NextResponse.json({ error: "Modalidad no encontrada" }, { status: 404 });
    }

    return NextResponse.json(actualizada[0]);
  } catch (error: any) {
    console.error("🔥 ERROR PUT MODALIDAD:", error);
    return NextResponse.json({ error: "Error al actualizar modalidad", detalle: error.message }, { status: 500 });
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

    const eliminada = await withUserEmail(userEmail, async () => {
      return await db
        .delete(modalidades)
        .where(eq(modalidades.idModalidad, idNum))
        .returning();
    });

    if (!eliminada.length) {
      return NextResponse.json({ error: "Modalidad no encontrada" }, { status: 404 });
    }

    return NextResponse.json({ message: "Modalidad eliminada correctamente" });
  } catch (error: any) {
    console.error("🔥 ERROR DELETE MODALIDAD:", error);
    return NextResponse.json({ error: "Error al eliminar modalidad", detalle: error.message }, { status: 500 });
  }
}