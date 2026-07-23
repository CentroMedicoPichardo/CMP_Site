import { relations } from "drizzle-orm/relations";
import { categoriasAyudaInSoporte, preguntasUsuariosInSoporte, preguntasFrecuentesInSoporte, usuariosInSeguridad, comprascursosinacademiaInAcademia, pagosCursosInAcademia, metodosPagoCursosInAcademia, medicosInClinica, publicacionesInAcademia, rolesInSeguridad, respuestasAyudaInSoporte, categoriasCursosInAcademia, cursosInAcademia, instructoresInAcademia, modalidadesInAcademia, ubicacionesCursosInAcademia, requisitosAprobacionCursoInAcademia, academiaInfantilInAcademia, encuestasInAcademia, respuestasEncuestasInAcademia, contenidoSaberPediatricoInAcademia, valoracionesFaqInSoporte, estadocomprainacademiaInAcademia, compraParticipantesInAcademia, inscripcionesCursosInAcademia, participantesInAcademia, historialEstadosCompraInAcademia, movimientosCuposCursoInAcademia, historialEstadosCursoInAcademia, sesionesCursoInAcademia, asistenciasCursoInAcademia, progresoCursoInAcademia, evaluacionesCursoInAcademia, resultadosEvaluacionesInAcademia, notificacionesAcademicasInAcademia, certificadosCursoInAcademia, datasetReglasAsociacionInAnalitica, datasetSegmentacionClientesInAnalitica, datasetRegresionPrecioCursosInAnalitica, modelosMlInAnalitica, recomendacionesCursosInAnalitica, segmentosClientesInAnalitica, prediccionesPrecioCursosInAnalitica } from "./schema";

export const preguntasUsuariosInSoporteRelations = relations(preguntasUsuariosInSoporte, ({one, many}) => ({
	categoriasAyudaInSoporte: one(categoriasAyudaInSoporte, {
		fields: [preguntasUsuariosInSoporte.idCategoria],
		references: [categoriasAyudaInSoporte.idCategoria]
	}),
	preguntasFrecuentesInSoporte: one(preguntasFrecuentesInSoporte, {
		fields: [preguntasUsuariosInSoporte.idPreguntaFaq],
		references: [preguntasFrecuentesInSoporte.idPregunta]
	}),
	usuariosInSeguridad: one(usuariosInSeguridad, {
		fields: [preguntasUsuariosInSoporte.idUsuario],
		references: [usuariosInSeguridad.id]
	}),
	respuestasAyudaInSoportes: many(respuestasAyudaInSoporte),
}));

export const categoriasAyudaInSoporteRelations = relations(categoriasAyudaInSoporte, ({many}) => ({
	preguntasUsuariosInSoportes: many(preguntasUsuariosInSoporte),
	preguntasFrecuentesInSoportes: many(preguntasFrecuentesInSoporte),
}));

export const preguntasFrecuentesInSoporteRelations = relations(preguntasFrecuentesInSoporte, ({one, many}) => ({
	preguntasUsuariosInSoportes: many(preguntasUsuariosInSoporte),
	categoriasAyudaInSoporte: one(categoriasAyudaInSoporte, {
		fields: [preguntasFrecuentesInSoporte.idCategoria],
		references: [categoriasAyudaInSoporte.idCategoria]
	}),
	usuariosInSeguridad: one(usuariosInSeguridad, {
		fields: [preguntasFrecuentesInSoporte.creadoPor],
		references: [usuariosInSeguridad.id]
	}),
	valoracionesFaqInSoportes: many(valoracionesFaqInSoporte),
}));

