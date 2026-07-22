/// src/components/admin/compras/CompraCursoAdminDetalle.tsx
"use client";

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  FileText,
  Image as ImageIcon,
  Link2,
  Loader2,
  MessageCircle,
  RefreshCw,
  History,
  UserRound,
  Users,
  WalletCards,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { getApiErrorMessage } from "@/types/api";

import type {
  CompraCursoAdminDetalleResponse,
  ValidarCompraCursoAdminResponse,
} from "@/types/admin-compras-cursos";

import type {
  CompraParticipanteResumen,
  PagoCursoResumen,
} from "@/types/compras-cursos";

import NextImage from "next/image";

interface CompraCursoAdminDetalleProps {
  compraId: string;
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

function parseResponse(
  value: unknown
): CompraCursoAdminDetalleResponse | null {
  if (
    !isRecord(value) ||
    !isRecord(value.compra) ||
    !Array.isArray(value.participantes) ||
    !Array.isArray(value.metodosPago) ||
    !Array.isArray(value.pagos) ||
    !Array.isArray(value.historialEstados) ||
    !isRecord(value.resumenPago)
  ) {
    return null;
  }

  return value as unknown as CompraCursoAdminDetalleResponse;
}

function parseValidacionResponse(
  value: unknown
): ValidarCompraCursoAdminResponse | null {
  if (
    !isRecord(value) ||
    typeof value.message !== "string" ||
    !isRecord(value.compra) ||
    typeof value.compra.idCompra !== "number" ||
    typeof value.compra.estado !== "string" ||
    typeof value.inscripcionesGeneradas !== "number"
  ) {
    return null;
  }

  return value as unknown as ValidarCompraCursoAdminResponse;
}

function formatCurrency(value: string): string {
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

function formatBirthDate(
  value: string | null
): string {
  if (!value) {
    return "No especificada";
  }

  const date = new Date(
    `${value}T00:00:00`
  );

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "long",
  }).format(date);
}

function estadoCompraClassName(
  estado: string
): string {
  switch (estado) {
    case "Pago reportado":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "En validación":
      return "border-blue-200 bg-blue-50 text-blue-700";
    case "Pago validado":
    case "Inscripciones generadas":
      return "border-green-200 bg-green-50 text-green-700";
    case "Rechazada":
    case "Cancelada":
    case "Expirada":
      return "border-red-200 bg-red-50 text-red-700";
    default:
      return "border-gray-200 bg-gray-50 text-gray-700";
  }
}

function estadoTimelineClassName(
  estado: string
): string {
  switch (estado) {
    case "Pago reportado":
      return "bg-amber-500 ring-amber-200";
    case "En validación":
      return "bg-blue-500 ring-blue-200";
    case "Pago validado":
    case "Inscripciones generadas":
      return "bg-green-500 ring-green-200";
    case "Rechazada":
    case "Cancelada":
    case "Expirada":
      return "bg-red-500 ring-red-200";
    default:
      return "bg-gray-500 ring-gray-200";
  }
}

function estadoPagoClassName(
  estado: string
): string {
  switch (estado) {
    case "Aprobado":
      return "border-green-200 bg-green-50 text-green-700";
    case "Reportado":
    case "En revisión":
      return "border-blue-200 bg-blue-50 text-blue-700";
    case "Rechazado":
    case "Cancelado":
      return "border-red-200 bg-red-50 text-red-700";
    default:
      return "border-gray-200 bg-gray-50 text-gray-700";
  }
}

