// src/lib/auth.ts

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { jwtVerify, JWTPayload } from "jose";
import { db } from "@/lib/db";
import { usuarios, roles } from "@/lib/schema";
import { eq } from "drizzle-orm";

export const AUTH_COOKIE_NAME = "auth_token";

export interface User {
  id: number;
  email: string;
  correo: string;
  nombre: string;
  apellidoPaterno?: string | null;
  apellidoMaterno?: string | null;
  nombreCompleto: string;
  rol: string;
}

export interface Session {
  user: User;
}

interface AuthPayload extends JWTPayload {
  id?: number | string;
  userId?: number | string;
  email?: string;
  nombre?: string;
  rol?: string;
  version?: number;
  tokenUse?: "access" | "refresh";
}

type AuthTokenSource =
  | "bearer"
  | "cookie";

interface AuthToken {
  token: string;
  source: AuthTokenSource;
}

function getJwtSecret(): Uint8Array {
  const secret =
    process.env.JWT_SECRET;

  if (!secret) {
    throw new Error(
      "JWT_SECRET no está configurado"
    );
  }

  return new TextEncoder().encode(
    secret
  );
}

async function getAuthToken():
  Promise<AuthToken | null> {
  const headerStore =
    await headers();

  const authorization =
    headerStore.get(
      "authorization"
    );

  if (authorization) {
    const match =
      authorization.match(
        /^Bearer\s+(.+)$/i
      );

    if (!match) {
      return null;
    }

    const bearerToken =
      match[1]?.trim();

    if (!bearerToken) {
      return null;
    }

    return {
      token: bearerToken,
      source: "bearer",
    };
  }

  const cookieStore =
    await cookies();

  const cookieToken =
    cookieStore.get(
      AUTH_COOKIE_NAME
    )?.value;

  if (!cookieToken) {
    return null;
  }

  return {
    token: cookieToken,
    source: "cookie",
  };
}

export function normalizeRole(
  rol?: string | null
): string {
  const value = (
    rol ?? "cliente"
  )
    .toLowerCase()
    .trim();

  if (
    value === "admin" ||
    value === "administrador" ||
    value === "administrator"
  ) {
    return "admin";
  }

  return value;
}

export async function auth():
  Promise<Session | null> {
  try {
    const authToken =
      await getAuthToken();

    if (!authToken) {
      return null;
    }

    const { payload } =
      await jwtVerify(
        authToken.token,
        getJwtSecret(),
        {
          algorithms: ["HS256"],
        }
      );

    const decoded =
      payload as AuthPayload;

    /*
     * Los Bearer utilizados por la app
     * móvil deben ser exclusivamente
     * access tokens.
     *
     * De esta forma un refresh token
     * nunca puede utilizarse para
     * consumir una API protegida.
     */
    if (
      authToken.source ===
        "bearer" &&
      decoded.tokenUse !==
        "access"
    ) {
      return null;
    }

    /*
     * Las cookies del sitio web
     * continúan siendo compatibles
     * con los JWT existentes, que
     * actualmente no incluyen
     * tokenUse.
     */
    if (
      authToken.source ===
        "cookie" &&
      decoded.tokenUse ===
        "refresh"
    ) {
      return null;
    }

    const payloadId =
      decoded.id ??
      decoded.userId;

    if (
      payloadId === undefined ||
      payloadId === null
    ) {
      return null;
    }

    const userId =
      Number(payloadId);

    if (
      !Number.isInteger(userId) ||
      userId <= 0
    ) {
      return null;
    }

    const usuario =
      await db.query.usuarios
        .findFirst({
          where: eq(
            usuarios.id,
            userId
          ),
        });

    if (
      !usuario ||
      !usuario.activo
    ) {
      return null;
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
        return null;
      }
    }

    const tokenVersion =
      Number(
        decoded.version ?? 0
      );

    const userVersion =
      Number(
        usuario.versionToken ??
          1
      );

    if (
      tokenVersion !==
      userVersion
    ) {
      return null;
    }

    const rolUsuario =
      await db.query.roles
        .findFirst({
          where: eq(
            roles.id,
            usuario.rolId
          ),
        });

    const rol =
      normalizeRole(
        rolUsuario?.nombre
      );

    const nombreCompleto = [
      usuario.nombre,
      usuario.apellidoPaterno,
      usuario.apellidoMaterno,
    ]
      .filter(Boolean)
      .join(" ");

    return {
      user: {
        id: usuario.id,
        email:
          usuario.correo,
        correo:
          usuario.correo,
        nombre:
          usuario.nombre,
        apellidoPaterno:
          usuario.apellidoPaterno,
        apellidoMaterno:
          usuario.apellidoMaterno,
        nombreCompleto,
        rol,
      },
    };
  } catch (error) {
    console.error(
      "Error validando sesión:",
      error
    );

    return null;
  }
}

export async function requireAuth(
  redirectTo: string =
    "/acceder"
): Promise<Session> {
  const session =
    await auth();

  if (!session) {
    redirect(redirectTo);
  }

  return session;
}

export async function requireRole(
  rolesPermitidos:
    | string
    | string[],
  redirectTo: string = "/"
): Promise<Session> {
  const session =
    await requireAuth();

  const allowedRoles =
    Array.isArray(
      rolesPermitidos
    )
      ? rolesPermitidos.map(
          normalizeRole
        )
      : [
          normalizeRole(
            rolesPermitidos
          ),
        ];

  if (
    !allowedRoles.includes(
      normalizeRole(
        session.user.rol
      )
    )
  ) {
    redirect(redirectTo);
  }

  return session;
}

export async function requireApiAuth() {
  const session =
    await auth();

  if (!session) {
    return {
      session: null,
      error:
        NextResponse.json(
          {
            message:
              "No autenticado",
          },
          {
            status: 401,
          }
        ),
    };
  }

  return {
    session,
    error: null,
  };
}

export async function requireApiRole(
  rolesPermitidos:
    | string
    | string[]
) {
  const {
    session,
    error,
  } =
    await requireApiAuth();

  if (
    error ||
    !session
  ) {
    return {
      session: null,
      error,
    };
  }

  const allowedRoles =
    Array.isArray(
      rolesPermitidos
    )
      ? rolesPermitidos.map(
          normalizeRole
        )
      : [
          normalizeRole(
            rolesPermitidos
          ),
        ];

  if (
    !allowedRoles.includes(
      normalizeRole(
        session.user.rol
      )
    )
  ) {
    return {
      session: null,
      error:
        NextResponse.json(
          {
            message:
              "No tienes permisos para realizar esta acción",
          },
          {
            status: 403,
          }
        ),
    };
  }

  return {
    session,
    error: null,
  };
}