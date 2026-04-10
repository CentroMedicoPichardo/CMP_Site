// src/app/api/categorias/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { categoriasCursos } from "@/lib/schema/index";
import { desc, eq, and } from "drizzle-orm";
import { withUserEmail, getUserEmailFromRequest } from "@/lib/db-with-user";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get("admin") === "true";
    const search = searchParams.get("search");

    const filtros: any[] = [];
    if (!isAdmin) filtros.push(eq(categoriasCursos.activo, true));
    if (search) filtros.push(eq(categoriasCursos.nombreCategoria, search));

    const data = await db
      .select()
      .from(categoriasCursos)
      .where(filtros.length ? and(...filtros) : undefined)
      .orderBy(desc(categoriasCursos.idCategoria));

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("🔥 Error en GET Categorías:", error);
    return NextResponse.json({ error: "Error al obtener categorías", detalle: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userEmail = getUserEmailFromRequest(request);

    if (!body.nombreCategoria) {
      return NextResponse.json({ error: "El nombre de la categoría es requerido" }, { status: 400 });
    }

    const nueva = await withUserEmail(userEmail, async () => {
      return await db.insert(categoriasCursos).values({
        nombreCategoria: body.nombreCategoria,
        descripcion: body.descripcion || null,
        activo: true,
      }).returning();
    });

    if (!nueva.length || !nueva[0]) {
      return NextResponse.json({ error: "Error al crear categoría" }, { status: 500 });
    }

    return NextResponse.json(nueva[0], { status: 201 });
  } catch (error: any) {
    console.error("🔥 Error en POST Categoría:", error);
    return NextResponse.json({ error: "Error al crear categoría", details: error.message }, { status: 500 });
  }
}