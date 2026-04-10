// src/app/api/instructores/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { instructores } from "@/lib/schema/index";
import { desc, eq, and } from "drizzle-orm";
import { withUserEmail, getUserEmailFromRequest } from "@/lib/db-with-user";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get("admin") === "true";
    const especialidad = searchParams.get("especialidad");

    const filtros: any[] = [];
    if (!isAdmin) filtros.push(eq(instructores.activo, true));
    if (especialidad) filtros.push(eq(instructores.especialidad, especialidad));

    const data = await db
      .select()
      .from(instructores)
      .where(filtros.length ? and(...filtros) : undefined)
      .orderBy(desc(instructores.idInstructor));

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("🔥 Error en GET Instructores:", error);
    return NextResponse.json({ error: "Error al obtener instructores", detalle: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userEmail = getUserEmailFromRequest(request);

    // Validar campos requeridos
    if (!body.nombre || !body.apellidoPaterno || !body.especialidad || !body.edad || !body.correo) {
      return NextResponse.json({ 
        error: "Faltan campos requeridos", 
        details: "nombre, apellidoPaterno, especialidad, edad y correo son obligatorios" 
      }, { status: 400 });
    }

    const nuevo = await withUserEmail(userEmail, async () => {
      return await db.insert(instructores).values({
        nombre: body.nombre,
        apellidoPaterno: body.apellidoPaterno,
        apellidoMaterno: body.apellidoMaterno || null,
        especialidad: body.especialidad,
        edad: Number(body.edad),
        telefono: body.telefono || null,
        correo: body.correo,
        direccion: body.direccion || null,
        activo: true,
      }).returning();
    });

    if (!nuevo.length || !nuevo[0]) {
      return NextResponse.json({ error: "Error al crear instructor" }, { status: 500 });
    }

    return NextResponse.json(nuevo[0], { status: 201 });
  } catch (error: any) {
    console.error("🔥 Error en POST Instructor:", error);
    return NextResponse.json({ error: "Error al crear instructor", details: error.message }, { status: 500 });
  }
}