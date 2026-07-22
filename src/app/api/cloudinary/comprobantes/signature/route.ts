// src/app/api/cloudinary/comprobantes/signature/route.ts

import {
  and,
  eq,
  inArray,
} from "drizzle-orm";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import {
  getCloudinary,
  getCloudinaryServerConfig,
  getComprobanteFolder,
  getComprobantePublicIdPrefix,
} from "@/lib/cloudinary";
import { db } from "@/lib/db";
import {
  comprasCursos,
  estadosCompra,
} from "@/lib/schema";

const ESTADOS_QUE_ADMITEN_COMPROBANTE = [
  "Pendiente de pago",
  "Pago reportado",
] as const;

type ParametroFirma =
  | string
  | number
  | boolean
  | readonly string[];

type ParametrosFirma = Record<
  string,
  ParametroFirma
>;

function isRecord(
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function parsePositiveId(
  value: string | null
): number | null {
  if (!value) {
    return null;
  }

  const parsed = Number(value);

  return Number.isSafeInteger(parsed) &&
    parsed > 0
    ? parsed
    : null;
}

function normalizarParametrosFirma(
  value: unknown
): ParametrosFirma | null {
  if (!isRecord(value)) {
    return null;
  }

  const result: ParametrosFirma = {};

  for (const [key, item] of Object.entries(
    value
  )) {
    if (
      typeof item === "string" ||
      typeof item === "number" ||
      typeof item === "boolean"
    ) {
      result[key] = item;
      continue;
    }

    if (
      Array.isArray(item) &&
      item.every(
        (entry) =>
          typeof entry === "string"
      )
    ) {
      result[key] = item;
      continue;
    }

    return null;
  }

  return result;
}

function getStringParam(
  params: ParametrosFirma,
  ...names: string[]
): string | null {
  for (const name of names) {
    const value = params[name];

    if (
      typeof value === "string" &&
      value.trim()
    ) {
      return value.trim();
    }
  }

  return null;
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

  const requestUrl = new URL(
    request.url
  );

  const compraId = parsePositiveId(
    requestUrl.searchParams.get(
      "compraId"
    )
  );

  if (!compraId) {
    return NextResponse.json(
      {
        error:
          "El identificador de la compra no es válido",
      },
      { status: 400 }
    );
  }

  try {
    const body: unknown =
      await request.json();

    if (!isRecord(body)) {
      return NextResponse.json(
        {
          error:
            "La solicitud de firma no es válida",
        },
        { status: 400 }
      );
    }

    const paramsToSign =
      normalizarParametrosFirma(
        body.paramsToSign
      );

    if (!paramsToSign) {
      return NextResponse.json(
        {
          error:
            "Los parámetros de Cloudinary no son válidos",
        },
        { status: 400 }
      );
    }

    const [compra] = await db
      .select({
        idCompra:
          comprasCursos.idcompra,
        estado:
          estadosCompra.nombre,
        fechaLimitePago:
          comprasCursos.fechalimitepago,
      })
      .from(comprasCursos)
      .innerJoin(
        estadosCompra,
        eq(
          comprasCursos.idestadocompra,
          estadosCompra.idestadocompra
        )
      )
      .where(
        and(
          eq(
            comprasCursos.idcompra,
            BigInt(compraId)
          ),
          eq(
            comprasCursos.idusuario,
            usuarioId
          ),
          inArray(
            estadosCompra.nombre,
            [
              ...ESTADOS_QUE_ADMITEN_COMPROBANTE,
            ]
          )
        )
      )
      .limit(1);

    if (!compra) {
      return NextResponse.json(
        {
          error:
            "La compra no existe o no admite comprobantes",
        },
        { status: 404 }
      );
    }

    const limitePago = new Date(
      compra.fechaLimitePago
    );

    if (
      Number.isNaN(
        limitePago.getTime()
      ) ||
      limitePago.getTime() <=
        Date.now()
    ) {
      return NextResponse.json(
        {
          error:
            "El plazo para reportar el pago ya venció",
        },
        { status: 409 }
      );
    }

    const expectedFolder =
      getComprobanteFolder(compraId);

    const expectedPrefix =
      getComprobantePublicIdPrefix(
        compraId,
        usuarioId
      );

    const folder = getStringParam(
      paramsToSign,
      "folder",
      "asset_folder"
    );

    const publicId = getStringParam(
      paramsToSign,
      "public_id",
      "publicId"
    );

    if (folder !== expectedFolder) {
      return NextResponse.json(
        {
          error:
            "La carpeta del comprobante no es válida",
        },
        { status: 400 }
      );
    }

    const publicIdWithoutFolder =
      publicId?.startsWith(
        `${expectedFolder}/`
      )
        ? publicId.slice(
            expectedFolder.length + 1
          )
        : publicId;

    if (
      !publicIdWithoutFolder ||
      !publicIdWithoutFolder.startsWith(
        expectedPrefix
      ) ||
      !/^[a-zA-Z0-9_-]+$/.test(
        publicIdWithoutFolder
      )
    ) {
      return NextResponse.json(
        {
          error:
            "El nombre del comprobante no es válido",
        },
        { status: 400 }
      );
    }

    const overwrite =
      paramsToSign.overwrite;

    if (
      overwrite === true ||
      overwrite === "true"
    ) {
      return NextResponse.json(
        {
          error:
            "No está permitido sobrescribir comprobantes",
        },
        { status: 400 }
      );
    }

    const cloudinary =
      getCloudinary();

    const {
      apiSecret,
    } = getCloudinaryServerConfig();

    const signature =
      cloudinary.utils.api_sign_request(
        paramsToSign,
        apiSecret
      );

    return NextResponse.json(
      { signature },
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
      "Error firmando comprobante de Cloudinary:",
      errorValue
    );

    return NextResponse.json(
      {
        error:
          "No fue posible autorizar la carga del comprobante",
      },
      { status: 500 }
    );
  }
}