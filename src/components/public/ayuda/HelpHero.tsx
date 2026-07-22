"use client";

import {
  BookOpenCheck,
  CircleHelp,
  LifeBuoy,
  MessageSquareText,
  ShieldCheck,
} from "lucide-react";

import SearchBar from "./SearchBar";

interface HelpHeroProps {
  onSearch: (query: string) => void;
}

export default function HelpHero({
  onSearch,
}: HelpHeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#0A3D62] text-white">
      {/* Decoración */}
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#FFC300]/15 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-white/10 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.045]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "38px 38px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        <div className="mx-auto max-w-4xl text-center">
          {/* Distintivo */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 backdrop-blur-sm">
            <LifeBuoy
              size={14}
              className="text-[#FFC300]"
              strokeWidth={2}
              aria-hidden="true"
            />

            <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-white">
              Soporte y orientación
            </span>
          </div>

          {/* Icono principal */}
          <div className="relative mx-auto mt-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFC300] text-[#0A3D62] shadow-[0_14px_35px_rgba(0,0,0,0.18)]">
            <div
              className="absolute inset-2 rounded-xl bg-white/30 blur-lg"
              aria-hidden="true"
            />

            <CircleHelp
              size={31}
              strokeWidth={1.9}
              className="relative"
              aria-hidden="true"
            />
          </div>

          {/* Texto */}
          <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            Centro de Ayuda
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-white/75 sm:text-base sm:leading-7">
            Encuentra respuestas rápidas, consulta preguntas
            frecuentes o envía una solicitud a nuestro equipo
            de soporte.
          </p>

          {/* Buscador */}
          <div className="mx-auto mt-7 max-w-2xl rounded-2xl border border-white/15 bg-white/10 p-2 shadow-[0_18px_45px_rgba(0,0,0,0.14)] backdrop-blur-sm">
            <SearchBar
              placeholder="¿En qué podemos ayudarte?"
              onSearch={onSearch}
            />
          </div>

          {/* Opciones informativas */}
          <div className="mx-auto mt-6 grid max-w-3xl gap-2.5 sm:grid-cols-3">
            <HeroInfo
              icono={BookOpenCheck}
              titulo="Preguntas frecuentes"
              descripcion="Consulta soluciones inmediatas"
            />

            <HeroInfo
              icono={MessageSquareText}
              titulo="Soporte personalizado"
              descripcion="Envía una pregunta al equipo"
            />

            <HeroInfo
              icono={ShieldCheck}
              titulo="Información segura"
              descripcion="Protegemos tus consultas"
            />
          </div>
        </div>
      </div>

      {/* Separador inferior */}
      <div
        className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-[#FFC300] to-transparent"
        aria-hidden="true"
      />
    </section>
  );
}

interface HeroInfoProps {
  icono: typeof CircleHelp;
  titulo: string;
  descripcion: string;
}

function HeroInfo({
  icono: Icono,
  titulo,
  descripcion,
}: HeroInfoProps) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.07] px-3 py-2.5 text-left backdrop-blur-sm transition-colors hover:bg-white/10">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[#FFC300]">
        <Icono
          size={17}
          strokeWidth={1.9}
          aria-hidden="true"
        />
      </span>

      <span className="min-w-0">
        <span className="block text-[11px] font-extrabold text-white">
          {titulo}
        </span>

        <span className="mt-0.5 block truncate text-[9px] text-white/60">
          {descripcion}
        </span>
      </span>
    </div>
  );
}