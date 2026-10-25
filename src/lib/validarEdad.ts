
// Edad de la cuenta de usuario (titular) al registrarse.
// No aplica a academia.participantes: los participantes de un
// curso registrados por el titular sí pueden ser menores de edad.
export const EDAD_MINIMA_REGISTRO = 18;
export const EDAD_MAXIMA_REGISTRO = 120;

export const MENSAJE_EDAD_MINIMA =
  "Debes ser mayor de edad (18 años cumplidos) para registrar una cuenta.";

export type ResultadoEdadRegistro =
  | { valida: true; edad: number }
  | { valida: false; motivo: "invalida" | "menor_de_edad" };

// Solo se aceptan números y strings numéricos decimales
// ("18", " 18 ", "-1"); cualquier otro tipo (null, booleanos,
// arreglos, objetos) o texto como "abc", "0x12" o "1e1" es
// inválido y no se coerciona a número.
const STRING_NUMERICO = /^[+-]?\d+(\.\d+)?$/;

function aNumero(valor: unknown): number {
  if (typeof valor === "number") {
    return valor;
  }

  if (
    typeof valor === "string" &&
    STRING_NUMERICO.test(valor.trim())
  ) {
    return Number(valor.trim());
  }

  return Number.NaN;
}

// "invalida": tipo no numérico, ausente, no entera o mayor al máximo.
// "menor_de_edad": entera pero menor a EDAD_MINIMA_REGISTRO.
export function validarEdadRegistro(
  valor: unknown
): ResultadoEdadRegistro {
  const edad = aNumero(valor);

  if (
    !Number.isInteger(edad) ||
    edad > EDAD_MAXIMA_REGISTRO
  ) {
    return { valida: false, motivo: "invalida" };
  }

  if (edad < EDAD_MINIMA_REGISTRO) {
    return { valida: false, motivo: "menor_de_edad" };
  }

  return { valida: true, edad };
}
