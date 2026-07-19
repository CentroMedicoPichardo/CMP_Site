export type TipoBackup = "completo" | "parcial";

export interface TablaBackup {
  esquema: string;
  tabla: string;
}

const ESQUEMAS_APLICACION = new Set([
  "academia",
  "analitica",
  "auditoria",
  "clinica",
  "seguridad",
  "soporte",
]);

/**
 * Estas tablas nunca se guardan, ni siquiera
 * en el respaldo completo.
 */
const TABLAS_EXCLUIDAS_SIEMPRE = new Set([
  "auditoria.backups",
]);

/**
 * Esquemas completos que se omiten en el
 * respaldo parcial.
 */
const ESQUEMAS_EXCLUIDOS_PARCIAL = new Set([
  "analitica",
  "auditoria",
]);

/**
 * Tablas individuales omitidas únicamente
 * en el respaldo parcial.
 */
const TABLAS_EXCLUIDAS_PARCIAL = new Set([
  "seguridad.alertas_seguridad",
  "seguridad.auditoria_acciones",
  "seguridad.cambios_estructura",
  "seguridad.estadisticas_consumo",
  "seguridad.monitoreo_rendimiento",
]);

export function esTipoBackupValido(
  tipo: unknown
): tipo is TipoBackup {
  return tipo === "completo" || tipo === "parcial";
}

export function obtenerClaveTabla(
  esquema: string,
  tabla: string
) {
  return `${esquema}.${tabla}`;
}

export function esEsquemaPermitido(esquema: string) {
  return ESQUEMAS_APLICACION.has(esquema);
}

export function debeIncluirTabla(
  esquema: string,
  tabla: string,
  tipo: TipoBackup
) {
  if (!esEsquemaPermitido(esquema)) {
    return false;
  }

  const clave = obtenerClaveTabla(esquema, tabla);

  /*
   * auditoria.backups nunca debe incluirse,
   * porque contiene los propios archivos.
   */
  if (TABLAS_EXCLUIDAS_SIEMPRE.has(clave)) {
    return false;
  }

  if (tipo === "completo") {
    return true;
  }

  /*
   * Exclusiones adicionales del respaldo parcial.
   */
  if (ESQUEMAS_EXCLUIDOS_PARCIAL.has(esquema)) {
    return false;
  }

  if (TABLAS_EXCLUIDAS_PARCIAL.has(clave)) {
    return false;
  }

  return true;
}

export function obtenerMotivoExclusion(
  esquema: string,
  tabla: string,
  tipo: TipoBackup
) {
  const clave = obtenerClaveTabla(esquema, tabla);

  if (!esEsquemaPermitido(esquema)) {
    return "El esquema no pertenece a la aplicación";
  }

  if (TABLAS_EXCLUIDAS_SIEMPRE.has(clave)) {
    return "La tabla de respaldos no puede incluirse dentro de sí misma";
  }

  if (
    tipo === "parcial" &&
    ESQUEMAS_EXCLUIDOS_PARCIAL.has(esquema)
  ) {
    return `El esquema ${esquema} está excluido del respaldo parcial`;
  }

  if (
    tipo === "parcial" &&
    TABLAS_EXCLUIDAS_PARCIAL.has(clave)
  ) {
    return "La tabla contiene información operativa, auditoría o monitoreo";
  }

  return null;
}