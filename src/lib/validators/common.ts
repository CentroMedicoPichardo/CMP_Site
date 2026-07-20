// src/lib/validators/common.ts

export type ValidationResult<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: string;
      fieldErrors?: Record<string, string>;
    };

export function isRecord(
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

export function parsePositiveInteger(
  value: unknown
): number | null {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

export function parseNonNegativeInteger(
  value: unknown
): number | null {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 0) {
    return null;
  }

  return parsed;
}

export function parseNullablePositiveInteger(
  value: unknown
): number | null {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null;
  }

  return parsePositiveInteger(value);
}

export function parseBoolean(
  value: unknown
): boolean | null {
  if (typeof value === "boolean") {
    return value;
  }

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  return null;
}

export function parseString(
  value: unknown,
  options?: {
    required?: boolean;
    maxLength?: number;
    minLength?: number;
  }
): string | null {
  if (typeof value !== "string") {
    return options?.required ? null : "";
  }

  const normalized = value.trim();

  if (options?.required && normalized.length === 0) {
    return null;
  }

  if (
    options?.minLength !== undefined &&
    normalized.length < options.minLength
  ) {
    return null;
  }

  if (
    options?.maxLength !== undefined &&
    normalized.length > options.maxLength
  ) {
    return null;
  }

  return normalized;
}

export function parseNullableString(
  value: unknown,
  maxLength?: number
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

  if (!normalized) {
    return null;
  }

  if (
    maxLength !== undefined &&
    normalized.length > maxLength
  ) {
    return null;
  }

  return normalized;
}

export function parseDecimalString(
  value: unknown,
  options?: {
    min?: number;
    max?: number;
    decimals?: number;
  }
): string | null {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return null;
  }

  if (
    options?.min !== undefined &&
    parsed < options.min
  ) {
    return null;
  }

  if (
    options?.max !== undefined &&
    parsed > options.max
  ) {
    return null;
  }

  const decimals = options?.decimals ?? 2;

  return parsed.toFixed(decimals);
}

export function isIsoDateString(
  value: unknown
): value is string {
  if (typeof value !== "string") {
    return false;
  }

  const normalized = value.trim();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    return false;
  }

  const [year, month, day] = normalized
    .split("-")
    .map(Number);

  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function isValidEmail(
  value: string
): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function getUnknownErrorMessage(
  error: unknown,
  fallback = "Ocurrió un error inesperado"
): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (
    typeof error === "string" &&
    error.trim().length > 0
  ) {
    return error;
  }

  return fallback;
}

export function hasPostgresCode(
  error: unknown,
  code: string
): boolean {
  if (!isRecord(error)) {
    return false;
  }

  return error.code === code;
}

export function hasConstraintName(
  error: unknown,
  constraintName: string
): boolean {
  if (!isRecord(error)) {
    return false;
  }

  return (
    typeof error.constraint === "string" &&
    error.constraint === constraintName
  );
}