// src/app/(admin)/saber-pediatrico/encuestas/page.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import useSWR from 'swr';
import { ContenidoHeader } from '@/components/admin/saber-pediatrico/shared/ContenidoHeader';
import { ContenidoFilters } from '@/components/admin/saber-pediatrico/shared/ContenidoFilters';
import { ContenidoGrid } from '@/components/admin/saber-pediatrico/shared/ContenidoGrid';
import { ContenidoFormModal } from '@/components/admin/saber-pediatrico/shared/ContenidoFormModal';

const API_URL = '/api/saber-pediatrico?tipo=encuesta&admin=true';

export default function EncuestasPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActivo, setFilterActivo] = useState<boolean | 'todos'>('todos');
  const [saving, setSaving] = useState(false);

  const { data, error, isLoading, mutate } = useSWR(API_URL);

  const items = data?.data || [];
  
  const filteredItems = items.filter((item: any) => {
    if (searchTerm && !item.titulo.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (filterActivo !== 'todos' && item.activo !== filterActivo) {
      return false;
    }
    return true;
  });

  const handleEdit = (id: number) => {
    const item = items.find((i: any) => i.id === id);
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedItem(null);
    setModalOpen(true);
  };

  const handleSave = async (formData: any) => {
    setSaving(true);
    try {
      const url = selectedItem 
        ? `/api/saber-pediatrico/${selectedItem.id}`
        : '/api/saber-pediatrico';
      
      const method = selectedItem ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, tipo: 'encuesta' })
      });

      if (!res.ok) throw new Error('Error al guardar');

      await mutate();
      setModalOpen(false);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActivo = async (id: number, activo: boolean) => {
    const item = items.find((i: any) => i.id === id);
    if (!item) return;
    
    try {
      const res = await fetch(`/api/saber-pediatrico/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...item, activo: !activo })
      });
      if (!res.ok) throw new Error('Error al actualizar');
      await mutate();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <ContenidoHeader
        title="Encuestas"
        description="Encuestas para padres y cuidadores"
        totalItems={filteredItems.length}
        onCreateClick={handleCreate}
        buttonText="Nueva Encuesta"
      />

      <ContenidoFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterActivo={filterActivo}
        onFilterChange={setFilterActivo}
      />

      <ContenidoGrid
        items={filteredItems}
        loading={isLoading}
        onEdit={handleEdit}
        onToggleActivo={handleToggleActivo}
      />

      <ContenidoFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        item={selectedItem}
        tipo="encuesta"
        saving={saving}
      />
    </>
  );
}