// src/app/api/ubicaciones/route.ts

import { NextResponse } from "next/server";
import {
  and,
  desc,
  eq,
  type SQL,
} from "drizzle-orm";

import { requireApiRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { withUserEmail } from "@/lib/db-with-user";
import { ubicacionesCursos } from "@/lib/schema";
import {
  hasPostgresCode,
  type ValidationResult,
} from "@/lib/validators/common";
import {
  validarUbicacionCurso,
  type UbicacionCursoInput,
} from "@/lib/validators/catalogos-cursos";

function validationErrorResponse<T>(
  result: Extract<
    ValidationResult<T>,
    { success: false }
  >
) {
  return NextResponse.json(
    {
      error: result.error,
      details: result.fieldErrors,
    },
    { status: 400 }
  );
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const isAdmin =
      searchParams.get("admin") === "true";

    if (isAdmin) {
      const { error } =
        await requireApiRole("admin");

      if (error) {
        return error;
      }
    }

    const filtros: SQL[] = [];

    if (!isAdmin) {
      filtros.push(
        eq(ubicacionesCursos.activo, true)
      );
    }

    const data = await db
      .select({
        idUbicacion:
          ubicacionesCursos.idUbicacion,
        nombreUbicacion:
          ubicacionesCursos.nombreUbicacion,
        direccionCompleta:
          ubicacionesCursos.direccionCompleta,
        capacidadMaxima:
          ubicacionesCursos.capacidadMaxima,
        activo: ubicacionesCursos.activo,
      })
      .from(ubicacionesCursos)
      .where(
        filtros.length > 0
          ? and(...filtros)
          : undefined
      )
      .orderBy(
        desc(ubicacionesCursos.idUbicacion)
      );

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error: unknown) {
    console.error(
      "Error en GET ubicaciones:",
      error
    );

    return NextResponse.json(
      {
        error: "Error al obtener ubicaciones",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { session, error } =
    await requireApiRole("admin");

  if (error) {
    return error;
  }

  if (!session) {
    return NextResponse.json(
      {
        error: "No autenticado",
      },
      { status: 401 }
    );
  }

  try {
    const body: unknown = await request.json();

    const validation =
      validarUbicacionCurso(body);

    if (!validation.success) {
      return validationErrorResponse(validation);
    }

    const input: UbicacionCursoInput =
      validation.data;

    const nuevas = await withUserEmail(
      session.user.correo,
      async () =>
        db
          .insert(ubicacionesCursos)
          .values({
            nombreUbicacion:
              input.nombreUbicacion,
            direccionCompleta:
              input.direccionCompleta,
            capacidadMaxima:
              input.capacidadMaxima,
            activo: true,
          })
          .returning({
            idUbicacion:
              ubicacionesCursos.idUbicacion,
            nombreUbicacion:
              ubicacionesCursos.nombreUbicacion,
            direccionCompleta:
              ubicacionesCursos.direccionCompleta,
            capacidadMaxima:
              ubicacionesCursos.capacidadMaxima,
            activo:
              ubicacionesCursos.activo,
          })
    );

    const ubicacion = nuevas[0];

    if (!ubicacion) {
      return NextResponse.json(
        {
          error:
            "No se pudo crear la ubicación",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      ubicacion,
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error(
      "Error en POST ubicación:",
      error
    );

    if (hasPostgresCode(error, "23505")) {
      return NextResponse.json(
        {
          error:
            "Ya existe una ubicación con ese nombre",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        error: "Error al crear ubicación",
      },
      { status: 500 }
    );
  }
}