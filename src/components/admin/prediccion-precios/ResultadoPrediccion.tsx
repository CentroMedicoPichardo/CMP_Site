import {
  BadgeCheck,
  CircleDollarSign,
  Info,
  Scale,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import type { PrediccionResultado } from "./types";

interface ResultadoPrediccionProps {
  resultado: PrediccionResultado | null;
  precioActual?: number;
}

const moneda = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  minimumFractionDigits: 2,
});

export function ResultadoPrediccion({
  resultado,
  precioActual,
}: ResultadoPrediccionProps) {
  if (!resultado) {
    return (
      <section className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
        <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#EAF2F8] text-[#0A3D62]">
          <Sparkles size={29} />
        </span>

        <h2 className="mt-5 text-lg font-black text-[#0A3D62]">
          Resultado de la predicción
        </h2>

        <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
          Completa los datos del curso y ejecuta la estimación para consultar
          el precio sugerido y su rango orientativo.
        </p>
      </section>
    );
  }

  const hayPrecioActual =
    typeof precioActual === "number" && Number.isFinite(precioActual);

  const diferencia = hayPrecioActual
    ? precioActual - resultado.precioSugerido
    : null;

  const diferenciaPorcentual =
    diferencia !== null && resultado.precioSugerido > 0
      ? (diferencia / resultado.precioSugerido) * 100
      : null;

  const porEncima = diferencia !== null && diferencia > 0;
  const porDebajo = diferencia !== null && diferencia < 0;

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
            <Sparkles size={19} />
          </span>
          <div>
            <h2 className="text-base font-black text-[#0A3D62]">
              Resultado de la predicción
            </h2>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Estimación obtenida con el modelo de precio de cursos.
            </p>
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="rounded-3xl bg-[linear-gradient(135deg,#0A3D62_0%,#0E527E_100%)] px-5 py-7 text-center text-white shadow-lg">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">
            Precio sugerido
          </p>
          <p className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
            {moneda.format(resultado.precioSugerido)}
          </p>
          <p className="mt-2 text-xs font-semibold text-white/70">
            MXN por inscripción
          </p>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <article className="rounded-2xl border border-violet-100 bg-violet-50/70 p-4">
            <div className="flex items-center gap-2 text-violet-700">
              <CircleDollarSign size={17} />
              <p className="text-[10px] font-extrabold uppercase tracking-wide">
                Rango estimado
              </p>
            </div>
            <p className="mt-2 text-sm font-black text-[#0A3D62]">
              {typeof resultado.precioMinimoEstimado === "number" &&
              typeof resultado.precioMaximoEstimado === "number"
                ? `${moneda.format(
                    resultado.precioMinimoEstimado,
                  )} – ${moneda.format(resultado.precioMaximoEstimado)}`
                : "No disponible"}
            </p>
          </article>

          <article className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
            <div className="flex items-center gap-2 text-emerald-700">
              <BadgeCheck size={17} />
              <p className="text-[10px] font-extrabold uppercase tracking-wide">
                Desempeño
              </p>
            </div>
            <p className="mt-2 text-sm font-black text-[#0A3D62]">
              R² 0.9711
            </p>
            <p className="mt-1 text-[10px] font-bold text-emerald-700">
              Excelente ajuste
            </p>
          </article>

          <article className="rounded-2xl border border-amber-100 bg-amber-50/70 p-4">
            <div className="flex items-center gap-2 text-amber-700">
              <Scale size={17} />
              <p className="text-[10px] font-extrabold uppercase tracking-wide">
                Comparación
              </p>
            </div>

            {diferenciaPorcentual !== null ? (
              <>
                <div className="mt-2 flex items-center gap-1.5">
                  {porEncima ? (
                    <TrendingUp size={16} className="text-red-500" />
                  ) : porDebajo ? (
                    <TrendingDown size={16} className="text-emerald-600" />
                  ) : (
                    <Scale size={16} className="text-slate-500" />
                  )}
                  <p className="text-sm font-black text-[#0A3D62]">
                    {diferenciaPorcentual >= 0 ? "+" : ""}
                    {diferenciaPorcentual.toFixed(2)}%
                  </p>
                </div>
                <p className="mt-1 text-[10px] font-bold text-slate-500">
                  Contra el precio actual
                </p>
              </>
            ) : (
              <p className="mt-2 text-sm font-black text-[#0A3D62]">
                Sin comparación
              </p>
            )}
          </article>
        </div>

        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sky-800">
          <Info size={17} className="mt-0.5 shrink-0" />
          <p className="text-xs font-semibold leading-5">
            {resultado.aviso ??
              "El precio sugerido es orientativo y debe revisarse antes de publicarse."}
          </p>
        </div>

        <div className="mt-4 text-[10px] font-semibold text-slate-400">
          {resultado.algoritmo ?? "Regresión lineal múltiple"}
          {resultado.version ? ` · versión ${resultado.version}` : ""}
        </div>
      </div>
    </section>
  );
}
