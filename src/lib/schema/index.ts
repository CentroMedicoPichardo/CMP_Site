// src/lib/schema/index.ts

// Importa todo desde los archivos generados por Drizzle
import * as generatedSchema from "./schema";
import * as generatedRelations from "./relations";

// ========== ESQUEMAS Y SECUENCIAS ==========
export const soporteSchema = generatedSchema.soporte;
export const seguridadSchema = generatedSchema.seguridad;
export const clinicaSchema = generatedSchema.clinica;
export const academiaSchema = generatedSchema.academia;
export const auditoriaSchema = generatedSchema.auditoria;
export const analiticaSchema = generatedSchema.analitica;
export const seqFolioCompra = generatedSchema.seqFolioCompraInAcademia;

// ========== CLÍNICA ==========
export const medicos = generatedSchema.medicosInClinica;
export const servicios = generatedSchema.serviciosInClinica;
export const nosotros = generatedSchema.nosotrosInClinica;
export const empresaInfo = generatedSchema.empresaInfoInClinica;

// ========== ACADEMIA: CATÁLOGOS Y CONTENIDO ==========
export const cursos = generatedSchema.cursosInAcademia;
export const instructores = generatedSchema.instructoresInAcademia;
export const categoriasCursos = generatedSchema.categoriasCursosInAcademia;
export const ubicacionesCursos = generatedSchema.ubicacionesCursosInAcademia;
export const modalidades = generatedSchema.modalidadesInAcademia;

export const publicaciones = generatedSchema.publicacionesInAcademia;
export const academiaInfantil = generatedSchema.academiaInfantilInAcademia;
export const contenidoSaberPediatrico = generatedSchema.contenidoSaberPediatricoInAcademia;
export const encuestas = generatedSchema.encuestasInAcademia;
export const respuestasEncuestas = generatedSchema.respuestasEncuestasInAcademia;

// ========== ACADEMIA: COMPRAS, PAGOS E INSCRIPCIONES ==========
export const comprasCursos = generatedSchema.comprascursosinacademiaInAcademia;
export const estadosCompra = generatedSchema.estadocomprainacademiaInAcademia;
export const participantes = generatedSchema.participantesInAcademia;
export const compraParticipantes = generatedSchema.compraParticipantesInAcademia;
export const inscripcionesCursos = generatedSchema.inscripcionesCursosInAcademia;
export const pagosCursos = generatedSchema.pagosCursosInAcademia;
export const metodosPagoCursos = generatedSchema.metodosPagoCursosInAcademia;
export const historialEstadosCompra = generatedSchema.historialEstadosCompraInAcademia;
export const movimientosCuposCurso = generatedSchema.movimientosCuposCursoInAcademia;
export const historialEstadosCurso = generatedSchema.historialEstadosCursoInAcademia;

// ========== ACADEMIA: SEGUIMIENTO ACADÉMICO ==========
export const sesionesCurso = generatedSchema.sesionesCursoInAcademia;
export const asistenciasCurso = generatedSchema.asistenciasCursoInAcademia;
export const progresoCurso = generatedSchema.progresoCursoInAcademia;
export const evaluacionesCurso = generatedSchema.evaluacionesCursoInAcademia;
export const resultadosEvaluaciones = generatedSchema.resultadosEvaluacionesInAcademia;
export const notificacionesAcademicas = generatedSchema.notificacionesAcademicasInAcademia;
export const certificadosCurso = generatedSchema.certificadosCursoInAcademia;
export const requisitosAprobacionCurso = generatedSchema.requisitosAprobacionCursoInAcademia;

