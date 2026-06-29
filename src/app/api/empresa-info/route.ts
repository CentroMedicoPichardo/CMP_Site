// src/app/api/empresa-info/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { empresaInfoInClinica } from "@/lib/schema/index";
import { withUserEmail } from "@/lib/db-with-user";
import { eq } from "drizzle-orm";
import { requireApiRole } from "@/lib/auth";

function normalizarTexto(valor: unknown, maxLength = 500) {
  if (typeof valor !== "string") {
    return "";
  }

  return valor.trim().slice(0, maxLength);
}

function normalizarUrl(valor: unknown, maxLength = 1000) {
  const texto = normalizarTexto(valor, maxLength);

  if (!texto) {
    return null;
  }

  return texto;
}

function correoValido(correo: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}

// GET - Obtener información de la empresa
export async function GET() {
  try {
    const resultado = await db
      .select({
        id: empresaInfoInClinica.id,
        nombre: empresaInfoInClinica.nombre,
        direccion: empresaInfoInClinica.direccion,
        telefono: empresaInfoInClinica.telefono,
        correo: empresaInfoInClinica.correo,
        facebook: empresaInfoInClinica.facebook,
        instagram: empresaInfoInClinica.instagram,
        horario: empresaInfoInClinica.horario,
        logoUrl: empresaInfoInClinica.logoUrl,
        correoSoporte: empresaInfoInClinica.correoSoporte,
        createdAt: empresaInfoInClinica.createdAt,
        updatedAt: empresaInfoInClinica.updatedAt,
      })
      .from(empresaInfoInClinica)
      .limit(1);

    if (resultado.length === 0) {
      return NextResponse.json(
        { error: "No se encontró información de la empresa" },
        { status: 404 }
      );
    }

    return NextResponse.json(resultado[0], {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error en GET empresa-info:", error);

    return NextResponse.json(
      { error: "Error al obtener información de la empresa" },
      { status: 500 }
    );
  }
}

// PUT - Actualizar información de la empresa
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

    const nombre = normalizarTexto(body.nombre, 150);
    const direccion = normalizarTexto(body.direccion, 500);
    const telefono = normalizarTexto(body.telefono, 50);
    const correo = normalizarTexto(body.correo, 150).toLowerCase();
    const facebook = normalizarUrl(body.facebook, 500);
    const instagram = normalizarUrl(body.instagram, 500);
    const horario = normalizarTexto(body.horario, 300);
    const logoUrl = normalizarUrl(body.logoUrl, 1000);
    const correoSoporte = normalizarTexto(body.correoSoporte, 150).toLowerCase() || null;

    if (!nombre || !direccion || !telefono || !correo || !horario) {
      return NextResponse.json(
        {
          error:
            "Faltan campos requeridos: nombre, direccion, telefono, correo, horario",
        },
        { status: 400 }
      );
    }

    if (!correoValido(correo)) {
      return NextResponse.json(
        { error: "El correo principal no tiene un formato válido" },
        { status: 400 }
      );
    }

    if (correoSoporte && !correoValido(correoSoporte)) {
      return NextResponse.json(
        { error: "El correo de soporte no tiene un formato válido" },
        { status: 400 }
      );
    }

    const existing = await db
      .select({
        id: empresaInfoInClinica.id,
      })
      .from(empresaInfoInClinica)
      .limit(1);

    const ahora = new Date().toISOString();
    const userEmail = session.user.correo;

    const resultado = await withUserEmail(userEmail, async () => {
      if (existing.length === 0) {
        const nuevo = await db
          .insert(empresaInfoInClinica)
          .values({
            nombre,
            direccion,
            telefono,
            correo,
            facebook,
            instagram,
            horario,
            logoUrl,
            correoSoporte,
            createdAt: ahora,
            updatedAt: ahora,
          })
          .returning();

        return nuevo[0];
      }

      const actualizado = await db
        .update(empresaInfoInClinica)
        .set({
          nombre,
          direccion,
          telefono,
          correo,
          facebook,
          instagram,
          horario,
          logoUrl,
          correoSoporte,
          updatedAt: ahora,
        })
        .where(eq(empresaInfoInClinica.id, existing[0].id))
        .returning();

      return actualizado[0];
    });

    if (!resultado) {
      return NextResponse.json(
        { error: "Error al actualizar información de la empresa" },
        { status: 500 }
      );
    }

    return NextResponse.json(resultado);
  } catch (error) {
    console.error("Error en PUT empresa-info:", error);

    return NextResponse.json(
      { error: "Error interno al actualizar información de la empresa" },
      { status: 500 }
    );
  }
}