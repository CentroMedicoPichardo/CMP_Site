// src/types/sidebar.types.ts
import { LucideIcon } from 'lucide-react';

export interface SidebarItemBase {
  label: string;
  icon: LucideIcon;
  description?: string;
  category?: string;
}

export interface SidebarItemWithHref extends SidebarItemBase {
  href: string;
}

export interface SidebarItemWithChildren extends SidebarItemBase {
  children: SidebarItemWithHref[];
  // No tiene href porque es un contenedor, no un enlace
}

export type SidebarItem = SidebarItemWithHref | SidebarItemWithChildren;