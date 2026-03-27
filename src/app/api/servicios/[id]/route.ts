// src/app/api/servicios/[id]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { servicios } from "@/lib/schema/index";
import { eq } from "drizzle-orm";
import { withUserEmail, getUserEmailFromRequest } from "@/lib/db-with-user";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const userEmail = getUserEmailFromRequest(request);

    console.log("========== PUT SERVICIO ==========");
    console.log("📧 Email usuario:", userEmail);
    console.log("📦 Datos:", body);

    const actualizado = await withUserEmail(userEmail, async () => {
      return await db.update(servicios)
        .set({
          tituloServicio: body.tituloServicio,
          descripcion: body.descripcion,
          ubicacion: body.ubicacion,
          urlImage: body.urlImage,
          textoAlt: body.textoAlt,
          disenoTipo: body.disenoTipo,
          activo: body.activo ?? true,
        })
        .where(eq(servicios.idServicio, Number(id)))
        .returning();
    });

    if (!actualizado.length) {
      return NextResponse.json({ error: "Servicio no encontrado" }, { status: 404 });
    }

    return NextResponse.json(actualizado[0]);
  } catch (error: any) {
    console.error("🔥 ERROR PUT SERVICIO:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userEmail = getUserEmailFromRequest(request);

    console.log("========== DELETE SERVICIO ==========");
    console.log("📧 Email usuario:", userEmail);

    const resultado = await withUserEmail(userEmail, async () => {
      return await db.update(servicios)
        .set({ activo: false })
        .where(eq(servicios.idServicio, Number(id)))
        .returning();
    });

    if (!resultado.length) {
      return NextResponse.json({ error: "Servicio no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ message: "Servicio desactivado correctamente" });
  } catch (error: any) {
    console.error("🔥 ERROR DELETE SERVICIO:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}