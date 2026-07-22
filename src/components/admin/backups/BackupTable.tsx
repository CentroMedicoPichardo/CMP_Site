"use client";

import { useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Database,
  DatabaseBackup,
  Download,
  FileWarning,
  HardDrive,
  Layers3,
  Loader2,
  Trash2,
  XCircle,
  type LucideIcon,
} from "lucide-react";

import type { Backup } from "@/types/backups";

interface BackupTableProps {
  backups: Backup[];
  onDownload: (id: string) => Promise<void> | void;
  onDelete: (id: string) => Promise<void> | void;
}

type TipoAccion = "descargar" | "eliminar";

interface AccionActiva {
  id: string;
  tipo: TipoAccion;
}

interface ConfiguracionTipo {
  etiqueta: string;
  descripcion: string;
  Icono: LucideIcon;
  contenedor: string;
  icono: string;
}

interface ConfiguracionEstado {
  etiqueta: string;
  descripcion: string;
  Icono: LucideIcon;
  contenedor: string;
  icono: string;
  punto: string;
}

function cn(
  ...clases: Array<string | false | null | undefined>
): string {
  return clases.filter(Boolean).join(" ");
}

function textoSeguro(
  valor: unknown,
  respaldo: string,
): string {
  if (
    typeof valor === "string" &&
    valor.trim().length > 0
  ) {
    return valor.trim();
  }

  if (
    typeof valor === "number" &&
    Number.isFinite(valor)
  ) {
    return String(valor);
  }

  if (typeof valor === "bigint") {
    return valor.toString();
  }

  return respaldo;
}

