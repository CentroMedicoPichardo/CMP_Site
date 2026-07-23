export type SituacionCursoCliente =
  | "Próximamente"
  | "En curso"
  | "Finalizado";

export interface ProximaSesionCliente {
  idSesion: number;
  numeroSesion: number;
  titulo: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  estado: string;
}

export interface MiCursoResumen {
  idInscripcion: number;
  idCurso: number;
  tituloCurso: string;
  descripcion: string | null;
  urlImagenPortada: string | null;
  instructorNombre: string;
  categoriaNombre: string | null;
  modalidadNombre: string | null;
  fechaInicio: string;
  fechaFin: string;
  horario: string | null;
  participanteNombre: string;
  estadoInscripcion: string;
  estadoAcademico: string;
  sesionesTotales: number;
  sesionesCompletadas: number;
  porcentajeAvance: number;
  porcentajeAsistencia: number;
  situacionCurso: SituacionCursoCliente;
  proximaSesion: ProximaSesionCliente | null;
}

export interface MisCursosResumenGlobal {
  totalInscripciones: number;
  cursosProximos: number;
  cursosEnCurso: number;
  cursosFinalizados: number;
  cursosCompletados: number;
}

export interface MisCursosResponse {
  success: true;
  resumen: MisCursosResumenGlobal;
  cursos: MiCursoResumen[];
}

export interface SesionMiCursoDetalle {
  idSesion: number;
  numeroSesion: number;
  titulo: string;
  descripcion: string | null;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  estado: string;
  modalidadNombre: string | null;
  ubicacionNombre: string | null;
  direccionCompleta: string | null;
  enlaceVirtual: string | null;
  estadoAsistencia: string;
  horaEntrada: string | null;
  horaSalida: string | null;
  minutosRetardo: number | null;
  justificada: boolean;
  motivoJustificacion: string | null;
  observacionesAsistencia: string | null;
}

export interface MiCursoDetalle {
  idInscripcion: number;
  estadoInscripcion: string;
  fechaInscripcion: string | null;
  origenInscripcion: string;
  participanteId: number | null;
  participanteNombre: string;
  participanteCorreo: string | null;
  participanteTelefono: string | null;
  idCurso: number;
  tituloCurso: string;
  descripcion: string | null;
  urlImagenPortada: string | null;
  instructorNombre: string;
  instructorEspecialidad: string | null;
  categoriaNombre: string | null;
  modalidadNombre: string | null;
  ubicacionNombre: string | null;
  direccionCompleta: string | null;
  fechaInicio: string;
  fechaFin: string;
  horario: string | null;
  situacionCurso: SituacionCursoCliente;
  sesionesTotales: number;
  sesionesCompletadas: number;
  porcentajeAvance: number;
  porcentajeAsistencia: number;
  estadoAcademico: string;
  fechaUltimaActividad: string | null;
  fechaFinalizacion: string | null;
  sesiones: SesionMiCursoDetalle[];
}

export interface MiCursoDetalleResponse {
  success: true;
  curso: MiCursoDetalle;
}
