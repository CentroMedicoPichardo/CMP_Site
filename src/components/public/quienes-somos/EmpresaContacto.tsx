"use client";

import {
  AtSign,
  BadgeCheck,
  CalendarClock,
  ExternalLink,
  LifeBuoy,
  MapPinned,
  MessageCircle,
  Navigation,
  PhoneCall,
} from "lucide-react";

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

interface EmpresaContactoProps {
  empresaInfo: EmpresaInfo | null;
}

function crearEnlaceTelefono(telefono: string): string {
  const numero = telefono.replace(/[^\d+]/g, "");

  return `tel:${numero}`;
}

function crearEnlaceMapa(direccion: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    direccion,
  )}`;
}

export function EmpresaContacto({
  empresaInfo,
}: EmpresaContactoProps) {
  if (!empresaInfo) {
    return null;
  }

  const enlaceTelefono = crearEnlaceTelefono(
    empresaInfo.telefono,
  );

  const enlaceMapa = crearEnlaceMapa(
    empresaInfo.direccion,
  );

  const mostrarCorreoSoporte =
    Boolean(empresaInfo.correoSoporte) &&
    empresaInfo.correoSoporte !== empresaInfo.correo;

  return (
    <aside
      className="flex h-full flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_18px_50px_rgba(10,61,98,0.10)]"
      aria-labelledby="empresa-contacto-titulo"
    >
      {/* Encabezado */}
      <div className="relative shrink-0 overflow-hidden bg-[#0A3D62] px-5 py-6 text-white sm:px-6">
        <div
          className="absolute -right-10 -top-12 h-36 w-36 rounded-full border-[22px] border-white/5"
          aria-hidden="true"
        />

        <div
          className="absolute -bottom-14 -left-10 h-36 w-36 rounded-full bg-[#FFC300]/10 blur-xl"
          aria-hidden="true"
        />

        <div
          className="absolute bottom-0 left-0 h-1.5 w-full bg-[#FFC300]"
          aria-hidden="true"
        />

        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#FFC300] backdrop-blur-sm sm:text-xs">
            <BadgeCheck
              size={14}
              strokeWidth={2}
              aria-hidden="true"
            />

            Estamos para atenderte
          </span>

          <h2
            id="empresa-contacto-titulo"
            className="mt-4 text-2xl font-extrabold leading-tight sm:text-3xl"
          >
            Información de contacto
          </h2>

          <p className="mt-2 max-w-md text-sm leading-6 text-white/75 sm:text-base">
            Comunícate con {empresaInfo.nombre} o visítanos en nuestras
            instalaciones.
          </p>

          {/* Acciones principales */}
          <div className="mt-5 grid grid-cols-2 gap-2.5">
            <a
              href={enlaceTelefono}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#FFC300] px-3 py-2.5 text-sm font-bold text-[#0A3D62] transition-colors hover:bg-[#FFD43B] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <PhoneCall
                size={17}
                strokeWidth={2}
                aria-hidden="true"
              />

              Llamar
            </a>

            <a
              href={`mailto:${empresaInfo.correo}`}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-2.5 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300]"
            >
              <MessageCircle
                size={17}
                strokeWidth={2}
                aria-hidden="true"
              />

              Escribir
            </a>
          </div>
        </div>
      </div>

      {/* Información */}
      <address className="flex-1 not-italic">
        <div className="grid content-start gap-3 p-4 sm:grid-cols-2 sm:p-5">
          {/* Dirección */}
          <a
            href={enlaceMapa}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-[#F8FAFC] p-4 transition-all duration-200 hover:border-blue-200 hover:bg-blue-50/40 hover:shadow-md sm:col-span-2"
          >
            <div className="flex items-start gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                <MapPinned
                  size={21}
                  strokeWidth={1.9}
                  aria-hidden="true"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-[0.17em] text-blue-600 sm:text-xs">
                    Dirección
                  </span>

                  <ExternalLink
                    size={15}
                    className="shrink-0 text-gray-400 transition-colors group-hover:text-blue-600"
                    aria-hidden="true"
                  />
                </div>

                <p className="mt-1.5 text-sm font-semibold leading-6 text-gray-700 sm:text-base">
                  {empresaInfo.direccion}
                </p>

                <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600">
                  <Navigation
                    size={13}
                    aria-hidden="true"
                  />

                  Ver ubicación en el mapa
                </span>
              </div>
            </div>
          </a>

          {/* Teléfono */}
          <a
            href={enlaceTelefono}
            className="group rounded-2xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-emerald-200 hover:bg-emerald-50/40 hover:shadow-md sm:col-span-2"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                <PhoneCall
                  size={19}
                  strokeWidth={1.9}
                  aria-hidden="true"
                />
              </div>

              <div className="min-w-0 flex-1">
                <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-600 sm:text-xs">
                  Teléfono
                </span>

                <div className="mt-1 flex items-center justify-between gap-3">
                  <p className="text-sm font-bold leading-6 text-[#0A3D62] sm:text-base">
                    {empresaInfo.telefono}
                  </p>

                  <span className="shrink-0 text-xs font-semibold text-emerald-600">
                    Toca para llamar
                  </span>
                </div>
              </div>
            </div>
          </a>

          {/* Correo electrónico */}
          <a
            href={`mailto:${empresaInfo.correo}`}
            className="group min-w-0 rounded-2xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-amber-200 hover:bg-amber-50/40 hover:shadow-md sm:col-span-2"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 transition-colors group-hover:bg-[#FFC300] group-hover:text-[#0A3D62]">
                <AtSign
                  size={20}
                  strokeWidth={1.9}
                  aria-hidden="true"
                />
              </div>

              <div className="min-w-0 flex-1">
                <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-[#B88600] sm:text-xs">
                  Correo electrónico
                </span>

                <div className="mt-1 flex min-w-0 items-center justify-between gap-3">
                  <p
                    className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap text-xs font-bold text-[#0A3D62] [scrollbar-width:none] sm:text-sm [&::-webkit-scrollbar]:hidden"
                    title={empresaInfo.correo}
                  >
                    {empresaInfo.correo}
                  </p>

                  <ExternalLink
                    size={15}
                    className="shrink-0 text-gray-400 transition-colors group-hover:text-[#B88600]"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>
          </a>

          {/* Horario */}
          <div className="relative overflow-hidden rounded-2xl border border-[#0A3D62]/10 bg-[#F1F6FA] p-4 sm:col-span-2">
            <div
              className="absolute right-0 top-0 h-24 w-24 rounded-full bg-[#0A3D62]/5 blur-xl"
              aria-hidden="true"
            />

            <div className="relative flex items-start gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0A3D62] text-white shadow-sm">
                <CalendarClock
                  size={21}
                  strokeWidth={1.9}
                  aria-hidden="true"
                />
              </div>

              <div className="min-w-0 flex-1">
                <span className="block text-[10px] font-bold uppercase tracking-[0.17em] text-[#0A3D62] sm:text-xs">
                  Horario de atención
                </span>

                <p className="mt-2 whitespace-pre-line text-sm font-semibold leading-7 text-gray-700 sm:text-base">
                  {empresaInfo.horario}
                </p>
              </div>
            </div>
          </div>

          {/* Soporte */}
          {mostrarCorreoSoporte && empresaInfo.correoSoporte && (
            <a
              href={`mailto:${empresaInfo.correoSoporte}`}
              className="group min-w-0 rounded-2xl border border-violet-200 bg-violet-50/60 p-4 transition-colors hover:bg-violet-100/60 sm:col-span-2"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                  <LifeBuoy
                    size={19}
                    strokeWidth={1.9}
                    aria-hidden="true"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-violet-700 sm:text-xs">
                    Soporte y asistencia
                  </span>

                  <p
                    className="mt-1 overflow-x-auto whitespace-nowrap text-xs font-bold text-[#0A3D62] [scrollbar-width:none] sm:text-sm [&::-webkit-scrollbar]:hidden"
                    title={empresaInfo.correoSoporte}
                  >
                    {empresaInfo.correoSoporte}
                  </p>
                </div>
              </div>
            </a>
          )}
        </div>
      </address>

      {/* Estado inferior */}
      <div className="mt-auto flex shrink-0 items-center justify-center gap-2 border-t border-gray-100 bg-white px-5 py-3">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />

          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
        </span>

        <span className="text-xs font-semibold text-gray-500">
          Atención cercana y respuesta oportuna
        </span>
      </div>
    </aside>
  );
}