// src/components/admin/cursos/MarketingActions.tsx
'use client';

import { useState } from 'react';
import { Mail, Send, CheckCircle } from 'lucide-react';
import type { Curso, CursoAnalytics } from '@/types/cursos';

interface MarketingActionsProps {
  curso: Curso;
  analytics: CursoAnalytics | null;
}

export function MarketingActions({ curso }: MarketingActionsProps) {
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [mensaje, setMensaje] = useState<string | null>(null);

  // 📊 Datos del curso
  const cuposOcupados = Number(curso.cuposOcupados) || 0;
  const cupoMaximo = Number(curso.cupoMaximo) || 1;

  const disponibles = cupoMaximo - cuposOcupados;
  const ocupacion = (cuposOcupados / cupoMaximo) * 100;

  // 🚀 Acción: enviar campaña de nuevo curso
  const enviarNuevoCurso = async () => {
    setSending(true);
    setStatus('idle');
    setMensaje(null);

    try {
      const response = await fetch('/api/cursos/nuevo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cursoId: curso.idCurso
        })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Error al enviar');

      setStatus('success');
      setMensaje('📧 Campaña enviada correctamente');

      setTimeout(() => {
        setStatus('idle');
        setMensaje(null);
      }, 3000);

    } catch (error: any) {
      setStatus('error');
      setMensaje(error.message || 'Error al enviar correos');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-[#0A3D62] flex items-center gap-2">
            <Mail size={20} />
            Marketing del Curso
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Envía campañas para aumentar inscripciones
          </p>
        </div>

        {status === 'success' && (
          <CheckCircle className="text-green-500" />
        )}
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500">Capacidad</p>
          <p className="font-bold text-[#0A3D62]">{cupoMaximo}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500">Ocupados</p>
          <p className="font-bold text-[#0A3D62]">{cuposOcupados}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500">Disponibles</p>
          <p className="font-bold text-[#FFC300]">{disponibles}</p>
        </div>
      </div>

      {/* PROGRESS */}
      <div className="mb-6">
        <div className="flex justify-between text-xs mb-1 text-gray-500">
          <span>Ocupación</span>
          <span>{ocupacion.toFixed(0)}%</span>
        </div>

        <div className="w-full bg-gray-200 h-2 rounded-full">
          <div
            className="h-2 rounded-full bg-[#0A3D62] transition-all"
            style={{ width: `${ocupacion}%` }}
          />
        </div>
      </div>

      {/* MENSAJE */}
      {mensaje && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm font-medium border ${
            status === 'success'
              ? 'bg-green-100 text-green-800 border-green-300'
              : 'bg-red-100 text-red-800 border-red-300'
          }`}
        >
          {mensaje}
        </div>
      )}

      {/* BOTÓN */}
      <button
        onClick={enviarNuevoCurso}
        disabled={sending}
        className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {sending ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Enviando campaña...</span>
          </>
        ) : (
          <>
            <Send size={16} />
            <span>Anunciar curso</span>
          </>
        )}
      </button>

      {/* FOOTER */}
      <p className="text-xs text-gray-400 text-center mt-3">
        Se enviará a todos los usuarios activos registrados
      </p>
    </div>
  );
}