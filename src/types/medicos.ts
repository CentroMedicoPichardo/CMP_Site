// src/types/medicos.ts
export interface Medico {
  idMedico: number;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string | null;
  especialidad: string;
  hospitalClinica: string | null;
  direccion: string | null;
  urlFoto: string | null;
  activo: boolean;
  // Propiedades computadas (opcionales para la UI)
  nombreCompleto?: string;
  imagenSrc?: string;
}

export interface MedicoFormData {
  idMedico?: number;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  especialidad: string;
  hospitalClinica: string;
  direccion: string;
  urlFoto: string;
  activo: boolean;
}