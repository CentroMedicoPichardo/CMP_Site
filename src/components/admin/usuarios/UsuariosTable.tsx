"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CircleUserRound,
  Loader2,
  Mail,
  Phone,
  SearchX,
  Shield,
  ShieldCheck,
  UserRound,
  UsersRound,
  XCircle,
} from "lucide-react";

import type {
  Rol,
  Usuario,
} from "@/types/usuarios";

interface UsuariosTableProps {
  usuarios: Usuario[];
  loading: boolean;
  onCambiarRol: (
    usuario: Usuario,
  ) => void;
  roles: Rol[];
}

const USUARIOS_POR_PAGINA = 10;

function cn(
  ...clases: Array<
    string | false | null | undefined
  >
): string {
  return clases.filter(Boolean).join(" ");
}

function textoSeguro(
  valor: unknown,
): string {
  return typeof valor === "string"
    ? valor.trim()
    : "";
}

function obtenerNombreCompleto(
  usuario: Usuario,
): string {
  const partes = [
    textoSeguro(usuario.nombre),
    textoSeguro(usuario.apellidoPaterno),
    textoSeguro(usuario.apellidoMaterno),
  ].filter(Boolean);

  return partes.length > 0
    ? partes.join(" ")
    : "Usuario sin nombre";
}

function obtenerIniciales(
  usuario: Usuario,
): string {
  const partes = [
    textoSeguro(usuario.nombre),
    textoSeguro(usuario.apellidoPaterno),
  ].filter(Boolean);

  const iniciales = partes
    .map((parte) => parte.charAt(0))
    .join("")
    .toUpperCase();

  return iniciales || "US";
}

function obtenerClaseRol(
  nombreRol: string,
): string {
  const rol =
    nombreRol.toLocaleLowerCase(
      "es-MX",
    );

  if (rol.includes("admin")) {
    return "border-red-200 bg-red-50 text-red-700";
  }

  if (
    rol.includes("medico") ||
    rol.includes("médico")
  ) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (
    rol.includes("cliente") ||
    rol.includes("usuario")
  ) {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }

  return "border-gray-200 bg-gray-50 text-gray-600";
}

function obtenerPaginasVisibles(
  paginaActual: number,
  totalPaginas: number,
): number[] {
  if (totalPaginas <= 5) {
    return Array.from(
      {
        length: totalPaginas,
      },
      (_, indice) => indice + 1,
    );
  }

  let inicio = Math.max(
    1,
    paginaActual - 2,
  );

  let fin = Math.min(
    totalPaginas,
    inicio + 4,
  );

  if (fin - inicio < 4) {
    inicio = Math.max(
      1,
      fin - 4,
    );
  }

  return Array.from(
    {
      length: fin - inicio + 1,
    },
    (_, indice) =>
      inicio + indice,
  );
}