export const usuariosInSeguridadRelations = relations(usuariosInSeguridad, ({one, many}) => ({
	preguntasUsuariosInSoportes: many(preguntasUsuariosInSoporte),
	pagosCursosInAcademias: many(pagosCursosInAcademia),
	rolesInSeguridad: one(rolesInSeguridad, {
		fields: [usuariosInSeguridad.rolId],
		references: [rolesInSeguridad.id]
	}),
	respuestasAyudaInSoportes: many(respuestasAyudaInSoporte),
	preguntasFrecuentesInSoportes: many(preguntasFrecuentesInSoporte),
	respuestasEncuestasInAcademias: many(respuestasEncuestasInAcademia),
	valoracionesFaqInSoportes: many(valoracionesFaqInSoporte),
	comprascursosinacademiaInAcademias_usuariovalida: many(comprascursosinacademiaInAcademia, {
		relationName: "comprascursosinacademiaInAcademia_usuariovalida_usuariosInSeguridad_id"
	}),
	comprascursosinacademiaInAcademias_idusuario: many(comprascursosinacademiaInAcademia, {
		relationName: "comprascursosinacademiaInAcademia_idusuario_usuariosInSeguridad_id"
	}),
	inscripcionesCursosInAcademias: many(inscripcionesCursosInAcademia),
	participantesInAcademias: many(participantesInAcademia),
	historialEstadosCompraInAcademias: many(historialEstadosCompraInAcademia),
	movimientosCuposCursoInAcademias: many(movimientosCuposCursoInAcademia),
	historialEstadosCursoInAcademias: many(historialEstadosCursoInAcademia),
	asistenciasCursoInAcademias: many(asistenciasCursoInAcademia),
	resultadosEvaluacionesInAcademias: many(resultadosEvaluacionesInAcademia),
	notificacionesAcademicasInAcademias: many(notificacionesAcademicasInAcademia),
	certificadosCursoInAcademias_usuarioEmite: many(certificadosCursoInAcademia, {
		relationName: "certificadosCursoInAcademia_usuarioEmite_usuariosInSeguridad_id"
	}),
	certificadosCursoInAcademias_usuarioRevoca: many(certificadosCursoInAcademia, {
		relationName: "certificadosCursoInAcademia_usuarioRevoca_usuariosInSeguridad_id"
	}),
	datasetReglasAsociacionInAnaliticas: many(datasetReglasAsociacionInAnalitica),
	datasetSegmentacionClientesInAnaliticas: many(datasetSegmentacionClientesInAnalitica),
	modelosMlInAnaliticas: many(modelosMlInAnalitica),
	recomendacionesCursosInAnaliticas: many(recomendacionesCursosInAnalitica),
	segmentosClientesInAnaliticas: many(segmentosClientesInAnalitica),
	prediccionesPrecioCursosInAnaliticas: many(prediccionesPrecioCursosInAnalitica),
}));

export const pagosCursosInAcademiaRelations = relations(pagosCursosInAcademia, ({one}) => ({
	comprascursosinacademiaInAcademia: one(comprascursosinacademiaInAcademia, {
		fields: [pagosCursosInAcademia.idCompra],
		references: [comprascursosinacademiaInAcademia.idcompra]
	}),
	metodosPagoCursosInAcademia: one(metodosPagoCursosInAcademia, {
		fields: [pagosCursosInAcademia.idMetodoPago],
		references: [metodosPagoCursosInAcademia.idMetodoPago]
	}),
	usuariosInSeguridad: one(usuariosInSeguridad, {
		fields: [pagosCursosInAcademia.usuarioValida],
		references: [usuariosInSeguridad.id]
	}),
}));

