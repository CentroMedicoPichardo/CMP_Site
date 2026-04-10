// src/lib/schema/index.ts

// Importa todo desde el schema generado
import * as generatedSchema from './schema';
import * as generatedRelations from './relations';

// ========== CLINICA ==========
export const medicos = generatedSchema.medicosInClinica;
export const servicios = generatedSchema.serviciosInClinica;
export const nosotros = generatedSchema.nosotrosInClinica;
export const empresaInfo = generatedSchema.empresaInfoInClinica;

// ========== ACADEMIA ==========
// Tablas principales
export const cursos = generatedSchema.cursosInAcademia;
export const instructores = generatedSchema.instructoresInAcademia;
export const categoriasCursos = generatedSchema.categoriasCursosInAcademia;
export const ubicacionesCursos = generatedSchema.ubicacionesCursosInAcademia;
export const modalidades = generatedSchema.modalidadesInAcademia;
export const inscripcionesCursos = generatedSchema.inscripcionesCursosInAcademia;

// Contenido educativo
export const publicaciones = generatedSchema.publicacionesInAcademia;
export const academiaInfantil = generatedSchema.academiaInfantilInAcademia;
export const contenidoSaberPediatrico = generatedSchema.contenidoSaberPediatricoInAcademia;
export const encuestas = generatedSchema.encuestasInAcademia;
export const respuestasEncuestas = generatedSchema.respuestasEncuestasInAcademia;

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

// ========== RELACIONES ==========
export const usuariosRelations = generatedRelations.usuariosInSeguridadRelations;
export const rolesRelations = generatedRelations.rolesInSeguridadRelations;
export const medicosRelations = generatedRelations.medicosInClinicaRelations;
export const cursosRelations = generatedRelations.cursosInAcademiaRelations;
export const instructoresRelations = generatedRelations.instructoresInAcademiaRelations;
export const categoriasCursosRelations = generatedRelations.categoriasCursosInAcademiaRelations;
export const ubicacionesCursosRelations = generatedRelations.ubicacionesCursosInAcademiaRelations;
export const modalidadesRelations = generatedRelations.modalidadesInAcademiaRelations;
export const inscripcionesCursosRelations = generatedRelations.inscripcionesCursosInAcademiaRelations;
export const publicacionesRelations = generatedRelations.publicacionesInAcademiaRelations;
export const academiaInfantilRelations = generatedRelations.academiaInfantilInAcademiaRelations;

// Exportar todo lo demás
export * from './schema';
export * from './relations';