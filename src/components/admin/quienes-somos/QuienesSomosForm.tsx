"use client";

import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";

import {
  Award,
  BookOpenText,
  CheckCircle2,
  CircleAlert,
  Eye,
  HeartHandshake,
  ImageIcon,
  Loader2,
  Plus,
  Save,
  Sparkles,
  Target,
  Trash2,
  X,
} from "lucide-react";

import { CloudinaryUploader } from "@/components/admin/cloudinary/CloudinaryUploader";

import type { QuienesSomosData } from "@/types/quienes-somos";

interface QuienesSomosFormProps {
  data: QuienesSomosData;
  onSave: (
    data: Partial<QuienesSomosData>,
  ) => Promise<void>;
  saving: boolean;
}

interface QuienesSomosFormData {
  mision: string;
  vision: string;
  valores: string[];
  nuestraHistoria: string;
  compromiso: string;
  urlImagen: string;
}

type EstadoMensaje =
  | "success"
  | "error"
  | null;

const FORMULARIO_INICIAL: QuienesSomosFormData = {
  mision: "",
  vision: "",
  valores: [],
  nuestraHistoria: "",
  compromiso: "",
  urlImagen: "",
};

const CLASE_CAMPO =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm leading-6 text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#FFC300] focus:ring-4 focus:ring-[#FFC300]/15 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500";

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
    ? valor
    : "";
}

function normalizarValores(
  valores: unknown,
): string[] {
  if (!Array.isArray(valores)) {
    return [];
  }

  const unicos = new Map<string, string>();

  valores.forEach((valor) => {
    if (typeof valor !== "string") {
      return;
    }

    const valorLimpio = valor.trim();

    if (!valorLimpio) {
      return;
    }

    unicos.set(
      valorLimpio.toLocaleLowerCase("es-MX"),
      valorLimpio,
    );
  });

  return Array.from(unicos.values());
}

function normalizarFormulario(
  data?: Partial<QuienesSomosData> | null,
): QuienesSomosFormData {
  if (!data) {
    return {
      ...FORMULARIO_INICIAL,
      valores: [],
    };
  }

  return {
    mision: textoSeguro(data.mision),
    vision: textoSeguro(data.vision),
    valores: normalizarValores(
      data.valores,
    ),
    nuestraHistoria: textoSeguro(
      data.nuestraHistoria,
    ),
    compromiso: textoSeguro(
      data.compromiso,
    ),
    urlImagen: textoSeguro(
      data.urlImagen,
    ),
  };
}

function prepararPayload(
  formData: QuienesSomosFormData,
): QuienesSomosFormData {
  return {
    mision: formData.mision.trim(),
    vision: formData.vision.trim(),
    valores: normalizarValores(
      formData.valores,
    ),
    nuestraHistoria:
      formData.nuestraHistoria.trim(),
    compromiso:
      formData.compromiso.trim(),
    urlImagen:
      formData.urlImagen.trim(),
  };
}

function obtenerFirma(
  formData: QuienesSomosFormData,
): string {
  return JSON.stringify(
    prepararPayload(formData),
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
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF2F8] text-[#0A3D62]">
        {icono}
      </span>

      <div className="min-w-0">
        <h2 className="text-sm font-extrabold text-[#0A3D62]">
          {titulo}
        </h2>

        <p className="mt-1 whitespace-normal break-words text-xs leading-5 text-gray-500">
          {descripcion}
        </p>
      </div>
    </div>
  );
}

function ContadorTexto({
  actual,
  maximo,
}: {
  actual: number;
  maximo: number;
}) {
  return (
    <p
      className={cn(
        "mt-1 text-right text-[10px] font-semibold",
        actual > maximo
          ? "text-red-600"
          : "text-gray-400",
      )}
    >
      {actual.toLocaleString("es-MX")} /{" "}
      {maximo.toLocaleString("es-MX")} caracteres
    </p>
  );
}

