// src/components/public/cards/CursoDetalleModal.tsx
"use client";
import { useState, useEffect, useRef } from 'react';
import { 
  X, Calendar, Clock, MapPin, User, Users, Monitor, 
  DollarSign, AlertCircle, CheckCircle, ArrowLeft, CreditCard 
} from 'lucide-react';
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
  
  // Estados originales
  const [loading, setLoading] = useState(false);
  const [inscribiendo, setInscribiendo] = useState(false);
  const [mensaje, setMensaje] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [usuarioLogueado, setUsuarioLogueado] = useState<{ id: number; nombre: string; email: string; rol: string } | null>(null);
  const [yaInscrito, setYaInscrito] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // NUEVOS ESTADOS PARA EL FORMULARIO
  const [view, setView] = useState<'detalle' | 'formulario'>('detalle');
  const [formData, setFormData] = useState({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    edad: '',
    sexo: '',
    paraQuien: '',
    metodoPago: 'tarjeta',
    numeroTarjeta: '',
    titularTarjeta: '',
    fechaVencimiento: '',
    cvv: ''
  });

  useEffect(() => {
    if (isOpen) {
      verificarLoginYInscripcion();
      setView('detalle'); // Resetear vista al abrir
      setFormData({
        nombre: '', apellidoPaterno: '', apellidoMaterno: '', edad: '',
        sexo: '', paraQuien: '', metodoPago: 'tarjeta', numeroTarjeta: '',
        titularTarjeta: '', fechaVencimiento: '', cvv: ''
      });
      setMensaje(null);
    }
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [isOpen, curso.id]);

  const verificarLoginYInscripcion = async () => {
    try {
      const userCookie = getCookie('user');
      
      if (userCookie && userCookie.id) {
        setUsuarioLogueado({
          id: userCookie.id,
          nombre: userCookie.nombreCompleto || userCookie.nombre,
          email: userCookie.correo,
          rol: userCookie.rol || 'cliente'
        });
        
        const inscripcionRes = await fetch(`/api/cursos/verificar-inscripcion?cursoId=${curso.id}`);
        const inscripcionData = await inscripcionRes.json();
        setYaInscrito(inscripcionData.inscrito);
      } else {
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

  // PASO 1: Validaciones antes de mostrar el formulario
  const handlePrepararInscripcion = () => {
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

    // Si pasa las validaciones, cambiamos a la vista del formulario
    setView('formulario');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // PASO 2: Ejecutar la inscripción tras llenar el formulario
  const confirmarInscripcion = async (e: React.FormEvent) => {
    e.preventDefault();

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    
    setInscribiendo(true);
    setMensaje(null);

    const timeoutId = setTimeout(() => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        setInscribiendo(false);
        setMensaje({ type: 'error', text: 'La solicitud está tardando demasiado. Intenta nuevamente.' });
      }
    }, 30000);

    try {
      // Aunque tenemos los datos del formulario (formData),
      // enviamos la misma estructura que ya acepta tu backend actual.
      const inscripcionData = {
        cursoId: Number(curso.id)
        // En el futuro puedes agregar: datosAdicionales: formData
      };

      const response = await fetch('/api/cursos/inscribir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inscripcionData),
        signal: abortControllerRef.current.signal,
        credentials: 'include'
      });

      clearTimeout(timeoutId);
      const text = await response.text();
      let data;
      try { data = text ? JSON.parse(text) : {}; } catch (e) { data = {}; }

      if (response.ok) {
        setMensaje({ type: 'success', text: '¡Inscripción exitosa! Te esperamos en el curso.' });
        setYaInscrito(true);
        curso.cupoInscrito++;
        curso.lugaresDisponibles--;
        
        setTimeout(() => {
          onClose();
          router.refresh();
        }, 2500);
      } else {
        setMensaje({ type: 'error', text: data.error || 'Error al inscribirse' });
      }
    } catch (error: any) {
      clearTimeout(timeoutId);
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

  const handleClose = () => {
    setView('detalle');
    onClose();
  };

  if (!isOpen) return null;

  const porcentajeLlenado = (curso.cupoInscrito / curso.cupoMaximo) * 100;
  const costoMostrar = curso.costo === 'Gratuito' ? 'Gratis' : `$${curso.costo}`;

  return (
    <div className="fixed inset-0 z-[99999] overflow-y-auto">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={handleClose} />
      
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transition-all duration-300">
          
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              {view === 'formulario' && (
                <button onClick={() => setView('detalle')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <ArrowLeft size={20} className="text-gray-600" />
                </button>
              )}
              <h2 className="text-xl font-bold text-[#0A3D62]">
                {view === 'detalle' ? 'Detalle del Curso' : 'Registro e Inscripción'}
              </h2>
            </div>
            <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X size={22} className="text-gray-500" />
            </button>
          </div>

          {/* VISTA 1: DETALLES DEL CURSO */}
          {view === 'detalle' && (
            <div className="p-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              {curso.imagenSrc && (
                <div className="relative h-64 rounded-xl overflow-hidden mb-6">
                  <Image src={curso.imagenSrc} alt={curso.titulo} fill className="object-cover" />
                </div>
              )}

              <h1 className="text-2xl font-bold text-[#0A3D62] mb-4">{curso.titulo}</h1>

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

              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-700">Ocupación del curso</span>
                  <span className="font-semibold text-[#0A3D62]">{porcentajeLlenado.toFixed(0)}%</span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#FFC300] to-[#FFD700] transition-all duration-300" style={{ width: `${porcentajeLlenado}%` }}></div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#0A3D62] mb-3">Descripción del curso</h3>
                <p className="text-gray-700 leading-relaxed">{curso.descripcion}</p>
              </div>

              {mensaje && (
                <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${mensaje.type === 'success' ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'}`}>
                  {mensaje.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                  <span>{mensaje.text}</span>
                </div>
              )}

              <div className="border-t pt-6">
                {!usuarioLogueado ? (
                  <div className="text-center p-4 bg-yellow-100 rounded-lg">
                    <p className="text-gray-800 mb-3">Para inscribirte necesitas iniciar sesión</p>
                    <button onClick={() => router.push('/acceder?redirect=/cursos')} className="px-6 py-2 bg-[#0A3D62] text-white rounded-lg hover:bg-[#1A4F7A] transition-colors">
                      Iniciar sesión
                    </button>
                  </div>
                ) : yaInscrito ? (
                  <div className="text-center p-4 bg-green-100 rounded-lg">
                    <CheckCircle size={24} className="text-green-600 mx-auto mb-2" />
                    <p className="text-green-800 font-semibold">Ya estás inscrito en este curso</p>
                  </div>
                ) : !curso.inscripcionesAbiertas ? (
                  <div className="text-center p-4 bg-red-100 rounded-lg">
                    <AlertCircle size={24} className="text-red-600 mx-auto mb-2" />
                    <p className="text-red-800 font-semibold">Inscripciones cerradas</p>
                  </div>
                ) : curso.lugaresDisponibles === 0 ? (
                  <div className="text-center p-4 bg-red-100 rounded-lg">
                    <AlertCircle size={24} className="text-red-600 mx-auto mb-2" />
                    <p className="text-red-800 font-semibold">Cupo completo</p>
                  </div>
                ) : (
                  <button
                    onClick={handlePrepararInscripcion}
                    className="w-full py-3 bg-gradient-to-r from-[#FFC300] to-[#FFD700] text-[#0A3D62] rounded-xl hover:from-[#0A3D62] hover:to-[#1A4F7A] hover:text-white transition-all duration-300 font-semibold text-lg"
                  >
                    Inscribirme ahora
                  </button>
                )}
              </div>
            </div>
          )}

          {/* VISTA 2: FORMULARIO DE INSCRIPCIÓN */}
          {view === 'formulario' && (
            <div className="p-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                <h3 className="font-bold text-[#0A3D62]">{curso.titulo}</h3>
                <p className="text-sm text-blue-800 mt-1">Completa los datos de la persona que tomará el curso y procede al pago para asegurar tu lugar.</p>
              </div>

              <form onSubmit={confirmarInscripcion} className="space-y-6">
                
                {/* Sección: Datos Personales */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">Datos del Inscrito</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nombre(s) *</label>
                      <input required type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A3D62] focus:border-transparent outline-none bg-white" placeholder="Ej. Juan" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Para quién es el curso *</label>
                      <select required name="paraQuien" value={formData.paraQuien} onChange={handleInputChange} className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A3D62] focus:border-transparent outline-none bg-white">
                        <option value="" className="text-gray-500">Selecciona una opción</option>
                        <option value="mi" className="text-black">Para mí</option>
                        <option value="hijo" className="text-black">Para mi hijo/a</option>
                        <option value="otro" className="text-black">Para otra persona</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Apellido Paterno *</label>
                      <input required type="text" name="apellidoPaterno" value={formData.apellidoPaterno} onChange={handleInputChange} className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A3D62] focus:border-transparent outline-none bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Apellido Materno</label>
                      <input type="text" name="apellidoMaterno" value={formData.apellidoMaterno} onChange={handleInputChange} className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A3D62] focus:border-transparent outline-none bg-white" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Edad *</label>
                      <input required type="number" min="1" max="100" name="edad" value={formData.edad} onChange={handleInputChange} className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A3D62] focus:border-transparent outline-none bg-white" />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sexo *</label>
                      <select required name="sexo" value={formData.sexo} onChange={handleInputChange} className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A3D62] focus:border-transparent outline-none bg-white">
                        <option value="" className="text-gray-500">Selecciona</option>
                        <option value="M" className="text-black">Masculino</option>
                        <option value="F" className="text-black">Femenino</option>
                        <option value="O" className="text-black">Otro</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Sección: Pago Mockup */}
                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h4 className="text-lg font-semibold text-gray-800">Método de Pago</h4>
                    <span className="font-bold text-[#0A3D62] text-lg">Total: {costoMostrar}</span>
                  </div>
                  
                  {curso.costo !== 'Gratuito' && curso.costo > 0 ? (
                    <>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="metodoPago" value="tarjeta" checked={formData.metodoPago === 'tarjeta'} onChange={handleInputChange} className="w-4 h-4 text-[#0A3D62]" />
                          <span className="text-sm font-medium text-black">Tarjeta de Crédito / Débito</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="metodoPago" value="transferencia" checked={formData.metodoPago === 'transferencia'} onChange={handleInputChange} className="w-4 h-4 text-[#0A3D62]" />
                          <span className="text-sm font-medium text-black">Transferencia SPEI</span>
                        </label>
                      </div>

                      {formData.metodoPago === 'tarjeta' && (
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4">
                          <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <CreditCard size={20} /> <span className="text-sm font-medium text-black">Pago seguro (Simulación)</span>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Titular de la tarjeta</label>
                            <input required type="text" name="titularTarjeta" value={formData.titularTarjeta} onChange={handleInputChange} placeholder="Como aparece en la tarjeta" className="w-full px-3 py-2 text-black text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-[#0A3D62] outline-none bg-white" />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Número de tarjeta</label>
                            <input required type="text" maxLength={16} name="numeroTarjeta" value={formData.numeroTarjeta} onChange={handleInputChange} placeholder="0000 0000 0000 0000" className="w-full px-3 py-2 text-black text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-[#0A3D62] outline-none font-mono bg-white" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Vencimiento (MM/AA)</label>
                              <input required type="text" maxLength={5} name="fechaVencimiento" value={formData.fechaVencimiento} onChange={handleInputChange} placeholder="12/25" className="w-full px-3 py-2 text-black text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-[#0A3D62] outline-none font-mono bg-white" />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">CVV</label>
                              <input required type="password" maxLength={4} name="cvv" value={formData.cvv} onChange={handleInputChange} placeholder="***" className="w-full px-3 py-2 text-black text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-[#0A3D62] outline-none font-mono bg-white" />
                            </div>
                          </div>
                        </div>
                      )}

                      {formData.metodoPago === 'transferencia' && (
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-center">
                          <p className="text-sm text-black">Al confirmar, se te proporcionará la CLABE interbancaria para realizar el depósito.</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="bg-green-50 p-4 rounded-xl border border-green-200 text-center">
                      <p className="text-green-800 font-medium text-black">Este curso es gratuito. No se requiere información de pago.</p>
                    </div>
                  )}
                </div>

                {mensaje && (
                  <div className={`p-4 rounded-lg flex items-center gap-3 ${mensaje.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {mensaje.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    <span>{mensaje.text}</span>
                  </div>
                )}

                <div className="border-t pt-6 mt-6 flex gap-4">
                  <button type="button" onClick={() => setView('detalle')} className="w-1/3 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium">
                    Cancelar
                  </button>
                  <button type="submit" disabled={inscribiendo} className="w-2/3 py-3 bg-[#0A3D62] text-white rounded-xl hover:bg-[#1A4F7A] transition-colors font-semibold text-lg flex justify-center items-center gap-2 disabled:opacity-70">
                    {inscribiendo ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Procesando...</span>
                      </>
                    ) : (
                      'Confirmar e Inscribir'
                    )}
                  </button>
                </div>

              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}