"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import type {
  SegmentDistribution,
} from "./segmentacion-clientes-types";

import {
  formatNumber,
  getSegmentAppearance,
  getShortSegmentName,
} from "./segmentacion-clientes-utils";

interface ChartDatum extends SegmentDistribution {
  shortName: string;
  color: string;
}

interface DistributionTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload?: ChartDatum;
  }>;
}

function DistributionTooltip({
  active,
  payload,
}: DistributionTooltipProps) {
  const datum = payload?.[0]?.payload;

  if (!active || !datum) {
    return null;
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white/95 px-3 py-2.5 shadow-xl backdrop-blur">
      <p className="text-sm font-bold text-slate-950">
        {datum.segmentName}
      </p>

      <p className="mt-1 text-xs text-slate-600">
        {formatNumber(datum.customerCount, 0)} clientes
        · {formatNumber(datum.percentage)}%
      </p>
    </div>
  );
}

interface SegmentacionDistribucionChartProps {
  segments: SegmentDistribution[];
  totalCustomers: number;
}

export default function SegmentacionDistribucionChart({
  segments,
  totalCustomers,
}: SegmentacionDistribucionChartProps) {
  const data: ChartDatum[] = segments.map(
    (segment) => ({
      ...segment,
      shortName: getShortSegmentName(
        segment.segmentKey,
        segment.segmentName,
      ),
      color:
        getSegmentAppearance(segment.segmentKey)
          .color,
    }),
  );

  return (
    <div className="relative h-[270px]">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <PieChart>
          <Pie
            data={data}
            dataKey="customerCount"
            nameKey="shortName"
            cx="50%"
            cy="48%"
            innerRadius={62}
            outerRadius={94}
            paddingAngle={4}
            cornerRadius={8}
            stroke="transparent"
          >
            {data.map((entry) => (
              <Cell
                key={entry.segmentKey}
                fill={entry.color}
              />
            ))}
          </Pie>

          <Tooltip
            content={<DistributionTooltip />}
          />

          <Legend
            verticalAlign="bottom"
            iconType="circle"
            formatter={(value) => (
              <span className="text-xs font-semibold text-slate-600">
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="pointer-events-none absolute inset-x-0 top-[86px] text-center">
        <p className="text-3xl font-bold tracking-tight text-slate-950">
          {formatNumber(totalCustomers, 0)}
        </p>

        <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-slate-400">
          clientes
        </p>
      </div>
    </div>
  );
}
