
// src/app/api/auth/mobile/login/route.ts

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { usuarios, roles } from "@/lib/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { normalizeRole } from "@/lib/auth";

const MAX_INTENTOS_FALLIDOS = 5;
const TIEMPO_BLOQUEO_MINUTOS = 15;

const ACCESS_TOKEN_EXPIRATION = "15m";
const REFRESH_TOKEN_EXPIRATION = "30d";

const ACCESS_TOKEN_SECONDS = 60 * 15;
const REFRESH_TOKEN_SECONDS =
  60 * 60 * 24 * 30;

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error(
      "JWT_SECRET no está configurado"
    );
  }

  return new TextEncoder().encode(
    secret
  );
}

export async function POST(
  request: NextRequest
) {
  try {
    const body =
      await request.json();

    const correo =
      typeof body.correo === "string"
        ? body.correo
            .trim()
            .toLowerCase()
        : "";

    const contrasena =
      typeof body.contrasena === "string"
        ? body.contrasena
        : "";

    if (
      !correo ||
      !contrasena
    ) {
      return NextResponse.json(
        {
          message:
            "Correo y contraseña son requeridos",
        },
        {
          status: 400,
        }
      );
    }

    const usuario =
      await db.query.usuarios.findFirst({
        where: eq(
          usuarios.correo,
          correo
        ),
      });

    if (!usuario) {
      return NextResponse.json(
        {
          message:
            "Credenciales incorrectas",
        },
        {
          status: 401,
        }
      );
    }

    // A17: rechazar cuentas desactivadas antes
    // de cualquier modificación de bloqueo.
    if (!usuario.activo) {
      return NextResponse.json(
        {
          message:
            "Usuario desactivado. Contacta al administrador",
        },
        {
          status: 403,
        }
      );
    }

    const rolUsuario =
      await db.query.roles.findFirst({
        where: eq(
          roles.id,
          usuario.rolId
        ),
      });

    const nombreRol =
      normalizeRole(
        rolUsuario?.nombre
      );

    if (
      usuario.bloqueadoHasta
    ) {
      const fechaBloqueo =
        new Date(
          usuario.bloqueadoHasta
        );

      const ahora =
        new Date();

      if (
        fechaBloqueo >
        ahora
      ) {
        const minutosRestantes =
          Math.ceil(
            (
              fechaBloqueo.getTime() -
              ahora.getTime()
            ) /
              (1000 * 60)
          );

        return NextResponse.json(
          {
            message:
              `Cuenta bloqueada. Intenta nuevamente en ${minutosRestantes} minutos`,
            bloqueado: true,
          },
          {
            status: 423,
          }
        );
      }

      await db
        .update(usuarios)
        .set({
          intentosFallidos: 0,
          bloqueadoHasta: null,
        })
        .where(
          eq(
            usuarios.id,
            usuario.id
          )
        );
    }

    const contrasenaValida =
      await bcrypt.compare(
        contrasena,
        usuario.contrasena
      );

    if (!contrasenaValida) {
      const nuevosIntentos =
        Number(
          usuario.intentosFallidos ??
            0
        ) + 1;

      if (
        nuevosIntentos >=
        MAX_INTENTOS_FALLIDOS
      ) {
        const fechaBloqueo =
          new Date();

        fechaBloqueo.setMinutes(
          fechaBloqueo.getMinutes() +
            TIEMPO_BLOQUEO_MINUTOS
        );

        await db
          .update(usuarios)
          .set({
            intentosFallidos:
              nuevosIntentos,
            bloqueadoHasta:
              fechaBloqueo.toISOString(),
          })
          .where(
            eq(
              usuarios.id,
              usuario.id
            )
          );

        return NextResponse.json(
          {
            message:
              `Demasiados intentos fallidos. Cuenta bloqueada por ${TIEMPO_BLOQUEO_MINUTOS} minutos`,
            bloqueado: true,
          },
          {
            status: 423,
          }
        );
      }

      await db
        .update(usuarios)
        .set({
          intentosFallidos:
            nuevosIntentos,
        })
        .where(
          eq(
            usuarios.id,
            usuario.id
          )
        );

      const intentosRestantes =
        MAX_INTENTOS_FALLIDOS -
        nuevosIntentos;

      return NextResponse.json(
        {
          message:
            `Credenciales incorrectas. Te quedan ${intentosRestantes} intentos`,
        },
        {
          status: 401,
        }
      );
    }

    await db
      .update(usuarios)
      .set({
        intentosFallidos: 0,
        bloqueadoHasta: null,
      })
      .where(
        eq(
          usuarios.id,
          usuario.id
        )
      );

    if (
      usuario.mfaHabilitado
    ) {
      return NextResponse.json(
        {
          message:
            "Autenticación de dos factores requerida",
          requireMfa: true,
          email:
            usuario.correo,
        },
        {
          status: 403,
        }
      );
    }

    const versionToken =
      Number(
        usuario.versionToken ??
          1
      );

    const commonPayload = {
      id: usuario.id,
      userId: usuario.id,
      email:
        usuario.correo,
      nombre:
        usuario.nombre,
      rol: nombreRol,
      version:
        versionToken,
    };

    const accessToken =
      await new SignJWT({
        ...commonPayload,
        tokenUse: "access",
      })
        .setProtectedHeader({
          alg: "HS256",
        })
        .setIssuedAt()
        .setExpirationTime(
          ACCESS_TOKEN_EXPIRATION
        )
        .sign(
          getJwtSecret()
        );

    const refreshToken =
      await new SignJWT({
        ...commonPayload,
        tokenUse: "refresh",
      })
        .setProtectedHeader({
          alg: "HS256",
        })
        .setIssuedAt()
        .setExpirationTime(
          REFRESH_TOKEN_EXPIRATION
        )
        .sign(
          getJwtSecret()
        );

    const usuarioResponse = {
      id: usuario.id,
      nombre:
        usuario.nombre,
      apellidoPaterno:
        usuario.apellidoPaterno,
      apellidoMaterno:
        usuario.apellidoMaterno,
      nombreCompleto: [
        usuario.nombre,
        usuario.apellidoPaterno,
        usuario.apellidoMaterno,
      ]
        .filter(Boolean)
        .join(" "),
      correo:
        usuario.correo,
      email:
        usuario.correo,
      rol: nombreRol,
    };

    return NextResponse.json(
      {
        message:
          "Login móvil exitoso",

        usuario:
          usuarioResponse,

        accessToken,

        refreshToken,

        tokenType:
          "Bearer",

        expiresIn:
          ACCESS_TOKEN_SECONDS,

        refreshExpiresIn:
          REFRESH_TOKEN_SECONDS,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Error en login móvil:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Error interno del servidor",
      },
      {
        status: 500,
      }
    );
  }
}
