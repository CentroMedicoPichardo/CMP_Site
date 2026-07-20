// src/app/api/cursos/route.ts

import { NextResponse } from "next/server";
import { and, desc, eq, sql, type SQL } from "drizzle-orm";

import { requireApiRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { withUserEmail } from "@/lib/db-with-user";
import {
  categoriasCursos,
  cursos,
  instructores,
  modalidades,
  ubicacionesCursos,
} from "@/lib/schema";
import {
  hasPostgresCode,
  type ValidationResult,
} from "@/lib/validators/common";
import { validarCrearCurso } from "@/lib/validators/cursos";
import type { CrearCursoInput } from "@/types/cursos";

const cursoSelect = {
  idCurso: cursos.idCurso,
  tituloCurso: cursos.tituloCurso,
  descripcion: cursos.descripcion,

  idInstructor: cursos.idInstructor,
  instructorNombre:
    sql<string>`TRIM(CONCAT(
      ${instructores.nombre},
      ' ',
      ${instructores.apellidoPaterno},
      ' ',
      COALESCE(${instructores.apellidoMaterno}, '')
    ))`.as("instructor_nombre"),
  instructorEspecialidad: instructores.especialidad,

  idCategoria: cursos.idCategoria,
  categoriaNombre: categoriasCursos.nombreCategoria,

  idUbicacion: cursos.idUbicacion,
  ubicacionNombre: ubicacionesCursos.nombreUbicacion,
  ubicacionDireccion: ubicacionesCursos.direccionCompleta,

  idModalidad: cursos.idModalidad,
  modalidadNombre: modalidades.nombreModalidad,

  fechaInicio: cursos.fechaInicio,
  fechaFin: cursos.fechaFin,
  horario: cursos.horario,
  dirigidoA: cursos.dirigidoA,

  cupoMaximo: cursos.cupoMaximo,
  cuposOcupados: cursos.cuposOcupados,

  costo: cursos.costo,
  urlImagenPortada: cursos.urlImagenPortada,
  activo: cursos.activo,

  createdAt: cursos.createdAt,
  updatedAt: cursos.updatedAt,
};

function validationErrorResponse<T>(
  result: Extract<ValidationResult<T>, { success: false }>
) {
  return NextResponse.json(
    {
      error: result.error,
      details: result.fieldErrors,
    },
    { status: 400 }
  );
}

function databaseErrorResponse(error: unknown) {
  if (hasPostgresCode(error, "23503")) {
    return NextResponse.json(
      {
        error:
          "El instructor, la categoría, la modalidad o la ubicación seleccionada no existe",
      },
      { status: 400 }
    );
  }

  if (hasPostgresCode(error, "23505")) {
    return NextResponse.json(
      {
        error: "Ya existe un curso con esos datos",
      },
      { status: 409 }
    );
  }

  return null;
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

    const modalidadIdParam =
      searchParams.get("modalidadId");

    const dirigidoA =
      searchParams.get("dirigidoA")?.trim() ?? "";

    const filtros: SQL[] = [];

    if (!isAdmin) {
      filtros.push(eq(cursos.activo, true));
    }

    if (modalidadIdParam) {
      const modalidadId = Number(modalidadIdParam);

      if (
        !Number.isInteger(modalidadId) ||
        modalidadId <= 0
      ) {
        return NextResponse.json(
          {
            error:
              "El identificador de modalidad no es válido",
          },
          { status: 400 }
        );
      }

      filtros.push(
        eq(cursos.idModalidad, modalidadId)
      );
    }

    if (dirigidoA) {
      filtros.push(eq(cursos.dirigidoA, dirigidoA));
    }

    const data = await db
      .select(cursoSelect)
      .from(cursos)
      .leftJoin(
        instructores,
        eq(
          cursos.idInstructor,
          instructores.idInstructor
        )
      )
      .leftJoin(
        categoriasCursos,
        eq(
          cursos.idCategoria,
          categoriasCursos.idCategoria
        )
      )
      .leftJoin(
        ubicacionesCursos,
        eq(
          cursos.idUbicacion,
          ubicacionesCursos.idUbicacion
        )
      )
      .leftJoin(
        modalidades,
        eq(
          cursos.idModalidad,
          modalidades.idModalidad
        )
      )
      .where(
        filtros.length > 0
          ? and(...filtros)
          : undefined
      )
      .orderBy(desc(cursos.idCurso));

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error(
      "Error en GET cursos:",
      error
    );

    return NextResponse.json(
      {
        error: "Error al obtener cursos",
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
      validarCrearCurso(body);

    if (!validation.success) {
      return validationErrorResponse(validation);
    }

    const input: CrearCursoInput =
      validation.data;

    const userEmail = session.user.correo;

    const nuevo = await withUserEmail(
      userEmail,
      async () =>
        db
          .insert(cursos)
          .values({
            tituloCurso: input.tituloCurso,
            descripcion: input.descripcion,

            idInstructor: input.idInstructor,
            idCategoria: input.idCategoria,
            idUbicacion: input.idUbicacion,
            idModalidad: input.idModalidad,

            fechaInicio: input.fechaInicio,
            fechaFin: input.fechaFin,
            horario: input.horario,
            dirigidoA: input.dirigidoA,

            cupoMaximo: input.cupoMaximo,
            cuposOcupados: 0,

            costo: input.costo,
            urlImagenPortada:
              input.urlImagenPortada,

            activo: true,
          })
          .returning({
            idCurso: cursos.idCurso,
            tituloCurso: cursos.tituloCurso,
            descripcion: cursos.descripcion,

            idInstructor: cursos.idInstructor,
            idCategoria: cursos.idCategoria,
            idUbicacion: cursos.idUbicacion,
            idModalidad: cursos.idModalidad,

            fechaInicio: cursos.fechaInicio,
            fechaFin: cursos.fechaFin,
            horario: cursos.horario,
            dirigidoA: cursos.dirigidoA,

            cupoMaximo: cursos.cupoMaximo,
            cuposOcupados:
              cursos.cuposOcupados,

            costo: cursos.costo,
            urlImagenPortada:
              cursos.urlImagenPortada,
            activo: cursos.activo,

            createdAt: cursos.createdAt,
            updatedAt: cursos.updatedAt,
          })
    );

    const cursoCreado = nuevo[0];

    if (!cursoCreado) {
      return NextResponse.json(
        {
          error: "No se pudo crear el curso",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      cursoCreado,
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error(
      "Error en POST cursos:",
      error
    );

    const databaseResponse =
      databaseErrorResponse(error);

    if (databaseResponse) {
      return databaseResponse;
    }

    return NextResponse.json(
      {
        error: "Error al crear curso",
      },
      { status: 500 }
    );
  }
}