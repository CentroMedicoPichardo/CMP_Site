import { NextRequest, NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";
import { requireApiAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  categoriasAyuda,
  preguntasUsuarios,
  usuarios,
} from "@/lib/schema/index";
import {
  esPrioridadPregunta,
  parseIdPositivo,
  validarDescripcionPregunta,
  validarTituloPregunta,
} from "@/lib/soporte/validaciones";
import type { CrearPreguntaUsuarioDTO } from "@/types/help";

export async function GET() {
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
    const preguntas = await db
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
      .where(eq(preguntasUsuarios.idUsuario, session.user.id))
      .orderBy(desc(preguntasUsuarios.createdAt));

    return NextResponse.json(
      preguntas.map((pregunta) => ({
        ...pregunta,
        estado: pregunta.estado ?? "pendiente",
        prioridad: pregunta.prioridad ?? "normal",
        esPrivada: pregunta.esPrivada ?? false,
      })),
    );
  } catch (errorConsulta: unknown) {
    console.error("Error al obtener preguntas:", errorConsulta);
    return NextResponse.json(
      { error: "No fue posible obtener tus preguntas." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
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
    const body = (await request.json()) as CrearPreguntaUsuarioDTO;
    const errorTitulo = validarTituloPregunta(body.titulo);
    const errorDescripcion = validarDescripcionPregunta(body.descripcion);

    if (errorTitulo || errorDescripcion) {
      return NextResponse.json(
        { error: errorTitulo ?? errorDescripcion },
        { status: 400 },
      );
    }

    if (
      body.prioridad !== undefined &&
      !esPrioridadPregunta(body.prioridad)
    ) {
      return NextResponse.json(
        { error: "La prioridad seleccionada no es válida." },
        { status: 400 },
      );
    }

    const idCategoria =
      body.idCategoria === undefined || body.idCategoria === null
        ? null
        : parseIdPositivo(body.idCategoria);

    if (
      body.idCategoria !== undefined &&
      body.idCategoria !== null &&
      idCategoria === null
    ) {
      return NextResponse.json(
        { error: "La categoría seleccionada no es válida." },
        { status: 400 },
      );
    }

    if (idCategoria !== null) {
      const [categoria] = await db
        .select({ idCategoria: categoriasAyuda.idCategoria })
        .from(categoriasAyuda)
        .where(
          and(
            eq(categoriasAyuda.idCategoria, idCategoria),
            eq(categoriasAyuda.activo, true),
          ),
        )
        .limit(1);

      if (!categoria) {
        return NextResponse.json(
          { error: "La categoría no existe o está desactivada." },
          { status: 400 },
        );
      }
    }

    const [nuevaPregunta] = await db
      .insert(preguntasUsuarios)
      .values({
        idUsuario: session.user.id,
        idCategoria,
        titulo: body.titulo.trim(),
        descripcion: body.descripcion.trim(),
        prioridad: body.prioridad ?? "normal",
        esPrivada: body.esPrivada === true,
        estado: "pendiente",
        updatedAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json(nuevaPregunta, { status: 201 });
  } catch (errorCreacion: unknown) {
    console.error("Error al crear pregunta:", errorCreacion);
    return NextResponse.json(
      { error: "No fue posible crear la pregunta." },
      { status: 500 },
    );
  }
}
