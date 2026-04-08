// src/app/api/saber-pediatrico/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { contenidoSaberPediatrico } from '@/lib/schema/index';
import { desc, eq, and, sql } from 'drizzle-orm';
import { withUserEmail, getUserEmailFromRequest } from '@/lib/db-with-user';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get('tipo');
    const categoria = searchParams.get('categoria');
    const destacado = searchParams.get('destacado');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Construir filtros
    const filters = [];
    filters.push(eq(contenidoSaberPediatrico.activo, true));
    
    if (tipo && tipo !== 'todos') {
      filters.push(eq(contenidoSaberPediatrico.tipo, tipo));
    }
    if (categoria && categoria !== 'todas') {
      filters.push(eq(contenidoSaberPediatrico.categoria, categoria));
    }
    if (destacado === 'true') {
      filters.push(eq(contenidoSaberPediatrico.destacado, true));
    }

    const data = await db
      .select()
      .from(contenidoSaberPediatrico)
      .where(and(...filters))
      .orderBy(desc(contenidoSaberPediatrico.destacado), desc(contenidoSaberPediatrico.fechaPublicacion))
      .limit(limit)
      .offset(offset);

    // Contar total para paginación
    const total = await db
      .select({ count: sql<number>`count(*)` })
      .from(contenidoSaberPediatrico)
      .where(and(...filters));

    return NextResponse.json({
      data,
      total: total[0]?.count || 0,
      limit,
      offset
    });
  } catch (error: any) {
    console.error('Error en GET contenido:', error);
    return NextResponse.json(
      { error: 'Error al obtener contenido', detalle: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userEmail = getUserEmailFromRequest(request);

    console.log("========== POST SABER PEDIÁTRICO ==========");
    console.log("📧 Email usuario:", userEmail);
    console.log("📦 Datos:", body);

    // Validar campos requeridos
    if (!body.tipo || !body.titulo) {
      return NextResponse.json(
        { error: "Faltan campos requeridos: tipo y titulo" },
        { status: 400 }
      );
    }

    const nuevo = await withUserEmail(userEmail, async () => {
      return await db.insert(contenidoSaberPediatrico).values({
        tipo: body.tipo,
        titulo: body.titulo,
        descripcion: body.descripcion || null,
        contenido: body.contenido || null,
        urlExterno: body.urlExterno || null,
        imagenUrl: body.imagenUrl || null,
        videoUrl: body.videoUrl || null,
        archivoUrl: body.archivoUrl || null,
        categoria: body.categoria || null,
        etiquetas: body.etiquetas || [],
        duracion: body.duracion || null,
        fechaPublicacion: body.fechaPublicacion || new Date().toISOString().split('T')[0],
        destacado: body.destacado || false,
        orden: body.orden || 0,
        activo: true,
      }).returning();
    });

    console.log("🟢 POST - Contenido creado ID:", nuevo[0]?.id);
    return NextResponse.json(nuevo[0], { status: 201 });
  } catch (error: any) {
    console.error("🔥 Error en POST Saber Pediátrico:", error);
    return NextResponse.json(
      { error: "Error al crear contenido", details: error.message },
      { status: 500 }
    );
  }
}