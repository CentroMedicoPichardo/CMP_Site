// src/app/api/cursos/[id]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cursos } from "@/lib/schema/index";
import { and, eq, sql } from "drizzle-orm";
import { withUserEmail } from "@/lib/db-with-user";
import { auth, requireApiRole } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idNum = Number(id);

    if (!Number.isFinite(idNum) || idNum <= 0) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const session = await auth();
    const isAdmin = session?.user.rol === "admin";

    const filtros = isAdmin
      ? eq(cursos.idCurso, idNum)
      : and(eq(cursos.idCurso, idNum), eq(cursos.activo, true));

    const curso = await db
      .select({
        idCurso: cursos.idCurso,
        tituloCurso: cursos.tituloCurso,
        descripcion: cursos.descripcion,
        idInstructor: cursos.idInstructor,
        idCategoria: cursos.idCategoria,
        idUbicacion: cursos.idUbicacion,
        idModalidad: cursos.idModalidad,
        fechaInicio: cursos.fechaInicio,
        fechaFin: cursos.fechaFin,
        horario: cursos.horario,
        dirigidoA: cursos.dirigidoA,
        cupoMaximo: cursos.cupoMaximo,
        cuposOcupados: cursos.cuposOcupados,
        costo: cursos.costo,
        urlImagenPortada: cursos.urlImagenPortada,
        activo: cursos.activo,
      })
      .from(cursos)
      .where(filtros)
      .limit(1);

    if (!curso.length) {
      return NextResponse.json(
        { error: "Curso no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(curso[0]);
  } catch (error) {
    console.error("Error en GET curso:", error);

    return NextResponse.json(
      { error: "Error al obtener curso" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireApiRole("admin");

  if (error) {
    return error;
  }

  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const idNum = Number(id);

    if (!Number.isFinite(idNum) || idNum <= 0) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const body = await request.json();

    if (!body.tituloCurso) {
      return NextResponse.json(
        { error: "El título del curso es requerido" },
        { status: 400 }
      );
    }

    if (!body.idCategoria || Number.isNaN(Number(body.idCategoria))) {
      return NextResponse.json(
        { error: "La categoría es requerida" },
        { status: 400 }
      );
    }

    if (!body.idModalidad || Number.isNaN(Number(body.idModalidad))) {
      return NextResponse.json(
        { error: "La modalidad es requerida" },
        { status: 400 }
      );
    }

    if (!body.fechaInicio || !body.fechaFin) {
      return NextResponse.json(
        { error: "Las fechas de inicio y fin son requeridas" },
        { status: 400 }
      );
    }

    const updateData: any = {
      tituloCurso: body.tituloCurso,
      descripcion: body.descripcion || null,
      idCategoria: Number(body.idCategoria),
      idModalidad: Number(body.idModalidad),
      fechaInicio: body.fechaInicio,
      fechaFin: body.fechaFin,
      horario: body.horario || null,
      dirigidoA: body.dirigidoA || "Padres",
      costo: body.costo ? body.costo.toString() : "0.00",
      urlImagenPortada: body.urlImagenPortada || null,
      activo: body.activo !== undefined ? Boolean(body.activo) : true,
      updatedAt: sql`CURRENT_TIMESTAMP`,
    };

    if (
      body.idInstructor !== undefined &&
      body.idInstructor !== null &&
      body.idInstructor !== ""
    ) {
      updateData.idInstructor = Number(body.idInstructor);
    } else {
      updateData.idInstructor = null;
    }

    if (
      body.idUbicacion !== undefined &&
      body.idUbicacion !== null &&
      body.idUbicacion !== ""
    ) {
      updateData.idUbicacion = Number(body.idUbicacion);
    } else {
      updateData.idUbicacion = null;
    }

    if (
      body.cupoMaximo !== undefined &&
      body.cupoMaximo !== null &&
      body.cupoMaximo !== ""
    ) {
      updateData.cupoMaximo = Number(body.cupoMaximo);
    } else {
      updateData.cupoMaximo = 20;
    }

    if (body.cuposOcupados !== undefined && body.cuposOcupados !== null) {
      updateData.cuposOcupados = Number(body.cuposOcupados);
    }

    const userEmail = session.user.correo;

    const actualizado = await withUserEmail(userEmail, async () => {
      return await db
        .update(cursos)
        .set(updateData)
        .where(eq(cursos.idCurso, idNum))
        .returning({
          idCurso: cursos.idCurso,
          tituloCurso: cursos.tituloCurso,
          descripcion: cursos.descripcion,
          idInstructor: cursos.idInstructor,
          idCategoria: cursos.idCategoria,
          idUbicacion: cursos.idUbicacion,
          idModalidad: cursos.idModalidad,
          fechaInicio: cursos.fechaInicio,
          fechaFin: cursos.fechaFin,
          horario: cursos.horario,
          dirigidoA: cursos.dirigidoA,
          cupoMaximo: cursos.cupoMaximo,
          cuposOcupados: cursos.cuposOcupados,
          costo: cursos.costo,
          urlImagenPortada: cursos.urlImagenPortada,
          activo: cursos.activo,
        });
    });

    if (!actualizado.length) {
      return NextResponse.json(
        { error: "Curso no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(actualizado[0]);
  } catch (error) {
    console.error("Error en PUT curso:", error);

    return NextResponse.json(
      { error: "Error al actualizar curso" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireApiRole("admin");

  if (error) {
    return error;
  }

  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const idNum = Number(id);

    if (!Number.isFinite(idNum) || idNum <= 0) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const userEmail = session.user.correo;

    const ocultado = await withUserEmail(userEmail, async () => {
      return await db
        .update(cursos)
        .set({
          activo: false,
          updatedAt: sql`CURRENT_TIMESTAMP`,
        })
        .where(eq(cursos.idCurso, idNum))
        .returning({
          idCurso: cursos.idCurso,
          tituloCurso: cursos.tituloCurso,
          activo: cursos.activo,
        });
    });

    if (!ocultado.length) {
      return NextResponse.json(
        { error: "Curso no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Curso ocultado correctamente",
      curso: ocultado[0],
    });
  } catch (error) {
    console.error("Error en DELETE curso:", error);

    return NextResponse.json(
      { error: "Error al ocultar curso" },
      { status: 500 }
    );
  }
}