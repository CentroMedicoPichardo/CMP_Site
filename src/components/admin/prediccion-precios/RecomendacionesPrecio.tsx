import { BadgeCheck, Lightbulb, ShieldCheck } from "lucide-react";

const RECOMENDACIONES = [
  "Verifica que categoría, modalidad y ubicación correspondan al curso real.",
  "Ajusta el cupo máximo antes de generar la estimación definitiva.",
  "Compara la sugerencia con costos operativos y objetivos comerciales.",
  "Utiliza el rango estimado como referencia, no como límite obligatorio.",
] as const;

export function RecomendacionesPrecio() {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
          <Lightbulb size={18} />
        </span>
        <div>
          <h2 className="text-base font-black text-[#0A3D62]">
            Recomendaciones
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Buenas prácticas para interpretar la estimación.
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {RECOMENDACIONES.map((recomendacion) => (
          <div key={recomendacion} className="flex items-start gap-2.5">
            <BadgeCheck
              size={16}
              className="mt-0.5 shrink-0 text-emerald-600"
            />
            <p className="text-xs font-semibold leading-5 text-slate-600">
              {recomendacion}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
        <ShieldCheck size={17} className="mt-0.5 shrink-0 text-amber-700" />
        <p className="text-[11px] font-bold leading-5 text-amber-800">
          La decisión final del precio corresponde al administrador.
        </p>
      </div>
    </section>
  );
}
