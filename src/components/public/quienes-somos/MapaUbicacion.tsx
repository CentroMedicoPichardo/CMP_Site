"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  ExternalLink,
  LocateFixed,
  MapPinned,
  Navigation,
} from "lucide-react";

const CENTRO_MEDICO_COORDS = {
  lat: 21.1478391,
  lng: -98.3988505,
};

const DEFAULT_ZOOM = 17;

const DIRECCION_PREDETERMINADA =
  "Calle Patria, Sin Número, Satélite, Anáhuac, Huejutla de Reyes, Hidalgo.";

declare global {
  interface Window {
    L?: any;
  }
}

interface MapaUbicacionProps {
  direccion?: string;
}

function cargarLeaflet(): Promise<any> {
  return new Promise((resolve, reject) => {
    if (window.L) {
      resolve(window.L);
      return;
    }

    const cssExistente = document.querySelector<HTMLLinkElement>(
      'link[data-leaflet-css="true"]',
    );

    if (!cssExistente) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href =
        "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      link.dataset.leafletCss = "true";
      document.head.appendChild(link);
    }

    const scriptExistente =
      document.querySelector<HTMLScriptElement>(
        'script[data-leaflet-script="true"]',
      );

    if (scriptExistente) {
      scriptExistente.addEventListener(
        "load",
        () => resolve(window.L),
        { once: true },
      );

      scriptExistente.addEventListener(
        "error",
        () => reject(new Error("No se pudo cargar Leaflet")),
        { once: true },
      );

      return;
    }

    const script = document.createElement("script");
    script.src =
      "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;
    script.dataset.leafletScript = "true";

    script.addEventListener("load", () => {
      if (window.L) {
        resolve(window.L);
      } else {
        reject(
          new Error(
            "Leaflet se cargó, pero no está disponible.",
          ),
        );
      }
    });

    script.addEventListener("error", () => {
      reject(new Error("No se pudo cargar Leaflet"));
    });

    document.body.appendChild(script);
  });
}

function crearContenidoPopup(
  direccion: string,
): HTMLDivElement {
  const contenedor = document.createElement("div");
  contenedor.style.minWidth = "210px";
  contenedor.style.padding = "4px";
  contenedor.style.textAlign = "center";

  const titulo = document.createElement("strong");
  titulo.textContent = "Centro Médico Pichardo";
  titulo.style.display = "block";
  titulo.style.color = "#0A3D62";
  titulo.style.fontSize = "14px";
  titulo.style.marginBottom = "5px";

  const textoDireccion = document.createElement("span");
  textoDireccion.textContent = direccion;
  textoDireccion.style.display = "block";
  textoDireccion.style.color = "#64748B";
  textoDireccion.style.fontSize = "12px";
  textoDireccion.style.lineHeight = "1.5";

  contenedor.appendChild(titulo);
  contenedor.appendChild(textoDireccion);

  return contenedor;
}

