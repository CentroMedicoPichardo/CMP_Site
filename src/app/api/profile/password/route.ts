
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { and, eq, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import { usuarios } from "@/lib/schema";
import { requireApiAuth } from "@/lib/auth";
import { validarContrasena } from "@/lib/validarContrasena";

function responder(
  data: unknown,
  status = 200
) {
  return NextResponse.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

// Cambio de contraseña con sesión activa.
// Sin bloqueo por intentos fallidos: no usa
// intentosFallidos ni bloqueadoHasta.
// Al subir versionToken se invalidan todos los JWT
// emitidos antes, incluido el de la sesión actual:
// el cliente debe volver a iniciar sesión.
export async function PUT(
  request: Request
) {
  const { session, error } =
    await requireApiAuth();

  if (!session) {
    return error ?? responder(
      { message: "No autenticado" },
      401
    );
  }

  const payload: unknown =
    await request.json().catch(() => null);

  if (
    !payload ||
    typeof payload !== "object" ||
    Array.isArray(payload)
  ) {
    return responder(
      { message: "Datos inválidos" },
      400
    );
  }

  const {
    contrasenaActual,
    contrasenaNueva,
    confirmarContrasenaNueva,
  } = payload as Record<string, unknown>;

  if (
    typeof contrasenaActual !== "string" ||
    typeof contrasenaNueva !== "string" ||
    typeof confirmarContrasenaNueva !== "string" ||
    contrasenaActual.length === 0
  ) {
    return responder(
      {
        message:
          "Debes enviar contrasenaActual, contrasenaNueva y confirmarContrasenaNueva",
      },
      400
    );
  }

  try {
    const resultados = await db
      .select({
        id: usuarios.id,
        contrasena: usuarios.contrasena,
      })
      .from(usuarios)
      .where(
        and(
          eq(usuarios.id, session.user.id),
          eq(usuarios.activo, true)
        )
      )
      .limit(1);

    const usuario = resultados[0];

    if (!usuario) {
      return responder(
        { message: "No autenticado" },
        401
      );
    }

    const actualValida = await bcrypt.compare(
      contrasenaActual,
      usuario.contrasena
    );

    if (!actualValida) {
      return responder(
        {
          message:
            "La contraseña actual no es correcta.",
        },
        401
      );
    }

    if (
      contrasenaNueva !==
      confirmarContrasenaNueva
    ) {
      return responder(
        {
          message:
            "Las contraseñas no coinciden.",
        },
        400
      );
    }

    const errorContrasena =
      validarContrasena(contrasenaNueva);

    if (errorContrasena) {
      return responder(
        { message: errorContrasena },
        400
      );
    }

    if (contrasenaNueva === contrasenaActual) {
      return responder(
        {
          message:
            "La nueva contraseña debe ser diferente de la actual.",
        },
        400
      );
    }

    const nuevoHash = await bcrypt.hash(
      contrasenaNueva,
      12
    );

    // Se exige que el hash siga siendo el verificado:
    // dos cambios simultáneos no pueden ganar ambos.
    const actualizados = await db
      .update(usuarios)
      .set({
        contrasena: nuevoHash,
        versionToken: sql`
          COALESCE(${usuarios.versionToken}, 1) + 1
        `,
      })
      .where(
        and(
          eq(usuarios.id, usuario.id),
          eq(usuarios.contrasena, usuario.contrasena)
        )
      )
      .returning({ id: usuarios.id });

    if (actualizados.length === 0) {
      return responder(
        {
          message:
            "La contraseña cambió mientras se procesaba la solicitud. Inténtalo de nuevo.",
        },
        409
      );
    }

    return responder({
      message:
        "Contraseña actualizada correctamente. Vuelve a iniciar sesión.",
    });
  } catch (error) {
    console.error(
      "Error al cambiar la contraseña:",
      error
    );

    return responder(
      {
        message:
          "No fue posible cambiar la contraseña",
      },
      500
    );
  }
}
