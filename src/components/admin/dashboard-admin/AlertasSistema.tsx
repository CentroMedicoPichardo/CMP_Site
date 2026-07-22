"use client";

import {
  AlertTriangle,
  Bell,
  CircleAlert,
  Info,
  ShieldAlert,
} from "lucide-react";

import type { AlertaDashboard } from "@/types/dashboard-admin";

interface AlertasSistemaProps {
  alertas: AlertaDashboard[];
}

interface ConfiguracionAlerta {
  etiqueta: string;
  contenedor: string;
  icono: string;
  cantidad: string;
  indicador: string;
  Icono: typeof Info;
}

function cn(
  ...clases: Array<
    string | false | null | undefined
  >
): string {
  return clases.filter(Boolean).join(" ");
}

function numeroSeguro(
  valor: number | null | undefined,
): number {
  return typeof valor === "number" &&
    Number.isFinite(valor)
    ? Math.max(0, Math.trunc(valor))
    : 0;
}

function obtenerConfiguracion(
  tipo: AlertaDashboard["tipo"],
): ConfiguracionAlerta {
  if (tipo === "critica") {
    return {
      etiqueta: "Crítica",
      contenedor:
        "border-red-200 bg-red-50/70",
      icono:
        "border-red-200 bg-white text-red-600",
      cantidad:
        "bg-red-100 text-red-700",
      indicador: "bg-red-500",
      Icono: CircleAlert,
    };
  }

  if (tipo === "advertencia") {
    return {
      etiqueta: "Advertencia",
      contenedor:
        "border-amber-200 bg-amber-50/70",
      icono:
        "border-amber-200 bg-white text-amber-600",
      cantidad:
        "bg-amber-100 text-amber-700",
      indicador: "bg-amber-500",
      Icono: AlertTriangle,
    };
  }

  return {
    etiqueta: "Informativa",
    contenedor:
      "border-blue-200 bg-blue-50/70",
    icono:
      "border-blue-200 bg-white text-blue-600",
    cantidad:
      "bg-blue-100 text-blue-700",
    indicador: "bg-blue-500",
    Icono: Info,
  };
}

function obtenerCantidadTotal(
  alertas: AlertaDashboard[],
): number {
  return alertas.reduce(
    (total, alerta) =>
      total +
      numeroSeguro(alerta.cantidad),
    0,
  );
}

export function AlertasSistema({
  alertas,
}: AlertasSistemaProps) {
  const alertasSeguras =
    Array.isArray(alertas)
      ? alertas
      : [];

  const totalCriticas =
    alertasSeguras.filter(
      (alerta) =>
        alerta.tipo === "critica",
    ).length;

  const totalAdvertencias =
    alertasSeguras.filter(
      (alerta) =>
        alerta.tipo === "advertencia",
    ).length;

  const totalInformativas =
    alertasSeguras.filter(
      (alerta) =>
        alerta.tipo === "informativa",
    ).length;

  const cantidadTotal =
    obtenerCantidadTotal(
      alertasSeguras,
    );

  const activarScroll =
    alertasSeguras.length > 4;

  return (
    <section className="flex h-full min-h-[440px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <header className="flex min-h-[82px] items-center justify-between gap-4 border-b border-gray-100 px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0A3D62] text-[#FFC300]">
            <Bell
              size={19}
              strokeWidth={1.9}
              aria-hidden="true"
            />

            {cantidadTotal > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-red-500 px-1 text-[9px] font-extrabold text-white">
                {cantidadTotal > 99
                  ? "99+"
                  : cantidadTotal}
              </span>
            )}
          </span>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-extrabold text-[#0A3D62]">
                Alertas del sistema
              </h2>

              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-600">
                {alertasSeguras.length}{" "}
                {alertasSeguras.length === 1
                  ? "alerta"
                  : "alertas"}
              </span>
            </div>

            <p className="mt-0.5 text-xs text-gray-500">
              Eventos que requieren atención
            </p>
          </div>
        </div>

        {totalCriticas > 0 && (
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-extrabold text-red-700">
            <ShieldAlert
              size={12}
              aria-hidden="true"
            />

            {totalCriticas}{" "}
            {totalCriticas === 1
              ? "crítica"
              : "críticas"}
          </span>
        )}
      </header>

      {alertasSeguras.length === 0 ? (
        <div className="flex flex-1 items-center justify-center px-5 py-8">
          <div className="w-full rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-5 py-12 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm">
              <Bell
                size={23}
                aria-hidden="true"
              />
            </span>

            <p className="mt-3 text-sm font-bold text-gray-700">
              No hay alertas pendientes
            </p>

            <p className="mt-1 text-xs text-gray-500">
              El sistema no detectó eventos
              que requieran atención.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div
            className={cn(
              "flex-1 space-y-3 p-5",
              activarScroll &&
                "max-h-[580px] overflow-y-auto overscroll-contain pr-3",
            )}
            style={
              activarScroll
                ? {
                    scrollbarGutter:
                      "stable",
                  }
                : undefined
            }
            aria-label="Listado de alertas del sistema"
          >
            {alertasSeguras.map(
              (alerta) => {
                const configuracion =
                  obtenerConfiguracion(
                    alerta.tipo,
                  );

                const Icono =
                  configuracion.Icono;

                const cantidad =
                  numeroSeguro(
                    alerta.cantidad,
                  );

                return (
                  <article
                    key={alerta.id}
                    className={cn(
                      "relative flex items-start gap-3 overflow-hidden rounded-2xl border p-4 pl-5",
                      configuracion.contenedor,
                    )}
                  >
                    <span
                      className={cn(
                        "absolute bottom-3 left-0 top-3 w-1 rounded-r-full",
                        configuracion.indicador,
                      )}
                      aria-hidden="true"
                    />

                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border",
                        configuracion.icono,
                      )}
                    >
                      <Icono
                        size={18}
                        strokeWidth={1.9}
                        aria-hidden="true"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-extrabold text-gray-800">
                            {alerta.titulo ||
                              "Alerta del sistema"}
                          </h3>

                          <p className="mt-1 text-xs leading-5 text-gray-600">
                            {alerta.descripcion ||
                              "No hay detalles adicionales disponibles."}
                          </p>
                        </div>

                        {cantidad > 0 && (
                          <span
                            className={cn(
                              "inline-flex min-w-7 shrink-0 items-center justify-center rounded-full px-2 py-1 text-[10px] font-extrabold",
                              configuracion.cantidad,
                            )}
                            title={`${cantidad} registros relacionados`}
                          >
                            {cantidad}
                          </span>
                        )}
                      </div>

                      <div className="mt-3">
                        <span
                          className={cn(
                            "inline-flex rounded-full px-2 py-0.5 text-[9px] font-extrabold",
                            configuracion.cantidad,
                          )}
                        >
                          {configuracion.etiqueta}
                        </span>
                      </div>
                    </div>
                  </article>
                );
              },
            )}
          </div>

          <footer className="flex min-h-[46px] flex-wrap items-center gap-x-4 gap-y-2 border-t border-gray-100 px-5 py-3 text-[10px] font-semibold text-gray-500">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-red-500" />

              {totalCriticas} críticas
            </span>

            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-500" />

              {totalAdvertencias} advertencias
            </span>

            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-blue-500" />

              {totalInformativas} informativas
            </span>

            {activarScroll && (
              <span className="ml-auto text-gray-400">
                Desplázate para ver más
              </span>
            )}
          </footer>
        </>
      )}
    </section>
  );
}