import SoporteAdmin from "@/components/admin/soporte/SoporteAdmin";
import { requireRole } from "@/lib/auth";

export default async function SoporteAdminPage() {
  await requireRole("admin", "/acceder");
  return <SoporteAdmin />;
}
