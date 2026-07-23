// src/config/routes.ts

export const publicRoutes = {
  home: "/",
  servicios: "/servicios",
  directorioMedico: "/directorio-medico",
  saberPediatrico: "/saber-pediatrico",
  cursos: "/cursos",
  quienesSomos: "/quienes-somos",
  contacto: "/contacto",
  ayuda: "/ayuda",
  ayudaPreguntas: "/ayuda/preguntas",
  ayudaNuevaPregunta: "/ayuda/preguntas/nueva",
  ayudaPreguntaDetalle: (id: number) => `/ayuda/preguntas/${id}`,
  acceder: "/acceder",
  registro: "/registro",
  privacidad: "/privacidad",
  terminos: "/terminos",
} as const;

export const clienteRoutes = {
  dashboard: "/dashboard",
  misComprasCursos: "/mis-compras/cursos",
  misCursos: "/mis-cursos",
  miCursoDetalle: (idInscripcion: number) =>
    `/mis-cursos/${idInscripcion}`,
  perfil: "/perfil",
  foros: "/foros",
  saberPediatrico: "/saber-pediatrico",
} as const;

export const adminRoutes = {
  dashboard: "/dashboard-admin",
  segmentacionClientes: "/segmentacion-clientes",
  prediccionPrecios: "/prediccion-precios",
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
  saberPediatricoArticulos: "/saber-pediatrico/articulos",
  saberPediatricoVideos: "/saber-pediatrico/videos",
  saberPediatricoDocumentos: "/saber-pediatrico/documentos",
  saberPediatricoEncuestas: "/saber-pediatrico/encuestas",
  cursosDashboard: (id: number) => `/cursos-admin/${id}/dashboard`,
  comprasCursos: "/compras-cursos",
  gestionAcademica: "/gestion-academica",
  gestionAcademicaCurso: (id: number) =>
    `/gestion-academica/cursos/${id}`,
  gestionAcademicaAsistencia: (id: number) =>
    `/gestion-academica/sesiones/${id}/asistencia`,
  soporte: "/soporte-admin",
  soportePregunta: (id: number) => `/soporte-admin/preguntas/${id}`,
  soporteFaqs: "/soporte-admin/faqs",
  soporteCategorias: "/soporte-admin/categorias",
} as const;

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
