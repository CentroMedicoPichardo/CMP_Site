export type EstadoSesionCurso =
  | "Programada"
  | "En curso"
  | "Finalizada"
  | "Cancelada"
  | "Reprogramada";

export type EstadoAsistenciaCurso =
  | "Pendiente"
  | "Presente"
  | "Ausente"
  | "Retardo"
  | "Falta justificada"
  | "Salida anticipada";

export interface CursoGestionAcademicaResumen {
  idCurso: number;
  tituloCurso: string;
  descripcion: string | null;
  instructorNombre: string;
  fechaInicio: string;
  fechaFin: string;
  activo: boolean;
  cupoMaximo: number;
  cuposOcupados: number;
  totalInscripciones: number;
  totalSesiones: number;
  sesionesProgramadas: number;
  sesionesEnCurso: number;
  sesionesFinalizadas: number;
  sesionesCanceladas: number;
  promedioAvance: number;
  promedioAsistencia: number;
  situacionAcademica: string;
}

export interface GestionAcademicaResumenGlobal {
  totalCursos: number;
  totalInscripciones: number;
  totalSesiones: number;
  sesionesProgramadas: number;
  sesionesEnCurso: number;
  sesionesFinalizadas: number;
}

export interface GestionAcademicaCursosResponse {
  success: true;
  resumen: GestionAcademicaResumenGlobal;
  cursos: CursoGestionAcademicaResumen[];
}

export interface SesionCursoAdmin {
  idSesion: number;
  cursoId: number;
  numeroSesion: number;
  titulo: string;
  descripcion: string | null;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  modalidadId: number | null;
  modalidadNombre: string | null;
  ubicacionId: number | null;
  ubicacionNombre: string | null;
  enlaceVirtual: string | null;
  estado: EstadoSesionCurso;
  observaciones: string | null;
}

export interface ParticipanteCursoAdmin {
  idInscripcion: number;
  participanteId: number | null;
  nombreParticipante: string;
  correoParticipante: string | null;
  telefonoParticipante: string | null;
  estadoInscripcion: string;
  origenInscripcion: string;
  estadoAcademico: string;
  porcentajeAvance: number;
  porcentajeAsistencia: number;
  asistenciasPresentes: number;
  retardos: number;
  ausencias: number;
  faltasJustificadas: number;
}

export interface ModalidadAcademica {
  idModalidad: number;
  nombreModalidad: string;
}

export interface UbicacionAcademica {
  idUbicacion: number;
  nombreUbicacion: string;
  direccionCompleta: string | null;
}

export interface CursoGestionAcademicaDetalle {
  idCurso: number;
  tituloCurso: string;
  descripcion: string | null;
  instructorNombre: string;
  instructorEspecialidad: string | null;
  categoriaNombre: string | null;
  modalidadNombre: string | null;
  ubicacionNombre: string | null;
  fechaInicio: string;
  fechaFin: string;
  horario: string | null;
  activo: boolean;
  cupoMaximo: number;
  cuposOcupados: number;
  totalInscripciones: number;
  totalSesiones: number;
  sesionesProgramadas: number;
  sesionesEnCurso: number;
  sesionesFinalizadas: number;
  sesionesCanceladas: number;
  promedioAvance: number;
  promedioAsistencia: number;
  situacionAcademica: string;
}

export interface CursoGestionAcademicaDetalleResponse {
  success: true;
  curso: CursoGestionAcademicaDetalle;
  sesiones: SesionCursoAdmin[];
  participantes: ParticipanteCursoAdmin[];
  modalidades: ModalidadAcademica[];
  ubicaciones: UbicacionAcademica[];
}

export interface SesionCursoInput {
  numeroSesion: number;
  titulo: string;
  descripcion?: string | null;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  modalidadId?: number | null;
  ubicacionId?: number | null;
  enlaceVirtual?: string | null;
  observaciones?: string | null;
}

export interface CambiarEstadoSesionInput {
  estado: EstadoSesionCurso;
}

export interface SesionAsistenciaDetalle {
  idSesion: number;
  cursoId: number;
  tituloCurso: string;
  numeroSesion: number;
  tituloSesion: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  estadoSesion: EstadoSesionCurso;
  modalidadNombre: string | null;
  ubicacionNombre: string | null;
  enlaceVirtual: string | null;
}

export interface AsistenciaParticipanteAdmin {
  idInscripcion: number;
  participanteId: number | null;
  nombreParticipante: string;
  correoParticipante: string | null;
  telefonoParticipante: string | null;
  estadoInscripcion: string;
  idAsistencia: number | null;
  estadoAsistencia: EstadoAsistenciaCurso;
  horaEntrada: string | null;
  horaSalida: string | null;
  minutosRetardo: number | null;
  justificada: boolean;
  motivoJustificacion: string | null;
  comprobanteJustificacion: string | null;
  observaciones: string | null;
  fechaRegistro: string | null;
}

export interface AsistenciaSesionResponse {
  success: true;
  sesion: SesionAsistenciaDetalle;
  participantes: AsistenciaParticipanteAdmin[];
  resumen: {
    total: number;
    pendientes: number;
    presentes: number;
    ausentes: number;
    retardos: number;
    justificadas: number;
    salidasAnticipadas: number;
  };
}

export interface RegistroAsistenciaInput {
  idInscripcion: number;
  estadoAsistencia: EstadoAsistenciaCurso;
  horaEntrada?: string | null;
  horaSalida?: string | null;
  minutosRetardo?: number | null;
  motivoJustificacion?: string | null;
  comprobanteJustificacion?: string | null;
  observaciones?: string | null;
}

export interface GuardarAsistenciasInput {
  asistencias: RegistroAsistenciaInput[];
}
