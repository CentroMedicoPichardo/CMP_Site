// src/lib/validators/pagos-cursos.ts

import {
  isRecord,
  parseNullableString,
  parsePositiveInteger,
  type ValidationResult,
} from "@/lib/validators/common";

import type {
  ReportarPagoCursoInput,
} from "@/types/compras-cursos";

function parseMonto(
  value: unknown
): string | null {
  if (
    typeof value !== "string" &&
    typeof value !== "number"
  ) {
    return null;
  }

  const normalized = String(value).trim();

  if (
    !/^\d+(?:\.\d{1,2})?$/.test(
      normalized
    )
  ) {
    return null;
  }

  const [integerPart, decimalPart = ""] =
    normalized.split(".");

  const cents = decimalPart
    .padEnd(2, "0")
    .slice(0, 2);

  const amountInCents =
    Number(integerPart) * 100 +
    Number(cents);

  if (
    !Number.isSafeInteger(amountInCents) ||
    amountInCents <= 0
  ) {
    return null;
  }

  return `${Number(integerPart)}.${cents}`;
}

function parsePaymentDate(
  value: unknown
): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();

  if (!normalized) {
    return null;
  }

  const parsed = new Date(normalized);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  const now = Date.now();

  if (parsed.getTime() > now + 5 * 60 * 1000) {
    return null;
  }

  return parsed.toISOString();
}

function parseNullableUrl(
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
    normalized.length === 0 ||
    normalized.length > 2000
  ) {
    return null;
  }

  try {
    const url = new URL(normalized);

    if (
      url.protocol !== "https:" &&
      url.protocol !== "http:"
    ) {
      return null;
    }

    return normalized;
  } catch {
    return null;
  }
}

export function validarReportarPagoCurso(
  value: unknown
): ValidationResult<ReportarPagoCursoInput> {
  if (!isRecord(value)) {
    return {
      success: false,
      error:
        "El cuerpo de la solicitud no es válido",
    };
  }

  const fieldErrors: Record<string, string> = {};

  const idMetodoPago =
    parsePositiveInteger(
      value.idMetodoPago
    );

  if (!idMetodoPago) {
    fieldErrors.idMetodoPago =
      "El método de pago es requerido";
  }

  const monto = parseMonto(value.monto);

  if (!monto) {
    fieldErrors.monto =
      "El monto debe ser mayor que cero y tener máximo dos decimales";
  }

  const fechaPago =
    parsePaymentDate(value.fechaPago);

  if (!fechaPago) {
    fieldErrors.fechaPago =
      "La fecha del pago es inválida o está en el futuro";
  }

  const referencia =
    parseNullableString(
      value.referencia,
      100
    );

  if (
    value.referencia !== undefined &&
    value.referencia !== null &&
    value.referencia !== "" &&
    referencia === null
  ) {
    fieldErrors.referencia =
      "La referencia debe tener máximo 100 caracteres";
  }

  const rutaComprobante =
    parseNullableUrl(
      value.rutaComprobante
    );

  if (
    value.rutaComprobante !== undefined &&
    value.rutaComprobante !== null &&
    value.rutaComprobante !== "" &&
    rutaComprobante === null
  ) {
    fieldErrors.rutaComprobante =
      "La URL del comprobante no es válida";
  }

  const nombreArchivoOriginal =
    parseNullableString(
      value.nombreArchivoOriginal,
      255
    );

  if (
    value.nombreArchivoOriginal !== undefined &&
    value.nombreArchivoOriginal !== null &&
    value.nombreArchivoOriginal !== "" &&
    nombreArchivoOriginal === null
  ) {
    fieldErrors.nombreArchivoOriginal =
      "El nombre del archivo debe tener máximo 255 caracteres";
  }

  const tipoArchivo =
    parseNullableString(
      value.tipoArchivo,
      100
    );

  if (
    value.tipoArchivo !== undefined &&
    value.tipoArchivo !== null &&
    value.tipoArchivo !== "" &&
    tipoArchivo === null
  ) {
    fieldErrors.tipoArchivo =
      "El tipo de archivo debe tener máximo 100 caracteres";
  }

  const observaciones =
    parseNullableString(
      value.observaciones,
      1000
    );

  if (
    value.observaciones !== undefined &&
    value.observaciones !== null &&
    value.observaciones !== "" &&
    observaciones === null
  ) {
    fieldErrors.observaciones =
      "Las observaciones deben tener máximo 1000 caracteres";
  }

  if (
    rutaComprobante === null &&
    (
      nombreArchivoOriginal !== null ||
      tipoArchivo !== null
    )
  ) {
    fieldErrors.rutaComprobante =
      "Debes incluir la URL del comprobante cuando envías datos del archivo";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      error:
        "Hay campos inválidos en el reporte de pago",
      fieldErrors,
    };
  }

  return {
    success: true,
    data: {
      idMetodoPago:
        idMetodoPago as number,
      monto: monto as string,
      fechaPago: fechaPago as string,
      referencia,
      rutaComprobante,
      nombreArchivoOriginal,
      tipoArchivo,
      observaciones,
    },
  };
}