// ========== ACADEMIA: VISTAS ==========
export const vwDetalleParticipantesCursos = generatedSchema.vwDetalleParticipantesCursosInAcademia;
export const vwOcupacionCursos = generatedSchema.vwOcupacionCursosInAcademia;
export const vwSeguimientoAcademicoCursos = generatedSchema.vwSeguimientoAcademicoCursosInAcademia;
export const vwResumenComprasCursos = generatedSchema.vwResumenComprasCursosInAcademia;
export const vwControlPagosCursos = generatedSchema.vwControlPagosCursosInAcademia;
export const vwAgendaSesionesCursos = generatedSchema.vwAgendaSesionesCursosInAcademia;
export const vwAlertasAdministrativas = generatedSchema.vwAlertasAdministrativasInAcademia;
export const vwIndicadoresGenerales = generatedSchema.vwIndicadoresGeneralesInAcademia;
export const vwMetricasMensualesCursos = generatedSchema.vwMetricasMensualesCursosInAcademia;

// ========== SEGURIDAD ==========
export const usuarios = generatedSchema.usuariosInSeguridad;
export const roles = generatedSchema.rolesInSeguridad;
export const auditoriaAcciones = generatedSchema.auditoriaAccionesInSeguridad;
export const monitoreoRendimiento = generatedSchema.monitoreoRendimientoInSeguridad;
export const alertasSeguridad = generatedSchema.alertasSeguridadInSeguridad;
export const cambiosEstructura = generatedSchema.cambiosEstructuraInSeguridad;
export const estadisticasConsumo = generatedSchema.estadisticasConsumoInSeguridad;

// ========== AUDITORÍA ==========
export const backups = generatedSchema.backupsInAuditoria;
export const intentosRecuperacion = generatedSchema.intentosRecuperacionInAuditoria;

// ========== SOPORTE ==========
export const categoriasAyuda = generatedSchema.categoriasAyudaInSoporte;
export const preguntasFrecuentes = generatedSchema.preguntasFrecuentesInSoporte;
export const preguntasUsuarios = generatedSchema.preguntasUsuariosInSoporte;
export const respuestasAyuda = generatedSchema.respuestasAyudaInSoporte;
export const valoracionesFaq = generatedSchema.valoracionesFaqInSoporte;

// ========== ANALÍTICA: DATASETS Y PROCESAMIENTO ==========
export const datasetReglasAsociacion = generatedSchema.datasetReglasAsociacionInAnalitica;
export const datasetSegmentacionClientes = generatedSchema.datasetSegmentacionClientesInAnalitica;
export const datasetRegresionPrecioCursos = generatedSchema.datasetRegresionPrecioCursosInAnalitica;
export const colaActualizacionDatasets = generatedSchema.colaActualizacionDatasetsInAnalitica;

// ========== ANALÍTICA: MODELOS Y RESULTADOS ==========
export const modelosMl = generatedSchema.modelosMlInAnalitica;
export const recomendacionesCursos = generatedSchema.recomendacionesCursosInAnalitica;
export const segmentosClientes = generatedSchema.segmentosClientesInAnalitica;
export const prediccionesPrecioCursos = generatedSchema.prediccionesPrecioCursosInAnalitica;

// ========== ANALÍTICA: VISTAS MATERIALIZADAS ==========
export const mvMetricasMensualesCursos = generatedSchema.mvMetricasMensualesCursosInAnalitica;
export const mvIndicadoresGenerales = generatedSchema.mvIndicadoresGeneralesInAnalitica;

// ========== RELACIONES: CLÍNICA ==========
export const medicosRelations = generatedRelations.medicosInClinicaRelations;

// ========== RELACIONES: ACADEMIA ==========
export const cursosRelations = generatedRelations.cursosInAcademiaRelations;
export const instructoresRelations = generatedRelations.instructoresInAcademiaRelations;
export const categoriasCursosRelations = generatedRelations.categoriasCursosInAcademiaRelations;
export const ubicacionesCursosRelations = generatedRelations.ubicacionesCursosInAcademiaRelations;
export const modalidadesRelations = generatedRelations.modalidadesInAcademiaRelations;
export const publicacionesRelations = generatedRelations.publicacionesInAcademiaRelations;
export const academiaInfantilRelations = generatedRelations.academiaInfantilInAcademiaRelations;
export const contenidoSaberPediatricoRelations = generatedRelations.contenidoSaberPediatricoInAcademiaRelations;
export const encuestasRelations = generatedRelations.encuestasInAcademiaRelations;
export const respuestasEncuestasRelations = generatedRelations.respuestasEncuestasInAcademiaRelations;

