"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCheck,
  Clock3,
  ExternalLink,
  Loader2,
  MapPin,
  RotateCcw,
  Save,
  Search,
  UserCheck,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { toast } from "react-toastify";

import { adminRoutes } from "@/config/routes";
import type {
  AsistenciaParticipanteAdmin,
  AsistenciaSesionResponse,
  EstadoAsistenciaCurso,
  GuardarAsistenciasInput,
} from "@/types/gestion-academica";

interface AsistenciaSesionAdminProps {
  sesionId: number;
}

const ESTADOS_ASISTENCIA: EstadoAsistenciaCurso[] = [
  "Pendiente",
  "Presente",
  "Ausente",
  "Retardo",
  "Falta justificada",
  "Salida anticipada",
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

async function fetcher(url: string): Promise<AsistenciaSesionResponse> {
  const response = await fetch(url, {
    credentials: "same-origin",
  });

  const payload: unknown = await response.json();

  if (!response.ok) {
    const message =
      isRecord(payload) && typeof payload.error === "string"
        ? payload.error
        : "No fue posible cargar la asistencia";

    throw new Error(message);
  }

  return payload as AsistenciaSesionResponse;
}

function formatDate(value: string): string {
  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("es-MX", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatTime(value: string): string {
  return value.slice(0, 5);
}

function statusClass(status: EstadoAsistenciaCurso): string {
  switch (status) {
    case "Presente":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "Ausente":
      return "border-red-200 bg-red-50 text-red-700";
    case "Retardo":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "Falta justificada":
      return "border-violet-200 bg-violet-50 text-violet-700";
    case "Salida anticipada":
      return "border-orange-200 bg-orange-50 text-orange-700";
    default:
      return "border-slate-200 bg-slate-50 text-slate-700";
  }
}

function clearFieldsForStatus(
  participant: AsistenciaParticipanteAdmin,
  status: EstadoAsistenciaCurso
): AsistenciaParticipanteAdmin {
  const clearTimes =
    status === "Pendiente" ||
    status === "Ausente" ||
    status === "Falta justificada";

  return {
    ...participant,
    estadoAsistencia: status,
    horaEntrada: clearTimes ? null : participant.horaEntrada,
    horaSalida: clearTimes ? null : participant.horaSalida,
    minutosRetardo:
      status === "Retardo" ? participant.minutosRetardo ?? 0 : null,
    justificada: status === "Falta justificada",
    motivoJustificacion:
      status === "Falta justificada"
        ? participant.motivoJustificacion
        : null,
    comprobanteJustificacion:
      status === "Falta justificada"
        ? participant.comprobanteJustificacion
        : null,
  };
}

export function AsistenciaSesionAdmin({
  sesionId,
}: AsistenciaSesionAdminProps) {
  const router = useRouter();
  const apiUrl =
    `/api/admin/gestion-academica/sesiones/${sesionId}/asistencias`;

  const { data, error, isLoading, mutate } =
    useSWR<AsistenciaSesionResponse>(apiUrl, fetcher, {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    });

  const [participants, setParticipants] =
    useState<AsistenciaParticipanteAdmin[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!data || dirty) {
      return;
    }

    setParticipants(data.participantes);
  }, [data, dirty]);

  const filteredParticipants = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();

    if (!normalized) {
      return participants;
    }

    return participants.filter((participant) =>
      [
        participant.nombreParticipante,
        participant.correoParticipante ?? "",
        participant.telefonoParticipante ?? "",
      ].some((value) => value.toLowerCase().includes(normalized))
    );
  }, [participants, searchTerm]);

  const summary = useMemo(
    () =>
      participants.reduce(
        (accumulator, participant) => {
          accumulator.total += 1;

          switch (participant.estadoAsistencia) {
            case "Presente":
              accumulator.presentes += 1;
              break;
            case "Ausente":
              accumulator.ausentes += 1;
              break;
            case "Retardo":
              accumulator.retardos += 1;
              break;
            case "Falta justificada":
              accumulator.justificadas += 1;
              break;
            case "Salida anticipada":
              accumulator.salidasAnticipadas += 1;
              break;
            default:
              accumulator.pendientes += 1;
          }

          return accumulator;
        },
        {
          total: 0,
          pendientes: 0,
          presentes: 0,
          ausentes: 0,
          retardos: 0,
          justificadas: 0,
          salidasAnticipadas: 0,
        }
      ),
    [participants]
  );

  const updateParticipant = (
    idInscripcion: number,
    updater: (
      participant: AsistenciaParticipanteAdmin
    ) => AsistenciaParticipanteAdmin
  ) => {
    setParticipants((current) =>
      current.map((participant) =>
        participant.idInscripcion === idInscripcion
          ? updater(participant)
          : participant
      )
    );
    setDirty(true);
  };

  const setAllStatus = (status: EstadoAsistenciaCurso) => {
    setParticipants((current) =>
      current.map((participant) =>
        clearFieldsForStatus(participant, status)
      )
    );
    setDirty(true);
  };

  const restoreServerData = () => {
    if (!data) {
      return;
    }

    setParticipants(data.participantes);
    setDirty(false);
    toast.info("Cambios descartados");
  };

  const validateBeforeSave = (): string | null => {
    for (const participant of participants) {
      if (
        participant.estadoAsistencia === "Retardo" &&
        (participant.minutosRetardo === null ||
          !Number.isSafeInteger(participant.minutosRetardo) ||
          participant.minutosRetardo < 0)
      ) {
        return `Indica los minutos de retardo de ${participant.nombreParticipante}`;
      }

      if (
        participant.estadoAsistencia === "Falta justificada" &&
        !participant.motivoJustificacion?.trim()
      ) {
        return `Indica el motivo de la falta de ${participant.nombreParticipante}`;
      }

      if (
        participant.horaEntrada &&
        participant.horaSalida &&
        participant.horaSalida < participant.horaEntrada
      ) {
        return `La hora de salida de ${participant.nombreParticipante} no puede ser anterior a la entrada`;
      }
    }

    return null;
  };

  const saveAttendance = async () => {
    if (participants.length === 0) {
      toast.info("No hay participantes para registrar");
      return;
    }

    const validationError = validateBeforeSave();

    if (validationError) {
      toast.error(validationError);
      return;
    }

    const payload: GuardarAsistenciasInput = {
      asistencias: participants.map((participant) => ({
        idInscripcion: participant.idInscripcion,
        estadoAsistencia: participant.estadoAsistencia,
        horaEntrada: participant.horaEntrada,
        horaSalida: participant.horaSalida,
        minutosRetardo: participant.minutosRetardo,
        motivoJustificacion: participant.motivoJustificacion,
        comprobanteJustificacion:
          participant.comprobanteJustificacion,
        observaciones: participant.observaciones,
      })),
    };

    setSaving(true);

    try {
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responsePayload: unknown = await response.json();

      if (!response.ok) {
        throw new Error(
          isRecord(responsePayload) &&
            typeof responsePayload.error === "string"
            ? responsePayload.error
            : "No fue posible guardar la asistencia"
        );
      }

      toast.success("Asistencia guardada correctamente");
      setDirty(false);
      await mutate();
    } catch (saveError: unknown) {
      toast.error(
        saveError instanceof Error
          ? saveError.message
          : "Error al guardar la asistencia"
      );
    } finally {
      setSaving(false);
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
      <div className="mx-auto max-w-6xl p-6 text-slate-900">
        <button
          type="button"
          onClick={() => router.push(adminRoutes.gestionAcademica)}
          className="mb-5 flex items-center gap-2 font-semibold text-[#0A3D62]"
        >
          <ArrowLeft size={18} />
          Gestión académica
        </button>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
          {error instanceof Error
            ? error.message
            : "No fue posible cargar la asistencia"}
        </div>
      </div>
    );
  }

  const sessionCancelled = data.sesion.estadoSesion === "Cancelada";

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 text-slate-900 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() =>
            router.push(
              adminRoutes.gestionAcademicaCurso(data.sesion.cursoId)
            )
          }
          className="flex items-center gap-2 text-sm font-semibold text-[#0A3D62] hover:underline"
        >
          <ArrowLeft size={18} />
          Regresar al curso
        </button>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={restoreServerData}
            disabled={!dirty || saving}
            className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RotateCcw size={17} />
            Descartar cambios
          </button>

          <button
            type="button"
            onClick={() => void saveAttendance()}
            disabled={saving || sessionCancelled}
            className="flex items-center gap-2 rounded-xl bg-[#0A3D62] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#123f60] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <Save size={17} />
            )}
            Guardar asistencia
          </button>
        </div>
      </div>

      <header className="rounded-3xl bg-gradient-to-r from-[#0A3D62] to-[#1A4F7A] p-6 text-white shadow-lg sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#FFE082]">
              Sesión {data.sesion.numeroSesion}
            </p>
            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
              {data.sesion.tituloSesion}
            </h1>
            <p className="mt-2 text-white/80">
              {data.sesion.tituloCurso}
            </p>
          </div>

          <span className="w-fit rounded-full bg-white/15 px-3 py-1.5 text-sm font-semibold text-white">
            {data.sesion.estadoSesion}
          </span>
        </div>

        <div className="mt-6 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <SessionInfo
            icon={<CalendarDays size={17} />}
            text={formatDate(data.sesion.fecha)}
          />
          <SessionInfo
            icon={<Clock3 size={17} />}
            text={`${formatTime(data.sesion.horaInicio)} — ${formatTime(
              data.sesion.horaFin
            )}`}
          />
          <SessionInfo
            icon={<MapPin size={17} />}
            text={
              data.sesion.ubicacionNombre ??
              data.sesion.modalidadNombre ??
              "Ubicación por definir"
            }
          />
          {data.sesion.enlaceVirtual ? (
            <a
              href={data.sesion.enlaceVirtual}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2.5 text-white transition hover:bg-white/20"
            >
              <ExternalLink size={17} />
              Abrir enlace virtual
            </a>
          ) : (
            <SessionInfo
              icon={<UserCheck size={17} />}
              text={`${summary.total} participantes`}
            />
          )}
        </div>
      </header>

      {sessionCancelled && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          Esta sesión está cancelada. La asistencia puede consultarse, pero no
          modificarse.
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <SummaryCard label="Total" value={summary.total} />
        <SummaryCard label="Pendientes" value={summary.pendientes} />
        <SummaryCard label="Presentes" value={summary.presentes} />
        <SummaryCard label="Ausentes" value={summary.ausentes} />
        <SummaryCard label="Retardos" value={summary.retardos} />
        <SummaryCard label="Justificadas" value={summary.justificadas} />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <label className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar participante"
              className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#0A3D62] focus:ring-2 focus:ring-[#0A3D62]/10"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setAllStatus("Presente")}
              disabled={sessionCancelled}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
            >
              <CheckCheck size={17} />
              Todos presentes
            </button>
            <button
              type="button"
              onClick={() => setAllStatus("Pendiente")}
              disabled={sessionCancelled}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Restablecer pendientes
            </button>
          </div>
        </div>
      </section>

      {filteredParticipants.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-600">
          <Users className="mx-auto text-slate-300" size={44} />
          <p className="mt-3 font-semibold">No hay participantes para mostrar</p>
        </div>
      ) : (
        <section className="space-y-4">
          {filteredParticipants.map((participant) => (
            <AttendanceCard
              key={participant.idInscripcion}
              participant={participant}
              disabled={sessionCancelled}
              onChange={(updater) =>
                updateParticipant(participant.idInscripcion, updater)
              }
            />
          ))}
        </section>
      )}

      <div className="sticky bottom-4 z-20 flex justify-end">
        <button
          type="button"
          onClick={() => void saveAttendance()}
          disabled={saving || sessionCancelled}
          className="flex items-center gap-2 rounded-xl bg-[#0A3D62] px-6 py-3 text-sm font-semibold text-white shadow-xl transition hover:bg-[#123f60] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Save size={18} />
          )}
          Guardar {participants.length} registros
        </button>
      </div>
    </div>
  );
}

