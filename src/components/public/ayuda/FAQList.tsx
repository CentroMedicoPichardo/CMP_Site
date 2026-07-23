"use client";

import { CircleHelp, SearchX } from "lucide-react";
import type { PreguntaFrecuente } from "@/types/help";
import FAQCard from "./FAQCard";

interface FAQListProps {
  faqs: PreguntaFrecuente[];
  loading: boolean;
  estaAutenticado: boolean;
  onValorar: (idPregunta: number, esUtil: boolean) => Promise<void> | void;
}

export default function FAQList({ faqs, loading, estaAutenticado, onValorar }: FAQListProps) {
  if (loading) {
    return <div className="space-y-3" role="status" aria-label="Cargando preguntas frecuentes">{Array.from({ length: 5 }).map((_, index) => <div key={index} className="h-20 animate-pulse rounded-2xl border border-gray-200 bg-white" />)}<span className="sr-only">Cargando preguntas frecuentes...</span></div>;
  }

  if (!Array.isArray(faqs) || faqs.length === 0) {
    return <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-5 py-10 text-center shadow-sm"><SearchX size={27} className="mx-auto text-[#0A3D62]" /><h2 className="mt-4 text-lg font-extrabold text-[#0A3D62]">No se encontraron preguntas</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">No hay resultados que coincidan con la búsqueda o categoría seleccionada.</p></div>;
  }

  return <section className="min-w-0" aria-label="Lista de preguntas frecuentes"><div className="space-y-3">{faqs.map((faq) => <FAQCard key={faq.idPregunta} pregunta={faq.pregunta?.trim() || "Pregunta frecuente"} respuesta={faq.respuesta?.trim() || "La respuesta todavía no está disponible."} categoria={faq.categoria?.nombreCategoria?.trim() || undefined} vecesUtil={Math.max(Number(faq.vecesUtil) || 0, 0)} vecesNoUtil={Math.max(Number(faq.vecesNoUtil) || 0, 0)} esDestacada={Boolean(faq.esDestacada)} estaAutenticado={estaAutenticado} valoracionUsuario={faq.valoracionUsuario ?? null} onUtilClick={(esUtil) => onValorar(faq.idPregunta, esUtil)} />)}</div><div className="mt-4 flex items-start gap-2.5 rounded-xl border border-[#0A3D62]/10 bg-white px-3.5 py-3 shadow-sm"><CircleHelp size={16} className="mt-0.5 shrink-0 text-[#0A3D62]" /><p className="text-[11px] leading-5 text-gray-500">Selecciona una pregunta para consultar su respuesta. Cada usuario puede registrar una sola valoración.</p></div></section>;
}
