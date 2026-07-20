// src/lib/validators/catalogos-cursos.ts

import {
  isRecord,
  isValidEmail,
  parseBoolean,
  parseNullablePositiveInteger,
  parseNullableString,
  parsePositiveInteger,
  parseString,
  type ValidationResult,
} from "@/lib/validators/common";

export interface InstructorInput {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string | null;
  especialidad: string;
  edad: number;
  telefono: string | null;
  correo: string;
  direccion: string | null;
  activo?: boolean;
}

export interface CategoriaCursoInput {
  nombreCategoria: string;
  descripcion: string | null;
  activo?: boolean;
}

export interface UbicacionCursoInput {
  nombreUbicacion: string;
  direccionCompleta: string | null;
  capacidadMaxima: number | null;
  activo?: boolean;
}

export interface ModalidadCursoInput {
  nombreModalidad: string;
  descripcion: string | null;
}

interface ValidationOptions {
  requireActivo?: boolean;
}

function validarActivo(
  value: Record<string, unknown>,
  fieldErrors: Record<string, string>,
  required: boolean
): boolean | undefined {
  if (!required && value.activo === undefined) {
    return undefined;
  }

  const activo = parseBoolean(value.activo);

  if (activo === null) {
    fieldErrors.activo =
      "El estado activo debe ser verdadero o falso";

    return undefined;
  }

  return activo;
}

export function validarInstructor(
  value: unknown,
  options: ValidationOptions = {}
): ValidationResult<InstructorInput> {
  if (!isRecord(value)) {
    return {
      success: false,
      error: "El cuerpo de la solicitud no es válido",
    };
  }

  const fieldErrors: Record<string, string> = {};

  const nombre = parseString(value.nombre, {
    required: true,
    maxLength: 100,
  });

  if (!nombre) {
    fieldErrors.nombre =
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
    fieldErrors.apellidoPaterno =
      "El apellido paterno es requerido y debe tener máximo 100 caracteres";
  }

  const apellidoMaterno = parseNullableString(
    value.apellidoMaterno,
    100
  );

  if (
    value.apellidoMaterno !== undefined &&
    value.apellidoMaterno !== null &&
    value.apellidoMaterno !== "" &&
    apellidoMaterno === null
  ) {
    fieldErrors.apellidoMaterno =
      "El apellido materno debe tener máximo 100 caracteres";
  }

  const especialidad = parseString(
    value.especialidad,
    {
      required: true,
      maxLength: 100,
    }
  );

  if (!especialidad) {
    fieldErrors.especialidad =
      "La especialidad es requerida y debe tener máximo 100 caracteres";
  }

  const edad = parsePositiveInteger(value.edad);

  if (!edad || edad > 120) {
    fieldErrors.edad =
      "La edad debe ser un entero entre 1 y 120";
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
    fieldErrors.telefono =
      "El teléfono debe tener máximo 20 caracteres";
  }

  const correoNormalizado =
    typeof value.correo === "string"
      ? value.correo.trim().toLowerCase()
      : "";

  if (
    !correoNormalizado ||
    correoNormalizado.length > 150 ||
    !isValidEmail(correoNormalizado)
  ) {
    fieldErrors.correo =
      "El correo es requerido y debe ser válido";
  }

  const direccion = parseNullableString(
    value.direccion,
    300
  );

  if (
    value.direccion !== undefined &&
    value.direccion !== null &&
    value.direccion !== "" &&
    direccion === null
  ) {
    fieldErrors.direccion =
      "La dirección debe tener máximo 300 caracteres";
  }

  const activo = validarActivo(
    value,
    fieldErrors,
    options.requireActivo === true
  );

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
      nombre: nombre as string,
      apellidoPaterno: apellidoPaterno as string,
      apellidoMaterno,
      especialidad: especialidad as string,
      edad: edad as number,
      telefono,
      correo: correoNormalizado,
      direccion,
      ...(activo !== undefined ? { activo } : {}),
    },
  };
}

