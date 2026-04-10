// src/app/api/categorias/[id]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { categoriasCursos } from "@/lib/schema/index";
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
        .update(categoriasCursos)
        .set({
          nombreCategoria: body.nombreCategoria,
          descripcion: body.descripcion,
          activo: body.activo,
        })
        .where(eq(categoriasCursos.idCategoria, idNum))
        .returning();
    });

    if (!actualizada.length) {
      return NextResponse.json({ error: "Categoría no encontrada" }, { status: 404 });
    }

    return NextResponse.json(actualizada[0]);
  } catch (error: any) {
    console.error("🔥 ERROR PUT CATEGORÍA:", error);
    return NextResponse.json({ error: "Error al actualizar categoría", detalle: error.message }, { status: 500 });
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
        .update(categoriasCursos)
        .set({ activo: false })
        .where(eq(categoriasCursos.idCategoria, idNum))
        .returning();
    });

    if (!ocultada.length) {
      return NextResponse.json({ error: "Categoría no encontrada" }, { status: 404 });
    }

    return NextResponse.json({ message: "Categoría ocultada correctamente" });
  } catch (error: any) {
    console.error("🔥 ERROR DELETE CATEGORÍA:", error);
    return NextResponse.json({ error: "Error al ocultar categoría", detalle: error.message }, { status: 500 });
  }
}