function SessionInfo({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2.5 text-white">
      {icon}
      <span className="line-clamp-1">{text}</span>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold text-[#0A3D62]">{value}</p>
    </article>
  );
}

interface AttendanceCardProps {
  participant: AsistenciaParticipanteAdmin;
  disabled: boolean;
  onChange: (
    updater: (
      participant: AsistenciaParticipanteAdmin
    ) => AsistenciaParticipanteAdmin
  ) => void;
}

function AttendanceCard({
  participant,
  disabled,
  onChange,
}: AttendanceCardProps) {
  const setField = <Key extends keyof AsistenciaParticipanteAdmin>(
    key: Key,
    value: AsistenciaParticipanteAdmin[Key]
  ) => {
    onChange((current) => ({
      ...current,
      [key]: value,
    }));
  };

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 xl:w-72">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0A3D62]/10 font-bold text-[#0A3D62]">
              {participant.nombreParticipante.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h2 className="truncate font-bold text-slate-900">
                {participant.nombreParticipante}
              </h2>
              <p className="mt-1 truncate text-xs text-slate-600">
                {participant.correoParticipante ??
                  participant.telefonoParticipante ??
                  "Sin información de contacto"}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Inscripción #{participant.idInscripcion} ·{" "}
                {participant.estadoInscripcion}
              </p>
            </div>
          </div>
        </div>

        <div className="grid flex-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="space-y-1.5">
            <span className="text-sm font-semibold text-slate-700">
              Estado
            </span>
            <select
              value={participant.estadoAsistencia}
              disabled={disabled}
              onChange={(event) => {
                const status = event.target.value as EstadoAsistenciaCurso;
                onChange((current) => clearFieldsForStatus(current, status));
              }}
              className={`w-full rounded-xl border px-3 py-2.5 text-sm font-semibold outline-none transition focus:ring-2 focus:ring-[#0A3D62]/10 disabled:cursor-not-allowed disabled:opacity-60 ${statusClass(
                participant.estadoAsistencia
              )}`}
            >
              {ESTADOS_ASISTENCIA.map((status) => (
                <option key={status} value={status} className="bg-white text-slate-900">
                  {status}
                </option>
              ))}
            </select>
          </label>

          <InputField label="Hora de entrada">
            <input
              type="time"
              value={participant.horaEntrada?.slice(0, 5) ?? ""}
              disabled={disabled}
              onChange={(event) =>
                setField("horaEntrada", event.target.value || null)
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#0A3D62] disabled:opacity-60"
            />
          </InputField>

          <InputField label="Hora de salida">
            <input
              type="time"
              value={participant.horaSalida?.slice(0, 5) ?? ""}
              disabled={disabled}
              onChange={(event) =>
                setField("horaSalida", event.target.value || null)
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#0A3D62] disabled:opacity-60"
            />
          </InputField>

          {participant.estadoAsistencia === "Retardo" ? (
            <InputField label="Minutos de retardo">
              <input
                type="number"
                min={0}
                required
                value={participant.minutosRetardo ?? 0}
                disabled={disabled}
                onChange={(event) =>
                  setField(
                    "minutosRetardo",
                    Number(event.target.value)
                  )
                }
                className="w-full rounded-xl border border-amber-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-amber-500 disabled:opacity-60"
              />
            </InputField>
          ) : (
            <InputField label="Observaciones">
              <input
                value={participant.observaciones ?? ""}
                disabled={disabled}
                onChange={(event) =>
                  setField("observaciones", event.target.value || null)
                }
                placeholder="Opcional"
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#0A3D62] disabled:opacity-60"
              />
            </InputField>
          )}
        </div>
      </div>

      {participant.estadoAsistencia === "Falta justificada" && (
        <div className="mt-4 grid gap-4 border-t border-slate-100 pt-4 md:grid-cols-2">
          <InputField label="Motivo de justificación">
            <textarea
              rows={2}
              required
              value={participant.motivoJustificacion ?? ""}
              disabled={disabled}
              onChange={(event) =>
                setField(
                  "motivoJustificacion",
                  event.target.value || null
                )
              }
              className="w-full resize-y rounded-xl border border-violet-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-violet-500 disabled:opacity-60"
            />
          </InputField>

          <InputField label="URL del comprobante">
            <input
              type="url"
              value={participant.comprobanteJustificacion ?? ""}
              disabled={disabled}
              onChange={(event) =>
                setField(
                  "comprobanteJustificacion",
                  event.target.value || null
                )
              }
              placeholder="Opcional"
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#0A3D62] disabled:opacity-60"
            />
          </InputField>
        </div>
      )}

      {participant.estadoAsistencia === "Retardo" && (
        <div className="mt-4 border-t border-slate-100 pt-4">
          <InputField label="Observaciones">
            <input
              value={participant.observaciones ?? ""}
              disabled={disabled}
              onChange={(event) =>
                setField("observaciones", event.target.value || null)
              }
              placeholder="Opcional"
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#0A3D62] disabled:opacity-60"
            />
          </InputField>
        </div>
      )}
    </article>
  );
}

function InputField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="space-y-1.5">
      <span className="block text-sm font-semibold text-slate-700">
        {label}
      </span>
      {children}
    </label>
  );
}