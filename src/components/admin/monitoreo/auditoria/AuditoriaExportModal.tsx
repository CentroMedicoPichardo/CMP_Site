"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import {
  CalendarDays,
  Check,
  CircleAlert,
  Database,
  Download,
  FileSpreadsheet,
  Filter,
  Loader2,
  Table2,
  X,
} from "lucide-react";

interface FiltrosAuditoria {
  usuario: string;
  tabla: string;
  accion: string;
  fechaInicio: string;
  fechaFin: string;
}

interface CampoDisponible {
  id: string;
  label: string;
}

interface ConfiguracionExportacion {
  fields: string[];
  tabla?: string;
  accion?: string;
  fechaInicio?: string;
  fechaFin?: string;
}

interface AuditoriaExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (
    config: ConfiguracionExportacion,
  ) => Promise<void> | void;
  currentFilters: FiltrosAuditoria;
  availableFields: CampoDisponible[];
}

interface EstilosBodyAnteriores {
  overflow: string;
  position: string;
  top: string;
  left: string;
  right: string;
  width: string;
  paddingRight: string;
  overscrollBehavior: string;
}

const ACCIONES = [
  "INSERT",
  "UPDATE",
  "DELETE",
];

const TABLAS = [
  {
    value: "clinica.medicos",
    label: "Médicos",
  },
  {
    value: "clinica.nosotros",
    label: "Nosotros",
  },
  {
    value: "clinica.servicios",
    label: "Servicios",
  },
  {
    value: "seguridad.usuarios",
    label: "Usuarios",
  },
  {
    value: "academia.cursos",
    label: "Cursos",
  },
];

function cn(
  ...clases: Array<
    string | false | null | undefined
  >
): string {
  return clases.filter(Boolean).join(" ");
}

/**
 * Detecta la parte inferior del header global
 * visible y posicionado como sticky o fixed.
 *
 * Los headers internos del modal son ignorados.
 */
function obtenerLimiteHeaderGlobal(): number {
  if (
    typeof window === "undefined" ||
    typeof document === "undefined"
  ) {
    return 0;
  }

  const headers =
    document.querySelectorAll<HTMLElement>(
      "header",
    );

  let limiteInferior = 0;

  headers.forEach((header) => {
    const perteneceAlModal =
      header.closest(
        '[data-auditoria-export-modal="true"]',
      );

    if (perteneceAlModal) {
      return;
    }

    const estilos =
      window.getComputedStyle(header);

    const estaPosicionado =
      estilos.position === "fixed" ||
      estilos.position === "sticky";

    if (!estaPosicionado) {
      return;
    }

    const rect =
      header.getBoundingClientRect();

    const estaVisible =
      rect.height > 0 &&
      rect.bottom > 0 &&
      rect.top < window.innerHeight;

    if (!estaVisible) {
      return;
    }

    limiteInferior = Math.max(
      limiteInferior,
      rect.bottom,
    );
  });

  return Math.max(
    0,
    Math.round(limiteInferior),
  );
}

function obtenerEtiquetaTabla(
  valor: string,
): string {
  const tabla = TABLAS.find(
    (item) => item.value === valor,
  );

  return tabla?.label || valor;
}

