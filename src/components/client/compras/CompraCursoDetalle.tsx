// src/components/client/compras/CompraCursoDetalle.tsx
"use client";

import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  ExternalLink,
  FileImage,
  FileText,
  Loader2,
  ReceiptText,
  RefreshCw,
  Send,
  Smartphone,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  ComprobanteCloudinaryUploader,
  eliminarComprobanteCloudinary,
  type ComprobanteCloudinaryAsset,
} from "@/components/client/compras/ComprobanteCloudinaryUploader";
import { getApiErrorMessage } from "@/types/api";
import type {
  CanalComprobanteCurso,
  CompraCursoDetalleResponse,
  MetodoPagoCurso,
  ReportarPagoCursoInput,
  ReportarPagoCursoResponse,
} from "@/types/compras-cursos";

interface CompraCursoDetalleProps {
  compraId: string;
}

interface FormularioPago {
  idMetodoPago: string;
  monto: string;
  fechaPago: string;
  referencia: string;
  rutaComprobante: string;
  nombreArchivoOriginal: string;
  tipoArchivo: string;
  canalComprobante: CanalComprobanteCurso;
  comprobanteConfirmado: boolean;
  observaciones: string;
}

interface MensajeEstado {
  tipo: "success" | "error";
  texto: string;
}

const INITIAL_FORM: FormularioPago = {
  idMetodoPago: "",
  monto: "",
  fechaPago: "",
  referencia: "",
  rutaComprobante: "",
  nombreArchivoOriginal: "",
  tipoArchivo: "",
  canalComprobante: "Sin comprobante",
  comprobanteConfirmado: false,
  observaciones: "",
};

function isRecord(
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function isCompraDetalleResponse(
  value: unknown
): value is CompraCursoDetalleResponse {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isRecord(value.compra) &&
    Array.isArray(value.participantes) &&
    Array.isArray(value.metodosPago) &&
    Array.isArray(value.pagos) &&
    isRecord(value.resumenPago)
  );
}

function isReportarPagoResponse(
  value: unknown
): value is ReportarPagoCursoResponse {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.message === "string" &&
    typeof value.estadoCompra === "string" &&
    isRecord(value.pago)
  );
}

