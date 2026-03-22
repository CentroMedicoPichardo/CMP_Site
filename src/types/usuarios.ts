// src/types/usuarios.ts
export interface Usuario {
  id: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string | null;
  correo: string;
  telefono: string;
  rolId: number;
  rolNombre: string;
  activo: boolean;
}

export interface Rol {
  id: number;
  nombre: string;
}