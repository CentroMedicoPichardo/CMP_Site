"use client";

import {
  useCallback,
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";

import {
  Building2,
  CheckCircle2,
  CircleAlert,
  Clock3,
  Facebook,
  Headphones,
  ImageIcon,
  Instagram,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  X,
} from "lucide-react";

import { CloudinaryUploader } from "@/components/admin/cloudinary/CloudinaryUploader";

interface EmpresaInfoApi {
  id?: number;
  nombre?: string | null;
  direccion?: string | null;
  telefono?: string | null;
  correo?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  horario?: string | null;
  logoUrl?: string | null;
  correoSoporte?: string | null;
}

interface EmpresaFormData {
  nombre: string;
  direccion: string;
  telefono: string;
  correo: string;
  facebook: string;
  instagram: string;
  horario: string;
  logoUrl: string;
  correoSoporte: string;
}

type CampoEmpresa = keyof EmpresaFormData;

type ErroresFormulario = Partial<
  Record<CampoEmpresa, string>
>;

type EstadoMensaje =
  | "success"
  | "error"
  | null;

const FORMULARIO_INICIAL: EmpresaFormData = {
  nombre: "",
  direccion: "",
  telefono: "",
  correo: "",
  facebook: "",
  instagram: "",
  horario: "",
  logoUrl: "",
  correoSoporte: "",
};

const CLASE_CAMPO_BASE =
  "min-h-11 w-full rounded-xl border bg-white px-3 text-sm font-medium text-gray-800 outline-none transition placeholder:text-gray-400 focus:ring-4 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500";

const CLASE_CAMPO_NORMAL =
  "border-gray-200 focus:border-[#FFC300] focus:ring-[#FFC300]/15";

const CLASE_CAMPO_ERROR =
  "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100";

function cn(
  ...clases: Array<
    string | false | null | undefined
  >
): string {
  return clases.filter(Boolean).join(" ");
}

function esRegistro(
  valor: unknown,
): valor is Record<string, unknown> {
  return (
    typeof valor === "object" &&
    valor !== null &&
    !Array.isArray(valor)
  );
}

function textoSeguro(
  valor: unknown,
): string {
  return typeof valor === "string"
    ? valor
    : "";
}

function normalizarEmpresa(
  valor: unknown,
): EmpresaFormData {
  if (!esRegistro(valor)) {
    return { ...FORMULARIO_INICIAL };
  }

  const empresa =
    valor as EmpresaInfoApi;

  return {
    nombre: textoSeguro(empresa.nombre),
    direccion: textoSeguro(
      empresa.direccion,
    ),
    telefono: textoSeguro(
      empresa.telefono,
    ),
    correo: textoSeguro(empresa.correo),
    facebook: textoSeguro(
      empresa.facebook,
    ),
    instagram: textoSeguro(
      empresa.instagram,
    ),
    horario: textoSeguro(
      empresa.horario,
    ),
    logoUrl: textoSeguro(
      empresa.logoUrl,
    ),
    correoSoporte: textoSeguro(
      empresa.correoSoporte,
    ),
  };
}

async function leerRespuesta(
  response: Response,
): Promise<unknown> {
  const texto = await response.text();

  if (!texto) {
    return null;
  }

  try {
    return JSON.parse(texto) as unknown;
  } catch {
    return {
      message: texto,
    };
  }
}

function obtenerMensajeError(
  payload: unknown,
  respaldo: string,
): string {
  if (!esRegistro(payload)) {
    return respaldo;
  }

  const candidatos = [
    payload["error"],
    payload["message"],
    payload["mensaje"],
  ];

  const mensaje = candidatos.find(
    (valor) =>
      typeof valor === "string" &&
      valor.trim().length > 0,
  );

  return typeof mensaje === "string"
    ? mensaje
    : respaldo;
}

function esCorreoValido(
  correo: string,
): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    correo,
  );
}