export const comprascursosinacademiaInAcademiaRelations = relations(comprascursosinacademiaInAcademia, ({one, many}) => ({
	pagosCursosInAcademias: many(pagosCursosInAcademia),
	usuariosInSeguridad_usuariovalida: one(usuariosInSeguridad, {
		fields: [comprascursosinacademiaInAcademia.usuariovalida],
		references: [usuariosInSeguridad.id],
		relationName: "comprascursosinacademiaInAcademia_usuariovalida_usuariosInSeguridad_id"
	}),
	cursosInAcademia: one(cursosInAcademia, {
		fields: [comprascursosinacademiaInAcademia.idcurso],
		references: [cursosInAcademia.idCurso]
	}),
	estadocomprainacademiaInAcademia: one(estadocomprainacademiaInAcademia, {
		fields: [comprascursosinacademiaInAcademia.idestadocompra],
		references: [estadocomprainacademiaInAcademia.idestadocompra]
	}),
	usuariosInSeguridad_idusuario: one(usuariosInSeguridad, {
		fields: [comprascursosinacademiaInAcademia.idusuario],
		references: [usuariosInSeguridad.id],
		relationName: "comprascursosinacademiaInAcademia_idusuario_usuariosInSeguridad_id"
	}),
	compraParticipantesInAcademias: many(compraParticipantesInAcademia),
	historialEstadosCompraInAcademias: many(historialEstadosCompraInAcademia),
	movimientosCuposCursoInAcademias: many(movimientosCuposCursoInAcademia),
	datasetReglasAsociacionInAnaliticas: many(datasetReglasAsociacionInAnalitica),
}));

export const metodosPagoCursosInAcademiaRelations = relations(metodosPagoCursosInAcademia, ({many}) => ({
	pagosCursosInAcademias: many(pagosCursosInAcademia),
}));

export const publicacionesInAcademiaRelations = relations(publicacionesInAcademia, ({one}) => ({
	medicosInClinica: one(medicosInClinica, {
		fields: [publicacionesInAcademia.idAutor],
		references: [medicosInClinica.idMedico]
	}),
}));

export const medicosInClinicaRelations = relations(medicosInClinica, ({many}) => ({
	publicacionesInAcademias: many(publicacionesInAcademia),
	academiaInfantilInAcademias: many(academiaInfantilInAcademia),
}));

export const rolesInSeguridadRelations = relations(rolesInSeguridad, ({many}) => ({
	usuariosInSeguridads: many(usuariosInSeguridad),
}));

export const respuestasAyudaInSoporteRelations = relations(respuestasAyudaInSoporte, ({one}) => ({
	preguntasUsuariosInSoporte: one(preguntasUsuariosInSoporte, {
		fields: [respuestasAyudaInSoporte.idPregunta],
		references: [preguntasUsuariosInSoporte.idPregunta]
	}),
	usuariosInSeguridad: one(usuariosInSeguridad, {
		fields: [respuestasAyudaInSoporte.idUsuario],
		references: [usuariosInSeguridad.id]
	}),
}));

export const cursosInAcademiaRelations = relations(cursosInAcademia, ({one, many}) => ({
	categoriasCursosInAcademia: one(categoriasCursosInAcademia, {
		fields: [cursosInAcademia.idCategoria],
		references: [categoriasCursosInAcademia.idCategoria]
	}),
	instructoresInAcademia: one(instructoresInAcademia, {
		fields: [cursosInAcademia.idInstructor],
		references: [instructoresInAcademia.idInstructor]
	}),
	modalidadesInAcademia: one(modalidadesInAcademia, {
		fields: [cursosInAcademia.idModalidad],
		references: [modalidadesInAcademia.idModalidad]
	}),
	ubicacionesCursosInAcademia: one(ubicacionesCursosInAcademia, {
		fields: [cursosInAcademia.idUbicacion],
		references: [ubicacionesCursosInAcademia.idUbicacion]
	}),
	requisitosAprobacionCursoInAcademias: many(requisitosAprobacionCursoInAcademia),
	comprascursosinacademiaInAcademias: many(comprascursosinacademiaInAcademia),
	inscripcionesCursosInAcademias: many(inscripcionesCursosInAcademia),
	movimientosCuposCursoInAcademias: many(movimientosCuposCursoInAcademia),
	historialEstadosCursoInAcademias: many(historialEstadosCursoInAcademia),
	sesionesCursoInAcademias: many(sesionesCursoInAcademia),
	evaluacionesCursoInAcademias: many(evaluacionesCursoInAcademia),
	notificacionesAcademicasInAcademias: many(notificacionesAcademicasInAcademia),
	datasetReglasAsociacionInAnaliticas: many(datasetReglasAsociacionInAnalitica),
	datasetRegresionPrecioCursosInAnaliticas: many(datasetRegresionPrecioCursosInAnalitica),
	recomendacionesCursosInAnaliticas_cursoRecomendadoId: many(recomendacionesCursosInAnalitica, {
		relationName: "recomendacionesCursosInAnalitica_cursoRecomendadoId_cursosInAcademia_idCurso"
	}),
	recomendacionesCursosInAnaliticas_cursoOrigenId: many(recomendacionesCursosInAnalitica, {
		relationName: "recomendacionesCursosInAnalitica_cursoOrigenId_cursosInAcademia_idCurso"
	}),
	prediccionesPrecioCursosInAnaliticas: many(prediccionesPrecioCursosInAnalitica),
}));

