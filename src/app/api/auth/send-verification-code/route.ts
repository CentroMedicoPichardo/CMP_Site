import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import * as React from 'react';
import EmailVerificacion from '@/app/usuarios/visitante/components/emails/EmailVerificacion';
import { otpMemoria } from '@/lib/otpStore';

// IMPORTACIONES DE DRIZZLE (Para verificar existencia)
import { db } from '@/lib/db'; 
import { usuarios } from '@/lib/schema/index'; 
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const { correo, nombre } = await req.json();

    if (!correo) {
        return NextResponse.json({ message: "El correo es obligatorio" }, { status: 400 });
    }
    
    // 1. FORZAR MINÚSCULAS
    const emailNormalizado = correo.trim().toLowerCase(); 

    // --- NUEVO PASO: VERIFICAR SI YA EXISTE EN LA BD ---
    const usuariosExistentes = await db
        .select()
        .from(usuarios)
        .where(eq(usuarios.correo, emailNormalizado));

    if (usuariosExistentes.length > 0) {
        // Retornamos 409 Conflict para que el Frontend sepa que ya existe
        // y NO enviamos el correo.
        return NextResponse.json(
            { message: "Este correo ya está registrado en el sistema." }, 
            { status: 409 }
        );
    }
    // ---------------------------------------------------

    // 2. Generar código de 6 dígitos
    const codigoGenerado = Math.floor(100000 + Math.random() * 900000).toString();

    // 3. GUARDAR EN MEMORIA
    otpMemoria.set(emailNormalizado, { 
        code: codigoGenerado,
        expires: Date.now() + 10 * 60 * 1000 
    });

    // 4. Renderizar el HTML
    const emailHtml = await render(
      React.createElement(EmailVerificacion, { 
        codigoValidacion: codigoGenerado, 
        nombreUsuario: nombre 
      })
    );

    // 5. Configurar Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS },
    });

    // 6. Enviar
    await transporter.sendMail({
      from: '"Centro Médico Pichardo" <tucorreo@gmail.com>',
      to: correo,
      subject: `Código de verificación: ${codigoGenerado}`,
      html: emailHtml,
    });

    return NextResponse.json({ message: "Código enviado correctamente" });

  } catch (error) {
    console.error("Error enviando correo:", error);
    return NextResponse.json({ message: "Error interno al enviar correo" }, { status: 500 });
  }
}