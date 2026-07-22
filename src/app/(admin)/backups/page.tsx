"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  AlertCircle,
  Clock3,
  Loader2,
  RefreshCw,
} from "lucide-react";

import { BackupsHeader } from "@/components/admin/backups/BackupsHeader";
import { BackupStats } from "@/components/admin/backups/BackupStats";
import { BackupTable } from "@/components/admin/backups/BackupTable";
import { BackupGenerator } from "@/components/admin/backups/BackupGenerator";

import type {
  Backup,
  BackupStats as BackupStatsType,
  TipoBackup,
} from "@/types/backups";

interface RespuestaError {
  error?: string;
  detail?: string;
}

interface RespuestaListaBackups {
  backups?: Backup[];
  error?: string;
  detail?: string;
}

interface RespuestaGenerarBackup {
  success?: boolean;
  message?: string;

  backup?: {
    id?: string | number;
    nombreArchivo?: string;
  };

  resumen?: {
    totalTablas?: number;
    totalRegistros?: number;
    tamañoOriginalBytes?: number;
    tamañoComprimidoBytes?: number;
  };

  error?: string;
  detail?: string;
}

const ESTADISTICAS_INICIALES: BackupStatsType = {
  total: 0,
  completos: 0,
  parciales: 0,
  espacioTotal: "0 KB",
  ultimoBackup: null,
  promedioTamaño: "0 KB",
};

function obtenerNombreDesdeContentDisposition(
  contentDisposition: string | null,
  id: string,
): string {
  if (!contentDisposition) {
    return `backup-${id}.sql.gz`;
  }

  const coincidencia = contentDisposition.match(
    /filename="?([^";]+)"?/i,
  );

  return (
    coincidencia?.[1]?.trim() ||
    `backup-${id}.sql.gz`
  );
}

function obtenerTamañoNumerico(
  tamaño: string,
): number {
  const valor = Number.parseFloat(tamaño);

  return Number.isFinite(valor)
    ? valor
    : 0;
}

function calcularEstadisticas(
  listaBackups: Backup[],
): BackupStatsType {
  const completos = listaBackups.filter(
    (backup) =>
      backup.tipo === "completo",
  ).length;

  const parciales = listaBackups.filter(
    (backup) =>
      backup.tipo === "parcial",
  ).length;

  const totalSizeKB = listaBackups.reduce(
    (acumulado, backup) =>
      acumulado +
      obtenerTamañoNumerico(
        backup.tamaño,
      ),
    0,
  );

  return {
    total: listaBackups.length,
    completos,
    parciales,
    espacioTotal: `${totalSizeKB.toFixed(
      2,
    )} KB`,
    ultimoBackup:
      listaBackups[0]?.fecha ?? null,
    promedioTamaño:
      listaBackups.length > 0
        ? `${(
            totalSizeKB /
            listaBackups.length
          ).toFixed(2)} KB`
        : "0 KB",
  };
}

function formatearUltimaActualizacion(
  fecha: Date | null,
): string {
  if (!fecha) {
    return "Sin actualizar";
  }

  return `Actualizado a las ${fecha.toLocaleTimeString(
    "es-MX",
    {
      hour: "2-digit",
      minute: "2-digit",
    },
  )}`;
}

