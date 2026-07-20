// src/app/api/modalidades/route.ts

import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";

import { requireApiRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { withUserEmail } from "@/lib/db-with-user";
import { modalidades } from "@/lib/schema";
import {
  hasPostgresCode,
  type ValidationResult,
} from "@/lib/validators/common";
import {
  validarModalidadCurso,
  type ModalidadCursoInput,
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

    const data = await db
      .select({
        idModalidad:
          modalidades.idModalidad,
        nombreModalidad:
          modalidades.nombreModalidad,
        descripcion:
          modalidades.descripcion,
      })
      .from(modalidades)
      .orderBy(
        desc(modalidades.idModalidad)
      );

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error: unknown) {
    console.error(
      "Error en GET modalidades:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Error al obtener modalidades",
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
      validarModalidadCurso(body);

    if (!validation.success) {
      return validationErrorResponse(validation);
    }

    const input: ModalidadCursoInput =
      validation.data;

    const nuevas = await withUserEmail(
      session.user.correo,
      async () =>
        db
          .insert(modalidades)
          .values({
            nombreModalidad:
              input.nombreModalidad,
            descripcion:
              input.descripcion,
          })
          .returning({
            idModalidad:
              modalidades.idModalidad,
            nombreModalidad:
              modalidades.nombreModalidad,
            descripcion:
              modalidades.descripcion,
          })
    );

    const modalidad = nuevas[0];

    if (!modalidad) {
      return NextResponse.json(
        {
          error:
            "No se pudo crear la modalidad",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      modalidad,
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error(
      "Error en POST modalidad:",
      error
    );

    if (hasPostgresCode(error, "23505")) {
      return NextResponse.json(
        {
          error:
            "Ya existe una modalidad con ese nombre",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        error:
          "Error al crear modalidad",
      },
      { status: 500 }
    );
  }
}