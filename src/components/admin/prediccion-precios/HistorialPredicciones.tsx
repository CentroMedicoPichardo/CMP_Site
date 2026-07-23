import { Clock3, History } from "lucide-react";

import type { PrediccionHistorialItem } from "./types";

interface HistorialPrediccionesProps {
  items: PrediccionHistorialItem[];
}

const moneda = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  minimumFractionDigits: 2,
});

export function HistorialPredicciones({
  items,
}: HistorialPrediccionesProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
            <History size={18} />
          </span>
          <div>
            <h2 className="text-base font-black text-[#0A3D62]">
              Historial reciente
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Predicciones realizadas durante esta sesión.
            </p>
          </div>
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-extrabold text-slate-600">
          {items.length} registros
        </span>
      </div>

      {items.length === 0 ? (
        <div className="flex min-h-52 flex-col items-center justify-center p-6 text-center">
          <Clock3 size={28} className="text-slate-300" />
          <p className="mt-3 text-sm font-extrabold text-slate-600">
            Aún no hay predicciones
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-400">
            Los resultados aparecerán aquí mientras permanezcas en la página.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                {[
                  "Curso",
                  "Categoría",
                  "Modalidad",
                  "Duración",
                  "Precio sugerido",
                  "Fecha",
                ].map((encabezado) => (
                  <th
                    key={encabezado}
                    className="whitespace-nowrap px-4 py-3 text-[10px] font-black uppercase tracking-wide text-slate-500"
                  >
                    {encabezado}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70">
                  <td className="max-w-52 px-4 py-3 text-xs font-extrabold text-[#0A3D62]">
                    <span className="block truncate">{item.tituloCurso}</span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-600">
                    {item.categoriaNombre}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-600">
                    {item.modalidadNombre}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-600">
                    {item.duracionDias} días
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs font-black text-[#0A3D62]">
                    {moneda.format(item.precioSugerido)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-[10px] text-slate-500">
                    {item.fechaConsulta}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