export function UsuariosTable({
  usuarios,
  loading,
  onCambiarRol,
  roles,
}: UsuariosTableProps) {
  const tablaRef =
    useRef<HTMLDivElement>(null);

  const [
    paginaActual,
    setPaginaActual,
  ] = useState(1);

  const firmaUsuarios = useMemo(
    () =>
      usuarios
        .map((usuario) => usuario.id)
        .join("|"),
    [usuarios],
  );

  const totalPaginas = Math.max(
    1,
    Math.ceil(
      usuarios.length /
        USUARIOS_POR_PAGINA,
    ),
  );

  useEffect(() => {
    setPaginaActual(1);
  }, [firmaUsuarios]);

  useEffect(() => {
    setPaginaActual(
      (paginaAnterior) =>
        Math.min(
          Math.max(
            1,
            paginaAnterior,
          ),
          totalPaginas,
        ),
    );
  }, [totalPaginas]);

  const usuariosPagina = useMemo(() => {
    const inicio =
      (paginaActual - 1) *
      USUARIOS_POR_PAGINA;

    return usuarios.slice(
      inicio,
      inicio +
        USUARIOS_POR_PAGINA,
    );
  }, [
    usuarios,
    paginaActual,
  ]);

  const paginasVisibles =
    useMemo(
      () =>
        obtenerPaginasVisibles(
          paginaActual,
          totalPaginas,
        ),
      [
        paginaActual,
        totalPaginas,
      ],
    );

  const inicioMostrado =
    usuarios.length === 0
      ? 0
      : (paginaActual - 1) *
          USUARIOS_POR_PAGINA +
        1;

  const finMostrado = Math.min(
    paginaActual *
      USUARIOS_POR_PAGINA,
    usuarios.length,
  );

  const cambiarPagina = (
    nuevaPagina: number,
  ) => {
    const paginaSegura = Math.min(
      Math.max(1, nuevaPagina),
      totalPaginas,
    );

    setPaginaActual(paginaSegura);

    window.requestAnimationFrame(() => {
      tablaRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  if (loading) {
    return (
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div
          className="h-1 w-full bg-[#FFC300]"
          aria-hidden="true"
        />

        <div className="flex min-h-72 flex-col items-center justify-center gap-4 px-6 py-12">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF2F8] text-[#0A3D62]">
            <Loader2
              size={27}
              className="animate-spin"
              aria-hidden="true"
            />
          </span>

          <div className="text-center">
            <p className="text-sm font-extrabold text-[#0A3D62]">
              Cargando usuarios
            </p>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              Consultando las cuentas y
              permisos registrados.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (usuarios.length === 0) {
    return (
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div
          className="h-1 w-full bg-[#FFC300]"
          aria-hidden="true"
        />

        <div className="flex min-h-72 flex-col items-center justify-center px-6 py-12 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
            <SearchX
              size={29}
              aria-hidden="true"
            />
          </span>

          <h2 className="mt-4 text-base font-extrabold text-[#0A3D62]">
            No se encontraron usuarios
          </h2>

          <p className="mt-1 max-w-md text-sm leading-6 text-gray-500">
            No existen usuarios que
            coincidan con los filtros
            seleccionados.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={tablaRef}
      className="scroll-mt-28 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
    >
      <div
        className="h-1 w-full bg-[#FFC300]"
        aria-hidden="true"
      />

      <header className="border-b border-gray-100 px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0A3D62] text-[#FFC300]">
              <UsersRound
                size={19}
                aria-hidden="true"
              />
            </span>

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
                Administración de cuentas
              </p>

              <h2 className="mt-1 text-base font-extrabold text-[#0A3D62]">
                Usuarios registrados
              </h2>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                Consulta información de
                contacto, estado y permisos.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-[#F8FAFC] px-3 py-2 text-xs font-bold text-gray-600">
              <CircleUserRound
                size={14}
                className="text-[#0A3D62]"
                aria-hidden="true"
              />

              {usuarios.length.toLocaleString(
                "es-MX",
              )}{" "}
              {usuarios.length === 1
                ? "usuario"
                : "usuarios"}
            </span>

            <span className="inline-flex items-center gap-2 rounded-xl border border-[#FFC300]/35 bg-[#FFF9E6] px-3 py-2 text-xs font-bold text-[#0A3D62]">
              <ShieldCheck
                size={14}
                aria-hidden="true"
              />

              {roles.length.toLocaleString(
                "es-MX",
              )}{" "}
              {roles.length === 1
                ? "rol"
                : "roles"}
            </span>
          </div>
        </div>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] border-collapse">
          <thead className="bg-[#0A3D62] text-white">
            <tr>
              <th className="px-5 py-4 text-left text-[10px] font-extrabold uppercase tracking-[0.08em]">
                Usuario
              </th>

              <th className="px-5 py-4 text-left text-[10px] font-extrabold uppercase tracking-[0.08em]">
                Contacto
              </th>

              <th className="px-5 py-4 text-left text-[10px] font-extrabold uppercase tracking-[0.08em]">
                Rol
              </th>

              <th className="px-5 py-4 text-left text-[10px] font-extrabold uppercase tracking-[0.08em]">
                Estado
              </th>

              <th className="px-5 py-4 text-center text-[10px] font-extrabold uppercase tracking-[0.08em]">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {usuariosPagina.map(
              (usuario) => {
                const nombreCompleto =
                  obtenerNombreCompleto(
                    usuario,
                  );

                const rolNombre =
                  textoSeguro(
                    usuario.rolNombre,
                  ) || "Sin rol";

                const correo =
                  textoSeguro(
                    usuario.correo,
                  ) ||
                  "No registrado";

                const telefono =
                  textoSeguro(
                    usuario.telefono,
                  ) ||
                  "No registrado";

                return (
                  <tr
                    key={usuario.id}
                    className="transition-colors hover:bg-[#FFF9E6]/60"
                  >
                    <td className="px-5 py-4 align-middle">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EAF2F8] text-xs font-extrabold text-[#0A3D62]">
                          {obtenerIniciales(
                            usuario,
                          )}
                        </span>

                        <div className="min-w-0">
                          <p className="whitespace-normal break-words text-sm font-extrabold text-gray-800">
                            {nombreCompleto}
                          </p>

                          <p className="mt-1 text-[10px] font-semibold text-gray-400">
                            ID: {usuario.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 align-middle">
                      <div className="space-y-2">
                        <div className="flex min-w-0 items-start gap-2 text-xs text-gray-600">
                          <Mail
                            size={14}
                            className="mt-0.5 shrink-0 text-[#0A3D62]"
                            aria-hidden="true"
                          />

                          <span className="break-all">
                            {correo}
                          </span>
                        </div>

                        <div className="flex min-w-0 items-start gap-2 text-xs text-gray-600">
                          <Phone
                            size={14}
                            className="mt-0.5 shrink-0 text-[#0A3D62]"
                            aria-hidden="true"
                          />

                          <span className="break-words">
                            {telefono}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 align-middle">
                      <span
                        className={cn(
                          "inline-flex max-w-full items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-extrabold capitalize",
                          obtenerClaseRol(
                            rolNombre,
                          ),
                        )}
                      >
                        <Shield
                          size={12}
                          className="shrink-0"
                          aria-hidden="true"
                        />

                        <span className="break-words">
                          {rolNombre}
                        </span>
                      </span>
                    </td>

                    <td className="px-5 py-4 align-middle">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-extrabold",
                          usuario.activo
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-red-200 bg-red-50 text-red-700",
                        )}
                      >
                        {usuario.activo ? (
                          <CheckCircle2
                            size={13}
                            aria-hidden="true"
                          />
                        ) : (
                          <XCircle
                            size={13}
                            aria-hidden="true"
                          />
                        )}

                        {usuario.activo
                          ? "Activo"
                          : "Inactivo"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-center align-middle">
                      <button
                        type="button"
                        onClick={() => {
                          onCambiarRol(
                            usuario,
                          );
                        }}
                        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#FFC300] px-4 py-2 text-xs font-extrabold text-[#0A3D62] shadow-sm transition-colors hover:bg-[#EAB308] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D62] focus-visible:ring-offset-2"
                      >
                        <Shield
                          size={15}
                          aria-hidden="true"
                        />

                        Cambiar rol
                      </button>
                    </td>
                  </tr>
                );
              },
            )}
          </tbody>
        </table>
      </div>

      <footer className="border-t border-gray-100 bg-[#F8FAFC] px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-2 text-xs text-gray-500">
            <UserRound
              size={14}
              className="shrink-0 text-[#0A3D62]"
              aria-hidden="true"
            />

            <p className="break-words">
              Mostrando{" "}
              <span className="font-extrabold text-[#0A3D62]">
                {inicioMostrado}
              </span>{" "}
              a{" "}
              <span className="font-extrabold text-[#0A3D62]">
                {finMostrado}
              </span>{" "}
              de{" "}
              <span className="font-extrabold text-[#0A3D62]">
                {usuarios.length.toLocaleString(
                  "es-MX",
                )}
              </span>{" "}
              usuarios
            </p>
          </div>

          {totalPaginas > 1 && (
            <nav
              aria-label="Paginación de usuarios"
              className="flex flex-wrap items-center gap-1.5"
            >
              <button
                type="button"
                onClick={() => {
                  cambiarPagina(1);
                }}
                disabled={
                  paginaActual === 1
                }
                aria-label="Primera página"
                title="Primera página"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-colors hover:border-[#FFC300] hover:text-[#0A3D62] disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-300"
              >
                <ChevronsLeft
                  size={16}
                  aria-hidden="true"
                />
              </button>

              <button
                type="button"
                onClick={() => {
                  cambiarPagina(
                    paginaActual - 1,
                  );
                }}
                disabled={
                  paginaActual === 1
                }
                aria-label="Página anterior"
                title="Página anterior"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-colors hover:border-[#FFC300] hover:text-[#0A3D62] disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-300"
              >
                <ChevronLeft
                  size={16}
                  aria-hidden="true"
                />
              </button>

              {paginasVisibles.map(
                (pagina) => (
                  <button
                    key={pagina}
                    type="button"
                    onClick={() => {
                      cambiarPagina(
                        pagina,
                      );
                    }}
                    aria-current={
                      pagina ===
                      paginaActual
                        ? "page"
                        : undefined
                    }
                    className={cn(
                      "flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 text-xs font-extrabold transition-colors",
                      pagina ===
                        paginaActual
                        ? "border-[#0A3D62] bg-[#0A3D62] text-white"
                        : "border-gray-200 bg-white text-gray-600 hover:border-[#FFC300] hover:bg-[#FFF9E6] hover:text-[#0A3D62]",
                    )}
                  >
                    {pagina}
                  </button>
                ),
              )}

              <button
                type="button"
                onClick={() => {
                  cambiarPagina(
                    paginaActual + 1,
                  );
                }}
                disabled={
                  paginaActual ===
                  totalPaginas
                }
                aria-label="Página siguiente"
                title="Página siguiente"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-colors hover:border-[#FFC300] hover:text-[#0A3D62] disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-300"
              >
                <ChevronRight
                  size={16}
                  aria-hidden="true"
                />
              </button>

              <button
                type="button"
                onClick={() => {
                  cambiarPagina(
                    totalPaginas,
                  );
                }}
                disabled={
                  paginaActual ===
                  totalPaginas
                }
                aria-label="Última página"
                title="Última página"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-colors hover:border-[#FFC300] hover:text-[#0A3D62] disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-300"
              >
                <ChevronsRight
                  size={16}
                  aria-hidden="true"
                />
              </button>
            </nav>
          )}
        </div>
      </footer>
    </section>
  );
}