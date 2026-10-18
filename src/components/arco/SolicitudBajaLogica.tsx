"use client";

import { useState, type FormEvent } from "react";

type Respuesta = {
  message?: string;
  solicitudId?: number;
  estado?: string;
  eliminacionCompletada?: boolean;
};

export default function SolicitudBajaLogica() {
  const [contrasena, setContrasena] = useState("");
  const [confirmada, setConfirmada] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [respuesta, setRespuesta] = useState<Respuesta | null>(null);

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setError("");
    setRespuesta(null);
    if (!confirmada || !contrasena) return;
    setCargando(true);
    try {
      const res = await fetch("/api/account/web-request", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contrasena, confirmacion: true }),
      });
      const data = (await res.json()) as Respuesta;
      if (!res.ok) throw new Error(data.message ?? "No se pudo registrar la solicitud.");
      setRespuesta(data);
      setContrasena("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <form onSubmit={enviar} className="mt-6 space-y-5 rounded-xl border bg-white p-6 shadow-sm">
      <div>
        <label htmlFor="clave-baja" className="block text-sm font-semibold text-gray-900">
          Confirma tu contraseña actual
        </label>
        <input
          id="clave-baja"
          name="contrasena"
          type="password"
          autoComplete="current-password"
          required
          minLength={1}
          maxLength={1024}
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          className="mt-2 w-full rounded-lg border px-3 py-2 text-gray-900"
        />
      </div>
      <label className="flex items-start gap-3 text-sm text-gray-800">
        <input
          type="checkbox"
          checked={confirmada}
          onChange={(e) => setConfirmada(e.target.checked)}
          className="mt-1"
        />
        <span>
          Entiendo que solicito la desactivación de mi acceso, no el borrado de
          mis compras, pagos, inscripciones ni de otros datos conservados.
        </span>
      </label>
      <button
        type="submit"
        disabled={cargando || !confirmada || !contrasena}
        className="rounded-lg bg-gray-900 px-5 py-2 font-medium text-white disabled:opacity-50"
      >
        {cargando ? "Enviando..." : "Solicitar baja lógica"}
      </button>
      {error && <p role="alert" className="text-sm font-semibold text-red-700">{error}</p>}
      {respuesta && (
        <div role="status" className="rounded-lg border bg-gray-50 p-4 text-sm text-gray-900">
          <p>{respuesta.message}</p>
          {respuesta.solicitudId !== undefined && <p>Folio: {respuesta.solicitudId}</p>}
          {respuesta.estado && <p>Estado: {respuesta.estado}</p>}
          <p>Tu cuenta permanece activa hasta que un administrador procese la solicitud.</p>
        </div>
      )}
    </form>
  );
}
