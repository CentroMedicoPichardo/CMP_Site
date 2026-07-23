export type TipoAlertaCliente =
  | "pago"
  | "curso"
  | "soporte"
  | "informacion";

export type NivelAlertaCliente =
  | "info"
  | "warning"
  | "success";

export interface ResumenDashboardCliente {
  cursosEnCurso: number;
  cursosProximos: number;
  cursosCompletados: number;
  comprasPendientes: number;
  preguntasPendientes: number;
  preguntasAtendidas: number;
}

export interface AlertaDashboardCliente {
  id: string;
  tipo: TipoAlertaCliente;
  nivel: NivelAlertaCliente;
  titulo: string;
  descripcion: string;
  href: string;
  accion: string;
  fecha: string | null;
}

export interface CursoResumenDashboardCliente {
  idInscripcion: number;
  idCurso: number;
  tituloCurso: string;
  participanteNombre: string;
  urlImagenPortada: string | null;
  fechaInicio: string;
  fechaFin: string;
  estadoAcademico: string;
  situacionCurso: "Próximamente" | "En curso" | "Finalizado";
  porcentajeAvance: number;
  porcentajeAsistencia: number;
  proximaSesion: {
    titulo: string;
    fecha: string;
    horaInicio: string;
  } | null;
}

export interface CompraResumenDashboardCliente {
  idCompra: number;
  folioCompra: string;
  cursoId: number;
  tituloCurso: string;
  estado: string;
  total: string;
  fechaCompra: string;
  fechaLimitePago: string | null;
}

export interface SoporteResumenDashboardCliente {
  total: number;
  pendientes: number;
  atendidas: number;
  ultimaAtendida: {
    idPregunta: number;
    titulo: string;
    estado: string;
    fecha: string | null;
  } | null;
}

export interface CursoRecienteDashboardCliente {
  idCurso: number;
  tituloCurso: string;
  descripcion: string | null;
  categoriaNombre: string | null;
  modalidadNombre: string | null;
  instructorNombre: string;
  fechaInicio: string;
  fechaFin: string;
  horario: string | null;
  costo: string;
  cupoMaximo: number;
  cuposOcupados: number;
  cuposDisponibles: number;
  urlImagenPortada: string | null;
  createdAt: string | null;
}

export interface ClienteDashboardResponse {
  success: true;
  usuario: {
    id: number;
    nombre: string;
    nombreCompleto: string;
  };
  resumen: ResumenDashboardCliente;
  alertas: AlertaDashboardCliente[];
  misCursos: CursoResumenDashboardCliente[];
  comprasRecientes: CompraResumenDashboardCliente[];
  soporte: SoporteResumenDashboardCliente;
  cursosRecientes: CursoRecienteDashboardCliente[];
  generadoEn: string;
}
