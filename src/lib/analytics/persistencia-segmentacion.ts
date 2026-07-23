import { and, eq } from "drizzle-orm";

import {
  trainCompleteSegmentation,
  type CompleteSegmentationTraining,
} from "@/lib/analytics/entrenamiento-segmentacion";

import { db } from "@/lib/db";

import {
  modelosMl,
  segmentosClientes,
} from "@/lib/schema";

const MODEL_NAME = "Segmentación de clientes CMP";
const MODEL_TYPE = "Segmentación de clientes";
const MODEL_ALGORITHM = "K-Means";
const DATASET_ORIGIN =
  "analitica.dataset_segmentacion_clientes";

const INSERT_BATCH_SIZE = 250;

export interface PersistedSegmentationResult {
  modelId: number;
  modelVersion: string;
  totalCustomers: number;
  totalAssignmentsInserted: number;
  previousModelsDeactivated: number;
  previousAssignmentsDeactivated: number;
  trainedAt: string;
  distribution: Array<{
    cluster: number;
    segmentKey: string;
    segmentName: string;
    customerCount: number;
    percentage: number;
  }>;
}

function createModelVersion(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(
    date.getUTCMonth() + 1,
  ).padStart(2, "0");
  const day = String(
    date.getUTCDate(),
  ).padStart(2, "0");
  const hour = String(
    date.getUTCHours(),
  ).padStart(2, "0");
  const minute = String(
    date.getUTCMinutes(),
  ).padStart(2, "0");
  const second = String(
    date.getUTCSeconds(),
  ).padStart(2, "0");
  const millisecond = String(
    date.getUTCMilliseconds(),
  ).padStart(3, "0");

  return `${year}.${month}.${day}-${hour}${minute}${second}.${millisecond}`;
}

function chunkArray<T>(
  values: T[],
  size: number,
): T[][] {
  if (!Number.isInteger(size) || size <= 0) {
    throw new Error(
      "El tamaño del lote debe ser un entero mayor que cero.",
    );
  }

  const chunks: T[][] = [];

  for (
    let index = 0;
    index < values.length;
    index += size
  ) {
    chunks.push(values.slice(index, index + size));
  }

  return chunks;
}

function validateTraining(
  training: CompleteSegmentationTraining,
): void {
  if (!training.model.converged) {
    throw new Error(
      "K-Means no convergió. No se guardará la segmentación.",
    );
  }

  if (
    training.assignments.length !==
    training.dataset.totalRecords
  ) {
    throw new Error(
      "No existe una asignación por cada cliente del dataset.",
    );
  }

  const uniqueUsers = new Set(
    training.assignments.map(
      (assignment) => assignment.userId,
    ),
  );

  if (
    uniqueUsers.size !==
    training.assignments.length
  ) {
    throw new Error(
      "El entrenamiento contiene usuarios duplicados.",
    );
  }

  const segmentKeys = new Set(
    training.interpretations.map(
      (interpretation) => interpretation.key,
    ),
  );

  if (segmentKeys.size !== 4) {
    throw new Error(
      "No se identificaron los cuatro perfiles de clientes.",
    );
  }
}

function buildModelParameters(
  training: CompleteSegmentationTraining,
) {
  return {
    featureNames: training.dataset.featureNames,

    standardScaler: {
      mean: training.scaler.mean,
      scale: training.scaler.scale,
    },

    centroids: training.clusters.map(
      (cluster) => ({
        cluster: cluster.cluster,
        standardized: cluster.centroid,
        original: cluster.rawCentroid,
      }),
    ),

    clusterMapping: training.interpretations.map(
      (interpretation) => ({
        cluster: interpretation.cluster,
        key: interpretation.key,
        name: interpretation.name,
        description: interpretation.description,
        recommendedAction:
          interpretation.recommendedAction,
      }),
    ),

    imputation: training.imputation,

    trainingOptions: {
      k: 4,
      maxIterations: 300,
      tolerance: 1e-4,
      nInit: 10,
      seed: 0,
    },

    datasetSnapshot: {
      totalRecords:
        training.dataset.totalRecords,
      featureCount:
        training.dataset.featureCount,
    },
  };
}

function buildModelMetrics(
  training: CompleteSegmentationTraining,
) {
  return {
    inertia: training.model.inertia,
    iterations: training.model.iterations,
    converged: training.model.converged,

    distribution: training.clusters.map(
      (cluster) => ({
        cluster: cluster.cluster,
        segmentKey: cluster.segment.key,
        segmentName: cluster.segment.name,
        customerCount:
          cluster.customerCount,
        percentage: cluster.percentage,
        averageDistanceToCentroid:
          cluster.averageDistanceToCentroid,
        minimumDistanceToCentroid:
          cluster.minimumDistanceToCentroid,
        maximumDistanceToCentroid:
          cluster.maximumDistanceToCentroid,
      }),
    ),
  };
}

