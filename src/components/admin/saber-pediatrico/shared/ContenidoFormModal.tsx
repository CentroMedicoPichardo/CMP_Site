"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

import {
  BookOpenText,
  CalendarDays,
  CircleAlert,
  ClipboardList,
  Clock3,
  FileText,
  ImageIcon,
  Link as LinkIcon,
  Loader2,
  Save,
  Star,
  Video,
  X,
} from "lucide-react";

import { CloudinaryUploader } from "@/components/admin/cloudinary/CloudinaryUploader";

import { RichTextEditor } from "./RichTextEditor";

type ContenidoTipo =
  | "articulo"
  | "video"
  | "documento"
  | "encuesta";

export interface ContenidoFormData {
  id?: number;
  tipo: string;
  titulo: string;
  descripcion: string;
  contenido?: string;
  urlExterno?: string;
  imagenUrl?: string;
  videoUrl?: string;
  archivoUrl?: string;
  categoria?: string;
  etiquetas?: string[];
  duracion?: string;
  fechaPublicacion: string;
  destacado: boolean;
  activo: boolean;
}

interface ContenidoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    data: Partial<ContenidoFormData>,
  ) => Promise<void>;
  item: ContenidoFormData | null;
  tipo: ContenidoTipo;
  saving: boolean;
}

type ErroresFormulario = Partial<
  Record<keyof ContenidoFormData, string>
>;

type CampoTexto =
  | "titulo"
  | "descripcion"
  | "urlExterno"
  | "archivoUrl"
  | "duracion"
  | "fechaPublicacion";

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

const CONFIGURACION_TIPO: Record<
  ContenidoTipo,
  {
    nombre: string;
    tituloNuevo: string;
    tituloEditar: string;
    descripcion: string;
  }
> = {
  articulo: {
    nombre: "Artículo",
    tituloNuevo: "Registrar artículo",
    tituloEditar: "Editar artículo",
    descripcion:
      "Publica contenido pediátrico informativo con texto enriquecido e imagen de portada.",
  },
  video: {
    nombre: "Video",
    tituloNuevo: "Registrar video",
    tituloEditar: "Editar video",
    descripcion:
      "Comparte material audiovisual mediante un enlace público de YouTube.",
  },
  documento: {
    nombre: "Documento",
    tituloNuevo: "Registrar documento",
    tituloEditar: "Editar documento",
    descripcion:
      "Publica documentos, guías y materiales alojados en servicios externos.",
  },
  encuesta: {
    nombre: "Encuesta",
    tituloNuevo: "Registrar encuesta",
    tituloEditar: "Editar encuesta",
    descripcion:
      "Comparte formularios para recopilar información y opiniones de los usuarios.",
  },
};

function cn(
  ...clases: Array<
    string | false | null | undefined
  >
): string {
  return clases.filter(Boolean).join(" ");
}

function IconoContenido({
  tipo,
  size = 20,
  className,
}: {
  tipo: ContenidoTipo;
  size?: number;
  className?: string;
}) {
  if (tipo === "video") {
    return (
      <Video
        size={size}
        className={className}
        aria-hidden="true"
      />
    );
  }

  if (tipo === "documento") {
    return (
      <FileText
        size={size}
        className={className}
        aria-hidden="true"
      />
    );
  }

  if (tipo === "encuesta") {
    return (
      <ClipboardList
        size={size}
        className={className}
        aria-hidden="true"
      />
    );
  }

  return (
    <BookOpenText
      size={size}
      className={className}
      aria-hidden="true"
    />
  );
}

function esContenidoTipo(
  valor: string,
): valor is ContenidoTipo {
  return (
    valor === "articulo" ||
    valor === "video" ||
    valor === "documento" ||
    valor === "encuesta"
  );
}

function obtenerFechaLocalIso(): string {
  const fecha = new Date();

  const año = fecha.getFullYear();
  const mes = String(
    fecha.getMonth() + 1,
  ).padStart(2, "0");
  const dia = String(
    fecha.getDate(),
  ).padStart(2, "0");

  return `${año}-${mes}-${dia}`;
}

