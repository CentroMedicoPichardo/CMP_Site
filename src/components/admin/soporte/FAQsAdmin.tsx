"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  CircleHelp,
  Edit3,
  Eye,
  EyeOff,
  Filter,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Star,
  ThumbsDown,
  ThumbsUp,
  Trash2,
} from "lucide-react";
import { toast } from "react-toastify";

import SoporteModal from "./SoporteModal";
import type {
  CategoriaAyuda,
  PreguntaFrecuente,
} from "@/types/help";

interface ApiErrorResponse {
  error?: string;
  message?: string;
}

interface FormFaq {
  idPregunta: number | null;
  idCategoria: number | null;
  pregunta: string;
  respuesta: string;
  orden: string;
  activo: boolean;
  esDestacada: boolean;
  tags: string;
}

const FORM_INICIAL: FormFaq = {
  idPregunta: null,
  idCategoria: null,
  pregunta: "",
  respuesta: "",
  orden: "0",
  activo: true,
  esDestacada: false,
  tags: "",
};

async function obtenerMensajeError(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as ApiErrorResponse;
    return data.error || data.message || "No fue posible completar la solicitud.";
  } catch {
    return "No fue posible completar la solicitud.";
  }
}

export default function FAQsAdmin() {
  const [faqs, setFaqs] = useState<PreguntaFrecuente[]>([]);
  const [categorias, setCategorias] = useState<CategoriaAyuda[]>([]);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [eliminandoId, setEliminandoId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [form, setForm] = useState<FormFaq>(FORM_INICIAL);

  const cargarCategorias = useCallback(async () => {
    const response = await fetch("/api/admin/soporte/categorias", {
      credentials: "include",
      cache: "no-store",
    });
    if (!response.ok) throw new Error(await obtenerMensajeError(response));
    const data = (await response.json()) as CategoriaAyuda[];
    setCategorias(Array.isArray(data) ? data : []);
  }, []);

  const cargarFaqs = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const params = new URLSearchParams();
      if (busqueda.trim()) params.set("busqueda", busqueda.trim());
      if (categoriaFiltro) params.set("categoria", categoriaFiltro);
      if (estadoFiltro) params.set("estado", estadoFiltro);
      const endpoint = params.size > 0
        ? `/api/admin/soporte/faqs?${params.toString()}`
        : "/api/admin/soporte/faqs";
      const response = await fetch(endpoint, { credentials: "include", cache: "no-store" });
      if (!response.ok) throw new Error(await obtenerMensajeError(response));
      const data = (await response.json()) as PreguntaFrecuente[];
      setFaqs(Array.isArray(data) ? data : []);
    } catch (errorCarga: unknown) {
      setError(errorCarga instanceof Error ? errorCarga.message : "No fue posible cargar las FAQs.");
    } finally {
      setLoading(false);
    }
  }, [busqueda, categoriaFiltro, estadoFiltro]);

  useEffect(() => {
    void Promise.all([cargarFaqs(), cargarCategorias()]).catch((errorCarga: unknown) => {
      setError(errorCarga instanceof Error ? errorCarga.message : "No fue posible cargar la información.");
      setLoading(false);
    });
  }, [cargarCategorias, cargarFaqs]);

  const resumen = useMemo(() => ({
    total: faqs.length,
    activas: faqs.filter((faq) => faq.activo).length,
    destacadas: faqs.filter((faq) => faq.esDestacada).length,
    valoraciones: faqs.reduce((total, faq) => total + faq.vecesUtil + faq.vecesNoUtil, 0),
  }), [faqs]);

  const abrirNueva = () => {
    setForm({ ...FORM_INICIAL, idCategoria: categorias.find((item) => item.activo)?.idCategoria ?? null });
    setModalAbierto(true);
  };

  const abrirEdicion = (faq: PreguntaFrecuente) => {
    setForm({
      idPregunta: faq.idPregunta,
      idCategoria: faq.idCategoria,
      pregunta: faq.pregunta,
      respuesta: faq.respuesta,
      orden: String(faq.orden),
      activo: faq.activo,
      esDestacada: faq.esDestacada,
      tags: (faq.tags ?? []).join(", "),
    });
    setModalAbierto(true);
  };

  const guardar = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.idCategoria) {
      toast.info("Selecciona una categoría.");
      return;
    }
    try {
      setGuardando(true);
      const editando = form.idPregunta !== null;
      const endpoint = editando
        ? `/api/admin/soporte/faqs/${form.idPregunta}`
        : "/api/admin/soporte/faqs";
      const response = await fetch(endpoint, {
        method: editando ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          idCategoria: form.idCategoria,
          pregunta: form.pregunta.trim(),
          respuesta: form.respuesta.trim(),
          orden: Number(form.orden) || 0,
          activo: form.activo,
          esDestacada: form.esDestacada,
          tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        }),
      });
      if (!response.ok) throw new Error(await obtenerMensajeError(response));
      toast.success(editando ? "FAQ actualizada." : "FAQ creada.");
      setModalAbierto(false);
      await cargarFaqs();
    } catch (errorGuardado: unknown) {
      toast.error(errorGuardado instanceof Error ? errorGuardado.message : "No fue posible guardar la FAQ.");
    } finally {
      setGuardando(false);
    }
  };

  const cambiarEstado = async (faq: PreguntaFrecuente) => {
    try {
      const response = await fetch(`/api/admin/soporte/faqs/${faq.idPregunta}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ activo: !faq.activo }),
      });
      if (!response.ok) throw new Error(await obtenerMensajeError(response));
      toast.success(faq.activo ? "FAQ ocultada." : "FAQ publicada.");
      await cargarFaqs();
    } catch (errorEstado: unknown) {
      toast.error(errorEstado instanceof Error ? errorEstado.message : "No fue posible cambiar el estado.");
    }
  };

  const eliminar = async (faq: PreguntaFrecuente) => {
    const confirmado = window.confirm(`¿Eliminar la FAQ “${faq.pregunta}”?`);
    if (!confirmado) return;
    try {
      setEliminandoId(faq.idPregunta);
      const response = await fetch(`/api/admin/soporte/faqs/${faq.idPregunta}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error(await obtenerMensajeError(response));
      toast.success("FAQ eliminada.");
      await cargarFaqs();
    } catch (errorEliminacion: unknown) {
      toast.error(errorEliminacion instanceof Error ? errorEliminacion.message : "No fue posible eliminar la FAQ.");
    } finally {
      setEliminandoId(null);
    }
  };

  return (
    <div className="space-y-5 text-slate-900">
      <section className="relative overflow-hidden rounded-3xl bg-[#0A3D62] p-6 text-white shadow-lg sm:p-7">
        <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-[#FFC300]/15 blur-3xl" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#FFC300]">Centro de ayuda</p>
            <h1 className="mt-2 text-2xl font-black sm:text-3xl">Preguntas frecuentes</h1>
            <p className="mt-2 max-w-2xl text-sm text-white/70">Administra las respuestas públicas, su orden, visibilidad y valoraciones.</p>
          </div>
          <button type="button" onClick={abrirNueva} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#FFC300] px-5 text-xs font-black text-[#0A3D62] hover:bg-white">
            <Plus size={17} /> Nueva FAQ
          </button>
        </div>
        <div className="relative mt-6 grid gap-3 sm:grid-cols-4">
          <Resumen label="Total" value={resumen.total} icon={CircleHelp} />
          <Resumen label="Activas" value={resumen.activas} icon={Eye} />
          <Resumen label="Destacadas" value={resumen.destacadas} icon={Star} />
          <Resumen label="Valoraciones" value={resumen.valoraciones} icon={ThumbsUp} />
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <form onSubmit={(event) => { event.preventDefault(); void cargarFaqs(); }} className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_240px_180px_auto]">
          <div className="relative"><Search className="pointer-events-none absolute left-3 top-3.5 text-slate-400" size={16} /><input value={busqueda} onChange={(event) => setBusqueda(event.target.value)} className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3 text-sm text-slate-900" placeholder="Buscar en pregunta o respuesta" /></div>
          <select value={categoriaFiltro} onChange={(event) => setCategoriaFiltro(event.target.value)} className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900"><option value="">Todas las categorías</option>{categorias.map((categoria) => <option key={categoria.idCategoria} value={categoria.idCategoria}>{categoria.nombreCategoria}</option>)}</select>
          <select value={estadoFiltro} onChange={(event) => setEstadoFiltro(event.target.value)} className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900"><option value="">Todos los estados</option><option value="activas">Activas</option><option value="inactivas">Inactivas</option></select>
          <button type="submit" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#0A3D62] px-4 text-xs font-black text-white"><Filter size={15} /> Filtrar</button>
        </form>
      </section>

      {loading ? (
        <div className="flex min-h-64 items-center justify-center rounded-3xl border border-slate-200 bg-white"><Loader2 className="animate-spin text-[#0A3D62]" size={28} /></div>
      ) : error ? (
        <div className="rounded-3xl border border-red-200 bg-white p-8 text-center"><p className="text-sm font-bold text-red-700">{error}</p><button type="button" onClick={() => void cargarFaqs()} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#0A3D62] px-4 py-2 text-xs font-bold text-white"><RefreshCw size={14} /> Reintentar</button></div>
      ) : faqs.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center"><CircleHelp className="mx-auto text-slate-400" size={34} /><h2 className="mt-3 text-lg font-black text-[#0A3D62]">No hay preguntas frecuentes</h2><p className="mt-1 text-sm text-slate-500">Crea la primera FAQ o modifica los filtros.</p></div>
      ) : (
        <div className="space-y-3">
          {faqs.map((faq) => (
            <article key={faq.idPregunta} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-black ${faq.activo ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{faq.activo ? "Activa" : "Oculta"}</span>
                    {faq.esDestacada && <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-black text-amber-700"><BadgeCheck size={11} /> Destacada</span>}
                    <span className="rounded-full bg-[#EAF2F8] px-2.5 py-1 text-[10px] font-bold text-[#0A3D62]">{faq.categoria?.nombreCategoria || "Sin categoría"}</span>
                    <span className="text-[10px] text-slate-400">Orden {faq.orden}</span>
                  </div>
                  <h2 className="mt-3 text-base font-black text-[#0A3D62]">{faq.pregunta}</h2>
                  <p className="mt-2 line-clamp-3 whitespace-pre-line text-sm leading-6 text-slate-600">{faq.respuesta}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-slate-500"><span className="inline-flex items-center gap-1"><ThumbsUp size={13} className="text-emerald-600" /> {faq.vecesUtil} útiles</span><span className="inline-flex items-center gap-1"><ThumbsDown size={13} className="text-red-500" /> {faq.vecesNoUtil} no útiles</span>{(faq.tags ?? []).map((tag) => <span key={tag} className="rounded-full bg-slate-100 px-2 py-1">#{tag}</span>)}</div>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <button type="button" onClick={() => void cambiarEstado(faq)} className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 px-3 text-xs font-bold text-slate-600 hover:text-[#0A3D62]">{faq.activo ? <EyeOff size={14} /> : <Eye size={14} />}{faq.activo ? "Ocultar" : "Publicar"}</button>
                  <button type="button" onClick={() => abrirEdicion(faq)} className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-[#0A3D62]/20 bg-[#F1F6F9] px-3 text-xs font-bold text-[#0A3D62]"><Edit3 size={14} /> Editar</button>
                  <button type="button" onClick={() => void eliminar(faq)} disabled={eliminandoId === faq.idPregunta} className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-red-200 px-3 text-xs font-bold text-red-600 disabled:opacity-50">{eliminandoId === faq.idPregunta ? <Loader2 className="animate-spin" size={14} /> : <Trash2 size={14} />} Eliminar</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <SoporteModal abierto={modalAbierto} onClose={() => setModalAbierto(false)} titulo={form.idPregunta ? "Editar pregunta frecuente" : "Nueva pregunta frecuente"} descripcion="La información activa será visible en el Centro de Ayuda." ancho="lg">
        <form onSubmit={guardar}>
          <div className="space-y-4 p-5 sm:p-6">
            <div><label className="text-xs font-bold text-slate-700">Categoría</label><select value={form.idCategoria ?? ""} onChange={(event) => setForm((actual) => ({ ...actual, idCategoria: event.target.value ? Number(event.target.value) : null }))} className="mt-1.5 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900"><option value="">Selecciona una categoría</option>{categorias.map((categoria) => <option key={categoria.idCategoria} value={categoria.idCategoria}>{categoria.nombreCategoria}</option>)}</select></div>
            <div><label className="text-xs font-bold text-slate-700">Pregunta</label><input value={form.pregunta} onChange={(event) => setForm((actual) => ({ ...actual, pregunta: event.target.value }))} maxLength={500} className="mt-1.5 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900" /></div>
            <div><label className="text-xs font-bold text-slate-700">Respuesta</label><textarea value={form.respuesta} onChange={(event) => setForm((actual) => ({ ...actual, respuesta: event.target.value }))} rows={8} className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white p-3 text-sm leading-6 text-slate-900" /></div>
            <div className="grid gap-4 sm:grid-cols-2"><div><label className="text-xs font-bold text-slate-700">Orden</label><input type="number" min="0" value={form.orden} onChange={(event) => setForm((actual) => ({ ...actual, orden: event.target.value }))} className="mt-1.5 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900" /></div><div><label className="text-xs font-bold text-slate-700">Etiquetas</label><input value={form.tags} onChange={(event) => setForm((actual) => ({ ...actual, tags: event.target.value }))} className="mt-1.5 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900" placeholder="citas, pagos, cursos" /></div></div>
            <div className="grid gap-3 sm:grid-cols-2"><label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-bold text-slate-700">Publicar FAQ<input type="checkbox" checked={form.activo} onChange={(event) => setForm((actual) => ({ ...actual, activo: event.target.checked }))} /></label><label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-bold text-slate-700">Marcar como destacada<input type="checkbox" checked={form.esDestacada} onChange={(event) => setForm((actual) => ({ ...actual, esDestacada: event.target.checked }))} /></label></div>
          </div>
          <footer className="sticky bottom-0 flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:px-6"><button type="button" onClick={() => setModalAbierto(false)} className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-600">Cancelar</button><button type="submit" disabled={guardando} className="inline-flex items-center gap-2 rounded-xl bg-[#0A3D62] px-5 py-2.5 text-xs font-black text-white disabled:opacity-60">{guardando && <Loader2 className="animate-spin" size={14} />} Guardar FAQ</button></footer>
        </form>
      </SoporteModal>
    </div>
  );
}

function Resumen({ label, value, icon: Icon }: { label: string; value: number; icon: LucideIcon }) {
  return <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.07] p-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-[#FFC300]"><Icon size={17} /></span><div><p className="text-lg font-black">{value}</p><p className="text-[10px] text-white/60">{label}</p></div></div>;
}