/**
 * Entrena K-Means y guarda el modelo y las asignaciones en una
 * sola transacción.
 *
 * El entrenamiento ocurre antes de abrir la transacción para no
 * mantener bloqueos mientras se realizan los cálculos.
 */
export async function trainAndPersistSegmentation(
  administratorUserId: number,
): Promise<PersistedSegmentationResult> {
  if (
    !Number.isInteger(administratorUserId) ||
    administratorUserId <= 0
  ) {
    throw new Error(
      "El identificador del administrador no es válido.",
    );
  }

  const training =
    await trainCompleteSegmentation();

  validateTraining(training);

  const now = new Date();
  const timestamp = now.toISOString();
  const modelVersion = createModelVersion(now);

  return db.transaction(async (tx) => {
    const previousModels =
      await tx
        .update(modelosMl)
        .set({
          esModeloActivo: false,
          estado: "Retirado",
          fechaRetiro: timestamp,
          updatedAt: timestamp,
        })
        .where(
          and(
            eq(
              modelosMl.tipoModelo,
              MODEL_TYPE,
            ),
            eq(
              modelosMl.esModeloActivo,
              true,
            ),
          ),
        )
        .returning({
          idModelo: modelosMl.idModelo,
        });

    const [insertedModel] =
      await tx
        .insert(modelosMl)
        .values({
          nombreModelo: MODEL_NAME,
          tipoModelo: MODEL_TYPE,
          algoritmo: MODEL_ALGORITHM,
          versionModelo: modelVersion,
          datasetOrigen: DATASET_ORIGIN,

          descripcion:
            "Modelo K-Means de cuatro clústeres para segmentar clientes según recencia, compras, gasto, variedad, conversión e incidencias.",

          parametros:
            buildModelParameters(training),

          metricas:
            buildModelMetrics(training),

          cantidadRegistrosEntrenamiento:
            training.dataset.totalRecords,

          estado: "Desplegado",
          esModeloActivo: true,

          fechaEntrenamiento: timestamp,
          fechaDespliegue: timestamp,

          creadoPor: administratorUserId,

          createdAt: timestamp,
          updatedAt: timestamp,
        })
        .returning({
          idModelo: modelosMl.idModelo,
        });

    if (!insertedModel) {
      throw new Error(
        "No fue posible registrar el modelo de segmentación.",
      );
    }

    const previousAssignments =
      await tx
        .update(segmentosClientes)
        .set({
          vigente: false,
          updatedAt: timestamp,
        })
        .where(
          eq(
            segmentosClientes.vigente,
            true,
          ),
        )
        .returning({
          idSegmentacion:
            segmentosClientes.idSegmentacion,
        });

    const rowsToInsert =
      training.assignments.map(
        (assignment) => ({
          usuarioId: assignment.userId,
          modeloId: Number(insertedModel.idModelo),

          numeroSegmento:
            assignment.cluster,

          nombreSegmento:
            assignment.segmentName,

          descripcionSegmento:
            assignment.segmentDescription,

          distanciaCentroide:
            assignment.distanceToCentroid.toFixed(6),

          // K-Means genera distancia, no probabilidad.
          nivelConfianza: null,

          caracteristicasUsuario: {
            segmentKey:
              assignment.segmentKey,

            recommendedAction:
              assignment.recommendedAction,

            metrics:
              assignment.characteristics,
          },

          fechaAsignacion: timestamp,
          vigente: true,
          createdAt: timestamp,
          updatedAt: timestamp,
        }),
      );

    let totalAssignmentsInserted = 0;

    for (
      const batch of chunkArray(
        rowsToInsert,
        INSERT_BATCH_SIZE,
      )
    ) {
      const insertedAssignments =
        await tx
          .insert(segmentosClientes)
          .values(batch)
          .returning({
            idSegmentacion:
              segmentosClientes.idSegmentacion,
          });

      totalAssignmentsInserted +=
        insertedAssignments.length;
    }

    if (
      totalAssignmentsInserted !==
      training.dataset.totalRecords
    ) {
      throw new Error(
        `Se esperaban ${training.dataset.totalRecords} asignaciones y se insertaron ${totalAssignmentsInserted}.`,
      );
    }

    return {
      modelId: Number(insertedModel.idModelo),
      modelVersion,
      totalCustomers:
        training.dataset.totalRecords,
      totalAssignmentsInserted,
      previousModelsDeactivated:
        previousModels.length,
      previousAssignmentsDeactivated:
        previousAssignments.length,
      trainedAt: timestamp,

      distribution: training.clusters.map(
        (cluster) => ({
          cluster: cluster.cluster,
          segmentKey:
            cluster.segment.key,
          segmentName:
            cluster.segment.name,
          customerCount:
            cluster.customerCount,
          percentage:
            cluster.percentage,
        }),
      ),
    };
  });
}