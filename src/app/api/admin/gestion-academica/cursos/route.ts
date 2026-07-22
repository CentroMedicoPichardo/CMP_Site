import {
  desc,
  eq,
  sql,
} from "drizzle-orm";
import { NextResponse } from "next/server";

import { requireApiRole } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  cursos,
  instructores,
  vwSeguimientoAcademicoCursos,
} from "@/lib/schema";
import type {
  CursoGestionAcademicaResumen,
  GestionAcademicaCursosResponse,
} from "@/types/gestion-academica";

export const dynamic = "force-dynamic";

function numberOrZero(
  value:
    | string
    | number
    | bigint
    | null
    | undefined
): number {
  const parsed = Number(value ?? 0);

  return Number.isFinite(parsed)
    ? parsed
    : 0;
}

function textOrDefault(
  value: string | null | undefined,
  fallback: string
): string {
  const normalized = value?.trim();

  return normalized
    ? normalized
    : fallback;
}

export async function GET() {
  const { error } =
    await requireApiRole("admin");

  if (error) {
    return error;
  }

  try {
    const filas = await db
      .select({
        idCurso:
          cursos.idCurso,
        tituloCurso:
          cursos.tituloCurso,
        descripcion:
          cursos.descripcion,

        instructorNombre:
          sql<string>`
            TRIM(
              CONCAT_WS(
                ' ',
                ${instructores.nombre},
                ${instructores.apellidoPaterno},
                ${instructores.apellidoMaterno}
              )
            )
          `,

        fechaInicio:
          cursos.fechaInicio,
        fechaFin:
          cursos.fechaFin,
        activo:
          cursos.activo,
        cupoMaximo:
          cursos.cupoMaximo,
        cuposOcupados:
          cursos.cuposOcupados,

        totalInscripciones:
          vwSeguimientoAcademicoCursos
            .totalInscripciones,

        totalSesiones:
          vwSeguimientoAcademicoCursos
            .totalSesiones,

        sesionesProgramadas:
          vwSeguimientoAcademicoCursos
            .sesionesProgramadas,

        sesionesEnCurso:
          vwSeguimientoAcademicoCursos
            .sesionesEnCurso,

        sesionesFinalizadas:
          vwSeguimientoAcademicoCursos
            .sesionesFinalizadas,

        sesionesCanceladas:
          vwSeguimientoAcademicoCursos
            .sesionesCanceladas,

        promedioAvance:
          vwSeguimientoAcademicoCursos
            .promedioAvance,

        promedioAsistencia:
          vwSeguimientoAcademicoCursos
            .promedioAsistencia,

        situacionAcademica:
          vwSeguimientoAcademicoCursos
            .situacionAcademica,
      })
      .from(
        vwSeguimientoAcademicoCursos
      )
      .innerJoin(
        cursos,
        eq(
          vwSeguimientoAcademicoCursos
            .cursoId,
          cursos.idCurso
        )
      )
      .leftJoin(
        instructores,
        eq(
          cursos.idInstructor,
          instructores.idInstructor
        )
      )
      .where(
        sql`
          ${vwSeguimientoAcademicoCursos
            .totalInscripciones} > 0
        `
      )
      .orderBy(
        desc(cursos.fechaInicio),
        desc(cursos.idCurso)
      );

    const cursosAcademicos:
      CursoGestionAcademicaResumen[] =
      filas.map((fila) => ({
        idCurso:
          fila.idCurso,

        tituloCurso:
          fila.tituloCurso,

        descripcion:
          fila.descripcion,

        instructorNombre:
          textOrDefault(
            fila.instructorNombre,
            "Instructor no asignado"
          ),

        fechaInicio:
          fila.fechaInicio,

        fechaFin:
          fila.fechaFin,

        activo:
          fila.activo ?? false,

        cupoMaximo:
          numberOrZero(
            fila.cupoMaximo
          ),

        cuposOcupados:
          numberOrZero(
            fila.cuposOcupados
          ),

        totalInscripciones:
          numberOrZero(
            fila.totalInscripciones
          ),

        totalSesiones:
          numberOrZero(
            fila.totalSesiones
          ),

        sesionesProgramadas:
          numberOrZero(
            fila.sesionesProgramadas
          ),

        sesionesEnCurso:
          numberOrZero(
            fila.sesionesEnCurso
          ),

        sesionesFinalizadas:
          numberOrZero(
            fila.sesionesFinalizadas
          ),

        sesionesCanceladas:
          numberOrZero(
            fila.sesionesCanceladas
          ),

        promedioAvance:
          numberOrZero(
            fila.promedioAvance
          ),

        promedioAsistencia:
          numberOrZero(
            fila.promedioAsistencia
          ),

        situacionAcademica:
          textOrDefault(
            fila.situacionAcademica,
            "Sin seguimiento"
          ),
      }));

    const resumen =
      cursosAcademicos.reduce(
        (acumulado, curso) => ({
          totalCursos:
            acumulado.totalCursos + 1,

          totalInscripciones:
            acumulado.totalInscripciones +
            curso.totalInscripciones,

          totalSesiones:
            acumulado.totalSesiones +
            curso.totalSesiones,

          sesionesProgramadas:
            acumulado.sesionesProgramadas +
            curso.sesionesProgramadas,

          sesionesEnCurso:
            acumulado.sesionesEnCurso +
            curso.sesionesEnCurso,

          sesionesFinalizadas:
            acumulado.sesionesFinalizadas +
            curso.sesionesFinalizadas,
        }),
        {
          totalCursos: 0,
          totalInscripciones: 0,
          totalSesiones: 0,
          sesionesProgramadas: 0,
          sesionesEnCurso: 0,
          sesionesFinalizadas: 0,
        }
      );

    const response:
      GestionAcademicaCursosResponse = {
      success: true,
      resumen,
      cursos: cursosAcademicos,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error(
      "Error al cargar gestión académica:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "No fue posible cargar la gestión académica",
      },
      { status: 500 }
    );
  }
}