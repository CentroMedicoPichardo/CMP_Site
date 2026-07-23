import { notFound } from "next/navigation";

import { MiCursoDetalleCliente } from "@/components/client/cursos/MiCursoDetalleCliente";
import { requireAuth } from "@/lib/auth";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MiCursoDetallePage({
  params,
}: PageProps) {
  await requireAuth("/acceder");

  const { id } = await params;
  const idInscripcion = Number(id);

  if (!Number.isSafeInteger(idInscripcion) || idInscripcion <= 0) {
    notFound();
  }

  return <MiCursoDetalleCliente idInscripcion={idInscripcion} />;
}
