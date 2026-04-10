// src/types/instructores.ts
export interface Instructor {
  idInstructor: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string | null;
  especialidad: string;
  edad: number;
  telefono: string | null;
  correo: string;
  direccion: string | null;
  activo: boolean;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface InstructorFormData {
  idInstructor?: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string | null;
  especialidad: string;
  edad: number;
  telefono: string | null;
  correo: string;
  direccion: string | null;
  activo: boolean;
}

// Propiedad computada
export interface InstructorWithNombreCompleto extends Instructor {
  nombreCompleto: string;
}