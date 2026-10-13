"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { syncPublicSnapshots } from "@/lib/offline/publicSnapshots";

const PUBLIC_PATHS = new Set(["/", "/quienes-somos", "/servicios", "/directorio-medico"]);

export function PublicOfflineSync() {
  const pathname = usePathname();

  useEffect(() => {
    if (!PUBLIC_PATHS.has(pathname)) return;
    void syncPublicSnapshots(pathname);
    const onOnline = () => { void syncPublicSnapshots(pathname); };
    window.addEventListener("online", onOnline);
    return () => window.removeEventListener("online", onOnline);
  }, [pathname]);

  return null;
}
