// src/app/api/ubicaciones/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ubicacionesCursos } from "@/lib/schema/index";
import { desc, eq, and } from "drizzle-orm";
import { withUserEmail, getUserEmailFromRequest } from "@/lib/db-with-user";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get("admin") === "true";

    const filtros: any[] = [];
    if (!isAdmin) filtros.push(eq(ubicacionesCursos.activo, true));

    const data = await db
      .select()
      .from(ubicacionesCursos)
      .where(filtros.length ? and(...filtros) : undefined)
      .orderBy(desc(ubicacionesCursos.idUbicacion));

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("🔥 Error en GET Ubicaciones:", error);
    return NextResponse.json({ error: "Error al obtener ubicaciones", detalle: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userEmail = getUserEmailFromRequest(request);

    if (!body.nombreUbicacion) {
      return NextResponse.json({ error: "El nombre de la ubicación es requerido" }, { status: 400 });
    }

    const nueva = await withUserEmail(userEmail, async () => {
      return await db.insert(ubicacionesCursos).values({
        nombreUbicacion: body.nombreUbicacion,
        direccionCompleta: body.direccionCompleta || null,
        capacidadMaxima: body.capacidadMaxima ? Number(body.capacidadMaxima) : null,
        activo: true,
      }).returning();
    });

    if (!nueva.length || !nueva[0]) {
      return NextResponse.json({ error: "Error al crear ubicación" }, { status: 500 });
    }

    return NextResponse.json(nueva[0], { status: 201 });
  } catch (error: any) {
    console.error("🔥 Error en POST Ubicación:", error);
    return NextResponse.json({ error: "Error al crear ubicación", details: error.message }, { status: 500 });
  }
}