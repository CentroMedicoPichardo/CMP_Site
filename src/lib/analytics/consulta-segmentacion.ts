import {
  and,
  asc,
  desc,
  eq,
  sql,
} from "drizzle-orm";

import { db } from "@/lib/db";

import {
  datasetSegmentacionClientes,
  modelosMl,
  segmentosClientes,
} from "@/lib/schema";

const SEGMENTATION_MODEL_TYPE =
  "Segmentación de clientes";

interface ClusterMappingItem {
  cluster: number;
  key: string;
  name: string;
  description: string;
  recommendedAction: string;
}

interface StoredModelMetrics {
  inertia: number | null;
  iterations: number | null;
  converged: boolean | null;
}

export interface ActiveSegmentationSummary {
  model: {
    id: number;
    name: string;
    type: string;
    algorithm: string;
    version: string;
    status: string;
    active: boolean;
    trainingRecordCount: number;
    trainedAt: string;
    deployedAt: string | null;
  };

  metrics: StoredModelMetrics;

  datasetStatus: {
    activeRecords: number;
    trainingRecords: number;
    recordCountChanged: boolean;
  };

  assignmentsStatus: {
    currentAssignments: number;
    expectedAssignments: number;
    complete: boolean;
  };

  distribution: Array<{
    cluster: number;
    segmentKey: string;
    segmentName: string;
    description: string | null;
    recommendedAction: string | null;
    customerCount: number;
    percentage: number;
    averageDistanceToCentroid: number;
  }>;
}

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function toSafeInteger(
  value: unknown,
  fieldName: string,
): number {
  const parsedValue =
    typeof value === "bigint"
      ? Number(value)
      : Number(value);

  if (
    !Number.isSafeInteger(parsedValue) ||
    parsedValue < 0
  ) {
    throw new Error(
      `El campo "${fieldName}" no contiene un entero válido.`,
    );
  }

  return parsedValue;
}

function getOptionalNumber(
  source: unknown,
  fieldName: string,
): number | null {
  if (!isRecord(source)) {
    return null;
  }

  const value = source[fieldName];

  if (
    typeof value !== "number" ||
    !Number.isFinite(value)
  ) {
    return null;
  }

  return value;
}

function getOptionalBoolean(
  source: unknown,
  fieldName: string,
): boolean | null {
  if (!isRecord(source)) {
    return null;
  }

  const value = source[fieldName];

  return typeof value === "boolean"
    ? value
    : null;
}

function getClusterMapping(
  parameters: unknown,
): ClusterMappingItem[] {
  if (!isRecord(parameters)) {
    return [];
  }

  const rawMapping =
    parameters.clusterMapping;

  if (!Array.isArray(rawMapping)) {
    return [];
  }

  return rawMapping.flatMap((item) => {
    if (!isRecord(item)) {
      return [];
    }

    const {
      cluster,
      key,
      name,
      description,
      recommendedAction,
    } = item;

    if (
      typeof cluster !== "number" ||
      !Number.isInteger(cluster) ||
      typeof key !== "string" ||
      typeof name !== "string" ||
      typeof description !== "string" ||
      typeof recommendedAction !== "string"
    ) {
      return [];
    }

    return [
      {
        cluster,
        key,
        name,
        description,
        recommendedAction,
      },
    ];
  });
}

/**
 * Consulta el modelo de segmentación activo y su distribución
 * actualmente guardada.
 *
 * Esta función solamente lee PostgreSQL. No entrena K-Means y
 * no modifica ningún registro.
 */
export async function getActiveSegmentationSummary(): Promise<
  ActiveSegmentationSummary | null
