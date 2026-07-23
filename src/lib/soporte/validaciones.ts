import {
  ESTADOS_PREGUNTA_SET,
  LIMITE_DESCRIPCION_PREGUNTA,
  LIMITE_NOMBRE_CATEGORIA,
  LIMITE_PREGUNTA_FAQ,
  LIMITE_RESPUESTA_AYUDA,
  LIMITE_RESPUESTA_FAQ,
  LIMITE_TITULO_PREGUNTA,
  PRIORIDADES_PREGUNTA_SET,
} from "@/lib/soporte/constantes";
import type { EstadoPregunta, PrioridadPregunta } from "@/types/help";

export function parseIdPositivo(valor: string | number | null | undefined): number | null {
  const numero = Number(valor);
  return Number.isSafeInteger(numero) && numero > 0 ? numero : null;
}

export function parseEnteroNoNegativo(valor: unknown, respaldo = 0): number {
  const numero = Number(valor);
  return Number.isSafeInteger(numero) && numero >= 0 ? numero : respaldo;
}

export function esEstadoPregunta(valor: unknown): valor is EstadoPregunta {
  return ESTADOS_PREGUNTA_SET.has(String(valor ?? "") as EstadoPregunta);
}

export function esPrioridadPregunta(valor: unknown): valor is PrioridadPregunta {
  return PRIORIDADES_PREGUNTA_SET.has(String(valor ?? "") as PrioridadPregunta);
}

function validarTexto(valor: unknown, minimo: number, maximo: number, nombre: string): string | null {
  const texto = String(valor ?? "").trim();
  if (texto.length < minimo) return `${nombre} debe contener al menos ${minimo} caracteres.`;
  if (texto.length > maximo) return `${nombre} no puede exceder ${maximo} caracteres.`;
  return null;
}

export const validarTituloPregunta = (valor: unknown) =>
  validarTexto(valor, 5, LIMITE_TITULO_PREGUNTA, "El título");

export const validarDescripcionPregunta = (valor: unknown) =>
  validarTexto(valor, 10, LIMITE_DESCRIPCION_PREGUNTA, "La descripción");

export const validarContenidoRespuesta = (valor: unknown) =>
  validarTexto(valor, 3, LIMITE_RESPUESTA_AYUDA, "La respuesta");

export const validarPreguntaFaq = (valor: unknown) =>
  validarTexto(valor, 5, LIMITE_PREGUNTA_FAQ, "La pregunta frecuente");

export const validarRespuestaFaq = (valor: unknown) =>
  validarTexto(valor, 3, LIMITE_RESPUESTA_FAQ, "La respuesta de la FAQ");

export const validarNombreCategoria = (valor: unknown) =>
  validarTexto(valor, 2, LIMITE_NOMBRE_CATEGORIA, "El nombre de la categoría");

export function normalizarTags(valor: unknown): string[] | null {
  if (!Array.isArray(valor)) return null;
  const tags = Array.from(new Set(
    valor.map((item) => String(item).trim()).filter(Boolean).map((item) => item.slice(0, 50)),
  )).slice(0, 15);
  return tags.length > 0 ? tags : null;
}
