// src/app/api/cursos/[id]/route.ts

import { NextResponse } from "next/server";
import {
  and,
  eq,
  sql,
} from "drizzle-orm";

import {
  auth,
  requireApiRole,
} from "@/lib/auth";
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
import {
  validarActualizarCurso,
  validarCambiarEstadoCurso,
} from "@/lib/validators/cursos";
import type {
  ActualizarCursoInput,
  CambiarEstadoCursoInput,
} from "@/types/cursos";

interface CursoRouteContext {
  params: Promise<{
    id: string;
  }>;
}

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
  instructorEspecialidad:
    instructores.especialidad,

  idCategoria: cursos.idCategoria,
  categoriaNombre:
    categoriasCursos.nombreCategoria,

  idUbicacion: cursos.idUbicacion,
  ubicacionNombre:
    ubicacionesCursos.nombreUbicacion,
  ubicacionDireccion:
    ubicacionesCursos.direccionCompleta,

  idModalidad: cursos.idModalidad,
  modalidadNombre:
    modalidades.nombreModalidad,

  fechaInicio: cursos.fechaInicio,
  fechaFin: cursos.fechaFin,
  horario: cursos.horario,
  dirigidoA: cursos.dirigidoA,

  cupoMaximo: cursos.cupoMaximo,
  cuposOcupados: cursos.cuposOcupados,

  costo: cursos.costo,
  urlImagenPortada:
    cursos.urlImagenPortada,
  activo: cursos.activo,

  createdAt: cursos.createdAt,
  updatedAt: cursos.updatedAt,
};

function parseCursoId(id: string): number | null {
  const parsed = Number(id);

  if (
    !Number.isInteger(parsed) ||
    parsed <= 0
  ) {
    return null;
  }

  return parsed;
}

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
        error:
          "La actualización genera un registro duplicado",
      },
      { status: 409 }
    );
  }

  return null;
}

export async function GET(
  _request: Request,
  { params }: CursoRouteContext
) {
  try {
    const { id } = await params;
    const cursoId = parseCursoId(id);

    if (!cursoId) {
      return NextResponse.json(
        {
          error: "ID de curso inválido",
        },
        { status: 400 }
      );
    }

    const session = await auth();

    const isAdmin =
      session?.user.rol === "admin";

    const condicion = isAdmin
      ? eq(cursos.idCurso, cursoId)
      : and(
          eq(cursos.idCurso, cursoId),
          eq(cursos.activo, true)
        );

    const resultado = await db
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
      .where(condicion)
      .limit(1);

    const curso = resultado[0];

    if (!curso) {
      return NextResponse.json(
        {
          error: "Curso no encontrado",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(curso);
  } catch (error: unknown) {
    console.error(
      "Error en GET curso:",
      error
    );

    return NextResponse.json(
      {
        error: "Error al obtener curso",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: CursoRouteContext
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
    const cursoId = parseCursoId(id);

    if (!cursoId) {
      return NextResponse.json(
        {
          error: "ID de curso inválido",
        },
        { status: 400 }
      );
    }

    const body: unknown = await request.json();

    const validation =
      validarActualizarCurso(body);

    if (!validation.success) {
      return validationErrorResponse(validation);
    }

    const input: ActualizarCursoInput =
      validation.data;

    const userEmail = session.user.correo;

    const actualizado = await withUserEmail(
      userEmail,
      async () =>
        db
          .update(cursos)
          .set({
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
            costo: input.costo,
            urlImagenPortada:
              input.urlImagenPortada,

            activo: input.activo,
            updatedAt: sql`CURRENT_TIMESTAMP`,
          })
          .where(
            eq(cursos.idCurso, cursoId)
          )
          .returning({
            idCurso: cursos.idCurso,
            tituloCurso:
              cursos.tituloCurso,
            descripcion: cursos.descripcion,

            idInstructor:
              cursos.idInstructor,
            idCategoria:
              cursos.idCategoria,
            idUbicacion:
              cursos.idUbicacion,
            idModalidad:
              cursos.idModalidad,

            fechaInicio:
              cursos.fechaInicio,
            fechaFin: cursos.fechaFin,
            horario: cursos.horario,
            dirigidoA: cursos.dirigidoA,

            cupoMaximo:
              cursos.cupoMaximo,
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

    const cursoActualizado =
      actualizado[0];

    if (!cursoActualizado) {
      return NextResponse.json(
        {
          error: "Curso no encontrado",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      cursoActualizado
    );
  } catch (error: unknown) {
    console.error(
      "Error en PUT curso:",
      error
    );

    const databaseResponse =
      databaseErrorResponse(error);

    if (databaseResponse) {
      return databaseResponse;
    }

    return NextResponse.json(
      {
        error: "Error al actualizar curso",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: CursoRouteContext
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
    const cursoId = parseCursoId(id);

    if (!cursoId) {
      return NextResponse.json(
        {
          error: "ID de curso inválido",
        },
        { status: 400 }
      );
    }

    const body: unknown = await request.json();

    const validation =
      validarCambiarEstadoCurso(body);

    if (!validation.success) {
      return validationErrorResponse(validation);
    }

    const input: CambiarEstadoCursoInput =
      validation.data;

    const userEmail = session.user.correo;

    const actualizado = await withUserEmail(
      userEmail,
      async () =>
        db
          .update(cursos)
          .set({
            activo: input.activo,
            updatedAt: sql`CURRENT_TIMESTAMP`,
          })
          .where(
            eq(cursos.idCurso, cursoId)
          )
          .returning({
            idCurso: cursos.idCurso,
            tituloCurso:
              cursos.tituloCurso,
            activo: cursos.activo,
            updatedAt: cursos.updatedAt,
          })
    );

    const cursoActualizado =
      actualizado[0];

    if (!cursoActualizado) {
      return NextResponse.json(
        {
          error: "Curso no encontrado",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: input.activo
        ? "Curso activado correctamente"
        : "Curso ocultado correctamente",
      curso: cursoActualizado,
    });
  } catch (error: unknown) {
    console.error(
      "Error en PATCH curso:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Error al cambiar el estado del curso",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: CursoRouteContext
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
    const cursoId = parseCursoId(id);

    if (!cursoId) {
      return NextResponse.json(
        {
          error: "ID de curso inválido",
        },
        { status: 400 }
      );
    }

    const userEmail = session.user.correo;

    const ocultado = await withUserEmail(
      userEmail,
      async () =>
        db
          .update(cursos)
          .set({
            activo: false,
            updatedAt: sql`CURRENT_TIMESTAMP`,
          })
          .where(
            eq(cursos.idCurso, cursoId)
          )
          .returning({
            idCurso: cursos.idCurso,
            tituloCurso:
              cursos.tituloCurso,
            activo: cursos.activo,
            updatedAt: cursos.updatedAt,
          })
    );

    const cursoOcultado = ocultado[0];

    if (!cursoOcultado) {
      return NextResponse.json(
        {
          error: "Curso no encontrado",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Curso ocultado correctamente",
      curso: cursoOcultado,
    });
  } catch (error: unknown) {
    console.error(
      "Error en DELETE curso:",
      error
    );

    return NextResponse.json(
      {
        error: "Error al ocultar curso",
      },
      { status: 500 }
    );
  }
}