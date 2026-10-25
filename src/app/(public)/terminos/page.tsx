
import type { Metadata } from "next";

import { DocumentoLegal } from "@/components/public/legal/DocumentoLegal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Términos y Condiciones | Centro Médico Pichardo",
  description:
    "Términos y Condiciones de Uso vigentes de CMP Móvil y del sitio web del Centro Médico Pichardo.",
};

export default function TerminosPage() {
  return <DocumentoLegal tipo="terminos_condiciones" />;
}
