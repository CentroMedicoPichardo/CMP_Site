import {
  BrainCircuit,
  CheckCircle2,
  Database,
  ShieldCheck,
} from "lucide-react";

import type {
  SegmentationSummary,
} from "./segmentacion-clientes-types";

import {
  formatDateTime,
  formatNumber,
} from "./segmentacion-clientes-utils";

interface MetricasModeloProps {
  summary: SegmentationSummary;
}

export default function MetricasModelo({
  summary,
}: MetricasModeloProps) {
  return (
    <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.05)] sm:p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-50 p-2.5 text-blue-700">
            <BrainCircuit
              className="h-5 w-5"
              aria-hidden="true"
            />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-950">
              Modelo activo
            </h2>

            <p className="text-sm text-slate-500">
              Información de la versión desplegada
            </p>
          </div>
        </div>

        <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["Nombre", summary.model.name],
            ["Algoritmo", summary.model.algorithm],
            ["Versión", summary.model.version],
            ["Estado", summary.model.status],
            [
              "Entrenamiento",
              formatDateTime(
                summary.model.trainedAt,
              ),
            ],
            [
              "Registros utilizados",
              formatNumber(
                summary.model.trainingRecordCount,
                0,
              ),
            ],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-3"
            >
              <dt className="text-xs font-bold uppercase tracking-wide text-slate-400">
                {label}
              </dt>

              <dd className="mt-1 break-words text-sm font-bold text-slate-800">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </article>

      <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.05)] sm:p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-700">
            <ShieldCheck
              className="h-5 w-5"
              aria-hidden="true"
            />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-950">
              Salud del modelo
            </h2>

            <p className="text-sm text-slate-500">
              Métricas e integridad operativa
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Convergencia
            </p>

            <p className="mt-2 text-lg font-bold text-slate-950">
              {summary.metrics.converged === null
                ? "No disponible"
                : summary.metrics.converged
                  ? "Exitosa"
                  : "No alcanzada"}
            </p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Iteraciones
            </p>

            <p className="mt-2 text-lg font-bold text-slate-950">
              {formatNumber(
                summary.metrics.iterations,
                0,
              )}
            </p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Inercia
            </p>

            <p className="mt-2 text-lg font-bold text-slate-950">
              {formatNumber(
                summary.metrics.inertia,
                4,
              )}
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
            <CheckCircle2
              className="h-5 w-5 shrink-0 text-emerald-700"
              aria-hidden="true"
            />

            <div>
              <p className="text-sm font-bold text-emerald-900">
                {summary.assignmentsStatus.complete
                  ? "Asignaciones completas"
                  : "Asignaciones incompletas"}
              </p>

              <p className="mt-0.5 text-xs text-emerald-800">
                {formatNumber(
                  summary.assignmentsStatus
                    .currentAssignments,
                  0,
                )}{" "}
                de{" "}
                {formatNumber(
                  summary.assignmentsStatus
                    .expectedAssignments,
                  0,
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
            <Database
              className="h-5 w-5 shrink-0 text-blue-700"
              aria-hidden="true"
            />

            <div>
              <p className="text-sm font-bold text-blue-900">
                {summary.datasetStatus.recordCountChanged
                  ? "Dataset modificado"
                  : "Dataset sincronizado"}
              </p>

              <p className="mt-0.5 text-xs text-blue-800">
                {formatNumber(
                  summary.datasetStatus.activeRecords,
                  0,
                )}{" "}
                registros activos
              </p>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}
