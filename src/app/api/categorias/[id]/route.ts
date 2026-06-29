// src/app/api/categorias/[id]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { categoriasCursos } from "@/lib/schema/index";
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
    const idCategoria = validarId(id);

    if (!idCategoria) {
      return NextResponse.json(
        { error: "ID de categoría inválido" },
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
      ? eq(categoriasCursos.idCategoria, idCategoria)
      : and(
          eq(categoriasCursos.idCategoria, idCategoria),
          eq(categoriasCursos.activo, true)
        );

    const categoria = await db
      .select({
        idCategoria: categoriasCursos.idCategoria,
        nombreCategoria: categoriasCursos.nombreCategoria,
        descripcion: categoriasCursos.descripcion,
        activo: categoriasCursos.activo,
      })
      .from(categoriasCursos)
      .where(condicion)
      .limit(1);

    if (!categoria.length) {
      return NextResponse.json(
        { error: "Categoría no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(categoria[0]);
  } catch (error) {
    console.error("Error en GET categoría:", error);

    return NextResponse.json(
      { error: "Error al obtener categoría" },
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
    const idCategoria = validarId(id);

    if (!idCategoria) {
      return NextResponse.json(
        { error: "ID de categoría inválido" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const nombreCategoria = normalizarTexto(body.nombreCategoria, 150);
    const descripcion = normalizarTexto(body.descripcion, 500) || null;
    const activo = normalizarBooleano(body.activo, true);

    if (!nombreCategoria) {
      return NextResponse.json(
        { error: "El nombre de la categoría es requerido" },
        { status: 400 }
      );
    }

    const userEmail = session.user.correo;

    const actualizada = await withUserEmail(userEmail, async () => {
      return await db
        .update(categoriasCursos)
        .set({
          nombreCategoria,
          descripcion,
          activo,
        })
        .where(eq(categoriasCursos.idCategoria, idCategoria))
        .returning({
          idCategoria: categoriasCursos.idCategoria,
          nombreCategoria: categoriasCursos.nombreCategoria,
          descripcion: categoriasCursos.descripcion,
          activo: categoriasCursos.activo,
        });
    });

    if (!actualizada.length) {
      return NextResponse.json(
        { error: "Categoría no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(actualizada[0]);
  } catch (error) {
    console.error("Error en PUT categoría:", error);

    return NextResponse.json(
      { error: "Error al actualizar categoría" },
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
    const idCategoria = validarId(id);

    if (!idCategoria) {
      return NextResponse.json(
        { error: "ID de categoría inválido" },
        { status: 400 }
      );
    }

    const userEmail = session.user.correo;

    const ocultada = await withUserEmail(userEmail, async () => {
      return await db
        .update(categoriasCursos)
        .set({
          activo: false,
        })
        .where(eq(categoriasCursos.idCategoria, idCategoria))
        .returning({
          idCategoria: categoriasCursos.idCategoria,
          nombreCategoria: categoriasCursos.nombreCategoria,
          activo: categoriasCursos.activo,
        });
    });

    if (!ocultada.length) {
      return NextResponse.json(
        { error: "Categoría no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Categoría ocultada correctamente",
      categoria: ocultada[0],
    });
  } catch (error) {
    console.error("Error en DELETE categoría:", error);

    return NextResponse.json(
      { error: "Error al ocultar categoría" },
      { status: 500 }
    );
  }
}