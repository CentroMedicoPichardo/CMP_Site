import { relations } from "drizzle-orm/relations";
import { usuariosInSeguridad, preguntasUsuariosInSoporte, categoriasAyudaInSoporte, preguntasFrecuentesInSoporte, medicosInClinica, publicacionesInAcademia, rolesInSeguridad, respuestasAyudaInSoporte, instructoresInAcademia, cursosInAcademia, categoriasCursosInAcademia, ubicacionesCursosInAcademia, modalidadesInAcademia, academiaInfantilInAcademia, encuestasInAcademia, respuestasEncuestasInAcademia, contenidoSaberPediatricoInAcademia, inscripcionesCursosInAcademia, valoracionesFaqInSoporte } from "./schema";

export const preguntasUsuariosInSoporteRelations = relations(preguntasUsuariosInSoporte, ({one, many}) => ({
	usuariosInSeguridad: one(usuariosInSeguridad, {
		fields: [preguntasUsuariosInSoporte.idUsuario],
		references: [usuariosInSeguridad.id]
	}),
	categoriasAyudaInSoporte: one(categoriasAyudaInSoporte, {
		fields: [preguntasUsuariosInSoporte.idCategoria],
		references: [categoriasAyudaInSoporte.idCategoria]
	}),
	preguntasFrecuentesInSoporte: one(preguntasFrecuentesInSoporte, {
		fields: [preguntasUsuariosInSoporte.idPreguntaFaq],
		references: [preguntasFrecuentesInSoporte.idPregunta]
	}),
	respuestasAyudaInSoportes: many(respuestasAyudaInSoporte),
}));

export const usuariosInSeguridadRelations = relations(usuariosInSeguridad, ({one, many}) => ({
	preguntasUsuariosInSoportes: many(preguntasUsuariosInSoporte),
	rolesInSeguridad: one(rolesInSeguridad, {
		fields: [usuariosInSeguridad.rolId],
		references: [rolesInSeguridad.id]
	}),
	respuestasAyudaInSoportes: many(respuestasAyudaInSoporte),
	preguntasFrecuentesInSoportes: many(preguntasFrecuentesInSoporte),
	respuestasEncuestasInAcademias: many(respuestasEncuestasInAcademia),
	inscripcionesCursosInAcademias: many(inscripcionesCursosInAcademia),
	valoracionesFaqInSoportes: many(valoracionesFaqInSoporte),
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
	instructoresInAcademia: one(instructoresInAcademia, {
		fields: [cursosInAcademia.idInstructor],
		references: [instructoresInAcademia.idInstructor]
	}),
	categoriasCursosInAcademia: one(categoriasCursosInAcademia, {
		fields: [cursosInAcademia.idCategoria],
		references: [categoriasCursosInAcademia.idCategoria]
	}),
	ubicacionesCursosInAcademia: one(ubicacionesCursosInAcademia, {
		fields: [cursosInAcademia.idUbicacion],
		references: [ubicacionesCursosInAcademia.idUbicacion]
	}),
	modalidadesInAcademia: one(modalidadesInAcademia, {
		fields: [cursosInAcademia.idModalidad],
		references: [modalidadesInAcademia.idModalidad]
	}),
	inscripcionesCursosInAcademias: many(inscripcionesCursosInAcademia),
}));

export const instructoresInAcademiaRelations = relations(instructoresInAcademia, ({many}) => ({
	cursosInAcademias: many(cursosInAcademia),
}));

export const categoriasCursosInAcademiaRelations = relations(categoriasCursosInAcademia, ({many}) => ({
	cursosInAcademias: many(cursosInAcademia),
}));

export const ubicacionesCursosInAcademiaRelations = relations(ubicacionesCursosInAcademia, ({many}) => ({
	cursosInAcademias: many(cursosInAcademia),
}));

export const modalidadesInAcademiaRelations = relations(modalidadesInAcademia, ({many}) => ({
	cursosInAcademias: many(cursosInAcademia),
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

export const inscripcionesCursosInAcademiaRelations = relations(inscripcionesCursosInAcademia, ({one}) => ({
	cursosInAcademia: one(cursosInAcademia, {
		fields: [inscripcionesCursosInAcademia.cursoId],
		references: [cursosInAcademia.idCurso]
	}),
	usuariosInSeguridad: one(usuariosInSeguridad, {
		fields: [inscripcionesCursosInAcademia.usuarioId],
		references: [usuariosInSeguridad.id]
	}),
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