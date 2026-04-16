// src/components/admin/dashboard-admin/UsuariosActivos.tsx
'use client';

import { Users, User, Mail } from 'lucide-react';
import Link from 'next/link';

interface Usuario {
  id: number;
  nombre: string;
  apellidoPaterno: string;
  correo: string;
  rol: string;
}

interface UsuariosActivosProps {
  usuarios: Usuario[];
}

export function UsuariosActivos({ usuarios }: UsuariosActivosProps) {
  if (!usuarios || usuarios.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#0A3D62] flex items-center gap-2">
            <Users size={20} className="text-[#FFC300]" />
            Usuarios Recientes
          </h3>
          <Link
            href="/admin/usuarios"
            className="text-sm text-[#FFC300] hover:text-[#0A3D62] transition-colors"
          >
            Ver todos
          </Link>
        </div>
        <p className="text-gray-500 text-center py-8">No hay usuarios registrados</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#0A3D62] flex items-center gap-2">
          <Users size={20} className="text-[#FFC300]" />
          Usuarios Recientes
        </h3>
        <Link
          href="/admin/usuarios"
          className="text-sm text-[#FFC300] hover:text-[#0A3D62] transition-colors"
        >
          Ver todos
        </Link>
      </div>

      <div className="space-y-3">
        {usuarios.slice(0, 5).map((usuario) => (
          <div key={usuario.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#0A3D62] to-[#1A4F7A] rounded-full flex items-center justify-center">
                <User size={18} className="text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-800">
                  {usuario.nombre} {usuario.apellidoPaterno}
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                  <span className="flex items-center gap-1">
                    <Mail size={10} />
                    {usuario.correo}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full ${
                    usuario.rol === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {usuario.rol === 'admin' ? 'Admin' : 'Cliente'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}