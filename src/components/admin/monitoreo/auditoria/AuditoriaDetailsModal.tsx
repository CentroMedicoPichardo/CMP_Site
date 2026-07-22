"use client";

import {
  useEffect,
  useId,
  useState,
} from "react";

import {
  Activity,
  CalendarClock,
  CheckCircle2,
  Database,
  FileJson2,
  Globe2,
  Hash,
  MapPin,
  Pencil,
  Plus,
  Server,
  Trash2,
  UserRound,
  X,
  type LucideIcon,
} from "lucide-react";

interface AuditoriaRegistro {
  id: number;
  usuario: string | null;
  ip_address: string | null;
  accion: string | null;
  tabla_afectada: string | null;
  registro_id: number | null;
  datos_anteriores: unknown;
  datos_nuevos: unknown;
  fecha_hora: string | null;
  aplicacion_origen?: string | null;
  session_id?: string | null;
}

interface AuditoriaDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  registro: AuditoriaRegistro | null;
}

interface ConfiguracionAccion {
  etiqueta: string;
  descripcion: string;
  Icono: LucideIcon;
  contenedor: string;
  icono: string;
}

interface EstilosBodyAnteriores {
  overflow: string;
  position: string;
  top: string;
  left: string;
  right: string;
  width: string;
  paddingRight: string;
}

function cn(
  ...clases: Array<
    string | false | null | undefined
  >
): string {
  return clases.filter(Boolean).join(" ");
}

function textoSeguro(
  valor: unknown,
  respaldo = "No disponible",
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
    .trim()
    .toLocaleUpperCase("es-MX");
}

function obtenerFecha(
  fecha: string | null,
): Date | null {
  if (!fecha) {
    return null;
  }

  const valor = new Date(fecha);

  if (Number.isNaN(valor.getTime())) {
    return null;
  }

  return valor;
}

function formatearFecha(
  fecha: string | null,
): string {
  const valor = obtenerFecha(fecha);

  if (!valor) {
    return "Fecha no disponible";
  }

  return valor.toLocaleDateString(
    "es-MX",
    {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    },
  );
}

function formatearHora(
  fecha: string | null,
): string {
  const valor = obtenerFecha(fecha);

  if (!valor) {
    return "Hora no disponible";
  }

  return valor.toLocaleTimeString(
    "es-MX",
    {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    },
  );
}

function obtenerConfiguracionAccion(
  accion: string | null,
): ConfiguracionAccion {
  const valor =
    normalizarTexto(accion);

  if (valor === "INSERT") {
    return {
      etiqueta:
        "Creación de registro",
      descripcion:
        "Se agregó un nuevo registro dentro del sistema.",
      Icono: Plus,
      contenedor:
        "border-emerald-200 bg-emerald-50 text-emerald-800",
      icono:
        "bg-white text-emerald-700",
    };
  }

  if (valor === "UPDATE") {
    return {
      etiqueta:
        "Actualización de registro",
      descripcion:
        "Se modificó la información de un registro existente.",
      Icono: Pencil,
      contenedor:
        "border-blue-200 bg-blue-50 text-blue-800",
      icono:
        "bg-white text-blue-700",
    };
  }

  if (valor === "DELETE") {
    return {
      etiqueta:
        "Eliminación de registro",
      descripcion:
        "Se eliminó un registro del sistema.",
      Icono: Trash2,
      contenedor:
        "border-red-200 bg-red-50 text-red-800",
      icono:
        "bg-white text-red-700",
    };
  }

  return {
    etiqueta: textoSeguro(
      accion,
      "Acción desconocida",
    ),
    descripcion:
      "Se registró una actividad dentro del sistema.",
    Icono: Activity,
    contenedor:
      "border-gray-200 bg-gray-50 text-gray-800",
    icono:
      "bg-white text-gray-700",
  };
}

