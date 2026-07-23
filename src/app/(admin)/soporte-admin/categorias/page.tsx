import CategoriasSoporteAdmin from "@/components/admin/soporte/CategoriasSoporteAdmin";
import { requireRole } from "@/lib/auth";

export default async function CategoriasSoporteAdminPage() {
  await requireRole("admin", "/acceder");
  return <CategoriasSoporteAdmin />;
}
