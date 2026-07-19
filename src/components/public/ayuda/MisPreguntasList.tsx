// src/components/public/ayuda/MisPreguntasList.tsx
"use client";

import { useRouter } from "next/navigation";
import { PreguntaUsuario } from "@/types/help";

interface MisPreguntasListProps {
  preguntas: PreguntaUsuario[];
  loading: boolean;
}

const estadoBadge: Record<string, { color: string; label: string }> = {
  pendiente: { color: "bg-yellow-100 text-yellow-800", label: "Pendiente" },
  respondida: { color: "bg-blue-100 text-blue-800", label: "Respondida" },
  cerrada: { color: "bg-gray-100 text-gray-800", label: "Cerrada" },
  convertida_faq: { color: "bg-green-100 text-green-800", label: "Convertida a FAQ" },
};

const prioridadBadge: Record<string, { color: string; label: string }> = {
  baja: { color: "bg-green-50 text-green-700", label: "Baja" },
  normal: { color: "bg-blue-50 text-blue-700", label: "Normal" },
  alta: { color: "bg-orange-50 text-orange-700", label: "Alta" },
  urgente: { color: "bg-red-50 text-red-700", label: "Urgente" },
};

export default function MisPreguntasList({ preguntas, loading }: MisPreguntasListProps) {
  const router = useRouter();

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="animate-pulse rounded-lg bg-white p-6 shadow-sm">
            <div className="h-4 w-3/4 rounded bg-gray-200 mb-3"></div>
            <div className="h-3 w-1/2 rounded bg-gray-200"></div>
          </div>
        ))}
      </div>
    );
  }

  if (preguntas.length === 0) {
    return (
      <div className="rounded-lg bg-white p-8 text-center shadow-sm">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No tienes preguntas aún</h3>
        <p className="mt-1 text-sm text-gray-500">Haz tu primera pregunta y te responderemos pronto.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {preguntas.map((pregunta) => (
        <div
          key={pregunta.idPregunta}
          onClick={() => router.push(`/ayuda/preguntas/${pregunta.idPregunta}`)}
          className="cursor-pointer rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="flex items-start justify-between gap-3 mb-2">
            <h4 className="font-medium text-gray-900 hover:text-blue-600 transition-colors">
              {pregunta.titulo}
            </h4>
            <div className="flex gap-2 flex-shrink-0">
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${estadoBadge[pregunta.estado]?.color || "bg-gray-100 text-gray-800"}`}>
                {estadoBadge[pregunta.estado]?.label || pregunta.estado}
              </span>
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${prioridadBadge[pregunta.prioridad]?.color || "bg-gray-50 text-gray-700"}`}>
                {prioridadBadge[pregunta.prioridad]?.label || pregunta.prioridad}
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2 mb-2">{pregunta.descripcion}</p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{pregunta.categoria?.nombreCategoria || "Sin categoría"}</span>
            <span>{new Date(pregunta.createdAt).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" })}</span>
          </div>
        </div>
      ))}
    </div>
  );
}