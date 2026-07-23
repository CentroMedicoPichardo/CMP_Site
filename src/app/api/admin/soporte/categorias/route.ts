import { NextRequest, NextResponse } from "next/server";
import { asc, eq, sql } from "drizzle-orm";
import { requireApiRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { categoriasAyuda } from "@/lib/schema/index";
import {
  parseEnteroNoNegativo,
  validarNombreCategoria,
} from "@/lib/soporte/validaciones";
import type { CrearCategoriaAyudaDTO } from "@/types/help";

export async function GET(request: NextRequest) {
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
    const soloActivas =
      new URL(request.url).searchParams.get("soloActivas") === "true";

    const categorias = await db
      .select({
        idCategoria: categoriasAyuda.idCategoria,
        nombreCategoria: categoriasAyuda.nombreCategoria,
        descripcion: categoriasAyuda.descripcion,
        icono: categoriasAyuda.icono,
        orden: categoriasAyuda.orden,
        activo: categoriasAyuda.activo,
        createdAt: categoriasAyuda.createdAt,
        updatedAt: categoriasAyuda.updatedAt,
        totalFaqs: sql<number>`(
          SELECT count(*)::int
          FROM soporte.preguntas_frecuentes f
          WHERE f.id_categoria = ${categoriasAyuda.idCategoria}
        )`,
        totalPreguntas: sql<number>`(
          SELECT count(*)::int
          FROM soporte.preguntas_usuarios p
          WHERE p.id_categoria = ${categoriasAyuda.idCategoria}
        )`,
      })
      .from(categoriasAyuda)
      .where(
        soloActivas
          ? eq(categoriasAyuda.activo, true)
          : undefined,
      )
      .orderBy(
        asc(categoriasAyuda.orden),
        asc(categoriasAyuda.nombreCategoria),
      );

    return NextResponse.json(
      categorias.map((categoria) => ({
        ...categoria,
        orden: categoria.orden ?? 0,
        activo: categoria.activo ?? true,
      })),
    );
  } catch (errorConsulta: unknown) {
    console.error("Error al obtener categorías admin:", errorConsulta);
    return NextResponse.json(
      { error: "No fue posible obtener las categorías." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
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
    const body = (await request.json()) as CrearCategoriaAyudaDTO;
    const errorNombre = validarNombreCategoria(body.nombreCategoria);

    if (errorNombre) {
      return NextResponse.json(
        { error: errorNombre },
        { status: 400 },
      );
    }

    const [creada] = await db
      .insert(categoriasAyuda)
      .values({
        nombreCategoria: body.nombreCategoria.trim(),
        descripcion: body.descripcion?.trim() || null,
        icono: body.icono?.trim() || null,
        orden: parseEnteroNoNegativo(body.orden, 0),
        activo: body.activo ?? true,
        updatedAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json(creada, { status: 201 });
  } catch (errorCreacion: unknown) {
    console.error("Error al crear categoría:", errorCreacion);

    const esDuplicada =
      errorCreacion instanceof Error &&
      errorCreacion.message
        .toLocaleLowerCase("es-MX")
        .includes("unique");

    return NextResponse.json(
      {
        error: esDuplicada
          ? "Ya existe una categoría con ese nombre."
          : "No fue posible crear la categoría.",
      },
      { status: esDuplicada ? 409 : 500 },
    );
  }
}
