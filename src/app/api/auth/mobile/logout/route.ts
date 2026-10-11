// src/app/api/auth/mobile/logout/route.ts

import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { requireApiAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { usuarios } from "@/lib/schema";

export async function POST() {
  try {
    const {
      session,
      error,
    } = await requireApiAuth();

    if (
      error ||
      !session
    ) {
      return error;
    }

    const usuario =
      await db.query.usuarios.findFirst({
        where: eq(
          usuarios.id,
          session.user.id
        ),
      });

    if (!usuario) {
      return NextResponse.json(
        {
          message:
            "Usuario no encontrado",
        },
        {
          status: 404,
        }
      );
    }

    const versionActual =
      Number(
        usuario.versionToken ?? 1
      );

    await db
      .update(usuarios)
      .set({
        versionToken:
          versionActual + 1,
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
          "Sesión móvil cerrada correctamente",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Error cerrando sesión móvil:",
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