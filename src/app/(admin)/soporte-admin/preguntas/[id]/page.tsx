import { notFound } from "next/navigation";
import PreguntaSoporteAdminDetalle from "@/components/admin/soporte/PreguntaSoporteAdminDetalle";
import { requireRole } from "@/lib/auth";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PreguntaSoporteAdminPage({ params }: PageProps) {
  await requireRole("admin", "/acceder");
  const { id } = await params;
  const idPregunta = Number(id);

  if (!Number.isSafeInteger(idPregunta) || idPregunta <= 0) {
    notFound();
  }

  return <PreguntaSoporteAdminDetalle idPregunta={idPregunta} />;
}
