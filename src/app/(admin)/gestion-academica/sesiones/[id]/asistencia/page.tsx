import { notFound } from "next/navigation";

import { AsistenciaSesionAdmin } from "@/components/admin/academia/AsistenciaSesionAdmin";
import { requireRole } from "@/lib/auth";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AsistenciaSesionPage({ params }: PageProps) {
  await requireRole("admin", "/acceder");

  const { id } = await params;
  const sesionId = Number(id);

  if (!Number.isSafeInteger(sesionId) || sesionId <= 0) {
    notFound();
  }

  return <AsistenciaSesionAdmin sesionId={sesionId} />;
}
