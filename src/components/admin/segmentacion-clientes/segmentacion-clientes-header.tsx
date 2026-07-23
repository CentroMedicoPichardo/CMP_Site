import {
  BrainCircuit,
  Layers3,
  LoaderCircle,
  RefreshCw,
  Sparkles,
} from "lucide-react";

import type {
  SegmentDistribution,
} from "./segmentacion-clientes-types";

import {
  formatDateTime,
  getShortSegmentName,
} from "./segmentacion-clientes-utils";

interface SegmentacionClientesHeaderProps {
  adminName: string;
  trainedAt: string | null | undefined;
  selectedSegment: string;
  segments: SegmentDistribution[];
  recalculating: boolean;
  onSegmentChange: (value: string) => void;
  onReload: () => void;
  onRecalculate: () => void;
}

export default function SegmentacionClientesHeader({
  adminName,
  trainedAt,
  selectedSegment,
  segments,
  recalculating,
  onSegmentChange,
  onReload,
  onRecalculate,
}: SegmentacionClientesHeaderProps) {
  return (
    <header className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_10px_40px_rgba(15,23,42,0.06)]">
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-blue-600 via-violet-500 to-emerald-500" />
      <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-100/60 blur-3xl" />

      <div className="relative flex flex-col gap-6 px-5 py-6 sm:px-7 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
            <BrainCircuit
              className="h-7 w-7"
              aria-hidden="true"
            />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
                Analítica comercial
              </p>

              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 ring-1 ring-inset ring-emerald-200">
                Modelo activo
              </span>
            </div>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Segmentación de clientes
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Clasificación automática mediante K-Means
              para identificar perfiles comerciales y
              priorizar acciones.
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-slate-500">
              <span>
                Administrador:{" "}
                <strong className="text-slate-700">
                  {adminName}
                </strong>
              </span>

              <span>
                Última actualización:{" "}
                <strong className="text-slate-700">
                  {formatDateTime(trainedAt)}
                </strong>
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="relative">
            <span className="sr-only">
              Filtrar por segmento
            </span>

            <select
              value={selectedSegment}
              onChange={(event) =>
                onSegmentChange(event.target.value)
              }
              className="min-h-11 w-full appearance-none rounded-xl border border-slate-300 bg-white py-2.5 pl-4 pr-10 text-sm font-semibold text-slate-700 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 sm:w-52"
            >
              <option value="todos">
                Todos los segmentos
              </option>

              {segments.map((segment) => (
                <option
                  key={segment.segmentKey}
                  value={segment.segmentKey}
                >
                  {getShortSegmentName(
                    segment.segmentKey,
                    segment.segmentName,
                  )}
                </option>
              ))}
            </select>

            <Layers3
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
          </label>

          <button
            type="button"
            onClick={onReload}
            disabled={recalculating}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              className="h-4 w-4"
              aria-hidden="true"
            />
            Recargar
          </button>

          <button
            type="button"
            onClick={onRecalculate}
            disabled={recalculating}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {recalculating ? (
              <LoaderCircle
                className="h-4 w-4 animate-spin"
                aria-hidden="true"
              />
            ) : (
              <Sparkles
                className="h-4 w-4"
                aria-hidden="true"
              />
            )}

            {recalculating
              ? "Actualizando…"
              : "Actualizar segmentación"}
          </button>
        </div>
      </div>
    </header>
  );
}
