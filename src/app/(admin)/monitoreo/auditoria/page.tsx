// src/app/(admin)/monitoreo/auditoria/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { Search, Filter, Download, Eye, RefreshCw, Calendar, Users, Database, Shield } from 'lucide-react';
import { AuditoriaTable } from '@/components/admin/monitoreo/auditoria/AuditoriaTable';
import { AuditoriaFilters } from '@/components/admin/monitoreo/auditoria/AuditoriaFilters';
import { AuditoriaDetailsModal } from '@/components/admin/monitoreo/auditoria/AuditoriaDetailsModal';
import { MetricsCard } from '@/components/admin/monitoreo/shared/MetricsCard';
import { AuditoriaExportModal } from '@/components/admin/monitoreo/auditoria/AuditoriaExportModal';

interface AuditoriaRegistro {
  id: number;
  usuario: string;
  ip_address: string;
  accion: string;
  tabla_afectada: string;
  registro_id: number;
  datos_anteriores: any;
  datos_nuevos: any;
  fecha_hora: string;
}

export default function AuditoriaPage() {
  const [registros, setRegistros] = useState<AuditoriaRegistro[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegistro, setSelectedRegistro] = useState<AuditoriaRegistro | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    usuario: '',
    tabla: '',
    accion: '',
    fechaInicio: '',
    fechaFin: ''
  });
  const [stats, setStats] = useState({
    total: 0,
    usuariosDistintos: 0,
    tablasAfectadas: 0,
    accionesHoy: 0
  });

  const cargarRegistros = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.usuario) params.append('usuario', filters.usuario);
      if (filters.tabla) params.append('tabla', filters.tabla);
      if (filters.accion) params.append('accion', filters.accion);
      if (filters.fechaInicio) params.append('fecha_inicio', filters.fechaInicio);
      if (filters.fechaFin) params.append('fecha_fin', filters.fechaFin);
      
      const res = await fetch(`/api/monitoreo/auditoria?${params.toString()}`);
      const data = await res.json();
      
      setRegistros(data.registros);
      setStats(data.stats);
    } catch (error) {
      console.error('Error cargando auditoría:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarRegistros();
  }, [filters]);

  const handleViewDetails = (registro: AuditoriaRegistro) => {
    setSelectedRegistro(registro);
    setModalOpen(true);
  };

  const handleExport = async (exportConfig: {
    fields: string[];
    tabla?: string;
    accion?: string;
    fechaInicio?: string;
    fechaFin?: string;
  }) => {
    try {
      const params = new URLSearchParams();
      params.append('fields', exportConfig.fields.join(','));
      if (exportConfig.tabla) params.append('tabla', exportConfig.tabla);
      if (exportConfig.accion) params.append('accion', exportConfig.accion);
      if (exportConfig.fechaInicio) params.append('fecha_inicio', exportConfig.fechaInicio);
      if (exportConfig.fechaFin) params.append('fecha_fin', exportConfig.fechaFin);
      
      const res = await fetch(`/api/monitoreo/auditoria/export?${params.toString()}`);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      const fecha = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      a.download = `auditoria_${fecha}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exportando:', error);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-lg border-l-4 border-[#FFC300]">
          <div>
            <h1 className="text-2xl font-bold text-[#0A3D62]">Auditoría del Sistema</h1>
            <p className="text-gray-600 mt-1">Historial de cambios y acciones realizadas en el sistema</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={cargarRegistros}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#0A3D62] text-white rounded-xl hover:bg-[#1A4F7A] transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              <span className="font-medium">Actualizar</span>
            </button>
            <button
              onClick={() => setExportModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#FFC300] to-[#FFD700] text-[#0A3D62] rounded-xl hover:from-[#0A3D62] hover:to-[#1A4F7A] hover:text-white transition-all duration-300 shadow-md hover:shadow-lg font-medium"
            >
              <Download size={18} />
              <span>Exportar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricsCard
          title="Total de Registros"
          value={stats.total}
          icon={Database}
          status="good"
        />
        <MetricsCard
          title="Usuarios Activos"
          value={stats.usuariosDistintos}
          icon={Users}
          status="good"
        />
        <MetricsCard
          title="Tablas Afectadas"
          value={stats.tablasAfectadas}
          icon={Shield}
          status="good"
        />
        <MetricsCard
          title="Acciones Hoy"
          value={stats.accionesHoy}
          icon={Calendar}
          status={stats.accionesHoy > 100 ? 'warning' : 'good'}
        />
      </div>

      {/* Filtros */}
      <AuditoriaFilters filters={filters} onFiltersChange={setFilters} />

      {/* Tabla de resultados */}
      <AuditoriaTable
        registros={registros}
        loading={loading}
        onViewDetails={handleViewDetails}
      />

      {/* Modal de detalles */}
      <AuditoriaDetailsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        registro={selectedRegistro}
      />

      {/* Modal de exportación */}
      <AuditoriaExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        onExport={handleExport}
        currentFilters={filters}
        availableFields={[
          { id: 'fecha_hora', label: 'Fecha y Hora' },
          { id: 'usuario', label: 'Usuario' },
          { id: 'ip_address', label: 'Dirección IP' },
          { id: 'accion', label: 'Acción' },
          { id: 'tabla_afectada', label: 'Tabla Afectada' },
          { id: 'registro_id', label: 'ID del Registro' },
          { id: 'datos_anteriores', label: 'Datos Anteriores' },
          { id: 'datos_nuevos', label: 'Datos Nuevos' },
        ]}
      />
    </div>
  );
}