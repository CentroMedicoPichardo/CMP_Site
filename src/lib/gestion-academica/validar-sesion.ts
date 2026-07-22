import type {
  SesionCursoInput,
} from "@/types/gestion-academica";

interface ValidationSuccess {
  success: true;
  data: SesionCursoInput;
}

interface ValidationError {
  success: false;
  error: string;
}

type ValidationResult =
  | ValidationSuccess
  | ValidationError;

function isRecord(
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null
  );
}

function requiredString(
  value: unknown
): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();

  return normalized.length > 0
    ? normalized
    : null;
}

function optionalString(
  value: unknown
): string | null {
  if (
    value === undefined ||
    value === null
  ) {
    return null;
  }

  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();

  return normalized.length > 0
    ? normalized
    : null;
}

function positiveInteger(
  value: unknown
): number | null {
  const parsed = Number(value);

  if (
    !Number.isSafeInteger(parsed) ||
    parsed <= 0
  ) {
    return null;
  }

  return parsed;
}

function optionalPositiveInteger(
  value: unknown
): number | null {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null;
  }

  return positiveInteger(value);
}

function isValidDate(
  value: string
): boolean {
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(value)
  ) {
    return false;
  }

  const date = new Date(
    `${value}T00:00:00Z`
  );

  return !Number.isNaN(
    date.getTime()
  );
}

function normalizeTime(
  value: string
): string | null {
  const match = value.match(
    /^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/
  );

  if (!match) {
    return null;
  }

  return `${match[1]}:${match[2]}:${match[3] ?? "00"}`;
}

function timeToSeconds(
  value: string
): number {
  const [
    hours,
    minutes,
    seconds,
  ] = value
    .split(":")
    .map(Number);

  return (
    hours * 3600 +
    minutes * 60 +
    seconds
  );
}

export function validarSesionCurso(
  payload: unknown
): ValidationResult {
  if (!isRecord(payload)) {
    return {
      success: false,
      error:
        "Los datos de la sesión no son válidos",
    };
  }

  const numeroSesion =
    positiveInteger(
      payload.numeroSesion
    );

  if (numeroSesion === null) {
    return {
      success: false,
      error:
        "El número de sesión debe ser mayor que cero",
    };
  }

  const titulo =
    requiredString(payload.titulo);

  if (!titulo) {
    return {
      success: false,
      error:
        "El título de la sesión es obligatorio",
    };
  }

  if (titulo.length > 150) {
    return {
      success: false,
      error:
        "El título no puede superar 150 caracteres",
    };
  }

  const fecha =
    requiredString(payload.fecha);

  if (
    !fecha ||
    !isValidDate(fecha)
  ) {
    return {
      success: false,
      error:
        "La fecha de la sesión no es válida",
    };
  }

  const horaInicioRaw =
    requiredString(
      payload.horaInicio
    );

  const horaFinRaw =
    requiredString(
      payload.horaFin
    );

  const horaInicio =
    horaInicioRaw
      ? normalizeTime(
          horaInicioRaw
        )
      : null;

  const horaFin =
    horaFinRaw
      ? normalizeTime(
          horaFinRaw
        )
      : null;

  if (
    !horaInicio ||
    !horaFin
  ) {
    return {
      success: false,
      error:
        "El horario de la sesión no es válido",
    };
  }

  if (
    timeToSeconds(horaFin) <=
    timeToSeconds(horaInicio)
  ) {
    return {
      success: false,
      error:
        "La hora de finalización debe ser posterior a la hora de inicio",
    };
  }

  const modalidadId =
    optionalPositiveInteger(
      payload.modalidadId
    );

  if (
    payload.modalidadId !== undefined &&
    payload.modalidadId !== null &&
    payload.modalidadId !== "" &&
    modalidadId === null
  ) {
    return {
      success: false,
      error:
        "La modalidad seleccionada no es válida",
    };
  }

  const ubicacionId =
    optionalPositiveInteger(
      payload.ubicacionId
    );

  if (
    payload.ubicacionId !== undefined &&
    payload.ubicacionId !== null &&
    payload.ubicacionId !== "" &&
    ubicacionId === null
  ) {
    return {
      success: false,
      error:
        "La ubicación seleccionada no es válida",
    };
  }

  const enlaceVirtual =
    optionalString(
      payload.enlaceVirtual
    );

  if (enlaceVirtual) {
    try {
      new URL(enlaceVirtual);
    } catch {
      return {
        success: false,
        error:
          "El enlace virtual no es una URL válida",
      };
    }
  }

  return {
    success: true,
    data: {
      numeroSesion,
      titulo,
      descripcion:
        optionalString(
          payload.descripcion
        ),
      fecha,
      horaInicio,
      horaFin,
      modalidadId,
      ubicacionId,
      enlaceVirtual,
      observaciones:
        optionalString(
          payload.observaciones
        ),
    },
  };
}