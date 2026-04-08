// src/types/saber-pediatrico.ts
export type TipoContenido = 'articulo' | 'video' | 'documento' | 'encuesta';

export interface ContenidoSaberPediatrico {
  id: number;
  tipo: TipoContenido;
  titulo: string;
  descripcion: string | null;
  contenido: string | null;
  urlExterno: string | null;
  imagenUrl: string | null;
  videoUrl: string | null;
  archivoUrl: string | null;
  categoria: string | null;
  etiquetas: string[] | null;
  duracion: string | null;
  fechaPublicacion: string;
  destacado: boolean;
  orden: number;
  activo: boolean;
  visualizaciones: number;
  createdAt: string;
  updatedAt: string;
}

export interface Encuesta {
  id: number;
  contenidoId: number;
  preguntas: any;
  fechaInicio: string;
  fechaFin: string;
  totalParticipantes: number;
  activo: boolean;
}

export interface RespuestaEncuesta {
  id: number;
  encuestaId: number;
  usuarioId: number;
  respuestas: any;
  fechaRespuesta: string;
}