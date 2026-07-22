// src/app/(admin)/cursos-admin/page.tsx
'use client';

import { useState, useCallback } from 'react';
import useSWR from "swr";
import { CursosHeader } from '@/components/admin/cursos/CursosHeader';
import { CursosSearchBar } from '@/components/admin/cursos/CursosSearchBar';
import { CursosGrid } from '@/components/admin/cursos/CursosGrid';
import { CursoFormModal } from '@/components/admin/cursos/CursoFormModal';
import type {
  ActualizarCursoInput,
  CrearCursoInput,
  Curso,
} from "@/types/cursos";

import { getApiErrorMessage } from "@/types/api";

type CursoSubmitInput =
  | CrearCursoInput
  | ActualizarCursoInput;

// Clave para SWR
const CURSOS_API_KEY = '/api/cursos?admin=true';

export default function AdminCursosPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCurso, setSelectedCurso] = useState<Curso | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActivo, setFilterActivo] = useState<boolean | 'todos'>('todos');
  const [refreshKey, setRefreshKey] = useState(0);

  // SWR para cargar cursos
  const {
    data: cursos = [],
    error,
    isLoading,
    mutate: refreshData,
  } = useSWR<Curso[]>(CURSOS_API_KEY, {
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
  const cursosFormateados: Curso[] =
    cursos.map((curso) => ({
      ...curso,
      imagenSrc: getValidImageUrl(
        curso.urlImagenPortada
      ),
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

  const handleSave = async (
    cursoData: CursoSubmitInput
  ) => {
    try {
      const editing = selectedCurso !== null;

      const url = editing
        ? `/api/cursos/${selectedCurso.idCurso}`
        : "/api/cursos";

      const response = await fetch(url, {
        method: editing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cursoData),
      });

      const payload: unknown =
        await response.json();

      if (!response.ok) {
        throw new Error(
          getApiErrorMessage(
            payload,
            editing
              ? "Error al actualizar el curso"
              : "Error al crear el curso"
          )
        );
      }

      setModalOpen(false);
      setSelectedCurso(null);

      await forceRefresh();
    } catch (error: unknown) {
      console.error(
        "Error al guardar curso:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Error al guardar el curso"
      );

      throw error;
    }
  };

  const handleToggleActivo = async (
    curso: Curso
  ) => {
    try {
      const response = await fetch(
        `/api/cursos/${curso.idCurso}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            activo: !curso.activo,
          }),
        }
      );

      const payload: unknown =
        await response.json();

      if (!response.ok) {
        throw new Error(
          getApiErrorMessage(
            payload,
            "Error al cambiar el estado del curso"
          )
        );
      }

      await forceRefresh();
    } catch (error: unknown) {
      console.error(
        "Error al cambiar el estado:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Error al cambiar el estado del curso"
      );
    }
  };

  const handleRefresh = useCallback(async () => {
    await forceRefresh();
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
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error instanceof Error
            ? error.message
            : "No fue posible cargar los cursos"}
        </div>
      )}
      <CursosGrid
        key={refreshKey}
        cursos={filteredCursos}
        loading={isLoading}
        onEdit={handleEdit}
        onToggleActivo={handleToggleActivo}
      />

      <CursoFormModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedCurso(null);
        }}
        onSave={handleSave}
        curso={selectedCurso}
      />
    </div>
  );
}