export function CompraCursoAdminDetalle({
  compraId,
}: CompraCursoAdminDetalleProps) {
  const [data, setData] =
    useState<CompraCursoAdminDetalleResponse | null>(
      null
    );
  const [loading, setLoading] = useState(true);
  const [actualizando, setActualizando] =
    useState(false);
  const [error, setError] = useState<string | null>(
    null
  );
  const [observaciones, setObservaciones] =
    useState("");
  const [procesandoAccion, setProcesandoAccion] =
    useState<"aprobar" | "rechazar" | null>(
      null
    );
  const [mensajeAccion, setMensajeAccion] =
    useState<{
      type: "success" | "error";
      text: string;
    } | null>(null);

  const [
    comprobantesWhatsappRevisados,
    setComprobantesWhatsappRevisados,
  ] = useState(false);

  const cargarDetalle = useCallback(
    async (cargaInicial = false) => {
      if (cargaInicial) {
        setLoading(true);
      } else {
        setActualizando(true);
      }

      setError(null);

      try {
        const response = await fetch(
          `/api/admin/compras-cursos/${encodeURIComponent(
            compraId
          )}`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        const payload =
          await readJsonResponse(response);

        if (!response.ok) {
          throw new Error(
            getApiErrorMessage(
              payload,
              "No fue posible obtener el detalle de la compra"
            )
          );
        }

        const result = parseResponse(payload);

        if (!result) {
          throw new Error(
            "La respuesta del detalle no es válida"
          );
        }

        setData(result);
        setComprobantesWhatsappRevisados(false);
      } catch (errorValue: unknown) {
        setError(
          errorValue instanceof Error
            ? errorValue.message
            : "No fue posible obtener el detalle de la compra"
        );
      } finally {
        setLoading(false);
        setActualizando(false);
      }
    },
    [compraId]
  );

  useEffect(() => {
    void cargarDetalle(true);
  }, [cargarDetalle]);

  const requiereRevisionWhatsapp = useMemo(
    () =>
      data?.pagos.some(
        (pago) =>
          pago.canalComprobante === "WhatsApp" &&
          !pago.comprobanteConfirmado
      ) ?? false,
    [data]
  );

  const validarCompra = useCallback(
    async (
      accion: "aprobar" | "rechazar"
    ) => {
      const observacionesLimpias =
        observaciones.trim();

      if (
        data?.compra.estado ===
        "Expirada"
      ) {
        setMensajeAccion({
          type: "error",
          text:
            "La compra ya expiró y no admite acciones administrativas.",
        });
        return;
      }

      if (
        accion === "aprobar" &&
        requiereRevisionWhatsapp &&
        !comprobantesWhatsappRevisados
      ) {
        setMensajeAccion({
          type: "error",
          text:
            "Debes confirmar que localizaste y revisaste los comprobantes enviados por WhatsApp.",
        });
        return;
      }

      if (
        accion === "rechazar" &&
        !observacionesLimpias
      ) {
        setMensajeAccion({
          type: "error",
          text:
            "Debes escribir el motivo del rechazo.",
        });
        return;
      }

      const mensajeConfirmacion =
        accion === "aprobar"
          ? "¿Confirmas que deseas aprobar la compra y generar las inscripciones?"
          : "¿Confirmas que deseas rechazar la compra y sus pagos reportados?";

      if (
        !window.confirm(
          mensajeConfirmacion
        )
      ) {
        return;
      }

      setProcesandoAccion(accion);
      setMensajeAccion(null);

      try {
        const response = await fetch(
          `/api/admin/compras-cursos/${encodeURIComponent(
            compraId
          )}/validar`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              accion,

              observaciones:
                observacionesLimpias || null,

              comprobantesWhatsappRevisados:
                accion === "aprobar"
                  ? comprobantesWhatsappRevisados
                  : false,
            }),
          }
        );

        const payload =
          await readJsonResponse(response);

        if (!response.ok) {
          throw new Error(
            getApiErrorMessage(
              payload,
              accion === "aprobar"
                ? "No fue posible aprobar la compra"
                : "No fue posible rechazar la compra"
            )
          );
        }

        const result =
          parseValidacionResponse(payload);

        if (!result) {
          throw new Error(
            "La respuesta de validación no es válida"
          );
        }

        setMensajeAccion({
          type: "success",
          text: result.message,
        });
        setObservaciones("");

        await cargarDetalle(false);
      } catch (errorValue: unknown) {
        setMensajeAccion({
          type: "error",
          text:
            errorValue instanceof Error
              ? errorValue.message
              : "No fue posible validar la compra",
        });
      } finally {
        setProcesandoAccion(null);
      }
    },
    [
      cargarDetalle,
      compraId,
      data,
      comprobantesWhatsappRevisados,
      observaciones,
      requiereRevisionWhatsapp,
    ]
  );

  const pagoCompleto = useMemo(
    () =>
      data?.resumenPago
        .pagoCompletoReportado ?? false,
    [data]
  );

  if (loading) {
    return (
      <div className="flex min-h-[360px] items-center justify-center rounded-2xl border border-gray-200 bg-white">
        <div className="flex items-center gap-3 text-gray-600">
          <Loader2
            size={22}
            className="animate-spin"
          />
          Cargando detalle de compra...
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-5">
        <Link
          href="/compras-cursos"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#0A3D62] hover:text-[#1A4F7A]"
        >
          <ArrowLeft size={18} />
          Regresar a pagos de cursos
        </Link>

        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertCircle
            size={20}
            className="mt-0.5 shrink-0"
          />
          <div>
            <p className="font-semibold">
              No fue posible cargar la compra
            </p>
            <p className="mt-1 text-sm">
              {error ??
                "No se encontró información de la compra"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const {
    compra,
    participantes,
    pagos,
    historialEstados,
    resumenPago,
  } = data;

  const compraExpirada =
    compra.estado === "Expirada";

  const puedeValidarse =
    !compraExpirada &&
    (
      compra.estado ===
        "Pago reportado" ||
      compra.estado ===
        "En validación"
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/compras-cursos"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#0A3D62] hover:text-[#1A4F7A]"
        >
          <ArrowLeft size={18} />
          Regresar a pagos de cursos
        </Link>

        <button
          type="button"
          onClick={() => {
            void cargarDetalle(false);
          }}
          disabled={actualizando}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={18}
            className={
              actualizando
                ? "animate-spin"
                : ""
            }
          />
          {actualizando
            ? "Actualizando..."
            : "Actualizar"}
        </button>
      </div>

      <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-[#0A3D62] to-[#1A4F7A] p-6 text-white shadow-lg">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-100">
              {compra.folioCompra}
            </p>
            <h1 className="mt-1 text-2xl font-bold md:text-3xl">
              {compra.tituloCurso}
            </h1>
            <p className="mt-2 text-sm text-blue-100">
              Compra #{compra.idCompra}
            </p>
          </div>

          <span
            className={`inline-flex w-fit rounded-full border px-4 py-2 text-sm font-semibold ${estadoCompraClassName(
              compra.estado
            )}`}
          >
            {compra.estado}
          </span>
        </div>
      </section>

      {compraExpirada && (
        <section className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800 shadow-sm">
          <div className="flex items-start gap-3">
            <Clock3
              size={22}
              className="mt-0.5 shrink-0"
            />

            <div>
              <h2 className="font-bold">
                Compra expirada
              </h2>

              <p className="mt-1 text-sm">
                El plazo de pago venció el{" "}
                <strong>
                  {formatDate(
                    compra.fechaLimitePago
                  )}
                </strong>
                . Los participantes asociados fueron cancelados y esta compra ya no puede aprobarse ni rechazarse.
              </p>

              <p className="mt-2 text-sm">
                La expiración fue aplicada automáticamente por el sistema.
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ResumenCard
          label="Total de compra"
          value={formatCurrency(
            resumenPago.totalCompra
          )}
          icon={<WalletCards size={20} />}
        />
        <ResumenCard
          label="Total reportado"
          value={formatCurrency(
            resumenPago.totalReportado
          )}
          icon={<CheckCircle2 size={20} />}
        />
        <ResumenCard
          label="Saldo pendiente"
          value={formatCurrency(
            resumenPago.saldoPendiente
          )}
          icon={<AlertCircle size={20} />}
        />
        <ResumenCard
          label="Cupos comprados"
          value={String(
            compra.cantidadCupos
          )}
          icon={<Users size={20} />}
        />
      </section>

      <section
        className={`rounded-xl border p-4 ${
          pagoCompleto
            ? "border-green-200 bg-green-50 text-green-800"
            : "border-amber-200 bg-amber-50 text-amber-800"
        }`}
      >
        <div className="flex items-start gap-3">
          {pagoCompleto ? (
            <CheckCircle2
              size={21}
              className="mt-0.5 shrink-0"
            />
          ) : (
            <AlertCircle
              size={21}
              className="mt-0.5 shrink-0"
            />
          )}
          <div>
            <p className="font-semibold">
              {pagoCompleto
                ? "El monto completo fue reportado"
                : "El monto reportado todavía es incompleto"}
            </p>
            <p className="mt-1 text-sm">
              {pagoCompleto
                ? "La compra puede pasar al proceso de validación administrativa."
                : "No debe aprobarse la compra hasta que el total reportado cubra el importe completo."}
            </p>
          </div>
        </div>
      </section>

      {puedeValidarse && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-gray-900">
              Validación administrativa
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Revisa el comprobante y registra una
              observación antes de aprobar o rechazar.
            </p>
          </div>

          {requiereRevisionWhatsapp && (
            <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex items-start gap-3">
                <MessageCircle
                  size={21}
                  className="mt-0.5 shrink-0 text-emerald-700"
                />

                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-emerald-900">
                    Hay comprobantes enviados por WhatsApp
                  </p>

                  <p className="mt-1 text-sm text-emerald-800">
                    Antes de aprobar, localiza los mensajes usando el folio de la compra y revisa que el importe y la evidencia sean correctos.
                  </p>

                  <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-lg border border-emerald-200 bg-white p-3">
                    <input
                      type="checkbox"
                      checked={
                        comprobantesWhatsappRevisados
                      }
                      onChange={(event) => {
                        setComprobantesWhatsappRevisados(
                          event.target.checked
                        );
                        setMensajeAccion(null);
                      }}
                      disabled={
                        procesandoAccion !== null
                      }
                      className="mt-0.5 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />

                    <span className="text-sm font-medium text-gray-800">
                      Confirmo que localicé y revisé los comprobantes enviados por WhatsApp.
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          <label
            htmlFor="observaciones-validacion"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Observaciones
          </label>

          <textarea
            id="observaciones-validacion"
            rows={4}
            maxLength={2000}
            value={observaciones}
            onChange={(event) => {
              setObservaciones(
                event.target.value
              );
              setMensajeAccion(null);
            }}
            disabled={
              procesandoAccion !== null
            }
            placeholder="Escribe notas de la revisión. Para rechazar, el motivo es obligatorio."
            className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-[#0A3D62] disabled:cursor-not-allowed disabled:bg-gray-100"
          />

          {mensajeAccion && (
            <div
              className={`mt-4 flex items-start gap-3 rounded-xl border p-4 ${
                mensajeAccion.type ===
                "success"
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {mensajeAccion.type ===
              "success" ? (
                <CheckCircle2
                  size={20}
                  className="mt-0.5 shrink-0"
                />
              ) : (
                <AlertCircle
                  size={20}
                  className="mt-0.5 shrink-0"
                />
              )}
              <p className="text-sm">
                {mensajeAccion.text}
              </p>
            </div>
          )}

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => {
                void validarCompra(
                  "rechazar"
                );
              }}
              disabled={
                procesandoAccion !== null
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-300 bg-white px-5 py-3 font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {procesandoAccion ===
              "rechazar" ? (
                <Loader2
                  size={18}
                  className="animate-spin"
                />
              ) : (
                <XCircle size={18} />
              )}
              {procesandoAccion ===
              "rechazar"
                ? "Rechazando..."
                : "Rechazar compra"}
            </button>

            <button
              type="button"
              onClick={() => {
                void validarCompra(
                  "aprobar"
                );
              }}
              disabled={
                procesandoAccion !== null ||
                !pagoCompleto ||
                (
                  requiereRevisionWhatsapp &&
                  !comprobantesWhatsappRevisados
                )
              }
              title={
                !pagoCompleto
                  ? "El total reportado debe cubrir el total de la compra"
                  : requiereRevisionWhatsapp &&
                    !comprobantesWhatsappRevisados
                    ? "Debes confirmar que revisaste los comprobantes enviados por WhatsApp"
                    : "Aprobar compra y generar inscripciones"
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {procesandoAccion ===
              "aprobar" ? (
                <Loader2
                  size={18}
                  className="animate-spin"
                />
              ) : (
                <CheckCircle2
                  size={18}
                />
              )}
              {procesandoAccion ===
              "aprobar"
                ? "Aprobando..."
                : "Aprobar y generar inscripciones"}
            </button>
          </div>

          {!pagoCompleto && (
            <p className="mt-3 text-sm text-amber-700">
              La aprobación está bloqueada porque
              el monto reportado no cubre el total
              de la compra.
            </p>
          )}

          {pagoCompleto &&
            requiereRevisionWhatsapp &&
            !comprobantesWhatsappRevisados && (
              <p className="mt-3 text-sm text-emerald-700">
                La aprobación está bloqueada hasta confirmar que se revisaron los comprobantes enviados por WhatsApp.
              </p>
            )}
        </section>
      )}

      {!puedeValidarse && (
        <section
          className={`rounded-xl border p-4 text-sm ${
            compraExpirada
              ? "border-red-200 bg-red-50 text-red-800"
              : "border-gray-200 bg-gray-50 text-gray-700"
          }`}
        >
          {compraExpirada ? (
            <>
              La compra expiró por vencimiento del plazo de pago. No hay acciones administrativas disponibles.
            </>
          ) : (
            <>
              Esta compra ya no tiene acciones administrativas pendientes. Su estado actual es{" "}
              <strong>{compra.estado}</strong>.
            </>
          )}
        </section>
      )}

      <section className="grid gap-6 lg:grid-cols-2">
        <InfoSection
          title="Información de la compra"
          icon={<FileText size={20} />}
        >
          <InfoRow
            label="Folio"
            value={compra.folioCompra}
          />
          <InfoRow
            label="Estado"
            value={compra.estado}
          />
          <InfoRow
            label="Fecha de compra"
            value={formatDate(
              compra.fechaCompra
            )}
          />
          <InfoRow
            label="Límite de pago"
            value={formatDate(
              compra.fechaLimitePago
            )}
          />
          <InfoRow
            label="Precio unitario"
            value={formatCurrency(
              compra.precioUnitario
            )}
          />
          <InfoRow
            label="Subtotal"
            value={formatCurrency(
              compra.subtotal
            )}
          />
          <InfoRow
            label="Descuento"
            value={formatCurrency(
              compra.descuento
            )}
          />
          <InfoRow
            label="Total"
            value={formatCurrency(
              compra.total
            )}
          />
        </InfoSection>

        <InfoSection
          title="Comprador"
          icon={<UserRound size={20} />}
        >
          <InfoRow
            label="Nombre"
            value={compra.compradorNombre}
          />
          <InfoRow
            label="Correo"
            value={compra.compradorCorreo}
          />
          <InfoRow
            label="Usuario"
            value={`#${compra.usuarioId}`}
          />
          <InfoRow
            label="Curso"
            value={compra.tituloCurso}
          />
          <InfoRow
            label="Curso ID"
            value={`#${compra.cursoId}`}
          />
          <InfoRow
            label="Cantidad de cupos"
            value={String(
              compra.cantidadCupos
            )}
          />

          {compra.observaciones && (
            <div className="mt-4 rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
              <p className="font-medium text-gray-900">
                Observaciones
              </p>
              <p className="mt-1">
                {compra.observaciones}
              </p>
            </div>
          )}
        </InfoSection>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center gap-2">
          <History
            size={21}
            className="text-[#0A3D62]"
          />

          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Historial de estados
            </h2>

            <p className="text-sm text-gray-500">
              {historialEstados.length} cambio(s)
              registrado(s)
            </p>
          </div>
        </div>

        {historialEstados.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
            No hay cambios de estado registrados para esta compra.
          </div>
        ) : (
          <div className="space-y-0">
            {historialEstados.map(
              (movimiento, index) => {
                const esUltimo =
                  index ===
                  historialEstados.length - 1;

                return (
                  <article
                    key={movimiento.idHistorial}
                    className="relative flex gap-4"
                  >
                    <div className="flex w-5 shrink-0 flex-col items-center">
                      <span
                        className={`mt-1 h-4 w-4 rounded-full border-4 border-white ring-2 ${
                          estadoTimelineClassName(
                            movimiento.estadoNuevo
                          )
                        }`}
                      />

                      {!esUltimo && (
                        <span className="mt-1 min-h-16 w-px flex-1 bg-gray-200" />
                      )}
                    </div>

                    <div
                      className={`min-w-0 flex-1 ${
                        esUltimo
                          ? "pb-0"
                          : "pb-6"
                      }`}
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${estadoCompraClassName(
                              movimiento.estadoNuevo
                            )}`}
                          >
                            {movimiento.estadoNuevo}
                          </span>

                          <p className="mt-2 text-sm font-medium text-gray-800">
                            {movimiento.estadoAnterior
                              ? `${movimiento.estadoAnterior} → ${movimiento.estadoNuevo}`
                              : `Compra creada en ${movimiento.estadoNuevo}`}
                          </p>
                        </div>

                        <time className="shrink-0 text-xs text-gray-500">
                          {formatDate(
                            movimiento.fechaCambio
                          )}
                        </time>
                      </div>

                      <div className="mt-3 grid gap-2 text-sm text-gray-600 sm:grid-cols-2">
                        <InfoRow
                          label="Origen"
                          value={
                            movimiento.origenCambio
                          }
                        />

                        <InfoRow
                          label="Responsable"
                          value={
                            movimiento.usuarioResponsableNombre ??
                            (
                              movimiento.usuarioResponsableId
                                ? `Usuario #${movimiento.usuarioResponsableId}`
                                : "Sistema"
                            )
                          }
                        />
                      </div>

                      {movimiento.motivo && (
                        <div className="mt-3 rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
                          <p className="font-medium text-gray-900">
                            Motivo
                          </p>
                          <p className="mt-1 whitespace-pre-line">
                            {movimiento.motivo}
                          </p>
                        </div>
                      )}

                      {movimiento.observaciones && (
                        <div className="mt-3 rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-700">
                          <p className="font-medium text-gray-900">
                            Observaciones
                          </p>
                          <p className="mt-1 whitespace-pre-line">
                            {movimiento.observaciones}
                          </p>
                        </div>
                      )}
                    </div>
                  </article>
                );
              }
            )}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center gap-2">
          <Users
            size={21}
            className="text-[#0A3D62]"
          />
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Participantes
            </h2>
            <p className="text-sm text-gray-500">
              {participantes.length} participante(s)
              registrado(s)
            </p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {participantes.map(
            (participante) => (
              <ParticipanteCard
                key={
                  participante.idCompraParticipante
                }
                participante={
                  participante
                }
              />
            )
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center gap-2">
          <WalletCards
            size={21}
            className="text-[#0A3D62]"
          />
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Pagos reportados
            </h2>
            <p className="text-sm text-gray-500">
              {pagos.length} pago(s)
            </p>
          </div>
        </div>

        {pagos.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
            Esta compra todavía no tiene pagos
            reportados.
          </div>
        ) : (
          <div className="space-y-4">
            {pagos.map((pago) => (
              <PagoCard
                key={pago.idPago}
                pago={pago}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function ParticipanteCard({
  participante,
}: {
  participante: CompraParticipanteResumen;
}) {
  const data = participante.participante;

  const nombreCompleto = [
    data.nombre,
    data.apellidoPaterno,
    data.apellidoMaterno,
  ]
    .filter(
      (value): value is string =>
        typeof value === "string" &&
        value.trim().length > 0
    )
    .join(" ");

  return (
    <article className="rounded-xl border border-gray-200 bg-gray-50 p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-semibold text-[#0A3D62]">
          Cupo {participante.numeroCupo}
        </h3>

        <span
          className={`rounded-full border px-3 py-1 text-xs font-medium ${
            participante.estado ===
            "Cancelado"
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-gray-200 bg-white text-gray-600"
          }`}
        >
          {participante.estado}
        </span>
      </div>

      <div className="space-y-2 text-sm">
        <InfoRow
          label="Nombre"
          value={nombreCompleto}
        />
        <InfoRow
          label="Fecha de nacimiento"
          value={formatBirthDate(
            data.fechaNacimiento
          )}
        />
        <InfoRow
          label="Sexo"
          value={
            data.sexo ?? "No especificado"
          }
        />
        <InfoRow
          label="Teléfono"
          value={
            data.telefono ??
            "No especificado"
          }
        />
        <InfoRow
          label="Correo"
          value={
            data.correo ??
            "No especificado"
          }
        />
      </div>

      {participante.observaciones && (
        <p className="mt-3 rounded-lg bg-white p-3 text-xs text-gray-600">
          {participante.observaciones}
        </p>
      )}
    </article>
  );
}

function canalComprobanteClassName(
  canal: PagoCursoResumen["canalComprobante"]
): string {
  switch (canal) {
    case "Imagen":
      return "border-violet-200 bg-violet-50 text-violet-700";
    case "URL":
      return "border-blue-200 bg-blue-50 text-blue-700";
    case "WhatsApp":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "Sin comprobante":
      return "border-gray-200 bg-gray-50 text-gray-700";
  }
}

function PagoCard({
  pago,
}: {
  pago: PagoCursoResumen;
}) {
  const esWhatsapp =
    pago.canalComprobante === "WhatsApp";

  const esImagen =
    pago.canalComprobante === "Imagen";

  const esUrl =
    pago.canalComprobante === "URL";

  return (
    <article className="rounded-xl border border-gray-200 p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-gray-900">
              {pago.metodoPago}
            </h3>

            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${estadoPagoClassName(
                pago.estado
              )}`}
            >
              {pago.estado}
            </span>

            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${canalComprobanteClassName(
                pago.canalComprobante
              )}`}
            >
              {pago.canalComprobante}
            </span>
          </div>

          <p className="mt-2 text-2xl font-bold text-[#0A3D62]">
            {formatCurrency(pago.monto)}
          </p>
        </div>

        <div className="grid gap-2 text-sm text-gray-600 sm:grid-cols-2 md:min-w-[420px]">
          <InfoRow
            label="Fecha de pago"
            value={formatDate(
              pago.fechaPago
            )}
          />
          <InfoRow
            label="Fecha de reporte"
            value={formatDate(
              pago.fechaReporte
            )}
          />
          <InfoRow
            label="Referencia"
            value={
              pago.referencia ??
              "Sin referencia"
            }
          />
          <InfoRow
            label="Archivo"
            value={
              pago.nombreArchivoOriginal ??
              "Sin archivo"
            }
          />
        </div>
      </div>

      {esWhatsapp && (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-start gap-3">
            <MessageCircle
              size={20}
              className="mt-0.5 shrink-0 text-emerald-700"
            />

            <div>
              <p className="font-semibold text-emerald-900">
                Comprobante reportado por WhatsApp
              </p>

              <p className="mt-1 text-sm text-emerald-800">
                El cliente indicó que envió el comprobante por WhatsApp.
              </p>

              <p className="mt-2 text-sm text-emerald-800">
                Fecha indicada de envío:{" "}
                <strong>
                  {pago.fechaEnvioWhatsapp
                    ? formatDate(
                        pago.fechaEnvioWhatsapp
                      )
                    : "No registrada"}
                </strong>
              </p>

              <p className="mt-2 text-sm text-emerald-800">
                Estado de revisión:{" "}
                <strong>
                  {pago.comprobanteConfirmado
                    ? "Verificado"
                    : "Pendiente de localizar y revisar"}
                </strong>
              </p>
            </div>
          </div>
        </div>
      )}

      {pago.rutaComprobante && (
        <div className="mt-4 border-t pt-4">
          {esImagen ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <ImageIcon
                  size={18}
                  className="text-violet-700"
                />

                <p className="font-semibold text-gray-900">
                  Imagen del comprobante
                </p>
              </div>

              <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                <div className="relative min-h-[260px] w-full sm:min-h-[360px] lg:min-h-[440px]">
                  <NextImage
                    src={pago.rutaComprobante}
                    alt={
                      pago.nombreArchivoOriginal
                        ? `Comprobante ${pago.nombreArchivoOriginal}`
                        : "Comprobante de pago"
                    }
                    fill
                    sizes="
                      (max-width: 640px) 100vw,
                      (max-width: 1024px) 80vw,
                      900px
                    "
                    className="object-contain p-3"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-800">
                    {pago.nombreArchivoOriginal ??
                      "Comprobante de pago"}
                  </p>

                  {pago.tipoArchivo && (
                    <p className="text-xs text-gray-500">
                      {pago.tipoArchivo}
                    </p>
                  )}
                </div>

                <a
                  href={pago.rutaComprobante}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700 transition hover:bg-violet-100"
                >
                  <ImageIcon size={17} />
                  Abrir imagen completa
                </a>
              </div>
            </div>
          ) : (
            <a
              href={pago.rutaComprobante}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-[#0A3D62] transition hover:bg-blue-100"
            >
              {esUrl ? (
                <Link2 size={17} />
              ) : (
                <FileText size={17} />
              )}

              {esUrl
                ? "Abrir URL del comprobante"
                : "Abrir comprobante"}
            </a>
          )}
        </div>
      )}

      {pago.observaciones && (
        <div className="mt-4 rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
          <p className="font-medium text-gray-800">
            Observaciones del cliente
          </p>
          <p className="mt-1 whitespace-pre-line">
            {pago.observaciones}
          </p>
        </div>
      )}
    </article>
  );
}

function InfoSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-[#0A3D62]">
          {icon}
        </span>
        <h2 className="text-lg font-bold text-gray-900">
          {title}
        </h2>
      </div>

      <div className="space-y-3">
        {children}
      </div>
    </section>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <span className="text-gray-500">
        {label}
      </span>
      <span className="break-words text-right font-medium text-gray-800">
        {value}
      </span>
    </div>
  );
}

function ResumenCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0A3D62]">
        {icon}
      </div>

      <p className="truncate text-2xl font-bold text-gray-900">
        {value}
      </p>

      <p className="mt-1 text-sm text-gray-600">
        {label}
      </p>
    </div>
  );
}