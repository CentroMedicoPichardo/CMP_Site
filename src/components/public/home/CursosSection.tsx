// src/components/public/home/CursosSection.tsx
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { CursoCard } from '@/components/public';
import { publicRoutes } from '@/config/routes';

interface CursosSectionProps {
  cursos: any[];
}

export function CursosSection({ cursos }: CursosSectionProps) {
  if (!cursos.length) return null;

  return (
    <section className="py-20 bg-gray-50">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0A3D62] mb-2">Próximos Cursos</h2>
            <p className="text-gray-600">Capacitación para padres y talleres para los niños</p>
          </div>
          <Link 
            href={publicRoutes.cursos}
            className="group flex items-center gap-2 text-[#0A3D62] font-semibold hover:text-[#FFC300] transition-colors mt-4 md:mt-0"
          >
            Ver catálogo completo
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {cursos.map((curso: any) => (
            <CursoCard key={`curso-${curso.id}`} {...curso} />
          ))}
        </div>
      </Container>
    </section>
  );
}