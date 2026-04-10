// src/app/api/cursos/[id]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cursos } from "@/lib/schema/index";
import { eq, sql } from "drizzle-orm";
import { withUserEmail, getUserEmailFromRequest } from "@/lib/db-with-user";

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

    const curso = await db
      .select()
      .from(cursos)
      .where(eq(cursos.idCurso, idNum))
      .limit(1);

    if (!curso.length) {
      return NextResponse.json({ error: "Curso no encontrado" }, { status: 404 });
    }

    return NextResponse.json(curso[0]);
  } catch (error: any) {
    console.error("🔥 Error en GET Curso:", error);
    return NextResponse.json({ error: "Error al obtener curso", detalle: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const idNum = Number(id);
    const userEmail = getUserEmailFromRequest(request);

    if (isNaN(idNum)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    // Construir el objeto de actualización manejando correctamente los nulos
    const updateData: any = {
      tituloCurso: body.tituloCurso,
      descripcion: body.descripcion || null,
      idCategoria: body.idCategoria,
      idModalidad: body.idModalidad,
      fechaInicio: body.fechaInicio,
      fechaFin: body.fechaFin,
      horario: body.horario || null,
      dirigidoA: body.dirigidoA,
      costo: body.costo ? body.costo.toString() : "0.00",
      urlImagenPortada: body.urlImagenPortada || null,
      activo: body.activo !== undefined ? body.activo : true,
      updatedAt: sql`CURRENT_TIMESTAMP`,
    };

    // Manejar idInstructor (puede ser null)
    if (body.idInstructor !== undefined && body.idInstructor !== null && body.idInstructor !== "") {
      updateData.idInstructor = Number(body.idInstructor);
    } else {
      updateData.idInstructor = null;
    }

    // Manejar idUbicacion (puede ser null)
    if (body.idUbicacion !== undefined && body.idUbicacion !== null && body.idUbicacion !== "") {
      updateData.idUbicacion = Number(body.idUbicacion);
    } else {
      updateData.idUbicacion = null;
    }

    // Manejar cupoMaximo
    if (body.cupoMaximo !== undefined && body.cupoMaximo !== null && body.cupoMaximo !== "") {
      updateData.cupoMaximo = Number(body.cupoMaximo);
    } else {
      updateData.cupoMaximo = 20; // valor por defecto
    }

    // Manejar cuposOcupados (solo si viene definido)
    if (body.cuposOcupados !== undefined && body.cuposOcupados !== null) {
      updateData.cuposOcupados = Number(body.cuposOcupados);
    }

    const actualizado = await withUserEmail(userEmail, async () => {
      return await db
        .update(cursos)
        .set(updateData)
        .where(eq(cursos.idCurso, idNum))
        .returning();
    });

    if (!actualizado.length) {
      return NextResponse.json({ error: "Curso no encontrado" }, { status: 404 });
    }

    return NextResponse.json(actualizado[0]);
  } catch (error: any) {
    console.error("🔥 ERROR PUT CURSO:", error);
    return NextResponse.json({ error: "Error al actualizar curso", detalle: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idNum = Number(id);
    const userEmail = getUserEmailFromRequest(request);

    if (isNaN(idNum)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const ocultado = await withUserEmail(userEmail, async () => {
      return await db
        .update(cursos)
        .set({ activo: false, updatedAt: sql`CURRENT_TIMESTAMP` })
        .where(eq(cursos.idCurso, idNum))
        .returning();
    });

    if (!ocultado.length) {
      return NextResponse.json({ error: "Curso no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ message: "Curso ocultado correctamente" });
  } catch (error: any) {
    console.error("🔥 ERROR DELETE CURSO:", error);
    return NextResponse.json({ error: "Error al ocultar curso", detalle: error.message }, { status: 500 });
  }
}