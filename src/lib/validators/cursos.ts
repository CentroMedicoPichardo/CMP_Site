// src/lib/validators/cursos.ts

import type {
  ActualizarCursoInput,
  CambiarEstadoCursoInput,
  CrearCursoInput,
} from "@/types/cursos";

import {
  isIsoDateString,
  isRecord,
  parseBoolean,
  parseDecimalString,
  parseNullablePositiveInteger,
  parseNullableString,
  parsePositiveInteger,
  parseString,
  type ValidationResult,
} from "@/lib/validators/common";

const DIRIGIDO_A_VALIDOS = [
  "Padres",
  "Niños",
  "Familia",
  "Adolescentes",
] as const;

function validarCamposComunesCurso(
  value: unknown
): ValidationResult<CrearCursoInput> {
  if (!isRecord(value)) {
    return {
      success: false,
      error: "El cuerpo de la solicitud no es válido",
    };
  }

  const fieldErrors: Record<string, string> = {};

  const tituloCurso = parseString(
    value.tituloCurso,
    {
      required: true,
      maxLength: 200,
    }
  );

  if (!tituloCurso) {
    fieldErrors.tituloCurso =
      "El título del curso es requerido y debe tener máximo 200 caracteres";
  }

  const descripcion = parseNullableString(
    value.descripcion,
    5000
  );

  if (
    value.descripcion !== undefined &&
    value.descripcion !== null &&
    value.descripcion !== "" &&
    descripcion === null
  ) {
    fieldErrors.descripcion =
      "La descripción no es válida";
  }

  const idInstructor = parsePositiveInteger(
    value.idInstructor
  );

  if (!idInstructor) {
    fieldErrors.idInstructor =
      "Selecciona un instructor válido";
  }

  const idCategoria = parsePositiveInteger(
    value.idCategoria
  );

  if (!idCategoria) {
    fieldErrors.idCategoria =
      "Selecciona una categoría válida";
  }

  const idModalidad = parsePositiveInteger(
    value.idModalidad
  );

  if (!idModalidad) {
    fieldErrors.idModalidad =
      "Selecciona una modalidad válida";
  }

  const idUbicacion = parseNullablePositiveInteger(
    value.idUbicacion
  );

  if (
    value.idUbicacion !== undefined &&
    value.idUbicacion !== null &&
    value.idUbicacion !== "" &&
    idUbicacion === null
  ) {
    fieldErrors.idUbicacion =
      "La ubicación seleccionada no es válida";
  }

  const fechaInicio =
    typeof value.fechaInicio === "string"
      ? value.fechaInicio.trim()
      : "";

  if (!isIsoDateString(fechaInicio)) {
    fieldErrors.fechaInicio =
      "La fecha de inicio debe tener el formato YYYY-MM-DD";
  }

  const fechaFin =
    typeof value.fechaFin === "string"
      ? value.fechaFin.trim()
      : "";

  if (!isIsoDateString(fechaFin)) {
    fieldErrors.fechaFin =
      "La fecha de fin debe tener el formato YYYY-MM-DD";
  }

  if (
    isIsoDateString(fechaInicio) &&
    isIsoDateString(fechaFin) &&
    fechaFin < fechaInicio
  ) {
    fieldErrors.fechaFin =
      "La fecha de fin no puede ser anterior a la fecha de inicio";
  }

  const horario = parseNullableString(
    value.horario,
    50
  );

  if (
    value.horario !== undefined &&
    value.horario !== null &&
    value.horario !== "" &&
    horario === null
  ) {
    fieldErrors.horario =
      "El horario debe tener máximo 50 caracteres";
  }

  const dirigidoA = parseString(
    value.dirigidoA,
    {
      required: true,
      maxLength: 50,
    }
  );

  if (!dirigidoA) {
    fieldErrors.dirigidoA =
      "El público objetivo es requerido";
  } else if (
    !DIRIGIDO_A_VALIDOS.includes(
      dirigidoA as (typeof DIRIGIDO_A_VALIDOS)[number]
    )
  ) {
    fieldErrors.dirigidoA =
      "El público objetivo seleccionado no es válido";
  }

  const cupoMaximo = parsePositiveInteger(
    value.cupoMaximo
  );

  if (!cupoMaximo) {
    fieldErrors.cupoMaximo =
      "El cupo máximo debe ser un entero mayor que cero";
  }

  const costo = parseDecimalString(
    value.costo ?? "0",
    {
      min: 0,
      decimals: 2,
    }
  );

  if (costo === null) {
    fieldErrors.costo =
      "El costo debe ser un número mayor o igual que cero";
  }

  const urlImagenPortada = parseNullableString(
    value.urlImagenPortada,
    2000
  );

  if (
    value.urlImagenPortada !== undefined &&
    value.urlImagenPortada !== null &&
    value.urlImagenPortada !== "" &&
    urlImagenPortada === null
  ) {
    fieldErrors.urlImagenPortada =
      "La URL de la imagen no es válida";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      error: "Hay campos inválidos",
      fieldErrors,
    };
  }

  return {
    success: true,
    data: {
      tituloCurso: tituloCurso as string,
      descripcion,
      idInstructor: idInstructor as number,
      idCategoria: idCategoria as number,
      idUbicacion,
      idModalidad: idModalidad as number,
      fechaInicio,
      fechaFin,
      horario,
      dirigidoA: dirigidoA as string,
      cupoMaximo: cupoMaximo as number,
      costo: costo as string,
      urlImagenPortada,
    },
  };
}

export function validarCrearCurso(
  value: unknown
): ValidationResult<CrearCursoInput> {
  return validarCamposComunesCurso(value);
}

export function validarActualizarCurso(
  value: unknown
): ValidationResult<ActualizarCursoInput> {
  const baseResult =
    validarCamposComunesCurso(value);

  if (!baseResult.success) {
    return baseResult;
  }

  if (!isRecord(value)) {
    return {
      success: false,
      error: "El cuerpo de la solicitud no es válido",
    };
  }

  const activo = parseBoolean(value.activo);

  if (activo === null) {
    return {
      success: false,
      error: "Hay campos inválidos",
      fieldErrors: {
        activo: "El estado activo debe ser verdadero o falso",
      },
    };
  }

  return {
    success: true,
    data: {
      ...baseResult.data,
      activo,
    },
  };
}

export function validarCambiarEstadoCurso(
  value: unknown
): ValidationResult<CambiarEstadoCursoInput> {
  if (!isRecord(value)) {
    return {
      success: false,
      error: "El cuerpo de la solicitud no es válido",
    };
  }

  const activo = parseBoolean(value.activo);

  if (activo === null) {
    return {
      success: false,
      error: "El estado activo debe ser verdadero o falso",
      fieldErrors: {
        activo: "Envía un valor booleano válido",
      },
    };
  }

  return {
    success: true,
    data: {
      activo,
    },
  };
}