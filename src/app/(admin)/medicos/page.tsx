// src/app/(admin)/medicos/page.tsx
'use client';

import { useState, useCallback } from 'react';
import useSWR, { mutate as swrMutate } from 'swr';
import { Plus } from 'lucide-react';
import { MedicosHeader } from '@/components/admin/medicos/MedicosHeader';
import { MedicosSearchBar } from '@/components/admin/medicos/MedicosSearchBar';
import { MedicosGrid } from '@/components/admin/medicos/MedicosGrid';
import { MedicoFormModal } from '@/components/admin/medicos/MedicoFormModal';
import type { Medico } from '@/types/medicos';

// Clave para SWR (constante para evitar errores)
const MEDICOS_API_KEY = '/api/medicos?admin=true';

export default function AdminMedicosPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMedico, setSelectedMedico] = useState<Medico | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActivo, setFilterActivo] = useState<boolean | 'todos'>('todos');
  const [refreshKey, setRefreshKey] = useState(0);

  // 👇 SWR para cargar médicos
  const { data: medicos = [], error, isLoading, mutate: refreshData } = useSWR(
    MEDICOS_API_KEY,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 2000,
    }
  );

  // Función para obtener URL válida de imagen
  const getValidImageUrl = (url: string | null | undefined): string => {
    if (!url || url === 'no_imagen_uwvduy' || url.trim() === '') {
      return '/default-doctor.jpg';
    }
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/')) return url;
    return `/${url}`;
  };

  // Función para construir nombre completo
  const getNombreCompleto = useCallback((medico: Medico): string => {
    return [medico.nombres, medico.apellidoPaterno, medico.apellidoMaterno]
      .filter(Boolean)
      .join(' ')
      .trim() || 'Médico';
  }, []);

  // Formatear médicos con propiedades computadas y asegurar IDs únicos
  const medicosFormateados = medicos.map((m: any, index: number) => ({
    ...m,
    idMedico: m.idMedico || `temp-${index}-${Date.now()}`, // 👈 Garantizar ID único
    nombreCompleto: getNombreCompleto(m),
    imagenSrc: getValidImageUrl(m.urlFoto),
  }));

  // Aplicar filtros localmente
  const filteredMedicos = medicosFormateados.filter((m: Medico) => {
    // Filtro por búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const nombreCompleto = [m.nombres, m.apellidoPaterno, m.apellidoMaterno]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      
      if (!nombreCompleto.includes(term) && 
          !m.especialidad?.toLowerCase().includes(term) &&
          !m.hospitalClinica?.toLowerCase().includes(term)) {
        return false;
      }
    }

    // Filtro por activo/inactivo
    if (filterActivo !== 'todos' && m.activo !== filterActivo) {
      return false;
    }

    return true;
  });

  const handleEdit = (medico: Medico) => {
    console.log('Editando médico:', medico.idMedico);
    setSelectedMedico(medico);
    setModalOpen(true);
  };

  const handleCreate = () => {
    console.log('Creando nuevo médico');
    setSelectedMedico(null);
    setModalOpen(true);
  };

  // 👇 Función para forzar recarga completa
  const forceRefresh = useCallback(async () => {
    console.log('🔄 Forzando recarga de médicos...');
    
    // Invalidar la caché y forzar recarga
    await refreshData();
    
    // También actualizar la clave de refresco para componentes hijos
    setRefreshKey(prev => prev + 1);
  }, [refreshData]);

  const handleSave = async (medicoData: Partial<Medico>) => {
    try {
      const url = selectedMedico 
        ? `/api/medicos/${selectedMedico.idMedico}`
        : '/api/medicos';
      
      const method = selectedMedico ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(medicoData)
      });

      if (!res.ok) throw new Error('Error al guardar');

      // 👇 Primero cerrar el modal, luego refrescar
      setModalOpen(false);
      await forceRefresh();
      
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleToggleActivo = async (medico: Medico) => {
    try {
      const res = await fetch(`/api/medicos/${medico.idMedico}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...medico, activo: !medico.activo })
      });

      if (!res.ok) throw new Error('Error al actualizar');

      await forceRefresh();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleRefresh = useCallback(() => {
    forceRefresh();
  }, [forceRefresh]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <MedicosHeader 
        totalMedicos={filteredMedicos.length}
        onCreateClick={handleCreate}
      />

      <MedicosSearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterActivo={filterActivo}
        onFilterChange={setFilterActivo}
        onRefresh={handleRefresh}
      />

      <MedicosGrid
        key={refreshKey}
        medicos={filteredMedicos}
        loading={isLoading}
        onEdit={handleEdit}
        onToggleActivo={handleToggleActivo}
      />

      <MedicoFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        medico={selectedMedico}
      />
    </div>
  );
}