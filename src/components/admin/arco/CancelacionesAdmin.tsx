"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  FileSearch,
  Loader2,
  LockKeyhole,
  RefreshCw,
  ShieldAlert,
} from "lucide-react";

interface UsuarioResumen {
  id: number;
  nombre: string;
  apellidoPaterno: string;
  correo: string;
  activo: boolean | null;
}

interface SolicitudArco {
  solicitudId: number;
  usuarioId: number;
  titulo: string;
  estado: string | null;
  prioridad: string | null;
  esPrivada: boolean | null;
  fechaSolicitud: string | null;
  fechaActualizacion: string | null;
  usuario: UsuarioResumen | null;
}

interface ResumenArco {
  total: number;
  pendientes: number;
  respondidas: number;
  cerradas: number;
}

interface RespuestaListado {
  solicitudes: SolicitudArco[];
  resumen: ResumenArco;
  paginacion: {
    pagina: number;
    limite: number;
    total: number;
    totalPaginas: number;
  };
}

interface Dependencias {
  compras: number;
  pagos: number;
  inscripciones: number;
  participantes: number;
  solicitudesSoporte: number;
}

interface RespuestaDetalle {
  solicitud: SolicitudArco & { descripcion: string };
  dependencias: Dependencias;
  revision: {
    requiereRevisionAdministrativa: boolean;
    eliminacionEjecutada: boolean;
    autorizaEliminacionAutomatica: boolean;
    mensaje: string;
  };
}

interface ResultadoOperacion {
  solicitudId: number;
  usuarioId: number;
  modo: "simular" | "ejecutar";
  ejecutada: boolean;
  cuentaActiva: boolean;
  estadoSolicitud: string;
  registrosEliminados: number;
  datosPersonalesEliminados: boolean;
  ejecucionHabilitada?: boolean;
  accionesPrevistas?: string[];
  sesionesInvalidadas?: boolean;
  auditoriaId?: number;
  message: string;
}

interface RespuestaOperacion {
  status: number;
  datos: ResultadoOperacion;
}

const RESUMEN_INICIAL: ResumenArco = {
  total: 0,
  pendientes: 0,
  respondidas: 0,
  cerradas: 0,
};

const CONFIRMACION_REQUERIDA = "DESACTIVAR CUENTA";

function formatearFecha(valor: string | null): string {
  if (!valor) return "Sin fecha";
  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) return "Fecha inválida";

  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(fecha);
}

async function obtenerMensajeError(response: Response): Promise<string> {
  const data: unknown = await response.json().catch(() => null);
  if (data && typeof data === "object" && "message" in data) {
    const mensaje = data.message;
    if (typeof mensaje === "string") return mensaje;
  }
  return `Error HTTP ${response.status}`;
}

