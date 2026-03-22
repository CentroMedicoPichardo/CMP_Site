// src/app/(public)/acceder/page.tsx
"use client";

import React, { useState } from 'react';
import { LoginLayout } from '@/components/public/auth/LoginLayout';
import { HeroAcceder } from '@/components/public/auth/HeroAcceder';
import { LoginForm } from '@/components/public/auth/LoginForm';
import { RegisterForm } from '@/components/public/auth/RegisterForm';
import { LoginMfaForm } from '@/components/public/auth/LoginMfaForm';

export default function AccederPage() {
  const [modo, setModo] = useState<'login' | 'registro'>('login');
  const [necesitaMfa, setNecesitaMfa] = useState(false);
  const [emailTemp, setEmailTemp] = useState('');

  const handleCambiarModo = (nuevoModo: 'login' | 'registro') => {
    setModo(nuevoModo);
    setNecesitaMfa(false); // Reset MFA si cambia de modo
  };

  // 👈 Función para cuando el registro es exitoso
  const handleRegistroExitoso = () => {
    setModo('login');
    setNecesitaMfa(false);
    // Opcional: mostrar mensaje de éxito
    // toast.success('Cuenta creada exitosamente, ahora inicia sesión');
  };

  const renderFormulario = () => {
    if (necesitaMfa) {
      return (
        <LoginMfaForm 
          email={emailTemp}
          onCancel={() => setNecesitaMfa(false)}
        />
      );
    }

    switch (modo) {
      case 'login':
        return (
          <LoginForm 
            onMfaRequired={(email) => {
              setEmailTemp(email);
              setNecesitaMfa(true);
            }}
          />
        );
      case 'registro':
        return (
          <RegisterForm 
            onRegistroExitoso={handleRegistroExitoso}  // 👈 Pasar callback
          />
        );
      default:
        return null;
    }
  };

  return (
    <LoginLayout>
      {/* Lado izquierdo - Hero con selector funcional */}
      <HeroAcceder modo={modo} onCambiarModo={handleCambiarModo} />
      
      {/* Lado derecho - Formulario dinámico */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        {renderFormulario()}
      </div>
    </LoginLayout>
  );
}