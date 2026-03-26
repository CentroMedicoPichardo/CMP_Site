// src/components/layout/Sidebar.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { clientSidebarItems, adminSidebarItems } from '@/config/sidebarItems';
import { SidebarItem, SidebarItemWithHref, SidebarItemWithChildren } from '@/types/sidebar.types';

interface SidebarProps {
  user: any;
  rol: string | null;
}

// Type guard para verificar si es un item con hijos
function isSidebarItemWithChildren(item: SidebarItem): item is SidebarItemWithChildren {
  return 'children' in item && Array.isArray(item.children);
}

// Type guard para verificar si es un item con href
function isSidebarItemWithHref(item: SidebarItem): item is SidebarItemWithHref {
  return 'href' in item;
}

// Componente para item con submenú
const SubmenuItem = ({ 
  item, 
  collapsed, 
  pathname, 
  isOpen, 
  onToggle 
}: { 
  item: SidebarItemWithChildren; 
  collapsed: boolean; 
  pathname: string;
  isOpen: boolean;
  onToggle: () => void;
}) => {
  const isActive = item.children?.some(child => 
    pathname === child.href || pathname.startsWith(child.href + '/')
  );

  return (
    <div className="mb-1">
      <button
        onClick={onToggle}
        className={`
          w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
          ${isActive ? 'bg-[#FFF9E6] text-[#0A3D62]' : 'text-gray-600 hover:bg-gray-50 hover:text-[#0A3D62]'}
          ${collapsed ? 'justify-center' : ''}
        `}
        title={collapsed ? item.label : undefined}
      >
        <item.icon size={18} className={isActive ? 'text-[#FFC300]' : 'text-gray-400 group-hover:text-[#0A3D62]'} />
        {!collapsed && (
          <>
            <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
            {isOpen ? (
              <ChevronDown size={16} className="text-gray-400" />
            ) : (
              <ChevronRight size={16} className="text-gray-400" />
            )}
          </>
        )}
      </button>
      
      {/* Submenú */}
      {!collapsed && isOpen && (
        <div className="ml-6 mt-1 space-y-1 border-l-2 border-gray-100 pl-2">
          {item.children.map((child) => {
            const isChildActive = pathname === child.href || pathname.startsWith(child.href + '/');
            const ChildIcon = child.icon;
            return (
              <Link
                key={child.href}
                href={child.href}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
                  ${isChildActive 
                    ? 'bg-[#FFF9E6] text-[#0A3D62]' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-[#0A3D62]'
                  }
                `}
                title={child.description || child.label}
              >
                <ChildIcon size={16} className={isChildActive ? 'text-[#FFC300]' : 'text-gray-400'} />
                <span className="text-sm font-medium">{child.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Componente para item normal (sin submenú)
const MenuItem = ({ item, collapsed, pathname }: { item: SidebarItemWithHref; collapsed: boolean; pathname: string }) => {
  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
  const Icon = item.icon;

  return (
    <li>
      <Link
        href={item.href}
        className={`
          flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative group
          ${isActive 
            ? 'bg-[#FFF9E6] text-[#0A3D62] border-l-4 border-[#FFC300]' 
            : 'text-gray-600 hover:bg-gray-50 hover:text-[#0A3D62]'
          }
          ${collapsed ? 'justify-center' : ''}
        `}
        title={!collapsed ? item.label : item.description || item.label}
      >
        <Icon size={18} className={isActive ? 'text-[#FFC300]' : 'text-gray-400 group-hover:text-[#0A3D62]'} />
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
  );
};

export function Sidebar({ user, rol }: SidebarProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    
    // Abrir automáticamente el submenú si hay una ruta activa dentro
    const items = rol === 'admin' ? adminSidebarItems : clientSidebarItems;
    const newOpenState: Record<string, boolean> = {};
    
    items.forEach(item => {
      if (isSidebarItemWithChildren(item)) {
        const hasActiveChild = item.children.some(child => 
          pathname === child.href || pathname.startsWith(child.href + '/')
        );
        if (hasActiveChild) {
          newOpenState[item.label] = true;
        }
      }
    });
    
    setOpenSubmenus(newOpenState);
  }, [pathname, rol]);

  const toggleSubmenu = (label: string) => {
    setOpenSubmenus(prev => ({ ...prev, [label]: !prev[label] }));
  };

  // Determinar qué items mostrar según el rol
  const getSidebarItems = (): SidebarItem[] => {
    if (rol === 'admin') return adminSidebarItems;
    if (rol === 'cliente') return clientSidebarItems;
    return [];
  };

  const sidebarItems = getSidebarItems();

  if (sidebarItems.length === 0) return null;
  if (!mounted) return null;

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
      {/* Información del usuario */}
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

      {/* Menú de navegación */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
        <div className="p-3">
          {rol === 'admin' ? (
            // Vista para admin con categorías y submenús
            (() => {
              // Agrupar items por categoría
              const grouped = sidebarItems.reduce((groups: Record<string, SidebarItem[]>, item) => {
                const category = item.category || 'PRINCIPAL';
                if (!groups[category]) groups[category] = [];
                groups[category].push(item);
                return groups;
              }, {});
              
              return Object.entries(grouped).map(([category, items]) => (
                <div key={category} className="mb-6">
                  {!collapsed && (
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">
                      {category}
                    </h3>
                  )}
                  <ul className="space-y-1">
                    {items.map((item) => {
                      if (isSidebarItemWithChildren(item)) {
                        return (
                          <SubmenuItem
                            key={item.label}
                            item={item}
                            collapsed={collapsed}
                            pathname={pathname}
                            isOpen={openSubmenus[item.label] || false}
                            onToggle={() => toggleSubmenu(item.label)}
                          />
                        );
                      } else if (isSidebarItemWithHref(item)) {
                        return (
                          <MenuItem
                            key={item.href}
                            item={item}
                            collapsed={collapsed}
                            pathname={pathname}
                          />
                        );
                      }
                      return null;
                    })}
                  </ul>
                </div>
              ));
            })()
          ) : (
            // Vista para cliente (simple)
            <ul className="space-y-1">
              {sidebarItems.map((item) => {
                if (isSidebarItemWithHref(item)) {
                  return (
                    <MenuItem
                      key={item.href}
                      item={item}
                      collapsed={collapsed}
                      pathname={pathname}
                    />
                  );
                }
                return null;
              })}
            </ul>
          )}
        </div>
      </nav>
    </aside>
  );
}