// En cualquier página, los layouts ya envuelven el contenido automáticamente
// src/app/(client)/dashboard/page.tsx
export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard del Cliente</h1>
      <p>Bienvenido a tu panel de control</p>
    </div>
  );
}