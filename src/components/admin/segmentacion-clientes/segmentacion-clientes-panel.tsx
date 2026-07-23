"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Database,
  LoaderCircle,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import ClientesSegmentadosTable from "./clientes-segmentados-table";
import MetricasModelo from "./metricas-modelo";
import RecomendacionesSegmentos from "./recomendaciones-segmentos";
import ResumenSegmentos from "./resumen-segmentos";
import SegmentacionClientesHeader from "./segmentacion-clientes-header";
import SegmentacionClientesKpis from "./segmentacion-clientes-kpis";

import type {
  RecalculationResponse,
  SegmentedClient,
  SegmentedClientsResponse,
  SegmentationSummary,
  SummaryResponse,
} from "./segmentacion-clientes-types";

import {
  formatNumber,
} from "./segmentacion-clientes-utils";

interface SegmentacionClientesPanelProps {
  adminName: string;
}

function LoadingState() {
  return (
    <div
      className="flex min-h-[460px] items-center justify-center rounded-[28px] border border-slate-200 bg-white shadow-sm"
      aria-live="polite"
    >
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
          <LoaderCircle
            className="h-8 w-8 animate-spin"
            aria-hidden="true"
          />
        </div>

        <p className="mt-5 text-sm font-semibold text-slate-800">
          Consultando el modelo activo…
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Preparando segmentos y clientes
        </p>
      </div>
    </div>
  );
}

