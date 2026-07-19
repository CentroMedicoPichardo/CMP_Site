// src/app/(admin)/backups/page.tsx
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

function obtenerNombreDesdeContentDisposition(
  contentDisposition: string | null,
  id: string
) {
  if (!contentDisposition) {
    return `backup-${id}.sql.gz`;
  }

  const coincidencia = contentDisposition.match(
    /filename="?([^";]+)"?/i
  );

  return (
    coincidencia?.[1]?.trim() ||
    `backup-${id}.sql.gz`
  );
}

function calcularEstadisticas(
  listaBackups: Backup[]
): BackupStatsType {
  const completos = listaBackups.filter(
    (backup) => backup.tipo === "completo"
  ).length;

  const parciales = listaBackups.filter(
    (backup) => backup.tipo === "parcial"
  ).length;

  const totalSizeKB = listaBackups.reduce(
    (acumulado, backup) => {
      const tamaño = Number.parseFloat(backup.tamaño);

      return acumulado +
        (Number.isFinite(tamaño) ? tamaño : 0);
    },
    0
  );

  return {
    total: listaBackups.length,
    completos,
    parciales,
    espacioTotal: `${totalSizeKB.toFixed(2)} KB`,
    ultimoBackup:
      listaBackups[0]?.fecha ?? null,
    promedioTamaño:
      listaBackups.length > 0
        ? `${(
            totalSizeKB / listaBackups.length
          ).toFixed(2)} KB`
        : "0 KB",
  };
}

