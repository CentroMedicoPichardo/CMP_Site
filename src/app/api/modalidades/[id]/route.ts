// src/app/api/modalidades/[id]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { modalidades } from "@/lib/schema/index";
import { eq } from "drizzle-orm";
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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idModalidad = validarId(id);

    if (!idModalidad) {
      return NextResponse.json(
        { error: "ID de modalidad inválido" },
        { status: 400 }
      );
    }

    const modalidad = await db
      .select({
        idModalidad: modalidades.idModalidad,
        nombreModalidad: modalidades.nombreModalidad,
        descripcion: modalidades.descripcion,
      })
      .from(modalidades)
      .where(eq(modalidades.idModalidad, idModalidad))
      .limit(1);

    if (!modalidad.length) {
      return NextResponse.json(
        { error: "Modalidad no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(modalidad[0], {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error en GET modalidad:", error);

    return NextResponse.json(
      { error: "Error al obtener modalidad" },
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
    const idModalidad = validarId(id);

    if (!idModalidad) {
      return NextResponse.json(
        { error: "ID de modalidad inválido" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const nombreModalidad = normalizarTexto(body.nombreModalidad, 150);
    const descripcion = normalizarTexto(body.descripcion, 500) || null;

    if (!nombreModalidad) {
      return NextResponse.json(
        { error: "El nombre de la modalidad es requerido" },
        { status: 400 }
      );
    }

    const userEmail = session.user.correo;

    const actualizada = await withUserEmail(userEmail, async () => {
      return await db
        .update(modalidades)
        .set({
          nombreModalidad,
          descripcion,
        })
        .where(eq(modalidades.idModalidad, idModalidad))
        .returning({
          idModalidad: modalidades.idModalidad,
          nombreModalidad: modalidades.nombreModalidad,
          descripcion: modalidades.descripcion,
        });
    });

    if (!actualizada.length) {
      return NextResponse.json(
        { error: "Modalidad no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(actualizada[0]);
  } catch (error) {
    console.error("Error en PUT modalidad:", error);

    return NextResponse.json(
      { error: "Error al actualizar modalidad" },
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
    const idModalidad = validarId(id);

    if (!idModalidad) {
      return NextResponse.json(
        { error: "ID de modalidad inválido" },
        { status: 400 }
      );
    }

    const userEmail = session.user.correo;

    const eliminada = await withUserEmail(userEmail, async () => {
      return await db
        .delete(modalidades)
        .where(eq(modalidades.idModalidad, idModalidad))
        .returning({
          idModalidad: modalidades.idModalidad,
          nombreModalidad: modalidades.nombreModalidad,
          descripcion: modalidades.descripcion,
        });
    });

    if (!eliminada.length) {
      return NextResponse.json(
        { error: "Modalidad no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Modalidad eliminada correctamente",
      modalidad: eliminada[0],
    });
  } catch (error) {
    console.error("Error en DELETE modalidad:", error);

    return NextResponse.json(
      { error: "Error al eliminar modalidad" },
      { status: 500 }
    );
  }
}