// src/components/public/auth/RegisterForm.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, Loader2, User, Phone, CheckCircle, XCircle, Calendar, Users } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { RegisterSocialButtons } from './RegisterSocialButtons';

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
}

export function RegisterForm() {
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
  const [passwordStrength, setPasswordStrength] = useState(0); // 0-4

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRegisterData({ ...registerData, [name]: value });
    
    // Limpiar error del campo
    if (errores[name as keyof RegisterData]) {
      setErrores({ ...errores, [name]: '' });
    }

    // Calcular fortaleza de contraseña
    if (name === 'contrasena') {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    setPasswordStrength(Math.min(strength, 4));
  };

  const validateForm = () => {
    const nuevosErrores: Errores = {};

    // Validaciones de nombre
    if (!registerData.nombre) nuevosErrores.nombre = 'Ingresa tu nombre';
    else if (registerData.nombre.length < 2) nuevosErrores.nombre = 'El nombre debe tener al menos 2 caracteres';

    if (!registerData.apellidoPaterno) nuevosErrores.apellidoPaterno = 'Ingresa tu apellido paterno';
    else if (registerData.apellidoPaterno.length < 2) nuevosErrores.apellidoPaterno = 'Apellido paterno inválido';

    if (!registerData.apellidoMaterno) nuevosErrores.apellidoMaterno = 'Ingresa tu apellido materno';
    else if (registerData.apellidoMaterno.length < 2) nuevosErrores.apellidoMaterno = 'Apellido materno inválido';

    // Validación de edad
    if (!registerData.edad) nuevosErrores.edad = 'Ingresa tu edad';
    else {
      const edadNum = parseInt(registerData.edad);
      if (isNaN(edadNum) || edadNum < 1 || edadNum > 120) {
        nuevosErrores.edad = 'Edad inválida (1-120 años)';
      }
    }

    // Validación de sexo
    if (!registerData.sexo) nuevosErrores.sexo = 'Selecciona tu sexo';

    // Validaciones existentes
    if (!registerData.telefono) nuevosErrores.telefono = 'Ingresa tu teléfono';
    else if (!/^[0-9]{9,15}$/.test(registerData.telefono)) nuevosErrores.telefono = 'Teléfono inválido (9-15 dígitos)';

    if (!registerData.correo) nuevosErrores.correo = 'Ingresa tu correo';
    else if (!/\S+@\S+\.\S+/.test(registerData.correo)) nuevosErrores.correo = 'Correo inválido';

    if (!registerData.contrasena) nuevosErrores.contrasena = 'Ingresa una contraseña';
    else if (registerData.contrasena.length < 8) nuevosErrores.contrasena = 'Mínimo 8 caracteres';
    else if (passwordStrength < 3) nuevosErrores.contrasena = 'Contraseña débil';

    if (!registerData.confirmarContrasena) nuevosErrores.confirmarContrasena = 'Confirma tu contraseña';
    else if (registerData.contrasena !== registerData.confirmarContrasena) {
      nuevosErrores.confirmarContrasena = 'Las contraseñas no coinciden';
    }

    return nuevosErrores;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nuevosErrores = validateForm();
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    try {
      setCargando(true);
      
      // Enviar solo los datos necesarios
      const { confirmarContrasena, ...datosRegistro } = registerData;
      
      const res = await axios.post('/api/auth/register', datosRegistro);

      toast.success('¡Registro exitoso! Redirigiendo...');
      
      // Guardar token si viene
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
      }

      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        router.push('/login');
      }, 2000);

    } catch (error: any) {
      console.error('Error registro:', error);
      
      if (error.response) {
        const status = error.response.status;
        
        if (status === 400) {
          toast.error(error.response.data.message || 'Datos inválidos');
        } else if (status === 409) {
          toast.error('El correo o teléfono ya está registrado');
        } else {
          toast.error('Error en el servidor');
        }
      } else {
        toast.error('Error de red. Verifica tu conexión.');
      }
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
          
          {/* Campos de nombre - Grid de 3 columnas */}
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

          {/* Mensajes de error para nombres en grid */}
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
          
          {/* Campos de Edad y Sexo - Grid de 2 columnas */}
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
                  min="1"
                  max="120"
                  value={registerData.edad}
                  onChange={handleChange}
                  onFocus={() => setEdadFocused(true)}
                  onBlur={() => setEdadFocused(false)}
                  className="w-full pl-9 pr-2 py-3.5 bg-transparent rounded-xl focus:outline-none text-gray-700 relative z-20 placeholder-transparent text-sm"
                />
              </div>
              {errores.edad && <p className="mt-1 text-[10px] text-red-500">{errores.edad}</p>}
            </div>

            {/* Sexo - Select */}
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
                
                {/* Flecha personalizada para el select */}
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
                Teléfono
              </label>

              <input
                type="tel"
                name="telefono"
                value={registerData.telefono}
                onChange={handleChange}
                onFocus={() => setTelefonoFocused(true)}
                onBlur={() => setTelefonoFocused(false)}
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
            
            {/* Indicador de fortaleza */}
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
            
            {/* Indicador de coincidencia */}
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
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            id="terminos"
            className="mt-1 w-4 h-4 rounded border-gray-300 text-[#FFC300] focus:ring-[#FFC300]"
            required
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