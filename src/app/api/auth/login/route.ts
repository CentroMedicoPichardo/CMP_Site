// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { usuarios, roles } from "@/lib/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { AUTH_COOKIE_NAME, normalizeRole } from "@/lib/auth";

const MAX_INTENTOS_FALLIDOS = 5;
const TIEMPO_BLOQUEO_MINUTOS = 15;

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET no está configurado");
  }

  return new TextEncoder().encode(secret);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { correo, contrasena } = body;

    if (!correo || !contrasena) {
      return NextResponse.json(
        { message: "Correo y contraseña son requeridos" },
        { status: 400 }
      );
    }

    const usuario = await db.query.usuarios.findFirst({
      where: eq(usuarios.correo, correo),
    });

    if (!usuario) {
      return NextResponse.json(
        { message: "Credenciales incorrectas" },
        { status: 401 }
      );
    }

    const rolUsuario = await db.query.roles.findFirst({
      where: eq(roles.id, usuario.rolId),
    });

    const nombreRol = normalizeRole(rolUsuario?.nombre);

    if (usuario.bloqueadoHasta) {
      const fechaBloqueo = new Date(usuario.bloqueadoHasta);
      const ahora = new Date();

      if (fechaBloqueo > ahora) {
        const minutosRestantes = Math.ceil(
          (fechaBloqueo.getTime() - ahora.getTime()) / (1000 * 60)
        );

        return NextResponse.json(
          {
            message: `Cuenta bloqueada. Intenta nuevamente en ${minutosRestantes} minutos`,
            bloqueado: true,
          },
          { status: 423 }
        );
      }

      await db
        .update(usuarios)
        .set({
          intentosFallidos: 0,
          bloqueadoHasta: null,
        })
        .where(eq(usuarios.id, usuario.id));
    }

    if (!usuario.activo) {
      return NextResponse.json(
        { message: "Usuario desactivado. Contacta al administrador" },
        { status: 403 }
      );
    }

    const contrasenaValida = await bcrypt.compare(
      contrasena,
      usuario.contrasena
    );

    if (!contrasenaValida) {
      const nuevosIntentos = Number(usuario.intentosFallidos ?? 0) + 1;

      if (nuevosIntentos >= MAX_INTENTOS_FALLIDOS) {
        const fechaBloqueo = new Date();
        fechaBloqueo.setMinutes(
          fechaBloqueo.getMinutes() + TIEMPO_BLOQUEO_MINUTOS
        );

        await db
          .update(usuarios)
          .set({
            intentosFallidos: nuevosIntentos,
            bloqueadoHasta: fechaBloqueo.toISOString(),
          })
          .where(eq(usuarios.id, usuario.id));

        return NextResponse.json(
          {
            message: `Demasiados intentos fallidos. Cuenta bloqueada por ${TIEMPO_BLOQUEO_MINUTOS} minutos`,
            bloqueado: true,
          },
          { status: 423 }
        );
      }

      await db
        .update(usuarios)
        .set({
          intentosFallidos: nuevosIntentos,
        })
        .where(eq(usuarios.id, usuario.id));

      const intentosRestantes = MAX_INTENTOS_FALLIDOS - nuevosIntentos;

      return NextResponse.json(
        {
          message: `Credenciales incorrectas. Te quedan ${intentosRestantes} intentos`,
        },
        { status: 401 }
      );
    }

    await db
      .update(usuarios)
      .set({
        intentosFallidos: 0,
        bloqueadoHasta: null,
      })
      .where(eq(usuarios.id, usuario.id));

    if (usuario.mfaHabilitado) {
      return NextResponse.json(
        {
          message: "Autenticación de dos factores requerida",
          requireMfa: true,
          email: usuario.correo,
        },
        { status: 403 }
      );
    }

    const versionToken = Number(usuario.versionToken ?? 1);

    const token = await new SignJWT({
      id: usuario.id,
      email: usuario.correo,
      rol: nombreRol,
      version: versionToken,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(getJwtSecret());

    const usuarioResponse = {
      id: usuario.id,
      nombre: usuario.nombre,
      apellidoPaterno: usuario.apellidoPaterno,
      apellidoMaterno: usuario.apellidoMaterno,
      nombreCompleto: `${usuario.nombre} ${usuario.apellidoPaterno ?? ""} ${
        usuario.apellidoMaterno ?? ""
      }`.trim(),
      correo: usuario.correo,
      email: usuario.correo,
      rol: nombreRol,
    };

    const response = NextResponse.json(
      {
        message: "Login exitoso",
        usuario: usuarioResponse,
      },
      { status: 200 }
    );

    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    // Limpieza de cookies antiguas inseguras.
    response.cookies.set("token", "", {
      path: "/",
      maxAge: 0,
    });

    response.cookies.set("rol", "", {
      path: "/",
      maxAge: 0,
    });

    response.cookies.set("user", "", {
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error("Error en login:", error);

    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}