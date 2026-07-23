"use client";

import Link from "next/link";
import {
  BookOpenCheck,
  CalendarClock,
  CheckCircle2,
  LifeBuoy,
  MessageSquareReply,
  ShoppingBag,
} from "lucide-react";

import type { ResumenDashboardCliente } from "@/types/cliente-dashboard";

interface ResumenCardsProps {
  resumen: ResumenDashboardCliente;
}

export default function ResumenCards({
  resumen,
}: ResumenCardsProps) {
  const tarjetas = [
    {
      label: "Cursos en curso",
      valor: resumen.cursosEnCurso,
      detalle: `${resumen.cursosProximos} próximos`,
      href: "/mis-cursos",
      Icono: BookOpenCheck,
    },
    {
      label: "Cursos completados",
      valor: resumen.cursosCompletados,
      detalle: "Historial académico",
      href: "/mis-cursos",
      Icono: CheckCircle2,
    },
    {
      label: "Compras pendientes",
      valor: resumen.comprasPendientes,
      detalle: "Pagos y validaciones",
      href: "/mis-compras/cursos",
      Icono: ShoppingBag,
    },
    {
      label: "Ayuda pendiente",
      valor: resumen.preguntasPendientes,
      detalle: `${resumen.preguntasAtendidas} atendidas`,
      href: "/ayuda/preguntas",
      Icono: LifeBuoy,
    },
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {tarjetas.map(({
        label,
        valor,
        detalle,
        href,
        Icono,
      }) => (
        <Link
          key={label}
          href={href}
          className="group rounded-2xl border border-gray-200 bg-white p-4 shadow-[0_8px_24px_rgba(10,61,98,0.05)] transition-all hover:-translate-y-0.5 hover:border-[#0A3D62]/20 hover:shadow-[0_14px_30px_rgba(10,61,98,0.09)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300]"
        >
          <div className="flex items-start justify-between gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF2F8] text-[#0A3D62] transition-colors group-hover:bg-[#0A3D62] group-hover:text-[#FFC300]">
              <Icono size={19} strokeWidth={1.9} aria-hidden="true" />
            </span>

            {label === "Ayuda pendiente" && resumen.preguntasAtendidas > 0 ? (
              <MessageSquareReply size={17} className="text-emerald-600" aria-hidden="true" />
            ) : label === "Cursos en curso" && resumen.cursosProximos > 0 ? (
              <CalendarClock size={17} className="text-amber-600" aria-hidden="true" />
            ) : null}
          </div>

          <p className="mt-4 text-2xl font-black text-[#0A3D62]">
            {valor}
          </p>
          <p className="mt-1 text-xs font-extrabold text-gray-700">
            {label}
          </p>
          <p className="mt-1 text-[10px] text-gray-500">
            {detalle}
          </p>
        </Link>
      ))}
    </section>
  );
}
