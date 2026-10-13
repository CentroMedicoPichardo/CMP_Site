
import { requireRole } from "@/lib/auth";
import CancelacionesAdmin from "@/components/admin/arco/CancelacionesAdmin";

export default async function CancelacionesPage() {
  await requireRole("admin", "/acceder");

  return <CancelacionesAdmin />;
}
