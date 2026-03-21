// src/components/public/quienes-somos/HistoriaSection.tsx
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Heart } from 'lucide-react';

interface HistoriaSectionProps {
  historia: string;
  compromiso: string;
  imagenSrc: string;
}

export function HistoriaSection({ historia, compromiso, imagenSrc }: HistoriaSectionProps) {
  return (
    <section className="py-16 bg-white">
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Contenido de texto */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0A3D62] mb-4 relative inline-block">
                Nuestra Historia
                <span className="absolute -bottom-2 left-0 w-16 h-1 bg-[#FFC300] rounded-full"></span>
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mt-6">
                {historia || "Desde nuestros inicios, nos hemos dedicado a brindar atención médica de excelencia a las familias de Huejutla. Lo que comenzó como un pequeño consultorio, hoy es un centro médico de referencia en la región, siempre manteniendo la calidez humana que nos caracteriza."}
              </p>
            </div>
            
            <div className="bg-[#FFF9E6] rounded-2xl p-8 border-l-4 border-[#FFC300]">
              <h3 className="text-2xl font-bold text-[#0A3D62] mb-3 flex items-center gap-2">
                <Heart size={24} className="text-[#FFC300]" />
                Nuestro Compromiso
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                {compromiso || "Trabajamos cada día para ofrecer un servicio de salud cercano, humano y de calidad. Nos esforzamos por crear un ambiente de confianza donde cada familia se sienta escuchada y atendida con la dedicación que sus hijos merecen."}
              </p>
              <p className="text-[#0A3D62] font-semibold mt-4 text-lg">
                ¡Su tranquilidad es nuestro motor!
              </p>
            </div>
          </div>
          
          {/* Imagen */}
          <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
            <Image 
              src={imagenSrc}
              alt="Historia del Centro Médico Pichardo"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A3D62]/30 to-transparent"></div>
          </div>
        </div>
      </Container>
    </section>
  );
}