// src/components/public/quienes-somos/MisionVisionValores.tsx
import { Container } from '@/components/ui/Container';
import { Target, Eye, Heart, CheckCircle } from 'lucide-react';

interface MisionVisionValoresProps {
  mision: string;
  vision: string;
  valores: string[];
}

export function MisionVisionValores({ mision, vision, valores }: MisionVisionValoresProps) {
  return (
    <section className="py-16 bg-gray-50">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0A3D62] mb-4">
            Nuestra Filosofía
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Los principios que guían nuestro trabajo diario y nuestra relación con las familias
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* MISIÓN */}
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border-t-4 border-[#FFC300]">
            <div className="w-16 h-16 bg-[#FFF9E6] rounded-2xl flex items-center justify-center mb-6">
              <Target size={32} className="text-[#FFC300]" />
            </div>
            <h3 className="text-2xl font-bold text-[#0A3D62] mb-4">Misión</h3>
            <p className="text-gray-600 leading-relaxed">
              {mision || "Brindar atención pediátrica integral de excelencia, con calidez humana y profesionalismo, acompañando a las familias en el crecimiento y desarrollo saludable de sus hijos."}
            </p>
          </div>
          
          {/* VISIÓN */}
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border-t-4 border-[#FFC300]">
            <div className="w-16 h-16 bg-[#FFF9E6] rounded-2xl flex items-center justify-center mb-6">
              <Eye size={32} className="text-[#FFC300]" />
            </div>
            <h3 className="text-2xl font-bold text-[#0A3D62] mb-4">Visión</h3>
            <p className="text-gray-600 leading-relaxed">
              {vision || "Ser el centro pediátrico de referencia en la región, reconocido por nuestra calidad médica, innovación y el trato cercano que brindamos a cada familia."}
            </p>
          </div>
          
          {/* VALORES */}
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border-t-4 border-[#FFC300] md:col-span-2 lg:col-span-1">
            <div className="w-16 h-16 bg-[#FFF9E6] rounded-2xl flex items-center justify-center mb-6">
              <Heart size={32} className="text-[#FFC300]" />
            </div>
            <h3 className="text-2xl font-bold text-[#0A3D62] mb-4">Valores</h3>
            
            {valores && valores.length > 0 ? (
              <ul className="space-y-3">
                {valores.map((valor, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-[#FFC300] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{valor}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-[#FFC300] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Compromiso con la excelencia médica</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-[#FFC300] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Calidez y empatía en el trato</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-[#FFC300] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Honestidad y transparencia</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-[#FFC300] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Trabajo en equipo</span>
                </li>
              </ul>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}