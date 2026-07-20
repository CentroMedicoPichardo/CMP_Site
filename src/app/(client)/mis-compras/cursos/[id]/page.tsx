// src/app/(client)/mis-compras/cursos/[id]/page.tsx

import { CompraCursoDetalle } from "@/components/client/compras/CompraCursoDetalle";

interface CompraCursoPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CompraCursoPage({
  params,
}: CompraCursoPageProps) {
  const { id } = await params;

  return (
    <CompraCursoDetalle compraId={id} />
  );
}