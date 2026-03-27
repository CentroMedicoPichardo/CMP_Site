// src/components/admin/monitoreo/rendimiento/SlowQueries.tsx
"use client";

import { useState, useEffect } from 'react';
import { AlertCircle, Clock, Loader2, Eye, XCircle } from 'lucide-react';

interface SlowQuery {
  pid: number;
  usuario: string;
  query: string;
  tiempo_ejecucion: number;
  fecha: string;
  plan?: string;
}

export function SlowQueries() {
  const [queries, setQueries] = useState<SlowQuery[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuery, setSelectedQuery] = useState<SlowQuery | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const res = await fetch('/api/monitoreo/rendimiento/slow-queries');
        const data = await res.json();
        setQueries(data);
      } catch (error) {
        console.error('Error cargando consultas lentas:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchQueries();
  }, []);

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}min`;
  };

  const getTimeColor = (ms: number) => {
    if (ms > 5000) return 'text-red-600';
    if (ms > 1000) return 'text-yellow-600';
    return 'text-green-600';
  };

  const handleViewPlan = (query: SlowQuery) => {
    setSelectedQuery(query);
    setModalOpen(true);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle size={20} className="text-[#FFC300]" />
          <h3 className="text-lg font-bold text-[#0A3D62]">Top Consultas Lentas</h3>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin" size={32} color="#0A3D62" />
        </div>
      </div>
    );
  }

  if (queries.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle size={20} className="text-[#FFC300]" />
          <h3 className="text-lg font-bold text-[#0A3D62]">Top Consultas Lentas</h3>
        </div>
        <div className="text-center py-8">
          <Clock size={40} className="mx-auto text-green-300 mb-3" />
          <p className="text-gray-500">No hay consultas lentas registradas</p>
          <p className="text-xs text-gray-400 mt-1">Todas las consultas están dentro del umbral</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertCircle size={20} className="text-red-500" />
            <h3 className="text-lg font-bold text-[#0A3D62]">Top Consultas Lentas</h3>
          </div>
          <span className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded-full">
            {queries.length} consultas críticas
          </span>
        </div>

        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {queries.map((query, index) => (
            <div key={query.pid || index} className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-400">#{index + 1}</span>
                  <span className="text-xs font-medium text-[#0A3D62]">{query.usuario}</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <Clock size={12} />
                  <span className={getTimeColor(query.tiempo_ejecucion)}>
                    {formatTime(query.tiempo_ejecucion)}
                  </span>
                </div>
              </div>
              <p className="text-sm font-mono text-gray-700 line-clamp-2 bg-white p-2 rounded-lg border border-gray-100">
                {query.query}
              </p>
              <div className="flex justify-end mt-2 gap-2">
                <button
                  onClick={() => handleViewPlan(query)}
                  className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1"
                >
                  <Eye size={12} />
                  Ver plan de ejecución
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de plan de ejecución */}
      {modalOpen && selectedQuery && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto border-t-4 border-[#FFC300]">
              <div className="sticky top-0 bg-white border-b border-[#FFC300]/20 px-6 py-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#0A3D62]">Plan de Ejecución</h3>
                <button onClick={() => setModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                  <XCircle size={20} />
                </button>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-1">Consulta:</p>
                  <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg text-xs font-mono overflow-x-auto">
                    {selectedQuery.query}
                  </pre>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Plan de Ejecución:</p>
                  <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg text-xs font-mono overflow-x-auto">
                    {selectedQuery.plan || 'No disponible'}
                  </pre>
                </div>
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                  <p className="text-xs text-yellow-700">
                    💡 Sugerencia: Revisar índices en las columnas utilizadas en WHERE y JOIN
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}