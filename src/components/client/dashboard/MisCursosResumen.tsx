"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  CalendarDays,
  Clock3,
  UserRound,
} from "lucide-react";

import type { CursoResumenDashboardCliente } from "@/types/cliente-dashboard";

interface MisCursosResumenProps {
  cursos: CursoResumenDashboardCliente[];
}

const formateador = new Intl.DateTimeFormat("es-MX", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function fecha(valor: string): string {
  const result = new Date(`${valor}T00:00:00`);
  return Number.isNaN(result.getTime()) ? valor : formateador.format(result);
}

export default function MisCursosResumen({
  cursos,
}: MisCursosResumenProps) {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-4 shadow-[0_10px_30px_rgba(10,61,98,0.06)] sm:p-5">
      <header className="flex items-center justify-between gap-3 border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0A3D62] text-[#FFC300]">
            <BookOpenCheck size={18} strokeWidth={1.9} aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-sm font-extrabold text-[#0A3D62] sm:text-base">
              Mis cursos
            </h2>
            <p className="mt-0.5 text-[10px] text-gray-500">
              Tus cursos más próximos y recientes.
            </p>
          </div>
        </div>

        <Link href="/mis-cursos" className="text-[10px] font-extrabold text-[#0A3D62] hover:underline">
          Ver todos
        </Link>
      </header>

      {cursos.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-gray-300 bg-[#F7FAFC] px-4 py-7 text-center">
          <BookOpenCheck size={28} className="mx-auto text-[#0A3D62]" aria-hidden="true" />
          <p className="mt-2 text-sm font-extrabold text-[#0A3D62]">
            Aún no tienes cursos
          </p>
          <p className="mt-1 text-[11px] text-gray-500">
            Explora las nuevas opciones disponibles para comenzar.
          </p>
          <Link href="/cursos" className="mt-4 inline-flex min-h-9 items-center justify-center rounded-xl bg-[#FFC300] px-4 text-xs font-extrabold text-[#0A3D62]">
            Explorar cursos
          </Link>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {cursos.map((curso) => (
            <Link
              key={curso.idInscripcion}
              href={`/mis-cursos/${curso.idInscripcion}`}
              className="group flex flex-col gap-3 rounded-2xl border border-gray-200 p-3 transition-all hover:border-[#0A3D62]/20 hover:bg-[#F7FAFC] sm:flex-row"
            >
              <div className="relative h-32 overflow-hidden rounded-xl bg-[#EAF2F8] sm:h-auto sm:w-36 sm:shrink-0">
                {curso.urlImagenPortada ? (
                  <Image
                    src={curso.urlImagenPortada}
                    alt={curso.tituloCurso}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 100vw, 144px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full min-h-28 items-center justify-center text-[#0A3D62]">
                    <BookOpenCheck size={28} aria-hidden="true" />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="inline-flex rounded-full border border-[#0A3D62]/10 bg-[#EAF2F8] px-2 py-0.5 text-[9px] font-extrabold text-[#0A3D62]">
                      {curso.situacionCurso}
                    </span>
                    <h3 className="mt-2 line-clamp-2 text-sm font-extrabold text-gray-800 group-hover:text-[#0A3D62]">
                      {curso.tituloCurso}
                    </h3>
                  </div>
                  <ArrowRight size={16} className="shrink-0 text-gray-400 group-hover:text-[#0A3D62]" aria-hidden="true" />
                </div>

                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-gray-500">
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays size={12} aria-hidden="true" />
                    {fecha(curso.fechaInicio)}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <UserRound size={12} aria-hidden="true" />
                    {curso.participanteNombre}
                  </span>
                  {curso.proximaSesion && (
                    <span className="inline-flex items-center gap-1">
                      <Clock3 size={12} aria-hidden="true" />
                      {fecha(curso.proximaSesion.fecha)}
                    </span>
                  )}
                </div>

                <div className="mt-3">
                  <div className="mb-1 flex items-center justify-between text-[9px] font-bold text-gray-500">
                    <span>Avance</span>
                    <span>{Math.round(curso.porcentajeAvance)}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-[#0A3D62]"
                      style={{ width: `${Math.min(Math.max(curso.porcentajeAvance, 0), 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
