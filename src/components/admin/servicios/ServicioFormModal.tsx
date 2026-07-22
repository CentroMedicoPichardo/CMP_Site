"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import {
  CircleAlert,
  FileText,
  ImageIcon,
  Loader2,
  MapPin,
  Save,
  Sparkles,
  X,
} from "lucide-react";

import { CloudinaryUploader } from "@/components/admin/cloudinary/CloudinaryUploader";

import type {
  Servicio,
  ServicioFormData,
} from "@/types/servicios";

interface ServicioFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    servicioData: Partial<Servicio>,
  ) => Promise<void>;
  servicio: Servicio | null;
}

type ErroresFormulario = Partial<
  Record<keyof ServicioFormData, string>
>;

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

const FORM_DATA_INICIAL: ServicioFormData = {
  tituloServicio: "",
  descripcion: "",
  ubicacion: "Centro Médico Pichardo",
  urlImage: "",
  textoAlt: "",
  disenoTipo: "vertical",
  activo: true,
};

function cn(
  ...clases: Array<
    string | false | null | undefined
  >
): string {
  return clases.filter(Boolean).join(" ");
}

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
    if (
      header.closest(
        '[data-servicio-form-modal="true"]',
      )
    ) {
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

function MensajeError({
  mensaje,
}: {
  mensaje?: string;
}) {
  if (!mensaje) {
    return null;
  }

  return (
    <p
      role="alert"
      className="mt-1.5 flex items-start gap-1.5 text-xs font-semibold leading-5 text-red-600"
    >
      <CircleAlert
        size={13}
        className="mt-0.5 shrink-0"
        aria-hidden="true"
      />

      <span className="break-words">
        {mensaje}
      </span>
    </p>
  );
}

export function ServicioFormModal({
  isOpen,
  onClose,
  onSave,
  servicio,
}: ServicioFormModalProps) {
  const tituloId = useId();
  const descripcionId = useId();

  const primerCampoRef =
    useRef<HTMLInputElement>(null);

  const onCloseRef = useRef(onClose);
  const savingRef = useRef(false);

  const [
    desplazamientoSuperior,
    setDesplazamientoSuperior,
  ] = useState(88);

  const [formData, setFormData] =
    useState<ServicioFormData>({
      ...FORM_DATA_INICIAL,
    });

  const [saving, setSaving] =
    useState(false);

  const [errors, setErrors] =
    useState<ErroresFormulario>({});

  const [
    errorGeneral,
    setErrorGeneral,
  ] = useState<string | null>(null);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    savingRef.current = saving;
  }, [saving]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (servicio) {
      setFormData({
        idServicio: servicio.idServicio,
        tituloServicio:
          servicio.tituloServicio ?? "",
        descripcion:
          servicio.descripcion ?? "",
        ubicacion:
          servicio.ubicacion ||
          "Centro Médico Pichardo",
        urlImage:
          servicio.urlImage ?? "",
        textoAlt:
          servicio.textoAlt ||
          servicio.tituloServicio ||
          "",
        disenoTipo:
          servicio.disenoTipo ||
          "vertical",
        activo:
          servicio.activo ?? true,
      });
    } else {
      setFormData({
        ...FORM_DATA_INICIAL,
      });
    }

    setSaving(false);
    setErrors({});
    setErrorGeneral(null);

    const temporizador =
      window.setTimeout(() => {
        primerCampoRef.current?.focus();
      }, 150);

    return () => {
      window.clearTimeout(temporizador);
    };
  }, [isOpen, servicio]);

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
      document.documentElement.clientWidth;

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

    setDesplazamientoSuperior(
      obtenerLimiteHeaderGlobal(),
    );

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
      if (
        event.key === "Escape" &&
        !savingRef.current
      ) {
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
            '[data-servicio-form-modal="true"]',
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

  const validarFormulario = (): boolean => {
    const nuevosErrores:
      ErroresFormulario = {};

    if (
      !formData.tituloServicio.trim()
    ) {
      nuevosErrores.tituloServicio =
        "El título del servicio es obligatorio.";
    }

    setErrors(nuevosErrores);

    return (
      Object.keys(nuevosErrores).length ===
      0
    );
  };

  const handleChange = (
    event: ChangeEvent<
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement
    >,
  ) => {
    const { name, value } =
      event.target;

    const campo =
      name as keyof ServicioFormData;

    setFormData((datosActuales) => {
      if (campo === "tituloServicio") {
        return {
          ...datosActuales,
          tituloServicio: value,
          textoAlt: value,
        };
      }

      return {
        ...datosActuales,
        [campo]: value,
      };
    });

    setErrorGeneral(null);

    if (errors[campo]) {
      setErrors(
        (erroresActuales) => ({
          ...erroresActuales,
          [campo]: undefined,
        }),
      );
    }
  };

  const handleImageUpload = (
    asset: {
      url: string;
      publicId: string;
    },
  ) => {
    setFormData(
      (datosActuales) => ({
        ...datosActuales,
        urlImage: asset.url,
        textoAlt:
          datosActuales.tituloServicio ||
          datosActuales.textoAlt,
      }),
    );

    setErrorGeneral(null);
  };

  const eliminarImagen = () => {
    setFormData(
      (datosActuales) => ({
        ...datosActuales,
        urlImage: "",
      }),
    );
  };

  const cambiarEstado = () => {
    setFormData(
      (datosActuales) => ({
        ...datosActuales,
        activo: !datosActuales.activo,
      }),
    );
  };

  const handleClose = () => {
    if (saving) {
      return;
    }

    onClose();
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    setSaving(true);
    setErrorGeneral(null);

    try {
      await onSave({
        ...formData,
        tituloServicio:
          formData.tituloServicio.trim(),
        descripcion:
          formData.descripcion.trim(),
        ubicacion:
          formData.ubicacion.trim(),
        urlImage:
          formData.urlImage.trim(),
        textoAlt:
          formData.textoAlt.trim() ||
          formData.tituloServicio.trim(),
      });

      onClose();
    } catch (error: unknown) {
      console.error(
        "Error al guardar servicio:",
        error,
      );

      setErrorGeneral(
        error instanceof Error
          ? error.message
          : "No fue posible guardar la información del servicio.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  const esEdicion =
    Boolean(servicio);

  const claseCampoBase =
    "min-h-11 w-full rounded-xl border bg-white px-3 text-sm font-medium text-gray-800 outline-none transition placeholder:text-gray-400 focus:ring-4 disabled:cursor-not-allowed disabled:bg-gray-100";

  const claseCampoNormal =
    "border-gray-200 focus:border-[#FFC300] focus:ring-[#FFC300]/15";

  const claseCampoError =
    "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100";

  return (
    <div
      data-servicio-form-modal="true"
      className="fixed bottom-0 left-0 right-0 z-[9000] overflow-hidden"
      style={{
        top: `${desplazamientoSuperior}px`,
      }}
    >
      <button
        type="button"
        onClick={handleClose}
        disabled={saving}
        className="absolute inset-0 z-0 h-full w-full cursor-default bg-[#061C2E]/70 backdrop-blur-sm disabled:cursor-wait"
        aria-label="Cerrar formulario de servicio"
      />

      <div className="relative z-10 flex h-full w-full items-center justify-center p-3 sm:p-5">
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby={tituloId}
          aria-describedby={descripcionId}
          className="relative flex max-h-full w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <div className="h-1 w-full shrink-0 bg-[#FFC300]" />

          <header className="flex shrink-0 items-start justify-between gap-4 border-b border-gray-100 bg-white px-4 py-4 sm:px-6">
            <div className="flex min-w-0 items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0A3D62] text-[#FFC300]">
                <Sparkles
                  size={21}
                  strokeWidth={1.9}
                  aria-hidden="true"
                />
              </span>

              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
                  Gestión de servicios
                </p>

                <h2
                  id={tituloId}
                  className="mt-1 text-lg font-extrabold leading-tight text-[#0A3D62] sm:text-xl"
                >
                  {esEdicion
                    ? "Editar servicio"
                    : "Registrar servicio"}
                </h2>

                <p
                  id={descripcionId}
                  className="mt-1 text-xs leading-5 text-gray-500"
                >
                  {esEdicion
                    ? "Actualiza la información y presentación del servicio."
                    : "Captura la información del nuevo servicio médico."}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              disabled={saving}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300] disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Cerrar modal"
              title="Cerrar"
            >
              <X
                size={18}
                aria-hidden="true"
              />
            </button>
          </header>

          <form
            onSubmit={handleSubmit}
            className="flex min-h-0 flex-1 flex-col"
            noValidate
          >
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              <div className="space-y-5 p-4 sm:p-6">
                {errorGeneral && (
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

                    <p className="min-w-0 flex-1 break-words text-xs font-semibold leading-5">
                      {errorGeneral}
                    </p>
                  </div>
                )}

                <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                  <div className="border-b border-gray-100 bg-[#F8FAFC] px-4 py-3">
                    <div className="flex items-start gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EAF2F8] text-[#0A3D62]">
                        <ImageIcon
                          size={17}
                          aria-hidden="true"
                        />
                      </span>

                      <div className="min-w-0">
                        <h3 className="text-sm font-extrabold text-[#0A3D62]">
                          Imagen del servicio
                        </h3>

                        <p className="mt-0.5 text-xs leading-5 text-gray-500">
                          Agrega una imagen representativa para mostrar el servicio.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-[minmax(0,1fr)_160px] sm:items-start">
                    <CloudinaryUploader
                      onUpload={
                        handleImageUpload
                      }
                      preset="servicios_preset"
                      folder="centro-medico/servicios"
                      resourceType="image"
                      maxFiles={1}
                    />

                    <div className="flex justify-center sm:justify-end">
                      {formData.urlImage ? (
                        <div className="relative h-36 w-36 overflow-hidden rounded-2xl border border-[#FFC300]/40 bg-gray-100 shadow-sm">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={
                              formData.urlImage
                            }
                            alt={
                              formData.textoAlt ||
                              formData.tituloServicio ||
                              "Vista previa del servicio"
                            }
                            className="h-full w-full object-cover"
                          />

                          <button
                            type="button"
                            onClick={
                              eliminarImagen
                            }
                            disabled={saving}
                            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-white shadow-md transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label="Eliminar imagen"
                            title="Eliminar imagen"
                          >
                            <X
                              size={15}
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                      ) : (
                        <div className="flex h-36 w-36 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-3 text-center">
                          <ImageIcon
                            size={28}
                            className="text-gray-300"
                            aria-hidden="true"
                          />

                          <p className="mt-2 text-[10px] font-semibold leading-4 text-gray-400">
                            Sin imagen
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
                  <div className="mb-4">
                    <h3 className="text-sm font-extrabold text-[#0A3D62]">
                      Información del servicio
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      Define el nombre, descripción y ubicación del servicio.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="servicio-titulo"
                        className="mb-2 block text-xs font-extrabold text-[#0A3D62]"
                      >
                        Título del servicio

                        <span
                          className="ml-1 text-red-500"
                          aria-hidden="true"
                        >
                          *
                        </span>
                      </label>

                      <div className="relative">
                        <Sparkles
                          size={17}
                          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0A3D62]"
                          aria-hidden="true"
                        />

                        <input
                          ref={
                            primerCampoRef
                          }
                          id="servicio-titulo"
                          type="text"
                          name="tituloServicio"
                          value={
                            formData.tituloServicio
                          }
                          onChange={
                            handleChange
                          }
                          disabled={saving}
                          aria-invalid={Boolean(
                            errors.tituloServicio,
                          )}
                          aria-describedby={
                            errors.tituloServicio
                              ? "error-servicio-titulo"
                              : undefined
                          }
                          className={cn(
                            claseCampoBase,
                            "pl-10 pr-3",
                            errors.tituloServicio
                              ? claseCampoError
                              : claseCampoNormal,
                          )}
                          placeholder="Ej. Consulta pediátrica"
                        />
                      </div>

                      <div id="error-servicio-titulo">
                        <MensajeError
                          mensaje={
                            errors.tituloServicio
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="servicio-descripcion"
                        className="mb-2 block text-xs font-extrabold text-[#0A3D62]"
                      >
                        Descripción
                      </label>

                      <div className="relative">
                        <FileText
                          size={17}
                          className="pointer-events-none absolute left-3.5 top-3.5 text-[#0A3D62]"
                          aria-hidden="true"
                        />

                        <textarea
                          id="servicio-descripcion"
                          name="descripcion"
                          value={
                            formData.descripcion
                          }
                          onChange={
                            handleChange
                          }
                          disabled={saving}
                          rows={5}
                          className={cn(
                            claseCampoBase,
                            claseCampoNormal,
                            "resize-y py-3 pl-10 pr-3 leading-6",
                          )}
                          placeholder="Describe las características y beneficios del servicio."
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="servicio-ubicacion"
                        className="mb-2 block text-xs font-extrabold text-[#0A3D62]"
                      >
                        Ubicación
                      </label>

                      <div className="relative">
                        <MapPin
                          size={17}
                          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0A3D62]"
                          aria-hidden="true"
                        />

                        <input
                          id="servicio-ubicacion"
                          type="text"
                          name="ubicacion"
                          value={
                            formData.ubicacion
                          }
                          onChange={
                            handleChange
                          }
                          disabled={saving}
                          className={cn(
                            claseCampoBase,
                            claseCampoNormal,
                            "pl-10 pr-3",
                          )}
                          placeholder="Centro Médico Pichardo"
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {esEdicion && (
                  <section className="rounded-2xl border border-[#FFC300]/35 bg-[#FFF9E6] p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <h3 className="text-sm font-extrabold text-[#0A3D62]">
                          Estado del servicio
                        </h3>

                        <p className="mt-1 text-xs leading-5 text-gray-600">
                          Los servicios inactivos permanecen registrados, pero no se muestran como disponibles.
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-3">
                        <button
                          type="button"
                          role="switch"
                          aria-checked={
                            formData.activo
                          }
                          onClick={
                            cambiarEstado
                          }
                          disabled={saving}
                          className={cn(
                            "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                            formData.activo
                              ? "bg-emerald-500"
                              : "bg-gray-300",
                          )}
                          aria-label="Cambiar estado del servicio"
                        >
                          <span
                            className={cn(
                              "inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
                              formData.activo
                                ? "translate-x-6"
                                : "translate-x-1",
                            )}
                          />
                        </button>

                        <span
                          className={cn(
                            "min-w-14 text-sm font-extrabold",
                            formData.activo
                              ? "text-emerald-700"
                              : "text-gray-500",
                          )}
                        >
                          {formData.activo
                            ? "Activo"
                            : "Inactivo"}
                        </span>
                      </div>
                    </div>
                  </section>
                )}

                <input
                  type="hidden"
                  name="textoAlt"
                  value={
                    formData.textoAlt ||
                    formData.tituloServicio
                  }
                />

                <input
                  type="hidden"
                  name="disenoTipo"
                  value={formData.disenoTipo}
                />
              </div>
            </div>

            <footer className="flex shrink-0 flex-col-reverse gap-2 border-t border-gray-100 bg-[#F8FAFC] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p className="text-[11px] leading-5 text-gray-500">
                Verifica la información antes de guardar los cambios.
              </p>

              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={saving}
                  className="inline-flex min-h-10 items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-2 text-xs font-extrabold text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#FFC300] px-5 py-2 text-xs font-extrabold text-[#0A3D62] shadow-sm transition-colors hover:bg-[#EAB308] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D62] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none"
                >
                  {saving ? (
                    <Loader2
                      size={16}
                      className="animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    <Save
                      size={16}
                      aria-hidden="true"
                    />
                  )}

                  {saving
                    ? "Guardando..."
                    : esEdicion
                      ? "Guardar cambios"
                      : "Registrar servicio"}
                </button>
              </div>
            </footer>
          </form>
        </section>
      </div>
    </div>
  );
}