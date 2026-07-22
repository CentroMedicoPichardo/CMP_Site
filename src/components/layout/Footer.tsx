"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import {
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  BookOpen,
  Users,
  Calendar,
  FileText,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
} from "react-icons/fa";

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

/**
 * Une clases sin conservar saltos de línea o espacios de indentación.
 * Evita diferencias entre el HTML del servidor y el cliente.
 */
function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  const [empresaInfo, setEmpresaInfo] =
    useState<EmpresaInfo | null>(null);

  useEffect(() => {
    const cargarEmpresaInfo = async () => {
      try {
        const res = await fetch("/api/empresa-info", {
          cache: "no-store",
        });

        if (!res.ok) {
          return;
        }

        const data: EmpresaInfo = await res.json();
        setEmpresaInfo(data);
      } catch (error) {
        console.error(
          "Error cargando información de la empresa:",
          error,
        );
      }
    };

    cargarEmpresaInfo();
  }, []);

  const nombreEmpresa =
    empresaInfo?.nombre || "Centro Médico Pichardo";

  const direccionEmpresa =
    empresaInfo?.direccion ||
    "Av. Benito Juárez S/N, Huejutla de Reyes, Hidalgo. CP 43000";

  const telefonoEmpresa =
    empresaInfo?.telefono || "(771) 123-4567";

  const correoEmpresa =
    empresaInfo?.correo || "contacto@cmpichardo.com";

  const logoUrl =
    empresaInfo?.logoUrl || "/logo.png";

  const facebookUrl = empresaInfo?.facebook;
  const instagramUrl = empresaInfo?.instagram;

  const telefonoLimpio = telefonoEmpresa.replace(
    /[^\d+]/g,
    "",
  );

  return (
    <footer className="mt-auto w-full bg-[#0A3D62] font-sans text-white">
      {/* Sección principal */}
      <div className="py-14 sm:py-16">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-6 xl:px-4">
          <div
            className={cn(
              "grid grid-cols-1 gap-10",
              "md:grid-cols-2",
              "lg:grid-cols-[1.3fr_0.9fr_0.9fr_1.5fr]",
              "lg:gap-8 xl:gap-10",
            )}
          >
            {/* Marca */}
            <div className="lg:pr-3">
              <div className="mb-6 flex items-center gap-4">
                <div
                  className={cn(
                    "relative flex shrink-0 items-center justify-center overflow-hidden",
                    "h-20 w-20 sm:h-24 sm:w-24",
                    "rounded-2xl border border-white/20 bg-white p-2 shadow-lg",
                  )}
                >
                  <Image
                    src={logoUrl}
                    alt={`Logo ${nombreEmpresa}`}
                    width={84}
                    height={84}
                    className="h-full w-full object-contain"
                  />
                </div>

                <div className="min-w-0">
                  <span className="block text-xl font-bold leading-tight text-white sm:text-2xl">
                    {nombreEmpresa}
                  </span>

                  <span className="mt-1 block text-sm font-semibold uppercase tracking-[0.18em] text-[#FFC300]">
                    Pichardo
                  </span>
                </div>
              </div>

              <p className="mb-7 max-w-md text-[0.95rem] leading-relaxed text-[#D2D8DF]">
                Comprometidos con el desarrollo saludable y el
                bienestar integral de los niños de Huejutla.
                Atención pediátrica de excelencia con calidez
                humana.
              </p>

              {/* Redes sociales */}
              <div className="flex flex-wrap items-center gap-3">
                {facebookUrl ? (
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Visitar Facebook"
                    title="Facebook"
                    className={cn(
                      "inline-flex min-h-12 items-center gap-3 rounded-full",
                      "bg-[#1877F2] px-5 py-3 font-semibold text-white shadow-lg",
                      "transition-all duration-300",
                      "hover:-translate-y-1 hover:bg-[#0f65d9] hover:shadow-xl",
                      "focus:outline-none focus:ring-2 focus:ring-[#FFC300]",
                      "focus:ring-offset-2 focus:ring-offset-[#0A3D62]",
                    )}
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#1877F2]">
                      <FaFacebookF
                        size={21}
                        aria-hidden="true"
                      />
                    </span>

                    <span>Facebook</span>
                  </a>
                ) : null}

                {instagramUrl ? (
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Visitar Instagram"
                    title="Instagram"
                    className={cn(
                      "inline-flex min-h-12 items-center gap-3 rounded-full",
                      "bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737]",
                      "px-5 py-3 font-semibold text-white shadow-lg",
                      "transition-all duration-300",
                      "hover:-translate-y-1 hover:shadow-xl",
                      "focus:outline-none focus:ring-2 focus:ring-[#FFC300]",
                      "focus:ring-offset-2 focus:ring-offset-[#0A3D62]",
                    )}
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#E1306C]">
                      <FaInstagram
                        size={21}
                        aria-hidden="true"
                      />
                    </span>

                    <span>Instagram</span>
                  </a>
                ) : null}
              </div>
            </div>

            {/* Enlaces rápidos */}
            <div>
              <h4
                className={cn(
                  "relative mb-6 text-lg font-bold text-white",
                  "after:absolute after:-bottom-2 after:left-0",
                  "after:h-0.5 after:w-8 after:bg-[#FFC300]",
                  "after:content-['']",
                )}
              >
                Enlaces Rápidos
              </h4>

              <ul className="space-y-3">
                {[
                  {
                    href: "/",
                    label: "Inicio",
                  },
                  {
                    href: "/quienes-somos",
                    label: "Quiénes Somos",
                  },
                  {
                    href: "/servicios",
                    label: "Servicios",
                  },
                  {
                    href: "/directorio-medico",
                    label: "Directorio Médico",
                  },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center gap-1.5",
                        "text-[0.95rem] text-[#D2D8DF]",
                        "transition-all duration-200",
                        "hover:pl-1 hover:text-[#FFC300]",
                      )}
                    >
                      <ChevronRight
                        size={17}
                        strokeWidth={1.8}
                      />

                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recursos */}
            <div>
              <h4
                className={cn(
                  "relative mb-6 text-lg font-bold text-white",
                  "after:absolute after:-bottom-2 after:left-0",
                  "after:h-0.5 after:w-8 after:bg-[#FFC300]",
                  "after:content-['']",
                )}
              >
                Recursos
              </h4>

              <ul className="space-y-3">
                {[
                  {
                    href: "/saber-pediatrico",
                    label: "Saber Pediátrico",
                    icon: BookOpen,
                  },
                  {
                    href: "/cursos",
                    label: "Cursos y Talleres",
                    icon: Calendar,
                  },
                  {
                    href: "/blog",
                    label: "Blog",
                    icon: FileText,
                  },
                  {
                    href: "/acceder",
                    label: "Acceder",
                    icon: Users,
                  },
                ].map((link) => {
                  const Icon = link.icon;

                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={cn(
                          "flex items-center gap-2",
                          "text-[0.95rem] text-[#D2D8DF]",
                          "transition-all duration-200",
                          "hover:pl-1 hover:text-[#FFC300]",
                        )}
                      >
                        <Icon
                          size={17}
                          strokeWidth={1.8}
                        />

                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Contacto */}
            <div className="min-w-0">
              <h4
                className={cn(
                  "relative mb-6 text-lg font-bold text-white",
                  "after:absolute after:-bottom-2 after:left-0",
                  "after:h-0.5 after:w-8 after:bg-[#FFC300]",
                  "after:content-['']",
                )}
              >
                Contacto
              </h4>

              <ul className="space-y-5">
                <li className="flex items-start gap-3 text-[0.95rem] leading-relaxed text-[#D2D8DF]">
                  <MapPin
                    size={21}
                    className="mt-0.5 shrink-0 text-[#FFC300]"
                    strokeWidth={1.8}
                  />

                  <span>{direccionEmpresa}</span>
                </li>

                <li className="flex items-center gap-3 text-[0.95rem] text-[#D2D8DF]">
                  <Phone
                    size={21}
                    className="shrink-0 text-[#FFC300]"
                    strokeWidth={1.8}
                  />

                  <a
                    href={`tel:${telefonoLimpio}`}
                    className="transition-colors hover:text-[#FFC300]"
                  >
                    {telefonoEmpresa}
                  </a>
                </li>

                <li className="flex min-w-0 items-center gap-3 text-[#D2D8DF]">
                  <Mail
                    size={21}
                    className="shrink-0 text-[#FFC300]"
                    strokeWidth={1.8}
                  />

                  <a
                    href={`mailto:${correoEmpresa}`}
                    title={correoEmpresa}
                    className={cn(
                      "whitespace-nowrap text-sm",
                      "transition-colors hover:text-[#FFC300]",
                      "xl:text-[0.95rem]",
                    )}
                  >
                    {correoEmpresa}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Sección inferior */}
      <div className="border-t border-white/10 bg-[#052640] py-6">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-6 xl:px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="m-0 text-center text-[0.85rem] text-[#BFC7D0] md:text-left">
              © {currentYear} {nombreEmpresa}. Todos los
              derechos reservados.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/privacidad"
                className={cn(
                  "text-[0.85rem] text-[#BFC7D0]",
                  "transition-colors duration-200",
                  "hover:text-[#FFC300] hover:underline",
                )}
              >
                Aviso de Privacidad
              </Link>

              <span
                className="text-white/20"
                aria-hidden="true"
              >
                |
              </span>

              <Link
                href="/terminos"
                className={cn(
                  "text-[0.85rem] text-[#BFC7D0]",
                  "transition-colors duration-200",
                  "hover:text-[#FFC300] hover:underline",
                )}
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