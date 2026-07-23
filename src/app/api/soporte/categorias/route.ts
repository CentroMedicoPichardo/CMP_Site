import { NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { categoriasAyuda } from "@/lib/schema/index";

export async function GET() {
  try {
    const categorias = await db
      .select()
      .from(categoriasAyuda)
      .where(eq(categoriasAyuda.activo, true))
      .orderBy(
        asc(categoriasAyuda.orden),
        asc(categoriasAyuda.nombreCategoria),
      );

    return NextResponse.json(categorias);
  } catch (error: unknown) {
    console.error("Error al obtener categorías:", error);
    return NextResponse.json(
      { error: "No fue posible obtener las categorías de ayuda." },
      { status: 500 },
    );
  }
}
