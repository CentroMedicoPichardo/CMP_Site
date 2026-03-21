// src/types/sidebar.types.ts
import { ForwardRefExoticComponent, RefAttributes } from 'react';
import { LucideProps } from 'lucide-react';

// Tipo base para todos los items
export interface SidebarItemBase {
  label: string;
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
  description?: string;
}

// Tipo para items con href (la mayoría)
export interface SidebarItemWithHref extends SidebarItemBase {
  href: string;
  category?: string; // ← Propiedad opcional para categorizar
}

// Tipo para items que son categorías (sin href)
export interface SidebarCategory extends SidebarItemBase {
  category: string;
  items: SidebarItemWithHref[]; // Subitems
}

// Tipo unificado
export type SidebarItem = SidebarItemWithHref | SidebarCategory;