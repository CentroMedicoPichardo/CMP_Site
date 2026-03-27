// src/lib/db-with-user.ts
import { db } from './db';
import { sql } from 'drizzle-orm';

function decodeCookieValue(value: string): string {
  try {
    let decoded = decodeURIComponent(value);
    while (decoded.includes('%')) {
      decoded = decodeURIComponent(decoded);
    }
    return decoded;
  } catch {
    return value;
  }
}

export function getUserEmailFromRequest(request: Request): string {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return 'sistema';
  
  const cookies = Object.fromEntries(
    cookieHeader.split('; ').map(c => {
      const [key, ...rest] = c.split('=');
      return [key, rest.join('=')];
    })
  );
  
  if (cookies.user) {
    try {
      const decodedUser = decodeCookieValue(cookies.user);
      const user = JSON.parse(decodedUser);
      const email = user.correo || user.email || user.mail || null;
      if (email) return email;
    } catch (e) {}
  }
  
  if (cookies.userEmail) {
    return decodeCookieValue(cookies.userEmail);
  }
  
  return 'sistema';
}

/**
 * Ejecuta una función con el correo del usuario establecido
 * Usa una tabla temporal para pasar el contexto
 */
export async function withUserEmail<T>(
  email: string,
  callback: () => Promise<T>
): Promise<T> {
  const userEmail = email && email !== 'sistema' ? email : 'sistema';
  
  try {
    console.log(`🔐 Estableciendo email de usuario en tabla temporal: ${userEmail}`);
    
    // Crear una tabla temporal si no existe (solo una vez)
    await db.execute(sql.raw(`
      CREATE TEMP TABLE IF NOT EXISTS temp_user_context (
        key TEXT PRIMARY KEY,
        value TEXT
      )
    `));
    
    // Guardar el email en la tabla temporal
    await db.execute(sql.raw(`
      INSERT INTO temp_user_context (key, value) 
      VALUES ('current_user_email', '${userEmail.replace(/'/g, "''")}')
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
    `));
    
    const result = await callback();
    
    console.log(`✅ Operación completada con usuario: ${userEmail}`);
    return result;
  } catch (error) {
    console.error(`❌ Error en operación con usuario: ${userEmail}`, error);
    throw error;
  } finally {
    // Limpiar la tabla temporal
    await db.execute(sql.raw(`
      DELETE FROM temp_user_context WHERE key = 'current_user_email'
    `));
    console.log(`🔓 Contexto limpiado`);
  }
}