import type { EstadoPregunta, PrioridadPregunta } from "@/types/help";

export const ESTADOS_PREGUNTA_SET = new Set<EstadoPregunta>([
  "pendiente",
  "respondida",
  "cerrada",
  "convertida_faq",
]);

export const PRIORIDADES_PREGUNTA_SET = new Set<PrioridadPregunta>([
  "baja",
  "normal",
  "alta",
  "urgente",
]);

export const LIMITE_TITULO_PREGUNTA = 300;
export const LIMITE_DESCRIPCION_PREGUNTA = 10_000;
export const LIMITE_RESPUESTA_AYUDA = 10_000;
export const LIMITE_PREGUNTA_FAQ = 500;
export const LIMITE_RESPUESTA_FAQ = 20_000;
export const LIMITE_NOMBRE_CATEGORIA = 100;
