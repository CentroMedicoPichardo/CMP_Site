// src/components/public/quienes-somos/MapaUbicacion.tsx
"use client";

import React, { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';

// 📍 COORDENADAS EXACTAS DEL CENTRO MÉDICO PICHARDO
const CENTRO_MEDICO_COORDS = {
  lat: 21.1478391,
  lng: -98.3988505,
};
const DEFAULT_ZOOM = 17;

// Declarar el tipo de Leaflet para TypeScript
declare global {
  interface Window {
    L: any;
  }
}

interface MapaUbicacionProps {
  direccion?: string;
}

export function MapaUbicacion({ direccion }: MapaUbicacionProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const isMapInitialized = useRef(false);

  useEffect(() => {
    // Si ya está inicializado o no hay referencia al contenedor, no hacer nada
    if (isMapInitialized.current || !mapRef.current) return;

    const loadLeaflet = () => {
      // Verificar si Leaflet ya está cargado
      if (window.L) {
        initMap();
        return;
      }

      // Cargar CSS de Leaflet si no existe
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // Cargar JS de Leaflet si no existe
      if (!document.querySelector('script[src*="leaflet.js"]')) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => {
          initMap();
        };
        script.onerror = () => {
          console.error('Error cargando Leaflet');
        };
        document.body.appendChild(script);
      } else if (window.L) {
        initMap();
      }
    };

    const initMap = () => {
      // Verificar que el contenedor existe, no está inicializado y Leaflet está disponible
      if (!mapRef.current || isMapInitialized.current || !window.L) return;

      try {
        const L = window.L;

        // Crear el mapa solo si no existe una instancia
        if (!mapInstanceRef.current) {
          const map = L.map(mapRef.current).setView(
            [CENTRO_MEDICO_COORDS.lat, CENTRO_MEDICO_COORDS.lng],
            DEFAULT_ZOOM
          );

          mapInstanceRef.current = map;

          // Capa de mapa (OpenStreetMap con estilo claro de CartoDB)
          L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19,
            minZoom: 3,
          }).addTo(map);

          // Crear icono personalizado
          const customIcon = L.divIcon({
            html: `<div class="w-12 h-12 bg-[#FFC300] rounded-full flex items-center justify-center shadow-lg ring-4 ring-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0A3D62" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  </div>`,
            className: 'custom-marker',
            iconSize: [48, 48],
            iconAnchor: [24, 48],
            popupAnchor: [0, -48],
          });

          // Agregar marcador
          const marker = L.marker([CENTRO_MEDICO_COORDS.lat, CENTRO_MEDICO_COORDS.lng], {
            icon: customIcon,
          }).addTo(map);

          // Popup con la dirección
          if (direccion) {
            marker
              .bindPopup(`
              <div class="text-center p-2">
                <strong class="text-[#0A3D62]">Centro Médico Pichardo</strong><br/>
                <span class="text-sm text-gray-600">${direccion}</span>
              </div>
            `)
              .openPopup();
          }

          isMapInitialized.current = true;
        }
      } catch (error) {
        console.error('Error inicializando el mapa:', error);
      }
    };

    // Pequeño retraso para asegurar que el DOM está listo
    const timer = setTimeout(() => {
      loadLeaflet();
    }, 100);

    return () => {
      clearTimeout(timer);
      // Limpiar el mapa al desmontar el componente
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
          isMapInitialized.current = false;
        } catch (e) {
          // Ignorar errores de limpieza
        }
      }
    };
  }, [direccion]);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-[#0A3D62] to-[#1A4F7A]">
        <div className="flex items-center gap-2">
          <MapPin size={20} className="text-white" />
          <h3 className="text-white font-bold text-lg">Nuestra Ubicación</h3>
        </div>
        <p className="text-white/70 text-sm mt-1">
          {direccion || 'Calle Patria, Sin Número, Satélite, Anahuac, Huejutla de Reyes, Hgo.'}
        </p>
      </div>
      <div ref={mapRef} className="w-full h-[380px]" />
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-center">
        <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
          📍 Cómo llegar: Estamos en la Calle Patria, en la colonia Satélite.
        </p>
      </div>
    </div>
  );
}