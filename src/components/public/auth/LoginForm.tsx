"use client";

import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  LogIn,
  Mail,
  ShieldCheck,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

import { LoginSocialButtons } from "./LoginSocialButtons";

interface LoginFormProps {
  onMfaRequired: (email: string) => void;
}

interface LoginData {
  correo: string;
  contrasena: string;
}

interface Errores {
  correo?: string;
  contrasena?: string;
}

interface UsuarioLogin {
  nombre?: string | null;
  rol?:
    | string
    | {
        nombre?: string | null;
      }
    | null;
}

interface LoginResponse {
  usuario?: UsuarioLogin;
}

interface LoginErrorResponse {
  message?: string;
  requireMfa?: boolean;
}

const CORREO_RECORDADO_KEY =
  "cmp_correo_recordado";

function cn(
  ...clases: Array<
    string | false | null | undefined
  >
): string {
  return clases.filter(Boolean).join(" ");
}

function validarCorreo(correo: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    correo,
  );
}

function obtenerRol(
  usuario: UsuarioLogin | undefined,
): string {
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
    rol === "administrador"
  ) {
    return "/dashboard-admin";
  }

  return "/";
}

export function LoginForm({
  onMfaRequired,
}: LoginFormProps) {
  const router = useRouter();

  const [loginData, setLoginData] =
    useState<LoginData>({
      correo: "",
      contrasena: "",
    });

  const [errores, setErrores] =
    useState<Errores>({});

  const [
    mostrarContrasena,
    setMostrarContrasena,
  ] = useState(false);

  const [recordarme, setRecordarme] =
    useState(false);

  const [cargando, setCargando] =
    useState(false);

  useEffect(() => {
    const correoRecordado =
      window.localStorage.getItem(
        CORREO_RECORDADO_KEY,
      );

    if (!correoRecordado) {
      return;
    }

    setLoginData((actual) => ({
      ...actual,
      correo: correoRecordado,
    }));

    setRecordarme(true);
  }, []);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const campo =
      event.target.name as keyof LoginData;

    const valor = event.target.value;

    setLoginData((actual) => ({
      ...actual,
      [campo]: valor,
    }));

    if (errores[campo]) {
      setErrores((actual) => ({
        ...actual,
        [campo]: undefined,
      }));
    }
  };

  const validarFormulario = (): boolean => {
    const nuevosErrores: Errores = {};
    const correo = loginData.correo.trim();

    if (!correo) {
      nuevosErrores.correo =
        "Ingresa tu correo electrónico.";
    } else if (!validarCorreo(correo)) {
      nuevosErrores.correo =
        "Ingresa un correo electrónico válido.";
    }

    if (!loginData.contrasena) {
      nuevosErrores.contrasena =
        "Ingresa tu contraseña.";
    }

    setErrores(nuevosErrores);

    return (
      Object.keys(nuevosErrores).length === 0
    );
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (cargando || !validarFormulario()) {
      return;
    }

    const correo = loginData.correo
      .trim()
      .toLocaleLowerCase("es-MX");

    try {
      setCargando(true);

      const respuesta =
        await axios.post<LoginResponse>(
          "/api/auth/login",
          {
            correo,
            contrasena:
              loginData.contrasena,
          },
        );

      const usuario =
        respuesta.data.usuario;

      if (!usuario) {
        throw new Error(
          "La respuesta del servidor no contiene los datos del usuario.",
        );
      }

      if (recordarme) {
        window.localStorage.setItem(
          CORREO_RECORDADO_KEY,
          correo,
        );
      } else {
        window.localStorage.removeItem(
          CORREO_RECORDADO_KEY,
        );
      }

      const nombre =
        usuario.nombre?.trim() ||
        "usuario";

      const rol = obtenerRol(usuario);
      const destino = obtenerRutaPorRol(rol);

      toast.success(
        `¡Bienvenido, ${nombre}!`,
      );

      router.replace(destino);
      router.refresh();
    } catch (error: unknown) {
      console.error(
        "Error al iniciar sesión:",
        error,
      );

      if (
        axios.isAxiosError<LoginErrorResponse>(
          error,
        )
      ) {
        const estado =
          error.response?.status;

        const datos =
          error.response?.data;

        if (estado === 423) {
          toast.error(
            datos?.message ||
              "Tu cuenta está bloqueada temporalmente. Intenta nuevamente en 15 minutos.",
          );

          return;
        }

        if (
          estado === 403 &&
          datos?.requireMfa
        ) {
          onMfaRequired(correo);

          toast.info(
            "Ingresa tu código de autenticación para continuar.",
          );

          return;
        }

        if (estado === 401) {
          toast.error(
            datos?.message ||
              "El correo o la contraseña son incorrectos.",
          );

          return;
        }

        if (!error.response) {
          toast.error(
            "No fue posible conectarse. Verifica tu conexión a internet.",
          );

          return;
        }

        toast.error(
          datos?.message ||
            "No fue posible iniciar sesión. Intenta nuevamente.",
        );

        return;
      }

      toast.error(
        error instanceof Error
          ? error.message
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
          {/* Encabezado */}
          <header className="text-center">
            <div className="mx-auto flex w-fit items-center justify-center">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-[#0A3D62]/10 bg-white shadow-[0_8px_22px_rgba(10,61,98,0.10)]">
                <div
                  className="absolute inset-2 rounded-xl bg-[#FFC300]/15 blur-lg"
                  aria-hidden="true"
                />

                <Image
                  src="/logo.png"
                  alt="Centro Médico Pichardo"
                  width={52}
                  height={52}
                  priority
                  className="relative h-12 w-12 object-contain"
                />
              </div>
            </div>

            <div className="mt-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.13em] text-emerald-700">
                <ShieldCheck
                  size={12}
                  strokeWidth={2}
                  aria-hidden="true"
                />

                Acceso seguro
              </span>

              <h1 className="mt-2.5 text-2xl font-extrabold leading-tight text-[#0A3D62] sm:text-3xl">
                Bienvenido de nuevo
              </h1>

              <p className="mx-auto mt-1.5 max-w-sm text-sm leading-6 text-gray-500">
                Inicia sesión para acceder a tus
                cursos, registros y servicios.
              </p>
            </div>
          </header>

          {/* Inicio social */}
          <div className="mt-5">
            <LoginSocialButtons />
          </div>

          {/* Separador */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>

            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
                O continúa con tu correo
              </span>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-4"
          >
            {/* Correo */}
            <div>
              <label
                htmlFor="correo"
                className="mb-1.5 block text-xs font-bold text-[#0A3D62]"
              >
                Correo electrónico
              </label>

              <div
                className={cn(
                  "group relative rounded-xl border bg-white transition-all duration-200 focus-within:border-[#FFC300] focus-within:ring-4 focus-within:ring-[#FFC300]/10",
                  errores.correo
                    ? "border-red-400 bg-red-50/30"
                    : "border-gray-200 hover:border-[#0A3D62]/25",
                )}
              >
                <Mail
                  size={18}
                  strokeWidth={1.8}
                  className={cn(
                    "pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors",
                    errores.correo
                      ? "text-red-500"
                      : "text-gray-400 group-focus-within:text-[#B88600]",
                  )}
                  aria-hidden="true"
                />

                <input
                  id="correo"
                  type="email"
                  name="correo"
                  value={loginData.correo}
                  onChange={handleChange}
                  autoComplete="email"
                  inputMode="email"
                  spellCheck={false}
                  disabled={cargando}
                  aria-invalid={
                    Boolean(errores.correo)
                  }
                  aria-describedby={
                    errores.correo
                      ? "correo-error"
                      : undefined
                  }
                  placeholder="nombre@correo.com"
                  className="h-12 w-full rounded-xl bg-transparent pl-11 pr-4 text-sm font-medium text-gray-800 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              {errores.correo && (
                <p
                  id="correo-error"
                  className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600"
                  role="alert"
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />

                  {errores.correo}
                </p>
              )}
            </div>

            {/* Contraseña */}
            <div>
              <div className="mb-1.5 flex items-center justify-between gap-3">
                <label
                  htmlFor="contrasena"
                  className="text-xs font-bold text-[#0A3D62]"
                >
                  Contraseña
                </label>

                <Link
                  href="/recuperar-password"
                  className="text-[11px] font-bold text-[#0A3D62] transition-colors hover:text-[#B88600] focus:outline-none focus-visible:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <div
                className={cn(
                  "group relative rounded-xl border bg-white transition-all duration-200 focus-within:border-[#FFC300] focus-within:ring-4 focus-within:ring-[#FFC300]/10",
                  errores.contrasena
                    ? "border-red-400 bg-red-50/30"
                    : "border-gray-200 hover:border-[#0A3D62]/25",
                )}
              >
                <LockKeyhole
                  size={18}
                  strokeWidth={1.8}
                  className={cn(
                    "pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors",
                    errores.contrasena
                      ? "text-red-500"
                      : "text-gray-400 group-focus-within:text-[#B88600]",
                  )}
                  aria-hidden="true"
                />

                <input
                  id="contrasena"
                  type={
                    mostrarContrasena
                      ? "text"
                      : "password"
                  }
                  name="contrasena"
                  value={loginData.contrasena}
                  onChange={handleChange}
                  autoComplete="current-password"
                  disabled={cargando}
                  aria-invalid={Boolean(
                    errores.contrasena,
                  )}
                  aria-describedby={
                    errores.contrasena
                      ? "contrasena-error"
                      : undefined
                  }
                  placeholder="Ingresa tu contraseña"
                  className="h-12 w-full rounded-xl bg-transparent pl-11 pr-12 text-sm font-medium text-gray-800 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() =>
                    setMostrarContrasena(
                      (actual) => !actual,
                    )
                  }
                  disabled={cargando}
                  className="absolute right-2.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-[#EAF2F8] hover:text-[#0A3D62] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300] disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label={
                    mostrarContrasena
                      ? "Ocultar contraseña"
                      : "Mostrar contraseña"
                  }
                  aria-pressed={
                    mostrarContrasena
                  }
                >
                  {mostrarContrasena ? (
                    <EyeOff
                      size={17}
                      aria-hidden="true"
                    />
                  ) : (
                    <Eye
                      size={17}
                      aria-hidden="true"
                    />
                  )}
                </button>
              </div>

              {errores.contrasena && (
                <p
                  id="contrasena-error"
                  className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600"
                  role="alert"
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />

                  {errores.contrasena}
                </p>
              )}
            </div>

            {/* Recordarme */}
            <label className="flex w-fit cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={recordarme}
                onChange={(event) =>
                  setRecordarme(
                    event.target.checked,
                  )
                }
                disabled={cargando}
                className="peer sr-only"
              />

              <span className="flex h-5 w-5 items-center justify-center rounded-md border border-gray-300 bg-white text-transparent transition-all peer-checked:border-[#0A3D62] peer-checked:bg-[#0A3D62] peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-[#FFC300] peer-focus-visible:ring-offset-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
                <CheckCircle2
                  size={14}
                  strokeWidth={2.2}
                  aria-hidden="true"
                />
              </span>

              <span className="text-xs font-medium text-gray-600">
                Recordar mi correo
              </span>
            </label>

            {/* Acción */}
            <button
              type="submit"
              disabled={cargando}
              className="group relative flex min-h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-[#0A3D62] px-5 py-3 text-sm font-extrabold text-white shadow-[0_8px_22px_rgba(10,61,98,0.18)] transition-all duration-300 hover:bg-[#FFC300] hover:text-[#0A3D62] hover:shadow-[0_12px_28px_rgba(10,61,98,0.22)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-65"
            >
              {cargando ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                    aria-hidden="true"
                  />

                  Verificando acceso...
                </>
              ) : (
                <>
                  <LogIn
                    size={18}
                    strokeWidth={2}
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />

                  Iniciar sesión
                </>
              )}
            </button>
          </form>

          {/* Seguridad */}
          <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-[#0A3D62]/10 bg-[#F7FAFC] px-3.5 py-3">
            <ShieldCheck
              size={17}
              className="mt-0.5 shrink-0 text-emerald-600"
              strokeWidth={1.9}
              aria-hidden="true"
            />

            <p className="text-[11px] leading-5 text-gray-500">
              Tu acceso está protegido. Nunca
              guardamos tu contraseña en este
              dispositivo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}