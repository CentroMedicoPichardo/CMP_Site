// src/lib/otpStore.ts
export interface OtpData {
  code: string;
  expires: number; // timestamp en milisegundos
  intentos: number;
}

// Almacenamiento en memoria para OTPs (en producción usar Redis o base de datos)
export const otpMemoria = new Map<string, OtpData>();

// Función para limpiar OTPs expirados cada 5 minutos (opcional)
setInterval(() => {
  const ahora = Date.now();
  for (const [email, data] of otpMemoria.entries()) {
    if (ahora > data.expires) {
      otpMemoria.delete(email);
    }
  }
}, 5 * 60 * 1000); // Cada 5 minutos

// Función para generar código de 6 dígitos
export function generarCodigoOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Función para guardar OTP
export function guardarOTP(email: string, codigo: string, minutosValidez: number = 10): void {
  otpMemoria.set(email, {
    code: codigo,
    expires: Date.now() + minutosValidez * 60 * 1000,
    intentos: 0
  });
}

// Función para verificar OTP
export function verificarOTP(email: string, codigo: string): { valido: boolean; mensaje: string } {
  const registro = otpMemoria.get(email);
  
  if (!registro) {
    return { valido: false, mensaje: "El código no existe. Solicita uno nuevo." };
  }
  
  if (Date.now() > registro.expires) {
    otpMemoria.delete(email);
    return { valido: false, mensaje: "El código ha expirado." };
  }
  
  if (registro.code !== codigo) {
    registro.intentos++;
    otpMemoria.set(email, registro);
    
    const intentosRestantes = 5 - registro.intentos;
    if (registro.intentos >= 5) {
      otpMemoria.delete(email);
      return { valido: false, mensaje: "Demasiados intentos. Solicita un nuevo código." };
    }
    
    return { valido: false, mensaje: `Código incorrecto. Te quedan ${intentosRestantes} intentos.` };
  }
  
  // Código válido - limpiar
  otpMemoria.delete(email);
  return { valido: true, mensaje: "Código verificado correctamente." };
}