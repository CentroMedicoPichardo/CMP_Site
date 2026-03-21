// src/types/servicios.ts
export interface Servicio {
  idServicio: number;
  tituloServicio: string;
  descripcion: string | null;
  ubicacion: string | null;
  urlImage: string | null;
  textoAlt: string | null;
  disenoTipo: string | null;
  activo: boolean;
  // Propiedades computadas para la UI
  imagenSrc?: string;
}

export interface ServicioFormData {
  idServicio?: number;
  tituloServicio: string;
  descripcion: string;
  ubicacion: string;
  urlImage: string;
  textoAlt: string;
  disenoTipo: string;
  activo: boolean;
}