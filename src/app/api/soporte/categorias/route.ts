// src/app/api/soporte/categorias/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { categoriasAyuda } from "@/lib/schema/index";
import { eq, asc } from "drizzle-orm";

export async function GET() {
  try {
    const result = await db
      .select()
      .from(categoriasAyuda)
      .where(eq(categoriasAyuda.activo, true))
      .orderBy(asc(categoriasAyuda.orden));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    return NextResponse.json(
      { error: "Error al obtener categorías de ayuda" },
      { status: 500 }
    );
  }
}