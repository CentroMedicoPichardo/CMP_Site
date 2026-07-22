"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import {
  BookOpenCheck,
  CalendarClock,
  CheckCircle2,
  Loader2,
  Search,
  Users,
} from "lucide-react";

import { adminRoutes } from "@/config/routes";
import type {
  CursoGestionAcademicaResumen,
  GestionAcademicaCursosResponse,
} from "@/types/gestion-academica";

const API_URL = "/api/admin/gestion-academica/cursos";

type FiltroAcademico =
  | "todos"
  | "sin_sesiones"
  | "con_sesiones"
  | "en_curso";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

async function fetcher(
  url: string
): Promise<GestionAcademicaCursosResponse> {
  const response = await fetch(url, {
    credentials: "same-origin",
  });

  const payload: unknown = await response.json();

  if (!response.ok) {
    const message =
      isRecord(payload) && typeof payload.error === "string"
        ? payload.error
        : "No fue posible cargar los cursos";

    throw new Error(message);
  }

  return payload as GestionAcademicaCursosResponse;
}

function formatDate(value: string): string {
  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function matchesFilter(
  curso: CursoGestionAcademicaResumen,
  filtro: FiltroAcademico
): boolean {
  switch (filtro) {
    case "sin_sesiones":
      return curso.totalSesiones === 0;

    case "con_sesiones":
      return curso.totalSesiones > 0;

    case "en_curso":
      return curso.sesionesEnCurso > 0;

    default:
      return true;
  }
}

export function GestionAcademica() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filtro, setFiltro] = useState<FiltroAcademico>("todos");

  const { data, error, isLoading, mutate } =
    useSWR<GestionAcademicaCursosResponse>(API_URL, fetcher, {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    });

  const cursosFiltrados = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return (data?.cursos ?? []).filter((curso) => {
      const matchesSearch =
        search.length === 0 ||
        curso.tituloCurso.toLowerCase().includes(search) ||
        curso.instructorNombre.toLowerCase().includes(search);

      return matchesSearch && matchesFilter(curso, filtro);
    });
  }, [data?.cursos, filtro, searchTerm]);

  const handleOpenCurso = (cursoId: number) => {
    router.push(adminRoutes.gestionAcademicaCurso(cursoId));
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <header className="rounded-3xl bg-gradient-to-r from-[#0A3D62] to-[#1A4F7A] p-6 text-white shadow-lg sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-[#FFE082]">
              <BookOpenCheck size={18} />
              Seguimiento académico
            </div>

            <h1 className="text-2xl font-bold sm:text-3xl">
              Gestión académica
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-white/80 sm:text-base">
              Consulta los cursos con participantes inscritos, sesiones y avance
              académico.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void mutate()}
            className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#0A3D62] transition hover:bg-[#FFC300]"
          >
            Actualizar información
          </button>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Cursos con alumnos"
          value={data?.resumen.totalCursos ?? 0}
          icon={<BookOpenCheck size={22} />}
        />

        <SummaryCard
          label="Inscripciones"
          value={data?.resumen.totalInscripciones ?? 0}
          icon={<Users size={22} />}
        />

        <SummaryCard
          label="Sesiones programadas"
          value={data?.resumen.sesionesProgramadas ?? 0}
          icon={<CalendarClock size={22} />}
        />

        <SummaryCard
          label="Sesiones finalizadas"
          value={data?.resumen.sesionesFinalizadas ?? 0}
          icon={<CheckCircle2 size={22} />}
        />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row">
          <label className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar curso o instructor"
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#0A3D62] focus:ring-2 focus:ring-[#0A3D62]/10"
            />
          </label>

          <select
            value={filtro}
            onChange={(event) =>
              setFiltro(event.target.value as FiltroAcademico)
            }
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#0A3D62]"
          >
            <option value="todos">Todos los cursos</option>
            <option value="sin_sesiones">Sin sesiones</option>
            <option value="con_sesiones">Con sesiones</option>
            <option value="en_curso">Con sesión en curso</option>
          </select>
        </div>
      </section>

      {isLoading && (
        <div className="flex min-h-64 items-center justify-center rounded-2xl bg-white shadow-sm">
          <Loader2
            className="animate-spin text-[#0A3D62]"
            size={38}
          />
        </div>
      )}

      {error && !isLoading && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
          {error instanceof Error
            ? error.message
            : "No fue posible cargar los cursos"}
        </div>
      )}

      {!isLoading && !error && cursosFiltrados.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <BookOpenCheck
            className="mx-auto text-slate-300"
            size={48}
          />

          <h2 className="mt-4 text-lg font-semibold text-slate-700">
            No hay cursos para mostrar
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Solo aparecen cursos con al menos una inscripción.
          </p>
        </div>
      )}

      {!isLoading && !error && cursosFiltrados.length > 0 && (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {cursosFiltrados.map((curso) => (
            <CursoCard
              key={curso.idCurso}
              curso={curso}
              onOpen={handleOpenCurso}
            />
          ))}
        </section>
      )}
    </div>
  );
}

