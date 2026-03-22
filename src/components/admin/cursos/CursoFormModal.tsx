// src/components/admin/cursos/CursoFormModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { X, Save, GraduationCap, Calendar, Clock, Users, MapPin, DollarSign, Tag, User } from 'lucide-react';
import { CloudinaryUploader } from '@/components/admin/cloudinary/CloudinaryUploader';
import type { Curso, CursoFormData } from '@/types/cursos';

interface CursoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cursoData: Partial<Curso>) => Promise<void>;
  curso: Curso | null;
}

const initialFormData: CursoFormData = {
  tituloCurso: '',
  descripcion: '',
  idInstructor: null,
  categoria: 'General',
  fechaInicio: '',
  fechaFin: '',
  horario: '',
  modalidad: 'Presencial',
  dirigidoA: 'Padres',
  cupoMaximo: 20,
  cuposOcupados: 0,
  ubicacion: 'Centro Médico Pichardo',
  costo: '0.00',
  urlImagenPortada: '',
  activo: true
};

export function CursoFormModal({ isOpen, onClose, onSave, curso }: CursoFormModalProps) {
  const [formData, setFormData] = useState<CursoFormData>(initialFormData);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof CursoFormData, string>>>({});

  useEffect(() => {
    if (curso) {
      setFormData({
        idCurso: curso.idCurso,
        tituloCurso: curso.tituloCurso || '',
        descripcion: curso.descripcion || '',
        idInstructor: curso.idInstructor || null,
        categoria: curso.categoria || 'General',
        fechaInicio: curso.fechaInicio || '',
        fechaFin: curso.fechaFin || '',
        horario: curso.horario || '',
        modalidad: curso.modalidad || 'Presencial',
        dirigidoA: curso.dirigidoA || 'Padres',
        cupoMaximo: curso.cupoMaximo || 20,
        cuposOcupados: curso.cuposOcupados || 0,
        ubicacion: curso.ubicacion || 'Centro Médico Pichardo',
        costo: curso.costo || '0.00',
        urlImagenPortada: curso.urlImagenPortada || '',
        activo: curso.activo
      });
    } else {
      setFormData(initialFormData);
    }
    setErrors({});
  }, [curso, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CursoFormData, string>> = {};

    if (!formData.tituloCurso.trim()) {
      newErrors.tituloCurso = 'El título del curso es requerido';
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
    if (errors[name as keyof CursoFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value ? Number(value) : 0 }));
  };

  const handleImageUpload = (asset: { url: string; publicId: string }) => {
    setFormData(prev => ({ ...prev, urlImagenPortada: asset.url }));
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border-t-4 border-[#FFC300]">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-[#FFC300]/20 px-6 py-5 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0A3D62] rounded-xl flex items-center justify-center">
                <GraduationCap size={20} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-[#0A3D62]">
                {curso ? '✏️ Editar Curso' : '➕ Nuevo Curso'}
              </h2>
            </div>
            <button onClick={handleClose} className="p-2 hover:bg-[#FFC300]/20 rounded-lg transition-colors">
              <X size={22} className="text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Imagen */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-[#0A3D62]">Imagen del Curso</label>
              <CloudinaryUploader
                onUpload={handleImageUpload}
                preset="cursos_preset"
                folder="centro-medico/cursos"
                resourceType="image"
                maxFiles={1}
              />
              {formData.urlImagenPortada && (
                <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-[#FFC300]/30">
                  <img src={formData.urlImagenPortada} alt="Vista previa" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, urlImagenPortada: '' }))}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* Título */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#0A3D62]">
                Título del Curso <span className="text-[#FFC300]">*</span>
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0A3D62]" size={18} />
                <input
                  type="text"
                  name="tituloCurso"
                  value={formData.tituloCurso}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all duration-300 text-gray-800 ${
                    errors.tituloCurso ? 'border-red-500 focus:ring-red-200' : 'border-[#FFC300]/30 focus:border-[#FFC300] focus:ring-[#FFC300]/20'
                  }`}
                  placeholder="Ej. Taller de Estimulación Temprana"
                />
              </div>
              {errors.tituloCurso && <p className="text-xs text-red-500">{errors.tituloCurso}</p>}
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#0A3D62]">Descripción</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border-2 border-[#FFC300]/30 rounded-xl focus:outline-none focus:border-[#FFC300] focus:ring-4 focus:ring-[#FFC300]/20 transition-all duration-300 text-gray-800 resize-none"
                placeholder="Descripción detallada del curso..."
              />
            </div>

            {/* Instructor y Categoría */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#0A3D62]">Instructor (ID)</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0A3D62]" size={18} />
                  <input
                    type="number"
                    name="idInstructor"
                    value={formData.idInstructor || ''}
                    onChange={handleNumberChange}
                    className="w-full pl-10 pr-4 py-3 border-2 border-[#FFC300]/30 rounded-xl focus:outline-none focus:border-[#FFC300] focus:ring-4 focus:ring-[#FFC300]/20 text-gray-800"
                    placeholder="ID del instructor"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#0A3D62]">Categoría</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0A3D62]" size={18} />
                  <input
                    type="text"
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border-2 border-[#FFC300]/30 rounded-xl focus:outline-none focus:border-[#FFC300] focus:ring-4 focus:ring-[#FFC300]/20 text-gray-800"
                    placeholder="Ej. Desarrollo Infantil"
                  />
                </div>
              </div>
            </div>

            {/* Fechas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#0A3D62]">Fecha de Inicio</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0A3D62]" size={18} />
                  <input
                    type="date"
                    name="fechaInicio"
                    value={formData.fechaInicio}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border-2 border-[#FFC300]/30 rounded-xl focus:outline-none focus:border-[#FFC300] focus:ring-4 focus:ring-[#FFC300]/20 text-gray-800"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#0A3D62]">Fecha de Fin</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0A3D62]" size={18} />
                  <input
                    type="date"
                    name="fechaFin"
                    value={formData.fechaFin}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border-2 border-[#FFC300]/30 rounded-xl focus:outline-none focus:border-[#FFC300] focus:ring-4 focus:ring-[#FFC300]/20 text-gray-800"
                  />
                </div>
              </div>
            </div>

            {/* Horario y Modalidad */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#0A3D62]">Horario</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0A3D62]" size={18} />
                  <input
                    type="text"
                    name="horario"
                    value={formData.horario}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border-2 border-[#FFC300]/30 rounded-xl focus:outline-none focus:border-[#FFC300] focus:ring-4 focus:ring-[#FFC300]/20 text-gray-800"
                    placeholder="Ej. Lunes 10:00 - 12:00"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#0A3D62]">Modalidad</label>
                <select
                  name="modalidad"
                  value={formData.modalidad}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-[#FFC300]/30 rounded-xl focus:outline-none focus:border-[#FFC300] focus:ring-4 focus:ring-[#FFC300]/20 text-gray-800 bg-white"
                >
                  <option value="Presencial">Presencial</option>
                  <option value="Online">Online</option>
                  <option value="Híbrido">Híbrido</option>
                </select>
              </div>
            </div>

            {/* Dirigido a y Cupos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#0A3D62]">Dirigido a</label>
                <select
                  name="dirigidoA"
                  value={formData.dirigidoA}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-[#FFC300]/30 rounded-xl focus:outline-none focus:border-[#FFC300] focus:ring-4 focus:ring-[#FFC300]/20 text-gray-800 bg-white"
                >
                  <option value="Padres">Padres</option>
                  <option value="Niños">Niños</option>
                  <option value="Familia">Familia</option>
                  <option value="Adolescentes">Adolescentes</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#0A3D62]">Cupo Máximo</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0A3D62]" size={18} />
                  <input
                    type="number"
                    name="cupoMaximo"
                    value={formData.cupoMaximo}
                    onChange={handleNumberChange}
                    className="w-full pl-10 pr-4 py-3 border-2 border-[#FFC300]/30 rounded-xl focus:outline-none focus:border-[#FFC300] focus:ring-4 focus:ring-[#FFC300]/20 text-gray-800"
                  />
                </div>
              </div>
            </div>

            {/* Ubicación y Costo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#0A3D62]">Ubicación</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0A3D62]" size={18} />
                  <input
                    type="text"
                    name="ubicacion"
                    value={formData.ubicacion}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border-2 border-[#FFC300]/30 rounded-xl focus:outline-none focus:border-[#FFC300] focus:ring-4 focus:ring-[#FFC300]/20 text-gray-800"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#0A3D62]">Costo</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0A3D62]" size={18} />
                  <input
                    type="text"
                    name="costo"
                    value={formData.costo}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border-2 border-[#FFC300]/30 rounded-xl focus:outline-none focus:border-[#FFC300] focus:ring-4 focus:ring-[#FFC300]/20 text-gray-800"
                    placeholder="0.00 (gratuito) o monto"
                  />
                </div>
              </div>
            </div>

            {/* Cupos ocupados (solo visible en edición) */}
            {curso && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#0A3D62]">Cupos Ocupados</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0A3D62]" size={18} />
                  <input
                    type="number"
                    name="cuposOcupados"
                    value={formData.cuposOcupados}
                    onChange={handleNumberChange}
                    className="w-full pl-10 pr-4 py-3 border-2 border-[#FFC300]/30 rounded-xl focus:outline-none focus:border-[#FFC300] focus:ring-4 focus:ring-[#FFC300]/20 text-gray-800"
                  />
                </div>
              </div>
            )}

            {/* Estado (solo visible en edición) */}
            {curso && (
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
                    <span>Guardar Curso</span>
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