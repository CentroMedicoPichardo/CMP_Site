// src/app/api/instructores/[id]/route.ts

import { NextResponse } from "next/server";
import {
  and,
  eq,
  sql,
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

interface InstructorRouteContext {
  params: Promise<{
    id: string;
  }>;
}

function parseId(id: string): number | null {
  const parsed = Number(id);

  return Number.isInteger(parsed) && parsed > 0
    ? parsed
    : null;
}

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

export async function GET(
  request: Request,
  { params }: InstructorRouteContext
) {
  try {
    const { id } = await params;
    const instructorId = parseId(id);

    if (!instructorId) {
      return NextResponse.json(
        {
          error:
            "ID de instructor inválido",
        },
        { status: 400 }
      );
    }

    const { searchParams } =
      new URL(request.url);

    const isAdmin =
      searchParams.get("admin") === "true";

    if (isAdmin) {
      const { error } =
        await requireApiRole("admin");

      if (error) {
        return error;
      }
    }

    const condicion = isAdmin
      ? eq(
          instructores.idInstructor,
          instructorId
        )
      : and(
          eq(
            instructores.idInstructor,
            instructorId
          ),
          eq(instructores.activo, true)
        );

    const resultado = await db
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
      .where(condicion)
      .limit(1);

    const instructor = resultado[0];

    if (!instructor) {
      return NextResponse.json(
        {
          error:
            "Instructor no encontrado",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(instructor);
  } catch (error: unknown) {
    console.error(
      "Error en GET instructor:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Error al obtener instructor",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: InstructorRouteContext
) {
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
    const { id } = await params;
    const instructorId = parseId(id);

    if (!instructorId) {
      return NextResponse.json(
        {
          error:
            "ID de instructor inválido",
        },
        { status: 400 }
      );
    }

    const body: unknown = await request.json();

    const validation =
      validarInstructor(body, {
        requireActivo: true,
      });

    if (!validation.success) {
      return validationErrorResponse(validation);
    }

    const input: InstructorInput =
      validation.data;

    if (input.activo === undefined) {
      return NextResponse.json(
        {
          error:
            "El estado del instructor es requerido",
        },
        { status: 400 }
      );
    }

    const actualizados =
      await withUserEmail(
        session.user.correo,
        async () =>
          db
            .update(instructores)
            .set({
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
              activo: input.activo,
              updatedAt:
                sql`CURRENT_TIMESTAMP`,
            })
            .where(
              eq(
                instructores.idInstructor,
                instructorId
              )
            )
            .returning({
              idInstructor:
                instructores.idInstructor,
              nombre:
                instructores.nombre,
              apellidoPaterno:
                instructores.apellidoPaterno,
              apellidoMaterno:
                instructores.apellidoMaterno,
              especialidad:
                instructores.especialidad,
              edad: instructores.edad,
              telefono:
                instructores.telefono,
              correo: instructores.correo,
              direccion:
                instructores.direccion,
              activo: instructores.activo,
            })
      );

    const instructor = actualizados[0];

    if (!instructor) {
      return NextResponse.json(
        {
          error:
            "Instructor no encontrado",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(instructor);
  } catch (error: unknown) {
    console.error(
      "Error en PUT instructor:",
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
          "Error al actualizar instructor",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: InstructorRouteContext
) {
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
    const { id } = await params;
    const instructorId = parseId(id);

    if (!instructorId) {
      return NextResponse.json(
        {
          error:
            "ID de instructor inválido",
        },
        { status: 400 }
      );
    }

    const ocultados = await withUserEmail(
      session.user.correo,
      async () =>
        db
          .update(instructores)
          .set({
            activo: false,
            updatedAt:
              sql`CURRENT_TIMESTAMP`,
          })
          .where(
            eq(
              instructores.idInstructor,
              instructorId
            )
          )
          .returning({
            idInstructor:
              instructores.idInstructor,
            nombre: instructores.nombre,
            apellidoPaterno:
              instructores.apellidoPaterno,
            especialidad:
              instructores.especialidad,
            activo: instructores.activo,
          })
    );

    const instructor = ocultados[0];

    if (!instructor) {
      return NextResponse.json(
        {
          error:
            "Instructor no encontrado",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message:
        "Instructor ocultado correctamente",
      instructor,
    });
  } catch (error: unknown) {
    console.error(
      "Error en DELETE instructor:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Error al ocultar instructor",
      },
      { status: 500 }
    );
  }
}