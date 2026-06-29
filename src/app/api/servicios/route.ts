// src/app/api/servicios/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { servicios } from "@/lib/schema/index";
import { asc, eq } from "drizzle-orm";
import { withUserEmail } from "@/lib/db-with-user";
import { requireApiRole } from "@/lib/auth";

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

    const query = db
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
      .orderBy(asc(servicios.tituloServicio));

    if (!isAdmin) {
      const data = await query.where(eq(servicios.activo, true));
      return NextResponse.json(data);
    }

    const data = await query;
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error en GET servicios:", error);

    return NextResponse.json(
      { error: "Error al obtener servicios" },
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

    const nuevo = await withUserEmail(userEmail, async () => {
      return await db
        .insert(servicios)
        .values({
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
          activo: true,
        })
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

    if (!nuevo.length || !nuevo[0]) {
      return NextResponse.json(
        { error: "Error al crear servicio" },
        { status: 500 }
      );
    }

    return NextResponse.json(nuevo[0], { status: 201 });
  } catch (error) {
    console.error("Error en POST servicio:", error);

    return NextResponse.json(
      { error: "Error al crear servicio" },
      { status: 500 }
    );
  }
}