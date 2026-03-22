// src/app/api/auth/send-otp/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { usuariosInSeguridad } from '@/lib/schema/index';
import { eq } from 'drizzle-orm';
import { guardarOTP } from '@/lib/otpStore';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, nombre } = body;

    console.log("📧 POST /api/auth/send-otp recibido:", { email, nombre });

    if (!email) {
      return NextResponse.json({ error: "El email es requerido" }, { status: 400 });
    }

    // Verificar si el email ya está registrado
    const usuarioExistente = await db.select()
      .from(usuariosInSeguridad)
      .where(eq(usuariosInSeguridad.correo, email));
    
    if (usuarioExistente.length > 0) {
      return NextResponse.json({ error: "El correo ya está registrado" }, { status: 409 });
    }

    // Generar código de 6 dígitos
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    
    console.log("🔑 Código generado:", codigo);
    console.log("=========================================");
    console.log(`🔐 CÓDIGO DE VERIFICACIÓN PARA: ${email}`);
    console.log(`📱 CÓDIGO: ${codigo}`);
    console.log("=========================================");
    
    // Guardar en memoria
    guardarOTP(email, codigo, 10);
    
    // Intentar enviar email
    let emailEnviado = false;
    try {
      const nombreCompleto = nombre || "Usuario";
      const emailResult = await sendVerificationEmail(email, nombreCompleto, codigo);
      if (emailResult.success) {
        emailEnviado = true;
        console.log(`✅ Email enviado exitosamente a ${email}`);
      } else {
        console.error(`❌ Falló el envío de email:`, emailResult.error);
      }
    } catch (emailError) {
      console.error("❌ Error al enviar email:", emailError);
    }

    return NextResponse.json({
      success: true,
      message: emailEnviado 
        ? "Código de verificación enviado a tu correo" 
        : "Código generado (revisa la consola, el email no se pudo enviar)",
      email: email,
      emailEnviado: emailEnviado
    }, { status: 200 });

  } catch (error: any) {
    console.error("❌ Error enviando OTP:", error);
    return NextResponse.json(
      { error: error.message || "Error al enviar código" },
      { status: 500 }
    );
  }
}