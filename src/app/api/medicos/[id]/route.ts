// src/app/api/medicos/[id]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { medicos } from "@/lib/schema/index";
import { eq } from "drizzle-orm";
import { withUserEmail, getUserEmailFromRequest } from "@/lib/db-with-user";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await db.select().from(medicos).where(eq(medicos.idMedico, Number(id)));
    
    if (!data.length) return NextResponse.json({ error: "Médico no encontrado" }, { status: 404 });
    return NextResponse.json(data[0]);
  } catch (error: any) {
    console.error("🔥 ERROR GET ID MEDICOS:", error);
    return NextResponse.json({ error: "Error de servidor", detalle: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const userEmail = getUserEmailFromRequest(request);

    console.log("========== PUT MEDICO ==========");
    console.log("📧 Email usuario:", userEmail);
    console.log("📦 Datos:", body);

    const actualizado = await withUserEmail(userEmail, async () => {
      return await db.update(medicos)
        .set({
          nombres: body.nombres,
          apellidoPaterno: body.apellidoPaterno,
          apellidoMaterno: body.apellidoMaterno,
          especialidad: body.especialidad,
          hospitalClinica: body.hospitalClinica,
          direccion: body.direccion,
          urlFoto: body.urlFoto,
          activo: body.activo ?? true,
        })
        .where(eq(medicos.idMedico, Number(id)))
        .returning();
    });

    if (!actualizado.length) {
      return NextResponse.json({ error: "Médico no encontrado" }, { status: 404 });
    }

    return NextResponse.json(actualizado[0]);
  } catch (error: any) {
    console.error("🔥 ERROR PUT MEDICO:", error);
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

    console.log("========== DELETE MEDICO ==========");
    console.log("📧 Email usuario:", userEmail);

    const resultado = await withUserEmail(userEmail, async () => {
      return await db.update(medicos)
        .set({ activo: false })
        .where(eq(medicos.idMedico, Number(id)))
        .returning();
    });

    if (!resultado.length) {
      return NextResponse.json({ error: "Médico no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ message: "Médico desactivado correctamente" });
  } catch (error: any) {
    console.error("🔥 ERROR DELETE MEDICOS:", error);
    return NextResponse.json({ error: "Error al eliminar", detalle: error.message }, { status: 500 });
  }
}