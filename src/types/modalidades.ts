// src/types/modalidades.ts
export interface Modalidad {
  idModalidad: number;
  nombreModalidad: string;
  descripcion: string | null;
}

export interface ModalidadFormData {
  idModalidad?: number;
  nombreModalidad: string;
  descripcion: string | null;
}