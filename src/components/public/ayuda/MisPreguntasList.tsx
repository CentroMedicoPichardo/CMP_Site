"use client";

import { useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  Archive,
  BadgeCheck,
  CalendarDays,
  ChevronRight,
  CircleGauge,
  Clock3,
  FileQuestion,
  FolderOpen,
  Inbox,
  MessageCircleQuestion,
  MessageSquareReply,
  ShieldAlert,
} from "lucide-react";

import type { PreguntaUsuario } from "@/types/help";

interface MisPreguntasListProps {
  preguntas: PreguntaUsuario[];
  loading: boolean;
}

interface ConfiguracionBadge {
  label: string;
  clases: string;
  Icono: LucideIcon;
}

const ESTADOS: Record<string, ConfiguracionBadge> = {
  pendiente: {
    label: "Pendiente",
    clases:
      "border-amber-200 bg-amber-50 text-amber-700",
    Icono: Clock3,
  },
  respondida: {
    label: "Respondida",
    clases:
      "border-[#0A3D62]/15 bg-[#EAF2F8] text-[#0A3D62]",
    Icono: MessageSquareReply,
  },
  cerrada: {
    label: "Cerrada",
    clases:
      "border-gray-200 bg-gray-100 text-gray-600",
    Icono: Archive,
  },
  convertida_faq: {
    label: "Convertida en FAQ",
    clases:
      "border-emerald-200 bg-emerald-50 text-emerald-700",
    Icono: BadgeCheck,
  },
};

const PRIORIDADES: Record<
  string,
  ConfiguracionBadge
> = {
  baja: {
    label: "Baja",
    clases:
      "border-emerald-200 bg-emerald-50 text-emerald-700",
    Icono: CircleGauge,
  },
  normal: {
    label: "Normal",
    clases:
      "border-[#0A3D62]/15 bg-[#F1F6F9] text-[#0A3D62]",
    Icono: FileQuestion,
  },
  alta: {
    label: "Alta",
    clases:
      "border-orange-200 bg-orange-50 text-orange-700",
    Icono: AlertTriangle,
  },
  urgente: {
    label: "Urgente",
    clases:
      "border-red-200 bg-red-50 text-red-700",
    Icono: ShieldAlert,
  },
};

const ESTADO_PREDETERMINADO: ConfiguracionBadge = {
  label: "Sin estado",
  clases:
    "border-gray-200 bg-gray-100 text-gray-600",
  Icono: FileQuestion,
};

const PRIORIDAD_PREDETERMINADA: ConfiguracionBadge =
  {
    label: "Sin prioridad",
    clases:
      "border-gray-200 bg-gray-50 text-gray-600",
    Icono: CircleGauge,
  };

const FORMATEADOR_FECHA = new Intl.DateTimeFormat(
  "es-MX",
  {
    day: "numeric",
    month: "short",
    year: "numeric",
  },
);

function cn(
  ...clases: Array<string | false | null | undefined>
): string {
  return clases.filter(Boolean).join(" ");
}

function normalizarValor(
  valor: unknown,
): string {
  return String(valor ?? "")
    .trim()
    .toLocaleLowerCase("es-MX");
}

function formatearEtiqueta(
  valor: unknown,
  respaldo: string,
): string {
  const texto = String(valor ?? "")
    .replace(/_/g, " ")
    .trim();

  if (!texto) {
    return respaldo;
  }

  return texto
    .split(/\s+/)
    .map(
      (palabra) =>
        palabra.charAt(0).toLocaleUpperCase("es-MX") +
        palabra.slice(1).toLocaleLowerCase("es-MX"),
    )
    .join(" ");
}

function formatearFecha(
  valor: unknown,
): string {
  if (!valor) {
    return "Fecha no disponible";
  }

  const fecha = new Date(
    valor as string | number | Date,
  );

  if (Number.isNaN(fecha.getTime())) {
    return "Fecha no disponible";
  }

  return FORMATEADOR_FECHA.format(fecha);
}

