// src/app/api/saber-pediatrico/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contenidoSaberPediatrico } from "@/lib/schema/index";
import { desc, eq, and, sql, SQL } from "drizzle-orm";
import { withUserEmail } from "@/lib/db-with-user";
import { requireApiRole } from "@/lib/auth";

function normalizarTexto(valor: unknown, maxLength = 255) {
  if (typeof valor !== "string") {
    return "";
  }

  return valor.trim().slice(0, maxLength);
}

function normalizarBooleano(valor: unknown, defaultValue = false) {
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

function normalizarNumero(valor: unknown, defaultValue = 0) {
  const numero = Number(valor);

  if (!Number.isFinite(numero)) {
    return defaultValue;
  }

  return numero;
}

function obtenerLimiteSeguro(valor: string | null) {
  const limit = Number(valor ?? 20);

  if (!Number.isInteger(limit) || limit <= 0) {
    return 20;
  }

  return Math.min(limit, 100);
}

function obtenerOffsetSeguro(valor: string | null) {
  const offset = Number(valor ?? 0);

  if (!Number.isInteger(offset) || offset < 0) {
    return 0;
  }

  return offset;
}

function normalizarEtiquetas(valor: unknown): string[] {
  if (Array.isArray(valor)) {
    return valor
      .filter((item) => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 20);
  }

  if (typeof valor === "string") {
    return valor
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 20);
  }

  return [];
}

