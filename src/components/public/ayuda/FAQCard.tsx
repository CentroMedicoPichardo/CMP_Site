// src/components/public/ayuda/FAQCard.tsx
"use client";

import { useState } from "react";

interface FAQCardProps {
  pregunta: string;
  respuesta: string;
  categoria?: string;
  vecesUtil: number;
  esDestacada?: boolean;
  onUtilClick?: (esUtil: boolean) => void;
}

export default function FAQCard({ pregunta, respuesta, categoria, vecesUtil, esDestacada, onUtilClick }: FAQCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [valorado, setValorado] = useState(false);

  const handleValoracion = (esUtil: boolean) => {
    
    if (valorado) return;
    setValorado(true);
    onUtilClick?.(esUtil);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {esDestacada && (
            <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 flex-shrink-0">
              Destacada
            </span>
          )}
          <span className="font-medium text-gray-900 truncate">{pregunta}</span>
        </div>
        <svg
          className={`h-5 w-5 flex-shrink-0 text-gray-500 transition-transform ml-3 ${isOpen ? "rotate-180" : ""}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div className="border-t border-gray-100 px-4 py-3">
          <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-line">
            {respuesta}
          </div>
          
          <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-gray-50 pt-3">
            <div className="flex items-center gap-3 text-sm text-gray-500">
              {categoria && (
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                  {categoria}
                </span>
              )}
              <span>{vecesUtil} personas lo encontraron útil</span>
            </div>
            
            {onUtilClick && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleValoracion(true)}
                  disabled={valorado}
                  className={`inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    valorado
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "text-green-700 hover:bg-green-50"
                  }`}
                >
                  <span>👍</span> Útil
                </button>
                <button
                  onClick={() => handleValoracion(false)}
                  disabled={valorado}
                  className={`inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    valorado
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "text-red-700 hover:bg-red-50"
                  }`}
                >
                  <span>👎</span> No útil
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}