// src/app/(admin)/servicios/page.tsx
'use client';

import { useState, useCallback } from 'react';
import useSWR, { mutate as swrMutate } from 'swr';
import { ServiciosHeader } from '@/components/admin/servicios/ServiciosHeader';
import { ServiciosSearchBar } from '@/components/admin/servicios/ServiciosSearchBar';
import { ServiciosGrid } from '@/components/admin/servicios/ServiciosGrid';
import { ServicioFormModal } from '@/components/admin/servicios/ServicioFormModal';
import type { Servicio } from '@/types/servicios';

// Clave para SWR
const SERVICIOS_API_KEY = '/api/servicios?admin=true';

export default function AdminServiciosPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedServicio, setSelectedServicio] = useState<Servicio | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActivo, setFilterActivo] = useState<boolean | 'todos'>('todos');
  const [refreshKey, setRefreshKey] = useState(0);

  // SWR para cargar servicios
  const { data: servicios = [], error, isLoading, mutate: refreshData } = useSWR(
    SERVICIOS_API_KEY,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 2000,
    }
  );

  // Función para obtener URL válida de imagen
  const getValidImageUrl = (url: string | null | undefined): string => {
    if (!url || url === 'no_imagen_uwvduy' || url.trim() === '') {
      return '/default-service.jpg';
    }
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/')) return url;
    return `/${url}`;
  };

  // Formatear servicios con propiedades computadas
  const serviciosFormateados = servicios.map((s: any, index: number) => ({
    ...s,
    idServicio: s.idServicio || `temp-${index}-${Date.now()}`,
    imagenSrc: getValidImageUrl(s.urlImage),
  }));

  // Aplicar filtros localmente
  const filteredServicios = serviciosFormateados.filter((s: Servicio) => {
    // Filtro por búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const tituloCoincide = s.tituloServicio?.toLowerCase().includes(term);
      const descripcionCoincide = s.descripcion?.toLowerCase().includes(term);
      const ubicacionCoincide = s.ubicacion?.toLowerCase().includes(term);
      
      if (!tituloCoincide && !descripcionCoincide && !ubicacionCoincide) {
        return false;
      }
    }

    // Filtro por activo/inactivo
    if (filterActivo !== 'todos' && s.activo !== filterActivo) {
      return false;
    }

    return true;
  });

  const handleEdit = (servicio: Servicio) => {
    setSelectedServicio(servicio);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedServicio(null);
    setModalOpen(true);
  };

  const forceRefresh = useCallback(async () => {
    await refreshData();
    setRefreshKey(prev => prev + 1);
  }, [refreshData]);

  const handleSave = async (servicioData: Partial<Servicio>) => {
    try {
      const url = selectedServicio 
        ? `/api/servicios/${selectedServicio.idServicio}`
        : '/api/servicios';
      
      const method = selectedServicio ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(servicioData)
      });

      if (!res.ok) throw new Error('Error al guardar');

      setModalOpen(false);
      await forceRefresh();
      
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleToggleActivo = async (servicio: Servicio) => {
    try {
      const res = await fetch(`/api/servicios/${servicio.idServicio}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...servicio, activo: !servicio.activo })
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
      <ServiciosHeader 
        totalServicios={filteredServicios.length}
        onCreateClick={handleCreate}
      />

      <ServiciosSearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterActivo={filterActivo}
        onFilterChange={setFilterActivo}
        onRefresh={handleRefresh}
      />

      <ServiciosGrid
        key={refreshKey}
        servicios={filteredServicios}
        loading={isLoading}
        onEdit={handleEdit}
        onToggleActivo={handleToggleActivo}
      />

      <ServicioFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        servicio={selectedServicio}
      />
    </div>
  );
}