export function validarCategoriaCurso(
  value: unknown,
  options: ValidationOptions = {}
): ValidationResult<CategoriaCursoInput> {
  if (!isRecord(value)) {
    return {
      success: false,
      error: "El cuerpo de la solicitud no es válido",
    };
  }

  const fieldErrors: Record<string, string> = {};

  const nombreCategoria = parseString(
    value.nombreCategoria,
    {
      required: true,
      maxLength: 50,
    }
  );

  if (!nombreCategoria) {
    fieldErrors.nombreCategoria =
      "El nombre es requerido y debe tener máximo 50 caracteres";
  }

  const descripcion = parseNullableString(
    value.descripcion,
    500
  );

  if (
    value.descripcion !== undefined &&
    value.descripcion !== null &&
    value.descripcion !== "" &&
    descripcion === null
  ) {
    fieldErrors.descripcion =
      "La descripción debe tener máximo 500 caracteres";
  }

  const activo = validarActivo(
    value,
    fieldErrors,
    options.requireActivo === true
  );

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
      nombreCategoria: nombreCategoria as string,
      descripcion,
      ...(activo !== undefined ? { activo } : {}),
    },
  };
}

export function validarUbicacionCurso(
  value: unknown,
  options: ValidationOptions = {}
): ValidationResult<UbicacionCursoInput> {
  if (!isRecord(value)) {
    return {
      success: false,
      error: "El cuerpo de la solicitud no es válido",
    };
  }

  const fieldErrors: Record<string, string> = {};

  const nombreUbicacion = parseString(
    value.nombreUbicacion,
    {
      required: true,
      maxLength: 150,
    }
  );

  if (!nombreUbicacion) {
    fieldErrors.nombreUbicacion =
      "El nombre es requerido y debe tener máximo 150 caracteres";
  }

  const direccionCompleta = parseNullableString(
    value.direccionCompleta,
    500
  );

  if (
    value.direccionCompleta !== undefined &&
    value.direccionCompleta !== null &&
    value.direccionCompleta !== "" &&
    direccionCompleta === null
  ) {
    fieldErrors.direccionCompleta =
      "La dirección debe tener máximo 500 caracteres";
  }

  let capacidadMaxima: number | null = null;

  if (
    value.capacidadMaxima !== undefined &&
    value.capacidadMaxima !== null &&
    value.capacidadMaxima !== ""
  ) {
    capacidadMaxima = parseNullablePositiveInteger(
      value.capacidadMaxima
    );

    if (capacidadMaxima === null) {
      fieldErrors.capacidadMaxima =
        "La capacidad debe ser un entero mayor que cero";
    }
  }

  const activo = validarActivo(
    value,
    fieldErrors,
    options.requireActivo === true
  );

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
      nombreUbicacion: nombreUbicacion as string,
      direccionCompleta,
      capacidadMaxima,
      ...(activo !== undefined ? { activo } : {}),
    },
  };
}

export function validarModalidadCurso(
  value: unknown
): ValidationResult<ModalidadCursoInput> {
  if (!isRecord(value)) {
    return {
      success: false,
      error: "El cuerpo de la solicitud no es válido",
    };
  }

  const fieldErrors: Record<string, string> = {};

  const nombreModalidad = parseString(
    value.nombreModalidad,
    {
      required: true,
      maxLength: 20,
    }
  );

  if (!nombreModalidad) {
    fieldErrors.nombreModalidad =
      "El nombre es requerido y debe tener máximo 20 caracteres";
  }

  const descripcion = parseNullableString(
    value.descripcion,
    500
  );

  if (
    value.descripcion !== undefined &&
    value.descripcion !== null &&
    value.descripcion !== "" &&
    descripcion === null
  ) {
    fieldErrors.descripcion =
      "La descripción debe tener máximo 500 caracteres";
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
      nombreModalidad: nombreModalidad as string,
      descripcion,
    },
  };
}