
import { and, eq, inArray } from "drizzle-orm";

import { db } from "@/lib/db";
import { documentosLegales } from "@/lib/schema";

export const TIPOS_DOCUMENTO_LEGAL = [
  "aviso_privacidad",
  "terminos_condiciones",
] as const;

export type TipoDocumentoLegal =
  (typeof TIPOS_DOCUMENTO_LEGAL)[number];

export function esTipoDocumentoLegal(
  valor: string
): valor is TipoDocumentoLegal {
  return (TIPOS_DOCUMENTO_LEGAL as readonly string[]).includes(
    valor
  );
}

// La columna es timestamp sin zona y se maneja en UTC;
// se serializa como ISO 8601.
function aIso(valor: string): string {
  const texto = valor.replace(" ", "T");

  return new Date(
    /(Z|[+-]\d{2}(:?\d{2})?)$/.test(texto)
      ? texto
      : `${texto}Z`
  ).toISOString();
}

// Documento vigente (activo) de un tipo, o undefined.
// El índice único parcial garantiza uno solo por tipo.
export async function obtenerDocumentoLegalVigente(
  tipo: TipoDocumentoLegal
) {
  const [documento] = await db
    .select({
      version: documentosLegales.version,
      resumen: documentosLegales.resumen,
      contenido: documentosLegales.contenido,
      vigenteDesde: documentosLegales.vigenteDesde,
    })
    .from(documentosLegales)
    .where(
      and(
        eq(documentosLegales.tipo, tipo),
        eq(documentosLegales.activo, true)
      )
    )
    .limit(1);

  if (!documento) {
    return undefined;
  }

  return {
    tipo,
    version: documento.version,
    resumen: documento.resumen,
    contenido: documento.contenido,
    vigenteDesde: aIso(documento.vigenteDesde),
  };
}

// IDs de los documentos vigentes de ambos tipos.
export async function obtenerDocumentosLegalesVigentes() {
  return db
    .select({
      idDocumento: documentosLegales.idDocumento,
      tipo: documentosLegales.tipo,
    })
    .from(documentosLegales)
    .where(
      and(
        inArray(documentosLegales.tipo, [
          ...TIPOS_DOCUMENTO_LEGAL,
        ]),
        eq(documentosLegales.activo, true)
      )
    );
}
