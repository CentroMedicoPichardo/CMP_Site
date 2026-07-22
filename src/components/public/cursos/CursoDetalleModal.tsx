"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  GraduationCap,
  Laptop,
  MapPinned,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";

import { getApiErrorMessage } from "@/types/api";
import type {
  CrearCompraCursoInput,
  CrearCompraCursoResponse,
  SexoParticipante,
} from "@/types/compras-cursos";
import type { VerificarInscripcionCursoResponse } from "@/types/cursos";

interface CursoDetalleProps {
  id: string | number;
  titulo: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  inscripcionesAbiertas: boolean;
  cupoMaximo: number;
  cupoInscrito: number;
  instructor: string;
  horario: string;
  modalidad: "Online" | "Presencial" | "Híbrido";
  dirigidoA: string;
  imagenSrc?: string;
  costo: number | "Gratuito";
  ubicacion?: string;
  lugaresDisponibles: number;
}

interface CursoDetalleModalProps {
  isOpen: boolean;
  onClose: () => void;
  curso: CursoDetalleProps;
}

interface UsuarioSesion {
  id: number;
  nombre: string;
  email: string;
  rol: string;
}

interface AuthUsuario {
  id?: number | string;
  nombre?: string;
  nombreCompleto?: string;
  correo?: string;
  email?: string;
  rol?: string;
}

interface AuthVerificarResponse {
  loggedIn?: boolean;
  usuario?: AuthUsuario;
}

interface MensajeEstado {
  type: "success" | "error";
  text: string;
}

interface ParticipanteFormData {
  localId: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: string;
  sexo: SexoParticipante | "";
  telefono: string;
  correo: string;
}

interface CompraFormData {
  cantidadCupos: number;
  participantes: ParticipanteFormData[];
  observaciones: string;
}

function cn(
  ...clases: Array<string | false | null | undefined>
): string {
  return clases.filter(Boolean).join(" ");
}

function crearParticipanteVacio(
  localId: number,
  correo = "",
): ParticipanteFormData {
  return {
    localId,
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    fechaNacimiento: "",
    sexo: "",
    telefono: "",
    correo,
  };
}

function crearFormularioInicial(): CompraFormData {
  return {
    cantidadCupos: 1,
    participantes: [crearParticipanteVacio(1)],
    observaciones: "",
  };
}

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

