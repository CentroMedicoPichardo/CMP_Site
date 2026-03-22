// src/components/admin/usuarios/UsuariosTable.tsx
'use client';

import { Loader2, Shield, User, Mail, Phone, CheckCircle, XCircle } from 'lucide-react';
import type { Usuario, Rol } from '@/types/usuarios';

interface UsuariosTableProps {
  usuarios: Usuario[];
  loading: boolean;
  onCambiarRol: (usuario: Usuario) => void;
  roles: Rol[];
}

export function UsuariosTable({ usuarios, loading, onCambiarRol, roles }: UsuariosTableProps) {
  const getRolColor = (rolNombre: string) => {
    switch (rolNombre?.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'cliente':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 bg-white rounded-2xl shadow-lg">
        <Loader2 className="animate-spin" size={40} color="#0A3D62" />
      </div>
    );
  }

  if (usuarios.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
        <p className="text-gray-500 text-lg">No se encontraron usuarios</p>
        <p className="text-gray-400 text-sm mt-2">Intenta con otros filtros</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-[#FFC300]/20">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-[#0A3D62] to-[#1A4F7A] text-white">
              <th className="px-6 py-4 text-left text-sm font-semibold">Usuario</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Contacto</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Rol</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Estado</th>
              <th className="px-6 py-4 text-center text-sm font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {usuarios.map((usuario) => {
              const rolColor = getRolColor(usuario.rolNombre);
              const nombreCompleto = `${usuario.nombre} ${usuario.apellidoPaterno} ${usuario.apellidoMaterno || ''}`.trim();
              
              return (
                <tr key={usuario.id} className="hover:bg-[#FFF9E6] transition-colors">
                  {/* Usuario */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#0A3D62]/10 rounded-full flex items-center justify-center">
                        <User size={18} className="text-[#0A3D62]" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{nombreCompleto}</p>
                        <p className="text-xs text-gray-500">ID: {usuario.id}</p>
                      </div>
                    </div>
                  </td>

                  {/* Contacto */}
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail size={14} className="text-[#FFC300]" />
                        <span>{usuario.correo}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone size={14} className="text-[#FFC300]" />
                        <span>{usuario.telefono || 'No registrado'}</span>
                      </div>
                    </div>
                  </td>

                  {/* Rol */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${rolColor}`}>
                      <Shield size={12} />
                      {usuario.rolNombre || 'Sin rol'}
                    </span>
                  </td>

                  {/* Estado */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                      usuario.activo
                        ? 'bg-green-100 text-green-700 border border-green-200'
                        : 'bg-red-100 text-red-700 border border-red-200'
                    }`}>
                      {usuario.activo ? (
                        <CheckCircle size={12} />
                      ) : (
                        <XCircle size={12} />
                      )}
                      {usuario.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>

                  {/* Acciones */}
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => onCambiarRol(usuario)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FFC300] to-[#FFD700] text-[#0A3D62] rounded-lg hover:from-[#0A3D62] hover:to-[#1A4F7A] hover:text-white transition-all duration-300 text-sm font-medium shadow-sm hover:shadow-md"
                    >
                      <Shield size={14} />
                      Cambiar Rol
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer con contador */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <p className="text-sm text-gray-500">
          Mostrando <span className="font-semibold text-[#0A3D62]">{usuarios.length}</span> de{' '}
          <span className="font-semibold text-[#0A3D62]">{usuarios.length}</span> usuarios
        </p>
      </div>
    </div>
  );
}