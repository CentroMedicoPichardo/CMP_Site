// src/app/(public)/ayuda/preguntas/[id]/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import PreguntaDetalle from "@/components/public/ayuda/PreguntaDetalle";
import { PreguntaUsuario } from "@/types/help";

export default function PreguntaDetallePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [pregunta, setPregunta] = useState<PreguntaUsuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cargarPregunta = useCallback(async () => {
    setLoading(true);
    setError("");
    
    try {
    const res = await fetch(`/api/soporte/preguntas/${id}`, {
    credentials: "include", // 👈 ENVÍA LAS COOKIES
    });
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      
      if (res.status === 404) {
        setError("Pregunta no encontrada");
        return;
      }
      
      if (!res.ok) throw new Error("Error al cargar la pregunta");
      
      const data: PreguntaUsuario = await res.json();
      setPregunta(data);
    } catch (err: unknown) {
      const mensaje = err instanceof Error ? err.message : "Error al cargar la pregunta";
      setError(mensaje);
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    cargarPregunta();
  }, [cargarPregunta]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error || !pregunta) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <h2 className="text-xl font-semibold text-gray-900">Error</h2>
          <p className="mt-2 text-gray-600">{error || "Pregunta no encontrada"}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            ← Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
          <button
            onClick={() => router.push("/ayuda/preguntas")}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            ← Volver a mis preguntas
          </button>
        </div>
      </div>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <PreguntaDetalle pregunta={pregunta} />
      </div>
    </div>
  );
}