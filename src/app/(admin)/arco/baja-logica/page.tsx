import type { Metadata } from "next";
import { requireRole } from "@/lib/auth";
import BajaLogicaPanel from "@/components/admin/arco/BajaLogicaPanel";

export const metadata: Metadata = {
  title: "Baja lógica administrativa | Centro Médico Pichardo",
};

export default async function PaginaBajaLogica() {
  await requireRole("admin", "/acceder");
  return (
    <main className="min-h-screen p-5 md:p-10">
      <BajaLogicaPanel />
    </main>
  );
}
