// src/types/inscripciones.ts
export interface InscripcionCurso {
  idInscripcion: number;
  cursoId: number;
  usuarioId: number;
  fechaInscripcion: string | null;
  estado: string;
  montoPagado: string | null;
  metodoPago: string | null;
}

export interface InscripcionCursoFormData {
  idInscripcion?: number;
  cursoId: number;
  usuarioId: number;
  estado: string;
  montoPagado: string | null;
  metodoPago: string | null;
}

// Tipo para la respuesta con datos del curso y usuario
export interface InscripcionWithDetails extends InscripcionCurso {
  tituloCurso: string;
  nombreUsuario: string;
  emailUsuario: string;
}