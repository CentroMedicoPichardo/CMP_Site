// src/app/api/modalidades/[id]/route.ts

import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";

import { requireApiRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { withUserEmail } from "@/lib/db-with-user";
import {
  cursos,
  modalidades,
} from "@/lib/schema";
import {
  hasPostgresCode,
  type ValidationResult,
} from "@/lib/validators/common";
import {
  validarModalidadCurso,
  type ModalidadCursoInput,
} from "@/lib/validators/catalogos-cursos";

interface ModalidadRouteContext {
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
  _request: Request,
  { params }: ModalidadRouteContext
) {
  try {
    const { id } = await params;
    const modalidadId = parseId(id);

    if (!modalidadId) {
      return NextResponse.json(
        {
          error:
            "ID de modalidad inválido",
        },
        { status: 400 }
      );
    }

    const resultado = await db
      .select({
        idModalidad:
          modalidades.idModalidad,
        nombreModalidad:
          modalidades.nombreModalidad,
        descripcion:
          modalidades.descripcion,
      })
      .from(modalidades)
      .where(
        eq(
          modalidades.idModalidad,
          modalidadId
        )
      )
      .limit(1);

    const modalidad = resultado[0];

    if (!modalidad) {
      return NextResponse.json(
        {
          error:
            "Modalidad no encontrada",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(modalidad, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error: unknown) {
    console.error(
      "Error en GET modalidad:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Error al obtener modalidad",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: ModalidadRouteContext
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
    const modalidadId = parseId(id);

    if (!modalidadId) {
      return NextResponse.json(
        {
          error:
            "ID de modalidad inválido",
        },
        { status: 400 }
      );
    }

    const body: unknown = await request.json();

    const validation =
      validarModalidadCurso(body);

    if (!validation.success) {
      return validationErrorResponse(validation);
    }

    const input: ModalidadCursoInput =
      validation.data;

    const actualizadas =
      await withUserEmail(
        session.user.correo,
        async () =>
          db
            .update(modalidades)
            .set({
              nombreModalidad:
                input.nombreModalidad,
              descripcion:
                input.descripcion,
            })
            .where(
              eq(
                modalidades.idModalidad,
                modalidadId
              )
            )
            .returning({
              idModalidad:
                modalidades.idModalidad,
              nombreModalidad:
                modalidades.nombreModalidad,
              descripcion:
                modalidades.descripcion,
            })
      );

    const modalidad = actualizadas[0];

    if (!modalidad) {
      return NextResponse.json(
        {
          error:
            "Modalidad no encontrada",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(modalidad);
  } catch (error: unknown) {
    console.error(
      "Error en PUT modalidad:",
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
          "Error al actualizar modalidad",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: ModalidadRouteContext
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
    const modalidadId = parseId(id);

    if (!modalidadId) {
      return NextResponse.json(
        {
          error:
            "ID de modalidad inválido",
        },
        { status: 400 }
      );
    }

    const uso = await db
      .select({
        total:
          sql<number>`COUNT(*)::int`,
      })
      .from(cursos)
      .where(
        eq(
          cursos.idModalidad,
          modalidadId
        )
      );

    const totalCursos =
      uso[0]?.total ?? 0;

    if (totalCursos > 0) {
      return NextResponse.json(
        {
          error:
            "No se puede eliminar la modalidad porque está siendo utilizada por uno o más cursos",
        },
        { status: 409 }
      );
    }

    const eliminadas =
      await withUserEmail(
        session.user.correo,
        async () =>
          db
            .delete(modalidades)
            .where(
              eq(
                modalidades.idModalidad,
                modalidadId
              )
            )
            .returning({
              idModalidad:
                modalidades.idModalidad,
              nombreModalidad:
                modalidades.nombreModalidad,
              descripcion:
                modalidades.descripcion,
            })
      );

    const modalidad = eliminadas[0];

    if (!modalidad) {
      return NextResponse.json(
        {
          error:
            "Modalidad no encontrada",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message:
        "Modalidad eliminada correctamente",
      modalidad,
    });
  } catch (error: unknown) {
    console.error(
      "Error en DELETE modalidad:",
      error
    );

    if (hasPostgresCode(error, "23503")) {
      return NextResponse.json(
        {
          error:
            "No se puede eliminar la modalidad porque tiene registros relacionados",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        error:
          "Error al eliminar modalidad",
      },
      { status: 500 }
    );
  }
}