export function MapaUbicacion({
  direccion,
}: MapaUbicacionProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const resizeObserverRef =
    useRef<ResizeObserver | null>(null);

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  const direccionMostrada =
    direccion?.trim() || DIRECCION_PREDETERMINADA;

  const urlComoLlegar =
    `https://www.google.com/maps/dir/?api=1` +
    `&destination=${CENTRO_MEDICO_COORDS.lat},${CENTRO_MEDICO_COORDS.lng}`;

  const urlUbicacion =
    `https://www.google.com/maps/search/?api=1` +
    `&query=${CENTRO_MEDICO_COORDS.lat},${CENTRO_MEDICO_COORDS.lng}`;

  useEffect(() => {
    let componenteActivo = true;

    async function inicializarMapa() {
      if (!mapRef.current || mapInstanceRef.current) {
        return;
      }

      try {
        setCargando(true);
        setError(false);

        const L = await cargarLeaflet();

        if (
          !componenteActivo ||
          !mapRef.current ||
          !L
        ) {
          return;
        }

        const map = L.map(mapRef.current, {
          center: [
            CENTRO_MEDICO_COORDS.lat,
            CENTRO_MEDICO_COORDS.lng,
          ],
          zoom: DEFAULT_ZOOM,
          zoomControl: false,
          scrollWheelZoom: false,
          doubleClickZoom: true,
          dragging: true,
          attributionControl: true,
        });

        mapInstanceRef.current = map;

        L.tileLayer(
          "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
          {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: "abcd",
            maxZoom: 20,
            minZoom: 3,
          },
        ).addTo(map);

        L.control
          .zoom({
            position: "bottomright",
          })
          .addTo(map);

        const iconoPersonalizado = L.divIcon({
          html: `
            <div
              style="
                position: relative;
                display: flex;
                width: 52px;
                height: 52px;
                align-items: center;
                justify-content: center;
                border: 4px solid white;
                border-radius: 18px;
                background: #FFC300;
                color: #0A3D62;
                box-shadow: 0 12px 28px rgba(10, 61, 98, 0.30);
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0A3D62"
                stroke-width="2.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>

              <span
                style="
                  position: absolute;
                  left: 50%;
                  bottom: -11px;
                  width: 18px;
                  height: 18px;
                  border-right: 4px solid white;
                  border-bottom: 4px solid white;
                  background: #FFC300;
                  transform: translateX(-50%) rotate(45deg);
                  z-index: -1;
                "
              ></span>
            </div>
          `,
          className: "",
          iconSize: [52, 63],
          iconAnchor: [26, 63],
          popupAnchor: [0, -62],
        });

        const marker = L.marker(
          [
            CENTRO_MEDICO_COORDS.lat,
            CENTRO_MEDICO_COORDS.lng,
          ],
          {
            icon: iconoPersonalizado,
            title: "Centro Médico Pichardo",
          },
        ).addTo(map);

        marker.bindPopup(
          crearContenidoPopup(direccionMostrada),
          {
            closeButton: false,
            offset: [0, -4],
          },
        );

        marker.openPopup();

        window.setTimeout(() => {
          map.invalidateSize();
        }, 150);

        if (
          typeof ResizeObserver !== "undefined" &&
          mapRef.current
        ) {
          resizeObserverRef.current =
            new ResizeObserver(() => {
              map.invalidateSize();
            });

          resizeObserverRef.current.observe(
            mapRef.current,
          );
        }

        if (componenteActivo) {
          setCargando(false);
        }
      } catch (errorMapa) {
        console.error(
          "Error al inicializar el mapa:",
          errorMapa,
        );

        if (componenteActivo) {
          setCargando(false);
          setError(true);
        }
      }
    }

    const temporizador = window.setTimeout(() => {
      inicializarMapa();
    }, 100);

    return () => {
      componenteActivo = false;
      window.clearTimeout(temporizador);

      resizeObserverRef.current?.disconnect();
      resizeObserverRef.current = null;

      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch {
          // El mapa ya pudo haber sido eliminado.
        }

        mapInstanceRef.current = null;
      }
    };
  }, [direccionMostrada]);

  return (
    <section
      className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_18px_50px_rgba(10,61,98,0.10)]"
      aria-labelledby="mapa-ubicacion-titulo"
    >
      {/* Encabezado */}
      <div className="relative overflow-hidden bg-[#0A3D62] px-5 py-5 text-white sm:px-6">
        <div
          className="absolute -right-10 -top-12 h-32 w-32 rounded-full border-[20px] border-white/5"
          aria-hidden="true"
        />

        <div
          className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-[#FFC300]/10 blur-xl"
          aria-hidden="true"
        />

        <div
          className="absolute bottom-0 left-0 h-1.5 w-full bg-[#FFC300]"
          aria-hidden="true"
        />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFC300] text-[#0A3D62] shadow-md">
              <MapPinned
                size={23}
                strokeWidth={2}
                aria-hidden="true"
              />
            </div>

            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#FFC300] sm:text-xs">
                Visítanos
              </span>

              <h2
                id="mapa-ubicacion-titulo"
                className="mt-0.5 text-xl font-extrabold sm:text-2xl"
              >
                Nuestra ubicación
              </h2>

              <p className="mt-1 max-w-xl text-sm leading-6 text-white/75">
                {direccionMostrada}
              </p>
            </div>
          </div>

          <a
            href={urlComoLlegar}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#FFC300] px-4 py-2.5 text-sm font-bold text-[#0A3D62] shadow-sm transition-colors hover:bg-[#FFD43B] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <Navigation
              size={17}
              strokeWidth={2}
              aria-hidden="true"
            />
            Cómo llegar
          </a>
        </div>
      </div>

      {/* Mapa */}
      <div className="relative">
        <div
          ref={mapRef}
          className="h-[340px] w-full bg-[#E9EEF3] sm:h-[410px] lg:h-[460px]"
          aria-label="Mapa con la ubicación del Centro Médico Pichardo"
        />

        {/* Estado de carga */}
        {cargando && !error && (
          <div className="absolute inset-0 z-[500] flex items-center justify-center bg-[#F4F7FA]">
            <div className="flex flex-col items-center text-center">
              <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#0A3D62] shadow-lg">
                <LocateFixed
                  size={26}
                  className="animate-pulse"
                  aria-hidden="true"
                />

                <span className="absolute inset-0 animate-ping rounded-2xl border border-[#FFC300]/50" />
              </span>

              <p className="mt-4 text-sm font-bold text-[#0A3D62]">
                Cargando ubicación
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Preparando el mapa para ti.
              </p>
            </div>
          </div>
        )}

        {/* Estado de error */}
        {error && (
          <div className="absolute inset-0 z-[500] flex items-center justify-center bg-[#F4F7FA] p-6">
            <div className="max-w-sm text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                <AlertCircle
                  size={27}
                  strokeWidth={1.9}
                  aria-hidden="true"
                />
              </div>

              <h3 className="mt-4 text-lg font-extrabold text-[#0A3D62]">
                No fue posible cargar el mapa
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Puedes abrir nuestra ubicación directamente en
                Google Maps.
              </p>

              <a
                href={urlUbicacion}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#0A3D62] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#082F4D]"
              >
                <ExternalLink
                  size={17}
                  aria-hidden="true"
                />
                Abrir ubicación
              </a>
            </div>
          </div>
        )}

        {/* Etiqueta flotante */}
        {!cargando && !error && (
          <div className="pointer-events-none absolute bottom-4 left-4 z-[400] hidden items-center gap-2 rounded-xl border border-white/80 bg-white/95 px-3 py-2 text-xs font-semibold text-[#0A3D62] shadow-lg backdrop-blur sm:flex">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>

            Ubicación exacta del centro médico
          </div>
        )}
      </div>

      {/* Pie */}
      <div className="flex flex-col gap-3 border-t border-gray-200 bg-[#F8FAFC] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FFF6D6] text-[#B88600]">
            <LocateFixed
              size={18}
              strokeWidth={1.9}
              aria-hidden="true"
            />
          </div>

          <div>
            <p className="text-sm font-bold text-[#0A3D62]">
              Centro Médico Pichardo
            </p>

            <p className="mt-0.5 text-xs leading-5 text-gray-500">
              Nos encontramos en la colonia Satélite, sobre Calle
              Patria.
            </p>
          </div>
        </div>

        <a
          href={urlUbicacion}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-[#0A3D62]/15 bg-white px-4 py-2 text-xs font-bold text-[#0A3D62] shadow-sm transition-colors hover:border-[#0A3D62]/30 hover:bg-[#EEF4F8]"
        >
          <ExternalLink
            size={15}
            strokeWidth={1.9}
            aria-hidden="true"
          />
          Ver mapa completo
        </a>
      </div>
    </section>
  );
}