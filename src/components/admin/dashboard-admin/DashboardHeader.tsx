// src/components/admin/dashboard-admin/DashboardHeader.tsx
'use client';

import { Bell, Settings, User, Search, BookOpen, Users, Activity, Calendar, LogOut, Home } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function DashboardHeader() {
  const router = useRouter();
  const [fechaActual] = useState(new Date());

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/acceder');
  };

  const opcionesFecha = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  } as const;

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0A3D62]">Panel de Administración</h1>
          <p className="text-gray-500 mt-1">
            {fechaActual.toLocaleDateString('es-MX', opcionesFecha)}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FFC300] w-64"
            />
          </div>

          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings size={20} />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-gray-200">
        <Link
          href="/cursos-admin"
          className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg text-sm text-gray-700 hover:bg-[#FFC300] hover:text-[#0A3D62] transition-colors"
        >
          <BookOpen size={16} />
          Cursos
        </Link>
        <Link
          href="/usuarios"
          className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg text-sm text-gray-700 hover:bg-[#FFC300] hover:text-[#0A3D62] transition-colors"
        >
          <Users size={16} />
          Usuarios
        </Link>
        <Link
          href="/inscripciones"
          className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg text-sm text-gray-700 hover:bg-[#FFC300] hover:text-[#0A3D62] transition-colors"
        >
          <Activity size={16} />
          Inscripciones
        </Link>
        <Link
          href="/saber-pediatrico/articulos"
          className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg text-sm text-gray-700 hover:bg-[#FFC300] hover:text-[#0A3D62] transition-colors"
        >
          <Home size={16} />
          Saber Pediatrico
        </Link>
        <Link
          href="/backups"
          className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg text-sm text-gray-700 hover:bg-[#FFC300] hover:text-[#0A3D62] transition-colors"
        >
          <Calendar size={16} />
          Respaldos
        </Link>
      </div>
    </div>
  );
}