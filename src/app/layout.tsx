// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";

import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Footer } from "@/components/layout/Footer";
import { SWRProvider } from "@/lib/swr-provider";

import "./globals.css";

export const dynamic = "force-dynamic";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Centro Médico",
  description: "Sistema de gestión médica",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const rol = cookieStore.get("rol")?.value;
  const userCookie = cookieStore.get("user")?.value;

  let user = null;
  if (userCookie) {
    try {
      user = JSON.parse(decodeURIComponent(userCookie));
    } catch {
      user = null;
    }
  }

  // Determinar si debe mostrar el sidebar (solo si está autenticado)
  const showSidebar = !!rol && (rol === 'admin' || rol === 'cliente');

  return (
    <html lang="es">
      <body className={inter.className}>
        <SWRProvider>
          <Header />
          <div className="flex min-h-screen">
            {/* Sidebar condicional - solo se muestra si está autenticado */}
            {showSidebar && <Sidebar user={user} rol={rol} />}
            
            {/* El main ocupa todo el ancho si no hay sidebar, o el espacio restante si lo hay */}
            <main className={`flex-1 bg-gray-50 ${!showSidebar ? 'w-full' : ''}`}>
              {children}
            </main>
          </div>
          <Footer />
        </SWRProvider>
      </body>
    </html>
  );
}