// src/components/public/cursos/CursoDetalleModal.tsx
"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  MapPin,
  Minus,
  Monitor,
  Plus,
  Trash2,
  User,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { getApiErrorMessage } from "@/types/api";
import type {
  CrearCompraCursoInput,
  CrearCompraCursoResponse,
  SexoParticipante,
} from "@/types/compras-cursos";
import type {
  VerificarInscripcionCursoResponse,
} from "@/types/cursos";

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

function crearParticipanteVacio(
  localId: number,
  correo = ""
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
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

async function readJsonResponse(
  response: Response
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
  value: unknown
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
  usuario: AuthUsuario
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
  value: unknown
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
  value: unknown
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
      crearFormularioInicial
    );

  const requestControllerRef =
    useRef<AbortController | null>(null);
  const mensajeTimeoutRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);
  const siguienteParticipanteIdRef =
    useRef(2);

  const cuposDisponibles = Math.max(
    0,
    curso.lugaresDisponibles
  );

  const porcentajeLlenado =
    curso.cupoMaximo > 0
      ? Math.min(
          (curso.cupoInscrito /
            curso.cupoMaximo) *
            100,
          100
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
    [precioUnitario, formData.cantidadCupos]
  );

  const costoMostrar =
    curso.costo === "Gratuito"
      ? "Gratis"
      : formatCurrency(curso.costo);

  const mostrarMensajeTemporal = useCallback(
    (
      nuevoMensaje: MensajeEstado,
      duration = 3000
    ) => {
      if (mensajeTimeoutRef.current) {
        clearTimeout(mensajeTimeoutRef.current);
      }

      setMensaje(nuevoMensaje);

      mensajeTimeoutRef.current = setTimeout(() => {
        setMensaje(null);
        mensajeTimeoutRef.current = null;
      }, duration);
    },
    []
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
            }
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
            authData.usuario
          );

          if (!usuario) {
            setUsuarioLogueado(null);
            setYaInscrito(false);
            return;
          }

          setUsuarioLogueado(usuario);

          const inscripcionResponse = await fetch(
            `/api/cursos/verificar-inscripcion?cursoId=${encodeURIComponent(
              String(curso.id)
            )}`,
            {
              signal,
              credentials: "include",
              cache: "no-store",
            }
          );

          const inscripcionPayload =
            await readJsonResponse(
              inscripcionResponse
            );

          if (!inscripcionResponse.ok) {
            throw new Error(
              getApiErrorMessage(
                inscripcionPayload,
                "No fue posible verificar la inscripción"
              )
            );
          }

          const resultado =
            parseVerificarInscripcionResponse(
              inscripcionPayload
            );

          if (!resultado) {
            throw new Error(
              "La respuesta de verificación no es válida"
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
            error
          );

          setUsuarioLogueado(null);
          setYaInscrito(false);
        }
      },
      [curso.id]
    );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const controller = new AbortController();

    void verificarLoginYInscripcion(
      controller.signal
    );

    return () => {
      controller.abort();
    };
  }, [isOpen, verificarLoginYInscripcion]);

  useEffect(() => {
    return () => {
      requestControllerRef.current?.abort();

      if (mensajeTimeoutRef.current) {
        clearTimeout(mensajeTimeoutRef.current);
      }
    };
  }, []);

  const resetModalState = () => {
    setView("detalle");
    setFormData(crearFormularioInicial());
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
      router.push("/acceder?redirect=/cursos");
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
              : participante
        ),
    }));

    setMensaje(null);
    setView("formulario");
  };

  const ajustarCantidadCupos = (
    nuevaCantidad: number
  ) => {
    const cantidadValida = Math.min(
      Math.max(1, nuevaCantidad),
      cuposDisponibles
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
              cantidadValida
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
              localId
            );
          }
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
      formData.cantidadCupos + 1
    );
  };

  const eliminarParticipante = (
    localId: number
  ) => {
    if (formData.participantes.length <= 1) {
      return;
    }

    setFormData((previous) => {
      const participantes =
        previous.participantes.filter(
          (participante) =>
            participante.localId !== localId
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
    value: string
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
              : participante
        ),
    }));

    setMensaje(null);
  };

  const validarFormulario = (): string | null => {
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
      index < formData.participantes.length;
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
    event: React.FormEvent<HTMLFormElement>
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

    const controller = new AbortController();
    requestControllerRef.current = controller;

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
                "Todos los participantes deben tener un sexo seleccionado"
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
          }
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
        }
      );

      const payload =
        await readJsonResponse(response);

      if (!response.ok) {
        throw new Error(
          getApiErrorMessage(
            payload,
            "No fue posible crear la compra"
          )
        );
      }

      const result =
        parseCrearCompraResponse(payload);

      if (!result) {
        throw new Error(
          "La respuesta de la compra no es válida"
        );
      }

      setMensaje({
        type: "success",
        text:
          "Compra creada correctamente. Redirigiendo al pago...",
      });

      router.push(
        `/mis-compras/cursos/${result.compra.idCompra}`
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
    <div className="fixed inset-0 z-[99999] overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
          <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
            <div className="flex items-center gap-3">
              {view === "formulario" && (
                <button
                  type="button"
                  onClick={() =>
                    setView("detalle")
                  }
                  disabled={creandoCompra}
                  className="rounded-full p-2 transition-colors hover:bg-gray-100 disabled:opacity-50"
                  aria-label="Regresar al detalle"
                >
                  <ArrowLeft
                    size={20}
                    className="text-gray-600"
                  />
                </button>
              )}

              <h2 className="text-xl font-bold text-[#0A3D62]">
                {view === "detalle"
                  ? "Detalle del curso"
                  : "Crear compra"}
              </h2>
            </div>

            <button
              type="button"
              onClick={handleClose}
              disabled={creandoCompra}
              className="rounded-lg p-2 transition-colors hover:bg-gray-100 disabled:opacity-50"
              aria-label="Cerrar"
            >
              <X
                size={22}
                className="text-gray-500"
              />
            </button>
          </header>

          {view === "detalle" ? (
            <div className="p-6">
              {curso.imagenSrc && (
                <div className="relative mb-6 h-64 overflow-hidden rounded-xl">
                  <Image
                    src={curso.imagenSrc}
                    alt={curso.titulo}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <h1 className="mb-4 text-2xl font-bold text-[#0A3D62]">
                {curso.titulo}
              </h1>

              <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <InfoCard
                  icon={<Calendar size={20} />}
                  label="Fechas"
                  value={`${curso.fechaInicio} - ${curso.fechaFin}`}
                />
                <InfoCard
                  icon={<Clock size={20} />}
                  label="Horario"
                  value={curso.horario}
                />
                <InfoCard
                  icon={<User size={20} />}
                  label="Instructor"
                  value={curso.instructor}
                />
                <InfoCard
                  icon={
                    curso.modalidad ===
                    "Online" ? (
                      <Monitor size={20} />
                    ) : (
                      <MapPin size={20} />
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
                  icon={<Users size={20} />}
                  label="Cupo disponible"
                  value={`${cuposDisponibles} de ${curso.cupoMaximo} lugares`}
                  valueClassName={
                    cuposDisponibles < 5
                      ? "text-red-600"
                      : "text-green-600"
                  }
                />
                <InfoCard
                  icon={<DollarSign size={20} />}
                  label="Costo por persona"
                  value={costoMostrar}
                  valueClassName="font-bold"
                />
              </div>

              <div className="mb-6">
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-gray-700">
                    Ocupación del curso
                  </span>
                  <span className="font-semibold text-[#0A3D62]">
                    {porcentajeLlenado.toFixed(0)}%
                  </span>
                </div>

                <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full bg-gradient-to-r from-[#FFC300] to-[#FFD700]"
                    style={{
                      width: `${porcentajeLlenado}%`,
                    }}
                  />
                </div>
              </div>

              <section className="mb-6">
                <h3 className="mb-3 text-lg font-semibold text-[#0A3D62]">
                  Descripción del curso
                </h3>
                <p className="leading-relaxed text-gray-700">
                  {curso.descripcion}
                </p>
              </section>

              {mensaje && (
                <MensajeBox mensaje={mensaje} />
              )}

              <div className="border-t pt-6">
                {!usuarioLogueado ? (
                  <div className="rounded-lg bg-yellow-100 p-4 text-center">
                    <p className="mb-3 text-gray-800">
                      Para comprar lugares necesitas iniciar sesión.
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        router.push(
                          "/acceder?redirect=/cursos"
                        )
                      }
                      className="rounded-lg bg-[#0A3D62] px-6 py-2 text-white hover:bg-[#1A4F7A]"
                    >
                      Iniciar sesión
                    </button>
                  </div>
                ) : !curso.inscripcionesAbiertas ? (
                  <EstadoBloqueado text="Inscripciones cerradas" />
                ) : cuposDisponibles <= 0 ? (
                  <EstadoBloqueado text="Cupo completo" />
                ) : (
                  <div className="space-y-4">
                    {yaInscrito && (
                      <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                        <div className="flex items-center gap-2 text-green-800">
                          <CheckCircle size={20} />
                          <p className="font-semibold">
                            Ya tienes una inscripción en este curso
                          </p>
                        </div>
                        <p className="mt-1 text-sm text-green-700">
                          Aun puedes comprar cupos para otros participantes.
                        </p>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handlePrepararCompra}
                      className="w-full rounded-xl bg-gradient-to-r from-[#FFC300] to-[#FFD700] py-3 text-lg font-semibold text-[#0A3D62] transition hover:from-[#0A3D62] hover:to-[#1A4F7A] hover:text-white"
                    >
                      Comprar uno o más lugares
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-6">
              <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 p-4">
                <h3 className="font-bold text-[#0A3D62]">
                  {curso.titulo}
                </h3>
                <p className="mt-1 text-sm text-blue-800">
                  Selecciona la cantidad de cupos y captura un participante por cada lugar.
                </p>
              </div>

              <form
                onSubmit={confirmarCompra}
                className="space-y-6"
              >
                <section className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Cantidad de cupos
                      </h4>
                      <p className="text-sm text-gray-600">
                        Hay {cuposDisponibles} lugares disponibles.
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          ajustarCantidadCupos(
                            formData.cantidadCupos - 1
                          )
                        }
                        disabled={
                          creandoCompra ||
                          formData.cantidadCupos <= 1
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Disminuir cantidad de cupos"
                      >
                        <Minus size={18} />
                      </button>

                      <input
                        type="number"
                        min={1}
                        max={cuposDisponibles}
                        value={formData.cantidadCupos}
                        onChange={(event) => {
                          const value = Number(
                            event.target.value
                          );

                          if (
                            Number.isSafeInteger(value)
                          ) {
                            ajustarCantidadCupos(
                              value
                            );
                          }
                        }}
                        disabled={creandoCompra}
                        className="h-10 w-20 rounded-lg border border-gray-300 bg-white text-center font-semibold text-gray-900 outline-none focus:border-transparent focus:ring-2 focus:ring-[#0A3D62]"
                        aria-label="Cantidad de cupos"
                      />

                      <button
                        type="button"
                        onClick={agregarParticipante}
                        disabled={
                          creandoCompra ||
                          formData.cantidadCupos >=
                            cuposDisponibles
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Aumentar cantidad de cupos"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>
                </section>

                <section className="space-y-5">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h4 className="text-lg font-semibold text-gray-800">
                      Participantes
                    </h4>

                    <span className="rounded-full bg-[#0A3D62] px-3 py-1 text-sm font-medium text-white">
                      {formData.participantes.length}
                    </span>
                  </div>

                  {formData.participantes.map(
                    (participante, index) => (
                      <ParticipanteForm
                        key={participante.localId}
                        participante={participante}
                        numero={index + 1}
                        puedeEliminar={
                          formData.participantes
                            .length > 1
                        }
                        disabled={creandoCompra}
                        onChange={
                          handleParticipanteChange
                        }
                        onRemove={
                          eliminarParticipante
                        }
                      />
                    )
                  )}

                  {formData.cantidadCupos <
                    cuposDisponibles && (
                    <button
                      type="button"
                      onClick={agregarParticipante}
                      disabled={creandoCompra}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 py-3 font-medium text-gray-700 transition hover:border-[#0A3D62] hover:text-[#0A3D62] disabled:opacity-50"
                    >
                      <Plus size={18} />
                      Agregar otro participante
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
                    rows={3}
                    maxLength={1000}
                    value={formData.observaciones}
                    onChange={(event) => {
                      setFormData((previous) => ({
                        ...previous,
                        observaciones:
                          event.target.value,
                      }));
                      setMensaje(null);
                    }}
                    disabled={creandoCompra}
                    className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 outline-none placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-[#0A3D62] disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
                    placeholder="Información adicional para la compra"
                  />
                </FormField>

                <section className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
                  <div className="space-y-2 text-sm text-yellow-950">
                    <div className="flex justify-between gap-4">
                      <span>
                        Precio por participante
                      </span>
                      <strong>
                        {costoMostrar}
                      </strong>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span>
                        Cantidad de cupos
                      </span>
                      <strong>
                        {formData.cantidadCupos}
                      </strong>
                    </div>

                    <div className="flex justify-between gap-4 border-t border-yellow-300 pt-2 text-base">
                      <span className="font-semibold">
                        Total
                      </span>
                      <strong>
                        {precioUnitario === 0
                          ? "Gratis"
                          : formatCurrency(
                              totalCompra
                            )}
                      </strong>
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-yellow-800">
                    Después de crear la compra podrás seleccionar el método y reportar el pago.
                  </p>
                </section>

                {mensaje && (
                  <MensajeBox mensaje={mensaje} />
                )}

                <div className="flex gap-4 border-t pt-6">
                  <button
                    type="button"
                    onClick={() =>
                      setView("detalle")
                    }
                    disabled={creandoCompra}
                    className="w-1/3 rounded-xl bg-gray-100 py-3 font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-60"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={creandoCompra}
                    className="flex w-2/3 items-center justify-center gap-2 rounded-xl bg-[#0A3D62] py-3 text-lg font-semibold text-white hover:bg-[#1A4F7A] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {creandoCompra ? (
                      <>
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Procesando compra...
                      </>
                    ) : (
                      `Crear compra de ${formData.cantidadCupos} ${
                        formData.cantidadCupos === 1
                          ? "cupo"
                          : "cupos"
                      }`
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

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
    value: string
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
    <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h5 className="font-semibold text-[#0A3D62]">
            Participante {numero}
          </h5>
          <p className="text-xs text-gray-500">
            Este participante ocupará el cupo {numero}.
          </p>
        </div>

        {puedeEliminar && (
          <button
            type="button"
            onClick={() =>
              onRemove(participante.localId)
            }
            disabled={disabled}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            <Trash2 size={16} />
            Quitar
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                  event.target.value
                )
              }
              disabled={disabled}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 outline-none placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-[#0A3D62] disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
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
                  event.target.value
                )
              }
              disabled={disabled}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 outline-none placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-[#0A3D62] disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                  event.target.value
                )
              }
              disabled={disabled}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 outline-none placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-[#0A3D62] disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
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
                  event.target.value
                )
              }
              disabled={disabled}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 outline-none placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-[#0A3D62] disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                event.target.value
              )
            }
            disabled={disabled}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 outline-none focus:border-transparent focus:ring-2 focus:ring-[#0A3D62] disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
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
                  event.target.value
                )
              }
              disabled={disabled}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 outline-none placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-[#0A3D62] disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
            />
          </FormField>
        </div>

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
                event.target.value
              )
            }
            disabled={disabled}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 outline-none placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-[#0A3D62] disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
          />
        </FormField>
      </div>
    </article>
  );
}

interface InfoCardProps {
  icon: React.ReactNode;
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
    <div className="flex items-center gap-3 rounded-lg bg-gray-100 p-3">
      <span className="text-[#FFC300]">
        {icon}
      </span>
      <div>
        <p className="text-xs text-gray-600">
          {label}
        </p>
        <p
          className={`text-sm font-medium text-gray-800 ${valueClassName}`}
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
  children: React.ReactNode;
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
        className="mb-1 block text-sm font-medium text-gray-700"
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
  return (
    <div
      className={`mb-6 flex items-center gap-3 rounded-lg border p-4 ${
        mensaje.type === "success"
          ? "border-green-300 bg-green-100 text-green-800"
          : "border-red-300 bg-red-100 text-red-800"
      }`}
    >
      {mensaje.type === "success" ? (
        <CheckCircle size={20} />
      ) : (
        <AlertCircle size={20} />
      )}
      <span>{mensaje.text}</span>
    </div>
  );
}

function EstadoBloqueado({
  text,
}: {
  text: string;
}) {
  return (
    <div className="rounded-lg bg-red-100 p-4 text-center">
      <AlertCircle
        size={24}
        className="mx-auto mb-2 text-red-600"
      />
      <p className="font-semibold text-red-800">
        {text}
      </p>
    </div>
  );
}