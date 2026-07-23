import {
  BadgeDollarSign,
  BrainCircuit,
  ChartNoAxesCombined,
  Target,
} from "lucide-react";

const METRICAS = [
  {
    titulo: "R² del modelo",
    valor: "0.9711",
    descripcion: "Excelente ajuste en el conjunto de prueba",
    icono: Target,
    estilo: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  },
  {
    titulo: "MAE",
    valor: "$47.61",
    descripcion: "Error absoluto promedio",
    icono: BadgeDollarSign,
    estilo: "bg-violet-50 text-violet-700 ring-violet-100",
  },
  {
    titulo: "RMSE",
    valor: "$54.26",
    descripcion: "Penaliza errores de mayor magnitud",
    icono: ChartNoAxesCombined,
    estilo: "bg-sky-50 text-sky-700 ring-sky-100",
  },
  {
    titulo: "Variables utilizadas",
    valor: "7",
    descripcion: "Entradas requeridas por el pipeline",
    icono: BrainCircuit,
    estilo: "bg-amber-50 text-amber-700 ring-amber-100",
  },
] as const;

export function MetricasModelo() {
  return (
    <section
      aria-label="Métricas del modelo"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {METRICAS.map(({ titulo, valor, descripcion, icono: Icono, estilo }) => (
        <article
          key={titulo}
          className="group rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-start justify-between gap-4">
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ring-1 ${estilo}`}
            >
              <Icono size={20} strokeWidth={1.9} aria-hidden="true" />
            </span>

            <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-extrabold uppercase tracking-wide text-emerald-700">
              Modelo activo
            </span>
          </div>

          <p className="mt-4 text-xs font-bold text-slate-500">{titulo}</p>
          <p className="mt-1 text-2xl font-black tracking-tight text-[#0A3D62]">
            {valor}
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-500">{descripcion}</p>
        </article>
      ))}
    </section>
  );
}
