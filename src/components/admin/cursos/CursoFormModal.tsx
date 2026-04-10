// src/components/admin/cursos/CursoFormModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { X, Save, GraduationCap, Calendar, Clock, Users, MapPin, DollarSign, Tag, User } from 'lucide-react';
import { CloudinaryUploader } from '@/components/admin/cloudinary/CloudinaryUploader';
import type { Curso, CursoFormData } from '@/types/cursos';

// Tipos para los datos de las tablas relacionadas
interface Instructor {
  idInstructor: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string | null;
  especialidad: string;
}

interface Categoria {
  idCategoria: number;
  nombreCategoria: string;
}

interface Ubicacion {
  idUbicacion: number;
  nombreUbicacion: string;
  direccionCompleta: string | null;
}

interface Modalidad {
  idModalidad: number;
  nombreModalidad: string;
}

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
  idCategoria: null,
  idUbicacion: null,
  idModalidad: null,
  fechaInicio: '',
  fechaFin: '',
  horario: '',
  dirigidoA: 'Padres',
  cupoMaximo: 20,
  cuposOcupados: 0,
  costo: '0.00',
  urlImagenPortada: '',
  activo: true
};

export function CursoFormModal({ isOpen, onClose, onSave, curso }: CursoFormModalProps) {
  const [formData, setFormData] = useState<CursoFormData>(initialFormData);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof CursoFormData, string>>>({});

  // Estados para los datos de las tablas relacionadas
  const [instructores, setInstructores] = useState<Instructor[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);
  const [modalidades, setModalidades] = useState<Modalidad[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Cargar datos de las tablas relacionadas
  useEffect(() => {
    const fetchRelatedData = async () => {
      setLoadingData(true);
      try {
        const [instructoresRes, categoriasRes, ubicacionesRes, modalidadesRes] = await Promise.all([
          fetch('/api/instructores?admin=true'),
          fetch('/api/categorias'),
          fetch('/api/ubicaciones'),
          fetch('/api/modalidades')
        ]);

        if (instructoresRes.ok) setInstructores(await instructoresRes.json());
        if (categoriasRes.ok) setCategorias(await categoriasRes.json());
        if (ubicacionesRes.ok) setUbicaciones(await ubicacionesRes.json());
        if (modalidadesRes.ok) setModalidades(await modalidadesRes.json());
      } catch (error) {
        console.error('Error cargando datos relacionados:', error);
      } finally {
        setLoadingData(false);
      }
    };

    if (isOpen) {
      fetchRelatedData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (curso) {
      setFormData({
        idCurso: curso.idCurso,
        tituloCurso: curso.tituloCurso || '',
        descripcion: curso.descripcion,
        idInstructor: curso.idInstructor,
        idCategoria: curso.idCategoria,
        idUbicacion: curso.idUbicacion,
        idModalidad: curso.idModalidad,
        fechaInicio: curso.fechaInicio || '',
        fechaFin: curso.fechaFin || '',
        horario: curso.horario,
        dirigidoA: curso.dirigidoA || 'Padres',
        cupoMaximo: curso.cupoMaximo || 20,
        cuposOcupados: curso.cuposOcupados || 0,
        costo: curso.costo || '0.00',
        urlImagenPortada: curso.urlImagenPortada,
        activo: curso.activo !== undefined ? curso.activo : true
      });
    } else {
      setFormData(initialFormData);
    }
    setErrors({});
  }, [curso, isOpen]);

  // Función para convertir CursoFormData a Partial<Curso>
  // IMPORTANTE: Los campos obligatorios en Curso no pueden ser null, solo undefined
  const convertToCursoPartial = (data: CursoFormData): Partial<Curso> => {
    const result: Partial<Curso> = {
      tituloCurso: data.tituloCurso,
      descripcion: data.descripcion === null ? undefined : data.descripcion,
      fechaInicio: data.fechaInicio,
      fechaFin: data.fechaFin,
      dirigidoA: data.dirigidoA,
      cupoMaximo: data.cupoMaximo,
      cuposOcupados: data.cuposOcupados,
      costo: data.costo,
      activo: data.activo,
    };

    // Solo agregar idCurso si existe (para edición)
    if (data.idCurso) {
      result.idCurso = data.idCurso;
    }

    // Campos obligatorios (no pueden ser null)
    if (data.idInstructor !== null && data.idInstructor !== undefined) {
      result.idInstructor = data.idInstructor;
    }
    if (data.idCategoria !== null && data.idCategoria !== undefined) {
      result.idCategoria = data.idCategoria;
    }
    if (data.idModalidad !== null && data.idModalidad !== undefined) {
      result.idModalidad = data.idModalidad;
    }

    // Campos opcionales (pueden ser undefined)
    if (data.idUbicacion !== null && data.idUbicacion !== undefined) {
      result.idUbicacion = data.idUbicacion;
    }
    if (data.horario !== null && data.horario !== undefined && data.horario !== '') {
      result.horario = data.horario;
    }
    if (data.urlImagenPortada !== null && data.urlImagenPortada !== undefined && data.urlImagenPortada !== '') {
      result.urlImagenPortada = data.urlImagenPortada;
    }

    return result;
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CursoFormData, string>> = {};

    if (!formData.tituloCurso.trim()) {
      newErrors.tituloCurso = 'El título del curso es requerido';
    }
    if (!formData.idInstructor) {
      newErrors.idInstructor = 'Selecciona un instructor';
    }
    if (!formData.idCategoria) {
      newErrors.idCategoria = 'Selecciona una categoría';
    }
    if (!formData.idModalidad) {
      newErrors.idModalidad = 'Selecciona una modalidad';
    }
    if (!formData.fechaInicio) {
      newErrors.fechaInicio = 'La fecha de inicio es requerida';
    }
    if (!formData.fechaFin) {
      newErrors.fechaFin = 'La fecha de fin es requerida';
    }
    if (formData.fechaInicio && formData.fechaFin && formData.fechaInicio > formData.fechaFin) {
      newErrors.fechaFin = 'La fecha de fin debe ser posterior a la fecha de inicio';
    }
    if (!formData.cupoMaximo || formData.cupoMaximo <= 0) {
      newErrors.cupoMaximo = 'El cupo máximo debe ser mayor a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSaving(true);
    try {
      // Convertir los datos antes de enviar
      const cursoData = convertToCursoPartial(formData);
      console.log('Enviando datos:', cursoData); // Debug
      await onSave(cursoData);
      onClose();
    } catch (error) {
      console.error('Error al guardar:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Para campos que pueden ser null, si el valor es string vacío, lo dejamos como está
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof CursoFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value ? Number(value) : null;
    setFormData(prev => ({ ...prev, [name]: numValue }));
    
    // Limpiar error del campo si existe
    if (errors[name as keyof CursoFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleImageUpload = (asset: { url: string; publicId: string }) => {
    setFormData(prev => ({ ...prev, urlImagenPortada: asset.url }));
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-9999 overflow-y-auto">
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
                {curso ? 'Editar Curso' : 'Nuevo Curso'}
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
                  {/* eslint-disable-next-line @next/next/no-img-element */}
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
                value={formData.descripcion || ''}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border-2 border-[#FFC300]/30 rounded-xl focus:outline-none focus:border-[#FFC300] focus:ring-4 focus:ring-[#FFC300]/20 transition-all duration-300 text-gray-800 resize-none"
                placeholder="Descripción detallada del curso..."
              />
            </div>

            {/* Instructor y Categoría */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#0A3D62]">
                  Instructor <span className="text-[#FFC300]">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0A3D62]" size={18} />
                  <select
                    name="idInstructor"
                    value={formData.idInstructor || ''}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all duration-300 text-gray-800 bg-white ${
                      errors.idInstructor ? 'border-red-500 focus:ring-red-200' : 'border-[#FFC300]/30 focus:border-[#FFC300] focus:ring-[#FFC300]/20'
                    }`}
                  >
                    <option value="">Selecciona un instructor</option>
                    {instructores.map(instructor => (
                      <option key={instructor.idInstructor} value={instructor.idInstructor}>
                        {instructor.nombre} {instructor.apellidoPaterno} {instructor.apellidoMaterno || ''} - {instructor.especialidad}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.idInstructor && <p className="text-xs text-red-500">{errors.idInstructor}</p>}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#0A3D62]">
                  Categoría <span className="text-[#FFC300]">*</span>
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0A3D62]" size={18} />
                  <select
                    name="idCategoria"
                    value={formData.idCategoria || ''}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all duration-300 text-gray-800 bg-white ${
                      errors.idCategoria ? 'border-red-500 focus:ring-red-200' : 'border-[#FFC300]/30 focus:border-[#FFC300] focus:ring-[#FFC300]/20'
                    }`}
                  >
                    <option value="">Selecciona una categoría</option>
                    {categorias.map(categoria => (
                      <option key={categoria.idCategoria} value={categoria.idCategoria}>
                        {categoria.nombreCategoria}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.idCategoria && <p className="text-xs text-red-500">{errors.idCategoria}</p>}
              </div>
            </div>

            {/* Fechas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#0A3D62]">
                  Fecha de Inicio <span className="text-[#FFC300]">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0A3D62]" size={18} />
                  <input
                    type="date"
                    name="fechaInicio"
                    value={formData.fechaInicio}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all duration-300 text-gray-800 ${
                      errors.fechaInicio ? 'border-red-500 focus:ring-red-200' : 'border-[#FFC300]/30 focus:border-[#FFC300] focus:ring-[#FFC300]/20'
                    }`}
                  />
                </div>
                {errors.fechaInicio && <p className="text-xs text-red-500">{errors.fechaInicio}</p>}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#0A3D62]">
                  Fecha de Fin <span className="text-[#FFC300]">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0A3D62]" size={18} />
                  <input
                    type="date"
                    name="fechaFin"
                    value={formData.fechaFin}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all duration-300 text-gray-800 ${
                      errors.fechaFin ? 'border-red-500 focus:ring-red-200' : 'border-[#FFC300]/30 focus:border-[#FFC300] focus:ring-[#FFC300]/20'
                    }`}
                  />
                </div>
                {errors.fechaFin && <p className="text-xs text-red-500">{errors.fechaFin}</p>}
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
                    value={formData.horario || ''}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border-2 border-[#FFC300]/30 rounded-xl focus:outline-none focus:border-[#FFC300] focus:ring-4 focus:ring-[#FFC300]/20 transition-all duration-300 text-gray-800"
                    placeholder="Ej. Lunes 10:00 - 12:00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#0A3D62]">
                  Modalidad <span className="text-[#FFC300]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0A3D62]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                      <line x1="8" y1="21" x2="16" y2="21"></line>
                      <line x1="12" y1="17" x2="12" y2="21"></line>
                    </svg>
                  </div>
                  <select
                    name="idModalidad"
                    value={formData.idModalidad || ''}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all duration-300 text-gray-800 bg-white ${
                      errors.idModalidad ? 'border-red-500 focus:ring-red-200' : 'border-[#FFC300]/30 focus:border-[#FFC300] focus:ring-[#FFC300]/20'
                    }`}
                  >
                    <option value="">Selecciona una modalidad</option>
                    {modalidades.map(modalidad => (
                      <option key={modalidad.idModalidad} value={modalidad.idModalidad}>
                        {modalidad.nombreModalidad.charAt(0).toUpperCase() + modalidad.nombreModalidad.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.idModalidad && <p className="text-xs text-red-500">{errors.idModalidad}</p>}
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
                <label className="block text-sm font-semibold text-[#0A3D62]">
                  Cupo Máximo <span className="text-[#FFC300]">*</span>
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0A3D62]" size={18} />
                  <input
                    type="number"
                    name="cupoMaximo"
                    value={formData.cupoMaximo}
                    onChange={handleNumberChange}
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all duration-300 text-gray-800 ${
                      errors.cupoMaximo ? 'border-red-500 focus:ring-red-200' : 'border-[#FFC300]/30 focus:border-[#FFC300] focus:ring-[#FFC300]/20'
                    }`}
                    min="1"
                  />
                </div>
                {errors.cupoMaximo && <p className="text-xs text-red-500">{errors.cupoMaximo}</p>}
              </div>
            </div>

            {/* Ubicación y Costo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#0A3D62]">Ubicación</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0A3D62]" size={18} />
                  <select
                    name="idUbicacion"
                    value={formData.idUbicacion || ''}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border-2 border-[#FFC300]/30 rounded-xl focus:outline-none focus:border-[#FFC300] focus:ring-4 focus:ring-[#FFC300]/20 transition-all duration-300 text-gray-800 bg-white"
                  >
                    <option value="">Sin ubicación definida</option>
                    {ubicaciones.map(ubicacion => (
                      <option key={ubicacion.idUbicacion} value={ubicacion.idUbicacion}>
                        {ubicacion.nombreUbicacion}
                      </option>
                    ))}
                  </select>
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
                    min="0"
                    max={formData.cupoMaximo}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Cupos disponibles: {(formData.cupoMaximo || 0) - (formData.cuposOcupados || 0)}
                </p>
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
                disabled={saving || loadingData}
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