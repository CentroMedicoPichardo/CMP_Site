// src/app/(admin)/usuarios/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { UsuariosHeader } from '@/components/admin/usuarios/UsuariosHeader';
import { UsuariosSearchBar } from '@/components/admin/usuarios/UsuariosSearchBar';
import { UsuariosTable } from '@/components/admin/usuarios/UsuariosTable';
import { ChangeRolModal } from '@/components/admin/usuarios/ChangeRolModal';
import type { Usuario, Rol } from '@/types/usuarios';

export default function AdminUsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActivo, setFilterActivo] = useState<boolean | 'todos'>('todos');
  const [filterRol, setFilterRol] = useState<number | 'todos'>('todos');
  
  // Modal para cambiar rol
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [selectedRolId, setSelectedRolId] = useState<number>(0);
  const [updating, setUpdating] = useState(false);

  // Cargar usuarios
  const loadUsuarios = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/usuarios');
      const data = await res.json();
      setUsuarios(data);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar roles
  const loadRoles = async () => {
    try {
      const res = await fetch('/api/roles');
      const data = await res.json();
      setRoles(data);
    } catch (error) {
      console.error('Error cargando roles:', error);
    }
  };

  useEffect(() => {
    loadUsuarios();
    loadRoles();
  }, []);

  // Filtrar usuarios
  const filteredUsuarios = usuarios.filter(usuario => {
    // Filtro por búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const nombreCompleto = `${usuario.nombre} ${usuario.apellidoPaterno} ${usuario.apellidoMaterno || ''}`.toLowerCase();
      const correoCoincide = usuario.correo?.toLowerCase().includes(term);
      const telefonoCoincide = usuario.telefono?.toLowerCase().includes(term);
      
      if (!nombreCompleto.includes(term) && !correoCoincide && !telefonoCoincide) {
        return false;
      }
    }

    // Filtro por estado activo
    if (filterActivo !== 'todos' && usuario.activo !== filterActivo) {
      return false;
    }

    // Filtro por rol
    if (filterRol !== 'todos' && usuario.rolId !== filterRol) {
      return false;
    }

    return true;
  });

  const handleChangeRol = (usuario: Usuario) => {
    setSelectedUsuario(usuario);
    setSelectedRolId(usuario.rolId);
    setModalOpen(true);
  };

  const handleSaveRol = async () => {
    if (!selectedUsuario) return;
    
    setUpdating(true);
    try {
      const res = await fetch(`/api/usuarios/${selectedUsuario.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rolId: selectedRolId })
      });

      if (!res.ok) throw new Error('Error al actualizar rol');

      // Recargar usuarios
      await loadUsuarios();
      setModalOpen(false);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cambiar el rol');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <UsuariosHeader totalUsuarios={filteredUsuarios.length} />
      
      <UsuariosSearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterActivo={filterActivo}
        onFilterChange={setFilterActivo}
        filterRol={filterRol}
        onFilterRolChange={setFilterRol}
        roles={roles}
      />

      <UsuariosTable
        usuarios={filteredUsuarios}
        loading={loading}
        onCambiarRol={handleChangeRol}
        roles={roles}
      />

      <ChangeRolModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        usuario={selectedUsuario}
        roles={roles}
        selectedRolId={selectedRolId}
        onRolChange={setSelectedRolId}
        onSave={handleSaveRol}
        saving={updating}
      />
    </div>
  );
}