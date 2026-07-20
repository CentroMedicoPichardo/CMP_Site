// src/app/(admin)/compras-cursos/[id]/page.tsx

import { CompraCursoAdminDetalle } from "@/components/admin/compras/CompraCursoAdminDetalle";

interface CompraCursoAdminDetallePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CompraCursoAdminDetallePage({
  params,
}: CompraCursoAdminDetallePageProps) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <CompraCursoAdminDetalle
          compraId={id}
        />
      </div>
    </main>
  );
}