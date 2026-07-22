// src/app/(public)/quienes-somos/page.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  MapPinned,
  PhoneCall,
  Sparkles,
} from "lucide-react";

import { QuienesSomosHeader } from "@/components/public/quienes-somos/QuienesSomosHeader";
import { HistoriaSection } from "@/components/public/quienes-somos/HistoriaSection";
import { MisionVisionValores } from "@/components/public/quienes-somos/MisionVisionValores";
import { EmpresaContacto } from "@/components/public/quienes-somos/EmpresaContacto";
import { MapaUbicacion } from "@/components/public/quienes-somos/MapaUbicacion";
import { RedesSociales } from "@/components/ui/RedesSociales";
import { Container } from "@/components/ui/Container";

interface NosotrosData {
  mision: string;
  vision: string;
  valores: string[];
  nuestraHistoria: string;
  compromiso: string;
  urlImagen: string;
}

interface EmpresaInfo {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  correo: string;
  facebook: string | null;
  instagram: string | null;
  horario: string;
  logoUrl: string | null;
  correoSoporte: string | null;
}

export default function QuienesSomosPage() {
  const [data, setData] = useState<NosotrosData | null>(
    null,
  );

  const [empresaInfo, setEmpresaInfo] =
    useState<EmpresaInfo | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const controlador = new AbortController();

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const [nosotrosRes, empresaRes] =
          await Promise.all([
            fetch("/api/nosotros", {
              signal: controlador.signal,
            }),
            fetch("/api/empresa-info", {
              signal: controlador.signal,
            }),
          ]);

        if (!nosotrosRes.ok) {
          throw new Error(
            "Error al cargar información institucional",
          );
        }

        const nosotrosData: NosotrosData =
          await nosotrosRes.json();

        setData(nosotrosData);

        if (empresaRes.ok) {
          const empresaData: EmpresaInfo =
            await empresaRes.json();

          setEmpresaInfo(empresaData);
        }
      } catch (errorDesconocido) {
        if (
          errorDesconocido instanceof Error &&
          errorDesconocido.name === "AbortError"
        ) {
          return;
        }

        const mensaje =
          errorDesconocido instanceof Error
            ? errorDesconocido.message
            : "No se pudo cargar la información.";

        setError(mensaje);

        console.error(
          "Error cargando datos:",
          errorDesconocido,
        );
      } finally {
        if (!controlador.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      controlador.abort();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F1F6FA] shadow-sm">
            <Loader2
              size={32}
              className="animate-spin text-[#0A3D62]"
              aria-hidden="true"
            />
          </div>

          <p className="text-sm font-semibold text-gray-500">
            Cargando información institucional...
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="w-full max-w-md rounded-2xl border border-red-100 bg-red-50 p-7 text-center shadow-sm">
          <p className="font-semibold text-red-600">
            No se pudo cargar la información. Por favor,
            intenta nuevamente más tarde.
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <QuienesSomosHeader />

      {/* Historia */}
      <HistoriaSection
        historia={data.nuestraHistoria}
        compromiso={data.compromiso}
        imagenSrc={
          data.urlImagen ||
          "/pediatric-illustration.png"
        }
      />

      {/* Misión, visión y valores */}
      <MisionVisionValores
        mision={data.mision}
        vision={data.vision}
        valores={data.valores}
      />

      {/* Contacto y ubicación */}
      <section
        id="info-contacto"
        className="relative overflow-hidden border-t border-gray-200 bg-[#F7FAFC] pb-12 pt-9 sm:pb-14 sm:pt-10 lg:pb-16 lg:pt-12"
        aria-labelledby="contacto-ubicacion-titulo"
      >
        {/* División superior */}
        <div
          className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2"
          aria-hidden="true"
        >
          <div className="h-1 w-20 rounded-full bg-[#FFC300]" />
        </div>

        {/* Decoración de fondo */}
        <div
          className="pointer-events-none absolute -left-24 top-16 h-56 w-56 rounded-full bg-[#FFC300]/10 blur-3xl"
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-[#0A3D62]/10 blur-3xl"
          aria-hidden="true"
        />

        <Container>
          {/* Encabezado general */}
          <div className="relative mx-auto mb-8 max-w-3xl text-center sm:mb-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#0A3D62]/10 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.17em] text-[#0A3D62] shadow-sm sm:text-xs">
              <Sparkles
                size={14}
                className="text-[#D69F00]"
                aria-hidden="true"
              />

              Contacto y ubicación
            </span>

            <h2
              id="contacto-ubicacion-titulo"
              className="mt-4 text-3xl font-extrabold leading-tight text-[#0A3D62] sm:text-4xl"
            >
              Estamos cerca de{" "}
              <span className="relative inline-block">
                <span className="relative z-10">
                  tu familia
                </span>

                <span
                  className="absolute bottom-0.5 left-0 h-2.5 w-full rounded-full bg-[#FFC300]/35"
                  aria-hidden="true"
                />
              </span>
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base">
              Consulta nuestros medios de contacto,
              horarios de atención y ubicación para
              comunicarte o visitarnos fácilmente.
            </p>
          </div>

          {/* Contenido */}
          <div className="relative grid items-stretch gap-6 lg:grid-cols-[minmax(0,5fr)_1px_minmax(0,7fr)] lg:gap-7">
            {/* Información de contacto */}
            <div className="min-w-0">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <PhoneCall
                    size={18}
                    strokeWidth={1.9}
                    aria-hidden="true"
                  />
                </div>

                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-600">
                    Comunicación
                  </span>

                  <h3 className="text-lg font-extrabold text-[#0A3D62]">
                    Información de contacto
                  </h3>
                </div>
              </div>

              <EmpresaContacto
                empresaInfo={empresaInfo}
              />
            </div>

            {/* División entre los componentes */}
            <div
              className="relative h-px w-full bg-gray-200 lg:h-full lg:min-h-[600px] lg:w-px"
              aria-hidden="true"
            >
              <span className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-[#F7FAFC] shadow-sm">
                <span className="h-2.5 w-2.5 rounded-full bg-[#FFC300]" />
              </span>
            </div>

            {/* Mapa */}
            <div className="min-w-0">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                  <MapPinned
                    size={18}
                    strokeWidth={1.9}
                    aria-hidden="true"
                  />
                </div>

                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600">
                    Cómo encontrarnos
                  </span>

                  <h3 className="text-lg font-extrabold text-[#0A3D62]">
                    Ubicación del centro médico
                  </h3>
                </div>
              </div>

              <MapaUbicacion
                direccion={empresaInfo?.direccion}
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Redes sociales */}
      <RedesSociales
        variant="full"
        showText
      />
    </main>
  );
}