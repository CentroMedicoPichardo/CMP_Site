"use client";

import {
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  Loader2,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

interface LoginMfaFormProps {
  email: string;
  onCancel: () => void;
}

interface UsuarioMfa {
  nombre?: string | null;
  correo?: string | null;
  rol?:
    | string
    | {
        nombre?: string | null;
      }
    | null;
}

interface MfaResponse {
  usuario?: UsuarioMfa;
}

interface MfaErrorResponse {
  message?: string;
}

const TOTAL_DIGITOS = 6;

function cn(
  ...clases: Array<string | false | null | undefined>
): string {
  return clases.filter(Boolean).join(" ");
}

function obtenerRol(usuario: UsuarioMfa | undefined): string {
  if (!usuario?.rol) {
    return "cliente";
  }

  if (typeof usuario.rol === "string") {
    return usuario.rol
      .trim()
      .toLocaleLowerCase("es-MX");
  }

  return (
    usuario.rol.nombre
      ?.trim()
      .toLocaleLowerCase("es-MX") ||
    "cliente"
  );
}

function obtenerRutaPorRol(rol: string): string {
  if (
    rol === "admin" ||
    rol === "administrador" ||
    rol.includes("admin")
  ) {
    return "/dashboard-admin";
  }

  return "/";
}

function ocultarCorreo(email: string): string {
  const correo = email.trim();
  const [usuario, dominio] = correo.split("@");

  if (!usuario || !dominio) {
    return correo;
  }

  const inicio = usuario.slice(0, 2);
  const caracteresOcultos = Math.max(
    usuario.length - inicio.length,
    3,
  );

  return `${inicio}${"•".repeat(caracteresOcultos)}@${dominio}`;
}

export function LoginMfaForm({
  email,
  onCancel,
}: LoginMfaFormProps) {
  const router = useRouter();

  const inputsRef =
    useRef<Array<HTMLInputElement | null>>([]);

  const [codigo, setCodigo] = useState<string[]>(
    Array(TOTAL_DIGITOS).fill(""),
  );

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const codigoCompleto = codigo.join("");
  const formularioCompleto =
    codigoCompleto.length === TOTAL_DIGITOS;

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const enfocarCampo = (indice: number) => {
    const indiceSeguro = Math.min(
      Math.max(indice, 0),
      TOTAL_DIGITOS - 1,
    );

    inputsRef.current[indiceSeguro]?.focus();
    inputsRef.current[indiceSeguro]?.select();
  };

  const distribuirCodigo = (
    valor: string,
    indiceInicial = 0,
  ) => {
    const digitos = valor
      .replace(/\D/g, "")
      .slice(0, TOTAL_DIGITOS - indiceInicial)
      .split("");

    if (digitos.length === 0) {
      return;
    }

    setCodigo((actual) => {
      const siguiente = [...actual];

      digitos.forEach((digito, posicion) => {
        siguiente[indiceInicial + posicion] =
          digito;
      });

      return siguiente;
    });

    setError("");

    const siguienteIndice = Math.min(
      indiceInicial + digitos.length,
      TOTAL_DIGITOS - 1,
    );

    window.requestAnimationFrame(() => {
      enfocarCampo(siguienteIndice);
    });
  };

  const handleChange = (
    indice: number,
    valor: string,
  ) => {
    const digitos = valor.replace(/\D/g, "");

    if (digitos.length > 1) {
      distribuirCodigo(digitos, indice);
      return;
    }

    setCodigo((actual) => {
      const siguiente = [...actual];
      siguiente[indice] = digitos.slice(-1);

      return siguiente;
    });

    setError("");

    if (digitos && indice < TOTAL_DIGITOS - 1) {
      window.requestAnimationFrame(() => {
        enfocarCampo(indice + 1);
      });
    }
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
    indice: number,
  ) => {
    if (event.key === "Backspace") {
      if (!codigo[indice] && indice > 0) {
        event.preventDefault();

        setCodigo((actual) => {
          const siguiente = [...actual];
          siguiente[indice - 1] = "";

          return siguiente;
        });

        enfocarCampo(indice - 1);
      }

      return;
    }

    if (event.key === "ArrowLeft" && indice > 0) {
      event.preventDefault();
      enfocarCampo(indice - 1);
      return;
    }

    if (
      event.key === "ArrowRight" &&
      indice < TOTAL_DIGITOS - 1
    ) {
      event.preventDefault();
      enfocarCampo(indice + 1);
    }
  };

  const handlePaste = (
    event: ClipboardEvent<HTMLInputElement>,
  ) => {
    event.preventDefault();

    const textoPegado =
      event.clipboardData.getData("text");

    distribuirCodigo(textoPegado, 0);
  };

  const limpiarCodigo = () => {
    setCodigo(Array(TOTAL_DIGITOS).fill(""));
    setError("");

    window.requestAnimationFrame(() => {
      enfocarCampo(0);
    });
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (cargando) {
      return;
    }

    if (!formularioCompleto) {
      setError(
        "Ingresa los 6 dígitos del código de verificación.",
      );

      const primerCampoVacio = codigo.findIndex(
        (digito) => !digito,
      );

      enfocarCampo(
        primerCampoVacio >= 0
          ? primerCampoVacio
          : 0,
      );

      return;
    }

    try {
      setCargando(true);
      setError("");

      const respuesta =
        await axios.post<MfaResponse>(
          "/api/auth/mfa",
          {
            email: email.trim(),
            codigo: codigoCompleto,
          },
        );

      const usuario = respuesta.data.usuario;

      if (!usuario) {
        throw new Error(
          "El servidor no devolvió los datos del usuario.",
        );
      }

      const rol = obtenerRol(usuario);
      const destino = obtenerRutaPorRol(rol);

      toast.success(
        "Autenticación completada correctamente.",
      );

      router.replace(destino);
      router.refresh();
    } catch (errorMfa: unknown) {
      console.error(
        "Error al verificar el código MFA:",
        errorMfa,
      );

      if (
        axios.isAxiosError<MfaErrorResponse>(
          errorMfa,
        )
      ) {
        const estado = errorMfa.response?.status;
        const mensaje =
          errorMfa.response?.data?.message;

        if (estado === 401) {
          setError(
            mensaje ||
              "El código es inválido o ha expirado.",
          );

          limpiarCodigo();
          return;
        }

        if (estado === 429) {
          setError(
            mensaje ||
              "Realizaste demasiados intentos. Espera unos minutos.",
          );

          return;
        }

        if (!errorMfa.response) {
          toast.error(
            "No fue posible conectarse. Verifica tu conexión a internet.",
          );

          return;
        }

        toast.error(
          mensaje ||
            "No fue posible verificar el código.",
        );

        return;
      }

      toast.error(
        errorMfa instanceof Error
          ? errorMfa.message
          : "Ocurrió un error inesperado.",
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[460px]">
      <div className="relative overflow-hidden rounded-3xl border border-[#0A3D62]/10 bg-white shadow-[0_20px_55px_rgba(10,61,98,0.12)]">
        {/* Línea superior */}
        <div
          className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#0A3D62] via-[#FFC300] to-[#0A3D62]"
          aria-hidden="true"
        />

        {/* Decoraciones */}
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#FFC300]/15 blur-3xl"
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute -bottom-20 -left-20 h-44 w-44 rounded-full bg-[#0A3D62]/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative p-5 sm:p-7">
          {/* Regresar */}
          <button
            type="button"
            onClick={onCancel}
            disabled={cargando}
            className="group inline-flex min-h-9 items-center gap-2 rounded-lg px-2 text-xs font-bold text-gray-500 transition-colors hover:bg-[#F7FAFC] hover:text-[#0A3D62] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArrowLeft
              size={16}
              strokeWidth={2}
              className="transition-transform duration-200 group-hover:-translate-x-0.5"
              aria-hidden="true"
            />

            Volver al inicio de sesión
          </button>

          {/* Encabezado */}
          <header className="mt-4 text-center">
            <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0A3D62] text-[#FFC300] shadow-[0_10px_28px_rgba(10,61,98,0.20)]">
              <div
                className="absolute inset-2 rounded-xl bg-[#FFC300]/20 blur-lg"
                aria-hidden="true"
              />

              <ShieldCheck
                size={31}
                strokeWidth={1.8}
                className="relative"
                aria-hidden="true"
              />
            </div>

            <span className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.13em] text-emerald-700">
              <LockKeyhole
                size={11}
                strokeWidth={2}
                aria-hidden="true"
              />

              Verificación de seguridad
            </span>

            <h1 className="mt-2.5 text-2xl font-extrabold leading-tight text-[#0A3D62] sm:text-3xl">
              Verificación en dos pasos
            </h1>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
              Ingresa el código generado por tu aplicación
              autenticadora para completar el acceso.
            </p>
          </header>

          {/* Correo */}
          <div className="mt-5 flex items-center gap-3 rounded-xl border border-[#0A3D62]/10 bg-[#F7FAFC] px-3.5 py-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EAF2F8] text-[#0A3D62]">
              <KeyRound
                size={17}
                strokeWidth={1.9}
                aria-hidden="true"
              />
            </span>

            <div className="min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-gray-400">
                Cuenta protegida
              </p>

              <p
                className="truncate text-xs font-bold text-[#0A3D62]"
                title={email}
              >
                {ocultarCorreo(email)}
              </p>
            </div>
          </div>

          {/* Formulario */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className="mt-5"
          >
            <fieldset disabled={cargando}>
              <legend className="mb-2 block text-xs font-bold text-[#0A3D62]">
                Código de verificación
              </legend>

              <div
                className="grid grid-cols-6 gap-1.5 sm:gap-2"
                role="group"
                aria-label="Código de verificación de 6 dígitos"
              >
                {codigo.map((digito, indice) => (
                  <input
                    key={indice}
                    ref={(elemento) => {
                      inputsRef.current[indice] =
                        elemento;
                    }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete={
                      indice === 0
                        ? "one-time-code"
                        : "off"
                    }
                    value={digito}
                    onChange={(event) =>
                      handleChange(
                        indice,
                        event.target.value,
                      )
                    }
                    onKeyDown={(event) =>
                      handleKeyDown(event, indice)
                    }
                    onPaste={handlePaste}
                    maxLength={1}
                    aria-label={`Dígito ${indice + 1} de ${TOTAL_DIGITOS}`}
                    aria-invalid={Boolean(error)}
                    className={cn(
                      "h-12 min-w-0 rounded-xl border bg-white text-center text-lg font-extrabold text-[#0A3D62] outline-none transition-all sm:h-14 sm:text-xl",
                      error
                        ? "border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                        : "border-gray-200 hover:border-[#0A3D62]/25 focus:border-[#FFC300] focus:ring-4 focus:ring-[#FFC300]/10",
                    )}
                  />
                ))}
              </div>

              <div className="mt-2 min-h-5">
                {error ? (
                  <p
                    className="flex items-center justify-center gap-1.5 text-center text-xs font-medium text-red-600"
                    role="alert"
                    aria-live="polite"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />

                    {error}
                  </p>
                ) : (
                  <p className="text-center text-[11px] text-gray-400">
                    Puedes escribir o pegar el código completo.
                  </p>
                )}
              </div>
            </fieldset>

            <button
              type="submit"
              disabled={
                cargando || !formularioCompleto
              }
              className="group mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0A3D62] px-5 py-3 text-sm font-extrabold text-white shadow-[0_8px_22px_rgba(10,61,98,0.18)] transition-all duration-300 hover:bg-[#FFC300] hover:text-[#0A3D62] hover:shadow-[0_12px_28px_rgba(10,61,98,0.22)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#0A3D62] disabled:hover:text-white"
            >
              {cargando ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                    aria-hidden="true"
                  />

                  Verificando código...
                </>
              ) : (
                <>
                  <CheckCircle2
                    size={18}
                    strokeWidth={2}
                    className="transition-transform duration-200 group-hover:scale-105"
                    aria-hidden="true"
                  />

                  Validar y continuar
                </>
              )}
            </button>
          </form>

          {/* Aviso */}
          <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3">
            <ShieldCheck
              size={17}
              className="mt-0.5 shrink-0 text-amber-600"
              strokeWidth={1.9}
              aria-hidden="true"
            />

            <p className="text-[11px] leading-5 text-amber-800">
              El código cambia periódicamente. No lo compartas
              con otras personas ni con personal de soporte.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}