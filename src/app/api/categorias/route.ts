// src/app/api/categorias/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { categoriasCursos } from "@/lib/schema/index";
import { desc, eq, and, type SQL } from "drizzle-orm";
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
    const search = normalizarTexto(searchParams.get("search"), 150);

    if (isAdmin) {
      const { error } = await requireApiRole("admin");

      if (error) {
        return error;
      }
    }

    const filtros: SQL[] = [];

    if (!isAdmin) {
      filtros.push(eq(categoriasCursos.activo, true));
    }

    if (search) {
      filtros.push(eq(categoriasCursos.nombreCategoria, search));
    }

    const data = await db
      .select({
        idCategoria: categoriasCursos.idCategoria,
        nombreCategoria: categoriasCursos.nombreCategoria,
        descripcion: categoriasCursos.descripcion,
        activo: categoriasCursos.activo,
      })
      .from(categoriasCursos)
      .where(filtros.length ? and(...filtros) : undefined)
      .orderBy(desc(categoriasCursos.idCategoria));

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error en GET categorías:", error);

    return NextResponse.json(
      { error: "Error al obtener categorías" },
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

    const nombreCategoria = normalizarTexto(body.nombreCategoria, 150);
    const descripcion = normalizarTexto(body.descripcion, 500) || null;

    if (!nombreCategoria) {
      return NextResponse.json(
        { error: "El nombre de la categoría es requerido" },
        { status: 400 }
      );
    }

    const userEmail = session.user.correo;

    const nueva = await withUserEmail(userEmail, async () => {
      return await db
        .insert(categoriasCursos)
        .values({
          nombreCategoria,
          descripcion,
          activo: true,
        })
        .returning({
          idCategoria: categoriasCursos.idCategoria,
          nombreCategoria: categoriasCursos.nombreCategoria,
          descripcion: categoriasCursos.descripcion,
          activo: categoriasCursos.activo,
        });
    });

    if (!nueva.length || !nueva[0]) {
      return NextResponse.json(
        { error: "Error al crear categoría" },
        { status: 500 }
      );
    }

    return NextResponse.json(nueva[0], { status: 201 });
  } catch (error) {
    console.error("Error en POST categoría:", error);

    return NextResponse.json(
      { error: "Error al crear categoría" },
      { status: 500 }
    );
  }
}