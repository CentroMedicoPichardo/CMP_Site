import ClienteDashboard from "@/components/client/dashboard/ClienteDashboard";
import { requireRole } from "@/lib/auth";

export default async function DashboardClientePage() {
  await requireRole("cliente", "/acceder");

  return <ClienteDashboard />;
}
