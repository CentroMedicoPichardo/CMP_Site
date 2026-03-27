// src/components/admin/monitoreo/rendimiento/PerformanceTrends.tsx
"use client";

import { useState, useEffect } from 'react';
import { TrendingUp, Loader2 } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface TrendData {
  hora: string;
  tiempo_promedio: number;
  total_consultas: number;
  consultas_lentas: number;
}

export function PerformanceTrends() {
  const [data, setData] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const res = await fetch('/api/monitoreo/rendimiento/performance-trends');
        const trends = await res.json();
        setData(trends);
      } catch (error) {
        console.error('Error cargando tendencias:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrends();
  }, []);

  const formatHora = (hora: string) => {
    return new Date(hora).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={20} className="text-[#FFC300]" />
          <h3 className="text-lg font-bold text-[#0A3D62]">Tendencias de Rendimiento</h3>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin" size={32} color="#0A3D62" />
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={20} className="text-[#FFC300]" />
          <h3 className="text-lg font-bold text-[#0A3D62]">Tendencias de Rendimiento</h3>
        </div>
        <div className="text-center py-8">
          <TrendingUp size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No hay datos de tendencias disponibles</p>
          <p className="text-xs text-gray-400 mt-1">Esperando datos de monitoreo</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp size={20} className="text-[#FFC300]" />
          <h3 className="text-lg font-bold text-[#0A3D62]">Tendencias de Rendimiento</h3>
        </div>
        <span className="text-xs text-gray-500">Últimas 24 horas</span>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="hora" 
            tickFormatter={formatHora}
            stroke="#9CA3AF"
            fontSize={12}
          />
          <YAxis 
            yAxisId="left"
            stroke="#9CA3AF"
            fontSize={12}
            label={{ value: 'Tiempo (ms)', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            stroke="#9CA3AF"
            fontSize={12}
            label={{ value: 'Consultas', angle: 90, position: 'insideRight', style: { fontSize: 12 } }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
            }}
            labelFormatter={(label) => formatHora(label)}
          />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="tiempo_promedio"
            name="Tiempo Promedio (ms)"
            stroke="#FFC300"
            strokeWidth={2}
            dot={false}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="total_consultas"
            name="Total Consultas"
            stroke="#0A3D62"
            strokeWidth={2}
            dot={false}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="consultas_lentas"
            name="Consultas Lentas"
            stroke="#EF4444"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
      
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-500 text-center">
          Pico máximo de consultas: {Math.max(...data.map(d => d.total_consultas))} consultas/hora
        </p>
      </div>
    </div>
  );
}