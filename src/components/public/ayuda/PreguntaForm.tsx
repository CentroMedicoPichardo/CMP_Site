// src/components/public/ayuda/PreguntaForm.tsx
"use client";

import { useState, useEffect, FormEvent } from "react";
import { CategoriaAyuda } from "@/types/help";

interface PreguntaFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function PreguntaForm({ onSuccess, onCancel }: PreguntaFormProps) {
  const [categorias, setCategorias] = useState<CategoriaAyuda[]>([]);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [idCategoria, setIdCategoria] = useState<number | undefined>(undefined);
  const [prioridad, setPrioridad] = useState("normal");
  const [esPrivada, setEsPrivada] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      const res = await fetch("/api/soporte/categorias");
      if (res.ok) {
        const data: CategoriaAyuda[] = await res.json();
        setCategorias(data);
      }
    } catch (error) {
      console.error("Error cargando categorías:", error);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!titulo.trim() || !descripcion.trim()) {
      setError("Por favor completa todos los campos requeridos");
      return;
    }

    setLoading(true);

    try {
        // En handleSubmit
        const res = await fetch("/api/soporte/preguntas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // 👈 CLAVE
        body: JSON.stringify({
            titulo: titulo.trim(),
            descripcion: descripcion.trim(),
            idCategoria: idCategoria || undefined,
            prioridad,
            esPrivada,
        }),
        });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al enviar la pregunta");
      }

      setSuccess(true);
      setTitulo("");
      setDescripcion("");
      setIdCategoria(undefined);
      setPrioridad("normal");
      setEsPrivada(false);

      setTimeout(() => {
        setSuccess(false);
        onSuccess?.();
      }, 2000);
    } catch (err: unknown) {
      const mensaje = err instanceof Error ? err.message : "Error al enviar la pregunta";
      setError(mensaje);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
        <svg
          className="mx-auto h-12 w-12 text-green-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-green-800">
          ¡Pregunta enviada con éxito!
        </h3>
        <p className="mt-1 text-sm text-green-600">
          Te notificaremos cuando recibas una respuesta.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Haz tu pregunta
      </h3>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Título */}
        <div>
          <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">
            Título de tu pregunta <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            maxLength={300}
            placeholder="Ej: ¿Cómo agendo una cita con un especialista?"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            required
          />
          <p className="mt-1 text-xs text-gray-500">{titulo.length}/300 caracteres</p>
        </div>

        {/* Categoría */}
        <div>
          <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-1">
            Categoría
          </label>
          <select
            id="categoria"
            value={idCategoria || ""}
            onChange={(e) => setIdCategoria(e.target.value ? Number(e.target.value) : undefined)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="">Selecciona una categoría</option>
            {categorias.map((cat) => (
              <option key={cat.idCategoria} value={cat.idCategoria}>
                {cat.icono} {cat.nombreCategoria}
              </option>
            ))}
          </select>
        </div>

        {/* Descripción */}
        <div>
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
            Descripción detallada <span className="text-red-500">*</span>
          </label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={4}
            placeholder="Describe tu pregunta con el mayor detalle posible para que podamos ayudarte mejor..."
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-y"
            required
          />
        </div>

        {/* Prioridad */}
        <div>
          <label htmlFor="prioridad" className="block text-sm font-medium text-gray-700 mb-1">
            Prioridad
          </label>
          <select
            id="prioridad"
            value={prioridad}
            onChange={(e) => setPrioridad(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="baja">🟢 Baja - No es urgente</option>
            <option value="normal">🟡 Normal</option>
            <option value="alta">🟠 Alta - Necesito respuesta pronto</option>
            <option value="urgente">🔴 Urgente - Es una emergencia</option>
          </select>
        </div>

        {/* Privacidad */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="privada"
            checked={esPrivada}
            onChange={(e) => setEsPrivada(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="privada" className="text-sm text-gray-700">
            Hacer esta pregunta privada (solo yo y el equipo médico podremos verla)
          </label>
        </div>

        {/* Botones */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Enviando...
              </span>
            ) : (
              "Enviar pregunta"
            )}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>
    </form>
  );
}