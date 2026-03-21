// src/components/public/home/NoticiasCarrusel.tsx
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { NoticiaBreveCard } from '@/components/public';
import { publicRoutes } from '@/config/routes';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface NoticiasCarruselProps {
  noticias: any[];
}

export function NoticiasCarrusel({ noticias }: NoticiasCarruselProps) {
  if (!noticias.length) {
    return (
      <div className="bg-gray-50 rounded-3xl p-8">
        <h3 className="text-2xl font-bold text-[#0A3D62] mb-6">Últimas Noticias</h3>
        <div className="text-center py-12 bg-white rounded-2xl">
          <p className="text-gray-500">No hay noticias disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-3xl p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-[#0A3D62]">Últimas Noticias</h3>
        <Link 
          href={publicRoutes.saberPediatrico}
          className="text-sm font-medium text-[#0A3D62] hover:text-[#FFC300] transition-colors flex items-center gap-1"
        >
          Ver todas
          <ArrowRight size={16} />
        </Link>
      </div>
      
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={noticias.length > 1}
        className="noticias-swiper"
      >
        {noticias.map((noticia: any) => (
          <SwiperSlide key={noticia.idPublicacion}>
            <NoticiaBreveCard 
              id={noticia.idPublicacion}
              imagenSrc={noticia.urlImagen || "/logo.png"}
              titulo={noticia.tituloNoticia || "Noticia"}
              bajada={noticia.resumenBajada || "Lee más sobre esta noticia"}
              autor={noticia.nombreAutor || "Centro Médico Pichardo"}
              fecha={new Date(noticia.fechaPublicacion).toLocaleDateString('es-MX', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
              linkVerMas={`/blog/${noticia.idPublicacion}`}
              etiquetas={noticia.etiquetas ? noticia.etiquetas.split(',').map((e: string) => e.trim()) : ["Salud"]}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}