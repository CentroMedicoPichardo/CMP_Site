// src/components/admin/monitoreo/rendimiento/CacheStats.tsx
"use client";

import { useState, useEffect } from 'react';
import { BarChart3, Loader2 } from 'lucide-react';

interface CacheStats {
  hit_ratio: number;
  read_hit: number;
  read_miss: number;
  buffers_used: number;
  buffers_total: number;
}

export function CacheStats() {
  const [stats, setStats] = useState<CacheStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/monitoreo/rendimiento/cache-stats');
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error('Error cargando estadísticas de caché:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 size={20} className="text-[#FFC300]" />
          <h3 className="text-lg font-bold text-[#0A3D62]">Estadísticas de Caché</h3>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin" size={32} color="#0A3D62" />
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const getHitRatioColor = () => {
    if (stats.hit_ratio > 95) return 'bg-green-500';
    if (stats.hit_ratio > 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getHitRatioText = () => {
    if (stats.hit_ratio > 95) return 'Excelente';
    if (stats.hit_ratio > 80) return 'Bueno';
    if (stats.hit_ratio > 60) return 'Regular';
    return 'Crítico - Requiere atención';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 size={20} className="text-[#FFC300]" />
        <h3 className="text-lg font-bold text-[#0A3D62]">Estadísticas de Caché</h3>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-600">Cache Hit Ratio</span>
            <span className="text-sm font-bold text-[#0A3D62]">{stats.hit_ratio.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`${getHitRatioColor()} h-3 rounded-full transition-all`}
              style={{ width: `${Math.min(stats.hit_ratio, 100)}%` }}
            />
          </div>
          <p className={`text-xs mt-1 ${
            stats.hit_ratio > 95 ? 'text-green-600' : stats.hit_ratio > 80 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {getHitRatioText()}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="p-3 bg-green-50 rounded-xl text-center">
            <p className="text-xs text-gray-500">Aciertos</p>
            <p className="text-xl font-bold text-green-600">{stats.read_hit.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-red-50 rounded-xl text-center">
            <p className="text-xs text-gray-500">Fallos</p>
            <p className="text-xl font-bold text-red-600">{stats.read_miss.toLocaleString()}</p>
          </div>
        </div>

        <div className="p-3 bg-gray-50 rounded-xl">
          <div className="flex justify-between">
            <span className="text-xs text-gray-500">Buffers utilizados</span>
            <span className="text-xs font-medium">{stats.buffers_used.toLocaleString()}</span>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500">Buffers totales</span>
            <span className="text-xs font-medium">{stats.buffers_total.toLocaleString()}</span>
          </div>
          <div className="mt-2 pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-500">Uso de buffer cache</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div
                className="bg-[#0A3D62] h-2 rounded-full transition-all"
                style={{ width: `${(stats.buffers_used / stats.buffers_total) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-700">
            💡 Un hit ratio superior al 95% indica una buena configuración de caché.
            Si está por debajo, considera aumentar shared_buffers.
          </p>
        </div>
      </div>
    </div>
  );
}