// src/types/ubicaciones.ts
export interface UbicacionCurso {
  idUbicacion: number;
  nombreUbicacion: string;
  direccionCompleta: string | null;
  capacidadMaxima: number | null;
  activo: boolean;
}

export interface UbicacionCursoFormData {
  idUbicacion?: number;
  nombreUbicacion: string;
  direccionCompleta: string | null;
  capacidadMaxima: number | null;
  activo: boolean;
}