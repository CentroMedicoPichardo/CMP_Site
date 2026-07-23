import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

import { requireApiRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { validarRequisitosAprobacion } from "@/lib/gestion-academica/validar-requisitos-aprobacion";
import {
  cursos,
  requisitosAprobacionCurso,
} from "@/lib/schema";
import type {
  RequisitosAprobacionCursoAdmin,
  RequisitosAprobacionResponse,
  TipoSeguimientoAcademico,
} from "@/types/requisitos-aprobacion";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

function parsePositiveId(value: string): number | null {
  const parsed = Number(value);

  if (!Number.isSafeInteger(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

function numberOrDefault(
  value: string | number | null | undefined,
  fallback: number
): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function defaultRequirements(cursoId: number): RequisitosAprobacionCursoAdmin {
  return {
    cursoId,
    configurado: false,
    tipoSeguimiento: "Solo asistencia",
    porcentajeAsistenciaMinima: 80,
    calificacionMinima: 70,
    porcentajeAvanceMinimo: 100,
    requiereEvaluacionesObligatorias: false,
    requiereEvaluacionFinal: false,
    permiteFaltasJustificadas: true,
    maximoFaltasInjustificadas: null,
    requierePagoValidado: true,
    emiteCertificado: true,
    vigente: true,
    observaciones: null,
  };
}

async function courseExists(cursoId: number): Promise<boolean> {
  const [curso] = await db
    .select({ idCurso: cursos.idCurso })
    .from(cursos)
    .where(eq(cursos.idCurso, cursoId))
    .limit(1);

  return Boolean(curso);
}

async function readRequirements(
  cursoId: number
): Promise<RequisitosAprobacionCursoAdmin> {
  const [fila] = await db
    .select({
      cursoId: requisitosAprobacionCurso.cursoId,
      tipoSeguimiento: sql<TipoSeguimientoAcademico>`"academia"."requisitos_aprobacion_curso"."tipo_seguimiento"`,
      porcentajeAsistenciaMinima:
        requisitosAprobacionCurso.porcentajeAsistenciaMinima,
      calificacionMinima: requisitosAprobacionCurso.calificacionMinima,
      porcentajeAvanceMinimo:
        requisitosAprobacionCurso.porcentajeAvanceMinimo,
      requiereEvaluacionesObligatorias:
        requisitosAprobacionCurso.requiereEvaluacionesObligatorias,
      requiereEvaluacionFinal:
        requisitosAprobacionCurso.requiereEvaluacionFinal,
      permiteFaltasJustificadas:
        requisitosAprobacionCurso.permiteFaltasJustificadas,
      maximoFaltasInjustificadas:
        requisitosAprobacionCurso.maximoFaltasInjustificadas,
      requierePagoValidado:
        requisitosAprobacionCurso.requierePagoValidado,
      emiteCertificado: requisitosAprobacionCurso.emiteCertificado,
      vigente: requisitosAprobacionCurso.vigente,
      observaciones: requisitosAprobacionCurso.observaciones,
    })
    .from(requisitosAprobacionCurso)
    .where(eq(requisitosAprobacionCurso.cursoId, cursoId))
    .limit(1);

  if (!fila) {
    return defaultRequirements(cursoId);
  }

  return {
    cursoId: fila.cursoId,
    configurado: true,
    tipoSeguimiento: fila.tipoSeguimiento,
    porcentajeAsistenciaMinima: numberOrDefault(
      fila.porcentajeAsistenciaMinima,
      80
    ),
    calificacionMinima: numberOrDefault(fila.calificacionMinima, 70),
    porcentajeAvanceMinimo: numberOrDefault(
      fila.porcentajeAvanceMinimo,
      100
    ),
    requiereEvaluacionesObligatorias:
      fila.requiereEvaluacionesObligatorias,
    requiereEvaluacionFinal: fila.requiereEvaluacionFinal,
    permiteFaltasJustificadas: fila.permiteFaltasJustificadas,
    maximoFaltasInjustificadas: fila.maximoFaltasInjustificadas,
    requierePagoValidado: fila.requierePagoValidado,
    emiteCertificado: fila.emiteCertificado,
    vigente: fila.vigente,
    observaciones: fila.observaciones,
  };
}

export async function GET(_request: Request, context: RouteContext) {
  const { error } = await requireApiRole("admin");

  if (error) {
    return error;
  }

  const { id } = await context.params;
  const cursoId = parsePositiveId(id);

  if (cursoId === null) {
    return NextResponse.json(
      {
        success: false,
        error: "El identificador del curso no es válido",
      },
      { status: 400 }
    );
  }

  try {
    if (!(await courseExists(cursoId))) {
      return NextResponse.json(
        {
          success: false,
          error: "No se encontró el curso solicitado",
        },
        { status: 404 }
      );
    }

    const requisitos = await readRequirements(cursoId);
    const response: RequisitosAprobacionResponse = {
      success: true,
      requisitos,
    };

    return NextResponse.json(response);
  } catch (queryError: unknown) {
    console.error("Error al consultar requisitos de aprobación:", queryError);

    return NextResponse.json(
      {
        success: false,
        error:
          "No fue posible cargar la configuración de aprobación. Verifica que la migración tipo_seguimiento esté aplicada.",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, context: RouteContext) {
  const { error } = await requireApiRole("admin");

  if (error) {
    return error;
  }

  const { id } = await context.params;
  const cursoId = parsePositiveId(id);

  if (cursoId === null) {
    return NextResponse.json(
      {
        success: false,
        error: "El identificador del curso no es válido",
      },
      { status: 400 }
    );
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "El cuerpo de la solicitud no contiene JSON válido",
      },
      { status: 400 }
    );
  }

  const validation = validarRequisitosAprobacion(payload);

  if (!validation.success) {
    return NextResponse.json(
      {
        success: false,
        error: validation.error,
      },
      { status: 400 }
    );
  }

  try {
    if (!(await courseExists(cursoId))) {
      return NextResponse.json(
        {
          success: false,
          error: "No se encontró el curso solicitado",
        },
        { status: 404 }
      );
    }

    const data = validation.data;
    const requiereEvaluacionesObligatorias =
      data.tipoSeguimiento === "Evaluaciones obligatorias";

    await db.execute(sql`
      INSERT INTO academia.requisitos_aprobacion_curso (
        curso_id,
        tipo_seguimiento,
        porcentaje_asistencia_minima,
        calificacion_minima,
        porcentaje_avance_minimo,
        requiere_evaluaciones_obligatorias,
        requiere_evaluacion_final,
        permite_faltas_justificadas,
        maximo_faltas_injustificadas,
        requiere_pago_validado,
        emite_certificado,
        vigente,
        observaciones,
        created_at,
        updated_at
      ) VALUES (
        ${cursoId},
        ${data.tipoSeguimiento},
        ${data.porcentajeAsistenciaMinima},
        ${data.calificacionMinima},
        ${data.porcentajeAvanceMinimo},
        ${requiereEvaluacionesObligatorias},
        ${data.requiereEvaluacionFinal},
        ${data.permiteFaltasJustificadas},
        ${data.maximoFaltasInjustificadas},
        ${data.requierePagoValidado},
        ${data.emiteCertificado},
        TRUE,
        ${data.observaciones},
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      )
      ON CONFLICT (curso_id)
      DO UPDATE SET
        tipo_seguimiento = EXCLUDED.tipo_seguimiento,
        porcentaje_asistencia_minima = EXCLUDED.porcentaje_asistencia_minima,
        calificacion_minima = EXCLUDED.calificacion_minima,
        porcentaje_avance_minimo = EXCLUDED.porcentaje_avance_minimo,
        requiere_evaluaciones_obligatorias =
          EXCLUDED.requiere_evaluaciones_obligatorias,
        requiere_evaluacion_final = EXCLUDED.requiere_evaluacion_final,
        permite_faltas_justificadas = EXCLUDED.permite_faltas_justificadas,
        maximo_faltas_injustificadas = EXCLUDED.maximo_faltas_injustificadas,
        requiere_pago_validado = EXCLUDED.requiere_pago_validado,
        emite_certificado = EXCLUDED.emite_certificado,
        vigente = TRUE,
        observaciones = EXCLUDED.observaciones,
        updated_at = CURRENT_TIMESTAMP
    `);

    const requisitos = await readRequirements(cursoId);
    const response: RequisitosAprobacionResponse = {
      success: true,
      requisitos,
    };

    return NextResponse.json(response);
  } catch (saveError: unknown) {
    console.error("Error al guardar requisitos de aprobación:", saveError);

    return NextResponse.json(
      {
        success: false,
        error:
          "No fue posible guardar la configuración. Verifica que la migración tipo_seguimiento esté aplicada.",
      },
      { status: 500 }
    );
  }
}
