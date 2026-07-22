"use client";

import {
  ChevronDown,
  Laptop,
  SlidersHorizontal,
  UsersRound,
  X,
} from "lucide-react";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";

const modalidades = [
  {
    value: "",
    label: "Cualquier modalidad",
  },
  {
    value: "1",
    label: "Presencial",
  },
  {
    value: "2",
    label: "Online",
  },
  {
    value: "3",
    label: "Híbrido",
  },
];

const publicos = [
  {
    value: "",
    label: "Cualquier público",
  },
  {
    value: "Padres",
    label: "Padres",
  },
  {
    value: "Niños",
    label: "Niños",
  },
  {
    value: "Familia",
    label: "Familia",
  },
  {
    value: "Adolescentes",
    label: "Adolescentes",
  },
];

function construirRuta(
  params: URLSearchParams,
): string {
  const query = params.toString();

  return query
    ? `/cursos?${query}`
    : "/cursos";
}

export function FiltroCursos() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const modalidadSeleccionada =
    searchParams.get("modalidadId") || "";

  const publicoSeleccionado =
    searchParams.get("dirigidoA") || "";

  const cantidadFiltrosActivos = [
    modalidadSeleccionada,
    publicoSeleccionado,
  ].filter(Boolean).length;

  const hayFiltrosActivos =
    cantidadFiltrosActivos > 0;

  const actualizarFiltro = (
    key: string,
    value: string,
  ) => {
    const params = new URLSearchParams(
      searchParams.toString(),
    );

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(construirRuta(params), {
      scroll: false,
    });
  };

  const limpiarFiltros = () => {
    const params = new URLSearchParams(
      searchParams.toString(),
    );

    params.delete("modalidadId");
    params.delete("dirigidoA");

    router.push(construirRuta(params), {
      scroll: false,
    });
  };

  return (
    <section
      className="mb-7 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_8px_24px_rgba(10,61,98,0.07)]"
      aria-labelledby="filtros-cursos-titulo"
    >
      {/* Encabezado */}
      <div className="flex items-center justify-between gap-3 border-b border-gray-100 bg-[#F8FAFC] px-4 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EAF2F8] text-[#0A3D62]">
            <SlidersHorizontal
              size={18}
              strokeWidth={1.9}
              aria-hidden="true"
            />
          </div>

          <div className="min-w-0">
            <h2
              id="filtros-cursos-titulo"
              className="text-sm font-extrabold text-[#0A3D62]"
            >
              Filtrar cursos
            </h2>

            <p className="hidden text-xs text-gray-500 sm:block">
              Encuentra cursos por modalidad y público.
            </p>
          </div>
        </div>

        {hayFiltrosActivos && (
          <span className="inline-flex shrink-0 items-center rounded-full bg-[#0A3D62] px-2.5 py-1 text-[10px] font-bold text-white">
            {cantidadFiltrosActivos}{" "}
            {cantidadFiltrosActivos === 1
              ? "activo"
              : "activos"}
          </span>
        )}
      </div>

      {/* Controles */}
      <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-end">
        {/* Modalidad */}
        <div className="min-w-0">
          <label
            htmlFor="filtro-modalidad"
            className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-gray-500"
          >
            <Laptop
              size={13}
              className="text-[#0A3D62]"
              aria-hidden="true"
            />

            Modalidad
          </label>

          <div className="relative">
            <select
              id="filtro-modalidad"
              value={modalidadSeleccionada}
              onChange={(event) =>
                actualizarFiltro(
                  "modalidadId",
                  event.target.value,
                )
              }
              className="h-11 w-full cursor-pointer appearance-none rounded-xl border border-gray-200 bg-[#F8FAFC] py-2 pl-3.5 pr-10 text-sm font-semibold text-gray-700 outline-none transition-colors hover:border-[#0A3D62]/30 focus:border-[#0A3D62] focus:bg-white focus:ring-2 focus:ring-[#0A3D62]/10"
            >
              {modalidades.map((modalidad) => (
                <option
                  key={
                    modalidad.value ||
                    "todas-modalidades"
                  }
                  value={modalidad.value}
                >
                  {modalidad.label}
                </option>
              ))}
            </select>

            <ChevronDown
              size={17}
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Público */}
        <div className="min-w-0">
          <label
            htmlFor="filtro-publico"
            className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-gray-500"
          >
            <UsersRound
              size={13}
              className="text-[#0A3D62]"
              aria-hidden="true"
            />

            Dirigido a
          </label>

          <div className="relative">
            <select
              id="filtro-publico"
              value={publicoSeleccionado}
              onChange={(event) =>
                actualizarFiltro(
                  "dirigidoA",
                  event.target.value,
                )
              }
              className="h-11 w-full cursor-pointer appearance-none rounded-xl border border-gray-200 bg-[#F8FAFC] py-2 pl-3.5 pr-10 text-sm font-semibold text-gray-700 outline-none transition-colors hover:border-[#0A3D62]/30 focus:border-[#0A3D62] focus:bg-white focus:ring-2 focus:ring-[#0A3D62]/10"
            >
              {publicos.map((publico) => (
                <option
                  key={
                    publico.value ||
                    "todos-publicos"
                  }
                  value={publico.value}
                >
                  {publico.label}
                </option>
              ))}
            </select>

            <ChevronDown
              size={17}
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Limpiar */}
        {hayFiltrosActivos && (
          <button
            type="button"
            onClick={limpiarFiltros}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 text-sm font-bold text-red-600 transition-colors hover:border-red-300 hover:bg-red-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300 lg:w-auto"
          >
            <X
              size={16}
              strokeWidth={2}
              aria-hidden="true"
            />

            Limpiar
          </button>
        )}
      </div>
    </section>
  );
}