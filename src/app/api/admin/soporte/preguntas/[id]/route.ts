import { NextRequest, NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { requireApiRole } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  categoriasAyuda,
  preguntasUsuarios,
  respuestasAyuda,
  usuarios,
} from "@/lib/schema/index";
import {
  esEstadoPregunta,
  esPrioridadPregunta,
  parseIdPositivo,
} from "@/lib/soporte/validaciones";
import type { ActualizarPreguntaDTO } from "@/types/help";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error } = await requireApiRole("admin");

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

    const [pregunta] = await db
      .select({
        idPregunta: preguntasUsuarios.idPregunta,
        idUsuario: preguntasUsuarios.idUsuario,
        idCategoria: preguntasUsuarios.idCategoria,
        titulo: preguntasUsuarios.titulo,
        descripcion: preguntasUsuarios.descripcion,
        estado: preguntasUsuarios.estado,
        prioridad: preguntasUsuarios.prioridad,
        esPrivada: preguntasUsuarios.esPrivada,
        idPreguntaFaq: preguntasUsuarios.idPreguntaFaq,
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
      .innerJoin(
        usuarios,
        eq(preguntasUsuarios.idUsuario, usuarios.id),
      )
      .leftJoin(
        categoriasAyuda,
        eq(preguntasUsuarios.idCategoria, categoriasAyuda.idCategoria),
      )
      .where(eq(preguntasUsuarios.idPregunta, idPregunta))
      .limit(1);

    if (!pregunta) {
      return NextResponse.json(
        { error: "Pregunta no encontrada." },
        { status: 404 },
      );
    }

    const [respuestas, categorias] = await Promise.all([
      db
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
        .orderBy(asc(respuestasAyuda.createdAt)),
      db
        .select()
        .from(categoriasAyuda)
        .orderBy(
          asc(categoriasAyuda.orden),
          asc(categoriasAyuda.nombreCategoria),
        ),
    ]);

    return NextResponse.json({
      pregunta: {
        ...pregunta,
        estado: pregunta.estado ?? "pendiente",
        prioridad: pregunta.prioridad ?? "normal",
        esPrivada: pregunta.esPrivada ?? false,
      },
      respuestas: respuestas.map((respuesta) => ({
        ...respuesta,
        esRespuestaAdmin: respuesta.esRespuestaAdmin ?? false,
        esSolucion: respuesta.esSolucion ?? false,
      })),
      categorias,
    });
  } catch (errorConsulta: unknown) {
    console.error("Error al obtener detalle de soporte:", errorConsulta);
    return NextResponse.json(
      { error: "No fue posible cargar la solicitud." },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error } = await requireApiRole("admin");

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

    const body = (await request.json()) as ActualizarPreguntaDTO;
    const cambios: {
      estado?: string;
      prioridad?: string;
      idCategoria?: number | null;
      esPrivada?: boolean;
      updatedAt: string;
    } = { updatedAt: new Date().toISOString() };

    if (body.estado !== undefined) {
      if (!esEstadoPregunta(body.estado)) {
        return NextResponse.json(
          { error: "El estado seleccionado no es válido." },
          { status: 400 },
        );
      }
      cambios.estado = body.estado;
    }

    if (body.prioridad !== undefined) {
      if (!esPrioridadPregunta(body.prioridad)) {
        return NextResponse.json(
          { error: "La prioridad seleccionada no es válida." },
          { status: 400 },
        );
      }
      cambios.prioridad = body.prioridad;
    }

    if (body.idCategoria !== undefined) {
      const idCategoria =
        body.idCategoria === null
          ? null
          : parseIdPositivo(body.idCategoria);

      if (body.idCategoria !== null && idCategoria === null) {
        return NextResponse.json(
          { error: "La categoría seleccionada no es válida." },
          { status: 400 },
        );
      }

      if (idCategoria !== null) {
        const [categoria] = await db
          .select({ idCategoria: categoriasAyuda.idCategoria })
          .from(categoriasAyuda)
          .where(eq(categoriasAyuda.idCategoria, idCategoria))
          .limit(1);

        if (!categoria) {
          return NextResponse.json(
            { error: "La categoría seleccionada no existe." },
            { status: 400 },
          );
        }
      }
      cambios.idCategoria = idCategoria;
    }

    if (body.esPrivada !== undefined) {
      cambios.esPrivada = body.esPrivada === true;
    }

    const [actualizada] = await db
      .update(preguntasUsuarios)
      .set(cambios)
      .where(eq(preguntasUsuarios.idPregunta, idPregunta))
      .returning();

    if (!actualizada) {
      return NextResponse.json(
        { error: "Pregunta no encontrada." },
        { status: 404 },
      );
    }

    return NextResponse.json(actualizada);
  } catch (errorActualizacion: unknown) {
    console.error("Error al actualizar solicitud:", errorActualizacion);
    return NextResponse.json(
      { error: "No fue posible actualizar la solicitud." },
      { status: 500 },
    );
  }
}
