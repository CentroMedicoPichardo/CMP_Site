
import { createHash, randomBytes } from "node:crypto";
import { and, eq, isNull, or, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { usuarios } from "@/lib/schema";
import { buildPasswordResetEmail } from "@/lib/email/templates/passwordResetTemplate";

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
    // 1. Leer y validar el correo.
    const body: unknown = await request.json().catch(() => null);

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
        {
          message: "Ingresa un correo electrónico válido.",
        },
        {
          status: 400,
          headers: {
            "Cache-Control": "no-store",
          },
        }
      );
    }

    // 2. Buscar usuario activo.
    const usuario = await db.query.usuarios.findFirst({
      where: eq(usuarios.correo, correo),
      columns: {
        id: true,
        activo: true,
      },
    });

    // No revelar si el correo está registrado.
    if (!usuario || usuario.activo !== true) {
      return respuestaGenerica();
    }

    // 3. Generar token criptográficamente seguro.
    const token = randomBytes(32).toString("hex");

    // Almacenar únicamente el hash del token.
    const tokenHash = createHash("sha256")
      .update(token)
      .digest("hex");

    const vencimiento = new Date(
      Date.now() + DURACION_MINUTOS * 60_000
    ).toISOString();

    // 4. Registrar el token.
    // Evitar solicitudes nuevas durante aproximadamente
    // un minuto después de generar el token anterior.
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
      .returning({
        id: usuarios.id,
      });

    if (actualizados.length === 0) {
      return respuestaGenerica();
    }

    // 5. Determinar la URL del despliegue.
    // En Preview se utiliza la URL de la rama.
    // En producción se utiliza la URL oficial.
    const baseUrl =
      process.env.VERCEL_ENV === "preview" &&
      process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "https://cmp-site.vercel.app";

    // 6. Construir el enlace de recuperación.
    const enlace = new URL(
      "/restablecer-password",
      baseUrl
    );

    enlace.searchParams.set("token", token);

    // 7. Generar correo institucional con
    // la plantilla HTML reutilizable.
    const contenidoCorreo = buildPasswordResetEmail({
      resetUrl: enlace.toString(),
      expirationMinutes: DURACION_MINUTOS,
    });

    // 8. Enviar el correo.
    // sendEmail acepta: destinatario, asunto y HTML.
    const resultado = await sendEmail(
      correo,
      contenidoCorreo.subject,
      contenidoCorreo.html
    );

    // 9. Si falla el envío, invalidar únicamente
    // el token que se generó en esta solicitud.
    if (!resultado.success) {
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

    // 10. Responder siempre con el mismo mensaje.
    return respuestaGenerica();
  } catch (error) {
    console.error(
      "Error al solicitar recuperación de contraseña:",
      error
    );

    return NextResponse.json(
      {
        message: "No fue posible procesar la solicitud.",
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }
}
