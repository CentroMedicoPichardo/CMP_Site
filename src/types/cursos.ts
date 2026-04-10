// src/types/cursos.ts
export interface Curso {
  idCurso: number;
  tituloCurso: string;
  descripcion: string | null;
  idInstructor: number;
  instructorNombre: string | null;
  instructorEspecialidad: string | null;
  idCategoria: number;
  categoriaNombre: string | null;
  idUbicacion: number | null;
  ubicacionNombre: string | null;
  ubicacionDireccion: string | null;
  idModalidad: number;
  modalidadNombre: string | null;
  fechaInicio: string;
  fechaFin: string;
  horario: string | null;
  dirigidoA: string;
  cupoMaximo: number;
  cuposOcupados: number;
  costo: string;
  urlImagenPortada: string | null;
  activo: boolean;
  createdAt?: string;
  updatedAt?: string;
  imagenSrc?: string;
}

export interface CursoFormData {
  idCurso?: number;
  tituloCurso: string;
  descripcion: string | null;
  idInstructor: number | null;
  idCategoria: number | null;
  idUbicacion: number | null;
  idModalidad: number | null;
  fechaInicio: string;
  fechaFin: string;
  horario: string | null;
  dirigidoA: string;
  cupoMaximo: number;
  cuposOcupados: number;
  costo: string;
  urlImagenPortada: string | null;
  activo: boolean;
}

export interface CursoAnalytics {
  velocidadInscripcion: number;
  tasaConversion: number;
  tasaCrecimiento: number;
  tendencia: number;
  inscripcionesHistoricas: Array<{
    fecha: string;
    ocupados: number;
  }>;
}

// NOTA: No duplicar CursoFormData otra vez al final