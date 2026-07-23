"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  AlertCircle,
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  CircleGauge,
  FileQuestion,
  FolderOpen,
  Loader2,
  LockKeyhole,
  Mail,
  MessageSquareReply,
  RefreshCw,
  Save,
  Send,
  ShieldCheck,
  Tag,
  UserRound,
} from "lucide-react";
import { toast } from "react-toastify";

import type {
  CategoriaAyuda,
  EstadoPregunta,
  PreguntaAdminDetalleResponse,
  PrioridadPregunta,
  RespuestaAyuda,
} from "@/types/help";

interface PreguntaSoporteAdminDetalleProps {
  idPregunta: number;
}

interface ApiErrorResponse {
  error?: string;
  message?: string;
}

const ESTADOS: Array<{ value: EstadoPregunta; label: string }> = [
  { value: "pendiente", label: "Pendiente" },
  { value: "respondida", label: "Respondida" },
  { value: "cerrada", label: "Cerrada" },
  { value: "convertida_faq", label: "Convertida en FAQ" },
];

const PRIORIDADES: Array<{ value: PrioridadPregunta; label: string }> = [
  { value: "baja", label: "Baja" },
  { value: "normal", label: "Normal" },
  { value: "alta", label: "Alta" },
  { value: "urgente", label: "Urgente" },
];

async function obtenerMensajeError(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as ApiErrorResponse;
    return data.error || data.message || "No fue posible completar la solicitud.";
  } catch {
    return "No fue posible completar la solicitud.";
  }
}

function formatearFecha(valor: string | null | undefined): string {
  if (!valor) return "Fecha no disponible";
  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) return "Fecha no disponible";
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(fecha);
}

function nombreUsuario(
  usuario: { nombre?: string | null; apellidoPaterno?: string | null } | null | undefined,
  respaldo: string,
): string {
  return [usuario?.nombre, usuario?.apellidoPaterno].filter(Boolean).join(" ") || respaldo;
}

