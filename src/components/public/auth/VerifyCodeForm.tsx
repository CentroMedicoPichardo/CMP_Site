// src/components/public/auth/VerifyCodeForm.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle, Mail, ArrowLeft, LogIn } from 'lucide-react';
import { toast } from 'react-toastify';

interface VerifyCodeFormProps {
  email: string;
  onBack: () => void;
  onVerify: (codigo: string) => Promise<void>;
  loading: boolean;
}

export function VerifyCodeForm({ email, onBack, onVerify, loading }: VerifyCodeFormProps) {
  const [codigo, setCodigo] = useState('');
  const [verificado, setVerificado] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (codigo.length === 6) {
      try {
        await onVerify(codigo);
        setVerificado(true);
      } catch (error) {
        // Error ya manejado en onVerify
      }
    }
  };

  if (verificado) {
    return (
      <div className="w-full max-w-md mx-auto text-center">
        <div className="bg-green-50 rounded-2xl p-8 border border-green-200">
          <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-700 mb-2">¡Cuenta creada!</h2>
          <p className="text-gray-600 mb-4">
            Tu cuenta ha sido creada exitosamente.
          </p>
          <div className="text-sm text-gray-500">
            Ahora puedes iniciar sesión
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="relative inline-block mb-4">
          <div className="absolute inset-0 bg-[#FFC300]/20 blur-xl rounded-full"></div>
          <Mail size={48} className="text-[#0A3D62] relative z-10" />
        </div>
        <h1 className="text-3xl font-bold text-[#0A3D62] mb-2">
          Verifica tu correo
        </h1>
        <p className="text-gray-600">
          Hemos enviado un código de verificación a:
        </p>
        <p className="text-[#FFC300] font-medium mt-1">{email}</p>
        <p className="text-xs text-gray-400 mt-2">
          Revisa tu bandeja de entrada o spam
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <input
            type="text"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="000000"
            maxLength={6}
            className="w-full text-center text-3xl tracking-[8px] font-bold py-4 border-2 border-[#FFC300]/30 rounded-xl focus:outline-none focus:border-[#FFC300] focus:ring-4 focus:ring-[#FFC300]/20 transition-all duration-300 text-gray-800"
            autoFocus
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading || codigo.length !== 6}
          className="relative w-full group overflow-hidden rounded-xl bg-gradient-to-r from-[#FFC300] to-[#FFD700] p-[2px] focus:outline-none focus:ring-2 focus:ring-[#FFC300] focus:ring-offset-2 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="relative flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FFC300] to-[#FFD700] px-6 py-4 text-[#0A3D62] font-bold">
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>VERIFICANDO...</span>
              </>
            ) : (
              <>
                <CheckCircle size={20} />
                <span>VERIFICAR CUENTA</span>
              </>
            )}
          </div>
        </button>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={onBack}
            className="text-sm text-gray-500 hover:text-[#FFC300] transition-colors flex items-center gap-1 mx-auto"
            disabled={loading}
          >
            <ArrowLeft size={14} />
            Volver al registro
          </button>
        </div>

        <p className="text-center text-xs text-gray-400">
          ¿No recibiste el código?{' '}
          <button
            type="button"
            className="text-[#FFC300] hover:underline"
            onClick={() => toast.info('Solicita un nuevo código desde el registro')}
          >
            solicita uno nuevo
          </button>
        </p>
      </form>
    </div>
  );
}