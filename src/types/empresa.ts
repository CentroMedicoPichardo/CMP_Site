// src/types/empresa.ts
export interface EmpresaInfo {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  correo: string;
  facebook: string | null;
  instagram: string | null;
  horario: string;
  logoUrl: string | null;
  correoSoporte: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EmpresaInfoFormData {
  nombre: string;
  direccion: string;
  telefono: string;
  correo: string;
  facebook: string;
  instagram: string;
  horario: string;
  logoUrl: string;
  correoSoporte: string;
}