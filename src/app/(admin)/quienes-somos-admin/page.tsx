// src/app/(admin)/quienes-somos/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { QuienesSomosHeader } from '@/components/admin/quienes-somos/QuienesSomosHeader';
import { QuienesSomosForm } from '@/components/admin/quienes-somos/QuienesSomosForm';
import { QuienesSomosPreview } from '@/components/admin/quienes-somos/QuienesSomosPreview';
import { EmpresaInfoForm } from '@/components/admin/quienes-somos/EmpresaInfoForm';
import type { QuienesSomosData } from '@/types/quienes-somos';

export default function AdminQuienesSomosPage() {
  const [data, setData] = useState<QuienesSomosData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/nosotros');
      if (!res.ok) throw new Error('Error al cargar datos');
      const result = await res.json();
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (formData: Partial<QuienesSomosData>) => {
    setSaving(true);
    try {
      const res = await fetch('/api/nosotros', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) throw new Error('Error al guardar');
      
      const updated = await res.json();
      setData(updated);
    } catch (err: any) {
      console.error('Error:', err);
      alert('Error al guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin" size={48} color="#0A3D62" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-red-50 rounded-xl p-6 text-center">
          <p className="text-red-600">Error al cargar los datos</p>
          <button 
            onClick={loadData}
            className="mt-4 px-4 py-2 bg-[#0A3D62] text-white rounded-lg hover:bg-[#0A3D62]/90"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <QuienesSomosHeader />

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Columna izquierda - Formularios */}
        <div className="space-y-8">
          {/* Formulario de Quiénes Somos */}
          <QuienesSomosForm 
            data={data}
            onSave={handleSave}
            saving={saving}
          />

          {/* Formulario de Información de la Empresa */}
          <EmpresaInfoForm />
        </div>

        {/* Columna derecha - Vista previa */}
        <div className="sticky top-24 space-y-8">
          <QuienesSomosPreview data={data} />
        </div>
      </div>
    </div>
  );
}