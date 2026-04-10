// src/components/public/cards/CursoDetalleModal.tsx
"use client";
import { useState, useEffect, useRef } from 'react';
import { X, Calendar, Clock, MapPin, User, Users, Monitor, DollarSign, AlertCircle, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface CursoDetalleProps {
  id: string | number;
  titulo: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  inscripcionesAbiertas: boolean;
  cupoMaximo: number;
  cupoInscrito: number;
  instructor: string;
  horario: string;
  modalidad: 'Online' | 'Presencial' | 'Híbrido';
  dirigidoA: string;
  imagenSrc?: string;
  costo: number | 'Gratuito';
  ubicacion?: string;
  lugaresDisponibles: number;
}

interface CursoDetalleModalProps {
  isOpen: boolean;
  onClose: () => void;
  curso: CursoDetalleProps;
}

// Función para leer cookies
const getCookie = (name: string): any => {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift();
    if (cookieValue) {
      try {
        return JSON.parse(decodeURIComponent(cookieValue));
      } catch {
        return cookieValue;
      }
    }
  }
  return null;
};

export function CursoDetalleModal({ isOpen, onClose, curso }: CursoDetalleModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [inscribiendo, setInscribiendo] = useState(false);
  const [mensaje, setMensaje] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [usuarioLogueado, setUsuarioLogueado] = useState<{ id: number; nombre: string; email: string; rol: string } | null>(null);
  const [yaInscrito, setYaInscrito] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Verificar si el usuario está logueado y si ya está inscrito
  useEffect(() => {
    if (isOpen) {
      verificarLoginYInscripcion();
    }
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [isOpen, curso.id]);

  const verificarLoginYInscripcion = async () => {
    try {
      // Primero intentar leer la cookie user (más rápido)
      const userCookie = getCookie('user');
      
      if (userCookie && userCookie.id) {
        setUsuarioLogueado({
          id: userCookie.id,
          nombre: userCookie.nombreCompleto || userCookie.nombre,
          email: userCookie.correo,
          rol: userCookie.rol || 'cliente'
        });
        
        // Verificar si ya está inscrito vía API
        const inscripcionRes = await fetch(`/api/cursos/verificar-inscripcion?cursoId=${curso.id}`);
        const inscripcionData = await inscripcionRes.json();
        setYaInscrito(inscripcionData.inscrito);
      } else {
        // Si no hay cookie, intentar verificar vía API
        const authRes = await fetch('/api/auth/verificar');
        const authData = await authRes.json();
        
        if (authData.loggedIn && authData.usuario) {
          setUsuarioLogueado(authData.usuario);
          
          const inscripcionRes = await fetch(`/api/cursos/verificar-inscripcion?cursoId=${curso.id}`);
          const inscripcionData = await inscripcionRes.json();
          setYaInscrito(inscripcionData.inscrito);
        } else {
          setUsuarioLogueado(null);
          setYaInscrito(false);
        }
      }
    } catch (error) {
      console.error('Error verificando login:', error);
      setUsuarioLogueado(null);
      setYaInscrito(false);
    }
  };

  const handleInscribirse = async () => {
    // Verificar si está logueado
    if (!usuarioLogueado) {
      router.push('/acceder?redirect=/cursos');
      return;
    }

    if (yaInscrito) {
      setMensaje({ type: 'error', text: 'Ya estás inscrito en este curso' });
      setTimeout(() => setMensaje(null), 3000);
      return;
    }

    if (!curso.inscripcionesAbiertas) {
      setMensaje({ type: 'error', text: 'Las inscripciones están cerradas' });
      setTimeout(() => setMensaje(null), 3000);
      return;
    }

    if (curso.lugaresDisponibles <= 0) {
      setMensaje({ type: 'error', text: 'No hay cupos disponibles' });
      setTimeout(() => setMensaje(null), 3000);
      return;
    }

    // Cancelar petición anterior si existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Crear nuevo AbortController
    abortControllerRef.current = new AbortController();
    
    setInscribiendo(true);
    setMensaje(null);

    // Timeout de 30 segundos
    const timeoutId = setTimeout(() => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        setInscribiendo(false);
        setMensaje({ type: 'error', text: 'La solicitud está tardando demasiado. Intenta nuevamente.' });
      }
    }, 30000);

    try {
      // Calcular el monto a pagar
      const montoPagado = curso.costo === 'Gratuito' ? '0.00' : (typeof curso.costo === 'number' ? curso.costo.toFixed(2) : String(curso.costo));
      
      // Datos simplificados para la inscripción
      const inscripcionData = {
        cursoId: Number(curso.id)
      };

      console.log('Enviando inscripción para curso:', curso.id);

      const response = await fetch('/api/cursos/inscribir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inscripcionData),
        signal: abortControllerRef.current.signal,
        credentials: 'include' // 🔥 CRÍTICO
      });

      clearTimeout(timeoutId);

      let data;

      const text = await response.text();

      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        console.error('Respuesta NO es JSON:', text);
        data = {};
      }

      console.log('STATUS:', response.status);
      console.log('RAW RESPONSE:', text);
      console.log('PARSED DATA:', data);

      if (response.ok) {
        setMensaje({ type: 'success', text: '¡Inscripción exitosa! Te esperamos en el curso.' });
        setYaInscrito(true);
        // Actualizar el estado del curso localmente
        curso.cupoInscrito++;
        curso.lugaresDisponibles--;
        
        // Cerrar el modal después de 2 segundos
        setTimeout(() => {
          onClose();
          router.refresh();
        }, 2000);
      } else {
        setMensaje({ type: 'error', text: data.error || 'Error al inscribirse' });
        console.error('Error response:', data);
      }
    } catch (error: any) {
      clearTimeout(timeoutId);
      console.error('Error en inscripción:', error);
      
      if (error.name === 'AbortError') {
        setMensaje({ type: 'error', text: 'La solicitud fue cancelada. Intenta nuevamente.' });
      } else {
        setMensaje({ type: 'error', text: error.message || 'Error al procesar la inscripción' });
      }
    } finally {
      setInscribiendo(false);
      abortControllerRef.current = null;
    }
  };

  if (!isOpen) return null;

  const porcentajeLlenado = (curso.cupoInscrito / curso.cupoMaximo) * 100;
  const costoMostrar = curso.costo === 'Gratuito' ? 'Gratis' : `$${curso.costo}`;

  return (
    <div className="fixed inset-0 z-[99999] overflow-y-auto">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <h2 className="text-xl font-bold text-[#0A3D62]">Detalle del Curso</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X size={22} className="text-gray-500" />
            </button>
          </div>

          {/* Contenido */}
          <div className="p-6">
            {/* Imagen */}
            {curso.imagenSrc && (
              <div className="relative h-64 rounded-xl overflow-hidden mb-6">
                <Image 
                  src={curso.imagenSrc} 
                  alt={curso.titulo} 
                  fill 
                  className="object-cover" 
                />
              </div>
            )}

            {/* Título */}
            <h1 className="text-2xl font-bold text-[#0A3D62] mb-4">{curso.titulo}</h1>

            {/* Grid de información */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg">
                <Calendar size={20} className="text-[#FFC300]" />
                <div>
                  <p className="text-xs text-gray-600">Fechas</p>
                  <p className="text-sm font-medium text-gray-800">{curso.fechaInicio} - {curso.fechaFin}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg">
                <Clock size={20} className="text-[#FFC300]" />
                <div>
                  <p className="text-xs text-gray-600">Horario</p>
                  <p className="text-sm font-medium text-gray-800">{curso.horario}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg">
                <User size={20} className="text-[#FFC300]" />
                <div>
                  <p className="text-xs text-gray-600">Instructor</p>
                  <p className="text-sm font-medium text-gray-800">{curso.instructor}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg">
                {curso.modalidad === 'Online' ? <Monitor size={20} className="text-[#FFC300]" /> : <MapPin size={20} className="text-[#FFC300]" />}
                <div>
                  <p className="text-xs text-gray-600">Modalidad</p>
                  <p className="text-sm font-medium text-gray-800">{curso.modalidad}</p>
                  {curso.ubicacion && <p className="text-xs text-gray-500">{curso.ubicacion}</p>}
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg">
                <Users size={20} className="text-[#FFC300]" />
                <div>
                  <p className="text-xs text-gray-600">Cupo disponible</p>
                  <p className={`text-sm font-medium ${curso.lugaresDisponibles < 5 ? 'text-red-600' : 'text-green-600'}`}>
                    {curso.lugaresDisponibles} de {curso.cupoMaximo} lugares
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg">
                <DollarSign size={20} className="text-[#FFC300]" />
                <div>
                  <p className="text-xs text-gray-600">Costo</p>
                  <p className="text-sm font-bold text-gray-800">{costoMostrar}</p>
                </div>
              </div>
            </div>

            {/* Barra de progreso */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-700">Ocupación del curso</span>
                <span className="font-semibold text-[#0A3D62]">{porcentajeLlenado.toFixed(0)}%</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#FFC300] to-[#FFD700] transition-all duration-300"
                  style={{ width: `${porcentajeLlenado}%` }}
                ></div>
              </div>
            </div>

            {/* Descripción */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#0A3D62] mb-3">Descripción del curso</h3>
              <p className="text-gray-700 leading-relaxed">{curso.descripcion}</p>
            </div>

            {/* Mensaje de alerta */}
            {mensaje && (
              <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                mensaje.type === 'success' ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'
              }`}>
                {mensaje.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                <span>{mensaje.text}</span>
              </div>
            )}

            {/* Botón de inscripción */}
            <div className="border-t pt-6">
              {!usuarioLogueado ? (
                <div className="text-center p-4 bg-yellow-100 rounded-lg">
                  <p className="text-gray-800 mb-3">Para inscribirte necesitas iniciar sesión</p>
                  <button
                    onClick={() => router.push('/acceder?redirect=/cursos')}
                    className="px-6 py-2 bg-[#0A3D62] text-white rounded-lg hover:bg-[#1A4F7A] transition-colors"
                  >
                    Iniciar sesión
                  </button>
                </div>
              ) : yaInscrito ? (
                <div className="text-center p-4 bg-green-100 rounded-lg">
                  <CheckCircle size={24} className="text-green-600 mx-auto mb-2" />
                  <p className="text-green-800 font-semibold">Ya estás inscrito en este curso</p>
                  <p className="text-green-700 text-sm mt-1">Te esperamos en la fecha indicada</p>
                </div>
              ) : !curso.inscripcionesAbiertas ? (
                <div className="text-center p-4 bg-red-100 rounded-lg">
                  <AlertCircle size={24} className="text-red-600 mx-auto mb-2" />
                  <p className="text-red-800 font-semibold">Inscripciones cerradas</p>
                  <p className="text-red-700 text-sm mt-1">El curso ya no acepta más inscripciones</p>
                </div>
              ) : curso.lugaresDisponibles === 0 ? (
                <div className="text-center p-4 bg-red-100 rounded-lg">
                  <AlertCircle size={24} className="text-red-600 mx-auto mb-2" />
                  <p className="text-red-800 font-semibold">Cupo completo</p>
                  <p className="text-red-700 text-sm mt-1">No hay lugares disponibles</p>
                </div>
              ) : (
                <button
                  onClick={handleInscribirse}
                  disabled={inscribiendo}
                  className="w-full py-3 bg-gradient-to-r from-[#FFC300] to-[#FFD700] text-[#0A3D62] rounded-xl hover:from-[#0A3D62] hover:to-[#1A4F7A] hover:text-white transition-all duration-300 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {inscribiendo ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-[#0A3D62] border-t-transparent rounded-full animate-spin" />
                      <span>Procesando...</span>
                    </div>
                  ) : (
                    'Inscribirme ahora'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}