// src/app/api/cursos/nuevo/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
import { sendEmail } from "@/lib/email";
import { NuevoCursoEmail } from "@/lib/NuevoCursoEmail";
import { requireApiRole } from "@/lib/auth";

function obtenerFilas(resultado: any): any[] {
  if (Array.isArray(resultado)) {
    return resultado;
  }

  if (Array.isArray(resultado?.rows)) {
    return resultado.rows;
  }

  if (Array.isArray(resultado?.[0])) {
    return resultado[0];
  }

  return [];
}

export async function GET() {
  return NextResponse.json(
    {
      message:
        "Este endpoint solo acepta solicitudes POST para notificar un nuevo curso.",
    },
    { status: 405 }
  );
}

export async function POST(req: Request) {
  const { error } = await requireApiRole("admin");

  if (error) {
    return error;
  }

  try {
    const body = await req.json();
    const cursoId = Number(body.cursoId);

    if (!Number.isFinite(cursoId) || cursoId <= 0) {
      return NextResponse.json(
        { error: "Curso ID inválido" },
        { status: 400 }
      );
    }

    const cursoResultado = await db.execute(sql`
      SELECT titulo_curso, costo
      FROM academia.cursos
      WHERE id_curso = ${cursoId}
    `);

    const cursosEncontrados = obtenerFilas(cursoResultado);

    if (!cursosEncontrados.length) {
      return NextResponse.json(
        { error: "Curso no encontrado" },
        { status: 404 }
      );
    }

    const curso = cursosEncontrados[0];

    const titulo = String(curso.titulo_curso ?? "Nuevo curso");
    const costo = String(curso.costo ?? "0.00");

    const usuariosResultado = await db.execute(sql`
      SELECT correo
      FROM seguridad.usuarios
      WHERE activo = true
        AND correo IS NOT NULL
        AND correo <> ''
    `);

    const usuarios = obtenerFilas(usuariosResultado);

    if (!usuarios.length) {
      return NextResponse.json({
        success: true,
        message: "No hay usuarios activos con correo para notificar",
        enviados: 0,
        fallidos: 0,
        total: 0,
      });
    }

    const html = NuevoCursoEmail({
      titulo,
      costo,
    });

    let enviados = 0;
    let fallidos = 0;

    for (const usuario of usuarios) {
      const email = String(usuario.correo ?? "").trim();

      if (!email) {
        fallidos++;
        continue;
      }

      try {
        const result = await sendEmail(
          email,
          `✨ Nuevo curso disponible: ${titulo}`,
          html
        );

        if (result.success) {
          enviados++;
        } else {
          fallidos++;
        }
      } catch {
        fallidos++;
      }
    }

    return NextResponse.json({
      success: true,
      enviados,
      fallidos,
      total: usuarios.length,
    });
  } catch (error) {
    console.error("Error notificando nuevo curso:", error);

    return NextResponse.json(
      { error: "Error al notificar nuevo curso" },
      { status: 500 }
    );
  }
}