function crearFormularioInicial(
  tipo: ContenidoTipo,
): ContenidoFormData {
  return {
    tipo,
    titulo: "",
    descripcion: "",
    contenido: "",
    urlExterno: "",
    imagenUrl: "",
    videoUrl: "",
    archivoUrl: "",
    categoria: "",
    etiquetas: [],
    duracion: "",
    fechaPublicacion:
      obtenerFechaLocalIso(),
    destacado: false,
    activo: true,
  };
}

function esUrlValida(valor: string): boolean {
  try {
    const url = new URL(valor);

    return (
      url.protocol === "http:" ||
      url.protocol === "https:"
    );
  } catch {
    return false;
  }
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
        '[data-contenido-form-modal="true"]',
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

function EtiquetaCampo({
  htmlFor,
  children,
  requerido = false,
}: {
  htmlFor: string;
  children: ReactNode;
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

function EncabezadoSeccion({
  icono,
  titulo,
  descripcion,
}: {
  icono: ReactNode;
  titulo: string;
  descripcion: string;
}) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EAF2F8] text-[#0A3D62]">
        {icono}
      </span>

      <div className="min-w-0">
        <h3 className="text-sm font-extrabold text-[#0A3D62]">
          {titulo}
        </h3>

        <p className="mt-1 text-xs leading-5 text-gray-500">
          {descripcion}
        </p>
      </div>
    </div>
  );
}

export function ContenidoFormModal({
  isOpen,
  onClose,
  onSave,
  item,
  tipo,
  saving,
}: ContenidoFormModalProps) {
  const tituloModalId = useId();
  const descripcionModalId = useId();

  const primerCampoRef =
    useRef<HTMLInputElement>(null);

  const onCloseRef = useRef(onClose);
  const savingRef = useRef(saving);

  const [mounted, setMounted] =
    useState(false);

  const [
    desplazamientoSuperior,
    setDesplazamientoSuperior,
  ] = useState(88);

  const [formData, setFormData] =
    useState<ContenidoFormData>(
      crearFormularioInicial(tipo),
    );

  const [errors, setErrors] =
    useState<ErroresFormulario>({});

  const [
    errorGeneral,
    setErrorGeneral,
  ] = useState<string | null>(null);

  const esEdicion = item !== null;
  const configuracion =
    CONFIGURACION_TIPO[tipo];

  const claseCampoBase =
    "min-h-11 w-full rounded-xl border bg-white px-3 text-sm font-medium text-gray-800 outline-none transition placeholder:text-gray-400 focus:ring-4 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500";

  const claseCampoNormal =
    "border-gray-200 focus:border-[#FFC300] focus:ring-[#FFC300]/15";

  const claseCampoError =
    "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100";

  useEffect(() => {
    setMounted(true);
  }, []);

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

    if (item) {
      const tipoItem =
        esContenidoTipo(item.tipo)
          ? item.tipo
          : tipo;

      setFormData({
        id: item.id,
        tipo: tipoItem,
        titulo: item.titulo ?? "",
        descripcion:
          item.descripcion ?? "",
        contenido: item.contenido ?? "",
        urlExterno:
          item.urlExterno ?? "",
        imagenUrl: item.imagenUrl ?? "",
        videoUrl: item.videoUrl ?? "",
        archivoUrl:
          item.archivoUrl ?? "",
        categoria: item.categoria ?? "",
        etiquetas: item.etiquetas ?? [],
        duracion: item.duracion ?? "",
        fechaPublicacion:
          item.fechaPublicacion ||
          obtenerFechaLocalIso(),
        destacado:
          item.destacado ?? false,
        activo: item.activo ?? true,
      });
    } else {
      setFormData(
        crearFormularioInicial(tipo),
      );
    }

    setErrors({});
    setErrorGeneral(null);

    const temporizador =
      window.setTimeout(() => {
        primerCampoRef.current?.focus();
      }, 150);

    return () => {
      window.clearTimeout(temporizador);
    };
  }, [isOpen, item, tipo]);

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

    let frameId: number | null = null;

    const actualizarPosicion = () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(
          frameId,
        );
      }

      frameId =
        window.requestAnimationFrame(
          () => {
            setDesplazamientoSuperior(
              obtenerLimiteHeaderGlobal(),
            );

            frameId = null;
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

    const headers =
      document.querySelectorAll<HTMLElement>(
        "header",
      );

    headers.forEach((header) => {
      if (
        !header.closest(
          '[data-contenido-form-modal="true"]',
        )
      ) {
        resizeObserver?.observe(header);
      }
    });

    window.addEventListener(
      "resize",
      actualizarPosicion,
    );

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(
          frameId,
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

  function limpiarErrorCampo(
    campo: keyof ContenidoFormData,
  ) {
    setErrors((erroresActuales) => {
      if (!erroresActuales[campo]) {
        return erroresActuales;
      }

      return {
        ...erroresActuales,
        [campo]: undefined,
      };
    });
  }

  function actualizarCampo<
    K extends keyof ContenidoFormData,
  >(
    campo: K,
    valor: ContenidoFormData[K],
  ) {
    setFormData((datosActuales) => ({
      ...datosActuales,
      [campo]: valor,
    }));

    limpiarErrorCampo(campo);
    setErrorGeneral(null);
  }

  const handleTextChange = (
    event: ChangeEvent<
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement
    >,
  ) => {
    const campo =
      event.target.name as CampoTexto;

    actualizarCampo(
      campo,
      event.target.value,
    );
  };

  const handleImageUpload = ({
    url,
  }: {
    url: string;
    publicId: string;
  }) => {
    actualizarCampo("imagenUrl", url);
  };

  const eliminarImagen = () => {
    actualizarCampo("imagenUrl", "");
  };

  const cambiarDestacado = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    actualizarCampo(
      "destacado",
      event.target.checked,
    );
  };

  const cambiarEstado = () => {
    actualizarCampo(
      "activo",
      !formData.activo,
    );
  };

  const validarFormulario =
    (): boolean => {
      const nuevosErrores:
        ErroresFormulario = {};

      if (!formData.titulo.trim()) {
        nuevosErrores.titulo =
          "El título es obligatorio.";
      }

      if (!formData.fechaPublicacion) {
        nuevosErrores.fechaPublicacion =
          "Selecciona una fecha de publicación.";
      }

      if (
        tipo === "video" ||
        tipo === "encuesta"
      ) {
        const enlace =
          formData.urlExterno?.trim() ??
          "";

        if (!enlace) {
          nuevosErrores.urlExterno =
            tipo === "video"
              ? "Ingresa la URL del video."
              : "Ingresa la URL de la encuesta.";
        } else if (!esUrlValida(enlace)) {
          nuevosErrores.urlExterno =
            "Ingresa una URL válida que comience con http:// o https://.";
        }
      }

      if (tipo === "documento") {
        const enlace =
          formData.archivoUrl?.trim() ??
          "";

        if (!enlace) {
          nuevosErrores.archivoUrl =
            "Ingresa la URL del documento.";
        } else if (!esUrlValida(enlace)) {
          nuevosErrores.archivoUrl =
            "Ingresa una URL válida que comience con http:// o https://.";
        }
      }

      setErrors(nuevosErrores);

      return (
        Object.keys(nuevosErrores)
          .length === 0
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

    setErrorGeneral(null);

    try {
      await onSave({
        ...formData,
        tipo,
        titulo: formData.titulo.trim(),
        descripcion:
          formData.descripcion.trim(),
        contenido:
          formData.contenido?.trim() ||
          "",
        urlExterno:
          formData.urlExterno?.trim() ||
          "",
        imagenUrl:
          formData.imagenUrl?.trim() ||
          "",
        archivoUrl:
          formData.archivoUrl?.trim() ||
          "",
        duracion:
          formData.duracion?.trim() || "",
      });
    } catch (error: unknown) {
      console.error(
        "Error al guardar contenido:",
        error,
      );

      setErrorGeneral(
        error instanceof Error
          ? error.message
          : "No fue posible guardar el contenido.",
      );
    }
  };

  if (!isOpen || !mounted) {
    return null;
  }

  const modal = (
    <div
      data-contenido-form-modal="true"
      className="fixed bottom-0 left-0 right-0 z-[9000] overflow-hidden"
      style={{
        top: `${desplazamientoSuperior}px`,
      }}
    >
      <button
        type="button"
        onClick={handleClose}
        disabled={saving}
        tabIndex={-1}
        className="absolute inset-0 z-0 h-full w-full cursor-default bg-[#061C2E]/70 backdrop-blur-sm disabled:cursor-wait"
        aria-label="Cerrar formulario de contenido"
      />

      <div className="relative z-10 flex h-full w-full items-center justify-center p-3 sm:p-5">
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby={tituloModalId}
          aria-describedby={
            descripcionModalId
          }
          className="relative flex max-h-full w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <div
            className="h-1 w-full shrink-0 bg-[#FFC300]"
            aria-hidden="true"
          />

          <header className="flex shrink-0 items-start justify-between gap-4 border-b border-gray-100 bg-white px-4 py-4 sm:px-6">
            <div className="flex min-w-0 items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0A3D62] text-[#FFC300]">
                <IconoContenido
                  tipo={tipo}
                  size={21}
                />
              </span>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
                    Saber Pediátrico
                  </p>

                  <span className="rounded-full border border-[#0A3D62]/10 bg-[#EAF2F8] px-2 py-1 text-[9px] font-extrabold uppercase tracking-wide text-[#0A3D62]">
                    {configuracion.nombre}
                  </span>
                </div>

                <h2
                  id={tituloModalId}
                  className="mt-1 break-words text-lg font-extrabold leading-tight text-[#0A3D62] sm:text-xl"
                >
                  {esEdicion
                    ? configuracion.tituloEditar
                    : configuracion.tituloNuevo}
                </h2>

                <p
                  id={descripcionModalId}
                  className="mt-1 max-w-2xl text-xs leading-5 text-gray-500"
                >
                  {configuracion.descripcion}
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

                {tipo === "articulo" && (
                  <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                    <div className="border-b border-gray-100 bg-[#F8FAFC] px-4 py-4">
                      <EncabezadoSeccion
                        icono={
                          <ImageIcon
                            size={17}
                            aria-hidden="true"
                          />
                        }
                        titulo="Imagen de portada"
                        descripcion="Agrega una imagen representativa para identificar el artículo."
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-[minmax(0,1fr)_190px] sm:items-start">
                      <CloudinaryUploader
                        onUpload={
                          handleImageUpload
                        }
                        preset="saber_pediatrico_img"
                        folder="centro-medico/saber-pediatrico"
                        resourceType="image"
                        maxFiles={1}
                      />

                      <div className="flex justify-center sm:justify-end">
                        {formData.imagenUrl ? (
                          <div className="relative aspect-[4/3] w-full max-w-[180px] overflow-hidden rounded-2xl border border-[#FFC300]/40 bg-gray-100 shadow-sm">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={
                                formData.imagenUrl
                              }
                              alt={
                                formData.titulo
                                  ? `Vista previa de ${formData.titulo}`
                                  : "Vista previa del artículo"
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
                          <div className="flex aspect-[4/3] w-full max-w-[180px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-3 text-center">
                            <ImageIcon
                              size={29}
                              className="text-gray-300"
                              aria-hidden="true"
                            />

                            <p className="mt-2 text-[10px] font-semibold leading-4 text-gray-400">
                              Sin imagen de portada
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                )}

                <section className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
                  <EncabezadoSeccion
                    icono={
                      <FileText
                        size={17}
                        aria-hidden="true"
                      />
                    }
                    titulo="Información general"
                    descripcion="Define el título y la descripción que se mostrarán a los usuarios."
                  />

                  <div className="space-y-4">
                    <div>
                      <EtiquetaCampo
                        htmlFor="contenido-titulo"
                        requerido
                      >
                        Título
                      </EtiquetaCampo>

                      <div className="relative">
                        <span className="pointer-events-none absolute left-3.5 top-1/2 flex -translate-y-1/2 text-[#0A3D62]">
                          <IconoContenido
                            tipo={tipo}
                            size={17}
                          />
                        </span>

                        <input
                          ref={
                            primerCampoRef
                          }
                          id="contenido-titulo"
                          type="text"
                          name="titulo"
                          value={formData.titulo}
                          onChange={
                            handleTextChange
                          }
                          disabled={saving}
                          aria-invalid={Boolean(
                            errors.titulo,
                          )}
                          className={cn(
                            claseCampoBase,
                            "pl-10 pr-3",
                            errors.titulo
                              ? claseCampoError
                              : claseCampoNormal,
                          )}
                          placeholder={`Título del ${configuracion.nombre.toLowerCase()}`}
                        />
                      </div>

                      <MensajeError
                        mensaje={errors.titulo}
                      />
                    </div>

                    <div>
                      <EtiquetaCampo htmlFor="contenido-descripcion">
                        Descripción corta
                      </EtiquetaCampo>

                      <textarea
                        id="contenido-descripcion"
                        name="descripcion"
                        value={
                          formData.descripcion
                        }
                        onChange={
                          handleTextChange
                        }
                        disabled={saving}
                        rows={3}
                        className={cn(
                          claseCampoBase,
                          claseCampoNormal,
                          "resize-y py-3 leading-6",
                        )}
                        placeholder="Describe brevemente el contenido y su utilidad."
                      />
                    </div>
                  </div>
                </section>

                {tipo === "articulo" && (
                  <section className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
                    <EncabezadoSeccion
                      icono={
                        <BookOpenText
                          size={17}
                          aria-hidden="true"
                        />
                      }
                      titulo="Contenido del artículo"
                      descripcion="Redacta la información completa que leerán los usuarios."
                    />

                    <RichTextEditor
                      value={
                        formData.contenido ||
                        ""
                      }
                      onChange={(html) => {
                        actualizarCampo(
                          "contenido",
                          html,
                        );
                      }}
                      placeholder="Escribe el contenido del artículo aquí..."
                    />
                  </section>
                )}

                {(tipo === "video" ||
                  tipo === "encuesta") && (
                  <section className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
                    <EncabezadoSeccion
                      icono={
                        <LinkIcon
                          size={17}
                          aria-hidden="true"
                        />
                      }
                      titulo={
                        tipo === "video"
                          ? "Material audiovisual"
                          : "Formulario externo"
                      }
                      descripcion={
                        tipo === "video"
                          ? "Agrega el enlace público del video y su duración aproximada."
                          : "Agrega el enlace público del formulario o encuesta."
                      }
                    />

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div
                        className={cn(
                          tipo === "encuesta" &&
                            "md:col-span-2",
                        )}
                      >
                        <EtiquetaCampo
                          htmlFor="contenido-url-externo"
                          requerido
                        >
                          {tipo === "video"
                            ? "URL de YouTube"
                            : "URL de Google Forms"}
                        </EtiquetaCampo>

                        <div className="relative">
                          <LinkIcon
                            size={17}
                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0A3D62]"
                            aria-hidden="true"
                          />

                          <input
                            id="contenido-url-externo"
                            type="url"
                            name="urlExterno"
                            value={
                              formData.urlExterno ||
                              ""
                            }
                            onChange={
                              handleTextChange
                            }
                            disabled={saving}
                            aria-invalid={Boolean(
                              errors.urlExterno,
                            )}
                            className={cn(
                              claseCampoBase,
                              "pl-10 pr-3",
                              errors.urlExterno
                                ? claseCampoError
                                : claseCampoNormal,
                            )}
                            placeholder={
                              tipo === "video"
                                ? "https://youtube.com/watch?v=..."
                                : "https://docs.google.com/forms/..."
                            }
                          />
                        </div>

                        <MensajeError
                          mensaje={
                            errors.urlExterno
                          }
                        />
                      </div>

                      {tipo === "video" && (
                        <div>
                          <EtiquetaCampo htmlFor="contenido-duracion">
                            Duración
                          </EtiquetaCampo>

                          <div className="relative">
                            <Clock3
                              size={17}
                              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0A3D62]"
                              aria-hidden="true"
                            />

                            <input
                              id="contenido-duracion"
                              type="text"
                              name="duracion"
                              value={
                                formData.duracion ||
                                ""
                              }
                              onChange={
                                handleTextChange
                              }
                              disabled={saving}
                              className={cn(
                                claseCampoBase,
                                claseCampoNormal,
                                "pl-10 pr-3",
                              )}
                              placeholder="Ej. 05:30"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </section>
                )}

                {tipo === "documento" && (
                  <section className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
                    <EncabezadoSeccion
                      icono={
                        <FileText
                          size={17}
                          aria-hidden="true"
                        />
                      }
                      titulo="Documento externo"
                      descripcion="Agrega el enlace público del documento alojado en Google Drive, Cloudinary u otro servicio."
                    />

                    <EtiquetaCampo
                      htmlFor="contenido-archivo-url"
                      requerido
                    >
                      URL del documento
                    </EtiquetaCampo>

                    <div className="relative">
                      <LinkIcon
                        size={17}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0A3D62]"
                        aria-hidden="true"
                      />

                      <input
                        id="contenido-archivo-url"
                        type="url"
                        name="archivoUrl"
                        value={
                          formData.archivoUrl ||
                          ""
                        }
                        onChange={
                          handleTextChange
                        }
                        disabled={saving}
                        aria-invalid={Boolean(
                          errors.archivoUrl,
                        )}
                        className={cn(
                          claseCampoBase,
                          "pl-10 pr-3",
                          errors.archivoUrl
                            ? claseCampoError
                            : claseCampoNormal,
                        )}
                        placeholder="https://..."
                      />
                    </div>

                    <MensajeError
                      mensaje={
                        errors.archivoUrl
                      }
                    />
                  </section>
                )}

                <section className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
                  <EncabezadoSeccion
                    icono={
                      <CalendarDays
                        size={17}
                        aria-hidden="true"
                      />
                    }
                    titulo="Configuración de publicación"
                    descripcion="Define la fecha y la prioridad visual del contenido."
                  />

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <EtiquetaCampo
                        htmlFor="contenido-fecha-publicacion"
                        requerido
                      >
                        Fecha de publicación
                      </EtiquetaCampo>

                      <div className="relative">
                        <CalendarDays
                          size={17}
                          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0A3D62]"
                          aria-hidden="true"
                        />

                        <input
                          id="contenido-fecha-publicacion"
                          type="date"
                          name="fechaPublicacion"
                          value={
                            formData.fechaPublicacion
                          }
                          onChange={
                            handleTextChange
                          }
                          disabled={saving}
                          aria-invalid={Boolean(
                            errors.fechaPublicacion,
                          )}
                          className={cn(
                            claseCampoBase,
                            "pl-10 pr-3",
                            errors.fechaPublicacion
                              ? claseCampoError
                              : claseCampoNormal,
                          )}
                        />
                      </div>

                      <MensajeError
                        mensaje={
                          errors.fechaPublicacion
                        }
                      />
                    </div>

                    <div className="flex items-end">
                      <label className="flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-xl border border-[#FFC300]/35 bg-[#FFF9E6] px-4 py-3 transition-colors hover:bg-[#FFF4CC]">
                        <input
                          type="checkbox"
                          checked={
                            formData.destacado
                          }
                          onChange={
                            cambiarDestacado
                          }
                          disabled={saving}
                          className="h-5 w-5 shrink-0 rounded border-gray-300 accent-[#FFC300] disabled:cursor-not-allowed"
                        />

                        <Star
                          size={17}
                          className="shrink-0 text-[#B88600]"
                          aria-hidden="true"
                        />

                        <span className="text-xs font-extrabold text-[#0A3D62]">
                          Marcar como destacado
                        </span>
                      </label>
                    </div>
                  </div>
                </section>

                {esEdicion && (
                  <section className="rounded-2xl border border-[#FFC300]/35 bg-[#FFF9E6] p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <h3 className="text-sm font-extrabold text-[#0A3D62]">
                          Estado del contenido
                        </h3>

                        <p className="mt-1 text-xs leading-5 text-gray-600">
                          Los elementos inactivos permanecen registrados, pero no se muestran públicamente.
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
                          aria-label="Cambiar estado del contenido"
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

            <footer className="flex shrink-0 flex-col-reverse gap-3 border-t border-gray-100 bg-[#F8FAFC] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p className="text-[11px] leading-5 text-gray-500">
                Los campos marcados con * son obligatorios.
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
                      : `Registrar ${configuracion.nombre.toLowerCase()}`}
                </button>
              </div>
            </footer>
          </form>
        </section>
      </div>
    </div>
  );

  return createPortal(
    modal,
    document.body,
  );
}