// src/app/api/ubicaciones/[id]/route.ts

import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

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

interface UbicacionRouteContext {
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
  { params }: UbicacionRouteContext
) {
  try {
    const { id } = await params;
    const ubicacionId = parseId(id);

    if (!ubicacionId) {
      return NextResponse.json(
        {
          error: "ID de ubicación inválido",
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
          ubicacionesCursos.idUbicacion,
          ubicacionId
        )
      : and(
          eq(
            ubicacionesCursos.idUbicacion,
            ubicacionId
          ),
          eq(ubicacionesCursos.activo, true)
        );

    const resultado = await db
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
      .where(condicion)
      .limit(1);

    const ubicacion = resultado[0];

    if (!ubicacion) {
      return NextResponse.json(
        {
          error: "Ubicación no encontrada",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(ubicacion, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error: unknown) {
    console.error(
      "Error en GET ubicación:",
      error
    );

    return NextResponse.json(
      {
        error: "Error al obtener ubicación",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: UbicacionRouteContext
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
    const ubicacionId = parseId(id);

    if (!ubicacionId) {
      return NextResponse.json(
        {
          error: "ID de ubicación inválido",
        },
        { status: 400 }
      );
    }

    const body: unknown = await request.json();

    const validation =
      validarUbicacionCurso(body, {
        requireActivo: true,
      });

    if (!validation.success) {
      return validationErrorResponse(validation);
    }

    const input: UbicacionCursoInput =
      validation.data;

    if (input.activo === undefined) {
      return NextResponse.json(
        {
          error:
            "El estado de la ubicación es requerido",
        },
        { status: 400 }
      );
    }

    const actualizadas =
      await withUserEmail(
        session.user.correo,
        async () =>
          db
            .update(ubicacionesCursos)
            .set({
              nombreUbicacion:
                input.nombreUbicacion,
              direccionCompleta:
                input.direccionCompleta,
              capacidadMaxima:
                input.capacidadMaxima,
              activo: input.activo,
            })
            .where(
              eq(
                ubicacionesCursos.idUbicacion,
                ubicacionId
              )
            )
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

    const ubicacion = actualizadas[0];

    if (!ubicacion) {
      return NextResponse.json(
        {
          error: "Ubicación no encontrada",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(ubicacion);
  } catch (error: unknown) {
    console.error(
      "Error en PUT ubicación:",
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
        error:
          "Error al actualizar ubicación",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: UbicacionRouteContext
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
    const ubicacionId = parseId(id);

    if (!ubicacionId) {
      return NextResponse.json(
        {
          error: "ID de ubicación inválido",
        },
        { status: 400 }
      );
    }

    const ocultadas = await withUserEmail(
      session.user.correo,
      async () =>
        db
          .update(ubicacionesCursos)
          .set({
            activo: false,
          })
          .where(
            eq(
              ubicacionesCursos.idUbicacion,
              ubicacionId
            )
          )
          .returning({
            idUbicacion:
              ubicacionesCursos.idUbicacion,
            nombreUbicacion:
              ubicacionesCursos.nombreUbicacion,
            activo:
              ubicacionesCursos.activo,
          })
    );

    const ubicacion = ocultadas[0];

    if (!ubicacion) {
      return NextResponse.json(
        {
          error: "Ubicación no encontrada",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message:
        "Ubicación ocultada correctamente",
      ubicacion,
    });
  } catch (error: unknown) {
    console.error(
      "Error en DELETE ubicación:",
      error
    );

    return NextResponse.json(
      {
        error: "Error al ocultar ubicación",
      },
      { status: 500 }
    );
  }
}