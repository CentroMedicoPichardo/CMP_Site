import {
  Gauge,
} from "lucide-react";

import SegmentacionDistribucionChart from "./segmentacion-distribucion-chart";

import type {
  SegmentDistribution,
} from "./segmentacion-clientes-types";

import {
  formatNumber,
  getSegmentAppearance,
} from "./segmentacion-clientes-utils";

interface ResumenSegmentosProps {
  segments: SegmentDistribution[];
  totalCustomers: number;
}

export default function ResumenSegmentos({
  segments,
  totalCustomers,
}: ResumenSegmentosProps) {
  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.05)] sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">
            Resumen de segmentos
          </p>

          <h2 className="mt-1 text-lg font-bold text-slate-950">
            Distribución de clientes
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Perfiles detectados en el modelo vigente
          </p>
        </div>

        <div className="rounded-xl bg-blue-50 p-2.5 text-blue-700">
          <Gauge
            className="h-5 w-5"
            aria-hidden="true"
          />
        </div>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(280px,0.8fr)_minmax(0,1.8fr)]">
        <SegmentacionDistribucionChart
          segments={segments}
          totalCustomers={totalCustomers}
        />

        <div>
          <div className="flex h-3 overflow-hidden rounded-full bg-slate-100">
            {segments.map((segment) => {
              const appearance =
                getSegmentAppearance(
                  segment.segmentKey,
                );

              return (
                <div
                  key={segment.segmentKey}
                  className={appearance.progress}
                  style={{
                    width: `${segment.percentage}%`,
                  }}
                  title={`${segment.segmentName}: ${segment.percentage}%`}
                />
              );
            })}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {segments.map((segment) => {
              const appearance =
                getSegmentAppearance(
                  segment.segmentKey,
                );

              const SegmentIcon =
                appearance.icon;

              return (
                <article
                  key={segment.segmentKey}
                  className={`rounded-2xl border bg-gradient-to-br p-4 ${appearance.border} ${appearance.softBackground}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-inset ${appearance.background} ${appearance.accent} ${appearance.ring}`}
                    >
                      <SegmentIcon
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${appearance.badge}`}
                    >
                      {formatNumber(
                        segment.percentage,
                      )}
                      %
                    </span>
                  </div>

                  <h3 className="mt-4 text-sm font-bold text-slate-950">
                    {segment.segmentName}
                  </h3>

                  <div className="mt-3 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-2xl font-bold tracking-tight text-slate-950">
                        {formatNumber(
                          segment.customerCount,
                          0,
                        )}
                      </p>

                      <p className="text-xs font-medium text-slate-500">
                        clientes
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        Distancia
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-700">
                        {formatNumber(
                          segment.averageDistanceToCentroid,
                          3,
                        )}
                      </p>
                    </div>
                  </div>

                  <p className="mt-3 line-clamp-2 text-xs leading-5 text-slate-600">
                    {segment.description ??
                      "Sin descripción registrada."}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