> {
  const [activeModel] = await db
    .select({
      id: modelosMl.idModelo,
      name: modelosMl.nombreModelo,
      type: modelosMl.tipoModelo,
      algorithm: modelosMl.algoritmo,
      version: modelosMl.versionModelo,
      status: modelosMl.estado,
      active: modelosMl.esModeloActivo,
      trainingRecordCount:
        modelosMl.cantidadRegistrosEntrenamiento,
      trainedAt:
        modelosMl.fechaEntrenamiento,
      deployedAt:
        modelosMl.fechaDespliegue,
      parameters:
        modelosMl.parametros,
      storedMetrics:
        modelosMl.metricas,
    })
    .from(modelosMl)
    .where(
      and(
        eq(
          modelosMl.tipoModelo,
          SEGMENTATION_MODEL_TYPE,
        ),
        eq(
          modelosMl.esModeloActivo,
          true,
        ),
      ),
    )
    .orderBy(
      desc(modelosMl.fechaDespliegue),
      desc(modelosMl.fechaEntrenamiento),
    )
    .limit(1);

  if (!activeModel) {
    return null;
  }

  const modelId = toSafeInteger(
    activeModel.id,
    "id_modelo",
  );

  const trainingRecordCount =
    activeModel.trainingRecordCount ?? 0;

  const [datasetCountResult] = await db
    .select({
      count: sql<number>`
        COUNT(*)::int
      `.mapWith(Number),
    })
    .from(datasetSegmentacionClientes)
    .where(
      eq(
        datasetSegmentacionClientes.activoDataset,
        true,
      ),
    );

  const activeDatasetRecords =
    datasetCountResult?.count ?? 0;

  const distributionRows = await db
    .select({
      cluster:
        segmentosClientes.numeroSegmento,

      segmentName:
        segmentosClientes.nombreSegmento,

      customerCount: sql<number>`
        COUNT(*)::int
      `.mapWith(Number),

      averageDistanceToCentroid: sql<number>`
        COALESCE(
          AVG(
            ${segmentosClientes.distanciaCentroide}
          ),
          0
        )
      `.mapWith(Number),
    })
    .from(segmentosClientes)
    .where(
      and(
        eq(
          segmentosClientes.modeloId,
          modelId,
        ),
        eq(
          segmentosClientes.vigente,
          true,
        ),
      ),
    )
    .groupBy(
      segmentosClientes.numeroSegmento,
      segmentosClientes.nombreSegmento,
    )
    .orderBy(
      asc(
        segmentosClientes.numeroSegmento,
      ),
    );

  const currentAssignments =
    distributionRows.reduce(
      (total, row) =>
        total + row.customerCount,
      0,
    );

  const clusterMapping =
    getClusterMapping(
      activeModel.parameters,
    );

  const mappingByCluster = new Map(
    clusterMapping.map((item) => [
      item.cluster,
      item,
    ]),
  );

  const distribution =
    distributionRows.map((row) => {
      const mapping =
        mappingByCluster.get(row.cluster);

      return {
        cluster: row.cluster,

        segmentKey:
          mapping?.key ??
          `cluster_${row.cluster}`,

        segmentName:
          mapping?.name ??
          row.segmentName,

        description:
          mapping?.description ?? null,

        recommendedAction:
          mapping?.recommendedAction ?? null,

        customerCount:
          row.customerCount,

        percentage:
          currentAssignments > 0
            ? Number(
                (
                  (row.customerCount /
                    currentAssignments) *
                  100
                ).toFixed(2),
              )
            : 0,

        averageDistanceToCentroid:
          Number(
            row.averageDistanceToCentroid.toFixed(
              6,
            ),
          ),
      };
    });

  return {
    model: {
      id: modelId,
      name: activeModel.name,
      type: activeModel.type,
      algorithm:
        activeModel.algorithm,
      version:
        activeModel.version,
      status:
        activeModel.status,
      active:
        activeModel.active,
      trainingRecordCount,
      trainedAt:
        activeModel.trainedAt,
      deployedAt:
        activeModel.deployedAt,
    },

    metrics: {
      inertia: getOptionalNumber(
        activeModel.storedMetrics,
        "inertia",
      ),

      iterations: getOptionalNumber(
        activeModel.storedMetrics,
        "iterations",
      ),

      converged: getOptionalBoolean(
        activeModel.storedMetrics,
        "converged",
      ),
    },

    datasetStatus: {
      activeRecords:
        activeDatasetRecords,

      trainingRecords:
        trainingRecordCount,

      recordCountChanged:
        activeDatasetRecords !==
        trainingRecordCount,
    },

    assignmentsStatus: {
      currentAssignments,
      expectedAssignments:
        trainingRecordCount,
      complete:
        currentAssignments ===
        trainingRecordCount,
    },

    distribution,
  };
}