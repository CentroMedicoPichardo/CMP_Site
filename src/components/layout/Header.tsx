// src/components/layout/Header.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

import {
  Menu,
  X,
  LogIn,
  Phone,
  MapPin,
  Clock,
  ChevronRight,
  LogOut,
  Shield,
} from "lucide-react";

import {
  navigationItems,
  topBarInfo,
  publicRoutes,
} from "@/config/routes";

import { Container } from "../ui/Container";

const useAuth = () => {
  const pathname = usePathname();
  const [rol, setRol] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const cookieRol = document.cookie
      .split("; ")
      .find((row) => row.startsWith("rol="))
      ?.split("=")[1];

    const cookieUser = document.cookie
      .split("; ")
      .find((row) => row.startsWith("user="))
      ?.split("=")[1];

    setRol(cookieRol ?? null);
    
    if (cookieUser) {
      try {
        setUser(JSON.parse(decodeURIComponent(cookieUser)));
      } catch {
        setUser(null);
      }
    }
  }, [pathname]);

  return {
    rol,
    user,
    isAuthenticated: !!rol,
    isAdmin: rol === 'admin',
    isCliente: rol === 'cliente',
  };
};

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, isAdmin, isCliente, user, rol } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setMenuAbierto(!menuAbierto);

  const handleLogout = () => {
    document.cookie = "rol=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/");
    router.refresh();
  };

  // Header para ADMIN
  if (isAdmin) {
    return (
      <>
        <div className="bg-[#0A3D62] text-white/90 py-2 text-sm">
          <Container>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-[#FFC300]" />
                <span className="font-medium">Panel de Administración</span>
              </div>
              <span className="text-white/60">Sistema de Gestión</span>
            </div>
          </Container>
        </div>

        <header
          className={`sticky top-0 left-0 right-0 z-50 transition-all duration-500 ${
            scrolled ? "bg-white/95 backdrop-blur-md shadow-lg py-2" : "bg-white py-3"
          }`}
        >
          <Container>
            <div className="flex items-center justify-between">
              <Link href="/admin/dashboard" className="flex items-center gap-2">
                <Image src="/logo.png" alt="Logo" width={32} height={32} />
                <span className="text-lg font-semibold text-[#0A3D62]">Admin</span>
              </Link>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">{user?.nombre || 'Admin'}</p>
                  <p className="text-xs text-[#FFC300]">Administrador</p>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-gray-600 hover:text-red-500 font-medium border-l border-gray-200 pl-4"
                >
                  <LogOut size={18} />
                  <span className="hidden sm:inline">Cerrar Sesión</span>
                </button>

                <button className="md:hidden p-2" onClick={toggleMenu}>
                  {menuAbierto ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>
            </div>
          </Container>
        </header>
      </>
    );
  }

  // Header para PÚBLICO y CLIENTE
  return (
    <>
      <div className="bg-[#0A3D62] text-white/90 py-2.5 text-sm border-b border-white/5">
        <Container>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-[#FFC300]" />
                <span className="text-white/80">{topBarInfo.phone}</span>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <MapPin size={14} className="text-[#FFC300]" />
                <span className="text-white/80">{topBarInfo.location}</span>
              </div>
              <div className="hidden lg:flex items-center gap-2">
                <Clock size={14} className="text-[#FFC300]" />
                <span className="text-white/80">{topBarInfo.schedule}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link href={publicRoutes.ayuda} className="text-white/70 hover:text-[#FFC300]">
                Ayuda
              </Link>
              <span className="text-white/20">/</span>
              <Link href={publicRoutes.contacto} className="text-white/70 hover:text-[#FFC300]">
                Contacto
              </Link>
            </div>
          </div>
        </Container>
      </div>

      <header
        className={`sticky top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-white/95 backdrop-blur-md shadow-lg py-3" : "bg-white py-6"
        }`}
      >
        <Container>
          <div className="flex items-center justify-between">
            <Link href={publicRoutes.home} className="flex items-center gap-3">
              <Image src="/logo.png" alt="Centro Médico Pichardo" width={44} height={44} />
              <div className="flex flex-col">
                <span className="text-xl font-semibold text-[#0A3D62]">Centro Médico</span>
                <span className="text-xs text-[#FFC300] uppercase">Pichardo</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 py-2.5 text-gray-700 hover:text-[#0A3D62] font-medium rounded-lg hover:bg-[#FFF9E6]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              {!isAuthenticated ? (
                <Link
                  href={publicRoutes.acceder}
                  className="flex items-center gap-2 text-gray-600 hover:text-[#FFC300] font-medium border-r border-gray-200 pr-6"
                >
                  <LogIn size={18} />
                  <span className="hidden sm:inline">Acceder</span>
                </Link>
              ) : (
                <>                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-gray-600 hover:text-red-500 font-medium"
                  >
                    <LogOut size={18} />
                    <span className="hidden sm:inline">Cerrar Sesión</span>
                  </button>
                </>
              )}

              <button className="md:hidden p-2" onClick={toggleMenu}>
                {menuAbierto ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </Container>

        <div
          className={`md:hidden fixed inset-x-0 top-[110px] bg-white shadow-xl transition-all duration-500 ${
            menuAbierto
              ? "opacity-100 visible translate-y-0"
              : "opacity-0 invisible -translate-y-8"
          }`}
        >
          <Container className="py-4">
            <nav className="flex flex-col divide-y">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={toggleMenu}
                  className="px-4 py-5 flex justify-between"
                >
                  {item.label}
                  <ChevronRight size={18} />
                </Link>
              ))}

              {isAuthenticated && (
                <div className="px-4 py-4 bg-gray-50 rounded-lg my-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#0A3D62] rounded-full flex items-center justify-center text-white font-bold">
                      {user?.nombre?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{user?.nombre}</p>
                      <p className="text-xs text-[#FFC300]">Cliente</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4">
                {!isAuthenticated ? (
                  <Link
                    href={publicRoutes.acceder}
                    onClick={toggleMenu}
                    className="flex items-center justify-center gap-3 px-4 py-4 bg-[#0A3D62] text-white rounded-xl"
                  >
                    <LogIn size={20} />
                    Acceder
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                    className="flex items-center justify-center gap-3 w-full px-4 py-4 bg-red-500 text-white rounded-xl"
                  >
                    <LogOut size={20} />
                    Cerrar Sesión
                  </button>
                )}
              </div>
            </nav>
          </Container>
        </div>
      </header>

      {menuAbierto && (
        <div className="md:hidden fixed inset-0 bg-black/30 z-40" onClick={toggleMenu} />
      )}
    </>
  );
}