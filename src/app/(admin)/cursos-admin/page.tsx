// src/app/(admin)/cursos/page.tsx
'use client';

import { useState, useCallback } from 'react';
import useSWR, { mutate as swrMutate } from 'swr';
import { CursosHeader } from '@/components/admin/cursos/CursosHeader';
import { CursosSearchBar } from '@/components/admin/cursos/CursosSearchBar';
import { CursosGrid } from '@/components/admin/cursos/CursosGrid';
import { CursoFormModal } from '@/components/admin/cursos/CursoFormModal';
import type { Curso } from '@/types/cursos';

// Clave para SWR
const CURSOS_API_KEY = '/api/cursos?admin=true';

export default function AdminCursosPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCurso, setSelectedCurso] = useState<Curso | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActivo, setFilterActivo] = useState<boolean | 'todos'>('todos');
  const [refreshKey, setRefreshKey] = useState(0);

  // SWR para cargar cursos
  const { data: cursos = [], error, isLoading, mutate: refreshData } = useSWR(
    CURSOS_API_KEY,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 2000,
    }
  );

  // Función para obtener URL válida de imagen
  const getValidImageUrl = (url: string | null | undefined): string => {
    if (!url || url === 'no_imagen_uwvduy' || url.trim() === '') {
      return '/default-curso.jpg';
    }
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/')) return url;
    return `/${url}`;
  };

  // Formatear cursos con propiedades computadas
  const cursosFormateados = cursos.map((c: any, index: number) => ({
    ...c,
    idCurso: c.idCurso || `temp-${index}-${Date.now()}`,
    imagenSrc: getValidImageUrl(c.urlImagenPortada),
  }));

  // Aplicar filtros localmente
  const filteredCursos = cursosFormateados.filter((c: Curso) => {
    // Filtro por búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const tituloCoincide = c.tituloCurso?.toLowerCase().includes(term);
      const descripcionCoincide = c.descripcion?.toLowerCase().includes(term);
      const instructorCoincide = c.instructorNombre?.toLowerCase().includes(term);
      
      if (!tituloCoincide && !descripcionCoincide && !instructorCoincide) {
        return false;
      }
    }

    // Filtro por activo/inactivo
    if (filterActivo !== 'todos' && c.activo !== filterActivo) {
      return false;
    }

    return true;
  });

  const handleEdit = (curso: Curso) => {
    setSelectedCurso(curso);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedCurso(null);
    setModalOpen(true);
  };

  const forceRefresh = useCallback(async () => {
    await refreshData();
    setRefreshKey(prev => prev + 1);
  }, [refreshData]);

  const handleSave = async (cursoData: Partial<Curso>) => {
    try {
      const url = selectedCurso 
        ? `/api/cursos/${selectedCurso.idCurso}`
        : '/api/cursos';
      
      const method = selectedCurso ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cursoData)
      });

      if (!res.ok) throw new Error('Error al guardar');

      setModalOpen(false);
      await forceRefresh();
      
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar el curso');
    }
  };

  const handleToggleActivo = async (curso: Curso) => {
    try {
      const url = `/api/cursos/${curso.idCurso}`;
      
      const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...curso, activo: !curso.activo })
      });

      if (!res.ok) throw new Error('Error al actualizar');

      await forceRefresh();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cambiar el estado del curso');
    }
  };

  const handleRefresh = useCallback(() => {
    forceRefresh();
  }, [forceRefresh]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <CursosHeader 
        totalCursos={filteredCursos.length}
        onCreateClick={handleCreate}
      />

      <CursosSearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterActivo={filterActivo}
        onFilterChange={setFilterActivo}
        onRefresh={handleRefresh}
      />

      <CursosGrid
        key={refreshKey}
        cursos={filteredCursos}
        loading={isLoading}
        onEdit={handleEdit}
        onToggleActivo={handleToggleActivo}
      />

      <CursoFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        curso={selectedCurso}
      />
    </div>
  );
}