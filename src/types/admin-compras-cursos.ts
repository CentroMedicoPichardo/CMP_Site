// src/types/admin-compras-cursos.ts

import type {
  CompraParticipanteResumen,
  MetodoPagoCurso,
  PagoCursoResumen,
} from "@/types/compras-cursos";

export type FiltroComprasCursosAdmin =
  | "todos"
  | "pendientes_revision"
  | "pendiente_pago"
  | "inscripciones_generadas"
  | "rechazada"
  | "cancelada"
  | "expirada";

export interface CompraCursoAdminListaItem {
  idCompra: number;
  folioCompra: string;
  usuarioId: number;
  compradorNombre: string;
  compradorCorreo: string;
  cursoId: number;
  tituloCurso: string;
  cantidadCupos: number;
  total: string;
  estado: string;
  fechaCompra: string;
  fechaLimitePago: string;
  cantidadPagos: number;
  totalReportado: string;
  fechaUltimoReporte: string | null;
}

export interface PaginacionComprasCursosAdmin {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface ResumenComprasCursosAdmin {
  total: number;
  pendientesRevision: number;
  aprobadas: number;
  expiradas: number;
  montoReportado: string;
}

export interface ListarComprasCursosAdminResponse {
  compras: CompraCursoAdminListaItem[];
  pagination: PaginacionComprasCursosAdmin;
  resumen: ResumenComprasCursosAdmin;
}

export interface CompraCursoAdminDetalle {
  idCompra: number;
  folioCompra: string;
  usuarioId: number;
  compradorNombre: string;
  compradorCorreo: string;
  cursoId: number;
  tituloCurso: string;
  cantidadCupos: number;
  precioUnitario: string;
  subtotal: string;
  descuento: string;
  total: string;
  estado: string;
  fechaCompra: string;
  fechaLimitePago: string;
  observaciones: string | null;
}

export interface HistorialEstadoCompraAdmin {
  idHistorial: number;
  estadoAnterior: string | null;
  estadoNuevo: string;
  fechaCambio: string;
  origenCambio: string;
  usuarioResponsableId: number | null;
  usuarioResponsableNombre: string | null;
  motivo: string | null;
  observaciones: string | null;
}

export interface CompraCursoAdminDetalleResponse {
  compra: CompraCursoAdminDetalle;
  participantes: CompraParticipanteResumen[];
  metodosPago: MetodoPagoCurso[];
  pagos: PagoCursoResumen[];
  historialEstados: HistorialEstadoCompraAdmin[];
  resumenPago: {
    totalCompra: string;
    totalReportado: string;
    saldoPendiente: string;
    pagoCompletoReportado: boolean;
  };
}

export type AccionValidacionCompraCurso =
  | "aprobar"
  | "rechazar";

export interface ValidarCompraCursoAdminInput {
  accion: AccionValidacionCompraCurso;
  observaciones: string | null;
  comprobantesWhatsappRevisados: boolean;
}

export interface ValidarCompraCursoAdminResponse {
  message: string;
  compra: {
    idCompra: number;
    estado: string;
  };
  inscripcionesGeneradas: number;
}