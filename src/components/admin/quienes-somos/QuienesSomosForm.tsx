// src/components/admin/quienes-somos/QuienesSomosForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { Save, Target, Eye, Heart, BookOpen, Award, Loader2 } from 'lucide-react';
import { CloudinaryUploader } from '@/components/admin/cloudinary/CloudinaryUploader';
import type { QuienesSomosData } from '@/types/quienes-somos';

interface QuienesSomosFormProps {
  data: QuienesSomosData;
  onSave: (data: Partial<QuienesSomosData>) => Promise<void>;
  saving: boolean;
}

export function QuienesSomosForm({ data, onSave, saving }: QuienesSomosFormProps) {
  const [formData, setFormData] = useState({
    mision: '',
    vision: '',
    valores: [] as string[],
    nuestraHistoria: '',
    compromiso: '',
    urlImagen: ''
  });
  const [nuevoValor, setNuevoValor] = useState('');

  useEffect(() => {
    if (data) {
      setFormData({
        mision: data.mision || '',
        vision: data.vision || '',
        valores: data.valores || [],
        nuestraHistoria: data.nuestraHistoria || '',
        compromiso: data.compromiso || '',
        urlImagen: data.urlImagen || ''
      });
    }
  }, [data]);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const agregarValor = () => {
    if (nuevoValor.trim()) {
      setFormData(prev => ({
        ...prev,
        valores: [...prev.valores, nuevoValor.trim()]
      }));
      setNuevoValor('');
    }
  };

  const eliminarValor = (index: number) => {
    setFormData(prev => ({
      ...prev,
      valores: prev.valores.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  const handleImageUpload = (asset: { url: string; publicId: string }) => {
    setFormData(prev => ({ ...prev, urlImagen: asset.url }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Imagen */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#FFC300]/20">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-[#0A3D62] rounded-lg flex items-center justify-center">
            <span className="text-white text-sm">🖼️</span>
          </div>
          <h2 className="text-lg font-bold text-[#0A3D62]">Imagen de Cabecera</h2>
        </div>
        
        <CloudinaryUploader
          onUpload={handleImageUpload}
          preset="quienes_somos_preset"
          folder="centro-medico/quienes-somos"
          resourceType="image"
          maxFiles={1}
        />
        
        {formData.urlImagen && (
          <div className="mt-3 relative w-32 h-32 rounded-lg overflow-hidden border-2 border-[#FFC300]/30">
            <img
              src={formData.urlImagen}
              alt="Vista previa"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => handleChange('urlImagen', '')}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Historia */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#FFC300]/20">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-[#0A3D62] rounded-lg flex items-center justify-center">
            <BookOpen size={16} className="text-white" />
          </div>
          <h2 className="text-lg font-bold text-[#0A3D62]">Nuestra Historia</h2>
        </div>
        <textarea
          value={formData.nuestraHistoria}
          onChange={(e) => handleChange('nuestraHistoria', e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border-2 border-[#FFC300]/30 rounded-xl focus:outline-none focus:border-[#FFC300] focus:ring-4 focus:ring-[#FFC300]/20 transition-all duration-300 text-gray-800 resize-none"
          placeholder="Cuenta la historia del centro médico..."
        />
      </div>

      {/* Compromiso */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#FFC300]/20">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-[#0A3D62] rounded-lg flex items-center justify-center">
            <Award size={16} className="text-white" />
          </div>
          <h2 className="text-lg font-bold text-[#0A3D62]">Nuestro Compromiso</h2>
        </div>
        <textarea
          value={formData.compromiso}
          onChange={(e) => handleChange('compromiso', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border-2 border-[#FFC300]/30 rounded-xl focus:outline-none focus:border-[#FFC300] focus:ring-4 focus:ring-[#FFC300]/20 transition-all duration-300 text-gray-800 resize-none"
          placeholder="Describe el compromiso del centro médico..."
        />
      </div>

      {/* Misión y Visión */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#FFC300]/20">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-[#0A3D62] rounded-lg flex items-center justify-center">
              <Target size={16} className="text-white" />
            </div>
            <h2 className="text-lg font-bold text-[#0A3D62]">Misión</h2>
          </div>
          <textarea
            value={formData.mision}
            onChange={(e) => handleChange('mision', e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border-2 border-[#FFC300]/30 rounded-xl focus:outline-none focus:border-[#FFC300] focus:ring-4 focus:ring-[#FFC300]/20 transition-all duration-300 text-gray-800 resize-none"
            placeholder="Nuestra misión..."
          />
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#FFC300]/20">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-[#0A3D62] rounded-lg flex items-center justify-center">
              <Eye size={16} className="text-white" />
            </div>
            <h2 className="text-lg font-bold text-[#0A3D62]">Visión</h2>
          </div>
          <textarea
            value={formData.vision}
            onChange={(e) => handleChange('vision', e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border-2 border-[#FFC300]/30 rounded-xl focus:outline-none focus:border-[#FFC300] focus:ring-4 focus:ring-[#FFC300]/20 transition-all duration-300 text-gray-800 resize-none"
            placeholder="Nuestra visión..."
          />
        </div>
      </div>

      {/* Valores */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#FFC300]/20">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-[#0A3D62] rounded-lg flex items-center justify-center">
            <Heart size={16} className="text-white" />
          </div>
          <h2 className="text-lg font-bold text-[#0A3D62]">Valores</h2>
        </div>
        
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={nuevoValor}
            onChange={(e) => setNuevoValor(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && agregarValor()}
            placeholder="Escribe un valor y presiona Enter"
            className="flex-1 px-4 py-2 border-2 border-[#FFC300]/30 rounded-xl focus:outline-none focus:border-[#FFC300] transition-all duration-300"
          />
          <button
            type="button"
            onClick={agregarValor}
            className="px-4 py-2 bg-[#FFC300] text-[#0A3D62] rounded-xl hover:bg-[#FFD700] transition-colors font-medium"
          >
            Agregar
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {formData.valores.map((valor, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-[#FFF9E6] px-3 py-1.5 rounded-full border border-[#FFC300]/30"
            >
              <span className="text-sm text-gray-700">{valor}</span>
              <button
                type="button"
                onClick={() => eliminarValor(index)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Botón Guardar */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FFC300] to-[#FFD700] text-[#0A3D62] rounded-xl hover:from-[#0A3D62] hover:to-[#1A4F7A] hover:text-white transition-all duration-300 font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Guardando...</span>
            </>
          ) : (
            <>
              <Save size={18} />
              <span>Guardar Cambios</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}