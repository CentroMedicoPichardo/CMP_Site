import {
  ArrowRight,
  LoaderCircle,
  Users,
} from "lucide-react";

import type {
  SegmentedClient,
} from "./segmentacion-clientes-types";

import {
  formatCurrency,
  formatDate,
  formatNumber,
  getSegmentAppearance,
} from "./segmentacion-clientes-utils";

interface ClientesSegmentadosTableProps {
  clients: SegmentedClient[];
  loading: boolean;
  selectedSegment: string;
}

export default function ClientesSegmentadosTable({
  clients,
  loading,
  selectedSegment,
}: ClientesSegmentadosTableProps) {
  return (
    <section className="rounded-[24px] border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
      <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-700">
            Clientes clasificados
          </p>

          <h2 className="mt-1 text-lg font-bold text-slate-950">
            Muestra de asignaciones
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Información comercial del segmento
            seleccionado
          </p>
        </div>

        <span className="inline-flex w-fit rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700">
          {selectedSegment === "todos"
            ? "Todos los segmentos"
            : "Filtro aplicado"}
        </span>
      </div>

      {loading ? (
        <div className="flex min-h-64 items-center justify-center">
          <LoaderCircle
            className="h-7 w-7 animate-spin text-blue-600"
            aria-hidden="true"
          />
        </div>
      ) : clients.length === 0 ? (
        <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
          <Users
            className="h-9 w-9 text-slate-300"
            aria-hidden="true"
          />

          <p className="mt-3 text-sm font-bold text-slate-700">
            No se encontraron clientes
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Cambia el filtro o vuelve a cargar los datos.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[980px] w-full">
            <thead>
              <tr className="bg-slate-50/80 text-left">
                {[
                  "Cliente",
                  "Segmento",
                  "Compras válidas",
                  "Gasto total",
                  "Conversión",
                  "Última compra",
                  "Acción sugerida",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-5 py-3 text-[11px] font-bold uppercase tracking-wide text-slate-500 first:pl-6 last:pr-6"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {clients.map((client) => {
                const appearance =
                  getSegmentAppearance(
                    client.segmentKey,
                  );

                return (
                  <tr
                    key={client.userId}
                    className="transition hover:bg-slate-50/70"
                  >
                    <td className="px-5 py-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                          {client.initials}
                        </div>

                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            {client.fullName}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-400">
                            ID {client.userId}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${appearance.badge}`}
                      >
                        {client.segmentName}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                      {formatNumber(
                        client.validPurchases,
                        0,
                      )}
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                      {formatCurrency(
                        client.totalSpent,
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`text-sm font-bold ${
                          client.conversionRate >= 75
                            ? "text-emerald-700"
                            : client.conversionRate >= 45
                              ? "text-amber-700"
                              : "text-rose-700"
                        }`}
                      >
                        {formatNumber(
                          client.conversionRate,
                        )}
                        %
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {formatDate(
                        client.lastPurchaseAt,
                      )}
                    </td>

                    <td className="px-5 py-4 pr-6">
                      <div className="flex items-center gap-2">
                        <p className="max-w-[260px] truncate text-sm text-slate-600">
                          {client.suggestedAction ??
                            "Sin acción registrada"}
                        </p>

                        <ArrowRight
                          className={`h-4 w-4 shrink-0 ${appearance.accent}`}
                          aria-hidden="true"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
