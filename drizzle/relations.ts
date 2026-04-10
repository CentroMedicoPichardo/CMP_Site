import { relations } from "drizzle-orm/relations";
import { medicosInClinica, academiaInfantilInAcademia, publicacionesInAcademia, rolesInSeguridad, usuariosInSeguridad, instructoresInAcademia, cursosInAcademia, categoriasCursosInAcademia, ubicacionesCursosInAcademia, modalidadesInAcademia, inscripcionesCursosInAcademia, contenidoSaberPediatricoInAcademia, encuestasInAcademia, respuestasEncuestasInAcademia } from "./schema";

export const academiaInfantilInAcademiaRelations = relations(academiaInfantilInAcademia, ({one}) => ({
	medicosInClinica: one(medicosInClinica, {
		fields: [academiaInfantilInAcademia.idAutor],
		references: [medicosInClinica.idMedico]
	}),
}));

export const medicosInClinicaRelations = relations(medicosInClinica, ({many}) => ({
	academiaInfantilInAcademias: many(academiaInfantilInAcademia),
	publicacionesInAcademias: many(publicacionesInAcademia),
}));

export const publicacionesInAcademiaRelations = relations(publicacionesInAcademia, ({one}) => ({
	medicosInClinica: one(medicosInClinica, {
		fields: [publicacionesInAcademia.idAutor],
		references: [medicosInClinica.idMedico]
	}),
}));

export const usuariosInSeguridadRelations = relations(usuariosInSeguridad, ({one, many}) => ({
	rolesInSeguridad: one(rolesInSeguridad, {
		fields: [usuariosInSeguridad.rolId],
		references: [rolesInSeguridad.id]
	}),
	inscripcionesCursosInAcademias: many(inscripcionesCursosInAcademia),
	respuestasEncuestasInAcademias: many(respuestasEncuestasInAcademia),
}));

export const rolesInSeguridadRelations = relations(rolesInSeguridad, ({many}) => ({
	usuariosInSeguridads: many(usuariosInSeguridad),
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

export const encuestasInAcademiaRelations = relations(encuestasInAcademia, ({one, many}) => ({
	contenidoSaberPediatricoInAcademia: one(contenidoSaberPediatricoInAcademia, {
		fields: [encuestasInAcademia.contenidoId],
		references: [contenidoSaberPediatricoInAcademia.id]
	}),
	respuestasEncuestasInAcademias: many(respuestasEncuestasInAcademia),
}));

export const contenidoSaberPediatricoInAcademiaRelations = relations(contenidoSaberPediatricoInAcademia, ({many}) => ({
	encuestasInAcademias: many(encuestasInAcademia),
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