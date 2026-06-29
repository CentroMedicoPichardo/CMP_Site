// src/app/api/ubicaciones/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ubicacionesCursos } from "@/lib/schema/index";
import { and, desc, eq, type SQL } from "drizzle-orm";
import { withUserEmail } from "@/lib/db-with-user";
import { requireApiRole } from "@/lib/auth";

function normalizarTexto(valor: unknown, maxLength = 255) {
  if (typeof valor !== "string") {
    return "";
  }

  return valor.trim().slice(0, maxLength);
}

function normalizarCapacidad(valor: unknown) {
  if (valor === undefined || valor === null || valor === "") {
    return null;
  }

  const capacidad = Number(valor);

  if (!Number.isInteger(capacidad) || capacidad <= 0) {
    return null;
  }

  return capacidad;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get("admin") === "true";

    if (isAdmin) {
      const { error } = await requireApiRole("admin");

      if (error) {
        return error;
      }
    }

    const filtros: SQL[] = [];

    if (!isAdmin) {
      filtros.push(eq(ubicacionesCursos.activo, true));
    }

    const data = await db
      .select({
        idUbicacion: ubicacionesCursos.idUbicacion,
        nombreUbicacion: ubicacionesCursos.nombreUbicacion,
        direccionCompleta: ubicacionesCursos.direccionCompleta,
        capacidadMaxima: ubicacionesCursos.capacidadMaxima,
        activo: ubicacionesCursos.activo,
      })
      .from(ubicacionesCursos)
      .where(filtros.length ? and(...filtros) : undefined)
      .orderBy(desc(ubicacionesCursos.idUbicacion));

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error en GET ubicaciones:", error);

    return NextResponse.json(
      { error: "Error al obtener ubicaciones" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { session, error } = await requireApiRole("admin");

  if (error) {
    return error;
  }

  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const nombreUbicacion = normalizarTexto(body.nombreUbicacion, 150);
    const direccionCompleta =
      normalizarTexto(body.direccionCompleta, 500) || null;
    const capacidadMaxima = normalizarCapacidad(body.capacidadMaxima);

    if (!nombreUbicacion) {
      return NextResponse.json(
        { error: "El nombre de la ubicación es requerido" },
        { status: 400 }
      );
    }

    const userEmail = session.user.correo;

    const nueva = await withUserEmail(userEmail, async () => {
      return await db
        .insert(ubicacionesCursos)
        .values({
          nombreUbicacion,
          direccionCompleta,
          capacidadMaxima,
          activo: true,
        })
        .returning({
          idUbicacion: ubicacionesCursos.idUbicacion,
          nombreUbicacion: ubicacionesCursos.nombreUbicacion,
          direccionCompleta: ubicacionesCursos.direccionCompleta,
          capacidadMaxima: ubicacionesCursos.capacidadMaxima,
          activo: ubicacionesCursos.activo,
        });
    });

    if (!nueva.length || !nueva[0]) {
      return NextResponse.json(
        { error: "Error al crear ubicación" },
        { status: 500 }
      );
    }

    return NextResponse.json(nueva[0], { status: 201 });
  } catch (error) {
    console.error("Error en POST ubicación:", error);

    return NextResponse.json(
      { error: "Error al crear ubicación" },
      { status: 500 }
    );
  }
}