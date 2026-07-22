"use client";

import {
  ShieldCheck,
  UserCog,
  UsersRound,
} from "lucide-react";

interface UsuariosHeaderProps {
  totalUsuarios: number;
}

export function UsuariosHeader({
  totalUsuarios,
}: UsuariosHeaderProps) {
  const totalSeguro =
    typeof totalUsuarios === "number" &&
    Number.isFinite(totalUsuarios)
      ? Math.max(0, totalUsuarios)
      : 0;

  return (
    <header className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div
        className="h-1 w-full bg-[#FFC300]"
        aria-hidden="true"
      />

      <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0A3D62] text-[#FFC300] shadow-sm">
            <UsersRound
              size={23}
              strokeWidth={1.9}
              aria-hidden="true"
            />
          </span>

          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
              Administración de cuentas
            </p>

            <h1 className="mt-1 whitespace-normal break-words text-xl font-extrabold leading-tight text-[#0A3D62] sm:text-2xl">
              Gestión de usuarios
            </h1>

            <p className="mt-2 max-w-2xl whitespace-normal break-words text-sm leading-6 text-gray-500">
              Consulta las cuentas registradas,
              revisa su estado y administra los
              roles de acceso al sistema.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex min-h-14 items-center gap-3 rounded-xl border border-gray-200 bg-[#F8FAFC] px-4 py-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#0A3D62] shadow-sm">
              <UserCog
                size={17}
                strokeWidth={1.9}
                aria-hidden="true"
              />
            </span>

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                Usuarios registrados
              </p>

              <div className="mt-0.5 flex flex-wrap items-baseline gap-1.5">
                <p className="text-lg font-extrabold leading-none text-[#0A3D62]">
                  {totalSeguro.toLocaleString(
                    "es-MX",
                  )}
                </p>

                <span className="text-[10px] font-semibold text-gray-400">
                  {totalSeguro === 1
                    ? "cuenta"
                    : "cuentas"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex min-h-14 items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">
              <ShieldCheck
                size={17}
                strokeWidth={1.9}
                aria-hidden="true"
              />

              <span
                className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500"
                aria-hidden="true"
              />
            </span>

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-600">
                Operación permitida
              </p>

              <p className="mt-0.5 whitespace-normal break-words text-sm font-extrabold text-emerald-800">
                Consulta y cambio de roles
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}