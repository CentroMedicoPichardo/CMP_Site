// src/components/admin/usuarios/ChangeRolModal.tsx
'use client';

import { X, Shield, Loader2 } from 'lucide-react';
import type { Usuario, Rol } from '@/types/usuarios';

interface ChangeRolModalProps {
  isOpen: boolean;
  onClose: () => void;
  usuario: Usuario | null;
  roles: Rol[];
  selectedRolId: number;
  onRolChange: (rolId: number) => void;
  onSave: () => Promise<void>;
  saving: boolean;
}

export function ChangeRolModal({ 
  isOpen, 
  onClose, 
  usuario, 
  roles, 
  selectedRolId, 
  onRolChange, 
  onSave,
  saving 
}: ChangeRolModalProps) {
  if (!isOpen || !usuario) return null;

  const nombreCompleto = `${usuario.nombre} ${usuario.apellidoPaterno} ${usuario.apellidoMaterno || ''}`.trim();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full border-t-4 border-[#FFC300]">
          {/* Header */}
          <div className="bg-white border-b border-[#FFC300]/20 px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0A3D62] rounded-xl flex items-center justify-center">
                <Shield size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#0A3D62]">Cambiar Rol</h2>
                <p className="text-sm text-gray-500">{nombreCompleto}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#FFC300]/20 rounded-lg transition-colors group"
            >
              <X size={20} className="text-gray-500 group-hover:text-[#0A3D62]" />
            </button>
          </div>

          {/* Contenido */}
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              Selecciona el nuevo rol para este usuario:
            </p>

            <div className="space-y-3">
              {roles.map((rol) => (
                <label
                  key={rol.id}
                  className={`
                    flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all
                    ${selectedRolId === rol.id 
                      ? 'border-[#FFC300] bg-[#FFF9E6] shadow-md' 
                      : 'border-gray-200 hover:border-[#FFC300]/50 hover:bg-gray-50'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="rol"
                    value={rol.id}
                    checked={selectedRolId === rol.id}
                    onChange={() => onRolChange(rol.id)}
                    className="w-4 h-4 text-[#FFC300] focus:ring-[#FFC300]"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{rol.nombre}</p>
                    <p className="text-xs text-gray-500">
                      {rol.nombre === 'admin' 
                        ? 'Acceso total al sistema' 
                        : 'Acceso a cursos, foros y contenido'}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-5 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#FFC300] to-[#FFD700] text-[#0A3D62] rounded-xl hover:from-[#0A3D62] hover:to-[#1A4F7A] hover:text-white transition-all duration-300 font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Shield size={18} />
                  <span>Actualizar Rol</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}