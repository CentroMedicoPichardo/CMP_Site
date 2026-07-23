"use client";

import useSWR from "swr";
import {
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";

import AlertasCliente from "./AlertasCliente";
import ComprasSoporteResumen from "./ComprasSoporteResumen";
import CursosRecientesCarousel from "./CursosRecientesCarousel";
import DashboardHeader from "./DashboardHeader";
import MisCursosResumen from "./MisCursosResumen";
import ResumenCards from "./ResumenCards";
import type { ClienteDashboardResponse } from "@/types/cliente-dashboard";

interface ApiErrorResponse {
  error?: string;
  message?: string;
}

async function fetcher(url: string): Promise<ClienteDashboardResponse> {
  const response = await fetch(url, {
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    let mensaje = "No fue posible cargar el dashboard.";

    try {
      const data = (await response.json()) as ApiErrorResponse;
      mensaje = data.error || data.message || mensaje;
    } catch {
      // Se conserva el mensaje predeterminado.
    }

    throw new Error(mensaje);
  }

  return (await response.json()) as ClienteDashboardResponse;
}

export default function ClienteDashboard() {
  const { data, error, isLoading, mutate } = useSWR<ClienteDashboardResponse>(
    "/api/cliente/dashboard",
    fetcher,
    {
      revalidateOnFocus: true,
      dedupingInterval: 30_000,
    },
  );

  if (isLoading && !data) {
    return <DashboardSkeleton />;
  }

  if (error || !data) {
    return (
      <main className="min-h-screen bg-[#F7FAFC] px-4 py-10 sm:px-6 lg:px-8">
        <section className="mx-auto max-w-xl rounded-3xl border border-red-200 bg-white p-6 text-center shadow-[0_16px_45px_rgba(10,61,98,0.09)]">
          <AlertCircle size={34} className="mx-auto text-red-600" aria-hidden="true" />
          <h1 className="mt-3 text-xl font-extrabold text-[#0A3D62]">
            No pudimos cargar tu resumen
          </h1>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            {error instanceof Error ? error.message : "Intenta nuevamente en unos momentos."}
          </p>
          <button
            type="button"
            onClick={() => void mutate()}
            className="mx-auto mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#0A3D62] px-4 text-xs font-extrabold text-white transition-colors hover:bg-[#FFC300] hover:text-[#0A3D62]"
          >
            <RefreshCw size={15} aria-hidden="true" />
            Reintentar
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7FAFC]">
      <div className="mx-auto max-w-7xl space-y-5 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <DashboardHeader nombre={data.usuario.nombre} />
        <ResumenCards resumen={data.resumen} />

        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.8fr)]">
          <MisCursosResumen cursos={data.misCursos} />
          <AlertasCliente alertas={data.alertas} />
        </div>

        <CursosRecientesCarousel cursos={data.cursosRecientes} />

        <ComprasSoporteResumen
          compras={data.comprasRecientes}
          soporte={data.soporte}
        />
      </div>
    </main>
  );
}

function DashboardSkeleton() {
  return (
    <main className="min-h-screen bg-[#F7FAFC] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-5" role="status" aria-live="polite">
        <div className="flex min-h-64 animate-pulse items-center justify-center rounded-3xl bg-[#0A3D62] text-white/70">
          <div className="text-center">
            <Loader2 size={28} className="mx-auto animate-spin" aria-hidden="true" />
            <p className="mt-3 text-xs font-bold">Preparando tu dashboard</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-36 animate-pulse rounded-2xl border border-gray-200 bg-white" />
          ))}
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <div className="h-96 animate-pulse rounded-3xl border border-gray-200 bg-white" />
          <div className="h-96 animate-pulse rounded-3xl border border-gray-200 bg-white" />
        </div>

        <span className="sr-only">Cargando dashboard...</span>
      </div>
    </main>
  );
}
