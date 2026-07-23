"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  FileQuestion,
  ShieldCheck,
} from "lucide-react";
import PreguntaForm from "@/components/public/ayuda/PreguntaForm";

export default function NuevaPreguntaAyuda() {
  const router = useRouter();

  const volver = () => {
    router.push("/ayuda/preguntas");
  };

  return (
    <main className="min-h-screen bg-[#F7FAFC]">
      <section className="relative overflow-hidden bg-[#0A3D62] text-white">
        <div
          className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#FFC300]/15 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <button
            type="button"
            onClick={volver}
            className="group inline-flex min-h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.06] px-3 text-xs font-bold text-white/75 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300]"
          >
            <ArrowLeft
              size={15}
              className="transition-transform group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
            Volver a mis preguntas
          </button>

          <div className="mt-6 flex items-start gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#FFC300] text-[#0A3D62] shadow-[0_12px_30px_rgba(0,0,0,0.18)]">
              <FileQuestion
                size={27}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </span>

            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.13em] text-[#FFC300]">
                <ShieldCheck
                  size={11}
                  aria-hidden="true"
                />
                Soporte personalizado
              </span>

              <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                Nueva pregunta
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">
                Describe tu consulta y el equipo podrá darle
                seguimiento desde la bandeja de soporte.
              </p>
            </div>
          </div>
        </div>

        <div
          className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-[#FFC300] to-transparent"
          aria-hidden="true"
        />
      </section>

      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <PreguntaForm
          onSuccess={() => {
            router.push("/ayuda/preguntas");
            router.refresh();
          }}
          onCancel={volver}
        />
      </div>
    </main>
  );
}
