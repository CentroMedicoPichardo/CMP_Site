// src/lib/comprobantes-cursos.ts

import { randomUUID } from "node:crypto";
import path from "node:path";

export const MAX_COMPROBANTE_SIZE_BYTES =
  5 * 1024 * 1024;

export const COMPROBANTES_STORAGE_ROOT =
  path.join(
    process.cwd(),
    "storage",
    "comprobantes-cursos"
  );

const MIME_EXTENSION_MAP = {
  "application/pdf": ".pdf",
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
} as const;

const EXTENSION_MIME_MAP = {
  ".pdf": "application/pdf",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
} as const;

export interface ComprobanteCursoGuardado {
  storedFileName: string;
  originalFileName: string;
  mimeType: string;
  size: number;
  absolutePath: string;
}

export class ComprobanteCursoError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
    this.name = "ComprobanteCursoError";
  }
}

export function sanitizeOriginalFileName(
  fileName: string
): string {
  const baseName = path.basename(fileName);

  const sanitized = baseName
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._ -]/g, "_")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 255);

  return sanitized || "comprobante";
}

export function validateComprobanteFile(
  value: FormDataEntryValue | null
): File {
  if (!(value instanceof File)) {
    throw new ComprobanteCursoError(
      "Debes seleccionar un comprobante",
      400
    );
  }

  if (value.size <= 0) {
    throw new ComprobanteCursoError(
      "El archivo está vacío",
      400
    );
  }

  if (
    value.size >
    MAX_COMPROBANTE_SIZE_BYTES
  ) {
    throw new ComprobanteCursoError(
      "El comprobante no puede superar 5 MB",
      413
    );
  }

  if (
    !Object.prototype.hasOwnProperty.call(
      MIME_EXTENSION_MAP,
      value.type
    )
  ) {
    throw new ComprobanteCursoError(
      "Solo se permiten archivos PDF, JPG, PNG o WEBP",
      415
    );
  }

  return value;
}

export function getStoredFileName(
  mimeType: string
): string {
  const extension =
    MIME_EXTENSION_MAP[
      mimeType as keyof typeof MIME_EXTENSION_MAP
    ];

  if (!extension) {
    throw new ComprobanteCursoError(
      "El tipo de archivo no está permitido",
      415
    );
  }

  return `${randomUUID()}${extension}`;
}

export function getComprobanteDirectory(
  userId: number,
  purchaseId: number
): string {
  return path.join(
    COMPROBANTES_STORAGE_ROOT,
    String(userId),
    String(purchaseId)
  );
}

export function resolveStoredComprobantePath(
  userId: number,
  purchaseId: number,
  storedFileName: string
): string {
  const safeFileName =
    path.basename(storedFileName);

  if (
    safeFileName !== storedFileName ||
    !/^[0-9a-f-]{36}\.(pdf|jpg|png|webp)$/i.test(
      safeFileName
    )
  ) {
    throw new ComprobanteCursoError(
      "El comprobante solicitado no es válido",
      400
    );
  }

  return path.join(
    getComprobanteDirectory(
      userId,
      purchaseId
    ),
    safeFileName
  );
}

export function getMimeTypeFromStoredName(
  storedFileName: string
): string {
  const extension = path
    .extname(storedFileName)
    .toLowerCase();

  return (
    EXTENSION_MIME_MAP[
      extension as keyof typeof EXTENSION_MIME_MAP
    ] ?? "application/octet-stream"
  );
}