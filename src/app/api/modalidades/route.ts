// src/app/api/modalidades/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { modalidades } from "@/lib/schema/index";
import { desc } from "drizzle-orm";
import { withUserEmail } from "@/lib/db-with-user";
import { requireApiRole } from "@/lib/auth";

function normalizarTexto(valor: unknown, maxLength = 255) {
  if (typeof valor !== "string") {
    return "";
  }

  return valor.trim().slice(0, maxLength);
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

    const data = await db
      .select({
        idModalidad: modalidades.idModalidad,
        nombreModalidad: modalidades.nombreModalidad,
        descripcion: modalidades.descripcion,
      })
      .from(modalidades)
      .orderBy(desc(modalidades.idModalidad));

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error en GET modalidades:", error);

    return NextResponse.json(
      { error: "Error al obtener modalidades" },
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

    const nombreModalidad = normalizarTexto(body.nombreModalidad, 150);
    const descripcion = normalizarTexto(body.descripcion, 500) || null;

    if (!nombreModalidad) {
      return NextResponse.json(
        { error: "El nombre de la modalidad es requerido" },
        { status: 400 }
      );
    }

    const userEmail = session.user.correo;

    const nueva = await withUserEmail(userEmail, async () => {
      return await db
        .insert(modalidades)
        .values({
          nombreModalidad,
          descripcion,
        })
        .returning({
          idModalidad: modalidades.idModalidad,
          nombreModalidad: modalidades.nombreModalidad,
          descripcion: modalidades.descripcion,
        });
    });

    if (!nueva.length || !nueva[0]) {
      return NextResponse.json(
        { error: "Error al crear modalidad" },
        { status: 500 }
      );
    }

    return NextResponse.json(nueva[0], { status: 201 });
  } catch (error) {
    console.error("Error en POST modalidad:", error);

    return NextResponse.json(
      { error: "Error al crear modalidad" },
      { status: 500 }
    );
  }
}