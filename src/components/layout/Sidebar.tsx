// src/components/layout/Sidebar.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { clientSidebarItems, adminSidebarItems } from '@/config/sidebarItems';
import { SidebarItem, SidebarItemWithHref } from '@/types/sidebar.types';

interface SidebarProps {
  user: any;
  rol: string | null;
}

export function Sidebar({ user, rol }: SidebarProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determinar qué items mostrar según el rol (solo admin o cliente)
  const getSidebarItems = (): SidebarItem[] => {
    if (rol === 'admin') return adminSidebarItems;
    if (rol === 'cliente') return clientSidebarItems;
    return []; // No mostrar nada si no hay rol válido
  };

  const sidebarItems = getSidebarItems();

  // Si no hay items para mostrar, no renderizar nada
  if (sidebarItems.length === 0) return null;

  // Filtrar solo items con href (para la navegación)
  const itemsWithHref = sidebarItems.filter((item): item is SidebarItemWithHref => {
    return 'href' in item;
  });

  // Agrupar items por categoría (solo para admin)
  const groupedItems = rol === 'admin' 
    ? itemsWithHref.reduce((groups: Record<string, SidebarItemWithHref[]>, item) => {
        const category = item.category || 'PRINCIPAL';
        if (!groups[category]) {
          groups[category] = [];
        }
        groups[category].push(item);
        return groups;
      }, {})
    : { 'default': itemsWithHref };

  // No renderizar hasta que el componente esté montado en el cliente
  if (!mounted) return null;

  // Estado colapsado: colapsado por defecto, se expande al hacer hover
  const collapsed = !isHovered;

  return (
    <aside 
      className={`
        bg-white border-r border-gray-200 h-[calc(100vh-4rem)] sticky top-16 
        transition-all duration-300 shadow-sm flex flex-col
        ${collapsed ? 'w-20' : 'w-64'}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Información del usuario (solo si está autenticado) */}
      {user && (
        <div className="p-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#0A3D62] to-[#1A4F7A] rounded-full flex items-center justify-center text-white font-bold shrink-0">
              {user.nombre?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <p className="font-semibold text-gray-800 truncate">
                  {user.nombre || 'Usuario'}
                </p>
                <p className="text-xs text-[#FFC300] font-medium capitalize">
                  {rol || ''}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Menú de navegación CON SCROLL */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
        <div className="p-3">
          {rol === 'admin' ? (
            // Vista para admin con categorías
            Object.entries(groupedItems).map(([category, items]) => (
              <div key={category} className="mb-6">
                {!collapsed && (
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">
                    {category}
                  </h3>
                )}
                <ul className="space-y-1">
                  {items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`
                          flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative group
                          ${pathname === item.href || pathname.startsWith(item.href + '/')
                            ? 'bg-[#FFF9E6] text-[#0A3D62] border-l-4 border-[#FFC300]' 
                            : 'text-gray-600 hover:bg-gray-50 hover:text-[#0A3D62]'
                          }
                          ${collapsed ? 'justify-center' : ''}
                        `}
                        title={!collapsed ? item.label : item.description || item.label}
                      >
                        <item.icon size={18} className={pathname === item.href ? 'text-[#FFC300]' : 'text-gray-400 group-hover:text-[#0A3D62]'} />
                        {!collapsed && (
                          <span className="text-sm font-medium flex-1">{item.label}</span>
                        )}
                        
                        {/* Tooltip para modo colapsado */}
                        {collapsed && (
                          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                            {item.label}
                          </div>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            // Vista para cliente (sin categorías)
            <ul className="space-y-1">
              {itemsWithHref.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 relative group
                      ${pathname === item.href || pathname.startsWith(item.href + '/')
                        ? 'bg-[#FFF9E6] text-[#0A3D62] border-l-4 border-[#FFC300]' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-[#0A3D62]'
                      }
                      ${collapsed ? 'justify-center' : ''}
                    `}
                    title={!collapsed ? item.label : item.description || item.label}
                  >
                    <item.icon size={20} className={pathname === item.href ? 'text-[#FFC300]' : 'text-gray-400 group-hover:text-[#0A3D62]'} />
                    {!collapsed && (
                      <div className="flex-1">
                        <span className="text-sm font-medium block">{item.label}</span>
                        {item.description && (
                          <span className="text-xs text-gray-400 mt-0.5 block">{item.description}</span>
                        )}
                      </div>
                    )}
                    
                    {/* Tooltip para modo colapsado */}
                    {collapsed && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                        {item.label}
                      </div>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </nav>
    </aside>
  );
}