export function QuienesSomosForm({
  data,
  onSave,
  saving,
}: QuienesSomosFormProps) {
  const formularioInicial = useMemo(
    () => normalizarFormulario(data),
    [data],
  );

  const [formData, setFormData] =
    useState<QuienesSomosFormData>(
      formularioInicial,
    );

  const [firmaGuardada, setFirmaGuardada] =
    useState(() =>
      obtenerFirma(formularioInicial),
    );

  const [nuevoValor, setNuevoValor] =
    useState("");

  const [errorValor, setErrorValor] =
    useState<string | null>(null);

  const [
    estadoMensaje,
    setEstadoMensaje,
  ] = useState<EstadoMensaje>(null);

  const [mensaje, setMensaje] =
    useState<string | null>(null);

  useEffect(() => {
    setFormData(formularioInicial);
    setFirmaGuardada(
      obtenerFirma(formularioInicial),
    );
    setNuevoValor("");
    setErrorValor(null);
    setEstadoMensaje(null);
    setMensaje(null);
  }, [formularioInicial]);

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

  const firmaActual = useMemo(
    () => obtenerFirma(formData),
    [formData],
  );

  const hayCambios =
    firmaActual !== firmaGuardada;

  const actualizarCampo = <
    K extends keyof QuienesSomosFormData,
  >(
    campo: K,
    valor: QuienesSomosFormData[K],
  ) => {
    setFormData((datosActuales) => ({
      ...datosActuales,
      [campo]: valor,
    }));

    setEstadoMensaje(null);
    setMensaje(null);
  };

  const agregarValor = () => {
    const valorLimpio =
      nuevoValor.trim();

    if (!valorLimpio) {
      setErrorValor(
        "Escribe un valor institucional.",
      );
      return;
    }

    if (valorLimpio.length > 60) {
      setErrorValor(
        "El valor no puede superar 60 caracteres.",
      );
      return;
    }

    const yaExiste =
      formData.valores.some(
        (valor) =>
          valor.toLocaleLowerCase(
            "es-MX",
          ) ===
          valorLimpio.toLocaleLowerCase(
            "es-MX",
          ),
      );

    if (yaExiste) {
      setErrorValor(
        "Este valor ya está registrado.",
      );
      return;
    }

    actualizarCampo("valores", [
      ...formData.valores,
      valorLimpio,
    ]);

    setNuevoValor("");
    setErrorValor(null);
  };

  const eliminarValor = (
    indice: number,
  ) => {
    actualizarCampo(
      "valores",
      formData.valores.filter(
        (_, indiceActual) =>
          indiceActual !== indice,
      ),
    );
  };

  const handleValorKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    agregarValor();
  };

  const handleImageUpload = ({
    url,
  }: {
    url: string;
    publicId: string;
  }) => {
    actualizarCampo("urlImagen", url);
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const payload =
      prepararPayload(formData);

    setEstadoMensaje(null);
    setMensaje(null);

    try {
      await onSave(payload);

      setFormData(payload);
      setFirmaGuardada(
        obtenerFirma(payload),
      );

      setEstadoMensaje("success");
      setMensaje(
        "La información de Quiénes Somos se guardó correctamente.",
      );
    } catch (error: unknown) {
      console.error(
        "Error guardando Quiénes Somos:",
        error,
      );

      setEstadoMensaje("error");
      setMensaje(
        error instanceof Error
          ? error.message
          : "No fue posible guardar la información institucional.",
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
    >
      <div
        className="h-1 w-full bg-[#FFC300]"
        aria-hidden="true"
      />

      <header className="border-b border-gray-100 px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0A3D62] text-[#FFC300]">
              <Sparkles
                size={21}
                strokeWidth={1.9}
                aria-hidden="true"
              />
            </span>

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
                Contenido institucional
              </p>

              <h2 className="mt-1 whitespace-normal break-words text-lg font-extrabold text-[#0A3D62]">
                Información pública
              </h2>

              <p className="mt-1 max-w-2xl whitespace-normal break-words text-xs leading-5 text-gray-500">
                Edita la historia, misión, visión,
                compromiso y valores que representan
                al centro médico.
              </p>
            </div>
          </div>

          <div
            className={cn(
              "inline-flex self-start items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-extrabold",
              hayCambios
                ? "border-amber-200 bg-amber-50 text-amber-700"
                : "border-emerald-200 bg-emerald-50 text-emerald-700",
            )}
          >
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                hayCambios
                  ? "bg-amber-500"
                  : "bg-emerald-500",
              )}
              aria-hidden="true"
            />

            {hayCambios
              ? "Cambios sin guardar"
              : "Información actualizada"}
          </div>
        </div>
      </header>

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

            <p className="min-w-0 flex-1 whitespace-normal break-words text-xs font-semibold leading-5">
              {mensaje}
            </p>
          </div>
        )}

        <section className="overflow-hidden rounded-2xl border border-gray-200">
          <div className="border-b border-gray-100 bg-[#F8FAFC] px-4 py-4 sm:px-5">
            <EncabezadoSeccion
              icono={
                <ImageIcon
                  size={18}
                  aria-hidden="true"
                />
              }
              titulo="Imagen de cabecera"
              descripcion="Carga una imagen representativa para la sección pública de Quiénes Somos."
            />
          </div>

          <div className="grid grid-cols-1 gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
            <CloudinaryUploader
              onUpload={
                handleImageUpload
              }
              preset="quienes_somos_preset"
              folder="centro-medico/quienes-somos"
              resourceType="image"
              maxFiles={1}
            />

            <div className="flex justify-center lg:justify-end">
              {formData.urlImagen ? (
                <div className="relative aspect-[16/10] w-full max-w-[280px] overflow-hidden rounded-2xl border border-[#FFC300]/40 bg-gray-100 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      formData.urlImagen
                    }
                    alt="Vista previa de la sección Quiénes Somos"
                    className="h-full w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      actualizarCampo(
                        "urlImagen",
                        "",
                      );
                    }}
                    disabled={saving}
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-white shadow-md transition-colors hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:cursor-not-allowed disabled:opacity-50"
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
                <div className="flex aspect-[16/10] w-full max-w-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-5 text-center">
                  <ImageIcon
                    size={30}
                    className="text-gray-300"
                    aria-hidden="true"
                  />

                  <p className="mt-3 text-xs font-extrabold text-gray-500">
                    Sin imagen de cabecera
                  </p>

                  <p className="mt-1 text-[10px] leading-4 text-gray-400">
                    La vista previa aparecerá después
                    de cargar una imagen.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 p-4 sm:p-5">
          <EncabezadoSeccion
            icono={
              <BookOpenText
                size={18}
                aria-hidden="true"
              />
            }
            titulo="Nuestra historia"
            descripcion="Describe el origen, evolución y trayectoria del centro médico."
          />

          <textarea
            value={
              formData.nuestraHistoria
            }
            onChange={(event) => {
              actualizarCampo(
                "nuestraHistoria",
                event.target.value,
              );
            }}
            disabled={saving}
            rows={6}
            maxLength={3000}
            className={cn(
              CLASE_CAMPO,
              "resize-y",
            )}
            placeholder="Cuenta la historia del centro médico, sus inicios, evolución y principales logros..."
          />

          <ContadorTexto
            actual={
              formData.nuestraHistoria
                .length
            }
            maximo={3000}
          />
        </section>

        <section className="rounded-2xl border border-gray-200 p-4 sm:p-5">
          <EncabezadoSeccion
            icono={
              <Award
                size={18}
                aria-hidden="true"
              />
            }
            titulo="Nuestro compromiso"
            descripcion="Explica la promesa institucional hacia pacientes, familias y cuidadores."
          />

          <textarea
            value={formData.compromiso}
            onChange={(event) => {
              actualizarCampo(
                "compromiso",
                event.target.value,
              );
            }}
            disabled={saving}
            rows={4}
            maxLength={1800}
            className={cn(
              CLASE_CAMPO,
              "resize-y",
            )}
            placeholder="Describe el compromiso del centro médico con la atención pediátrica..."
          />

          <ContadorTexto
            actual={
              formData.compromiso.length
            }
            maximo={1800}
          />
        </section>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <section className="rounded-2xl border border-gray-200 p-4 sm:p-5">
            <EncabezadoSeccion
              icono={
                <Target
                  size={18}
                  aria-hidden="true"
                />
              }
              titulo="Misión"
              descripcion="Define la razón de ser del centro y el propósito de su atención."
            />

            <textarea
              value={formData.mision}
              onChange={(event) => {
                actualizarCampo(
                  "mision",
                  event.target.value,
                );
              }}
              disabled={saving}
              rows={6}
              maxLength={1500}
              className={cn(
                CLASE_CAMPO,
                "resize-y",
              )}
              placeholder="Nuestra misión es..."
            />

            <ContadorTexto
              actual={
                formData.mision.length
              }
              maximo={1500}
            />
          </section>

          <section className="rounded-2xl border border-gray-200 p-4 sm:p-5">
            <EncabezadoSeccion
              icono={
                <Eye
                  size={18}
                  aria-hidden="true"
                />
              }
              titulo="Visión"
              descripcion="Describe el futuro que el centro busca construir y alcanzar."
            />

            <textarea
              value={formData.vision}
              onChange={(event) => {
                actualizarCampo(
                  "vision",
                  event.target.value,
                );
              }}
              disabled={saving}
              rows={6}
              maxLength={1500}
              className={cn(
                CLASE_CAMPO,
                "resize-y",
              )}
              placeholder="Nuestra visión es..."
            />

            <ContadorTexto
              actual={
                formData.vision.length
              }
              maximo={1500}
            />
          </section>
        </div>

        <section className="rounded-2xl border border-gray-200 p-4 sm:p-5">
          <EncabezadoSeccion
            icono={
              <HeartHandshake
                size={18}
                aria-hidden="true"
              />
            }
            titulo="Valores institucionales"
            descripcion="Agrega los principios que guían la atención y el trabajo del centro médico."
          />

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="min-w-0 flex-1">
              <input
                type="text"
                value={nuevoValor}
                onChange={(event) => {
                  setNuevoValor(
                    event.target.value,
                  );
                  setErrorValor(null);
                }}
                onKeyDown={
                  handleValorKeyDown
                }
                disabled={saving}
                maxLength={60}
                placeholder="Ej. Empatía, responsabilidad o excelencia"
                className={cn(
                  CLASE_CAMPO,
                  errorValor &&
                    "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100",
                )}
                aria-invalid={Boolean(
                  errorValor,
                )}
              />

              {errorValor && (
                <p
                  role="alert"
                  className="mt-1.5 flex items-start gap-1.5 text-xs font-semibold leading-5 text-red-600"
                >
                  <CircleAlert
                    size={13}
                    className="mt-0.5 shrink-0"
                    aria-hidden="true"
                  />

                  {errorValor}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={agregarValor}
              disabled={saving}
              className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#0A3D62] px-5 py-3 text-xs font-extrabold text-white transition-colors hover:bg-[#061C2E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
            >
              <Plus
                size={16}
                aria-hidden="true"
              />

              Agregar valor
            </button>
          </div>

          {formData.valores.length > 0 ? (
            <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {formData.valores.map(
                (valor, indice) => (
                  <div
                    key={`${valor}-${indice}`}
                    className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-[#FFC300]/35 bg-[#FFF9E6] px-3 py-2.5"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#FFC300] text-[#0A3D62]">
                        <HeartHandshake
                          size={14}
                          aria-hidden="true"
                        />
                      </span>

                      <span className="whitespace-normal break-words text-xs font-extrabold text-[#0A3D62]">
                        {valor}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        eliminarValor(
                          indice,
                        );
                      }}
                      disabled={saving}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-100 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label={`Eliminar valor ${valor}`}
                      title="Eliminar valor"
                    >
                      <Trash2
                        size={15}
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                ),
              )}
            </div>
          ) : (
            <div className="mt-5 flex min-h-28 flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-[#F8FAFC] px-5 py-6 text-center">
              <HeartHandshake
                size={25}
                className="text-gray-300"
                aria-hidden="true"
              />

              <p className="mt-2 text-xs font-extrabold text-gray-500">
                Sin valores registrados
              </p>

              <p className="mt-1 text-[10px] leading-4 text-gray-400">
                Agrega los principios que representan
                al centro médico.
              </p>
            </div>
          )}
        </section>
      </div>

      <footer className="flex flex-col gap-3 border-t border-gray-100 bg-[#F8FAFC] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-[11px] leading-5 text-gray-500">
          Los cambios se mostrarán públicamente
          después de guardarlos.
        </p>

        <button
          type="submit"
          disabled={
            saving || !hayCambios
          }
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
            : hayCambios
              ? "Guardar cambios"
              : "Sin cambios pendientes"}
        </button>
      </footer>
    </form>
  );
}