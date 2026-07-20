// src/app/api/categorias/[id]/route.ts

import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

import { requireApiRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { withUserEmail } from "@/lib/db-with-user";
import { categoriasCursos } from "@/lib/schema";
import {
  hasPostgresCode,
  type ValidationResult,
} from "@/lib/validators/common";
import {
  validarCategoriaCurso,
  type CategoriaCursoInput,
} from "@/lib/validators/catalogos-cursos";

interface CategoriaRouteContext {
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
  { params }: CategoriaRouteContext
) {
  try {
    const { id } = await params;
    const categoriaId = parseId(id);

    if (!categoriaId) {
      return NextResponse.json(
        {
          error: "ID de categoría inválido",
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
          categoriasCursos.idCategoria,
          categoriaId
        )
      : and(
          eq(
            categoriasCursos.idCategoria,
            categoriaId
          ),
          eq(categoriasCursos.activo, true)
        );

    const resultado = await db
      .select({
        idCategoria:
          categoriasCursos.idCategoria,
        nombreCategoria:
          categoriasCursos.nombreCategoria,
        descripcion:
          categoriasCursos.descripcion,
        activo: categoriasCursos.activo,
      })
      .from(categoriasCursos)
      .where(condicion)
      .limit(1);

    const categoria = resultado[0];

    if (!categoria) {
      return NextResponse.json(
        {
          error: "Categoría no encontrada",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(categoria);
  } catch (error: unknown) {
    console.error(
      "Error en GET categoría:",
      error
    );

    return NextResponse.json(
      {
        error: "Error al obtener categoría",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: CategoriaRouteContext
) {
  const { session, error } =
    await requireApiRole("admin");

  if (error) {
    return error;
  }

  if (!session) {
    return NextResponse.json(
      { error: "No autenticado" },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const categoriaId = parseId(id);

    if (!categoriaId) {
      return NextResponse.json(
        {
          error: "ID de categoría inválido",
        },
        { status: 400 }
      );
    }

    const body: unknown = await request.json();

    const validation =
      validarCategoriaCurso(body, {
        requireActivo: true,
      });

    if (!validation.success) {
      return validationErrorResponse(validation);
    }

    const input: CategoriaCursoInput =
      validation.data;

    if (input.activo === undefined) {
      return NextResponse.json(
        {
          error:
            "El estado de la categoría es requerido",
        },
        { status: 400 }
      );
    }

    const actualizadas =
      await withUserEmail(
        session.user.correo,
        async () =>
          db
            .update(categoriasCursos)
            .set({
              nombreCategoria:
                input.nombreCategoria,
              descripcion: input.descripcion,
              activo: input.activo,
            })
            .where(
              eq(
                categoriasCursos.idCategoria,
                categoriaId
              )
            )
            .returning({
              idCategoria:
                categoriasCursos.idCategoria,
              nombreCategoria:
                categoriasCursos.nombreCategoria,
              descripcion:
                categoriasCursos.descripcion,
              activo:
                categoriasCursos.activo,
            })
      );

    const categoria = actualizadas[0];

    if (!categoria) {
      return NextResponse.json(
        {
          error: "Categoría no encontrada",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(categoria);
  } catch (error: unknown) {
    console.error(
      "Error en PUT categoría:",
      error
    );

    if (hasPostgresCode(error, "23505")) {
      return NextResponse.json(
        {
          error:
            "Ya existe una categoría con ese nombre",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        error:
          "Error al actualizar categoría",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: CategoriaRouteContext
) {
  const { session, error } =
    await requireApiRole("admin");

  if (error) {
    return error;
  }

  if (!session) {
    return NextResponse.json(
      { error: "No autenticado" },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const categoriaId = parseId(id);

    if (!categoriaId) {
      return NextResponse.json(
        {
          error: "ID de categoría inválido",
        },
        { status: 400 }
      );
    }

    const ocultadas = await withUserEmail(
      session.user.correo,
      async () =>
        db
          .update(categoriasCursos)
          .set({
            activo: false,
          })
          .where(
            eq(
              categoriasCursos.idCategoria,
              categoriaId
            )
          )
          .returning({
            idCategoria:
              categoriasCursos.idCategoria,
            nombreCategoria:
              categoriasCursos.nombreCategoria,
            activo: categoriasCursos.activo,
          })
    );

    const categoria = ocultadas[0];

    if (!categoria) {
      return NextResponse.json(
        {
          error: "Categoría no encontrada",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message:
        "Categoría ocultada correctamente",
      categoria,
    });
  } catch (error: unknown) {
    console.error(
      "Error en DELETE categoría:",
      error
    );

    return NextResponse.json(
      {
        error: "Error al ocultar categoría",
      },
      { status: 500 }
    );
  }
}