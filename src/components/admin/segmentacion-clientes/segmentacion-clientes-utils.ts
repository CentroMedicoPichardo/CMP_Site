import {
  AlertTriangle,
  Clock3,
  TrendingUp,
  Users,
} from "lucide-react";

import type {
  SegmentKey,
} from "./segmentacion-clientes-types";

export const SEGMENT_COLORS: Record<string, string> = {
  alto_valor: "#2563eb",
  inactivo: "#10b981",
  ocasional: "#8b5cf6",
  incidencias: "#f97316",
};

export function normalizeDateString(
  value: string,
): string {
  return value.includes("T")
    ? value
    : value.replace(" ", "T");
}

export function formatDateTime(
  value: string | null | undefined,
): string {
  if (!value) {
    return "No disponible";
  }

  const date = new Date(
    normalizeDateString(value),
  );

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function formatDate(
  value: string | null | undefined,
): string {
  if (!value) {
    return "Sin compras";
  }

  const date = new Date(
    normalizeDateString(value),
  );

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "short",
  }).format(date);
}

export function formatNumber(
  value: number | null | undefined,
  maximumFractionDigits = 2,
): string {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return "No disponible";
  }

  return new Intl.NumberFormat("es-MX", {
    maximumFractionDigits,
  }).format(value);
}

export function formatCurrency(
  value: number | null | undefined,
): string {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return "No disponible";
  }

  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(value);
}

export function getShortSegmentName(
  segmentKey: SegmentKey,
  fallback: string,
): string {
  switch (segmentKey) {
    case "alto_valor":
      return "Alto valor";
    case "inactivo":
      return "Inactivos";
    case "ocasional":
      return "Ocasionales";
    case "incidencias":
      return "Incidencias";
    default:
      return fallback;
  }
}

export function getSegmentAppearance(
  segmentKey: SegmentKey,
) {
  switch (segmentKey) {
    case "alto_valor":
      return {
        icon: TrendingUp,
        color: SEGMENT_COLORS.alto_valor,
        accent: "text-blue-700",
        background: "bg-blue-50",
        softBackground: "from-blue-50 to-white",
        border: "border-blue-100",
        ring: "ring-blue-100",
        badge: "bg-blue-50 text-blue-700 ring-blue-200",
        progress: "bg-blue-600",
      };

    case "inactivo":
      return {
        icon: Clock3,
        color: SEGMENT_COLORS.inactivo,
        accent: "text-emerald-700",
        background: "bg-emerald-50",
        softBackground: "from-emerald-50 to-white",
        border: "border-emerald-100",
        ring: "ring-emerald-100",
        badge:
          "bg-emerald-50 text-emerald-700 ring-emerald-200",
        progress: "bg-emerald-500",
      };

    case "incidencias":
      return {
        icon: AlertTriangle,
        color: SEGMENT_COLORS.incidencias,
        accent: "text-orange-700",
        background: "bg-orange-50",
        softBackground: "from-orange-50 to-white",
        border: "border-orange-100",
        ring: "ring-orange-100",
        badge:
          "bg-orange-50 text-orange-700 ring-orange-200",
        progress: "bg-orange-500",
      };

    case "ocasional":
    default:
      return {
        icon: Users,
        color: SEGMENT_COLORS.ocasional,
        accent: "text-violet-700",
        background: "bg-violet-50",
        softBackground: "from-violet-50 to-white",
        border: "border-violet-100",
        ring: "ring-violet-100",
        badge:
          "bg-violet-50 text-violet-700 ring-violet-200",
        progress: "bg-violet-500",
      };
  }
}
