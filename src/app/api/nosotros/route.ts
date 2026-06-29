// src/app/api/nosotros/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { nosotros } from "@/lib/schema/index";
import { eq } from "drizzle-orm";
import { withUserEmail } from "@/lib/db-with-user";
import { requireApiRole } from "@/lib/auth";

function normalizarTexto(valor: unknown, maxLength = 5000) {
  if (typeof valor !== "string") {
    return "";
  }

  return valor.trim().slice(0, maxLength);
}

function normalizarUrlImagen(valor: unknown) {
  const urlImagen = normalizarTexto(valor, 1000);

  if (!urlImagen) {
    return "/pediatric-illustration.png";
  }

  return urlImagen;
}

function normalizarValores(valor: unknown): string[] {
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

export async function GET() {
  try {
    const resultado = await db
      .select({
        id: nosotros.id,
        mision: nosotros.mision,
        vision: nosotros.vision,
        valores: nosotros.valores,
        nuestraHistoria: nosotros.nuestraHistoria,
        compromiso: nosotros.compromiso,
        urlImagen: nosotros.urlImagen,
      })
      .from(nosotros)
      .limit(1);

    if (resultado.length === 0) {
      return NextResponse.json(
        { error: "No se encontró información de la sección" },
        { status: 404 }
      );
    }

    return NextResponse.json(resultado[0], {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error en GET nosotros:", error);

    return NextResponse.json(
      { error: "Error interno al obtener los datos" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const { session, error } = await requireApiRole("admin");

  if (error) {
    return error;
  }

  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const mision = normalizarTexto(body.mision, 5000);
    const vision = normalizarTexto(body.vision, 5000);
    const valores = normalizarValores(body.valores);
    const nuestraHistoria = normalizarTexto(body.nuestraHistoria, 10000);
    const compromiso = normalizarTexto(body.compromiso, 5000);
    const urlImagen = normalizarUrlImagen(body.urlImagen);

    const existing = await db
      .select({
        id: nosotros.id,
      })
      .from(nosotros)
      .limit(1);

    const userEmail = session.user.correo;

    const resultado = await withUserEmail(userEmail, async () => {
      if (existing.length === 0) {
        const nuevo = await db
          .insert(nosotros)
          .values({
            mision,
            vision,
            valores,
            nuestraHistoria,
            compromiso,
            urlImagen,
          })
          .returning({
            id: nosotros.id,
            mision: nosotros.mision,
            vision: nosotros.vision,
            valores: nosotros.valores,
            nuestraHistoria: nosotros.nuestraHistoria,
            compromiso: nosotros.compromiso,
            urlImagen: nosotros.urlImagen,
          });

        return nuevo[0];
      }

      const actualizado = await db
        .update(nosotros)
        .set({
          mision,
          vision,
          valores,
          nuestraHistoria,
          compromiso,
          urlImagen,
        })
        .where(eq(nosotros.id, existing[0].id))
        .returning({
          id: nosotros.id,
          mision: nosotros.mision,
          vision: nosotros.vision,
          valores: nosotros.valores,
          nuestraHistoria: nosotros.nuestraHistoria,
          compromiso: nosotros.compromiso,
          urlImagen: nosotros.urlImagen,
        });

      return actualizado[0];
    });

    if (!resultado) {
      return NextResponse.json(
        { error: "Error al actualizar la sección nosotros" },
        { status: 500 }
      );
    }

    return NextResponse.json(resultado);
  } catch (error) {
    console.error("Error en PUT nosotros:", error);

    return NextResponse.json(
      { error: "Error interno al actualizar la sección nosotros" },
      { status: 500 }
    );
  }
}