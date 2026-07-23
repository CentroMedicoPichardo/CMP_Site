"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  AlertCircle,
  Archive,
  BookOpenCheck,
  ChevronLeft,
  ChevronRight,
  CircleGauge,
  Clock3,
  FolderCog,
  Inbox,
  Loader2,
  LockKeyhole,
  MessageSquareReply,
  RefreshCw,
  Search,
  ShieldAlert,
} from "lucide-react";
import { adminRoutes } from "@/config/routes";
import type {
  CategoriaAyuda,
  OrdenPreguntasAdmin,
  PreguntaUsuario,
  PreguntasAdminResponse,
  ResumenSoporteAdmin,
} from "@/types/help";

interface ApiErrorResponse {
  error?: string;
  message?: string;
}

const RESUMEN_VACIO: ResumenSoporteAdmin = {
  total: 0,
  pendientes: 0,
  respondidas: 0,
  cerradas: 0,
  urgentes: 0,
};

async function obtenerError(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as ApiErrorResponse;
    return data.error ?? data.message ?? "Ocurrió un error.";
  } catch {
    return "Ocurrió un error.";
  }
}

export default function SoporteAdmin() {
  const router = useRouter();
  const [preguntas, setPreguntas] = useState<PreguntaUsuario[]>([]);
  const [categorias, setCategorias] = useState<CategoriaAyuda[]>([]);
  const [resumen, setResumen] = useState<ResumenSoporteAdmin>(RESUMEN_VACIO);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [busqueda, setBusqueda] = useState("");
  const [busquedaAplicada, setBusquedaAplicada] = useState("");
  const [estado, setEstado] = useState("");
  const [prioridad, setPrioridad] = useState("");
  const [categoria, setCategoria] = useState("");
  const [orden, setOrden] =
    useState<OrdenPreguntasAdmin>("prioridad");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cargarCategorias = useCallback(async () => {
    try {
      const response = await fetch("/api/soporte/categorias", {
        cache: "no-store",
      });

      if (!response.ok) {
        return;
      }

      const data = (await response.json()) as CategoriaAyuda[];
      setCategorias(Array.isArray(data) ? data : []);
    } catch (errorCategorias: unknown) {
      console.error("Error cargando categorías:", errorCategorias);
    }
  }, []);

  const cargarPreguntas = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({
        pagina: String(pagina),
        limite: "20",
      });

      if (busquedaAplicada) params.set("busqueda", busquedaAplicada);
      if (estado) params.set("estado", estado);
      if (prioridad) params.set("prioridad", prioridad);
      if (categoria) params.set("categoria", categoria);
      params.set("orden", orden);

      const response = await fetch(
        `/api/admin/soporte/preguntas?${params.toString()}`,
        { credentials: "include", cache: "no-store" },
      );

      if (!response.ok) {
        throw new Error(await obtenerError(response));
      }

      const data = (await response.json()) as PreguntasAdminResponse;
      setPreguntas(Array.isArray(data.preguntas) ? data.preguntas : []);
      setResumen(data.resumen ?? RESUMEN_VACIO);
      setTotalPaginas(data.paginacion?.totalPaginas ?? 1);
    } catch (errorCarga: unknown) {
      setError(
        errorCarga instanceof Error
          ? errorCarga.message
          : "No fue posible cargar la bandeja.",
      );
    } finally {
      setLoading(false);
    }
  }, [
    busquedaAplicada,
    categoria,
    estado,
    orden,
    pagina,
    prioridad,
  ]);

  useEffect(() => {
    void cargarCategorias();
  }, [cargarCategorias]);

  useEffect(() => {
    void cargarPreguntas();
  }, [cargarPreguntas]);

  const filtrosActivos = useMemo(
    () =>
      Boolean(
        busquedaAplicada ||
          estado ||
          prioridad ||
          categoria ||
          orden !== "prioridad",
      ),
    [busquedaAplicada, categoria, estado, orden, prioridad],
  );

  const limpiarFiltros = () => {
    setBusqueda("");
    setBusquedaAplicada("");
    setEstado("");
    setPrioridad("");
    setCategoria("");
    setOrden("prioridad");
    setPagina(1);
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4 text-slate-900 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-3xl bg-[#0A3D62] p-6 text-white shadow-xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#FFC300]">
                Administración
              </p>
              <h1 className="mt-2 text-3xl font-black">Soporte y ayuda</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">
                Atiende solicitudes, administra preguntas frecuentes y organiza las categorías del centro de ayuda.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => router.push(adminRoutes.soporteFaqs)}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-white/10 px-4 text-xs font-extrabold text-white hover:bg-white/15"
              >
                <BookOpenCheck size={16} />
                Preguntas frecuentes
              </button>
              <button
                type="button"
                onClick={() => router.push(adminRoutes.soporteCategorias)}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#FFC300] px-4 text-xs font-extrabold text-[#0A3D62] hover:bg-white"
              >
                <FolderCog size={16} />
                Categorías
              </button>
            </div>
          </div>
        </header>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <ResumenCard titulo="Total" valor={resumen.total} Icono={Inbox} />
          <ResumenCard titulo="Pendientes" valor={resumen.pendientes} Icono={Clock3} />
          <ResumenCard titulo="Respondidas" valor={resumen.respondidas} Icono={MessageSquareReply} />
          <ResumenCard titulo="Cerradas" valor={resumen.cerradas} Icono={Archive} />
          <ResumenCard titulo="Urgentes" valor={resumen.urgentes} Icono={ShieldAlert} destacado />
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setPagina(1);
              setBusquedaAplicada(busqueda.trim());
            }}
            className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_170px_150px_190px_180px_auto]"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
              <input
                value={busqueda}
                onChange={(event) => setBusqueda(event.target.value)}
                placeholder="Buscar por título, contenido o usuario"
                className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3 text-sm text-slate-900 outline-none focus:border-[#0A3D62] focus:ring-4 focus:ring-[#0A3D62]/10"
              />
            </div>

            <select
              value={estado}
              onChange={(event) => {
                setEstado(event.target.value);
                setPagina(1);
              }}
              className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-800"
            >
              <option value="">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="respondida">Respondida</option>
              <option value="cerrada">Cerrada</option>
              <option value="convertida_faq">Convertida en FAQ</option>
            </select>

            <select
              value={prioridad}
              onChange={(event) => {
                setPrioridad(event.target.value);
                setPagina(1);
              }}
              className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-800"
            >
              <option value="">Toda prioridad</option>
              <option value="urgente">Urgente</option>
              <option value="alta">Alta</option>
              <option value="normal">Normal</option>
              <option value="baja">Baja</option>
            </select>

            <select
              value={categoria}
              onChange={(event) => {
                setCategoria(event.target.value);
                setPagina(1);
              }}
              className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-800"
            >
              <option value="">Todas las categorías</option>
              {categorias.map((item) => (
                <option key={item.idCategoria} value={item.idCategoria}>
                  {item.nombreCategoria}
                </option>
              ))}
            </select>

            <select
              value={orden}
              onChange={(event) => {
                setOrden(
                  event.target.value as OrdenPreguntasAdmin,
                );
                setPagina(1);
              }}
              aria-label="Ordenar solicitudes"
              className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-800"
            >
              <option value="prioridad">Prioridad primero</option>
              <option value="recientes">Más recientes</option>
              <option value="actividad">Actividad reciente</option>
              <option value="antiguas">Más antiguas</option>
            </select>

            <div className="flex gap-2">
              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-[#0A3D62] px-4 text-xs font-extrabold text-white hover:bg-[#124f78]"
              >
                Buscar
              </button>
              {filtrosActivos && (
                <button
                  type="button"
                  onClick={limpiarFiltros}
                  className="h-11 rounded-xl border border-slate-300 px-3 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Limpiar
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <h2 className="text-lg font-extrabold text-[#0A3D62]">
                Bandeja de solicitudes
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                {orden === "recientes"
                  ? "Mostrando primero las solicitudes más nuevas."
                  : orden === "actividad"
                    ? "Mostrando primero las conversaciones con actividad reciente."
                    : orden === "antiguas"
                      ? "Mostrando primero las solicitudes más antiguas."
                      : "Las urgentes y de alta prioridad aparecen primero."}
              </p>
            </div>
            <button
              type="button"
              onClick={() => void cargarPreguntas()}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              <RefreshCw size={15} />
              Actualizar
            </button>
          </div>

          {loading ? (
            <div className="flex min-h-64 items-center justify-center gap-3 text-sm text-slate-500">
              <Loader2 className="animate-spin" size={20} />
              Cargando solicitudes...
            </div>
          ) : error ? (
            <div className="m-5 rounded-2xl border border-red-200 bg-red-50 p-5 text-center text-red-700">
              <AlertCircle className="mx-auto" size={24} />
              <p className="mt-2 text-sm font-bold">{error}</p>
            </div>
          ) : preguntas.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-5 text-center">
              <Inbox size={34} className="text-slate-300" />
              <h3 className="mt-3 font-extrabold text-slate-700">
                No hay solicitudes
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                No se encontraron preguntas con los filtros actuales.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {preguntas.map((pregunta) => (
                <PreguntaFila
                  key={pregunta.idPregunta}
                  pregunta={pregunta}
                  onClick={() =>
                    router.push(
                      adminRoutes.soportePregunta(pregunta.idPregunta),
                    )
                  }
                />
              ))}
            </div>
          )}

          <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4">
            <span className="text-xs font-semibold text-slate-500">
              Página {pagina} de {totalPaginas}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={pagina <= 1 || loading}
                onClick={() =>
                  setPagina((actual) => Math.max(actual - 1, 1))
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                disabled={pagina >= totalPaginas || loading}
                onClick={() =>
                  setPagina((actual) =>
                    Math.min(actual + 1, totalPaginas),
                  )
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function ResumenCard({
  titulo,
  valor,
  Icono,
  destacado = false,
}: {
  titulo: string;
  valor: number;
  Icono: LucideIcon;
  destacado?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 shadow-sm ${
        destacado
          ? "border-red-200 bg-red-50"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${
            destacado
              ? "bg-red-100 text-red-700"
              : "bg-[#EAF2F8] text-[#0A3D62]"
          }`}
        >
          <Icono size={17} />
        </span>
        <span
          className={`text-2xl font-black ${
            destacado ? "text-red-700" : "text-slate-800"
          }`}
        >
          {valor}
        </span>
      </div>
      <p className="mt-3 text-xs font-extrabold text-slate-600">
        {titulo}
      </p>
    </div>
  );
}

function PreguntaFila({
  pregunta,
  onClick,
}: {
  pregunta: PreguntaUsuario;
  onClick: () => void;
}) {
  const fecha = pregunta.createdAt
    ? new Intl.DateTimeFormat("es-MX", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(pregunta.createdAt))
    : "Sin fecha";

  return (
    <button
      type="button"
      onClick={onClick}
      className="grid w-full gap-3 px-5 py-4 text-left transition-colors hover:bg-slate-50 lg:grid-cols-[minmax(0,1fr)_180px_150px_130px] lg:items-center"
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate text-sm font-extrabold text-slate-800">
            {pregunta.titulo}
          </h3>
          {pregunta.esPrivada && (
            <LockKeyhole size={13} className="text-[#0A3D62]" />
          )}
        </div>
        <p className="mt-1 line-clamp-1 text-xs text-slate-500">
          {pregunta.descripcion}
        </p>
        <p className="mt-2 text-[11px] font-semibold text-slate-400">
          {pregunta.usuario?.nombre} {pregunta.usuario?.apellidoPaterno}
          {pregunta.usuario?.correo
            ? ` · ${pregunta.usuario.correo}`
            : ""}
        </p>
      </div>
      <span className="text-xs font-semibold text-slate-500">
        {pregunta.categoria?.nombreCategoria ?? "Sin categoría"}
      </span>
      <span
        className={`w-fit rounded-full px-2.5 py-1 text-[10px] font-extrabold ${
          pregunta.prioridad === "urgente"
            ? "bg-red-100 text-red-700"
            : pregunta.prioridad === "alta"
              ? "bg-amber-100 text-amber-700"
              : "bg-slate-100 text-slate-600"
        }`}
      >
        <CircleGauge size={11} className="mr-1 inline" />
        {pregunta.prioridad}
      </span>
      <div className="text-right">
        <p className="text-[10px] font-extrabold uppercase text-[#0A3D62]">
          {pregunta.estado.replace("_", " ")}
        </p>
        <p className="mt-1 text-[10px] text-slate-400">{fecha}</p>
      </div>
    </button>
  );
}
