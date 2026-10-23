
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { preferenciasPrivacidad } from "@/lib/schema";
import { requireApiAuth } from "@/lib/auth";

// Derecho ARCO de OPOSICIÓN (opt-out).
// Este endpoint solo guarda y devuelve el estado de las
// preferencias; no aplica las banderas en otros módulos.

const CAMPOS_PREFERENCIAS = [
  "nonEssentialCommunications",
  "analytics",
  "shareProgress",
] as const;

type CampoPreferencia =
  (typeof CAMPOS_PREFERENCIAS)[number];

type Preferencias = Record<
  CampoPreferencia,
  boolean
>;

// Sin registro guardado, todas las banderas
// están en false y updatedAt es null.
const PREFERENCIAS_POR_DEFECTO: Preferencias = {
  nonEssentialCommunications: false,
  analytics: false,
  shareProgress: false,
};

function responder(
  data: unknown,
  status = 200
) {
  return NextResponse.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

// La columna es timestamp sin zona y siempre se
// escribe en UTC; se serializa como ISO 8601.
function aIso(valor: string): string {
  const texto = valor.replace(" ", "T");

  return new Date(
    /(Z|[+-]\d{2}(:?\d{2})?)$/.test(texto)
      ? texto
      : `${texto}Z`
  ).toISOString();
}

function respuestaPreferencias(
  fila:
    | {
        comunicacionesNoEsenciales: boolean;
        analitica: boolean;
        compartirProgreso: boolean;
        updatedAt: string;
      }
    | undefined
) {
  if (!fila) {
    return {
      preferences: PREFERENCIAS_POR_DEFECTO,
      updatedAt: null,
    };
  }

  return {
    preferences: {
      nonEssentialCommunications:
        fila.comunicacionesNoEsenciales,
      analytics: fila.analitica,
      shareProgress: fila.compartirProgreso,
    },
    updatedAt: aIso(fila.updatedAt),
  };
}

export async function GET() {
  const { session, error } =
    await requireApiAuth();

  if (!session) {
    return error ?? responder(
      { message: "No autenticado" },
      401
    );
  }

  try {
    const resultados = await db
      .select()
      .from(preferenciasPrivacidad)
      .where(
        eq(
          preferenciasPrivacidad.usuarioId,
          session.user.id
        )
      )
      .limit(1);

    return responder(
      respuestaPreferencias(resultados[0])
    );
  } catch (error) {
    console.error(
      "Error al consultar preferencias de privacidad:",
      error
    );

    return responder(
      {
        message:
          "No fue posible consultar las preferencias de privacidad",
      },
      500
    );
  }
}

export async function PUT(
  request: Request
) {
  const { session, error } =
    await requireApiAuth();

  if (!session) {
    return error ?? responder(
      { message: "No autenticado" },
      401
    );
  }

  const payload: unknown =
    await request.json().catch(() => null);

  if (
    !payload ||
    typeof payload !== "object" ||
    Array.isArray(payload)
  ) {
    return responder(
      { message: "Datos inválidos" },
      400
    );
  }

  const body =
    payload as Record<string, unknown>;

  const claves = Object.keys(body);

  if (
    claves.length !==
      CAMPOS_PREFERENCIAS.length ||
    CAMPOS_PREFERENCIAS.some(
      (campo) =>
        typeof body[campo] !== "boolean"
    )
  ) {
    return responder(
      {
        message:
          "Debes enviar nonEssentialCommunications, analytics y shareProgress como booleanos",
      },
      400
    );
  }

  const valores = {
    comunicacionesNoEsenciales:
      body.nonEssentialCommunications as boolean,
    analitica: body.analytics as boolean,
    compartirProgreso:
      body.shareProgress as boolean,
    updatedAt: new Date().toISOString(),
  };

  try {
    const guardados = await db
      .insert(preferenciasPrivacidad)
      .values({
        usuarioId: session.user.id,
        ...valores,
      })
      .onConflictDoUpdate({
        target:
          preferenciasPrivacidad.usuarioId,
        set: valores,
      })
      .returning();

    return responder(
      respuestaPreferencias(guardados[0])
    );
  } catch (error) {
    console.error(
      "Error al guardar preferencias de privacidad:",
      error
    );

    return responder(
      {
        message:
          "No fue posible guardar las preferencias de privacidad",
      },
      500
    );
  }
}
