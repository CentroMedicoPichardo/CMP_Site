// src/app/api/saber-pediatrico/categories/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contenidoSaberPediatrico } from "@/lib/schema/index";
import { asc, and, eq, isNotNull, sql } from "drizzle-orm";

function numero(valor: unknown) {
  const convertido = Number(valor);
  return Number.isFinite(convertido) ? convertido : 0;
}

export async function GET() {
  try {
    const categorias = await db
      .select({
        categoria: contenidoSaberPediatrico.categoria,
        count: sql<number>`count(*)::int`,
      })
      .from(contenidoSaberPediatrico)
      .where(
        and(
          eq(contenidoSaberPediatrico.activo, true),
          isNotNull(contenidoSaberPediatrico.categoria)
        )
      )
      .groupBy(contenidoSaberPediatrico.categoria)
      .orderBy(asc(contenidoSaberPediatrico.categoria));

    const tipos = await db
      .select({
        tipo: contenidoSaberPediatrico.tipo,
        count: sql<number>`count(*)::int`,
      })
      .from(contenidoSaberPediatrico)
      .where(eq(contenidoSaberPediatrico.activo, true))
      .groupBy(contenidoSaberPediatrico.tipo)
      .orderBy(asc(contenidoSaberPediatrico.tipo));

    return NextResponse.json(
      {
        categorias: categorias.map((item) => ({
          categoria: item.categoria,
          count: numero(item.count),
        })),
        tipos: tipos.map((item) => ({
          tipo: item.tipo,
          count: numero(item.count),
        })),
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Error en GET categorías saber pediátrico:", error);

    return NextResponse.json(
      { error: "Error al obtener categorías" },
      { status: 500 }
    );
  }
}