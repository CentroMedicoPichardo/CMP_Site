// src/app/api/servicios/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { servicios } from "@/lib/schema/index";
import { asc, eq } from "drizzle-orm";
import { withUserEmail, getUserEmailFromRequest } from "@/lib/db-with-user";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const isAdmin = searchParams.get("admin") === "true";

  try {
    if (!isAdmin) {
      const data = await db
        .select()
        .from(servicios)
        .where(eq(servicios.activo, true))
        .orderBy(asc(servicios.tituloServicio));
      return NextResponse.json(data);
    }
    
    const data = await db
      .select()
      .from(servicios)
      .orderBy(asc(servicios.tituloServicio));
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error API Servicios:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userEmail = getUserEmailFromRequest(request);

    console.log("========== POST SERVICIO ==========");
    console.log("📧 Email usuario:", userEmail);
    console.log("📦 Datos:", body);

    const nuevo = await withUserEmail(userEmail, async () => {
      return await db.insert(servicios).values({
        tituloServicio: body.tituloServicio,
        descripcion: body.descripcion,
        ubicacion: body.ubicacion,
        urlImage: body.urlImage || "/default-service.jpg",
        textoAlt: body.textoAlt || body.tituloServicio,
        disenoTipo: body.disenoTipo || "vertical",
        activo: true,
      }).returning();
    });

    console.log("🟢 POST SERVICIO - Servicio creado ID:", nuevo[0]?.idServicio);
    return NextResponse.json(nuevo[0], { status: 201 });
  } catch (error: any) {
    console.error("🔥 ERROR POST SERVICIO:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}