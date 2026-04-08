// src/app/api/saber-pediatrico/[id]/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { contenidoSaberPediatrico } from '@/lib/schema/index';
import { eq } from 'drizzle-orm';
import { withUserEmail, getUserEmailFromRequest } from '@/lib/db-with-user';

// GET - Obtener un contenido por ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idNum = Number(id);

    if (isNaN(idNum)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const data = await db
      .select()
      .from(contenidoSaberPediatrico)
      .where(eq(contenidoSaberPediatrico.id, idNum));

    if (!data.length) {
      return NextResponse.json({ error: "Contenido no encontrado" }, { status: 404 });
    }

    // Incrementar visualizaciones
    await db
      .update(contenidoSaberPediatrico)
      .set({ visualizaciones: (data[0].visualizaciones || 0) + 1 })
      .where(eq(contenidoSaberPediatrico.id, idNum));

    return NextResponse.json(data[0]);
  } catch (error: any) {
    console.error("Error en GET contenido por ID:", error);
    return NextResponse.json(
      { error: "Error al obtener contenido", detalle: error.message },
      { status: 500 }
    );
  }
}

// PUT - Actualizar contenido
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const idNum = Number(id);
    const userEmail = getUserEmailFromRequest(request);

    console.log("========== PUT SABER PEDIÁTRICO ==========");
    console.log("📧 Email usuario:", userEmail);
    console.log("📦 Datos:", body);

    if (isNaN(idNum)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const actualizado = await withUserEmail(userEmail, async () => {
      return await db
        .update(contenidoSaberPediatrico)
        .set({
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
          fechaPublicacion: body.fechaPublicacion,
          destacado: body.destacado || false,
          orden: body.orden || 0,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(contenidoSaberPediatrico.id, idNum))
        .returning();
    });

    if (!actualizado.length) {
      return NextResponse.json({ error: "Contenido no encontrado" }, { status: 404 });
    }

    console.log("🟢 PUT - Contenido actualizado ID:", actualizado[0]?.id);
    return NextResponse.json(actualizado[0]);
  } catch (error: any) {
    console.error("🔥 Error en PUT Saber Pediátrico:", error);
    return NextResponse.json(
      { error: "Error al actualizar contenido", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Ocultar contenido (borrado lógico)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idNum = Number(id);
    const userEmail = getUserEmailFromRequest(request);

    console.log("========== DELETE SABER PEDIÁTRICO ==========");
    console.log("📧 Email usuario:", userEmail);

    if (isNaN(idNum)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const ocultado = await withUserEmail(userEmail, async () => {
      return await db
        .update(contenidoSaberPediatrico)
        .set({ activo: false, updatedAt: new Date().toISOString() })
        .where(eq(contenidoSaberPediatrico.id, idNum))
        .returning();
    });

    if (!ocultado.length) {
      return NextResponse.json({ error: "Contenido no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ message: "Contenido ocultado correctamente" });
  } catch (error: any) {
    console.error("🔥 Error en DELETE Saber Pediátrico:", error);
    return NextResponse.json(
      { error: "Error al ocultar contenido", details: error.message },
      { status: 500 }
    );
  }
}