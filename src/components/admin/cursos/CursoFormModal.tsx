"use client";

import {
  useCallback,
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
  Calculator,
  Calendar,
  CircleAlert,
  Clock,
  DollarSign,
  FileText,
  GraduationCap,
  ImageIcon,
  Loader2,
  MapPin,
  Monitor,
  RefreshCw,
  Save,
  Sparkles,
  Tag,
  User,
  Users,
  X,
} from "lucide-react";

import { CloudinaryUploader } from "@/components/admin/cloudinary/CloudinaryUploader";

import type {
  ActualizarCursoInput,
  CrearCursoInput,
  Curso,
  CursoFormData,
} from "@/types/cursos";

import type {
  CategoriaCursoOption,
  InstructorCursoOption,
  ModalidadCurso,
  UbicacionCursoOption,
} from "@/types/catalogos-cursos";

type CursoSubmitInput =
  | CrearCursoInput
  | ActualizarCursoInput;

type ErroresFormulario = Partial<
  Record<keyof CursoFormData, string>
>;

interface CursoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    cursoData: CursoSubmitInput,
  ) => Promise<void>;
  curso: Curso | null;

  /**
   * Abre el módulo de predicción de precio.
   * Recibe todos los datos capturados en el formulario,
   * aunque todavía no se hayan guardado.
   */
  onOpenPricePredictor?: (
    draft: CursoFormData,
  ) => void;
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

const FORM_DATA_INICIAL: CursoFormData = {
  tituloCurso: "",
  descripcion: "",
  idInstructor: null,
  idCategoria: null,
  idUbicacion: null,
  idModalidad: null,
  fechaInicio: "",
  fechaFin: "",
  horario: "",
  dirigidoA: "Padres",
  cupoMaximo: 20,
  cuposOcupados: 0,
  costo: "0.00",
  urlImagenPortada: "",
  activo: true,
};

function cn(
  ...clases: Array<
    string | false | null | undefined
  >
): string {
  return clases.filter(Boolean).join(" ");
}

function textoSeguro(
  valor: unknown,
  respaldo = "",
): string {
  if (
    typeof valor === "string" &&
    valor.trim().length > 0
  ) {
    return valor.trim();
  }

  return respaldo;
}

function numeroSeguro(
  valor: unknown,
  respaldo = 0,
): number {
  if (
    typeof valor === "number" &&
    Number.isFinite(valor)
  ) {
    return valor;
  }

  if (
    typeof valor === "string" &&
    valor.trim()
  ) {
    const numero = Number(valor);

    if (Number.isFinite(numero)) {
      return numero;
    }
  }

  return respaldo;
}

