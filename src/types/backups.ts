// src/types/backups.ts
export interface Backup {
  id: string;
  fecha: string;
  tipo: 'completo' | 'parcial';
  tamaño: string;
  estado: 'exitoso' | 'fallido';
}

export interface BackupStats {
  total: number;
  completos: number;
  parciales: number;
  espacioTotal: string;
  ultimoBackup: string | null;
  promedioTamaño: string;
}