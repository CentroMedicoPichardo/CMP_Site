// src/lib/validators/compras-cursos.ts

import {
  isRecord,
  isValidEmail,
  parseNullableString,
  parsePositiveInteger,
  parseString,
  type ValidationResult,
} from "@/lib/validators/common";

import {
  SEXOS_PARTICIPANTE,
  type CrearCompraCursoInput,
  type CrearParticipanteCursoInput,
  type ParticipanteCompraInput,
  type SexoParticipante,
} from "@/types/compras-cursos";

const MAX_PARTICIPANTES_POR_COMPRA = 20;

function isSexoParticipante(
  value: unknown
): value is SexoParticipante {
  return (
    typeof value === "string" &&
    SEXOS_PARTICIPANTE.some(
      (sexo) => sexo === value
    )
  );
}

function parseNullableDate(
  value: unknown
): string | null {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null;
  }

  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();

  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(normalized)
  ) {
    return null;
  }

  const [yearText, monthText, dayText] =
    normalized.split("-");

  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);

  const date = new Date(
    Date.UTC(year, month - 1, day)
  );

  const valid =
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day;

  if (!valid) {
    return null;
  }

  const today = new Date();

  const todayUtc = Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate()
  );

  if (date.getTime() > todayUtc) {
    return null;
  }

  return normalized;
}

function validarParticipanteNuevo(
  value: unknown,
  index: number
): ValidationResult<CrearParticipanteCursoInput> {
  if (!isRecord(value)) {
    return {
      success: false,
      error: `El participante ${index + 1} no es válido`,
    };
  }

  const fieldErrors: Record<string, string> = {};
  const prefix = `participantes.${index}.participante`;

  const nombre = parseString(value.nombre, {
    required: true,
    maxLength: 100,
  });

  if (!nombre) {
    fieldErrors[`${prefix}.nombre`] =
      "El nombre es requerido y debe tener máximo 100 caracteres";
  }

  const apellidoPaterno = parseString(
    value.apellidoPaterno,
    {
      required: true,
      maxLength: 100,
    }
  );

  if (!apellidoPaterno) {
    fieldErrors[
      `${prefix}.apellidoPaterno`
    ] =
      "El apellido paterno es requerido y debe tener máximo 100 caracteres";
  }

  const apellidoMaterno =
    parseNullableString(
      value.apellidoMaterno,
      100
    );

  if (
    value.apellidoMaterno !== undefined &&
    value.apellidoMaterno !== null &&
    value.apellidoMaterno !== "" &&
    apellidoMaterno === null
  ) {
    fieldErrors[
      `${prefix}.apellidoMaterno`
    ] =
      "El apellido materno debe tener máximo 100 caracteres";
  }

  const fechaNacimiento =
    parseNullableDate(
      value.fechaNacimiento
    );

  if (
    value.fechaNacimiento !== undefined &&
    value.fechaNacimiento !== null &&
    value.fechaNacimiento !== "" &&
    fechaNacimiento === null
  ) {
    fieldErrors[
      `${prefix}.fechaNacimiento`
    ] =
      "La fecha de nacimiento debe ser válida, usar el formato AAAA-MM-DD y no estar en el futuro";
  }

  let sexo: SexoParticipante | null = null;

  if (
    value.sexo !== undefined &&
    value.sexo !== null &&
    value.sexo !== ""
  ) {
    if (!isSexoParticipante(value.sexo)) {
      fieldErrors[`${prefix}.sexo`] =
        "El sexo seleccionado no es válido";
    } else {
      sexo = value.sexo;
    }
  }

  const telefono = parseNullableString(
    value.telefono,
    20
  );

  if (
    value.telefono !== undefined &&
    value.telefono !== null &&
    value.telefono !== "" &&
    telefono === null
  ) {
    fieldErrors[`${prefix}.telefono`] =
      "El teléfono debe tener máximo 20 caracteres";
  }

  let correo: string | null = null;

  if (
    value.correo !== undefined &&
    value.correo !== null &&
    value.correo !== ""
  ) {
    if (typeof value.correo !== "string") {
      fieldErrors[`${prefix}.correo`] =
        "El correo debe ser texto";
    } else {
      const correoNormalizado =
        value.correo
          .trim()
          .toLowerCase();

      if (
        correoNormalizado.length > 150 ||
        !isValidEmail(correoNormalizado)
      ) {
        fieldErrors[`${prefix}.correo`] =
          "El correo debe ser válido y tener máximo 150 caracteres";
      } else {
        correo = correoNormalizado;
      }
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      error: `Hay campos inválidos en el participante ${index + 1}`,
      fieldErrors,
    };
  }

  return {
    success: true,
    data: {
      nombre: nombre as string,
      apellidoPaterno:
        apellidoPaterno as string,
      apellidoMaterno,
      fechaNacimiento,
      sexo,
      telefono,
      correo,
    },
  };
}