async function solicitarOperacion(
  solicitudId: number,
  body: Record<string, unknown>,
): Promise<ResultadoOperacion> {
  const response = await fetch(
    `/api/admin/arco/cancelaciones/${solicitudId}/desactivar`,
    {
      method: "POST",
      credentials: "same-origin",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );

  if (!response.ok) {
    throw new Error(await obtenerMensajeError(response));
  }

  const payload = (await response.json()) as RespuestaOperacion;
  if (
    !payload ||
    payload.status !== 200 ||
    !payload.datos ||
    payload.datos.solicitudId !== solicitudId
  ) {
    throw new Error("El servidor devolvió una respuesta inesperada.");
  }

  return payload.datos;
}

export default function CancelacionesAdmin() {
  const [solicitudes, setSolicitudes] = useState<SolicitudArco[]>([]);
  const [resumen, setResumen] = useState<ResumenArco>(RESUMEN_INICIAL);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [estado, setEstado] = useState("");
  const [recarga, setRecarga] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [detalle, setDetalle] = useState<RespuestaDetalle | null>(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);
  const [errorDetalle, setErrorDetalle] = useState("");
  const [simulacion, setSimulacion] = useState<ResultadoOperacion | null>(null);
  const [resultadoReal, setResultadoReal] = useState<ResultadoOperacion | null>(null);
  const [simulando, setSimulando] = useState(false);
  const [ejecutando, setEjecutando] = useState(false);
  const [errorOperacion, setErrorOperacion] = useState("");
  const [idConfirmado, setIdConfirmado] = useState("");
  const [confirmacion, setConfirmacion] = useState("");

  useEffect(() => {
    let vigente = true;

    async function cargarSolicitudes() {
      setCargando(true);
      setError("");
      try {
        const params = new URLSearchParams({ pagina: String(pagina) });
        if (estado) params.set("estado", estado);

        const response = await fetch(
          `/api/admin/arco/cancelaciones?${params.toString()}`,
          { credentials: "same-origin", cache: "no-store" },
        );
        if (!response.ok) throw new Error(await obtenerMensajeError(response));

        const data = (await response.json()) as RespuestaListado;
        if (!Array.isArray(data.solicitudes)) {
          throw new Error("La respuesta del servidor no es válida.");
        }
        if (!vigente) return;

        setSolicitudes(data.solicitudes);
        setResumen(data.resumen ?? RESUMEN_INICIAL);
        setTotalPaginas(Math.max(1, data.paginacion?.totalPaginas ?? 1));
      } catch (errorConsulta) {
        if (!vigente) return;
        setSolicitudes([]);
        setError(
          errorConsulta instanceof Error
            ? errorConsulta.message
            : "No fue posible cargar las solicitudes.",
        );
      } finally {
        if (vigente) setCargando(false);
      }
    }

    void cargarSolicitudes();
    return () => { vigente = false; };
  }, [pagina, estado, recarga]);

  function limpiarConfirmacion() {
    setSimulacion(null);
    setResultadoReal(null);
    setErrorOperacion("");
    setIdConfirmado("");
    setConfirmacion("");
  }

  async function consultarDetalle(solicitudId: number) {
    setCargandoDetalle(true);
    setErrorDetalle("");
    setDetalle(null);
    limpiarConfirmacion();

    try {
      const response = await fetch(
        `/api/admin/arco/cancelaciones/${solicitudId}`,
        { credentials: "same-origin", cache: "no-store" },
      );
      if (!response.ok) throw new Error(await obtenerMensajeError(response));
      const data = (await response.json()) as RespuestaDetalle;
      if (!data.solicitud || data.solicitud.solicitudId !== solicitudId) {
        throw new Error("El detalle de la solicitud no es válido.");
      }
      setDetalle(data);
    } catch (errorConsulta) {
      setErrorDetalle(
        errorConsulta instanceof Error
          ? errorConsulta.message
          : "No fue posible consultar el detalle.",
      );
    } finally {
      setCargandoDetalle(false);
    }
  }

  async function simularBaja() {
    if (!detalle) return;
    const solicitudId = detalle.solicitud.solicitudId;
    setSimulando(true);
    limpiarConfirmacion();

    try {
      const resultado = await solicitarOperacion(solicitudId, {
        modo: "simular",
      });
      if (resultado.modo !== "simular" || resultado.ejecutada !== false) {
        throw new Error("La simulación devolvió un resultado inesperado.");
      }
      setSimulacion(resultado);
    } catch (errorConsulta) {
      setErrorOperacion(
        errorConsulta instanceof Error
          ? errorConsulta.message
          : "No fue posible simular la baja lógica.",
      );
    } finally {
      setSimulando(false);
    }
  }

  async function ejecutarBaja() {
    if (!detalle || !simulacion || ejecutando) return;
    const solicitudId = detalle.solicitud.solicitudId;
    const usuarioId = detalle.solicitud.usuarioId;

    if (
      simulacion.ejecucionHabilitada !== true ||
      simulacion.solicitudId !== solicitudId ||
      simulacion.usuarioId !== usuarioId ||
      simulacion.cuentaActiva !== true ||
      simulacion.estadoSolicitud !== "pendiente" ||
      idConfirmado.trim() !== String(usuarioId) ||
      confirmacion.trim() !== CONFIRMACION_REQUERIDA
    ) {
      setErrorOperacion("Verifica el ID del cliente y la frase de confirmación.");
      return;
    }

    setEjecutando(true);
    setErrorOperacion("");

    try {
      const resultado = await solicitarOperacion(solicitudId, {
        modo: "ejecutar",
        usuarioIdConfirmado: usuarioId,
        confirmacion: CONFIRMACION_REQUERIDA,
      });

      if (
        resultado.modo !== "ejecutar" ||
        resultado.ejecutada !== true ||
        resultado.cuentaActiva !== false
      ) {
        throw new Error("No fue posible confirmar la desactivación del acceso.");
      }

      setResultadoReal(resultado);
      setSimulacion(null);
      setIdConfirmado("");
      setConfirmacion("");
      setRecarga((actual) => actual + 1);

      // La operación ya se confirmó: una falla al refrescar el detalle
      // no debe presentarse como fallo de desactivación.
      try {
        const detalleResponse = await fetch(
          `/api/admin/arco/cancelaciones/${solicitudId}`,
          { credentials: "same-origin", cache: "no-store" },
        );
        if (detalleResponse.ok) {
          const actualizado = (await detalleResponse.json()) as RespuestaDetalle;
          if (actualizado.solicitud?.solicitudId === solicitudId) {
            setDetalle(actualizado);
          }
        }
      } catch {
        // La lista principal puede actualizarse con el botón Actualizar.
      }
    } catch (errorConsulta) {
      setErrorOperacion(
        errorConsulta instanceof Error
          ? errorConsulta.message
          : "No fue posible completar la operación.",
      );
    } finally {
      setEjecutando(false);
    }
  }

  const pendiente = detalle?.solicitud.estado === "pendiente";
  const cuentaActiva = detalle?.solicitud.usuario?.activo === true;
  const confirmacionValida = Boolean(
    simulacion?.ejecucionHabilitada === true &&
    pendiente &&
    cuentaActiva &&
    idConfirmado.trim() === String(detalle?.solicitud.usuarioId) &&
    confirmacion.trim() === CONFIRMACION_REQUERIDA,
  );

  return (
    <main className="min-h-screen bg-slate-50 p-4 text-slate-900 sm:p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <ShieldAlert size={28} aria-hidden="true" />
            <div>
              <p className="text-xs font-semibold text-slate-500">Derechos ARCO</p>
              <h1 className="text-2xl font-bold">Cancelación de cuentas</h1>
            </div>
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600">
            Revisa las solicitudes y simula la baja lógica de acceso. La baja lógica
            desactiva la cuenta y sus sesiones, pero no elimina los datos personales,
            compras, pagos ni inscripciones almacenados.
          </p>
          <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            Esta modalidad no constituye una eliminación de datos personales. La
            ejecución real permanece bloqueada en el servidor salvo autorización
            expresa mediante configuración segura.
          </p>
        </header>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Resumen de solicitudes">
          {[
            { titulo: "Total de solicitudes", valor: resumen.total },
            { titulo: "Pendientes", valor: resumen.pendientes },
            { titulo: "Respondidas", valor: resumen.respondidas },
            { titulo: "Cerradas", valor: resumen.cerradas },
          ].map((item) => (
            <div key={item.titulo} className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-sm text-slate-600">{item.titulo}</p>
              <p className="mt-2 text-3xl font-bold">{item.valor}</p>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <ClipboardList size={20} aria-hidden="true" /> Solicitudes registradas
            </h2>
            <button
              type="button"
              onClick={() => setRecarga((actual) => actual + 1)}
              disabled={cargando || ejecutando || simulando}
              className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:opacity-50"
            >
              <RefreshCw size={16} aria-hidden="true" /> Actualizar
            </button>
          </div>

          <div className="mt-4">
            <label htmlFor="filtro-estado-arco" className="mb-2 block text-sm font-semibold">
              Filtrar por estado
            </label>
            <select
              id="filtro-estado-arco"
              value={estado}
              disabled={ejecutando || simulando}
              onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                setEstado(event.target.value);
                setPagina(1);
              }}
              className="w-full max-w-xs rounded-lg border border-slate-300 bg-white p-2 text-sm"
            >
              <option value="">Todos los estados</option>
              <option value="pendiente">Pendientes</option>
              <option value="respondida">Respondidas</option>
              <option value="cerrada">Cerradas</option>
              <option value="convertida_faq">Convertidas en FAQ (revisión)</option>
            </select>
          </div>

          {cargando ? (
            <p className="mt-5 flex items-center gap-2 py-8 text-sm text-slate-600">
              <Loader2 size={18} className="animate-spin" aria-hidden="true" /> Cargando solicitudes...
            </p>
          ) : error ? (
            <p role="alert" className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </p>
          ) : solicitudes.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-500">
              No hay solicitudes registradas para este filtro.
            </p>
          ) : (
            <div className="mt-5 space-y-3">
              {solicitudes.map((item) => (
                <article key={item.solicitudId} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-bold">Solicitud #{item.solicitudId}</p>
                      <p className="mt-1 text-sm">
                        {item.usuario
                          ? `${item.usuario.nombre} ${item.usuario.apellidoPaterno}`
                          : "Usuario no disponible"}
                      </p>
                      <p className="break-all text-xs text-slate-500">
                        {item.usuario?.correo ?? "Sin correo disponible"}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Usuario #{item.usuarioId} · {formatearFecha(item.fechaSolicitud)}
                      </p>
                      {item.usuario?.activo === false && (
                        <p className="mt-1 text-xs font-semibold text-slate-700">Acceso inactivo</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold">
                        {item.estado ?? "Sin estado"}
                      </span>
                      <button
                        type="button"
                        disabled={cargandoDetalle || ejecutando || simulando}
                        onClick={() => void consultarDetalle(item.solicitudId)}
                        className="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-xs font-bold text-white disabled:opacity-50"
                      >
                        <FileSearch size={15} aria-hidden="true" /> Ver revisión
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4">
            <button
              type="button"
              disabled={pagina <= 1 || cargando || ejecutando || simulando}
              onClick={() => setPagina((actual) => Math.max(1, actual - 1))}
              className="flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:opacity-40"
            >
              <ChevronLeft size={16} aria-hidden="true" /> Anterior
            </button>
            <p className="text-xs text-slate-600">Página {pagina} de {totalPaginas}</p>
            <button
              type="button"
              disabled={pagina >= totalPaginas || cargando || ejecutando || simulando}
              onClick={() => setPagina((actual) => Math.min(totalPaginas, actual + 1))}
              className="flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:opacity-40"
            >
              Siguiente <ChevronRight size={16} aria-hidden="true" />
            </button>
          </div>
        </section>

        {cargandoDetalle && (
          <p className="flex items-center gap-2 text-sm text-slate-600">
            <Loader2 size={18} className="animate-spin" aria-hidden="true" /> Consultando dependencias...
          </p>
        )}

        {errorDetalle && (
          <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {errorDetalle}
          </p>
        )}

        {detalle && (
          <section aria-labelledby="titulo-detalle-arco" className="rounded-2xl border border-slate-300 bg-white p-5">
            <button
              type="button"
              disabled={simulando || ejecutando}
              onClick={() => {
                setDetalle(null);
                setErrorDetalle("");
                limpiarConfirmacion();
              }}
              className="mb-4 flex items-center gap-2 text-sm font-semibold disabled:opacity-50"
            >
              <ArrowLeft size={16} aria-hidden="true" /> Cerrar detalle
            </button>

            <h2 id="titulo-detalle-arco" className="text-xl font-bold">
              Revisión de solicitud #{detalle.solicitud.solicitudId}
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Usuario #{detalle.solicitud.usuarioId} · Estado: {detalle.solicitud.estado ?? "Sin estado"} ·
              Acceso: {detalle.solicitud.usuario?.activo === false ? "inactivo" : "activo o sin confirmar"}
            </p>
            <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">
              {detalle.solicitud.descripcion}
            </p>

            <h3 className="mt-6 text-base font-bold">Registros relacionados</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { label: "Compras", value: detalle.dependencias.compras },
                { label: "Pagos", value: detalle.dependencias.pagos },
                { label: "Inscripciones", value: detalle.dependencias.inscripciones },
                { label: "Participantes", value: detalle.dependencias.participantes },
                { label: "Registros de Soporte", value: detalle.dependencias.solicitudesSoporte },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-slate-200 p-4">
                  <p className="text-sm text-slate-600">{item.label}</p>
                  <p className="mt-2 text-2xl font-bold">{item.value}</p>
                </div>
              ))}
            </div>

            <p className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
              {detalle.revision.mensaje} Ningún registro académico o financiero será eliminado por esta operación.
            </p>

            <div className="mt-5 space-y-4 rounded-xl border border-slate-200 p-4">
              <h3 className="flex items-center gap-2 text-base font-bold">
                <LockKeyhole size={19} aria-hidden="true" /> Baja lógica del acceso
              </h3>
              <p className="text-sm text-slate-600">
                Primero simula la operación. La desactivación real requiere una habilitación
                expresa en el servidor y confirmación adicional del administrador.
              </p>

              <button
                type="button"
                disabled={simulando || ejecutando || !pendiente || !cuentaActiva}
                onClick={() => void simularBaja()}
                className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {simulando ? "Simulando..." : "Simular baja lógica"}
              </button>

              {!pendiente && (
                <p className="text-sm text-slate-600">Solo pueden procesarse solicitudes pendientes.</p>
              )}
              {detalle.solicitud.usuario?.activo === false && (
                <p className="text-sm text-slate-600">La cuenta ya figura como inactiva.</p>
              )}

              {errorOperacion && (
                <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {errorOperacion}
                </p>
              )}

              {simulacion && (
                <div className="space-y-2 rounded-lg bg-slate-50 p-4 text-sm">
                  <p className="font-bold">{simulacion.message}</p>
                  <p>Solicitud: #{simulacion.solicitudId}</p>
                  <p>Usuario: #{simulacion.usuarioId}</p>
                  <p>Estado: {simulacion.estadoSolicitud}</p>
                  <p>Cuenta activa: {simulacion.cuentaActiva ? "Sí" : "No"}</p>
                  <p>Ejecutada: {simulacion.ejecutada ? "Sí" : "No"}</p>
                  <p>Registros eliminados: {simulacion.registrosEliminados}</p>
                  <p className="font-semibold">Acciones previstas:</p>
                  <ul className="list-disc space-y-1 pl-5">
                    {(simulacion.accionesPrevistas ?? []).map((accion) => (
                      <li key={accion}>{accion}</li>
                    ))}
                  </ul>
                  {simulacion.ejecucionHabilitada !== true ? (
                    <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 font-semibold text-amber-900">
                      La desactivación real está bloqueada por el servidor. No se modificó la cuenta.
                    </p>
                  ) : (
                    <div className="mt-4 space-y-3 border-t border-slate-300 pt-4">
                      <p className="font-bold text-red-800">Confirmación de desactivación real</p>
                      <p className="text-slate-700">
                        Esta acción cerrará la solicitud y quitará el acceso a CMP_Site y CMP_Movil.
                        No borrará información de la base de datos. Comprueba el ID del cliente.
                      </p>
                      <div>
                        <label htmlFor="confirmar-id-arco" className="mb-1 block font-semibold">
                          Escribe el ID del cliente: {detalle.solicitud.usuarioId}
                        </label>
                        <input
                          id="confirmar-id-arco"
                          type="text"
                          inputMode="numeric"
                          autoComplete="off"
                          value={idConfirmado}
                          onChange={(event: ChangeEvent<HTMLInputElement>) => setIdConfirmado(event.target.value)}
                          className="w-full max-w-sm rounded-lg border border-slate-300 p-2"
                        />
                      </div>
                      <div>
                        <label htmlFor="confirmar-frase-arco" className="mb-1 block font-semibold">
                          Escribe exactamente: {CONFIRMACION_REQUERIDA}
                        </label>
                        <input
                          id="confirmar-frase-arco"
                          type="text"
                          autoComplete="off"
                          value={confirmacion}
                          onChange={(event: ChangeEvent<HTMLInputElement>) => setConfirmacion(event.target.value)}
                          className="w-full max-w-sm rounded-lg border border-slate-300 p-2"
                        />
                      </div>
                      <button
                        type="button"
                        disabled={!confirmacionValida || ejecutando || simulando}
                        onClick={() => void ejecutarBaja()}
                        className="rounded-lg bg-red-800 px-4 py-2 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {ejecutando ? "Desactivando acceso..." : "Confirmar desactivación real"}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {resultadoReal && (
                <div role="status" className="space-y-2 rounded-lg border border-slate-300 bg-slate-50 p-4 text-sm">
                  <p className="flex items-center gap-2 font-bold">
                    <CheckCircle2 size={18} aria-hidden="true" /> {resultadoReal.message}
                  </p>
                  <p>Solicitud: #{resultadoReal.solicitudId}</p>
                  <p>Estado: {resultadoReal.estadoSolicitud}</p>
                  <p>Cuenta activa: {resultadoReal.cuentaActiva ? "Sí" : "No"}</p>
                  <p>Sesiones invalidadas: {resultadoReal.sesionesInvalidadas ? "Sí" : "No confirmado"}</p>
                  <p>Registros eliminados: {resultadoReal.registrosEliminados}</p>
                  <p>Datos personales eliminados: No</p>
                  {typeof resultadoReal.auditoriaId === "number" && (
                    <p>Constancia de auditoría: #{resultadoReal.auditoriaId}</p>
                  )}
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
