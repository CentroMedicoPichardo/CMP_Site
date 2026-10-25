"use client";

import { useEffect, useState } from "react";

interface ResumenDocumento {
  version: string;
  resumen: string;
}

const DOCUMENTOS = [
  {
    tipo: "aviso_privacidad",
    titulo: "Aviso de Privacidad",
    href: "/privacidad",
  },
  {
    tipo: "terminos_condiciones",
    titulo: "Términos y Condiciones",
    href: "/terminos",
  },
] as const;

// Resumen corto de cada documento vigente junto a la casilla
// de aceptación del registro. Se muestra en línea (no en un
// modal) y "Ver más" abre el texto completo en otra pestaña
// para no perder lo ya capturado en el formulario.
// Si no se puede cargar, no muestra nada: los enlaces de la
// casilla siguen disponibles.
export function ResumenLegalRegistro() {
  const [resumenes, setResumenes] = useState<
    Record<string, ResumenDocumento>
  >({});

  useEffect(() => {
    const controlador = new AbortController();

    async function cargar() {
      const resultados = await Promise.all(
        DOCUMENTOS.map(async ({ tipo }) => {
          try {
            const respuesta = await fetch(
              `/api/legal/${tipo}`,
              { signal: controlador.signal }
            );

            if (!respuesta.ok) {
              return null;
            }

            const datos =
              (await respuesta.json()) as ResumenDocumento;

            return [tipo, datos] as const;
          } catch {
            return null;
          }
        })
      );

      if (controlador.signal.aborted) {
        return;
      }

      setResumenes(
        Object.fromEntries(
          resultados.filter(
            (resultado) => resultado !== null
          )
        )
      );
    }

    void cargar();

    return () => controlador.abort();
  }, []);

  const disponibles = DOCUMENTOS.filter(
    ({ tipo }) => resumenes[tipo]
  );

  if (disponibles.length === 0) {
    return null;
  }

  return (
    <div className="mt-2 space-y-2 text-[11px] leading-5 text-gray-600">
      {disponibles.map(({ tipo, titulo, href }) => (
        <p key={tipo}>
          <span className="font-bold text-gray-700">
            {titulo} (v{resumenes[tipo].version}):
          </span>{" "}
          {resumenes[tipo].resumen}{" "}
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-[#0A3D62] transition-colors hover:text-[#B88600]"
          >
            Ver más
          </a>
        </p>
      ))}
    </div>
  );
}