function normalizarTexto(
  valor: unknown,
): string {
  return textoSeguro(valor, "")
    .toLocaleLowerCase("es-MX")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function obtenerFecha(
  fecha: unknown,
): Date | null {
  if (
    typeof fecha !== "string" &&
    !(fecha instanceof Date)
  ) {
    return null;
  }

  const valor =
    fecha instanceof Date
      ? fecha
      : new Date(fecha);

  if (Number.isNaN(valor.getTime())) {
    return null;
  }

  return valor;
}

function formatearFecha(
  fecha: unknown,
): string {
  const valor = obtenerFecha(fecha);

  if (!valor) {
    return "Fecha no disponible";
  }

  return valor.toLocaleDateString("es-MX", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatearHora(
  fecha: unknown,
): string {
  const valor = obtenerFecha(fecha);

  if (!valor) {
    return "Hora no disponible";
  }

  return valor.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function obtenerIdentificador(
  id: string,
): string {
  const valor = textoSeguro(id, "Sin ID");

  return valor.startsWith("#")
    ? valor
    : `#${valor}`;
}

function obtenerConfiguracionTipo(
  tipo: Backup["tipo"],
): ConfiguracionTipo {
  const valor = normalizarTexto(tipo);

  if (valor === "completo") {
    return {
      etiqueta: "Respaldo completo",
      descripcion:
        "Incluye todos los esquemas y tablas de la base de datos.",
      Icono: Database,
      contenedor:
        "border-emerald-200 bg-emerald-50",
      icono:
        "bg-white text-emerald-700",
    };
  }

  return {
    etiqueta: "Respaldo parcial",
    descripcion:
      "Incluye únicamente la información seleccionada para esta copia.",
    Icono: Layers3,
    contenedor:
      "border-amber-200 bg-amber-50",
    icono:
      "bg-white text-amber-700",
  };
}

function obtenerConfiguracionEstado(
  estado: Backup["estado"],
): ConfiguracionEstado {
  const valor = normalizarTexto(estado);

  if (
    valor === "exitoso" ||
    valor === "completado" ||
    valor === "completo"
  ) {
    return {
      etiqueta: "Exitoso",
      descripcion:
        "El respaldo terminó correctamente y quedó registrado.",
      Icono: CheckCircle2,
      contenedor:
        "border-emerald-200 bg-emerald-50 text-emerald-800",
      icono:
        "bg-white text-emerald-700",
      punto: "bg-emerald-500",
    };
  }

  if (
    valor === "procesando" ||
    valor === "pendiente" ||
    valor === "generando"
  ) {
    return {
      etiqueta: "Procesando",
      descripcion:
        "El archivo todavía se está generando. Espera antes de descargarlo.",
      Icono: Clock3,
      contenedor:
        "border-amber-200 bg-amber-50 text-amber-800",
      icono:
        "bg-white text-amber-700",
      punto:
        "animate-pulse bg-amber-500",
    };
  }

  return {
    etiqueta: "Fallido",
    descripcion:
      "La generación del respaldo presentó un error.",
    Icono: XCircle,
    contenedor:
      "border-red-200 bg-red-50 text-red-800",
    icono:
      "bg-white text-red-700",
    punto: "bg-red-500",
  };
}

export function BackupTable({
  backups,
  onDownload,
  onDelete,
}: BackupTableProps) {
  const [
    accionActiva,
    setAccionActiva,
  ] = useState<AccionActiva | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  const respaldosSeguros =
    Array.isArray(backups)
      ? backups
      : [];

  const activarScroll =
    respaldosSeguros.length > 6;

  const totalExitosos =
    respaldosSeguros.filter((backup) => {
      const estado = normalizarTexto(
        backup.estado,
      );

      return (
        estado === "exitoso" ||
        estado === "completado" ||
        estado === "completo"
      );
    }).length;

  const totalProcesando =
    respaldosSeguros.filter((backup) => {
      const estado = normalizarTexto(
        backup.estado,
      );

      return (
        estado === "procesando" ||
        estado === "pendiente" ||
        estado === "generando"
      );
    }).length;

  const totalFallidos = Math.max(
    0,
    respaldosSeguros.length -
      totalExitosos -
      totalProcesando,
  );

  const ejecutarAccion = async (
    id: string,
    tipo: TipoAccion,
  ) => {
    if (accionActiva) {
      return;
    }

    try {
      setError(null);

      setAccionActiva({
        id,
        tipo,
      });

      if (tipo === "descargar") {
        await onDownload(id);
      } else {
        await onDelete(id);
      }
    } catch (errorAccion: unknown) {
      console.error(
        `Error al ${tipo} el respaldo:`,
        errorAccion,
      );

      setError(
        errorAccion instanceof Error
          ? errorAccion.message
          : tipo === "descargar"
            ? "No fue posible descargar el respaldo."
            : "No fue posible eliminar el respaldo.",
      );
    } finally {
      setAccionActiva(null);
    }
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <header className="flex min-h-[82px] flex-col gap-4 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0A3D62] text-[#FFC300]">
            <DatabaseBackup
              size={19}
              strokeWidth={1.9}
              aria-hidden="true"
            />
          </span>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-extrabold text-[#0A3D62]">
                Historial de respaldos
              </h2>

              <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-bold text-gray-600">
                {respaldosSeguros.length}{" "}
                {respaldosSeguros.length === 1
                  ? "archivo"
                  : "archivos"}
              </span>
            </div>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              Información completa de las copias
              de seguridad registradas
            </p>
          </div>
        </div>

        {activarScroll && (
          <span className="self-start rounded-full bg-[#FFF9E6] px-3 py-1 text-[10px] font-extrabold text-[#8A6900] sm:self-auto">
            Desplázate para ver más
          </span>
        )}
      </header>

      {error && (
        <div
          className="px-5 pt-4"
          aria-live="polite"
        >
          <div
            className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700"
            role="alert"
          >
            <AlertCircle
              size={17}
              className="mt-0.5 shrink-0"
              aria-hidden="true"
            />

            <span className="min-w-0 flex-1">
              {error}
            </span>

            <button
              type="button"
              onClick={() => setError(null)}
              className="shrink-0 text-xs font-extrabold underline underline-offset-2"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {respaldosSeguros.length === 0 ? (
        <div className="flex min-h-[430px] items-center justify-center px-5 py-8">
          <div className="w-full rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-5 py-14 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-gray-300 shadow-sm">
              <DatabaseBackup
                size={27}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </span>

            <p className="mt-4 text-base font-extrabold text-gray-700">
              No hay respaldos disponibles
            </p>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              Genera tu primer respaldo con el
              panel de creación para que aparezca
              dentro de este historial.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div
            className={cn(
              "space-y-4 p-5",
              activarScroll &&
                "max-h-[980px] overflow-y-auto overscroll-contain pr-3",
            )}
            style={
              activarScroll
                ? {
                    scrollbarGutter: "stable",
                  }
                : undefined
            }
            aria-label="Historial de respaldos"
          >
            {respaldosSeguros.map((backup) => {
              const tipo =
                obtenerConfiguracionTipo(
                  backup.tipo,
                );

              const estado =
                obtenerConfiguracionEstado(
                  backup.estado,
                );

              const IconoTipo = tipo.Icono;
              const IconoEstado = estado.Icono;

              const descargando =
                accionActiva?.id ===
                  backup.id &&
                accionActiva.tipo ===
                  "descargar";

              const eliminando =
                accionActiva?.id ===
                  backup.id &&
                accionActiva.tipo ===
                  "eliminar";

              const hayAccion =
                accionActiva !== null;

              return (
                <article
                  key={backup.id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all hover:border-[#0A3D62]/25 hover:shadow-sm"
                >
                  <div className="flex flex-col gap-4 border-b border-gray-100 bg-[#F8FAFC] px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex min-w-0 items-start gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0A3D62] text-[#FFC300]">
                        <DatabaseBackup
                          size={20}
                          aria-hidden="true"
                        />
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
                          Identificador del respaldo
                        </p>

                        <p className="mt-1 whitespace-normal break-all font-mono text-sm font-extrabold leading-6 text-[#0A3D62]">
                          {obtenerIdentificador(
                            backup.id,
                          )}
                        </p>
                      </div>
                    </div>

                    <span
                      className={cn(
                        "inline-flex self-start items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-extrabold lg:self-auto",
                        estado.contenedor,
                      )}
                    >
                      <span
                        className={cn(
                          "h-2 w-2 shrink-0 rounded-full",
                          estado.punto,
                        )}
                        aria-hidden="true"
                      />

                      <IconoEstado
                        size={14}
                        aria-hidden="true"
                      />

                      {estado.etiqueta}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2 2xl:grid-cols-4">
                    <div className="min-h-[130px] rounded-xl border border-gray-200 bg-white p-4">
                      <div className="flex items-start gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FFF9E6] text-[#A87900]">
                          <CalendarDays
                            size={17}
                            aria-hidden="true"
                          />
                        </span>

                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                            Fecha de generación
                          </p>

                          <p className="mt-2 whitespace-normal break-words text-sm font-extrabold leading-6 text-gray-800">
                            {formatearFecha(
                              backup.fecha,
                            )}
                          </p>

                          <p className="mt-1 flex items-center gap-1.5 text-sm leading-5 text-gray-500">
                            <Clock3
                              size={13}
                              className="shrink-0"
                              aria-hidden="true"
                            />

                            {formatearHora(
                              backup.fecha,
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      className={cn(
                        "min-h-[130px] rounded-xl border p-4",
                        tipo.contenedor,
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={cn(
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg shadow-sm",
                            tipo.icono,
                          )}
                        >
                          <IconoTipo
                            size={17}
                            aria-hidden="true"
                          />
                        </span>

                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500">
                            Tipo de respaldo
                          </p>

                          <p className="mt-2 whitespace-normal break-words text-sm font-extrabold leading-6 text-gray-800">
                            {tipo.etiqueta}
                          </p>

                          <p className="mt-1 whitespace-normal break-words text-xs leading-5 text-gray-600">
                            {tipo.descripcion}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="min-h-[130px] rounded-xl border border-gray-200 bg-white p-4">
                      <div className="flex items-start gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-700">
                          <HardDrive
                            size={17}
                            aria-hidden="true"
                          />
                        </span>

                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                            Tamaño del archivo
                          </p>

                          <p className="mt-2 whitespace-normal break-all text-base font-extrabold leading-6 text-gray-800">
                            {textoSeguro(
                              backup.tamaño,
                              "No disponible",
                            )}
                          </p>

                          <p className="mt-1 text-xs leading-5 text-gray-500">
                            Espacio ocupado por esta
                            copia de seguridad.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      className={cn(
                        "min-h-[130px] rounded-xl border p-4",
                        estado.contenedor,
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={cn(
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg shadow-sm",
                            estado.icono,
                          )}
                        >
                          <IconoEstado
                            size={17}
                            aria-hidden="true"
                          />
                        </span>

                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-bold uppercase tracking-wide opacity-70">
                            Estado del proceso
                          </p>

                          <p className="mt-2 whitespace-normal break-words text-sm font-extrabold leading-6">
                            {estado.etiqueta}
                          </p>

                          <p className="mt-1 whitespace-normal break-words text-xs leading-5 opacity-80">
                            {estado.descripcion}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 border-t border-gray-100 bg-gray-50/70 px-5 py-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                        Disponibilidad del archivo
                      </p>

                      {backup.disponible ? (
                        <p className="mt-1.5 flex items-start gap-2 text-sm font-bold leading-6 text-emerald-700">
                          <CheckCircle2
                            size={16}
                            className="mt-1 shrink-0"
                            aria-hidden="true"
                          />

                          <span>
                            El archivo está disponible
                            y puede descargarse.
                          </span>
                        </p>
                      ) : (
                        <p className="mt-1.5 flex items-start gap-2 text-sm font-bold leading-6 text-amber-700">
                          <FileWarning
                            size={16}
                            className="mt-1 shrink-0"
                            aria-hidden="true"
                          />

                          <span>
                            El registro existe, pero el
                            archivo no está disponible
                            para descarga.
                          </span>
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:min-w-[360px]">
                      <button
                        type="button"
                        onClick={() => {
                          void ejecutarAccion(
                            backup.id,
                            "descargar",
                          );
                        }}
                        disabled={
                          !backup.disponible ||
                          hayAccion
                        }
                        className={cn(
                          "inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-extrabold transition-colors",
                          backup.disponible
                            ? "border-blue-200 bg-blue-50 text-blue-700 hover:border-blue-300 hover:bg-blue-100"
                            : "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400",
                          hayAccion &&
                            "cursor-not-allowed opacity-60",
                        )}
                        aria-label={`Descargar respaldo ${backup.id}`}
                      >
                        {descargando ? (
                          <Loader2
                            size={16}
                            className="animate-spin"
                            aria-hidden="true"
                          />
                        ) : (
                          <Download
                            size={16}
                            aria-hidden="true"
                          />
                        )}

                        {descargando
                          ? "Descargando..."
                          : "Descargar respaldo"}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          void ejecutarAccion(
                            backup.id,
                            "eliminar",
                          );
                        }}
                        disabled={hayAccion}
                        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-extrabold text-red-700 transition-colors hover:border-red-300 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                        aria-label={`Eliminar respaldo ${backup.id}`}
                      >
                        {eliminando ? (
                          <Loader2
                            size={16}
                            className="animate-spin"
                            aria-hidden="true"
                          />
                        ) : (
                          <Trash2
                            size={16}
                            aria-hidden="true"
                          />
                        )}

                        {eliminando
                          ? "Eliminando..."
                          : "Eliminar respaldo"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <footer className="flex min-h-[54px] flex-col gap-3 border-t border-gray-100 bg-gray-50 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-gray-500">
              Total registrado:{" "}
              <span className="font-extrabold text-[#0A3D62]">
                {respaldosSeguros.length}
              </span>{" "}
              {respaldosSeguros.length === 1
                ? "respaldo"
                : "respaldos"}
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-semibold text-gray-500">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />

                {totalExitosos} exitosos
              </span>

              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 shrink-0 rounded-full bg-amber-500" />

                {totalProcesando} procesando
              </span>

              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 shrink-0 rounded-full bg-red-500" />

                {totalFallidos} fallidos
              </span>
            </div>
          </footer>
        </>
      )}
    </section>
  );
}