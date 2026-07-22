// src/app/api/cron/compras-cursos/expirar/route.ts

import { NextResponse } from "next/server";

import {
  expirarComprasVencidas,
} from "@/lib/compras-cursos/expirar-compras";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isAuthorized(
  request: Request,
  secret: string
): boolean {
  const authorization =
    request.headers.get("authorization");

  return (
    authorization ===
    `Bearer ${secret}`
  );
}

export async function GET(
  request: Request
) {
  const cronSecret =
    process.env.CRON_SECRET?.trim();

  if (!cronSecret) {
    console.error(
      "CRON_SECRET no está configurado"
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "El cron no está configurado correctamente",
      },
      {
        status: 500,
        headers: {
          "Cache-Control":
            "no-store",
        },
      }
    );
  }

  if (
    !isAuthorized(
      request,
      cronSecret
    )
  ) {
    return NextResponse.json(
      {
        success: false,
        error: "No autorizado",
      },
      {
        status: 401,
        headers: {
          "Cache-Control":
            "no-store",
        },
      }
    );
  }

  const inicio = Date.now();

  try {
    const resultado =
      await db.transaction(
        async (tx) =>
          expirarComprasVencidas(
            tx,
            {}
          )
      );

    return NextResponse.json(
      {
        success: true,
        ejecutadoEn:
          new Date().toISOString(),
        duracionMs:
          Date.now() - inicio,
        ...resultado,
      },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "no-store",
        },
      }
    );
  } catch (errorValue: unknown) {
    console.error(
      "Error ejecutando el cron de expiración de compras:",
      errorValue
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "No fue posible ejecutar la expiración de compras",
        ejecutadoEn:
          new Date().toISOString(),
        duracionMs:
          Date.now() - inicio,
      },
      {
        status: 500,
        headers: {
          "Cache-Control":
            "no-store",
        },
      }
    );
  }
}