function tieneDatos(
  datos: unknown,
): boolean {
  if (
    datos === null ||
    datos === undefined
  ) {
    return false;
  }

  if (typeof datos === "string") {
    return datos.trim().length > 0;
  }

  if (typeof datos === "object") {
    return (
      Object.keys(
        datos as Record<
          string,
          unknown
        >,
      ).length > 0
    );
  }

  return true;
}

function formatearJSON(
  datos: unknown,
): string {
  if (!tieneDatos(datos)) {
    return "Sin datos registrados";
  }

  if (typeof datos === "string") {
    const texto = datos.trim();

    try {
      return JSON.stringify(
        JSON.parse(texto),
        null,
        2,
      );
    } catch {
      return texto;
    }
  }

  try {
    return JSON.stringify(
      datos,
      null,
      2,
    );
  } catch {
    return textoSeguro(
      datos,
      "No fue posible mostrar la información",
    );
  }
}

/**
 * Detecta la parte inferior del header
 * global visible en la página.
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
        '[data-auditoria-modal="true"]',
      );

    if (perteneceAlModal) {
      return;
    }

    const estilos =
      window.getComputedStyle(header);

    const esPosicionado =
      estilos.position === "fixed" ||
      estilos.position === "sticky";

    if (!esPosicionado) {
      return;
    }

    const rect =
      header.getBoundingClientRect();

    const esVisible =
      rect.height > 0 &&
      rect.bottom > 0 &&
      rect.top < window.innerHeight;

    if (!esVisible) {
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

function CampoInformacion({
  titulo,
  valor,
  Icono,
  monoespaciado = false,
}: {
  titulo: string;
  valor: string;
  Icono: LucideIcon;
  monoespaciado?: boolean;
}) {
  return (
    <article className="rounded-xl border border-gray-200 bg-[#F8FAFC] p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#0A3D62] shadow-sm">
          <Icono
            size={17}
            strokeWidth={1.9}
            aria-hidden="true"
          />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
            {titulo}
          </p>

          <p
            className={cn(
              "mt-1 whitespace-normal break-words text-sm font-bold leading-6 text-gray-800",
              monoespaciado &&
                "break-all font-mono",
            )}
          >
            {valor}
          </p>
        </div>
      </div>
    </article>
  );
}

function BloqueJSON({
  titulo,
  descripcion,
  datos,
  tipo,
}: {
  titulo: string;
  descripcion: string;
  datos: unknown;
  tipo: "anterior" | "nuevo";
}) {
  const disponible =
    tieneDatos(datos);

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <header className="flex flex-col gap-3 border-b border-gray-100 bg-[#F8FAFC] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
              tipo === "anterior"
                ? "bg-gray-200 text-gray-600"
                : "bg-[#EAF2F8] text-[#0A3D62]",
            )}
          >
            <FileJson2
              size={17}
              aria-hidden="true"
            />
          </span>

          <div className="min-w-0">
            <h3 className="text-sm font-extrabold text-[#0A3D62]">
              {titulo}
            </h3>

            <p className="mt-0.5 text-xs leading-5 text-gray-500">
              {descripcion}
            </p>
          </div>
        </div>

        <span
          className={cn(
            "self-start rounded-full px-2.5 py-1 text-[10px] font-extrabold sm:self-auto",
            disponible
              ? "bg-emerald-50 text-emerald-700"
              : "bg-gray-200 text-gray-500",
          )}
        >
          {disponible
            ? "Información disponible"
            : "Sin información"}
        </span>
      </header>

      <div className="bg-[#07131F] p-4">
        <pre className="max-h-[360px] w-full overflow-auto whitespace-pre-wrap break-words font-mono text-xs leading-6 text-slate-200">
          {formatearJSON(datos)}
        </pre>
      </div>
    </article>
  );
}

export function AuditoriaDetailsModal({
  isOpen,
  onClose,
  registro,
}: AuditoriaDetailsModalProps) {
  const tituloId = useId();
  const descripcionId = useId();

  const [
    desplazamientoSuperior,
    setDesplazamientoSuperior,
  ] = useState(88);

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
      width: document.body.style.width,
      paddingRight:
        document.body.style.paddingRight,
    };

    const overflowHtmlAnterior =
      document.documentElement.style
        .overflow;

    const overscrollHtmlAnterior =
      document.documentElement.style
        .overscrollBehavior;

    const overscrollBodyAnterior =
      document.body.style
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
            const limite =
              obtenerLimiteHeaderGlobal();

            setDesplazamientoSuperior(
              limite,
            );

            animationFrameId = null;
          },
        );
    };

    /*
     * Calcula primero la altura del header,
     * antes de bloquear el documento.
     */
    actualizarPosicion();

    /*
     * Bloquea por completo la página principal
     * y conserva su posición actual.
     */
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
        onClose();
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
        const perteneceAlModal =
          header.closest(
            '[data-auditoria-modal="true"]',
          );

        if (!perteneceAlModal) {
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

      document.body.style.overscrollBehavior =
        overscrollBodyAnterior;

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

      /*
       * Regresa exactamente al punto donde
       * estaba la página antes de abrir.
       */
      window.scrollTo(0, scrollY);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !registro) {
    return null;
  }

  const accion =
    obtenerConfiguracionAccion(
      registro.accion,
    );

  const IconoAccion =
    accion.Icono;

  return (
    <div
      data-auditoria-modal="true"
      className="fixed bottom-0 left-0 right-0 z-[9000] overflow-hidden"
      style={{
        top: `${desplazamientoSuperior}px`,
      }}
    >
      {/*
       * Este fondo permanece inmóvil.
       * No forma parte del contenedor con scroll.
       */}
      <div
        className="absolute inset-0 z-0 bg-[#061C2E]/70 backdrop-blur-sm"
        aria-hidden="true"
      />

      {/*
       * Únicamente esta zona puede desplazarse.
       */}
      <div className="relative z-10 h-full w-full overflow-y-auto overscroll-contain">
        <div
          className="flex min-h-full w-full items-start justify-center px-3 py-4 sm:px-6 sm:py-6"
          onClick={onClose}
          role="presentation"
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby={tituloId}
            aria-describedby={
              descripcionId
            }
            className="relative w-full max-w-5xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <div className="h-1 w-full bg-[#FFC300]" />

            <header className="sticky top-0 z-30 flex items-start justify-between gap-4 border-b border-gray-100 bg-white px-4 py-4 shadow-sm sm:px-6">
              <div className="flex min-w-0 items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0A3D62] text-[#FFC300]">
                  <Database
                    size={21}
                    strokeWidth={1.9}
                    aria-hidden="true"
                  />
                </span>

                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
                    Monitoreo del sistema
                  </p>

                  <h2
                    id={tituloId}
                    className="mt-1 text-lg font-extrabold leading-tight text-[#0A3D62] sm:text-xl"
                  >
                    Detalles de auditoría
                  </h2>

                  <p
                    id={descripcionId}
                    className="mt-1 text-xs leading-5 text-gray-500"
                  >
                    Registro identificado
                    como{" "}
                    <span className="break-all font-mono font-extrabold text-gray-700">
                      #{registro.id}
                    </span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300]"
                aria-label="Cerrar modal"
                title="Cerrar"
              >
                <X
                  size={18}
                  aria-hidden="true"
                />
              </button>
            </header>

            <div className="space-y-5 p-4 sm:p-6">
              <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <CampoInformacion
                  titulo="Usuario"
                  valor={textoSeguro(
                    registro.usuario,
                    "Usuario no identificado",
                  )}
                  Icono={UserRound}
                />

                <CampoInformacion
                  titulo="Dirección IP"
                  valor={textoSeguro(
                    registro.ip_address,
                  )}
                  Icono={MapPin}
                  monoespaciado
                />

                <CampoInformacion
                  titulo="Tabla afectada"
                  valor={textoSeguro(
                    registro.tabla_afectada,
                  )}
                  Icono={Server}
                  monoespaciado
                />

                <CampoInformacion
                  titulo="Registro afectado"
                  valor={
                    registro.registro_id !==
                    null
                      ? `#${registro.registro_id}`
                      : "No disponible"
                  }
                  Icono={Hash}
                  monoespaciado
                />
              </section>

              <section className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                <article className="rounded-2xl border border-gray-200 bg-white p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF9E6] text-[#9A7300]">
                      <CalendarClock
                        size={18}
                        aria-hidden="true"
                      />
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                        Fecha y hora de la
                        actividad
                      </p>

                      <p className="mt-1 whitespace-normal break-words text-sm font-extrabold capitalize leading-6 text-gray-800">
                        {formatearFecha(
                          registro.fecha_hora,
                        )}
                      </p>

                      <p className="mt-0.5 text-xs font-semibold leading-5 text-gray-500">
                        {formatearHora(
                          registro.fecha_hora,
                        )}
                      </p>
                    </div>
                  </div>
                </article>

                <article
                  className={cn(
                    "rounded-2xl border p-4",
                    accion.contenedor,
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm",
                        accion.icono,
                      )}
                    >
                      <IconoAccion
                        size={18}
                        aria-hidden="true"
                      />
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-wide opacity-70">
                        Acción realizada
                      </p>

                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <p className="text-sm font-extrabold leading-6">
                          {accion.etiqueta}
                        </p>

                        <span className="rounded-full border border-current/20 bg-white/70 px-2 py-0.5 font-mono text-[10px] font-extrabold">
                          {textoSeguro(
                            registro.accion,
                            "DESCONOCIDA",
                          )}
                        </span>
                      </div>

                      <p className="mt-1 whitespace-normal break-words text-xs leading-5 opacity-80">
                        {accion.descripcion}
                      </p>
                    </div>
                  </div>
                </article>
              </section>

              {(registro.aplicacion_origen ||
                registro.session_id) && (
                <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {registro.aplicacion_origen && (
                    <CampoInformacion
                      titulo="Aplicación de origen"
                      valor={
                        registro.aplicacion_origen
                      }
                      Icono={Globe2}
                    />
                  )}

                  {registro.session_id && (
                    <CampoInformacion
                      titulo="Identificador de sesión"
                      valor={
                        registro.session_id
                      }
                      Icono={CheckCircle2}
                      monoespaciado
                    />
                  )}
                </section>
              )}

              <section>
                <div className="mb-3">
                  <h3 className="text-sm font-extrabold text-[#0A3D62]">
                    Comparación de cambios
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Información registrada
                    antes y después de ejecutar
                    la operación.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <BloqueJSON
                    titulo="Datos anteriores"
                    descripcion="Estado del registro antes de ejecutar la acción."
                    datos={
                      registro.datos_anteriores
                    }
                    tipo="anterior"
                  />

                  <BloqueJSON
                    titulo="Datos nuevos"
                    descripcion="Estado del registro después de ejecutar la acción."
                    datos={
                      registro.datos_nuevos
                    }
                    tipo="nuevo"
                  />
                </div>
              </section>
            </div>

            <footer className="flex flex-col gap-3 border-t border-gray-100 bg-[#F8FAFC] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p className="text-[11px] leading-5 text-gray-500">
                Este registro forma parte del
                historial de auditoría y
                monitoreo del sistema.
              </p>

              <button
                type="button"
                onClick={onClose}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#0A3D62] px-5 py-2 text-xs font-extrabold text-white transition-colors hover:bg-[#061C2E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300] focus-visible:ring-offset-2"
              >
                <X
                  size={15}
                  aria-hidden="true"
                />

                Cerrar detalles
              </button>
            </footer>
          </section>
        </div>
      </div>
    </div>
  );
}