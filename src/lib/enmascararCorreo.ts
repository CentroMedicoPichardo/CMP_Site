
// Enmascara un correo para los logs: "juan@gmail.com" -> "j***@gmail.com".
// Valores sin "@" (por ejemplo "sistema") se devuelven tal cual.
export function enmascararCorreo(correo: unknown): string {
  if (typeof correo !== "string" || correo.length === 0) {
    return "(vacío)";
  }

  const arroba = correo.lastIndexOf("@");

  if (arroba <= 0) {
    return correo.includes("@") ? "***" : correo;
  }

  return `${correo[0]}***${correo.slice(arroba)}`;
}
