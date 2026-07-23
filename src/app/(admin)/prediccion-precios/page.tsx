import { PrediccionPreciosPanel } from "@/components/admin/prediccion-precios/PrediccionPreciosPanel";
import { requireRole } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function PrediccionPreciosPage() {
  await requireRole("admin", "/");

  return <PrediccionPreciosPanel />;
}
