"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  LockKeyhole,
  Tag,
  ThumbsDown,
  ThumbsUp,
  UsersRound,
} from "lucide-react";

interface FAQCardProps {
  pregunta: string;
  respuesta: string;
  categoria?: string;
  vecesUtil: number;
  vecesNoUtil?: number;
  esDestacada?: boolean;
  estaAutenticado: boolean;
  valoracionUsuario?: boolean | null;
  onUtilClick?: (esUtil: boolean) => Promise<void> | void;
}

function cn(...clases: Array<string | false | null | undefined>): string {
  return clases.filter(Boolean).join(" ");
}

export default function FAQCard({
  pregunta,
  respuesta,
  categoria,
  vecesUtil,
  vecesNoUtil = 0,
  esDestacada = false,
  estaAutenticado,
  valoracionUsuario = null,
  onUtilClick,
}: FAQCardProps) {
  const contenidoId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [enviandoValoracion, setEnviandoValoracion] = useState(false);
  const [valoracionLocal, setValoracionLocal] = useState<boolean | null>(valoracionUsuario);

  useEffect(() => {
    setValoracionLocal(valoracionUsuario);
  }, [valoracionUsuario]);

  const handleValoracion = async (esUtil: boolean) => {
    if (!estaAutenticado || valoracionLocal !== null || !onUtilClick || enviandoValoracion) return;
    try {
      setEnviandoValoracion(true);
      await onUtilClick(esUtil);
      setValoracionLocal(esUtil);
    } catch {
      // El componente padre muestra el mensaje de error.
    } finally {
      setEnviandoValoracion(false);
    }
  };

  return (
    <article className={cn("group overflow-hidden rounded-2xl border bg-white transition-all", isOpen ? "border-[#0A3D62]/20 shadow-lg" : "border-gray-200 shadow-sm hover:border-[#0A3D62]/15", esDestacada && "border-[#FFC300]/50")}>
      <button type="button" onClick={() => setIsOpen((actual) => !actual)} aria-expanded={isOpen} aria-controls={contenidoId} className="flex w-full items-center gap-3 px-4 py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#FFC300] sm:px-5">
        <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", isOpen ? "bg-[#0A3D62] text-[#FFC300]" : "bg-[#EAF2F8] text-[#0A3D62]")}><CircleHelp size={18} aria-hidden="true" /></span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">{esDestacada && <span className="inline-flex items-center gap-1 rounded-full border border-[#FFC300]/40 bg-[#FFF8D9] px-2 py-0.5 text-[8px] font-extrabold uppercase text-[#8A6500]"><BadgeCheck size={11} /> Destacada</span>}{categoria && <span className="hidden items-center gap-1 text-[9px] font-bold uppercase tracking-[0.1em] text-gray-400 sm:inline-flex"><Tag size={11} /> {categoria}</span>}</span>
          <span className="mt-1 block text-sm font-extrabold leading-6 text-gray-800 group-hover:text-[#0A3D62] sm:text-base">{pregunta}</span>
        </span>
        <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-transform", isOpen ? "rotate-180 border-[#0A3D62] bg-[#0A3D62] text-white" : "border-gray-200 text-gray-400")}><ChevronDown size={17} /></span>
      </button>

      <div id={contenidoId} className={cn("grid transition-[grid-template-rows,opacity] duration-300", isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
        <div className="overflow-hidden">
          <div className="border-t border-gray-100 px-4 pb-5 pt-4 sm:px-5">
            <div className="relative rounded-xl border border-[#0A3D62]/10 bg-[#F7FAFC] px-4 py-3.5"><span className="absolute bottom-3 left-0 top-3 w-1 rounded-r-full bg-[#FFC300]" /><p className="whitespace-pre-line text-sm leading-6 text-gray-600">{respuesta}</p></div>
            <div className="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-500"><span className="inline-flex items-center gap-1.5"><UsersRound size={14} className="text-[#0A3D62]" /> {vecesUtil} personas la encontraron útil</span><span className="inline-flex items-center gap-1.5"><ThumbsDown size={13} /> {vecesNoUtil} no útil</span></div>
              {estaAutenticado && onUtilClick ? (
                valoracionLocal === null ? (
                  <div className="flex items-center gap-2"><button type="button" disabled={enviandoValoracion} onClick={() => void handleValoracion(true)} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-emerald-200 px-3 text-xs font-bold text-emerald-700 disabled:opacity-50"><ThumbsUp size={15} /> Sí</button><button type="button" disabled={enviandoValoracion} onClick={() => void handleValoracion(false)} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-gray-200 px-3 text-xs font-bold text-gray-600 disabled:opacity-50"><ThumbsDown size={15} /> No</button></div>
                ) : (
                  <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700"><CheckCircle2 size={15} /> Valoración registrada</div>
                )
              ) : (
                <div className="flex items-center gap-2 rounded-xl border border-[#0A3D62]/10 bg-[#F7FAFC] px-3 py-2"><LockKeyhole size={14} className="text-[#0A3D62]" /><Link href="/acceder" className="text-xs font-bold text-[#0A3D62] hover:underline">Inicia sesión para valorar</Link></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
