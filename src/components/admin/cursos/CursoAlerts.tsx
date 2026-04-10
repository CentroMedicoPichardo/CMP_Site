'use client';

import { useState } from 'react';
import { AlertTriangle, Bell, TrendingDown, CheckCircle } from 'lucide-react';
import type { Curso, CursoAnalytics } from '@/types/cursos';


type AlertType = 'danger' | 'warning' | 'success';

interface AlertItem {
  type: AlertType;
  title: string;
  message: string;
  action: string;
  actionType: 'PROMOCION' | 'URGENTE';
}

interface Props {
  curso: Curso;
  analytics: CursoAnalytics | null;
}

export function CursoAlerts({ curso, analytics }: Props) {
  const [loading, setLoading] = useState<number | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);

  const alerts: AlertItem[] = [];

  const cuposOcupados = Number(curso.cuposOcupados) || 0;
  const cupoMaximo = Number(curso.cupoMaximo) || 1;
  const ocupacion = (cuposOcupados / cupoMaximo) * 100;

  // 🚨 ALERTAS
  if (analytics?.velocidadInscripcion && analytics.velocidadInscripcion < 2) {
    alerts.push({
      type: 'danger',
      title: 'Curso con baja demanda',
      message: `Solo ${analytics.velocidadInscripcion.toFixed(1)} inscripciones/día.`,
      action: 'Enviar promoción',
      actionType: 'PROMOCION'
    });
  }

  if (ocupacion >= 80) {
    alerts.push({
      type: 'warning',
      title: '¡Curso casi lleno!',
      message: `Quedan ${cupoMaximo - cuposOcupados} lugares.`,
      action: 'Activar urgencia',
      actionType: 'URGENTE'
    });
  }

  if (alerts.length === 0) return null;

  const handleAction = async (type: string, index: number) => {
    setLoading(index);
    setMensaje(null);

    try {
      if (type === 'PROMOCION') {
        const res = await fetch('/api/cursos/promocionar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cursoId: curso.idCurso
          })
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error);

        setMensaje('✅ Correos enviados correctamente');
      }

      if (type === 'URGENTE') {
        setMensaje('⚡ Estrategia de urgencia activada');
      }

    } catch (error: any) {
      setMensaje('❌ ' + error.message);
    } finally {
      setLoading(null);

      // 🔥 auto-hide mensaje
      setTimeout(() => setMensaje(null), 4000);
    }
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-[#0A3D62] mb-4 flex items-center gap-2">
        <Bell size={20} />
        Alertas del Curso
      </h3>

      {mensaje && (
        <div className="mb-4 p-4 rounded-lg text-sm font-medium shadow-sm border
          bg-blue-100 text-blue-900 border-blue-300">
          {mensaje}
        </div>
      )}

      <div className="space-y-4">
        {alerts.map((alert, idx) => {
          const styles: Record<AlertType, string> = {
            danger: 'bg-red-100 border-red-500 text-red-900',
            warning: 'bg-yellow-100 border-yellow-500 text-yellow-900',
            success: 'bg-green-100 border-green-500 text-green-900'
          };

          return (
            <div
              key={idx}
              className={`rounded-xl p-5 border-l-4 shadow-sm ${styles[alert.type]}`}
            >
              <div className="flex items-center justify-between gap-4">
                
                <div className="flex items-start gap-3">
                  {alert.type === 'danger' && <AlertTriangle className="text-red-700" size={22} />}
                  {alert.type === 'warning' && <TrendingDown className="text-yellow-700" size={22} />}
                  {alert.type === 'success' && <CheckCircle className="text-green-700" size={22} />}

                  <div>
                    <h4 className="font-bold text-base">
                      {alert.title}
                    </h4>
                    <p className="text-sm opacity-80 mt-1">
                      {alert.message}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleAction(alert.actionType, idx)}
                  disabled={loading === idx}
                  className="px-5 py-2 rounded-lg text-sm font-semibold
                  bg-[#0A3D62] text-white hover:bg-[#1A4F7A]
                  disabled:opacity-50 transition-all"
                >
                  {loading === idx ? 'Enviando...' : alert.action}
                </button>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}