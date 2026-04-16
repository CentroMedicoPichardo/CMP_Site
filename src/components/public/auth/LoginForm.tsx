// src/components/public/auth/LoginForm.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, Loader2, LogIn } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { LoginSocialButtons } from './LoginSocialButtons';

interface LoginFormProps {
  onMfaRequired: (email: string) => void;
}

interface LoginData {
  correo: string;
  contrasena: string;
}

interface Errores {
  correo?: string;
  contrasena?: string;
}

export function LoginForm({ onMfaRequired }: LoginFormProps) {
  const router = useRouter();
  const [loginData, setLoginData] = useState<LoginData>({ correo: '', contrasena: '' });
  const [errores, setErrores] = useState<Errores>({});
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [cargando, setCargando] = useState(false);

  // Estados para campos enfocados
  const [correoFocused, setCorreoFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
    if (errores[name as keyof LoginData]) {
      setErrores({ ...errores, [name]: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nuevosErrores: Errores = {};
    if (!loginData.correo) nuevosErrores.correo = 'Ingresa tu correo';
    if (!loginData.contrasena) nuevosErrores.contrasena = 'Ingresa tu contraseña';

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    try {
      setCargando(true);
      const res = await axios.post('/api/auth/login', loginData);

      const { usuario } = res.data;
      const nombreRol = typeof usuario.rol === 'string' ? usuario.rol : usuario.rol?.nombre;
      const rol = nombreRol?.toLowerCase() ?? 'cliente';

      toast.success(`¡Bienvenido, ${usuario.nombre}!`);

      // Redirección según el rol
    setTimeout(() => {
      if (rol === 'admin') {
        router.push('/dashboard-admin');
      } else if (rol === 'cliente') {
        router.push('/');
      } else {
        router.push('/');
      }

      router.refresh(); // 🔥 fuerza a Next a re-renderizar layouts y leer cookies nuevas
    }, 1000);

    } catch (error: any) {
      console.error('Error login:', error);

      if (error.response) {
        const status = error.response.status;

        if (status === 423) {
          toast.error('Cuenta bloqueada temporalmente. Espera 15 minutos.');
        } else if (status === 403 && error.response.data.requireMfa) {
          onMfaRequired(loginData.correo);
          toast.info('Autenticación de dos factores requerida');
        } else if (status === 401) {
          toast.error(error.response.data.message || 'Credenciales incorrectas');
        } else {
          toast.error('Error de conexión con el servidor');
        }
      } else {
        toast.error('Error de red. Verifica tu conexión.');
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Título simple pero llamativo */}
      <div className="text-center mb-10">
        {/* Logo con brillo sutil */}
        <div className="relative inline-block mb-4">
          <div className="absolute inset-0 bg-[#FFC300] blur-xl opacity-30 rounded-full"></div>
          <img 
            src="/logo.png" 
            alt="Corese Electrónica" 
            className="w-16 h-16 object-contain relative z-10"
          />
        </div>

        {/* Texto de bienvenida */}
        <h1 className="text-4xl md:text-5xl font-black text-[#0A3D62] mb-2 tracking-tight">
          BIENVENIDO
        </h1>
        
        {/* Texto amarillo "accede para continuar" */}
        <p className="text-2xl md:text-3xl font-bold text-[#FFC300]">
          accede para continuar
        </p>
      </div>

      {/* Botones sociales */}
      <LoginSocialButtons />

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-400">o continúa con email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Campo de correo - Floating Label Corregido */}
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

            {/* Label flotante */}
            <label className={`
              absolute left-12 transition-all duration-200 pointer-events-none
              ${correoFocused || loginData.correo
                        ? '-top-3 text-xs bg-white px-2 text-[#FFC300] font-medium'
                        : 'top-1/2 -translate-y-1/2 text-sm text-gray-400 left-12'}
            `}>
              Correo Electrónico
            </label>

            <input
              type="email"
              name="correo"
              value={loginData.correo}
              onChange={handleChange}
              onFocus={() => setCorreoFocused(true)}
              onBlur={() => setCorreoFocused(false)}
              className="w-full pl-12 pr-4 py-4 bg-transparent rounded-xl focus:outline-none text-gray-700 relative z-20 placeholder-transparent"
            />
          </div>
          {errores.correo && (
            <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
              <span className="w-1 h-1 bg-red-500 rounded-full"></span>
              {errores.correo}
            </p>
          )}
        </div>

        {/* Campo de contraseña - Floating Label Corregido */}
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

            {/* Label flotante */}
            <label className={`
              absolute left-12 transition-all duration-200 pointer-events-none
              ${passwordFocused || loginData.contrasena
                        ? '-top-3 text-xs bg-white px-2 text-[#FFC300] font-medium'
                        : 'top-1/2 -translate-y-1/2 text-sm text-gray-400 left-12'}
            `}>
              Contraseña
            </label>

            <input
              type={mostrarContrasena ? 'text' : 'password'}
              name="contrasena"
              value={loginData.contrasena}
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
          {errores.contrasena && (
            <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
              <span className="w-1 h-1 bg-red-500 rounded-full"></span>
              {errores.contrasena}
            </p>
          )}
        </div>

        {/* Opciones adicionales */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remember"
              className="w-4 h-4 rounded border-gray-300 text-[#FFC300] focus:ring-[#FFC300]"
            />
            <label htmlFor="remember" className="text-sm text-gray-600">
              Recordarme
            </label>
          </div>
          <Link
            href="/recuperar-password"
            className="text-sm text-[#0A3D62] hover:text-[#FFC300] transition-colors font-medium"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        {/* Botón submit - Dorado luminoso */}
        <button
          type="submit"
          disabled={cargando}
          className="relative w-full group overflow-hidden rounded-xl bg-gradient-to-r from-[#FFC300] to-[#FFD700] p-[2px] focus:outline-none focus:ring-2 focus:ring-[#FFC300] focus:ring-offset-2"
        >
          <div className="relative flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FFC300] to-[#FFD700] px-6 py-4 text-[#0A3D62] font-bold transition-all duration-300 group-hover:from-[#FFD700] group-hover:to-[#FFC300] group-hover:shadow-xl">
            {cargando ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span className="font-semibold">VERIFICANDO...</span>
              </>
            ) : (
              <>
                <LogIn size={20} />
                <span className="font-semibold text-lg">ACCEDER</span>
              </>
            )}
          </div>
        </button>
      </form>
    </div>
  );
}