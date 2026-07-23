export type TipoSeguimientoAcademico =
  | "Solo asistencia"
  | "Evaluaciones opcionales"
  | "Evaluaciones obligatorias";

export interface RequisitosAprobacionCursoAdmin {
  cursoId: number;
  configurado: boolean;
  tipoSeguimiento: TipoSeguimientoAcademico;
  porcentajeAsistenciaMinima: number;
  calificacionMinima: number;
  porcentajeAvanceMinimo: number;
  requiereEvaluacionesObligatorias: boolean;
  requiereEvaluacionFinal: boolean;
  permiteFaltasJustificadas: boolean;
  maximoFaltasInjustificadas: number | null;
  requierePagoValidado: boolean;
  emiteCertificado: boolean;
  vigente: boolean;
  observaciones: string | null;
}

export interface RequisitosAprobacionResponse {
  success: true;
  requisitos: RequisitosAprobacionCursoAdmin;
}

export interface GuardarRequisitosAprobacionInput {
  tipoSeguimiento: TipoSeguimientoAcademico;
  porcentajeAsistenciaMinima: number;
  calificacionMinima: number;
  porcentajeAvanceMinimo: number;
  requiereEvaluacionFinal: boolean;
  permiteFaltasJustificadas: boolean;
  maximoFaltasInjustificadas: number | null;
  requierePagoValidado: boolean;
  emiteCertificado: boolean;
  observaciones: string | null;
}