export function AuditoriaExportModal({
  isOpen,
  onClose,
  onExport,
  currentFilters,
  availableFields,
}: AuditoriaExportModalProps) {
  const tituloId = useId();
  const descripcionId = useId();
  const filtrosPersonalizadosId = useId();

  const onCloseRef = useRef(onClose);

  const [
    desplazamientoSuperior,
    setDesplazamientoSuperior,
  ] = useState(88);

  const [
    selectedFields,
    setSelectedFields,
  ] = useState<string[]>(
    availableFields.map(
      (field) => field.id,
    ),
  );

  const [
    useCustomFilters,
    setUseCustomFilters,
  ] = useState(false);

  const [
    customTabla,
    setCustomTabla,
  ] = useState(
    currentFilters.tabla || "",
  );

  const [
    customAccion,
    setCustomAccion,
  ] = useState(
    currentFilters.accion || "",
  );

  const [
    customFechaInicio,
    setCustomFechaInicio,
  ] = useState(
    currentFilters.fechaInicio || "",
  );

  const [
    customFechaFin,
    setCustomFechaFin,
  ] = useState(
    currentFilters.fechaFin || "",
  );

  const [exportando, setExportando] =
    useState(false);

  const [
    errorExportacion,
    setErrorExportacion,
  ] = useState<string | null>(null);

  const firmaCampos = availableFields
    .map((field) => field.id)
    .join("|");

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  /*
   * Reinicia el formulario cada vez que
   * vuelve a abrirse el modal.
   */
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setSelectedFields(
      availableFields.map(
        (field) => field.id,
      ),
    );

    setUseCustomFilters(false);
    setCustomTabla(
      currentFilters.tabla || "",
    );
    setCustomAccion(
      currentFilters.accion || "",
    );
    setCustomFechaInicio(
      currentFilters.fechaInicio || "",
    );
    setCustomFechaFin(
      currentFilters.fechaFin || "",
    );

    setExportando(false);
    setErrorExportacion(null);
  }, [
    isOpen,
    firmaCampos,
    currentFilters.tabla,
    currentFilters.accion,
    currentFilters.fechaInicio,
    currentFilters.fechaFin,
  ]);

  /*
   * Bloquea la página principal y calcula
   * la posición del modal debajo del header.
   */
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const scrollY = window.scrollY;

    const estilosBodyAnteriores:
      EstilosBodyAnteriores = {
      overflow:
        document.body.style.overflow,
      position:
        document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      right:
        document.body.style.right,
      width:
        document.body.style.width,
      paddingRight:
        document.body.style.paddingRight,
      overscrollBehavior:
        document.body.style
          .overscrollBehavior,
    };

    const overflowHtmlAnterior =
      document.documentElement.style
        .overflow;

    const overscrollHtmlAnterior =
      document.documentElement.style
        .overscrollBehavior;

    const anchoScrollbar =
      window.innerWidth -
      document.documentElement
        .clientWidth;

    let animationFrameId:
      | number
      | null = null;

    const actualizarPosicion = () => {
      if (
        animationFrameId !== null
      ) {
        window.cancelAnimationFrame(
          animationFrameId,
        );
      }

      animationFrameId =
        window.requestAnimationFrame(
          () => {
            setDesplazamientoSuperior(
              obtenerLimiteHeaderGlobal(),
            );

            animationFrameId = null;
          },
        );
    };

    /*
     * Se calcula antes de fijar el body
     * para conservar la posición real
     * del header.
     */
    actualizarPosicion();

    document.documentElement.style.overflow =
      "hidden";

    document.documentElement.style.overscrollBehavior =
      "none";

    document.body.style.overflow =
      "hidden";

    document.body.style.overscrollBehavior =
      "none";

    document.body.style.position =
      "fixed";

    document.body.style.top =
      `-${scrollY}px`;

    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";

    if (anchoScrollbar > 0) {
      document.body.style.paddingRight =
        `${anchoScrollbar}px`;
    }

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        onCloseRef.current();
      }
    };

    const resizeObserver =
      typeof ResizeObserver !==
      "undefined"
        ? new ResizeObserver(
            actualizarPosicion,
          )
        : null;

    const headersGlobales =
      document.querySelectorAll<HTMLElement>(
        "header",
      );

    headersGlobales.forEach(
      (header) => {
        if (
          !header.closest(
            '[data-auditoria-export-modal="true"]',
          )
        ) {
          resizeObserver?.observe(
            header,
          );
        }
      },
    );

    window.addEventListener(
      "resize",
      actualizarPosicion,
    );

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      if (
        animationFrameId !== null
      ) {
        window.cancelAnimationFrame(
          animationFrameId,
        );
      }

      resizeObserver?.disconnect();

      window.removeEventListener(
        "resize",
        actualizarPosicion,
      );

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );

      document.documentElement.style.overflow =
        overflowHtmlAnterior;

      document.documentElement.style.overscrollBehavior =
        overscrollHtmlAnterior;

      document.body.style.overflow =
        estilosBodyAnteriores.overflow;

      document.body.style.position =
        estilosBodyAnteriores.position;

      document.body.style.top =
        estilosBodyAnteriores.top;

      document.body.style.left =
        estilosBodyAnteriores.left;

      document.body.style.right =
        estilosBodyAnteriores.right;

      document.body.style.width =
        estilosBodyAnteriores.width;

      document.body.style.paddingRight =
        estilosBodyAnteriores.paddingRight;

      document.body.style.overscrollBehavior =
        estilosBodyAnteriores.overscrollBehavior;

      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const camposSeleccionados =
    new Set(selectedFields);

  const todosSeleccionados =
    availableFields.length > 0 &&
    selectedFields.length ===
      availableFields.length;

  const tablaEfectiva =
    useCustomFilters
      ? customTabla
      : currentFilters.tabla;

  const accionEfectiva =
    useCustomFilters
      ? customAccion
      : currentFilters.accion;

  const fechaInicioEfectiva =
    useCustomFilters
      ? customFechaInicio
      : currentFilters.fechaInicio;

  const fechaFinEfectiva =
    useCustomFilters
      ? customFechaFin
      : currentFilters.fechaFin;

  const rangoFechasInvalido =
    Boolean(
      fechaInicioEfectiva &&
        fechaFinEfectiva &&
        fechaInicioEfectiva >
          fechaFinEfectiva,
    );

  const hayFiltrosAplicados =
    Boolean(
      tablaEfectiva ||
        accionEfectiva ||
        fechaInicioEfectiva ||
        fechaFinEfectiva,
    );

  const puedeExportar =
    selectedFields.length > 0 &&
    !rangoFechasInvalido &&
    !exportando;

  const toggleField = (
    fieldId: string,
  ) => {
    setErrorExportacion(null);

    setSelectedFields(
      (camposActuales) => {
        if (
          camposActuales.includes(
            fieldId,
          )
        ) {
          return camposActuales.filter(
            (id) => id !== fieldId,
          );
        }

        return [
          ...camposActuales,
          fieldId,
        ];
      },
    );
  };

  const seleccionarTodos = () => {
    setErrorExportacion(null);

    setSelectedFields(
      availableFields.map(
        (field) => field.id,
      ),
    );
  };

  const limpiarSeleccion = () => {
    setErrorExportacion(null);
    setSelectedFields([]);
  };

  const handleExport = async () => {
    if (
      selectedFields.length === 0
    ) {
      setErrorExportacion(
        "Selecciona al menos un campo para realizar la exportación.",
      );

      return;
    }

    if (rangoFechasInvalido) {
      setErrorExportacion(
        "La fecha de inicio no puede ser posterior a la fecha final.",
      );

      return;
    }

    setExportando(true);
    setErrorExportacion(null);

    try {
      await Promise.resolve(
        onExport({
          fields: selectedFields,
          tabla:
            tablaEfectiva || undefined,
          accion:
            accionEfectiva || undefined,
          fechaInicio:
            fechaInicioEfectiva ||
            undefined,
          fechaFin:
            fechaFinEfectiva ||
            undefined,
        }),
      );

      onClose();
    } catch (
      errorDesconocido: unknown
    ) {
      console.error(
        "Error exportando auditoría:",
        errorDesconocido,
      );

      setErrorExportacion(
        errorDesconocido instanceof Error
          ? errorDesconocido.message
          : "No fue posible exportar la auditoría.",
      );
    } finally {
      setExportando(false);
    }
  };

  return (
    <div
      data-auditoria-export-modal="true"
      className="fixed bottom-0 left-0 right-0 z-[9000] overflow-hidden"
      style={{
        top: `${desplazamientoSuperior}px`,
      }}
    >
      {/*
       * El overlay no se desplaza junto con
       * el contenido del modal.
       */}
      <button
        type="button"
        onClick={onClose}
        disabled={exportando}
        className="absolute inset-0 z-0 h-full w-full cursor-default bg-[#061C2E]/70 backdrop-blur-sm disabled:cursor-wait"
        aria-label="Cerrar ventana de exportación"
      />

      <div className="relative z-10 flex h-full w-full items-center justify-center p-3 sm:p-5">
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby={tituloId}
          aria-describedby={
            descripcionId
          }
          className="relative flex max-h-full w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <div className="h-1 w-full shrink-0 bg-[#FFC300]" />

          {/* Encabezado fijo del modal */}
          <header className="flex shrink-0 items-start justify-between gap-4 border-b border-gray-100 bg-white px-4 py-4 sm:px-6">
            <div className="flex min-w-0 items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0A3D62] text-[#FFC300]">
                <FileSpreadsheet
                  size={21}
                  strokeWidth={1.9}
                  aria-hidden="true"
                />
              </span>

              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
                  Auditoría del sistema
                </p>

                <h2
                  id={tituloId}
                  className="mt-1 text-lg font-extrabold leading-tight text-[#0A3D62] sm:text-xl"
                >
                  Exportar auditoría
                </h2>

                <p
                  id={descripcionId}
                  className="mt-1 text-xs leading-5 text-gray-500"
                >
                  Selecciona la información y los
                  filtros que deseas incluir en el
                  archivo CSV.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={exportando}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Cerrar modal"
              title="Cerrar"
            >
              <X
                size={18}
                aria-hidden="true"
              />
            </button>
          </header>

          {/* Única sección desplazable */}
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <div className="space-y-5 p-4 sm:p-6">
              {errorExportacion && (
                <div
                  role="alert"
                  aria-live="polite"
                  className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700"
                >
                  <CircleAlert
                    size={17}
                    className="mt-0.5 shrink-0"
                    aria-hidden="true"
                  />

                  <p className="min-w-0 flex-1 break-words text-xs leading-5">
                    {errorExportacion}
                  </p>
                </div>
              )}

              {/* Campos */}
              <section className="rounded-2xl border border-gray-200 bg-white">
                <header className="flex flex-col gap-3 border-b border-gray-100 bg-[#F8FAFC] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EAF2F8] text-[#0A3D62]">
                      <Table2
                        size={17}
                        aria-hidden="true"
                      />
                    </span>

                    <div className="min-w-0">
                      <h3 className="text-sm font-extrabold text-[#0A3D62]">
                        Campos a exportar
                      </h3>

                      <p className="mt-0.5 text-xs leading-5 text-gray-500">
                        Elige las columnas que
                        aparecerán en el archivo.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={seleccionarTodos}
                      disabled={
                        todosSeleccionados ||
                        exportando
                      }
                      className="rounded-lg px-2.5 py-1.5 text-[11px] font-extrabold text-[#0A3D62] transition-colors hover:bg-[#EAF2F8] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Seleccionar todos
                    </button>

                    <button
                      type="button"
                      onClick={limpiarSeleccion}
                      disabled={
                        selectedFields.length ===
                          0 || exportando
                      }
                      className="rounded-lg px-2.5 py-1.5 text-[11px] font-extrabold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Limpiar
                    </button>
                  </div>
                </header>

                <div className="grid grid-cols-1 gap-2 p-4 sm:grid-cols-2">
                  {availableFields.map(
                    (field) => {
                      const seleccionado =
                        camposSeleccionados.has(
                          field.id,
                        );

                      return (
                        <label
                          key={field.id}
                          className={cn(
                            "flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors",
                            seleccionado
                              ? "border-[#0A3D62]/25 bg-[#F2F7FA]"
                              : "border-gray-200 bg-white hover:bg-gray-50",
                            exportando &&
                              "cursor-not-allowed opacity-60",
                          )}
                        >
                          <input
                            type="checkbox"
                            checked={
                              seleccionado
                            }
                            onChange={() => {
                              toggleField(
                                field.id,
                              );
                            }}
                            disabled={
                              exportando
                            }
                            className="peer sr-only"
                          />

                          <span
                            className={cn(
                              "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                              seleccionado
                                ? "border-[#0A3D62] bg-[#0A3D62] text-white"
                                : "border-gray-300 bg-white text-transparent",
                            )}
                          >
                            <Check
                              size={13}
                              strokeWidth={3}
                              aria-hidden="true"
                            />
                          </span>

                          <span
                            className={cn(
                              "min-w-0 break-words text-sm leading-5",
                              seleccionado
                                ? "font-bold text-gray-800"
                                : "font-medium text-gray-600",
                            )}
                          >
                            {field.label}
                          </span>
                        </label>
                      );
                    },
                  )}
                </div>
              </section>

              {/* Filtros */}
              <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                <div className="border-b border-gray-100 bg-[#F8FAFC] px-4 py-3">
                  <label
                    htmlFor={
                      filtrosPersonalizadosId
                    }
                    className="flex cursor-pointer items-start gap-3"
                  >
                    <input
                      id={
                        filtrosPersonalizadosId
                      }
                      type="checkbox"
                      checked={
                        useCustomFilters
                      }
                      onChange={(event) => {
                        setUseCustomFilters(
                          event.target.checked,
                        );

                        setErrorExportacion(
                          null,
                        );
                      }}
                      disabled={exportando}
                      className="peer sr-only"
                    />

                    <span
                      className={cn(
                        "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                        useCustomFilters
                          ? "border-[#0A3D62] bg-[#0A3D62] text-white"
                          : "border-gray-300 bg-white text-transparent",
                      )}
                    >
                      <Check
                        size={13}
                        strokeWidth={3}
                        aria-hidden="true"
                      />
                    </span>

                    <span className="flex min-w-0 items-start gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFF9E6] text-[#987000]">
                        <Filter
                          size={17}
                          aria-hidden="true"
                        />
                      </span>

                      <span className="min-w-0">
                        <span className="block text-sm font-extrabold text-[#0A3D62]">
                          Usar filtros personalizados
                        </span>

                        <span className="mt-0.5 block text-xs leading-5 text-gray-500">
                          Define filtros distintos
                          a los aplicados actualmente
                          en el historial.
                        </span>
                      </span>
                    </span>
                  </label>
                </div>

                {useCustomFilters ? (
                  <div className="space-y-4 p-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="export-tabla"
                          className="mb-2 block text-xs font-extrabold text-[#0A3D62]"
                        >
                          Tabla
                        </label>

                        <select
                          id="export-tabla"
                          value={customTabla}
                          onChange={(event) => {
                            setCustomTabla(
                              event.target.value,
                            );

                            setErrorExportacion(
                              null,
                            );
                          }}
                          disabled={exportando}
                          className="min-h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm font-medium text-gray-800 outline-none transition focus:border-[#FFC300] focus:ring-2 focus:ring-[#FFC300]/25 disabled:cursor-not-allowed disabled:bg-gray-100"
                        >
                          <option value="">
                            Todas las tablas
                          </option>

                          {TABLAS.map(
                            (tabla) => (
                              <option
                                key={
                                  tabla.value
                                }
                                value={
                                  tabla.value
                                }
                              >
                                {tabla.label}
                              </option>
                            ),
                          )}
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="export-accion"
                          className="mb-2 block text-xs font-extrabold text-[#0A3D62]"
                        >
                          Acción
                        </label>

                        <select
                          id="export-accion"
                          value={
                            customAccion
                          }
                          onChange={(event) => {
                            setCustomAccion(
                              event.target.value,
                            );

                            setErrorExportacion(
                              null,
                            );
                          }}
                          disabled={exportando}
                          className="min-h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm font-medium text-gray-800 outline-none transition focus:border-[#FFC300] focus:ring-2 focus:ring-[#FFC300]/25 disabled:cursor-not-allowed disabled:bg-gray-100"
                        >
                          <option value="">
                            Todas las acciones
                          </option>

                          {ACCIONES.map(
                            (accion) => (
                              <option
                                key={accion}
                                value={accion}
                              >
                                {accion}
                              </option>
                            ),
                          )}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="export-fecha-inicio"
                          className="mb-2 block text-xs font-extrabold text-[#0A3D62]"
                        >
                          Fecha de inicio
                        </label>

                        <div className="relative">
                          <CalendarDays
                            size={16}
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#0A3D62]"
                            aria-hidden="true"
                          />

                          <input
                            id="export-fecha-inicio"
                            type="date"
                            value={
                              customFechaInicio
                            }
                            onChange={(
                              event,
                            ) => {
                              setCustomFechaInicio(
                                event.target.value,
                              );

                              setErrorExportacion(
                                null,
                              );
                            }}
                            disabled={
                              exportando
                            }
                            className="min-h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-3 text-sm font-medium text-gray-800 outline-none transition focus:border-[#FFC300] focus:ring-2 focus:ring-[#FFC300]/25 disabled:cursor-not-allowed disabled:bg-gray-100"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="export-fecha-fin"
                          className="mb-2 block text-xs font-extrabold text-[#0A3D62]"
                        >
                          Fecha final
                        </label>

                        <div className="relative">
                          <CalendarDays
                            size={16}
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#0A3D62]"
                            aria-hidden="true"
                          />

                          <input
                            id="export-fecha-fin"
                            type="date"
                            value={
                              customFechaFin
                            }
                            onChange={(
                              event,
                            ) => {
                              setCustomFechaFin(
                                event.target.value,
                              );

                              setErrorExportacion(
                                null,
                              );
                            }}
                            disabled={
                              exportando
                            }
                            className={cn(
                              "min-h-11 w-full rounded-xl border bg-white pl-10 pr-3 text-sm font-medium text-gray-800 outline-none transition focus:ring-2 disabled:cursor-not-allowed disabled:bg-gray-100",
                              rangoFechasInvalido
                                ? "border-red-300 focus:border-red-400 focus:ring-red-200"
                                : "border-gray-200 focus:border-[#FFC300] focus:ring-[#FFC300]/25",
                            )}
                          />
                        </div>
                      </div>
                    </div>

                    {rangoFechasInvalido && (
                      <p className="flex items-start gap-2 text-xs font-semibold leading-5 text-red-600">
                        <CircleAlert
                          size={14}
                          className="mt-0.5 shrink-0"
                          aria-hidden="true"
                        />

                        La fecha de inicio no puede
                        ser posterior a la fecha
                        final.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="p-4">
                    <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                      <p className="text-xs font-extrabold text-[#0A3D62]">
                        Filtros actuales
                      </p>

                      {hayFiltrosAplicados ? (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {tablaEfectiva && (
                            <span className="rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[10px] font-bold text-gray-600">
                              Tabla:{" "}
                              {obtenerEtiquetaTabla(
                                tablaEfectiva,
                              )}
                            </span>
                          )}

                          {accionEfectiva && (
                            <span className="rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[10px] font-bold text-gray-600">
                              Acción:{" "}
                              {accionEfectiva}
                            </span>
                          )}

                          {fechaInicioEfectiva && (
                            <span className="rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[10px] font-bold text-gray-600">
                              Desde:{" "}
                              {fechaInicioEfectiva}
                            </span>
                          )}

                          {fechaFinEfectiva && (
                            <span className="rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[10px] font-bold text-gray-600">
                              Hasta:{" "}
                              {fechaFinEfectiva}
                            </span>
                          )}
                        </div>
                      ) : (
                        <p className="mt-1 text-xs leading-5 text-gray-500">
                          No hay filtros aplicados.
                          Se incluirán todos los
                          registros disponibles.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </section>

              {/* Resumen */}
              <section className="rounded-2xl border border-[#FFC300]/35 bg-[#FFF9E6] p-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#0A3D62] shadow-sm">
                    <Database
                      size={18}
                      aria-hidden="true"
                    />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-extrabold text-[#0A3D62]">
                      Resumen de exportación
                    </p>

                    <p className="mt-1 text-xs leading-5 text-gray-600">
                      Se exportarán{" "}
                      <span className="font-extrabold text-[#0A3D62]">
                        {selectedFields.length}
                      </span>{" "}
                      {selectedFields.length ===
                      1
                        ? "campo"
                        : "campos"}{" "}
                      en formato CSV.
                    </p>

                    {selectedFields.length >
                      0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {selectedFields.map(
                          (id) => {
                            const field =
                              availableFields.find(
                                (
                                  availableField,
                                ) =>
                                  availableField.id ===
                                  id,
                              );

                            return (
                              <span
                                key={id}
                                className="rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[10px] font-bold text-gray-600"
                              >
                                {field?.label ||
                                  id}
                              </span>
                            );
                          },
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Pie fijo del modal */}
          <footer className="flex shrink-0 flex-col-reverse gap-2 border-t border-gray-100 bg-[#F8FAFC] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-[11px] leading-5 text-gray-500">
              El archivo será generado en formato
              CSV con los campos seleccionados.
            </p>

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={onClose}
                disabled={exportando}
                className="inline-flex min-h-10 items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-extrabold text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={() => {
                  void handleExport();
                }}
                disabled={!puedeExportar}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#FFC300] px-5 py-2 text-xs font-extrabold text-[#0A3D62] transition-colors hover:bg-[#EAB308] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
              >
                {exportando ? (
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

                {exportando
                  ? "Exportando..."
                  : "Exportar CSV"}
              </button>
            </div>
          </footer>
        </section>
      </div>
    </div>
  );
}