export default function AdminBackupsPage() {
  const [backups, setBackups] =
    useState<Backup[]>([]);

  const [stats, setStats] =
    useState<BackupStatsType>(
      ESTADISTICAS_INICIALES,
    );

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [generating, setGenerating] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [
    ultimaActualizacion,
    setUltimaActualizacion,
  ] = useState<Date | null>(null);

  const loadBackups = useCallback(
    async (
      mostrarCargaInicial = false,
    ) => {
      if (mostrarCargaInicial) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      try {
        const response = await fetch(
          "/api/backups",
          {
            method: "GET",
            cache: "no-store",
          },
        );

        const textoRespuesta =
          await response.text();

        let data:
          | RespuestaListaBackups
          | null = null;

        if (textoRespuesta) {
          try {
            data = JSON.parse(
              textoRespuesta,
            ) as RespuestaListaBackups;
          } catch {
            data = null;
          }
        }

        if (!response.ok) {
          throw new Error(
            data?.detail ||
              data?.error ||
              "No se pudieron obtener los respaldos",
          );
        }

        const listaBackups =
          Array.isArray(data?.backups)
            ? data.backups
            : [];

        setBackups(listaBackups);

        setStats(
          calcularEstadisticas(
            listaBackups,
          ),
        );

        setUltimaActualizacion(
          new Date(),
        );
      } catch (
        errorDesconocido: unknown
      ) {
        console.error(
          "[BACKUP][FRONTEND] Error cargando respaldos:",
          errorDesconocido,
        );

        setError(
          errorDesconocido instanceof Error
            ? errorDesconocido.message
            : "No se pudieron cargar los respaldos",
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    void loadBackups(true);
  }, [loadBackups]);

  const descargarBackupPorId = async (
    id: string,
  ) => {
    const response = await fetch(
      `/api/backups/${id}`,
      {
        method: "GET",
        cache: "no-store",
      },
    );

    if (!response.ok) {
      const textoRespuesta =
        await response.text();

      let data:
        | RespuestaError
        | null = null;

      if (textoRespuesta) {
        try {
          data = JSON.parse(
            textoRespuesta,
          ) as RespuestaError;
        } catch {
          data = null;
        }
      }

      throw new Error(
        data?.detail ||
          data?.error ||
          "No se pudo descargar el respaldo",
      );
    }

    const blob = await response.blob();

    if (blob.size === 0) {
      throw new Error(
        "El archivo descargado está vacío",
      );
    }

    const nombreArchivo =
      obtenerNombreDesdeContentDisposition(
        response.headers.get(
          "Content-Disposition",
        ),
        id,
      );

    const urlTemporal =
      window.URL.createObjectURL(blob);

    const enlace =
      document.createElement("a");

    enlace.href = urlTemporal;
    enlace.download = nombreArchivo;

    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();

    window.setTimeout(() => {
      window.URL.revokeObjectURL(
        urlTemporal,
      );
    }, 1_000);
  };

  const handleGenerateBackup = async (
    tipo: TipoBackup,
  ) => {
    setGenerating(true);
    setError(null);

    try {
      const response = await fetch(
        "/api/backups",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          cache: "no-store",
          body: JSON.stringify({
            tipo,
          }),
        },
      );

      const textoRespuesta =
        await response.text();

      let data:
        | RespuestaGenerarBackup
        | null = null;

      if (textoRespuesta) {
        try {
          data = JSON.parse(
            textoRespuesta,
          ) as RespuestaGenerarBackup;
        } catch {
          data = null;
        }
      }

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            data?.error ||
            "No se pudo generar el respaldo",
        );
      }

      const backupId =
        data?.backup?.id;

      if (
        typeof backupId !== "string" &&
        typeof backupId !== "number"
      ) {
        throw new Error(
          "La API no devolvió el ID del respaldo generado",
        );
      }

      await loadBackups();

      await descargarBackupPorId(
        String(backupId),
      );
    } catch (
      errorDesconocido: unknown
    ) {
      console.error(
        "[BACKUP][FRONTEND] Error generando respaldo:",
        errorDesconocido,
      );

      setError(
        errorDesconocido instanceof Error
          ? errorDesconocido.message
          : "Error al generar el respaldo",
      );
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteBackup = async (
    id: string,
  ) => {
    const confirmado =
      window.confirm(
        "¿Estás seguro de eliminar este respaldo? Esta acción no se puede deshacer.",
      );

    if (!confirmado) {
      return;
    }

    setError(null);

    try {
      const response = await fetch(
        `/api/backups/${id}`,
        {
          method: "DELETE",
          cache: "no-store",
        },
      );

      const textoRespuesta =
        await response.text();

      let data:
        | RespuestaError
        | null = null;

      if (textoRespuesta) {
        try {
          data = JSON.parse(
            textoRespuesta,
          ) as RespuestaError;
        } catch {
          data = null;
        }
      }

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            data?.error ||
            "No se pudo eliminar el respaldo",
        );
      }

      await loadBackups();
    } catch (
      errorDesconocido: unknown
    ) {
      console.error(
        "[BACKUP][FRONTEND] Error eliminando respaldo:",
        errorDesconocido,
      );

      setError(
        errorDesconocido instanceof Error
          ? errorDesconocido.message
          : "Error al eliminar el respaldo",
      );
    }
  };

  const handleDownloadBackup = async (
    id: string,
  ) => {
    setError(null);

    try {
      const respaldo = backups.find(
        (backup) =>
          backup.id === id,
      );

      if (
        respaldo &&
        !respaldo.disponible
      ) {
        throw new Error(
          "Este respaldo pertenece al sistema anterior y su archivo no está disponible.",
        );
      }

      await descargarBackupPorId(id);
    } catch (
      errorDesconocido: unknown
    ) {
      console.error(
        "[BACKUP][FRONTEND] Error descargando respaldo:",
        errorDesconocido,
      );

      setError(
        errorDesconocido instanceof Error
          ? errorDesconocido.message
          : "Error al descargar el respaldo",
      );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-sm">
            <Loader2
              size={30}
              className="animate-spin text-[#0A3D62]"
              aria-hidden="true"
            />
          </span>

          <div>
            <p className="text-sm font-extrabold text-[#0A3D62]">
              Cargando respaldos
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Consultando el historial
              del sistema
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7FAFC]">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        <BackupsHeader />

        <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EAF2F8] text-[#0A3D62]">
              <Clock3
                size={17}
                aria-hidden="true"
              />
            </span>

            <div className="min-w-0">
              <p className="text-xs font-extrabold text-[#0A3D62]">
                Estado del historial
              </p>

              <p className="mt-0.5 text-[11px] leading-4 text-gray-500">
                {formatearUltimaActualizacion(
                  ultimaActualizacion,
                )}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setError(null);
              void loadBackups();
            }}
            disabled={
              refreshing ||
              generating
            }
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[#0A3D62]/20 bg-white px-4 py-2 text-xs font-extrabold text-[#0A3D62] transition-colors hover:border-[#0A3D62]/40 hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={15}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
              aria-hidden="true"
            />

            {refreshing
              ? "Actualizando..."
              : "Actualizar historial"}
          </button>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 shadow-sm"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-red-700">
              <AlertCircle
                size={17}
                aria-hidden="true"
              />
            </span>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-extrabold">
                Ocurrió un problema
              </p>

              <p className="mt-1 break-words text-xs leading-5 text-red-600">
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setError(null)
              }
              className="shrink-0 text-xs font-extrabold underline underline-offset-2"
            >
              Cerrar
            </button>
          </div>
        )}

        <BackupStats stats={stats} />

        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <main className="min-w-0">
            <BackupTable
              backups={backups}
              onDownload={
                handleDownloadBackup
              }
              onDelete={
                handleDeleteBackup
              }
            />
          </main>

          <aside className="min-w-0 xl:sticky xl:top-24">
            <BackupGenerator
              onGenerate={
                handleGenerateBackup
              }
              generating={generating}
            />
          </aside>
        </div>

        <footer className="mt-6 rounded-xl border border-gray-200 bg-white px-4 py-3 text-center text-[11px] leading-5 text-gray-500 shadow-sm">
          Los respaldos permanecen almacenados
          hasta que sean eliminados manualmente.
        </footer>
      </div>
    </div>
  );
}