export const categoriasCursosInAcademiaRelations = relations(categoriasCursosInAcademia, ({many}) => ({
	cursosInAcademias: many(cursosInAcademia),
}));

export const instructoresInAcademiaRelations = relations(instructoresInAcademia, ({many}) => ({
	cursosInAcademias: many(cursosInAcademia),
}));

export const modalidadesInAcademiaRelations = relations(modalidadesInAcademia, ({many}) => ({
	cursosInAcademias: many(cursosInAcademia),
	sesionesCursoInAcademias: many(sesionesCursoInAcademia),
}));

export const ubicacionesCursosInAcademiaRelations = relations(ubicacionesCursosInAcademia, ({many}) => ({
	cursosInAcademias: many(cursosInAcademia),
	sesionesCursoInAcademias: many(sesionesCursoInAcademia),
}));

export const requisitosAprobacionCursoInAcademiaRelations = relations(requisitosAprobacionCursoInAcademia, ({one}) => ({
	cursosInAcademia: one(cursosInAcademia, {
		fields: [requisitosAprobacionCursoInAcademia.cursoId],
		references: [cursosInAcademia.idCurso]
	}),
}));

export const academiaInfantilInAcademiaRelations = relations(academiaInfantilInAcademia, ({one}) => ({
	medicosInClinica: one(medicosInClinica, {
		fields: [academiaInfantilInAcademia.idAutor],
		references: [medicosInClinica.idMedico]
	}),
}));

export const respuestasEncuestasInAcademiaRelations = relations(respuestasEncuestasInAcademia, ({one}) => ({
	encuestasInAcademia: one(encuestasInAcademia, {
		fields: [respuestasEncuestasInAcademia.encuestaId],
		references: [encuestasInAcademia.id]
	}),
	usuariosInSeguridad: one(usuariosInSeguridad, {
		fields: [respuestasEncuestasInAcademia.usuarioId],
		references: [usuariosInSeguridad.id]
	}),
}));

export const encuestasInAcademiaRelations = relations(encuestasInAcademia, ({one, many}) => ({
	respuestasEncuestasInAcademias: many(respuestasEncuestasInAcademia),
	contenidoSaberPediatricoInAcademia: one(contenidoSaberPediatricoInAcademia, {
		fields: [encuestasInAcademia.contenidoId],
		references: [contenidoSaberPediatricoInAcademia.id]
	}),
}));

export const contenidoSaberPediatricoInAcademiaRelations = relations(contenidoSaberPediatricoInAcademia, ({many}) => ({
	encuestasInAcademias: many(encuestasInAcademia),
}));

export const valoracionesFaqInSoporteRelations = relations(valoracionesFaqInSoporte, ({one}) => ({
	preguntasFrecuentesInSoporte: one(preguntasFrecuentesInSoporte, {
		fields: [valoracionesFaqInSoporte.idPreguntaFaq],
		references: [preguntasFrecuentesInSoporte.idPregunta]
	}),
	usuariosInSeguridad: one(usuariosInSeguridad, {
		fields: [valoracionesFaqInSoporte.idUsuario],
		references: [usuariosInSeguridad.id]
	}),
}));

