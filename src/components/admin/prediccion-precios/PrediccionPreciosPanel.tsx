"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Activity, CalendarDays, RefreshCw } from "lucide-react";

import type {
  CategoriaCursoOption,
  ModalidadCurso,
  UbicacionCursoOption,
} from "@/types/catalogos-cursos";

import { FactoresModelo } from "./FactoresModelo";
import { FormularioPrediccion } from "./FormularioPrediccion";
import { HistorialPredicciones } from "./HistorialPredicciones";
import { MetricasModelo } from "./MetricasModelo";
import { RecomendacionesPrecio } from "./RecomendacionesPrecio";
import { ResultadoPrediccion } from "./ResultadoPrediccion";
import type {
  PrediccionApiResponse,
  PrediccionFormulario,
  PrediccionHistorialItem,
  PrediccionResultado,
} from "./types";

const FORMULARIO_INICIAL: PrediccionFormulario = {
  tituloCurso: "",
  categoriaId: null,
  modalidadId: null,
  ubicacionId: null,
  fechaInicio: "",
  fechaFin: "",
  cupoMaximo: 20,
  precioActual: "",
};

async function leerJson<T>(response: Response): Promise<T> {
  const texto = await response.text();

  if (!texto) {
    throw new Error("El servidor devolvió una respuesta vacía.");
  }

  try {
    return JSON.parse(texto) as T;
  } catch {
    throw new Error("El servidor devolvió una respuesta inválida.");
  }
}

function calcularDuracionDias(fechaInicio: string, fechaFin: string): number {
  const inicio = new Date(`${fechaInicio}T00:00:00Z`);
  const fin = new Date(`${fechaFin}T00:00:00Z`);
  const diferencia = fin.getTime() - inicio.getTime();

  return Math.floor(diferencia / 86_400_000) + 1;
}

