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
  Edit3,
  Eye,
  EyeOff,
  FolderOpen,
  HelpCircle,
  Layers3,
  Loader2,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { toast } from "react-toastify";

import SoporteModal from "./SoporteModal";
import type { CategoriaAyuda } from "@/types/help";

interface ApiErrorResponse {
  error?: string;
  message?: string;
}

interface FormCategoria {
  idCategoria: number | null;
  nombreCategoria: string;
  descripcion: string;
  icono: string;
  orden: string;
  activo: boolean;
}

const FORM_INICIAL: FormCategoria = {
  idCategoria: null,
  nombreCategoria: "",
  descripcion: "",
  icono: "",
  orden: "0",
  activo: true,
};

async function obtenerMensajeError(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as ApiErrorResponse;
    return data.error || data.message || "No fue posible completar la solicitud.";
  } catch {
    return "No fue posible completar la solicitud.";
  }
}

export default function CategoriasSoporteAdmin() {
  const [categorias, setCategorias] = useState<CategoriaAyuda[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [eliminandoId, setEliminandoId] = useState<number | null>(null);
  const [form, setForm] = useState<FormCategoria>(FORM_INICIAL);

  const cargar = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/admin/soporte/categorias", {
        credentials: "include",
        cache: "no-store",
      });
      if (!response.ok) throw new Error(await obtenerMensajeError(response));
      const data = (await response.json()) as CategoriaAyuda[];
      setCategorias(Array.isArray(data) ? data : []);
    } catch (errorCarga: unknown) {
      setError(errorCarga instanceof Error ? errorCarga.message : "No fue posible cargar las categorías.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  const resumen = useMemo(() => ({
    total: categorias.length,
    activas: categorias.filter((categoria) => categoria.activo).length,
    faqs: categorias.reduce((total, categoria) => total + (categoria.totalFaqs ?? 0), 0),
    solicitudes: categorias.reduce((total, categoria) => total + (categoria.totalPreguntas ?? 0), 0),
  }), [categorias]);

  const abrirNueva = () => {
    setForm(FORM_INICIAL);
    setModalAbierto(true);
  };

  const abrirEdicion = (categoria: CategoriaAyuda) => {
    setForm({
      idCategoria: categoria.idCategoria,
      nombreCategoria: categoria.nombreCategoria,
      descripcion: categoria.descripcion ?? "",
      icono: categoria.icono ?? "",
      orden: String(categoria.orden),
      activo: categoria.activo,
    });
    setModalAbierto(true);
  };

  const guardar = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setGuardando(true);
      const editando = form.idCategoria !== null;
      const response = await fetch(
        editando
          ? `/api/admin/soporte/categorias/${form.idCategoria}`
          : "/api/admin/soporte/categorias",
        {
          method: editando ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            nombreCategoria: form.nombreCategoria.trim(),
            descripcion: form.descripcion.trim() || null,
            icono: form.icono.trim() || null,
            orden: Number(form.orden) || 0,
            activo: form.activo,
          }),
        },
      );
      if (!response.ok) throw new Error(await obtenerMensajeError(response));
      toast.success(editando ? "Categoría actualizada." : "Categoría creada.");
      setModalAbierto(false);
      await cargar();
    } catch (errorGuardado: unknown) {
      toast.error(errorGuardado instanceof Error ? errorGuardado.message : "No fue posible guardar la categoría.");
    } finally {
      setGuardando(false);
    }
  };

  const cambiarEstado = async (categoria: CategoriaAyuda) => {
    try {
      const response = await fetch(`/api/admin/soporte/categorias/${categoria.idCategoria}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ activo: !categoria.activo }),
      });
      if (!response.ok) throw new Error(await obtenerMensajeError(response));
      toast.success(categoria.activo ? "Categoría desactivada." : "Categoría activada.");
      await cargar();
    } catch (errorEstado: unknown) {
      toast.error(errorEstado instanceof Error ? errorEstado.message : "No fue posible cambiar el estado.");
    }
  };

  const eliminar = async (categoria: CategoriaAyuda) => {
    if (!window.confirm(`¿Eliminar la categoría “${categoria.nombreCategoria}”?`)) return;
    try {
      setEliminandoId(categoria.idCategoria);
      const response = await fetch(`/api/admin/soporte/categorias/${categoria.idCategoria}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error(await obtenerMensajeError(response));
      toast.success("Categoría eliminada.");
      await cargar();
    } catch (errorEliminacion: unknown) {
      toast.error(errorEliminacion instanceof Error ? errorEliminacion.message : "No fue posible eliminar la categoría.");
    } finally {
      setEliminandoId(null);
    }
  };

  return (
    <div className="space-y-5 text-slate-900">
      <section className="relative overflow-hidden rounded-3xl bg-[#0A3D62] p-6 text-white shadow-lg sm:p-7">
        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#FFC300]/15 blur-3xl" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#FFC300]">Organización del contenido</p>
            <h1 className="mt-2 text-2xl font-black sm:text-3xl">Categorías de ayuda</h1>
            <p className="mt-2 max-w-2xl text-sm text-white/70">Clasifica preguntas frecuentes y solicitudes de soporte.</p>
          </div>
          <button type="button" onClick={abrirNueva} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#FFC300] px-5 text-xs font-black text-[#0A3D62] hover:bg-white"><Plus size={17} /> Nueva categoría</button>
        </div>
        <div className="relative mt-6 grid gap-3 sm:grid-cols-4">
          <Resumen label="Categorías" value={resumen.total} icon={Layers3} />
          <Resumen label="Activas" value={resumen.activas} icon={Eye} />
          <Resumen label="FAQs asociadas" value={resumen.faqs} icon={HelpCircle} />
          <Resumen label="Solicitudes" value={resumen.solicitudes} icon={FolderOpen} />
        </div>
      </section>

      {loading ? (
        <div className="flex min-h-64 items-center justify-center rounded-3xl border border-slate-200 bg-white"><Loader2 className="animate-spin text-[#0A3D62]" size={28} /></div>
      ) : error ? (
        <div className="rounded-3xl border border-red-200 bg-white p-8 text-center"><p className="text-sm font-bold text-red-700">{error}</p><button type="button" onClick={() => void cargar()} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#0A3D62] px-4 py-2 text-xs font-bold text-white"><RefreshCw size={14} /> Reintentar</button></div>
      ) : categorias.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center"><FolderOpen className="mx-auto text-slate-400" size={34} /><h2 className="mt-3 text-lg font-black text-[#0A3D62]">No hay categorías</h2><p className="mt-1 text-sm text-slate-500">Crea la primera categoría para organizar el Centro de Ayuda.</p></div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {categorias.map((categoria) => (
            <article key={categoria.idCategoria} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EAF2F8] text-[#0A3D62]"><FolderOpen size={20} /></span>
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-black ${categoria.activo ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{categoria.activo ? "Activa" : "Inactiva"}</span>
              </div>
              <h2 className="mt-4 text-base font-black text-[#0A3D62]">{categoria.nombreCategoria}</h2>
              <p className="mt-2 min-h-10 text-xs leading-5 text-slate-500">{categoria.descripcion || "Sin descripción."}</p>
              <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl bg-slate-50 p-3 text-center"><Dato label="Orden" value={categoria.orden} /><Dato label="FAQs" value={categoria.totalFaqs ?? 0} /><Dato label="Preguntas" value={categoria.totalPreguntas ?? 0} /></div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" onClick={() => void cambiarEstado(categoria)} className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 text-xs font-bold text-slate-600">{categoria.activo ? <EyeOff size={14} /> : <Eye size={14} />}{categoria.activo ? "Desactivar" : "Activar"}</button>
                <button type="button" onClick={() => abrirEdicion(categoria)} className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-[#0A3D62]/20 bg-[#F1F6F9] px-3 text-xs font-bold text-[#0A3D62]"><Edit3 size={14} /> Editar</button>
                <button type="button" onClick={() => void eliminar(categoria)} disabled={eliminandoId === categoria.idCategoria} className="inline-flex h-9 items-center justify-center rounded-xl border border-red-200 px-3 text-red-600 disabled:opacity-50" aria-label="Eliminar categoría">{eliminandoId === categoria.idCategoria ? <Loader2 className="animate-spin" size={14} /> : <Trash2 size={14} />}</button>
              </div>
            </article>
          ))}
        </div>
      )}

      <SoporteModal abierto={modalAbierto} onClose={() => setModalAbierto(false)} titulo={form.idCategoria ? "Editar categoría" : "Nueva categoría"} descripcion="Las categorías activas se muestran en la sección pública de ayuda." ancho="md">
        <form onSubmit={guardar}>
          <div className="space-y-4 p-5 sm:p-6">
            <div><label className="text-xs font-bold text-slate-700">Nombre</label><input value={form.nombreCategoria} onChange={(event) => setForm((actual) => ({ ...actual, nombreCategoria: event.target.value }))} maxLength={100} className="mt-1.5 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900" /></div>
            <div><label className="text-xs font-bold text-slate-700">Descripción</label><textarea value={form.descripcion} onChange={(event) => setForm((actual) => ({ ...actual, descripcion: event.target.value }))} rows={4} className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-900" /></div>
            <div className="grid gap-4 sm:grid-cols-2"><div><label className="text-xs font-bold text-slate-700">Icono o identificador</label><input value={form.icono} onChange={(event) => setForm((actual) => ({ ...actual, icono: event.target.value }))} maxLength={50} className="mt-1.5 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900" placeholder="circle-help" /></div><div><label className="text-xs font-bold text-slate-700">Orden</label><input type="number" min="0" value={form.orden} onChange={(event) => setForm((actual) => ({ ...actual, orden: event.target.value }))} className="mt-1.5 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900" /></div></div>
            <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3"><span><span className="block text-xs font-bold text-slate-700">Categoría activa</span><span className="mt-0.5 block text-[10px] text-slate-500">Disponible en formularios y filtros públicos</span></span><input type="checkbox" checked={form.activo} onChange={(event) => setForm((actual) => ({ ...actual, activo: event.target.checked }))} /></label>
          </div>
          <footer className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:px-6"><button type="button" onClick={() => setModalAbierto(false)} className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-600">Cancelar</button><button type="submit" disabled={guardando} className="inline-flex items-center gap-2 rounded-xl bg-[#0A3D62] px-5 py-2.5 text-xs font-black text-white disabled:opacity-60">{guardando && <Loader2 className="animate-spin" size={14} />} Guardar categoría</button></footer>
        </form>
      </SoporteModal>
    </div>
  );
}

function Resumen({ label, value, icon: Icon }: { label: string; value: number; icon: LucideIcon }) {
  return <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.07] p-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-[#FFC300]"><Icon size={17} /></span><div><p className="text-lg font-black">{value}</p><p className="text-[10px] text-white/60">{label}</p></div></div>;
}

function Dato({ label, value }: { label: string; value: number }) {
  return <div><p className="text-sm font-black text-[#0A3D62]">{value}</p><p className="mt-0.5 text-[9px] text-slate-500">{label}</p></div>;
}
