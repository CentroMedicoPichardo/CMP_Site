"use client";

import {
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface SoporteModalProps {
  abierto: boolean;
  titulo: string;
  descripcion?: string;
  children: ReactNode;
  onClose: () => void;
  ancho?: "md" | "lg" | "xl";
}

const ANCHOS = {
  md: "max-w-xl",
  lg: "max-w-3xl",
  xl: "max-w-5xl",
} as const;

export default function SoporteModal({
  abierto,
  titulo,
  descripcion,
  children,
  onClose,
  ancho = "lg",
}: SoporteModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!abierto) {
      return;
    }

    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const cerrarConEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", cerrarConEscape);

    return () => {
      document.body.style.overflow = overflowAnterior;
      document.removeEventListener("keydown", cerrarConEscape);
    };
  }, [abierto, onClose]);

  if (!mounted || !abierto) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-slate-950/70 p-4 backdrop-blur-[2px]"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="soporte-modal-title"
        className={`my-auto w-full ${ANCHOS[ancho]} overflow-hidden rounded-3xl border border-slate-200 bg-white text-slate-900 shadow-2xl`}
      >
        <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <h2
              id="soporte-modal-title"
              className="text-lg font-black text-[#0A3D62] sm:text-xl"
            >
              {titulo}
            </h2>

            {descripcion && (
              <p className="mt-1 text-xs leading-5 text-slate-500">
                {descripcion}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:border-[#0A3D62]/20 hover:bg-slate-50 hover:text-[#0A3D62] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300]"
            aria-label="Cerrar ventana"
          >
            <X size={17} aria-hidden="true" />
          </button>
        </header>

        {children}
      </section>
    </div>,
    document.body,
  );
}
