"use client";

import {
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import {
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  Loader2,
  MailCheck,
  ShieldCheck,
} from "lucide-react";
import { toast } from "react-toastify";

interface VerifyCodeFormProps {
  email: string;
  onBack: () => void;
  onVerify: (codigo: string) => Promise<void>;
  loading: boolean;
}

const TOTAL_DIGITOS = 6;

function cn(
  ...clases: Array<string | false | null | undefined>
): string {
  return clases.filter(Boolean).join(" ");
}

function ocultarCorreo(email: string): string {
  const correo = email.trim();
  const [usuario, dominio] = correo.split("@");

  if (!usuario || !dominio) {
    return correo;
  }

  if (usuario.length <= 2) {
    return `${usuario.charAt(0)}•••@${dominio}`;
  }

  const inicio = usuario.slice(0, 2);
  const caracteresOcultos = Math.max(
    usuario.length - 2,
    3,
  );

  return `${inicio}${"•".repeat(
    caracteresOcultos,
  )}@${dominio}`;
}

export function VerifyCodeForm({
  email,
  onBack,
  onVerify,
  loading,
}: VerifyCodeFormProps) {
  const inputsRef =
    useRef<Array<HTMLInputElement | null>>([]);

  const [codigo, setCodigo] = useState<string[]>(
    Array(TOTAL_DIGITOS).fill(""),
  );

  const [error, setError] = useState("");
  const [verificado, setVerificado] =
    useState(false);

  const codigoCompleto = codigo.join("");

  const codigoValido =
    codigoCompleto.length === TOTAL_DIGITOS &&
    /^\d{6}$/.test(codigoCompleto);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const enfocarCampo = (indice: number) => {
    const indiceSeguro = Math.min(
      Math.max(indice, 0),
      TOTAL_DIGITOS - 1,
    );

    const input =
      inputsRef.current[indiceSeguro];

    input?.focus();
    input?.select();
  };

  const limpiarCodigo = () => {
    setCodigo(
      Array(TOTAL_DIGITOS).fill(""),
    );

    window.requestAnimationFrame(() => {
      enfocarCampo(0);
    });
  };

  const distribuirCodigo = (
    valor: string,
    indiceInicial = 0,
  ) => {
    const digitos = valor
      .replace(/\D/g, "")
      .slice(
        0,
        TOTAL_DIGITOS - indiceInicial,
      )
      .split("");

    if (digitos.length === 0) {
      return;
    }

    setCodigo((actual) => {
      const siguiente = [...actual];

      digitos.forEach(
        (digito, posicion) => {
          siguiente[
            indiceInicial + posicion
          ] = digito;
        },
      );

      return siguiente;
    });

    setError("");

    const ultimoIndiceEscrito =
      indiceInicial + digitos.length - 1;

    const siguienteIndice = Math.min(
      ultimoIndiceEscrito + 1,
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
    const digitos = valor.replace(
      /\D/g,
      "",
    );

    if (digitos.length > 1) {
      distribuirCodigo(digitos, indice);
      return;
    }

    setCodigo((actual) => {
      const siguiente = [...actual];

      siguiente[indice] =
        digitos.slice(-1);

      return siguiente;
    });

    setError("");

    if (
      digitos &&
      indice < TOTAL_DIGITOS - 1
    ) {
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

    if (
      event.key === "ArrowLeft" &&
      indice > 0
    ) {
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

    const texto =
      event.clipboardData.getData("text");

    distribuirCodigo(texto, 0);
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    if (!codigoValido) {
      setError(
        "Ingresa los 6 dígitos del código de verificación.",
      );

      const primerCampoVacio =
        codigo.findIndex(
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
      setError("");

      await onVerify(codigoCompleto);

      setVerificado(true);
    } catch (errorVerificacion: unknown) {
      console.error(
        "Error al verificar el código:",
        errorVerificacion,
      );

      setError(
        errorVerificacion instanceof Error
          ? errorVerificacion.message
          : "El código es inválido o ha expirado.",
      );

      limpiarCodigo();
    }
  };

  if (verificado) {
    return (
      <div className="mx-auto w-full max-w-[460px]">
        <div className="relative overflow-hidden rounded-3xl border border-emerald-200 bg-white shadow-[0_20px_55px_rgba(10,61,98,0.12)]">
          <div
            className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-[#FFC300] to-emerald-500"
            aria-hidden="true"
          />

          <div
            className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-400/15 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative px-5 py-9 text-center sm:px-8 sm:py-10">
            <div className="relative mx-auto flex h-18 w-18 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-[0_12px_30px_rgba(5,150,105,0.24)]">
              <div
                className="absolute inset-2 rounded-xl bg-white/20 blur-lg"
                aria-hidden="true"
              />

              <CheckCircle2
                size={36}
                strokeWidth={1.8}
                className="relative"
                aria-hidden="true"
              />
            </div>

            <span className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.13em] text-emerald-700">
              <ShieldCheck
                size={12}
                aria-hidden="true"
              />

              Correo verificado
            </span>

            <h1 className="mt-3 text-2xl font-extrabold text-[#0A3D62] sm:text-3xl">
              ¡Cuenta creada!
            </h1>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
              Tu correo fue verificado y tu cuenta
              se creó correctamente.
            </p>

            <div className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-[#0A3D62]/10 bg-[#F7FAFC] px-4 py-3">
              <MailCheck
                size={17}
                className="shrink-0 text-emerald-600"
                aria-hidden="true"
              />

              <p className="truncate text-xs font-bold text-[#0A3D62]">
                {ocultarCorreo(email)}
              </p>
            </div>

            <p className="mt-5 text-xs font-medium text-gray-500">
              Ahora puedes iniciar sesión con tus
              credenciales.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[460px]">
      <div className="relative overflow-hidden rounded-3xl border border-[#0A3D62]/10 bg-white shadow-[0_20px_55px_rgba(10,61,98,0.12)]">
        <div
          className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#0A3D62] via-[#FFC300] to-[#0A3D62]"
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#FFC300]/15 blur-3xl"
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute -bottom-20 -left-20 h-44 w-44 rounded-full bg-[#0A3D62]/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative p-5 sm:p-7">
          <button
            type="button"
            onClick={onBack}
            disabled={loading}
            className="group inline-flex min-h-9 items-center gap-2 rounded-lg px-2 text-xs font-bold text-gray-500 transition-colors hover:bg-[#F7FAFC] hover:text-[#0A3D62] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArrowLeft
              size={16}
              strokeWidth={2}
              className="transition-transform group-hover:-translate-x-0.5"
              aria-hidden="true"
            />

            Volver al registro
          </button>

          <header className="mt-4 text-center">
            <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0A3D62] text-[#FFC300] shadow-[0_10px_28px_rgba(10,61,98,0.2)]">
              <div
                className="absolute inset-2 rounded-xl bg-[#FFC300]/20 blur-lg"
                aria-hidden="true"
              />

              <MailCheck
                size={31}
                strokeWidth={1.8}
                className="relative"
                aria-hidden="true"
              />
            </div>

            <span className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-[#0A3D62]/10 bg-[#F7FAFC] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.13em] text-[#0A3D62]">
              <ShieldCheck
                size={11}
                className="text-emerald-600"
                aria-hidden="true"
              />

              Verificación de correo
            </span>

            <h1 className="mt-2.5 text-2xl font-extrabold leading-tight text-[#0A3D62] sm:text-3xl">
              Revisa tu correo
            </h1>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
              Enviamos un código de seis dígitos
              para confirmar tu dirección de correo.
            </p>
          </header>

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
                Código enviado a
              </p>

              <p
                className="truncate text-xs font-bold text-[#0A3D62]"
                title={email}
              >
                {ocultarCorreo(email)}
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="mt-5"
          >
            <fieldset disabled={loading}>
              <legend className="mb-2 block text-xs font-bold text-[#0A3D62]">
                Código de verificación
              </legend>

              <div
                className="grid grid-cols-6 gap-1.5 sm:gap-2"
                role="group"
                aria-label="Código de verificación de seis dígitos"
              >
                {codigo.map(
                  (digito, indice) => (
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
                        handleKeyDown(
                          event,
                          indice,
                        )
                      }
                      onPaste={handlePaste}
                      maxLength={1}
                      aria-label={`Dígito ${
                        indice + 1
                      } de ${TOTAL_DIGITOS}`}
                      aria-invalid={Boolean(
                        error,
                      )}
                      className={cn(
                        "h-12 min-w-0 rounded-xl border bg-white text-center text-lg font-extrabold text-[#0A3D62] outline-none transition-all sm:h-14 sm:text-xl",
                        error
                          ? "border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                          : "border-gray-200 hover:border-[#0A3D62]/25 focus:border-[#FFC300] focus:ring-4 focus:ring-[#FFC300]/10",
                      )}
                    />
                  ),
                )}
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
                    Puedes escribir o pegar el
                    código completo.
                  </p>
                )}
              </div>
            </fieldset>

            <button
              type="submit"
              disabled={loading || !codigoValido}
              className="group mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0A3D62] px-5 py-3 text-sm font-extrabold text-white shadow-[0_8px_22px_rgba(10,61,98,0.18)] transition-all duration-300 hover:bg-[#FFC300] hover:text-[#0A3D62] hover:shadow-[0_12px_28px_rgba(10,61,98,0.22)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#0A3D62] disabled:hover:text-white"
            >
              {loading ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                    aria-hidden="true"
                  />

                  Verificando cuenta...
                </>
              ) : (
                <>
                  <CheckCircle2
                    size={18}
                    strokeWidth={2}
                    className="transition-transform group-hover:scale-105"
                    aria-hidden="true"
                  />

                  Verificar y crear cuenta
                </>
              )}
            </button>
          </form>

          <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-center">
            <p className="text-[11px] leading-5 text-amber-800">
              Revisa también las carpetas de correo
              no deseado o spam.
            </p>

            <button
              type="button"
              onClick={() =>
                toast.info(
                  "Regresa al formulario para solicitar un nuevo código.",
                )
              }
              disabled={loading}
              className="mt-1 text-[11px] font-extrabold text-[#0A3D62] transition-colors hover:text-[#B88600] hover:underline disabled:cursor-not-allowed disabled:opacity-50"
            >
              No recibí el código
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}