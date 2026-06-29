// src/app/api/saber-pediatrico/upload/route.ts
import { NextResponse } from "next/server";
import { requireApiRole } from "@/lib/auth";

function normalizarTexto(valor: unknown, maxLength = 500) {
  if (typeof valor !== "string") {
    return "";
  }

  return valor.trim().slice(0, maxLength);
}

function validarUrlCloudinary(url: string) {
  try {
    const parsedUrl = new URL(url);

    const esHttps = parsedUrl.protocol === "https:";
    const esCloudinary =
      parsedUrl.hostname === "res.cloudinary.com" ||
      parsedUrl.hostname.endsWith(".res.cloudinary.com");

    return esHttps && esCloudinary;
  } catch {
    return false;
  }
}

function normalizarPublicId(valor: unknown) {
  const publicId = normalizarTexto(valor, 255);

  if (!publicId) {
    return null;
  }

  const esSeguro = /^[a-zA-Z0-9_\-/]+$/.test(publicId);

  return esSeguro ? publicId : null;
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

    const url = normalizarTexto(body.url, 1000);
    const tipo = normalizarTexto(body.tipo, 50) || "archivo";
    const publicId = normalizarPublicId(body.publicId);

    if (!url) {
      return NextResponse.json(
        { error: "No se recibió ninguna URL" },
        { status: 400 }
      );
    }

    if (!validarUrlCloudinary(url)) {
      return NextResponse.json(
        { error: "La URL del archivo no es válida" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        url,
        tipo,
        publicId,
        message: "URL registrada correctamente",
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Error en upload saber pediátrico:", error);

    return NextResponse.json(
      { error: "Error al procesar la URL" },
      { status: 500 }
    );
  }
}