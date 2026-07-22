import type { ReactNode } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";

interface BotonRegistroSocialProps {
  proveedor: string;
  icono: ReactNode;
  iconoClase?: string;
}

export function RegisterSocialButtons() {
  return (
    <div
      className="grid grid-cols-2 gap-2.5"
      aria-label="Opciones de registro social"
    >
      <BotonRegistroSocial
        proveedor="Google"
        icono={
          <FcGoogle
            size={20}
            aria-hidden="true"
          />
        }
      />

      <BotonRegistroSocial
        proveedor="Facebook"
        icono={
          <FaFacebookF
            size={17}
            aria-hidden="true"
          />
        }
        iconoClase="bg-[#1877F2] text-white"
      />
    </div>
  );
}

function BotonRegistroSocial({
  proveedor,
  icono,
  iconoClase,
}: BotonRegistroSocialProps) {
  return (
    <button
      type="button"
      aria-label={`Registrarse con ${proveedor}`}
      className="group relative flex min-h-12 min-w-0 items-center justify-center gap-2.5 overflow-hidden rounded-xl border border-gray-200 bg-white px-3 py-2.5 shadow-[0_5px_16px_rgba(10,61,98,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#FFC300] hover:bg-[#FFFDF5] hover:shadow-[0_9px_22px_rgba(10,61,98,0.10)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300] focus-visible:ring-offset-2 active:translate-y-0"
    >
      <span
        className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-[#FFC300] transition-transform duration-300 group-hover:scale-x-100"
        aria-hidden="true"
      />

      <span
        className={
          iconoClase
            ? `flex h-8 w-8 shrink-0 items-center justify-center rounded-lg shadow-sm ${iconoClase}`
            : "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-gray-100 bg-white shadow-sm"
        }
      >
        {icono}
      </span>

      <span className="min-w-0 text-left">
        <span className="block text-[8px] font-bold uppercase tracking-[0.1em] text-gray-400">
          Registrarme con
        </span>

        <span className="block truncate text-xs font-extrabold text-[#0A3D62] sm:text-sm">
          {proveedor}
        </span>
      </span>
    </button>
  );
}