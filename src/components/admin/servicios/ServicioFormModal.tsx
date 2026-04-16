// src/components/admin/servicios/ServicioFormModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { X, Save, Sparkles, MapPin, FileText, Image as ImageIcon } from 'lucide-react';
import { CloudinaryUploader } from '@/components/admin/cloudinary/CloudinaryUploader';
import type { Servicio, ServicioFormData } from '@/types/servicios';

interface ServicioFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (servicioData: Partial<Servicio>) => Promise<void>;
  servicio: Servicio | null;
}

const initialFormData: ServicioFormData = {
  tituloServicio: '',
  descripcion: '',
  ubicacion: 'Centro Médico Pichardo',
  urlImage: '',
  textoAlt: '',
  disenoTipo: 'vertical',
  activo: true
};

export function ServicioFormModal({ isOpen, onClose, onSave, servicio }: ServicioFormModalProps) {
  const [formData, setFormData] = useState<ServicioFormData>(initialFormData);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ServicioFormData, string>>>({});

  useEffect(() => {
    if (servicio) {
      setFormData({
        idServicio: servicio.idServicio,
        tituloServicio: servicio.tituloServicio || '',
        descripcion: servicio.descripcion || '',
        ubicacion: servicio.ubicacion || 'Centro Médico Pichardo',
        urlImage: servicio.urlImage || '',
        textoAlt: servicio.textoAlt || servicio.tituloServicio || '',
        disenoTipo: servicio.disenoTipo || 'vertical',
        activo: servicio.activo
      });
    } else {
      setFormData(initialFormData);
    }
    setErrors({});
  }, [servicio, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ServicioFormData, string>> = {};

    if (!formData.tituloServicio.trim()) {
      newErrors.tituloServicio = 'El título del servicio es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error al guardar:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof ServicioFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleImageUpload = (asset: { url: string; publicId: string }) => {
    setFormData(prev => ({ ...prev, urlImage: asset.url, textoAlt: prev.tituloServicio }));
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-t-4 border-[#FFC300]">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-[#FFC300]/20 px-6 py-5 flex items-center justify-between z-10">
            <h2 className="text-2xl font-bold text-[#0A3D62]">
              {servicio ? '✏️ Editar Servicio' : '➕ Nuevo Servicio'}
            </h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-[#FFC300]/20 rounded-lg transition-colors group"
            >
              <X size={22} className="text-gray-500 group-hover:text-[#0A3D62]" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Imagen */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-[#0A3D62] mb-1">
                Imagen del Servicio
              </label>
              
              <CloudinaryUploader
                onUpload={handleImageUpload}
                preset="servicios_preset"
                folder="centro-medico/servicios"
                resourceType="image"
                maxFiles={1}
              />

              {formData.urlImage && (
                <div className="mt-3 relative w-32 h-32 rounded-lg overflow-hidden border-2 border-[#FFC300]/30 shadow-md">
                  <img
                    src={formData.urlImage}
                    alt={formData.textoAlt || formData.tituloServicio}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, urlImage: '' }))}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-md"
                    title="Eliminar imagen"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* Título */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#0A3D62]">
                Título del Servicio <span className="text-[#FFC300]">*</span>
              </label>
              <div className="relative">
                <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0A3D62]" size={18} />
                <input
                  type="text"
                  name="tituloServicio"
                  value={formData.tituloServicio}
                  onChange={handleChange}
                  className={`
                    w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all duration-300 text-gray-800
                    ${errors.tituloServicio 
                      ? 'border-red-500 bg-red-50 focus:ring-red-200' 
                      : 'border-[#FFC300]/30 focus:border-[#FFC300] focus:ring-[#FFC300]/20'
                    }
                  `}
                  placeholder="Ej. Consulta Pediátrica"
                />
              </div>
              {errors.tituloServicio && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.tituloServicio}
                </p>
              )}
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#0A3D62]">
                Descripción
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 text-[#0A3D62]" size={18} />
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  rows={4}
                  className="w-full pl-10 pr-4 py-3 border-2 border-[#FFC300]/30 rounded-xl focus:outline-none focus:border-[#FFC300] focus:ring-4 focus:ring-[#FFC300]/20 transition-all duration-300 text-gray-800 resize-none"
                  placeholder="Descripción detallada del servicio..."
                />
              </div>
            </div>

            {/* Ubicación */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#0A3D62]">
                Ubicación
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0A3D62]" size={18} />
                <input
                  type="text"
                  name="ubicacion"
                  value={formData.ubicacion}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border-2 border-[#FFC300]/30 rounded-xl focus:outline-none focus:border-[#FFC300] focus:ring-4 focus:ring-[#FFC300]/20 transition-all duration-300 text-gray-800"
                  placeholder="Centro Médico Pichardo"
                />
              </div>
            </div>

            {/* Texto Alt (oculto, se actualiza automáticamente) */}
            <input
              type="hidden"
              name="textoAlt"
              value={formData.textoAlt || formData.tituloServicio}
            />

            {/* Diseño Tipo (oculto) */}
            <input
              type="hidden"
              name="disenoTipo"
              value={formData.disenoTipo}
            />

            {/* Estado (Activo/Inactivo) - Solo visible en edición */}
            {servicio && (
              <div className="flex items-center gap-4 py-3 px-4 bg-[#FFF9E6] rounded-xl border border-[#FFC300]/30">
                <label className="text-sm font-semibold text-[#0A3D62]">Estado:</label>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, activo: !prev.activo }))}
                  className={`
                    relative inline-flex h-7 w-12 items-center rounded-full transition-colors
                    ${formData.activo ? 'bg-green-500' : 'bg-gray-300'}
                  `}
                >
                  <span
                    className={`
                      inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-md
                      ${formData.activo ? 'translate-x-6' : 'translate-x-1'}
                    `}
                  />
                </button>
                <span className={`text-sm font-medium ${formData.activo ? 'text-green-600' : 'text-gray-500'}`}>
                  {formData.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex justify-end gap-3 pt-6 border-t border-[#FFC300]/30">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FFC300] to-[#FFD700] text-[#0A3D62] rounded-xl hover:from-[#0A3D62] hover:to-[#1A4F7A] hover:text-white transition-all duration-300 font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#0A3D62] border-t-transparent rounded-full animate-spin" />
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    <span>Guardar</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}