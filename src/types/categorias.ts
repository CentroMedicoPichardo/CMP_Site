// src/types/categorias.ts
export interface CategoriaCurso {
  idCategoria: number;
  nombreCategoria: string;
  descripcion: string | null;
  activo: boolean;
}

export interface CategoriaCursoFormData {
  idCategoria?: number;
  nombreCategoria: string;
  descripcion: string | null;
  activo: boolean;
}