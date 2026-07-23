"use client";

import Link from "next/link";
import {
  ArrowRight,
  BellRing,
  CheckCircle2,
  Clock3,
  CreditCard,
  Info,
  LifeBuoy,
} from "lucide-react";

import type { AlertaDashboardCliente } from "@/types/cliente-dashboard";

interface AlertasClienteProps {
  alertas: AlertaDashboardCliente[];
}

const formateador = new Intl.DateTimeFormat("es-MX", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function fecha(valor: string | null): string | null {
  if (!valor) {
    return null;
  }

  const result = new Date(valor);
  return Number.isNaN(result.getTime()) ? null : formateador.format(result);
}

export default function AlertasCliente({
  alertas,
}: AlertasClienteProps) {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-4 shadow-[0_10px_30px_rgba(10,61,98,0.06)] sm:p-5">
      <header className="flex items-center gap-3 border-b border-gray-100 pb-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0A3D62] text-[#FFC300]">
          <BellRing size={18} strokeWidth={1.9} aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-sm font-extrabold text-[#0A3D62] sm:text-base">
            Pendientes importantes
          </h2>
          <p className="mt-0.5 text-[10px] text-gray-500">
            Acciones y actualizaciones que necesitan tu atención.
          </p>
        </div>
      </header>

      {alertas.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-5 text-center">
          <CheckCircle2 size={27} className="mx-auto text-emerald-600" aria-hidden="true" />
          <p className="mt-2 text-sm font-extrabold text-emerald-800">
            Todo está al día
          </p>
          <p className="mt-1 text-[11px] text-emerald-700/80">
            No tienes acciones urgentes en este momento.
          </p>
        </div>
      ) : (
        <div className="mt-4 space-y-2.5">
          {alertas.map((alerta) => {
            const Icono =
              alerta.tipo === "pago"
                ? CreditCard
                : alerta.tipo === "soporte"
                  ? LifeBuoy
                  : alerta.tipo === "curso"
                    ? Clock3
                    : Info;

            const clases =
              alerta.nivel === "warning"
                ? "border-amber-200 bg-amber-50"
                : alerta.nivel === "success"
                  ? "border-emerald-200 bg-emerald-50"
                  : "border-[#0A3D62]/10 bg-[#F7FAFC]";

            return (
              <Link
                key={alerta.id}
                href={alerta.href}
                className={`group flex items-start gap-3 rounded-2xl border px-3.5 py-3 transition-all hover:-translate-y-0.5 ${clases}`}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#0A3D62] shadow-sm">
                  <Icono size={16} strokeWidth={1.9} aria-hidden="true" />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-extrabold text-[#0A3D62]">
                    {alerta.titulo}
                  </span>
                  <span className="mt-1 line-clamp-2 block text-[10px] leading-4 text-gray-600">
                    {alerta.descripcion}
                  </span>
                  <span className="mt-1.5 flex items-center gap-2 text-[9px] font-bold text-gray-400">
                    {fecha(alerta.fecha)}
                    <span className="text-[#0A3D62]">{alerta.accion}</span>
                  </span>
                </span>

                <ArrowRight size={15} className="mt-2 shrink-0 text-gray-400 transition-transform group-hover:translate-x-0.5 group-hover:text-[#0A3D62]" aria-hidden="true" />
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
