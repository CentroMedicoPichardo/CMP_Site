// src/components/public/auth/LoginMfaForm.tsx
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Loader2, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

interface LoginMfaFormProps {
  email: string;
  onCancel: () => void;
}

export function LoginMfaForm({ email, onCancel }: LoginMfaFormProps) {
  const router = useRouter();
  const [codigo, setCodigo] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!codigo || codigo.length < 6) {
      setError('Ingresa el código de 6 dígitos');
      return;
    }

    try {
      setCargando(true);
      const res = await axios.post('/api/auth/mfa', { email, codigo });
      
      const { usuario } = res.data;
      const nombreRol = typeof usuario.rol === 'string' ? usuario.rol : usuario.rol?.nombre;
      const rol = nombreRol?.toLowerCase() ?? 'cliente';

      localStorage.setItem('rol', rol);
      localStorage.setItem('usuario', JSON.stringify(usuario));
      
      toast.success('Autenticación exitosa');

      setTimeout(() => {
        if (rol.includes('admin')) {
          router.push('/admin');
        } else {
          router.push('/');
        }
      }, 1000);

    } catch (error: any) {
      console.error('Error MFA:', error);
      if (error.response?.status === 401) {
        setError('Código inválido o expirado');
      } else {
        toast.error('Error al verificar código');
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <button
        onClick={onCancel}
        className="flex items-center gap-2 text-gray-600 hover:text-[#0A3D62] transition-colors mb-6"
      >
        <ArrowLeft size={18} />
        <span>Volver al login</span>
      </button>

      <div className="bg-[#FFF9E6] rounded-2xl p-8 text-center">
        <div className="w-20 h-20 bg-[#0A3D62] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ShieldCheck size={40} className="text-[#FFC300]" />
        </div>
        
        <h2 className="text-2xl font-bold text-[#0A3D62] mb-2">Verificación en dos pasos</h2>
        <p className="text-gray-600 mb-2">
          Hemos enviado un código de verificación a tu aplicación autenticadora.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Ingresa el código de 6 dígitos para continuar
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={codigo}
            onChange={(e) => {
              setCodigo(e.target.value.replace(/\D/g, '').slice(0, 6));
              setError('');
            }}
            placeholder="123456"
            className="w-full text-center text-2xl tracking-[8px] font-bold py-3 px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFC300] focus:border-transparent mb-2"
            maxLength={6}
            autoFocus
          />
          
          {error && (
            <p className="text-sm text-red-500 mb-4">{error}</p>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-[#FFC300] hover:bg-[#FFD700] text-[#0A3D62] font-semibold py-3 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {cargando ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>VERIFICANDO...</span>
              </>
            ) : (
              'VALIDAR CÓDIGO'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}