function capitalizar(valor: string): string {
  const texto = valor.trim();

  if (!texto) {
    return texto;
  }

  return (
    texto.charAt(0).toUpperCase() +
    texto.slice(1)
  );
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
        '[data-curso-form-modal="true"]',
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

async function readJsonResponse<T>(
  response: Response,
): Promise<T> {
  const texto = await response.text();

  if (!texto) {
    return [] as T;
  }

  return JSON.parse(texto) as T;
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

export function CursoFormModal({
  isOpen,
  onClose,
  onSave,
  curso,
  onOpenPricePredictor,
}: CursoFormModalProps) {
  const tituloModalId = useId();
  const descripcionModalId = useId();

  const onCloseRef = useRef(onClose);
  const savingRef = useRef(false);
  const primerCampoRef =
    useRef<HTMLInputElement>(null);

  const [mounted, setMounted] =
    useState(false);

  const [
    desplazamientoSuperior,
    setDesplazamientoSuperior,
  ] = useState(88);

  const [formData, setFormData] =
    useState<CursoFormData>({
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

  const [instructores, setInstructores] =
    useState<InstructorCursoOption[]>([]);

  const [categorias, setCategorias] =
    useState<CategoriaCursoOption[]>([]);

  const [ubicaciones, setUbicaciones] =
    useState<UbicacionCursoOption[]>([]);

  const [modalidades, setModalidades] =
    useState<ModalidadCurso[]>([]);

  const [loadingData, setLoadingData] =
    useState(false);

  const [
    catalogosError,
    setCatalogosError,
  ] = useState<string | null>(null);

  const esEdicion = Boolean(curso);

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

  const cargarCatalogos = useCallback(
    async (signal?: AbortSignal) => {
      setLoadingData(true);
      setCatalogosError(null);

      try {
        const [
          instructoresRes,
          categoriasRes,
          ubicacionesRes,
          modalidadesRes,
        ] = await Promise.all([
          fetch(
            "/api/instructores?admin=true",
            {
              signal,
              cache: "no-store",
            },
          ),
          fetch(
            "/api/categorias?admin=true",
            {
              signal,
              cache: "no-store",
            },
          ),
          fetch(
            "/api/ubicaciones?admin=true",
            {
              signal,
              cache: "no-store",
            },
          ),
          fetch(
            "/api/modalidades?admin=true",
            {
              signal,
              cache: "no-store",
            },
          ),
        ]);

        if (
          !instructoresRes.ok ||
          !categoriasRes.ok ||
          !ubicacionesRes.ok ||
          !modalidadesRes.ok
        ) {
          throw new Error(
            "No fue posible cargar los catálogos del curso.",
          );
        }

        const [
          instructoresData,
          categoriasData,
          ubicacionesData,
          modalidadesData,
        ] = await Promise.all([
          readJsonResponse<
            InstructorCursoOption[]
          >(instructoresRes),
          readJsonResponse<
            CategoriaCursoOption[]
          >(categoriasRes),
          readJsonResponse<
            UbicacionCursoOption[]
          >(ubicacionesRes),
          readJsonResponse<
            ModalidadCurso[]
          >(modalidadesRes),
        ]);

        setInstructores(
          Array.isArray(instructoresData)
            ? instructoresData
            : [],
        );

        setCategorias(
          Array.isArray(categoriasData)
            ? categoriasData
            : [],
        );

        setUbicaciones(
          Array.isArray(ubicacionesData)
            ? ubicacionesData
            : [],
        );

        setModalidades(
          Array.isArray(modalidadesData)
            ? modalidadesData
            : [],
        );
      } catch (error: unknown) {
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return;
        }

        console.error(
          "Error cargando catálogos del curso:",
          error,
        );

        setCatalogosError(
          error instanceof Error
            ? error.message
            : "No fue posible cargar los catálogos del curso.",
        );
      } finally {
        if (!signal?.aborted) {
          setLoadingData(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const controller =
      new AbortController();

    void cargarCatalogos(
      controller.signal,
    );

    return () => {
      controller.abort();
    };
  }, [isOpen, cargarCatalogos]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (curso) {
      setFormData({
        idCurso: curso.idCurso,
        tituloCurso:
          curso.tituloCurso ?? "",
        descripcion:
          curso.descripcion ?? "",
        idInstructor:
          curso.idInstructor ?? null,
        idCategoria:
          curso.idCategoria ?? null,
        idUbicacion:
          curso.idUbicacion ?? null,
        idModalidad:
          curso.idModalidad ?? null,
        fechaInicio:
          curso.fechaInicio ?? "",
        fechaFin:
          curso.fechaFin ?? "",
        horario:
          curso.horario ?? "",
        dirigidoA:
          curso.dirigidoA || "Padres",
        cupoMaximo: numeroSeguro(
          curso.cupoMaximo,
          20,
        ),
        cuposOcupados: numeroSeguro(
          curso.cuposOcupados,
          0,
        ),
        costo:
          curso.costo !== null &&
          curso.costo !== undefined
            ? String(curso.costo)
            : "0.00",
        urlImagenPortada:
          curso.urlImagenPortada ?? "",
        activo:
          curso.activo ?? true,
      });
    } else {
      setFormData({
        ...FORM_DATA_INICIAL,
      });
    }

    setErrors({});
    setErrorGeneral(null);
    setSaving(false);

    const temporizador =
      window.setTimeout(() => {
        primerCampoRef.current?.focus();
      }, 150);

    return () => {
      window.clearTimeout(temporizador);
    };
  }, [curso, isOpen]);

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
          '[data-curso-form-modal="true"]',
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

  function buildCursoSubmitInput(
    data: CursoFormData,
    editing: boolean,
  ): CursoSubmitInput {
    const baseInput: CrearCursoInput = {
      tituloCurso:
        data.tituloCurso.trim(),

      descripcion:
        textoSeguro(data.descripcion) ||
        null,

      idInstructor: Number(
        data.idInstructor,
      ),

      idCategoria: Number(
        data.idCategoria,
      ),

      idUbicacion:
        data.idUbicacion ?? null,

      idModalidad: Number(
        data.idModalidad,
      ),

      fechaInicio: data.fechaInicio,
      fechaFin: data.fechaFin,

      horario:
        textoSeguro(data.horario) ||
        null,

      dirigidoA: data.dirigidoA,

      cupoMaximo: numeroSeguro(
        data.cupoMaximo,
      ),

      costo:
        String(data.costo || "0.00"),

      urlImagenPortada:
        textoSeguro(
          data.urlImagenPortada,
        ) || null,
    };

    if (!editing) {
      return baseInput;
    }

    return {
      ...baseInput,
      activo: data.activo,
    };
  }

  const validarFormulario =
    (): boolean => {
      const nuevosErrores:
        ErroresFormulario = {};

      const costoNumero = Number(
        formData.costo,
      );

      const cupoMaximo = numeroSeguro(
        formData.cupoMaximo,
      );

      const cuposOcupados =
        numeroSeguro(
          formData.cuposOcupados,
        );

      if (
        !formData.tituloCurso.trim()
      ) {
        nuevosErrores.tituloCurso =
          "El título del curso es obligatorio.";
      }

      if (!formData.idInstructor) {
        nuevosErrores.idInstructor =
          "Selecciona un instructor.";
      }

      if (!formData.idCategoria) {
        nuevosErrores.idCategoria =
          "Selecciona una categoría.";
      }

      if (!formData.idModalidad) {
        nuevosErrores.idModalidad =
          "Selecciona una modalidad.";
      }

      if (!formData.fechaInicio) {
        nuevosErrores.fechaInicio =
          "La fecha de inicio es obligatoria.";
      }

      if (!formData.fechaFin) {
        nuevosErrores.fechaFin =
          "La fecha final es obligatoria.";
      }

      if (
        formData.fechaInicio &&
        formData.fechaFin &&
        formData.fechaInicio >
          formData.fechaFin
      ) {
        nuevosErrores.fechaFin =
          "La fecha final debe ser igual o posterior a la fecha de inicio.";
      }

      if (cupoMaximo <= 0) {
        nuevosErrores.cupoMaximo =
          "El cupo máximo debe ser mayor que cero.";
      }

      if (
        esEdicion &&
        cupoMaximo < cuposOcupados
      ) {
        nuevosErrores.cupoMaximo =
          `El cupo máximo no puede ser menor que los ${cuposOcupados} lugares ocupados.`;
      }

      if (
        !Number.isFinite(costoNumero) ||
        costoNumero < 0
      ) {
        nuevosErrores.costo =
          "El costo debe ser un número mayor o igual que cero.";
      }

      setErrors(nuevosErrores);

      return (
        Object.keys(nuevosErrores)
          .length === 0
      );
    };

  const limpiarErrorCampo = (
    campo: keyof CursoFormData,
  ) => {
    if (!errors[campo]) {
      return;
    }

    setErrors((erroresActuales) => ({
      ...erroresActuales,
      [campo]: undefined,
    }));
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
      name as keyof CursoFormData;

    setFormData(
      (datosActuales) =>
        ({
          ...datosActuales,
          [campo]: value,
        }) as CursoFormData,
    );

    limpiarErrorCampo(campo);
    setErrorGeneral(null);
  };

  const handleNullableIdChange = (
    event: ChangeEvent<HTMLSelectElement>,
  ) => {
    const { name, value } =
      event.target;

    const campo =
      name as keyof CursoFormData;

    const valor =
      value === ""
        ? null
        : Number(value);

    setFormData(
      (datosActuales) =>
        ({
          ...datosActuales,
          [campo]: valor,
        }) as CursoFormData,
    );

    limpiarErrorCampo(campo);
    setErrorGeneral(null);
  };

  const handleNumberChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } =
      event.target;

    const campo =
      name as keyof CursoFormData;

    const valor =
      value === ""
        ? 0
        : Number(value);

    setFormData(
      (datosActuales) =>
        ({
          ...datosActuales,
          [campo]: Number.isFinite(valor)
            ? valor
            : 0,
        }) as CursoFormData,
    );

    limpiarErrorCampo(campo);
    setErrorGeneral(null);
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
        urlImagenPortada: asset.url,
      }),
    );

    setErrorGeneral(null);
  };

  const eliminarImagen = () => {
    setFormData(
      (datosActuales) => ({
        ...datosActuales,
        urlImagenPortada: "",
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

  const abrirPredictorPrecio = () => {
    if (
      !onOpenPricePredictor ||
      saving ||
      loadingData
    ) {
      return;
    }

    onOpenPricePredictor({
      ...formData,
    });
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
      const cursoData =
        buildCursoSubmitInput(
          formData,
          esEdicion,
        );

      await onSave(cursoData);
    } catch (error: unknown) {
      console.error(
        "Error al guardar curso:",
        error,
      );

      setErrorGeneral(
        error instanceof Error
          ? error.message
          : "No fue posible guardar la información del curso.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (
    !isOpen ||
    !mounted
  ) {
    return null;
  }

  const cuposOcupados = numeroSeguro(
    formData.cuposOcupados,
  );

  const cupoMaximo = numeroSeguro(
    formData.cupoMaximo,
  );

  const porcentajeOcupacion =
    cupoMaximo > 0
      ? Math.min(
          100,
          Math.round(
            (cuposOcupados /
              cupoMaximo) *
              100,
          ),
        )
      : 0;

  const modal = (
    <div
      data-curso-form-modal="true"
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
        aria-label="Cerrar formulario de curso"
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
                <GraduationCap
                  size={21}
                  strokeWidth={1.9}
                  aria-hidden="true"
                />
              </span>

              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
                  Gestión académica
                </p>

                <h2
                  id={tituloModalId}
                  className="mt-1 break-words text-lg font-extrabold leading-tight text-[#0A3D62] sm:text-xl"
                >
                  {esEdicion
                    ? "Editar curso"
                    : "Registrar curso"}
                </h2>

                <p
                  id={descripcionModalId}
                  className="mt-1 max-w-2xl text-xs leading-5 text-gray-500"
                >
                  {esEdicion
                    ? "Actualiza la información académica, capacidad y precio del curso."
                    : "Captura la información necesaria para publicar el nuevo curso."}
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

                {catalogosError && (
                  <div className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-start gap-3 text-amber-800">
                      <CircleAlert
                        size={17}
                        className="mt-0.5 shrink-0"
                        aria-hidden="true"
                      />

                      <p className="break-words text-xs font-semibold leading-5">
                        {catalogosError}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        void cargarCatalogos();
                      }}
                      disabled={loadingData}
                      className="inline-flex min-h-9 shrink-0 items-center justify-center gap-2 rounded-lg border border-amber-300 bg-white px-3 py-2 text-xs font-extrabold text-amber-800 transition-colors hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <RefreshCw
                        size={14}
                        className={cn(
                          loadingData &&
                            "animate-spin",
                        )}
                        aria-hidden="true"
                      />

                      Reintentar
                    </button>
                  </div>
                )}

                <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                  <div className="border-b border-gray-100 bg-[#F8FAFC] px-4 py-3">
                    <EncabezadoSeccion
                      icono={
                        <ImageIcon
                          size={17}
                          aria-hidden="true"
                        />
                      }
                      titulo="Imagen de portada"
                      descripcion="Agrega una imagen representativa para identificar el curso."
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-[minmax(0,1fr)_190px] sm:items-start">
                    <CloudinaryUploader
                      onUpload={
                        handleImageUpload
                      }
                      preset="cursos_preset"
                      folder="centro-medico/cursos"
                      resourceType="image"
                      maxFiles={1}
                    />

                    <div className="flex justify-center sm:justify-end">
                      {formData.urlImagenPortada ? (
                        <div className="relative aspect-[4/3] w-full max-w-[180px] overflow-hidden rounded-2xl border border-[#FFC300]/40 bg-gray-100 shadow-sm">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={
                              formData.urlImagenPortada
                            }
                            alt={
                              formData.tituloCurso
                                ? `Vista previa de ${formData.tituloCurso}`
                                : "Vista previa del curso"
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
                            aria-label="Eliminar imagen de portada"
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
                          <GraduationCap
                            size={30}
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

                <section className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
                  <EncabezadoSeccion
                    icono={
                      <FileText
                        size={17}
                        aria-hidden="true"
                      />
                    }
                    titulo="Información general"
                    descripcion="Define el nombre y la descripción que se mostrarán a los usuarios."
                  />

                  <div className="space-y-4">
                    <div>
                      <EtiquetaCampo
                        htmlFor="curso-titulo"
                        requerido
                      >
                        Título del curso
                      </EtiquetaCampo>

                      <div className="relative">
                        <GraduationCap
                          size={17}
                          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0A3D62]"
                          aria-hidden="true"
                        />

                        <input
                          ref={
                            primerCampoRef
                          }
                          id="curso-titulo"
                          type="text"
                          name="tituloCurso"
                          value={
                            formData.tituloCurso
                          }
                          onChange={
                            handleChange
                          }
                          disabled={saving}
                          aria-invalid={Boolean(
                            errors.tituloCurso,
                          )}
                          className={cn(
                            claseCampoBase,
                            "pl-10 pr-3",
                            errors.tituloCurso
                              ? claseCampoError
                              : claseCampoNormal,
                          )}
                          placeholder="Ej. Taller de estimulación temprana"
                        />
                      </div>

                      <MensajeError
                        mensaje={
                          errors.tituloCurso
                        }
                      />
                    </div>

                    <div>
                      <EtiquetaCampo htmlFor="curso-descripcion">
                        Descripción
                      </EtiquetaCampo>

                      <textarea
                        id="curso-descripcion"
                        name="descripcion"
                        value={
                          formData.descripcion ??
                          ""
                        }
                        onChange={handleChange}
                        disabled={saving}
                        rows={4}
                        className={cn(
                          claseCampoBase,
                          claseCampoNormal,
                          "resize-y py-3 leading-6",
                        )}
                        placeholder="Describe el contenido, los objetivos y beneficios del curso."
                      />
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
                  <EncabezadoSeccion
                    icono={
                      <Tag
                        size={17}
                        aria-hidden="true"
                      />
                    }
                    titulo="Clasificación académica"
                    descripcion="Relaciona el curso con sus catálogos académicos y su lugar de impartición."
                  />

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <EtiquetaCampo
                        htmlFor="curso-instructor"
                        requerido
                      >
                        Instructor
                      </EtiquetaCampo>

                      <div className="relative">
                        <User
                          size={17}
                          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0A3D62]"
                          aria-hidden="true"
                        />

                        <select
                          id="curso-instructor"
                          name="idInstructor"
                          value={
                            formData.idInstructor ??
                            ""
                          }
                          onChange={
                            handleNullableIdChange
                          }
                          disabled={
                            saving ||
                            loadingData
                          }
                          aria-invalid={Boolean(
                            errors.idInstructor,
                          )}
                          className={cn(
                            claseCampoBase,
                            "cursor-pointer pl-10 pr-3",
                            errors.idInstructor
                              ? claseCampoError
                              : claseCampoNormal,
                          )}
                        >
                          <option value="">
                            {loadingData
                              ? "Cargando instructores..."
                              : "Selecciona un instructor"}
                          </option>

                          {instructores.map(
                            (instructor) => {
                              const nombre = [
                                instructor.nombre,
                                instructor.apellidoPaterno,
                                instructor.apellidoMaterno,
                              ]
                                .filter(Boolean)
                                .join(" ");

                              return (
                                <option
                                  key={
                                    instructor.idInstructor
                                  }
                                  value={
                                    instructor.idInstructor
                                  }
                                >
                                  {nombre}
                                  {instructor.especialidad
                                    ? ` — ${instructor.especialidad}`
                                    : ""}
                                </option>
                              );
                            },
                          )}
                        </select>
                      </div>

                      <MensajeError
                        mensaje={
                          errors.idInstructor
                        }
                      />
                    </div>

                    <div>
                      <EtiquetaCampo
                        htmlFor="curso-categoria"
                        requerido
                      >
                        Categoría
                      </EtiquetaCampo>

                      <div className="relative">
                        <Tag
                          size={17}
                          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0A3D62]"
                          aria-hidden="true"
                        />

                        <select
                          id="curso-categoria"
                          name="idCategoria"
                          value={
                            formData.idCategoria ??
                            ""
                          }
                          onChange={
                            handleNullableIdChange
                          }
                          disabled={
                            saving ||
                            loadingData
                          }
                          aria-invalid={Boolean(
                            errors.idCategoria,
                          )}
                          className={cn(
                            claseCampoBase,
                            "cursor-pointer pl-10 pr-3",
                            errors.idCategoria
                              ? claseCampoError
                              : claseCampoNormal,
                          )}
                        >
                          <option value="">
                            {loadingData
                              ? "Cargando categorías..."
                              : "Selecciona una categoría"}
                          </option>

                          {categorias.map(
                            (categoria) => (
                              <option
                                key={
                                  categoria.idCategoria
                                }
                                value={
                                  categoria.idCategoria
                                }
                              >
                                {
                                  categoria.nombreCategoria
                                }
                              </option>
                            ),
                          )}
                        </select>
                      </div>

                      <MensajeError
                        mensaje={
                          errors.idCategoria
                        }
                      />
                    </div>

                    <div>
                      <EtiquetaCampo
                        htmlFor="curso-modalidad"
                        requerido
                      >
                        Modalidad
                      </EtiquetaCampo>

                      <div className="relative">
                        <Monitor
                          size={17}
                          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0A3D62]"
                          aria-hidden="true"
                        />

                        <select
                          id="curso-modalidad"
                          name="idModalidad"
                          value={
                            formData.idModalidad ??
                            ""
                          }
                          onChange={
                            handleNullableIdChange
                          }
                          disabled={
                            saving ||
                            loadingData
                          }
                          aria-invalid={Boolean(
                            errors.idModalidad,
                          )}
                          className={cn(
                            claseCampoBase,
                            "cursor-pointer pl-10 pr-3",
                            errors.idModalidad
                              ? claseCampoError
                              : claseCampoNormal,
                          )}
                        >
                          <option value="">
                            {loadingData
                              ? "Cargando modalidades..."
                              : "Selecciona una modalidad"}
                          </option>

                          {modalidades.map(
                            (modalidad) => (
                              <option
                                key={
                                  modalidad.idModalidad
                                }
                                value={
                                  modalidad.idModalidad
                                }
                              >
                                {capitalizar(
                                  modalidad.nombreModalidad,
                                )}
                              </option>
                            ),
                          )}
                        </select>
                      </div>

                      <MensajeError
                        mensaje={
                          errors.idModalidad
                        }
                      />
                    </div>

                    <div>
                      <EtiquetaCampo htmlFor="curso-ubicacion">
                        Ubicación
                      </EtiquetaCampo>

                      <div className="relative">
                        <MapPin
                          size={17}
                          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0A3D62]"
                          aria-hidden="true"
                        />

                        <select
                          id="curso-ubicacion"
                          name="idUbicacion"
                          value={
                            formData.idUbicacion ??
                            ""
                          }
                          onChange={
                            handleNullableIdChange
                          }
                          disabled={
                            saving ||
                            loadingData
                          }
                          className={cn(
                            claseCampoBase,
                            claseCampoNormal,
                            "cursor-pointer pl-10 pr-3",
                          )}
                        >
                          <option value="">
                            Sin ubicación definida
                          </option>

                          {ubicaciones.map(
                            (ubicacion) => (
                              <option
                                key={
                                  ubicacion.idUbicacion
                                }
                                value={
                                  ubicacion.idUbicacion
                                }
                              >
                                {
                                  ubicacion.nombreUbicacion
                                }
                              </option>
                            ),
                          )}
                        </select>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
                  <EncabezadoSeccion
                    icono={
                      <Calendar
                        size={17}
                        aria-hidden="true"
                      />
                    }
                    titulo="Programación"
                    descripcion="Establece el periodo, horario y público al que está dirigido el curso."
                  />

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <EtiquetaCampo
                        htmlFor="curso-fecha-inicio"
                        requerido
                      >
                        Fecha de inicio
                      </EtiquetaCampo>

                      <div className="relative">
                        <Calendar
                          size={17}
                          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0A3D62]"
                          aria-hidden="true"
                        />

                        <input
                          id="curso-fecha-inicio"
                          type="date"
                          name="fechaInicio"
                          value={
                            formData.fechaInicio
                          }
                          onChange={
                            handleChange
                          }
                          disabled={saving}
                          max={
                            formData.fechaFin ||
                            undefined
                          }
                          aria-invalid={Boolean(
                            errors.fechaInicio,
                          )}
                          className={cn(
                            claseCampoBase,
                            "pl-10 pr-3",
                            errors.fechaInicio
                              ? claseCampoError
                              : claseCampoNormal,
                          )}
                        />
                      </div>

                      <MensajeError
                        mensaje={
                          errors.fechaInicio
                        }
                      />
                    </div>

                    <div>
                      <EtiquetaCampo
                        htmlFor="curso-fecha-fin"
                        requerido
                      >
                        Fecha final
                      </EtiquetaCampo>

                      <div className="relative">
                        <Calendar
                          size={17}
                          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0A3D62]"
                          aria-hidden="true"
                        />

                        <input
                          id="curso-fecha-fin"
                          type="date"
                          name="fechaFin"
                          value={
                            formData.fechaFin
                          }
                          onChange={
                            handleChange
                          }
                          disabled={saving}
                          min={
                            formData.fechaInicio ||
                            undefined
                          }
                          aria-invalid={Boolean(
                            errors.fechaFin,
                          )}
                          className={cn(
                            claseCampoBase,
                            "pl-10 pr-3",
                            errors.fechaFin
                              ? claseCampoError
                              : claseCampoNormal,
                          )}
                        />
                      </div>

                      <MensajeError
                        mensaje={
                          errors.fechaFin
                        }
                      />
                    </div>

                    <div>
                      <EtiquetaCampo htmlFor="curso-horario">
                        Horario
                      </EtiquetaCampo>

                      <div className="relative">
                        <Clock
                          size={17}
                          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0A3D62]"
                          aria-hidden="true"
                        />

                        <input
                          id="curso-horario"
                          type="text"
                          name="horario"
                          value={
                            formData.horario ??
                            ""
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
                          placeholder="Ej. Lunes de 10:00 a 12:00"
                        />
                      </div>
                    </div>

                    <div>
                      <EtiquetaCampo htmlFor="curso-dirigido-a">
                        Dirigido a
                      </EtiquetaCampo>

                      <select
                        id="curso-dirigido-a"
                        name="dirigidoA"
                        value={
                          formData.dirigidoA
                        }
                        onChange={handleChange}
                        disabled={saving}
                        className={cn(
                          claseCampoBase,
                          claseCampoNormal,
                          "cursor-pointer",
                        )}
                      >
                        <option value="Padres">
                          Padres
                        </option>

                        <option value="Niños">
                          Niños
                        </option>

                        <option value="Familia">
                          Familia
                        </option>

                        <option value="Adolescentes">
                          Adolescentes
                        </option>
                      </select>
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
                  <EncabezadoSeccion
                    icono={
                      <DollarSign
                        size={17}
                        aria-hidden="true"
                      />
                    }
                    titulo="Capacidad y precio"
                    descripcion="Define el número de lugares y el precio comercial del curso."
                  />

                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <div>
                      <EtiquetaCampo
                        htmlFor="curso-cupo-maximo"
                        requerido
                      >
                        Cupo máximo
                      </EtiquetaCampo>

                      <div className="relative">
                        <Users
                          size={17}
                          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0A3D62]"
                          aria-hidden="true"
                        />

                        <input
                          id="curso-cupo-maximo"
                          type="number"
                          name="cupoMaximo"
                          value={
                            formData.cupoMaximo
                          }
                          onChange={
                            handleNumberChange
                          }
                          disabled={saving}
                          min={1}
                          step={1}
                          aria-invalid={Boolean(
                            errors.cupoMaximo,
                          )}
                          className={cn(
                            claseCampoBase,
                            "pl-10 pr-3",
                            errors.cupoMaximo
                              ? claseCampoError
                              : claseCampoNormal,
                          )}
                        />
                      </div>

                      <MensajeError
                        mensaje={
                          errors.cupoMaximo
                        }
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between gap-3">
                        <EtiquetaCampo htmlFor="curso-costo">
                          Costo
                        </EtiquetaCampo>

                        <span className="mb-2 text-[10px] font-bold uppercase tracking-wide text-gray-400">
                          MXN
                        </span>
                      </div>

                      <div className="relative">
                        <DollarSign
                          size={17}
                          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0A3D62]"
                          aria-hidden="true"
                        />

                        <input
                          id="curso-costo"
                          type="number"
                          name="costo"
                          value={
                            formData.costo
                          }
                          onChange={
                            handleChange
                          }
                          disabled={saving}
                          min={0}
                          step="0.01"
                          aria-invalid={Boolean(
                            errors.costo,
                          )}
                          className={cn(
                            claseCampoBase,
                            "pl-10 pr-3",
                            errors.costo
                              ? claseCampoError
                              : claseCampoNormal,
                          )}
                          placeholder="0.00"
                        />
                      </div>

                      <MensajeError
                        mensaje={errors.costo}
                      />
                    </div>
                  </div>

                  {onOpenPricePredictor && (
                    <div className="mt-5 overflow-hidden rounded-2xl border border-[#0A3D62]/15 bg-[#F2F7FA]">
                      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 items-start gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0A3D62] text-[#FFC300]">
                            <Calculator
                              size={19}
                              aria-hidden="true"
                            />
                          </span>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="text-sm font-extrabold text-[#0A3D62]">
                                Predictor de precio
                              </h4>

                              <span className="rounded-full bg-[#FFC300] px-2 py-1 text-[9px] font-extrabold uppercase tracking-wide text-[#0A3D62]">
                                Modelo predictivo
                              </span>
                            </div>

                            <p className="mt-1 max-w-xl text-xs leading-5 text-gray-600">
                              Utiliza la información capturada para obtener un precio sugerido. El curso no necesita estar guardado.
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={
                            abrirPredictorPrecio
                          }
                          disabled={
                            saving ||
                            loadingData
                          }
                          className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-[#0A3D62] bg-white px-4 py-2 text-xs font-extrabold text-[#0A3D62] transition-colors hover:bg-[#0A3D62] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400"
                        >
                          <Sparkles
                            size={16}
                            aria-hidden="true"
                          />

                          Estimar precio
                        </button>
                      </div>
                    </div>
                  )}

                  {esEdicion && (
                    <div className="mt-5 rounded-xl border border-gray-200 bg-[#F8FAFC] p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-xs font-extrabold text-[#0A3D62]">
                            Ocupación actual
                          </p>

                          <p className="mt-1 text-xs leading-5 text-gray-500">
                            {cuposOcupados} de{" "}
                            {cupoMaximo} lugares
                            ocupados.
                          </p>
                        </div>

                        <span className="shrink-0 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-extrabold text-[#0A3D62]">
                          {porcentajeOcupacion}%
                        </span>
                      </div>

                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200">
                        <div
                          className={cn(
                            "h-full rounded-full transition-[width]",
                            porcentajeOcupacion >=
                              100
                              ? "bg-red-500"
                              : porcentajeOcupacion >=
                                  80
                                ? "bg-amber-500"
                                : "bg-emerald-500",
                          )}
                          style={{
                            width: `${porcentajeOcupacion}%`,
                          }}
                        />
                      </div>

                      <p className="mt-3 text-[11px] leading-5 text-gray-400">
                        Los lugares ocupados se actualizan mediante compras, inscripciones y cancelaciones.
                      </p>
                    </div>
                  )}
                </section>

                {esEdicion && (
                  <section className="rounded-2xl border border-[#FFC300]/35 bg-[#FFF9E6] p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <h3 className="text-sm font-extrabold text-[#0A3D62]">
                          Estado del curso
                        </h3>

                        <p className="mt-1 text-xs leading-5 text-gray-600">
                          Los cursos inactivos permanecen registrados, pero no se muestran como disponibles.
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
                          aria-label="Cambiar estado del curso"
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
                  disabled={
                    saving ||
                    loadingData ||
                    Boolean(catalogosError)
                  }
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
                      : "Registrar curso"}
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