"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  LifeBuoy,
  MessageSquareReply,
  ShoppingBag,
} from "lucide-react";

import type {
  CompraResumenDashboardCliente,
  SoporteResumenDashboardCliente,
} from "@/types/cliente-dashboard";

interface ComprasSoporteResumenProps {
  compras: CompraResumenDashboardCliente[];
  soporte: SoporteResumenDashboardCliente;
}

const fechaFormateador = new Intl.DateTimeFormat("es-MX", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const moneda = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
});

function fecha(valor: string): string {
  const parsed = new Date(valor);
  return Number.isNaN(parsed.getTime()) ? valor : fechaFormateador.format(parsed);
}

export default function ComprasSoporteResumen({
  compras,
  soporte,
}: ComprasSoporteResumenProps) {
  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-gray-200 bg-white p-4 shadow-[0_10px_30px_rgba(10,61,98,0.06)] sm:p-5">
        <header className="flex items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0A3D62] text-[#FFC300]">
              <ShoppingBag size={18} aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-sm font-extrabold text-[#0A3D62]">Compras recientes</h2>
              <p className="mt-0.5 text-[10px] text-gray-500">Estado de tus últimas operaciones.</p>
            </div>
          </div>
          <Link href="/mis-compras/cursos" className="text-[10px] font-extrabold text-[#0A3D62] hover:underline">
            Ver todas
          </Link>
        </header>

        {compras.length === 0 ? (
          <div className="mt-4 rounded-2xl bg-[#F7FAFC] px-4 py-5 text-center text-[11px] text-gray-500">
            Todavía no tienes compras registradas.
          </div>
        ) : (
          <div className="mt-3 divide-y divide-gray-100">
            {compras.map((compra) => {
              const pendiente = ["Pendiente de pago", "Pago reportado", "En validación"].includes(compra.estado);

              return (
                <Link
                  key={compra.idCompra}
                  href={`/mis-compras/cursos/${compra.idCompra}`}
                  className="group flex items-center gap-3 py-3"
                >
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${pendiente ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>
                    {pendiente ? <Clock3 size={16} aria-hidden="true" /> : <CheckCircle2 size={16} aria-hidden="true" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-extrabold text-gray-700 group-hover:text-[#0A3D62]">
                      {compra.tituloCurso}
                    </span>
                    <span className="mt-1 flex flex-wrap gap-x-2 text-[9px] text-gray-500">
                      <span>{compra.folioCompra}</span>
                      <span>{fecha(compra.fechaCompra)}</span>
                      <span className="font-bold text-[#0A3D62]">{compra.estado}</span>
                    </span>
                  </span>
                  <span className="shrink-0 text-xs font-extrabold text-gray-700">
                    {moneda.format(Number(compra.total) || 0)}
                  </span>
                  <ArrowRight size={14} className="shrink-0 text-gray-400 group-hover:text-[#0A3D62]" aria-hidden="true" />
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section className="relative overflow-hidden rounded-3xl border border-[#0A3D62]/15 bg-white p-4 shadow-[0_10px_30px_rgba(10,61,98,0.06)] sm:p-5">
        <div className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full bg-[#FFC300]/12 blur-3xl" aria-hidden="true" />
        <div className="relative flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0A3D62] text-[#FFC300]">
            {soporte.ultimaAtendida ? <MessageSquareReply size={19} aria-hidden="true" /> : <LifeBuoy size={19} aria-hidden="true" />}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-extrabold text-[#0A3D62]">
              {soporte.ultimaAtendida ? "Tu pregunta ha sido atendida" : "Centro de ayuda"}
            </p>
            <p className="mt-1 text-[11px] leading-5 text-gray-500">
              {soporte.ultimaAtendida
                ? soporte.ultimaAtendida.titulo
                : soporte.pendientes > 0
                  ? `${soporte.pendientes} solicitudes siguen en revisión.`
                  : "Consulta preguntas frecuentes o envía una solicitud."}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {soporte.ultimaAtendida && (
                <Link href={`/ayuda/preguntas/${soporte.ultimaAtendida.idPregunta}`} className="inline-flex min-h-9 items-center justify-center rounded-xl bg-[#FFC300] px-3.5 text-[10px] font-extrabold text-[#0A3D62]">
                  Ver respuesta
                </Link>
              )}
              <Link href="/ayuda/preguntas" className="inline-flex min-h-9 items-center justify-center rounded-xl border border-[#0A3D62]/15 bg-white px-3.5 text-[10px] font-extrabold text-[#0A3D62]">
                Mis preguntas
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
