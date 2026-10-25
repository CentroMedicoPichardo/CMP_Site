
import { NextResponse } from "next/server";

import {
  esTipoDocumentoLegal,
  obtenerDocumentoLegalVigente,
} from "@/lib/legal/documentos";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{
    tipo: string;
  }>;
}

function responder(
  data: unknown,
  status = 200,
  cacheControl = "no-store"
) {
  return NextResponse.json(data, {
    status,
    headers: {
      "Cache-Control": cacheControl,
    },
  });
}

// Contenido vigente del Aviso de Privacidad o de los
// Términos y Condiciones. Público, sin autenticación.
export async function GET(
  _request: Request,
  { params }: RouteContext
) {
  const { tipo } = await params;

  if (!esTipoDocumentoLegal(tipo)) {
    return responder(
      { message: "Tipo de documento inválido" },
      400
    );
  }

  try {
    const documento =
      await obtenerDocumentoLegalVigente(tipo);

    if (!documento) {
      return responder(
        {
          message:
            "No hay un documento vigente de este tipo",
        },
        404
      );
    }

    return responder(
      documento,
      200,
      "public, max-age=300"
    );
  } catch (error) {
    console.error(
      "Error al consultar documento legal:",
      error
    );

    return responder(
      {
        message:
          "No fue posible consultar el documento",
      },
      500
    );
  }
}
