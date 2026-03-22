// src/components/public/auth/RegisterForm.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, Loader2, User, Phone, CheckCircle, XCircle, Calendar, Users } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { RegisterSocialButtons } from './RegisterSocialButtons';
import { VerifyCodeForm } from './VerifyCodeForm';

interface RegisterFormProps {
  onRegistroExitoso?: () => void; // 👈 Nueva prop
}

interface RegisterData {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  edad: string;
  sexo: 'masculino' | 'femenino' | 'otro' | '';
  correo: string;
  telefono: string;
  contrasena: string;
  confirmarContrasena: string;
}

interface Errores {
  nombre?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  edad?: string;
  sexo?: string;
  correo?: string;
  telefono?: string;
  contrasena?: string;
  confirmarContrasena?: string;
  terminos?: string;
}

export function RegisterForm({ onRegistroExitoso }: RegisterFormProps = {}) {
  const router = useRouter();
  const [registerData, setRegisterData] = useState<RegisterData>({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    edad: '',
    sexo: '',
    correo: '',
    telefono: '',
    contrasena: '',
    confirmarContrasena: ''
  });
  const [errores, setErrores] = useState<Errores>({});
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [mostrarConfirmContrasena, setMostrarConfirmContrasena] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [emailDisponible, setEmailDisponible] = useState<boolean | null>(null);
  const [verificandoEmail, setVerificandoEmail] = useState(false);
  const [step, setStep] = useState<'form' | 'verify'>('form');
  const [emailRegistro, setEmailRegistro] = useState('');
  const [nombreRegistro, setNombreRegistro] = useState('');

  // Estados para campos enfocados
  const [nombreFocused, setNombreFocused] = useState(false);
  const [apellidoPaternoFocused, setApellidoPaternoFocused] = useState(false);
  const [apellidoMaternoFocused, setApellidoMaternoFocused] = useState(false);
  const [edadFocused, setEdadFocused] = useState(false);
  const [sexoFocused, setSexoFocused] = useState(false);
  const [telefonoFocused, setTelefonoFocused] = useState(false);
  const [correoFocused, setCorreoFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);

  // Verificar si el correo ya está registrado (debounce)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (registerData.correo && /\S+@\S+\.\S+/.test(registerData.correo)) {
        console.log("🔍 Verificando disponibilidad del email:", registerData.correo);
        verificarEmailDisponible();
      } else {
        setEmailDisponible(null);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [registerData.correo]);

  const verificarEmailDisponible = async () => {
    setVerificandoEmail(true);
    try {
      console.log("📡 GET /api/auth/check-email?email=", registerData.correo);
      const res = await axios.get(`/api/auth/check-email?email=${encodeURIComponent(registerData.correo)}`);
      console.log("📥 Respuesta check-email:", res.data);
      setEmailDisponible(res.data.disponible);
      if (!res.data.disponible) {
        setErrores(prev => ({ ...prev, correo: 'Este correo ya está registrado' }));
      } else {
        setErrores(prev => ({ ...prev, correo: undefined }));
      }
    } catch (error) {
      console.error('❌ Error verificando email:', error);
      setEmailDisponible(null);
    } finally {
      setVerificandoEmail(false);
    }
  };

  // Función de validación de contraseña completa
  const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (password.length < 8) errors.push('Mínimo 8 caracteres');
    if (!/[A-Z]/.test(password)) errors.push('Al menos una letra mayúscula');
    if (!/[a-z]/.test(password)) errors.push('Al menos una letra minúscula');
    if (!/[0-9]/.test(password)) errors.push('Al menos un número');
    if (!/[^a-zA-Z0-9]/.test(password)) errors.push('Al menos un carácter especial (!@#$%^&*)');
    
    const numberSequences = ['123', '234', '345', '456', '567', '678', '789', '890', '012'];
    for (const seq of numberSequences) {
      if (password.includes(seq)) {
        errors.push(`No se permiten secuencias de números (${seq})`);
        break;
      }
    }
    
    const letterSequences = ['abc', 'bcd', 'cde', 'def', 'efg', 'fgh', 'ghi', 'hij', 'ijk', 'jkl', 'klm', 'lmn', 'mno', 'nop', 'opq', 'pqr', 'qrs', 'rst', 'stu', 'tuv', 'uvw', 'vwx', 'wxy', 'xyz'];
    const passwordLower = password.toLowerCase();
    for (const seq of letterSequences) {
      if (passwordLower.includes(seq)) {
        errors.push(`No se permiten secuencias de letras (${seq})`);
        break;
      }
    }
    
    if (/(.)\1{3,}/.test(password)) errors.push('No se permiten más de 3 caracteres repetidos');
    
    return { isValid: errors.length === 0, errors };
  };

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    setPasswordStrength(Math.min(strength, 4));
    
    const validation = validatePassword(password);
    setIsPasswordValid(validation.isValid);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'telefono') {
      const soloNumeros = value.replace(/[^0-9]/g, '');
      setRegisterData({ ...registerData, [name]: soloNumeros });
    } else {
      setRegisterData({ ...registerData, [name]: value });
    }
    
    if (errores[name as keyof RegisterData]) {
      setErrores({ ...errores, [name]: '' });
    }

    if (name === 'contrasena') {
      calculatePasswordStrength(value);
    }
  };

  const validateForm = () => {
    const nuevosErrores: Errores = {};

    if (!registerData.nombre) nuevosErrores.nombre = 'Ingresa tu nombre';
    else if (registerData.nombre.length < 2) nuevosErrores.nombre = 'El nombre debe tener al menos 2 caracteres';
    else if (!/^[a-zA-ZáéíóúñÑ\s]+$/.test(registerData.nombre)) nuevosErrores.nombre = 'El nombre solo puede contener letras';

    if (!registerData.apellidoPaterno) nuevosErrores.apellidoPaterno = 'Ingresa tu apellido paterno';
    else if (registerData.apellidoPaterno.length < 2) nuevosErrores.apellidoPaterno = 'Apellido paterno inválido';
    else if (!/^[a-zA-ZáéíóúñÑ\s]+$/.test(registerData.apellidoPaterno)) nuevosErrores.apellidoPaterno = 'Apellido paterno solo puede contener letras';

    if (!registerData.apellidoMaterno) nuevosErrores.apellidoMaterno = 'Ingresa tu apellido materno';
    else if (registerData.apellidoMaterno.length < 2) nuevosErrores.apellidoMaterno = 'Apellido materno inválido';
    else if (!/^[a-zA-ZáéíóúñÑ\s]+$/.test(registerData.apellidoMaterno)) nuevosErrores.apellidoMaterno = 'Apellido materno solo puede contener letras';

    if (!registerData.edad) nuevosErrores.edad = 'Ingresa tu edad';
    else {
      const edadNum = parseInt(registerData.edad);
      if (isNaN(edadNum)) nuevosErrores.edad = 'Edad inválida';
      else if (edadNum < 18) nuevosErrores.edad = 'Debes ser mayor de 18 años para registrarte';
      else if (edadNum > 100) nuevosErrores.edad = 'Edad máxima 100 años';
    }

    if (!registerData.sexo) nuevosErrores.sexo = 'Selecciona tu sexo';

    if (!registerData.telefono) nuevosErrores.telefono = 'Ingresa tu teléfono';
    else if (!/^[0-9]{10}$/.test(registerData.telefono)) nuevosErrores.telefono = 'Teléfono inválido (debe tener 10 dígitos)';

    if (!registerData.correo) nuevosErrores.correo = 'Ingresa tu correo';
    else if (!/\S+@\S+\.\S+/.test(registerData.correo)) nuevosErrores.correo = 'Correo inválido';
    else if (emailDisponible === false) nuevosErrores.correo = 'Este correo ya está registrado';

    if (!registerData.contrasena) {
      nuevosErrores.contrasena = 'Ingresa una contraseña';
    } else {
      const passwordValidation = validatePassword(registerData.contrasena);
      if (!passwordValidation.isValid) {
        nuevosErrores.contrasena = passwordValidation.errors[0];
      }
    }

    if (!registerData.confirmarContrasena) nuevosErrores.confirmarContrasena = 'Confirma tu contraseña';
    else if (registerData.contrasena !== registerData.confirmarContrasena) {
      nuevosErrores.confirmarContrasena = 'Las contraseñas no coinciden';
    }

    if (!aceptaTerminos) {
      nuevosErrores.terminos = 'Debes aceptar los términos y condiciones';
    }

    return nuevosErrores;
  };

  // Enviar código OTP
  const enviarCodigoOTP = async () => {
    try {
      console.log("📤 POST /api/auth/send-otp - Enviando código a:", registerData.correo);
      const otpRes = await axios.post('/api/auth/send-otp', {
        email: registerData.correo,
        nombre: `${registerData.nombre} ${registerData.apellidoPaterno}`
      });

      console.log("📥 Respuesta send-otp:", otpRes.data);

      if (otpRes.data.success) {
        setEmailRegistro(registerData.correo);
        setNombreRegistro(`${registerData.nombre} ${registerData.apellidoPaterno}`);
        setStep('verify');
        console.log("✅ Step cambiado a 'verify'");
        toast.success('Código enviado a tu correo');
      } else {
        console.error("❌ send-otp no tuvo éxito:", otpRes.data);
        toast.error(otpRes.data.message || 'Error al enviar código');
      }
    } catch (error: any) {
      console.error('❌ Error enviando OTP:', error);
      if (error.response) {
        console.error("📥 Respuesta error:", error.response.data);
        toast.error(error.response.data.error || error.response.data.message || 'Error al enviar código');
      } else {
        toast.error('Error de conexión');
      }
      throw error;
    }
  };

