// src/lib/schema/index.ts

// Importa todo desde el schema generado
import * as generatedSchema from "./schema";
import * as generatedRelations from "./relations";

// ========== CLÍNICA ==========
export const medicos = generatedSchema.medicosInClinica;
export const servicios = generatedSchema.serviciosInClinica;
export const nosotros = generatedSchema.nosotrosInClinica;
export const empresaInfo = generatedSchema.empresaInfoInClinica;

// ========== ACADEMIA ==========
export const cursos = generatedSchema.cursosInAcademia;
export const instructores = generatedSchema.instructoresInAcademia;
export const categoriasCursos = generatedSchema.categoriasCursosInAcademia;
export const ubicacionesCursos = generatedSchema.ubicacionesCursosInAcademia;
export const modalidades = generatedSchema.modalidadesInAcademia;
export const inscripcionesCursos = generatedSchema.inscripcionesCursosInAcademia;

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

// ========== SOPORTE ==========
export const categoriasAyuda = generatedSchema.categoriasAyudaInSoporte;
export const preguntasFrecuentes = generatedSchema.preguntasFrecuentesInSoporte;
export const preguntasUsuarios = generatedSchema.preguntasUsuariosInSoporte;
export const respuestasAyuda = generatedSchema.respuestasAyudaInSoporte;
export const valoracionesFaq = generatedSchema.valoracionesFaqInSoporte;

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

// ========== RELACIONES SOPORTE ==========
export const categoriasAyudaRelations = generatedRelations.categoriasAyudaInSoporteRelations;
export const preguntasFrecuentesRelations = generatedRelations.preguntasFrecuentesInSoporteRelations;
export const preguntasUsuariosRelations = generatedRelations.preguntasUsuariosInSoporteRelations;
export const respuestasAyudaRelations = generatedRelations.respuestasAyudaInSoporteRelations;
export const valoracionesFaqRelations = generatedRelations.valoracionesFaqInSoporteRelations;

// Exportar todo
export * from "./schema";
export * from "./relations";