export default function PreguntaSoporteAdminDetalle({
  idPregunta,
}: PreguntaSoporteAdminDetalleProps) {
  const router = useRouter();
  const [data, setData] = useState<PreguntaAdminDetalleResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [respondiendo, setRespondiendo] = useState(false);
  const [convirtiendo, setConvirtiendo] = useState(false);
  const [respuesta, setRespuesta] = useState("");
  const [esSolucion, setEsSolucion] = useState(false);
  const [estado, setEstado] = useState<EstadoPregunta>("pendiente");
  const [prioridad, setPrioridad] = useState<PrioridadPregunta>("normal");
  const [idCategoria, setIdCategoria] = useState<number | null>(null);
  const [esPrivada, setEsPrivada] = useState(false);
  const [faqPregunta, setFaqPregunta] = useState("");
  const [faqRespuesta, setFaqRespuesta] = useState("");
  const [faqDestacada, setFaqDestacada] = useState(false);
  const [faqTags, setFaqTags] = useState("");

  const cargar = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`/api/admin/soporte/preguntas/${idPregunta}`, {
        credentials: "include",
        cache: "no-store",
      });
      if (!response.ok) throw new Error(await obtenerMensajeError(response));
      const siguiente = (await response.json()) as PreguntaAdminDetalleResponse;
      setData(siguiente);
      setEstado(siguiente.pregunta.estado);
      setPrioridad(siguiente.pregunta.prioridad);
      setIdCategoria(siguiente.pregunta.idCategoria);
      setEsPrivada(siguiente.pregunta.esPrivada);
      setFaqPregunta(siguiente.pregunta.titulo);
      const solucion = siguiente.respuestas.find((item) => item.esSolucion);
      const ultimaAdmin = [...siguiente.respuestas].reverse().find((item) => item.esRespuestaAdmin);
      setFaqRespuesta(solucion?.contenido || ultimaAdmin?.contenido || "");
    } catch (errorCarga: unknown) {
      setError(errorCarga instanceof Error ? errorCarga.message : "No fue posible cargar la solicitud.");
    } finally {
      setLoading(false);
    }
  }, [idPregunta]);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  const pregunta = data?.pregunta;
  const categoriasActivas = useMemo(
    () => (data?.categorias ?? []).filter((categoria) => categoria.activo),
    [data?.categorias],
  );

  const guardarCambios = async () => {
    try {
      setGuardando(true);
      const response = await fetch(`/api/admin/soporte/preguntas/${idPregunta}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ estado, prioridad, idCategoria, esPrivada }),
      });
      if (!response.ok) throw new Error(await obtenerMensajeError(response));
      toast.success("Solicitud actualizada.");
      await cargar();
    } catch (errorGuardado: unknown) {
      toast.error(errorGuardado instanceof Error ? errorGuardado.message : "No fue posible guardar los cambios.");
    } finally {
      setGuardando(false);
    }
  };

  const enviarRespuesta = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const contenido = respuesta.trim();
    if (contenido.length < 3) {
      toast.info("Escribe una respuesta de al menos 3 caracteres.");
      return;
    }
    try {
      setRespondiendo(true);
      const responseApi = await fetch(`/api/admin/soporte/preguntas/${idPregunta}/respuestas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ contenido, esSolucion }),
      });
      if (!responseApi.ok) throw new Error(await obtenerMensajeError(responseApi));
      setRespuesta("");
      setEsSolucion(false);
      toast.success("Respuesta registrada.");
      await cargar();
    } catch (errorRespuesta: unknown) {
      toast.error(errorRespuesta instanceof Error ? errorRespuesta.message : "No fue posible enviar la respuesta.");
    } finally {
      setRespondiendo(false);
    }
  };

  const cambiarSolucion = async (
    respuestaSeleccionada: RespuestaAyuda,
  ) => {
    try {
      const responseApi = await fetch(
        `/api/admin/soporte/respuestas/${respuestaSeleccionada.idRespuesta}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            esSolucion: !respuestaSeleccionada.esSolucion,
          }),
        },
      );

      if (!responseApi.ok) {
        throw new Error(await obtenerMensajeError(responseApi));
      }

      toast.success(
        respuestaSeleccionada.esSolucion
          ? "La respuesta dejó de ser la solución."
          : "Respuesta marcada como solución.",
      );
      await cargar();
    } catch (errorSolucion: unknown) {
      toast.error(
        errorSolucion instanceof Error
          ? errorSolucion.message
          : "No fue posible actualizar la solución.",
      );
    }
  };

  const convertirFaq = async () => {
    if (!idCategoria) {
      toast.info("Selecciona una categoría antes de convertir la solicitud.");
      return;
    }
    try {
      setConvirtiendo(true);
      const responseApi = await fetch(`/api/admin/soporte/preguntas/${idPregunta}/convertir-faq`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          idCategoria,
          pregunta: faqPregunta.trim(),
          respuesta: faqRespuesta.trim(),
          esDestacada: faqDestacada,
          tags: faqTags.split(",").map((tag) => tag.trim()).filter(Boolean),
        }),
      });
      if (!responseApi.ok) throw new Error(await obtenerMensajeError(responseApi));
      toast.success("La solicitud se convirtió en pregunta frecuente.");
      await cargar();
    } catch (errorConversion: unknown) {
      toast.error(errorConversion instanceof Error ? errorConversion.message : "No fue posible convertir la solicitud.");
    } finally {
      setConvirtiendo(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-slate-200 bg-white">
        <Loader2 className="animate-spin text-[#0A3D62]" size={28} aria-hidden="true" />
      </div>
    );
  }

  if (error || !pregunta || !data) {
    return (
      <div className="rounded-3xl border border-red-200 bg-white p-8 text-center text-slate-900">
        <AlertCircle className="mx-auto text-red-600" size={32} aria-hidden="true" />
        <h1 className="mt-3 text-xl font-black text-[#0A3D62]">No pudimos cargar la solicitud</h1>
        <p className="mt-2 text-sm text-slate-600">{error}</p>
        <button type="button" onClick={() => void cargar()} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0A3D62] px-4 py-2.5 text-xs font-bold text-white">
          <RefreshCw size={15} aria-hidden="true" /> Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5 text-slate-900">
      <button type="button" onClick={() => router.push("/soporte-admin")} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 hover:text-[#0A3D62]">
        <ArrowLeft size={15} aria-hidden="true" /> Volver a soporte
      </button>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-[#0A3D62] px-5 py-5 text-white sm:px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#FFC300]">Solicitud #{pregunta.idPregunta}</p>
              <h1 className="mt-2 text-xl font-black sm:text-2xl">{pregunta.titulo}</h1>
              <p className="mt-2 max-w-3xl whitespace-pre-line text-sm leading-6 text-white/75">{pregunta.descripcion}</p>
            </div>
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold">
              {pregunta.esPrivada ? <LockKeyhole size={13} /> : <ShieldCheck size={13} />}
              {pregunta.esPrivada ? "Privada" : "Visible para soporte"}
            </span>
          </div>
        </div>

        <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4 sm:p-6">
          <Info icon={UserRound} label="Solicitante" value={nombreUsuario(pregunta.usuario, "Usuario")} />
          <Info icon={Mail} label="Correo" value={pregunta.usuario?.correo || "No disponible"} />
          <Info icon={FolderOpen} label="Categoría" value={pregunta.categoria?.nombreCategoria || "Sin categoría"} />
          <Info icon={CalendarDays} label="Registrada" value={formatearFecha(pregunta.createdAt)} />
        </div>
      </section>

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <header className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4">
            <div>
              <h2 className="font-black text-[#0A3D62]">Conversación</h2>
              <p className="mt-0.5 text-xs text-slate-500">{data.respuestas.length} mensajes registrados</p>
            </div>
            <MessageSquareReply className="text-[#0A3D62]" size={21} aria-hidden="true" />
          </header>

          <div className="space-y-3 p-5">
            {data.respuestas.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-7 text-center">
                <FileQuestion className="mx-auto text-slate-400" size={28} />
                <p className="mt-2 text-sm font-bold text-slate-600">Aún no hay respuestas</p>
              </div>
            ) : (
              data.respuestas.map((item) => (
                <Respuesta
                  key={item.idRespuesta}
                  respuesta={item}
                  onCambiarSolucion={() => void cambiarSolucion(item)}
                />
              ))
            )}

            {pregunta.estado !== "convertida_faq" && (
              <form onSubmit={enviarRespuesta} className="mt-5 border-t border-slate-200 pt-5">
                <label htmlFor="respuesta-admin" className="text-xs font-bold text-slate-700">Responder como equipo de soporte</label>
                <textarea id="respuesta-admin" value={respuesta} onChange={(event) => setRespuesta(event.target.value)} rows={5} className="mt-2 w-full rounded-2xl border border-slate-300 bg-white p-3 text-sm text-slate-900 outline-none focus:border-[#0A3D62] focus:ring-4 focus:ring-[#0A3D62]/10" placeholder="Escribe una respuesta clara para el usuario..." />
                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-600">
                    <input type="checkbox" checked={esSolucion} onChange={(event) => setEsSolucion(event.target.checked)} className="h-4 w-4 rounded border-slate-300" />
                    Marcar como solución
                  </label>
                  <button type="submit" disabled={respondiendo} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#0A3D62] px-5 text-xs font-black text-white hover:bg-[#FFC300] hover:text-[#0A3D62] disabled:opacity-60">
                    {respondiendo ? <Loader2 className="animate-spin" size={15} /> : <Send size={15} />}
                    Enviar respuesta
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

        <aside className="space-y-5">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-black text-[#0A3D62]">Administrar solicitud</h2>
            <div className="mt-4 space-y-4">
              <CampoSelect label="Estado" value={estado} onChange={(value) => setEstado(value as EstadoPregunta)} opciones={ESTADOS} />
              <CampoSelect label="Prioridad" value={prioridad} onChange={(value) => setPrioridad(value as PrioridadPregunta)} opciones={PRIORIDADES} />
              <div>
                <label htmlFor="categoria-admin" className="text-xs font-bold text-slate-700">Categoría</label>
                <select id="categoria-admin" value={idCategoria ?? ""} onChange={(event) => setIdCategoria(event.target.value ? Number(event.target.value) : null)} className="mt-1.5 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900">
                  <option value="">Sin categoría</option>
                  {categoriasActivas.map((categoria) => <option key={categoria.idCategoria} value={categoria.idCategoria}>{categoria.nombreCategoria}</option>)}
                </select>
              </div>
              <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <span><span className="block text-xs font-bold text-slate-700">Pregunta privada</span><span className="mt-0.5 block text-[10px] text-slate-500">Solo usuario y administradores</span></span>
                <input type="checkbox" checked={esPrivada} onChange={(event) => setEsPrivada(event.target.checked)} className="h-4 w-4 rounded border-slate-300" />
              </label>
              <button type="button" onClick={() => void guardarCambios()} disabled={guardando} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0A3D62] px-4 text-xs font-black text-white hover:bg-[#FFC300] hover:text-[#0A3D62] disabled:opacity-60">
                {guardando ? <Loader2 className="animate-spin" size={15} /> : <Save size={15} />} Guardar cambios
              </button>
            </div>
          </section>

          {pregunta.estado !== "convertida_faq" ? (
            <section className="rounded-3xl border border-emerald-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2"><BadgeCheck className="text-emerald-600" size={20} /><h2 className="font-black text-[#0A3D62]">Convertir en FAQ</h2></div>
              <p className="mt-2 text-xs leading-5 text-slate-500">Publica la solución para que otros usuarios puedan encontrarla.</p>
              <div className="mt-4 space-y-3">
                <input value={faqPregunta} onChange={(event) => setFaqPregunta(event.target.value)} className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900" placeholder="Pregunta frecuente" />
                <textarea value={faqRespuesta} onChange={(event) => setFaqRespuesta(event.target.value)} rows={5} className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-900" placeholder="Respuesta pública" />
                <div className="relative"><Tag className="pointer-events-none absolute left-3 top-3 text-slate-400" size={15} /><input value={faqTags} onChange={(event) => setFaqTags(event.target.value)} className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 text-sm text-slate-900" placeholder="tags, separados, por comas" /></div>
                <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-600"><input type="checkbox" checked={faqDestacada} onChange={(event) => setFaqDestacada(event.target.checked)} /> Destacar FAQ</label>
                <button type="button" onClick={() => void convertirFaq()} disabled={convirtiendo} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-xs font-black text-white hover:bg-emerald-700 disabled:opacity-60">
                  {convirtiendo ? <Loader2 className="animate-spin" size={15} /> : <BadgeCheck size={15} />} Convertir y publicar
                </button>
              </div>
            </section>
          ) : (
            <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5"><CheckCircle2 className="text-emerald-600" /><p className="mt-2 text-sm font-black text-emerald-800">Convertida en FAQ</p><p className="mt-1 text-xs text-emerald-700">FAQ #{pregunta.idPreguntaFaq}</p></section>
          )}
        </aside>
      </div>
    </div>
  );
}

function Info({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EAF2F8] text-[#0A3D62]"><Icon size={17} /></span><span className="min-w-0"><span className="block text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400">{label}</span><span className="mt-0.5 block truncate text-xs font-bold text-slate-700" title={value}>{value}</span></span></div>;
}

function Respuesta({
  respuesta,
  onCambiarSolucion,
}: {
  respuesta: RespuestaAyuda;
  onCambiarSolucion: () => void;
}) {
  const esAdmin = respuesta.esRespuestaAdmin;

  return (
    <article
      className={`rounded-2xl border p-4 ${
        esAdmin
          ? "border-[#0A3D62]/15 bg-[#F1F6F9]"
          : "border-slate-200 bg-white sm:ml-8"
      } ${respuesta.esSolucion ? "ring-2 ring-emerald-200" : ""}`}
    >
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black text-[#0A3D62]">
            {nombreUsuario(
              respuesta.usuario,
              esAdmin ? "Equipo de soporte" : "Usuario",
            )}
          </p>
          <p className="mt-1 text-[10px] text-slate-400">
            {formatearFecha(respuesta.createdAt)}
          </p>
        </div>

        <div className="flex flex-wrap justify-end gap-1.5">
          {esAdmin && (
            <span className="rounded-full bg-[#0A3D62] px-2 py-1 text-[9px] font-bold text-white">
              Admin
            </span>
          )}
          {respuesta.esSolucion && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-[9px] font-bold text-emerald-700">
              <CheckCircle2 size={10} /> Solución
            </span>
          )}
        </div>
      </header>

      <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">
        {respuesta.contenido}
      </p>

      {esAdmin && (
        <div className="mt-3 flex justify-end border-t border-slate-200 pt-3">
          <button
            type="button"
            onClick={onCambiarSolucion}
            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-3 py-2 text-[10px] font-bold text-emerald-700 hover:bg-emerald-50"
          >
            <CheckCircle2 size={13} />
            {respuesta.esSolucion
              ? "Quitar como solución"
              : "Marcar como solución"}
          </button>
        </div>
      )}
    </article>
  );
}

function CampoSelect({ label, value, onChange, opciones }: { label: string; value: string; onChange: (value: string) => void; opciones: Array<{ value: string; label: string }> }) {
  return <div><label className="text-xs font-bold text-slate-700">{label}</label><div className="relative mt-1.5"><CircleGauge className="pointer-events-none absolute left-3 top-3 text-slate-400" size={15} /><select value={value} onChange={(event) => onChange(event.target.value)} className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 text-sm text-slate-900">{opciones.map((opcion) => <option key={opcion.value} value={opcion.value}>{opcion.label}</option>)}</select></div></div>;
}
