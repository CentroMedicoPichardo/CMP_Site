// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { auth } from "@/lib/auth";

import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Footer } from "@/components/layout/Footer";
import { SWRProvider } from "@/lib/swr-provider";

import { ToastContainer } from "react-toastify";

import "./globals.css";

export const dynamic = "force-dynamic";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Centro Médico",
  description: "Sistema de gestión médica",
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default async function RootLayout({ children }: RootLayoutProps) {
  const session = await auth();

  const user = session?.user ?? null;
  const rol = session?.user.rol ?? null;

  const showSidebar =
    !!user && !!rol && (rol === "admin" || rol === "cliente");

  return (
    <html lang="es">
      <body className={inter.className}>
        <SWRProvider>
          <Header initialUser={user} initialRol={rol} />

          <div className="flex min-h-screen">
            {showSidebar && <Sidebar user={user} rol={rol} />}

            <main
              className={`flex-1 bg-gray-50 ${
                !showSidebar ? "w-full" : ""
              }`}
            >
              {children}
            </main>
          </div>

          <Footer />

          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </SWRProvider>
      </body>
    </html>
  );
}