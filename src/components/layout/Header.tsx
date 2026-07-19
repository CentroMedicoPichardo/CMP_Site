// src/components/layout/Header.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

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

import { navigationItems, topBarInfo, publicRoutes } from "@/config/routes";
import { Container } from "../ui/Container";

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

interface AuthUser {
  id: number;
  nombre: string;
  apellidoPaterno?: string | null;
  apellidoMaterno?: string | null;
  nombreCompleto?: string;
  correo?: string;
  email?: string;
  rol: string;
}

interface HeaderProps {
  initialUser?: AuthUser | null;
  initialRol?: string | null;
}

const normalizarRol = (rol?: string | null): string => {
  const value = (rol ?? "").toLowerCase().trim();

  if (
    value === "admin" ||
    value === "administrador" ||
    value === "administrator"
  ) {
    return "admin";
  }

  return value;
};

const useAuth = (
  initialUser: AuthUser | null = null,
  initialRol: string | null = null
) => {
  const pathname = usePathname();

  const [rol, setRol] = useState<string | null>(
    initialRol ? normalizarRol(initialRol) : null
  );

  const [user, setUser] = useState<AuthUser | null>(initialUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelado = false;

    const verificarSesion = async () => {
      try {
        setLoading(true);

        const res = await fetch("/api/auth/verificar", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (!res.ok) {
          if (!cancelado) {
            setUser(null);
            setRol(null);
          }

          return;
        }

        const data = await res.json();

        if (cancelado) {
          return;
        }

        if (data.loggedIn && data.usuario) {
          const rolNormalizado = normalizarRol(data.usuario.rol);

          setUser({
            ...data.usuario,
            rol: rolNormalizado,
          });

          setRol(rolNormalizado);
        } else {
          setUser(null);
          setRol(null);
        }
      } catch (error) {
        console.error("Error verificando sesión:", error);

        if (!cancelado) {
          setUser(null);
          setRol(null);
        }
      } finally {
        if (!cancelado) {
          setLoading(false);
        }
      }
    };

    verificarSesion();

    return () => {
      cancelado = true;
    };
  }, [pathname]);

  const limpiarSesion = () => {
    setUser(null);
    setRol(null);
  };

  return {
    loading,
    rol,
    user,
    isAuthenticated: Boolean(user && rol),
    isAdmin: rol === "admin",
    limpiarSesion,
  };
};