export const comprasCursosRelations = generatedRelations.comprascursosinacademiaInAcademiaRelations;
export const estadosCompraRelations = generatedRelations.estadocomprainacademiaInAcademiaRelations;
export const participantesRelations = generatedRelations.participantesInAcademiaRelations;
export const compraParticipantesRelations = generatedRelations.compraParticipantesInAcademiaRelations;
export const inscripcionesCursosRelations = generatedRelations.inscripcionesCursosInAcademiaRelations;
export const pagosCursosRelations = generatedRelations.pagosCursosInAcademiaRelations;
export const metodosPagoCursosRelations = generatedRelations.metodosPagoCursosInAcademiaRelations;
export const historialEstadosCompraRelations = generatedRelations.historialEstadosCompraInAcademiaRelations;
export const movimientosCuposCursoRelations = generatedRelations.movimientosCuposCursoInAcademiaRelations;
export const historialEstadosCursoRelations = generatedRelations.historialEstadosCursoInAcademiaRelations;
export const sesionesCursoRelations = generatedRelations.sesionesCursoInAcademiaRelations;
export const asistenciasCursoRelations = generatedRelations.asistenciasCursoInAcademiaRelations;
export const progresoCursoRelations = generatedRelations.progresoCursoInAcademiaRelations;
export const evaluacionesCursoRelations = generatedRelations.evaluacionesCursoInAcademiaRelations;
export const resultadosEvaluacionesRelations = generatedRelations.resultadosEvaluacionesInAcademiaRelations;
export const notificacionesAcademicasRelations = generatedRelations.notificacionesAcademicasInAcademiaRelations;
export const certificadosCursoRelations = generatedRelations.certificadosCursoInAcademiaRelations;
export const requisitosAprobacionCursoRelations = generatedRelations.requisitosAprobacionCursoInAcademiaRelations;

// ========== RELACIONES: SEGURIDAD ==========
export const usuariosRelations = generatedRelations.usuariosInSeguridadRelations;
export const rolesRelations = generatedRelations.rolesInSeguridadRelations;

// ========== RELACIONES: SOPORTE ==========
export const categoriasAyudaRelations = generatedRelations.categoriasAyudaInSoporteRelations;
export const preguntasFrecuentesRelations = generatedRelations.preguntasFrecuentesInSoporteRelations;
export const preguntasUsuariosRelations = generatedRelations.preguntasUsuariosInSoporteRelations;
export const respuestasAyudaRelations = generatedRelations.respuestasAyudaInSoporteRelations;
export const valoracionesFaqRelations = generatedRelations.valoracionesFaqInSoporteRelations;

// ========== RELACIONES: ANALÍTICA ==========
export const datasetReglasAsociacionRelations = generatedRelations.datasetReglasAsociacionInAnaliticaRelations;
export const datasetSegmentacionClientesRelations = generatedRelations.datasetSegmentacionClientesInAnaliticaRelations;
export const datasetRegresionPrecioCursosRelations = generatedRelations.datasetRegresionPrecioCursosInAnaliticaRelations;
export const modelosMlRelations = generatedRelations.modelosMlInAnaliticaRelations;
export const recomendacionesCursosRelations = generatedRelations.recomendacionesCursosInAnaliticaRelations;
export const segmentosClientesRelations = generatedRelations.segmentosClientesInAnaliticaRelations;
export const prediccionesPrecioCursosRelations = generatedRelations.prediccionesPrecioCursosInAnaliticaRelations;

// Exportaciones originales completas para conservar acceso a los nombres generados.
export * from "./schema";
export * from "./relations";
