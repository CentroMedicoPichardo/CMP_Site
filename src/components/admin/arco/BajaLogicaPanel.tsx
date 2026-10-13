"use client";

import { useState, type FormEvent } from "react";

type Estado = {
  solicitudId: number;
  usuarioId: number;
  estadoSolicitud: string | null;
  cuentaActiva: boolean;
  esCliente: boolean;
  modalidadConfirmada: boolean;
  ejecucionHabilitada: boolean;
  ejecutada: boolean;
  registrosEliminados: number;
  message?: string;
  modo?: string;
  accionesPrevistas?: string[];
};

export default function BajaLogicaPanel() {
  const [folio, setFolio] = useState("");
  const [actual, setActual] = useState<Estado | null>(null);
  const [confirmar, setConfirmar] = useState(false);
  const [texto, setTexto] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [resultado, setResultado] = useState("");

  function idValido(): number | null {
    const n = Number(folio);
    return /^\d+$/.test(folio) && Number.isSafeInteger(n) && n > 0 ? n : null;
  }

  async function consultar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(""); setResultado(""); setActual(null);
    setConfirmar(false); setTexto("");
    const id = idValido();
    if (!id) { setError("Introduce un folio numérico válido."); return; }
    setCargando(true);
    try {
      const res = await fetch(`/api/admin/arco/cancelaciones/${id}/desactivar`, {
        credentials: "same-origin", cache: "no-store",
      });
      const data = await res.json() as Estado & { message?: string };
      if (!res.ok) throw new Error(data.message ?? "No se pudo consultar.");
      setActual(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error de consulta.");
    } finally { setCargando(false); }
  }

  async function actuar(modo: "simular" | "ejecutar") {
    const id = idValido();
    if (!id || !actual || actual.solicitudId !== id) return;
    if (modo === "ejecutar" && (!confirmar || texto !== "DESACTIVAR")) return;
    setError(""); setResultado(""); setCargando(true);
    try {
      const res = await fetch(`/api/admin/arco/cancelaciones/${id}/desactivar`, {
        method: "POST", credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modo,
          solicitudId: id,
          ...(modo === "ejecutar" ? { confirmacion: "DESACTIVAR" } : {}),
        }),
      });
      const data = await res.json() as Estado & { message?: string };
      if (!res.ok) throw new Error(data.message ?? "No se pudo procesar.");
      setActual(data);
      setResultado(data.message ?? "Operación completada.");
      if (modo === "ejecutar") { setConfirmar(false); setTexto(""); }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error de operación.");
    } finally { setCargando(false); }
  }

  const puedeEjecutar = Boolean(
    actual && actual.ejecucionHabilitada && actual.cuentaActiva &&
    actual.esCliente && actual.modalidadConfirmada && actual.estadoSolicitud === "pendiente"
  );

  return (
    <div className="mx-auto max-w-3xl space-y-5 rounded-xl border bg-white p-6 text-gray-900 shadow-sm">
      <h1 className="text-2xl font-bold">Baja lógica de cuentas</h1>
      <p className="text-sm leading-6">
        Este procedimiento desactiva el inicio de sesión y revoca los tokens.
        No elimina usuarios, compras, pagos, inscripciones ni participantes.
      </p>
      <form onSubmit={consultar} className="flex flex-wrap items-end gap-3">
        <label className="flex-1 text-sm font-medium" htmlFor="folio-baja">
          Número de solicitud ARCO
          <input
            id="folio-baja" type="text" inputMode="numeric" value={folio}
            onChange={(e) => { setFolio(e.target.value); setActual(null); setResultado(""); }}
            placeholder="Ejemplo: 9" required
            className="mt-2 block w-full rounded-lg border px-3 py-2"
          />
        </label>
        <button disabled={cargando} className="rounded-lg bg-gray-900 px-5 py-2 text-white disabled:opacity-50">
          Consultar
        </button>
      </form>
      {actual && (
        <div className="space-y-3 rounded-lg border p-4 text-sm">
          <h2 className="text-lg font-semibold">Solicitud #{actual.solicitudId}</h2>
          <p>ID del usuario: {actual.usuarioId}</p>
          <p>Estado de la solicitud: <strong>{actual.estadoSolicitud}</strong></p>
          <p>Cuenta: <strong>{actual.cuentaActiva ? "Activa" : "Desactivada"}</strong></p>
          <p>Rol válido para baja lógica: <strong>{actual.esCliente ? "Sí" : "No"}</strong></p>
          <p>Consentimiento expreso de baja lógica: <strong>{actual.modalidadConfirmada ? "Confirmado" : "Pendiente"}</strong></p>
          {!actual.modalidadConfirmada && (
            <p className="rounded-lg border p-3">El cliente debe iniciar sesión en /eliminar-cuenta y confirmar que solicita una baja lógica, no la eliminación de datos, antes de que un administrador pueda ejecutarla.</p>
          )}
          <p>Ejecución en servidor: <strong>{actual.ejecucionHabilitada ? "Habilitada" : "Deshabilitada"}</strong></p>
          <button
            type="button" disabled={cargando}
            onClick={() => void actuar("simular")}
            className="rounded-lg border border-gray-900 px-4 py-2 font-medium disabled:opacity-50"
          >
            Simular sin cambios
          </button>
          {actual.accionesPrevistas && (
            <ul className="list-disc space-y-1 pl-5">
              {actual.accionesPrevistas.map((a) => <li key={a}>{a}</li>)}
            </ul>
          )}
          <div className="mt-4 border-t pt-4">
            <h3 className="font-semibold">Confirmación de desactivación</h3>
            {!actual.ejecucionHabilitada && (
              <p className="mt-2">La ejecución está bloqueada por configuración. Esto es lo esperado en producción mientras se revisa la implementación.</p>
            )}
            <label className="mt-3 flex items-start gap-2">
              <input type="checkbox" checked={confirmar}
                onChange={(e) => setConfirmar(e.target.checked)} disabled={!puedeEjecutar} />
              <span>Confirmo la baja lógica de la cuenta indicada. Sé que perderá el acceso.</span>
            </label>
            <label className="mt-3 block font-medium" htmlFor="confirmar-desactivar">
              Escribe DESACTIVAR para continuar
              <input id="confirmar-desactivar" value={texto}
                onChange={(e) => setTexto(e.target.value)} disabled={!puedeEjecutar}
                className="mt-2 block w-full rounded-lg border px-3 py-2" />
            </label>
            <button
              type="button" onClick={() => void actuar("ejecutar")}
              disabled={!puedeEjecutar || !confirmar || texto !== "DESACTIVAR" || cargando}
              className="mt-4 rounded-lg bg-red-900 px-5 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Desactivar acceso de la cuenta
            </button>
          </div>
        </div>
      )}
      {error && <p role="alert" className="rounded-lg border border-red-700 p-3 text-sm text-red-800">{error}</p>}
      {resultado && <p role="status" className="rounded-lg border p-3 text-sm">{resultado}</p>}
    </div>
  );
}