function validarParticipanteCompra(
  value: unknown,
  index: number
): ValidationResult<ParticipanteCompraInput> {
  if (!isRecord(value)) {
    return {
      success: false,
      error: `El participante ${index + 1} no es válido`,
    };
  }

  const tieneParticipanteId =
    value.participanteId !== undefined;

  const tieneParticipanteNuevo =
    value.participante !== undefined;

  if (
    tieneParticipanteId ===
    tieneParticipanteNuevo
  ) {
    return {
      success: false,
      error:
        `El participante ${index + 1} debe incluir ` +
        "un participanteId o los datos de un participante nuevo, pero no ambos",
      fieldErrors: {
        [`participantes.${index}`]:
          "Selecciona un participante existente o captura uno nuevo",
      },
    };
  }

  if (tieneParticipanteId) {
    const participanteId =
      parsePositiveInteger(
        value.participanteId
      );

    if (!participanteId) {
      return {
        success: false,
        error: `El ID del participante ${index + 1} no es válido`,
        fieldErrors: {
          [`participantes.${index}.participanteId`]:
            "El participante debe ser un entero positivo",
        },
      };
    }

    return {
      success: true,
      data: {
        participanteId,
      },
    };
  }

  const resultadoParticipante =
    validarParticipanteNuevo(
      value.participante,
      index
    );

  if (!resultadoParticipante.success) {
    return resultadoParticipante;
  }

  return {
    success: true,
    data: {
      participante:
        resultadoParticipante.data,
    },
  };
}

export function validarCrearCompraCurso(
  value: unknown
): ValidationResult<CrearCompraCursoInput> {
  if (!isRecord(value)) {
    return {
      success: false,
      error:
        "El cuerpo de la solicitud no es válido",
    };
  }

  const fieldErrors: Record<string, string> = {};

  const cursoId = parsePositiveInteger(
    value.cursoId
  );

  if (!cursoId) {
    fieldErrors.cursoId =
      "El curso es requerido y debe ser un entero positivo";
  }

  const cantidadCupos =
    parsePositiveInteger(
      value.cantidadCupos
    );

  if (!cantidadCupos) {
    fieldErrors.cantidadCupos =
      "La cantidad de cupos debe ser un entero positivo";
  } else if (
    cantidadCupos >
    MAX_PARTICIPANTES_POR_COMPRA
  ) {
    fieldErrors.cantidadCupos =
      `No se pueden adquirir más de ${MAX_PARTICIPANTES_POR_COMPRA} cupos en una sola compra`;
  }

  const observacionesUsuario =
    parseNullableString(
      value.observacionesUsuario,
      1000
    );

  if (
    value.observacionesUsuario !== undefined &&
    value.observacionesUsuario !== null &&
    value.observacionesUsuario !== "" &&
    observacionesUsuario === null
  ) {
    fieldErrors.observacionesUsuario =
      "Las observaciones deben tener máximo 1000 caracteres";
  }

  if (!Array.isArray(value.participantes)) {
    fieldErrors.participantes =
      "La lista de participantes es requerida";
  }

  const participantes: ParticipanteCompraInput[] =
    [];

  if (Array.isArray(value.participantes)) {
    if (value.participantes.length === 0) {
      fieldErrors.participantes =
        "Debes agregar al menos un participante";
    }

    if (
      value.participantes.length >
      MAX_PARTICIPANTES_POR_COMPRA
    ) {
      fieldErrors.participantes =
        `No puedes agregar más de ${MAX_PARTICIPANTES_POR_COMPRA} participantes`;
    }

    value.participantes.forEach(
      (participante, index) => {
        const validation =
          validarParticipanteCompra(
            participante,
            index
          );

        if (!validation.success) {
          if (validation.fieldErrors) {
            Object.assign(
              fieldErrors,
              validation.fieldErrors
            );
          } else {
            fieldErrors[
              `participantes.${index}`
            ] = validation.error;
          }

          return;
        }

        participantes.push(
          validation.data
        );
      }
    );
  }

  if (
    cantidadCupos &&
    Array.isArray(value.participantes) &&
    cantidadCupos !==
      value.participantes.length
  ) {
    fieldErrors.participantes =
      "La cantidad de participantes debe coincidir exactamente con la cantidad de cupos";
  }

  const idsExistentes =
    participantes
      .filter(
        (
          participante
        ): participante is {
          participanteId: number;
        } =>
          "participanteId" in participante
      )
      .map(
        (participante) =>
          participante.participanteId
      );

  if (
    new Set(idsExistentes).size !==
    idsExistentes.length
  ) {
    fieldErrors.participantes =
      "No puedes seleccionar dos veces al mismo participante";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      error:
        "Hay campos inválidos en la compra",
      fieldErrors,
    };
  }

  return {
    success: true,
    data: {
      cursoId: cursoId as number,
      cantidadCupos:
        cantidadCupos as number,
      participantes,
      observacionesUsuario,
    },
  };
}