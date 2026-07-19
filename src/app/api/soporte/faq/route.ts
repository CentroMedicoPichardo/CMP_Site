// src/app/api/soporte/faq/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { preguntasFrecuentes, categoriasAyuda } from "@/lib/schema/index";
import { eq, asc, and, like, or, SQL } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoria = searchParams.get("categoria");
    const busqueda = searchParams.get("busqueda");

    // Iniciar con la condición base
    let where: SQL<unknown> = eq(preguntasFrecuentes.activo, true);

    // Filtrar por categoría
    if (categoria && categoria !== "null") {
      where = and(where, eq(preguntasFrecuentes.idCategoria, parseInt(categoria)))!;
    }

    // Búsqueda por texto
    if (busqueda) {
      where = and(
        where,
        or(
          like(preguntasFrecuentes.pregunta, `%${busqueda}%`),
          like(preguntasFrecuentes.respuesta, `%${busqueda}%`)
        )
      )!;
    }

    const faqs = await db
      .select({
        idPregunta: preguntasFrecuentes.idPregunta,
        pregunta: preguntasFrecuentes.pregunta,
        respuesta: preguntasFrecuentes.respuesta,
        vecesUtil: preguntasFrecuentes.vecesUtil,
        vecesNoUtil: preguntasFrecuentes.vecesNoUtil,
        esDestacada: preguntasFrecuentes.esDestacada,
        tags: preguntasFrecuentes.tags,
        orden: preguntasFrecuentes.orden,
        categoria: {
          idCategoria: categoriasAyuda.idCategoria,
          nombreCategoria: categoriasAyuda.nombreCategoria,
          icono: categoriasAyuda.icono,
        },
      })
      .from(preguntasFrecuentes)
      .leftJoin(
        categoriasAyuda,
        eq(preguntasFrecuentes.idCategoria, categoriasAyuda.idCategoria)
      )
      .where(where)
      .orderBy(asc(preguntasFrecuentes.orden));

    return NextResponse.json(faqs);
  } catch (error) {
    console.error("Error al obtener FAQ:", error);
    return NextResponse.json(
      { error: "Error al obtener preguntas frecuentes" },
      { status: 500 }
    );
  }
}