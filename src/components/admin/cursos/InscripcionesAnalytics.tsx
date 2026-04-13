// src/components/admin/cursos/InscripcionesAnalytics.tsx
'use client';

import { useState, useMemo } from 'react';
import { 
  Calendar, 
  Download, 
  TrendingUp, 
  Users,
  Clock,
  BarChart3,
  LineChart,
  Activity
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  ComposedChart
} from 'recharts';
import type { Curso, CursoAnalytics } from '@/types/cursos';

interface InscripcionesAnalyticsProps {
  curso: Curso;
  analytics: CursoAnalytics | null;
}

type PeriodoVista = 'hoy' | 'semana' | 'todas';

export function InscripcionesAnalytics({ curso, analytics }: InscripcionesAnalyticsProps) {
  const [periodo, setPeriodo] = useState<PeriodoVista>('todas');
  const [mostrarTabla, setMostrarTabla] = useState(false);

  const historialData = analytics?.inscripcionesHistoricas || [];
  
  // Transformar datos
  const transformarDatos = () => {
    if (!historialData.length) return [];
    
    return historialData.map((item: any, index: number) => {
      const inscripcionesDia = index === 0 
        ? item.ocupados 
        : item.ocupados - (historialData[index - 1]?.ocupados || 0);
      
      return {
        fecha: item.fecha,
        inscripciones: Math.max(0, inscripcionesDia),
        acumuladas: item.ocupados
      };
    });
  };

  const data = transformarDatos();

  // Calcular semanas activas del curso
  const semanasActivas = useMemo(() => {
    const semanas = Math.ceil(data.length / 7);
    return Math.min(semanas, 4);
  }, [data.length]);

  // Filtrar datos por período
  const getDatosFiltrados = () => {
    if (periodo === 'todas') return data;
    if (periodo === 'hoy') {
      const hoy = new Date().toISOString().split('T')[0];
      return data.filter(d => d.fecha === hoy);
    }
    if (periodo === 'semana') {
      return data.slice(-7);
    }
    return data;
  };

  // Datos agrupados por semana (solo semanas que existen)
  const getDatosPorSemana = () => {
    const semanas: { semana: number; inscripciones: number; acumuladas: number }[] = [];
    const semanasReales = Math.ceil(data.length / 7);
    
    for (let i = 0; i < semanasReales; i++) {
      const semanaData = data.slice(i * 7, (i + 1) * 7);
      const totalSemana = semanaData.reduce((sum, d) => sum + d.inscripciones, 0);
      semanas.push({
        semana: i + 1,
        inscripciones: totalSemana,
        acumuladas: semanaData[semanaData.length - 1]?.acumuladas || 0
      });
    }
    
    return semanas;
  };

  const datosFiltrados = getDatosFiltrados();
  const datosPorSemana = getDatosPorSemana();
  
  const totalInscripciones = datosFiltrados.reduce((sum, d) => sum + d.inscripciones, 0);
  const promedioDiario = datosFiltrados.length > 0 ? (totalInscripciones / datosFiltrados.length).toFixed(1) : '0';
  const maxInscripcionesDia = datosFiltrados.length > 0 ? Math.max(...datosFiltrados.map(d => d.inscripciones)) : 0;
  
  const mejorDia = datosFiltrados.length > 0 ? datosFiltrados.reduce((best, d) => 
    d.inscripciones > best.inscripciones ? d : best, datosFiltrados[0]) : { inscripciones: 0, fecha: '' };

  const exportarDatos = () => {
    const csvContent = [
      ['Fecha', 'Inscripciones del dia', 'Inscripciones acumuladas'],
      ...datosFiltrados.map(d => [d.fecha, d.inscripciones, d.acumuladas])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inscripciones_curso_${curso.idCurso}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const cuposOcupados = typeof curso.cuposOcupados === 'number' 
    ? curso.cuposOcupados 
    : Number(curso.cuposOcupados) || 0;
  const cupoMaximo = typeof curso.cupoMaximo === 'number' 
    ? curso.cupoMaximo 
    : Number(curso.cupoMaximo) || 1;

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Users size={48} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No hay inscripciones registradas aun</p>
          <p className="text-sm text-gray-400 mt-1">
            Inscripciones actuales: {cuposOcupados} de {cupoMaximo}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#0A3D62] flex items-center gap-2">
            <BarChart3 size={24} className="text-[#FFC300]" />
            Evolucion de Inscripciones
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Desde {data[0]?.fecha} hasta {data[data.length - 1]?.fecha}
          </p>
        </div>
        
        {data.length > 0 && (
          <button
            onClick={exportarDatos}
            className="px-3 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors flex items-center gap-2"
          >
            <Download size={16} />
            Exportar CSV
          </button>
        )}
      </div>

      {/* Metricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <Users size={20} className="text-blue-600 mx-auto mb-1" />
          <p className="text-2xl font-bold text-blue-700">{totalInscripciones}</p>
          <p className="text-xs text-blue-600">Total inscripciones</p>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <Clock size={20} className="text-purple-600 mx-auto mb-1" />
          <p className="text-2xl font-bold text-purple-700">{promedioDiario}</p>
          <p className="text-xs text-purple-600">Promedio por dia</p>
        </div>
        
        <div className="bg-orange-50 rounded-lg p-4 text-center">
          <TrendingUp size={20} className="text-orange-600 mx-auto mb-1" />
          <p className="text-2xl font-bold text-orange-700">{maxInscripcionesDia}</p>
          <p className="text-xs text-orange-600">Record en un dia</p>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <Calendar size={20} className="text-green-600 mx-auto mb-1" />
          <p className="text-sm font-bold text-green-700">
            {mejorDia?.fecha?.split('-').reverse().join('/') || '-'}
          </p>
          <p className="text-xs text-green-600">Mejor dia</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setPeriodo('hoy')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            periodo === 'hoy' ? 'bg-[#FFC300] text-[#0A3D62]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Activity size={14} className="inline mr-1" />
          Hoy
        </button>
        <button
          onClick={() => setPeriodo('semana')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            periodo === 'semana' ? 'bg-[#FFC300] text-[#0A3D62]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Calendar size={14} className="inline mr-1" />
          Ultima semana
        </button>
        <button
          onClick={() => setPeriodo('todas')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            periodo === 'todas' ? 'bg-[#FFC300] text-[#0A3D62]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <LineChart size={14} className="inline mr-1" />
          Evolucion completa
        </button>
      </div>

      {/* Grafica o Tabla */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-800">
            {periodo === 'hoy' ? 'Inscripciones de hoy' : 
             periodo === 'semana' ? 'Ultimos 7 dias' :
             'Historial completo de inscripciones'}
          </h3>
          <button
            onClick={() => setMostrarTabla(!mostrarTabla)}
            className="text-sm text-[#FFC300] hover:text-[#0A3D62] transition-colors"
          >
            {mostrarTabla ? 'Ver grafica' : 'Ver tabla'}
          </button>
        </div>

        {!mostrarTabla ? (
          <ResponsiveContainer width="100%" height={400}>
            {periodo === 'todas' ? (
              <ComposedChart data={datosFiltrados}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" angle={-45} textAnchor="end" height={80} fontSize={11} tick={{ fill: '#374151' }} />
                <YAxis yAxisId="left" label={{ value: 'Inscripciones', angle: -90, position: 'insideLeft', fill: '#374151' }} tick={{ fill: '#374151' }} />
                <YAxis yAxisId="right" orientation="right" label={{ value: 'Acumuladas', angle: 90, position: 'insideRight', fill: '#374151' }} tick={{ fill: '#374151' }} />
                <Tooltip contentStyle={{ backgroundColor: 'white', color: '#1F2937' }} />
                <Legend wrapperStyle={{ color: '#374151' }} />
                <Bar yAxisId="left" dataKey="inscripciones" fill="#FFC300" name="Inscripciones del dia" barSize={30} />
                <Line yAxisId="right" type="monotone" dataKey="acumuladas" stroke="#0A3D62" name="Inscripciones acumuladas" strokeWidth={2} dot={false} />
              </ComposedChart>
            ) : (
              <BarChart data={datosFiltrados}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" angle={-45} textAnchor="end" height={80} fontSize={11} tick={{ fill: '#374151' }} />
                <YAxis tick={{ fill: '#374151' }} />
                <Tooltip contentStyle={{ backgroundColor: 'white', color: '#1F2937' }} />
                <Legend wrapperStyle={{ color: '#374151' }} />
                <Bar dataKey="inscripciones" fill="#FFC300" name="Inscripciones" barSize={40} />
              </BarChart>
            )}
          </ResponsiveContainer>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-800 font-semibold border-b">Fecha</th>
                  <th className="px-4 py-3 text-right text-gray-800 font-semibold border-b">Inscripciones</th>
                  {periodo === 'todas' && (
                    <th className="px-4 py-3 text-right text-gray-800 font-semibold border-b">Acumuladas</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {datosFiltrados.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="px-4 py-3 text-gray-800">{item.fecha}</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-800">{item.inscripciones}</td>
                    {periodo === 'todas' && (
                      <td className="px-4 py-3 text-right font-semibold text-[#0A3D62]">{item.acumuladas}</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Resumen por semanas activas */}
      {periodo === 'todas' && datosPorSemana.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Resumen por semana</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {datosPorSemana.map((semana) => (
              <div key={semana.semana} className="bg-gray-100 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-600">Semana {semana.semana}</p>
                <p className="text-xl font-bold text-[#0A3D62]">{semana.inscripciones}</p>
                <p className="text-xs text-gray-500">inscripciones</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}