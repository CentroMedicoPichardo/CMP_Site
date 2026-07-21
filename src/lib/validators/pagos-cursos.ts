// src/lib/validators/pagos-cursos.ts

import {
  isRecord,
  parseNullableString,
  parsePositiveInteger,
  type ValidationResult,
} from "@/lib/validators/common";

import type {
  CanalComprobanteCurso,
  ReportarPagoCursoInput,
} from "@/types/compras-cursos";

const CANALES_COMPROBANTE: readonly CanalComprobanteCurso[] = [
  "Imagen",
  "URL",
  "WhatsApp",
  "Sin comprobante",
];

const TIPOS_IMAGEN_PERMITIDOS = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

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

  if (
    parsed.getTime() >
    now + 5 * 60 * 1000
  ) {
    return null;
  }

  return parsed.toISOString();
}

function parseNullableHttpsUrl(
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

    if (url.protocol !== "https:") {
      return null;
    }

    if (
      !url.hostname ||
      url.username ||
      url.password
    ) {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}

function parseCanalComprobante(
  value: unknown
): CanalComprobanteCurso | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();

  const canal = CANALES_COMPROBANTE.find(
    (item) => item === normalized
  );

  return canal ?? null;
}

function parseBoolean(
  value: unknown
): boolean | null {
  if (typeof value !== "boolean") {
    return null;
  }

  return value;
}

function esTipoImagenPermitido(
  value: string
): boolean {
  return TIPOS_IMAGEN_PERMITIDOS.some(
    (tipo) => tipo === value
  );
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

  const canalComprobante =
    parseCanalComprobante(
      value.canalComprobante
    );

  if (!canalComprobante) {
    fieldErrors.canalComprobante =
      "El canal de comprobante no es válido";
  }

  const rutaComprobante =
    parseNullableHttpsUrl(
      value.rutaComprobante
    );

  if (
    value.rutaComprobante !== undefined &&
    value.rutaComprobante !== null &&
    value.rutaComprobante !== "" &&
    rutaComprobante === null
  ) {
    fieldErrors.rutaComprobante =
      "La URL del comprobante debe ser una dirección HTTPS válida";
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

  const comprobanteConfirmado =
    parseBoolean(
      value.comprobanteConfirmado
    );

  if (comprobanteConfirmado === null) {
    fieldErrors.comprobanteConfirmado =
      "Debes indicar si confirmaste el envío del comprobante";
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

  if (canalComprobante === "Imagen") {
    if (!rutaComprobante) {
      fieldErrors.rutaComprobante =
        "Debes cargar la imagen del comprobante";
    }

    if (!nombreArchivoOriginal) {
      fieldErrors.nombreArchivoOriginal =
        "No se recibió el nombre del archivo";
    }

    if (!tipoArchivo) {
      fieldErrors.tipoArchivo =
        "No se recibió el tipo del archivo";
    } else if (
      !esTipoImagenPermitido(
        tipoArchivo
      )
    ) {
      fieldErrors.tipoArchivo =
        "La imagen debe ser JPG, PNG o WEBP";
    }
  }

  if (canalComprobante === "URL") {
    if (!rutaComprobante) {
      fieldErrors.rutaComprobante =
        "Debes proporcionar la URL del comprobante";
    }

    if (nombreArchivoOriginal) {
      fieldErrors.nombreArchivoOriginal =
        "El canal URL no debe incluir un nombre de archivo";
    }

    if (tipoArchivo) {
      fieldErrors.tipoArchivo =
        "El canal URL no debe incluir un tipo de archivo";
    }
  }

  if (canalComprobante === "WhatsApp") {
    if (comprobanteConfirmado !== true) {
      fieldErrors.comprobanteConfirmado =
        "Debes confirmar que ya enviaste el comprobante por WhatsApp";
    }

    if (rutaComprobante) {
      fieldErrors.rutaComprobante =
        "El canal WhatsApp no debe incluir una URL";
    }

    if (nombreArchivoOriginal) {
      fieldErrors.nombreArchivoOriginal =
        "El canal WhatsApp no debe incluir un archivo";
    }

    if (tipoArchivo) {
      fieldErrors.tipoArchivo =
        "El canal WhatsApp no debe incluir un tipo de archivo";
    }
  }

  if (
    canalComprobante ===
    "Sin comprobante"
  ) {
    if (rutaComprobante) {
      fieldErrors.rutaComprobante =
        "No debes incluir una URL cuando no hay comprobante";
    }

    if (nombreArchivoOriginal) {
      fieldErrors.nombreArchivoOriginal =
        "No debes incluir un archivo cuando no hay comprobante";
    }

    if (tipoArchivo) {
      fieldErrors.tipoArchivo =
        "No debes incluir un tipo de archivo cuando no hay comprobante";
    }
  }

  if (
    canalComprobante !== "Imagen" &&
    (
      nombreArchivoOriginal !== null ||
      tipoArchivo !== null
    )
  ) {
    if (nombreArchivoOriginal !== null) {
      fieldErrors.nombreArchivoOriginal =
        "Los datos del archivo solo se permiten para comprobantes enviados como imagen";
    }

    if (tipoArchivo !== null) {
      fieldErrors.tipoArchivo =
        "El tipo de archivo solo se permite para comprobantes enviados como imagen";
    }
  }

  if (
    Object.keys(fieldErrors).length > 0
  ) {
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

      monto:
        monto as string,

      fechaPago:
        fechaPago as string,

      referencia,

      canalComprobante:
        canalComprobante as CanalComprobanteCurso,

      rutaComprobante,

      nombreArchivoOriginal,

      tipoArchivo,

      comprobanteConfirmado:
        comprobanteConfirmado as boolean,

      // La fecha real se genera en el servidor.
      fechaEnvioWhatsapp: null,

      observaciones,
    },
  };
}