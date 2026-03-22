// src/types/cursos.ts
export interface Curso {
  idCurso: number;
  tituloCurso: string;
  descripcion: string | null;
  idInstructor: number | null;
  instructorNombre: string | null;
  categoria: string | null;
  fechaInicio: string | null;
  fechaFin: string | null;
  horario: string | null;
  modalidad: 'Online' | 'Presencial' | 'Híbrido';
  dirigidoA: 'Padres' | 'Niños' | 'Familia' | 'Adolescentes';
  cupoMaximo: number | null;
  cuposOcupados: number | null;
  ubicacion: string | null;
  costo: string | null;
  urlImagenPortada: string | null;
  activo: boolean;
  // Propiedades computadas
  imagenSrc?: string;
}

export interface CursoFormData {
  idCurso?: number;
  tituloCurso: string;
  descripcion: string;
  idInstructor: number | null;
  categoria: string;
  fechaInicio: string;
  fechaFin: string;
  horario: string;
  modalidad: 'Online' | 'Presencial' | 'Híbrido';
  dirigidoA: 'Padres' | 'Niños' | 'Familia' | 'Adolescentes';
  cupoMaximo: number;
  cuposOcupados: number;
  ubicacion: string;
  costo: string;
  urlImagenPortada: string;
  activo: boolean;
}