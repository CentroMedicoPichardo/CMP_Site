// src/app/api/auth/mobile/refresh/route.ts

import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, JWTPayload, SignJWT } from "jose";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { usuarios, roles } from "@/lib/schema";
import { normalizeRole } from "@/lib/auth";

const ACCESS_TOKEN_EXPIRATION = "15m";
const ACCESS_TOKEN_SECONDS = 60 * 15;

interface RefreshPayload extends JWTPayload {
  id?: number | string;
  userId?: number | string;
  email?: string;
  nombre?: string;
  rol?: string;
  version?: number;
  tokenUse?: "access" | "refresh";
}

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

    const refreshToken =
      typeof body.refreshToken === "string"
        ? body.refreshToken.trim()
        : "";

    if (!refreshToken) {
      return NextResponse.json(
        {
          message:
            "Refresh token requerido",
        },
        {
          status: 400,
        }
      );
    }

    let decoded: RefreshPayload;

    try {
      const { payload } =
        await jwtVerify(
          refreshToken,
          getJwtSecret(),
          {
            algorithms: ["HS256"],
          }
        );

      decoded =
        payload as RefreshPayload;
    } catch {
      return NextResponse.json(
        {
          message:
            "Refresh token inválido o expirado",
        },
        {
          status: 401,
        }
      );
    }

    if (
      decoded.tokenUse !==
      "refresh"
    ) {
      return NextResponse.json(
        {
          message:
            "Token no válido para renovación",
        },
        {
          status: 401,
        }
      );
    }

    const payloadId =
      decoded.id ??
      decoded.userId;

    if (
      payloadId === undefined ||
      payloadId === null
    ) {
      return NextResponse.json(
        {
          message:
            "Refresh token inválido",
        },
        {
          status: 401,
        }
      );
    }

    const userId =
      Number(payloadId);

    if (
      !Number.isInteger(userId) ||
      userId <= 0
    ) {
      return NextResponse.json(
        {
          message:
            "Refresh token inválido",
        },
        {
          status: 401,
        }
      );
    }

    const usuario =
      await db.query.usuarios.findFirst({
        where: eq(
          usuarios.id,
          userId
        ),
      });

    if (
      !usuario ||
      !usuario.activo
    ) {
      return NextResponse.json(
        {
          message:
            "Usuario no disponible",
        },
        {
          status: 401,
        }
      );
    }

    if (
      usuario.bloqueadoHasta
    ) {
      const fechaBloqueo =
        new Date(
          usuario.bloqueadoHasta
        );

      if (
        !Number.isNaN(
          fechaBloqueo.getTime()
        ) &&
        fechaBloqueo >
          new Date()
      ) {
        return NextResponse.json(
          {
            message:
              "Usuario bloqueado",
          },
          {
            status: 401,
          }
        );
      }
    }

    const tokenVersion =
      Number(
        decoded.version ?? 0
      );

    const userVersion =
      Number(
        usuario.versionToken ?? 1
      );

    if (
      tokenVersion !==
      userVersion
    ) {
      return NextResponse.json(
        {
          message:
            "La sesión ya no es válida",
        },
        {
          status: 401,
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

    const accessToken =
      await new SignJWT({
        id: usuario.id,
        userId: usuario.id,
        email:
          usuario.correo,
        nombre:
          usuario.nombre,
        rol:
          nombreRol,
        version:
          userVersion,
        tokenUse:
          "access",
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

    return NextResponse.json(
      {
        message:
          "Token renovado correctamente",

        accessToken,

        tokenType:
          "Bearer",

        expiresIn:
          ACCESS_TOKEN_SECONDS,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Error renovando token móvil:",
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