// src/components/public/ayuda/FAQList.tsx
"use client";

import FAQCard from "./FAQCard";
import { PreguntaFrecuente } from "@/types/help";

interface FAQListProps {
  faqs: PreguntaFrecuente[];
  loading: boolean;
  onValorar: (idPregunta: number, esUtil: boolean) => void;
}

export default function FAQList({ faqs, loading, onValorar }: FAQListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="animate-pulse rounded-lg bg-white p-6 shadow-sm"
          >
            <div className="h-4 w-3/4 rounded bg-gray-200"></div>
          </div>
        ))}
      </div>
    );
  }

  if (faqs.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          No se encontraron resultados
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Intenta con otras palabras o revisa las categorías disponibles
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {faqs.map((faq) => (
        <FAQCard
          key={faq.idPregunta}
          pregunta={faq.pregunta}
          respuesta={faq.respuesta}
          categoria={faq.categoria?.nombreCategoria}
          vecesUtil={faq.vecesUtil}
          esDestacada={faq.esDestacada}
          onUtilClick={(esUtil) => onValorar(faq.idPregunta, esUtil)}
        />
      ))}
    </div>
  );
}