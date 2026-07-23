import { NextRequest, NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { requireApiRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { categoriasAyuda } from "@/lib/schema/index";
import {
  parseEnteroNoNegativo,
  parseIdPositivo,
  validarNombreCategoria,
} from "@/lib/soporte/validaciones";
import type { ActualizarCategoriaAyudaDTO } from "@/types/help";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error } = await requireApiRole("admin");

  if (error) {
    return error;
  }

  if (!session) {
    return NextResponse.json(
      { message: "No autenticado" },
      { status: 401 },
    );
  }

  try {
    const { id } = await params;
    const idCategoria = parseIdPositivo(id);

    if (idCategoria === null) {
      return NextResponse.json(
        { error: "El identificador de la categoría no es válido." },
        { status: 400 },
      );
    }

    const body = (await request.json()) as ActualizarCategoriaAyudaDTO;
    const cambios: {
      nombreCategoria?: string;
      descripcion?: string | null;
      icono?: string | null;
      orden?: number;
      activo?: boolean;
      updatedAt: string;
    } = { updatedAt: new Date().toISOString() };

    if (body.nombreCategoria !== undefined) {
      const errorNombre = validarNombreCategoria(body.nombreCategoria);
      if (errorNombre) {
        return NextResponse.json(
          { error: errorNombre },
          { status: 400 },
        );
      }
      cambios.nombreCategoria = body.nombreCategoria.trim();
    }

    if (body.descripcion !== undefined) {
      cambios.descripcion = body.descripcion?.trim() || null;
    }
    if (body.icono !== undefined) {
      cambios.icono = body.icono?.trim() || null;
    }
    if (body.orden !== undefined) {
      cambios.orden = parseEnteroNoNegativo(body.orden, 0);
    }
    if (body.activo !== undefined) {
      cambios.activo = body.activo === true;
    }

    const [actualizada] = await db
      .update(categoriasAyuda)
      .set(cambios)
      .where(eq(categoriasAyuda.idCategoria, idCategoria))
      .returning();

    if (!actualizada) {
      return NextResponse.json(
        { error: "Categoría no encontrada." },
        { status: 404 },
      );
    }

    return NextResponse.json(actualizada);
  } catch (errorActualizacion: unknown) {
    console.error("Error al actualizar categoría:", errorActualizacion);
    return NextResponse.json(
      { error: "No fue posible actualizar la categoría." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error } = await requireApiRole("admin");

  if (error) {
    return error;
  }

  if (!session) {
    return NextResponse.json(
      { message: "No autenticado" },
      { status: 401 },
    );
  }

  try {
    const { id } = await params;
    const idCategoria = parseIdPositivo(id);

    if (idCategoria === null) {
      return NextResponse.json(
        { error: "El identificador de la categoría no es válido." },
        { status: 400 },
      );
    }

    const [referencias] = await db
      .select({
        total: sql<number>`(
          SELECT count(*)::int
          FROM soporte.preguntas_frecuentes f
          WHERE f.id_categoria = ${idCategoria}
        ) + (
          SELECT count(*)::int
          FROM soporte.preguntas_usuarios p
          WHERE p.id_categoria = ${idCategoria}
        )`,
      })
      .from(categoriasAyuda)
      .where(eq(categoriasAyuda.idCategoria, idCategoria))
      .limit(1);

    if (!referencias) {
      return NextResponse.json(
        { error: "Categoría no encontrada." },
        { status: 404 },
      );
    }

    if (referencias.total > 0) {
      return NextResponse.json(
        {
          error:
            "La categoría está en uso. Desactívala en lugar de eliminarla.",
        },
        { status: 409 },
      );
    }

    await db
      .delete(categoriasAyuda)
      .where(eq(categoriasAyuda.idCategoria, idCategoria));

    return NextResponse.json({ mensaje: "Categoría eliminada." });
  } catch (errorEliminacion: unknown) {
    console.error("Error al eliminar categoría:", errorEliminacion);
    return NextResponse.json(
      { error: "No fue posible eliminar la categoría." },
      { status: 500 },
    );
  }
}
