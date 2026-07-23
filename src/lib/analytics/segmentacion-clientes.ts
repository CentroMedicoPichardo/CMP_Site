import { asc, eq } from "drizzle-orm";

import type { NumericMatrix } from "@/lib/analytics/kmeans";
import { db } from "@/lib/db";
import { datasetSegmentacionClientes } from "@/lib/schema";

/**
 * Orden exacto de las variables utilizadas para entrenar K-Means.
 *
 * Este orden debe mantenerse al:
 * - entrenar el modelo;
 * - guardar medias, escalas y centroides;
 * - clasificar clientes posteriormente.
 */
export const SEGMENTATION_FEATURE_NAMES = [
  "dias_desde_ultima_compra",
  "antiguedad_cliente_dias",
  "total_compras",
  "total_compras_validas",
  "compras_pendientes",
  "compras_canceladas",
  "compras_rechazadas",
  "compras_expiradas",
  "cursos_distintos",
  "categorias_distintas",
  "modalidades_distintas",
  "total_cupos_adquiridos",
  "total_gastado",
  "ticket_promedio",
  "cupos_promedio_compra",
  "tasa_conversion",
] as const;

export type SegmentationFeatureName =
  (typeof SEGMENTATION_FEATURE_NAMES)[number];

/**
 * Registro mínimo necesario del dataset analítico.
 *
 * PostgreSQL/Drizzle devuelve los campos numeric como string,
 * mientras que los campos integer se reciben como number.
 */
export interface SegmentationDatasetRow {
  idRegistro: bigint;
  usuarioId: number;

  diasDesdeUltimaCompra: number | null;
  antiguedadClienteDias: number | null;

  totalCompras: number;
  totalComprasValidas: number;
  comprasPendientes: number;
  comprasCanceladas: number;
  comprasRechazadas: number;
  comprasExpiradas: number;

  cursosDistintos: number;
  categoriasDistintas: number;
  modalidadesDistintas: number;
  totalCuposAdquiridos: number;

  totalGastado: string;
  ticketPromedio: string;
  cuposPromedioCompra: string;
  tasaConversion: string;
}

export interface PreparedSegmentationData {
  rows: SegmentationDatasetRow[];
  matrix: NumericMatrix;
  featureNames: readonly SegmentationFeatureName[];
  imputation: {
    diasDesdeUltimaCompraSinCompras: number;
    antiguedadClienteSinCompras: number;
  };
}

/**
 * Convierte un valor recibido desde PostgreSQL en un número finito.
 */
function toFiniteNumber(
  value: number | string,
  fieldName: SegmentationFeatureName,
  userId: number,
): number {
  const numericValue =
    typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(numericValue)) {
    throw new Error(
      `El campo "${fieldName}" del usuario ${userId} no contiene un valor numérico válido.`,
    );
  }

  return numericValue;
}

/**
 * Obtiene los registros activos que participarán en el entrenamiento.
 */
export async function getActiveSegmentationDataset(): Promise<
  SegmentationDatasetRow[]
> {
  const rows = await db
    .select({
      idRegistro: datasetSegmentacionClientes.idRegistro,
      usuarioId: datasetSegmentacionClientes.usuarioId,

      diasDesdeUltimaCompra:
        datasetSegmentacionClientes.diasDesdeUltimaCompra,
      antiguedadClienteDias:
        datasetSegmentacionClientes.antiguedadClienteDias,

      totalCompras: datasetSegmentacionClientes.totalCompras,
      totalComprasValidas:
        datasetSegmentacionClientes.totalComprasValidas,
      comprasPendientes:
        datasetSegmentacionClientes.comprasPendientes,
      comprasCanceladas:
        datasetSegmentacionClientes.comprasCanceladas,
      comprasRechazadas:
        datasetSegmentacionClientes.comprasRechazadas,
      comprasExpiradas:
        datasetSegmentacionClientes.comprasExpiradas,

      cursosDistintos:
        datasetSegmentacionClientes.cursosDistintos,
      categoriasDistintas:
        datasetSegmentacionClientes.categoriasDistintas,
      modalidadesDistintas:
        datasetSegmentacionClientes.modalidadesDistintas,
      totalCuposAdquiridos:
        datasetSegmentacionClientes.totalCuposAdquiridos,

      totalGastado: datasetSegmentacionClientes.totalGastado,
      ticketPromedio: datasetSegmentacionClientes.ticketPromedio,
      cuposPromedioCompra:
        datasetSegmentacionClientes.cuposPromedioCompra,
      tasaConversion: datasetSegmentacionClientes.tasaConversion,
    })
    .from(datasetSegmentacionClientes)
    .where(eq(datasetSegmentacionClientes.activoDataset, true))
    .orderBy(asc(datasetSegmentacionClientes.idRegistro));

  if (rows.length === 0) {
    throw new Error(
      "No existen registros activos en el dataset de segmentación.",
    );
  }

  if (rows.length < 4) {
    throw new Error(
      "Se necesitan al menos 4 clientes para entrenar cuatro segmentos.",
    );
  }

  return rows;
}

