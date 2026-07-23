import {
  Layers3,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

import {
  formatNumber,
  getShortSegmentName,
} from "./segmentacion-clientes-utils";

import type {
  SegmentDistribution,
  SegmentationSummary,
} from "./segmentacion-clientes-types";

function KpiCard({
  title,
  value,
  detail,
  icon: Icon,
  topBar,
  iconClass,
}: {
  title: string;
  value: string;
  detail: string;
  icon: typeof Users;
  topBar: string;
  iconClass: string;
}) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.05)] transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_14px_35px_rgba(15,23,42,0.09)]">
      <div
        className={`absolute inset-x-0 top-0 h-1 ${topBar}`}
      />

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-600">
            {title}
          </p>

          <p className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            {value}
          </p>
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-1 ring-inset ${iconClass}`}
        >
          <Icon
            className="h-5 w-5"
            aria-hidden="true"
          />
        </div>
      </div>

      <p className="mt-3 text-xs font-medium text-slate-500">
        {detail}
      </p>
    </article>
  );
}

interface SegmentacionClientesKpisProps {
  summary: SegmentationSummary;
  segments: SegmentDistribution[];
}

export default function SegmentacionClientesKpis({
  summary,
  segments,
}: SegmentacionClientesKpisProps) {
  const largestSegment = segments.reduce<
    SegmentDistribution | undefined
  >(
    (largest, current) =>
      !largest ||
      current.customerCount >
        largest.customerCount
        ? current
        : largest,
    undefined,
  );

  const coverage =
    summary.datasetStatus.activeRecords > 0
      ? (summary.assignmentsStatus
          .currentAssignments /
          summary.datasetStatus.activeRecords) *
        100
      : 0;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        title="Total de clientes"
        value={formatNumber(
          summary.datasetStatus.activeRecords,
          0,
        )}
        detail="Registros activos disponibles"
        icon={Users}
        topBar="bg-blue-600"
        iconClass="bg-blue-50 text-blue-700 ring-blue-100"
      />

      <KpiCard
        title="Segmentos detectados"
        value={formatNumber(
          segments.length,
          0,
        )}
        detail="Perfiles comerciales activos"
        icon={Layers3}
        topBar="bg-emerald-500"
        iconClass="bg-emerald-50 text-emerald-700 ring-emerald-100"
      />

      <KpiCard
        title="Segmento más grande"
        value={
          largestSegment
            ? getShortSegmentName(
                largestSegment.segmentKey,
                largestSegment.segmentName,
              )
            : "No disponible"
        }
        detail={
          largestSegment
            ? `${formatNumber(
                largestSegment.customerCount,
                0,
              )} clientes · ${formatNumber(
                largestSegment.percentage,
              )}%`
            : "Sin datos"
        }
        icon={TrendingUp}
        topBar="bg-violet-500"
        iconClass="bg-violet-50 text-violet-700 ring-violet-100"
      />

      <KpiCard
        title="Cobertura del modelo"
        value={`${formatNumber(coverage)}%`}
        detail={`${formatNumber(
          summary.assignmentsStatus.currentAssignments,
          0,
        )} asignaciones vigentes`}
        icon={Target}
        topBar="bg-orange-500"
        iconClass="bg-orange-50 text-orange-700 ring-orange-100"
      />
    </div>
  );
}