export default function SegmentacionClientesPanel({
  adminName,
}: SegmentacionClientesPanelProps) {
  const [summary, setSummary] =
    useState<SegmentationSummary | null>(null);

  const [clients, setClients] =
    useState<SegmentedClient[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadingClients, setLoadingClients] =
    useState(true);

  const [recalculating, setRecalculating] =
    useState(false);

  const [selectedSegment, setSelectedSegment] =
    useState("todos");

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const [successMessage, setSuccessMessage] =
    useState<string | null>(null);

  const loadSummary = useCallback(
    async (showMainLoader = true) => {
      if (showMainLoader) {
        setLoading(true);
      }

      setErrorMessage(null);

      try {
        const response = await fetch(
          "/api/admin/segmentacion-clientes/resumen",
          {
            method: "GET",
            credentials: "same-origin",
            cache: "no-store",
          },
        );

        const payload =
          (await response.json()) as SummaryResponse;

        if (!response.ok || !payload.ok || !payload.data) {
          throw new Error(
            payload.message ||
              "No fue posible consultar la segmentación.",
          );
        }

        setSummary(payload.data);
      } catch (error) {
        setSummary(null);

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "No fue posible consultar la segmentación.",
        );
      } finally {
        if (showMainLoader) {
          setLoading(false);
        }
      }
    },
    [],
  );

  const loadClients = useCallback(
    async (segmentKey: string) => {
      setLoadingClients(true);

      try {
        const params = new URLSearchParams({
          segmento: segmentKey,
          limite: "6",
        });

        const response = await fetch(
          `/api/admin/segmentacion-clientes/clientes?${params.toString()}`,
          {
            method: "GET",
            credentials: "same-origin",
            cache: "no-store",
          },
        );

        const payload =
          (await response.json()) as SegmentedClientsResponse;

        if (!response.ok || !payload.ok || !payload.data) {
          throw new Error(
            payload.message ||
              "No fue posible consultar los clientes.",
          );
        }

        setClients(payload.data.clients);
      } catch (error) {
        setClients([]);

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "No fue posible consultar los clientes.",
        );
      } finally {
        setLoadingClients(false);
      }
    },
    [],
  );

  useEffect(() => {
    void loadSummary();
  }, [loadSummary]);

  useEffect(() => {
    void loadClients(selectedSegment);
  }, [loadClients, selectedSegment]);

  const sortedSegments = useMemo(
    () =>
      [...(summary?.distribution ?? [])].sort(
        (first, second) =>
          first.cluster - second.cluster,
      ),
    [summary],
  );

  const visibleSegments = useMemo(
    () =>
      selectedSegment === "todos"
        ? sortedSegments
        : sortedSegments.filter(
            (segment) =>
              segment.segmentKey ===
              selectedSegment,
          ),
    [selectedSegment, sortedSegments],
  );

  const visibleCustomers = useMemo(
    () =>
      visibleSegments.reduce(
        (total, segment) =>
          total + segment.customerCount,
        0,
      ),
    [visibleSegments],
  );

  async function handleRecalculate() {
    const confirmed = window.confirm(
      "Se entrenará una nueva versión de K-Means y se reemplazarán las asignaciones vigentes. ¿Deseas continuar?",
    );

    if (!confirmed) {
      return;
    }

    setRecalculating(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(
        "/api/admin/segmentacion-clientes/recalcular",
        {
          method: "POST",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            confirm: true,
          }),
        },
      );

      const payload =
        (await response.json()) as RecalculationResponse;

      if (!response.ok || !payload.ok) {
        throw new Error(
          payload.message ||
            "No fue posible actualizar la segmentación.",
        );
      }

      const inserted =
        payload.result?.totalAssignmentsInserted;

      setSuccessMessage(
        inserted !== undefined
          ? `La segmentación se actualizó correctamente. Se guardaron ${formatNumber(
              inserted,
              0,
            )} asignaciones.`
          : payload.message,
      );

      await Promise.all([
        loadSummary(false),
        loadClients(selectedSegment),
      ]);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No fue posible actualizar la segmentación.",
      );
    } finally {
      setRecalculating(false);
    }
  }

  if (loading) {
    return <LoadingState />;
  }

  return (
    <section className="space-y-6 text-slate-900">
      <SegmentacionClientesHeader
        adminName={adminName}
        trainedAt={summary?.model.trainedAt}
        selectedSegment={selectedSegment}
        segments={sortedSegments}
        recalculating={recalculating}
        onSegmentChange={setSelectedSegment}
        onReload={() => {
          void Promise.all([
            loadSummary(false),
            loadClients(selectedSegment),
          ]);
        }}
        onRecalculate={() => {
          void handleRecalculate();
        }}
      />

      {errorMessage && (
        <div
          className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900 shadow-sm"
          role="alert"
        >
          <AlertTriangle
            className="mt-0.5 h-5 w-5 shrink-0 text-rose-600"
            aria-hidden="true"
          />

          <div>
            <p className="font-bold">
              Ocurrió un problema
            </p>

            <p className="mt-1 text-rose-800">
              {errorMessage}
            </p>
          </div>
        </div>
      )}

      {successMessage && (
        <div
          className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 shadow-sm"
          role="status"
        >
          <CheckCircle2
            className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600"
            aria-hidden="true"
          />

          <div>
            <p className="font-bold">
              Operación completada
            </p>

            <p className="mt-1 text-emerald-800">
              {successMessage}
            </p>
          </div>
        </div>
      )}

      {!summary ? (
        <div className="rounded-[28px] border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-sm">
          <Database
            className="mx-auto h-10 w-10 text-slate-400"
            aria-hidden="true"
          />

          <h2 className="mt-4 text-lg font-bold text-slate-950">
            No hay información disponible
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            Revisa el mensaje de error y vuelve a
            cargar el resumen.
          </p>
        </div>
      ) : (
        <>
          <SegmentacionClientesKpis
            summary={summary}
            segments={sortedSegments}
          />

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.75fr)_minmax(320px,0.75fr)]">
            <ResumenSegmentos
              segments={visibleSegments}
              totalCustomers={visibleCustomers}
            />

            <RecomendacionesSegmentos
              segments={visibleSegments}
            />
          </div>

          <ClientesSegmentadosTable
            clients={clients}
            loading={loadingClients}
            selectedSegment={selectedSegment}
          />

          <MetricasModelo
            summary={summary}
          />
        </>
      )}
    </section>
  );
}