function esUrlValida(
  valor: string,
): boolean {
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

export function EmpresaInfoForm() {
  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [formData, setFormData] =
    useState<EmpresaFormData>({
      ...FORMULARIO_INICIAL,
    });

  const [errors, setErrors] =
    useState<ErroresFormulario>({});

  const [
    estadoMensaje,
    setEstadoMensaje,
  ] = useState<EstadoMensaje>(null);

  const [mensaje, setMensaje] =
    useState<string | null>(null);

  const loadData = useCallback(
    async ({
      signal,
      mostrarCarga = true,
    }: {
      signal?: AbortSignal;
      mostrarCarga?: boolean;
    } = {}) => {
      if (mostrarCarga) {
        setLoading(true);
      }

      try {
        const response = await fetch(
          "/api/empresa-info",
          {
            method: "GET",
            cache: "no-store",
            signal,
          },
        );

        const payload =
          await leerRespuesta(response);

        if (!response.ok) {
          throw new Error(
            obtenerMensajeError(
              payload,
              "No fue posible cargar la información institucional.",
            ),
          );
        }

        setFormData(
          normalizarEmpresa(payload),
        );

        setErrors({});
      } catch (error: unknown) {
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return;
        }

        console.error(
          "Error cargando información de la empresa:",
          error,
        );

        setEstadoMensaje("error");

        setMensaje(
          error instanceof Error
            ? error.message
            : "No fue posible cargar la información institucional.",
        );
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    const controller =
      new AbortController();

    void loadData({
      signal: controller.signal,
    });

    return () => {
      controller.abort();
    };
  }, [loadData]);

  useEffect(() => {
    if (
      estadoMensaje !== "success"
    ) {
      return;
    }

    const temporizador =
      window.setTimeout(() => {
        setEstadoMensaje(null);
        setMensaje(null);
      }, 4500);

    return () => {
      window.clearTimeout(temporizador);
    };
  }, [estadoMensaje]);

  const limpiarErrorCampo = (
    campo: CampoEmpresa,
  ) => {
    setErrors((erroresActuales) => {
      if (!erroresActuales[campo]) {
        return erroresActuales;
      }

      return {
        ...erroresActuales,
        [campo]: undefined,
      };
    });
  };

  const handleChange = (
    event: ChangeEvent<
      | HTMLInputElement
      | HTMLTextAreaElement
    >,
  ) => {
    const campo =
      event.target
        .name as CampoEmpresa;

    const valor = event.target.value;

    setFormData((datosActuales) => ({
      ...datosActuales,
      [campo]: valor,
    }));

    limpiarErrorCampo(campo);
    setEstadoMensaje(null);
    setMensaje(null);
  };

  const handleImageUpload = ({
    url,
  }: {
    url: string;
    publicId: string;
  }) => {
    setFormData((datosActuales) => ({
      ...datosActuales,
      logoUrl: url,
    }));

    limpiarErrorCampo("logoUrl");
    setEstadoMensaje(null);
    setMensaje(null);
  };

  const eliminarLogo = () => {
    setFormData((datosActuales) => ({
      ...datosActuales,
      logoUrl: "",
    }));
  };

  const validarFormulario =
    (): boolean => {
      const nuevosErrores:
        ErroresFormulario = {};

      if (!formData.nombre.trim()) {
        nuevosErrores.nombre =
          "El nombre del centro es obligatorio.";
      }

      if (!formData.direccion.trim()) {
        nuevosErrores.direccion =
          "La dirección es obligatoria.";
      }

      if (!formData.telefono.trim()) {
        nuevosErrores.telefono =
          "El teléfono es obligatorio.";
      }

      const correo =
        formData.correo.trim();

      if (!correo) {
        nuevosErrores.correo =
          "El correo principal es obligatorio.";
      } else if (
        !esCorreoValido(correo)
      ) {
        nuevosErrores.correo =
          "Ingresa un correo electrónico válido.";
      }

      const correoSoporte =
        formData.correoSoporte.trim();

      if (
        correoSoporte &&
        !esCorreoValido(correoSoporte)
      ) {
        nuevosErrores.correoSoporte =
          "Ingresa un correo de soporte válido.";
      }

      if (!formData.horario.trim()) {
        nuevosErrores.horario =
          "El horario de atención es obligatorio.";
      }

      const facebook =
        formData.facebook.trim();

      if (
        facebook &&
        !esUrlValida(facebook)
      ) {
        nuevosErrores.facebook =
          "Ingresa una URL válida de Facebook.";
      }

      const instagram =
        formData.instagram.trim();

      if (
        instagram &&
        !esUrlValida(instagram)
      ) {
        nuevosErrores.instagram =
          "Ingresa una URL válida de Instagram.";
      }

      setErrors(nuevosErrores);

      return (
        Object.keys(nuevosErrores)
          .length === 0
      );
    };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!validarFormulario()) {
      setEstadoMensaje("error");
      setMensaje(
        "Revisa los campos marcados antes de guardar.",
      );

      return;
    }

    setSaving(true);
    setEstadoMensaje(null);
    setMensaje(null);

    try {
      const payload: EmpresaFormData = {
        nombre:
          formData.nombre.trim(),
        direccion:
          formData.direccion.trim(),
        telefono:
          formData.telefono.trim(),
        correo:
          formData.correo.trim(),
        facebook:
          formData.facebook.trim(),
        instagram:
          formData.instagram.trim(),
        horario:
          formData.horario.trim(),
        logoUrl:
          formData.logoUrl.trim(),
        correoSoporte:
          formData.correoSoporte.trim(),
      };

      const response = await fetch(
        "/api/empresa-info",
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const responsePayload =
        await leerRespuesta(response);

      if (!response.ok) {
        throw new Error(
          obtenerMensajeError(
            responsePayload,
            "No fue posible guardar la información institucional.",
          ),
        );
      }

      if (esRegistro(responsePayload)) {
        setFormData(
          normalizarEmpresa(
            responsePayload,
          ),
        );
      } else {
        setFormData(payload);
      }

      setEstadoMensaje("success");
      setMensaje(
        "La información institucional se guardó correctamente.",
      );
    } catch (error: unknown) {
      console.error(
        "Error guardando información de la empresa:",
        error,
      );

      setEstadoMensaje("error");

      setMensaje(
        error instanceof Error
          ? error.message
          : "No fue posible guardar la información institucional.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div
          className="h-1 w-full bg-[#FFC300]"
          aria-hidden="true"
        />

        <div className="flex min-h-72 flex-col items-center justify-center gap-4 px-6 py-12">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF2F8] text-[#0A3D62]">
            <Loader2
              size={27}
              className="animate-spin"
              aria-hidden="true"
            />
          </span>

          <div className="text-center">
            <p className="text-sm font-extrabold text-[#0A3D62]">
              Cargando información
            </p>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              Consultando los datos institucionales del centro.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div
        className="h-1 w-full bg-[#FFC300]"
        aria-hidden="true"
      />

      <header className="border-b border-gray-100 px-5 py-5 sm:px-6">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0A3D62] text-[#FFC300]">
            <Building2
              size={21}
              strokeWidth={1.9}
              aria-hidden="true"
            />
          </span>

          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
              Identidad institucional
            </p>

            <h2 className="mt-1 break-words text-lg font-extrabold text-[#0A3D62]">
              Información de la empresa
            </h2>

            <p className="mt-1 max-w-2xl text-xs leading-5 text-gray-500">
              Administra la identidad visual, los medios de contacto,
              las redes sociales y los horarios de atención.
            </p>
          </div>
        </div>
      </header>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col"
        noValidate
      >
        <div className="space-y-5 p-4 sm:p-6">
          {mensaje && (
            <div
              role={
                estadoMensaje === "error"
                  ? "alert"
                  : "status"
              }
              aria-live="polite"
              className={cn(
                "flex items-start gap-3 rounded-xl border px-4 py-3",
                estadoMensaje === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-red-200 bg-red-50 text-red-700",
              )}
            >
              {estadoMensaje ===
              "success" ? (
                <CheckCircle2
                  size={17}
                  className="mt-0.5 shrink-0"
                  aria-hidden="true"
                />
              ) : (
                <CircleAlert
                  size={17}
                  className="mt-0.5 shrink-0"
                  aria-hidden="true"
                />
              )}

              <p className="min-w-0 flex-1 break-words text-xs font-semibold leading-5">
                {mensaje}
              </p>
            </div>
          )}

          <section className="overflow-hidden rounded-2xl border border-gray-200">
            <div className="border-b border-gray-100 bg-[#F8FAFC] px-4 py-4 sm:px-5">
              <EncabezadoSeccion
                icono={
                  <ImageIcon
                    size={17}
                    aria-hidden="true"
                  />
                }
                titulo="Logotipo institucional"
                descripcion="Carga la imagen que identifica al centro en las diferentes secciones del sitio."
              />
            </div>

            <div className="grid grid-cols-1 gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_240px] lg:items-start">
              <CloudinaryUploader
                onUpload={
                  handleImageUpload
                }
                preset="empresa_preset"
                folder="centro-medico/empresa"
                resourceType="image"
                maxFiles={1}
              />

              <div className="flex justify-center lg:justify-end">
                {formData.logoUrl ? (
                  <div className="relative flex min-h-40 w-full max-w-60 items-center justify-center overflow-hidden rounded-2xl border border-[#FFC300]/40 bg-white p-5 shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={formData.logoUrl}
                      alt={
                        formData.nombre
                          ? `Logotipo de ${formData.nombre}`
                          : "Logotipo institucional"
                      }
                      className="max-h-32 max-w-full object-contain"
                    />

                    <button
                      type="button"
                      onClick={eliminarLogo}
                      disabled={saving}
                      className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-white shadow-md transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label="Eliminar logotipo"
                      title="Eliminar logotipo"
                    >
                      <X
                        size={15}
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                ) : (
                  <div className="flex min-h-40 w-full max-w-60 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-5 text-center">
                    <ImageIcon
                      size={30}
                      className="text-gray-300"
                      aria-hidden="true"
                    />

                    <p className="mt-3 text-xs font-extrabold text-gray-500">
                      Sin logotipo
                    </p>

                    <p className="mt-1 text-[10px] leading-4 text-gray-400">
                      La vista previa aparecerá después de cargar una imagen.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 p-4 sm:p-5">
            <EncabezadoSeccion
              icono={
                <Building2
                  size={17}
                  aria-hidden="true"
                />
              }
              titulo="Datos generales"
              descripcion="Información principal que identifica al centro médico."
            />

            <div className="space-y-4">
              <div>
                <EtiquetaCampo
                  htmlFor="empresa-nombre"
                  requerido
                >
                  Nombre del centro
                </EtiquetaCampo>

                <div className="relative">
                  <Building2
                    size={17}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0A3D62]"
                    aria-hidden="true"
                  />

                  <input
                    id="empresa-nombre"
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    disabled={saving}
                    aria-invalid={Boolean(
                      errors.nombre,
                    )}
                    className={cn(
                      CLASE_CAMPO_BASE,
                      "pl-10 pr-3",
                      errors.nombre
                        ? CLASE_CAMPO_ERROR
                        : CLASE_CAMPO_NORMAL,
                    )}
                    placeholder="Nombre oficial del centro médico"
                  />
                </div>

                <MensajeError
                  mensaje={errors.nombre}
                />
              </div>

              <div>
                <EtiquetaCampo
                  htmlFor="empresa-direccion"
                  requerido
                >
                  Dirección
                </EtiquetaCampo>

                <div className="relative">
                  <MapPin
                    size={17}
                    className="pointer-events-none absolute left-3.5 top-3.5 text-[#0A3D62]"
                    aria-hidden="true"
                  />

                  <textarea
                    id="empresa-direccion"
                    name="direccion"
                    value={
                      formData.direccion
                    }
                    onChange={handleChange}
                    disabled={saving}
                    rows={3}
                    aria-invalid={Boolean(
                      errors.direccion,
                    )}
                    className={cn(
                      CLASE_CAMPO_BASE,
                      "resize-y py-3 pl-10 pr-3 leading-6",
                      errors.direccion
                        ? CLASE_CAMPO_ERROR
                        : CLASE_CAMPO_NORMAL,
                    )}
                    placeholder="Calle, número, colonia, municipio, estado y código postal"
                  />
                </div>

                <MensajeError
                  mensaje={
                    errors.direccion
                  }
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 p-4 sm:p-5">
            <EncabezadoSeccion
              icono={
                <Phone
                  size={17}
                  aria-hidden="true"
                />
              }
              titulo="Medios de contacto"
              descripcion="Canales utilizados por pacientes y usuarios para comunicarse con el centro."
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <EtiquetaCampo
                  htmlFor="empresa-telefono"
                  requerido
                >
                  Teléfono
                </EtiquetaCampo>

                <div className="relative">
                  <Phone
                    size={17}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0A3D62]"
                    aria-hidden="true"
                  />

                  <input
                    id="empresa-telefono"
                    type="tel"
                    name="telefono"
                    value={
                      formData.telefono
                    }
                    onChange={handleChange}
                    disabled={saving}
                    aria-invalid={Boolean(
                      errors.telefono,
                    )}
                    className={cn(
                      CLASE_CAMPO_BASE,
                      "pl-10 pr-3",
                      errors.telefono
                        ? CLASE_CAMPO_ERROR
                        : CLASE_CAMPO_NORMAL,
                    )}
                    placeholder="Ej. 55 1234 5678"
                  />
                </div>

                <MensajeError
                  mensaje={
                    errors.telefono
                  }
                />
              </div>

              <div>
                <EtiquetaCampo
                  htmlFor="empresa-correo"
                  requerido
                >
                  Correo principal
                </EtiquetaCampo>

                <div className="relative">
                  <Mail
                    size={17}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0A3D62]"
                    aria-hidden="true"
                  />

                  <input
                    id="empresa-correo"
                    type="email"
                    name="correo"
                    value={formData.correo}
                    onChange={handleChange}
                    disabled={saving}
                    aria-invalid={Boolean(
                      errors.correo,
                    )}
                    className={cn(
                      CLASE_CAMPO_BASE,
                      "pl-10 pr-3",
                      errors.correo
                        ? CLASE_CAMPO_ERROR
                        : CLASE_CAMPO_NORMAL,
                    )}
                    placeholder="contacto@centromedico.com"
                  />
                </div>

                <MensajeError
                  mensaje={errors.correo}
                />
              </div>

              <div className="md:col-span-2">
                <EtiquetaCampo htmlFor="empresa-correo-soporte">
                  Correo de soporte
                </EtiquetaCampo>

                <div className="relative">
                  <Headphones
                    size={17}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0A3D62]"
                    aria-hidden="true"
                  />

                  <input
                    id="empresa-correo-soporte"
                    type="email"
                    name="correoSoporte"
                    value={
                      formData.correoSoporte
                    }
                    onChange={handleChange}
                    disabled={saving}
                    aria-invalid={Boolean(
                      errors.correoSoporte,
                    )}
                    className={cn(
                      CLASE_CAMPO_BASE,
                      "pl-10 pr-3",
                      errors.correoSoporte
                        ? CLASE_CAMPO_ERROR
                        : CLASE_CAMPO_NORMAL,
                    )}
                    placeholder="soporte@centromedico.com"
                  />
                </div>

                <MensajeError
                  mensaje={
                    errors.correoSoporte
                  }
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 p-4 sm:p-5">
            <EncabezadoSeccion
              icono={
                <Instagram
                  size={17}
                  aria-hidden="true"
                />
              }
              titulo="Redes sociales"
              descripcion="Enlaces públicos utilizados para la comunicación y difusión institucional."
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <EtiquetaCampo htmlFor="empresa-facebook">
                  Facebook
                </EtiquetaCampo>

                <div className="relative">
                  <Facebook
                    size={17}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0A3D62]"
                    aria-hidden="true"
                  />

                  <input
                    id="empresa-facebook"
                    type="url"
                    name="facebook"
                    value={
                      formData.facebook
                    }
                    onChange={handleChange}
                    disabled={saving}
                    aria-invalid={Boolean(
                      errors.facebook,
                    )}
                    className={cn(
                      CLASE_CAMPO_BASE,
                      "pl-10 pr-3",
                      errors.facebook
                        ? CLASE_CAMPO_ERROR
                        : CLASE_CAMPO_NORMAL,
                    )}
                    placeholder="https://facebook.com/tu-pagina"
                  />
                </div>

                <MensajeError
                  mensaje={
                    errors.facebook
                  }
                />
              </div>

              <div>
                <EtiquetaCampo htmlFor="empresa-instagram">
                  Instagram
                </EtiquetaCampo>

                <div className="relative">
                  <Instagram
                    size={17}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0A3D62]"
                    aria-hidden="true"
                  />

                  <input
                    id="empresa-instagram"
                    type="url"
                    name="instagram"
                    value={
                      formData.instagram
                    }
                    onChange={handleChange}
                    disabled={saving}
                    aria-invalid={Boolean(
                      errors.instagram,
                    )}
                    className={cn(
                      CLASE_CAMPO_BASE,
                      "pl-10 pr-3",
                      errors.instagram
                        ? CLASE_CAMPO_ERROR
                        : CLASE_CAMPO_NORMAL,
                    )}
                    placeholder="https://instagram.com/tu-perfil"
                  />
                </div>

                <MensajeError
                  mensaje={
                    errors.instagram
                  }
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 p-4 sm:p-5">
            <EncabezadoSeccion
              icono={
                <Clock3
                  size={17}
                  aria-hidden="true"
                />
              }
              titulo="Horario de atención"
              descripcion="Especifica los días y horas en los que el centro atiende al público."
            />

            <EtiquetaCampo
              htmlFor="empresa-horario"
              requerido
            >
              Horario
            </EtiquetaCampo>

            <div className="relative">
              <Clock3
                size={17}
                className="pointer-events-none absolute left-3.5 top-3.5 text-[#0A3D62]"
                aria-hidden="true"
              />

              <textarea
                id="empresa-horario"
                name="horario"
                value={formData.horario}
                onChange={handleChange}
                disabled={saving}
                rows={3}
                aria-invalid={Boolean(
                  errors.horario,
                )}
                className={cn(
                  CLASE_CAMPO_BASE,
                  "resize-y py-3 pl-10 pr-3 leading-6",
                  errors.horario
                    ? CLASE_CAMPO_ERROR
                    : CLASE_CAMPO_NORMAL,
                )}
                placeholder="Lunes a viernes: 8:00 a 20:00. Sábados: 8:00 a 14:00."
              />
            </div>

            <MensajeError
              mensaje={errors.horario}
            />
          </section>
        </div>

        <footer className="flex flex-col gap-3 border-t border-gray-100 bg-[#F8FAFC] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-[11px] leading-5 text-gray-500">
            Los campos marcados con * son obligatorios.
          </p>

          <button
            type="submit"
            disabled={saving}
            aria-busy={saving}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#FFC300] px-5 py-3 text-sm font-extrabold text-[#0A3D62] shadow-sm transition-colors hover:bg-[#EAB308] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D62] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none"
          >
            {saving ? (
              <Loader2
                size={17}
                className="animate-spin"
                aria-hidden="true"
              />
            ) : (
              <Save
                size={17}
                aria-hidden="true"
              />
            )}

            {saving
              ? "Guardando..."
              : "Guardar información"}
          </button>
        </footer>
      </form>
    </section>
  );
}