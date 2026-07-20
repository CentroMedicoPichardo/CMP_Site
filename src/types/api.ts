// src/types/api.ts

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiErrorResponse {
  error: string;
  message?: string;
  code?: string;
  details?: string | Record<string, string>;
  validationErrors?: ValidationError[];
}

export interface ApiMessageResponse {
  message: string;
}

export interface ApiDataResponse<T> {
  data: T;
}

export interface ApiMutationResponse<T> {
  message: string;
  data: T;
}

export function isRecord(
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

export function getApiErrorMessage(
  value: unknown,
  fallback = "Ocurrió un error inesperado"
): string {
  if (!isRecord(value)) {
    return fallback;
  }

  if (
    typeof value.error === "string" &&
    value.error.trim().length > 0
  ) {
    return value.error;
  }

  if (
    typeof value.message === "string" &&
    value.message.trim().length > 0
  ) {
    return value.message;
  }

  return fallback;
}

export function isApiErrorResponse(
  value: unknown
): value is ApiErrorResponse {
  return (
    isRecord(value) &&
    typeof value.error === "string"
  );
}