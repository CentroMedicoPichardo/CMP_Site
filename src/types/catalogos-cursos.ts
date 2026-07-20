// src/types/catalogos-cursos.ts

export interface InstructorCurso {
  idInstructor: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string | null;
  especialidad: string;
  edad: number;
  telefono: string | null;
  correo: string;
  direccion: string | null;
  activo: boolean;
}

export interface InstructorCursoOption {
  idInstructor: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string | null;
  especialidad: string;
}

export interface CategoriaCurso {
  idCategoria: number;
  nombreCategoria: string;
  descripcion: string | null;
  activo: boolean;
}

export interface CategoriaCursoOption {
  idCategoria: number;
  nombreCategoria: string;
}

export interface UbicacionCurso {
  idUbicacion: number;
  nombreUbicacion: string;
  direccionCompleta: string | null;
  capacidadMaxima: number | null;
  activo: boolean;
}

export interface UbicacionCursoOption {
  idUbicacion: number;
  nombreUbicacion: string;
  direccionCompleta: string | null;
  capacidadMaxima?: number | null;
}

export interface ModalidadCurso {
  idModalidad: number;
  nombreModalidad: string;
  descripcion: string | null;
}

export interface CatalogosCurso {
  instructores: InstructorCursoOption[];
  categorias: CategoriaCursoOption[];
  ubicaciones: UbicacionCursoOption[];
  modalidades: ModalidadCurso[];
}