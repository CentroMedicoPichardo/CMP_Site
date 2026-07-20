// src/app/api/instructores/route.ts

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
import { instructores } from "@/lib/schema";
import {
  hasPostgresCode,
  type ValidationResult,
} from "@/lib/validators/common";
import {
  validarInstructor,
  type InstructorInput,
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

    const especialidad =
      searchParams.get("especialidad")?.trim() ?? "";

    if (isAdmin) {
      const { error } =
        await requireApiRole("admin");

      if (error) {
        return error;
      }
    }

    const filtros: SQL[] = [];

    if (!isAdmin) {
      filtros.push(eq(instructores.activo, true));
    }

    if (especialidad) {
      filtros.push(
        eq(
          instructores.especialidad,
          especialidad.slice(0, 100)
        )
      );
    }

    const data = await db
      .select({
        idInstructor:
          instructores.idInstructor,
        nombre: instructores.nombre,
        apellidoPaterno:
          instructores.apellidoPaterno,
        apellidoMaterno:
          instructores.apellidoMaterno,
        especialidad:
          instructores.especialidad,
        edad: instructores.edad,
        telefono: instructores.telefono,
        correo: instructores.correo,
        direccion: instructores.direccion,
        activo: instructores.activo,
      })
      .from(instructores)
      .where(
        filtros.length > 0
          ? and(...filtros)
          : undefined
      )
      .orderBy(
        desc(instructores.idInstructor)
      );

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error(
      "Error en GET instructores:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Error al obtener instructores",
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
      validarInstructor(body);

    if (!validation.success) {
      return validationErrorResponse(validation);
    }

    const input: InstructorInput =
      validation.data;

    const nuevos = await withUserEmail(
      session.user.correo,
      async () =>
        db
          .insert(instructores)
          .values({
            nombre: input.nombre,
            apellidoPaterno:
              input.apellidoPaterno,
            apellidoMaterno:
              input.apellidoMaterno,
            especialidad:
              input.especialidad,
            edad: input.edad,
            telefono: input.telefono,
            correo: input.correo,
            direccion: input.direccion,
            activo: true,
          })
          .returning({
            idInstructor:
              instructores.idInstructor,
            nombre: instructores.nombre,
            apellidoPaterno:
              instructores.apellidoPaterno,
            apellidoMaterno:
              instructores.apellidoMaterno,
            especialidad:
              instructores.especialidad,
            edad: instructores.edad,
            telefono: instructores.telefono,
            correo: instructores.correo,
            direccion: instructores.direccion,
            activo: instructores.activo,
          })
    );

    const instructor = nuevos[0];

    if (!instructor) {
      return NextResponse.json(
        {
          error:
            "No se pudo crear el instructor",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      instructor,
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error(
      "Error en POST instructor:",
      error
    );

    if (hasPostgresCode(error, "23505")) {
      return NextResponse.json(
        {
          error:
            "Ya existe un instructor con ese correo",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        error:
          "Error al crear instructor",
      },
      { status: 500 }
    );
  }
}