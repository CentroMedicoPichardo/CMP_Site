"use client";

import {
  CalendarDays,
  CircleAlert,
  Eraser,
  Loader2,
  MapPin,
  Monitor,
  Sparkles,
  Tag,
  Users,
} from "lucide-react";
import type { ChangeEvent, FormEvent } from "react";

import type {
  CategoriaCursoOption,
  ModalidadCurso,
  UbicacionCursoOption,
} from "@/types/catalogos-cursos";

import type { PrediccionFormulario } from "./types";

interface FormularioPrediccionProps {
  formData: PrediccionFormulario;
  categorias: CategoriaCursoOption[];
  modalidades: ModalidadCurso[];
  ubicaciones: UbicacionCursoOption[];
  loadingCatalogos: boolean;
  calculando: boolean;
  error: string | null;
  onChange: (campo: keyof PrediccionFormulario, valor: string | number | null) => void;
  onSubmit: () => void;
  onReset: () => void;
}

function capitalizar(valor: string): string {
  const texto = valor.trim();
  return texto ? texto.charAt(0).toUpperCase() + texto.slice(1) : texto;
}

export function FormularioPrediccion({
  formData,
  categorias,
  modalidades,
  ubicaciones,
  loadingCatalogos,
  calculando,
  error,
  onChange,
  onSubmit,
  onReset,
}: FormularioPrediccionProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  const handleInput =
    (campo: keyof PrediccionFormulario) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const valor = event.target.value;

      if (
        campo === "categoriaId" ||
        campo === "modalidadId" ||
        campo === "ubicacionId"
      ) {
        onChange(campo, valor === "" ? null : Number(valor));
        return;
      }

      if (campo === "cupoMaximo") {
        onChange(campo, valor === "" ? 0 : Number(valor));
        return;
      }

      onChange(campo, valor);
    };

  const inputClass =
    "min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#FFC300] focus:ring-4 focus:ring-[#FFC300]/15 disabled:cursor-not-allowed disabled:bg-slate-100";

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#EAF2F8] text-[#0A3D62]">
            <Sparkles size={19} aria-hidden="true" />
          </span>

          <div>
            <h2 className="text-base font-black text-[#0A3D62]">
              Datos del curso
            </h2>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Completa las variables necesarias para estimar el precio.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 p-5">
        {error && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-xs font-bold text-red-700"
          >
            <CircleAlert size={15} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="mb-2 block text-xs font-extrabold text-[#0A3D62]">
            Título de referencia
          </label>
          <input
            type="text"
            value={formData.tituloCurso}
            onChange={handleInput("tituloCurso")}
            className={inputClass}
            placeholder="Ej. Manejo avanzado de heridas"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-extrabold text-[#0A3D62]">
              Categoría
            </label>
            <div className="relative">
              <Tag
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0A3D62]"
              />
              <select
                value={formData.categoriaId ?? ""}
                onChange={handleInput("categoriaId")}
                disabled={loadingCatalogos || calculando}
                className={`${inputClass} cursor-pointer pl-10`}
              >
                <option value="">
                  {loadingCatalogos ? "Cargando..." : "Seleccionar categoría"}
                </option>
                {categorias.map((categoria) => (
                  <option
                    key={categoria.idCategoria}
                    value={categoria.idCategoria}
                  >
                    {categoria.nombreCategoria}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-extrabold text-[#0A3D62]">
              Modalidad
            </label>
            <div className="relative">
              <Monitor
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0A3D62]"
              />
              <select
                value={formData.modalidadId ?? ""}
                onChange={handleInput("modalidadId")}
                disabled={loadingCatalogos || calculando}
                className={`${inputClass} cursor-pointer pl-10`}
              >
                <option value="">
                  {loadingCatalogos ? "Cargando..." : "Seleccionar modalidad"}
                </option>
                {modalidades.map((modalidad) => (
                  <option
                    key={modalidad.idModalidad}
                    value={modalidad.idModalidad}
                  >
                    {capitalizar(modalidad.nombreModalidad)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-extrabold text-[#0A3D62]">
              Ubicación
            </label>
            <div className="relative">
              <MapPin
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0A3D62]"
              />
              <select
                value={formData.ubicacionId ?? ""}
                onChange={handleInput("ubicacionId")}
                disabled={loadingCatalogos || calculando}
                className={`${inputClass} cursor-pointer pl-10`}
              >
                <option value="">Sin ubicación definida</option>
                {ubicaciones.map((ubicacion) => (
                  <option
                    key={ubicacion.idUbicacion}
                    value={ubicacion.idUbicacion}
                  >
                    {ubicacion.nombreUbicacion}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-extrabold text-[#0A3D62]">
              Cupo máximo
            </label>
            <div className="relative">
              <Users
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0A3D62]"
              />
              <input
                type="number"
                min={1}
                step={1}
                value={formData.cupoMaximo}
                onChange={handleInput("cupoMaximo")}
                disabled={calculando}
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-extrabold text-[#0A3D62]">
              Fecha de inicio
            </label>
            <div className="relative">
              <CalendarDays
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0A3D62]"
              />
              <input
                type="date"
                value={formData.fechaInicio}
                max={formData.fechaFin || undefined}
                onChange={handleInput("fechaInicio")}
                disabled={calculando}
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-extrabold text-[#0A3D62]">
              Fecha final
            </label>
            <div className="relative">
              <CalendarDays
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0A3D62]"
              />
              <input
                type="date"
                value={formData.fechaFin}
                min={formData.fechaInicio || undefined}
                onChange={handleInput("fechaFin")}
                disabled={calculando}
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-extrabold text-[#0A3D62]">
            Precio actual para comparar
          </label>
          <input
            type="number"
            min={0}
            step="0.01"
            value={formData.precioActual}
            onChange={handleInput("precioActual")}
            disabled={calculando}
            className={inputClass}
            placeholder="0.00"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2">
          <button
            type="submit"
            disabled={calculando || loadingCatalogos}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#0A3D62] px-4 py-3 text-xs font-black text-white shadow-sm transition hover:bg-[#082F4C] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {calculando ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Sparkles size={16} />
            )}
            {calculando ? "Calculando..." : "Predecir precio"}
          </button>

          <button
            type="button"
            onClick={onReset}
            disabled={calculando}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-black text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Eraser size={16} />
            Limpiar
          </button>
        </div>
      </form>
    </section>
  );
}
