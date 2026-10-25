
import type { ComponentProps } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Container } from "@/components/ui/Container";
import {
  obtenerDocumentoLegalVigente,
  type TipoDocumentoLegal,
} from "@/lib/legal/documentos";

// react-markdown no interpreta HTML crudo, por lo que el
// contenido (texto de la base de datos) no puede inyectar
// marcado ni scripts.
const componentes: ComponentProps<
  typeof ReactMarkdown
>["components"] = {
  h1: (props) => (
    <h1
      className="mb-1 text-3xl font-bold text-[#0A3D62]"
      {...props}
    />
  ),
  h2: (props) => (
    <h2
      className="mb-3 mt-8 text-xl font-bold text-[#0A3D62]"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="mb-2 mt-6 text-base font-bold text-gray-800"
      {...props}
    />
  ),
  p: (props) => (
    <p
      className="mb-3 text-sm leading-7 text-gray-700"
      {...props}
    />
  ),
  ul: (props) => (
    <ul
      className="mb-3 list-disc space-y-1 pl-6 text-sm leading-7 text-gray-700"
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="mb-3 list-decimal space-y-1 pl-6 text-sm leading-7 text-gray-700"
      {...props}
    />
  ),
  strong: (props) => (
    <strong className="font-semibold text-gray-900" {...props} />
  ),
  a: (props) => (
    <a
      className="font-semibold text-[#0A3D62] underline"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  table: (props) => (
    <div className="mb-4 overflow-x-auto">
      <table
        className="min-w-full border-collapse text-left text-sm"
        {...props}
      />
    </div>
  ),
  th: (props) => (
    <th
      className="border border-gray-200 bg-gray-50 px-3 py-2 font-semibold text-gray-800"
      {...props}
    />
  ),
  td: (props) => (
    <td
      className="border border-gray-200 px-3 py-2 align-top text-gray-700"
      {...props}
    />
  ),
};

function formatearFecha(iso: string): string {
  return new Date(iso).toLocaleDateString("es-MX", {
    timeZone: "America/Mexico_City",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Página pública del documento legal vigente. Lee la base
// de datos directamente (misma fuente que GET /api/legal/[tipo]).
export async function DocumentoLegal({
  tipo,
}: {
  tipo: TipoDocumentoLegal;
}) {
  let documento: Awaited<
    ReturnType<typeof obtenerDocumentoLegalVigente>
  >;

  try {
    documento = await obtenerDocumentoLegalVigente(tipo);
  } catch (error) {
    console.error(
      "Error al consultar documento legal:",
      error
    );
  }

  return (
    <main className="bg-white py-10">
      <Container className="max-w-3xl">
        {documento ? (
          <article>
            <p className="mb-6 rounded-xl border border-gray-200 bg-[#F7FAFC] px-4 py-3 text-xs text-gray-600">
              Versión {documento.version} · Vigente desde el{" "}
              {formatearFecha(documento.vigenteDesde)}
            </p>

            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={componentes}
            >
              {documento.contenido}
            </ReactMarkdown>
          </article>
        ) : (
          <p className="rounded-xl border border-gray-200 bg-[#F7FAFC] px-4 py-6 text-sm text-gray-700">
            Este documento no está disponible por el momento.
            Inténtalo de nuevo más tarde.
          </p>
        )}
      </Container>
    </main>
  );
}
