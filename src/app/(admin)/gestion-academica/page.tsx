import {
  GestionAcademica,
} from "@/components/admin/academia/GestionAcademica";
import {
  requireRole,
} from "@/lib/auth";

export default async function GestionAcademicaPage() {
  await requireRole(
    "admin",
    "/acceder"
  );

  return <GestionAcademica />;
}