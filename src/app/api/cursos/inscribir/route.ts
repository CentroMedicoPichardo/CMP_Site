// src/app/api/cursos/inscribir/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
import { requireApiAuth } from "@/lib/auth";

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

export async function POST(request: Request) {
  const { session, error } = await requireApiAuth();

  if (error || !session) {
    return error;
  }

  try {
    const body = await request.json();

    const { cursoId, metodoPago, montoPagado } = body;

    const cursoIdNum = Number(cursoId);

    if (!Number.isFinite(cursoIdNum) || cursoIdNum <= 0) {
      return NextResponse.json(
        { error: "Curso ID inválido" },
        { status: 400 }
      );
    }

    const usuarioId = session.user.id;

    if (!usuarioId) {
      return NextResponse.json(
        { error: "No se pudo identificar al usuario" },
        { status: 401 }
      );
    }

    let montoFinal: string | null = null;

    if (
      montoPagado !== undefined &&
      montoPagado !== null &&
      montoPagado !== ""
    ) {
      const montoNum = Number(montoPagado);

      if (!Number.isFinite(montoNum) || montoNum < 0) {
        return NextResponse.json(
          { error: "El monto pagado no es válido" },
          { status: 400 }
        );
      }

      montoFinal = montoNum.toFixed(2);
    }

    const metodoPagoSeguro =
      typeof metodoPago === "string" && metodoPago.trim().length > 0
        ? metodoPago.trim()
        : "pendiente";

    return await db.transaction(async (tx) => {
      const inscripcionExistenteResultado = await tx.execute(sql`
        SELECT id_inscripcion
        FROM academia.inscripciones_cursos
        WHERE curso_id = ${cursoIdNum}
        AND usuario_id = ${usuarioId}
        LIMIT 1
      `);

      const inscripcionExistente = obtenerFilas(
        inscripcionExistenteResultado
      );

      if (inscripcionExistente.length > 0) {
        return NextResponse.json(
          { error: "Ya estás inscrito en este curso" },
          { status: 400 }
        );
      }

      const cursoResultado = await tx.execute(sql`
        SELECT 
          id_curso,
          cupo_maximo,
          cupos_ocupados,
          activo,
          fecha_inicio,
          costo
        FROM academia.cursos
        WHERE id_curso = ${cursoIdNum}
        FOR UPDATE
      `);

      const curso = obtenerFilas(cursoResultado);

      if (!curso.length) {
        return NextResponse.json(
          { error: "Curso no encontrado" },
          { status: 404 }
        );
      }

      const cursoData = curso[0];

      const cupoMaximo = Number(cursoData.cupo_maximo ?? 0);
      const cuposOcupados = Number(cursoData.cupos_ocupados ?? 0);
      const cursoActivo = cursoData.activo === true;

      let fechaInicio: Date | null = null;
      const rawFecha = cursoData.fecha_inicio;

      if (rawFecha) {
        if (typeof rawFecha === "string" || typeof rawFecha === "number") {
          fechaInicio = new Date(rawFecha);
        } else if (rawFecha instanceof Date) {
          fechaInicio = rawFecha;
        }

        if (fechaInicio && Number.isNaN(fechaInicio.getTime())) {
          fechaInicio = null;
        }
      }

      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      let costo = "0.00";

      if (montoFinal) {
        costo = montoFinal;
      } else if (cursoData.costo) {
        costo = String(cursoData.costo);
      }

      if (!cursoActivo) {
        return NextResponse.json(
          { error: "El curso no está disponible" },
          { status: 400 }
        );
      }

      if (fechaInicio && fechaInicio < hoy) {
        return NextResponse.json(
          { error: "El curso ya comenzó" },
          { status: 400 }
        );
      }

      if (cupoMaximo > 0 && cuposOcupados >= cupoMaximo) {
        return NextResponse.json(
          { error: "No hay cupos disponibles" },
          { status: 400 }
        );
      }

      try {
        const nuevaInscripcionResultado = await tx.execute(sql`
          INSERT INTO academia.inscripciones_cursos (
            curso_id,
            usuario_id,
            fecha_inscripcion,
            estado,
            monto_pagado,
            metodo_pago
          )
          VALUES (
            ${cursoIdNum},
            ${usuarioId},
            CURRENT_TIMESTAMP,
            'activo',
            ${costo}::numeric(10,2),
            ${metodoPagoSeguro}
          )
          RETURNING id_inscripcion
        `);

        const nuevaInscripcion = obtenerFilas(nuevaInscripcionResultado);

        if (!nuevaInscripcion.length) {
          throw new Error("No se pudo crear la inscripción");
        }

        if (cupoMaximo > 0) {
          await tx.execute(sql`
            UPDATE academia.cursos
            SET cupos_ocupados = COALESCE(cupos_ocupados, 0) + 1
            WHERE id_curso = ${cursoIdNum}
          `);
        }

        return NextResponse.json({
          success: true,
          message: "Inscripción exitosa",
          inscripcionId: nuevaInscripcion[0].id_inscripcion,
        });
      } catch (error: any) {
        console.error("Error al registrar inscripción:", error);

        if (
          error?.message?.includes("unique_inscripcion_curso_usuario") ||
          error?.message?.includes("duplicate key")
        ) {
          return NextResponse.json(
            { error: "Ya estás inscrito en este curso" },
            { status: 400 }
          );
        }

        return NextResponse.json(
          { error: "Error en la base de datos al registrar la inscripción" },
          { status: 500 }
        );
      }
    });
  } catch (error) {
    console.error("Error general en inscripción:", error);

    return NextResponse.json(
      { error: "Error al procesar la inscripción" },
      { status: 500 }
    );
  }
}