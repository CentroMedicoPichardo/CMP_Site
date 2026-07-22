"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Calendar,
  Database,
  Download,
  RefreshCw,
  Shield,
  Users,
} from "lucide-react";

import { AuditoriaDetailsModal } from "@/components/admin/monitoreo/auditoria/AuditoriaDetailsModal";
import { AuditoriaExportModal } from "@/components/admin/monitoreo/auditoria/AuditoriaExportModal";
import { AuditoriaFilters } from "@/components/admin/monitoreo/auditoria/AuditoriaFilters";
import { AuditoriaTable } from "@/components/admin/monitoreo/auditoria/AuditoriaTable";
import { MetricsCard } from "@/components/admin/monitoreo/shared/MetricsCard";

interface AuditoriaRegistro {
  id: number;
  usuario: string | null;
  ip_address: string | null;
  accion: string | null;
  tabla_afectada: string | null;
  registro_id: number | null;
  datos_anteriores: unknown;
  datos_nuevos: unknown;
  fecha_hora: string | null;
  aplicacion_origen?: string | null;
  session_id?: string | null;
}

interface AuditoriaFiltros {
  usuario: string;
  tabla: string;
  accion: string;
  fechaInicio: string;
  fechaFin: string;
}

interface AuditoriaEstadisticas {
  total: number;
  usuariosDistintos: number;
  tablasAfectadas: number;
  accionesHoy: number;
}

interface AuditoriaApiResponse {
  registros?: AuditoriaRegistro[];
  stats?: Partial<AuditoriaEstadisticas>;
  error?: string;
}

interface ExportacionConfig {
  fields: string[];
  tabla?: string;
  accion?: string;
  fechaInicio?: string;
  fechaFin?: string;
}

const FILTROS_INICIALES: AuditoriaFiltros = {
  usuario: "",
  tabla: "",
  accion: "",
  fechaInicio: "",
  fechaFin: "",
};

const ESTADISTICAS_INICIALES: AuditoriaEstadisticas = {
  total: 0,
  usuariosDistintos: 0,
  tablasAfectadas: 0,
  accionesHoy: 0,
};

const CAMPOS_EXPORTACION = [
  {
    id: "fecha_hora",
    label: "Fecha y hora",
  },
  {
    id: "usuario",
    label: "Usuario",
  },
  {
    id: "ip_address",
    label: "Dirección IP",
  },
  {
    id: "accion",
    label: "Acción",
  },
  {
    id: "tabla_afectada",
    label: "Tabla afectada",
  },
  {
    id: "registro_id",
    label: "ID del registro",
  },
  {
    id: "datos_anteriores",
    label: "Datos anteriores",
  },
  {
    id: "datos_nuevos",
    label: "Datos nuevos",
  },
];

