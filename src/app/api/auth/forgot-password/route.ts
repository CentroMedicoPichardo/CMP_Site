import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { usuarios, intentosRecuperacion } from '@/lib/schema/index';
import { eq, and, gt } from 'drizzle-orm';
import crypto from 'crypto';
import nodemailer from 'nodemailer'; // O Resend, lo que uses
import { render } from '@react-email/render';
import React from 'react';
// Asumiendo que crearás un componente de email para esto
import EmailRecuperacion from '@/app/usuarios/visitante/components/emails/EmailRecuperacion'; 

export async function POST(req: Request) {
  try {
    const { correo } = await req.json();
    
    // Obtenemos IP para el rate limit (o usamos el correo como identificador)
    // En Next.js local a veces la IP es dificil de sacar, usaremos el correo como llave de bloqueo
    const identificador = correo.trim().toLowerCase();

    // --- 1. VERIFICAR RATE LIMIT (Límite de Intentos) ---
    const registroIntentos = await db
      .select()
      .from(intentosRecuperacion)
      .where(eq(intentosRecuperacion.identificador, identificador));

    const ahora = new Date();
    let intentoActual = registroIntentos[0];

    // Si está bloqueado y aún no pasa el tiempo
    if (intentoActual?.bloqueadoHasta && intentoActual.bloqueadoHasta > ahora) {
       // OJO: Aquí sí podrías decir "Demasiados intentos", es seguridad de la plataforma, no del usuario.
       return NextResponse.json(
         { message: "Demasiados intentos. Por favor espera 3 horas antes de volver a intentar." },
         { status: 429 } 
       );
    }

    // Lógica de conteo
    if (!intentoActual) {
        // Primer intento ever
        await db.insert(intentosRecuperacion).values({
            identificador,
            conteo: 1,
            ultimoIntento: ahora
        });
    } else {
        // Ya existe registro
        // Si ya pasaron 3 horas desde el bloqueo previo, reseteamos
        if (intentoActual.bloqueadoHasta && intentoActual.bloqueadoHasta <= ahora) {
             await db.update(intentosRecuperacion)
                .set({ conteo: 1, bloqueadoHasta: null, ultimoIntento: ahora })
                .where(eq(intentosRecuperacion.identificador, identificador));
        } else {
            // Sumamos intento
            const nuevoConteo = (intentoActual.conteo || 0) + 1;
            
            // Si llega a 3, bloqueamos 3 horas
            let bloquearHasta = null;
            if (nuevoConteo >= 3) {
                bloquearHasta = new Date(ahora.getTime() + 3 * 60 * 60 * 1000); // +3 horas
            }

            await db.update(intentosRecuperacion)
                .set({ 
                    conteo: nuevoConteo, 
                    ultimoIntento: ahora,
                    bloqueadoHasta: bloquearHasta
                })
                .where(eq(intentosRecuperacion.identificador, identificador));

            if (nuevoConteo > 3) {
                 return NextResponse.json(
                    { message: "Demasiados intentos. Intenta más tarde." },
                    { status: 429 }
                );
            }
        }
    }

    // --- 2. BUSCAR USUARIO (Silenciosamente) ---
    const usuarioEncontrado = await db
        .select()
        .from(usuarios)
        .where(eq(usuarios.correo, identificador));

    // Si NO existe, NO hacemos nada, pero respondemos ÉXITO para despistar
    if (usuarioEncontrado.length === 0) {
        // Simulamos un pequeño delay para que no sea obvio por el tiempo de respuesta
        await new Promise(resolve => setTimeout(resolve, 1000));
        return NextResponse.json({ message: "Si el correo existe, se enviaron las instrucciones." });
    }

    // --- 3. GENERAR TOKEN Y ENVIAR ---
    const usuario = usuarioEncontrado[0];
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos de vida

    // Guardar token en BD
    await db.update(usuarios)
        .set({ resetToken, resetTokenExpiry })
        .where(eq(usuarios.id, usuario.id));

    // Generar enlace
    // Asegúrate de tener NEXT_PUBLIC_BASE_URL en tu .env (ej: http://localhost:3000)
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/usuarios/visitante/screens/RestablecerPassword?token=${resetToken}`;

    // Renderizar Email
    const emailHtml = await render(
        React.createElement(EmailRecuperacion, { url: resetUrl, nombre: usuario.nombre })
    );

    // Enviar Email
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS },
    });

    await transporter.sendMail({
        from: '"Centro Médico Pichardo" <seguridad@cmp.com>',
        to: identificador,
        subject: 'Recuperación de Contraseña',
        html: emailHtml,
    });

    return NextResponse.json({ message: "Si el correo existe, se enviaron las instrucciones." });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error interno" }, { status: 500 });
  }
}