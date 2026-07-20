// src/app/api/cursos/promocionar/route.ts

import { NextResponse } from "next/server";
import {
  and,
  eq,
  isNotNull,
  ne,
} from "drizzle-orm";

import { requireApiRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { PromocionCursoEmail } from "@/lib/PromocionCursoEmail";
import { cursos, usuarios } from "@/lib/schema";
import {
  isRecord,
  parsePositiveInteger,
} from "@/lib/validators/common";

interface ResultadoPromocion {
  enviados: number;
  fallidos: number;
  total: number;
}

function obtenerCursoId(value: unknown): number | null {
  if (!isRecord(value)) {
    return null;
  }

  return parsePositiveInteger(value.cursoId);
}

export async function GET() {
  return NextResponse.json(
    {
      message:
        "Este endpoint solo acepta solicitudes POST para promocionar un curso.",
    },
    {
      status: 405,
      headers: {
        Allow: "POST",
      },
    }
  );
}

export async function POST(request: Request) {
  const { error } = await requireApiRole("admin");

  if (error) {
    return error;
  }

  try {
    const body: unknown = await request.json();
    const cursoId = obtenerCursoId(body);

    if (!cursoId) {
      return NextResponse.json(
        {
          error: "Curso ID inválido",
        },
        { status: 400 }
      );
    }

    const resultadoCurso = await db
      .select({
        tituloCurso: cursos.tituloCurso,
        cupoMaximo: cursos.cupoMaximo,
        cuposOcupados: cursos.cuposOcupados,
        costo: cursos.costo,
      })
      .from(cursos)
      .where(eq(cursos.idCurso, cursoId))
      .limit(1);

    const curso = resultadoCurso[0];

    if (!curso) {
      return NextResponse.json(
        {
          error: "Curso no encontrado",
        },
        { status: 404 }
      );
    }

    const cupoMaximo =
      Number(curso.cupoMaximo) || 0;

    const cuposOcupados =
      Number(curso.cuposOcupados) || 0;

    const lugaresDisponibles = Math.max(
      cupoMaximo - cuposOcupados,
      0
    );

    if (cupoMaximo > 0 && lugaresDisponibles === 0) {
      return NextResponse.json(
        {
          error:
            "No se puede promocionar un curso sin lugares disponibles",
        },
        { status: 409 }
      );
    }

    const destinatarios = await db
      .select({
        correo: usuarios.correo,
      })
      .from(usuarios)
      .where(
        and(
          eq(usuarios.activo, true),
          isNotNull(usuarios.correo),
          ne(usuarios.correo, "")
        )
      );

    const correos = destinatarios
      .map((usuario) => usuario.correo?.trim())
      .filter(
        (correo): correo is string =>
          typeof correo === "string" &&
          correo.length > 0
      );

    if (correos.length === 0) {
      return NextResponse.json({
        success: true,
        message:
          "No hay usuarios activos con correo para promocionar",
        enviados: 0,
        fallidos: 0,
        total: 0,
      });
    }

    const titulo =
      curso.tituloCurso || "Curso";

    const costo = curso.costo ?? "0.00";

    const html = PromocionCursoEmail({
      titulo,
      lugaresDisponibles,
      costo,
    });

    const resultado: ResultadoPromocion = {
      enviados: 0,
      fallidos: 0,
      total: correos.length,
    };

    for (const correo of correos) {
      try {
        const envio = await sendEmail(
          correo,
          `🎓 ${titulo}`,
          html
        );

        if (envio.success) {
          resultado.enviados += 1;
        } else {
          resultado.fallidos += 1;
        }
      } catch (error: unknown) {
        console.error(
          `Error enviando promoción a ${correo}:`,
          error
        );

        resultado.fallidos += 1;
      }
    }

    return NextResponse.json({
      success: true,
      ...resultado,
    });
  } catch (error: unknown) {
    console.error(
      "Error en promoción de curso:",
      error
    );

    return NextResponse.json(
      {
        error: "Error al enviar promoción",
      },
      { status: 500 }
    );
  }
}