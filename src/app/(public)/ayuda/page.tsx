// src/app/(public)/ayuda/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import HelpHero from "@/components/public/ayuda/HelpHero";
import CategoriasSidebar from "@/components/public/ayuda/CategoriasSidebar";
import FAQList from "@/components/public/ayuda/FAQList";
import { CategoriaAyuda, PreguntaFrecuente } from "@/types/help";

export default function AyudaPage() {
  const router = useRouter();
  const [categorias, setCategorias] = useState<CategoriaAyuda[]>([]);
  const [faqs, setFaqs] = useState<PreguntaFrecuente[]>([]);
  const [categoriaActiva, setCategoriaActiva] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [logueado, setLogueado] = useState<boolean | null>(null); // null = verificando

  // Verificar sesión al cargar
  useEffect(() => {
    verificarSesion();
    cargarCategorias();
    cargarFAQs();
  }, []);

  const verificarSesion = async () => {
    try {
      const res = await fetch("/api/soporte/preguntas?mis_preguntas=true", {
        credentials: "include",
      });
      // Si no es 401, está logueado
      setLogueado(res.status !== 401);
    } catch {
      setLogueado(false);
    }
  };

  const cargarCategorias = async () => {
    try {
      const res = await fetch("/api/soporte/categorias");
      if (!res.ok) throw new Error("Error al cargar categorías");
      const data: CategoriaAyuda[] = await res.json();
      setCategorias(data);
    } catch (error) {
      console.error("Error cargando categorías:", error);
    }
  };

  const cargarFAQs = useCallback(async (categoria?: number | null, query?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (categoria) params.append("categoria", categoria.toString());
      if (query) params.append("busqueda", query);

      const res = await fetch(`/api/soporte/faq?${params.toString()}`);
      if (!res.ok) throw new Error("Error al cargar FAQs");
      const data: PreguntaFrecuente[] = await res.json();
      setFaqs(data);
    } catch (error) {
      console.error("Error cargando FAQs:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = (query: string) => {
    cargarFAQs(categoriaActiva, query);
  };

  const handleCategoriaClick = (idCategoria: number | null) => {
    setCategoriaActiva(idCategoria);
    cargarFAQs(idCategoria);
  };

  const handleValorarFAQ = async (idPregunta: number, esUtil: boolean) => {
    try {
      const res = await fetch(`/api/soporte/faq/${idPregunta}/valorar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ esUtil }),
      });

      if (!res.ok) {
        const data = await res.json();
        if (data.error === "Ya has valorado esta FAQ") return;
        console.error("Error al valorar:", data.error);
        return;
      }

      cargarFAQs(categoriaActiva);
    } catch (error) {
      console.error("Error al valorar FAQ:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HelpHero onSearch={handleSearch} />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Banner de preguntas - CAMBIA SEGÚN SESIÓN */}
        <div className={`mb-8 rounded-lg border p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
          logueado === null 
            ? "bg-gray-50 border-gray-200 animate-pulse" 
            : logueado 
              ? "bg-blue-50 border-blue-200" 
              : "bg-amber-50 border-amber-200"
        }`}>
          {logueado === null ? (
            // Verificando sesión...
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-gray-600">Verificando sesión...</p>
            </div>
          ) : logueado ? (
            // USUARIO LOGUEADO
            <>
              <div>
                <p className="text-sm font-medium text-blue-800">
                  ¿No encuentras lo que buscas?
                </p>
                <p className="text-sm text-blue-600">
                  Haz tu pregunta directamente a nuestro equipo médico
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => router.push("/ayuda/preguntas")}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors whitespace-nowrap"
                >
                  ✏️ Hacer una pregunta
                </button>
              </div>
            </>
          ) : (
            // USUARIO NO LOGUEADO
            <>
              <div>
                <p className="text-sm font-medium text-amber-800">
                  ¿Quieres hacer una pregunta al equipo médico?
                </p>
                <p className="text-sm text-amber-600">
                  Inicia sesión para enviar tus consultas y recibir respuestas personalizadas
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => router.push("/acceder?redirect=/ayuda/preguntas")}
                  className="rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 transition-colors whitespace-nowrap"
                >
                  🔑 Iniciar sesión
                </button>
              </div>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Sidebar - Categorías */}
          <div className="lg:col-span-1">
            <CategoriasSidebar
              categorias={categorias}
              categoriaActiva={categoriaActiva}
              onCategoriaClick={handleCategoriaClick}
            />
          </div>

          {/* Contenido Principal - FAQs */}
          <div className="lg:col-span-3">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Preguntas Frecuentes
              </h2>
            </div>

            <FAQList
              faqs={faqs}
              loading={loading}
              onValorar={handleValorarFAQ}
            />
          </div>
        </div>
      </div>
    </div>
  );
}