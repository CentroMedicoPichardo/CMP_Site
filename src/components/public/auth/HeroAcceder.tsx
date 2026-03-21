// src/components/public/auth/HeroAcceder.tsx
import Image from 'next/image';
import { GraduationCap, MessageCircle, FileText, Sparkles } from 'lucide-react';

interface HeroAccederProps {
  modo: 'login' | 'registro';
  onCambiarModo: (modo: 'login' | 'registro') => void;
}

export function HeroAcceder({ modo, onCambiarModo }: HeroAccederProps) {
  return (
    <div className="hidden lg:block lg:w-1/2 relative bg-gradient-to-br from-[#0A3D62] to-[#1A4F7A] overflow-hidden">
      {/* Imagen de fondo con efecto sutil */}
      <div className="absolute inset-0">
        <Image
          src="/login-bg.png"
          alt="Fondo decorativo Centro Médico Pichardo"
          fill
          className="object-cover opacity-10"
          priority
        />
        {/* Patrón de puntos decorativos */}
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>
      
      {/* Contenido principal */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-12 py-16">
        <div className="max-w-md w-full">
          
          {/* Logo y título */}
          <div className="text-center mb-12">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-[#FFC300]/20 blur-2xl rounded-full"></div>
              <Image
                src="/logo.png"
                alt="Centro Médico Pichardo"
                width={100}
                height={100}
                className="object-contain relative z-10"
                priority
              />
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-2">
              Centro Médico
            </h1>
            <p className="text-2xl font-light text-[#FFC300] tracking-wide">
              Pichardo
            </p>
          </div>
          
          {/* Beneficios/Features con iconos de Lucide */}
          <div className="space-y-5 mb-12">
            <div className="flex items-center gap-4 group">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 group-hover:bg-[#FFC300] group-hover:border-[#FFC300] transition-all duration-300">
                <GraduationCap size={24} className="text-white group-hover:text-[#0A3D62]" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg">Cursos y talleres</h3>
                <p className="text-white/70 text-sm">Controla tu progreso educativo</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 group">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 group-hover:bg-[#FFC300] group-hover:border-[#FFC300] transition-all duration-300">
                <MessageCircle size={24} className="text-white group-hover:text-[#0A3D62]" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg">Foros y comunidad</h3>
                <p className="text-white/70 text-sm">Comparte con otras familias</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 group">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 group-hover:bg-[#FFC300] group-hover:border-[#FFC300] transition-all duration-300">
                <FileText size={24} className="text-white group-hover:text-[#0A3D62]" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg">Publicaciones y blog</h3>
                <p className="text-white/70 text-sm">Participa en la conversación</p>
              </div>
            </div>
          </div>
          
          {/* Selector de acceso - AHORA FUNCIONAL */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-2 border border-white/10 mb-6">
            <div className="flex gap-2">
              <button
                onClick={() => onCambiarModo('login')}
                className={`flex-1 font-bold py-4 px-6 rounded-xl text-center transition-all duration-300 ${
                  modo === 'login'
                    ? 'bg-[#FFC300] text-[#0A3D62] shadow-xl relative'
                    : 'bg-transparent text-white hover:bg-white/10 border border-transparent hover:border-white/20'
                }`}
              >
                {modo === 'login' && (
                  <div className="absolute inset-0 bg-[#FFC300] rounded-xl blur-md opacity-50"></div>
                )}
                <span className="relative">INICIAR SESIÓN</span>
              </button>
              <button
                onClick={() => onCambiarModo('registro')}
                className={`flex-1 font-bold py-4 px-6 rounded-xl text-center transition-all duration-300 ${
                  modo === 'registro'
                    ? 'bg-[#FFC300] text-[#0A3D62] shadow-xl relative'
                    : 'bg-transparent text-white hover:bg-white/10 border border-transparent hover:border-white/20'
                }`}
              >
                {modo === 'registro' && (
                  <div className="absolute inset-0 bg-[#FFC300] rounded-xl blur-md opacity-50"></div>
                )}
                <span className="relative">REGISTRARSE</span>
              </button>
            </div>
          </div>
          
          {/* Badge decorativo */}
          <div className="flex items-center justify-center gap-2 text-white/50 text-sm">
            <Sparkles size={16} />
            <span>Comunidad de aprendizaje pediátrico</span>
            <Sparkles size={16} />
          </div>
          
        </div>
      </div>
    </div>
  );
}