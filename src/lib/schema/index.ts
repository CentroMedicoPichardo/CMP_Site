// src/lib/schema/index.ts

// Importa todo desde el schema generado
import * as generatedSchema from './schema';
// Importa las relaciones generadas
import * as generatedRelations from './relations';

// Re-exporta las tablas
export const medicos = generatedSchema.medicosInClinica;
export const servicios = generatedSchema.serviciosInClinica;
export const nosotros = generatedSchema.nosotrosInClinica;

export const cursos = generatedSchema.cursosInAcademia;
export const publicaciones = generatedSchema.publicacionesInAcademia;
export const academiaInfantil = generatedSchema.academiaInfantilInAcademia;

export const usuarios = generatedSchema.usuariosInSeguridad;
export const roles = generatedSchema.rolesInSeguridad;

export const backups = generatedSchema.backupsInAuditoria;
export const intentosRecuperacion = generatedSchema.intentosRecuperacionInAuditoria;

// ✅ IMPORTAR LAS RELACIONES GENERADAS
export const usuariosRelations = generatedRelations.usuariosInSeguridadRelations;
export const rolesRelations = generatedRelations.rolesInSeguridadRelations;
export const medicosRelations = generatedRelations.medicosInClinicaRelations;
export const cursosRelations = generatedRelations.cursosInAcademiaRelations;
export const publicacionesRelations = generatedRelations.publicacionesInAcademiaRelations;
export const academiaInfantilRelations = generatedRelations.academiaInfantilInAcademiaRelations;

// Opcional: exporta todo lo demás si lo necesitas
export * from './schema';
export * from './relations';