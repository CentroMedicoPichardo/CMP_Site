// src/app/(admin)/backups/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

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

  return coincidencia?.[1]?.trim() || `backup-${id}.sql.gz`;
}

export default function AdminBackupsPage() {
  const [backups, setBackups] = useState<Backup[]>([]);

  const [stats, setStats] = useState<BackupStatsType>({
    total: 0,
    completos: 0,
    parciales: 0,
    espacioTotal: "0 KB",
    ultimoBackup: null,
    promedioTamaño: "0 KB",
  });

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calcularEstadisticas = (listaBackups: Backup[]) => {
    const completos = listaBackups.filter(
      (backup) => backup.tipo === "completo"
    ).length;

    const parciales = listaBackups.filter(
      (backup) => backup.tipo === "parcial"
    ).length;

    /*
     * Actualmente el backend devuelve los tamaños en KB.
     * Ejemplo: "654.44 KB".
     */
    const totalSizeKB = listaBackups.reduce(
      (acumulado, backup) => {
        const tamaño = Number.parseFloat(backup.tamaño);

        return acumulado + (Number.isFinite(tamaño) ? tamaño : 0);
      },
      0
    );

    setStats({
      total: listaBackups.length,
      completos,
      parciales,
      espacioTotal: `${totalSizeKB.toFixed(2)} KB`,
      ultimoBackup: listaBackups[0]?.fecha ?? null,
      promedioTamaño:
        listaBackups.length > 0
          ? `${(totalSizeKB / listaBackups.length).toFixed(2)} KB`
          : "0 KB",
    });
  };

  const loadBackups = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/backups", {
        method: "GET",
        cache: "no-store",
      });

      const data = (await response.json().catch(() => null)) as
        | {
            backups?: Backup[];
            error?: string;
          }
        | null;

      if (!response.ok) {
        throw new Error(
          data?.error || "No se pudieron obtener los respaldos"
        );
      }

      const listaBackups = Array.isArray(data?.backups)
        ? data.backups
        : [];

      setBackups(listaBackups);
      calcularEstadisticas(listaBackups);
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
    }
  };

  useEffect(() => {
    void loadBackups();
  }, []);

  const descargarBackupPorId = async (id: string) => {
    console.log("[BACKUP][FRONTEND] Descargando respaldo", {
      id,
    });

    const response = await fetch(`/api/backups/${id}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as
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
      throw new Error("El archivo descargado está vacío");
    }

    const nombreArchivo = obtenerNombreDesdeContentDisposition(
      response.headers.get("Content-Disposition"),
      id
    );

    const urlTemporal = window.URL.createObjectURL(blob);
    const enlace = document.createElement("a");

    enlace.href = urlTemporal;
    enlace.download = nombreArchivo;

    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();

    /*
     * Se espera un momento antes de liberar la URL para
     * evitar interrumpir la descarga en algunos navegadores.
     */
    window.setTimeout(() => {
      window.URL.revokeObjectURL(urlTemporal);
    }, 1_000);

    console.log("[BACKUP][FRONTEND] Descarga terminada", {
      id,
      nombreArchivo,
      tamañoBytes: blob.size,
    });
  };

  const handleGenerateBackup = async (tipo: TipoBackup) => {
    setGenerating(true);
    setError(null);

    try {
      console.log(
        "[BACKUP][FRONTEND] Solicitando generación",
        {
          tipo,
        }
      );

      const response = await fetch("/api/backups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({
          tipo,
        }),
      });

      const data =
        (await response.json().catch(() => null)) as
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

      /*
       * Actualiza el historial para mostrar inmediatamente
       * el nuevo registro.
       */
      await loadBackups();

      /*
       * Descarga automáticamente una copia al equipo.
       */
      await descargarBackupPorId(String(backupId));

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

  const handleDeleteBackup = async (id: string) => {
    const confirmado = window.confirm(
      "¿Estás seguro de eliminar este respaldo? Esta acción no se puede deshacer."
    );

    if (!confirmado) {
      return;
    }

    setError(null);

    try {
      const response = await fetch(`/api/backups/${id}`, {
        method: "DELETE",
        cache: "no-store",
      });

      const data = (await response.json().catch(() => null)) as
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

  const handleDownloadBackup = async (id: string) => {
    setError(null);

    try {
      const respaldo = backups.find(
        (backup) => backup.id === id
      );

      if (respaldo && !respaldo.disponible) {
        throw new Error(
          "Este respaldo pertenece al sistema anterior y su archivo ya no está disponible."
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
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2
          className="animate-spin"
          size={48}
          color="#0A3D62"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-6">
      <BackupsHeader />

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}

      <BackupStats stats={stats} />

      <div className="mb-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <BackupTable
            backups={backups}
            onDownload={handleDownloadBackup}
            onDelete={handleDeleteBackup}
          />
        </div>

        <div>
          <BackupGenerator
            onGenerate={handleGenerateBackup}
            generating={generating}
          />
        </div>
      </div>
    </div>
  );
}