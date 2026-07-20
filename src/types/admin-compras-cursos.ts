// src/types/admin-compras-cursos.ts

import type {
  CompraParticipanteResumen,
  MetodoPagoCurso,
  PagoCursoResumen,
} from "@/types/compras-cursos";

export type FiltroComprasCursosAdmin =
  | "todos"
  | "con_pago"
  | "en_validacion"
  | "sin_pago";

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
  conPagoReportado: number;
  enValidacion: number;
  sinPagoRelacionado: number;
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

export interface CompraCursoAdminDetalleResponse {
  compra: CompraCursoAdminDetalle;
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

export type AccionValidacionCompraCurso =
  | "aprobar"
  | "rechazar";

export interface ValidarCompraCursoAdminInput {
  accion: AccionValidacionCompraCurso;
  observaciones: string | null;
}

export interface ValidarCompraCursoAdminResponse {
  message: string;
  compra: {
    idCompra: number;
    estado: string;
  };
  inscripcionesGeneradas: number;
}