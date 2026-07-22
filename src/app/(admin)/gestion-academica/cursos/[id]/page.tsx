import {
  notFound,
} from "next/navigation";

import {
  CursoAcademicoDetalle,
} from "@/components/admin/academia/CursoAcademicoDetalle";
import {
  requireRole,
} from "@/lib/auth";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CursoAcademicoPage({
  params,
}: PageProps) {
  await requireRole(
    "admin",
    "/acceder"
  );

  const { id } = await params;
  const cursoId = Number(id);

  if (
    !Number.isSafeInteger(cursoId) ||
    cursoId <= 0
  ) {
    notFound();
  }

  return (
    <CursoAcademicoDetalle
      cursoId={cursoId}
    />
  );
}