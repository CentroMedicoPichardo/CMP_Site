import { MisCursosCliente } from "@/components/client/cursos/MisCursosCliente";
import { requireAuth } from "@/lib/auth";

export default async function MisCursosPage() {
  await requireAuth("/acceder");

  return <MisCursosCliente />;
}