export default function MisPreguntasList({
  preguntas,
  loading,
}: MisPreguntasListProps) {
  const router = useRouter();

  const listaPreguntas = Array.isArray(preguntas)
    ? preguntas
    : [];

  if (loading) {
    return <MisPreguntasSkeleton />;
  }

  if (listaPreguntas.length === 0) {
    return <EstadoSinPreguntas />;
  }

  return (
    <section
      className="min-w-0"
      aria-label="Mis preguntas de soporte"
    >
      <div className="mb-3 flex items-center justify-between gap-3 rounded-xl border border-[#0A3D62]/10 bg-white px-4 py-3 shadow-[0_5px_18px_rgba(10,61,98,0.04)]">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EAF2F8] text-[#0A3D62]">
            <Inbox
              size={16}
              strokeWidth={1.9}
              aria-hidden="true"
            />
          </span>

          <div className="min-w-0">
            <h2 className="text-xs font-extrabold text-[#0A3D62]">
              Historial de preguntas
            </h2>

            <p className="mt-0.5 text-[10px] text-gray-500">
              Consulta el estado y las respuestas de tus
              solicitudes.
            </p>
          </div>
        </div>

        <span className="inline-flex shrink-0 items-center justify-center rounded-full border border-[#0A3D62]/10 bg-[#F7FAFC] px-2.5 py-1 text-[10px] font-extrabold text-[#0A3D62]">
          {listaPreguntas.length}{" "}
          {listaPreguntas.length === 1
            ? "pregunta"
            : "preguntas"}
        </span>
      </div>

      <div className="space-y-3">
        {listaPreguntas.map((pregunta) => {
          const estadoNormalizado =
            normalizarValor(pregunta.estado);

          const prioridadNormalizada =
            normalizarValor(pregunta.prioridad);

          const estado =
            ESTADOS[estadoNormalizado] ?? {
              ...ESTADO_PREDETERMINADO,
              label: formatearEtiqueta(
                pregunta.estado,
                ESTADO_PREDETERMINADO.label,
              ),
            };

          const prioridad =
            PRIORIDADES[prioridadNormalizada] ?? {
              ...PRIORIDAD_PREDETERMINADA,
              label: formatearEtiqueta(
                pregunta.prioridad,
                PRIORIDAD_PREDETERMINADA.label,
              ),
            };

          const titulo =
            pregunta.titulo?.trim() ||
            "Pregunta sin título";

          const descripcion =
            pregunta.descripcion?.trim() ||
            "Esta pregunta no contiene una descripción.";

          const categoria =
            pregunta.categoria?.nombreCategoria?.trim() ||
            "Sin categoría";

          const idPregunta = Number(
            pregunta.idPregunta,
          );

          const puedeAbrirse =
            Number.isInteger(idPregunta) &&
            idPregunta > 0;

          return (
            <PreguntaCard
              key={pregunta.idPregunta}
              titulo={titulo}
              descripcion={descripcion}
              categoria={categoria}
              fecha={formatearFecha(
                pregunta.createdAt,
              )}
              estado={estado}
              prioridad={prioridad}
              disabled={!puedeAbrirse}
              onClick={() => {
                if (!puedeAbrirse) {
                  return;
                }

                router.push(
                  `/ayuda/preguntas/${idPregunta}`,
                );
              }}
            />
          );
        })}
      </div>
    </section>
  );
}

interface PreguntaCardProps {
  titulo: string;
  descripcion: string;
  categoria: string;
  fecha: string;
  estado: ConfiguracionBadge;
  prioridad: ConfiguracionBadge;
  disabled: boolean;
  onClick: () => void;
}

function PreguntaCard({
  titulo,
  descripcion,
  categoria,
  fecha,
  estado,
  prioridad,
  disabled,
  onClick,
}: PreguntaCardProps) {
  const EstadoIcono = estado.Icono;
  const PrioridadIcono = prioridad.Icono;

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_5px_18px_rgba(10,61,98,0.05)] transition-all duration-300 hover:border-[#0A3D62]/20 hover:shadow-[0_12px_30px_rgba(10,61,98,0.09)]">
      <span
        className="absolute bottom-0 left-0 top-0 w-1 bg-[#0A3D62] opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        aria-hidden="true"
      />

      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label={`Abrir pregunta: ${titulo}`}
        className="flex w-full items-start gap-3 px-4 py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#FFC300] disabled:cursor-default sm:gap-4 sm:px-5"
      >
        <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF2F8] text-[#0A3D62] transition-colors duration-200 group-hover:bg-[#0A3D62] group-hover:text-[#FFC300]">
          <MessageCircleQuestion
            size={19}
            strokeWidth={1.9}
            aria-hidden="true"
          />
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-extrabold leading-5 text-gray-800 transition-colors group-hover:text-[#0A3D62] sm:text-[15px] sm:leading-6">
                {titulo}
              </span>

              <span className="mt-1.5 line-clamp-2 block text-xs leading-5 text-gray-500 sm:text-sm">
                {descripcion}
              </span>
            </span>

            <span className="flex shrink-0 flex-wrap items-center gap-1.5">
              <Badge
                configuracion={estado}
                Icono={EstadoIcono}
              />

              <Badge
                configuracion={prioridad}
                Icono={PrioridadIcono}
              />
            </span>
          </span>

          <span className="mt-3 flex flex-col gap-2 border-t border-gray-100 pt-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="flex min-w-0 items-center gap-2">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#F1F6F9] text-[#0A3D62]">
                <FolderOpen
                  size={13}
                  strokeWidth={1.9}
                  aria-hidden="true"
                />
              </span>

              <span
                className="truncate text-[11px] font-semibold text-gray-500"
                title={categoria}
              >
                {categoria}
              </span>
            </span>

            <span className="flex shrink-0 items-center gap-2 text-[11px] font-medium text-gray-400">
              <CalendarDays
                size={13}
                strokeWidth={1.9}
                aria-hidden="true"
              />

              {fecha}
            </span>
          </span>
        </span>

        <span className="mt-1 hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 transition-all duration-200 group-hover:translate-x-0.5 group-hover:border-[#0A3D62]/20 group-hover:bg-[#F7FAFC] group-hover:text-[#0A3D62] sm:flex">
          <ChevronRight
            size={16}
            strokeWidth={2}
            aria-hidden="true"
          />
        </span>
      </button>
    </article>
  );
}

