// src/app/api/saber-pediatrico/[id]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contenidoSaberPediatrico } from "@/lib/schema/index";
import { and, eq, sql } from "drizzle-orm";
import { withUserEmail } from "@/lib/db-with-user";
import { auth, requireApiRole } from "@/lib/auth";

function validarId(id: string) {
  const idNum = Number(id);
  return Number.isInteger(idNum) && idNum > 0 ? idNum : null;
}

function normalizarTexto(valor: unknown, maxLength = 1000) {
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

function obtenerFechaPublicacion(valor: unknown, fechaActual: unknown) {
  const fecha = normalizarTexto(valor, 30);

  if (!fecha) {
    return fechaActual;
  }

  const parsed = new Date(fecha);

  if (Number.isNaN(parsed.getTime())) {
    return fechaActual;
  }

  return fecha.split("T")[0];
}

// GET - Obtener un contenido por ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idContenido = validarId(id);

    if (!idContenido) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const adminRequest = searchParams.get("admin") === "true";

    const session = await auth();
    const esAdmin = session?.user.rol === "admin";

    if (adminRequest && !esAdmin) {
      const { error } = await requireApiRole("admin");

      if (error) {
        return error;
      }
    }

    const puedeVerInactivo = esAdmin || adminRequest;

    const whereCondition = puedeVerInactivo
      ? eq(contenidoSaberPediatrico.id, idContenido)
      : and(
          eq(contenidoSaberPediatrico.id, idContenido),
          eq(contenidoSaberPediatrico.activo, true)
        );

    const data = await db
      .select()
      .from(contenidoSaberPediatrico)
      .where(whereCondition)
      .limit(1);

    if (!data.length) {
      return NextResponse.json(
        { error: "Contenido no encontrado" },
        { status: 404 }
      );
    }

    // Solo incrementa visualizaciones cuando lo consulta público/cliente.
    // No se incrementa cuando es vista de admin.
    if (!puedeVerInactivo) {
      await db
        .update(contenidoSaberPediatrico)
        .set({
          visualizaciones: sql`COALESCE(${contenidoSaberPediatrico.visualizaciones}, 0) + 1`,
        })
        .where(eq(contenidoSaberPediatrico.id, idContenido));
    }

    return NextResponse.json(data[0], {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error en GET contenido por ID:", error);

    return NextResponse.json(
      { error: "Error al obtener contenido" },
      { status: 500 }
    );
  }
}

// PUT - Actualizar contenido
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
    const idContenido = validarId(id);

    if (!idContenido) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const contenidoActual = await db
      .select()
      .from(contenidoSaberPediatrico)
      .where(eq(contenidoSaberPediatrico.id, idContenido))
      .limit(1);

    if (!contenidoActual.length) {
      return NextResponse.json(
        { error: "Contenido no encontrado" },
        { status: 404 }
      );
    }

    const tipo = normalizarTexto(body.tipo, 80);
    const titulo = normalizarTexto(body.titulo, 200);

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

    const updateData: any = {
      tipo,
      titulo,
      descripcion: normalizarTexto(body.descripcion, 500) || null,
      contenido: normalizarTexto(body.contenido, 10000) || null,
      urlExterno: normalizarTexto(body.urlExterno, 500) || null,
      imagenUrl: normalizarTexto(body.imagenUrl, 500) || null,
      videoUrl: normalizarTexto(body.videoUrl, 500) || null,
      archivoUrl: normalizarTexto(body.archivoUrl, 500) || null,
      categoria: normalizarTexto(body.categoria, 120) || null,
      etiquetas: normalizarEtiquetas(body.etiquetas),
      duracion: normalizarTexto(body.duracion, 80) || null,
      fechaPublicacion: obtenerFechaPublicacion(
        body.fechaPublicacion,
        contenidoActual[0].fechaPublicacion
      ),
      destacado: normalizarBooleano(body.destacado, false),
      orden: normalizarNumero(body.orden, 0),
      updatedAt: new Date().toISOString(),
    };

    if (body.activo !== undefined) {
      updateData.activo = normalizarBooleano(body.activo, true);
    }

    const userEmail = session.user.correo;

    const actualizado = await withUserEmail(userEmail, async () => {
      return await db
        .update(contenidoSaberPediatrico)
        .set(updateData)
        .where(eq(contenidoSaberPediatrico.id, idContenido))
        .returning();
    });

    if (!actualizado.length) {
      return NextResponse.json(
        { error: "Contenido no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(actualizado[0]);
  } catch (error) {
    console.error("Error en PUT saber pediátrico:", error);

    return NextResponse.json(
      { error: "Error al actualizar contenido" },
      { status: 500 }
    );
  }
}

// DELETE - Ocultar contenido
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
    const idContenido = validarId(id);

    if (!idContenido) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }

    const userEmail = session.user.correo;

    const ocultado = await withUserEmail(userEmail, async () => {
      return await db
        .update(contenidoSaberPediatrico)
        .set({
          activo: false,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(contenidoSaberPediatrico.id, idContenido))
        .returning({
          id: contenidoSaberPediatrico.id,
          titulo: contenidoSaberPediatrico.titulo,
          activo: contenidoSaberPediatrico.activo,
        });
    });

    if (!ocultado.length) {
      return NextResponse.json(
        { error: "Contenido no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Contenido ocultado correctamente",
      contenido: ocultado[0],
    });
  } catch (error) {
    console.error("Error en DELETE saber pediátrico:", error);

    return NextResponse.json(
      { error: "Error al ocultar contenido" },
      { status: 500 }
    );
  }
}