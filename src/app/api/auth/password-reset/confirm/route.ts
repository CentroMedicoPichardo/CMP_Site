
import { createHash } from "node:crypto";
import bcrypt from "bcryptjs";
import { and, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { usuarios } from "@/lib/schema";

const ERROR_ENLACE =
  "El enlace es inválido, expiró o ya fue utilizado. Solicita uno nuevo.";

function validarContrasena(valor: string): string | null {
  if (valor.length < 8 || Buffer.byteLength(valor, "utf8") > 72) {
    return "La contraseña debe tener al menos 8 caracteres y no superar 72 bytes.";
  }

  if (
    !/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/.test(
      valor
    )
  ) {
    return "La contraseña debe contener letras, números y un símbolo.";
  }

  const secuencias = [
    "123", "234", "345", "456", "789", "abc", "qwe",
  ];

  if (
    secuencias.some((secuencia) =>
      valor.toLowerCase().includes(secuencia)
    )
  ) {
    return "La contraseña contiene una secuencia insegura.";
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { message: "Solicitud inválida." },
        { status: 400 }
      );
    }

    const datos = body as Record<string, unknown>;

    const token =
      typeof datos.token === "string"
        ? datos.token.trim()
        : "";

    const contrasena =
      typeof datos.contrasena === "string"
        ? datos.contrasena
        : "";

    const confirmarContrasena =
      typeof datos.confirmarContrasena === "string"
        ? datos.confirmarContrasena
        : "";

    if (!/^[a-f0-9]{64}$/.test(token)) {
      return NextResponse.json(
        { message: ERROR_ENLACE },
        { status: 400 }
      );
    }

    if (contrasena !== confirmarContrasena) {
      return NextResponse.json(
        { message: "Las contraseñas no coinciden." },
        { status: 400 }
      );
    }

    const errorContrasena = validarContrasena(contrasena);

    if (errorContrasena) {
      return NextResponse.json(
        { message: errorContrasena },
        { status: 400 }
      );
    }

    const tokenHash = createHash("sha256")
      .update(token)
      .digest("hex");

    const condicionToken = and(
      eq(usuarios.resetToken, tokenHash),
      eq(usuarios.activo, true),
      sql`
        ${usuarios.resetTokenExpiry} >
        (CURRENT_TIMESTAMP AT TIME ZONE 'UTC')
      `
    );

    // Comprobar el token antes de calcular bcrypt.
    const encontrados = await db
      .select({ id: usuarios.id })
      .from(usuarios)
      .where(condicionToken)
      .limit(1);

    if (encontrados.length === 0) {
      return NextResponse.json(
        { message: ERROR_ENLACE },
        { status: 400 }
      );
    }

    const nuevaContrasenaHash = await bcrypt.hash(
      contrasena,
      12
    );

    // Actualización atómica: impide reutilizar el mismo token.
    const actualizados = await db
      .update(usuarios)
      .set({
        contrasena: nuevaContrasenaHash,
        resetToken: null,
        resetTokenExpiry: null,
        intentosFallidos: 0,
        bloqueadoHasta: null,
        versionToken: sql`
          COALESCE(${usuarios.versionToken}, 1) + 1
        `,
      })
      .where(
        and(
          eq(usuarios.id, encontrados[0].id),
          condicionToken
        )
      )
      .returning({ id: usuarios.id });

    if (actualizados.length === 0) {
      return NextResponse.json(
        { message: ERROR_ENLACE },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message:
          "Contraseña actualizada correctamente. Ya puedes iniciar sesión.",
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error(
      "Error al confirmar recuperación:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Ocurrió un error al restablecer la contraseña.",
      },
      { status: 500 }
    );
  }
}