export const estadocomprainacademiaInAcademiaRelations = relations(estadocomprainacademiaInAcademia, ({many}) => ({
	comprascursosinacademiaInAcademias: many(comprascursosinacademiaInAcademia),
	historialEstadosCompraInAcademias_idEstadoAnterior: many(historialEstadosCompraInAcademia, {
		relationName: "historialEstadosCompraInAcademia_idEstadoAnterior_estadocomprainacademiaInAcademia_idestadocompra"
	}),
	historialEstadosCompraInAcademias_idEstadoNuevo: many(historialEstadosCompraInAcademia, {
		relationName: "historialEstadosCompraInAcademia_idEstadoNuevo_estadocomprainacademiaInAcademia_idestadocompra"
	}),
}));

export const inscripcionesCursosInAcademiaRelations = relations(inscripcionesCursosInAcademia, ({one, many}) => ({
	compraParticipantesInAcademia: one(compraParticipantesInAcademia, {
		fields: [inscripcionesCursosInAcademia.compraParticipanteId],
		references: [compraParticipantesInAcademia.idCompraParticipante]
	}),
	cursosInAcademia: one(cursosInAcademia, {
		fields: [inscripcionesCursosInAcademia.cursoId],
		references: [cursosInAcademia.idCurso]
	}),
	participantesInAcademia: one(participantesInAcademia, {
		fields: [inscripcionesCursosInAcademia.participanteId],
		references: [participantesInAcademia.idParticipante]
	}),
	usuariosInSeguridad: one(usuariosInSeguridad, {
		fields: [inscripcionesCursosInAcademia.usuarioId],
		references: [usuariosInSeguridad.id]
	}),
	asistenciasCursoInAcademias: many(asistenciasCursoInAcademia),
	progresoCursoInAcademias: many(progresoCursoInAcademia),
	resultadosEvaluacionesInAcademias: many(resultadosEvaluacionesInAcademia),
	notificacionesAcademicasInAcademias: many(notificacionesAcademicasInAcademia),
	certificadosCursoInAcademias: many(certificadosCursoInAcademia),
}));

export const compraParticipantesInAcademiaRelations = relations(compraParticipantesInAcademia, ({one, many}) => ({
	inscripcionesCursosInAcademias: many(inscripcionesCursosInAcademia),
	comprascursosinacademiaInAcademia: one(comprascursosinacademiaInAcademia, {
		fields: [compraParticipantesInAcademia.idCompra],
		references: [comprascursosinacademiaInAcademia.idcompra]
	}),
	participantesInAcademia: one(participantesInAcademia, {
		fields: [compraParticipantesInAcademia.idParticipante],
		references: [participantesInAcademia.idParticipante]
	}),
}));

export const participantesInAcademiaRelations = relations(participantesInAcademia, ({one, many}) => ({
	inscripcionesCursosInAcademias: many(inscripcionesCursosInAcademia),
	usuariosInSeguridad: one(usuariosInSeguridad, {
		fields: [participantesInAcademia.usuarioId],
		references: [usuariosInSeguridad.id]
	}),
	compraParticipantesInAcademias: many(compraParticipantesInAcademia),
}));

export const historialEstadosCompraInAcademiaRelations = relations(historialEstadosCompraInAcademia, ({one}) => ({
	comprascursosinacademiaInAcademia: one(comprascursosinacademiaInAcademia, {
		fields: [historialEstadosCompraInAcademia.idCompra],
		references: [comprascursosinacademiaInAcademia.idcompra]
	}),
	estadocomprainacademiaInAcademia_idEstadoAnterior: one(estadocomprainacademiaInAcademia, {
		fields: [historialEstadosCompraInAcademia.idEstadoAnterior],
		references: [estadocomprainacademiaInAcademia.idestadocompra],
		relationName: "historialEstadosCompraInAcademia_idEstadoAnterior_estadocomprainacademiaInAcademia_idestadocompra"
	}),
	estadocomprainacademiaInAcademia_idEstadoNuevo: one(estadocomprainacademiaInAcademia, {
		fields: [historialEstadosCompraInAcademia.idEstadoNuevo],
		references: [estadocomprainacademiaInAcademia.idestadocompra],
		relationName: "historialEstadosCompraInAcademia_idEstadoNuevo_estadocomprainacademiaInAcademia_idestadocompra"
	}),
	usuariosInSeguridad: one(usuariosInSeguridad, {
		fields: [historialEstadosCompraInAcademia.usuarioResponsable],
		references: [usuariosInSeguridad.id]
	}),
}));

