// src/app/api/metodos-pago-cursos/route.ts

import { NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { metodosPagoCursos } from "@/lib/schema";
import type {
  MetodosPagoCursosResponse,
} from "@/types/compras-cursos";

export async function GET() {
  try {
    const metodos = await db
      .select({
        idMetodoPago:
          metodosPagoCursos.idMetodoPago,
        nombre:
          metodosPagoCursos.nombre,
        descripcion:
          metodosPagoCursos.descripcion,
        requiereComprobante:
          metodosPagoCursos.requiereComprobante,
        instrucciones:
          metodosPagoCursos.instrucciones,
      })
      .from(metodosPagoCursos)
      .where(
        eq(
          metodosPagoCursos.activo,
          true
        )
      )
      .orderBy(
        asc(metodosPagoCursos.idMetodoPago)
      );

    const response: MetodosPagoCursosResponse = {
      metodos,
    };

    return NextResponse.json(response, {
      headers: {
        "Cache-Control":
          "private, no-store, max-age=0",
      },
    });
  } catch (error: unknown) {
    console.error(
      "Error obteniendo métodos de pago:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Error al obtener los métodos de pago",
      },
      { status: 500 }
    );
  }
}