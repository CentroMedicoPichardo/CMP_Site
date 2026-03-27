// src/app/api/cursos/[id]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cursos } from "@/lib/schema/index";
import { eq } from "drizzle-orm";
import { withUserEmail, getUserEmailFromRequest } from "@/lib/db-with-user";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const idCurso = Number(id);
    const userEmail = getUserEmailFromRequest(request);

    console.log("========== PUT CURSO ==========");
    console.log("📧 Email usuario:", userEmail);
    console.log("📦 Datos:", body);

    if (isNaN(idCurso)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

    const idInstructor = body.idInstructor && Number(body.idInstructor) !== 0 
      ? Number(body.idInstructor) 
      : null;

    const actualizado = await withUserEmail(userEmail, async () => {
      return await db
        .update(cursos)
        .set({
          tituloCurso: body.tituloCurso,
          descripcion: body.descripcion,
          idInstructor: idInstructor,
          categoria: body.categoria,
          fechaInicio: body.fechaInicio,
          fechaFin: body.fechaFin,
          horario: body.horario,
          modalidad: body.modalidad,
          dirigidoA: body.dirigidoA,
          cupoMaximo: body.cupoMaximo ? Number(body.cupoMaximo) : null,
          cuposOcupados: body.cuposOcupados !== undefined ? Number(body.cuposOcupados) : undefined,
          ubicacion: body.ubicacion,
          costo: body.costo ? body.costo.toString() : "0.00",
          urlImagenPortada: body.urlImagenPortada,
          activo: body.activo !== undefined ? body.activo : true,
        })
        .where(eq(cursos.idCurso, idCurso))
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

    console.log("========== DELETE CURSO ==========");
    console.log("📧 Email usuario:", userEmail);

    if (isNaN(idNum)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

    const ocultado = await withUserEmail(userEmail, async () => {
      return await db
        .update(cursos)
        .set({ activo: false })
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