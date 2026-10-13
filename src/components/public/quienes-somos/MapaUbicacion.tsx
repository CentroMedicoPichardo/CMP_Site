import { Building2, Map } from "lucide-react";

interface MapaUbicacionProps {
  direccion?: string;
}

/**
 * La dirección proviene de /api/empresa-info. Hasta contar con coordenadas
 * verificadas, no se muestra un pin ni se generan enlaces de navegación.
 */
export function MapaUbicacion({ direccion }: MapaUbicacionProps) {
  const direccionMostrada = direccion?.trim();

  return (
    <section
      className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_18px_50px_rgba(10,61,98,0.10)]"
      aria-labelledby="mapa-ubicacion-titulo"
    >
      <div className="bg-[#0A3D62] px-5 py-6 text-white sm:px-6">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFC300] text-[#0A3D62]">
            <Building2 size={23} aria-hidden="true" />
          </span>
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#FFC300]">Visítanos</span>
            <h2 id="mapa-ubicacion-titulo" className="mt-1 text-xl font-extrabold sm:text-2xl">Nuestra ubicación</h2>
          </div>
        </div>
      </div>

      <div className="flex min-h-[340px] flex-col items-center justify-center bg-[#F4F7FA] px-6 py-10 text-center sm:min-h-[410px]">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-[#0A3D62] shadow-md">
          <Map size={30} aria-hidden="true" />
        </span>
        <h3 className="mt-5 text-lg font-extrabold text-[#0A3D62]">Centro Médico Pichardo</h3>
        <p className="mt-3 max-w-md text-base leading-7 text-gray-700">
          {direccionMostrada || "Dirección no disponible en este momento."}
        </p>
        <p className="mt-4 max-w-md text-sm leading-6 text-gray-500">
          El mapa y las indicaciones estarán disponibles cuando se verifique la ubicación exacta.
        </p>
      </div>
    </section>
  );
}
