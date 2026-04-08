// src/components/layout/FooterPublico.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from "../ui/Container";
import { 
  Phone, 
  Mail, 
  MapPin, 
  ChevronRight, 
  Heart, 
  Clock, 
  Award, 
  Shield,
  BookOpen,
  Users,
  Calendar,
  FileText,
  Facebook,
  Instagram,
  Star
} from 'lucide-react';

interface EmpresaInfo {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  correo: string;
  facebook: string | null;
  instagram: string | null;
  horario: string;
  logoUrl: string | null;
  correoSoporte: string | null;
}

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [empresaInfo, setEmpresaInfo] = useState<EmpresaInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarEmpresaInfo = async () => {
      try {
        const res = await fetch('/api/empresa-info');
        if (res.ok) {
          const data = await res.json();
          setEmpresaInfo(data);
        }
      } catch (error) {
        console.error('Error cargando información de la empresa:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarEmpresaInfo();
  }, []);

  // Si está cargando, mostrar el footer con datos por defecto
  const nombreEmpresa = empresaInfo?.nombre || 'Centro Médico Pichardo';
  const direccionEmpresa = empresaInfo?.direccion || 'Av. Benito Juárez S/N, Huejutla de Reyes, Hidalgo. CP 43000';
  const telefonoEmpresa = empresaInfo?.telefono || '(771) 123-4567';
  const correoEmpresa = empresaInfo?.correo || 'contacto@cmpichardo.com';
  const logoUrl = empresaInfo?.logoUrl || '/logo.png';
  const facebookUrl = empresaInfo?.facebook;
  const instagramUrl = empresaInfo?.instagram;

  return (
    <footer className="w-full mt-auto bg-[#0A3D62] text-white font-sans">
      {/* TOP SECTION */}
      <div className="py-16 px-5 md:py-16 md:px-5">
        <div className="max-w-6xl mx-auto px-5">
          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr] gap-10">
            
            {/* Columna 1: Branding */}
            <div>
              <div className="flex items-center gap-2.5 mb-5">
                <div className="relative w-12 h-12 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                  <Image 
                    src={logoUrl}
                    alt={`Logo ${nombreEmpresa}`}
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <span className="text-lg font-bold text-white leading-tight">
                  {nombreEmpresa}
                </span>
              </div>
              
              <p className="text-[#B0B8C1] text-[0.95rem] leading-relaxed mb-6">
                Comprometidos con el desarrollo saludable y el bienestar integral de los niños de Huejutla. 
                Atención pediátrica de excelencia con calidez humana.
              </p>

              {/* Redes sociales - solo mostrar si hay URLs */}
              <div className="flex gap-4">
                {facebookUrl && (
                  <a 
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/10 p-2 rounded-full text-white hover:bg-[#FFC300] hover:text-[#0A3D62] transition-all duration-300 hover:-translate-y-1"
                    aria-label="Facebook"
                  >
                    <Facebook size={20} strokeWidth={1.5} />
                  </a>
                )}
                {instagramUrl && (
                  <a 
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/10 p-2 rounded-full text-white hover:bg-[#FFC300] hover:text-[#0A3D62] transition-all duration-300 hover:-translate-y-1"
                    aria-label="Instagram"
                  >
                    <Instagram size={20} strokeWidth={1.5} />
                  </a>
                )}
              </div>
            </div>

            {/* Columna 2: Enlaces Rápidos */}
            <div>
              <h4 className="text-white text-lg font-bold mb-6 relative after:content-[''] after:absolute after:left-0 after:-bottom-2 after:w-7 after:h-0.5 after:bg-[#FFC300]">
                Enlaces Rápidos
              </h4>
              <ul className="space-y-3">
                {[
                  { href: "/", label: "Inicio" },
                  { href: "/quienes-somos", label: "Quiénes Somos" },
                  { href: "/servicios", label: "Servicios" },
                  { href: "/directorio-medico", label: "Directorio Médico" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href}
                      className="text-[#B0B8C1] text-[0.95rem] flex items-center gap-1.5 hover:text-[#FFC300] hover:pl-1 transition-all duration-200"
                    >
                      <ChevronRight size={16} strokeWidth={1.5} />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Columna 3: Recursos */}
            <div>
              <h4 className="text-white text-lg font-bold mb-6 relative after:content-[''] after:absolute after:left-0 after:-bottom-2 after:w-7 after:h-0.5 after:bg-[#FFC300]">
                Recursos
              </h4>
              <ul className="space-y-3">
                {[
                  { href: "/saber-pediatrico", label: "Saber Pediátrico", icon: BookOpen },
                  { href: "/cursos", label: "Cursos y Talleres", icon: Calendar },
                  { href: "/blog", label: "Blog", icon: FileText },
                  { href: "/acceder", label: "Acceder", icon: Users },
                ].map((link) => {
                  const Icon = link.icon;
                  return (
                    <li key={link.href}>
                      <Link 
                        href={link.href}
                        className="text-[#B0B8C1] text-[0.95rem] flex items-center gap-1.5 hover:text-[#FFC300] hover:pl-1 transition-all duration-200"
                      >
                        <Icon size={16} strokeWidth={1.5} />
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Columna 4: Contacto */}
            <div>
              <h4 className="text-white text-lg font-bold mb-6 relative after:content-[''] after:absolute after:left-0 after:-bottom-2 after:w-7 after:h-0.5 after:bg-[#FFC300]">
                Contacto
              </h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-[#B0B8C1] text-[0.95rem] leading-relaxed">
                  <MapPin size={20} className="text-[#FFC300] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                  <span>{direccionEmpresa}</span>
                </li>
                <li className="flex items-center gap-3 text-[#B0B8C1] text-[0.95rem]">
                  <Phone size={20} className="text-[#FFC300] flex-shrink-0" strokeWidth={1.5} />
                  <span>{telefonoEmpresa}</span>
                </li>
                <li className="flex items-center gap-3 text-[#B0B8C1] text-[0.95rem]">
                  <Mail size={20} className="text-[#FFC300] flex-shrink-0" strokeWidth={1.5} />
                  <span>{correoEmpresa}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="bg-[#052640] py-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[#B0B8C1] text-[0.85rem] m-0">
              © {currentYear} {nombreEmpresa}. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-4">
              <Link 
                href="/privacidad" 
                className="text-[#B0B8C1] text-[0.85rem] hover:text-[#FFC300] hover:underline transition-colors duration-200"
              >
                Aviso de Privacidad
              </Link>
              <span className="text-white/20">|</span>
              <Link 
                href="/terminos" 
                className="text-[#B0B8C1] text-[0.85rem] hover:text-[#FFC300] hover:underline transition-colors duration-200"
              >
                Términos de Uso
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}