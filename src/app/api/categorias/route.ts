// src/app/api/categorias/route.ts

import { NextResponse } from "next/server";
import {
  and,
  desc,
  eq,
  ilike,
  type SQL,
} from "drizzle-orm";

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
    const search =
      searchParams.get("search")?.trim() ?? "";

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
        eq(categoriasCursos.activo, true)
      );
    }

    if (search) {
      filtros.push(
        ilike(
          categoriasCursos.nombreCategoria,
          `%${search.slice(0, 50)}%`
        )
      );
    }

    const data = await db
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
      .where(
        filtros.length > 0
          ? and(...filtros)
          : undefined
      )
      .orderBy(
        desc(categoriasCursos.idCategoria)
      );

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error(
      "Error en GET categorías:",
      error
    );

    return NextResponse.json(
      {
        error: "Error al obtener categorías",
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
      { error: "No autenticado" },
      { status: 401 }
    );
  }

  try {
    const body: unknown = await request.json();

    const validation =
      validarCategoriaCurso(body);

    if (!validation.success) {
      return validationErrorResponse(validation);
    }

    const input: CategoriaCursoInput =
      validation.data;

    const nueva = await withUserEmail(
      session.user.correo,
      async () =>
        db
          .insert(categoriasCursos)
          .values({
            nombreCategoria:
              input.nombreCategoria,
            descripcion: input.descripcion,
            activo: true,
          })
          .returning({
            idCategoria:
              categoriasCursos.idCategoria,
            nombreCategoria:
              categoriasCursos.nombreCategoria,
            descripcion:
              categoriasCursos.descripcion,
            activo: categoriasCursos.activo,
          })
    );

    const categoria = nueva[0];

    if (!categoria) {
      return NextResponse.json(
        {
          error:
            "No se pudo crear la categoría",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      categoria,
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error(
      "Error en POST categoría:",
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
        error: "Error al crear categoría",
      },
      { status: 500 }
    );
  }
}