export const movimientosCuposCursoInAcademiaRelations = relations(movimientosCuposCursoInAcademia, ({one}) => ({
	comprascursosinacademiaInAcademia: one(comprascursosinacademiaInAcademia, {
		fields: [movimientosCuposCursoInAcademia.compraId],
		references: [comprascursosinacademiaInAcademia.idcompra]
	}),
	cursosInAcademia: one(cursosInAcademia, {
		fields: [movimientosCuposCursoInAcademia.cursoId],
		references: [cursosInAcademia.idCurso]
	}),
	usuariosInSeguridad: one(usuariosInSeguridad, {
		fields: [movimientosCuposCursoInAcademia.usuarioResponsable],
		references: [usuariosInSeguridad.id]
	}),
}));

export const historialEstadosCursoInAcademiaRelations = relations(historialEstadosCursoInAcademia, ({one}) => ({
	cursosInAcademia: one(cursosInAcademia, {
		fields: [historialEstadosCursoInAcademia.cursoId],
		references: [cursosInAcademia.idCurso]
	}),
	usuariosInSeguridad: one(usuariosInSeguridad, {
		fields: [historialEstadosCursoInAcademia.usuarioResponsable],
		references: [usuariosInSeguridad.id]
	}),
}));

export const sesionesCursoInAcademiaRelations = relations(sesionesCursoInAcademia, ({one, many}) => ({
	cursosInAcademia: one(cursosInAcademia, {
		fields: [sesionesCursoInAcademia.cursoId],
		references: [cursosInAcademia.idCurso]
	}),
	modalidadesInAcademia: one(modalidadesInAcademia, {
		fields: [sesionesCursoInAcademia.modalidadId],
		references: [modalidadesInAcademia.idModalidad]
	}),
	ubicacionesCursosInAcademia: one(ubicacionesCursosInAcademia, {
		fields: [sesionesCursoInAcademia.ubicacionId],
		references: [ubicacionesCursosInAcademia.idUbicacion]
	}),
	asistenciasCursoInAcademias: many(asistenciasCursoInAcademia),
	evaluacionesCursoInAcademias: many(evaluacionesCursoInAcademia),
	notificacionesAcademicasInAcademias: many(notificacionesAcademicasInAcademia),
}));

export const asistenciasCursoInAcademiaRelations = relations(asistenciasCursoInAcademia, ({one}) => ({
	inscripcionesCursosInAcademia: one(inscripcionesCursosInAcademia, {
		fields: [asistenciasCursoInAcademia.inscripcionId],
		references: [inscripcionesCursosInAcademia.idInscripcion]
	}),
	sesionesCursoInAcademia: one(sesionesCursoInAcademia, {
		fields: [asistenciasCursoInAcademia.sesionId],
		references: [sesionesCursoInAcademia.idSesion]
	}),
	usuariosInSeguridad: one(usuariosInSeguridad, {
		fields: [asistenciasCursoInAcademia.usuarioRegistra],
		references: [usuariosInSeguridad.id]
	}),
}));

export const progresoCursoInAcademiaRelations = relations(progresoCursoInAcademia, ({one}) => ({
	inscripcionesCursosInAcademia: one(inscripcionesCursosInAcademia, {
		fields: [progresoCursoInAcademia.inscripcionId],
		references: [inscripcionesCursosInAcademia.idInscripcion]
	}),
}));

