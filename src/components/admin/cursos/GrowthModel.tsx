'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Area, ComposedChart, Line, ReferenceLine
} from 'recharts';
import { Calculator, TrendingUp, AlertCircle, Target, CalendarDays, Clock, Activity } from 'lucide-react';
import type { Curso, CursoAnalytics } from '@/types/cursos';

interface GrowthModelProps {
  curso: Curso;
  analytics: CursoAnalytics | null;
}

export function GrowthModel({ curso, analytics }: GrowthModelProps) {
  const [predictions, setPredictions] = useState<any[]>([]);
  const [tiempoMedio, setTiempoMedio] = useState<number | null>(null);
  const [tiempoTotal, setTiempoTotal] = useState<number | null>(null);
  const [kValue, setKValue] = useState<number>(0);
  const [diasTranscurridos, setDiasTranscurridos] = useState<number>(1);

  // Fecha de apertura normalizada a medianoche para evitar saltos de día por zona horaria
  const fechaApertura = useMemo(() => {
    const d = new Date(curso.createdAt || new Date());
    d.setHours(0, 0, 0, 0); 
    return d;
  }, [curso.createdAt]);

  // Fecha actual normalizada a medianoche
  const fechaHoy = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const normalizeNumber = (value: number | string | null | undefined, def = 0) => {
    if (value == null) return def;
    if (typeof value === 'number') return value;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? def : parsed;
  };

  const calcularModeloCrecimiento = () => {
    const cupoTotal = normalizeNumber(curso.cupoMaximo, 30);
    const ocupados = normalizeNumber(curso.cuposOcupados, 0);
    const disponiblesHoy = Math.max(0, cupoTotal - ocupados);

    let dias = Math.round(
      (fechaHoy.getTime() - fechaApertura.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (dias <= 0) dias = 1; 
    
    setDiasTranscurridos(dias);

    // k = ln(x(t)/x_0) / t
    let k = 0;
    if (disponiblesHoy < cupoTotal && disponiblesHoy > 0) {
      k = Math.log(disponiblesHoy / cupoTotal) / dias;
    }
    setKValue(k);

    // Fórmulas matemáticas para predicciones
    let diaMitad: number | null = null;
    let diaLleno: number | null = null;

    if (k < 0) {
      diaMitad = Math.ceil(Math.log(0.5) / k); 
      diaLleno = Math.ceil(Math.log(1 / cupoTotal) / k);
    }

    setTiempoMedio(diaMitad);
    setTiempoTotal(diaLleno);

    const diaFinalGrafica = diaLleno !== null ? Math.min(diaLleno + 10, 120) : dias + 30;
    const predicciones = [];

    for (let t = 0; t <= diaFinalGrafica; t++) {
      let disponibles = cupoTotal;
      if (k < 0) {
        disponibles = cupoTotal * Math.exp(k * t); 
      }

      // 🔥 EL AJUSTE DE UX: Forzar el cierre visual en la gráfica
      if (diaLleno !== null && t >= diaLleno) {
        disponibles = 0;
      }

      predicciones.push({
        dia: t,
        ocupados: Math.max(0, Math.min(cupoTotal, Math.round(cupoTotal - disponibles))),
        disponibles: Math.max(0, Math.min(cupoTotal, Math.round(disponibles))),
      });
    }
    setPredictions(predicciones);
  };

  useEffect(() => {
    calcularModeloCrecimiento();
  }, [curso, fechaApertura, fechaHoy]);

  const velocidadClasificacion = () => {
    if (kValue === 0) return { texto: 'Sin datos', color: 'text-gray-500', bg: 'bg-gray-100' };
    if (kValue > -0.01) return { texto: 'Ritmo Lento', color: 'text-rose-600', bg: 'bg-rose-50 border-rose-200' };
    if (kValue > -0.05) return { texto: 'Ritmo Normal', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' };
    return { texto: 'Ritmo Rápido', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' };
  };

  const status = velocidadClasificacion();

  // Tooltip Premium Personalizado
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0f172a]/95 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-slate-700">
          <p className="text-slate-300 text-xs font-semibold mb-2 uppercase tracking-wider">
            {label === diasTranscurridos ? `Día ${label} (HOY)` : `Día ${label}`}
          </p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-3 mt-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-slate-100 font-medium text-sm">{entry.name}:</span>
              <span className="text-white font-bold text-sm ml-auto">{entry.value} cupos</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 mb-8 border border-slate-100">
      {/* Header Premium */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold mb-3 uppercase tracking-widest">
            <Activity size={14} /> Modelo Exponencial
          </div>
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
            Análisis Predictivo
          </h2>
          
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <div className="flex items-center gap-2 text-slate-600 bg-slate-50/80 px-4 py-2 rounded-xl border border-slate-200/60 transition-colors hover:bg-slate-100">
              <CalendarDays size={18} className="text-slate-400" />
              <span className="text-sm font-medium">Apertura:</span>
              <span className="text-sm font-bold text-slate-800">
                {fechaApertura.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-indigo-700 bg-indigo-50/50 px-4 py-2 rounded-xl border border-indigo-100 transition-colors hover:bg-indigo-50">
              <Clock size={18} className="text-indigo-400" />
              <span className="text-sm font-medium">Día actual:</span>
              <span className="text-sm font-black">
                Día {diasTranscurridos}
              </span>
            </div>
          </div>
        </div>

        {/* Badge Dinámico de Estado */}
        <div className={`flex flex-col items-end p-4 rounded-2xl border shadow-sm ${status.bg} transition-all`}>
          <div className={`text-[10px] font-black uppercase tracking-widest ${status.color} opacity-80 mb-1`}>
            Diagnóstico SIMG-CMP
          </div>
          <div className={`text-xl font-black ${status.color}`}>
            {status.texto}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] text-slate-500 font-medium">Tasa de cambio (k)</span>
            <span className="text-xs font-mono font-bold text-slate-700 bg-white/60 px-2 py-0.5 rounded-md">
              {kValue.toFixed(4)}
            </span>
          </div>
        </div>
      </div>

      {/* Gráfica */}
      {predictions.length > 0 ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="h-[420px] mb-10 p-4 bg-slate-50/50 rounded-3xl border border-slate-100/50">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={predictions} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                {/* Definición del Gradiente */}
                <defs>
                  <linearGradient id="colorOcupados" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0A3D62" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0A3D62" stopOpacity={0}/>
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e2e8f0" />
                
                <XAxis 
                  dataKey="dia" 
                  tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }}
                  axisLine={{ stroke: '#cbd5e1', strokeWidth: 2 }}
                  tickLine={false}
                  dy={10}
                />
                <YAxis 
                  domain={[0, normalizeNumber(curso.cupoMaximo, 30)]}
                  tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                  dx={-10}
                />
                
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 2, strokeDasharray: '4 4' }} />
                
                <Legend 
                  verticalAlign="top" 
                  height={50}
                  iconType="circle"
                  wrapperStyle={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}
                />

                <Area 
                  type="monotone" 
                  dataKey="ocupados" 
                  fill="url(#colorOcupados)" 
                  stroke="none" 
                  legendType="none" 
                />
                
                <Line 
                  type="monotone" 
                  dataKey="ocupados" 
                  stroke="#0A3D62" 
                  strokeWidth={4} 
                  dot={false} 
                  activeDot={{ r: 7, fill: '#0A3D62', stroke: '#fff', strokeWidth: 3 }}
                  name="Cupos Ocupados" 
                />
                
                <Line 
                  type="monotone" 
                  dataKey="disponibles" 
                  stroke="#f43f5e" 
                  strokeWidth={3} 
                  strokeDasharray="8 6" 
                  dot={false} 
                  activeDot={{ r: 5, fill: '#f43f5e', stroke: '#fff', strokeWidth: 2 }}
                  name="Disponibilidad Estimada" 
                />
                
                <ReferenceLine 
                  x={diasTranscurridos} 
                  stroke="#6366f1" 
                  strokeWidth={2}
                  strokeDasharray="4 4"
                >
                  <text x={diasTranscurridos} y={20} fill="#6366f1" fontSize={12} fontWeight="bold" textAnchor="middle" dy={-10}>
                    DÍA ACTUAL
                  </text>
                </ReferenceLine>
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Tarjetas de Métricas - Diseño "Glass" */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-blue-50/80 to-blue-100/40 border border-blue-200/60 hover:shadow-lg transition-all duration-300">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-blue-600 rounded-xl text-white shadow-md shadow-blue-600/20">
                  <Target size={20} />
                </div>
                <span className="text-sm font-black text-blue-900 uppercase tracking-tight">50% Capacidad</span>
              </div>
              <div className="text-4xl font-black text-blue-700 tracking-tighter">
                {tiempoMedio ? `Día ${tiempoMedio}` : '--'}
              </div>
              <p className="text-xs font-medium text-blue-600/80 mt-3">Momento de quiebre estadístico</p>
            </div>

            <div className="group relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-emerald-100/40 border border-emerald-200/60 hover:shadow-lg transition-all duration-300">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-emerald-500 rounded-xl text-white shadow-md shadow-emerald-500/20">
                  <TrendingUp size={20} />
                </div>
                <span className="text-sm font-black text-emerald-900 uppercase tracking-tight">Estado Lleno</span>
              </div>
              <div className="text-4xl font-black text-emerald-700 tracking-tighter">
                {tiempoTotal ? `Día ${tiempoTotal}` : '--'}
              </div>
              <p className="text-xs font-medium text-emerald-600/80 mt-3">Proyección de saturación total</p>
            </div>

            <div className="group relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200 hover:shadow-lg transition-all duration-300">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-slate-400/10 rounded-full blur-2xl transition-all"></div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-slate-700 rounded-xl text-white shadow-md shadow-slate-700/20">
                  <AlertCircle size={20} />
                </div>
                <span className="text-sm font-black text-slate-900 uppercase tracking-tight">Acción Sugerida</span>
              </div>
              <div className="text-lg font-black text-slate-800 leading-tight">
                {kValue > -0.01 ? 'Activar campaña de difusión' : 'Mantener monitoreo pasivo'}
              </div>
              <p className="text-xs font-medium text-slate-500 mt-3">Estrategia recomendada</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
          <Activity size={48} className="text-slate-300 mb-4" />
          <p className="text-slate-500 font-bold text-lg">Datos insuficientes para la proyección</p>
          <p className="text-slate-400 text-sm mt-1">El modelo iniciará al detectar inscripciones</p>
        </div>
      )}
    </div>
  );
}