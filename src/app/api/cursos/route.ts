// src/app/api/cursos/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cursos, medicos } from "@/lib/schema/index";
import { desc, eq, and, sql } from "drizzle-orm";
import { withUserEmail, getUserEmailFromRequest } from "@/lib/db-with-user";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get("admin") === "true";

    const filtroActivo = isAdmin ? [] : [eq(cursos.activo, true)];

    const data = await db
      .select({
        idCurso: cursos.idCurso,
        tituloCurso: cursos.tituloCurso,
        descripcion: cursos.descripcion,
        idInstructor: cursos.idInstructor,
        instructorNombre: sql<string>`CONCAT(${medicos.nombres}, ' ', ${medicos.apellidoPaterno}, ' ', COALESCE(${medicos.apellidoMaterno}, ''))`.as('instructor_nombre'),
        categoria: cursos.categoria,
        fechaInicio: cursos.fechaInicio,
        fechaFin: cursos.fechaFin,
        horario: cursos.horario,
        modalidad: cursos.modalidad,
        dirigidoA: cursos.dirigidoA,
        cupoMaximo: cursos.cupoMaximo,
        cuposOcupados: cursos.cuposOcupados,
        ubicacion: cursos.ubicacion,
        costo: cursos.costo,
        urlImagenPortada: cursos.urlImagenPortada,
        activo: cursos.activo,
      })
      .from(cursos)
      .leftJoin(medicos, eq(cursos.idInstructor, medicos.idMedico))
      .where(and(...filtroActivo))
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

    console.log("========== POST CURSO ==========");
    console.log("📧 Email usuario:", userEmail);
    console.log("📦 Datos:", body);

    const idInstructor = body.idInstructor && Number(body.idInstructor) !== 0 
      ? Number(body.idInstructor) 
      : null;

    const nuevo = await withUserEmail(userEmail, async () => {
      return await db.insert(cursos).values({
        tituloCurso: body.tituloCurso,
        descripcion: body.descripcion || null,
        idInstructor: idInstructor,
        categoria: body.categoria || "General",
        fechaInicio: body.fechaInicio || null,
        fechaFin: body.fechaFin || null,
        horario: body.horario || null,
        modalidad: body.modalidad || "Presencial",
        dirigidoA: body.dirigidoA || "Padres",
        cupoMaximo: body.cupoMaximo ? Number(body.cupoMaximo) : 20,
        cuposOcupados: 0,
        ubicacion: body.ubicacion || null,
        costo: body.costo ? body.costo.toString() : "0.00",
        urlImagenPortada: body.urlImagenPortada || "/logo.png",
        activo: true,
      }).returning();
    });

    console.log("🟢 POST CURSO - Curso creado ID:", nuevo[0]?.idCurso);
    return NextResponse.json(nuevo[0], { status: 201 });
  } catch (error: any) {
    console.error("🔥 Error en POST Cursos:", error);
    return NextResponse.json({ error: "Error al crear curso", details: error.message }, { status: 500 });
  }
}