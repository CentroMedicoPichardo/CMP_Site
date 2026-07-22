"use client";

import Link from "next/link";
import {
  ArrowRight,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  ShieldOff,
  UserRound,
  Users,
} from "lucide-react";

import type { UsuarioDashboard } from "@/types/dashboard-admin";

interface UsuariosActivosProps {
  usuarios: UsuarioDashboard[];
}

function cn(
  ...clases: Array<
    string | false | null | undefined
  >
): string {
  return clases.filter(Boolean).join(" ");
}

function obtenerNombreCompleto(
  usuario: UsuarioDashboard,
): string {
  const nombre = [
    usuario.nombre,
    usuario.apellidoPaterno,
    usuario.apellidoMaterno,
  ]
    .filter(
      (valor) =>
        typeof valor === "string" &&
        valor.trim(),
    )
    .join(" ")
    .trim();

  return nombre || "Usuario sin nombre";
}

function obtenerIniciales(
  usuario: UsuarioDashboard,
): string {
  const iniciales = [
    usuario.nombre,
    usuario.apellidoPaterno,
  ]
    .filter(
      (valor) =>
        typeof valor === "string" &&
        valor.trim(),
    )
    .map((valor) =>
      valor.trim().charAt(0),
    )
    .join("")
    .toUpperCase();

  return iniciales || "U";
}

function normalizarRol(
  rol: string,
): string {
  return rol
    .trim()
    .toLocaleLowerCase("es-MX");
}

function formatearRol(
  rol: string,
): string {
  const valor = normalizarRol(rol);

  if (
    valor === "admin" ||
    valor === "administrador"
  ) {
    return "Administrador";
  }

  if (
    valor === "cliente" ||
    valor === "usuario"
  ) {
    return "Cliente";
  }

  if (
    valor === "instructor" ||
    valor === "instructora"
  ) {
    return "Instructor";
  }

  if (
    valor === "médico" ||
    valor === "medico" ||
    valor === "doctor" ||
    valor === "doctora"
  ) {
    return "Médico";
  }

  if (!valor) {
    return "Sin rol";
  }

  return (
    valor.charAt(0).toUpperCase() +
    valor.slice(1)
  );
}

