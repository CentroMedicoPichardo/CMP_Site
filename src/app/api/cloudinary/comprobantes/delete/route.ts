// src/app/api/cloudinary/comprobantes/delete/route.ts

import {
  and,
  eq,
  isNotNull,
} from "drizzle-orm";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import {
  getCloudinary,
  getComprobanteFolder,
  getComprobantePublicIdPrefix,
} from "@/lib/cloudinary";
import { db } from "@/lib/db";
import {
  comprasCursos,
  pagosCursos,
} from "@/lib/schema";

interface DeleteComprobanteInput {
  compraId: number;
  publicId: string;
}

function isRecord(
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function parseInput(
  value: unknown
): DeleteComprobanteInput | null {
  if (!isRecord(value)) {
    return null;
  }

  const compraId = Number(
    value.compraId
  );

  const publicId =
    typeof value.publicId === "string"
      ? value.publicId.trim()
      : "";

  if (
    !Number.isSafeInteger(compraId) ||
    compraId <= 0 ||
    !publicId ||
    publicId.length > 500
  ) {
    return null;
  }

  return {
    compraId,
    publicId,
  };
}

function urlContienePublicId(
  value: string,
  publicId: string
): boolean {
  try {
    const url = new URL(value);

    const decodedPath =
      decodeURIComponent(url.pathname);

    const pathWithoutExtension =
      decodedPath.replace(
        /\.[a-zA-Z0-9]+$/,
        ""
      );

    return (
      pathWithoutExtension.endsWith(
        `/${publicId}`
      ) ||
      pathWithoutExtension.includes(
        `/${publicId}/`
      )
    );
  } catch {
    return false;
  }
}

export async function POST(
  request: Request
) {
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { error: "No autenticado" },
      { status: 401 }
    );
  }

  const usuarioId = Number(
    session.user.id
  );

  if (
    !Number.isSafeInteger(usuarioId) ||
    usuarioId <= 0
  ) {
    return NextResponse.json(
      {
        error:
          "La sesión no contiene un usuario válido",
      },
      { status: 401 }
    );
  }

  try {
    const body: unknown =
      await request.json();

    const input = parseInput(body);

    if (!input) {
      return NextResponse.json(
        {
          error:
            "Los datos del comprobante no son válidos",
        },
        { status: 400 }
      );
    }

    const [compra] = await db
      .select({
        idCompra:
          comprasCursos.idcompra,
      })
      .from(comprasCursos)
      .where(
        and(
          eq(
            comprasCursos.idcompra,
            BigInt(input.compraId)
          ),
          eq(
            comprasCursos.idusuario,
            usuarioId
          )
        )
      )
      .limit(1);

    if (!compra) {
      return NextResponse.json(
        {
          error:
            "Compra no encontrada",
        },
        { status: 404 }
      );
    }

    const expectedFolder =
      getComprobanteFolder(
        input.compraId
      );

    const expectedPrefix =
      getComprobantePublicIdPrefix(
        input.compraId,
        usuarioId
      );

    const publicIdIsAllowed =
      input.publicId.startsWith(
        `${expectedFolder}/${expectedPrefix}`
      ) ||
      input.publicId.startsWith(
        expectedPrefix
      );

    if (!publicIdIsAllowed) {
      return NextResponse.json(
        {
          error:
            "No tienes permiso para eliminar este comprobante",
        },
        { status: 403 }
      );
    }

    const pagosRelacionados =
      await db
        .select({
          rutaComprobante:
            pagosCursos.rutaComprobante,
        })
        .from(pagosCursos)
        .where(
          and(
            eq(
              pagosCursos.idCompra,
              input.compraId
            ),
            isNotNull(
              pagosCursos.rutaComprobante
            )
          )
        );

    const comprobanteRegistrado =
      pagosRelacionados.some(
        (pago) =>
          typeof pago.rutaComprobante ===
            "string" &&
          urlContienePublicId(
            pago.rutaComprobante,
            input.publicId
          )
      );

    if (comprobanteRegistrado) {
      return NextResponse.json(
        {
          error:
            "El comprobante ya está asociado a un pago y no puede eliminarse",
        },
        { status: 409 }
      );
    }

    const cloudinary =
      getCloudinary();

    const resultado =
      await cloudinary.uploader.destroy(
        input.publicId,
        {
          resource_type: "image",
          type: "upload",
          invalidate: true,
        }
      );

    const estado =
      typeof resultado.result ===
        "string"
        ? resultado.result
        : "";

    if (
      estado !== "ok" &&
      estado !== "not found"
    ) {
      throw new Error(
        `Cloudinary devolvió el estado "${estado || "desconocido"}"`
      );
    }

    return NextResponse.json(
      {
        message:
          estado === "not found"
            ? "El comprobante ya no existía"
            : "Comprobante eliminado correctamente",
        deleted: true,
      },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "private, no-store, max-age=0",
        },
      }
    );
  } catch (errorValue: unknown) {
    console.error(
      "Error eliminando comprobante de Cloudinary:",
      errorValue
    );

    return NextResponse.json(
      {
        error:
          "No fue posible eliminar el comprobante",
      },
      { status: 500 }
    );
  }
}