export const evaluacionesCursoInAcademiaRelations = relations(evaluacionesCursoInAcademia, ({one, many}) => ({
	cursosInAcademia: one(cursosInAcademia, {
		fields: [evaluacionesCursoInAcademia.cursoId],
		references: [cursosInAcademia.idCurso]
	}),
	sesionesCursoInAcademia: one(sesionesCursoInAcademia, {
		fields: [evaluacionesCursoInAcademia.sesionId],
		references: [sesionesCursoInAcademia.idSesion]
	}),
	resultadosEvaluacionesInAcademias: many(resultadosEvaluacionesInAcademia),
	notificacionesAcademicasInAcademias: many(notificacionesAcademicasInAcademia),
}));

export const resultadosEvaluacionesInAcademiaRelations = relations(resultadosEvaluacionesInAcademia, ({one}) => ({
	evaluacionesCursoInAcademia: one(evaluacionesCursoInAcademia, {
		fields: [resultadosEvaluacionesInAcademia.evaluacionId],
		references: [evaluacionesCursoInAcademia.idEvaluacion]
	}),
	inscripcionesCursosInAcademia: one(inscripcionesCursosInAcademia, {
		fields: [resultadosEvaluacionesInAcademia.inscripcionId],
		references: [inscripcionesCursosInAcademia.idInscripcion]
	}),
	usuariosInSeguridad: one(usuariosInSeguridad, {
		fields: [resultadosEvaluacionesInAcademia.usuarioCalifica],
		references: [usuariosInSeguridad.id]
	}),
}));

export const notificacionesAcademicasInAcademiaRelations = relations(notificacionesAcademicasInAcademia, ({one}) => ({
	cursosInAcademia: one(cursosInAcademia, {
		fields: [notificacionesAcademicasInAcademia.cursoId],
		references: [cursosInAcademia.idCurso]
	}),
	evaluacionesCursoInAcademia: one(evaluacionesCursoInAcademia, {
		fields: [notificacionesAcademicasInAcademia.evaluacionId],
		references: [evaluacionesCursoInAcademia.idEvaluacion]
	}),
	inscripcionesCursosInAcademia: one(inscripcionesCursosInAcademia, {
		fields: [notificacionesAcademicasInAcademia.inscripcionId],
		references: [inscripcionesCursosInAcademia.idInscripcion]
	}),
	sesionesCursoInAcademia: one(sesionesCursoInAcademia, {
		fields: [notificacionesAcademicasInAcademia.sesionId],
		references: [sesionesCursoInAcademia.idSesion]
	}),
	usuariosInSeguridad: one(usuariosInSeguridad, {
		fields: [notificacionesAcademicasInAcademia.usuarioCrea],
		references: [usuariosInSeguridad.id]
	}),
}));

export const certificadosCursoInAcademiaRelations = relations(certificadosCursoInAcademia, ({one}) => ({
	inscripcionesCursosInAcademia: one(inscripcionesCursosInAcademia, {
		fields: [certificadosCursoInAcademia.inscripcionId],
		references: [inscripcionesCursosInAcademia.idInscripcion]
	}),
	usuariosInSeguridad_usuarioEmite: one(usuariosInSeguridad, {
		fields: [certificadosCursoInAcademia.usuarioEmite],
		references: [usuariosInSeguridad.id],
		relationName: "certificadosCursoInAcademia_usuarioEmite_usuariosInSeguridad_id"
	}),
	usuariosInSeguridad_usuarioRevoca: one(usuariosInSeguridad, {
		fields: [certificadosCursoInAcademia.usuarioRevoca],
		references: [usuariosInSeguridad.id],
		relationName: "certificadosCursoInAcademia_usuarioRevoca_usuariosInSeguridad_id"
	}),
}));

export const datasetReglasAsociacionInAnaliticaRelations = relations(datasetReglasAsociacionInAnalitica, ({one}) => ({
	comprascursosinacademiaInAcademia: one(comprascursosinacademiaInAcademia, {
		fields: [datasetReglasAsociacionInAnalitica.compraId],
		references: [comprascursosinacademiaInAcademia.idcompra]
	}),
	cursosInAcademia: one(cursosInAcademia, {
		fields: [datasetReglasAsociacionInAnalitica.cursoId],
		references: [cursosInAcademia.idCurso]
	}),
	usuariosInSeguridad: one(usuariosInSeguridad, {
		fields: [datasetReglasAsociacionInAnalitica.usuarioId],
		references: [usuariosInSeguridad.id]
	}),
}));

