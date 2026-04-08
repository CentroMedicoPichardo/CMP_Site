// src/components/admin/saber-pediatrico/shared/ContenidoFormModal.tsx
"use client";

import { useState, useEffect } from 'react';
import { X, Save, Upload, Image as ImageIcon, Link as LinkIcon, Calendar, Star, Eye, EyeOff } from 'lucide-react';
import { CloudinaryUploader } from '@/components/admin/cloudinary/CloudinaryUploader';
import { RichTextEditor } from './RichTextEditor';

interface ContenidoFormData {
  id?: number;
  tipo: string;
  titulo: string;
  descripcion: string;
  contenido?: string;
  urlExterno?: string;
  imagenUrl?: string;
  videoUrl?: string;
  archivoUrl?: string;
  categoria?: string;
  etiquetas?: string[];
  duracion?: string;
  fechaPublicacion: string;
  destacado: boolean;
  activo: boolean;
}

interface ContenidoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<ContenidoFormData>) => Promise<void>;
  item: ContenidoFormData | null;
  tipo: 'articulo' | 'video' | 'documento' | 'encuesta';
  saving: boolean;
}

// Valores iniciales por defecto - TODOS LOS CAMPOS DEFINIDOS
const getInitialFormData = (tipo: string): ContenidoFormData => ({
  tipo: tipo,
  titulo: '',
  descripcion: '',
  contenido: '',
  urlExterno: '',
  imagenUrl: '',
  videoUrl: '',
  archivoUrl: '',
  categoria: '',
  etiquetas: [],
  duracion: '',
  fechaPublicacion: new Date().toISOString().split('T')[0],
  destacado: false,
  activo: true,
});

