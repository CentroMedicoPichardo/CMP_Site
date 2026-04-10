// src/config/sidebarItems.ts (actualizado con las rutas)

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
  Youtube,
  FileQuestion,
  FileArchive,
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

// Items para administradores (con rutas actualizadas)
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
        description: "Historial de cambios y eventos"
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
  
  // ========== SABER PEDIÁTRICO ==========
  {
    label: "Saber Pediátrico",
    icon: GraduationCap,
    description: "Gestión de contenido educativo",
    category: "GESTIÓN",
    children: [
      {
        label: "Artículos",
        href: adminRoutes.saberPediatricoArticulos,
        icon: FileText,
        description: "Gestionar artículos"
      },
      {
        label: "Videos",
        href: adminRoutes.saberPediatricoVideos,
        icon: Youtube,
        description: "Gestionar videos"
      },
      {
        label: "Documentos",
        href: adminRoutes.saberPediatricoDocumentos,
        icon: FileArchive,
        description: "Gestionar documentos"
      },
      {
        label: "Encuestas",
        href: adminRoutes.saberPediatricoEncuestas,
        icon: FileQuestion,
        description: "Gestionar encuestas"
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