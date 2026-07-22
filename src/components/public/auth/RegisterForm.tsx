"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import {
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  UserPlus,
  UserRound,
  UsersRound,
  XCircle,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

import { RegisterSocialButtons } from "./RegisterSocialButtons";
import { VerifyCodeForm } from "./VerifyCodeForm";

interface RegisterFormProps {
  onRegistroExitoso?: () => void;
}

interface RegisterData {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  edad: string;
  sexo: "masculino" | "femenino" | "otro" | "";
  correo: string;
  telefono: string;
  contrasena: string;
  confirmarContrasena: string;
}

interface Errores {
  nombre?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  edad?: string;
  sexo?: string;
  correo?: string;
  telefono?: string;
  contrasena?: string;
  confirmarContrasena?: string;
  terminos?: string;
}

interface CheckEmailResponse {
  disponible?: boolean;
}

interface SendOtpResponse {
  success?: boolean;
  message?: string;
}

interface ApiErrorResponse {
  message?: string;
  error?: string;
}

interface RequisitoContrasena {
  etiqueta: string;
  cumple: boolean;
}

const ERROR_CORREO_REGISTRADO =
  "Este correo ya está registrado.";

const SECUENCIAS_NUMERICAS = [
  "012",
  "123",
  "234",
  "345",
  "456",
  "567",
  "678",
  "789",
  "890",
];

const SECUENCIAS_LETRAS = [
  "abc",
  "bcd",
  "cde",
  "def",
  "efg",
  "fgh",
  "ghi",
  "hij",
  "ijk",
  "jkl",
  "klm",
  "lmn",
  "mno",
  "nop",
  "opq",
  "pqr",
  "qrs",
  "rst",
  "stu",
  "tuv",
  "uvw",
  "vwx",
  "wxy",
  "xyz",
];

const FORMULARIO_INICIAL: RegisterData = {
  nombre: "",
  apellidoPaterno: "",
  apellidoMaterno: "",
  edad: "",
  sexo: "",
  correo: "",
  telefono: "",
  contrasena: "",
  confirmarContrasena: "",
};

function cn(
  ...clases: Array<string | false | null | undefined>
): string {
  return clases.filter(Boolean).join(" ");
}

function esCorreoValido(correo: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}

