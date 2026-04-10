// src/app/api/ubicaciones/[id]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ubicacionesCursos } from "@/lib/schema/index";
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
        .update(ubicacionesCursos)
        .set({
          nombreUbicacion: body.nombreUbicacion,
          direccionCompleta: body.direccionCompleta,
          capacidadMaxima: body.capacidadMaxima ? Number(body.capacidadMaxima) : null,
          activo: body.activo,
        })
        .where(eq(ubicacionesCursos.idUbicacion, idNum))
        .returning();
    });

    if (!actualizada.length) {
      return NextResponse.json({ error: "Ubicación no encontrada" }, { status: 404 });
    }

    return NextResponse.json(actualizada[0]);
  } catch (error: any) {
    console.error("🔥 ERROR PUT UBICACIÓN:", error);
    return NextResponse.json({ error: "Error al actualizar ubicación", detalle: error.message }, { status: 500 });
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

    const ocultada = await withUserEmail(userEmail, async () => {
      return await db
        .update(ubicacionesCursos)
        .set({ activo: false })
        .where(eq(ubicacionesCursos.idUbicacion, idNum))
        .returning();
    });

    if (!ocultada.length) {
      return NextResponse.json({ error: "Ubicación no encontrada" }, { status: 404 });
    }

    return NextResponse.json({ message: "Ubicación ocultada correctamente" });
  } catch (error: any) {
    console.error("🔥 ERROR DELETE UBICACIÓN:", error);
    return NextResponse.json({ error: "Error al ocultar ubicación", detalle: error.message }, { status: 500 });
  }
}