interface BadgeProps {
  configuracion: ConfiguracionBadge;
  Icono: LucideIcon;
}

function Badge({
  configuracion,
  Icono,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-6 items-center gap-1 rounded-full border px-2 py-1 text-[9px] font-extrabold leading-none",
        configuracion.clases,
      )}
    >
      <Icono
        size={11}
        strokeWidth={2}
        aria-hidden="true"
      />

      {configuracion.label}
    </span>
  );
}

function MisPreguntasSkeleton() {
  return (
    <div
      className="space-y-3"
      role="status"
      aria-live="polite"
      aria-label="Cargando preguntas"
    >
      <div className="flex animate-pulse items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-gray-200" />

          <div>
            <div className="h-3 w-32 rounded-full bg-gray-200" />
            <div className="mt-2 h-2 w-48 rounded-full bg-gray-100" />
          </div>
        </div>

        <div className="h-6 w-20 rounded-full bg-gray-100" />
      </div>

      {Array.from({ length: 3 }).map(
        (_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
          >
            <div className="flex animate-pulse items-start gap-4 px-4 py-4 sm:px-5">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-gray-200" />

              <div className="min-w-0 flex-1">
                <div
                  className={cn(
                    "h-3.5 rounded-full bg-gray-200",
                    index % 2 === 0
                      ? "w-3/4"
                      : "w-2/3",
                  )}
                />

                <div className="mt-3 h-2.5 w-full rounded-full bg-gray-100" />
                <div className="mt-2 h-2.5 w-4/5 rounded-full bg-gray-100" />

                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                  <div className="h-6 w-28 rounded-lg bg-gray-100" />
                  <div className="h-3 w-24 rounded-full bg-gray-100" />
                </div>
              </div>
            </div>
          </div>
        ),
      )}

      <span className="sr-only">
        Cargando tus preguntas...
      </span>
    </div>
  );
}

function EstadoSinPreguntas() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-dashed border-[#0A3D62]/20 bg-white px-5 py-10 text-center shadow-[0_8px_26px_rgba(10,61,98,0.05)] sm:px-8 sm:py-12">
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#FFC300]/10 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -bottom-20 -left-20 h-44 w-44 rounded-full bg-[#0A3D62]/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0A3D62] text-[#FFC300] shadow-[0_10px_28px_rgba(10,61,98,0.18)]">
          <MessageCircleQuestion
            size={29}
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </div>

        <h2 className="mt-4 text-lg font-extrabold text-[#0A3D62] sm:text-xl">
          Todavía no tienes preguntas
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
          Cuando envíes una consulta podrás revisar aquí su
          estado, prioridad y respuesta.
        </p>

        <div className="mx-auto mt-5 flex w-fit items-center gap-2 rounded-xl border border-[#0A3D62]/10 bg-[#F7FAFC] px-3.5 py-2.5">
          <FileQuestion
            size={15}
            className="shrink-0 text-[#0A3D62]"
            strokeWidth={1.9}
            aria-hidden="true"
          />

          <p className="text-[11px] font-semibold text-gray-500">
            Utiliza el formulario para enviar tu primera
            pregunta.
          </p>
        </div>
      </div>
    </div>
  );
}