// src/app/(public)/saber-pediatrico/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { SaberPediatricoHeader } from '@/components/public/saber-pediatrico/SaberPediatricoHeader';
import { FiltrosCategoria } from '@/components/public/saber-pediatrico/FiltrosCategoria';
import { SeccionArticulos } from '@/components/public/saber-pediatrico/SeccionArticulos';
import { SeccionVideos } from '@/components/public/saber-pediatrico/SeccionVideos';
import { SeccionDocumentos } from '@/components/public/saber-pediatrico/SeccionDocumentos';
import { SeccionEncuestas } from '@/components/public/saber-pediatrico/SeccionEncuestas';

type TipoContenido = 'todos' | 'articulos' | 'videos' | 'documentos' | 'encuestas';

export default function SaberPediatricoPage() {
  const [activeTab, setActiveTab] = useState<TipoContenido>('todos');
  const [loading, setLoading] = useState(true);
  const [contenido, setContenido] = useState({
    articulos: [],
    videos: [],
    documentos: [],
    encuestas: []
  });

  useEffect(() => {
    const cargarContenido = async () => {
      setLoading(true);
      try {
        const [articulosRes, videosRes, documentosRes, encuestasRes] = await Promise.all([
          fetch('/api/saber-pediatrico?tipo=articulo&activo=true'),
          fetch('/api/saber-pediatrico?tipo=video&activo=true'),
          fetch('/api/saber-pediatrico?tipo=documento&activo=true'),
          fetch('/api/saber-pediatrico?tipo=encuesta&activo=true')
        ]);

        const [articulos, videos, documentos, encuestas] = await Promise.all([
          articulosRes.json(),
          videosRes.json(),
          documentosRes.json(),
          encuestasRes.json()
        ]);

        setContenido({
          articulos: articulos.data || [],
          videos: videos.data || [],
          documentos: documentos.data || [],
          encuestas: encuestas.data || []
        });
      } catch (error) {
        console.error('Error cargando contenido:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarContenido();
  }, []);

  const tabs = [
    { id: 'todos', label: 'Todo', count: contenido.articulos.length + contenido.videos.length + contenido.documentos.length + contenido.encuestas.length },
    { id: 'articulos', label: 'Artículos', count: contenido.articulos.length },
    { id: 'videos', label: 'Videos', count: contenido.videos.length },
    { id: 'documentos', label: 'Documentos', count: contenido.documentos.length },
    { id: 'encuestas', label: 'Encuestas', count: contenido.encuestas.length }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" size={48} color="#0A3D62" />
      </div>
    );
  }

  return (
    <main className="bg-white min-h-screen">
      <SaberPediatricoHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filtros por categoría */}
        <FiltrosCategoria activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />

        {/* Contenido según pestaña activa */}
        {(activeTab === 'todos' || activeTab === 'articulos') && (
          <SeccionArticulos articulos={contenido.articulos} />
        )}

        {(activeTab === 'todos' || activeTab === 'videos') && (
          <SeccionVideos videos={contenido.videos} />
        )}

        {(activeTab === 'todos' || activeTab === 'documentos') && (
          <SeccionDocumentos documentos={contenido.documentos} />
        )}

        {(activeTab === 'todos' || activeTab === 'encuestas') && (
          <SeccionEncuestas encuestas={contenido.encuestas} />
        )}
      </div>
    </main>
  );
}