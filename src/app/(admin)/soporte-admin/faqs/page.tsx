import FAQsAdmin from "@/components/admin/soporte/FAQsAdmin";
import { requireRole } from "@/lib/auth";

export default async function FAQsAdminPage() {
  await requireRole("admin", "/acceder");
  return <FAQsAdmin />;
}
