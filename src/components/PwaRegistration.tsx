"use client";

import { useEffect } from "react";

export function PwaRegistration() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) {
      return;
    }

    // El worker solo conserva el centro público sin conexión y sus recursos.
    navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch((error) => {
      console.error("No se pudo registrar el servicio sin conexión:", error);
    });
  }, []);

  return null;
}
