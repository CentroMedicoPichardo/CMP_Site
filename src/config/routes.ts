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
  medicos: "/medicos",           // ← Agregado
  servicios: "/adminservicios",        // ← Agregado
  cursosadm: "/cursos-admin",
  quienesSomos: "/quienes-somos-admin", // ← Agregado
  noticias: "/noticias",          // ← Agregado
  videos: "/videos",              // ← Agregado
  articulos: "/articulos",        // ← Agregado
  multimedia: "/multimedia",      // ← Agregado
  roles: "/roles",                // ← Agregado
  auditoria: "/monitoreo/auditoria",        // ← Agregado        // ← Agregado
  backups: "/backups",            // ← Agregado
  configuracion: "/configuracion",
  bitacora: "/bitacora",          // ← Agregado
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