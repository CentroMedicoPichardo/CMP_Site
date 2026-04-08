// src/components/public/saber-pediatrico/SeccionVideos.tsx
"use client";

import { CardVideo } from './CardVideo';

interface Video {
  id: number;
  titulo: string;
  descripcion: string;
  imagenUrl: string | null;
  urlExterno: string;
  duracion?: string;
  fechaPublicacion: string;
}

interface SeccionVideosProps {
  videos: Video[];
}

export function SeccionVideos({ videos }: SeccionVideosProps) {
  if (videos.length === 0) return null;

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#0A3D62]">🎬 Videos educativos</h2>
        <div className="h-px flex-1 bg-gradient-to-r from-[#FFC300]/30 to-transparent ml-4"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <CardVideo key={video.id} {...video} />
        ))}
      </div>
    </section>
  );
}