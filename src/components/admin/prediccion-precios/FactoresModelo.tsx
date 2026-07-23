import {
  CalendarRange,
  CalendarSearch,
  MapPin,
  Monitor,
  Tag,
  Timer,
  Users,
} from "lucide-react";

const FACTORES = [
  {
    nombre: "Categoría",
    descripcion: "Tipo académico del curso",
    icono: Tag,
  },
  {
    nombre: "Modalidad",
    descripcion: "Presencial, virtual o híbrida",
    icono: Monitor,
  },
  {
    nombre: "Ubicación",
    descripcion: "Sede o ausencia de ubicación",
    icono: MapPin,
  },
  {
    nombre: "Año de inicio",
    descripcion: "Contexto temporal anual",
    icono: CalendarRange,
  },
  {
    nombre: "Mes de inicio",
    descripcion: "Componente estacional",
    icono: CalendarSearch,
  },
  {
    nombre: "Duración",
    descripcion: "Cantidad total de días",
    icono: Timer,
  },
  {
    nombre: "Cupo máximo",
    descripcion: "Capacidad disponible",
    icono: Users,
  },
] as const;

export function FactoresModelo() {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <div>
        <h2 className="text-base font-black text-[#0A3D62]">
          Variables consideradas
        </h2>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          El modelo utiliza siete entradas. No se muestran porcentajes de
          influencia porque todavía no se ha calculado una explicación formal
          del pipeline.
        </p>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1">
        {FACTORES.map(({ nombre, descripcion, icono: Icono }) => (
          <div
            key={nombre}
            className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-3"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#0A3D62] shadow-sm ring-1 ring-slate-100">
              <Icono size={16} />
            </span>

            <div className="min-w-0">
              <p className="text-xs font-extrabold text-[#0A3D62]">{nombre}</p>
              <p className="mt-0.5 text-[10px] leading-4 text-slate-500">
                {descripcion}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