export default function AuditoriaPage() {
  const [registros, setRegistros] = useState<
    AuditoriaRegistro[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [
    selectedRegistro,
    setSelectedRegistro,
  ] = useState<AuditoriaRegistro | null>(null);

  const [modalOpen, setModalOpen] =
    useState(false);

  const [
    exportModalOpen,
    setExportModalOpen,
  ] = useState(false);

  const [filters, setFilters] =
    useState<AuditoriaFiltros>(
      FILTROS_INICIALES,
    );

  const [stats, setStats] =
    useState<AuditoriaEstadisticas>(
      ESTADISTICAS_INICIALES,
    );

  const cargarRegistros =
    useCallback(async () => {
      setLoading(true);

      try {
        const params =
          new URLSearchParams();

        if (filters.usuario.trim()) {
          params.set(
            "usuario",
            filters.usuario.trim(),
          );
        }

        if (filters.tabla) {
          params.set(
            "tabla",
            filters.tabla,
          );
        }

        if (filters.accion) {
          params.set(
            "accion",
            filters.accion,
          );
        }

        if (filters.fechaInicio) {
          params.set(
            "fecha_inicio",
            filters.fechaInicio,
          );
        }

        if (filters.fechaFin) {
          params.set(
            "fecha_fin",
            filters.fechaFin,
          );
        }

        const query = params.toString();

        const response = await fetch(
          query
            ? `/api/monitoreo/auditoria?${query}`
            : "/api/monitoreo/auditoria",
          {
            method: "GET",
            cache: "no-store",
          },
        );

        const textoRespuesta =
          await response.text();

        let data: AuditoriaApiResponse = {};

        if (textoRespuesta) {
          try {
            data = JSON.parse(
              textoRespuesta,
            ) as AuditoriaApiResponse;
          } catch {
            throw new Error(
              "La respuesta del servidor no tiene un formato válido.",
            );
          }
        }

        if (!response.ok) {
          throw new Error(
            data.error ||
              "No fue posible cargar los registros de auditoría.",
          );
        }

        setRegistros(
          Array.isArray(data.registros)
            ? data.registros
            : [],
        );

        setStats({
          total:
            data.stats?.total ?? 0,
          usuariosDistintos:
            data.stats
              ?.usuariosDistintos ?? 0,
          tablasAfectadas:
            data.stats
              ?.tablasAfectadas ?? 0,
          accionesHoy:
            data.stats?.accionesHoy ?? 0,
        });
      } catch (error: unknown) {
        console.error(
          "Error cargando auditoría:",
          error,
        );

        setRegistros([]);
        setStats(
          ESTADISTICAS_INICIALES,
        );
      } finally {
        setLoading(false);
      }
    }, [filters]);

  useEffect(() => {
    void cargarRegistros();
  }, [cargarRegistros]);

  const handleViewDetails = (
    registro: AuditoriaRegistro,
  ) => {
    setSelectedRegistro(registro);
    setModalOpen(true);
  };

  const cerrarDetalles = () => {
    setModalOpen(false);
    setSelectedRegistro(null);
  };

  const handleExport = async (
    exportConfig: ExportacionConfig,
  ) => {
    const params =
      new URLSearchParams();

    params.set(
      "fields",
      exportConfig.fields.join(","),
    );

    if (exportConfig.tabla) {
      params.set(
        "tabla",
        exportConfig.tabla,
      );
    }

    if (exportConfig.accion) {
      params.set(
        "accion",
        exportConfig.accion,
      );
    }

    if (exportConfig.fechaInicio) {
      params.set(
        "fecha_inicio",
        exportConfig.fechaInicio,
      );
    }

    if (exportConfig.fechaFin) {
      params.set(
        "fecha_fin",
        exportConfig.fechaFin,
      );
    }

    const response = await fetch(
      `/api/monitoreo/auditoria/export?${params.toString()}`,
      {
        method: "GET",
        cache: "no-store",
      },
    );

    if (!response.ok) {
      const textoError =
        await response.text();

      throw new Error(
        textoError ||
          "No fue posible exportar la auditoría.",
      );
    }

    const blob = await response.blob();
    const url =
      window.URL.createObjectURL(blob);

    const enlace =
      document.createElement("a");

    const fecha = new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/:/g, "-");

    enlace.href = url;
    enlace.download =
      `auditoria_${fecha}.csv`;

    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();

    window.URL.revokeObjectURL(url);
  };

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6">
      <header className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="h-1 w-full bg-[#FFC300]" />

        <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0A3D62] text-[#FFC300]">
              <Shield
                size={23}
                aria-hidden="true"
              />
            </span>

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
                Monitoreo del sistema
              </p>

              <h1 className="mt-1 break-words text-xl font-extrabold leading-tight text-[#0A3D62] sm:text-2xl">
                Auditoría del sistema
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                Consulta el historial de cambios
                y acciones realizadas dentro del
                sistema.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                void cargarRegistros();
              }}
              disabled={loading}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#0A3D62] px-5 py-2 text-xs font-extrabold text-white transition-colors hover:bg-[#061C2E] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
            >
              <RefreshCw
                size={16}
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
                aria-hidden="true"
              />

              {loading
                ? "Actualizando..."
                : "Actualizar"}
            </button>

            <button
              type="button"
              onClick={() => {
                setExportModalOpen(true);
              }}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#FFC300] px-5 py-2 text-xs font-extrabold text-[#0A3D62] transition-colors hover:bg-[#EAB308]"
            >
              <Download
                size={16}
                aria-hidden="true"
              />

              Exportar CSV
            </button>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricsCard
          title="Total de registros"
          value={stats.total}
          icon={Database}
          status="good"
        />

        <MetricsCard
          title="Usuarios activos"
          value={
            stats.usuariosDistintos
          }
          icon={Users}
          status="good"
        />

        <MetricsCard
          title="Tablas afectadas"
          value={stats.tablasAfectadas}
          icon={Shield}
          status="good"
        />

        <MetricsCard
          title="Acciones hoy"
          value={stats.accionesHoy}
          icon={Calendar}
          status={
            stats.accionesHoy > 100
              ? "warning"
              : "good"
          }
        />
      </section>

      <AuditoriaFilters
        filters={filters}
        onFiltersChange={setFilters}
      />

      <AuditoriaTable
        registros={registros}
        loading={loading}
        onViewDetails={
          handleViewDetails
        }
      />

      <AuditoriaDetailsModal
        isOpen={modalOpen}
        onClose={cerrarDetalles}
        registro={selectedRegistro}
      />

      <AuditoriaExportModal
        isOpen={exportModalOpen}
        onClose={() => {
          setExportModalOpen(false);
        }}
        onExport={handleExport}
        currentFilters={filters}
        availableFields={
          CAMPOS_EXPORTACION
        }
      />
    </main>
  );
}