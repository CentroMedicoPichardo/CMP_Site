"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Check,
  Database,
  DatabaseBackup,
  HardDrive,
  Loader2,
  ShieldCheck,
} from "lucide-react";

type TipoRespaldo =
  | "completo"
  | "parcial";

interface BackupGeneratorProps {
  onGenerate: (
    tipo: TipoRespaldo,
  ) => Promise<void>;
  generating: boolean;
}

interface OpcionRespaldo {
  tipo: TipoRespaldo;
  titulo: string;
  descripcion: string;
  detalle: string;
  Icono: typeof Database;
  clasesIcono: string;
}

const OPCIONES_RESPALDO: OpcionRespaldo[] =
  [
    {
      tipo: "completo",
      titulo: "Respaldo completo",
      descripcion:
        "Incluye todos los esquemas y tablas de la base de datos.",
      detalle:
        "Recomendado para copias semanales y restauraciones completas.",
      Icono: Database,
      clasesIcono:
        "bg-emerald-50 text-emerald-700",
    },
    {
      tipo: "parcial",
      titulo: "Respaldo parcial",
      descripcion:
        "Excluye registros de auditoría, sesiones y tablas de logs.",
      detalle:
        "Recomendado para copias frecuentes con menor tamaño.",
      Icono: HardDrive,
      clasesIcono:
        "bg-amber-50 text-amber-700",
    },
  ];

function cn(
  ...clases: Array<
    string | false | null | undefined
  >
): string {
  return clases.filter(Boolean).join(" ");
}

export function BackupGenerator({
  onGenerate,
  generating,
}: BackupGeneratorProps) {
  const [
    selectedType,
    setSelectedType,
  ] = useState<TipoRespaldo>(
    "completo",
  );

  const opcionSeleccionada =
    OPCIONES_RESPALDO.find(
      (opcion) =>
        opcion.tipo === selectedType,
    ) ?? OPCIONES_RESPALDO[0];

  const handleGenerate = async () => {
    if (generating) {
      return;
    }

    await onGenerate(selectedType);
  };

  return (
    <section className="sticky top-24 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <header className="border-b border-gray-100 bg-[#F8FAFC] px-5 py-4">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0A3D62] text-[#FFC300]">
            <DatabaseBackup
              size={21}
              strokeWidth={1.9}
              aria-hidden="true"
            />
          </span>

          <div className="min-w-0">
            <h2 className="text-base font-extrabold text-[#0A3D62]">
              Generar nuevo respaldo
            </h2>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              Selecciona el contenido que
              deseas incluir en la copia.
            </p>
          </div>
        </div>
      </header>

      <div className="space-y-5 p-5">
        <fieldset
          disabled={generating}
          className="space-y-3"
        >
          <legend className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-500">
            Tipo de respaldo
          </legend>

          {OPCIONES_RESPALDO.map(
            (opcion) => {
              const seleccionado =
                selectedType ===
                opcion.tipo;

              const Icono =
                opcion.Icono;

              return (
                <label
                  key={opcion.tipo}
                  className={cn(
                    "relative block cursor-pointer rounded-2xl border p-4 transition-all",
                    seleccionado
                      ? "border-[#0A3D62] bg-[#F1F6F9] shadow-sm"
                      : "border-gray-200 bg-white hover:border-[#0A3D62]/30 hover:bg-gray-50",
                    generating &&
                      "cursor-not-allowed opacity-60",
                  )}
                >
                  <input
                    type="radio"
                    name="tipoRespaldo"
                    value={opcion.tipo}
                    checked={seleccionado}
                    onChange={() =>
                      setSelectedType(
                        opcion.tipo,
                      )
                    }
                    className="sr-only"
                  />

                  <div className="flex items-start gap-3">
                    <span
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                        opcion.clasesIcono,
                      )}
                    >
                      <Icono
                        size={19}
                        strokeWidth={1.9}
                        aria-hidden="true"
                      />
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-sm font-extrabold text-gray-800">
                          {opcion.titulo}
                        </h3>

                        <span
                          className={cn(
                            "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                            seleccionado
                              ? "border-[#0A3D62] bg-[#0A3D62] text-white"
                              : "border-gray-300 bg-white text-transparent",
                          )}
                          aria-hidden="true"
                        >
                          <Check
                            size={12}
                            strokeWidth={3}
                          />
                        </span>
                      </div>

                      <p className="mt-1 text-xs leading-5 text-gray-600">
                        {opcion.descripcion}
                      </p>

                      <p className="mt-2 text-[11px] leading-4 text-gray-400">
                        {opcion.detalle}
                      </p>
                    </div>
                  </div>
                </label>
              );
            },
          )}
        </fieldset>

        <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
          <div className="flex items-start gap-3">
            <ShieldCheck
              size={18}
              className="mt-0.5 shrink-0 text-blue-700"
              aria-hidden="true"
            />

            <div className="min-w-0">
              <p className="text-sm font-bold text-blue-900">
                Recomendaciones de seguridad
              </p>

              <div className="mt-2 space-y-1.5 text-xs leading-5 text-blue-800">
                <p>
                  Realiza al menos un respaldo
                  completo cada semana.
                </p>

                <p>
                  Conserva una copia fuera del
                  servidor principal.
                </p>

                <p>
                  Verifica periódicamente que
                  los archivos puedan
                  restaurarse.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3">
          <div className="flex items-start gap-2.5">
            <AlertTriangle
              size={16}
              className="mt-0.5 shrink-0 text-amber-700"
              aria-hidden="true"
            />

            <p className="text-xs leading-5 text-amber-800">
              El tamaño y el tiempo de
              generación dependen del volumen
              actual de información almacenada.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
            Selección actual
          </p>

          <div className="mt-2 flex items-center gap-2">
            <span
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                opcionSeleccionada.clasesIcono,
              )}
            >
              <opcionSeleccionada.Icono
                size={15}
                aria-hidden="true"
              />
            </span>

            <div>
              <p className="text-sm font-bold text-gray-800">
                {
                  opcionSeleccionada.titulo
                }
              </p>

              <p className="text-[11px] text-gray-500">
                La copia se guardará en el
                historial de respaldos.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            void handleGenerate();
          }}
          disabled={generating}
          className={cn(
            "flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-extrabold transition-all",
            "bg-[#FFC300] text-[#0A3D62] shadow-sm",
            "hover:bg-[#0A3D62] hover:text-white",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300] focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500 disabled:shadow-none",
          )}
        >
          {generating ? (
            <>
              <Loader2
                size={19}
                className="animate-spin"
                aria-hidden="true"
              />

              <span aria-live="polite">
                Generando respaldo...
              </span>
            </>
          ) : (
            <>
              <DatabaseBackup
                size={19}
                aria-hidden="true"
              />

              Generar{" "}
              {selectedType === "completo"
                ? "respaldo completo"
                : "respaldo parcial"}
            </>
          )}
        </button>

        <p className="text-center text-[10px] leading-4 text-gray-400">
          No cierres esta página mientras
          se está generando el archivo.
        </p>
      </div>
    </section>
  );
}