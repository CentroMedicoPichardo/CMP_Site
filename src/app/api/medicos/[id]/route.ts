import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { medicos } from "@/lib/schema/index";
import { eq } from "drizzle-orm";

// --- GET POR ID ---
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    // Buscamos por el nuevo campo idMedico (mapeado a id_medico)
    const data = await db.select().from(medicos).where(eq(medicos.idMedico, Number(id)));
    
    if (!data.length) return NextResponse.json({ error: "Médico no encontrado" }, { status: 404 });
    return NextResponse.json(data[0]);
  } catch (error: any) {
    console.error("🔥 ERROR GET ID MEDICOS:", error);
    return NextResponse.json({ error: "Error de servidor", detalle: error.message }, { status: 500 });
  }
}

// --- ACTUALIZAR (PUT) ---
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const actualizado = await db.update(medicos)
      .set({
        // 🔄 Cambio clave: mapeo a los nuevos campos de nombre
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

    if (!actualizado.length) return NextResponse.json({ error: "No se pudo encontrar el médico para actualizar" }, { status: 404 });

    return NextResponse.json(actualizado[0]);
  } catch (error: any) {
    console.error("🔥 ERROR PUT MEDICOS:", error);
    return NextResponse.json({ error: "Error al actualizar", detalle: error.message }, { status: 500 });
  }
}

// --- ELIMINACIÓN LÓGICA (DELETE) ---
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    // Mantenemos la eliminación lógica (solo cambiar el estado a inactivo)
    const resultado = await db.update(medicos)
      .set({ activo: false })
      .where(eq(medicos.idMedico, Number(id)))
      .returning();

    if (!resultado.length) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

    return NextResponse.json({ message: "Médico desactivado correctamente" });
  } catch (error: any) {
    console.error("🔥 ERROR DELETE MEDICOS:", error);
    return NextResponse.json({ error: "Error al eliminar", detalle: error.message }, { status: 500 });
  }
}