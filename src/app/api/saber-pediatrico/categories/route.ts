// src/app/api/saber-pediatrico/categories/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { contenidoSaberPediatrico } from '@/lib/schema/index';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    const categorias = await db
      .select({
        categoria: contenidoSaberPediatrico.categoria,
        count: sql<number>`count(*)`,
      })
      .from(contenidoSaberPediatrico)
      .where(sql`${contenidoSaberPediatrico.activo} = true AND ${contenidoSaberPediatrico.categoria} IS NOT NULL`)
      .groupBy(contenidoSaberPediatrico.categoria)
      .orderBy(contenidoSaberPediatrico.categoria);

    const tipos = await db
      .select({
        tipo: contenidoSaberPediatrico.tipo,
        count: sql<number>`count(*)`,
      })
      .from(contenidoSaberPediatrico)
      .where(sql`${contenidoSaberPediatrico.activo} = true`)
      .groupBy(contenidoSaberPediatrico.tipo)
      .orderBy(contenidoSaberPediatrico.tipo);

    return NextResponse.json({
      categorias,
      tipos
    });
  } catch (error: any) {
    console.error("Error en GET categorías:", error);
    return NextResponse.json(
      { error: "Error al obtener categorías" },
      { status: 500 }
    );
  }
}