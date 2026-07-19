// src/components/public/ayuda/PreguntaDetalle.tsx
"use client";

import { useState, useEffect, useCallback, FormEvent } from "react";
import { PreguntaUsuario, RespuestaAyuda } from "@/types/help";

interface PreguntaDetalleProps {
  pregunta: PreguntaUsuario;
}

export default function PreguntaDetalle({ pregunta }: PreguntaDetalleProps) {
  const [respuestas, setRespuestas] = useState<RespuestaAyuda[]>([]);
  const [nuevaRespuesta, setNuevaRespuesta] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cargarRespuestas = useCallback(async () => {
    try {
        const res = await fetch(`/api/soporte/preguntas/${pregunta.idPregunta}/respuestas`, {
        credentials: "include", // 👈 CLAVE
        });
      if (res.ok) {
        const data: RespuestaAyuda[] = await res.json();
        setRespuestas(data);
      }
    } catch (error) {
      console.error("Error cargando respuestas:", error);
    }
  }, [pregunta.idPregunta]);

  useEffect(() => {
    cargarRespuestas();
  }, [cargarRespuestas]);

  const handleEnviarRespuesta = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!nuevaRespuesta.trim()) return;

    setLoading(true);
    setError("");

    try {
        const res = await fetch(`/api/soporte/preguntas/${pregunta.idPregunta}/respuestas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // 👈 CLAVE
        body: JSON.stringify({ contenido: nuevaRespuesta.trim() }),
        });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al enviar respuesta");
      }

      setNuevaRespuesta("");
      cargarRespuestas();
    } catch (err: unknown) {
      const mensaje = err instanceof Error ? err.message : "Error al enviar respuesta";
      setError(mensaje);
    } finally {
      setLoading(false);
    }
  };

  const estadoBadge: Record<string, string> = {
    pendiente: "bg-yellow-100 text-yellow-800",
    respondida: "bg-blue-100 text-blue-800",
    cerrada: "bg-gray-100 text-gray-800",
    convertida_faq: "bg-green-100 text-green-800",
  };

  return (
    <div className="space-y-6">
      {/* Pregunta principal */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between mb-3">
          <h2 className="text-xl font-semibold text-gray-900">{pregunta.titulo}</h2>
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${estadoBadge[pregunta.estado] || "bg-gray-100"}`}>
            {pregunta.estado}
          </span>
        </div>
        <p className="text-gray-700 whitespace-pre-line">{pregunta.descripcion}</p>
        <div className="mt-4 flex items-center gap-4 text-sm text-gray-500 border-t pt-3">
          <span>📅 {new Date(pregunta.createdAt).toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })}</span>
          <span>👤 {pregunta.usuario?.nombre} {pregunta.usuario?.apellidoPaterno}</span>
          {pregunta.categoria && <span>📂 {pregunta.categoria.nombreCategoria}</span>}
        </div>
      </div>

      {/* Respuestas */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Respuestas ({respuestas.length})
        </h3>

        {respuestas.length === 0 && pregunta.estado === "pendiente" && (
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
            ⏳ Tu pregunta está pendiente de respuesta. Te notificaremos cuando el equipo médico responda.
          </div>
        )}

        {respuestas.map((respuesta) => (
          <div
            key={respuesta.idRespuesta}
            className={`rounded-lg border p-4 ${
              respuesta.esRespuestaAdmin
                ? "border-blue-200 bg-blue-50"
                : "border-gray-200 bg-white ml-8"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium text-sm">
                {respuesta.usuario?.nombre} {respuesta.usuario?.apellidoPaterno}
              </span>
              {respuesta.esRespuestaAdmin && (
                <span className="inline-flex items-center rounded-full bg-blue-200 px-2 py-0.5 text-xs font-medium text-blue-800">
                  Equipo médico
                </span>
              )}
              {respuesta.esSolucion && (
                <span className="inline-flex items-center rounded-full bg-green-200 px-2 py-0.5 text-xs font-medium text-green-800">
                  ✅ Solución
                </span>
              )}
              <span className="text-xs text-gray-500 ml-auto">
                {new Date(respuesta.createdAt).toLocaleDateString("es-MX", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
            <p className="text-gray-700 text-sm whitespace-pre-line">{respuesta.contenido}</p>
          </div>
        ))}

        {/* Formulario para nueva respuesta */}
        {pregunta.estado !== "cerrada" && pregunta.estado !== "convertida_faq" && (
          <form onSubmit={handleEnviarRespuesta} className="rounded-lg border border-gray-200 bg-white p-4">
            {error && (
              <div className="mb-3 rounded-md bg-red-50 p-2 text-sm text-red-700">{error}</div>
            )}
            <textarea
              value={nuevaRespuesta}
              onChange={(e) => setNuevaRespuesta(e.target.value)}
              rows={3}
              placeholder="Escribe información adicional o una aclaración..."
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-y"
            />
            <div className="mt-2 flex justify-end">
              <button
                type="submit"
                disabled={loading || !nuevaRespuesta.trim()}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Enviando..." : "Enviar mensaje"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}