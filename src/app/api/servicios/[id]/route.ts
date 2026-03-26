// src/app/api/servicios/[id]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { servicios } from "@/lib/schema/index";
import { eq } from "drizzle-orm";
import { withAudit, getClientIp, getCurrentUserEmail } from "@/lib/db-audit";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const clientIp = getClientIp(request);
    const userEmail = await getCurrentUserEmail();

    const actualizado = await withAudit(userEmail, clientIp, async () => {
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

    return NextResponse.json(actualizado[0]);
  } catch (error: any) {
    console.error("🔥 ERROR PUT SERVICIO:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const clientIp = getClientIp(request);
    const userEmail = await getCurrentUserEmail();

    await withAudit(userEmail, clientIp, async () => {
      await db.update(servicios)
        .set({ activo: false })
        .where(eq(servicios.idServicio, Number(id)));
      return true;
    });
    
    return NextResponse.json({ message: "Servicio desactivado" });
  } catch (error: any) {
    console.error("🔥 ERROR DELETE SERVICIO:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}