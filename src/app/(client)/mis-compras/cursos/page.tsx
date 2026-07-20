// src/app/(client)/mis-compras/cursos/page.tsx

import { MisComprasCursos } from "@/components/client/compras/MisComprasCursos";

export default function MisComprasCursosPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <MisComprasCursos />
      </div>
    </main>
  );
}