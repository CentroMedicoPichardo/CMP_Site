export type DashboardPeriodo =
  | "7_dias"
  | "30_dias"
  | "90_dias"
  | "este_anio";

export type DireccionTendencia =
  | "sube"
  | "baja"
  | "igual";

export interface TendenciaDashboard {
  actual: number;
  anterior: number;
  diferencia: number;
  porcentaje: number;
  direccion: DireccionTendencia;
}

export interface TendenciasDashboard {
  usuariosNuevos: TendenciaDashboard;
  inscripciones: TendenciaDashboard;
  ingresos: TendenciaDashboard;
}

export interface DashboardStats {
  totalUsuarios: number;
  totalCursos: number;
  totalInscripciones: number;
  ingresosTotales: number;
  cursosActivos: number;
  usuariosNuevosMes: number;
  tasaOcupacion: number;

  cuentasActivas: number;
  cuentasInactivas: number;
  inscripcionesActivas: number;
  ingresosPeriodo: number;
  inscripcionesPeriodo: number;
  usuariosNuevosPeriodo: number;
  pagosPendientes: number;
  preguntasPendientes: number;
  totalAlertas: number;

  montoReportado: number;
  montoPorRevisar: number;
  montoRechazado: number;
  montoCancelado: number;

  pagosReportados: number;
  pagosEnRevision: number;
  pagosAprobados: number;
  pagosRechazados: number;
  pagosCancelados: number;
}

export interface PeriodoDashboardData {
  clave: DashboardPeriodo;
  etiqueta: string;
  desde: string;
  hasta: string;

  periodoAnterior: {
    desde: string;
    hasta: string;
  };
}

export interface CursoDashboard {
  idCurso: number;
  tituloCurso: string;
  instructor: string;
  categoria: string;
  modalidad: string;
  cuposOcupados: number;
  cupoMaximo: number;
  porcentajeOcupacion: number;
  totalInscripciones: number;
  costo: number;
  ingresosAprobados: number;
  fechaInicio: string | null;
  fechaFin: string | null;
  estadoCurso: string;
  activo: boolean;
}

export interface UsuarioDashboard {
  id: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  correo: string;
  telefono: string;
  rol: string;
  activo: boolean;
  mfaHabilitado: boolean;
  bloqueadoHasta: string | null;
}

export interface InscripcionDashboard {
  id: number;
  idCurso: number;
  curso: string;
  usuario: string;
  correo: string;
  fecha: string | null;
  fechaConfirmacion: string | null;
  estado: string;
  montoPagado: number;
  metodoPago: string;
  origenInscripcion: string;
}

export interface AlertaDashboard {
  id: string;
  tipo:
    | "informativa"
    | "advertencia"
    | "critica";
  titulo: string;
  descripcion: string;
  cantidad: number;
  enlace: string;
}

export interface ActividadDashboard {
  id: number;
  usuario: string;
  accion: string;
  modulo: string;
  registroId: number | null;
  fecha: string | null;
  aplicacionOrigen: string;
}

export interface MetricasRapidasDashboard {
  pagosPorValidar: number;
  preguntasPendientes: number;
  preguntasUrgentes: number;
  cursosBajaOcupacion: number;
  cursosCupoCompleto: number;
  cuentasBloqueadas: number;
  respaldosFallidos: number;

  montoReportado: number;
  montoPorRevisar: number;
  montoRechazado: number;
  montoCancelado: number;
}

export interface DashboardData {
  generadoEn: string;
  periodo: PeriodoDashboardData;
  stats: DashboardStats;
  tendencias: TendenciasDashboard;
  cursosRecientes: CursoDashboard[];
  usuariosActivos: UsuarioDashboard[];
  inscripcionesRecientes: InscripcionDashboard[];
  metricasRapidas: MetricasRapidasDashboard;
  alertas: AlertaDashboard[];
  actividadReciente: ActividadDashboard[];
}