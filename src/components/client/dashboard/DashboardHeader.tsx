"use client";

import Link from "next/link";
import {
  BookOpenCheck,
  GraduationCap,
  LifeBuoy,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

interface DashboardHeaderProps {
  nombre: string;
}

function saludoActual(): string {
  const hora = new Date().getHours();

  if (hora < 12) {
    return "Buenos días";
  }

  if (hora < 19) {
    return "Buenas tardes";
  }

  return "Buenas noches";
}

export default function DashboardHeader({
  nombre,
}: DashboardHeaderProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-[#0A3D62] px-5 py-6 text-white shadow-[0_20px_50px_rgba(10,61,98,0.18)] sm:px-7 sm:py-8">
      <div
        className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#FFC300]/18 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#FFC300]">
            <Sparkles size={13} aria-hidden="true" />
            Resumen de tu cuenta
          </span>

          <h1 className="mt-4 text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl">
            {saludoActual()}, {nombre}
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70 sm:text-base">
            Revisa tus cursos, compras y solicitudes de ayuda desde un solo lugar.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:min-w-[520px]">
          <AccesoRapido
            href="/cursos"
            icono={GraduationCap}
            texto="Explorar cursos"
          />
          <AccesoRapido
            href="/mis-cursos"
            icono={BookOpenCheck}
            texto="Mis cursos"
          />
          <AccesoRapido
            href="/mis-compras/cursos"
            icono={ShoppingBag}
            texto="Mis compras"
          />
          <AccesoRapido
            href="/ayuda/preguntas"
            icono={LifeBuoy}
            texto="Ayuda"
          />
        </div>
      </div>
    </section>
  );
}

interface AccesoRapidoProps {
  href: string;
  icono: typeof GraduationCap;
  texto: string;
}

function AccesoRapido({
  href,
  icono: Icono,
  texto,
}: AccesoRapidoProps) {
  return (
    <Link
      href={href}
      className="group flex min-h-20 flex-col items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.08] px-3 text-center transition-all hover:-translate-y-0.5 hover:bg-white/14 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300]"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-[#FFC300] transition-colors group-hover:bg-[#FFC300] group-hover:text-[#0A3D62]">
        <Icono size={17} strokeWidth={2} aria-hidden="true" />
      </span>
      <span className="text-[10px] font-extrabold text-white">
        {texto}
      </span>
    </Link>
  );
}
