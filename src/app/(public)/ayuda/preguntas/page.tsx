// src/app/(public)/ayuda/preguntas/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import PreguntaForm from "@/components/public/ayuda/PreguntaForm";
import MisPreguntasList from "@/components/public/ayuda/MisPreguntasList";
import { PreguntaUsuario } from "@/types/help";

export default function MisPreguntasPage() {
  const router = useRouter();
  const [preguntas, setPreguntas] = useState<PreguntaUsuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);

  const cargarPreguntas = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/soporte/preguntas?mis_preguntas=true", {
        credentials: "include", // 👈 CLAVE: envía las cookies
      });

      if (res.status === 401) {
        router.push("/acceder");
        return;
      }
      if (res.ok) {
        const data: PreguntaUsuario[] = await res.json();
        setPreguntas(data);
      }
    } catch (error) {
      console.error("Error cargando preguntas:", error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    cargarPreguntas();
  }, [cargarPreguntas]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Mis Preguntas</h1>
              <p className="mt-2 text-blue-100">
                Gestiona tus consultas y revisa las respuestas del equipo médico
              </p>
            </div>
            <button
              onClick={() => setMostrarForm(!mostrarForm)}
              className="rounded-md bg-white px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50 transition-colors"
            >
              {mostrarForm ? "Ver mis preguntas" : "✏️ Nueva pregunta"}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {mostrarForm ? (
          <div className="mb-8">
            <PreguntaForm
              onSuccess={() => {
                setMostrarForm(false);
                cargarPreguntas();
              }}
              onCancel={() => setMostrarForm(false)}
            />
          </div>
        ) : (
          <MisPreguntasList preguntas={preguntas} loading={loading} />
        )}
      </div>
    </div>
  );
}