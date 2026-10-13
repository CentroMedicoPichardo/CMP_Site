
import { createHash, randomBytes } from "node:crypto";
import { and, eq, isNull, or, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { usuarios } from "@/lib/schema";

const MENSAJE =
    "Si el correo está registrado, recibirás instrucciones para recuperar tu contraseña.";

const DURACION_MINUTOS = 15;

function respuestaGenerica() {
    return NextResponse.json(
        { message: MENSAJE },
        {
            status: 200,
            headers: {
                "Cache-Control": "no-store",
            },
        }
    );
}

export async function POST(request: Request) {
    try {
        const body: unknown = await request.json();

        const datos =
            typeof body === "object" && body !== null
                ? (body as Record<string, unknown>)
                : {};

        const correo =
            typeof datos.correo === "string"
                ? datos.correo.trim().toLowerCase()
                : "";

        if (
            correo.length > 150 ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)
        ) {
            return NextResponse.json(
                { message: "Ingresa un correo electrónico válido." },
                { status: 400 }
            );
        }

        const usuario = await db.query.usuarios.findFirst({
            where: eq(usuarios.correo, correo),
            columns: {
                id: true,
                activo: true,
            },
        });

        // No revelar si una cuenta existe o está desactivada.
        if (!usuario || usuario.activo !== true) {
            return respuestaGenerica();
        }

        // Token criptográficamente aleatorio.
        const token = randomBytes(32).toString("hex");

        // La base de datos conserva solo su huella.
        const tokenHash = createHash("sha256")
            .update(token)
            .digest("hex");

        const vencimiento = new Date(
            Date.now() + DURACION_MINUTOS * 60_000
        ).toISOString();

        // Máximo una solicitud nueva por minuto y cuenta.
        // La condición se verifica de forma atómica.
        const actualizados = await db
            .update(usuarios)
            .set({
                resetToken: tokenHash,
                resetTokenExpiry: vencimiento,
            })
            .where(
                and(
                    eq(usuarios.id, usuario.id),
                    or(
                        isNull(usuarios.resetTokenExpiry),
                        sql`
              ${usuarios.resetTokenExpiry}
              <= (CURRENT_TIMESTAMP AT TIME ZONE 'UTC')
                 + INTERVAL '14 minutes'
            `
                    )
                )
            )
            .returning({ id: usuarios.id });

        if (actualizados.length === 0) {
            return respuestaGenerica();
        }


        const baseUrl =
            process.env.VERCEL_ENV === "preview" &&
                process.env.VERCEL_URL
                ? `https://${process.env.VERCEL_URL}`
                : "https://cmp-site.vercel.app";

        const enlace = new URL(
            "/restablecer-password",
            baseUrl
        );

        enlace.searchParams.set("token", token);


        const resultado = await sendEmail(
            correo,
            "Recuperación de contraseña - Centro Médico Pichardo",
            `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto">
          <h2>Recupera tu contraseña</h2>
          <p>Recibimos una solicitud para restablecer tu contraseña.</p>
          <p>
            <a href="${enlace}">
              Establecer una nueva contraseña
            </a>
          </p>
          <p>Este enlace es válido durante 15 minutos y solo puede utilizarse una vez.</p>
          <p>Si no solicitaste este cambio, ignora el correo.</p>
          <p>Centro Médico Pichardo</p>
        </div>
      `
        );

        if (!resultado.success) {
            // Invalidar el enlace si no pudo enviarse.
            await db
                .update(usuarios)
                .set({
                    resetToken: null,
                    resetTokenExpiry: null,
                })
                .where(
                    and(
                        eq(usuarios.id, usuario.id),
                        eq(usuarios.resetToken, tokenHash)
                    )
                );
        }

        return respuestaGenerica();
    } catch (error) {
        console.error(
            "Error al solicitar recuperación de contraseña:",
            error
        );

        return NextResponse.json(
            { message: "No fue posible procesar la solicitud." },
            { status: 500 }
        );
    }
}
