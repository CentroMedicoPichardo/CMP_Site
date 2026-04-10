// src/app/api/instructores/[id]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { instructores } from "@/lib/schema/index";
import { eq, sql } from "drizzle-orm";
import { withUserEmail, getUserEmailFromRequest } from "@/lib/db-with-user";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idNum = Number(id);

    if (isNaN(idNum)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const instructor = await db
      .select()
      .from(instructores)
      .where(eq(instructores.idInstructor, idNum))
      .limit(1);

    if (!instructor.length) {
      return NextResponse.json({ error: "Instructor no encontrado" }, { status: 404 });
    }

    return NextResponse.json(instructor[0]);
  } catch (error: any) {
    console.error("🔥 Error en GET Instructor:", error);
    return NextResponse.json({ error: "Error al obtener instructor", detalle: error.message }, { status: 500 });
  }
}

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
      nombre: body.nombre,
      apellidoPaterno: body.apellidoPaterno,
      apellidoMaterno: body.apellidoMaterno || null,
      especialidad: body.especialidad,
      edad: body.edad,
      telefono: body.telefono || null,
      correo: body.correo,
      direccion: body.direccion || null,
      activo: body.activo !== undefined ? body.activo : true,
      updatedAt: sql`CURRENT_TIMESTAMP`,
    };

    const actualizado = await withUserEmail(userEmail, async () => {
      return await db
        .update(instructores)
        .set(updateData)
        .where(eq(instructores.idInstructor, idNum))
        .returning();
    });

    if (!actualizado.length) {
      return NextResponse.json({ error: "Instructor no encontrado" }, { status: 404 });
    }

    return NextResponse.json(actualizado[0]);
  } catch (error: any) {
    console.error("🔥 ERROR PUT INSTRUCTOR:", error);
    return NextResponse.json({ error: "Error al actualizar instructor", detalle: error.message }, { status: 500 });
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

    const ocultado = await withUserEmail(userEmail, async () => {
      return await db
        .update(instructores)
        .set({ activo: false, updatedAt: sql`CURRENT_TIMESTAMP` })
        .where(eq(instructores.idInstructor, idNum))
        .returning();
    });

    if (!ocultado.length) {
      return NextResponse.json({ error: "Instructor no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ message: "Instructor ocultado correctamente" });
  } catch (error: any) {
    console.error("🔥 ERROR DELETE INSTRUCTOR:", error);
    return NextResponse.json({ error: "Error al ocultar instructor", detalle: error.message }, { status: 500 });
  }
}