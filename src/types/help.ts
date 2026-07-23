export const ESTADOS_PREGUNTA = [
  "pendiente",
  "respondida",
  "cerrada",
  "convertida_faq",
] as const;

export const PRIORIDADES_PREGUNTA = [
  "baja",
  "normal",
  "alta",
  "urgente",
] as const;

export type EstadoPregunta =
  (typeof ESTADOS_PREGUNTA)[number];

export type PrioridadPregunta =
  (typeof PRIORIDADES_PREGUNTA)[number];

export type OrdenPreguntasAdmin =
  | "prioridad"
  | "recientes"
  | "antiguas"
  | "actividad";

export interface CategoriaAyuda {
  idCategoria: number;
  nombreCategoria: string;
  descripcion: string | null;
  icono: string | null;
  orden: number;
  activo: boolean;
  createdAt: string | null;
  updatedAt: string | null;
  totalFaqs?: number;
  totalPreguntas?: number;
}

export interface UsuarioAyudaResumen {
  id: number;
  nombre: string;
  apellidoPaterno: string;
  correo?: string;
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
  createdAt: string | null;
  updatedAt: string | null;
  creadoPor: number | null;
  valoracionUsuario?: boolean | null;
  categoria?: Pick<CategoriaAyuda, "idCategoria" | "nombreCategoria" | "icono"> | null;
  creador?: UsuarioAyudaResumen | null;
}

export interface PreguntaUsuario {
  idPregunta: number;
  idUsuario: number;
  idCategoria: number | null;
  titulo: string;
  descripcion: string;
  estado: EstadoPregunta;
  prioridad: PrioridadPregunta;
  esPrivada: boolean;
  idPreguntaFaq: number | null;
  createdAt: string | null;
  updatedAt: string | null;
  usuario?: UsuarioAyudaResumen | null;
  respuestas?: RespuestaAyuda[];
  categoria?: Pick<CategoriaAyuda, "idCategoria" | "nombreCategoria"> | null;
}

export interface RespuestaAyuda {
  idRespuesta: number;
  idPregunta: number;
  idUsuario: number;
  contenido: string;
  esRespuestaAdmin: boolean;
  esSolucion: boolean;
  createdAt: string | null;
  usuario?: Omit<UsuarioAyudaResumen, "correo"> | null;
}

export interface ValoracionFAQ {
  idValoracion: number;
  idPreguntaFAQ: number;
  idUsuario: number;
  esUtil: boolean;
  comentario: string | null;
  createdAt: string | null;
}

export interface CrearPreguntaUsuarioDTO {
  idCategoria?: number | null;
  titulo: string;
  descripcion: string;
  prioridad?: PrioridadPregunta;
  esPrivada?: boolean;
}

export interface CrearRespuestaDTO {
  contenido: string;
  esSolucion?: boolean;
}

export interface ActualizarPreguntaDTO {
  idCategoria?: number | null;
  prioridad?: PrioridadPregunta;
  estado?: EstadoPregunta;
  esPrivada?: boolean;
}

export interface ResumenSoporteCliente {
  total: number;
  pendientes: number;
  atendidas: number;
  cerradas: number;
  ultimaAtendida: {
    idPregunta: number;
    titulo: string;
    estado: EstadoPregunta;
    updatedAt: string | null;
    createdAt: string | null;
  } | null;
}

export interface ResumenSoporteAdmin {
  total: number;
  pendientes: number;
  respondidas: number;
  cerradas: number;
  urgentes: number;
}

export interface PaginacionSoporte {
  pagina: number;
  limite: number;
  total: number;
  totalPaginas: number;
}

export interface PreguntasAdminResponse {
  preguntas: PreguntaUsuario[];
  resumen: ResumenSoporteAdmin;
  orden?: OrdenPreguntasAdmin;
  paginacion: PaginacionSoporte;
}

export interface PreguntaAdminDetalleResponse {
  pregunta: PreguntaUsuario;
  respuestas: RespuestaAyuda[];
  categorias: CategoriaAyuda[];
}

export interface CrearFaqDTO {
  idCategoria: number;
  pregunta: string;
  respuesta: string;
  orden?: number;
  activo?: boolean;
  esDestacada?: boolean;
  tags?: string[] | null;
}

export interface ActualizarFaqDTO {
  idCategoria?: number;
  pregunta?: string;
  respuesta?: string;
  orden?: number;
  activo?: boolean;
  esDestacada?: boolean;
  tags?: string[] | null;
}

export interface CrearCategoriaAyudaDTO {
  nombreCategoria: string;
  descripcion?: string | null;
  icono?: string | null;
  orden?: number;
  activo?: boolean;
}

export interface ActualizarCategoriaAyudaDTO {
  nombreCategoria?: string;
  descripcion?: string | null;
  icono?: string | null;
  orden?: number;
  activo?: boolean;
}
