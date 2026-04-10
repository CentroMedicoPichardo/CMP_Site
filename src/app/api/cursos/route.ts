// src/app/api/cursos/route.ts (corregido)
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cursos, instructores, categoriasCursos, ubicacionesCursos, modalidades } from "@/lib/schema/index";
import { desc, eq, and, sql } from "drizzle-orm";
import { withUserEmail, getUserEmailFromRequest } from "@/lib/db-with-user";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get("admin") === "true";
    const categoriaId = searchParams.get("categoriaId");
    const modalidadId = searchParams.get("modalidadId");

    const filtros: any[] = [];
    if (!isAdmin) filtros.push(eq(cursos.activo, true));
    if (categoriaId && !isNaN(Number(categoriaId))) filtros.push(eq(cursos.idCategoria, Number(categoriaId)));
    if (modalidadId && !isNaN(Number(modalidadId))) filtros.push(eq(cursos.idModalidad, Number(modalidadId)));

    const data = await db
      .select({
        idCurso: cursos.idCurso,
        tituloCurso: cursos.tituloCurso,
        descripcion: cursos.descripcion,
        idInstructor: cursos.idInstructor,
        instructorNombre: sql<string>`CONCAT(${instructores.nombre}, ' ', ${instructores.apellidoPaterno}, ' ', COALESCE(${instructores.apellidoMaterno}, ''))`.as('instructor_nombre'),
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
      .leftJoin(categoriasCursos, eq(cursos.idCategoria, categoriasCursos.idCategoria))
      .leftJoin(ubicacionesCursos, eq(cursos.idUbicacion, ubicacionesCursos.idUbicacion))
      .leftJoin(modalidades, eq(cursos.idModalidad, modalidades.idModalidad))
      .where(filtros.length ? and(...filtros) : undefined)
      .orderBy(desc(cursos.idCurso));

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("🔥 Error en GET Cursos:", error);
    return NextResponse.json({ error: "Error al obtener cursos", detalle: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userEmail = getUserEmailFromRequest(request);

    // Validar campos requeridos
    if (!body.tituloCurso) {
      return NextResponse.json({ error: "El título del curso es requerido" }, { status: 400 });
    }
    if (!body.idInstructor) {
      return NextResponse.json({ error: "El instructor es requerido" }, { status: 400 });
    }
    if (!body.idCategoria) {
      return NextResponse.json({ error: "La categoría es requerida" }, { status: 400 });
    }
    if (!body.idModalidad) {
      return NextResponse.json({ error: "La modalidad es requerida" }, { status: 400 });
    }
    if (!body.fechaInicio || !body.fechaFin) {
      return NextResponse.json({ error: "Las fechas de inicio y fin son requeridas" }, { status: 400 });
    }

    const nuevo = await withUserEmail(userEmail, async () => {
      return await db.insert(cursos).values({
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
      }).returning();
    });

    if (!nuevo.length || !nuevo[0]) {
      return NextResponse.json({ error: "Error al crear curso" }, { status: 500 });
    }

    return NextResponse.json(nuevo[0], { status: 201 });
  } catch (error: any) {
    console.error("🔥 Error en POST Cursos:", error);
    return NextResponse.json({ error: "Error al crear curso", details: error.message }, { status: 500 });
  }
}