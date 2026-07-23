export interface PrediccionFormulario {
  tituloCurso: string;
  categoriaId: number | null;
  modalidadId: number | null;
  ubicacionId: number | null;
  fechaInicio: string;
  fechaFin: string;
  cupoMaximo: number;
  precioActual: string;
}

export interface PrediccionResultado {
  precioSugerido: number;
  precioMinimoEstimado?: number;
  precioMaximoEstimado?: number;
  margenOrientativo?: number;
  modelo?: string;
  algoritmo?: string;
  version?: string;
  aviso?: string;
  variablesEntrada?: Record<string, unknown>;
}

export interface PrediccionApiResponse extends Partial<PrediccionResultado> {
  ok: boolean;
  message?: string;
}

export interface PrediccionHistorialItem extends PrediccionResultado {
  id: string;
  tituloCurso: string;
  fechaConsulta: string;
  modalidadNombre: string;
  categoriaNombre: string;
  duracionDias: number;
  cupoMaximo: number;
  precioActual?: number;
}
