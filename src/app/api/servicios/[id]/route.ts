// src/app/api/servicios/[id]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { servicios } from "@/lib/schema/index";
import { and, eq } from "drizzle-orm";
import { withUserEmail } from "@/lib/db-with-user";
import { auth, requireApiRole } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idServicio = Number(id);

    if (!Number.isFinite(idServicio) || idServicio <= 0) {
      return NextResponse.json(
        { error: "ID de servicio inválido" },
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
      ? eq(servicios.idServicio, idServicio)
      : and(eq(servicios.idServicio, idServicio), eq(servicios.activo, true));

    const servicio = await db
      .select({
        idServicio: servicios.idServicio,
        tituloServicio: servicios.tituloServicio,
        descripcion: servicios.descripcion,
        ubicacion: servicios.ubicacion,
        urlImage: servicios.urlImage,
        textoAlt: servicios.textoAlt,
        disenoTipo: servicios.disenoTipo,
        activo: servicios.activo,
      })
      .from(servicios)
      .where(condicion)
      .limit(1);

    if (!servicio.length) {
      return NextResponse.json(
        { error: "Servicio no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(servicio[0]);
  } catch (error) {
    console.error("Error en GET servicio:", error);

    return NextResponse.json(
      { error: "Error al obtener servicio" },
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
    const idServicio = Number(id);

    if (!Number.isFinite(idServicio) || idServicio <= 0) {
      return NextResponse.json(
        { error: "ID de servicio inválido" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const tituloServicio =
      typeof body.tituloServicio === "string"
        ? body.tituloServicio.trim()
        : "";

    const descripcion =
      typeof body.descripcion === "string" ? body.descripcion.trim() : "";

    if (!tituloServicio) {
      return NextResponse.json(
        { error: "El título del servicio es requerido" },
        { status: 400 }
      );
    }

    if (!descripcion) {
      return NextResponse.json(
        { error: "La descripción del servicio es requerida" },
        { status: 400 }
      );
    }

    const userEmail = session.user.correo;

    const actualizado = await withUserEmail(userEmail, async () => {
      return await db
        .update(servicios)
        .set({
          tituloServicio,
          descripcion,
          ubicacion:
            typeof body.ubicacion === "string" && body.ubicacion.trim()
              ? body.ubicacion.trim()
              : null,
          urlImage:
            typeof body.urlImage === "string" && body.urlImage.trim()
              ? body.urlImage.trim()
              : "/default-service.jpg",
          textoAlt:
            typeof body.textoAlt === "string" && body.textoAlt.trim()
              ? body.textoAlt.trim()
              : tituloServicio,
          disenoTipo:
            typeof body.disenoTipo === "string" && body.disenoTipo.trim()
              ? body.disenoTipo.trim()
              : "vertical",
          activo:
            typeof body.activo === "boolean"
              ? body.activo
              : body.activo === "false"
                ? false
                : true,
        })
        .where(eq(servicios.idServicio, idServicio))
        .returning({
          idServicio: servicios.idServicio,
          tituloServicio: servicios.tituloServicio,
          descripcion: servicios.descripcion,
          ubicacion: servicios.ubicacion,
          urlImage: servicios.urlImage,
          textoAlt: servicios.textoAlt,
          disenoTipo: servicios.disenoTipo,
          activo: servicios.activo,
        });
    });

    if (!actualizado.length) {
      return NextResponse.json(
        { error: "Servicio no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(actualizado[0]);
  } catch (error) {
    console.error("Error en PUT servicio:", error);

    return NextResponse.json(
      { error: "Error al actualizar servicio" },
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
    const idServicio = Number(id);

    if (!Number.isFinite(idServicio) || idServicio <= 0) {
      return NextResponse.json(
        { error: "ID de servicio inválido" },
        { status: 400 }
      );
    }

    const userEmail = session.user.correo;

    const resultado = await withUserEmail(userEmail, async () => {
      return await db
        .update(servicios)
        .set({
          activo: false,
        })
        .where(eq(servicios.idServicio, idServicio))
        .returning({
          idServicio: servicios.idServicio,
          tituloServicio: servicios.tituloServicio,
          activo: servicios.activo,
        });
    });

    if (!resultado.length) {
      return NextResponse.json(
        { error: "Servicio no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Servicio desactivado correctamente",
      servicio: resultado[0],
    });
  } catch (error) {
    console.error("Error en DELETE servicio:", error);

    return NextResponse.json(
      { error: "Error al desactivar servicio" },
      { status: 500 }
    );
  }
}