import {
  ArrowRight,
  Sparkles,
} from "lucide-react";

import type {
  SegmentDistribution,
} from "./segmentacion-clientes-types";

import {
  formatNumber,
  getSegmentAppearance,
} from "./segmentacion-clientes-utils";

interface RecomendacionesSegmentosProps {
  segments: SegmentDistribution[];
}

export default function RecomendacionesSegmentos({
  segments,
}: RecomendacionesSegmentosProps) {
  return (
    <aside className="h-full rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.05)] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
            Recomendaciones
          </p>

          <h2 className="mt-1 text-lg font-bold text-slate-950">
            Acciones por segmento
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Sugerencias comerciales del modelo
          </p>
        </div>

        <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-700">
          <Sparkles
            className="h-5 w-5"
            aria-hidden="true"
          />
        </div>
      </div>

      <div className="mt-5 space-y-3">
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
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset ${appearance.background} ${appearance.accent} ${appearance.ring}`}
                >
                  <SegmentIcon
                    className="h-5 w-5"
                    aria-hidden="true"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3
                        className={`text-sm font-bold ${appearance.accent}`}
                      >
                        {segment.segmentName}
                      </h3>

                      <p className="mt-0.5 text-xs font-semibold text-slate-500">
                        {formatNumber(
                          segment.customerCount,
                          0,
                        )}{" "}
                        clientes
                      </p>
                    </div>

                    <ArrowRight
                      className={`mt-0.5 h-4 w-4 shrink-0 ${appearance.accent}`}
                      aria-hidden="true"
                    />
                  </div>

                  <p className="mt-2 text-sm leading-5 text-slate-700">
                    {segment.recommendedAction ??
                      "No existe una acción recomendada registrada."}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </aside>
  );
}
