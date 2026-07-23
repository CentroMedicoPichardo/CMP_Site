"use client";

import {
  BookOpenCheck,
  CalendarClock,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Loader2,
  Search,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import useSWR from "swr";

import { clienteRoutes } from "@/config/routes";
import type {
  MiCursoResumen,
  MisCursosResponse,
  SituacionCursoCliente,
} from "@/types/mis-cursos";

const API_URL = "/api/cliente/mis-cursos";

type FiltroCurso = "todos" | SituacionCursoCliente | "Completado";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

async function fetcher(url: string): Promise<MisCursosResponse> {
  const response = await fetch(url, {
    credentials: "same-origin",
    cache: "no-store",
  });

  const payload: unknown = await response.json();

  if (!response.ok) {
    const message =
      isRecord(payload) && typeof payload.error === "string"
        ? payload.error
        : isRecord(payload) && typeof payload.message === "string"
          ? payload.message
          : "No fue posible cargar tus cursos";

    throw new Error(message);
  }

  return payload as MisCursosResponse;
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

function formatTime(value: string): string {
  return value.slice(0, 5);
}

function situacionClass(situacion: SituacionCursoCliente): string {
  switch (situacion) {
    case "En curso":
      return "bg-blue-100 text-blue-700";
    case "Finalizado":
      return "bg-slate-200 text-slate-700";
    default:
      return "bg-amber-100 text-amber-700";
  }
}

export function MisCursosCliente() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filtro, setFiltro] = useState<FiltroCurso>("todos");

  const { data, error, isLoading, mutate } = useSWR<MisCursosResponse>(
    API_URL,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  const cursosFiltrados = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return (data?.cursos ?? []).filter((curso) => {
      const coincideBusqueda =
        search.length === 0 ||
        curso.tituloCurso.toLowerCase().includes(search) ||
        curso.participanteNombre.toLowerCase().includes(search) ||
        curso.instructorNombre.toLowerCase().includes(search);

      const coincideFiltro =
        filtro === "todos" ||
        curso.situacionCurso === filtro ||
        (filtro === "Completado" && curso.estadoAcademico === "Completado");

      return coincideBusqueda && coincideFiltro;
    });
  }, [data?.cursos, filtro, searchTerm]);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 text-slate-800 sm:p-6">
      <header className="rounded-3xl bg-gradient-to-r from-[#0A3D62] to-[#1A4F7A] p-6 text-white shadow-lg sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#FFE082]">
              <GraduationCap size={19} />
              Formación académica
            </div>
            <h1 className="text-2xl font-bold sm:text-3xl">Mis Cursos</h1>
            <p className="mt-2 max-w-2xl text-sm text-white/80 sm:text-base">
              Consulta tus inscripciones, próximas sesiones, asistencias y
              avance académico.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void mutate()}
            className="rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-[#0A3D62] transition hover:bg-[#FFC300]"
          >
            Actualizar información
          </button>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ResumenCard
          label="Inscripciones"
          value={data?.resumen.totalInscripciones ?? 0}
          icon={<BookOpenCheck size={22} />}
        />
        <ResumenCard
          label="Cursos en curso"
          value={data?.resumen.cursosEnCurso ?? 0}
          icon={<Clock3 size={22} />}
        />
        <ResumenCard
          label="Próximos"
          value={data?.resumen.cursosProximos ?? 0}
          icon={<CalendarClock size={22} />}
        />
        <ResumenCard
          label="Completados"
          value={data?.resumen.cursosCompletados ?? 0}
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
              placeholder="Buscar curso, participante o instructor"
              className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#0A3D62] focus:ring-2 focus:ring-[#0A3D62]/10"
            />
          </label>

          <select
            value={filtro}
            onChange={(event) => setFiltro(event.target.value as FiltroCurso)}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-[#0A3D62]"
          >
            <option value="todos">Todos</option>
            <option value="Próximamente">Próximamente</option>
            <option value="En curso">En curso</option>
            <option value="Finalizado">Finalizados</option>
            <option value="Completado">Académicamente completados</option>
          </select>
        </div>
      </section>

      {isLoading && (
        <div className="flex min-h-72 items-center justify-center rounded-2xl bg-white shadow-sm">
          <Loader2 className="animate-spin text-[#0A3D62]" size={40} />
        </div>
      )}

      {error && !isLoading && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 font-medium text-red-700">
          {error instanceof Error
            ? error.message
            : "No fue posible cargar tus cursos"}
        </div>
      )}

      {!isLoading && !error && cursosFiltrados.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <BookOpenCheck className="mx-auto text-slate-300" size={50} />
          <h2 className="mt-4 text-lg font-bold text-slate-700">
            No hay cursos para mostrar
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Las inscripciones aprobadas aparecerán en esta sección.
          </p>
        </div>
      )}

      {!isLoading && !error && cursosFiltrados.length > 0 && (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {cursosFiltrados.map((curso) => (
            <CursoClienteCard
              key={curso.idInscripcion}
              curso={curso}
              onOpen={() =>
                router.push(clienteRoutes.miCursoDetalle(curso.idInscripcion))
              }
            />
          ))}
        </section>
      )}
    </div>
  );
}

function ResumenCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-[#0A3D62]">{value}</p>
        </div>
        <div className="rounded-xl bg-[#0A3D62]/10 p-3 text-[#0A3D62]">
          {icon}
        </div>
      </div>
    </article>
  );
}

function CursoClienteCard({
  curso,
  onOpen,
}: {
  curso: MiCursoResumen;
  onOpen: () => void;
}) {
  const imageStyle = curso.urlImagenPortada
    ? {
        backgroundImage: `linear-gradient(to top, rgba(10, 61, 98, 0.92), rgba(10, 61, 98, 0.15)), url("${curso.urlImagenPortada.replace(/"/g, "")}")`,
      }
    : undefined;

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div
        className="flex min-h-48 flex-col justify-between bg-gradient-to-br from-[#0A3D62] to-[#1A4F7A] bg-cover bg-center p-5 text-white"
        style={imageStyle}
      >
        <div className="flex items-start justify-between gap-3">
          <span className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-bold backdrop-blur-sm">
            {curso.categoriaNombre ?? "Curso"}
          </span>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-bold ${situacionClass(
              curso.situacionCurso
            )}`}
          >
            {curso.situacionCurso}
          </span>
        </div>

        <div>
          <h2 className="line-clamp-2 text-xl font-bold">{curso.tituloCurso}</h2>
          <p className="mt-2 text-sm font-medium text-white/85">
            {curso.instructorNombre}
          </p>
        </div>
      </div>

      <div className="space-y-4 p-5 text-slate-700">
        <div className="flex items-start gap-2 rounded-xl bg-slate-50 p-3">
          <UserRound className="mt-0.5 text-[#0A3D62]" size={18} />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Participante
            </p>
            <p className="font-bold text-slate-800">{curso.participanteNombre}</p>
          </div>
        </div>

        <p className="text-sm text-slate-600">
          {formatDate(curso.fechaInicio)} — {formatDate(curso.fechaFin)}
        </p>

        <div className="grid grid-cols-2 gap-3">
          <ProgressBox label="Avance" value={curso.porcentajeAvance} />
          <ProgressBox label="Asistencia" value={curso.porcentajeAsistencia} />
        </div>

        {curso.proximaSesion ? (
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 text-blue-900">
            <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
              Próxima sesión
            </p>
            <p className="mt-1 font-bold">{curso.proximaSesion.titulo}</p>
            <p className="mt-1 text-sm text-blue-700">
              {formatDate(curso.proximaSesion.fecha)} ·{" "}
              {formatTime(curso.proximaSesion.horaInicio)}–
              {formatTime(curso.proximaSesion.horaFin)}
            </p>
          </div>
        ) : (
          <div className="rounded-xl bg-slate-50 p-3 text-sm font-medium text-slate-500">
            No hay una próxima sesión programada.
          </div>
        )}

        <button
          type="button"
          onClick={onOpen}
          className="w-full rounded-xl bg-[#0A3D62] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#FFC300] hover:text-[#0A3D62]"
        >
          Ver detalle del curso
        </button>
      </div>
    </article>
  );
}

function ProgressBox({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div className="rounded-xl border border-slate-200 p-3">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
        <span>{label}</span>
        <span>{Math.round(safeValue)}%</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-[#FFC300]"
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
}
