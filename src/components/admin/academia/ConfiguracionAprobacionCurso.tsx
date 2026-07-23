"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  Award,
  BookOpenCheck,
  CheckCircle2,
  ClipboardList,
  Loader2,
  Pencil,
  ShieldCheck,
  X,
} from "lucide-react";
import useSWR from "swr";
import { toast } from "react-toastify";

import type {
  GuardarRequisitosAprobacionInput,
  RequisitosAprobacionResponse,
  TipoSeguimientoAcademico,
} from "@/types/requisitos-aprobacion";

interface ConfiguracionAprobacionCursoProps {
  cursoId: number;
}

interface RequirementsForm {
  tipoSeguimiento: TipoSeguimientoAcademico;
  porcentajeAsistenciaMinima: number | "";
  calificacionMinima: number | "";
  porcentajeAvanceMinimo: number | "";
  requiereEvaluacionFinal: boolean;
  permiteFaltasJustificadas: boolean;
  maximoFaltasInjustificadas: number | "";
  requierePagoValidado: boolean;
  emiteCertificado: boolean;
  observaciones: string;
}

const API_BASE = "/api/admin/gestion-academica/cursos";

const MODOS: Array<{
  value: TipoSeguimientoAcademico;
  title: string;
  description: string;
  icon: ReactNode;
}> = [
  {
    value: "Solo asistencia",
    title: "Solo asistencia",
    description:
      "Para pláticas, conferencias y talleres donde no se requiere calificación.",
    icon: <CheckCircle2 size={21} />,
  },
  {
    value: "Evaluaciones opcionales",
    title: "Evaluaciones opcionales",
    description:
      "Se pueden registrar actividades o resultados, pero no bloquean la aprobación.",
    icon: <ClipboardList size={21} />,
  },
  {
    value: "Evaluaciones obligatorias",
    title: "Evaluaciones obligatorias",
    description:
      "La aprobación también dependerá de calificaciones y evaluaciones requeridas.",
    icon: <BookOpenCheck size={21} />,
  },
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

async function fetcher(url: string): Promise<RequisitosAprobacionResponse> {
  const response = await fetch(url, {
    credentials: "same-origin",
  });
  const payload: unknown = await response.json();

  if (!response.ok) {
    throw new Error(
      isRecord(payload) && typeof payload.error === "string"
        ? payload.error
        : "No fue posible cargar la configuración"
    );
  }

  return payload as RequisitosAprobacionResponse;
}

function initialForm(data: RequisitosAprobacionResponse): RequirementsForm {
  const requisitos = data.requisitos;

  return {
    tipoSeguimiento: requisitos.tipoSeguimiento,
    porcentajeAsistenciaMinima: requisitos.porcentajeAsistenciaMinima,
    calificacionMinima: requisitos.calificacionMinima,
    porcentajeAvanceMinimo: requisitos.porcentajeAvanceMinimo,
    requiereEvaluacionFinal: requisitos.requiereEvaluacionFinal,
    permiteFaltasJustificadas: requisitos.permiteFaltasJustificadas,
    maximoFaltasInjustificadas:
      requisitos.maximoFaltasInjustificadas ?? "",
    requierePagoValidado: requisitos.requierePagoValidado,
    emiteCertificado: requisitos.emiteCertificado,
    observaciones: requisitos.observaciones ?? "",
  };
}

export function ConfiguracionAprobacionCurso({
  cursoId,
}: ConfiguracionAprobacionCursoProps) {
  const endpoint = `${API_BASE}/${cursoId}/requisitos-aprobacion`;
  const { data, error, isLoading, mutate } =
    useSWR<RequisitosAprobacionResponse>(endpoint, fetcher, {
      revalidateOnFocus: false,
    });
  const [open, setOpen] = useState(false);

  if (isLoading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2 className="animate-spin text-[#0A3D62]" size={20} />
          Cargando configuración de aprobación...
        </div>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800 shadow-sm">
        <p className="font-semibold">No se pudo cargar la configuración</p>
        <p className="mt-1 text-sm">
          {error instanceof Error ? error.message : "Error desconocido"}
        </p>
      </section>
    );
  }

  const requisitos = data.requisitos;

  return (
    <>
      <section className="rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm">
        <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-[#0A3D62]/10 p-3 text-[#0A3D62]">
              <ShieldCheck size={24} />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-[#0A3D62]">
                  Configuración de aprobación
                </h2>
                {!requisitos.configurado && (
                  <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
                    Valores predeterminados
                  </span>
                )}
              </div>

              <p className="mt-1 text-sm text-slate-600">
                Define cómo se completa este curso sin obligar a crear
                evaluaciones cuando no sean necesarias.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#0A3D62] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#FFC300] hover:text-[#0A3D62]"
          >
            <Pencil size={17} />
            Configurar requisitos
          </button>
        </div>

        <div className="grid gap-3 border-t border-slate-100 p-5 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryItem
            label="Seguimiento"
            value={requisitos.tipoSeguimiento}
            icon={<BookOpenCheck size={18} />}
          />
          <SummaryItem
            label="Asistencia mínima"
            value={`${requisitos.porcentajeAsistenciaMinima}%`}
            icon={<CheckCircle2 size={18} />}
          />
          <SummaryItem
            label="Avance mínimo"
            value={`${requisitos.porcentajeAvanceMinimo}%`}
            icon={<ClipboardList size={18} />}
          />
          <SummaryItem
            label="Certificado"
            value={requisitos.emiteCertificado ? "Sí" : "No"}
            icon={<Award size={18} />}
          />
        </div>

        {requisitos.tipoSeguimiento !== "Evaluaciones obligatorias" && (
          <div className="mx-5 mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            Las evaluaciones no bloquearán la finalización de este curso.
          </div>
        )}
      </section>

      {open && (
        <RequirementsModal
          endpoint={endpoint}
          data={data}
          onClose={() => setOpen(false)}
          onSaved={async () => {
            await mutate();
            setOpen(false);
          }}
        />
      )}
    </>
  );
}

function SummaryItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-[#0A3D62]">
        {icon}
        <span className="text-xs font-semibold uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className="mt-2 font-bold text-slate-900">{value}</p>
    </div>
  );
}

function RequirementsModal({
  endpoint,
  data,
  onClose,
  onSaved,
}: {
  endpoint: string;
  data: RequisitosAprobacionResponse;
  onClose: () => void;
  onSaved: () => Promise<void>;
}) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<RequirementsForm>(() => initialForm(data));

  useEffect(() => {
    setMounted(true);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const mandatory = form.tipoSeguimiento === "Evaluaciones obligatorias";

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      form.porcentajeAsistenciaMinima === "" ||
      form.porcentajeAvanceMinimo === "" ||
      form.calificacionMinima === ""
    ) {
      toast.error("Completa los porcentajes requeridos");
      return;
    }

    const payload: GuardarRequisitosAprobacionInput = {
      tipoSeguimiento: form.tipoSeguimiento,
      porcentajeAsistenciaMinima: form.porcentajeAsistenciaMinima,
      calificacionMinima: form.calificacionMinima,
      porcentajeAvanceMinimo: form.porcentajeAvanceMinimo,
      requiereEvaluacionFinal: mandatory && form.requiereEvaluacionFinal,
      permiteFaltasJustificadas: form.permiteFaltasJustificadas,
      maximoFaltasInjustificadas:
        form.maximoFaltasInjustificadas === ""
          ? null
          : form.maximoFaltasInjustificadas,
      requierePagoValidado: form.requierePagoValidado,
      emiteCertificado: form.emiteCertificado,
      observaciones: form.observaciones.trim() || null,
    };

    setLoading(true);

    try {
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify(payload),
      });
      const responsePayload: unknown = await response.json();

      if (!response.ok) {
        throw new Error(
          isRecord(responsePayload) && typeof responsePayload.error === "string"
            ? responsePayload.error
            : "No fue posible guardar la configuración"
        );
      }

      toast.success("Configuración de aprobación guardada");
      await onSaved();
    } catch (saveError: unknown) {
      toast.error(
        saveError instanceof Error
          ? saveError.message
          : "No fue posible guardar la configuración"
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
      aria-labelledby="requirements-modal-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="my-auto max-h-[calc(100vh-2rem)] w-full max-w-4xl overflow-y-auto rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#0A3D62]">
              Gestión académica
            </p>
            <h2
              id="requirements-modal-title"
              className="mt-1 text-xl font-bold text-[#0A3D62]"
            >
              Requisitos de aprobación
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

        <form onSubmit={submit} className="space-y-6 bg-white p-5">
          <fieldset>
            <legend className="text-sm font-bold text-slate-800">
              Tipo de seguimiento académico
            </legend>

            <div className="mt-3 grid gap-3 lg:grid-cols-3">
              {MODOS.map((modo) => {
                const selected = form.tipoSeguimiento === modo.value;

                return (
                  <label
                    key={modo.value}
                    className={`cursor-pointer rounded-2xl border p-4 transition ${
                      selected
                        ? "border-[#0A3D62] bg-[#0A3D62]/5 ring-2 ring-[#0A3D62]/10"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="tipoSeguimiento"
                      value={modo.value}
                      checked={selected}
                      onChange={() =>
                        setForm((current) => ({
                          ...current,
                          tipoSeguimiento: modo.value,
                          requiereEvaluacionFinal:
                            modo.value === "Evaluaciones obligatorias"
                              ? current.requiereEvaluacionFinal
                              : false,
                        }))
                      }
                      className="sr-only"
                    />

                    <div className="flex items-center gap-2 text-[#0A3D62]">
                      {modo.icon}
                      <span className="font-bold">{modo.title}</span>
                    </div>
                    <p className="mt-2 text-sm leading-5 text-slate-600">
                      {modo.description}
                    </p>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <NumberField
              label="Asistencia mínima (%)"
              value={form.porcentajeAsistenciaMinima}
              max={100}
              step={0.01}
              required
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  porcentajeAsistenciaMinima: value,
                }))
              }
            />

            <NumberField
              label="Avance mínimo (%)"
              value={form.porcentajeAvanceMinimo}
              max={100}
              step={0.01}
              required
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  porcentajeAvanceMinimo: value,
                }))
              }
            />

            <NumberField
              label="Máximo de faltas injustificadas"
              value={form.maximoFaltasInjustificadas}
              step={1}
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  maximoFaltasInjustificadas: value,
                }))
              }
            />

            {mandatory && (
              <NumberField
                label="Calificación mínima (%)"
                value={form.calificacionMinima}
                max={100}
                step={0.01}
                required
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    calificacionMinima: value,
                  }))
                }
              />
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <ToggleField
              label="Permitir faltas justificadas"
              checked={form.permiteFaltasJustificadas}
              onChange={(checked) =>
                setForm((current) => ({
                  ...current,
                  permiteFaltasJustificadas: checked,
                }))
              }
            />

            <ToggleField
              label="Requerir pago validado"
              checked={form.requierePagoValidado}
              onChange={(checked) =>
                setForm((current) => ({
                  ...current,
                  requierePagoValidado: checked,
                }))
              }
            />

            <ToggleField
              label="Emitir certificado al aprobar"
              checked={form.emiteCertificado}
              onChange={(checked) =>
                setForm((current) => ({
                  ...current,
                  emiteCertificado: checked,
                }))
              }
            />

            {mandatory && (
              <ToggleField
                label="Requerir evaluación final"
                checked={form.requiereEvaluacionFinal}
                onChange={(checked) =>
                  setForm((current) => ({
                    ...current,
                    requiereEvaluacionFinal: checked,
                  }))
                }
              />
            )}
          </div>

          <label className="block space-y-1.5">
            <span className="text-sm font-semibold text-slate-700">
              Observaciones
            </span>
            <textarea
              rows={3}
              maxLength={2000}
              value={form.observaciones}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  observaciones: event.target.value,
                }))
              }
              placeholder="Indicaciones adicionales para la aprobación del curso"
              className="w-full resize-y rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#0A3D62] focus:ring-2 focus:ring-[#0A3D62]/10"
            />
          </label>

          <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
            {mandatory
              ? "Las evaluaciones obligatorias sí se tomarán en cuenta durante el cierre académico."
              : "Las evaluaciones podrán omitirse sin impedir que el participante complete el curso."}
          </div>

          <div className="sticky bottom-0 flex justify-end gap-3 border-t border-slate-200 bg-white pt-4">
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
              {loading && <Loader2 className="animate-spin" size={17} />}
              Guardar configuración
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

function NumberField({
  label,
  value,
  max,
  step,
  required = false,
  onChange,
}: {
  label: string;
  value: number | "";
  max?: number;
  step: number;
  required?: boolean;
  onChange: (value: number | "") => void;
}) {
  return (
    <label className="space-y-1.5">
      <span className="block text-sm font-semibold text-slate-700">
        {label}
      </span>
      <input
        type="number"
        min={0}
        max={max}
        step={step}
        required={required}
        value={value}
        onChange={(event) => {
          const next = event.target.value;
          onChange(next === "" ? "" : Number(next));
        }}
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-[#0A3D62] focus:ring-2 focus:ring-[#0A3D62]/10"
      />
    </label>
  );
}

function ToggleField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <span className="text-sm font-semibold text-slate-800">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-5 w-5 rounded border-slate-300 text-[#0A3D62] focus:ring-[#0A3D62]"
      />
    </label>
  );
}
