import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Centro Médico Pichardo",
    short_name: "CMP",
    description: "Información del Centro Médico Pichardo",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#F7FAFC",
    theme_color: "#0A3D62",
    lang: "es-MX",
    icons: [
      { src: "/pwa/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/pwa/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
