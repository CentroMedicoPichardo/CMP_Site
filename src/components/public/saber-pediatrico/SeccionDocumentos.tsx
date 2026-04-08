// src/components/public/saber-pediatrico/SeccionDocumentos.tsx
"use client";

import { CardDocumento } from './CardDocumento';

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

export function SeccionDocumentos({ documentos }: SeccionDocumentosProps) {
  if (documentos.length === 0) return null;

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#0A3D62]">📄 Documentos útiles</h2>
        <div className="h-px flex-1 bg-gradient-to-r from-[#FFC300]/30 to-transparent ml-4"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documentos.map((documento) => (
          <CardDocumento key={documento.id} {...documento} />
        ))}
      </div>
    </section>
  );
}