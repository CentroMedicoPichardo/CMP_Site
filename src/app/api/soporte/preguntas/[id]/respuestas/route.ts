// src/app/api/soporte/preguntas/[id]/respuestas/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { respuestasAyuda, preguntasUsuarios, usuarios } from "@/lib/schema/index";
import { eq, asc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { CrearRespuestaDTO } from "@/types/help";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Verificar que la pregunta existe
    const [pregunta] = await db
      .select()
      .from(preguntasUsuarios)
      .where(eq(preguntasUsuarios.idPregunta, parseInt(params.id)));

    if (!pregunta) {
      return NextResponse.json(
        { error: "Pregunta no encontrada" },
        { status: 404 }
      );
    }

    // Si es privada, solo el dueño o admin pueden ver respuestas
    if (pregunta.esPrivada) {
      const esAdmin = session.user.rol === "admin";
      const esDueno = pregunta.idUsuario === Number(session.user.id);
      if (!esAdmin && !esDueno) {
        return NextResponse.json({ error: "No autorizado" }, { status: 403 });
      }
    }

    const respuestas = await db
      .select({
        idRespuesta: respuestasAyuda.idRespuesta,
        contenido: respuestasAyuda.contenido,
        esRespuestaAdmin: respuestasAyuda.esRespuestaAdmin,
        esSolucion: respuestasAyuda.esSolucion,
        createdAt: respuestasAyuda.createdAt,
        usuario: {
          id: usuarios.id,
          nombre: usuarios.nombre,
          apellidoPaterno: usuarios.apellidoPaterno,
        },
      })
      .from(respuestasAyuda)
      .leftJoin(usuarios, eq(respuestasAyuda.idUsuario, usuarios.id))
      .where(eq(respuestasAyuda.idPregunta, parseInt(params.id)))
      .orderBy(asc(respuestasAyuda.createdAt));

    return NextResponse.json(respuestas);
  } catch (error) {
    console.error("Error al obtener respuestas:", error);
    return NextResponse.json(
      { error: "Error al obtener respuestas" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body: CrearRespuestaDTO = await request.json();

    if (!body.contenido || !body.contenido.trim()) {
      return NextResponse.json(
        { error: "El contenido de la respuesta es requerido" },
        { status: 400 }
      );
    }

    // Verificar que la pregunta existe
    const [pregunta] = await db
      .select()
      .from(preguntasUsuarios)
      .where(eq(preguntasUsuarios.idPregunta, parseInt(params.id)));

    if (!pregunta) {
      return NextResponse.json(
        { error: "Pregunta no encontrada" },
        { status: 404 }
      );
    }

    // Verificar permisos
    const esAdmin = session.user.rol === "admin";
    const esDueno = pregunta.idUsuario === Number(session.user.id);

    if (!esAdmin && !esDueno) {
      return NextResponse.json(
        { error: "No tienes permiso para responder esta pregunta" },
        { status: 403 }
      );
    }

    // Si la pregunta está cerrada, solo admin puede responder
    if (pregunta.estado === "cerrada" && !esAdmin) {
      return NextResponse.json(
        { error: "No puedes responder una pregunta cerrada" },
        { status: 400 }
      );
    }

    const [respuesta] = await db
      .insert(respuestasAyuda)
      .values({
        idPregunta: parseInt(params.id),
        idUsuario: Number(session.user.id),
        contenido: body.contenido.trim(),
        esRespuestaAdmin: esAdmin,
        esSolucion: esAdmin && (body.esSolucion || false),
      })
      .returning();

    // Actualizar estado de la pregunta
    const nuevoEstado = esAdmin
      ? body.esSolucion
        ? "respondida"
        : "respondida"
      : "pendiente";

    await db
      .update(preguntasUsuarios)
      .set({
        estado: nuevoEstado,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(preguntasUsuarios.idPregunta, parseInt(params.id)));

    return NextResponse.json(respuesta, { status: 201 });
  } catch (error) {
    console.error("Error al crear respuesta:", error);
    return NextResponse.json(
      { error: "Error al crear la respuesta" },
      { status: 500 }
    );
  }
}