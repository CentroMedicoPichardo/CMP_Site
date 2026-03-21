import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import * as jose from 'jose';
import { db } from '@/lib/db';
import { usuarios } from '@/lib/schema/index';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    // 1. LEER COOKIE AUTOMÁTICAMENTE
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'No hay sesión activa' }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secreto_local');

    // 2. Verificar integridad
    let payload;
    try {
      const { payload: decoded } = await jose.jwtVerify(token, secret);
      payload = decoded;
    } catch (err) {
      return NextResponse.json({ message: 'Token inválido' }, { status: 401 });
    }

    // 3. Verificar versión en BD (Revocación)
    const usuario = await db.query.usuarios.findFirst({
        where: eq(usuarios.id, Number(payload.id)),
        columns: { id: true, versionToken: true, bloqueadoHasta: true }
    });

    if (!usuario || usuario.versionToken !== payload.version) {
        return NextResponse.json({ message: 'Sesión revocada' }, { status: 401 });
    }

    return NextResponse.json({ ok: true }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: 'Error interno' }, { status: 500 });
  }
}