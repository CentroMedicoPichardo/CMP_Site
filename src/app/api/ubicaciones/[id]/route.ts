// src/app/api/ubicaciones/[id]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ubicacionesCursos } from "@/lib/schema/index";
import { and, eq } from "drizzle-orm";
import { withUserEmail } from "@/lib/db-with-user";
import { requireApiRole } from "@/lib/auth";

function validarId(id: string) {
  const idNum = Number(id);
  return Number.isInteger(idNum) && idNum > 0 ? idNum : null;
}

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

function normalizarBooleano(valor: unknown, defaultValue = true) {
  if (typeof valor === "boolean") {
    return valor;
  }

  if (valor === "true") {
    return true;
  }

  if (valor === "false") {
    return false;
  }

  return defaultValue;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idUbicacion = validarId(id);

    if (!idUbicacion) {
      return NextResponse.json(
        { error: "ID de ubicación inválido" },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get("admin") === "true";

    if (isAdmin) {
      const { error } = await requireApiRole("admin");

      if (error) {
        return error;
      }
    }

    const condicion = isAdmin
      ? eq(ubicacionesCursos.idUbicacion, idUbicacion)
      : and(
          eq(ubicacionesCursos.idUbicacion, idUbicacion),
          eq(ubicacionesCursos.activo, true)
        );

    const ubicacion = await db
      .select({
        idUbicacion: ubicacionesCursos.idUbicacion,
        nombreUbicacion: ubicacionesCursos.nombreUbicacion,
        direccionCompleta: ubicacionesCursos.direccionCompleta,
        capacidadMaxima: ubicacionesCursos.capacidadMaxima,
        activo: ubicacionesCursos.activo,
      })
      .from(ubicacionesCursos)
      .where(condicion)
      .limit(1);

    if (!ubicacion.length) {
      return NextResponse.json(
        { error: "Ubicación no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(ubicacion[0], {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error en GET ubicación:", error);

    return NextResponse.json(
      { error: "Error al obtener ubicación" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireApiRole("admin");

  if (error) {
    return error;
  }

  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const idUbicacion = validarId(id);

    if (!idUbicacion) {
      return NextResponse.json(
        { error: "ID de ubicación inválido" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const nombreUbicacion = normalizarTexto(body.nombreUbicacion, 150);
    const direccionCompleta =
      normalizarTexto(body.direccionCompleta, 500) || null;
    const capacidadMaxima = normalizarCapacidad(body.capacidadMaxima);
    const activo = normalizarBooleano(body.activo, true);

    if (!nombreUbicacion) {
      return NextResponse.json(
        { error: "El nombre de la ubicación es requerido" },
        { status: 400 }
      );
    }

    const userEmail = session.user.correo;

    const actualizada = await withUserEmail(userEmail, async () => {
      return await db
        .update(ubicacionesCursos)
        .set({
          nombreUbicacion,
          direccionCompleta,
          capacidadMaxima,
          activo,
        })
        .where(eq(ubicacionesCursos.idUbicacion, idUbicacion))
        .returning({
          idUbicacion: ubicacionesCursos.idUbicacion,
          nombreUbicacion: ubicacionesCursos.nombreUbicacion,
          direccionCompleta: ubicacionesCursos.direccionCompleta,
          capacidadMaxima: ubicacionesCursos.capacidadMaxima,
          activo: ubicacionesCursos.activo,
        });
    });

    if (!actualizada.length) {
      return NextResponse.json(
        { error: "Ubicación no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(actualizada[0]);
  } catch (error) {
    console.error("Error en PUT ubicación:", error);

    return NextResponse.json(
      { error: "Error al actualizar ubicación" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireApiRole("admin");

  if (error) {
    return error;
  }

  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const idUbicacion = validarId(id);

    if (!idUbicacion) {
      return NextResponse.json(
        { error: "ID de ubicación inválido" },
        { status: 400 }
      );
    }

    const userEmail = session.user.correo;

    const ocultada = await withUserEmail(userEmail, async () => {
      return await db
        .update(ubicacionesCursos)
        .set({
          activo: false,
        })
        .where(eq(ubicacionesCursos.idUbicacion, idUbicacion))
        .returning({
          idUbicacion: ubicacionesCursos.idUbicacion,
          nombreUbicacion: ubicacionesCursos.nombreUbicacion,
          direccionCompleta: ubicacionesCursos.direccionCompleta,
          capacidadMaxima: ubicacionesCursos.capacidadMaxima,
          activo: ubicacionesCursos.activo,
        });
    });

    if (!ocultada.length) {
      return NextResponse.json(
        { error: "Ubicación no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Ubicación ocultada correctamente",
      ubicacion: ocultada[0],
    });
  } catch (error) {
    console.error("Error en DELETE ubicación:", error);

    return NextResponse.json(
      { error: "Error al ocultar ubicación" },
      { status: 500 }
    );
  }
}