/**
 * Prepara la matriz numérica que recibirá StandardScaler y K-Means.
 *
 * Tratamiento de valores nulos para clientes sin compras:
 * - recencia: máximo observado + 30 días;
 * - antigüedad: 0 días.
 */
export async function prepareSegmentationData(): Promise<
  PreparedSegmentationData
> {
  const rows = await getActiveSegmentationDataset();

  const recencyValues = rows
    .map((row) => row.diasDesdeUltimaCompra)
    .filter(
      (value): value is number =>
        value !== null && Number.isFinite(value),
    );

  const maximumObservedRecency =
    recencyValues.length > 0 ? Math.max(...recencyValues) : 0;

  const recencyWithoutPurchases = maximumObservedRecency + 30;
  const tenureWithoutPurchases = 0;

  const matrix: NumericMatrix = rows.map((row) => [
    toFiniteNumber(
      row.diasDesdeUltimaCompra ?? recencyWithoutPurchases,
      "dias_desde_ultima_compra",
      row.usuarioId,
    ),
    toFiniteNumber(
      row.antiguedadClienteDias ?? tenureWithoutPurchases,
      "antiguedad_cliente_dias",
      row.usuarioId,
    ),
    toFiniteNumber(
      row.totalCompras,
      "total_compras",
      row.usuarioId,
    ),
    toFiniteNumber(
      row.totalComprasValidas,
      "total_compras_validas",
      row.usuarioId,
    ),
    toFiniteNumber(
      row.comprasPendientes,
      "compras_pendientes",
      row.usuarioId,
    ),
    toFiniteNumber(
      row.comprasCanceladas,
      "compras_canceladas",
      row.usuarioId,
    ),
    toFiniteNumber(
      row.comprasRechazadas,
      "compras_rechazadas",
      row.usuarioId,
    ),
    toFiniteNumber(
      row.comprasExpiradas,
      "compras_expiradas",
      row.usuarioId,
    ),
    toFiniteNumber(
      row.cursosDistintos,
      "cursos_distintos",
      row.usuarioId,
    ),
    toFiniteNumber(
      row.categoriasDistintas,
      "categorias_distintas",
      row.usuarioId,
    ),
    toFiniteNumber(
      row.modalidadesDistintas,
      "modalidades_distintas",
      row.usuarioId,
    ),
    toFiniteNumber(
      row.totalCuposAdquiridos,
      "total_cupos_adquiridos",
      row.usuarioId,
    ),
    toFiniteNumber(
      row.totalGastado,
      "total_gastado",
      row.usuarioId,
    ),
    toFiniteNumber(
      row.ticketPromedio,
      "ticket_promedio",
      row.usuarioId,
    ),
    toFiniteNumber(
      row.cuposPromedioCompra,
      "cupos_promedio_compra",
      row.usuarioId,
    ),
    toFiniteNumber(
      row.tasaConversion,
      "tasa_conversion",
      row.usuarioId,
    ),
  ]);

  const invalidRowIndex = matrix.findIndex(
    (values) => values.length !== SEGMENTATION_FEATURE_NAMES.length,
  );

  if (invalidRowIndex !== -1) {
    throw new Error(
      `La fila ${invalidRowIndex} no contiene las ${SEGMENTATION_FEATURE_NAMES.length} variables esperadas.`,
    );
  }

  return {
    rows,
    matrix,
    featureNames: SEGMENTATION_FEATURE_NAMES,
    imputation: {
      diasDesdeUltimaCompraSinCompras: recencyWithoutPurchases,
      antiguedadClienteSinCompras: tenureWithoutPurchases,
    },
  };
}