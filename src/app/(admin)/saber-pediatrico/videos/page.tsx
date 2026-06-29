// src/app/(admin)/saber-pediatrico/videos/page.tsx
"use client";

import { useState } from "react";
import useSWR from "swr";
import { Loader2 } from "lucide-react";

import { ContenidoHeader } from "@/components/admin/saber-pediatrico/shared/ContenidoHeader";
import { ContenidoFilters } from "@/components/admin/saber-pediatrico/shared/ContenidoFilters";
import { ContenidoGrid } from "@/components/admin/saber-pediatrico/shared/ContenidoGrid";
import { ContenidoFormModal } from "@/components/admin/saber-pediatrico/shared/ContenidoFormModal";

import { SaberPediatricoHeader } from "@/components/public/saber-pediatrico/SaberPediatricoHeader";
import { FiltrosCategoria } from "@/components/public/saber-pediatrico/FiltrosCategoria";
import { SeccionVideos } from "@/components/public/saber-pediatrico/SeccionVideos";

type TipoContenido = "todos" | "articulos" | "videos" | "documentos" | "encuestas";

const ADMIN_API_URL = "/api/saber-pediatrico?tipo=video&admin=true";
const PUBLIC_API_URL = "/api/saber-pediatrico?tipo=video&activo=true";

const fetcher = async (url: string) => {
  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Error al cargar información");
  }

  return res.json();
};

const authFetcher = async (url: string) => {
  try {
    const res = await fetch(url, {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });

    if (!res.ok) {
      return { loggedIn: false, usuario: null };
    }

    return res.json();
  } catch {
    return { loggedIn: false, usuario: null };
  }
};

function obtenerItems(data: any) {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  return [];
}

function obtenerRol(authData: any) {
  return (
    authData?.usuario?.rol ||
    authData?.user?.rol ||
    authData?.usuario?.role ||
    authData?.user?.role ||
    null
  );
}

function VistaPublicaVideos({
  videos,
  loading,
}: {
  videos: any[];
  loading: boolean;
}) {
  const [activeTab, setActiveTab] = useState<TipoContenido>("videos");

  const tabs: { id: TipoContenido; label: string; count: number }[] = [
    {
      id: "videos",
      label: "Videos",
      count: videos.length,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin" size={48} color="#0A3D62" />
      </div>
    );
  }

  return (
    <main className="bg-white min-h-screen">
      <SaberPediatricoHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <FiltrosCategoria
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tabs={tabs}
        />

        <SeccionVideos videos={videos} />
      </div>
    </main>
  );
}

export default function VideosPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActivo, setFilterActivo] = useState<boolean | "todos">("todos");
  const [saving, setSaving] = useState(false);

  const { data: authData, isLoading: authLoading } = useSWR(
    "/api/auth/verificar",
    authFetcher,
    {
      shouldRetryOnError: false,
    }
  );

  const rol = obtenerRol(authData);
  const isAdmin = authData?.loggedIn === true && rol === "admin";
  const authReady = !authLoading;

  const apiUrl = authReady
    ? isAdmin
      ? ADMIN_API_URL
      : PUBLIC_API_URL
    : null;

  const { data, error, isLoading, mutate } = useSWR(apiUrl, fetcher, {
    shouldRetryOnError: false,
  });

  const items = obtenerItems(data);

  if (!authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin" size={48} color="#0A3D62" />
      </div>
    );
  }

  if (!isAdmin) {
    return <VistaPublicaVideos videos={items} loading={isLoading} />;
  }

  const filteredItems = items.filter((item: any) => {
    if (
      searchTerm &&
      !String(item.titulo || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    if (filterActivo !== "todos" && item.activo !== filterActivo) {
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
        : "/api/saber-pediatrico";

      const method = selectedItem ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, tipo: "video" }),
      });

      if (!res.ok) {
        throw new Error("Error al guardar");
      }

      await mutate();
      setModalOpen(false);
    } catch (error) {
      console.error("Error al guardar video:", error);
      alert("Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActivo = async (id: number, activo: boolean) => {
    const item = items.find((i: any) => i.id === id);

    if (!item) {
      return;
    }

    try {
      const res = await fetch(`/api/saber-pediatrico/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...item, activo: !activo }),
      });

      if (!res.ok) {
        throw new Error("Error al actualizar");
      }

      await mutate();
    } catch (error) {
      console.error("Error al actualizar video:", error);
      alert("Error al actualizar");
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-600">Error al cargar los videos.</p>
      </div>
    );
  }

  return (
    <>
      <ContenidoHeader
        title="Videos"
        description="Videos educativos de YouTube"
        totalItems={filteredItems.length}
        onCreateClick={handleCreate}
        buttonText="Nuevo Video"
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
        tipo="video"
        saving={saving}
      />
    </>
  );
}