async function readJsonResponse(
  response: Response,
): Promise<unknown> {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

function parseAuthResponse(
  value: unknown,
): AuthVerificarResponse {
  if (!isRecord(value)) {
    return {};
  }

  const usuario = isRecord(value.usuario)
    ? (value.usuario as AuthUsuario)
    : undefined;

  return {
    loggedIn:
      typeof value.loggedIn === "boolean"
        ? value.loggedIn
        : false,
    usuario,
  };
}

function parseUsuarioSesion(
  usuario: AuthUsuario,
): UsuarioSesion | null {
  const id = Number(usuario.id);

  if (!Number.isSafeInteger(id) || id <= 0) {
    return null;
  }

  const nombre =
    typeof usuario.nombreCompleto === "string" &&
    usuario.nombreCompleto.trim()
      ? usuario.nombreCompleto.trim()
      : typeof usuario.nombre === "string" &&
          usuario.nombre.trim()
        ? usuario.nombre.trim()
        : "Usuario";

  const email =
    typeof usuario.correo === "string"
      ? usuario.correo
      : typeof usuario.email === "string"
        ? usuario.email
        : "";

  return {
    id,
    nombre,
    email,
    rol:
      typeof usuario.rol === "string"
        ? usuario.rol
        : "cliente",
  };
}

function parseVerificarInscripcionResponse(
  value: unknown,
): VerificarInscripcionCursoResponse | null {
  if (!isRecord(value)) {
    return null;
  }

  if (
    typeof value.autenticado !== "boolean" ||
    typeof value.inscrito !== "boolean" ||
    typeof value.cantidadInscripciones !== "number" ||
    !Array.isArray(value.inscripciones)
  ) {
    return null;
  }

  return value as unknown as VerificarInscripcionCursoResponse;
}

function parseCrearCompraResponse(
  value: unknown,
): CrearCompraCursoResponse | null {
  if (
    !isRecord(value) ||
    !isRecord(value.compra) ||
    typeof value.compra.idCompra !== "number" ||
    !Number.isSafeInteger(value.compra.idCompra) ||
    value.compra.idCompra <= 0 ||
    !Array.isArray(value.participantes)
  ) {
    return null;
  }

  return value as unknown as CrearCompraCursoResponse;
}

function fechaMaximaNacimiento(): string {
  return new Date().toISOString().split("T")[0] ?? "";
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(value);
}

export function CursoDetalleModal({
  isOpen,
  onClose,
  curso,
}: CursoDetalleModalProps) {
  const router = useRouter();

  const [creandoCompra, setCreandoCompra] =
    useState(false);
  const [mensaje, setMensaje] =
    useState<MensajeEstado | null>(null);
  const [usuarioLogueado, setUsuarioLogueado] =
    useState<UsuarioSesion | null>(null);
  const [yaInscrito, setYaInscrito] =
    useState(false);
  const [view, setView] =
    useState<"detalle" | "formulario">("detalle");
  const [formData, setFormData] =
    useState<CompraFormData>(
      crearFormularioInicial,
    );

  const requestControllerRef =
    useRef<AbortController | null>(null);
  const mensajeTimeoutRef =
    useRef<ReturnType<typeof setTimeout> | null>(
      null,
    );
  const siguienteParticipanteIdRef =
    useRef(2);

  const cuposDisponibles = Math.max(
    0,
    Number(curso.lugaresDisponibles) || 0,
  );

  const porcentajeLlenado =
    curso.cupoMaximo > 0
      ? Math.min(
          Math.max(
            (curso.cupoInscrito /
              curso.cupoMaximo) *
              100,
            0,
          ),
          100,
        )
      : 0;

  const precioUnitario =
    curso.costo === "Gratuito"
      ? 0
      : curso.costo;

  const totalCompra = useMemo(
    () =>
      precioUnitario *
      formData.cantidadCupos,
    [
      precioUnitario,
      formData.cantidadCupos,
    ],
  );

  const costoMostrar =
    curso.costo === "Gratuito"
      ? "Gratis"
      : formatCurrency(curso.costo);

  const periodoCurso =
    curso.fechaFin &&
    curso.fechaFin !== curso.fechaInicio
      ? `${curso.fechaInicio} – ${curso.fechaFin}`
      : curso.fechaInicio;

  const mostrarMensajeTemporal = useCallback(
    (
      nuevoMensaje: MensajeEstado,
      duration = 3000,
    ) => {
      if (mensajeTimeoutRef.current) {
        clearTimeout(
          mensajeTimeoutRef.current,
        );
      }

      setMensaje(nuevoMensaje);

      mensajeTimeoutRef.current = setTimeout(
        () => {
          setMensaje(null);
          mensajeTimeoutRef.current = null;
        },
        duration,
      );
    },
    [],
  );

  const verificarLoginYInscripcion =
    useCallback(
      async (signal: AbortSignal) => {
        try {
          const authResponse = await fetch(
            "/api/auth/verificar",
            {
              signal,
              credentials: "include",
              cache: "no-store",
            },
          );

          const authPayload =
            await readJsonResponse(authResponse);

          if (!authResponse.ok) {
            setUsuarioLogueado(null);
            setYaInscrito(false);
            return;
          }

          const authData =
            parseAuthResponse(authPayload);

          if (
            !authData.loggedIn ||
            !authData.usuario
          ) {
            setUsuarioLogueado(null);
            setYaInscrito(false);
            return;
          }

          const usuario = parseUsuarioSesion(
            authData.usuario,
          );

          if (!usuario) {
            setUsuarioLogueado(null);
            setYaInscrito(false);
            return;
          }

          setUsuarioLogueado(usuario);

          const inscripcionResponse =
            await fetch(
              `/api/cursos/verificar-inscripcion?cursoId=${encodeURIComponent(
                String(curso.id),
              )}`,
              {
                signal,
                credentials: "include",
                cache: "no-store",
              },
            );

          const inscripcionPayload =
            await readJsonResponse(
              inscripcionResponse,
            );

          if (!inscripcionResponse.ok) {
            throw new Error(
              getApiErrorMessage(
                inscripcionPayload,
                "No fue posible verificar la inscripción",
              ),
            );
          }

          const resultado =
            parseVerificarInscripcionResponse(
              inscripcionPayload,
            );

          if (!resultado) {
            throw new Error(
              "La respuesta de verificación no es válida",
            );
          }

          setYaInscrito(resultado.inscrito);
        } catch (error: unknown) {
          if (
            error instanceof DOMException &&
            error.name === "AbortError"
          ) {
            return;
          }

          console.error(
            "Error verificando login e inscripción:",
            error,
          );

          setYaInscrito(false);
        }
      },
      [curso.id],
    );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const controller = new AbortController();

    void verificarLoginYInscripcion(
      controller.signal,
    );

    return () => {
      controller.abort();
    };
  }, [
    isOpen,
    verificarLoginYInscripcion,
  ]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const overflowAnterior =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (
        event.key === "Escape" &&
        !creandoCompra
      ) {
        requestControllerRef.current?.abort();
        setView("detalle");
        setFormData(
          crearFormularioInicial(),
        );
        setMensaje(null);
        siguienteParticipanteIdRef.current = 2;
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.body.style.overflow =
        overflowAnterior;

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    creandoCompra,
    isOpen,
    onClose,
  ]);

  useEffect(() => {
    return () => {
      requestControllerRef.current?.abort();

      if (mensajeTimeoutRef.current) {
        clearTimeout(
          mensajeTimeoutRef.current,
        );
      }
    };
  }, []);

  const resetModalState = () => {
    setView("detalle");
    setFormData(
      crearFormularioInicial(),
    );
    setMensaje(null);
    setCreandoCompra(false);
    siguienteParticipanteIdRef.current = 2;
  };

  const handleClose = () => {
    requestControllerRef.current?.abort();
    resetModalState();
    onClose();
  };

  const handlePrepararCompra = () => {
    if (!usuarioLogueado) {
      router.push(
        "/acceder?redirect=/cursos",
      );
      return;
    }

    if (!curso.inscripcionesAbiertas) {
      mostrarMensajeTemporal({
        type: "error",
        text: "Las inscripciones están cerradas",
      });
      return;
    }

    if (cuposDisponibles <= 0) {
      mostrarMensajeTemporal({
        type: "error",
        text: "No hay cupos disponibles",
      });
      return;
    }

    setFormData((previous) => ({
      ...previous,
      participantes:
        previous.participantes.map(
          (participante, index) =>
            index === 0 &&
            !participante.correo
              ? {
                  ...participante,
                  correo:
                    usuarioLogueado.email,
                }
              : participante,
        ),
    }));

    setMensaje(null);
    setView("formulario");
  };

  const ajustarCantidadCupos = (
    nuevaCantidad: number,
  ) => {
    const cantidadValida = Math.min(
      Math.max(1, nuevaCantidad),
      cuposDisponibles,
    );

    setFormData((previous) => {
      const participantesActuales =
        previous.participantes;

      if (
        cantidadValida ===
        participantesActuales.length
      ) {
        return {
          ...previous,
          cantidadCupos: cantidadValida,
        };
      }

      if (
        cantidadValida <
        participantesActuales.length
      ) {
        return {
          ...previous,
          cantidadCupos: cantidadValida,
          participantes:
            participantesActuales.slice(
              0,
              cantidadValida,
            ),
        };
      }

      const nuevosParticipantes =
        Array.from(
          {
            length:
              cantidadValida -
              participantesActuales.length,
          },
          () => {
            const localId =
              siguienteParticipanteIdRef.current;

            siguienteParticipanteIdRef.current += 1;

            return crearParticipanteVacio(
              localId,
            );
          },
        );

      return {
        ...previous,
        cantidadCupos: cantidadValida,
        participantes: [
          ...participantesActuales,
          ...nuevosParticipantes,
        ],
      };
    });

    setMensaje(null);
  };

  const agregarParticipante = () => {
    if (
      formData.cantidadCupos >=
      cuposDisponibles
    ) {
      mostrarMensajeTemporal({
        type: "error",
        text: "No hay más cupos disponibles para este curso",
      });
      return;
    }

    ajustarCantidadCupos(
      formData.cantidadCupos + 1,
    );
  };

  const eliminarParticipante = (
    localId: number,
  ) => {
    if (
      formData.participantes.length <= 1
    ) {
      return;
    }

    setFormData((previous) => {
      const participantes =
        previous.participantes.filter(
          (participante) =>
            participante.localId !== localId,
        );

      return {
        ...previous,
        cantidadCupos:
          participantes.length,
        participantes,
      };
    });

    setMensaje(null);
  };

  const handleParticipanteChange = (
    localId: number,
    field: keyof Omit<
      ParticipanteFormData,
      "localId"
    >,
    value: string,
  ) => {
    setFormData((previous) => ({
      ...previous,
      participantes:
        previous.participantes.map(
          (participante) =>
            participante.localId === localId
              ? {
                  ...participante,
                  [field]: value,
                }
              : participante,
        ),
    }));

    setMensaje(null);
  };

  const validarFormulario = ():
    | string
    | null => {
    if (
      formData.cantidadCupos < 1 ||
      formData.cantidadCupos >
        cuposDisponibles
    ) {
      return "La cantidad de cupos seleccionada no es válida";
    }

    if (
      formData.participantes.length !==
      formData.cantidadCupos
    ) {
      return "Debe existir un participante por cada cupo";
    }

    for (
      let index = 0;
      index <
      formData.participantes.length;
      index += 1
    ) {
      const participante =
        formData.participantes[index];

      if (!participante) {
        return `Faltan los datos del participante ${index + 1}`;
      }

      if (!participante.nombre.trim()) {
        return `Captura el nombre del participante ${index + 1}`;
      }

      if (
        !participante.apellidoPaterno.trim()
      ) {
        return `Captura el apellido paterno del participante ${index + 1}`;
      }

      if (!participante.sexo) {
        return `Selecciona el sexo del participante ${index + 1}`;
      }

      if (
        participante.fechaNacimiento &&
        participante.fechaNacimiento >
          fechaMaximaNacimiento()
      ) {
        return `La fecha de nacimiento del participante ${index + 1} no es válida`;
      }
    }

    return null;
  };

  const confirmarCompra = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const errorValidacion =
      validarFormulario();

    if (errorValidacion) {
      setMensaje({
        type: "error",
        text: errorValidacion,
      });
      return;
    }

    const cursoId = Number(curso.id);

    if (
      !Number.isSafeInteger(cursoId) ||
      cursoId <= 0
    ) {
      setMensaje({
        type: "error",
        text: "El curso seleccionado no es válido",
      });
      return;
    }

    requestControllerRef.current?.abort();

    const controller =
      new AbortController();

    requestControllerRef.current =
      controller;

    setCreandoCompra(true);
    setMensaje(null);

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 30000);

    try {
      const participantes =
        formData.participantes.map(
          (participante) => {
            if (!participante.sexo) {
              throw new Error(
                "Todos los participantes deben tener un sexo seleccionado",
              );
            }

            return {
              participante: {
                nombre:
                  participante.nombre.trim(),
                apellidoPaterno:
                  participante.apellidoPaterno.trim(),
                apellidoMaterno:
                  participante.apellidoMaterno.trim() ||
                  null,
                fechaNacimiento:
                  participante.fechaNacimiento ||
                  null,
                sexo: participante.sexo,
                telefono:
                  participante.telefono.trim() ||
                  null,
                correo:
                  participante.correo.trim() ||
                  null,
              },
            };
          },
        );

      const input: CrearCompraCursoInput = {
        cursoId,
        cantidadCupos:
          formData.cantidadCupos,
        observacionesUsuario:
          formData.observaciones.trim() ||
          null,
        participantes,
      };

      const response = await fetch(
        "/api/compras-cursos",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          credentials: "include",
          signal: controller.signal,
          body: JSON.stringify(input),
        },
      );

      const payload =
        await readJsonResponse(response);

      if (!response.ok) {
        throw new Error(
          getApiErrorMessage(
            payload,
            "No fue posible crear la compra",
          ),
        );
      }

      const result =
        parseCrearCompraResponse(payload);

      if (!result) {
        throw new Error(
          "La respuesta de la compra no es válida",
        );
      }

      setMensaje({
        type: "success",
        text: "Compra creada correctamente. Redirigiendo al pago...",
      });

      router.push(
        `/mis-compras/cursos/${result.compra.idCompra}`,
      );
    } catch (error: unknown) {
      const abortado =
        error instanceof DOMException &&
        error.name === "AbortError";

      setMensaje({
        type: "error",
        text: abortado
          ? "La solicitud fue cancelada o tardó demasiado. Intenta nuevamente."
          : error instanceof Error
            ? error.message
            : "No fue posible crear la compra",
      });
    } finally {
      clearTimeout(timeoutId);
      setCreandoCompra(false);

      if (
        requestControllerRef.current ===
        controller
      ) {
        requestControllerRef.current = null;
      }
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[99999]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="curso-modal-titulo"
    >
      <button
        type="button"
        className="absolute inset-0 h-full w-full cursor-default bg-[#061C2E]/80 backdrop-blur-sm"
        onClick={handleClose}
        aria-label="Cerrar modal"
      />

      <div className="relative flex min-h-full items-end justify-center sm:items-center sm:p-4">
        <div className="flex max-h-[96dvh] w-full max-w-6xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:max-h-[92vh] sm:rounded-3xl">
          {/* Barra superior */}
          <header className="relative z-30 flex shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 py-3 sm:px-5">
            <div className="flex min-w-0 items-center gap-2.5">
              {view === "formulario" && (
                <button
                  type="button"
                  onClick={() =>
                    setView("detalle")
                  }
                  disabled={creandoCompra}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-50"
                  aria-label="Regresar al detalle"
                >
                  <ArrowLeft
                    size={18}
                    aria-hidden="true"
                  />
                </button>
              )}

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EAF2F8] text-[#0A3D62]">
                {view === "detalle" ? (
                  <GraduationCap
                    size={19}
                    strokeWidth={1.9}
                    aria-hidden="true"
                  />
                ) : (
                  <ShoppingBag
                    size={18}
                    strokeWidth={1.9}
                    aria-hidden="true"
                  />
                )}
              </div>

              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-gray-400">
                  {view === "detalle"
                    ? "Información del curso"
                    : "Proceso de inscripción"}
                </p>

                <h2
                  id="curso-modal-titulo"
                  className="truncate text-base font-extrabold text-[#0A3D62] sm:text-lg"
                >
                  {view === "detalle"
                    ? "Detalle del curso"
                    : "Reservar lugares"}
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              disabled={creandoCompra}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
              aria-label="Cerrar"
            >
              <X
                size={19}
                aria-hidden="true"
              />
            </button>
          </header>

          {/* Contenido desplazable */}
          <div className="min-h-0 flex-1 overflow-y-auto">
            {view === "detalle" ? (
              <div className="grid lg:min-h-[570px] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
                {/* Imagen y descripción */}
                <div className="border-b border-gray-200 bg-[#E7EEF3] lg:border-b-0 lg:border-r">
                  <div className="relative h-56 overflow-hidden sm:h-72 lg:h-[390px]">
                    {curso.imagenSrc ? (
                      <>
                        <Image
                          src={curso.imagenSrc}
                          alt=""
                          fill
                          sizes="(max-width: 1024px) 100vw, 55vw"
                          className="scale-110 object-cover opacity-40 blur-xl"
                          aria-hidden="true"
                        />

                        <div
                          className="absolute inset-0 bg-[#0A3D62]/10"
                          aria-hidden="true"
                        />

                        <div className="absolute inset-3 overflow-hidden rounded-2xl sm:inset-4">
                          <Image
                            src={curso.imagenSrc}
                            alt={curso.titulo}
                            fill
                            priority
                            sizes="(max-width: 1024px) 100vw, 55vw"
                            className="object-contain object-center"
                          />
                        </div>
                      </>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#0A3D62] to-[#1A4F7A]">
                        <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-white/15 bg-white/10 text-white">
                          <GraduationCap
                            size={38}
                            strokeWidth={1.5}
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                    )}

                    <div
                      className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#061C2E]/85 to-transparent"
                      aria-hidden="true"
                    />

                    <div className="absolute left-3 top-3 flex flex-wrap gap-2 sm:left-4 sm:top-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFC300] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.1em] text-[#0A3D62] shadow-md">
                        <UsersRound
                          size={12}
                          strokeWidth={2}
                          aria-hidden="true"
                        />

                        {curso.dirigidoA}
                      </span>

                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-white shadow-md",
                          curso.inscripcionesAbiertas &&
                            cuposDisponibles > 0
                            ? "bg-emerald-600"
                            : "bg-gray-700",
                        )}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-white/80" />

                        {curso.inscripcionesAbiertas &&
                        cuposDisponibles > 0
                          ? "Inscripciones abiertas"
                          : "No disponible"}
                      </span>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                      <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#FFC300]">
                        Formación y aprendizaje
                      </span>

                      <h1 className="mt-1 line-clamp-2 text-xl font-extrabold leading-tight text-white sm:text-2xl">
                        {curso.titulo}
                      </h1>
                    </div>
                  </div>

                  <section className="bg-white p-4 sm:p-5">
                    <div className="flex items-center gap-2">
                      <BadgeCheck
                        size={17}
                        className="text-[#D69F00]"
                        strokeWidth={2}
                        aria-hidden="true"
                      />

                      <h3 className="text-sm font-extrabold text-[#0A3D62]">
                        Acerca del curso
                      </h3>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      {curso.descripcion}
                    </p>
                  </section>
                </div>

                {/* Información y acciones */}
                <div className="flex flex-col p-4 sm:p-5 lg:p-6">
                  <div className="grid grid-cols-2 gap-2.5">
                    <InfoCard
                      icon={
                        <CalendarDays
                          size={17}
                        />
                      }
                      label="Periodo"
                      value={periodoCurso}
                    />

                    <InfoCard
                      icon={<Clock3 size={17} />}
                      label="Horario"
                      value={curso.horario}
                    />

                    <InfoCard
                      icon={
                        <UserRound size={17} />
                      }
                      label="Instructor"
                      value={curso.instructor}
                    />

                    <InfoCard
                      icon={
                        curso.modalidad ===
                        "Online" ? (
                          <Laptop size={17} />
                        ) : (
                          <MapPinned size={17} />
                        )
                      }
                      label="Modalidad"
                      value={
                        curso.ubicacion
                          ? `${curso.modalidad} · ${curso.ubicacion}`
                          : curso.modalidad
                      }
                    />

                    <InfoCard
                      icon={
                        <UsersRound size={17} />
                      }
                      label="Disponibilidad"
                      value={`${cuposDisponibles} de ${curso.cupoMaximo}`}
                      valueClassName={
                        cuposDisponibles <= 0
                          ? "text-red-600"
                          : cuposDisponibles <= 5
                            ? "text-amber-600"
                            : "text-emerald-600"
                      }
                    />

                    <InfoCard
                      icon={
                        <CircleDollarSign
                          size={17}
                        />
                      }
                      label="Costo por persona"
                      value={costoMostrar}
                      valueClassName={
                        curso.costo ===
                        "Gratuito"
                          ? "text-emerald-600"
                          : "text-[#0A3D62]"
                      }
                    />
                  </div>

                  {/* Ocupación */}
                  {curso.cupoMaximo > 0 && (
                    <div className="mt-4 rounded-2xl border border-gray-200 bg-[#F8FAFC] p-3.5">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-gray-400">
                            Ocupación del curso
                          </p>

                          <p className="mt-0.5 text-xs font-bold text-[#0A3D62]">
                            {curso.cupoInscrito} de{" "}
                            {curso.cupoMaximo} lugares
                          </p>
                        </div>

                        <span className="text-lg font-extrabold text-[#0A3D62]">
                          {porcentajeLlenado.toFixed(
                            0,
                          )}
                          %
                        </span>
                      </div>

                      <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-gray-200">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-500",
                            porcentajeLlenado >= 100
                              ? "bg-red-500"
                              : porcentajeLlenado >=
                                  80
                                ? "bg-amber-500"
                                : "bg-emerald-500",
                          )}
                          style={{
                            width: `${porcentajeLlenado}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {mensaje && (
                    <div className="mt-4">
                      <MensajeBox
                        mensaje={mensaje}
                      />
                    </div>
                  )}

                  {/* Acción principal */}
                  <div className="mt-auto pt-5">
                    {!usuarioLogueado ? (
                      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-center">
                        <AlertCircle
                          size={23}
                          className="mx-auto text-amber-600"
                          aria-hidden="true"
                        />

                        <p className="mt-2 text-sm font-bold text-[#0A3D62]">
                          Inicia sesión para reservar
                        </p>

                        <p className="mt-1 text-xs leading-5 text-gray-600">
                          Necesitas una cuenta para comprar uno o más lugares.
                        </p>

                        <button
                          type="button"
                          onClick={() =>
                            router.push(
                              "/acceder?redirect=/cursos",
                            )
                          }
                          className="mt-3 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#0A3D62] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#1A4F7A]"
                        >
                          Iniciar sesión
                          <ChevronRight
                            size={16}
                            aria-hidden="true"
                          />
                        </button>
                      </div>
                    ) : !curso.inscripcionesAbiertas ? (
                      <EstadoBloqueado text="Inscripciones cerradas" />
                    ) : cuposDisponibles <= 0 ? (
                      <EstadoBloqueado text="Cupo completo" />
                    ) : (
                      <div className="space-y-3">
                        {yaInscrito && (
                          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                            <div className="flex items-start gap-2.5">
                              <CheckCircle2
                                size={18}
                                className="mt-0.5 shrink-0 text-emerald-600"
                                aria-hidden="true"
                              />

                              <div>
                                <p className="text-xs font-bold text-emerald-800">
                                  Ya tienes una inscripción
                                </p>

                                <p className="mt-0.5 text-[11px] leading-5 text-emerald-700">
                                  Puedes adquirir cupos para otros participantes.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={
                            handlePrepararCompra
                          }
                          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#FFC300] px-4 py-3 text-sm font-extrabold text-[#0A3D62] shadow-sm transition-colors hover:bg-[#0A3D62] hover:text-white"
                        >
                          <ShoppingBag
                            size={18}
                            strokeWidth={1.9}
                            aria-hidden="true"
                          />

                          Comprar uno o más lugares
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 sm:p-5 lg:p-6">
                {/* Resumen del curso */}
                <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0A3D62] text-white">
                      <GraduationCap
                        size={20}
                        strokeWidth={1.9}
                        aria-hidden="true"
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-blue-600">
                        Curso seleccionado
                      </p>

                      <h3 className="mt-0.5 line-clamp-2 text-sm font-extrabold text-[#0A3D62] sm:text-base">
                        {curso.titulo}
                      </h3>

                      <p className="mt-1 text-xs text-blue-800">
                        Captura un participante por cada lugar.
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 rounded-xl bg-white px-3 py-2 text-right shadow-sm">
                    <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-gray-400">
                      Precio individual
                    </p>

                    <p className="mt-0.5 text-base font-extrabold text-[#0A3D62]">
                      {costoMostrar}
                    </p>
                  </div>
                </div>

                <form
                  onSubmit={confirmarCompra}
                  className="space-y-5"
                >
                  {/* Cantidad */}
                  <section className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
                    <div className="rounded-2xl border border-gray-200 bg-[#F8FAFC] p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h4 className="text-sm font-extrabold text-[#0A3D62]">
                            Cantidad de lugares
                          </h4>

                          <p className="mt-0.5 text-xs text-gray-500">
                            Hay {cuposDisponibles} cupos disponibles.
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              ajustarCantidadCupos(
                                formData.cantidadCupos -
                                  1,
                              )
                            }
                            disabled={
                              creandoCompra ||
                              formData.cantidadCupos <=
                                1
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label="Disminuir cantidad de cupos"
                          >
                            <Minus
                              size={16}
                              aria-hidden="true"
                            />
                          </button>

                          <input
                            type="number"
                            min={1}
                            max={
                              cuposDisponibles
                            }
                            value={
                              formData.cantidadCupos
                            }
                            onChange={(event) => {
                              const value = Number(
                                event.target.value,
                              );

                              if (
                                Number.isSafeInteger(
                                  value,
                                )
                              ) {
                                ajustarCantidadCupos(
                                  value,
                                );
                              }
                            }}
                            disabled={creandoCompra}
                            className="h-9 w-16 rounded-lg border border-gray-300 bg-white text-center text-sm font-extrabold text-[#0A3D62] outline-none focus:border-transparent focus:ring-2 focus:ring-[#0A3D62]"
                            aria-label="Cantidad de cupos"
                          />

                          <button
                            type="button"
                            onClick={
                              agregarParticipante
                            }
                            disabled={
                              creandoCompra ||
                              formData.cantidadCupos >=
                                cuposDisponibles
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label="Aumentar cantidad de cupos"
                          >
                            <Plus
                              size={16}
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex min-w-[180px] items-center justify-between rounded-2xl bg-[#0A3D62] px-4 py-3 text-white sm:flex-col sm:items-end sm:justify-center">
                      <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/60">
                        Total estimado
                      </span>

                      <strong className="text-xl font-extrabold text-[#FFC300]">
                        {precioUnitario === 0
                          ? "Gratis"
                          : formatCurrency(
                              totalCompra,
                            )}
                      </strong>
                    </div>
                  </section>

                  {/* Participantes */}
                  <section className="space-y-4">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                      <div>
                        <h4 className="text-base font-extrabold text-[#0A3D62]">
                          Datos de participantes
                        </h4>

                        <p className="mt-0.5 text-xs text-gray-500">
                          Completa los campos obligatorios marcados con *.
                        </p>
                      </div>

                      <span className="flex h-8 min-w-8 items-center justify-center rounded-full bg-[#0A3D62] px-2 text-xs font-bold text-white">
                        {
                          formData.participantes
                            .length
                        }
                      </span>
                    </div>

                    {formData.participantes.map(
                      (
                        participante,
                        index,
                      ) => (
                        <ParticipanteForm
                          key={
                            participante.localId
                          }
                          participante={
                            participante
                          }
                          numero={index + 1}
                          puedeEliminar={
                            formData
                              .participantes
                              .length > 1
                          }
                          disabled={
                            creandoCompra
                          }
                          onChange={
                            handleParticipanteChange
                          }
                          onRemove={
                            eliminarParticipante
                          }
                        />
                      ),
                    )}

                    {formData.cantidadCupos <
                      cuposDisponibles && (
                      <button
                        type="button"
                        onClick={
                          agregarParticipante
                        }
                        disabled={creandoCompra}
                        className="flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 py-2.5 text-sm font-bold text-gray-600 transition-colors hover:border-[#0A3D62] hover:bg-[#F8FAFC] hover:text-[#0A3D62] disabled:opacity-50"
                      >
                        <Plus
                          size={16}
                          aria-hidden="true"
                        />

                        Agregar participante
                      </button>
                    )}
                  </section>

                  <FormField
                    label="Observaciones de la compra"
                    htmlFor="observaciones"
                  >
                    <textarea
                      id="observaciones"
                      name="observaciones"
                      rows={2}
                      maxLength={1000}
                      value={
                        formData.observaciones
                      }
                      onChange={(event) => {
                        setFormData(
                          (previous) => ({
                            ...previous,
                            observaciones:
                              event.target.value,
                          }),
                        );

                        setMensaje(null);
                      }}
                      disabled={creandoCompra}
                      className={cn(
                        inputClassName,
                        "resize-none",
                      )}
                      placeholder="Información adicional para la compra"
                    />
                  </FormField>

                  {/* Resumen */}
                  <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                    <div className="grid gap-2 text-sm sm:grid-cols-3">
                      <ResumenCompraItem
                        label="Precio individual"
                        value={costoMostrar}
                      />

                      <ResumenCompraItem
                        label="Cantidad"
                        value={`${formData.cantidadCupos} ${
                          formData.cantidadCupos ===
                          1
                            ? "cupo"
                            : "cupos"
                        }`}
                      />

                      <ResumenCompraItem
                        label="Total"
                        value={
                          precioUnitario === 0
                            ? "Gratis"
                            : formatCurrency(
                                totalCompra,
                              )
                        }
                        destacado
                      />
                    </div>

                    <p className="mt-3 border-t border-amber-200 pt-2.5 text-xs leading-5 text-amber-800">
                      Después de crear la compra podrás seleccionar el método y reportar el pago.
                    </p>
                  </section>

                  {mensaje && (
                    <MensajeBox
                      mensaje={mensaje}
                    />
                  )}

                  {/* Acciones */}
                  <div className="sticky bottom-0 z-20 -mx-4 flex gap-3 border-t border-gray-200 bg-white/95 px-4 pb-1 pt-4 backdrop-blur sm:-mx-5 sm:px-5 lg:-mx-6 lg:px-6">
                    <button
                      type="button"
                      onClick={() =>
                        setView("detalle")
                      }
                      disabled={creandoCompra}
                      className="min-h-11 w-1/3 rounded-xl border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-200 disabled:opacity-60"
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      disabled={creandoCompra}
                      className="flex min-h-11 w-2/3 items-center justify-center gap-2 rounded-xl bg-[#0A3D62] px-3 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#1A4F7A] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {creandoCompra ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />

                          Procesando...
                        </>
                      ) : (
                        <>
                          <ShoppingBag
                            size={17}
                            aria-hidden="true"
                          />

                          Crear compra de{" "}
                          {
                            formData.cantidadCupos
                          }{" "}
                          {formData.cantidadCupos ===
                          1
                            ? "cupo"
                            : "cupos"}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const inputClassName =
  "w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-[#0A3D62] disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500";

interface ParticipanteFormProps {
  participante: ParticipanteFormData;
  numero: number;
  puedeEliminar: boolean;
  disabled: boolean;
  onChange: (
    localId: number,
    field: keyof Omit<
      ParticipanteFormData,
      "localId"
    >,
    value: string,
  ) => void;
  onRemove: (localId: number) => void;
}

function ParticipanteForm({
  participante,
  numero,
  puedeEliminar,
  disabled,
  onChange,
  onRemove,
}: ParticipanteFormProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 bg-[#F8FAFC] px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EAF2F8] text-[#0A3D62]">
            <UserRound
              size={17}
              strokeWidth={1.9}
              aria-hidden="true"
            />
          </div>

          <div>
            <h5 className="text-sm font-extrabold text-[#0A3D62]">
              Participante {numero}
            </h5>

            <p className="text-[11px] text-gray-500">
              Ocupará el cupo {numero}.
            </p>
          </div>
        </div>

        {puedeEliminar && (
          <button
            type="button"
            onClick={() =>
              onRemove(participante.localId)
            }
            disabled={disabled}
            className="flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-xs font-bold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
          >
            <Trash2
              size={15}
              aria-hidden="true"
            />

            <span className="hidden sm:inline">
              Quitar
            </span>
          </button>
        )}
      </div>

      <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
        <FormField
          label="Nombre(s) *"
          htmlFor={`nombre-${participante.localId}`}
        >
          <input
            id={`nombre-${participante.localId}`}
            required
            type="text"
            maxLength={100}
            value={participante.nombre}
            onChange={(event) =>
              onChange(
                participante.localId,
                "nombre",
                event.target.value,
              )
            }
            disabled={disabled}
            className={inputClassName}
          />
        </FormField>

        <FormField
          label="Apellido paterno *"
          htmlFor={`apellidoPaterno-${participante.localId}`}
        >
          <input
            id={`apellidoPaterno-${participante.localId}`}
            required
            type="text"
            maxLength={100}
            value={
              participante.apellidoPaterno
            }
            onChange={(event) =>
              onChange(
                participante.localId,
                "apellidoPaterno",
                event.target.value,
              )
            }
            disabled={disabled}
            className={inputClassName}
          />
        </FormField>

        <FormField
          label="Apellido materno"
          htmlFor={`apellidoMaterno-${participante.localId}`}
        >
          <input
            id={`apellidoMaterno-${participante.localId}`}
            type="text"
            maxLength={100}
            value={
              participante.apellidoMaterno
            }
            onChange={(event) =>
              onChange(
                participante.localId,
                "apellidoMaterno",
                event.target.value,
              )
            }
            disabled={disabled}
            className={inputClassName}
          />
        </FormField>

        <FormField
          label="Fecha de nacimiento"
          htmlFor={`fechaNacimiento-${participante.localId}`}
        >
          <input
            id={`fechaNacimiento-${participante.localId}`}
            type="date"
            max={fechaMaximaNacimiento()}
            value={
              participante.fechaNacimiento
            }
            onChange={(event) =>
              onChange(
                participante.localId,
                "fechaNacimiento",
                event.target.value,
              )
            }
            disabled={disabled}
            className={inputClassName}
          />
        </FormField>

        <FormField
          label="Sexo *"
          htmlFor={`sexo-${participante.localId}`}
        >
          <select
            id={`sexo-${participante.localId}`}
            required
            value={participante.sexo}
            onChange={(event) =>
              onChange(
                participante.localId,
                "sexo",
                event.target.value,
              )
            }
            disabled={disabled}
            className={inputClassName}
          >
            <option value="">
              Selecciona
            </option>
            <option value="Masculino">
              Masculino
            </option>
            <option value="Femenino">
              Femenino
            </option>
            <option value="Otro">
              Otro
            </option>
            <option value="Prefiere no indicar">
              Prefiero no indicar
            </option>
          </select>
        </FormField>

        <FormField
          label="Teléfono"
          htmlFor={`telefono-${participante.localId}`}
        >
          <input
            id={`telefono-${participante.localId}`}
            type="tel"
            maxLength={20}
            value={participante.telefono}
            onChange={(event) =>
              onChange(
                participante.localId,
                "telefono",
                event.target.value,
              )
            }
            disabled={disabled}
            className={inputClassName}
          />
        </FormField>

        <div className="sm:col-span-2 lg:col-span-3">
          <FormField
            label="Correo"
            htmlFor={`correo-${participante.localId}`}
          >
            <input
              id={`correo-${participante.localId}`}
              type="email"
              maxLength={150}
              value={participante.correo}
              onChange={(event) =>
                onChange(
                  participante.localId,
                  "correo",
                  event.target.value,
                )
              }
              disabled={disabled}
              className={inputClassName}
            />
          </FormField>
        </div>
      </div>
    </article>
  );
}

interface InfoCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  valueClassName?: string;
}

function InfoCard({
  icon,
  label,
  value,
  valueClassName = "",
}: InfoCardProps) {
  return (
    <div className="flex min-w-0 items-start gap-2.5 rounded-xl border border-gray-200 bg-[#F8FAFC] p-3">
      <span className="mt-0.5 shrink-0 text-[#B88600]">
        {icon}
      </span>

      <div className="min-w-0">
        <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-gray-400">
          {label}
        </p>

        <p
          className={cn(
            "mt-0.5 line-clamp-2 text-xs font-bold leading-5 text-gray-700",
            valueClassName,
          )}
          title={value}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

interface FormFieldProps {
  label: string;
  htmlFor: string;
  children: ReactNode;
}

function FormField({
  label,
  htmlFor,
  children,
}: FormFieldProps) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1 block text-xs font-bold text-gray-600"
      >
        {label}
      </label>

      {children}
    </div>
  );
}

function MensajeBox({
  mensaje,
}: {
  mensaje: MensajeEstado;
}) {
  const exitoso =
    mensaje.type === "success";

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border p-3.5",
        exitoso
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-red-200 bg-red-50 text-red-800",
      )}
      role="status"
    >
      {exitoso ? (
        <CheckCircle2
          size={19}
          className="mt-0.5 shrink-0"
          aria-hidden="true"
        />
      ) : (
        <AlertCircle
          size={19}
          className="mt-0.5 shrink-0"
          aria-hidden="true"
        />
      )}

      <span className="text-sm font-semibold leading-6">
        {mensaje.text}
      </span>
    </div>
  );
}

function EstadoBloqueado({
  text,
}: {
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-center">
      <AlertCircle
        size={23}
        className="mx-auto text-red-600"
        aria-hidden="true"
      />

      <p className="mt-2 text-sm font-extrabold text-red-800">
        {text}
      </p>

      <p className="mt-1 text-xs text-red-700">
        Actualmente no es posible adquirir lugares para este curso.
      </p>
    </div>
  );
}

interface ResumenCompraItemProps {
  label: string;
  value: string;
  destacado?: boolean;
}

function ResumenCompraItem({
  label,
  value,
  destacado = false,
}: ResumenCompraItemProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-white/70 px-3 py-2 sm:block">
      <span className="text-xs text-amber-900/70">
        {label}
      </span>

      <strong
        className={cn(
          "text-sm text-amber-950 sm:mt-1 sm:block",
          destacado && "text-base",
        )}
      >
        {value}
      </strong>
    </div>
  );
}