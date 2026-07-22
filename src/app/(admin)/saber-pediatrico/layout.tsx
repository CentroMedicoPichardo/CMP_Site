"use client";

import type { ReactNode } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  BookOpenText,
  ClipboardList,
  FileText,
  FolderArchive,
  LibraryBig,
  Video,
} from "lucide-react";

interface SaberPediatricoLayoutProps {
  children: ReactNode;
}

const TABS = [
  {
    label: "Artículos",
    href: "/saber-pediatrico/articulos",
    description: "Contenido educativo",
    tipo: "articulo" as const,
  },
  {
    label: "Videos",
    href: "/saber-pediatrico/videos",
    description: "Material audiovisual",
    tipo: "video" as const,
  },
  {
    label: "Documentos",
    href: "/saber-pediatrico/documentos",
    description: "Archivos descargables",
    tipo: "documento" as const,
  },
  {
    label: "Encuestas",
    href: "/saber-pediatrico/encuestas",
    description: "Formularios externos",
    tipo: "encuesta" as const,
  },
];

type TipoTab =
  (typeof TABS)[number]["tipo"];

function cn(
  ...clases: Array<
    string | false | null | undefined
  >
): string {
  return clases.filter(Boolean).join(" ");
}

function IconoTab({
  tipo,
  size = 18,
}: {
  tipo: TipoTab;
  size?: number;
}) {
  if (tipo === "video") {
    return (
      <Video
        size={size}
        aria-hidden="true"
      />
    );
  }

  if (tipo === "documento") {
    return (
      <FolderArchive
        size={size}
        aria-hidden="true"
      />
    );
  }

  if (tipo === "encuesta") {
    return (
      <ClipboardList
        size={size}
        aria-hidden="true"
      />
    );
  }

  return (
    <FileText
      size={size}
      aria-hidden="true"
    />
  );
}

export default function SaberPediatricoLayout({
  children,
}: SaberPediatricoLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="mx-auto w-full max-w-7xl p-4 sm:p-6">
      <header className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div
          className="h-1 w-full bg-[#FFC300]"
          aria-hidden="true"
        />

        <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0A3D62] text-[#FFC300] shadow-sm">
              <BookOpenText
                size={23}
                strokeWidth={1.9}
                aria-hidden="true"
              />
            </span>

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
                Administración de contenido
              </p>

              <h1 className="mt-1 whitespace-normal break-words text-xl font-extrabold leading-tight text-[#0A3D62] sm:text-2xl">
                Saber Pediátrico
              </h1>

              <p className="mt-2 max-w-2xl whitespace-normal break-words text-sm leading-6 text-gray-500">
                Gestiona el contenido educativo
                dirigido a padres, familiares y
                cuidadores.
              </p>
            </div>
          </div>

          <div className="flex min-h-14 items-center gap-3 rounded-xl border border-gray-200 bg-[#F8FAFC] px-4 py-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#0A3D62] shadow-sm">
              <LibraryBig
                size={17}
                strokeWidth={1.9}
                aria-hidden="true"
              />
            </span>

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                Módulo institucional
              </p>

              <p className="mt-0.5 whitespace-normal break-words text-sm font-extrabold text-[#0A3D62]">
                Biblioteca educativa
              </p>
            </div>
          </div>
        </div>

        <nav
          aria-label="Secciones de Saber Pediátrico"
          className="border-t border-gray-100 bg-[#F8FAFC] px-3 py-3 sm:px-5"
        >
          <div className="overflow-x-auto">
            <div className="flex min-w-max gap-2">
              {TABS.map((tab) => {
                const isActive =
                  pathname === tab.href ||
                  pathname.startsWith(
                    `${tab.href}/`,
                  );

                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    aria-current={
                      isActive
                        ? "page"
                        : undefined
                    }
                    className={cn(
                      "group relative flex min-h-14 min-w-40 items-center gap-3 rounded-xl border px-4 py-2.5 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC300] focus-visible:ring-offset-2",
                      isActive
                        ? "border-[#0A3D62] bg-[#0A3D62] text-white shadow-sm"
                        : "border-gray-200 bg-white text-gray-600 hover:border-[#FFC300] hover:bg-[#FFF9E6] hover:text-[#0A3D62]",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors",
                        isActive
                          ? "bg-white/10 text-[#FFC300]"
                          : "bg-[#EAF2F8] text-[#0A3D62] group-hover:bg-[#FFC300]",
                      )}
                    >
                      <IconoTab
                        tipo={tab.tipo}
                        size={17}
                      />
                    </span>

                    <span className="min-w-0">
                      <span className="block whitespace-normal break-words text-xs font-extrabold">
                        {tab.label}
                      </span>

                      <span
                        className={cn(
                          "mt-0.5 block whitespace-normal break-words text-[10px] font-semibold",
                          isActive
                            ? "text-white/65"
                            : "text-gray-400",
                        )}
                      >
                        {tab.description}
                      </span>
                    </span>

                    {isActive && (
                      <span
                        className="absolute inset-x-4 bottom-0 h-0.5 rounded-full bg-[#FFC300]"
                        aria-hidden="true"
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      </header>

      <main className="mt-6 min-w-0">
        {children}
      </main>
    </div>
  );
}