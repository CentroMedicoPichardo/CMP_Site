// src/types/help.ts

export interface CategoriaAyuda {
  idCategoria: number;
  nombreCategoria: string;
  descripcion: string | null;
  icono: string | null;
  orden: number;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PreguntaFrecuente {
  idPregunta: number;
  idCategoria: number;
  pregunta: string;
  respuesta: string;
  orden: number;
  vecesUtil: number;
  vecesNoUtil: number;
  activo: boolean;
  esDestacada: boolean;
  tags: string[] | null;
  createdAt: string;
  updatedAt: string;
  creadoPor: number | null;
  // Relaciones
  categoria?: CategoriaAyuda;
  creador?: {
    id: number;
    nombre: string;
    apellidoPaterno: string;
  };
}

export interface PreguntaUsuario {
  idPregunta: number;
  idUsuario: number;
  idCategoria: number | null;
  titulo: string;
  descripcion: string;
  estado: 'pendiente' | 'respondida' | 'cerrada' | 'convertida_faq';
  prioridad: 'baja' | 'normal' | 'alta' | 'urgente';
  esPrivada: boolean;
  idPreguntaFAQ: number | null;
  createdAt: string;
  updatedAt: string;
  // Relaciones
  usuario?: {
    id: number;
    nombre: string;
    apellidoPaterno: string;
    correo: string;
  };
  respuestas?: RespuestaAyuda[];
  categoria?: CategoriaAyuda;
}

export interface RespuestaAyuda {
  idRespuesta: number;
  idPregunta: number;
  idUsuario: number;
  contenido: string;
  esRespuestaAdmin: boolean;
  esSolucion: boolean;
  createdAt: string;
  // Relaciones
  usuario?: {
    id: number;
    nombre: string;
    apellidoPaterno: string;
  };
}

export interface ValoracionFAQ {
  idValoracion: number;
  idPreguntaFAQ: number;
  idUsuario: number;
  esUtil: boolean;
  comentario: string | null;
  createdAt: string;
}

export interface CrearPreguntaUsuarioDTO {
  idCategoria?: number;
  titulo: string;
  descripcion: string;
  prioridad?: 'baja' | 'normal' | 'alta' | 'urgente';
  esPrivada?: boolean;
}

export interface CrearRespuestaDTO {
  contenido: string;
  esSolucion?: boolean;
}

export interface ActualizarPreguntaDTO {
  titulo?: string;
  descripcion?: string;
  idCategoria?: number;
  prioridad?: 'baja' | 'normal' | 'alta' | 'urgente';
  estado?: 'pendiente' | 'respondida' | 'cerrada' | 'convertida_faq';
  esPrivada?: boolean;
}