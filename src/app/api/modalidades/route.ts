// src/app/api/modalidades/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { modalidades } from "@/lib/schema/index";
import { desc } from "drizzle-orm";
import { withUserEmail, getUserEmailFromRequest } from "@/lib/db-with-user";

export async function GET() {
  try {
    const data = await db
      .select()
      .from(modalidades)
      .orderBy(desc(modalidades.idModalidad));

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("🔥 Error en GET Modalidades:", error);
    return NextResponse.json({ error: "Error al obtener modalidades", detalle: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userEmail = getUserEmailFromRequest(request);

    if (!body.nombreModalidad) {
      return NextResponse.json({ error: "El nombre de la modalidad es requerido" }, { status: 400 });
    }

    const nueva = await withUserEmail(userEmail, async () => {
      return await db.insert(modalidades).values({
        nombreModalidad: body.nombreModalidad,
        descripcion: body.descripcion || null,
      }).returning();
    });

    if (!nueva.length || !nueva[0]) {
      return NextResponse.json({ error: "Error al crear modalidad" }, { status: 500 });
    }

    return NextResponse.json(nueva[0], { status: 201 });
  } catch (error: any) {
    console.error("🔥 Error en POST Modalidad:", error);
    return NextResponse.json({ error: "Error al crear modalidad", details: error.message }, { status: 500 });
  }
}