// src/config/routes.ts
// Rutas públicas del sitio
export const publicRoutes = {
  home: "/",
  servicios: "/servicios",
  directorioMedico: "/directorio-medico",
  saberPediatrico: "/saber-pediatrico",
  cursos: "/cursos",
  quienesSomos: "/quienes-somos",
  contacto: "/contacto",
  ayuda: "/ayuda",
  acceder: "/acceder",
  registro: "/registro",
  privacidad: "/privacidad",
  terminos: "/terminos",
} as const;

export const clienteRoutes = {
  dashboard: "/dashboard",
  misCursos: "/mis-cursos",
  perfil: "/perfil",
  foros: "/foros",
  saberPediatrico: "/dashboard/saber-pediatrico",
};

export const adminRoutes = {
  dashboard: "/dashboard",
  usuarios: "/usuarios",
  medicos: "/medicos",
  servicios: "/adminservicios",
  cursosadm: "/cursos-admin",
  quienesSomos: "/quienes-somos-admin",
  noticias: "/noticias",
  videos: "/videos",
  articulos: "/articulos",
  multimedia: "/multimedia",
  roles: "/roles",
  auditoria: "/monitoreo/auditoria",
  rendimiento: "/monitoreo/rendimiento",
  backups: "/backups",
  configuracion: "/configuracion",
  // ========== SABER PEDIÁTRICO ==========
  saberPediatricoArticulos: "/saber-pediatrico/articulos",
  saberPediatricoVideos: "/saber-pediatrico/videos",
  saberPediatricoDocumentos: "/saber-pediatrico/documentos",
  saberPediatricoEncuestas: "/saber-pediatrico/encuestas",
  // ========== CURSOS DASHBOARD ==========
  cursosDashboard: (id: number) => `/cursos-admin/${id}/dashboard`,
};

// Estructura para menús
export const navigationItems = [
  { label: "Inicio", href: publicRoutes.home },
  { label: "Servicios", href: publicRoutes.servicios },
  { label: "Directorio Médico", href: publicRoutes.directorioMedico },
  { label: "Saber Pediátrico", href: publicRoutes.saberPediatrico },
  { label: "Cursos", href: publicRoutes.cursos },
  { label: "Quiénes Somos", href: publicRoutes.quienesSomos },
];

export const topBarInfo = {
  phone: "(771) 123-4567",
  location: "Huejutla de Reyes, Hgo.",
  schedule: "Lun - Sab: 8:00 - 20:00",
  email: "contacto@cmpichardo.com",
};