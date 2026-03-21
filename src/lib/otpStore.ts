// Usamos globalThis para que la variable sobreviva a las recargas de Next.js
const globalForOtp = globalThis as unknown as {
    otpMemoria: Map<string, { code: string; expires: number }> | undefined
}

// Si ya existe en el global, la usamos. Si no, creamos una nueva.
export const otpMemoria = globalForOtp.otpMemoria ?? new Map<string, { code: string; expires: number }>();

// En desarrollo, guardamos la referencia en el objeto global para evitar que se borre al guardar cambios
if (process.env.NODE_ENV !== 'production') {
    globalForOtp.otpMemoria = otpMemoria;
}