export const datasetSegmentacionClientesInAnaliticaRelations = relations(datasetSegmentacionClientesInAnalitica, ({one}) => ({
	usuariosInSeguridad: one(usuariosInSeguridad, {
		fields: [datasetSegmentacionClientesInAnalitica.usuarioId],
		references: [usuariosInSeguridad.id]
	}),
}));

export const datasetRegresionPrecioCursosInAnaliticaRelations = relations(datasetRegresionPrecioCursosInAnalitica, ({one}) => ({
	cursosInAcademia: one(cursosInAcademia, {
		fields: [datasetRegresionPrecioCursosInAnalitica.cursoId],
		references: [cursosInAcademia.idCurso]
	}),
}));

export const modelosMlInAnaliticaRelations = relations(modelosMlInAnalitica, ({one, many}) => ({
	usuariosInSeguridad: one(usuariosInSeguridad, {
		fields: [modelosMlInAnalitica.creadoPor],
		references: [usuariosInSeguridad.id]
	}),
	recomendacionesCursosInAnaliticas: many(recomendacionesCursosInAnalitica),
	segmentosClientesInAnaliticas: many(segmentosClientesInAnalitica),
	prediccionesPrecioCursosInAnaliticas: many(prediccionesPrecioCursosInAnalitica),
}));

export const recomendacionesCursosInAnaliticaRelations = relations(recomendacionesCursosInAnalitica, ({one}) => ({
	cursosInAcademia_cursoRecomendadoId: one(cursosInAcademia, {
		fields: [recomendacionesCursosInAnalitica.cursoRecomendadoId],
		references: [cursosInAcademia.idCurso],
		relationName: "recomendacionesCursosInAnalitica_cursoRecomendadoId_cursosInAcademia_idCurso"
	}),
	cursosInAcademia_cursoOrigenId: one(cursosInAcademia, {
		fields: [recomendacionesCursosInAnalitica.cursoOrigenId],
		references: [cursosInAcademia.idCurso],
		relationName: "recomendacionesCursosInAnalitica_cursoOrigenId_cursosInAcademia_idCurso"
	}),
	modelosMlInAnalitica: one(modelosMlInAnalitica, {
		fields: [recomendacionesCursosInAnalitica.modeloId],
		references: [modelosMlInAnalitica.idModelo]
	}),
	usuariosInSeguridad: one(usuariosInSeguridad, {
		fields: [recomendacionesCursosInAnalitica.usuarioId],
		references: [usuariosInSeguridad.id]
	}),
}));

export const segmentosClientesInAnaliticaRelations = relations(segmentosClientesInAnalitica, ({one}) => ({
	modelosMlInAnalitica: one(modelosMlInAnalitica, {
		fields: [segmentosClientesInAnalitica.modeloId],
		references: [modelosMlInAnalitica.idModelo]
	}),
	usuariosInSeguridad: one(usuariosInSeguridad, {
		fields: [segmentosClientesInAnalitica.usuarioId],
		references: [usuariosInSeguridad.id]
	}),
}));

export const prediccionesPrecioCursosInAnaliticaRelations = relations(prediccionesPrecioCursosInAnalitica, ({one}) => ({
	cursosInAcademia: one(cursosInAcademia, {
		fields: [prediccionesPrecioCursosInAnalitica.cursoId],
		references: [cursosInAcademia.idCurso]
	}),
	modelosMlInAnalitica: one(modelosMlInAnalitica, {
		fields: [prediccionesPrecioCursosInAnalitica.modeloId],
		references: [modelosMlInAnalitica.idModelo]
	}),
	usuariosInSeguridad: one(usuariosInSeguridad, {
		fields: [prediccionesPrecioCursosInAnalitica.usuarioDecide],
		references: [usuariosInSeguridad.id]
	}),
}));