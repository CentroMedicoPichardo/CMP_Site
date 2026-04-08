import { relations } from "drizzle-orm/relations";
import { medicosInClinica, cursosInAcademia, academiaInfantilInAcademia, publicacionesInAcademia, rolesInSeguridad, usuariosInSeguridad, contenidoSaberPediatricoInAcademia, encuestasInAcademia, respuestasEncuestasInAcademia } from "./schema";

export const cursosInAcademiaRelations = relations(cursosInAcademia, ({one}) => ({
	medicosInClinica: one(medicosInClinica, {
		fields: [cursosInAcademia.idInstructor],
		references: [medicosInClinica.idMedico]
	}),
}));

export const medicosInClinicaRelations = relations(medicosInClinica, ({many}) => ({
	cursosInAcademias: many(cursosInAcademia),
	academiaInfantilInAcademias: many(academiaInfantilInAcademia),
	publicacionesInAcademias: many(publicacionesInAcademia),
}));

export const academiaInfantilInAcademiaRelations = relations(academiaInfantilInAcademia, ({one}) => ({
	medicosInClinica: one(medicosInClinica, {
		fields: [academiaInfantilInAcademia.idAutor],
		references: [medicosInClinica.idMedico]
	}),
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
	respuestasEncuestasInAcademias: many(respuestasEncuestasInAcademia),
}));

export const rolesInSeguridadRelations = relations(rolesInSeguridad, ({many}) => ({
	usuariosInSeguridads: many(usuariosInSeguridad),
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