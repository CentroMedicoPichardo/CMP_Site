// src/app/api/inscripciones/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { inscripcionesCursos, cursos, usuarios } from "@/lib/schema/index";
import { desc, eq, and, sql } from "drizzle-orm";
import { withUserEmail, getUserEmailFromRequest } from "@/lib/db-with-user";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cursoId = searchParams.get("cursoId");
    const usuarioId = searchParams.get("usuarioId");

    const filtros: any[] = [];
    if (cursoId && !isNaN(Number(cursoId))) {
      filtros.push(eq(inscripcionesCursos.cursoId, Number(cursoId)));
    }
    if (usuarioId && !isNaN(Number(usuarioId))) {
      filtros.push(eq(inscripcionesCursos.usuarioId, Number(usuarioId)));
    }

    const data = await db
      .select({
        idInscripcion: inscripcionesCursos.idInscripcion,
        cursoId: inscripcionesCursos.cursoId,
        usuarioId: inscripcionesCursos.usuarioId,
        fechaInscripcion: inscripcionesCursos.fechaInscripcion,
        estado: inscripcionesCursos.estado,
        montoPagado: inscripcionesCursos.montoPagado,
        metodoPago: inscripcionesCursos.metodoPago,
        tituloCurso: cursos.tituloCurso,
        nombreUsuario: sql<string>`CONCAT(${usuarios.nombre}, ' ', ${usuarios.apellidoPaterno})`.as('nombre_usuario'),
      })
      .from(inscripcionesCursos)
      .leftJoin(cursos, eq(inscripcionesCursos.cursoId, cursos.idCurso))
      .leftJoin(usuarios, eq(inscripcionesCursos.usuarioId, usuarios.id))
      .where(filtros.length ? and(...filtros) : undefined)
      .orderBy(desc(inscripcionesCursos.fechaInscripcion));

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("🔥 Error en GET Inscripciones:", error);
    return NextResponse.json({ error: "Error al obtener inscripciones", detalle: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userEmail = getUserEmailFromRequest(request);

    // Validar datos requeridos
    if (!body.cursoId || !body.usuarioId) {
      return NextResponse.json({ 
        error: "Faltan datos requeridos", 
        details: "cursoId y usuarioId son obligatorios" 
      }, { status: 400 });
    }

    // Verificar cupos disponibles
    const curso = await db
      .select({ 
        cupoMaximo: cursos.cupoMaximo, 
        cuposOcupados: cursos.cuposOcupados 
      })
      .from(cursos)
      .where(eq(cursos.idCurso, Number(body.cursoId)))
      .limit(1);

    if (!curso.length || !curso[0]) {
      return NextResponse.json({ error: "Curso no encontrado" }, { status: 404 });
    }

    const cursoData = curso[0];
    const cuposOcupados = cursoData.cuposOcupados ?? 0;
    const cupoMaximo = cursoData.cupoMaximo ?? 0;

    if (cuposOcupados >= cupoMaximo) {
      return NextResponse.json({ error: "Curso sin cupos disponibles" }, { status: 400 });
    }

    // Verificar si ya está inscrito
    const inscripcionExistente = await db
      .select()
      .from(inscripcionesCursos)
      .where(and(
        eq(inscripcionesCursos.cursoId, Number(body.cursoId)),
        eq(inscripcionesCursos.usuarioId, Number(body.usuarioId))
      ))
      .limit(1);

    if (inscripcionExistente.length > 0) {
      return NextResponse.json({ error: "Usuario ya inscrito en este curso" }, { status: 400 });
    }

    const nueva = await withUserEmail(userEmail, async () => {
      return await db.transaction(async (tx) => {
        // Crear inscripción
        const inscripcion = await tx.insert(inscripcionesCursos).values({
          cursoId: Number(body.cursoId),
          usuarioId: Number(body.usuarioId),
          estado: body.estado || 'activo',
          montoPagado: body.montoPagado ? String(body.montoPagado) : null,
          metodoPago: body.metodoPago || null,
        }).returning();

        if (!inscripcion.length || !inscripcion[0]) {
          throw new Error("No se pudo crear la inscripción");
        }

        // Actualizar cupos ocupados
        await tx
          .update(cursos)
          .set({ cuposOcupados: sql`${cursos.cuposOcupados} + 1` })
          .where(eq(cursos.idCurso, Number(body.cursoId)));

        return inscripcion;
      });
    });

    if (!nueva.length || !nueva[0]) {
      return NextResponse.json({ error: "Error al crear inscripción" }, { status: 500 });
    }

    return NextResponse.json(nueva[0], { status: 201 });
  } catch (error: any) {
    console.error("🔥 Error en POST Inscripción:", error);
    return NextResponse.json({ 
      error: "Error al crear inscripción", 
      details: error.message 
    }, { status: 500 });
  }
}