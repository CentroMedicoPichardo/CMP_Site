// src/app/api/publicaciones/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { publicaciones, medicos } from "@/lib/schema/index";
import { desc, eq, sql } from "drizzle-orm";
import { requireApiRole } from "@/lib/auth";

function normalizarTexto(valor: unknown) {
  return typeof valor === "string" ? valor.trim() : "";
}

function obtenerLimiteSeguro(valor: string | null) {
  const limite = Number(valor ?? 10);

  if (!Number.isFinite(limite) || limite <= 0) {
    return 10;
  }

  return Math.min(limite, 50);
}

function obtenerOffsetSeguro(valor: string | null) {
  const offset = Number(valor ?? 0);

  if (!Number.isFinite(offset) || offset < 0) {
    return 0;
  }

  return offset;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const limit = obtenerLimiteSeguro(searchParams.get("limit"));
    const offset = obtenerOffsetSeguro(searchParams.get("offset"));
    const isAdmin = searchParams.get("admin") === "true";

    if (isAdmin) {
      const { error } = await requireApiRole("admin");

      if (error) {
        return error;
      }
    }

    const whereCondition = isAdmin
      ? undefined
      : eq(publicaciones.activo, true);

    const totalCount = await db
      .select({
        count: sql<number>`count(*)::int`,
      })
      .from(publicaciones)
      .where(whereCondition);

    const data = await db
      .select({
        idPublicacion: publicaciones.idPublicacion,
        tituloNoticia: publicaciones.tituloNoticia,
        resumenBajada: publicaciones.resumenBajada,
        contenidoCompleto: publicaciones.contenidoCompleto,
        fechaPublicacion: publicaciones.fechaPublicacion,
        urlImagen: publicaciones.urlImagen,
        etiquetas: publicaciones.etiquetas,
        activo: publicaciones.activo,
        idAutor: publicaciones.idAutor,
        nombreAutor: medicos.nombres,
        apellidoAutor: medicos.apellidoPaterno,
      })
      .from(publicaciones)
      .leftJoin(medicos, eq(publicaciones.idAutor, medicos.idMedico))
      .where(whereCondition)
      .orderBy(desc(publicaciones.fechaPublicacion))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      data,
      total: Number(totalCount[0]?.count ?? 0),
      limit,
      offset,
    });
  } catch (error) {
    console.error("Error en GET publicaciones:", error);

    return NextResponse.json(
      { error: "Error al obtener publicaciones" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { error } = await requireApiRole("admin");

  if (error) {
    return error;
  }

  try {
    const body = await request.json();

    const titulo =
      normalizarTexto(body.titulo) ||
      normalizarTexto(body.tituloNoticia);

    const bajada =
      normalizarTexto(body.bajada) ||
      normalizarTexto(body.resumenBajada);

    const contenido =
      normalizarTexto(body.contenido) ||
      normalizarTexto(body.contenidoCompleto);

    const etiquetas = normalizarTexto(body.etiquetas);
    const urlImagen = normalizarTexto(body.urlImagen) || "/logo.png";
    const idAutor = Number(body.idAutor);

    if (!titulo) {
      return NextResponse.json(
        { error: "El título de la publicación es requerido" },
        { status: 400 }
      );
    }

    if (!bajada) {
      return NextResponse.json(
        { error: "La bajada o resumen de la publicación es requerido" },
        { status: 400 }
      );
    }

    if (!contenido) {
      return NextResponse.json(
        { error: "El contenido de la publicación es requerido" },
        { status: 400 }
      );
    }

    if (!Number.isFinite(idAutor) || idAutor <= 0) {
      return NextResponse.json(
        { error: "El autor de la publicación es requerido" },
        { status: 400 }
      );
    }

    const autorExiste = await db
      .select({
        idMedico: medicos.idMedico,
      })
      .from(medicos)
      .where(eq(medicos.idMedico, idAutor))
      .limit(1);

    if (!autorExiste.length) {
      return NextResponse.json(
        { error: "El autor seleccionado no existe" },
        { status: 400 }
      );
    }

    const nueva = await db
      .insert(publicaciones)
      .values({
        tituloNoticia: titulo,
        resumenBajada: bajada,
        contenidoCompleto: contenido,
        idAutor,
        fechaPublicacion: new Date().toISOString().split("T")[0],
        urlImagen,
        etiquetas,
        activo: true,
      })
      .returning({
        idPublicacion: publicaciones.idPublicacion,
        tituloNoticia: publicaciones.tituloNoticia,
        resumenBajada: publicaciones.resumenBajada,
        contenidoCompleto: publicaciones.contenidoCompleto,
        fechaPublicacion: publicaciones.fechaPublicacion,
        urlImagen: publicaciones.urlImagen,
        etiquetas: publicaciones.etiquetas,
        activo: publicaciones.activo,
        idAutor: publicaciones.idAutor,
      });

    if (!nueva.length || !nueva[0]) {
      return NextResponse.json(
        { error: "Error al crear publicación" },
        { status: 500 }
      );
    }

    return NextResponse.json(nueva[0], { status: 201 });
  } catch (error) {
    console.error("Error en POST publicaciones:", error);

    return NextResponse.json(
      { error: "Error al crear publicación" },
      { status: 500 }
    );
  }
}