// La fecha de acceso procede de PostgreSQL, no del dispositivo.
export const MATERIALS_TIME_ZONE = "America/Mexico_City";
export const ESTADOS_INSCRIPCION_VIGENTES = ["activo", "Activo", "confirmada", "Confirmada"] as const;
export type EstadoMateriales = "no_iniciado" | "finalizado" | "sin_materiales" | "disponible";

export function normalizarCarpetaDrive(value: unknown): string | null {
  if (typeof value !== "string" || value.length > 2048) return null;
  const raw = value.trim();
  if (!/^https:\/\//i.test(raw) || /[\s\\]/.test(raw) || Array.from(raw).some(char => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127)) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" || url.hostname !== "drive.google.com" || url.port || url.username || url.password || url.hash ||
        !/^\/drive\/(?:u\/\d+\/)?folders\/[A-Za-z0-9_-]+\/?$/.test(url.pathname)) return null;
    const seen = new Set<string>();
    for (const [key, item] of url.searchParams) {
      if (seen.has(key) || !["usp", "resourcekey"].includes(key) || !/^[A-Za-z0-9_-]{1,256}$/.test(item)) return null;
      seen.add(key);
    }
    return url.toString();
  } catch { return null; }
}

export function estadoMateriales(fechaInicio: string, fechaFin: string, hoy: string, enlace: unknown):
  {estado: EstadoMateriales; url?: string} {
  if (![fechaInicio, fechaFin, hoy].every(value => /^\d{4}-\d{2}-\d{2}$/.test(value)) || fechaFin < fechaInicio) {
    throw new Error("Fechas de materiales no verificables");
  }
  if (hoy < fechaInicio) return {estado: "no_iniciado"};
  if (hoy > fechaFin) return {estado: "finalizado"};
  const url = normalizarCarpetaDrive(enlace);
  return url ? {estado: "disponible", url} : {estado: "sin_materiales"};
}
