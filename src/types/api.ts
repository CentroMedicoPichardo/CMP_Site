// src/types/api.ts
export interface ApiResponse<T = any> {
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

// Tipo para errores de validación
export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiErrorResponse {
  error: string;
  details?: string;
  validationErrors?: ValidationError[];
}