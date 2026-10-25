
import type { Metadata } from "next";

import { DocumentoLegal } from "@/components/public/legal/DocumentoLegal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Aviso de Privacidad | Centro Médico Pichardo",
  description:
    "Aviso de Privacidad vigente de CMP Móvil y del sitio web del Centro Médico Pichardo.",
};

export default function PrivacidadPage() {
  return <DocumentoLegal tipo="aviso_privacidad" />;
}
