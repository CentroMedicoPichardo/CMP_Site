// src/components/layout/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { clientSidebarItems, adminSidebarItems } from "@/config/sidebarItems";
import {
  SidebarItem,
  SidebarItemWithHref,
  SidebarItemWithChildren,
} from "@/types/sidebar.types";

interface SidebarProps {
  user: any;
  rol: string | null;
}

function isSidebarItemWithChildren(
  item: SidebarItem
): item is SidebarItemWithChildren {
  return "children" in item && Array.isArray(item.children);
}

function isSidebarItemWithHref(
  item: SidebarItem
): item is SidebarItemWithHref {
  return "href" in item;
}

function getItemKey(item: SidebarItem, index: number) {
  if (isSidebarItemWithHref(item)) {
    return `${item.href}-${item.label}-${index}`;
  }

  if (isSidebarItemWithChildren(item)) {
    return `${item.label}-${item.category || "sin-categoria"}-${index}`;
  }

  return `sidebar-item-${index}`;
}

function getChildKey(
  child: SidebarItemWithHref,
  parentLabel: string,
  index: number
) {
  return `${parentLabel}-${child.href}-${child.label}-${index}`;
}

const SubmenuItem = ({
  item,
  collapsed,
  pathname,
  isOpen,
  onToggle,
}: {
  item: SidebarItemWithChildren;
  collapsed: boolean;
  pathname: string;
  isOpen: boolean;
  onToggle: () => void;
}) => {
  const isActive = item.children?.some(
    (child) => pathname === child.href || pathname.startsWith(child.href + "/")
  );

  return (
    <li className="mb-1">
      <button
        type="button"
        onClick={onToggle}
        className={`
          w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
          ${
            isActive
              ? "bg-[#FFF9E6] text-[#0A3D62]"
              : "text-gray-600 hover:bg-gray-50 hover:text-[#0A3D62]"
          }
          ${collapsed ? "justify-center" : ""}
        `}
        title={collapsed ? item.label : undefined}
      >
        <item.icon
          size={18}
          className={
            isActive
              ? "text-[#FFC300]"
              : "text-gray-400 group-hover:text-[#0A3D62]"
          }
        />

        {!collapsed && (
          <>
            <span className="text-sm font-medium flex-1 text-left">
              {item.label}
            </span>

            {isOpen ? (
              <ChevronDown size={16} className="text-gray-400" />
            ) : (
              <ChevronRight size={16} className="text-gray-400" />
            )}
          </>
        )}
      </button>

      {!collapsed && isOpen && (
        <ul className="ml-6 mt-1 space-y-1 border-l-2 border-gray-100 pl-2">
          {item.children.map((child, index) => {
            const isChildActive =
              pathname === child.href || pathname.startsWith(child.href + "/");
            const ChildIcon = child.icon;

            return (
              <li key={getChildKey(child, item.label, index)}>
                <Link
                  href={child.href}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
                    ${
                      isChildActive
                        ? "bg-[#FFF9E6] text-[#0A3D62]"
                        : "text-gray-500 hover:bg-gray-50 hover:text-[#0A3D62]"
                    }
                  `}
                  title={child.description || child.label}
                >
                  <ChildIcon
                    size={16}
                    className={
                      isChildActive ? "text-[#FFC300]" : "text-gray-400"
                    }
                  />
                  <span className="text-sm font-medium">{child.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
};

const MenuItem = ({
  item,
  collapsed,
  pathname,
}: {
  item: SidebarItemWithHref;
  collapsed: boolean;
  pathname: string;
}) => {
  const isActive =
    pathname === item.href || pathname.startsWith(item.href + "/");
  const Icon = item.icon;

  return (
    <li>
      <Link
        href={item.href}
        className={`
          flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative group
          ${
            isActive
              ? "bg-[#FFF9E6] text-[#0A3D62] border-l-4 border-[#FFC300]"
              : "text-gray-600 hover:bg-gray-50 hover:text-[#0A3D62]"
          }
          ${collapsed ? "justify-center" : ""}
        `}
        title={collapsed ? item.description || item.label : item.label}
      >
        <Icon
          size={18}
          className={
            isActive
              ? "text-[#FFC300]"
              : "text-gray-400 group-hover:text-[#0A3D62]"
          }
        />

        {!collapsed && (
          <div className="flex-1">
            <span className="text-sm font-medium block">{item.label}</span>

            {item.description && (
              <span className="text-xs text-gray-400 mt-0.5 block">
                {item.description}
              </span>
            )}
          </div>
        )}

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

    const items = rol === "admin" ? adminSidebarItems : clientSidebarItems;
    const newOpenState: Record<string, boolean> = {};

    items.forEach((item, index) => {
      if (isSidebarItemWithChildren(item)) {
        const itemKey = getItemKey(item, index);

        const hasActiveChild = item.children.some(
          (child) =>
            pathname === child.href || pathname.startsWith(child.href + "/")
        );

        if (hasActiveChild) {
          newOpenState[itemKey] = true;
        }
      }
    });

    setOpenSubmenus(newOpenState);
  }, [pathname, rol]);

  const getSidebarItems = (): SidebarItem[] => {
    if (rol === "admin") return adminSidebarItems;
    if (rol === "cliente") return clientSidebarItems;
    return [];
  };

  const sidebarItems = getSidebarItems();

  const toggleSubmenu = (key: string) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (sidebarItems.length === 0) return null;
  if (!mounted) return null;

  const collapsed = !isHovered;

  return (
    <aside
      className={`
        bg-white border-r border-gray-200 h-[calc(100vh-4rem)] sticky top-16
        transition-all duration-300 shadow-sm flex flex-col
        ${collapsed ? "w-20" : "w-64"}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {user && (
        <div className="p-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#0A3D62] to-[#1A4F7A] rounded-full flex items-center justify-center text-white font-bold shrink-0">
              {user.nombre?.charAt(0)?.toUpperCase() || "U"}
            </div>

            {!collapsed && (
              <div className="overflow-hidden">
                <p className="font-semibold text-gray-800 truncate">
                  {user.nombre || "Usuario"}
                </p>
                <p className="text-xs text-[#FFC300] font-medium capitalize">
                  {rol || ""}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
        <div className="p-3">
          {rol === "admin" ? (
            (() => {
              const grouped = sidebarItems.reduce(
                (groups: Record<string, SidebarItem[]>, item) => {
                  const category = item.category || "PRINCIPAL";
                  if (!groups[category]) groups[category] = [];
                  groups[category].push(item);
                  return groups;
                },
                {}
              );

              return Object.entries(grouped).map(
                ([category, items], categoryIndex) => (
                  <div
                    key={`${category}-${categoryIndex}`}
                    className="mb-6"
                  >
                    {!collapsed && (
                      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">
                        {category}
                      </h3>
                    )}

                    <ul className="space-y-1">
                      {items.map((item, itemIndex) => {
                        const itemKey = getItemKey(item, itemIndex);

                        if (isSidebarItemWithChildren(item)) {
                          return (
                            <SubmenuItem
                              key={itemKey}
                              item={item}
                              collapsed={collapsed}
                              pathname={pathname}
                              isOpen={openSubmenus[itemKey] || false}
                              onToggle={() => toggleSubmenu(itemKey)}
                            />
                          );
                        }

                        if (isSidebarItemWithHref(item)) {
                          return (
                            <MenuItem
                              key={itemKey}
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
                )
              );
            })()
          ) : (
            <ul className="space-y-1">
              {sidebarItems.map((item, index) => {
                if (isSidebarItemWithHref(item)) {
                  return (
                    <MenuItem
                      key={getItemKey(item, index)}
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