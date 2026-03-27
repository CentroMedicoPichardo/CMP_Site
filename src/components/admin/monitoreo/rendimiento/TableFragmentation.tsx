// src/components/admin/monitoreo/rendimiento/TableFragmentation.tsx
"use client";

import { useState, useEffect } from 'react';
import { HardDrive, Loader2, AlertTriangle } from 'lucide-react';

interface FragmentedTable {
  schemaname: string;
  tablename: string;
  live_tuples: number;
  dead_tuples: number;
  dead_ratio: number;
  last_vacuum: string;
  last_autovacuum: string;
}

export function TableFragmentation() {
  const [tables, setTables] = useState<FragmentedTable[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const res = await fetch('/api/monitoreo/rendimiento/fragmentation');
        const data = await res.json();
        setTables(data);
      } catch (error) {
        console.error('Error cargando fragmentación:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTables();
  }, []);

  const getDeadRatioColor = (ratio: number) => {
    if (ratio > 20) return 'text-red-600 bg-red-50';
    if (ratio > 10) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <HardDrive size={20} className="text-[#FFC300]" />
          <h3 className="text-lg font-bold text-[#0A3D62]">Fragmentación de Tablas</h3>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin" size={32} color="#0A3D62" />
        </div>
      </div>
    );
  }

  if (tables.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <HardDrive size={20} className="text-[#FFC300]" />
          <h3 className="text-lg font-bold text-[#0A3D62]">Fragmentación de Tablas</h3>
        </div>
        <div className="text-center py-8">
          <HardDrive size={40} className="mx-auto text-green-300 mb-3" />
          <p className="text-gray-500">No hay fragmentación significativa</p>
          <p className="text-xs text-gray-400 mt-1">Todas las tablas están optimizadas</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle size={20} className="text-orange-500" />
          <h3 className="text-lg font-bold text-[#0A3D62]">Fragmentación de Tablas</h3>
        </div>
        <span className="text-xs text-orange-500 bg-orange-50 px-2 py-1 rounded-full">
          {tables.length} tablas con fragmentación
        </span>
      </div>

      <div className="space-y-3 max-h-[500px] overflow-y-auto">
        {tables.map((table) => (
          <div key={table.tablename} className="p-3 bg-gray-50 rounded-xl">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-medium text-gray-800">{table.tablename}</p>
                <p className="text-xs text-gray-500 mt-1">{table.schemaname}</p>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getDeadRatioColor(table.dead_ratio)}`}>
                {table.dead_ratio.toFixed(1)}% fragmentado
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs mt-2">
              <div>
                <p className="text-gray-400">Registros vivos</p>
                <p className="font-medium">{table.live_tuples.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-400">Registros muertos</p>
                <p className="font-medium">{table.dead_tuples.toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-200 flex justify-between text-xs text-gray-400">
              <span>Último VACUUM: {table.last_vacuum || 'Nunca'}</span>
              <span>Último AUTOVACUUM: {table.last_autovacuum || 'Nunca'}</span>
            </div>
            {table.dead_ratio > 20 && (
              <div className="mt-2 p-2 bg-red-50 rounded-lg text-xs text-red-600">
                ⚠️ Se recomienda ejecutar VACUUM FULL en esta tabla
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}