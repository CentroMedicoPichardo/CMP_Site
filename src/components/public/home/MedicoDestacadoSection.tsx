// src/components/public/home/MedicoDestacadoSection.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Award, Building, MapPin, ChevronRight } from 'lucide-react';
import { publicRoutes } from '@/config/routes';

interface MedicoDestacadoSectionProps {
  medico: any;
}

export function MedicoDestacadoSection({ medico }: MedicoDestacadoSectionProps) {
  return (
    <div className="bg-gradient-to-br from-[#0A3D62] to-[#1A4F7A] rounded-3xl p-8 text-white">
      <div className="flex items-center gap-3 mb-6">
        <Award size={24} className="text-[#FFC300]" />
        <h3 className="text-2xl font-bold">Nuestro Liderazgo</h3>
      </div>
      
      <p className="text-white/80 mb-8 text-lg">
        Atención humana y profesional a cargo del{' '}
        <strong className="text-[#FFC300]">{medico.nombre}</strong>.
      </p>
      
      <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
        <div className="relative w-40 h-40 rounded-2xl overflow-hidden border-4 border-[#FFC300] shadow-xl flex-shrink-0">
          <Image 
            src={medico.imagenSrc}
            alt={`Dr. ${medico.nombre}`}
            fill
            className="object-cover"
          />
        </div>
        
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-8 bg-[#FFC300] rounded-full"></div>
            <h4 className="text-2xl font-bold text-white">{medico.nombre}</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <Award size={18} className="text-[#FFC300]" />
              </div>
              <div>
                <p className="text-sm text-white/60">Especialidad</p>
                <p className="font-medium text-white">{medico.especialidad}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <Building size={18} className="text-[#FFC300]" />
              </div>
              <div>
                <p className="text-sm text-white/60">Hospital</p>
                <p className="font-medium text-white">{medico.hospital}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 md:col-span-2">
              <div className="p-2 bg-white/10 rounded-lg">
                <MapPin size={18} className="text-[#FFC300]" />
              </div>
              <div>
                <p className="text-sm text-white/60">Ubicación</p>
                <p className="font-medium text-white">{medico.direccion}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center md:justify-start">
        <Link 
          href={publicRoutes.quienesSomos}
          className="inline-flex items-center gap-2 px-8 py-4 bg-[#FFC300] text-[#0A3D62] rounded-xl font-bold hover:bg-white transition-all duration-300 group"
        >
          <span>Conocer más sobre nuestra institución</span>
          <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}