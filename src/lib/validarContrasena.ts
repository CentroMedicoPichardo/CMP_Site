
// Política de contraseñas compartida por la recuperación
// por correo y el cambio de contraseña autenticado.
// Devuelve el mensaje de error, o null si es válida.
export function validarContrasena(valor: string): string | null {
  if (valor.length < 8 || Buffer.byteLength(valor, "utf8") > 72) {
    return "La contraseña debe tener al menos 8 caracteres y no superar 72 bytes.";
  }

  if (
    !/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/.test(
      valor
    )
  ) {
    return "La contraseña debe contener letras, números y un símbolo.";
  }

  const secuencias = [
    "123", "234", "345", "456", "789", "abc", "qwe",
  ];

  if (
    secuencias.some((secuencia) =>
      valor.toLowerCase().includes(secuencia)
    )
  ) {
    return "La contraseña contiene una secuencia insegura.";
  }

  return null;
}
