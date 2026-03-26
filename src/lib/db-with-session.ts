// src/lib/db-with-session.ts
import { db } from './db';
import { sql } from 'drizzle-orm';

/**
 * Establece el correo del usuario en la sesión de PostgreSQL
 */
export async function setSessionUser(email: string | null): Promise<void> {
  if (email) {
    await db.execute(sql`SET LOCAL "app.current_user_email" = ${email}`);
  } else {
    await db.execute(sql`RESET "app.current_user_email"`);
  }
}

/**
 * Establece la IP del cliente en la sesión de PostgreSQL
 */
export async function setSessionIp(ip: string): Promise<void> {
  if (ip && ip !== '::1') {
    await db.execute(sql`SET LOCAL "app.current_user_ip" = ${ip}::INET`);
  }
}

/**
 * Ejecuta una función con el usuario y IP configurados en la sesión
 */
export async function withSession<T>(
  email: string | null,
  ip: string,
  callback: () => Promise<T>
): Promise<T> {
  try {
    await setSessionUser(email);
    await setSessionIp(ip);
    return await callback();
  } finally {
    // Limpiar variables de sesión
    await db.execute(sql`RESET "app.current_user_email"`);
    await db.execute(sql`RESET "app.current_user_ip"`);
  }
}