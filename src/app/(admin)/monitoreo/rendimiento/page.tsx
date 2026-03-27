// src/app/(admin)/monitoreo/rendimiento/page.tsx (actualizado)
"use client";

import { useState, useEffect } from 'react';
import { RefreshCw, Database, HardDrive, Activity, Zap } from 'lucide-react';

export default function RendimientoPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    databaseSize: '0 MB',
    tableCount: 0,
    totalRecords: 0,
    indexCount: 0,
    tables: []
  });
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const loadStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/monitoreo/rendimiento/estado-db');
      const data = await res.json();
      setStats(data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const getTimeString = () => {
    if (!lastUpdate) return '--:--:--';
    return lastUpdate.toLocaleTimeString();
  };

  const statsCards = [
    {
      title: 'Tamaño de la Base de Datos',
      value: stats.databaseSize,
      icon: Database,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      description: 'Espacio total ocupado por la base de datos',
      detail: 'Incluye todas las tablas, índices y datos'
    },
    {
      title: 'Número de Tablas',
      value: stats.tableCount,
      icon: HardDrive,
      color: 'text-green-600',
      bg: 'bg-green-50',
      description: 'Total de tablas en la base de datos',
      detail: 'Tablas de clinica, seguridad y academia'
    },
    {
      title: 'Registros Totales',
      value: stats.totalRecords.toLocaleString(),
      icon: Activity,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      description: 'Suma de todos los registros',
      detail: 'Cantidad total de datos almacenados'
    },
    {
      title: 'Índices Creados',
      value: stats.indexCount,
      icon: Zap,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
      description: 'Total de índices en la base de datos',
      detail: 'Ayudan a que las consultas sean más rápidas'
    }
  ];

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <RefreshCw className="animate-spin mx-auto mb-4" size={48} color="#0A3D62" />
          <p className="text-gray-500">Cargando estado de la base de datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-lg border-l-4 border-[#FFC300]">
          <div>
            <h1 className="text-2xl font-bold text-[#0A3D62]">Estado de la Base de Datos</h1>
            <p className="text-gray-600 mt-1">Métricas clave del rendimiento y salud del sistema</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadStats}
              className="flex items-center gap-2 px-4 py-2 bg-[#0A3D62] text-white rounded-xl hover:bg-[#1A4F7A] transition-all shadow-md"
            >
              <RefreshCw size={18} />
              <span>Actualizar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-3 rounded-xl ${card.bg}`}>
                    <Icon size={24} className={`${card.color}`} />
                  </div>
                </div>
                
                <h3 className="text-sm font-medium text-gray-500 mb-1">{card.title}</h3>
                <p className="text-2xl font-bold text-gray-800 mb-2">{card.value}</p>
                
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">📖 {card.description}</p>
                  <p className="text-xs text-gray-400">{card.detail}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabla de tablas con sus tamaños */}
      <div className="mt-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-[#0A3D62] to-[#1A4F7A]">
            <h2 className="text-white font-bold text-lg flex items-center gap-2">
              <HardDrive size={18} />
              Tamaño de las Tablas
            </h2>
            <p className="text-white/70 text-sm mt-1">Espacio ocupado por cada tabla en la base de datos</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tabla</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Esquema</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Registros</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tamaño</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Índices</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tamaño Total</th>
                 </tr>
              </thead>
              <tbody>
                {stats.tables && stats.tables.map((table: any) => (
                  <tr key={`${table.schema}.${table.table}`} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-800">{table.table}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500">{table.schema}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{table.rows.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{table.data_size}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{table.index_size}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-[#0A3D62]">{table.total_size}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              💡 El tamaño total incluye datos e índices. Mantener las tablas optimizadas ayuda al rendimiento.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      {lastUpdate && (
        <div className="mt-6 text-right text-xs text-gray-400">
          Última actualización: {getTimeString()}
        </div>
      )}
    </div>
  );
}