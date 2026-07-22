import type { LucideIcon } from "lucide-react";

import {
  ArrowDownRight,
  ArrowUpRight,
} from "lucide-react";

type MetricsStatus =
  | "good"
  | "warning"
  | "critical";

interface MetricsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  status?: MetricsStatus;
  description?: string;
  trend?: {
    value: number;
    direction: "up" | "down";
  };
}

interface StatusConfiguration {
  label: string;
  accent: string;
  iconContainer: string;
  indicator: string;
  value: string;
}

const STATUS_CONFIGURATION: Record<
  MetricsStatus,
  StatusConfiguration
> = {
  good: {
    label: "Estado estable",
    accent: "bg-emerald-500",
    iconContainer:
      "border-emerald-100 bg-emerald-50 text-emerald-700",
    indicator: "bg-emerald-500",
    value: "text-gray-900",
  },
  warning: {
    label: "Requiere atención",
    accent: "bg-amber-400",
    iconContainer:
      "border-amber-100 bg-amber-50 text-amber-700",
    indicator: "bg-amber-400",
    value: "text-gray-900",
  },
  critical: {
    label: "Estado crítico",
    accent: "bg-red-500",
    iconContainer:
      "border-red-100 bg-red-50 text-red-700",
    indicator: "bg-red-500",
    value: "text-red-700",
  },
};

function cn(
  ...classes: Array<
    string | false | null | undefined
  >
): string {
  return classes.filter(Boolean).join(" ");
}

export function MetricsCard({
  title,
  value,
  icon: Icon,
  status = "good",
  description,
  trend,
}: MetricsCardProps) {
  const configuration =
    STATUS_CONFIGURATION[status];

  const TrendIcon =
    trend?.direction === "up"
      ? ArrowUpRight
      : ArrowDownRight;

  const trendValue =
    trend?.value !== undefined
      ? Math.abs(trend.value)
      : 0;

  return (
    <article className="group relative min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md">
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-1",
          configuration.accent,
        )}
        aria-hidden="true"
      />

      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-2">
              <span
                className={cn(
                  "h-2 w-2 shrink-0 rounded-full",
                  configuration.indicator,
                )}
                aria-hidden="true"
              />

              <p className="min-w-0 whitespace-normal break-words text-xs font-bold uppercase tracking-[0.08em] text-gray-500">
                {title}
              </p>
            </div>

            <p
              className={cn(
                "mt-3 min-w-0 whitespace-normal break-words text-3xl font-extrabold leading-none tracking-tight sm:text-4xl",
                configuration.value,
              )}
            >
              {value}
            </p>

            {description && (
              <p className="mt-2 whitespace-normal break-words text-xs leading-5 text-gray-500">
                {description}
              </p>
            )}
          </div>

          <span
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:scale-105",
              configuration.iconContainer,
            )}
            title={configuration.label}
          >
            <Icon
              size={22}
              strokeWidth={1.9}
              aria-hidden="true"
            />
          </span>
        </div>

        {trend && (
          <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-gray-100 pt-4">
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-extrabold",
                trend.direction === "up"
                  ? "bg-red-50 text-red-700"
                  : "bg-emerald-50 text-emerald-700",
              )}
              aria-label={`Variación de ${trendValue} por ciento ${
                trend.direction === "up"
                  ? "al alza"
                  : "a la baja"
              }`}
            >
              <TrendIcon
                size={13}
                strokeWidth={2.5}
                aria-hidden="true"
              />

              {trendValue.toLocaleString(
                "es-MX",
                {
                  maximumFractionDigits: 2,
                },
              )}
              %
            </span>

            <span className="text-[11px] font-medium text-gray-400">
              respecto a la hora anterior
            </span>
          </div>
        )}
      </div>
    </article>
  );
}