function obtenerClaseRol(
  rol: string,
): string {
  const valor = normalizarRol(rol);

  if (
    valor === "admin" ||
    valor === "administrador"
  ) {
    return "border-violet-200 bg-violet-50 text-violet-700";
  }

  if (
    valor === "instructor" ||
    valor === "instructora"
  ) {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  if (
    valor === "médico" ||
    valor === "medico" ||
    valor === "doctor" ||
    valor === "doctora"
  ) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  return "border-blue-200 bg-blue-50 text-blue-700";
}

function obtenerClaseAvatar(
  rol: string,
): string {
  const valor = normalizarRol(rol);

  if (
    valor === "admin" ||
    valor === "administrador"
  ) {
    return "bg-violet-100 text-violet-700";
  }

  if (
    valor === "instructor" ||
    valor === "instructora"
  ) {
    return "bg-amber-100 text-amber-700";
  }

  if (
    valor === "médico" ||
    valor === "medico" ||
    valor === "doctor" ||
    valor === "doctora"
  ) {
    return "bg-emerald-100 text-emerald-700";
  }

  return "bg-[#EAF2F8] text-[#0A3D62]";
}

function estaBloqueado(
  bloqueadoHasta: string | null,
): boolean {
  if (!bloqueadoHasta) {
    return false;
  }

  const fecha = new Date(
    bloqueadoHasta,
  );

  return (
    !Number.isNaN(fecha.getTime()) &&
    fecha.getTime() > Date.now()
  );
}

function formatearBloqueo(
  bloqueadoHasta: string | null,
): string {
  if (!bloqueadoHasta) {
    return "Cuenta bloqueada";
  }

  const fecha = new Date(
    bloqueadoHasta,
  );

  if (Number.isNaN(fecha.getTime())) {
    return "Cuenta bloqueada";
  }

  return fecha.toLocaleString(
    "es-MX",
    {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    },
  );
}

export function UsuariosActivos({
  usuarios,
}: UsuariosActivosProps) {
  const cuentasActivas =
    usuarios.filter(
      (usuario) => usuario.activo,
    ).length;

  const cuentasBloqueadas =
    usuarios.filter((usuario) =>
      estaBloqueado(
        usuario.bloqueadoHasta,
      ),
    ).length;

  const activarScroll =
    usuarios.length > 4;

  return (
    <section className="flex h-full min-h-[650px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <header className="flex min-h-[82px] items-center justify-between gap-4 border-b border-gray-100 px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0A3D62] text-[#FFC300]">
            <Users
              size={19}
              strokeWidth={1.9}
              aria-hidden="true"
            />
          </span>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-extrabold text-[#0A3D62]">
                Usuarios recientes
              </h2>

              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-600">
                {usuarios.length} mostrados
              </span>
            </div>

            <p className="mt-0.5 text-xs text-gray-500">
              Estado, rol y seguridad
            </p>
          </div>
        </div>

        <Link
          href="/admin/usuarios"
          className="inline-flex shrink-0 items-center gap-1 text-xs font-extrabold text-[#0A3D62] transition-colors hover:text-[#D69E00]"
        >
          Ver todos

          <ArrowRight
            size={14}
            aria-hidden="true"
          />
        </Link>
      </header>

      {usuarios.length === 0 ? (
        <div className="flex flex-1 items-center justify-center px-5 py-8">
          <div className="w-full rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-5 py-12 text-center">
            <UserRound
              size={26}
              className="mx-auto text-gray-300"
              aria-hidden="true"
            />

            <p className="mt-3 text-sm font-bold text-gray-700">
              No hay usuarios registrados
            </p>
          </div>
        </div>
      ) : (
        <>
          <div
            className={cn(
              "flex-1 space-y-3 p-5",
              activarScroll &&
                "max-h-[860px] overflow-y-auto overscroll-contain pr-3",
            )}
            style={
              activarScroll
                ? {
                    scrollbarGutter:
                      "stable",
                  }
                : undefined
            }
            aria-label="Listado de usuarios recientes"
          >
            {usuarios.map((usuario) => {
              const nombreCompleto =
                obtenerNombreCompleto(
                  usuario,
                );

              const bloqueado =
                estaBloqueado(
                  usuario.bloqueadoHasta,
                );

              return (
                <article
                  key={usuario.id}
                  className={cn(
                    "min-h-[180px] rounded-2xl border p-4 transition-all",
                    "border-gray-200 bg-white hover:border-[#0A3D62]/25 hover:shadow-sm",
                    !usuario.activo &&
                      "bg-gray-50 opacity-80",
                    bloqueado &&
                      "border-red-200 bg-red-50/30 opacity-100",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold",
                        obtenerClaseAvatar(
                          usuario.rol,
                        ),
                      )}
                      aria-hidden="true"
                    >
                      {obtenerIniciales(
                        usuario,
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3
                          className="truncate text-sm font-extrabold text-[#0A3D62]"
                          title={nombreCompleto}
                        >
                          {nombreCompleto}
                        </h3>

                        <span
                          className={cn(
                            "rounded-full border px-2 py-0.5 text-[10px] font-bold",
                            obtenerClaseRol(
                              usuario.rol,
                            ),
                          )}
                        >
                          {formatearRol(
                            usuario.rol,
                          )}
                        </span>

                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[10px] font-bold",
                            usuario.activo
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-gray-200 text-gray-600",
                          )}
                        >
                          {usuario.activo
                            ? "Activo"
                            : "Inactivo"}
                        </span>
                      </div>

                      <div className="mt-2 grid gap-1.5 text-xs text-gray-500 sm:grid-cols-2">
                        <p className="flex min-w-0 items-center gap-1.5">
                          <Mail
                            size={13}
                            className="shrink-0"
                            aria-hidden="true"
                          />

                          <span
                            className="truncate"
                            title={
                              usuario.correo ||
                              "Sin correo"
                            }
                          >
                            {usuario.correo ||
                              "Sin correo"}
                          </span>
                        </p>

                        <p className="flex min-w-0 items-center gap-1.5">
                          <Phone
                            size={13}
                            className="shrink-0"
                            aria-hidden="true"
                          />

                          <span className="truncate">
                            {usuario.telefono ||
                              "Sin teléfono"}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className="rounded-xl bg-gray-50 px-3 py-2.5">
                      <p className="text-[10px] font-bold uppercase text-gray-400">
                        Seguridad
                      </p>

                      <p
                        className={cn(
                          "mt-1 flex items-center gap-1.5 text-xs font-bold",
                          usuario.mfaHabilitado
                            ? "text-emerald-700"
                            : "text-gray-500",
                        )}
                      >
                        {usuario.mfaHabilitado ? (
                          <ShieldCheck
                            size={13}
                            aria-hidden="true"
                          />
                        ) : (
                          <ShieldOff
                            size={13}
                            aria-hidden="true"
                          />
                        )}

                        MFA{" "}
                        {usuario.mfaHabilitado
                          ? "habilitado"
                          : "deshabilitado"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-gray-50 px-3 py-2.5">
                      <p className="text-[10px] font-bold uppercase text-gray-400">
                        Acceso
                      </p>

                      {bloqueado ? (
                        <p className="mt-1 flex items-center gap-1.5 text-xs font-bold text-red-600">
                          <LockKeyhole
                            size={13}
                            aria-hidden="true"
                          />

                          Bloqueado
                        </p>
                      ) : (
                        <p className="mt-1 text-xs font-bold text-emerald-700">
                          Disponible
                        </p>
                      )}
                    </div>
                  </div>

                  {bloqueado && (
                    <div className="mt-3 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-[10px] font-semibold text-red-600">
                      Bloqueada hasta{" "}
                      {formatearBloqueo(
                        usuario.bloqueadoHasta,
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          <footer className="flex min-h-[46px] flex-wrap items-center gap-3 border-t border-gray-100 px-5 py-3 text-[10px] font-semibold text-gray-500">
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />

              {cuentasActivas} activas
            </span>

            {cuentasBloqueadas > 0 && (
              <span className="inline-flex items-center gap-1 text-red-600">
                <LockKeyhole
                  size={11}
                  aria-hidden="true"
                />

                {cuentasBloqueadas} bloqueadas
              </span>
            )}

            {activarScroll && (
              <span className="ml-auto text-gray-400">
                Desplázate para ver más
              </span>
            )}
          </footer>
        </>
      )}
    </section>
  );
}