async function readJson(
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

function formatMoney(value: string): string {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return value;
  }

  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(amount);
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function toLocalDateTimeInput(): string {
  const date = new Date();

  const offset = date.getTimezoneOffset();
  const localDate = new Date(
    date.getTime() - offset * 60_000
  );

  return localDate
    .toISOString()
    .slice(0, 16);
}

function esCompraReportable(
  estado: string
): boolean {
  return (
    estado === "Pendiente de pago" ||
    estado === "Pago reportado"
  );
}

export function CompraCursoDetalle({
  compraId,
}: CompraCursoDetalleProps) {
  const [data, setData] =
    useState<CompraCursoDetalleResponse | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [reportando, setReportando] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [mensaje, setMensaje] =
    useState<MensajeEstado | null>(null);

  const [comprobanteImagen, setComprobanteImagen] =
    useState<ComprobanteCloudinaryAsset | null>(null);

  const [formData, setFormData] =
    useState<FormularioPago>({
      ...INITIAL_FORM,
      fechaPago: toLocalDateTimeInput(),
    });

  const metodoSeleccionado =
    useMemo<MetodoPagoCurso | null>(() => {
      if (!data || !formData.idMetodoPago) {
        return null;
      }

      const metodoId = Number(
        formData.idMetodoPago
      );

      return (
        data.metodosPago.find(
          (metodo) =>
            metodo.idMetodoPago === metodoId
        ) ?? null
      );
    }, [
      data,
      formData.idMetodoPago,
    ]);

  const whatsappUrl = useMemo(() => {
    if (!data) {
      return null;
    }

    const telefono =
      process.env.NEXT_PUBLIC_WHATSAPP_PAGOS?.replace(/\D/g, "") ?? "";

    if (!telefono) {
      return null;
    }

    const mensajeWhatsapp = [
      "Hola, envío mi comprobante de pago.",
      "",
      `Folio de compra: ${data.compra.folioCompra}`,
      `Curso: ${data.compra.tituloCurso}`,
      `Monto reportado: ${formatMoney(formData.monto || "0")}`,
    ].join("\n");

    return `https://wa.me/${telefono}?text=${encodeURIComponent(mensajeWhatsapp)}`;
  }, [data, formData.monto]);

  const cargarCompra =
    useCallback(async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/compras-cursos/${encodeURIComponent(
            compraId
          )}`,
          {
            credentials: "include",
            cache: "no-store",
          }
        );

        const payload =
          await readJson(response);

        if (!response.ok) {
          throw new Error(
            getApiErrorMessage(
              payload,
              "No fue posible cargar la compra"
            )
          );
        }

        if (
          !isCompraDetalleResponse(payload)
        ) {
          throw new Error(
            "La respuesta de la compra no es válida"
          );
        }

        setData(payload);

        setFormData((previous) => ({
          ...previous,
          monto:
            previous.monto ||
            payload.resumenPago.saldoPendiente,
          idMetodoPago:
            previous.idMetodoPago ||
            String(
              payload.metodosPago[0]
                ?.idMetodoPago ?? ""
            ),
        }));
      } catch (fetchError: unknown) {
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "No fue posible cargar la compra"
        );
      } finally {
        setLoading(false);
      }
    }, [compraId]);

  useEffect(() => {
    void cargarCompra();
  }, [cargarCompra]);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setMensaje(null);
  };

  const limpiarComprobanteTemporal =
    useCallback(async (): Promise<boolean> => {
      if (!comprobanteImagen) {
        return true;
      }

      try {
        await eliminarComprobanteCloudinary({
          compraId,
          publicId:
            comprobanteImagen.publicId,
        });

        setComprobanteImagen(null);

        setFormData((previous) => ({
          ...previous,
          rutaComprobante: "",
          nombreArchivoOriginal: "",
          tipoArchivo: "",
        }));

        return true;
      } catch (errorValue: unknown) {
        setMensaje({
          tipo: "error",
          texto:
            errorValue instanceof Error
              ? errorValue.message
              : "No fue posible eliminar el comprobante anterior",
        });

        return false;
      }
    }, [
      compraId,
      comprobanteImagen,
    ]);

  const cambiarCanalComprobante =
    async (
      canal: CanalComprobanteCurso
    ) => {
      if (
        canal ===
        formData.canalComprobante
      ) {
        return;
      }

      const comprobanteEliminado =
        await limpiarComprobanteTemporal();

      if (!comprobanteEliminado) {
        return;
      }

      setFormData((previous) => ({
        ...previous,
        canalComprobante: canal,
        rutaComprobante: "",
        nombreArchivoOriginal: "",
        tipoArchivo: "",
        comprobanteConfirmado: false,
      }));

      setMensaje(null);
    };

  const actualizarImagen = (
    asset: ComprobanteCloudinaryAsset | null
  ) => {
    setComprobanteImagen(asset);

    setFormData((previous) => ({
      ...previous,
      rutaComprobante: asset?.url ?? "",
      nombreArchivoOriginal: asset?.nombreArchivo ?? "",
      tipoArchivo: asset?.tipoArchivo ?? "",
    }));

    setMensaje(null);
  };

  const reportarPago = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!data) {
      return;
    }

    if (data.compra.estado === "Expirada") {
      setMensaje({
        tipo: "error",
        texto:
          "La compra expiró y ya no admite reportes de pago.",
      });
      return;
    }

    const metodoId = Number(
      formData.idMetodoPago
    );

    if (
      !Number.isSafeInteger(metodoId) ||
      metodoId <= 0
    ) {
      setMensaje({
        tipo: "error",
        texto:
          "Selecciona un método de pago válido",
      });

      return;
    }

    if (
      metodoSeleccionado?.requiereComprobante &&
      formData.canalComprobante === "Sin comprobante"
    ) {
      setMensaje({
        tipo: "error",
        texto: "Selecciona cómo enviaste el comprobante",
      });
      return;
    }

    if (
      formData.canalComprobante === "Imagen" &&
      !comprobanteImagen
    ) {
      setMensaje({
        tipo: "error",
        texto: "Carga la imagen del comprobante",
      });
      return;
    }

    if (
      formData.canalComprobante === "URL" &&
      !formData.rutaComprobante.trim()
    ) {
      setMensaje({
        tipo: "error",
        texto: "Ingresa la URL del comprobante",
      });
      return;
    }

    if (
      formData.canalComprobante === "WhatsApp" &&
      !formData.comprobanteConfirmado
    ) {
      setMensaje({
        tipo: "error",
        texto: "Confirma que ya enviaste el comprobante por WhatsApp",
      });
      return;
    }

    setReportando(true);
    setMensaje(null);

    let pagoRegistrado = false;

    try {
      const input: ReportarPagoCursoInput = {
        idMetodoPago: metodoId,
        monto: formData.monto.trim(),
        fechaPago: new Date(
          formData.fechaPago
        ).toISOString(),
        referencia:
          formData.referencia.trim() || null,
        rutaComprobante:
          formData.rutaComprobante.trim() ||
          null,
        nombreArchivoOriginal:
          formData.nombreArchivoOriginal.trim() ||
          null,
        tipoArchivo:
          formData.tipoArchivo.trim() || null,
        canalComprobante:
          formData.canalComprobante,
        comprobanteConfirmado:
          formData.comprobanteConfirmado,
        fechaEnvioWhatsapp: null,
        observaciones:
          formData.observaciones.trim() ||
          null,
      };

      const response = await fetch(
        `/api/compras-cursos/${encodeURIComponent(
          compraId
        )}/pagos`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          credentials: "include",
          body: JSON.stringify(input),
        }
      );

      const payload =
        await readJson(response);

      if (!response.ok) {
        throw new Error(
          getApiErrorMessage(
            payload,
            "No fue posible reportar el pago"
          )
        );
      }

      pagoRegistrado = true;

      if (
        !isReportarPagoResponse(payload)
      ) {
        throw new Error(
          "La respuesta del reporte de pago no es válida"
        );
      }

      setMensaje({
        tipo: "success",
        texto: payload.message,
      });

      setComprobanteImagen(null);

      setFormData({
        ...INITIAL_FORM,
        fechaPago:
          toLocalDateTimeInput(),
      });

      await cargarCompra();
    } catch (submitError: unknown) {
      if (
        !pagoRegistrado &&
        comprobanteImagen
      ) {
        try {
          await eliminarComprobanteCloudinary({
            compraId,
            publicId:
              comprobanteImagen.publicId,
          });

          setComprobanteImagen(null);

          setFormData((previous) => ({
            ...previous,
            rutaComprobante: "",
            nombreArchivoOriginal: "",
            tipoArchivo: "",
          }));
        } catch {
          // Conservamos el error original del reporte.
        }
      }

      setMensaje({
        tipo: "error",
        texto:
          submitError instanceof Error
            ? submitError.message
            : "No fue posible reportar el pago",
      });
    } finally {
      setReportando(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-12">
        <div className="mx-auto flex max-w-5xl items-center justify-center rounded-2xl bg-white p-16 shadow-sm">
          <Loader2 className="mr-3 h-6 w-6 animate-spin text-[#0A3D62]" />

          <p className="text-gray-600">
            Cargando compra...
          </p>
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-12">
        <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <AlertCircle className="mx-auto mb-4 h-10 w-10 text-red-500" />

          <h1 className="text-xl font-bold text-gray-900">
            No se pudo cargar la compra
          </h1>

          <p className="mt-2 text-gray-600">
            {error ??
              "La compra no está disponible"}
          </p>

          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/mis-compras/cursos"
              className="rounded-lg border border-gray-300 px-5 py-2 text-gray-700 hover:bg-gray-50"
            >
              Volver a mis compras
            </Link>

            <button
              type="button"
              onClick={() =>
                void cargarCompra()
              }
              className="inline-flex items-center gap-2 rounded-lg bg-[#0A3D62] px-5 py-2 text-white hover:bg-[#164f77]"
            >
              <RefreshCw size={17} />
              Reintentar
            </button>
          </div>
        </div>
      </main>
    );
  }

  const compra = data.compra;
  const compraExpirada =
    compra.estado === "Expirada";

  const puedeReportar =
    !compraExpirada &&
    esCompraReportable(compra.estado) &&
    !data.resumenPago.pagoCompletoReportado;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/mis-compras/cursos"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#0A3D62] hover:underline"
        >
          <ArrowLeft size={17} />
          Regresar a mis compras
        </Link>

        <header className="mb-6 rounded-2xl bg-[#0A3D62] p-6 text-white shadow-lg md:p-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row">
            <div>
              <p className="text-sm text-blue-100">
                Folio de compra
              </p>

              <h1 className="mt-1 text-2xl font-bold md:text-3xl">
                {compra.folioCompra}
              </h1>

              <p className="mt-3 text-blue-100">
                {compra.tituloCurso}
              </p>
            </div>

            <div className="rounded-xl bg-white/10 px-5 py-4">
              <p className="text-sm text-blue-100">
                Estado
              </p>

              <p
                className={`mt-1 text-lg font-semibold ${
                  compraExpirada
                    ? "text-red-100"
                    : ""
                }`}
              >
                {compra.estado}
              </p>
            </div>
          </div>
        </header>

        {mensaje && (
          <div
            className={`mb-6 flex items-start gap-3 rounded-xl border p-4 ${
              mensaje.tipo === "success"
                ? "border-green-200 bg-green-50 text-green-800"
                : "border-red-200 bg-red-50 text-red-800"
            }`}
          >
            {mensaje.tipo === "success" ? (
              <CheckCircle className="mt-0.5 h-5 w-5 shrink-0" />
            ) : (
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            )}

            <p>{mensaje.texto}</p>
          </div>
        )}

        {compraExpirada && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
            <Clock className="mt-0.5 h-5 w-5 shrink-0" />

            <div>
              <p className="font-semibold">
                El plazo de pago venció
              </p>

              <p className="mt-1 text-sm">
                Esta compra fue marcada como expirada y sus cupos fueron liberados.
                Ya no es posible enviar comprobantes ni reportar pagos.
              </p>

              <p className="mt-2 text-sm">
                Fecha límite:{" "}
                <span className="font-medium">
                  {formatDate(
                    compra.fechaLimitePago
                  )}
                </span>
              </p>
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-6">
            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg font-bold text-[#0A3D62]">
                <ReceiptText size={21} />
                Resumen
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm text-gray-500">
                    Fecha de compra
                  </p>

                  <p className="mt-1 flex items-center gap-2 font-medium text-gray-800">
                    <Calendar size={16} />
                    {formatDate(
                      compra.fechaCompra
                    )}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm text-gray-500">
                    Límite de pago
                  </p>

                  <p className="mt-1 flex items-center gap-2 font-medium text-gray-800">
                    <Clock size={16} />
                    {formatDate(
                      compra.fechaLimitePago
                    )}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm text-gray-500">
                    Cupos
                  </p>

                  <p className="mt-1 font-semibold text-gray-800">
                    {compra.cantidadCupos}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm text-gray-500">
                    Precio por cupo
                  </p>

                  <p className="mt-1 font-semibold text-gray-800">
                    {formatMoney(
                      compra.precioUnitario
                    )}
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3 border-t pt-5">
                <div className="flex justify-between text-gray-600">
                  <span>Total</span>
                  <span>
                    {formatMoney(
                      data.resumenPago
                        .totalCompra
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>
                    Pagos reportados
                  </span>
                  <span>
                    {formatMoney(
                      data.resumenPago
                        .totalReportado
                    )}
                  </span>
                </div>

                <div className="flex justify-between border-t pt-3 text-lg font-bold text-[#0A3D62]">
                  <span>Saldo pendiente</span>
                  <span>
                    {formatMoney(
                      data.resumenPago
                        .saldoPendiente
                    )}
                  </span>
                </div>
              </div>
            </section>

            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg font-bold text-[#0A3D62]">
                <Users size={21} />
                Participantes
              </h2>

              <div className="mt-5 space-y-3">
                {data.participantes.map(
                  (registro) => (
                    <article
                      key={
                        registro.idCompraParticipante
                      }
                      className="rounded-xl border border-gray-200 p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {
                              registro
                                .participante
                                .nombre
                            }{" "}
                            {
                              registro
                                .participante
                                .apellidoPaterno
                            }{" "}
                            {registro
                              .participante
                              .apellidoMaterno ??
                              ""}
                          </p>

                          <p className="mt-1 text-sm text-gray-500">
                            Cupo{" "}
                            {
                              registro.numeroCupo
                            }
                          </p>
                        </div>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            registro.estado ===
                            "Cancelado"
                              ? "bg-red-50 text-red-700"
                              : "bg-blue-50 text-[#0A3D62]"
                          }`}
                        >
                          {registro.estado}
                        </span>
                      </div>
                    </article>
                  )
                )}
              </div>
            </section>

            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg font-bold text-[#0A3D62]">
                <FileText size={21} />
                Pagos reportados
              </h2>

              {data.pagos.length === 0 ? (
                <p className="mt-4 text-sm text-gray-500">
                  Todavía no hay pagos
                  reportados.
                </p>
              ) : (
                <div className="mt-5 space-y-3">
                  {data.pagos.map((pago) => (
                    <article
                      key={pago.idPago}
                      className="rounded-xl border border-gray-200 p-4"
                    >
                      <div className="flex flex-col justify-between gap-3 sm:flex-row">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {pago.metodoPago}
                          </p>

                          <p className="mt-1 text-sm text-gray-500">
                            {formatDate(
                              pago.fechaPago
                            )}
                          </p>

                          {pago.referencia && (
                            <p className="mt-1 text-sm text-gray-600">
                              Referencia:{" "}
                              {pago.referencia}
                            </p>
                          )}
                        </div>

                        <div className="sm:text-right">
                          <p className="font-bold text-[#0A3D62]">
                            {formatMoney(
                              pago.monto
                            )}
                          </p>

                          <p className="mt-1 text-xs font-semibold text-gray-500">
                            {pago.estado}
                          </p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>

          <aside>
            <section className="sticky top-24 rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg font-bold text-[#0A3D62]">
                <CreditCard size={21} />
                Reportar pago
              </h2>

              {compraExpirada ? (
                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
                  <Clock className="mb-2 h-6 w-6" />

                  <p className="font-semibold">
                    Compra expirada
                  </p>

                  <p className="mt-1 text-sm">
                    El plazo para reportar el pago terminó el{" "}
                    {formatDate(
                      compra.fechaLimitePago
                    )}.
                  </p>

                  <p className="mt-2 text-sm">
                    Los participantes asociados fueron cancelados y no se aceptan nuevos comprobantes.
                  </p>
                </div>
              ) : data.resumenPago
                .pagoCompletoReportado ? (
                <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4 text-green-800">
                  <CheckCircle className="mb-2 h-6 w-6" />

                  <p className="font-semibold">
                    El total ya fue reportado
                  </p>

                  <p className="mt-1 text-sm">
                    El pago está pendiente de
                    validación administrativa.
                  </p>
                </div>
              ) : !puedeReportar ? (
                <div className="mt-5 rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-yellow-800">
                  <AlertCircle className="mb-2 h-6 w-6" />

                  <p className="font-semibold">
                    No es posible reportar pagos
                  </p>

                  <p className="mt-1 text-sm">
                    Estado actual:{" "}
                    {compra.estado}
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={reportarPago}
                  className="mt-5 space-y-4"
                >
                  <div>
                    <label
                      htmlFor="idMetodoPago"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Método de pago
                    </label>

                    <select
                      id="idMetodoPago"
                      name="idMetodoPago"
                      required
                      value={
                        formData.idMetodoPago
                      }
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:ring-2 focus:ring-[#0A3D62]"
                    >
                      <option value="">
                        Selecciona
                      </option>

                      {data.metodosPago.map(
                        (metodo) => (
                          <option
                            key={
                              metodo.idMetodoPago
                            }
                            value={
                              metodo.idMetodoPago
                            }
                          >
                            {metodo.nombre}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  {metodoSeleccionado
                    ?.instrucciones && (
                    <div className="rounded-lg bg-blue-50 p-3 text-sm whitespace-pre-line text-blue-900">
                      {
                        metodoSeleccionado.instrucciones
                      }
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="monto"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Monto
                    </label>

                    <input
                      id="monto"
                      name="monto"
                      type="number"
                      min="0.01"
                      step="0.01"
                      required
                      value={formData.monto}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:ring-2 focus:ring-[#0A3D62]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="fechaPago"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Fecha del pago
                    </label>

                    <input
                      id="fechaPago"
                      name="fechaPago"
                      type="datetime-local"
                      required
                      value={
                        formData.fechaPago
                      }
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:ring-2 focus:ring-[#0A3D62]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="referencia"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Referencia
                    </label>

                    <input
                      id="referencia"
                      name="referencia"
                      type="text"
                      maxLength={100}
                      value={
                        formData.referencia
                      }
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:ring-2 focus:ring-[#0A3D62]"
                    />
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Canal del comprobante
                        {metodoSeleccionado?.requiereComprobante ? " *" : ""}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Selecciona cómo entregarás la evidencia del pago.
                      </p>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2">
                      {[
                        { value: "Imagen" as const, label: "Subir imagen", icon: FileImage },
                        { value: "URL" as const, label: "Pegar URL", icon: ExternalLink },
                        { value: "WhatsApp" as const, label: "WhatsApp", icon: Smartphone },
                        ...(!metodoSeleccionado?.requiereComprobante
                          ? [{ value: "Sin comprobante" as const, label: "Sin comprobante", icon: FileText }]
                          : []),
                      ].map((opcion) => {
                        const Icon = opcion.icon;
                        const seleccionado = formData.canalComprobante === opcion.value;

                        return (
                          <button
                            key={opcion.value}
                            type="button"
                            onClick={() => {
                              void cambiarCanalComprobante(
                                opcion.value
                              );
                            }}
                            className={`flex items-center gap-2 rounded-lg border px-3 py-3 text-left text-sm font-medium transition ${
                              seleccionado
                                ? "border-[#0A3D62] bg-blue-50 text-[#0A3D62]"
                                : "border-gray-200 text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            <Icon size={17} />
                            {opcion.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {formData.canalComprobante === "Imagen" && (
                    <ComprobanteCloudinaryUploader
                      compraId={compraId}
                      usuarioId={
                        data.compra.usuarioId
                      }
                      value={comprobanteImagen}
                      onChange={actualizarImagen}
                      disabled={reportando}
                    />
                  )}

                  {formData.canalComprobante === "URL" && (
                    <div>
                      <label
                        htmlFor="rutaComprobante"
                        className="mb-1 block text-sm font-medium text-gray-700"
                      >
                        URL pública del comprobante
                      </label>

                      <input
                        id="rutaComprobante"
                        name="rutaComprobante"
                        type="url"
                        required
                        value={formData.rutaComprobante}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:ring-2 focus:ring-[#0A3D62]"
                        placeholder="https://..."
                      />

                      <p className="mt-1 text-xs text-gray-500">
                        El enlace debe abrir sin solicitar permisos.
                      </p>
                    </div>
                  )}

                  {formData.canalComprobante === "WhatsApp" && (
                    <div className="space-y-3 rounded-xl border border-green-200 bg-green-50 p-4">
                      <div>
                        <p className="font-semibold text-green-900">
                          Enviar por WhatsApp
                        </p>
                        <p className="mt-1 text-sm text-green-800">
                          Abre el chat, adjunta la captura y envía el mensaje prellenado.
                        </p>
                      </div>

                      {whatsappUrl ? (
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 font-semibold text-white transition hover:bg-green-700"
                        >
                          <Smartphone size={18} />
                          Abrir WhatsApp
                        </a>
                      ) : (
                        <p className="rounded-lg bg-white p-3 text-sm text-red-700">
                          Falta configurar NEXT_PUBLIC_WHATSAPP_PAGOS.
                        </p>
                      )}

                      <label className="flex items-start gap-3 rounded-lg bg-white p-3">
                        <input
                          type="checkbox"
                          checked={formData.comprobanteConfirmado}
                          onChange={(event) =>
                            setFormData((previous) => ({
                              ...previous,
                              comprobanteConfirmado: event.target.checked,
                            }))
                          }
                          className="mt-1 h-4 w-4 rounded border-gray-300"
                        />
                        <span className="text-sm text-gray-700">
                          Ya envié el comprobante por WhatsApp.
                        </span>
                      </label>
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="observaciones"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Observaciones
                    </label>

                    <textarea
                      id="observaciones"
                      name="observaciones"
                      maxLength={1000}
                      rows={3}
                      value={
                        formData.observaciones
                      }
                      onChange={handleChange}
                      className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:ring-2 focus:ring-[#0A3D62]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={reportando}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0A3D62] px-4 py-3 font-semibold text-white hover:bg-[#164f77] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {reportando ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Reportando...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Reportar pago
                      </>
                    )}
                  </button>
                </form>
              )}
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}