// src/types/backups.ts

export type TipoBackup = "completo" | "parcial";

export type EstadoBackup =
  | "procesando"
  | "exitoso"
  | "fallido"
  | "completado";

export interface Backup {
  id: string;
  fecha: string;
  tipo: TipoBackup;
  tamaño: string;
  estado: EstadoBackup;
  disponible: boolean;
}

export interface BackupStats {
  total: number;
  completos: number;
  parciales: number;
  espacioTotal: string;
  ultimoBackup: string | null;
  promedioTamaño: string;
}