export function PrediccionPreciosPanel() {
  const [formData, setFormData] =
    useState<PrediccionFormulario>(FORMULARIO_INICIAL);

  const [categorias, setCategorias] = useState<CategoriaCursoOption[]>([]);
  const [modalidades, setModalidades] = useState<ModalidadCurso[]>([]);
  const [ubicaciones, setUbicaciones] = useState<UbicacionCursoOption[]>([]);

  const [loadingCatalogos, setLoadingCatalogos] = useState(true);
  const [catalogosError, setCatalogosError] = useState<string | null>(null);

  const [calculando, setCalculando] = useState(false);
  const [errorPrediccion, setErrorPrediccion] = useState<string | null>(null);
  const [resultado, setResultado] = useState<PrediccionResultado | null>(null);
  const [historial, setHistorial] = useState<PrediccionHistorialItem[]>([]);

  const cargarCatalogos = useCallback(async () => {
    setLoadingCatalogos(true);
    setCatalogosError(null);

    try {
      const [categoriasRes, modalidadesRes, ubicacionesRes] = await Promise.all([
        fetch("/api/categorias?admin=true", { cache: "no-store" }),
        fetch("/api/modalidades?admin=true", { cache: "no-store" }),
        fetch("/api/ubicaciones?admin=true", { cache: "no-store" }),
      ]);

      if (!categoriasRes.ok || !modalidadesRes.ok || !ubicacionesRes.ok) {
        throw new Error("No fue posible cargar los catálogos.");
      }

      const [categoriasData, modalidadesData, ubicacionesData] =
        await Promise.all([
          leerJson<CategoriaCursoOption[]>(categoriasRes),
          leerJson<ModalidadCurso[]>(modalidadesRes),
          leerJson<UbicacionCursoOption[]>(ubicacionesRes),
        ]);

      setCategorias(Array.isArray(categoriasData) ? categoriasData : []);
      setModalidades(Array.isArray(modalidadesData) ? modalidadesData : []);
      setUbicaciones(Array.isArray(ubicacionesData) ? ubicacionesData : []);
    } catch (error) {
      console.error("Error cargando catálogos:", error);
      setCatalogosError(
        error instanceof Error
          ? error.message
          : "No fue posible cargar los catálogos.",
      );
    } finally {
      setLoadingCatalogos(false);
    }
  }, []);

  useEffect(() => {
    void cargarCatalogos();
  }, [cargarCatalogos]);

  const actualizarCampo = (
    campo: keyof PrediccionFormulario,
    valor: string | number | null,
  ) => {
    setFormData((actual) => ({
      ...actual,
      [campo]: valor,
    }));

    setResultado(null);
    setErrorPrediccion(null);
  };

  const limpiar = () => {
    setFormData(FORMULARIO_INICIAL);
    setResultado(null);
    setErrorPrediccion(null);
  };

  const calcular = async () => {
    setErrorPrediccion(null);

    if (!formData.categoriaId) {
      setErrorPrediccion("Selecciona una categoría.");
      return;
    }

    if (!formData.modalidadId) {
      setErrorPrediccion("Selecciona una modalidad.");
      return;
    }

    if (!formData.fechaInicio || !formData.fechaFin) {
      setErrorPrediccion("Selecciona la fecha de inicio y la fecha final.");
      return;
    }

    if (formData.fechaFin < formData.fechaInicio) {
      setErrorPrediccion(
        "La fecha final no puede ser anterior a la fecha de inicio.",
      );
      return;
    }

    if (!Number.isInteger(formData.cupoMaximo) || formData.cupoMaximo <= 0) {
      setErrorPrediccion("El cupo máximo debe ser mayor que cero.");
      return;
    }

    setCalculando(true);

    try {
      const response = await fetch(
        "/api/admin/prediccion-precios/previsualizar",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            categoriaId: formData.categoriaId,
            modalidadId: formData.modalidadId,
            ubicacionId: formData.ubicacionId,
            fechaInicio: formData.fechaInicio,
            fechaFin: formData.fechaFin,
            cupoMaximo: formData.cupoMaximo,
          }),
        },
      );

      const data = await leerJson<PrediccionApiResponse>(response);

      if (!response.ok || !data.ok) {
        throw new Error(
          data.message ?? "No fue posible calcular el precio sugerido.",
        );
      }

      if (
        typeof data.precioSugerido !== "number" ||
        !Number.isFinite(data.precioSugerido)
      ) {
        throw new Error("La respuesta no contiene un precio válido.");
      }

      const nuevoResultado: PrediccionResultado = {
        precioSugerido: data.precioSugerido,
        precioMinimoEstimado: data.precioMinimoEstimado,
        precioMaximoEstimado: data.precioMaximoEstimado,
        margenOrientativo: data.margenOrientativo,
        modelo: data.modelo,
        algoritmo: data.algoritmo,
        version: data.version,
        aviso: data.aviso,
        variablesEntrada: data.variablesEntrada,
      };

      setResultado(nuevoResultado);

      const categoriaNombre =
        categorias.find(
          (categoria) => categoria.idCategoria === formData.categoriaId,
        )?.nombreCategoria ?? "Sin categoría";

      const modalidadNombre =
        modalidades.find(
          (modalidad) => modalidad.idModalidad === formData.modalidadId,
        )?.nombreModalidad ?? "Sin modalidad";

      const precioActualNumero = Number(formData.precioActual);

      const item: PrediccionHistorialItem = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        tituloCurso: formData.tituloCurso.trim() || "Curso sin título",
        categoriaNombre,
        modalidadNombre,
        duracionDias: calcularDuracionDias(
          formData.fechaInicio,
          formData.fechaFin,
        ),
        cupoMaximo: formData.cupoMaximo,
        fechaConsulta: new Intl.DateTimeFormat("es-MX", {
          dateStyle: "short",
          timeStyle: "short",
        }).format(new Date()),
        precioActual: Number.isFinite(precioActualNumero)
          ? precioActualNumero
          : undefined,
        ...nuevoResultado,
      };

      setHistorial((actual) => [item, ...actual].slice(0, 8));
    } catch (error) {
      console.error("Error calculando la predicción:", error);
      setResultado(null);
      setErrorPrediccion(
        error instanceof Error
          ? error.message
          : "No fue posible calcular el precio sugerido.",
      );
    } finally {
      setCalculando(false);
    }
  };

  const precioActual = useMemo(() => {
    const valor = Number(formData.precioActual);
    return Number.isFinite(valor) ? valor : undefined;
  }, [formData.precioActual]);

  const fechaActual = new Intl.DateTimeFormat("es-MX", {
    dateStyle: "long",
  }).format(new Date());

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#F8FAFC_0%,#EEF3F7_100%)] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1600px] space-y-5">
        <header className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white px-5 py-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#0A3D62]">
              <Activity size={21} />
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                Analítica académica
              </p>
            </div>

            <h1 className="mt-2 text-2xl font-black tracking-tight text-[#0A3D62] sm:text-3xl">
              Predicción de precio de cursos
            </h1>

            <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-slate-500">
              <CalendarDays size={14} />
              <span>{fechaActual}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void cargarCatalogos()}
            disabled={loadingCatalogos}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-black text-[#0A3D62] transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={15}
              className={loadingCatalogos ? "animate-spin" : ""}
            />
            Actualizar catálogos
          </button>
        </header>

        {catalogosError && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-bold text-amber-800">
            {catalogosError}
          </div>
        )}

        <MetricasModelo />

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)]">
          <FormularioPrediccion
            formData={formData}
            categorias={categorias}
            modalidades={modalidades}
            ubicaciones={ubicaciones}
            loadingCatalogos={loadingCatalogos}
            calculando={calculando}
            error={errorPrediccion}
            onChange={actualizarCampo}
            onSubmit={() => void calcular()}
            onReset={limpiar}
          />

          <ResultadoPrediccion
            resultado={resultado}
            precioActual={precioActual}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[320px_minmax(0,1fr)_320px]">
          <FactoresModelo />
          <HistorialPredicciones items={historial} />
          <RecomendacionesPrecio />
        </div>
      </div>
    </main>
  );
}
