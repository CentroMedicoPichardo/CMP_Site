import type {
  GuardarRequisitosAprobacionInput,
  TipoSeguimientoAcademico,
} from "@/types/requisitos-aprobacion";

interface ValidationSuccess {
  success: true;
  data: GuardarRequisitosAprobacionInput;
}

interface ValidationError {
  success: false;
  error: string;
}

export type ValidarRequisitosAprobacionResult =
  | ValidationSuccess
  | ValidationError;

const TIPOS_SEGUIMIENTO: TipoSeguimientoAcademico[] = [
  "Solo asistencia",
  "Evaluaciones opcionales",
  "Evaluaciones obligatorias",
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isTipoSeguimiento(
  value: unknown
): value is TipoSeguimientoAcademico {
  return (
    typeof value === "string" &&
    TIPOS_SEGUIMIENTO.includes(value as TipoSeguimientoAcademico)
  );
}

function percentage(value: unknown): number | null {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 100) {
    return null;
  }

  return Math.round(parsed * 100) / 100;
}

function booleanValue(value: unknown): boolean | null {
  return typeof value === "boolean" ? value : null;
}

function nullableNonNegativeInteger(value: unknown): number | null | undefined {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = Number(value);

  if (!Number.isSafeInteger(parsed) || parsed < 0) {
    return undefined;
  }

  return parsed;
}

function nullableText(value: unknown): string | null | undefined {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value !== "string") {
    return undefined;
  }

  const normalized = value.trim();

  if (normalized.length > 2000) {
    return undefined;
  }

  return normalized.length > 0 ? normalized : null;
}

export function validarRequisitosAprobacion(
  payload: unknown
): ValidarRequisitosAprobacionResult {
  if (!isRecord(payload)) {
    return {
      success: false,
      error: "La configuración enviada no es válida",
    };
  }

  if (!isTipoSeguimiento(payload.tipoSeguimiento)) {
    return {
      success: false,
      error: "El tipo de seguimiento académico no es válido",
    };
  }

  const porcentajeAsistenciaMinima = percentage(
    payload.porcentajeAsistenciaMinima
  );
  const porcentajeAvanceMinimo = percentage(
    payload.porcentajeAvanceMinimo
  );
  const calificacionMinima = percentage(payload.calificacionMinima);

  if (porcentajeAsistenciaMinima === null) {
    return {
      success: false,
      error: "La asistencia mínima debe estar entre 0 y 100",
    };
  }

  if (porcentajeAvanceMinimo === null) {
    return {
      success: false,
      error: "El avance mínimo debe estar entre 0 y 100",
    };
  }

  if (calificacionMinima === null) {
    return {
      success: false,
      error: "La calificación mínima debe estar entre 0 y 100",
    };
  }

  const requiereEvaluacionFinal = booleanValue(
    payload.requiereEvaluacionFinal
  );
  const permiteFaltasJustificadas = booleanValue(
    payload.permiteFaltasJustificadas
  );
  const requierePagoValidado = booleanValue(payload.requierePagoValidado);
  const emiteCertificado = booleanValue(payload.emiteCertificado);

  if (
    requiereEvaluacionFinal === null ||
    permiteFaltasJustificadas === null ||
    requierePagoValidado === null ||
    emiteCertificado === null
  ) {
    return {
      success: false,
      error: "La configuración contiene valores booleanos no válidos",
    };
  }

  const maximoFaltasInjustificadas = nullableNonNegativeInteger(
    payload.maximoFaltasInjustificadas
  );

  if (maximoFaltasInjustificadas === undefined) {
    return {
      success: false,
      error: "El máximo de faltas debe ser un entero mayor o igual que cero",
    };
  }

  const observaciones = nullableText(payload.observaciones);

  if (observaciones === undefined) {
    return {
      success: false,
      error: "Las observaciones no son válidas o superan 2000 caracteres",
    };
  }

  const evaluacionesObligatorias =
    payload.tipoSeguimiento === "Evaluaciones obligatorias";

  return {
    success: true,
    data: {
      tipoSeguimiento: payload.tipoSeguimiento,
      porcentajeAsistenciaMinima,
      calificacionMinima,
      porcentajeAvanceMinimo,
      requiereEvaluacionFinal:
        evaluacionesObligatorias && requiereEvaluacionFinal,
      permiteFaltasJustificadas,
      maximoFaltasInjustificadas,
      requierePagoValidado,
      emiteCertificado,
      observaciones,
    },
  };
}
