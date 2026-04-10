// src/components/admin/cursos/GrowthModel.tsx
'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, ComposedChart, Bar } from 'recharts';
import { Calculator, TrendingUp, AlertCircle, Target } from 'lucide-react'; // Añadí Target aquí
import type { Curso, CursoAnalytics } from '@/types/cursos';

interface GrowthModelProps {
  curso: Curso;
  analytics: CursoAnalytics | null;
}

export function GrowthModel({ curso, analytics }: GrowthModelProps) {
  const [predictions, setPredictions] = useState<any[]>([]);
  const [tiempoMedio, setTiempoMedio] = useState<number | null>(null);
  const [tiempoTotal, setTiempoTotal] = useState<number | null>(null);

  // Función para normalizar números
  const normalizeNumber = (value: number | string | null | undefined, defaultValue: number = 0): number => {
    if (value === null || value === undefined) return defaultValue;
    if (typeof value === 'number') return value;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
  };

  // Función para calcular el modelo exponencial dx/dt = kx
  const calcularModeloCrecimiento = () => {
    if (!analytics?.inscripcionesHistoricas || analytics.inscripcionesHistoricas.length < 2) {
      return;
    }

    const datos = analytics.inscripcionesHistoricas;
    const cupoTotal = normalizeNumber(curso.cupoMaximo, 1);
    const ocupadosActuales = normalizeNumber(curso.cuposOcupados, 0);
    const restantes = cupoTotal - ocupadosActuales;

    if (restantes <= 0) {
      setPredictions([]);
      setTiempoMedio(null);
      setTiempoTotal(null);
      return;
    }

    // Calcular k (tasa de crecimiento) usando los últimos datos
    const k = calcularTasaCrecimiento(datos);
    
    // Generar predicciones para los próximos días
    const predicciones = [];
    let ocupados = ocupadosActuales;
    let dia = 0;
    
    while (ocupados < cupoTotal && dia < 365) {
      dia++;
      // dx/dt = k * x → x(t) = x0 * e^(k*t)
      const crecimiento = k * ocupados;
      ocupados = Math.min(ocupados + crecimiento, cupoTotal);
      
      predicciones.push({
        dia,
        ocupados: Math.round(ocupados),
        disponibles: cupoTotal - Math.round(ocupados)
      });
      
      if (ocupados >= cupoTotal) break;
    }
    
    setPredictions(predicciones);
    
    // Calcular tiempo para llegar a la mitad
    const mitad = cupoTotal / 2;
    const diaMitad = predicciones.find(p => p.ocupados >= mitad)?.dia ?? null;
    setTiempoMedio(diaMitad);
    
    // Calcular tiempo total para llenarse
    setTiempoTotal(predicciones.length);
  };

  const calcularTasaCrecimiento = (datos: any[]) => {
    if (datos.length < 2) return 0.05; // Valor por defecto
    
    // Calcular crecimiento promedio
    const ultimos = datos.slice(-7); // Últimos 7 días
    let totalCrecimiento = 0;
    
    for (let i = 1; i < ultimos.length; i++) {
      const crecimiento = ultimos[i].ocupados - ultimos[i-1].ocupados;
      totalCrecimiento += crecimiento;
    }
    
    const crecimientoPromedio = totalCrecimiento / (ultimos.length - 1);
    const ocupadosActuales = datos[datos.length - 1]?.ocupados || 1;
    
    // k = crecimiento / ocupados actuales
    const k = crecimientoPromedio / ocupadosActuales;
    
    // Limitar k para evitar predicciones demasiado extremas
    return Math.min(Math.max(k, 0.01), 0.5);
  };

  useEffect(() => {
    calcularModeloCrecimiento();
  }, [analytics, curso]);

  const velocidadClasificacion = () => {
    if (!analytics?.velocidadInscripcion) return { texto: 'Sin datos', color: 'text-gray-600' };
    const vel = analytics.velocidadInscripcion;
    if (vel < 2) return { texto: 'Lento', color: 'text-red-600' };
    if (vel < 5) return { texto: 'Normal', color: 'text-yellow-600' };
    return { texto: 'Rápido', color: 'text-green-600' };
  };

  const ocupacionActual = ((normalizeNumber(curso.cuposOcupados, 0)) / (normalizeNumber(curso.cupoMaximo, 1))) * 100;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#0A3D62] flex items-center gap-2">
            <Calculator size={24} className="text-[#FFC300]" />
            Modelo de Crecimiento (dx/dt = kx)
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Predicción de ocupación basada en la ley exponencial de crecimiento
          </p>
        </div>
        <div className="text-right">
          <div className={`text-sm font-medium ${velocidadClasificacion().color}`}>
            Ritmo: {velocidadClasificacion().texto}
          </div>
          {tiempoMedio && (
            <div className="text-xs text-gray-500">
              Mitad en ~{tiempoMedio} días
            </div>
          )}
        </div>
      </div>

      {/* Gráfica de predicción */}
      {predictions.length > 0 ? (
        <>
          <div className="h-[420px] mb-8">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart 
                data={predictions}
                margin={{ top: 20, right: 30, left: 30, bottom: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis 
                  dataKey="dia"
                  tick={{ fontSize: 12 }}
                  tickMargin={10}
                  label={{ 
                    value: 'Días desde hoy', 
                    position: 'insideBottom', 
                    offset: -20 
                  }}
                />

                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickMargin={10}
                  label={{ 
                    value: 'Lugares ocupados', 
                    angle: -90, 
                    position: 'insideLeft',
                    offset: -10
                  }}
                />

                <Tooltip 
                  contentStyle={{ borderRadius: '10px', border: 'none' }}
                />

                <Legend 
                  verticalAlign="top"
                  height={36}
                  wrapperStyle={{ paddingBottom: '10px' }}
                />

                <Area 
                  type="monotone" 
                  dataKey="ocupados" 
                  fill="#FFC300" 
                  stroke="#0A3D62" 
                  fillOpacity={0.3} 
                  name="Ocupados"
                />

                <Line 
                  type="monotone" 
                  dataKey="disponibles" 
                  stroke="#ef4444" 
                  strokeDasharray="5 5"
                  name="Disponibles"
                />

                <Bar 
                  dataKey="ocupados" 
                  fill="#0A3D62" 
                  opacity={0.1}
                  name="Barras ocupados"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Predicciones clave */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target size={18} className="text-blue-600" />
                <span className="font-semibold text-blue-900">Tiempo estimado de llenado</span>
              </div>
              <p className="text-2xl font-bold text-blue-700">
                {tiempoTotal ? `${tiempoTotal} días` : 'Calculando...'}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Basado en el ritmo actual de inscripciones
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={18} className="text-green-600" />
                <span className="font-semibold text-green-900">Tasa de crecimiento (k)</span>
              </div>
              <p className="text-2xl font-bold text-green-700">
                {analytics?.tasaCrecimiento?.toFixed(3) ?? '0.000'}
              </p>
              <p className="text-xs text-green-600 mt-1">
                k = crecimiento / ocupados actuales
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle size={18} className="text-purple-600" />
                <span className="font-semibold text-purple-900">Predicción</span>
              </div>
              <p className="text-sm text-purple-700">
                {tiempoTotal && tiempoTotal > 30 
                  ? '⚠️ Ritmo lento - Se recomienda promocionar' 
                  : tiempoTotal && tiempoTotal < 7 
                    ? '🎯 Ritmo excelente - Casi lleno' 
                    : '📈 Ritmo normal - Sigue así'}
              </p>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No hay suficientes datos para generar predicciones</p>
          <p className="text-sm text-gray-400 mt-2">Se necesitan al menos 2 registros de inscripciones</p>
        </div>
      )}
    </div>
  );
}