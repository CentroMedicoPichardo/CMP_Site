import { relations } from "drizzle-orm/relations";
import { medicosInClinica, cursosInAcademia, academiaInfantilInAcademia, publicacionesInAcademia, rolesInSeguridad, usuariosInSeguridad } from "./schema";

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

export const usuariosInSeguridadRelations = relations(usuariosInSeguridad, ({one}) => ({
	rolesInSeguridad: one(rolesInSeguridad, {
		fields: [usuariosInSeguridad.rolId],
		references: [rolesInSeguridad.id]
	}),
}));

export const rolesInSeguridadRelations = relations(rolesInSeguridad, ({many}) => ({
	usuariosInSeguridads: many(usuariosInSeguridad),
}));