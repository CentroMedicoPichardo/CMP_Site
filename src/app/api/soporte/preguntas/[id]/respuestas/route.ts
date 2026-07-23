import { NextRequest, NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { normalizeRole, requireApiAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  preguntasUsuarios,
  respuestasAyuda,
  usuarios,
} from "@/lib/schema/index";
import {
  parseIdPositivo,
  validarContenidoRespuesta,
} from "@/lib/soporte/validaciones";
import type { CrearRespuestaDTO } from "@/types/help";

async function obtenerPregunta(idPregunta: number) {
  const [pregunta] = await db
    .select({
      idPregunta: preguntasUsuarios.idPregunta,
      idUsuario: preguntasUsuarios.idUsuario,
      estado: preguntasUsuarios.estado,
    })
    .from(preguntasUsuarios)
    .where(eq(preguntasUsuarios.idPregunta, idPregunta))
    .limit(1);

  return pregunta ?? null;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error } = await requireApiAuth();

  if (error) {
    return error;
  }

  if (!session) {
    return NextResponse.json(
      { message: "No autenticado" },
      { status: 401 },
    );
  }

  try {
    const { id } = await params;
    const idPregunta = parseIdPositivo(id);

    if (idPregunta === null) {
      return NextResponse.json(
        { error: "El identificador de la pregunta no es válido." },
        { status: 400 },
      );
    }

    const pregunta = await obtenerPregunta(idPregunta);

    if (!pregunta) {
      return NextResponse.json(
        { error: "Pregunta no encontrada." },
        { status: 404 },
      );
    }

    const esAdmin = normalizeRole(session.user.rol) === "admin";
    const esDueno = pregunta.idUsuario === session.user.id;

    if (!esAdmin && !esDueno) {
      return NextResponse.json(
        { error: "No tienes permiso para consultar esta conversación." },
        { status: 403 },
      );
    }

    const respuestas = await db
      .select({
        idRespuesta: respuestasAyuda.idRespuesta,
        idPregunta: respuestasAyuda.idPregunta,
        idUsuario: respuestasAyuda.idUsuario,
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
      .innerJoin(
        usuarios,
        eq(respuestasAyuda.idUsuario, usuarios.id),
      )
      .where(eq(respuestasAyuda.idPregunta, idPregunta))
      .orderBy(asc(respuestasAyuda.createdAt));

    return NextResponse.json(
      respuestas.map((respuesta) => ({
        ...respuesta,
        esRespuestaAdmin: respuesta.esRespuestaAdmin ?? false,
        esSolucion: respuesta.esSolucion ?? false,
      })),
    );
  } catch (errorConsulta: unknown) {
    console.error("Error al obtener respuestas:", errorConsulta);
    return NextResponse.json(
      { error: "No fue posible obtener las respuestas." },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error } = await requireApiAuth();

  if (error) {
    return error;
  }

  if (!session) {
    return NextResponse.json(
      { message: "No autenticado" },
      { status: 401 },
    );
  }

  try {
    const { id } = await params;
    const idPregunta = parseIdPositivo(id);

    if (idPregunta === null) {
      return NextResponse.json(
        { error: "El identificador de la pregunta no es válido." },
        { status: 400 },
      );
    }

    const body = (await request.json()) as CrearRespuestaDTO;
    const errorContenido = validarContenidoRespuesta(body.contenido);

    if (errorContenido) {
      return NextResponse.json(
        { error: errorContenido },
        { status: 400 },
      );
    }

    const pregunta = await obtenerPregunta(idPregunta);

    if (!pregunta) {
      return NextResponse.json(
        { error: "Pregunta no encontrada." },
        { status: 404 },
      );
    }

    const esAdmin = normalizeRole(session.user.rol) === "admin";
    const esDueno = pregunta.idUsuario === session.user.id;

    if (!esAdmin && !esDueno) {
      return NextResponse.json(
        { error: "No tienes permiso para responder esta pregunta." },
        { status: 403 },
      );
    }

    if (
      pregunta.estado === "convertida_faq" ||
      (!esAdmin && pregunta.estado === "cerrada")
    ) {
      return NextResponse.json(
        { error: "Esta conversación ya no admite mensajes." },
        { status: 409 },
      );
    }

    const respuesta = await db.transaction(async (tx) => {
      const esSolucion = esAdmin && body.esSolucion === true;

      if (esSolucion) {
        await tx
          .update(respuestasAyuda)
          .set({ esSolucion: false })
          .where(eq(respuestasAyuda.idPregunta, idPregunta));
      }

      const [creada] = await tx
        .insert(respuestasAyuda)
        .values({
          idPregunta,
          idUsuario: session.user.id,
          contenido: body.contenido.trim(),
          esRespuestaAdmin: esAdmin,
          esSolucion,
        })
        .returning();

      await tx
        .update(preguntasUsuarios)
        .set({
          estado: esAdmin ? "respondida" : "pendiente",
          updatedAt: new Date().toISOString(),
        })
        .where(eq(preguntasUsuarios.idPregunta, idPregunta));

      return creada;
    });

    return NextResponse.json(respuesta, { status: 201 });
  } catch (errorCreacion: unknown) {
    console.error("Error al crear respuesta:", errorCreacion);
    return NextResponse.json(
      { error: "No fue posible enviar la respuesta." },
      { status: 500 },
    );
  }
}
