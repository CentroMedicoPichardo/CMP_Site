// src/lib/db-audit.ts
import { db } from './db';
import { sql } from 'drizzle-orm';

export async function setAuditContext(email: string | null, ip: string) {
  try {
    if (email) {
      // Escapar el email para evitar inyección SQL
      const escapedEmail = email.replace(/'/g, "''");
      await db.execute(sql.raw(`SET LOCAL "app.current_user_email" = '${escapedEmail}'`));
      console.log("✅ Email establecido en sesión:", email);
    }
    if (ip && ip !== '::1' && ip !== '127.0.0.1') {
      // Escapar la IP
      await db.execute(sql.raw(`SET LOCAL "app.current_user_ip" = '${ip}'::INET`));
      console.log("✅ IP establecida en sesión:", ip);
    }
  } catch (error) {
    console.error("❌ Error estableciendo contexto de auditoría:", error);
  }
}

export async function withAudit<T>(
  email: string | null,
  ip: string,
  callback: () => Promise<T>
): Promise<T> {
  try {
    await setAuditContext(email, ip);
    console.log("🔍 Ejecutando callback con contexto de auditoría...");
    const result = await callback();
    console.log("✅ Callback ejecutado correctamente");
    return result;
  } finally {
    try {
      await db.execute(sql.raw(`RESET "app.current_user_email"`));
      await db.execute(sql.raw(`RESET "app.current_user_ip"`));
      console.log("🧹 Variables de sesión limpiadas");
    } catch (error) {
      console.error("❌ Error limpiando variables de sesión:", error);
    }
  }
}

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  if (realIp) {
    return realIp;
  }
  return '0.0.0.0';
}

export async function getCurrentUserEmail() {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('user')?.value;
  
  if (!userCookie) return null;
  
  try {
    const user = JSON.parse(decodeURIComponent(userCookie));
    console.log("📧 Email desde cookie:", user.correo);
    return user.correo || null;
  } catch (error) {
    console.error("❌ Error parseando cookie de usuario:", error);
    return null;
  }
}