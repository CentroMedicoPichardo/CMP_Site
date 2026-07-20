// src/components/client/compras/MisComprasCursos.tsx
"use client";

import {
  AlertCircle,
  CalendarDays,
  Clock3,
  FileText,
  GraduationCap,
  Loader2,
  RefreshCw,
  Ticket,
  Users,
  WalletCards,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import { getApiErrorMessage } from "@/types/api";
import type {
  CompraCursoListaItem,
  ListarComprasCursosResponse,
} from "@/types/compras-cursos";

interface EstadoVisual {
  label: string;
  className: string;
}

function isRecord(
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

async function readJsonResponse(
  response: Response
): Promise<unknown> {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

function parseListaComprasResponse(
  value: unknown
): ListarComprasCursosResponse | null {
  if (
    !isRecord(value) ||
    !Array.isArray(value.compras) ||
    typeof value.total !== "number"
  ) {
    return null;
  }

  return value as unknown as ListarComprasCursosResponse;
}

function formatCurrency(value: string): string {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return value;
  }

  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(amount);
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getEstadoVisual(
  compra: CompraCursoListaItem
): EstadoVisual {
  if (compra.pagoVencido) {
    return {
      label: "Pago vencido",
      className:
        "border-red-200 bg-red-50 text-red-700",
    };
  }

  switch (compra.estado) {
    case "Pendiente de pago":
      return {
        label: compra.estado,
        className:
          "border-amber-200 bg-amber-50 text-amber-700",
      };

    case "Pago reportado":
    case "En validación":
      return {
        label: compra.estado,
        className:
          "border-blue-200 bg-blue-50 text-blue-700",
      };

    case "Pago validado":
    case "Inscripciones generadas":
      return {
        label: compra.estado,
        className:
          "border-green-200 bg-green-50 text-green-700",
      };

    case "Rechazada":
    case "Cancelada":
    case "Expirada":
      return {
        label: compra.estado,
        className:
          "border-red-200 bg-red-50 text-red-700",
      };

    default:
      return {
        label: compra.estado,
        className:
          "border-gray-200 bg-gray-50 text-gray-700",
      };
  }
}

export function MisComprasCursos() {
  const [compras, setCompras] = useState<
    CompraCursoListaItem[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(
    null
  );
  const [actualizando, setActualizando] =
    useState(false);

  const cargarCompras = useCallback(
    async (mostrarCargaInicial = false) => {
      if (mostrarCargaInicial) {
        setLoading(true);
      } else {
        setActualizando(true);
      }

      setError(null);

      try {
        const response = await fetch(
          "/api/compras-cursos",
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        const payload =
          await readJsonResponse(response);

        if (!response.ok) {
          throw new Error(
            getApiErrorMessage(
              payload,
              "No fue posible obtener tus compras"
            )
          );
        }

        const result =
          parseListaComprasResponse(payload);

        if (!result) {
          throw new Error(
            "La respuesta de compras no es válida"
          );
        }

        setCompras(result.compras);
      } catch (errorValue: unknown) {
        setError(
          errorValue instanceof Error
            ? errorValue.message
            : "No fue posible obtener tus compras"
        );
      } finally {
        setLoading(false);
        setActualizando(false);
      }
    },
    []
  );

  useEffect(() => {
    void cargarCompras(true);
  }, [cargarCompras]);

  const resumen = useMemo(() => {
    const pendientes = compras.filter(
      (compra) =>
        compra.estado === "Pendiente de pago" ||
        compra.estado === "Pago reportado" ||
        compra.estado === "En validación"
    ).length;

    const finalizadas = compras.filter(
      (compra) =>
        compra.estado === "Pago validado" ||
        compra.estado ===
          "Inscripciones generadas"
    ).length;

    const vencidas = compras.filter(
      (compra) => compra.pagoVencido
    ).length;

    return {
      total: compras.length,
      pendientes,
      finalizadas,
      vencidas,
    };
  }, [compras]);

  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-gray-200 bg-white">
        <div className="flex items-center gap-3 text-gray-600">
          <Loader2
            className="animate-spin"
            size={22}
          />
          Cargando compras...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-[#0A3D62] to-[#1A4F7A] p-6 text-white shadow-lg">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium text-blue-100">
              Área de cliente
            </p>
            <h1 className="text-2xl font-bold md:text-3xl">
              Mis compras de cursos
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-blue-100">
              Consulta el estado de tus compras, revisa
              participantes y reporta pagos pendientes.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              void cargarCompras(false);
            }}
            disabled={actualizando}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 font-medium text-white ring-1 ring-white/20 transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={18}
              className={
                actualizando
                  ? "animate-spin"
                  : ""
              }
            />
            {actualizando
              ? "Actualizando..."
              : "Actualizar"}
          </button>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <ResumenCard
          icon={<FileText size={20} />}
          label="Total"
          value={resumen.total}
        />
        <ResumenCard
          icon={<Clock3 size={20} />}
          label="En proceso"
          value={resumen.pendientes}
        />
        <ResumenCard
          icon={<GraduationCap size={20} />}
          label="Finalizadas"
          value={resumen.finalizadas}
        />
        <ResumenCard
          icon={<AlertCircle size={20} />}
          label="Vencidas"
          value={resumen.vencidas}
        />
      </section>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertCircle
            size={20}
            className="mt-0.5 shrink-0"
          />
          <div>
            <p className="font-semibold">
              No se pudieron cargar las compras
            </p>
            <p className="mt-1 text-sm">
              {error}
            </p>
          </div>
        </div>
      )}

      {!error && compras.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-[#0A3D62]">
            <Ticket size={26} />
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            Todavía no tienes compras
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">
            Cuando compres uno o más cupos para un curso,
            la compra aparecerá aquí.
          </p>
          <Link
            href="/cursos"
            className="mt-6 inline-flex rounded-xl bg-[#0A3D62] px-5 py-2.5 font-semibold text-white transition hover:bg-[#1A4F7A]"
          >
            Ver cursos
          </Link>
        </section>
      ) : (
        <section className="grid gap-5">
          {compras.map((compra) => (
            <CompraCard
              key={compra.idCompra}
              compra={compra}
            />
          ))}
        </section>
      )}
    </div>
  );
}

function CompraCard({
  compra,
}: {
  compra: CompraCursoListaItem;
}) {
  const estado = getEstadoVisual(compra);

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex flex-col gap-5 p-5 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${estado.className}`}
            >
              {estado.label}
            </span>

            <span className="inline-flex rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600">
              {compra.folioCompra}
            </span>
          </div>

          <h2 className="text-lg font-bold text-[#0A3D62] md:text-xl">
            {compra.tituloCurso}
          </h2>

          <div className="mt-4 grid gap-3 text-sm text-gray-600 sm:grid-cols-2 lg:grid-cols-4">
            <DatoCompra
              icon={<CalendarDays size={17} />}
              label="Fecha de compra"
              value={formatDate(
                compra.fechaCompra
              )}
            />

            <DatoCompra
              icon={<Clock3 size={17} />}
              label="Límite de pago"
              value={formatDate(
                compra.fechaLimitePago
              )}
              valueClassName={
                compra.pagoVencido
                  ? "text-red-600"
                  : ""
              }
            />

            <DatoCompra
              icon={<Users size={17} />}
              label="Cupos"
              value={`${compra.cantidadCupos}`}
            />

            <DatoCompra
              icon={<WalletCards size={17} />}
              label="Total"
              value={formatCurrency(
                compra.total
              )}
              valueClassName="font-semibold text-gray-900"
            />
          </div>

          {compra.observaciones && (
            <div className="mt-4 rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-600">
              <span className="font-medium text-gray-800">
                Observaciones:
              </span>{" "}
              {compra.observaciones}
            </div>
          )}
        </div>

        <div className="shrink-0">
          <Link
            href={`/mis-compras/cursos/${compra.idCompra}`}
            className="inline-flex w-full items-center justify-center rounded-xl bg-[#0A3D62] px-5 py-2.5 font-semibold text-white transition hover:bg-[#1A4F7A] md:w-auto"
          >
            Ver detalle
          </Link>
        </div>
      </div>

      {compra.pagoVencido && (
        <div className="flex items-center gap-2 border-t border-red-100 bg-red-50 px-5 py-3 text-sm text-red-700">
          <AlertCircle size={17} />
          La fecha límite para reportar el pago ya venció.
        </div>
      )}
    </article>
  );
}

function ResumenCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0A3D62]">
        {icon}
      </div>
      <p className="text-2xl font-bold text-gray-900">
        {value}
      </p>
      <p className="mt-1 text-sm text-gray-600">
        {label}
      </p>
    </div>
  );
}

function DatoCompra({
  icon,
  label,
  value,
  valueClassName = "",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 text-[#0A3D62]">
        {icon}
      </span>
      <div>
        <p className="text-xs text-gray-500">
          {label}
        </p>
        <p
          className={`mt-0.5 text-sm text-gray-700 ${valueClassName}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}