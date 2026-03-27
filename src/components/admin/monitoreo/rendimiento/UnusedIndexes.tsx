// src/components/admin/monitoreo/rendimiento/UnusedIndexes.tsx
"use client";

import { useState, useEffect } from 'react';
import { Database, Trash2, Loader2, XCircle } from 'lucide-react';

interface UnusedIndex {
  schemaname: string;
  tablename: string;
  indexname: string;
  index_size: string;
  idx_scan: number;
  last_used?: string;
}

export function UnusedIndexes() {
  const [indexes, setIndexes] = useState<UnusedIndex[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIndexes = async () => {
      try {
        const res = await fetch('/api/monitoreo/rendimiento/unused-indexes');
        const data = await res.json();
        setIndexes(data);
      } catch (error) {
        console.error('Error cargando índices no utilizados:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchIndexes();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Database size={20} className="text-[#FFC300]" />
          <h3 className="text-lg font-bold text-[#0A3D62]">Índices No Utilizados</h3>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin" size={32} color="#0A3D62" />
        </div>
      </div>
    );
  }

  if (indexes.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Database size={20} className="text-[#FFC300]" />
          <h3 className="text-lg font-bold text-[#0A3D62]">Índices No Utilizados</h3>
        </div>
        <div className="text-center py-8">
          <Database size={40} className="mx-auto text-green-300 mb-3" />
          <p className="text-gray-500">Todos los índices están siendo utilizados</p>
          <p className="text-xs text-gray-400 mt-1">Óptimo rendimiento</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Database size={20} className="text-yellow-500" />
          <h3 className="text-lg font-bold text-[#0A3D62]">Índices No Utilizados</h3>
        </div>
        <span className="text-xs text-yellow-500 bg-yellow-50 px-2 py-1 rounded-full">
          {indexes.length} índices candidatos a eliminar
        </span>
      </div>

      <div className="space-y-3 max-h-[500px] overflow-y-auto">
        {indexes.map((idx, index) => (
          <div key={idx.indexname} className="p-3 bg-gray-50 rounded-xl">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-medium text-gray-800">{idx.tablename}</p>
                <p className="text-xs font-mono text-gray-500 mt-1">{idx.indexname}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Tamaño: {idx.index_size}</p>
                <p className="text-xs text-gray-400">Escaneos: {idx.idx_scan}</p>
              </div>
            </div>
            <div className="flex justify-end mt-2">
              <button className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1">
                <Trash2 size={12} />
                Sugerir eliminación
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}