interface SummaryCardProps {
  label: string;
  value: number;
  icon: ReactNode;
}

function SummaryCard({ label, value, icon }: SummaryCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-[#0A3D62]">{value}</p>
        </div>

        <div className="rounded-xl bg-[#0A3D62]/10 p-3 text-[#0A3D62]">
          {icon}
        </div>
      </div>
    </article>
  );
}

interface CursoCardProps {
  curso: CursoGestionAcademicaResumen;
  onOpen: (cursoId: number) => void;
}

function CursoCard({ curso, onOpen }: CursoCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="bg-gradient-to-r from-[#0A3D62] to-[#1A4F7A] p-5 text-white">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[#FFE082]">
              {curso.situacionAcademica}
            </p>

            <h2 className="mt-1 line-clamp-2 text-lg font-bold">
              {curso.tituloCurso}
            </h2>
          </div>

          <span
            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
              curso.activo
                ? "bg-emerald-400/20 text-emerald-100"
                : "bg-slate-400/20 text-slate-200"
            }`}
          >
            {curso.activo ? "Activo" : "Inactivo"}
          </span>
        </div>

        <p className="mt-3 text-sm text-white/75">
          {curso.instructorNombre}
        </p>
      </div>

      <div className="space-y-4 p-5">
        <p className="text-sm text-slate-500">
          {formatDate(curso.fechaInicio)} — {formatDate(curso.fechaFin)}
        </p>

        <div className="grid grid-cols-3 gap-2 text-center">
          <Metric
            label="Inscritos"
            value={curso.totalInscripciones}
          />
          <Metric label="Sesiones" value={curso.totalSesiones} />
          <Metric
            label="Finalizadas"
            value={curso.sesionesFinalizadas}
          />
        </div>

        <ProgressLine
          label="Avance promedio"
          value={curso.promedioAvance}
        />

        <ProgressLine
          label="Asistencia promedio"
          value={curso.promedioAsistencia}
        />

        <button
          type="button"
          onClick={() => onOpen(curso.idCurso)}
          className="w-full rounded-xl bg-[#0A3D62] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#FFC300] hover:text-[#0A3D62]"
        >
          Administrar curso
        </button>
      </div>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-slate-50 px-2 py-3">
      <p className="text-lg font-bold text-[#0A3D62]">{value}</p>
      <p className="text-[11px] text-slate-500">{label}</p>
    </div>
  );
}

function ProgressLine({ label, value }: { label: string; value: number }) {
  const safeValue = Math.min(100, Math.max(0, value));

  return (
    <div>
      <div className="mb-1 flex justify-between text-xs text-slate-500">
        <span>{label}</span>
        <span>{Math.round(safeValue)}%</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-[#FFC300]"
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
}