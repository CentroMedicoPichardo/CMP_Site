// src/types/cursos.ts

export interface CursoBase {
  idCurso: number;
  tituloCurso: string;
  descripcion: string | null;

  idInstructor: number;
  idCategoria: number;
  idUbicacion: number | null;
  idModalidad: number;

  fechaInicio: string;
  fechaFin: string;
  horario: string | null;
  dirigidoA: string | null;

  cupoMaximo: number;
  cuposOcupados: number | null;

  costo: string | null;
  urlImagenPortada: string | null;
  activo: boolean;

  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface CursoRelaciones {
  instructorNombre?: string | null;
  instructorEspecialidad?: string | null;

  categoriaNombre?: string | null;

  ubicacionNombre?: string | null;
  ubicacionDireccion?: string | null;

  modalidadNombre?: string | null;
}

export interface CursoResumen
  extends CursoBase,
    CursoRelaciones {
  imagenSrc?: string;
}

export type CursoDetalle = CursoResumen;

/**
 * Alias temporal para conservar compatibilidad con los
 * componentes actuales.
 */
export type Curso = CursoResumen;

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

  /**
   * Se conserva temporalmente porque el formulario actual lo utiliza.
   * Después será un valor de solo lectura y no se enviará a la API.
   */
  cuposOcupados: number;

  costo: string;
  urlImagenPortada: string | null;
  activo: boolean;
}

export interface CursoWriteFields {
  tituloCurso: string;
  descripcion: string | null;

  idInstructor: number;
  idCategoria: number;
  idUbicacion: number | null;
  idModalidad: number;

  fechaInicio: string;
  fechaFin: string;
  horario: string | null;
  dirigidoA: string;

  cupoMaximo: number;
  costo: string;
  urlImagenPortada: string | null;
}

export type CrearCursoInput = CursoWriteFields;

export type ActualizarCursoInput = CursoWriteFields & {
  activo: boolean;
};

export interface CambiarEstadoCursoInput {
  activo: boolean;
}

export interface DisponibilidadCurso {
  cursoId: number;
  cupoMaximo: number;
  cuposOcupados: number;
  cuposDisponibles: number;
  porcentajeOcupacion: number;
  tieneDisponibilidad: boolean;
}

export interface CursoAnalyticsHistoryItem {
  fecha: string;
  ocupados: number;
}

export interface CursoAnalytics {
  velocidadInscripcion: number;
  tasaConversion: number;
  tasaCrecimiento: number;
  tendencia: number;
  inscripcionesHistoricas: CursoAnalyticsHistoryItem[];
}
export interface InscripcionCursoResumen {
  idInscripcion: number;
  estado: string | null;
  participanteId: number | null;
  compraParticipanteId: number | null;
}

export interface VerificarInscripcionCursoResponse {
  autenticado: boolean;
  inscrito: boolean;
  cantidadInscripciones: number;
  inscripcionId: number | null;
  inscripciones: InscripcionCursoResumen[];
}