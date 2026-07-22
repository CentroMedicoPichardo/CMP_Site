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

import {
  navigationItems,
  topBarInfo,
  publicRoutes,
} from "@/config/routes";

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
  initialRol: string | null = null,
) => {
  const pathname = usePathname();

  const [rol, setRol] = useState<string | null>(
    initialRol ? normalizarRol(initialRol) : null,
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
          const rolNormalizado = normalizarRol(
            data.usuario.rol,
          );

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
        console.error(
          "Error verificando sesión:",
          error,
        );

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

  const [menuAbierto, setMenuAbierto] =
    useState(false);

  const [scrolled, setScrolled] = useState(false);

  const [empresaInfo, setEmpresaInfo] =
    useState<EmpresaInfo | null>(null);

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
        console.error(
          "Error cargando información de empresa:",
          error,
        );

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
      window.removeEventListener(
        "scroll",
        handleScroll,
      );
    };
  }, []);

  useEffect(() => {
    setMenuAbierto(false);
  }, [pathname]);

  // Evita que se desplace la página detrás del menú.
  useEffect(() => {
    if (!menuAbierto || isAdmin) {
      return;
    }

    const overflowAnterior =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        overflowAnterior;
    };
  }, [menuAbierto, isAdmin]);

  // Permite cerrar el menú con Escape.
  useEffect(() => {
    const cerrarConEscape = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        setMenuAbierto(false);
      }
    };

    window.addEventListener(
      "keydown",
      cerrarConEscape,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        cerrarConEscape,
      );
    };
  }, []);

  const toggleMenu = () => {
    setMenuAbierto((prev) => !prev);
  };

  const cerrarMenu = () => {
    setMenuAbierto(false);
  };

  const handleLogout = async () => {
    limpiarSesion();
    cerrarMenu();

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error(
        "Error cerrando sesión:",
        error,
      );
    } finally {
      limpiarSesion();
      router.replace("/");
      router.refresh();
    }
  };

  const handleAyudaClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    event.preventDefault();
    cerrarMenu();
    router.push("/ayuda");
  };

  const logoUrl =
    empresaInfo?.logoUrl || "/logo.png";

  const empresaNombre =
    empresaInfo?.nombre || "Centro Médico";

  const empresaSubnombre = "Pichardo";

  const telefonoEmpresa =
    empresaInfo?.telefono || topBarInfo.phone;

  const direccionEmpresa =
    empresaInfo?.direccion || topBarInfo.location;

  const horarioEmpresa =
    empresaInfo?.horario || topBarInfo.schedule;

  /*
   * HEADER PARA ADMINISTRADOR
   */
  if (isAdmin) {
    return (
      <>
        <div className="bg-[#0A3D62] py-2 text-sm text-white/90">
          <Container>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield
                  size={16}
                  className="text-[#FFC300]"
                />

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
          className={`
            sticky left-0 right-0 top-0 z-[9999]
            transition-all duration-500
            ${
              scrolled
                ? "bg-white/95 py-2 shadow-lg backdrop-blur-md"
                : "bg-white py-3"
            }
          `}
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
                  className="
                    flex items-center gap-2
                    border-l border-gray-200
                    pl-4 font-medium
                    text-gray-600
                    transition-colors
                    hover:text-red-500
                  "
                >
                  <LogOut size={18} />

                  <span className="hidden sm:inline">
                    Cerrar sesión
                  </span>
                </button>
              </div>
            </div>
          </Container>
        </header>
      </>
    );
  }

  /*
   * HEADER PÚBLICO
   */
  return (
    <>
      {/* Barra superior */}
      <div className="border-b border-white/5 bg-[#0A3D62] py-2.5 text-sm text-white/90">
        <Container>
          <div className="flex items-center justify-between">
            <div className="flex min-w-0 items-center gap-5">
              <div className="flex items-center gap-2">
                <Phone
                  size={14}
                  className="shrink-0 text-[#FFC300]"
                />

                <span className="text-white/80">
                  {telefonoEmpresa}
                </span>
              </div>

              <div className="hidden items-center gap-2 lg:flex">
                <Clock
                  size={14}
                  className="shrink-0 text-[#FFC300]"
                />

                <span className="line-clamp-1 text-white/80">
                  {horarioEmpresa}
                </span>
              </div>

              <div className="hidden min-w-0 items-center gap-2 xl:flex">
                <MapPin
                  size={14}
                  className="shrink-0 text-[#FFC300]"
                />

                <span className="max-w-[280px] truncate text-white/80">
                  {direccionEmpresa}
                </span>
              </div>
            </div>

            <a
              href="/ayuda"
              onClick={handleAyudaClick}
              className="
                cursor-pointer text-white/70
                transition-colors
                hover:text-[#FFC300]
              "
            >
              Ayuda
            </a>
          </div>
        </Container>
      </div>

      {/* Encabezado principal */}
      <header
        className={`
          sticky left-0 right-0 top-0 z-[9999]
          transition-all duration-500
          ${
            scrolled
              ? "bg-white/95 py-3 shadow-lg backdrop-blur-md"
              : "bg-white py-6"
          }
        `}
      >
        <Container>
          <div className="flex items-center justify-between gap-3">
            <Link
              href={publicRoutes.home}
              className="flex min-w-0 items-center gap-3"
            >
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center">
                <Image
                  src={logoUrl}
                  alt={empresaNombre}
                  width={44}
                  height={44}
                  className="object-contain"
                />
              </div>

              <div className="flex min-w-0 flex-col">
                <span
                  className="
                    max-w-[190px] truncate
                    text-lg font-semibold
                    text-[#0A3D62]
                    sm:max-w-none sm:text-xl
                  "
                >
                  {empresaNombre}
                </span>

                <span className="text-xs uppercase text-[#FFC300]">
                  {empresaSubnombre}
                </span>
              </div>
            </Link>

            {/* Navegación de escritorio */}
            <nav className="hidden items-center gap-1 md:flex">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="
                    rounded-lg px-4 py-2.5
                    font-medium text-gray-700
                    transition-colors
                    hover:bg-[#FFF9E6]
                    hover:text-[#0A3D62]
                  "
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex shrink-0 items-center gap-2 sm:gap-4">
              {!authLoading &&
              !isAuthenticated ? (
                <Link
                  href={publicRoutes.acceder}
                  className="
                    hidden items-center gap-2
                    border-r border-gray-200
                    pr-6 font-medium
                    text-gray-600
                    transition-colors
                    hover:text-[#FFC300]
                    sm:flex
                  "
                >
                  <LogIn size={18} />
                  Acceder
                </Link>
              ) : null}

              {!authLoading &&
              isAuthenticated ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="
                    hidden items-center gap-2
                    font-medium text-gray-600
                    transition-colors
                    hover:text-red-500
                    sm:flex
                  "
                >
                  <LogOut size={18} />
                  Cerrar sesión
                </button>
              ) : null}

              {/* Botón del menú móvil */}
              <button
                type="button"
                onClick={toggleMenu}
                className="
                  flex h-11 w-11
                  items-center justify-center
                  rounded-lg
                  text-[#0A3D62]
                  transition-colors
                  hover:bg-[#FFF9E6]
                  md:hidden
                "
                aria-label={
                  menuAbierto
                    ? "Cerrar menú"
                    : "Abrir menú"
                }
                aria-expanded={menuAbierto}
                aria-controls="menu-publico-movil"
              >
                {menuAbierto ? (
                  <X size={26} />
                ) : (
                  <Menu size={26} />
                )}
              </button>
            </div>
          </div>
        </Container>
      </header>

      {/* Menú móvil completo */}
      <div
        className={`
          fixed inset-0 z-[10000]
          md:hidden
          ${
            menuAbierto
              ? "visible"
              : "invisible"
          }
        `}
        aria-hidden={!menuAbierto}
      >
        {/* Fondo oscuro */}
        <button
          type="button"
          onClick={cerrarMenu}
          tabIndex={menuAbierto ? 0 : -1}
          aria-label="Cerrar menú"
          className={`
            absolute inset-0
            bg-black/45
            transition-opacity duration-300
            ${
              menuAbierto
                ? "opacity-100"
                : "opacity-0"
            }
          `}
        />

        {/* Panel lateral */}
        <aside
          id="menu-publico-movil"
          className={`
            absolute right-0 top-0
            flex h-[100dvh]
            w-[92%] max-w-[420px]
            flex-col
            overflow-hidden
            bg-white
            text-[#0A3D62]
            opacity-100
            shadow-2xl
            transition-transform
            duration-300 ease-in-out
            ${
              menuAbierto
                ? "translate-x-0"
                : "translate-x-full"
            }
          `}
        >
          {/* Cabecera del menú */}
          <div
            className="
              flex shrink-0
              items-center justify-between
              gap-3
              border-b border-gray-200
              bg-white
              px-5 py-5
            "
          >
            <Link
              href={publicRoutes.home}
              onClick={cerrarMenu}
              className="flex min-w-0 items-center gap-3"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center">
                <Image
                  src={logoUrl}
                  alt={empresaNombre}
                  width={44}
                  height={44}
                  className="object-contain"
                />
              </div>

              <div className="min-w-0">
                <p
                  className="
                    truncate text-lg font-semibold
                    text-[#0A3D62]
                  "
                >
                  {empresaNombre}
                </p>

                <p className="text-xs uppercase text-[#FFC300]">
                  {empresaSubnombre}
                </p>
              </div>
            </Link>

            <button
              type="button"
              onClick={cerrarMenu}
              className="
                flex h-11 w-11 shrink-0
                items-center justify-center
                rounded-full
                text-[#0A3D62]
                opacity-100
                transition-colors
                hover:bg-gray-100
              "
              aria-label="Cerrar menú"
            >
              <X size={27} />
            </button>
          </div>

          {/* Enlaces */}
          <nav
            className="
              flex-1 overflow-y-auto
              bg-white
              px-5 py-3
              text-[#0A3D62]
              opacity-100
            "
          >
            {navigationItems.map((item) => {
              const activo =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href ||
                    pathname.startsWith(
                      `${item.href}/`,
                    );

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={cerrarMenu}
                  className={`
                    flex min-h-16
                    items-center justify-between
                    gap-4
                    border-b border-gray-200
                    px-4 py-4
                    text-base font-semibold
                    opacity-100
                    transition-colors
                    ${
                      activo
                        ? "bg-[#FFF9E6] text-[#0A3D62]"
                        : "bg-white text-[#0A3D62] hover:bg-gray-50"
                    }
                  `}
                >
                  <span className="text-[#0A3D62] opacity-100">
                    {item.label}
                  </span>

                  <ChevronRight
                    size={20}
                    className="
                      shrink-0
                      text-[#0A3D62]
                      opacity-100
                    "
                  />
                </Link>
              );
            })}

            {/* Datos del usuario */}
            {isAuthenticated && user ? (
              <div
                className="
                  my-4 rounded-xl
                  border border-gray-200
                  bg-gray-50
                  px-4 py-4
                "
              >
                <div className="flex items-center gap-3">
                  <div
                    className="
                      flex h-11 w-11
                      shrink-0
                      items-center justify-center
                      rounded-full
                      bg-[#0A3D62]
                      font-bold text-white
                    "
                  >
                    {inicialUsuario}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-medium text-gray-800">
                      {nombreUsuario}
                    </p>

                    <p className="text-xs font-medium text-[#D89F00]">
                      Cliente
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </nav>

          {/* Acción inferior */}
          <div
            className="
              shrink-0
              border-t border-gray-200
              bg-white
              px-5 pb-6 pt-4
            "
          >
            {!authLoading &&
            !isAuthenticated ? (
              <Link
                href={publicRoutes.acceder}
                onClick={cerrarMenu}
                className="
                  flex min-h-14 w-full
                  items-center justify-center
                  gap-3 rounded-xl
                  bg-[#0A3D62]
                  px-4 py-4
                  font-semibold text-white
                  opacity-100
                  shadow-sm
                  transition-colors
                  hover:bg-[#082f4d]
                "
              >
                <LogIn size={21} />
                Acceder
              </Link>
            ) : null}

            {!authLoading &&
            isAuthenticated ? (
              <button
                type="button"
                onClick={handleLogout}
                className="
                  flex min-h-14 w-full
                  items-center justify-center
                  gap-3 rounded-xl
                  bg-red-500
                  px-4 py-4
                  font-semibold text-white
                  opacity-100
                  shadow-sm
                  transition-colors
                  hover:bg-red-600
                "
              >
                <LogOut size={21} />
                Cerrar sesión
              </button>
            ) : null}
          </div>
        </aside>
      </div>
    </>
  );
}