// En RegisterForm.tsx, modifica handleFinalRegister

 const handleFinalRegister = async (codigo: string) => {
    console.log("🔐 handleFinalRegister llamado con código:", codigo);
    
    try {
      setCargando(true);
      
      const datosRegistro = {
        codigoVerificacion: codigo,
        nombre: registerData.nombre,
        apellidoPaterno: registerData.apellidoPaterno,
        apellidoMaterno: registerData.apellidoMaterno,
        edad: registerData.edad,
        sexo: registerData.sexo,
        telefono: registerData.telefono,
        correo: registerData.correo,
        contrasena: registerData.contrasena,
      };
      
      const res = await axios.post('/api/auth/register', datosRegistro);
      
      console.log("✅ Registro exitoso!");
      
      toast.success('¡Cuenta creada exitosamente!');
      
      // 👈 Llamar al callback para cambiar a login
      if (onRegistroExitoso) {
        onRegistroExitoso();
      }

    } catch (error: any) {
      console.error('❌ Error registro:', error);
      if (error.response) {
        toast.error(error.response.data.message || 'Error en el registro');
      } else {
        toast.error('Error de conexión');
      }
    } finally {
      setCargando(false);
    }
  };
  // Submit del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("📝 handleSubmit - Validando formulario...");

    const nuevosErrores = validateForm();
    if (Object.keys(nuevosErrores).length > 0) {
      console.log("❌ Errores de validación:", nuevosErrores);
      setErrores(nuevosErrores);
      return;
    }

    console.log("✅ Formulario válido. Enviando OTP...");

    try {
      setCargando(true);
      await enviarCodigoOTP();
      console.log("✅ OTP enviado correctamente");
    } catch (error) {
      console.error("❌ Error en handleSubmit:", error);
    } finally {
      setCargando(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-gray-200';
    if (passwordStrength === 1) return 'bg-red-500';
    if (passwordStrength === 2) return 'bg-orange-500';
    if (passwordStrength === 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength === 1) return 'Muy débil';
    if (passwordStrength === 2) return 'Débil';
    if (passwordStrength === 3) return 'Buena';
    return 'Fuerte';
  };

  // Componente de requisitos de contraseña
  const PasswordRequirements = () => {
    const requirements = [
      { label: 'Mínimo 8 caracteres', test: (p: string) => p.length >= 8 },
      { label: 'Al menos una mayúscula', test: (p: string) => /[A-Z]/.test(p) },
      { label: 'Al menos una minúscula', test: (p: string) => /[a-z]/.test(p) },
      { label: 'Al menos un número', test: (p: string) => /[0-9]/.test(p) },
      { label: 'Al menos un carácter especial (!@#$%^&*)', test: (p: string) => /[^a-zA-Z0-9]/.test(p) },
      { label: 'Sin secuencias de números (123, 234, etc.)', test: (p: string) => {
        const seq = ['123', '234', '345', '456', '567', '678', '789', '890', '012'];
        return !seq.some(s => p.includes(s));
      }},
      { label: 'Sin secuencias de letras (abc, bcd, etc.)', test: (p: string) => {
        const seq = ['abc', 'bcd', 'cde', 'def', 'efg', 'fgh', 'ghi', 'hij', 'ijk', 'jkl', 'klm', 'lmn', 'mno', 'nop', 'opq', 'pqr', 'qrs', 'rst', 'stu', 'tuv', 'uvw', 'vwx', 'wxy', 'xyz'];
        const pLower = p.toLowerCase();
        return !seq.some(s => pLower.includes(s));
      }},
      { label: 'Sin más de 3 caracteres repetidos', test: (p: string) => !/(.)\1{3,}/.test(p) },
    ];

    return (
      <div className="mt-2 p-3 bg-gray-50 rounded-lg text-xs space-y-1">
        <p className="font-semibold text-gray-600 mb-1">Requisitos de contraseña:</p>
        {requirements.map((req, idx) => {
          const isMet = req.test(registerData.contrasena);
          return (
            <div key={idx} className="flex items-center gap-2">
              {isMet ? (
                <CheckCircle size={12} className="text-green-500" />
              ) : (
                <XCircle size={12} className="text-gray-300" />
              )}
              <span className={isMet ? 'text-green-600' : 'text-gray-500'}>
                {req.label}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  // Mostrar pantalla de verificación si estamos en ese paso
  if (step === 'verify') {
    return (
      <VerifyCodeForm 
        email={emailRegistro}
        onBack={() => {
          console.log("🔙 Volviendo al formulario de registro");
          setStep('form');
        }}
        onVerify={handleFinalRegister}
        loading={cargando}
      />
    );
  }

  // Formulario de registro
  return (
    <div className="w-full max-w-md mx-auto">
      {/* Título */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black text-[#0A3D62] mb-2 tracking-tight">
          REGÍSTRATE
        </h1>
        <p className="text-xl font-bold text-[#FFC300]">
          crea tu cuenta gratis
        </p>
      </div>

      {/* Botones sociales */}
      <RegisterSocialButtons />

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-400">o regístrate con email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Sección de Nombre y Apellidos */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <User size={16} className="text-[#FFC300]" />
            <span className="text-xs font-semibold text-[#0A3D62] uppercase tracking-wider">
              Nombre y Apellidos
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-[#FFC300]/50 to-transparent"></div>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {/* Nombre */}
            <div className="relative col-span-1">
              <div className={`
                relative rounded-xl transition-all duration-200 bg-white border-2
                ${nombreFocused ? 'border-[#FFC300] shadow-lg' : 'border-gray-200 hover:border-gray-300'}
                ${errores.nombre ? 'border-red-500 bg-red-50' : ''}
              `}>
                <User className={`
                  absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200 z-10
                  ${nombreFocused ? 'text-[#FFC300]' : 'text-gray-400'}
                `} size={18} />

                <label className={`
                  absolute left-9 transition-all duration-200 pointer-events-none
                  ${nombreFocused || registerData.nombre
                    ? '-top-2 text-[10px] bg-white px-1.5 text-[#FFC300] font-medium'
                    : 'top-1/2 -translate-y-1/2 text-xs text-gray-400 left-9'}
                `}>
                  Nombre
                </label>

                <input
                  type="text"
                  name="nombre"
                  value={registerData.nombre}
                  onChange={handleChange}
                  onFocus={() => setNombreFocused(true)}
                  onBlur={() => setNombreFocused(false)}
                  className="w-full pl-9 pr-2 py-3.5 bg-transparent rounded-xl focus:outline-none text-gray-700 relative z-20 placeholder-transparent text-sm"
                />
              </div>
            </div>

            {/* Apellido Paterno */}
            <div className="relative col-span-1">
              <div className={`
                relative rounded-xl transition-all duration-200 bg-white border-2
                ${apellidoPaternoFocused ? 'border-[#FFC300] shadow-lg' : 'border-gray-200 hover:border-gray-300'}
                ${errores.apellidoPaterno ? 'border-red-500 bg-red-50' : ''}
              `}>
                <User className={`
                  absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200 z-10
                  ${apellidoPaternoFocused ? 'text-[#FFC300]' : 'text-gray-400'}
                `} size={18} />

                <label className={`
                  absolute left-9 transition-all duration-200 pointer-events-none
                  ${apellidoPaternoFocused || registerData.apellidoPaterno
                    ? '-top-2 text-[10px] bg-white px-1.5 text-[#FFC300] font-medium'
                    : 'top-1/2 -translate-y-1/2 text-xs text-gray-400 left-9'}
                `}>
                  Paterno
                </label>

                <input
                  type="text"
                  name="apellidoPaterno"
                  value={registerData.apellidoPaterno}
                  onChange={handleChange}
                  onFocus={() => setApellidoPaternoFocused(true)}
                  onBlur={() => setApellidoPaternoFocused(false)}
                  className="w-full pl-9 pr-2 py-3.5 bg-transparent rounded-xl focus:outline-none text-gray-700 relative z-20 placeholder-transparent text-sm"
                />
              </div>
            </div>

            {/* Apellido Materno */}
            <div className="relative col-span-1">
              <div className={`
                relative rounded-xl transition-all duration-200 bg-white border-2
                ${apellidoMaternoFocused ? 'border-[#FFC300] shadow-lg' : 'border-gray-200 hover:border-gray-300'}
                ${errores.apellidoMaterno ? 'border-red-500 bg-red-50' : ''}
              `}>
                <User className={`
                  absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200 z-10
                  ${apellidoMaternoFocused ? 'text-[#FFC300]' : 'text-gray-400'}
                `} size={18} />

                <label className={`
                  absolute left-9 transition-all duration-200 pointer-events-none
                  ${apellidoMaternoFocused || registerData.apellidoMaterno
                    ? '-top-2 text-[10px] bg-white px-1.5 text-[#FFC300] font-medium'
                    : 'top-1/2 -translate-y-1/2 text-xs text-gray-400 left-9'}
                `}>
                  Materno
                </label>

                <input
                  type="text"
                  name="apellidoMaterno"
                  value={registerData.apellidoMaterno}
                  onChange={handleChange}
                  onFocus={() => setApellidoMaternoFocused(true)}
                  onBlur={() => setApellidoMaternoFocused(false)}
                  className="w-full pl-9 pr-2 py-3.5 bg-transparent rounded-xl focus:outline-none text-gray-700 relative z-20 placeholder-transparent text-sm"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {errores.nombre && <p className="text-[10px] text-red-500">{errores.nombre}</p>}
            {errores.apellidoPaterno && <p className="text-[10px] text-red-500">{errores.apellidoPaterno}</p>}
            {errores.apellidoMaterno && <p className="text-[10px] text-red-500">{errores.apellidoMaterno}</p>}
          </div>
        </div>

        {/* Sección de Información Personal */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-[#FFC300]" />
            <span className="text-xs font-semibold text-[#0A3D62] uppercase tracking-wider">
              Información Personal
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-[#FFC300]/50 to-transparent"></div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {/* Edad */}
            <div className="relative">
              <div className={`
                relative rounded-xl transition-all duration-200 bg-white border-2
                ${edadFocused ? 'border-[#FFC300] shadow-lg' : 'border-gray-200 hover:border-gray-300'}
                ${errores.edad ? 'border-red-500 bg-red-50' : ''}
              `}>
                <Calendar className={`
                  absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200 z-10
                  ${edadFocused ? 'text-[#FFC300]' : 'text-gray-400'}
                `} size={18} />

                <label className={`
                  absolute left-9 transition-all duration-200 pointer-events-none
                  ${edadFocused || registerData.edad
                    ? '-top-2 text-[10px] bg-white px-1.5 text-[#FFC300] font-medium'
                    : 'top-1/2 -translate-y-1/2 text-xs text-gray-400 left-9'}
                `}>
                  Edad
                </label>

                <input
                  type="number"
                  name="edad"
                  min="18"
                  max="100"
                  value={registerData.edad}
                  onChange={handleChange}
                  onFocus={() => setEdadFocused(true)}
                  onBlur={() => setEdadFocused(false)}
                  className="w-full pl-9 pr-2 py-3.5 bg-transparent rounded-xl focus:outline-none text-gray-700 relative z-20 placeholder-transparent text-sm"
                />
              </div>
              {errores.edad && <p className="mt-1 text-[10px] text-red-500">{errores.edad}</p>}
            </div>

            {/* Sexo */}
            <div className="relative">
              <div className={`
                relative rounded-xl transition-all duration-200 bg-white border-2
                ${sexoFocused ? 'border-[#FFC300] shadow-lg' : 'border-gray-200 hover:border-gray-300'}
                ${errores.sexo ? 'border-red-500 bg-red-50' : ''}
              `}>
                <Users className={`
                  absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200 z-10
                  ${sexoFocused ? 'text-[#FFC300]' : 'text-gray-400'}
                `} size={18} />

                <label className={`
                  absolute left-9 transition-all duration-200 pointer-events-none
                  ${sexoFocused || registerData.sexo
                    ? '-top-2 text-[10px] bg-white px-1.5 text-[#FFC300] font-medium'
                    : 'top-1/2 -translate-y-1/2 text-xs text-gray-400 left-9'}
                `}>
                  Sexo
                </label>

                <select
                  name="sexo"
                  value={registerData.sexo}
                  onChange={handleChange}
                  onFocus={() => setSexoFocused(true)}
                  onBlur={() => setSexoFocused(false)}
                  className="w-full pl-9 pr-6 py-3.5 bg-transparent rounded-xl focus:outline-none text-gray-700 relative z-20 appearance-none cursor-pointer text-sm"
                >
                  <option value="" disabled></option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                  <option value="otro">Otro</option>
                </select>
                
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  ▼
                </div>
              </div>
              {errores.sexo && <p className="mt-1 text-[10px] text-red-500">{errores.sexo}</p>}
            </div>
          </div>
        </div>

        {/* Sección de Contacto */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Phone size={16} className="text-[#FFC300]" />
            <span className="text-xs font-semibold text-[#0A3D62] uppercase tracking-wider">
              Contacto
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-[#FFC300]/50 to-transparent"></div>
          </div>
          
          {/* Campo Teléfono */}
          <div className="relative">
            <div className={`
              relative rounded-xl transition-all duration-200 bg-white border-2
              ${telefonoFocused ? 'border-[#FFC300] shadow-lg' : 'border-gray-200 hover:border-gray-300'}
              ${errores.telefono ? 'border-red-500 bg-red-50' : ''}
            `}>
              <Phone className={`
                absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 z-10
                ${telefonoFocused ? 'text-[#FFC300]' : 'text-gray-400'}
              `} size={20} />

              <label className={`
                absolute left-12 transition-all duration-200 pointer-events-none
                ${telefonoFocused || registerData.telefono
                  ? '-top-3 text-xs bg-white px-2 text-[#FFC300] font-medium'
                  : 'top-1/2 -translate-y-1/2 text-sm text-gray-400 left-12'}
              `}>
                Teléfono (10 dígitos)
              </label>

              <input
                type="tel"
                name="telefono"
                value={registerData.telefono}
                onChange={handleChange}
                onFocus={() => setTelefonoFocused(true)}
                onBlur={() => setTelefonoFocused(false)}
                maxLength={10}
                className="w-full pl-12 pr-4 py-4 bg-transparent rounded-xl focus:outline-none text-gray-700 relative z-20 placeholder-transparent"
              />
            </div>
            {errores.telefono && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                {errores.telefono}
              </p>
            )}
          </div>

          {/* Campo Correo */}
          <div className="relative">
            <div className={`
              relative rounded-xl transition-all duration-200 bg-white border-2
              ${correoFocused ? 'border-[#FFC300] shadow-lg' : 'border-gray-200 hover:border-gray-300'}
              ${errores.correo ? 'border-red-500 bg-red-50' : ''}
            `}>
              <Mail className={`
                absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 z-10
                ${correoFocused ? 'text-[#FFC300]' : 'text-gray-400'}
              `} size={20} />

              <label className={`
                absolute left-12 transition-all duration-200 pointer-events-none
                ${correoFocused || registerData.correo
                  ? '-top-3 text-xs bg-white px-2 text-[#FFC300] font-medium'
                  : 'top-1/2 -translate-y-1/2 text-sm text-gray-400 left-12'}
              `}>
                Correo Electrónico
              </label>

              <input
                type="email"
                name="correo"
                value={registerData.correo}
                onChange={handleChange}
                onFocus={() => setCorreoFocused(true)}
                onBlur={() => setCorreoFocused(false)}
                className="w-full pl-12 pr-4 py-4 bg-transparent rounded-xl focus:outline-none text-gray-700 relative z-20 placeholder-transparent"
              />
              
              {verificandoEmail && registerData.correo && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <Loader2 size={16} className="animate-spin text-gray-400" />
                </div>
              )}
              {emailDisponible === true && registerData.correo && !verificandoEmail && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <CheckCircle size={16} className="text-green-500" />
                </div>
              )}
              {emailDisponible === false && registerData.correo && !verificandoEmail && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <XCircle size={16} className="text-red-500" />
                </div>
              )}
            </div>
            {errores.correo && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                {errores.correo}
              </p>
            )}
          </div>
        </div>

        {/* Sección de Seguridad */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Lock size={16} className="text-[#FFC300]" />
            <span className="text-xs font-semibold text-[#0A3D62] uppercase tracking-wider">
              Seguridad
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-[#FFC300]/50 to-transparent"></div>
          </div>

          {/* Campo Contraseña */}
          <div className="relative">
            <div className={`
              relative rounded-xl transition-all duration-200 bg-white border-2
              ${passwordFocused ? 'border-[#FFC300] shadow-lg' : 'border-gray-200 hover:border-gray-300'}
              ${errores.contrasena ? 'border-red-500 bg-red-50' : ''}
            `}>
              <Lock className={`
                absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 z-10
                ${passwordFocused ? 'text-[#FFC300]' : 'text-gray-400'}
              `} size={20} />

              <label className={`
                absolute left-12 transition-all duration-200 pointer-events-none
                ${passwordFocused || registerData.contrasena
                  ? '-top-3 text-xs bg-white px-2 text-[#FFC300] font-medium'
                  : 'top-1/2 -translate-y-1/2 text-sm text-gray-400 left-12'}
              `}>
                Contraseña
              </label>

              <input
                type={mostrarContrasena ? 'text' : 'password'}
                name="contrasena"
                value={registerData.contrasena}
                onChange={handleChange}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                className="w-full pl-12 pr-12 py-4 bg-transparent rounded-xl focus:outline-none text-gray-700 relative z-20 placeholder-transparent"
              />

              <button
                type="button"
                onClick={() => setMostrarContrasena(!mostrarContrasena)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FFC300] transition-colors z-30"
              >
                {mostrarContrasena ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            {registerData.contrasena && (
              <div className="mt-2">
                <div className="flex gap-1 h-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                        passwordStrength >= level ? getPasswordStrengthColor() : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Fortaleza: <span className="font-medium">{getPasswordStrengthText()}</span>
                </p>
              </div>
            )}
            
            {registerData.contrasena && !isPasswordValid && (
              <PasswordRequirements />
            )}
            
            {errores.contrasena && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                {errores.contrasena}
              </p>
            )}
          </div>

          {/* Campo Confirmar Contraseña */}
          <div className="relative">
            <div className={`
              relative rounded-xl transition-all duration-200 bg-white border-2
              ${confirmFocused ? 'border-[#FFC300] shadow-lg' : 'border-gray-200 hover:border-gray-300'}
              ${errores.confirmarContrasena ? 'border-red-500 bg-red-50' : ''}
            `}>
              <Lock className={`
                absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 z-10
                ${confirmFocused ? 'text-[#FFC300]' : 'text-gray-400'}
              `} size={20} />

              <label className={`
                absolute left-12 transition-all duration-200 pointer-events-none
                ${confirmFocused || registerData.confirmarContrasena
                  ? '-top-3 text-xs bg-white px-2 text-[#FFC300] font-medium'
                  : 'top-1/2 -translate-y-1/2 text-sm text-gray-400 left-12'}
              `}>
                Confirmar Contraseña
              </label>

              <input
                type={mostrarConfirmContrasena ? 'text' : 'password'}
                name="confirmarContrasena"
                value={registerData.confirmarContrasena}
                onChange={handleChange}
                onFocus={() => setConfirmFocused(true)}
                onBlur={() => setConfirmFocused(false)}
                className="w-full pl-12 pr-12 py-4 bg-transparent rounded-xl focus:outline-none text-gray-700 relative z-20 placeholder-transparent"
              />

              <button
                type="button"
                onClick={() => setMostrarConfirmContrasena(!mostrarConfirmContrasena)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FFC300] transition-colors z-30"
              >
                {mostrarConfirmContrasena ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            {registerData.confirmarContrasena && registerData.contrasena && (
              <div className="mt-1 flex items-center gap-1">
                {registerData.contrasena === registerData.confirmarContrasena ? (
                  <>
                    <CheckCircle size={14} className="text-green-500" />
                    <span className="text-xs text-green-500">Las contraseñas coinciden</span>
                  </>
                ) : (
                  <>
                    <XCircle size={14} className="text-red-500" />
                    <span className="text-xs text-red-500">Las contraseñas no coinciden</span>
                  </>
                )}
              </div>
            )}
            
            {errores.confirmarContrasena && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                {errores.confirmarContrasena}
              </p>
            )}
          </div>
        </div>

        {/* Términos y condiciones */}
        <div className="space-y-1">
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="terminos"
              checked={aceptaTerminos}
              onChange={(e) => setAceptaTerminos(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-gray-300 text-[#FFC300] focus:ring-[#FFC300]"
            />
            <label htmlFor="terminos" className="text-xs text-gray-500">
              Acepto los{' '}
              <Link href="/terminos" className="text-[#FFC300] hover:text-[#0A3D62] transition-colors">
                Términos y Condiciones
              </Link>{' '}
              y la{' '}
              <Link href="/privacidad" className="text-[#FFC300] hover:text-[#0A3D62] transition-colors">
                Política de Privacidad
              </Link>
            </label>
          </div>
          {errores.terminos && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <span className="w-1 h-1 bg-red-500 rounded-full"></span>
              {errores.terminos}
            </p>
          )}
        </div>

        {/* Botón submit */}
        <button
          type="submit"
          disabled={cargando}
          className="relative w-full group overflow-hidden rounded-xl bg-gradient-to-r from-[#FFC300] to-[#FFD700] p-[2px] focus:outline-none focus:ring-2 focus:ring-[#FFC300] focus:ring-offset-2 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="relative flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FFC300] to-[#FFD700] px-6 py-4 text-[#0A3D62] font-bold transition-all duration-300">
            {cargando ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span className="font-semibold">CREANDO CUENTA...</span>
              </>
            ) : (
              <>
                <User size={20} />
                <span className="font-semibold text-lg">REGISTRARSE</span>
              </>
            )}
          </div>
        </button>
      </form>
    </div>
  );
}