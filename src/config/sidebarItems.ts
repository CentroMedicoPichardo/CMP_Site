// src/config/sidebarItems.ts
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
  Phone,
  Lock,
  MessageCircle,
  User,
  GraduationCap,
  Globe,
} from "lucide-react";
import { SidebarItem } from '@/types/sidebar.types';
import { adminRoutes, clienteRoutes, publicRoutes } from './routes';

// Items para clientes
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

// Items para administradores
export const adminSidebarItems: SidebarItem[] = [
  // DASHBOARD
  {
    label: "Dashboard",
    href: adminRoutes.dashboard,
    icon: LayoutDashboard,
    description: "Resumen general del sistema",
    category: "PRINCIPAL"
  },
  
  // CONTENIDO MÉDICO
  {
    label: "Médicos",
    href: adminRoutes.medicos, // ← Esto ya apunta a /admin/medicos
    icon: Stethoscope,
    description: "CRUD de médicos",
    category: "CONTENIDO MÉDICO"
  },
  {
    label: "Servicios",
    href: adminRoutes.servicios, // Si no existe en adminRoutes, agrégala
    icon: FileText,
    description: "Servicios médicos",
    category: "CONTENIDO MÉDICO"
  },
  {
    label: "Cursos",
    href: adminRoutes.cursosadm,
    icon: GraduationCap,
    description: "Cursos y talleres",
    category: "CONTENIDO MÉDICO"
  },
  {
    label: "Quiénes Somos",
    href: adminRoutes.quienesSomos, // Si no existe en adminRoutes, agrégala
    icon: Info,
    description: "Editar información institucional",
    category: "CONTENIDO MÉDICO"
  },
  
  // PUBLICACIONES
  {
    label: "Noticias",
    href: "/admin/noticias",
    icon: Newspaper,
    description: "Gestionar noticias",
    category: "PUBLICACIONES"
  },
  {
    label: "Videos",
    href: "/admin/videos",
    icon: Video,
    description: "Galería de videos",
    category: "PUBLICACIONES"
  },
  {
    label: "Artículos",
    href: "/admin/articulos",
    icon: FileText,
    description: "Publicaciones informativas",
    category: "PUBLICACIONES"
  },
  {
    label: "Multimedia",
    href: "/admin/multimedia",
    icon: Image,
    description: "Imágenes y recursos",
    category: "PUBLICACIONES"
  },
  
  // USUARIOS
  {
    label: "Usuarios",
    href: adminRoutes.usuarios,
    icon: Users, 
    description: "Lista de usuarios",
    category: "USUARIOS"
  },
  {
    label: "Auditoría",
    href: "/admin/auditoria",
    icon: BarChart3,
    description: "Registro de actividades",
    category: "USUARIOS"
  },
  
  // SISTEMA
  {
    label: "Backups",
    href: adminRoutes.backups,
    icon: Database,
    description: "Respaldo de base de datos",
    category: "SISTEMA"
  },
  {
    label: "Configuración",
    href: adminRoutes.configuracion,
    icon: Settings,
    description: "Ajustes del sistema",
    category: "SISTEMA"
  },
  {
    label: "Bitácora",
    href: "/admin/bitacora",
    icon: HardDrive,
    description: "Logs del sistema",
    category: "SISTEMA"
  }
];