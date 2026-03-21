// src/components/public/home/CTASection.tsx
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { publicRoutes } from '@/config/routes';

export function CTASection() {
  return (
    <section className="bg-[#0A3D62] py-16">
      <Container>
        <div className="text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Listo para comenzar?</h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Regístrate y accede a todos nuestros servicios, cursos y contenido exclusivo
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href={publicRoutes.registro}>
              <Button className="bg-[#FFC300] hover:bg-[#FFD700] text-[#0A3D62] font-semibold px-8 py-4 text-lg rounded-xl">
                Crear cuenta gratis
              </Button>
            </Link>
            <Link href={publicRoutes.contacto}>
              <Button variant="outline" className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 text-lg rounded-xl">
                Contactar ahora
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}