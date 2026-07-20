// src/app/(admin)/compras-cursos/page.tsx

import { ComprasCursosAdmin } from "@/components/admin/compras/ComprasCursosAdmin";

export default function ComprasCursosAdminPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <ComprasCursosAdmin />
      </div>
    </main>
  );
}