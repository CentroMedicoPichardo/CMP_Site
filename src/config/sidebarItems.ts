// src/config/sidebarItems.ts - Versión optimizada

import {
  LayoutDashboard,
  Users,
  Stethoscope,
  BookOpen,
  FileText,
  Image,
  Settings,
  Database,
  BarChart3,
  Newspaper,
  Video,
  Info,
  Shield,
  HardDrive,
  HelpCircle,
  MessageCircle,
  User,
  GraduationCap,
  Activity,
  AlertTriangle,
  Eye,
  Gauge,
  History,
  Server,
  Bell,
} from "lucide-react";
import { SidebarItem } from '@/types/sidebar.types';
import { adminRoutes, clienteRoutes, publicRoutes } from './routes';

// Items para clientes (sin cambios)
export const clientSidebarItems: SidebarItem[] = [
  {
    label: "Dashboard",
    href: clienteRoutes.dashboard,
    icon: LayoutDashboard,
    description: "Resumen de tu actividad"
  },
  {
    label: "Mis Cursos",
    href: clienteRoutes.misCursos,
    icon: BookOpen,
    description: "Cursos inscritos"
  },
  {
    label: "Perfil",
    href: clienteRoutes.perfil,
    icon: User,
    description: "Tus datos personales"
  },
  {
    label: "Foros",
    href: clienteRoutes.foros,
    icon: MessageCircle,
    description: "Participa en la comunidad"
  },
  {
    label: "Saber Pediátrico",
    href: clienteRoutes.saberPediatrico,
    icon: GraduationCap,
    description: "Contenido educativo"
  },
  {
    label: "Ayuda",
    href: publicRoutes.ayuda,
    icon: HelpCircle,
    description: "Soporte y preguntas frecuentes"
  },
];

// Items para administradores (optimizado sin duplicidades)
export const adminSidebarItems: SidebarItem[] = [
  // DASHBOARD PRINCIPAL
  {
    label: "Dashboard",
    href: adminRoutes.dashboard,
    icon: LayoutDashboard,
    description: "Resumen general del sistema",
    category: "PRINCIPAL"
  },
  
  // ========== MONITOREO Y SEGURIDAD ==========
  // TODO lo relacionado con monitoreo, auditoría, logs, backups y alertas
  {
    label: "Monitoreo",
    icon: Activity,
    description: "Monitorización del sistema",
    category: "MONITOREO",
    children: [
      {
        label: "Dashboard",
        href: "/admin/monitoreo/dashboard",
        icon: Gauge,
        description: "Estado general del sistema"
      },
      {
        label: "Auditoría",
        href: adminRoutes.auditoria,
        icon: History,
        description: "Historial de cambios y eventos"
      },
      {
        label: "Rendimiento",
        href: adminRoutes.rendimiento,
        icon: BarChart3,
        description: "Análisis de consultas e índices"
      },
      {
        label: "Backups",
        href: adminRoutes.backups,
        icon: Database,
        description: "Respaldo de base de datos"
      }
    ]
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
        description: "CRUD de médicos"
      },
      {
        label: "Servicios",
        href: adminRoutes.servicios,
        icon: FileText,
        description: "Servicios médicos"
      },
      {
        label: "Cursos",
        href: adminRoutes.cursosadm,
        icon: GraduationCap,
        description: "Cursos y talleres"
      },
      {
        label: "Quiénes Somos",
        href: adminRoutes.quienesSomos,
        icon: Info,
        description: "Editar información institucional"
      }
    ]
  },
  
  // ========== PUBLICACIONES ==========
  {
    label: "Publicaciones",
    icon: Newspaper,
    description: "Gestión de contenido digital",
    category: "GESTIÓN",
    children: [
      {
        label: "Noticias",
        href: "/admin/noticias",
        icon: Newspaper,
        description: "Gestionar noticias"
      },
      {
        label: "Videos",
        href: "/admin/videos",
        icon: Video,
        description: "Galería de videos"
      },
      {
        label: "Artículos",
        href: "/admin/articulos",
        icon: FileText,
        description: "Publicaciones informativas"
      },
      {
        label: "Multimedia",
        href: "/admin/multimedia",
        icon: Image,
        description: "Imágenes y recursos"
      }
    ]
  },
  
  // ========== USUARIOS ==========
  {
    label: "Usuarios",
    icon: Users,
    description: "Gestión de usuarios del sistema",
    category: "USUARIOS",
    children: [
      {
        label: "Gestión de Usuarios",
        href: adminRoutes.usuarios,
        icon: Users,
        description: "Lista y administración de usuarios"
      },
      {
        label: "Roles y Permisos",
        href: "/admin/roles",
        icon: Shield,
        description: "Configuración de roles y permisos"
      }
    ]
  },
  
  // ========== CONFIGURACIÓN DEL SISTEMA ==========
  {
    label: "Configuración",
    href: adminRoutes.configuracion,
    icon: Settings,
    description: "Ajustes del sistema",
    category: "SISTEMA"
  }
];