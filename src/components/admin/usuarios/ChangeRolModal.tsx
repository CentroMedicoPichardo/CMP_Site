"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

import {
  Check,
  CircleAlert,
  Loader2,
  Shield,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";

import type {
  Rol,
  Usuario,
} from "@/types/usuarios";

interface ChangeRolModalProps {
  isOpen: boolean;
  onClose: () => void;
  usuario: Usuario | null;
  roles: Rol[];
  selectedRolId: number;
  onRolChange: (rolId: number) => void;
  onSave: () => Promise<void>;
  saving: boolean;
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

function cn(
  ...clases: Array<
    string | false | null | undefined
  >
): string {
  return clases.filter(Boolean).join(" ");
}

function textoSeguro(
  valor: unknown,
): string {
  return typeof valor === "string"
    ? valor.trim()
    : "";
}

function obtenerNombreCompleto(
  usuario: Usuario,
): string {
  const partes = [
    textoSeguro(usuario.nombre),
    textoSeguro(usuario.apellidoPaterno),
    textoSeguro(usuario.apellidoMaterno),
  ].filter(Boolean);

  return partes.length > 0
    ? partes.join(" ")
    : "Usuario sin nombre";
}

function obtenerIniciales(
  usuario: Usuario,
): string {
  const partes = [
    textoSeguro(usuario.nombre),
    textoSeguro(usuario.apellidoPaterno),
  ].filter(Boolean);

  const iniciales = partes
    .map((parte) => parte.charAt(0))
    .join("")
    .toUpperCase();

  return iniciales || "US";
}

function obtenerDescripcionRol(
  nombre: string,
): string {
  const nombreNormalizado =
    nombre.toLocaleLowerCase("es-MX");

  if (
    nombreNormalizado.includes("admin")
  ) {
    return "Acceso administrativo y gestión completa del sistema.";
  }

  if (
    nombreNormalizado.includes("medico") ||
    nombreNormalizado.includes("médico")
  ) {
    return "Acceso a funciones clínicas y contenido relacionado.";
  }

  if (
    nombreNormalizado.includes("cliente") ||
    nombreNormalizado.includes("usuario")
  ) {
    return "Acceso a cursos, foros y contenido disponible para usuarios.";
  }

  return "Permisos definidos para este rol dentro del sistema.";
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
        '[data-change-role-modal="true"]',
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

export function ChangeRolModal({
  isOpen,
  onClose,
  usuario,
  roles,
  selectedRolId,
  onRolChange,
  onSave,
  saving,
}: ChangeRolModalProps) {
  const tituloModalId = useId();
  const descripcionModalId = useId();

  const onCloseRef = useRef(onClose);
  const savingRef = useRef(saving);

  const [mounted, setMounted] =
    useState(false);

  const [
    desplazamientoSuperior,
    setDesplazamientoSuperior,
  ] = useState(88);

  const [
    errorGuardado,
    setErrorGuardado,
  ] = useState<string | null>(null);

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

    setErrorGuardado(null);
  }, [
    isOpen,
    usuario,
    selectedRolId,
  ]);

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
      top:
        document.body.style.top,
      left:
        document.body.style.left,
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
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(
          animationFrameId,
        );
      }

      animationFrameId =
        window.requestAnimationFrame(() => {
          setDesplazamientoSuperior(
            obtenerLimiteHeaderGlobal(),
          );

          animationFrameId = null;
        });
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
          '[data-change-role-modal="true"]',
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
      if (animationFrameId !== null) {
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

  if (
    !isOpen ||
    !usuario ||
    !mounted
  ) {
    return null;
  }

  const nombreCompleto =
    obtenerNombreCompleto(usuario);

  const rolActualNombre =
    textoSeguro(usuario.rolNombre);

  const rolSeleccionado =
    roles.find(
      (rol) =>
        Number(rol.id) ===
        selectedRolId,
    );

  const rolActual =
    roles.find(
      (rol) =>
        textoSeguro(
          rol.nombre,
        ).toLocaleLowerCase(
          "es-MX",
        ) ===
        rolActualNombre.toLocaleLowerCase(
          "es-MX",
        ),
    );

  const mismoRol =
    rolActual !== undefined &&
    Number(rolActual.id) ===
      selectedRolId;

  const puedeGuardar =
    Boolean(rolSeleccionado) &&
    !mismoRol &&
    !saving;

  const handleClose = () => {
    if (saving) {
      return;
    }

    onClose();
  };

  const handleSave = async () => {
    if (!puedeGuardar) {
      return;
    }

    setErrorGuardado(null);

    try {
      await onSave();
    } catch (error: unknown) {
      console.error(
        "Error actualizando rol:",
        error,
      );

      setErrorGuardado(
        error instanceof Error
          ? error.message
          : "No fue posible actualizar el rol.",
      );
    }
  };

  const modal = (
    <div
      data-change-role-modal="true"
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
        aria-label="Cerrar modal para cambiar rol"
        className="absolute inset-0 z-0 h-full w-full cursor-default bg-[#061C2E]/70 backdrop-blur-sm disabled:cursor-wait"
      />

      <div className="relative z-10 flex h-full w-full items-center justify-center p-3 sm:p-5">
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby={tituloModalId}
          aria-describedby={
            descripcionModalId
          }
          className="flex max-h-full w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
        >
          <div
            className="h-1 w-full shrink-0 bg-[#FFC300]"
            aria-hidden="true"
          />

          <header className="flex shrink-0 items-start justify-between gap-4 border-b border-gray-100 bg-white px-4 py-4 sm:px-6">
            <div className="flex min-w-0 items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0A3D62] text-[#FFC300]">
                <Shield
                  size={21}
                  strokeWidth={1.9}
                  aria-hidden="true"
                />
              </span>

              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
                  Gestión de permisos
                </p>

                <h2
                  id={tituloModalId}
                  className="mt-1 break-words text-lg font-extrabold text-[#0A3D62] sm:text-xl"
                >
                  Cambiar rol
                </h2>

                <p
                  id={descripcionModalId}
                  className="mt-1 text-xs leading-5 text-gray-500"
                >
                  Selecciona el nivel de acceso
                  que tendrá este usuario.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              disabled={saving}
              aria-label="Cerrar modal"
              title="Cerrar"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X
                size={18}
                aria-hidden="true"
              />
            </button>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <div className="space-y-5 p-4 sm:p-6">
              <section className="flex items-center gap-4 rounded-2xl border border-[#0A3D62]/15 bg-[#F2F7FA] p-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0A3D62] text-sm font-extrabold text-white">
                  {obtenerIniciales(usuario)}
                </span>

                <div className="min-w-0">
                  <p className="break-words text-sm font-extrabold text-[#0A3D62]">
                    {nombreCompleto}
                  </p>

                  <p className="mt-1 break-words text-xs text-gray-500">
                    {textoSeguro(
                      usuario.correo,
                    ) ||
                      "Correo no registrado"}
                  </p>

                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[10px] font-bold text-gray-600">
                    <ShieldCheck
                      size={12}
                      className="text-[#0A3D62]"
                      aria-hidden="true"
                    />

                    Rol actual:{" "}
                    {rolActualNombre ||
                      "Sin rol"}
                  </div>
                </div>
              </section>

              {errorGuardado && (
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
                    {errorGuardado}
                  </p>
                </div>
              )}

              <section>
                <div className="mb-3">
                  <p className="text-xs font-extrabold text-[#0A3D62]">
                    Roles disponibles
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    El cambio modificará los
                    permisos del usuario dentro
                    del sistema.
                  </p>
                </div>

                {roles.length > 0 ? (
                  <div className="space-y-3">
                    {roles.map((rol) => {
                      const rolId =
                        Number(rol.id);

                      const seleccionado =
                        selectedRolId ===
                        rolId;

                      const esActual =
                        rolActual !==
                          undefined &&
                        Number(
                          rolActual.id,
                        ) === rolId;

                      return (
                        <label
                          key={rol.id}
                          className={cn(
                            "group flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all",
                            seleccionado
                              ? "border-[#FFC300] bg-[#FFF9E6] shadow-sm"
                              : "border-gray-200 bg-white hover:border-[#FFC300]/60 hover:bg-[#F8FAFC]",
                            saving &&
                              "cursor-wait opacity-70",
                          )}
                        >
                          <input
                            type="radio"
                            name="rol"
                            value={rolId}
                            checked={
                              seleccionado
                            }
                            onChange={() => {
                              onRolChange(
                                rolId,
                              );
                              setErrorGuardado(
                                null,
                              );
                            }}
                            disabled={saving}
                            className="sr-only"
                          />

                          <span
                            className={cn(
                              "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-colors",
                              seleccionado
                                ? "border-[#FFC300] bg-[#FFC300] text-[#0A3D62]"
                                : "border-gray-200 bg-gray-50 text-gray-400 group-hover:text-[#0A3D62]",
                            )}
                          >
                            {seleccionado ? (
                              <Check
                                size={17}
                                strokeWidth={
                                  2.5
                                }
                                aria-hidden="true"
                              />
                            ) : (
                              <Shield
                                size={17}
                                aria-hidden="true"
                              />
                            )}
                          </span>

                          <span className="min-w-0 flex-1">
                            <span className="flex flex-wrap items-center gap-2">
                              <span className="break-words text-sm font-extrabold capitalize text-gray-800">
                                {textoSeguro(
                                  rol.nombre,
                                ) ||
                                  "Rol sin nombre"}
                              </span>

                              {esActual && (
                                <span className="rounded-full border border-[#0A3D62]/15 bg-[#EAF2F8] px-2 py-1 text-[9px] font-extrabold uppercase tracking-wide text-[#0A3D62]">
                                  Actual
                                </span>
                              )}
                            </span>

                            <span className="mt-1 block break-words text-xs leading-5 text-gray-500">
                              {obtenerDescripcionRol(
                                textoSeguro(
                                  rol.nombre,
                                ),
                              )}
                            </span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex min-h-36 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-[#F8FAFC] px-5 py-8 text-center">
                    <UserRound
                      size={27}
                      className="text-gray-300"
                      aria-hidden="true"
                    />

                    <p className="mt-3 text-sm font-extrabold text-[#0A3D62]">
                      No hay roles disponibles
                    </p>

                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      Registra al menos un rol
                      antes de modificar los
                      permisos del usuario.
                    </p>
                  </div>
                )}
              </section>
            </div>
          </div>

          <footer className="flex shrink-0 flex-col-reverse gap-3 border-t border-gray-100 bg-[#F8FAFC] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-[11px] leading-5 text-gray-500">
              {mismoRol
                ? "Selecciona un rol diferente al actual."
                : "El cambio se aplicará al guardar."}
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
                type="button"
                onClick={() => {
                  void handleSave();
                }}
                disabled={!puedeGuardar}
                aria-busy={saving}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#FFC300] px-5 py-2 text-xs font-extrabold text-[#0A3D62] shadow-sm transition-colors hover:bg-[#EAB308] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D62] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none"
              >
                {saving ? (
                  <Loader2
                    size={16}
                    className="animate-spin"
                    aria-hidden="true"
                  />
                ) : (
                  <ShieldCheck
                    size={16}
                    aria-hidden="true"
                  />
                )}

                {saving
                  ? "Guardando..."
                  : "Actualizar rol"}
              </button>
            </div>
          </footer>
        </section>
      </div>
    </div>
  );

  return createPortal(
    modal,
    document.body,
  );
}