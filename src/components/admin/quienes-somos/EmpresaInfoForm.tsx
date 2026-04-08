// src/components/admin/empresa/EmpresaInfoForm.tsx
"use client";

import { useState, useEffect } from 'react';
import { Loader2, Building, MapPin, Phone, Mail, Facebook, Instagram, Clock, Headphones, Save } from 'lucide-react';
import { CloudinaryUploader } from '@/components/admin/cloudinary/CloudinaryUploader';

interface EmpresaInfo {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  correo: string;
  facebook: string | null;
  instagram: string | null;
  horario: string;
  logoUrl: string | null;
  correoSoporte: string | null;
}

export function EmpresaInfoForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    correo: '',
    facebook: '',
    instagram: '',
    horario: '',
    logoUrl: '',
    correoSoporte: ''
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/empresa-info');
      if (res.ok) {
        const data = await res.json();
        // 👈 Asegurar que los valores null se conviertan a string vacío
        setFormData({
          nombre: data.nombre || '',
          direccion: data.direccion || '',
          telefono: data.telefono || '',
          correo: data.correo || '',
          facebook: data.facebook || '',
          instagram: data.instagram || '',
          horario: data.horario || '',
          logoUrl: data.logoUrl || '',
          correoSoporte: data.correoSoporte || ''
        });
      }
    } catch (error) {
      console.error('Error cargando datos de empresa:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (asset: { url: string; publicId: string }) => {
    setFormData(prev => ({ ...prev, logoUrl: asset.url }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/empresa-info', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        alert('Información de la empresa guardada correctamente');
        loadData();
      } else {
        const error = await res.json();
        alert(error.error || 'Error al guardar');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#FFC300]/20">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="animate-spin" size={32} color="#0A3D62" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-[#FFC300]/20">
      <div className="px-6 py-4 bg-gradient-to-r from-[#0A3D62] to-[#1A4F7A]">
        <div className="flex items-center gap-2">
          <Building size={20} className="text-white" />
          <h2 className="text-white font-bold text-lg">Información de la Empresa</h2>
        </div>
        <p className="text-white/70 text-sm mt-1">Datos de contacto y redes sociales</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* Logo */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-[#0A3D62]">
            Logo de la Empresa
          </label>
          <CloudinaryUploader
            onUpload={handleImageUpload}
            preset="empresa_preset"
            folder="centro-medico/empresa"
            resourceType="image"
            maxFiles={1}
          />
          {formData.logoUrl && (
            <div className="mt-2">
              <img src={formData.logoUrl} alt="Logo preview" className="h-20 w-auto border rounded-lg p-1 bg-white" />
            </div>
          )}
        </div>

        {/* Nombre */}
        <div>
          <label className="block text-sm font-semibold text-[#0A3D62] mb-1">
            <Building size={16} className="inline mr-1" />
            Nombre del Centro
          </label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#FFC300] focus:ring-4 focus:ring-[#FFC300]/20 transition-all duration-300 text-gray-800"
            required
          />
        </div>

        {/* Dirección */}
        <div>
          <label className="block text-sm font-semibold text-[#0A3D62] mb-1">
            <MapPin size={16} className="inline mr-1" />
            Dirección
          </label>
          <textarea
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            rows={2}
            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#FFC300] focus:ring-4 focus:ring-[#FFC300]/20 transition-all duration-300 text-gray-800 resize-none"
            required
          />
        </div>

        {/* Teléfono y Correo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#0A3D62] mb-1">
              <Phone size={16} className="inline mr-1" />
              Teléfono
            </label>
            <input
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#FFC300] focus:ring-4 focus:ring-[#FFC300]/20 transition-all duration-300 text-gray-800"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#0A3D62] mb-1">
              <Mail size={16} className="inline mr-1" />
              Correo Principal
            </label>
            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#FFC300] focus:ring-4 focus:ring-[#FFC300]/20 transition-all duration-300 text-gray-800"
              required
            />
          </div>
        </div>

        {/* Correo Soporte */}
        <div>
          <label className="block text-sm font-semibold text-[#0A3D62] mb-1">
            <Headphones size={16} className="inline mr-1" />
            Correo de Soporte
          </label>
          <input
            type="email"
            name="correoSoporte"
            value={formData.correoSoporte}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#FFC300] focus:ring-4 focus:ring-[#FFC300]/20 transition-all duration-300 text-gray-800"
            placeholder="soporte@centromedico.com"
          />
        </div>

        {/* Redes Sociales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#0A3D62] mb-1">
              <Facebook size={16} className="inline mr-1" />
              Facebook
            </label>
            <input
              type="text"
              name="facebook"
              value={formData.facebook}
              onChange={handleChange}
              placeholder="https://facebook.com/tu-pagina"
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#FFC300] focus:ring-4 focus:ring-[#FFC300]/20 transition-all duration-300 text-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#0A3D62] mb-1">
              <Instagram size={16} className="inline mr-1" />
              Instagram
            </label>
            <input
              type="text"
              name="instagram"
              value={formData.instagram}
              onChange={handleChange}
              placeholder="https://instagram.com/tu-perfil"
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#FFC300] focus:ring-4 focus:ring-[#FFC300]/20 transition-all duration-300 text-gray-800"
            />
          </div>
        </div>

        {/* Horario */}
        <div>
          <label className="block text-sm font-semibold text-[#0A3D62] mb-1">
            <Clock size={16} className="inline mr-1" />
            Horario de Atención
          </label>
          <input
            type="text"
            name="horario"
            value={formData.horario}
            onChange={handleChange}
            placeholder="Lunes a Viernes: 8:00 - 20:00, Sábados: 8:00 - 14:00"
            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#FFC300] focus:ring-4 focus:ring-[#FFC300]/20 transition-all duration-300 text-gray-800"
            required
          />
        </div>

        {/* Botón Guardar */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FFC300] to-[#FFD700] text-[#0A3D62] rounded-xl hover:from-[#0A3D62] hover:to-[#1A4F7A] hover:text-white transition-all duration-300 font-semibold shadow-md disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Guardar Información</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}