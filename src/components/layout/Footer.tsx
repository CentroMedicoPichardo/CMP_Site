// src/components/layout/FooterPublico.tsx
import React from 'react';
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
  Twitter,
  Star
} from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

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
                    src="/logo.png" 
                    alt="Logo Centro Médico Pichardo"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <span className="text-lg font-bold text-white leading-tight">
                  Centro Médico Pichardo
                </span>
              </div>
              
              <p className="text-[#B0B8C1] text-[0.95rem] leading-relaxed mb-6">
                Comprometidos con el desarrollo saludable y el bienestar integral de los niños de Huejutla. 
                Atención pediátrica de excelencia con calidez humana.
              </p>

              {/* Redes sociales */}
              <div className="flex gap-4">
                {[
                  { Icon: Facebook, href: "#", label: "Facebook" },
                  { Icon: Instagram, href: "#", label: "Instagram" },
                  { Icon: Twitter, href: "#", label: "Twitter" }
                ].map(({ Icon, href, label }) => (
                  <a 
                    key={label}
                    href={href}
                    className="bg-white/10 p-2 rounded-full text-white hover:bg-[#FFC300] hover:text-[#0A3D62] transition-all duration-300 hover:-translate-y-1"
                    aria-label={label}
                  >
                    <Icon size={20} strokeWidth={1.5} />
                  </a>
                ))}
              </div>
            </div>

            {/* Columna 2: Enlaces Rápidos */}
            <div>
              <h4 className="text-white text-lg font-bold mb-6 relative after:content-[''] after:absolute after:left-0 after:-bottom-2 after:w-7 after:h-0.5 after:bg-[#FFC300]">
                Enlaces Rápidos
              </h4>
              <ul className="space-y-3">
                {[
                  { href: "/usuarios/public/screens/HomePublico", label: "Inicio" },
                  { href: "/usuarios/public/screens/QuienesSomos", label: "Quiénes Somos" },
                  { href: "/usuarios/public/screens/Servicios", label: "Servicios" },
                  { href: "/usuarios/public/screens/DirectorioMedico", label: "Directorio Médico" },
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
                  { href: "/usuarios/public/screens/Academia", label: "Academia Infantil", icon: BookOpen },
                  { href: "/usuarios/public/screens/CatalogoCursos", label: "Cursos y Talleres", icon: Calendar },
                  { href: "/usuarios/public/screens/Blog", label: "Blog", icon: FileText },
                  { href: "/usuarios/public/screens/Login", label: "Portal Pacientes", icon: Users },
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
                  <span>Av. Benito Juárez S/N, Huejutla de Reyes, Hidalgo. CP 43000</span>
                </li>
                <li className="flex items-center gap-3 text-[#B0B8C1] text-[0.95rem]">
                  <Phone size={20} className="text-[#FFC300] flex-shrink-0" strokeWidth={1.5} />
                  <span>(771) 123-4567</span>
                </li>
                <li className="flex items-center gap-3 text-[#B0B8C1] text-[0.95rem]">
                  <Mail size={20} className="text-[#FFC300] flex-shrink-0" strokeWidth={1.5} />
                  <span>contacto@cmpichardo.com</span>
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
              © {currentYear} Centro Médico Pichardo. Todos los derechos reservados.
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