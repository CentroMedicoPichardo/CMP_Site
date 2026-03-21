import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { usuarios } from '@/lib/schema/index';
import { eq } from 'drizzle-orm';
import { authenticator } from 'otplib';
import qrcode from 'qrcode';

// Simulación de obtener usuario actual (Deberías usar tu lógica real de sesión/JWT aquí)
// Por ahora asumimos que recibimos el correo o ID en el body para probar
export async function POST(req: Request) {
  try {
    const { userId, correo } = await req.json();

    // 1. Generar el secreto único
    const secret = authenticator.generateSecret();

    // 2. Generar la URL especial 'otpauth://' que entienden las apps como Google Auth
    const otpauth = authenticator.keyuri(correo, 'Centro Médico Pichardo', secret);

    // 3. Convertir esa URL en una imagen QR (Data URL en base64)
    const qrCodeUrl = await qrcode.toDataURL(otpauth);

    // 4. GUARDAR EL SECRETO EN LA BD (Pero NO activamos MFA todavía)
    // Es vital guardar el secreto ahora para poder verificarlo en el siguiente paso.
    await db.update(usuarios)
        .set({ 
            secretoMfa: secret,
            mfaHabilitado: false // Aún no está activo hasta que lo verifique
        })
        .where(eq(usuarios.id, userId));

    return NextResponse.json({ qrCodeUrl });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error generando MFA" }, { status: 500 });
  }
}