function obtenerFechaPublicacion(valor: unknown) {
  const fecha = normalizarTexto(valor, 20);

  if (!fecha) {
    return new Date().toISOString().split("T")[0];
  }

  const parsed = new Date(fecha);

  if (Number.isNaN(parsed.getTime())) {
    return new Date().toISOString().split("T")[0];
  }

  return fecha.split("T")[0];
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const tipo = normalizarTexto(searchParams.get("tipo"), 80);
    const categoria = normalizarTexto(searchParams.get("categoria"), 120);
    const destacado = searchParams.get("destacado");
    const isAdmin = searchParams.get("admin") === "true";

    const limit = obtenerLimiteSeguro(searchParams.get("limit"));
    const offset = obtenerOffsetSeguro(searchParams.get("offset"));

    if (isAdmin) {
      const { error } = await requireApiRole("admin");

      if (error) {
        return error;
      }
    }

    const filters: SQL[] = [];

    if (!isAdmin) {
      filters.push(eq(contenidoSaberPediatrico.activo, true));
    }

    if (tipo && tipo !== "todos") {
      filters.push(eq(contenidoSaberPediatrico.tipo, tipo));
    }

    if (categoria && categoria !== "todas") {
      filters.push(eq(contenidoSaberPediatrico.categoria, categoria));
    }

    if (destacado === "true") {
      filters.push(eq(contenidoSaberPediatrico.destacado, true));
    }

    const whereCondition = filters.length ? and(...filters) : undefined;

    const data = await db
      .select({
        id: contenidoSaberPediatrico.id,
        tipo: contenidoSaberPediatrico.tipo,
        titulo: contenidoSaberPediatrico.titulo,
        descripcion: contenidoSaberPediatrico.descripcion,
        contenido: contenidoSaberPediatrico.contenido,
        urlExterno: contenidoSaberPediatrico.urlExterno,
        imagenUrl: contenidoSaberPediatrico.imagenUrl,
        videoUrl: contenidoSaberPediatrico.videoUrl,
        archivoUrl: contenidoSaberPediatrico.archivoUrl,
        categoria: contenidoSaberPediatrico.categoria,
        etiquetas: contenidoSaberPediatrico.etiquetas,
        duracion: contenidoSaberPediatrico.duracion,
        fechaPublicacion: contenidoSaberPediatrico.fechaPublicacion,
        destacado: contenidoSaberPediatrico.destacado,
        orden: contenidoSaberPediatrico.orden,
        activo: contenidoSaberPediatrico.activo,
      })
      .from(contenidoSaberPediatrico)
      .where(whereCondition)
      .orderBy(
        desc(contenidoSaberPediatrico.destacado),
        desc(contenidoSaberPediatrico.fechaPublicacion)
      )
      .limit(limit)
      .offset(offset);

    const total = await db
      .select({
        count: sql<number>`count(*)::int`,
      })
      .from(contenidoSaberPediatrico)
      .where(whereCondition);

    return NextResponse.json(
      {
        data,
        total: Number(total[0]?.count ?? 0),
        limit,
        offset,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Error en GET saber pediátrico:", error);

    return NextResponse.json(
      { error: "Error al obtener contenido" },
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

    const tipo = normalizarTexto(body.tipo, 80);
    const titulo = normalizarTexto(body.titulo, 200);
    const descripcion = normalizarTexto(body.descripcion, 500) || null;
    const contenido = normalizarTexto(body.contenido, 10000) || null;
    const urlExterno = normalizarTexto(body.urlExterno, 500) || null;
    const imagenUrl = normalizarTexto(body.imagenUrl, 500) || null;
    const videoUrl = normalizarTexto(body.videoUrl, 500) || null;
    const archivoUrl = normalizarTexto(body.archivoUrl, 500) || null;
    const categoria = normalizarTexto(body.categoria, 120) || null;
    const etiquetas = normalizarEtiquetas(body.etiquetas);
    const duracion = normalizarTexto(body.duracion, 80) || null;
    const fechaPublicacion = obtenerFechaPublicacion(body.fechaPublicacion);
    const destacado = normalizarBooleano(body.destacado, false);
    const orden = normalizarNumero(body.orden, 0);

    if (!tipo) {
      return NextResponse.json(
        { error: "El tipo de contenido es requerido" },
        { status: 400 }
      );
    }

    if (!titulo) {
      return NextResponse.json(
        { error: "El título es requerido" },
        { status: 400 }
      );
    }

    const userEmail = session.user.correo;

    const nuevo = await withUserEmail(userEmail, async () => {
      return await db
        .insert(contenidoSaberPediatrico)
        .values({
          tipo,
          titulo,
          descripcion,
          contenido,
          urlExterno,
          imagenUrl,
          videoUrl,
          archivoUrl,
          categoria,
          etiquetas,
          duracion,
          fechaPublicacion,
          destacado,
          orden,
          activo: true,
        })
        .returning({
          id: contenidoSaberPediatrico.id,
          tipo: contenidoSaberPediatrico.tipo,
          titulo: contenidoSaberPediatrico.titulo,
          descripcion: contenidoSaberPediatrico.descripcion,
          contenido: contenidoSaberPediatrico.contenido,
          urlExterno: contenidoSaberPediatrico.urlExterno,
          imagenUrl: contenidoSaberPediatrico.imagenUrl,
          videoUrl: contenidoSaberPediatrico.videoUrl,
          archivoUrl: contenidoSaberPediatrico.archivoUrl,
          categoria: contenidoSaberPediatrico.categoria,
          etiquetas: contenidoSaberPediatrico.etiquetas,
          duracion: contenidoSaberPediatrico.duracion,
          fechaPublicacion: contenidoSaberPediatrico.fechaPublicacion,
          destacado: contenidoSaberPediatrico.destacado,
          orden: contenidoSaberPediatrico.orden,
          activo: contenidoSaberPediatrico.activo,
        });
    });

    if (!nuevo.length || !nuevo[0]) {
      return NextResponse.json(
        { error: "Error al crear contenido" },
        { status: 500 }
      );
    }

    return NextResponse.json(nuevo[0], { status: 201 });
  } catch (error) {
    console.error("Error en POST saber pediátrico:", error);

    return NextResponse.json(
      { error: "Error al crear contenido" },
      { status: 500 }
    );
  }
}