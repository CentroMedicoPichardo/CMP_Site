"use client";

import {
  ArrowLeft,
  BookOpenCheck,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ExternalLink,
  GraduationCap,
  Loader2,
  MapPin,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import useSWR from "swr";

import { clienteRoutes } from "@/config/routes";
import type {
  MiCursoDetalleResponse,
  SesionMiCursoDetalle,
} from "@/types/mis-cursos";

interface MiCursoDetalleClienteProps {
  idInscripcion: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

async function fetcher(url: string): Promise<MiCursoDetalleResponse> {
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
          : "No fue posible cargar el curso";

    throw new Error(message);
  }

  return payload as MiCursoDetalleResponse;
}

function formatDate(value: string): string {
  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatDateTime(value: string | null): string {
  if (!value) {
    return "Sin actividad registrada";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatTime(value: string): string {
  return value.slice(0, 5);
}

function sessionStatusClass(value: string): string {
  switch (value) {
    case "En curso":
      return "bg-blue-100 text-blue-700";
    case "Finalizada":
      return "bg-emerald-100 text-emerald-700";
    case "Cancelada":
      return "bg-red-100 text-red-700";
    case "Reprogramada":
      return "bg-amber-100 text-amber-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function attendanceClass(value: string): string {
  switch (value) {
    case "Presente":
      return "bg-emerald-100 text-emerald-700";
    case "Retardo":
    case "Salida anticipada":
      return "bg-amber-100 text-amber-700";
    case "Ausente":
      return "bg-red-100 text-red-700";
    case "Falta justificada":
      return "bg-violet-100 text-violet-700";
    default:
      return "bg-slate-100 text-slate-600";
  }
}

export function MiCursoDetalleCliente({
  idInscripcion,
}: MiCursoDetalleClienteProps) {
  const router = useRouter();

  const { data, error, isLoading, mutate } =
    useSWR<MiCursoDetalleResponse>(
      `/api/cliente/mis-cursos/${idInscripcion}`,
      fetcher,
      {
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
      }
    );

  if (isLoading) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center">
        <Loader2 className="animate-spin text-[#0A3D62]" size={42} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-5xl p-6 text-slate-800">
        <button
          type="button"
          onClick={() => router.push(clienteRoutes.misCursos)}
          className="mb-5 flex items-center gap-2 text-sm font-bold text-[#0A3D62]"
        >
          <ArrowLeft size={18} />
          Volver a Mis Cursos
        </button>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 font-medium text-red-700">
          {error instanceof Error
            ? error.message
            : "No fue posible cargar el curso"}
        </div>
      </div>
    );
  }

  const curso = data.curso;
  const imageStyle = curso.urlImagenPortada
    ? {
        backgroundImage: `linear-gradient(to right, rgba(10, 61, 98, 0.97), rgba(10, 61, 98, 0.68)), url("${curso.urlImagenPortada.replace(/"/g, "")}")`,
      }
    : undefined;

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 text-slate-800 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => router.push(clienteRoutes.misCursos)}
          className="flex items-center gap-2 text-sm font-bold text-[#0A3D62] hover:underline"
        >
          <ArrowLeft size={18} />
          Mis Cursos
        </button>

        <button
          type="button"
          onClick={() => void mutate()}
          className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-[#0A3D62] hover:text-[#0A3D62]"
        >
          Actualizar
        </button>
      </div>

      <header
        className="rounded-3xl bg-gradient-to-r from-[#0A3D62] to-[#1A4F7A] bg-cover bg-center p-6 text-white shadow-lg sm:p-8"
        style={imageStyle}
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-bold text-[#FFE082]">
              {curso.categoriaNombre ?? "Curso académico"}
            </p>
            <h1 className="mt-1 max-w-3xl text-2xl font-bold sm:text-3xl">
              {curso.tituloCurso}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/80">
              {curso.descripcion ?? "Sin descripción disponible."}
            </p>
          </div>

          <div className="flex w-fit flex-col gap-2">
            <span className="rounded-full bg-white/15 px-3 py-1.5 text-sm font-bold backdrop-blur-sm">
              {curso.situacionCurso}
            </span>
            <span className="rounded-full bg-[#FFC300] px-3 py-1.5 text-sm font-bold text-[#0A3D62]">
              {curso.estadoAcademico}
            </span>
          </div>
        </div>

        <div className="mt-6 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <HeaderInfo
            icon={<GraduationCap size={17} />}
            text={curso.instructorNombre}
          />
          <HeaderInfo
            icon={<CalendarDays size={17} />}
            text={`${formatDate(curso.fechaInicio)} — ${formatDate(
              curso.fechaFin
            )}`}
          />
          <HeaderInfo
            icon={<Clock3 size={17} />}
            text={curso.horario ?? "Horario general no definido"}
          />
          <HeaderInfo
            icon={<MapPin size={17} />}
            text={
              curso.ubicacionNombre ??
              curso.modalidadNombre ??
              "Ubicación por definir"
            }
          />
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Sesiones"
          value={`${curso.sesionesCompletadas}/${curso.sesionesTotales}`}
          icon={<BookOpenCheck size={22} />}
        />
        <MetricCard
          label="Avance"
          value={`${Math.round(curso.porcentajeAvance)}%`}
          icon={<GraduationCap size={22} />}
        />
        <MetricCard
          label="Asistencia"
          value={`${Math.round(curso.porcentajeAsistencia)}%`}
          icon={<CheckCircle2 size={22} />}
        />
        <MetricCard
          label="Inscripción"
          value={curso.estadoInscripcion}
          icon={<UserRound size={22} />}
        />
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-[#0A3D62]">
            Progreso académico
          </h2>

          <div className="mt-5 space-y-5">
            <ProgressLine
              label="Avance del curso"
              value={curso.porcentajeAvance}
            />
            <ProgressLine
              label="Asistencia registrada"
              value={curso.porcentajeAsistencia}
            />
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <InfoBox
              label="Última actividad"
              value={formatDateTime(curso.fechaUltimaActividad)}
            />
            <InfoBox
              label="Finalización"
              value={formatDateTime(curso.fechaFinalizacion)}
            />
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-[#0A3D62]">
            Participante inscrito
          </h2>

          <div className="mt-5 rounded-2xl bg-slate-50 p-4">
            <p className="font-bold text-slate-800">
              {curso.participanteNombre}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {curso.participanteCorreo ?? "Correo no registrado"}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {curso.participanteTelefono ?? "Teléfono no registrado"}
            </p>
          </div>

          <div className="mt-4 space-y-2 text-sm text-slate-600">
            <p>
              <span className="font-bold text-slate-700">Instructor:</span>{" "}
              {curso.instructorNombre}
            </p>
            {curso.instructorEspecialidad && (
              <p>
                <span className="font-bold text-slate-700">
                  Especialidad:
                </span>{" "}
                {curso.instructorEspecialidad}
              </p>
            )}
            <p>
              <span className="font-bold text-slate-700">Modalidad:</span>{" "}
              {curso.modalidadNombre ?? "Sin modalidad"}
            </p>
          </div>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-5">
          <h2 className="text-lg font-bold text-[#0A3D62]">
            Calendario de sesiones
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Consulta el horario, ubicación, enlace virtual y asistencia de cada
            sesión.
          </p>
        </div>

        {curso.sesiones.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            Todavía no hay sesiones programadas.
          </div>
        ) : (
          <div className="grid gap-4 p-5 lg:grid-cols-2">
            {curso.sesiones.map((sesion) => (
              <SesionClienteCard key={sesion.idSesion} sesion={sesion} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function HeaderInfo({
  icon,
  text,
}: {
  icon: ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2.5 text-white/90 backdrop-blur-sm">
      {icon}
      <span className="line-clamp-2">{text}</span>
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-1 text-xl font-bold text-[#0A3D62]">{value}</p>
        </div>
        <div className="rounded-xl bg-[#0A3D62]/10 p-3 text-[#0A3D62]">
          {icon}
        </div>
      </div>
    </article>
  );
}

function ProgressLine({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-semibold text-slate-700">{label}</span>
        <span className="font-bold text-[#0A3D62]">
          {Math.round(safeValue)}%
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-[#FFC300]"
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
}

function InfoBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-700">{value}</p>
    </div>
  );
}

function SesionClienteCard({
  sesion,
}: {
  sesion: SesionMiCursoDetalle;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 p-4 text-slate-700">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[#0A3D62]">
            Sesión {sesion.numeroSesion}
          </p>
          <h3 className="mt-1 font-bold text-slate-800">{sesion.titulo}</h3>
        </div>

        <span
          className={`rounded-full px-2.5 py-1 text-xs font-bold ${sessionStatusClass(
            sesion.estado
          )}`}
        >
          {sesion.estado}
        </span>
      </div>

      {sesion.descripcion && (
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {sesion.descripcion}
        </p>
      )}

      <div className="mt-4 space-y-2 text-sm text-slate-600">
        <p className="flex items-center gap-2">
          <CalendarDays size={16} className="text-[#0A3D62]" />
          {formatDate(sesion.fecha)}
        </p>
        <p className="flex items-center gap-2">
          <Clock3 size={16} className="text-[#0A3D62]" />
          {formatTime(sesion.horaInicio)} — {formatTime(sesion.horaFin)}
        </p>
        {sesion.ubicacionNombre && (
          <p className="flex items-start gap-2">
            <MapPin size={16} className="mt-0.5 text-[#0A3D62]" />
            <span>
              {sesion.ubicacionNombre}
              {sesion.direccionCompleta
                ? ` · ${sesion.direccionCompleta}`
                : ""}
            </span>
          </p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
            Asistencia
          </p>
          <span
            className={`mt-1 inline-block rounded-full px-2.5 py-1 text-xs font-bold ${attendanceClass(
              sesion.estadoAsistencia
            )}`}
          >
            {sesion.estadoAsistencia}
          </span>
          {sesion.minutosRetardo !== null && (
            <p className="mt-1 text-xs text-slate-500">
              {sesion.minutosRetardo} minutos de retardo
            </p>
          )}
        </div>

        {sesion.enlaceVirtual && sesion.estado !== "Cancelada" && (
          <a
            href={sesion.enlaceVirtual}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-xl bg-[#0A3D62] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#FFC300] hover:text-[#0A3D62]"
          >
            <ExternalLink size={15} />
            Abrir sesión
          </a>
        )}
      </div>

      {sesion.motivoJustificacion && (
        <div className="mt-3 rounded-xl bg-violet-50 p-3 text-sm text-violet-700">
          <span className="font-bold">Justificación:</span>{" "}
          {sesion.motivoJustificacion}
        </div>
      )}
    </article>
  );
}
