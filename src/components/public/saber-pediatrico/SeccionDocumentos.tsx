"use client";

import { FileArchive } from "lucide-react";
import { CardDocumento } from "./CardDocumento";

interface Documento {
  id: number;
  titulo: string;
  descripcion: string;
  archivoUrl: string;
  fechaPublicacion: string;
}

interface SeccionDocumentosProps {
  documentos: Documento[];
}

export function SeccionDocumentos({
  documentos,
}: SeccionDocumentosProps) {
  if (documentos.length === 0) {
    return null;
  }

  return (
    <section className="mt-8 border-t border-gray-200 pt-8 sm:mt-10 sm:pt-9 lg:mt-5 lg:pt-10">
      {/* Detalle verde sobre la línea separadora */}
      <div className="relative -top-[35px] flex justify-center sm:-top-[39px] lg:-top-[43px]">
        <div className="h-1 w-20 rounded-full bg-emerald-600" />
      </div>

      {/* Encabezado */}
      <div className="mb-7 sm:mb-9">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            {/* Icono */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md sm:h-14 sm:w-14">
              <FileArchive
                size={27}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </div>

            {/* Título y descripción */}
            <div className="min-w-0">
              <span className="mb-1 block text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
                Material para consultar
              </span>

              <h2 className="text-2xl font-extrabold leading-tight text-[#0A3D62] sm:text-3xl lg:text-4xl">
                Documentos útiles
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-500 sm:text-base">
                Consulta guías, materiales informativos y recursos
                preparados para apoyar el cuidado y bienestar infantil.
              </p>
            </div>
          </div>

          {/* Contador */}
          <div className="inline-flex w-fit shrink-0 items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
            {documentos.length}{" "}
            {documentos.length === 1
              ? "documento"
              : "documentos"}
          </div>
        </div>

        {/* Línea verde debajo del encabezado */}
        <div className="mt-6 flex items-center gap-3">
          <div className="h-1 w-16 shrink-0 rounded-full bg-emerald-600" />

          <div className="h-px flex-1 bg-gradient-to-r from-emerald-300 via-gray-200 to-transparent" />
        </div>
      </div>

      {/* Tarjetas */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {documentos.map((documento) => (
          <CardDocumento
            key={documento.id}
            {...documento}
          />
        ))}
      </div>
    </section>
  );
}