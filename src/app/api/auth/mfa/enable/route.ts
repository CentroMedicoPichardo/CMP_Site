import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { usuarios } from '@/lib/schema/index';
import { eq } from 'drizzle-orm';
import { authenticator } from 'otplib';

export async function POST(req: Request) {
  try {
    const { userId, token } = await req.json();

    // 1. Buscar el usuario para obtener el secreto que guardamos antes
    const usuario = await db.query.usuarios.findFirst({
        where: eq(usuarios.id, userId)
    });

    if (!usuario || !usuario.secretoMfa) {
        return NextResponse.json({ message: "Error de configuración. Regenera el QR." }, { status: 400 });
    }

    // 2. VERIFICAR EL CÓDIGO (La magia de OTP)
    const isValid = authenticator.check(token, usuario.secretoMfa);

    if (!isValid) {
        return NextResponse.json({ message: "Código incorrecto. Intenta de nuevo." }, { status: 400 });
    }

    // 3. ACTIVAR OFICIALMENTE
    await db.update(usuarios)
        .set({ mfaHabilitado: true })
        .where(eq(usuarios.id, userId));

    return NextResponse.json({ message: "Autenticación de 2 factores ACTIVADA exitosamente." });

  } catch (error) {
    return NextResponse.json({ message: "Error interno" }, { status: 500 });
  }
}