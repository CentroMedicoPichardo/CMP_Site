// src/config/sidebarItems.ts

import {
  Activity,
  BookOpen,
  BrainCircuit,
  ChartNoAxesCombined,
  ClipboardCheck,
  Database,
  FileArchive,
  FileQuestion,
  FileText,
  GraduationCap,
  HelpCircle,
  History,
  LayoutDashboard,
  LifeBuoy,
  ShoppingBag,
  Stethoscope,
  Users,
  WalletCards,
  Youtube,
} from "lucide-react";

import type { SidebarItem } from "@/types/sidebar.types";

import {
  adminRoutes,
  clienteRoutes,
  publicRoutes,
} from "./routes";

export const clientSidebarItems: SidebarItem[] = [
  {
    label: "Dashboard",
    href: clienteRoutes.dashboard,
    icon: LayoutDashboard,
    description: "Resumen de tu actividad",
  },
  {
    label: "Mis compras",
    href: clienteRoutes.misComprasCursos,
    icon: ShoppingBag,
    description: "Compras y pagos de cursos",
  },
  {
    label: "Mis Cursos",
    href: clienteRoutes.misCursos,
    icon: BookOpen,
    description: "Cursos inscritos",
  },
  {
    label: "Saber Pediátrico",
    href: clienteRoutes.saberPediatrico,
    icon: GraduationCap,
    description: "Contenido educativo",
  },
  {
    label: "Ayuda",
    href: publicRoutes.ayuda,
    icon: HelpCircle,
    description: "Soporte y preguntas frecuentes",
  },
];

export const adminSidebarItems: SidebarItem[] = [
  // ========== PRINCIPAL ==========
  {
    label: "Dashboard",
    href: adminRoutes.dashboard,
    icon: LayoutDashboard,
    description: "Resumen general del sistema",
    category: "PRINCIPAL",
  },

  // ========== ANALÍTICA ==========
  {
    label: "Analítica",
    icon: ChartNoAxesCombined,
    description: "Modelos y análisis de datos",
    category: "ANALÍTICA",
    children: [
      {
        label: "Segmentación de clientes",
        href: adminRoutes.segmentacionClientes,
        icon: BrainCircuit,
        description:
          "Clasificación de clientes mediante K-Means",
      },
      {
        label: "Predicción de precios",
        href: adminRoutes.prediccionPrecios,
        icon: WalletCards,
        description:
          "Estimación de precios mediante regresión",
      },
    ],
  },

  // ========== MONITOREO Y SEGURIDAD ==========
  {
    label: "Monitoreo",
    icon: Activity,
    description: "Monitorización del sistema",
    category: "MONITOREO",
    children: [
      {
        label: "Auditoría",
        href: adminRoutes.auditoria,
        icon: History,
        description: "Historial de cambios y eventos",
      },
      {
        label: "Backups",
        href: adminRoutes.backups,
        icon: Database,
        description: "Respaldo de base de datos",
      },
    ],
  },

  // ========== GESTIÓN DE CONTENIDO ==========
  {
    label: "Contenido Médico",
    icon: Stethoscope,
    description: "Gestión de contenido médico",
    category: "GESTIÓN",
    children: [
      {
        label: "Médicos",
        href: adminRoutes.medicos,
        icon: Stethoscope,
        description: "CRUD de médicos",
      },
      {
        label: "Servicios",
        href: adminRoutes.servicios,
        icon: FileText,
        description: "Servicios médicos",
      },
      {
        label: "Cursos",
        href: adminRoutes.cursosadm,
        icon: GraduationCap,
        description: "Cursos y talleres",
      },
      {
        label: "Pagos de cursos",
        href: adminRoutes.comprasCursos,
        icon: WalletCards,
        description:
          "Validar compras y pagos de cursos",
      },
      {
        label: "Gestión académica",
        href: adminRoutes.gestionAcademica,
        icon: ClipboardCheck,
        description:
          "Sesiones, alumnos y asistencia",
      },
      {
        label: "Quiénes Somos",
        href: adminRoutes.quienesSomos,
        icon: FileText,
        description:
          "Editar información institucional",
      },
    ],
  },

  // ========== SABER PEDIÁTRICO ==========
  {
    label: "Saber Pediátrico",
    icon: GraduationCap,
    description:
      "Gestión de contenido educativo",
    category: "GESTIÓN",
    children: [
      {
        label: "Artículos",
        href:
          adminRoutes.saberPediatricoArticulos,
        icon: FileText,
        description: "Gestionar artículos",
      },
      {
        label: "Videos",
        href:
          adminRoutes.saberPediatricoVideos,
        icon: Youtube,
        description: "Gestionar videos",
      },
      {
        label: "Documentos",
        href:
          adminRoutes.saberPediatricoDocumentos,
        icon: FileArchive,
        description: "Gestionar documentos",
      },
      {
        label: "Encuestas",
        href:
          adminRoutes.saberPediatricoEncuestas,
        icon: FileQuestion,
        description: "Gestionar encuestas",
      },
    ],
  },

  // ========== USUARIOS ==========
  {
    label: "Usuarios",
    icon: Users,
    description:
      "Gestión de usuarios del sistema",
    category: "USUARIOS",
    children: [
      {
        label: "Gestión de Usuarios",
        href: adminRoutes.usuarios,
        icon: Users,
        description:
          "Lista y administración de usuarios",
      },
    ],
  },

  // ========== SOPORTE ==========
  {
    label: "Soporte y ayuda",
    href: adminRoutes.soporte,
    icon: LifeBuoy,
    description:
      "Solicitudes y atención a usuarios",
    category: "SOPORTE",
  },
];