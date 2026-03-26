// src/components/admin/monitoreo/auditoria/AuditoriaExportModal.tsx
"use client";

import { useState } from 'react';
import { X, Download, Check, ChevronDown, Calendar, Table, Filter } from 'lucide-react';

interface AuditoriaExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (config: {
    fields: string[];
    tabla?: string;
    accion?: string;
    fechaInicio?: string;
    fechaFin?: string;
  }) => void;
  currentFilters: {
    usuario: string;
    tabla: string;
    accion: string;
    fechaInicio: string;
    fechaFin: string;
  };
  availableFields: { id: string; label: string }[];
}

const acciones = ['INSERT', 'UPDATE'];
const tablas = [
  { value: 'clinica.medicos', label: 'Médicos' },
  { value: 'clinica.nosotros', label: 'Nosotros' },
  { value: 'clinica.servicios', label: 'Servicios' },
  { value: 'seguridad.usuarios', label: 'Usuarios' },
  { value: 'academia.cursos', label: 'Cursos' },
];

export function AuditoriaExportModal({ 
  isOpen, 
  onClose, 
  onExport, 
  currentFilters,
  availableFields 
}: AuditoriaExportModalProps) {
  const [selectedFields, setSelectedFields] = useState<string[]>(availableFields.map(f => f.id));
  const [useCustomFilters, setUseCustomFilters] = useState(false);
  const [customTabla, setCustomTabla] = useState(currentFilters.tabla || '');
  const [customAccion, setCustomAccion] = useState(currentFilters.accion || '');
  const [customFechaInicio, setCustomFechaInicio] = useState(currentFilters.fechaInicio || '');
  const [customFechaFin, setCustomFechaFin] = useState(currentFilters.fechaFin || '');

  if (!isOpen) return null;

  const toggleField = (fieldId: string) => {
    if (selectedFields.includes(fieldId)) {
      setSelectedFields(selectedFields.filter(f => f !== fieldId));
    } else {
      setSelectedFields([...selectedFields, fieldId]);
    }
  };

  const selectAll = () => {
    setSelectedFields(availableFields.map(f => f.id));
  };

  const clearAll = () => {
    setSelectedFields([]);
  };

  const handleExport = () => {
    onExport({
      fields: selectedFields,
      tabla: useCustomFilters ? customTabla : currentFilters.tabla,
      accion: useCustomFilters ? customAccion : currentFilters.accion,
      fechaInicio: useCustomFilters ? customFechaInicio : currentFilters.fechaInicio,
      fechaFin: useCustomFilters ? customFechaFin : currentFilters.fechaFin,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto border-t-4 border-[#FFC300]">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-[#FFC300]/20 px-6 py-5 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0A3D62] rounded-xl flex items-center justify-center">
                <Download size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#0A3D62]">Exportar Auditoría</h2>
                <p className="text-sm text-gray-500">Selecciona los campos y filtros para exportar</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#FFC300]/20 rounded-lg transition-colors"
            >
              <X size={22} className="text-gray-500" />
            </button>
          </div>

          {/* Contenido */}
          <div className="p-6 space-y-6">
            {/* Selección de campos */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-[#0A3D62] flex items-center gap-2">
                  <Table size={16} />
                  Campos a exportar
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={selectAll}
                    className="text-xs text-[#0A3D62] hover:text-[#FFC300] transition-colors font-medium"
                  >
                    Seleccionar todos
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={clearAll}
                    className="text-xs text-gray-500 hover:text-red-500 transition-colors font-medium"
                  >
                    Limpiar
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
                {availableFields.map((field) => (
                  <label
                    key={field.id}
                    className="flex items-center gap-2 cursor-pointer group hover:bg-white p-2 rounded-lg transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedFields.includes(field.id)}
                      onChange={() => toggleField(field.id)}
                      className="w-4 h-4 rounded border-gray-300 text-[#FFC300] focus:ring-[#FFC300]"
                    />
                    <span className={`text-sm ${selectedFields.includes(field.id) ? 'text-gray-800 font-medium' : 'text-gray-600'}`}>
                      {field.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filtros personalizados */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <input
                  type="checkbox"
                  id="useCustomFilters"
                  checked={useCustomFilters}
                  onChange={(e) => setUseCustomFilters(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[#FFC300] focus:ring-[#FFC300]"
                />
                <label htmlFor="useCustomFilters" className="text-sm font-semibold text-[#0A3D62] flex items-center gap-2">
                  <Filter size={16} />
                  Usar filtros personalizados para la exportación
                </label>
              </div>

              {useCustomFilters && (
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#0A3D62] mb-2">Tabla</label>
                      <select
                        value={customTabla}
                        onChange={(e) => setCustomTabla(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFC300] bg-white text-gray-800 font-medium cursor-pointer"
                      >
                        <option value="">Todas las tablas</option>
                        {tablas.map(tabla => (
                          <option key={tabla.value} value={tabla.value}>{tabla.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#0A3D62] mb-2">Acción</label>
                      <select
                        value={customAccion}
                        onChange={(e) => setCustomAccion(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFC300] bg-white text-gray-800 font-medium cursor-pointer"
                      >
                        <option value="">Todas las acciones</option>
                        {acciones.map(accion => (
                          <option key={accion} value={accion}>{accion}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#0A3D62] mb-2">Fecha inicio</label>
                      <div className="relative">
                        <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0A3D62]" />
                        <input
                          type="date"
                          value={customFechaInicio}
                          onChange={(e) => setCustomFechaInicio(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFC300] text-gray-800 font-medium"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#0A3D62] mb-2">Fecha fin</label>
                      <div className="relative">
                        <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0A3D62]" />
                        <input
                          type="date"
                          value={customFechaFin}
                          onChange={(e) => setCustomFechaFin(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFC300] text-gray-800 font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Resumen de campos seleccionados */}
            <div className="p-4 bg-[#FFF9E6] rounded-xl border border-[#FFC300]/30">
              <p className="text-sm text-gray-700">
                Se exportarán <span className="font-bold text-[#0A3D62]">{selectedFields.length}</span> campos
              </p>
              {selectedFields.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {selectedFields.map(id => {
                    const field = availableFields.find(f => f.id === id);
                    return (
                      <span key={id} className="text-xs text-gray-600 bg-white px-2 py-0.5 rounded-full border border-gray-200">
                        {field?.label}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={handleExport}
              disabled={selectedFields.length === 0}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#FFC300] to-[#FFD700] text-[#0A3D62] rounded-xl hover:from-[#0A3D62] hover:to-[#1A4F7A] hover:text-white transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              <Download size={18} />
              <span>Exportar CSV</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}