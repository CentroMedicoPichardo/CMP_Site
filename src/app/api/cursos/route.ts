// src/app/api/cursos/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  cursos,
  instructores,
  categoriasCursos,
  ubicacionesCursos,
  modalidades,
} from "@/lib/schema/index";
import { desc, eq, and, sql } from "drizzle-orm";
import { withUserEmail } from "@/lib/db-with-user";
import { requireApiRole } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get("admin") === "true";

    if (isAdmin) {
      const { error } = await requireApiRole("admin");

      if (error) {
        return error;
      }
    }

    const modalidadId = searchParams.get("modalidadId");
    const dirigidoA = searchParams.get("dirigidoA");

    const filtros = [];

    if (!isAdmin) {
      filtros.push(eq(cursos.activo, true));
    }

    if (modalidadId && !Number.isNaN(Number(modalidadId))) {
      filtros.push(eq(cursos.idModalidad, Number(modalidadId)));
    }

    if (dirigidoA) {
      filtros.push(eq(cursos.dirigidoA, dirigidoA));
    }

    const data = await db
      .select({
        idCurso: cursos.idCurso,
        tituloCurso: cursos.tituloCurso,
        descripcion: cursos.descripcion,
        idInstructor: cursos.idInstructor,
        instructorNombre:
          sql<string>`CONCAT(${instructores.nombre}, ' ', ${instructores.apellidoPaterno}, ' ', COALESCE(${instructores.apellidoMaterno}, ''))`.as(
            "instructor_nombre"
          ),
        instructorEspecialidad: instructores.especialidad,
        idCategoria: cursos.idCategoria,
        categoriaNombre: categoriasCursos.nombreCategoria,
        idUbicacion: cursos.idUbicacion,
        ubicacionNombre: ubicacionesCursos.nombreUbicacion,
        ubicacionDireccion: ubicacionesCursos.direccionCompleta,
        idModalidad: cursos.idModalidad,
        modalidadNombre: modalidades.nombreModalidad,
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
      .leftJoin(instructores, eq(cursos.idInstructor, instructores.idInstructor))
      .leftJoin(
        categoriasCursos,
        eq(cursos.idCategoria, categoriasCursos.idCategoria)
      )
      .leftJoin(
        ubicacionesCursos,
        eq(cursos.idUbicacion, ubicacionesCursos.idUbicacion)
      )
      .leftJoin(modalidades, eq(cursos.idModalidad, modalidades.idModalidad))
      .where(filtros.length ? and(...filtros) : undefined)
      .orderBy(desc(cursos.idCurso));

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error en GET cursos:", error);

    return NextResponse.json(
      { error: "Error al obtener cursos" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { session, error } = await requireApiRole("admin");

  if (error) {
    return error;
  }

  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (!body.tituloCurso) {
      return NextResponse.json(
        { error: "El título del curso es requerido" },
        { status: 400 }
      );
    }

    if (!body.idInstructor || Number.isNaN(Number(body.idInstructor))) {
      return NextResponse.json(
        { error: "El instructor es requerido" },
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

    const userEmail = session.user.correo;

    const nuevo = await withUserEmail(userEmail, async () => {
      return await db
        .insert(cursos)
        .values({
          tituloCurso: body.tituloCurso,
          descripcion: body.descripcion || null,
          idInstructor: Number(body.idInstructor),
          idCategoria: Number(body.idCategoria),
          idUbicacion: body.idUbicacion ? Number(body.idUbicacion) : null,
          idModalidad: Number(body.idModalidad),
          fechaInicio: body.fechaInicio,
          fechaFin: body.fechaFin,
          horario: body.horario || null,
          dirigidoA: body.dirigidoA || "Padres",
          cupoMaximo: body.cupoMaximo ? Number(body.cupoMaximo) : 20,
          cuposOcupados: 0,
          costo: body.costo ? String(body.costo) : "0.00",
          urlImagenPortada: body.urlImagenPortada || null,
          activo: true,
        })
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

    if (!nuevo.length || !nuevo[0]) {
      return NextResponse.json(
        { error: "Error al crear curso" },
        { status: 500 }
      );
    }

    return NextResponse.json(nuevo[0], { status: 201 });
  } catch (error) {
    console.error("Error en POST cursos:", error);

    return NextResponse.json(
      { error: "Error al crear curso" },
      { status: 500 }
    );
  }
}