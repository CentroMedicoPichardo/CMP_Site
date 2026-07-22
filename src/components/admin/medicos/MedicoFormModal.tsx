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
  Hospital,
  ImageIcon,
  Loader2,
  MapPin,
  Save,
  Stethoscope,
  UserRound,
  UserRoundPen,
  UserRoundPlus,
  X,
  type LucideIcon,
} from "lucide-react";

import { CloudinaryUploader } from "@/components/admin/cloudinary/CloudinaryUploader";

import type {
  Medico,
  MedicoFormData,
} from "@/types/medicos";

interface MedicoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    medicoData: Partial<Medico>,
  ) => Promise<void>;
  medico: Medico | null;
}

type ErroresFormulario = Partial<
  Record<keyof MedicoFormData, string>
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

const FORM_DATA_INICIAL: MedicoFormData = {
  nombres: "",
  apellidoPaterno: "",
  apellidoMaterno: "",
  especialidad: "",
  hospitalClinica:
    "Centro Médico Pichardo",
  direccion:
    "Av. Central 123, Poza Rica",
  urlFoto: "",
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
        '[data-medico-form-modal="true"]',
      )
    ) {
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

function EtiquetaCampo({
  htmlFor,
  children,
  requerido = false,
}: {
  htmlFor: string;
  children: React.ReactNode;
  requerido?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block text-xs font-extrabold text-[#0A3D62]"
    >
      {children}

      {requerido && (
        <span
          className="ml-1 text-red-500"
          aria-hidden="true"
        >
          *
        </span>
      )}
    </label>
  );
}

function IconoCampo({
  Icono,
}: {
  Icono: LucideIcon;
}) {
  return (
    <Icono
      size={17}
      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0A3D62]"
      aria-hidden="true"
    />
  );
}

export function MedicoFormModal({
  isOpen,
  onClose,
  onSave,
  medico,
}: MedicoFormModalProps) {
  const tituloId = useId();
  const descripcionId = useId();

  const onCloseRef = useRef(onClose);
  const primerCampoRef =
    useRef<HTMLInputElement>(null);

  const [
    desplazamientoSuperior,
    setDesplazamientoSuperior,
  ] = useState(88);

  const [formData, setFormData] =
    useState<MedicoFormData>(
      FORM_DATA_INICIAL,
    );

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
    if (!isOpen) {
      return;
    }

    if (medico) {
      setFormData({
        idMedico: medico.idMedico,
        nombres: medico.nombres ?? "",
        apellidoPaterno:
          medico.apellidoPaterno ?? "",
        apellidoMaterno:
          medico.apellidoMaterno ?? "",
        especialidad:
          medico.especialidad ?? "",
        hospitalClinica:
          medico.hospitalClinica ||
          "Centro Médico Pichardo",
        direccion:
          medico.direccion ||
          "Av. Central 123, Poza Rica",
        urlFoto: medico.urlFoto ?? "",
        activo: medico.activo ?? true,
      });
    } else {
      setFormData({
        ...FORM_DATA_INICIAL,
      });
    }

    setErrors({});
    setErrorGeneral(null);
    setSaving(false);

    const focusTimer = window.setTimeout(
      () => {
        primerCampoRef.current?.focus();
      },
      150,
    );

    return () => {
      window.clearTimeout(focusTimer);
    };
  }, [isOpen, medico]);

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
      if (
        event.key === "Escape" &&
        !saving
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
            '[data-medico-form-modal="true"]',
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
  }, [isOpen, saving]);

  const validarFormulario = (): boolean => {
    const nuevosErrores:
      ErroresFormulario = {};

    if (!formData.nombres.trim()) {
      nuevosErrores.nombres =
        "El nombre es obligatorio.";
    }

    if (
      !formData.apellidoPaterno.trim()
    ) {
      nuevosErrores.apellidoPaterno =
        "El apellido paterno es obligatorio.";
    }

    if (
      !formData.especialidad.trim()
    ) {
      nuevosErrores.especialidad =
        "La especialidad es obligatoria.";
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
      name as keyof MedicoFormData;

    setFormData((datosActuales) => ({
      ...datosActuales,
      [campo]: value,
    }));

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
        urlFoto: asset.url,
      }),
    );

    setErrorGeneral(null);
  };

  const eliminarImagen = () => {
    setFormData(
      (datosActuales) => ({
        ...datosActuales,
        urlFoto: "",
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
        nombres:
          formData.nombres.trim(),
        apellidoPaterno:
          formData.apellidoPaterno.trim(),
        apellidoMaterno:
          formData.apellidoMaterno.trim(),
        especialidad:
          formData.especialidad.trim(),
        hospitalClinica:
          formData.hospitalClinica.trim(),
        direccion:
          formData.direccion.trim(),
        urlFoto:
          formData.urlFoto.trim(),
      });

      onClose();
    } catch (error: unknown) {
      console.error(
        "Error al guardar médico:",
        error,
      );

      setErrorGeneral(
        error instanceof Error
          ? error.message
          : "No fue posible guardar la información del médico.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  const esEdicion = Boolean(medico);

  const TituloIcono = esEdicion
    ? UserRoundPen
    : UserRoundPlus;

  const claseInputBase =
    "min-h-11 w-full rounded-xl border bg-white px-3 text-sm font-medium text-gray-800 outline-none transition placeholder:text-gray-400 focus:ring-4 disabled:cursor-not-allowed disabled:bg-gray-100";

  const claseInputNormal =
    "border-gray-200 focus:border-[#FFC300] focus:ring-[#FFC300]/15";

  const claseInputError =
    "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100";

  return (
    <div
      data-medico-form-modal="true"
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
        aria-label="Cerrar formulario de médico"
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
                <TituloIcono
                  size={21}
                  strokeWidth={1.9}
                  aria-hidden="true"
                />
              </span>

              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
                  Gestión de médicos
                </p>

                <h2
                  id={tituloId}
                  className="mt-1 text-lg font-extrabold leading-tight text-[#0A3D62] sm:text-xl"
                >
                  {esEdicion
                    ? "Editar médico"
                    : "Registrar médico"}
                </h2>

                <p
                  id={descripcionId}
                  className="mt-1 text-xs leading-5 text-gray-500"
                >
                  {esEdicion
                    ? "Actualiza la información profesional y de contacto."
                    : "Captura la información del nuevo integrante médico."}
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
                          Fotografía
                        </h3>

                        <p className="mt-0.5 text-xs leading-5 text-gray-500">
                          Agrega una imagen para identificar al médico.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-[minmax(0,1fr)_144px] sm:items-start">
                    <CloudinaryUploader
                      onUpload={
                        handleImageUpload
                      }
                      preset="medicos_preset"
                      folder="centro-medico/medicos"
                      resourceType="image"
                      maxFiles={1}
                    />

                    <div className="flex justify-center sm:justify-end">
                      {formData.urlFoto ? (
                        <div className="relative h-32 w-32 overflow-hidden rounded-2xl border border-[#FFC300]/40 bg-gray-100 shadow-sm">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={
                              formData.urlFoto
                            }
                            alt="Vista previa del médico"
                            className="h-full w-full object-cover"
                          />

                          <button
                            type="button"
                            onClick={
                              eliminarImagen
                            }
                            disabled={saving}
                            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-white shadow-md transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label="Eliminar fotografía"
                            title="Eliminar fotografía"
                          >
                            <X
                              size={15}
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                      ) : (
                        <div className="flex h-32 w-32 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-3 text-center">
                          <UserRound
                            size={26}
                            className="text-gray-300"
                            aria-hidden="true"
                          />

                          <p className="mt-2 text-[10px] font-semibold leading-4 text-gray-400">
                            Sin fotografía
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
                  <div className="mb-4">
                    <h3 className="text-sm font-extrabold text-[#0A3D62]">
                      Información personal
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      Los campos marcados son obligatorios.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                      <EtiquetaCampo
                        htmlFor="medico-nombres"
                        requerido
                      >
                        Nombres
                      </EtiquetaCampo>

                      <div className="relative">
                        <IconoCampo
                          Icono={UserRound}
                        />

                        <input
                          ref={
                            primerCampoRef
                          }
                          id="medico-nombres"
                          type="text"
                          name="nombres"
                          value={
                            formData.nombres
                          }
                          onChange={
                            handleChange
                          }
                          disabled={saving}
                          autoComplete="given-name"
                          aria-invalid={Boolean(
                            errors.nombres,
                          )}
                          aria-describedby={
                            errors.nombres
                              ? "error-medico-nombres"
                              : undefined
                          }
                          className={cn(
                            claseInputBase,
                            "pl-10 pr-3",
                            errors.nombres
                              ? claseInputError
                              : claseInputNormal,
                          )}
                          placeholder="Nombres"
                        />
                      </div>

                      <div id="error-medico-nombres">
                        <MensajeError
                          mensaje={
                            errors.nombres
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <EtiquetaCampo
                        htmlFor="medico-apellido-paterno"
                        requerido
                      >
                        Apellido paterno
                      </EtiquetaCampo>

                      <input
                        id="medico-apellido-paterno"
                        type="text"
                        name="apellidoPaterno"
                        value={
                          formData.apellidoPaterno
                        }
                        onChange={
                          handleChange
                        }
                        disabled={saving}
                        autoComplete="family-name"
                        aria-invalid={Boolean(
                          errors.apellidoPaterno,
                        )}
                        aria-describedby={
                          errors.apellidoPaterno
                            ? "error-medico-apellido-paterno"
                            : undefined
                        }
                        className={cn(
                          claseInputBase,
                          errors.apellidoPaterno
                            ? claseInputError
                            : claseInputNormal,
                        )}
                        placeholder="Apellido paterno"
                      />

                      <div id="error-medico-apellido-paterno">
                        <MensajeError
                          mensaje={
                            errors.apellidoPaterno
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <EtiquetaCampo htmlFor="medico-apellido-materno">
                        Apellido materno
                      </EtiquetaCampo>

                      <input
                        id="medico-apellido-materno"
                        type="text"
                        name="apellidoMaterno"
                        value={
                          formData.apellidoMaterno
                        }
                        onChange={
                          handleChange
                        }
                        disabled={saving}
                        autoComplete="additional-name"
                        className={cn(
                          claseInputBase,
                          claseInputNormal,
                        )}
                        placeholder="Apellido materno"
                      />
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
                  <div className="mb-4">
                    <h3 className="text-sm font-extrabold text-[#0A3D62]">
                      Información profesional
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      Indica la especialidad y el lugar de atención.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <EtiquetaCampo
                        htmlFor="medico-especialidad"
                        requerido
                      >
                        Especialidad
                      </EtiquetaCampo>

                      <div className="relative">
                        <IconoCampo
                          Icono={
                            Stethoscope
                          }
                        />

                        <input
                          id="medico-especialidad"
                          type="text"
                          name="especialidad"
                          value={
                            formData.especialidad
                          }
                          onChange={
                            handleChange
                          }
                          disabled={saving}
                          aria-invalid={Boolean(
                            errors.especialidad,
                          )}
                          aria-describedby={
                            errors.especialidad
                              ? "error-medico-especialidad"
                              : undefined
                          }
                          className={cn(
                            claseInputBase,
                            "pl-10 pr-3",
                            errors.especialidad
                              ? claseInputError
                              : claseInputNormal,
                          )}
                          placeholder="Ej. Pediatría"
                        />
                      </div>

                      <div id="error-medico-especialidad">
                        <MensajeError
                          mensaje={
                            errors.especialidad
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <EtiquetaCampo htmlFor="medico-hospital">
                        Hospital o clínica
                      </EtiquetaCampo>

                      <div className="relative">
                        <IconoCampo
                          Icono={Hospital}
                        />

                        <input
                          id="medico-hospital"
                          type="text"
                          name="hospitalClinica"
                          value={
                            formData.hospitalClinica
                          }
                          onChange={
                            handleChange
                          }
                          disabled={saving}
                          autoComplete="organization"
                          className={cn(
                            claseInputBase,
                            claseInputNormal,
                            "pl-10 pr-3",
                          )}
                          placeholder="Centro Médico Pichardo"
                        />
                      </div>
                    </div>

                    <div>
                      <EtiquetaCampo htmlFor="medico-direccion">
                        Dirección
                      </EtiquetaCampo>

                      <div className="relative">
                        <IconoCampo
                          Icono={MapPin}
                        />

                        <input
                          id="medico-direccion"
                          type="text"
                          name="direccion"
                          value={
                            formData.direccion
                          }
                          onChange={
                            handleChange
                          }
                          disabled={saving}
                          autoComplete="street-address"
                          className={cn(
                            claseInputBase,
                            claseInputNormal,
                            "pl-10 pr-3",
                          )}
                          placeholder="Av. Central 123, Poza Rica"
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
                          Estado del médico
                        </h3>

                        <p className="mt-1 text-xs leading-5 text-gray-600">
                          Los médicos inactivos pueden conservarse en el sistema sin mostrarse como disponibles.
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
                          aria-label="Cambiar estado del médico"
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
                      : "Registrar médico"}
                </button>
              </div>
            </footer>
          </form>
        </section>
      </div>
    </div>
  );
}