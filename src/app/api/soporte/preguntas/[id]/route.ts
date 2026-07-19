// src/app/api/soporte/preguntas/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { preguntasUsuarios, categoriasAyuda, usuarios } from "@/lib/schema/index";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // 👈 1. Corregido para Next.js 15+
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // 👈 2. Extraer el ID de forma asíncrona con await
    const { id } = await params;
    const idPregunta = parseInt(id);

    const [pregunta] = await db
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
      .leftJoin(categoriasAyuda, eq(preguntasUsuarios.idCategoria, categoriasAyuda.idCategoria))
      .where(eq(preguntasUsuarios.idPregunta, idPregunta));

    if (!pregunta) {
      return NextResponse.json({ error: "Pregunta no encontrada" }, { status: 404 });
    }

    // Verificar permisos
    const esAdmin = session.user.rol === "admin";
    const esDueno = pregunta.idUsuario === Number(session.user.id);

    if (pregunta.esPrivada && !esAdmin && !esDueno) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    return NextResponse.json(pregunta);
  } catch (error) {
    console.error("Error al obtener pregunta:", error);
    return NextResponse.json({ error: "Error al obtener la pregunta" }, { status: 500 });
  }
}