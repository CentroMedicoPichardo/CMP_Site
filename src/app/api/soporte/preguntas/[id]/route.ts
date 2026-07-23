import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { normalizeRole, requireApiAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  categoriasAyuda,
  preguntasUsuarios,
  usuarios,
} from "@/lib/schema/index";
import { parseIdPositivo } from "@/lib/soporte/validaciones";

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

    const esAdmin = normalizeRole(session.user.rol) === "admin";
    const esDueno = pregunta.idUsuario === session.user.id;

    if (!esAdmin && !esDueno) {
      return NextResponse.json(
        { error: "No tienes permiso para consultar esta pregunta." },
        { status: 403 },
      );
    }

    return NextResponse.json({
      ...pregunta,
      estado: pregunta.estado ?? "pendiente",
      prioridad: pregunta.prioridad ?? "normal",
      esPrivada: pregunta.esPrivada ?? false,
    });
  } catch (errorConsulta: unknown) {
    console.error("Error al obtener pregunta:", errorConsulta);
    return NextResponse.json(
      { error: "No fue posible obtener la pregunta." },
      { status: 500 },
    );
  }
}
