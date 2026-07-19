// src/app/api/soporte/preguntas/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { preguntasUsuarios, categoriasAyuda, usuarios } from "@/lib/schema/index";
import { eq, desc, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { CrearPreguntaUsuarioDTO } from "@/types/help";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Debes iniciar sesión para ver las preguntas" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const estado = searchParams.get("estado");
    const misPreguntas = searchParams.get("mis_preguntas");

    // Construir condiciones como array
    const conditions = [];

    // Si es cliente, solo ve sus preguntas o las públicas
    if (session.user.rol === "cliente") {
      if (misPreguntas === "true") {
        conditions.push(eq(preguntasUsuarios.idUsuario, Number(session.user.id)));
      } else {
        conditions.push(eq(preguntasUsuarios.esPrivada, false));
      }
    }

    // Filtrar por estado si se especifica
    if (estado) {
      conditions.push(eq(preguntasUsuarios.estado, estado));
    }

    // Aplicar condiciones con AND
    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const query = db
      .select({
        idPregunta: preguntasUsuarios.idPregunta,
        idUsuario: preguntasUsuarios.idUsuario,
        titulo: preguntasUsuarios.titulo,
        descripcion: preguntasUsuarios.descripcion,
        estado: preguntasUsuarios.estado,
        prioridad: preguntasUsuarios.prioridad,
        esPrivada: preguntasUsuarios.esPrivada,
        createdAt: preguntasUsuarios.createdAt,
        updatedAt: preguntasUsuarios.updatedAt,
        usuario: {
          id: usuarios.id,
          nombre: usuarios.nombre,
          apellidoPaterno: usuarios.apellidoPaterno,
          correo: usuarios.correo,
        },
        categoria: {
          idCategoria: categoriasAyuda.idCategoria,
          nombreCategoria: categoriasAyuda.nombreCategoria,
        },
      })
      .from(preguntasUsuarios)
      .leftJoin(usuarios, eq(preguntasUsuarios.idUsuario, usuarios.id))
      .leftJoin(
        categoriasAyuda,
        eq(preguntasUsuarios.idCategoria, categoriasAyuda.idCategoria)
      )
      .orderBy(desc(preguntasUsuarios.createdAt));

    // Aplicar where solo si hay condiciones
    const preguntas = where ? await query.where(where) : await query;

    return NextResponse.json(preguntas);
  } catch (error) {
    console.error("Error al obtener preguntas:", error);
    return NextResponse.json(
      { error: "Error al obtener las preguntas" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Debes iniciar sesión para hacer una pregunta" },
        { status: 401 }
      );
    }

    const body: CrearPreguntaUsuarioDTO = await request.json();

    // Validaciones básicas
    if (!body.titulo || !body.titulo.trim()) {
      return NextResponse.json(
        { error: "El título es requerido" },
        { status: 400 }
      );
    }

    if (!body.descripcion || !body.descripcion.trim()) {
      return NextResponse.json(
        { error: "La descripción es requerida" },
        { status: 400 }
      );
    }

    if (body.titulo.length > 300) {
      return NextResponse.json(
        { error: "El título no puede exceder los 300 caracteres" },
        { status: 400 }
      );
    }

    const [nuevaPregunta] = await db
      .insert(preguntasUsuarios)
      .values({
        idUsuario: Number(session.user.id),
        idCategoria: body.idCategoria || null,
        titulo: body.titulo.trim(),
        descripcion: body.descripcion.trim(),
        prioridad: body.prioridad || "normal",
        esPrivada: body.esPrivada || false,
        estado: "pendiente",
      })
      .returning();

    return NextResponse.json(nuevaPregunta, { status: 201 });
  } catch (error) {
    console.error("Error al crear pregunta:", error);
    return NextResponse.json(
      { error: "Error al crear la pregunta" },
      { status: 500 }
    );
  }
}