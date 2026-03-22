// src/components/admin/backups/BackupGenerator.tsx
'use client';

import { useState } from 'react';
import { Database, HardDrive, Shield, AlertCircle, Download, Loader2 } from 'lucide-react';

interface BackupGeneratorProps {
  onGenerate: (tipo: 'completo' | 'parcial') => Promise<void>;
  generating: boolean;
}

export function BackupGenerator({ onGenerate, generating }: BackupGeneratorProps) {
  const [selectedType, setSelectedType] = useState<'completo' | 'parcial'>('completo');

  const handleGenerate = () => {
    onGenerate(selectedType);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-[#FFC300]/20 overflow-hidden sticky top-24">
      <div className="px-6 py-5 bg-gradient-to-r from-[#FFF9E6] to-white border-b border-[#FFC300]/20">
        <h2 className="text-lg font-bold text-[#0A3D62] flex items-center gap-2">
          <Database size={20} className="text-[#FFC300]" />
          Generar Nuevo Respaldo
        </h2>
        <p className="text-sm text-gray-500 mt-1">Selecciona el tipo de respaldo que deseas generar</p>
      </div>

      <div className="p-6 space-y-5">
        {/* Opciones de tipo de respaldo */}
        <div className="space-y-3">
          <label
            className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
              selectedType === 'completo'
                ? 'border-[#FFC300] bg-[#FFF9E6] shadow-md'
                : 'border-gray-200 hover:border-[#FFC300]/50 hover:bg-gray-50'
            }`}
          >
            <input
              type="radio"
              name="tipo"
              value="completo"
              checked={selectedType === 'completo'}
              onChange={() => setSelectedType('completo')}
              className="w-4 h-4 text-[#FFC300] focus:ring-[#FFC300]"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Database size={18} className="text-green-600" />
                <p className="font-semibold text-gray-800">Respaldo Completo</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">Incluye todas las tablas de la base de datos</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-400">Tamaño estimado: ~5-10 MB</span>
            </div>
          </label>

          <label
            className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
              selectedType === 'parcial'
                ? 'border-[#FFC300] bg-[#FFF9E6] shadow-md'
                : 'border-gray-200 hover:border-[#FFC300]/50 hover:bg-gray-50'
            }`}
          >
            <input
              type="radio"
              name="tipo"
              value="parcial"
              checked={selectedType === 'parcial'}
              onChange={() => setSelectedType('parcial')}
              className="w-4 h-4 text-[#FFC300] focus:ring-[#FFC300]"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <HardDrive size={18} className="text-yellow-600" />
                <p className="font-semibold text-gray-800">Respaldo Parcial</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">Excluye tablas de logs, auditoría y sesiones</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-400">Tamaño estimado: ~1-2 MB</span>
            </div>
          </label>
        </div>

        {/* Información adicional */}
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
          <div className="flex items-start gap-3">
            <Shield size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800">Recomendaciones de seguridad</p>
              <ul className="text-xs text-blue-700 mt-1 space-y-1">
                <li>• Realiza respaldos completos semanalmente</li>
                <li>• Los respaldos parciales son ideales para respaldos diarios</li>
                <li>• Descarga y guarda los respaldos en un lugar seguro</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Alerta de espacio */}
        <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-amber-600" />
            <p className="text-xs text-amber-700">
              Los respaldos se guardan en el servidor. Descarga los archivos para conservar una copia local.
            </p>
          </div>
        </div>

        {/* Botón generar */}
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="w-full py-4 bg-gradient-to-r from-[#FFC300] to-[#FFD700] text-[#0A3D62] rounded-xl hover:from-[#0A3D62] hover:to-[#1A4F7A] hover:text-white transition-all duration-300 font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {generating ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span>Generando respaldo...</span>
            </>
          ) : (
            <>
              <Download size={20} />
              <span>Generar Respaldo {selectedType === 'completo' ? 'Completo' : 'Parcial'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}