export default function AdminBackupsPage() {
  const [backups, setBackups] = useState<Backup[]>(
    []
  );

  const [stats, setStats] =
    useState<BackupStatsType>({
      total: 0,
      completos: 0,
      parciales: 0,
      espacioTotal: "0 KB",
      ultimoBackup: null,
      promedioTamaño: "0 KB",
    });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] =
    useState(false);
  const [generating, setGenerating] =
    useState(false);

  const [error, setError] = useState<
    string | null
  >(null);

  const [ultimaActualizacion, setUltimaActualizacion] =
    useState<Date | null>(null);

  const loadBackups = useCallback(
    async (mostrarCargaInicial = false) => {
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
          }
        );

        const data = (await response
          .json()
          .catch(() => null)) as
          | {
              backups?: Backup[];
              error?: string;
              detail?: string;
            }
          | null;

        if (!response.ok) {
          throw new Error(
            data?.detail ||
              data?.error ||
              "No se pudieron obtener los respaldos"
          );
        }

        const listaBackups = Array.isArray(
          data?.backups
        )
          ? data.backups
          : [];

        setBackups(listaBackups);
        setStats(
          calcularEstadisticas(listaBackups)
        );
        setUltimaActualizacion(new Date());
      } catch (errorDesconocido) {
        console.error(
          "[BACKUP][FRONTEND] Error cargando respaldos:",
          errorDesconocido
        );

        setError(
          errorDesconocido instanceof Error
            ? errorDesconocido.message
            : "No se pudieron cargar los respaldos"
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    void loadBackups(true);
  }, [loadBackups]);

  const descargarBackupPorId = async (
    id: string
  ) => {
    console.log(
      "[BACKUP][FRONTEND] Descargando respaldo",
      {
        id,
      }
    );

    const response = await fetch(
      `/api/backups/${id}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const data = (await response
        .json()
        .catch(() => null)) as
        | RespuestaError
        | null;

      throw new Error(
        data?.detail ||
          data?.error ||
          "No se pudo descargar el respaldo"
      );
    }

    const blob = await response.blob();

    if (blob.size === 0) {
      throw new Error(
        "El archivo descargado está vacío"
      );
    }

    const nombreArchivo =
      obtenerNombreDesdeContentDisposition(
        response.headers.get(
          "Content-Disposition"
        ),
        id
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
      window.URL.revokeObjectURL(urlTemporal);
    }, 1_000);

    console.log(
      "[BACKUP][FRONTEND] Descarga terminada",
      {
        id,
        nombreArchivo,
        tamañoBytes: blob.size,
      }
    );
  };

  const handleGenerateBackup = async (
    tipo: TipoBackup
  ) => {
    setGenerating(true);
    setError(null);

    try {
      console.log(
        "[BACKUP][FRONTEND] Solicitando generación",
        {
          tipo,
        }
      );

      const response = await fetch(
        "/api/backups",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
          body: JSON.stringify({
            tipo,
          }),
        }
      );

      const data = (await response
        .json()
        .catch(() => null)) as
        | RespuestaGenerarBackup
        | null;

      console.log(
        "[BACKUP][FRONTEND] Respuesta de generación",
        {
          status: response.status,
          data,
        }
      );

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            data?.error ||
            "No se pudo generar el respaldo"
        );
      }

      const backupId = data?.backup?.id;

      if (
        typeof backupId !== "string" &&
        typeof backupId !== "number"
      ) {
        throw new Error(
          "La API no devolvió el ID del respaldo generado"
        );
      }

      await loadBackups();

      await descargarBackupPorId(
        String(backupId)
      );

      console.log(
        "[BACKUP][FRONTEND] Respaldo generado correctamente",
        {
          id: backupId,
          resumen: data?.resumen,
        }
      );
    } catch (errorDesconocido) {
      console.error(
        "[BACKUP][FRONTEND] Error generando respaldo:",
        errorDesconocido
      );

      setError(
        errorDesconocido instanceof Error
          ? errorDesconocido.message
          : "Error al generar el respaldo"
      );
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteBackup = async (
    id: string
  ) => {
    const confirmado = window.confirm(
      "¿Estás seguro de eliminar este respaldo? Esta acción no se puede deshacer."
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
        }
      );

      const data = (await response
        .json()
        .catch(() => null)) as
        | RespuestaError
        | null;

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            data?.error ||
            "No se pudo eliminar el respaldo"
        );
      }

      await loadBackups();
    } catch (errorDesconocido) {
      console.error(
        "[BACKUP][FRONTEND] Error eliminando respaldo:",
        errorDesconocido
      );

      setError(
        errorDesconocido instanceof Error
          ? errorDesconocido.message
          : "Error al eliminar el respaldo"
      );
    }
  };

  const handleDownloadBackup = async (
    id: string
  ) => {
    setError(null);

    try {
      const respaldo = backups.find(
        (backup) => backup.id === id
      );

      if (
        respaldo &&
        !respaldo.disponible
      ) {
        throw new Error(
          "Este respaldo pertenece al sistema anterior y su archivo no está disponible."
        );
      }

      await descargarBackupPorId(id);
    } catch (errorDesconocido) {
      console.error(
        "[BACKUP][FRONTEND] Error descargando respaldo:",
        errorDesconocido
      );

      setError(
        errorDesconocido instanceof Error
          ? errorDesconocido.message
          : "Error al descargar el respaldo"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 bg-gradient-to-b from-slate-50 to-white">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg">
          <Loader2
            className="animate-spin text-[#0A3D62]"
            size={42}
          />
        </div>

        <div className="text-center">
          <p className="font-semibold text-slate-700">
            Cargando respaldos
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Consultando el historial del sistema
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-amber-50/40">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        <BackupsHeader />

        <section className="mb-6 mt-6 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm backdrop-blur sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#0A3D62]">
                Resumen de respaldos
              </h2>

              <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                <Clock3 size={15} />

                <span>
                  {ultimaActualizacion
                    ? `Actualizado a las ${ultimaActualizacion.toLocaleTimeString(
                        "es-MX",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}`
                    : "Sin actualizar"}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setError(null);
                void loadBackups();
              }}
              disabled={
                refreshing || generating
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#0A3D62]/20 bg-white px-4 py-2.5 text-sm font-semibold text-[#0A3D62] shadow-sm transition hover:border-[#0A3D62]/40 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />

              {refreshing
                ? "Actualizando..."
                : "Actualizar historial"}
            </button>
          </div>
        </section>

        {error && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 shadow-sm"
          >
            <div className="mt-0.5 rounded-full bg-red-100 p-2">
              <AlertCircle size={18} />
            </div>

            <div>
              <p className="font-semibold">
                Ocurrió un problema
              </p>

              <p className="mt-1 text-sm text-red-600">
                {error}
              </p>
            </div>
          </div>
        )}

        <section className="mb-8">
          <BackupStats stats={stats} />
        </section>

        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_380px] xl:gap-8">
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

          <aside className="xl:sticky xl:top-24">
            <BackupGenerator
              onGenerate={
                handleGenerateBackup
              }
              generating={generating}
            />
          </aside>
        </div>

        <footer className="mt-8 rounded-2xl border border-slate-200 bg-white/80 px-5 py-4 text-center text-sm text-slate-500 shadow-sm">
          Los respaldos permanecen almacenados
          hasta que sean eliminados manualmente.
        </footer>
      </div>
    </div>
  );
}