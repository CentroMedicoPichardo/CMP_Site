"use client";

import {
  ArrowLeft,
  CalendarDays,
  ClipboardCheck,
  Clock3,
  Edit2,
  GraduationCap,
  Link2,
  Loader2,
  MapPin,
  Plus,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { toast } from "react-toastify";

import { adminRoutes } from "@/config/routes";
import { ConfiguracionAprobacionCurso } from "@/components/admin/academia/ConfiguracionAprobacionCurso";
import type {
  CursoGestionAcademicaDetalleResponse,
  EstadoSesionCurso,
  SesionCursoAdmin,
  SesionCursoInput,
} from "@/types/gestion-academica";

interface Props {
  cursoId: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

async function fetcher(
  url: string
): Promise<CursoGestionAcademicaDetalleResponse> {
  const response = await fetch(url, {
    credentials: "same-origin",
  });

  const payload: unknown = await response.json();

  if (!response.ok) {
    const error =
      isRecord(payload) && typeof payload.error === "string"
        ? payload.error
        : "No fue posible cargar el curso";

    throw new Error(error);
  }

  return payload as CursoGestionAcademicaDetalleResponse;
}

function formatDate(value: string): string {
  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatTime(value: string): string {
  return value.slice(0, 5);
}

function badgeClass(estado: EstadoSesionCurso): string {
  switch (estado) {
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

export function CursoAcademicoDetalle({ cursoId }: Props) {
  const router = useRouter();

  const { data, error, isLoading, mutate } =
    useSWR<CursoGestionAcademicaDetalleResponse>(
      `/api/admin/gestion-academica/cursos/${cursoId}`,
      fetcher,
      {
        revalidateOnFocus: false,
      }
    );

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSesion, setSelectedSesion] =
    useState<SesionCursoAdmin | null>(null);

  const nextSessionNumber = useMemo(() => {
    const numbers = data?.sesiones.map((sesion) => sesion.numeroSesion) ?? [];

    return numbers.length === 0 ? 1 : Math.max(...numbers) + 1;
  }, [data?.sesiones]);

  const openCreate = () => {
    setSelectedSesion(null);
    setModalOpen(true);
  };

  const openEdit = (sesion: SesionCursoAdmin) => {
    setSelectedSesion(sesion);
    setModalOpen(true);
  };

  const updateStatus = async (
    sesion: SesionCursoAdmin,
    estado: EstadoSesionCurso
  ) => {
    try {
      const response = await fetch(
        `/api/admin/gestion-academica/sesiones/${sesion.idSesion}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ estado }),
        }
      );

      const payload: unknown = await response.json();

      if (!response.ok) {
        throw new Error(
          isRecord(payload) && typeof payload.error === "string"
            ? payload.error
            : "No fue posible actualizar el estado"
        );
      }

      toast.success("Estado actualizado");
      await mutate();
    } catch (updateError: unknown) {
      toast.error(
        updateError instanceof Error
          ? updateError.message
          : "Error al actualizar"
      );
    }
  };

  const deleteSession = async (sesion: SesionCursoAdmin) => {
    const confirmed = window.confirm(
      `¿Eliminar la sesión ${sesion.numeroSesion}: ${sesion.titulo}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/gestion-academica/sesiones/${sesion.idSesion}`,
        {
          method: "DELETE",
        }
      );

      const payload: unknown = await response.json();

      if (!response.ok) {
        throw new Error(
          isRecord(payload) && typeof payload.error === "string"
            ? payload.error
            : "No fue posible eliminar la sesión"
        );
      }

      toast.success("Sesión eliminada");
      await mutate();
    } catch (deleteError: unknown) {
      toast.error(
        deleteError instanceof Error
          ? deleteError.message
          : "Error al eliminar"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-[#0A3D62]" size={42} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 text-slate-900">
        <button
          type="button"
          onClick={() => router.push(adminRoutes.gestionAcademica)}
          className="mb-5 flex items-center gap-2 font-semibold text-[#0A3D62]"
        >
          <ArrowLeft size={18} />
          Regresar
        </button>

        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
          {error instanceof Error
            ? error.message
            : "No fue posible cargar el curso"}
        </div>
      </div>
    );
  }

  const { curso, sesiones, participantes } = data;

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 text-slate-900 sm:p-6">
      <button
        type="button"
        onClick={() => router.push(adminRoutes.gestionAcademica)}
        className="flex items-center gap-2 text-sm font-semibold text-[#0A3D62] hover:underline"
      >
        <ArrowLeft size={18} />
        Gestión académica
      </button>

      <header className="rounded-3xl bg-gradient-to-r from-[#0A3D62] to-[#1A4F7A] p-6 text-white shadow-lg">
        <p className="text-sm text-[#FFE082]">
          {curso.categoriaNombre ?? "Curso"}
        </p>

        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
          {curso.tituloCurso}
        </h1>

        <p className="mt-3 text-white/80">{curso.instructorNombre}</p>

        <div className="mt-5 flex flex-wrap gap-3 text-sm">
          <span className="rounded-xl bg-white/10 px-3 py-2 text-white">
            {formatDate(curso.fechaInicio)} — {formatDate(curso.fechaFin)}
          </span>

          <span className="rounded-xl bg-white/10 px-3 py-2 text-white">
            {curso.situacionAcademica}
          </span>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric
          label="Participantes"
          value={curso.totalInscripciones}
          icon={<Users size={22} />}
        />
        <Metric
          label="Sesiones"
          value={curso.totalSesiones}
          icon={<CalendarDays size={22} />}
        />
        <Metric
          label="Avance promedio"
          value={`${Math.round(curso.promedioAvance)}%`}
          icon={<GraduationCap size={22} />}
        />
        <Metric
          label="Asistencia"
          value={`${Math.round(curso.promedioAsistencia)}%`}
          icon={<Users size={22} />}
        />
      </section>

      {/* <ConfiguracionAprobacionCurso cursoId={cursoId} /> */}

      <section className="rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#0A3D62]">Sesiones</h2>
            <p className="text-sm text-slate-600">
              Programa y administra las sesiones del curso.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreate}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#0A3D62] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#FFC300] hover:text-[#0A3D62]"
          >
            <Plus size={18} />
            Nueva sesión
          </button>
        </div>

        {sesiones.length === 0 ? (
          <div className="p-12 text-center text-slate-600">
            El curso todavía no tiene sesiones.
          </div>
        ) : (
          <div className="grid gap-4 p-5 lg:grid-cols-2">
            {sesiones.map((sesion) => (
              <article
                key={sesion.idSesion}
                className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-900"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase text-[#0A3D62]">
                      Sesión {sesion.numeroSesion}
                    </p>
                    <h3 className="mt-1 font-bold text-slate-900">
                      {sesion.titulo}
                    </h3>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${badgeClass(
                      sesion.estado
                    )}`}
                  >
                    {sesion.estado}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-sm text-slate-700">
                  <p className="flex items-center gap-2">
                    <CalendarDays size={16} className="text-[#0A3D62]" />
                    {formatDate(sesion.fecha)}
                  </p>

                  <p className="flex items-center gap-2">
                    <Clock3 size={16} className="text-[#0A3D62]" />
                    {formatTime(sesion.horaInicio)} — {formatTime(sesion.horaFin)}
                  </p>

                  {sesion.ubicacionNombre && (
                    <p className="flex items-center gap-2">
                      <MapPin size={16} className="text-[#0A3D62]" />
                      {sesion.ubicacionNombre}
                    </p>
                  )}

                  {sesion.enlaceVirtual && (
                    <a
                      href={sesion.enlaceVirtual}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 font-medium text-blue-700 hover:underline"
                    >
                      <Link2 size={16} />
                      Abrir enlace
                    </a>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        adminRoutes.gestionAcademicaAsistencia(
                          sesion.idSesion
                        )
                      )
                    }
                    className="flex items-center gap-1 rounded-lg bg-[#0A3D62] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#FFC300] hover:text-[#0A3D62]"
                  >
                    <ClipboardCheck size={15} />
                    Pasar asistencia
                  </button>

                  <button
                    type="button"
                    onClick={() => openEdit(sesion)}
                    className="flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-200"
                  >
                    <Edit2 size={15} />
                    Editar
                  </button>

                  <select
                    value={sesion.estado}
                    onChange={(event) =>
                      void updateStatus(
                        sesion,
                        event.target.value as EstadoSesionCurso
                      )
                    }
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-[#0A3D62]"
                  >
                    <option value="Programada">Programada</option>
                    <option value="En curso">En curso</option>
                    <option value="Finalizada">Finalizada</option>
                    <option value="Cancelada">Cancelada</option>
                    <option value="Reprogramada">Reprogramada</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => void deleteSession(sesion)}
                    className="flex items-center gap-1 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100"
                  >
                    <Trash2 size={15} />
                    Eliminar
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm">
        <div className="border-b border-slate-100 p-5">
          <h2 className="text-lg font-bold text-[#0A3D62]">
            Participantes inscritos
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            {participantes.length} participante
            {participantes.length === 1 ? "" : "s"} registrado
            {participantes.length === 1 ? "" : "s"}.
          </p>
        </div>

        {participantes.length === 0 ? (
          <div className="p-10 text-center text-slate-600">
            No hay participantes inscritos.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 bg-white text-sm text-slate-800">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-600">
                <tr>
                  <th className="px-5 py-3 font-semibold text-slate-700">
                    Participante
                  </th>
                  <th className="px-5 py-3 font-semibold text-slate-700">
                    Estado
                  </th>
                  <th className="px-5 py-3 font-semibold text-slate-700">
                    Avance
                  </th>
                  <th className="px-5 py-3 font-semibold text-slate-700">
                    Asistencia
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 bg-white">
                {participantes.map((participante) => (
                  <tr
                    key={participante.idInscripcion}
                    className="bg-white text-slate-800 hover:bg-slate-50"
                  >
                    <td className="px-5 py-4 text-slate-800">
                      <p className="font-semibold text-slate-900">
                        {participante.nombreParticipante}
                      </p>
                      <p className="mt-1 text-xs text-slate-600">
                        {participante.correoParticipante ??
                          participante.telefonoParticipante ??
                          "Sin contacto"}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-slate-800">
                      <p className="font-medium text-slate-800">
                        {participante.estadoAcademico}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {participante.estadoInscripcion}
                      </p>
                    </td>

                    <td className="px-5 py-4 font-semibold text-[#0A3D62]">
                      {Math.round(participante.porcentajeAvance)}%
                    </td>

                    <td className="px-5 py-4 font-semibold text-[#0A3D62]">
                      {Math.round(participante.porcentajeAsistencia)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {modalOpen && (
        <SesionModal
          cursoId={cursoId}
          sesion={selectedSesion}
          siguienteNumero={nextSessionNumber}
          modalidades={data.modalidades}
          ubicaciones={data.ubicaciones}
          onClose={() => {
            setModalOpen(false);
            setSelectedSesion(null);
          }}
          onSaved={async () => {
            setModalOpen(false);
            setSelectedSesion(null);
            await mutate();
          }}
        />
      )}
    </div>
  );
}

function Metric({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-600">{label}</p>
          <p className="mt-1 text-2xl font-bold text-[#0A3D62]">{value}</p>
        </div>

        <div className="rounded-xl bg-[#0A3D62]/10 p-3 text-[#0A3D62]">
          {icon}
        </div>
      </div>
    </article>
  );
}

interface SesionModalProps {
  cursoId: number;
  sesion: SesionCursoAdmin | null;
  siguienteNumero: number;
  modalidades: CursoGestionAcademicaDetalleResponse["modalidades"];
  ubicaciones: CursoGestionAcademicaDetalleResponse["ubicaciones"];
  onClose: () => void;
  onSaved: () => Promise<void>;
}

function SesionModal({
  cursoId,
  sesion,
  siguienteNumero,
  modalidades,
  ubicaciones,
  onClose,
  onSaved,
}: SesionModalProps) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<SesionCursoInput>({
    numeroSesion: sesion?.numeroSesion ?? siguienteNumero,
    titulo: sesion?.titulo ?? "",
    descripcion: sesion?.descripcion ?? "",
    fecha: sesion?.fecha ?? "",
    horaInicio: sesion?.horaInicio.slice(0, 5) ?? "",
    horaFin: sesion?.horaFin.slice(0, 5) ?? "",
    modalidadId: sesion?.modalidadId ?? null,
    ubicacionId: sesion?.ubicacionId ?? null,
    enlaceVirtual: sesion?.enlaceVirtual ?? "",
    observaciones: sesion?.observaciones ?? "",
  });

  useEffect(() => {
    setMounted(true);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      setMounted(false);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const editing = sesion !== null;

      const response = await fetch(
        editing
          ? `/api/admin/gestion-academica/sesiones/${sesion.idSesion}`
          : `/api/admin/gestion-academica/cursos/${cursoId}/sesiones`,
        {
          method: editing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const payload: unknown = await response.json();

      if (!response.ok) {
        throw new Error(
          isRecord(payload) && typeof payload.error === "string"
            ? payload.error
            : "No fue posible guardar la sesión"
        );
      }

      toast.success(editing ? "Sesión actualizada" : "Sesión creada");
      await onSaved();
    } catch (submitError: unknown) {
      toast.error(
        submitError instanceof Error
          ? submitError.message
          : "Error al guardar"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-slate-950/70 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sesion-modal-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="my-auto max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#0A3D62]">
              Gestión académica
            </p>
            <h2
              id="sesion-modal-title"
              className="mt-1 text-xl font-bold text-[#0A3D62]"
            >
              {sesion ? "Editar sesión" : "Nueva sesión"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={submit}
          className="grid gap-4 bg-white p-5 text-slate-900 sm:grid-cols-2"
        >
          <FormField label="Número de sesión">
            <input
              type="number"
              min={1}
              required
              value={form.numeroSesion}
              onChange={(event) =>
                setForm({
                  ...form,
                  numeroSesion: Number(event.target.value),
                })
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#0A3D62] focus:ring-2 focus:ring-[#0A3D62]/10"
            />
          </FormField>

          <FormField label="Fecha">
            <input
              type="date"
              required
              value={form.fecha}
              onChange={(event) =>
                setForm({ ...form, fecha: event.target.value })
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-[#0A3D62] focus:ring-2 focus:ring-[#0A3D62]/10"
            />
          </FormField>

          <FormField label="Título" className="sm:col-span-2">
            <input
              required
              maxLength={150}
              value={form.titulo}
              onChange={(event) =>
                setForm({ ...form, titulo: event.target.value })
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#0A3D62] focus:ring-2 focus:ring-[#0A3D62]/10"
            />
          </FormField>

          <FormField label="Hora de inicio">
            <input
              type="time"
              required
              value={form.horaInicio}
              onChange={(event) =>
                setForm({ ...form, horaInicio: event.target.value })
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-[#0A3D62] focus:ring-2 focus:ring-[#0A3D62]/10"
            />
          </FormField>

          <FormField label="Hora de fin">
            <input
              type="time"
              required
              value={form.horaFin}
              onChange={(event) =>
                setForm({ ...form, horaFin: event.target.value })
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-[#0A3D62] focus:ring-2 focus:ring-[#0A3D62]/10"
            />
          </FormField>

          <FormField label="Modalidad">
            <select
              value={form.modalidadId ?? ""}
              onChange={(event) =>
                setForm({
                  ...form,
                  modalidadId: event.target.value
                    ? Number(event.target.value)
                    : null,
                })
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-[#0A3D62] focus:ring-2 focus:ring-[#0A3D62]/10"
            >
              <option value="">Sin modalidad</option>
              {modalidades.map((modalidad) => (
                <option
                  key={modalidad.idModalidad}
                  value={modalidad.idModalidad}
                >
                  {modalidad.nombreModalidad}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Ubicación">
            <select
              value={form.ubicacionId ?? ""}
              onChange={(event) =>
                setForm({
                  ...form,
                  ubicacionId: event.target.value
                    ? Number(event.target.value)
                    : null,
                })
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-[#0A3D62] focus:ring-2 focus:ring-[#0A3D62]/10"
            >
              <option value="">Sin ubicación</option>
              {ubicaciones.map((ubicacion) => (
                <option
                  key={ubicacion.idUbicacion}
                  value={ubicacion.idUbicacion}
                >
                  {ubicacion.nombreUbicacion}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Enlace virtual" className="sm:col-span-2">
            <input
              type="url"
              value={form.enlaceVirtual ?? ""}
              onChange={(event) =>
                setForm({ ...form, enlaceVirtual: event.target.value })
              }
              placeholder="https://meet.google.com/..."
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#0A3D62] focus:ring-2 focus:ring-[#0A3D62]/10"
            />
          </FormField>

          <FormField label="Descripción" className="sm:col-span-2">
            <textarea
              rows={3}
              value={form.descripcion ?? ""}
              onChange={(event) =>
                setForm({ ...form, descripcion: event.target.value })
              }
              className="w-full resize-y rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#0A3D62] focus:ring-2 focus:ring-[#0A3D62]/10"
            />
          </FormField>

          <FormField label="Observaciones" className="sm:col-span-2">
            <textarea
              rows={2}
              value={form.observaciones ?? ""}
              onChange={(event) =>
                setForm({ ...form, observaciones: event.target.value })
              }
              className="w-full resize-y rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#0A3D62] focus:ring-2 focus:ring-[#0A3D62]/10"
            />
          </FormField>

          <div className="sticky bottom-0 flex justify-end gap-3 border-t border-slate-200 bg-white pt-4 sm:col-span-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-[#0A3D62] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#123f60] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && <Loader2 size={17} className="animate-spin" />}
              Guardar sesión
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

function FormField({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`space-y-1.5 ${className}`}>
      <span className="block text-sm font-semibold text-slate-700">
        {label}
      </span>
      {children}
    </label>
  );
}