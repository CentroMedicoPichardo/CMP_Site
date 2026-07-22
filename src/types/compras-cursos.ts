// src/types/compras-cursos.ts

export const SEXOS_PARTICIPANTE = [
  "Masculino",
  "Femenino",
  "Otro",
  "Prefiere no indicar",
] as const;

export type SexoParticipante =
  (typeof SEXOS_PARTICIPANTE)[number];

export type EstadoCompra =
  | "Borrador"
  | "Pendiente de pago"
  | "Pago reportado"
  | "En validación"
  | "Pago validado"
  | "Inscripciones generadas"
  | "Rechazada"
  | "Cancelada"
  | "Expirada";

export type CanalComprobanteCurso =
  | "Imagen"
  | "URL"
  | "WhatsApp"
  | "Sin comprobante";

export interface CrearParticipanteCursoInput {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string | null;
  fechaNacimiento: string | null;
  sexo: SexoParticipante | null;
  telefono: string | null;
  correo: string | null;
}

export interface ParticipanteExistenteCompraInput {
  participanteId: number;
}

export interface ParticipanteNuevoCompraInput {
  participante: CrearParticipanteCursoInput;
}

export type ParticipanteCompraInput =
  | ParticipanteExistenteCompraInput
  | ParticipanteNuevoCompraInput;

export interface CrearCompraCursoInput {
  cursoId: number;
  cantidadCupos: number;
  participantes: ParticipanteCompraInput[];
  observacionesUsuario: string | null;
}

export interface ParticipanteCurso {
  idParticipante: number;
  usuarioId: number | null;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string | null;
  fechaNacimiento: string | null;
  sexo: SexoParticipante | null;
  telefono: string | null;
  correo: string | null;
  activo: boolean;
}

export interface CompraParticipanteResumen {
  idCompraParticipante: number;
  numeroCupo: number;
  estado: string;
  observaciones: string | null;
  participante: ParticipanteCurso;
}

export interface CompraCursoResumen {
  idCompra: number;
  folioCompra: string;
  usuarioId: number;
  cursoId: number;
  tituloCurso: string;
  cantidadCupos: number;
  precioUnitario: string;
  subtotal: string;
  descuento: string;
  total: string;
  estado: EstadoCompra | string;
  fechaCompra: string;
  fechaLimitePago: string;
}

export interface CrearCompraCursoResponse {
  compra: CompraCursoResumen;
  participantes: CompraParticipanteResumen[];
}

export interface DisponibilidadCursoCompra {
  cursoId: number;
  cupoMaximo: number;
  cuposOcupados: number;
  cuposReservados: number;
  cuposDisponibles: number;
}

export interface CompraCursoListaItem
  extends CompraCursoResumen {
  observaciones: string | null;
  pagoVencido: boolean;
}

export interface ListarComprasCursosResponse {
  compras: CompraCursoListaItem[];
  total: number;
}

export interface CompraCursoDetalleResponse {
  compra: CompraCursoResumen & {
    observaciones: string | null;
  };
  participantes: CompraParticipanteResumen[];
  metodosPago: MetodoPagoCurso[];
  pagos: PagoCursoResumen[];
  resumenPago: {
    totalCompra: string;
    totalReportado: string;
    saldoPendiente: string;
    pagoCompletoReportado: boolean;
  };
}

export interface MetodoPagoCurso {
  idMetodoPago: number;
  nombre: string;
  descripcion: string | null;
  requiereComprobante: boolean;
  instrucciones: string | null;
}

export interface MetodosPagoCursosResponse {
  metodos: MetodoPagoCurso[];
}

export type EstadoPagoCurso =
  | "Reportado"
  | "En revisión"
  | "Aprobado"
  | "Rechazado"
  | "Cancelado";

export interface ReportarPagoCursoInput {
  idMetodoPago: number;
  monto: string;
  fechaPago: string;
  referencia: string | null;

  canalComprobante: CanalComprobanteCurso;

  rutaComprobante: string | null;
  nombreArchivoOriginal: string | null;
  tipoArchivo: string | null;

  comprobanteConfirmado: boolean;
  fechaEnvioWhatsapp: string | null;
  observaciones: string | null;
}

export interface PagoCursoResumen {
  idPago: number;
  idCompra: number;
  idMetodoPago: number;
  metodoPago: string;

  monto: string;
  fechaPago: string;
  fechaReporte: string;
  referencia: string | null;

  canalComprobante: CanalComprobanteCurso;
  rutaComprobante: string | null;
  nombreArchivoOriginal: string | null;
  tipoArchivo: string | null;
  comprobanteConfirmado: boolean;
  fechaEnvioWhatsapp: string | null;

  estado: string;
  motivoRechazo: string | null;
  observaciones: string | null;
}

export interface ReportarPagoCursoResponse {
  message: string;
  pago: PagoCursoResumen;
  estadoCompra: string;
}