export function Header({
  initialUser = null,
  initialRol = null,
}: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [menuAbierto, setMenuAbierto] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [empresaInfo, setEmpresaInfo] = useState<EmpresaInfo | null>(null);

  const {
    loading: authLoading,
    isAuthenticated,
    isAdmin,
    user,
    limpiarSesion,
  } = useAuth(initialUser, initialRol);

  const nombreUsuario =
    user?.nombreCompleto?.trim() ||
    [
      user?.nombre,
      user?.apellidoPaterno,
      user?.apellidoMaterno,
    ]
      .filter(Boolean)
      .join(" ")
      .trim() ||
    "Usuario";

  const inicialUsuario =
    user?.nombre?.trim().charAt(0).toUpperCase() ||
    nombreUsuario.charAt(0).toUpperCase() ||
    "U";

  useEffect(() => {
    const cargarEmpresaInfo = async () => {
      try {
        const res = await fetch("/api/empresa-info", {
          cache: "no-store",
        });

        if (!res.ok) {
          return;
        }

        const data = await res.json();
        setEmpresaInfo(data);
      } catch (error) {
        console.error("Error cargando información de empresa:", error);
        setEmpresaInfo(null);
      }
    };

    cargarEmpresaInfo();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setMenuAbierto(false);
  }, [pathname]);

  const toggleMenu = () => {
    setMenuAbierto((prev) => !prev);
  };

  const cerrarMenu = () => {
    setMenuAbierto(false);
  };

  const handleLogout = async () => {
    limpiarSesion();
    setMenuAbierto(false);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Error cerrando sesión:", error);
    } finally {
      limpiarSesion();
      router.replace("/");
      router.refresh();
    }
  };

  const handleAyudaClick = (
    event: React.MouseEvent<HTMLAnchorElement>
  ) => {
    event.preventDefault();
    cerrarMenu();
    router.push("/ayuda");
  };

  const logoUrl = empresaInfo?.logoUrl || "/logo.png";
  const empresaNombre = empresaInfo?.nombre || "Centro Médico";
  const empresaSubnombre = "Pichardo";

  const telefonoEmpresa =
    empresaInfo?.telefono || topBarInfo.phone;

  const direccionEmpresa =
    empresaInfo?.direccion || topBarInfo.location;

  const horarioEmpresa =
    empresaInfo?.horario || topBarInfo.schedule;

  if (isAdmin) {
    return (
      <>
        <div className="bg-[#0A3D62] py-2 text-sm text-white/90">
          <Container>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-[#FFC300]" />
                <span className="font-medium">
                  Panel de Administración
                </span>
              </div>

              <span className="text-white/60">
                Sistema de Gestión
              </span>
            </div>
          </Container>
        </div>

        <header
          className={`sticky left-0 right-0 top-0 z-[9999] transition-all duration-500 ${
            scrolled
              ? "bg-white/95 py-2 shadow-lg backdrop-blur-md"
              : "bg-white py-3"
          }`}
        >
          <Container>
            <div className="flex items-center justify-between">
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-2"
              >
                <Image
                  src={logoUrl}
                  alt={empresaNombre}
                  width={32}
                  height={32}
                  className="object-contain"
                />

                <span className="text-lg font-semibold text-[#0A3D62]">
                  Admin
                </span>
              </Link>

              <div className="flex items-center gap-4">
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-medium text-gray-700">
                    {nombreUsuario}
                  </p>

                  <p className="text-xs text-[#FFC300]">
                    Administrador
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 border-l border-gray-200 pl-4 font-medium text-gray-600 hover:text-red-500"
                >
                  <LogOut size={18} />

                  <span className="hidden sm:inline">
                    Cerrar sesión
                  </span>
                </button>

                <button
                  type="button"
                  className="p-2 md:hidden"
                  onClick={toggleMenu}
                  aria-label={
                    menuAbierto ? "Cerrar menú" : "Abrir menú"
                  }
                >
                  {menuAbierto ? (
                    <X size={20} />
                  ) : (
                    <Menu size={20} />
                  )}
                </button>
              </div>
            </div>
          </Container>
        </header>
      </>
    );
  }

  return (
    <>
      <div className="border-b border-white/5 bg-[#0A3D62] py-2.5 text-sm text-white/90">
        <Container>
          <div className="flex items-center justify-between">
            <div className="flex min-w-0 items-center gap-5">
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-[#FFC300]" />

                <span className="text-white/80">
                  {telefonoEmpresa}
                </span>
              </div>

              <div className="hidden items-center gap-2 lg:flex">
                <Clock size={14} className="text-[#FFC300]" />

                <span className="line-clamp-1 text-white/80">
                  {horarioEmpresa}
                </span>
              </div>

              <div className="hidden min-w-0 items-center gap-2 xl:flex">
                <MapPin
                  size={14}
                  className="flex-shrink-0 text-[#FFC300]"
                />

                <span className="max-w-[280px] truncate text-white/80">
                  {direccionEmpresa}
                </span>
              </div>
            </div>

            <a
              href="/ayuda"
              onClick={handleAyudaClick}
              className="cursor-pointer text-white/70 transition-colors hover:text-[#FFC300]"
            >
              Ayuda
            </a>
          </div>
        </Container>
      </div>

      <header
        className={`sticky left-0 right-0 top-0 z-[9999] transition-all duration-500 ${
          scrolled
            ? "bg-white/95 py-3 shadow-lg backdrop-blur-md"
            : "bg-white py-6"
        }`}
      >
        <Container>
          <div className="flex items-center justify-between">
            <Link
              href={publicRoutes.home}
              className="flex items-center gap-3"
            >
              <div className="relative flex h-12 w-12 items-center justify-center">
                <Image
                  src={logoUrl}
                  alt={empresaNombre}
                  width={44}
                  height={44}
                  className="object-contain"
                />
              </div>

              <div className="flex flex-col">
                <span className="text-xl font-semibold text-[#0A3D62]">
                  {empresaNombre}
                </span>

                <span className="text-xs uppercase text-[#FFC300]">
                  {empresaSubnombre}
                </span>
              </div>
            </Link>

            <nav className="hidden items-center gap-1 md:flex">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-4 py-2.5 font-medium text-gray-700 hover:bg-[#FFF9E6] hover:text-[#0A3D62]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              {!authLoading && !isAuthenticated ? (
                <Link
                  href={publicRoutes.acceder}
                  className="flex items-center gap-2 border-r border-gray-200 pr-6 font-medium text-gray-600 hover:text-[#FFC300]"
                >
                  <LogIn size={18} />

                  <span className="hidden sm:inline">
                    Acceder
                  </span>
                </Link>
              ) : null}

              {!authLoading && isAuthenticated ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 font-medium text-gray-600 hover:text-red-500"
                >
                  <LogOut size={18} />

                  <span className="hidden sm:inline">
                    Cerrar sesión
                  </span>
                </button>
              ) : null}

              <button
                type="button"
                className="p-2 md:hidden"
                onClick={toggleMenu}
                aria-label={
                  menuAbierto ? "Cerrar menú" : "Abrir menú"
                }
              >
                {menuAbierto ? (
                  <X size={22} />
                ) : (
                  <Menu size={22} />
                )}
              </button>
            </div>
          </div>
        </Container>

        <div
          className={`fixed inset-x-0 top-[110px] z-[9998] bg-white shadow-xl transition-all duration-500 md:hidden ${
            menuAbierto
              ? "visible translate-y-0 opacity-100"
              : "invisible -translate-y-8 opacity-0"
          }`}
        >
          <Container className="py-4">
            <nav className="flex flex-col divide-y">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={cerrarMenu}
                  className="flex justify-between px-4 py-5"
                >
                  {item.label}
                  <ChevronRight size={18} />
                </Link>
              ))}

              {isAuthenticated && user ? (
                <div className="my-2 rounded-lg bg-gray-50 px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0A3D62] font-bold text-white">
                      {inicialUsuario}
                    </div>

                    <div>
                      <p className="font-medium text-gray-800">
                        {nombreUsuario}
                      </p>

                      <p className="text-xs text-[#FFC300]">
                        Cliente
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="pt-4">
                {!authLoading && !isAuthenticated ? (
                  <Link
                    href={publicRoutes.acceder}
                    onClick={cerrarMenu}
                    className="flex items-center justify-center gap-3 rounded-xl bg-[#0A3D62] px-4 py-4 text-white"
                  >
                    <LogIn size={20} />
                    Acceder
                  </Link>
                ) : null}

                {!authLoading && isAuthenticated ? (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center justify-center gap-3 rounded-xl bg-red-500 px-4 py-4 text-white"
                  >
                    <LogOut size={20} />
                    Cerrar sesión
                  </button>
                ) : null}
              </div>
            </nav>
          </Container>
        </div>
      </header>

      {menuAbierto ? (
        <div
          className="fixed inset-0 z-[9997] bg-black/30 md:hidden"
          onClick={cerrarMenu}
        />
      ) : null}
    </>
  );
}