export function ContenidoFormModal({ isOpen, onClose, onSave, item, tipo, saving }: ContenidoFormModalProps) {
  const [formData, setFormData] = useState<ContenidoFormData>(getInitialFormData(tipo));

  useEffect(() => {
    if (item) {
      setFormData({
        id: item.id,
        tipo: item.tipo || tipo,
        titulo: item.titulo || '',
        descripcion: item.descripcion || '',
        contenido: item.contenido || '',
        urlExterno: item.urlExterno || '',
        imagenUrl: item.imagenUrl || '',
        videoUrl: item.videoUrl || '',
        archivoUrl: item.archivoUrl || '',
        categoria: item.categoria || '',
        etiquetas: item.etiquetas || [],
        duracion: item.duracion || '',
        fechaPublicacion: item.fechaPublicacion || new Date().toISOString().split('T')[0],
        destacado: item.destacado || false,
        activo: item.activo !== undefined ? item.activo : true,
      });
    } else {
      setFormData(getInitialFormData(tipo));
    }
  }, [item, tipo, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleImageUpload = (asset: { url: string; publicId: string }) => {
    setFormData(prev => ({ ...prev, imagenUrl: asset.url }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  const getTitle = () => {
    const titles = {
      articulo: item ? 'Editar Artículo' : 'Nuevo Artículo',
      video: item ? 'Editar Video' : 'Nuevo Video',
      documento: item ? 'Editar Documento' : 'Nuevo Documento',
      encuesta: item ? 'Editar Encuesta' : 'Nueva Encuesta',
    };
    return titles[tipo];
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-t-4 border-[#FFC300]">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-[#FFC300]/20 px-6 py-5 flex items-center justify-between z-10">
            <h2 className="text-2xl font-bold text-[#0A3D62]">{getTitle()}</h2>
            <button onClick={onClose} className="p-2 hover:bg-[#FFC300]/20 rounded-lg transition-colors">
              <X size={22} className="text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Imagen - Solo para artículos */}
            {tipo === 'articulo' && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#0A3D62]">Imagen de portada</label>
                <CloudinaryUploader
                  onUpload={handleImageUpload}
                  preset="saber_pediatrico_img"
                  folder="centro-medico/saber-pediatrico"
                  resourceType="image"
                  maxFiles={1}
                />
                {formData.imagenUrl && (
                  <div className="mt-2">
                    <img src={formData.imagenUrl} alt="Vista previa" className="h-20 w-auto border rounded-lg p-1" />
                  </div>
                )}
              </div>
            )}

            {/* Título */}
            <div>
              <label className="block text-sm font-semibold text-[#0A3D62] mb-1">
                Título <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#FFC300] focus:ring-4 focus:ring-[#FFC300]/20 transition-all duration-300 text-gray-800"
                required
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-semibold text-[#0A3D62] mb-1">Descripción corta</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#FFC300] focus:ring-4 focus:ring-[#FFC300]/20 transition-all duration-300 text-gray-800 resize-none"
              />
            </div>

            {/* Campos específicos según tipo */}
            {tipo === 'articulo' && (
              <div>
                <label className="block text-sm font-semibold text-[#0A3D62] mb-1">Contenido</label>
                <RichTextEditor
                  value={formData.contenido || ''}
                  onChange={(html) => setFormData(prev => ({ ...prev, contenido: html }))}
                  placeholder="Escribe el contenido del artículo aquí..."
                />
              </div>
            )}

            {(tipo === 'video' || tipo === 'encuesta') && (
              <div>
                <label className="block text-sm font-semibold text-[#0A3D62] mb-1">
                  URL {tipo === 'video' ? 'de YouTube' : 'de Google Forms'}
                </label>
                <div className="relative">
                  <LinkIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="url"
                    name="urlExterno"
                    value={formData.urlExterno}
                    onChange={handleChange}
                    placeholder={tipo === 'video' ? 'https://youtube.com/watch?v=...' : 'https://docs.google.com/forms/...'}
                    className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#FFC300] focus:ring-4 focus:ring-[#FFC300]/20 transition-all duration-300 text-gray-800"
                  />
                </div>
              </div>
            )}

            {tipo === 'documento' && (
              <div>
                <label className="block text-sm font-semibold text-[#0A3D62] mb-1">URL del documento</label>
                <div className="relative">
                  <LinkIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="url"
                    name="archivoUrl"
                    value={formData.archivoUrl}
                    onChange={handleChange}
                    placeholder="https://... (Google Drive, Cloudinary, etc.)"
                    className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#FFC300] focus:ring-4 focus:ring-[#FFC300]/20 transition-all duration-300 text-gray-800"
                  />
                </div>
              </div>
            )}

            {tipo === 'video' && (
              <div>
                <label className="block text-sm font-semibold text-[#0A3D62] mb-1">Duración</label>
                <input
                  type="text"
                  name="duracion"
                  value={formData.duracion}
                  onChange={handleChange}
                  placeholder="Ej: 5:30"
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#FFC300] focus:ring-4 focus:ring-[#FFC300]/20 transition-all duration-300 text-gray-800"
                />
              </div>
            )}

            {/* Fecha y destacado */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#0A3D62] mb-1">
                  <Calendar size={16} className="inline mr-1" />
                  Fecha de publicación
                </label>
                <input
                  type="date"
                  name="fechaPublicacion"
                  value={formData.fechaPublicacion}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#FFC300] focus:ring-4 focus:ring-[#FFC300]/20 transition-all duration-300 text-gray-800"
                />
              </div>
              <div className="flex items-center gap-4 pt-7">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="destacado"
                    checked={formData.destacado}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-gray-300 text-[#FFC300] focus:ring-[#FFC300]"
                  />
                  <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <Star size={16} className="text-[#FFC300]" />
                    Marcar como destacado
                  </span>
                </label>
              </div>
            </div>

            {/* Estado (solo en edición) */}
            {item && (
              <div className="flex items-center gap-4 py-3 px-4 bg-[#FFF9E6] rounded-xl border border-[#FFC300]/30">
                <label className="text-sm font-semibold text-[#0A3D62]">Estado:</label>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, activo: !prev.activo }))}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                    formData.activo ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-md ${
                    formData.activo ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
                <span className={`text-sm font-medium ${formData.activo ? 'text-green-600' : 'text-gray-500'}`}>
                  {formData.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            )}

            {/* Botones */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FFC300] to-[#FFD700] text-[#0A3D62] rounded-xl hover:from-[#0A3D62] hover:to-[#1A4F7A] hover:text-white transition-all duration-300 font-semibold shadow-md disabled:opacity-50"
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