function esNombreValido(valor: string): boolean {
  return /^[\p{L}\s'-]+$/u.test(valor);
}

function tieneSecuenciaNumerica(
  password: string,
): boolean {
  return SECUENCIAS_NUMERICAS.some((secuencia) =>
    password.includes(secuencia),
  );
}

function tieneSecuenciaLetras(
  password: string,
): boolean {
  const passwordMinuscula =
    password.toLocaleLowerCase("es-MX");

  return SECUENCIAS_LETRAS.some((secuencia) =>
    passwordMinuscula.includes(secuencia),
  );
}

function analizarContrasena(password: string) {
  const requisitos: RequisitoContrasena[] = [
    {
      etiqueta: "Mínimo 8 caracteres",
      cumple: password.length >= 8,
    },
    {
      etiqueta: "Una letra mayúscula",
      cumple: /[A-Z]/.test(password),
    },
    {
      etiqueta: "Una letra minúscula",
      cumple: /[a-z]/.test(password),
    },
    {
      etiqueta: "Un número",
      cumple: /[0-9]/.test(password),
    },
    {
      etiqueta: "Un carácter especial",
      cumple: /[^a-zA-Z0-9]/.test(password),
    },
    {
      etiqueta: "Sin secuencias numéricas",
      cumple: !tieneSecuenciaNumerica(password),
    },
    {
      etiqueta: "Sin secuencias de letras",
      cumple: !tieneSecuenciaLetras(password),
    },
    {
      etiqueta: "Sin 4 caracteres repetidos",
      cumple: !/(.)\1{3,}/.test(password),
    },
  ];

  const errores = requisitos
    .filter((requisito) => !requisito.cumple)
    .map((requisito) => requisito.etiqueta);

  let puntos = 0;

  if (password.length >= 8) puntos += 1;
  if (/[a-z]/.test(password)) puntos += 1;
  if (/[A-Z]/.test(password)) puntos += 1;
  if (/[0-9]/.test(password)) puntos += 1;
  if (/[^a-zA-Z0-9]/.test(password)) puntos += 1;

  if (
    tieneSecuenciaNumerica(password) ||
    tieneSecuenciaLetras(password) ||
    /(.)\1{3,}/.test(password)
  ) {
    puntos = Math.max(puntos - 1, 0);
  }

  let nivel = 0;

  if (password) {
    if (puntos <= 2) {
      nivel = 1;
    } else if (puntos === 3) {
      nivel = 2;
    } else if (puntos === 4) {
      nivel = 3;
    } else {
      nivel = 4;
    }
  }

  return {
    requisitos,
    errores,
    esValida: errores.length === 0,
    nivel,
  };
}

function obtenerFortaleza(nivel: number) {
  if (nivel === 1) {
    return {
      texto: "Muy débil",
      textoClase: "text-red-600",
      barraClase: "bg-red-500",
    };
  }

  if (nivel === 2) {
    return {
      texto: "Débil",
      textoClase: "text-orange-600",
      barraClase: "bg-orange-500",
    };
  }

  if (nivel === 3) {
    return {
      texto: "Buena",
      textoClase: "text-amber-600",
      barraClase: "bg-amber-500",
    };
  }

  if (nivel === 4) {
    return {
      texto: "Fuerte",
      textoClase: "text-emerald-600",
      barraClase: "bg-emerald-500",
    };
  }

  return {
    texto: "",
    textoClase: "text-gray-400",
    barraClase: "bg-gray-200",
  };
}

export function RegisterForm({
  onRegistroExitoso,
}: RegisterFormProps = {}) {
  const [registerData, setRegisterData] =
    useState<RegisterData>(FORMULARIO_INICIAL);

  const [errores, setErrores] =
    useState<Errores>({});

  const [
    mostrarContrasena,
    setMostrarContrasena,
  ] = useState(false);

  const [
    mostrarConfirmContrasena,
    setMostrarConfirmContrasena,
  ] = useState(false);

  const [aceptaTerminos, setAceptaTerminos] =
    useState(false);

  const [emailDisponible, setEmailDisponible] =
    useState<boolean | null>(null);

  const [verificandoEmail, setVerificandoEmail] =
    useState(false);

  const [cargando, setCargando] =
    useState(false);

  const [step, setStep] =
    useState<"form" | "verify">("form");

  const [emailRegistro, setEmailRegistro] =
    useState("");

  const analisisContrasena = useMemo(
    () =>
      analizarContrasena(
        registerData.contrasena,
      ),
    [registerData.contrasena],
  );

  const fortaleza = obtenerFortaleza(
    analisisContrasena.nivel,
  );

  const contrasenasCoinciden =
    Boolean(registerData.confirmarContrasena) &&
    registerData.contrasena ===
      registerData.confirmarContrasena;

  useEffect(() => {
    const correo = registerData.correo
      .trim()
      .toLocaleLowerCase("es-MX");

    setEmailDisponible(null);
    setVerificandoEmail(false);

    if (!esCorreoValido(correo)) {
      return;
    }

    const controller = new AbortController();

    const timer = window.setTimeout(async () => {
      setVerificandoEmail(true);

      try {
        const respuesta =
          await axios.get<CheckEmailResponse>(
            "/api/auth/check-email",
            {
              params: {
                email: correo,
              },
              signal: controller.signal,
            },
          );

        const disponible =
          respuesta.data.disponible === true;

        setEmailDisponible(disponible);

        if (!disponible) {
          setErrores((actual) => ({
            ...actual,
            correo: ERROR_CORREO_REGISTRADO,
          }));

          return;
        }

        setErrores((actual) => {
          if (
            actual.correo !==
            ERROR_CORREO_REGISTRADO
          ) {
            return actual;
          }

          return {
            ...actual,
            correo: undefined,
          };
        });
      } catch (error: unknown) {
        if (
          axios.isCancel(error) ||
          controller.signal.aborted
        ) {
          return;
        }

        console.error(
          "Error al verificar el correo:",
          error,
        );

        setEmailDisponible(null);
      } finally {
        if (!controller.signal.aborted) {
          setVerificandoEmail(false);
        }
      }
    }, 550);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [registerData.correo]);

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >,
  ) => {
    const nombre =
      event.target.name as keyof RegisterData;

    let valor = event.target.value;

    if (nombre === "telefono") {
      valor = valor
        .replace(/\D/g, "")
        .slice(0, 10);
    }

    if (nombre === "edad") {
      valor = valor
        .replace(/\D/g, "")
        .slice(0, 3);
    }

    setRegisterData((actual) => ({
      ...actual,
      [nombre]: valor,
    }));

    setErrores((actual) => ({
      ...actual,
      [nombre]: undefined,
    }));

    if (nombre === "correo") {
      setEmailDisponible(null);
    }
  };

  const validarFormulario = (): Errores => {
    const nuevosErrores: Errores = {};

    const nombre = registerData.nombre.trim();
    const apellidoPaterno =
      registerData.apellidoPaterno.trim();
    const apellidoMaterno =
      registerData.apellidoMaterno.trim();
    const correo = registerData.correo
      .trim()
      .toLocaleLowerCase("es-MX");

    if (!nombre) {
      nuevosErrores.nombre =
        "Ingresa tu nombre.";
    } else if (nombre.length < 2) {
      nuevosErrores.nombre =
        "Debe tener al menos 2 caracteres.";
    } else if (!esNombreValido(nombre)) {
      nuevosErrores.nombre =
        "Utiliza únicamente letras.";
    }

    if (!apellidoPaterno) {
      nuevosErrores.apellidoPaterno =
        "Ingresa tu apellido paterno.";
    } else if (apellidoPaterno.length < 2) {
      nuevosErrores.apellidoPaterno =
        "El apellido es demasiado corto.";
    } else if (
      !esNombreValido(apellidoPaterno)
    ) {
      nuevosErrores.apellidoPaterno =
        "Utiliza únicamente letras.";
    }

    if (!apellidoMaterno) {
      nuevosErrores.apellidoMaterno =
        "Ingresa tu apellido materno.";
    } else if (apellidoMaterno.length < 2) {
      nuevosErrores.apellidoMaterno =
        "El apellido es demasiado corto.";
    } else if (
      !esNombreValido(apellidoMaterno)
    ) {
      nuevosErrores.apellidoMaterno =
        "Utiliza únicamente letras.";
    }

    if (!registerData.edad) {
      nuevosErrores.edad =
        "Ingresa tu edad.";
    } else {
      const edad = Number(registerData.edad);

      if (!Number.isInteger(edad)) {
        nuevosErrores.edad =
          "Ingresa una edad válida.";
      } else if (edad < 18) {
        nuevosErrores.edad =
          "Debes ser mayor de 18 años.";
      } else if (edad > 100) {
        nuevosErrores.edad =
          "La edad máxima es 100 años.";
      }
    }

    if (!registerData.sexo) {
      nuevosErrores.sexo =
        "Selecciona una opción.";
    }

    if (!registerData.telefono) {
      nuevosErrores.telefono =
        "Ingresa tu teléfono.";
    } else if (
      !/^\d{10}$/.test(registerData.telefono)
    ) {
      nuevosErrores.telefono =
        "Debe contener 10 dígitos.";
    }

    if (!correo) {
      nuevosErrores.correo =
        "Ingresa tu correo electrónico.";
    } else if (!esCorreoValido(correo)) {
      nuevosErrores.correo =
        "Ingresa un correo válido.";
    } else if (emailDisponible === false) {
      nuevosErrores.correo =
        ERROR_CORREO_REGISTRADO;
    }

    if (!registerData.contrasena) {
      nuevosErrores.contrasena =
        "Ingresa una contraseña.";
    } else if (!analisisContrasena.esValida) {
      nuevosErrores.contrasena =
        analisisContrasena.errores[0];
    }

    if (!registerData.confirmarContrasena) {
      nuevosErrores.confirmarContrasena =
        "Confirma tu contraseña.";
    } else if (!contrasenasCoinciden) {
      nuevosErrores.confirmarContrasena =
        "Las contraseñas no coinciden.";
    }

    if (!aceptaTerminos) {
      nuevosErrores.terminos =
        "Debes aceptar los términos y condiciones.";
    }

    return nuevosErrores;
  };

  const enviarCodigoOTP = async () => {
    const correo = registerData.correo
      .trim()
      .toLocaleLowerCase("es-MX");

    const nombreCompleto = [
      registerData.nombre.trim(),
      registerData.apellidoPaterno.trim(),
    ]
      .filter(Boolean)
      .join(" ");

    const respuesta =
      await axios.post<SendOtpResponse>(
        "/api/auth/send-otp",
        {
          email: correo,
          nombre: nombreCompleto,
        },
      );

    if (!respuesta.data.success) {
      throw new Error(
        respuesta.data.message ||
          "No fue posible enviar el código.",
      );
    }

    setEmailRegistro(correo);
    setStep("verify");

    toast.success(
      "Enviamos un código de verificación a tu correo.",
    );
  };

  const handleFinalRegister = async (
    codigo: string,
  ) => {
    try {
      setCargando(true);

      await axios.post("/api/auth/register", {
        codigoVerificacion: codigo,
        nombre: registerData.nombre.trim(),
        apellidoPaterno:
          registerData.apellidoPaterno.trim(),
        apellidoMaterno:
          registerData.apellidoMaterno.trim(),
        edad: registerData.edad,
        sexo: registerData.sexo,
        telefono: registerData.telefono,
        correo: registerData.correo
          .trim()
          .toLocaleLowerCase("es-MX"),
        contrasena: registerData.contrasena,
      });

      toast.success(
        "¡Tu cuenta fue creada correctamente!",
      );

      onRegistroExitoso?.();
    } catch (error: unknown) {
      console.error(
        "Error al completar el registro:",
        error,
      );

      if (
        axios.isAxiosError<ApiErrorResponse>(
          error,
        )
      ) {
        toast.error(
          error.response?.data?.message ||
            error.response?.data?.error ||
            "No fue posible crear la cuenta.",
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

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (cargando) {
      return;
    }

    const nuevosErrores =
      validarFormulario();

    if (
      Object.keys(nuevosErrores).length > 0
    ) {
      setErrores(nuevosErrores);

      toast.error(
        "Revisa los campos marcados antes de continuar.",
      );

      return;
    }

    try {
      setCargando(true);
      await enviarCodigoOTP();
    } catch (error: unknown) {
      console.error(
        "Error al enviar el código OTP:",
        error,
      );

      if (
        axios.isAxiosError<ApiErrorResponse>(
          error,
        )
      ) {
        toast.error(
          error.response?.data?.message ||
            error.response?.data?.error ||
            "No fue posible enviar el código.",
        );

        return;
      }

      toast.error(
        error instanceof Error
          ? error.message
          : "No fue posible enviar el código.",
      );
    } finally {
      setCargando(false);
    }
  };

  if (step === "verify") {
    return (
      <VerifyCodeForm
        email={emailRegistro}
        onBack={() => {
          setStep("form");
        }}
        onVerify={handleFinalRegister}
        loading={cargando}
      />
    );
  }

  return (
    <div className="mx-auto w-full max-w-[700px]">
      <div className="relative overflow-hidden rounded-3xl border border-[#0A3D62]/10 bg-white shadow-[0_20px_55px_rgba(10,61,98,0.12)]">
        <div
          className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#0A3D62] via-[#FFC300] to-[#0A3D62]"
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#FFC300]/15 blur-3xl"
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute -bottom-24 -left-24 h-52 w-52 rounded-full bg-[#0A3D62]/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative p-4 sm:p-6">
          {/* Encabezado */}
          <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.13em] text-emerald-700">
                <ShieldCheck
                  size={12}
                  strokeWidth={2}
                  aria-hidden="true"
                />

                Registro seguro
              </span>

              <h1 className="mt-2 text-2xl font-extrabold leading-tight text-[#0A3D62] sm:text-3xl">
                Crea tu cuenta
              </h1>

              <p className="mt-1 text-sm leading-6 text-gray-500">
                Completa tus datos para acceder a cursos,
                contenidos y servicios.
              </p>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-xl border border-[#0A3D62]/10 bg-[#F7FAFC] px-3 py-2">
              <UserPlus
                size={16}
                className="text-[#0A3D62]"
                aria-hidden="true"
              />

              <p className="text-[11px] font-bold text-[#0A3D62]">
                Cuenta gratuita
              </p>
            </div>
          </header>

          {/* Redes sociales */}
          <div className="mt-5">
            <RegisterSocialButtons />
          </div>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>

            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
                O completa el formulario
              </span>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-3.5"
          >
            <fieldset
              disabled={cargando}
              className="space-y-3.5 disabled:opacity-70"
            >
              {/* Identidad */}
              <SeccionFormulario
                icono={
                  <UserRound
                    size={16}
                    aria-hidden="true"
                  />
                }
                titulo="Datos personales"
                descripcion="Información básica del titular de la cuenta."
              >
                <div className="grid gap-3 sm:grid-cols-3">
                  <CampoTexto
                    id="nombre"
                    name="nombre"
                    label="Nombre"
                    value={registerData.nombre}
                    onChange={handleChange}
                    error={errores.nombre}
                    icono={
                      <UserRound
                        size={16}
                        aria-hidden="true"
                      />
                    }
                    autoComplete="given-name"
                    placeholder="Nombre"
                  />

                  <CampoTexto
                    id="apellidoPaterno"
                    name="apellidoPaterno"
                    label="Apellido paterno"
                    value={
                      registerData.apellidoPaterno
                    }
                    onChange={handleChange}
                    error={
                      errores.apellidoPaterno
                    }
                    icono={
                      <UserRound
                        size={16}
                        aria-hidden="true"
                      />
                    }
                    autoComplete="family-name"
                    placeholder="Apellido"
                  />

                  <CampoTexto
                    id="apellidoMaterno"
                    name="apellidoMaterno"
                    label="Apellido materno"
                    value={
                      registerData.apellidoMaterno
                    }
                    onChange={handleChange}
                    error={
                      errores.apellidoMaterno
                    }
                    icono={
                      <UserRound
                        size={16}
                        aria-hidden="true"
                      />
                    }
                    autoComplete="additional-name"
                    placeholder="Apellido"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <CampoTexto
                    id="edad"
                    name="edad"
                    label="Edad"
                    value={registerData.edad}
                    onChange={handleChange}
                    error={errores.edad}
                    icono={
                      <CalendarDays
                        size={16}
                        aria-hidden="true"
                      />
                    }
                    type="text"
                    inputMode="numeric"
                    maxLength={3}
                    placeholder="18"
                  />

                  <CampoSelect
                    id="sexo"
                    name="sexo"
                    label="Sexo"
                    value={registerData.sexo}
                    onChange={handleChange}
                    error={errores.sexo}
                    icono={
                      <UsersRound
                        size={16}
                        aria-hidden="true"
                      />
                    }
                    opciones={[
                      {
                        valor: "masculino",
                        texto: "Masculino",
                      },
                      {
                        valor: "femenino",
                        texto: "Femenino",
                      },
                      {
                        valor: "otro",
                        texto: "Otro",
                      },
                    ]}
                  />
                </div>
              </SeccionFormulario>

              {/* Contacto */}
              <SeccionFormulario
                icono={
                  <Mail
                    size={16}
                    aria-hidden="true"
                  />
                }
                titulo="Información de contacto"
                descripcion="Usaremos estos datos para identificar y verificar tu cuenta."
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <CampoTexto
                    id="telefono"
                    name="telefono"
                    label="Teléfono"
                    value={registerData.telefono}
                    onChange={handleChange}
                    error={errores.telefono}
                    icono={
                      <Phone
                        size={16}
                        aria-hidden="true"
                      />
                    }
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    maxLength={10}
                    placeholder="10 dígitos"
                  />

                  <CampoTexto
                    id="correo"
                    name="correo"
                    label="Correo electrónico"
                    value={registerData.correo}
                    onChange={handleChange}
                    error={errores.correo}
                    icono={
                      <Mail
                        size={16}
                        aria-hidden="true"
                      />
                    }
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="nombre@correo.com"
                    endAdornment={
                      verificandoEmail ? (
                        <Loader2
                          size={16}
                          className="animate-spin text-gray-400"
                          aria-label="Verificando correo"
                        />
                      ) : emailDisponible ===
                        true ? (
                        <CheckCircle2
                          size={17}
                          className="text-emerald-600"
                          aria-label="Correo disponible"
                        />
                      ) : emailDisponible ===
                        false ? (
                        <XCircle
                          size={17}
                          className="text-red-500"
                          aria-label="Correo no disponible"
                        />
                      ) : null
                    }
                  />
                </div>
              </SeccionFormulario>

              {/* Seguridad */}
              <SeccionFormulario
                icono={
                  <LockKeyhole
                    size={16}
                    aria-hidden="true"
                  />
                }
                titulo="Seguridad"
                descripcion="Crea una contraseña segura para proteger tu información."
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <CampoTexto
                    id="contrasena"
                    name="contrasena"
                    label="Contraseña"
                    value={registerData.contrasena}
                    onChange={handleChange}
                    error={errores.contrasena}
                    icono={
                      <LockKeyhole
                        size={16}
                        aria-hidden="true"
                      />
                    }
                    type={
                      mostrarContrasena
                        ? "text"
                        : "password"
                    }
                    autoComplete="new-password"
                    placeholder="Crea una contraseña"
                    endAdornment={
                      <BotonMostrarPassword
                        mostrar={mostrarContrasena}
                        onClick={() =>
                          setMostrarContrasena(
                            (actual) => !actual,
                          )
                        }
                        etiqueta="contraseña"
                      />
                    }
                  />

                  <CampoTexto
                    id="confirmarContrasena"
                    name="confirmarContrasena"
                    label="Confirmar contraseña"
                    value={
                      registerData.confirmarContrasena
                    }
                    onChange={handleChange}
                    error={
                      errores.confirmarContrasena
                    }
                    icono={
                      <LockKeyhole
                        size={16}
                        aria-hidden="true"
                      />
                    }
                    type={
                      mostrarConfirmContrasena
                        ? "text"
                        : "password"
                    }
                    autoComplete="new-password"
                    placeholder="Repite la contraseña"
                    endAdornment={
                      <BotonMostrarPassword
                        mostrar={
                          mostrarConfirmContrasena
                        }
                        onClick={() =>
                          setMostrarConfirmContrasena(
                            (actual) => !actual,
                          )
                        }
                        etiqueta="confirmación de contraseña"
                      />
                    }
                  />
                </div>

                {registerData.contrasena && (
                  <div className="rounded-xl border border-gray-200 bg-white p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400">
                        Fortaleza
                      </p>

                      <p
                        className={cn(
                          "text-xs font-extrabold",
                          fortaleza.textoClase,
                        )}
                      >
                        {fortaleza.texto}
                      </p>
                    </div>

                    <div className="mt-2 grid grid-cols-4 gap-1.5">
                      {[1, 2, 3, 4].map(
                        (nivel) => (
                          <div
                            key={nivel}
                            className={cn(
                              "h-1.5 rounded-full transition-colors",
                              analisisContrasena.nivel >=
                                nivel
                                ? fortaleza.barraClase
                                : "bg-gray-200",
                            )}
                          />
                        ),
                      )}
                    </div>

                    <div className="mt-3 grid gap-x-4 gap-y-1.5 sm:grid-cols-2">
                      {analisisContrasena.requisitos.map(
                        (requisito) => (
                          <div
                            key={requisito.etiqueta}
                            className="flex items-center gap-1.5"
                          >
                            {requisito.cumple ? (
                              <CheckCircle2
                                size={13}
                                className="shrink-0 text-emerald-600"
                                aria-hidden="true"
                              />
                            ) : (
                              <XCircle
                                size={13}
                                className="shrink-0 text-gray-300"
                                aria-hidden="true"
                              />
                            )}

                            <span
                              className={cn(
                                "text-[10px] leading-4",
                                requisito.cumple
                                  ? "font-semibold text-emerald-700"
                                  : "text-gray-500",
                              )}
                            >
                              {requisito.etiqueta}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {registerData.confirmarContrasena && (
                  <div
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-2 text-[11px] font-semibold",
                      contrasenasCoinciden
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-600",
                    )}
                  >
                    {contrasenasCoinciden ? (
                      <CheckCircle2
                        size={14}
                        aria-hidden="true"
                      />
                    ) : (
                      <XCircle
                        size={14}
                        aria-hidden="true"
                      />
                    )}

                    {contrasenasCoinciden
                      ? "Las contraseñas coinciden."
                      : "Las contraseñas no coinciden."}
                  </div>
                )}
              </SeccionFormulario>

              {/* Términos */}
              <div>
                <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-gray-200 bg-[#F7FAFC] px-3.5 py-3">
                  <input
                    type="checkbox"
                    checked={aceptaTerminos}
                    onChange={(event) => {
                      setAceptaTerminos(
                        event.target.checked,
                      );

                      setErrores((actual) => ({
                        ...actual,
                        terminos: undefined,
                      }));
                    }}
                    className="peer sr-only"
                  />

                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-white text-transparent transition-all peer-checked:border-[#0A3D62] peer-checked:bg-[#0A3D62] peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-[#FFC300] peer-focus-visible:ring-offset-2">
                    <CheckCircle2
                      size={14}
                      strokeWidth={2.2}
                      aria-hidden="true"
                    />
                  </span>

                  <span className="text-[11px] leading-5 text-gray-600">
                    Acepto los{" "}
                    <Link
                      href="/terminos"
                      className="font-bold text-[#0A3D62] transition-colors hover:text-[#B88600]"
                    >
                      Términos y Condiciones
                    </Link>{" "}
                    y la{" "}
                    <Link
                      href="/privacidad"
                      className="font-bold text-[#0A3D62] transition-colors hover:text-[#B88600]"
                    >
                      Política de Privacidad
                    </Link>
                    .
                  </span>
                </label>

                {errores.terminos && (
                  <MensajeError
                    id="terminos-error"
                    mensaje={errores.terminos}
                  />
                )}
              </div>
            </fieldset>

            <button
              type="submit"
              disabled={cargando}
              className="group flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0A3D62] px-5 py-3 text-sm font-extrabold text-white shadow-[0_8px_22px_rgba(10,61,98,0.18)] transition-all duration-300 hover:bg-[#FFC300] hover:text-[#0A3D62] hover:shadow-[0_12px_28px_rgba(10,61,98,0.22)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {cargando ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                    aria-hidden="true"
                  />

                  Enviando código...
                </>
              ) : (
                <>
                  <UserPlus
                    size={18}
                    strokeWidth={2}
                    className="transition-transform duration-200 group-hover:scale-105"
                    aria-hidden="true"
                  />

                  Crear cuenta
                </>
              )}
            </button>
          </form>

          <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-[#0A3D62]/10 bg-[#F7FAFC] px-3.5 py-3">
            <ShieldCheck
              size={17}
              className="mt-0.5 shrink-0 text-emerald-600"
              aria-hidden="true"
            />

            <p className="text-[11px] leading-5 text-gray-500">
              Verificaremos tu correo antes de crear la cuenta.
              Tu contraseña no se almacena en este dispositivo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface SeccionFormularioProps {
  icono: ReactNode;
  titulo: string;
  descripcion: string;
  children: ReactNode;
}

function SeccionFormulario({
  icono,
  titulo,
  descripcion,
  children,
}: SeccionFormularioProps) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-[#F8FAFC] p-3.5 sm:p-4">
      <header className="mb-3 flex items-start gap-2.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#EAF2F8] text-[#0A3D62]">
          {icono}
        </span>

        <div>
          <h2 className="text-xs font-extrabold text-[#0A3D62]">
            {titulo}
          </h2>

          <p className="mt-0.5 text-[10px] leading-4 text-gray-500">
            {descripcion}
          </p>
        </div>
      </header>

      <div className="space-y-3">
        {children}
      </div>
    </section>
  );
}

interface CampoTextoProps {
  id: string;
  name: keyof RegisterData;
  label: string;
  value: string;
  onChange: (
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
  error?: string;
  icono: ReactNode;
  type?: string;
  inputMode?:
    | "text"
    | "email"
    | "tel"
    | "numeric";
  autoComplete?: string;
  placeholder?: string;
  maxLength?: number;
  endAdornment?: ReactNode;
}

function CampoTexto({
  id,
  name,
  label,
  value,
  onChange,
  error,
  icono,
  type = "text",
  inputMode,
  autoComplete,
  placeholder,
  maxLength,
  endAdornment,
}: CampoTextoProps) {
  const errorId = `${id}-error`;

  return (
    <div className="min-w-0">
      <label
        htmlFor={id}
        className="mb-1.5 block text-[11px] font-bold text-[#0A3D62]"
      >
        {label}
      </label>

      <div
        className={cn(
          "group relative rounded-xl border bg-white transition-all focus-within:border-[#FFC300] focus-within:ring-4 focus-within:ring-[#FFC300]/10",
          error
            ? "border-red-400 bg-red-50/30"
            : "border-gray-200 hover:border-[#0A3D62]/25",
        )}
      >
        <span
          className={cn(
            "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 transition-colors",
            error
              ? "text-red-500"
              : "text-gray-400 group-focus-within:text-[#B88600]",
          )}
        >
          {icono}
        </span>

        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          inputMode={inputMode}
          autoComplete={autoComplete}
          placeholder={placeholder}
          maxLength={maxLength}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error ? errorId : undefined
          }
          className={cn(
            "h-11 w-full rounded-xl bg-transparent pl-10 text-xs font-medium text-gray-800 outline-none placeholder:text-gray-400",
            endAdornment
              ? "pr-10"
              : "pr-3",
          )}
        />

        {endAdornment && (
          <span className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center">
            {endAdornment}
          </span>
        )}
      </div>

      {error && (
        <MensajeError
          id={errorId}
          mensaje={error}
        />
      )}
    </div>
  );
}

interface CampoSelectProps {
  id: string;
  name: keyof RegisterData;
  label: string;
  value: string;
  onChange: (
    event: ChangeEvent<HTMLSelectElement>,
  ) => void;
  error?: string;
  icono: ReactNode;
  opciones: Array<{
    valor: string;
    texto: string;
  }>;
}

function CampoSelect({
  id,
  name,
  label,
  value,
  onChange,
  error,
  icono,
  opciones,
}: CampoSelectProps) {
  const errorId = `${id}-error`;

  return (
    <div className="min-w-0">
      <label
        htmlFor={id}
        className="mb-1.5 block text-[11px] font-bold text-[#0A3D62]"
      >
        {label}
      </label>

      <div
        className={cn(
          "group relative rounded-xl border bg-white transition-all focus-within:border-[#FFC300] focus-within:ring-4 focus-within:ring-[#FFC300]/10",
          error
            ? "border-red-400 bg-red-50/30"
            : "border-gray-200 hover:border-[#0A3D62]/25",
        )}
      >
        <span
          className={cn(
            "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2",
            error
              ? "text-red-500"
              : "text-gray-400 group-focus-within:text-[#B88600]",
          )}
        >
          {icono}
        </span>

        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error ? errorId : undefined
          }
          className="h-11 w-full cursor-pointer appearance-none rounded-xl bg-transparent pl-10 pr-10 text-xs font-medium text-gray-800 outline-none"
        >
          <option value="" disabled>
            Selecciona una opción
          </option>

          {opciones.map((opcion) => (
            <option
              key={opcion.valor}
              value={opcion.valor}
            >
              {opcion.texto}
            </option>
          ))}
        </select>

        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          aria-hidden="true"
        />
      </div>

      {error && (
        <MensajeError
          id={errorId}
          mensaje={error}
        />
      )}
    </div>
  );
}

interface BotonMostrarPasswordProps {
  mostrar: boolean;
  onClick: () => void;
  etiqueta: string;
}

function BotonMostrarPassword({
  mostrar,
  onClick,
  etiqueta,
}: BotonMostrarPasswordProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-[#EAF2F8] hover:text-[#0A3D62] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300]"
      aria-label={
        mostrar
          ? `Ocultar ${etiqueta}`
          : `Mostrar ${etiqueta}`
      }
      aria-pressed={mostrar}
    >
      {mostrar ? (
        <EyeOff
          size={16}
          aria-hidden="true"
        />
      ) : (
        <Eye
          size={16}
          aria-hidden="true"
        />
      )}
    </button>
  );
}

interface MensajeErrorProps {
  id: string;
  mensaje: string;
}

function MensajeError({
  id,
  mensaje,
}: MensajeErrorProps) {
  return (
    <p
      id={id}
      className="mt-1.5 flex items-start gap-1.5 text-[10px] font-medium leading-4 text-red-600"
      role="alert"
    >
      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />

      {mensaje}
    </p>
  );
}