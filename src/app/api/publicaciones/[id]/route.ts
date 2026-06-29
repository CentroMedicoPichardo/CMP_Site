// src/app/api/publicaciones/[id]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { publicaciones, medicos } from "@/lib/schema/index";
import { and, eq } from "drizzle-orm";
import { requireApiRole } from "@/lib/auth";
import { withUserEmail } from "@/lib/db-with-user";

function normalizarTexto(valor: unknown) {
  return typeof valor === "string" ? valor.trim() : "";
}

function normalizarActivo(valor: unknown) {
  if (typeof valor === "boolean") {
    return valor;
  }

  if (valor === "false") {
    return false;
  }

  if (valor === "true") {
    return true;
  }

  return true;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idPublicacion = Number(id);

    if (!Number.isFinite(idPublicacion) || idPublicacion <= 0) {
      return NextResponse.json(
        { error: "ID de publicación inválido" },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const isAdminRequest = searchParams.get("admin") === "true";

    if (isAdminRequest) {
      const { error } = await requireApiRole("admin");

      if (error) {
        return error;
      }
    }

    const condicion = isAdminRequest
      ? eq(publicaciones.idPublicacion, idPublicacion)
      : and(
          eq(publicaciones.idPublicacion, idPublicacion),
          eq(publicaciones.activo, true)
        );

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
      .where(condicion)
      .limit(1);

    if (!data.length) {
      return NextResponse.json(
        { error: "Publicación no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error("Error en GET publicación:", error);

    return NextResponse.json(
      { error: "Error al obtener publicación" },
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
    const idPublicacion = Number(id);

    if (!Number.isFinite(idPublicacion) || idPublicacion <= 0) {
      return NextResponse.json(
        { error: "ID de publicación inválido" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const publicacionExistente = await db
      .select({
        idPublicacion: publicaciones.idPublicacion,
        fechaPublicacion: publicaciones.fechaPublicacion,
      })
      .from(publicaciones)
      .where(eq(publicaciones.idPublicacion, idPublicacion))
      .limit(1);

    if (!publicacionExistente.length) {
      return NextResponse.json(
        { error: "Publicación no encontrada" },
        { status: 404 }
      );
    }

    const titulo =
      normalizarTexto(body.tituloNoticia) || normalizarTexto(body.titulo);

    const bajada =
      normalizarTexto(body.resumenBajada) || normalizarTexto(body.bajada);

    const contenido =
      normalizarTexto(body.contenidoCompleto) ||
      normalizarTexto(body.contenido);

    const urlImagen =
      normalizarTexto(body.urlImagen) ||
      normalizarTexto(body.imagenSrc) ||
      "/logo.png";

    const etiquetas = normalizarTexto(body.etiquetas);

    const idAutor = Number(body.idAutor);

    const fechaPublicacion =
      normalizarTexto(body.fechaPublicacion) ||
      String(publicacionExistente[0].fechaPublicacion);

    if (!titulo) {
      return NextResponse.json(
        { error: "El título de la publicación es requerido" },
        { status: 400 }
      );
    }

    if (!bajada) {
      return NextResponse.json(
        { error: "La bajada o resumen de la publicación es requerida" },
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

    const userEmail = session.user.correo;

    const actualizada = await withUserEmail(userEmail, async () => {
      return await db
        .update(publicaciones)
        .set({
          tituloNoticia: titulo,
          resumenBajada: bajada,
          contenidoCompleto: contenido,
          idAutor,
          fechaPublicacion,
          urlImagen,
          etiquetas,
          activo: normalizarActivo(body.activo),
        })
        .where(eq(publicaciones.idPublicacion, idPublicacion))
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
    });

    if (!actualizada.length) {
      return NextResponse.json(
        { error: "Publicación no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(actualizada[0]);
  } catch (error) {
    console.error("Error en PUT publicación:", error);

    return NextResponse.json(
      { error: "Error al actualizar publicación" },
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
    const idPublicacion = Number(id);

    if (!Number.isFinite(idPublicacion) || idPublicacion <= 0) {
      return NextResponse.json(
        { error: "ID de publicación inválido" },
        { status: 400 }
      );
    }

    const userEmail = session.user.correo;

    const resultado = await withUserEmail(userEmail, async () => {
      return await db
        .update(publicaciones)
        .set({
          activo: false,
        })
        .where(eq(publicaciones.idPublicacion, idPublicacion))
        .returning({
          idPublicacion: publicaciones.idPublicacion,
          tituloNoticia: publicaciones.tituloNoticia,
          activo: publicaciones.activo,
        });
    });

    if (!resultado.length) {
      return NextResponse.json(
        { error: "Publicación no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Publicación ocultada correctamente",
      publicacion: resultado[0],
    });
  } catch (error) {
    console.error("Error en DELETE publicación:", error);

    return NextResponse.json(
      { error: "Error al ocultar publicación" },
      { status: 500 }
    );
  }
}