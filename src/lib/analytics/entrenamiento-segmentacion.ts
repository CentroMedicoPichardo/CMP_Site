import {
  countClusterMembers,
  squaredEuclideanDistance,
  trainStandardizedKMeans,
  type NumericMatrix,
  type StandardScalerModel,
} from "@/lib/analytics/kmeans";

import {
  interpretClusters,
  type SegmentInterpretation,
  type SegmentKey,
} from "@/lib/analytics/interpretacion-segmentos";

import {
  prepareSegmentationData,
  type PreparedSegmentationData,
  type SegmentationFeatureName,
} from "@/lib/analytics/segmentacion-clientes";

const NUMBER_OF_CLUSTERS = 4;

const TRAINING_OPTIONS = {
  k: NUMBER_OF_CLUSTERS,
  maxIterations: 300,
  tolerance: 1e-4,
  nInit: 10,
  seed: 0,
} as const;

export interface SegmentationDatasetSummary {
  totalRecords: number;
  featureCount: number;
  featureNames: readonly SegmentationFeatureName[];
}

export interface SegmentationModelSummary {
  algorithm: "K-Means";
  clusterCount: number;
  inertia: number;
  iterations: number;
  converged: boolean;
}

export interface SegmentationClusterSummary {
  cluster: number;
  customerCount: number;
  percentage: number;
  averageDistanceToCentroid: number;
  minimumDistanceToCentroid: number;
  maximumDistanceToCentroid: number;
  centroid: number[];
}

export interface SegmentationAssignment {
  userId: number;
  cluster: number;
  distanceToCentroid: number;
}

export interface CompleteSegmentationAssignment
  extends SegmentationAssignment {
  segmentKey: SegmentKey;
  segmentName: string;
  segmentDescription: string;
  recommendedAction: string;
  characteristics: Record<
    SegmentationFeatureName,
    number
  >;
}

export interface CompleteSegmentationCluster
  extends SegmentationClusterSummary {
  segment: {
    key: SegmentKey;
    name: string;
    description: string;
    recommendedAction: string;
  };

  rawCentroid: Record<
    SegmentationFeatureName,
    number
  >;
}

export interface SegmentationTrainingPreview {
  dataset: SegmentationDatasetSummary;
  model: SegmentationModelSummary;
  scaler: StandardScalerModel;
  clusters: SegmentationClusterSummary[];
  sampleAssignments: SegmentationAssignment[];
}

export interface CompleteSegmentationTraining {
  dataset: SegmentationDatasetSummary;
  model: SegmentationModelSummary;
  scaler: StandardScalerModel;

  imputation:
    PreparedSegmentationData["imputation"];

  clusters: CompleteSegmentationCluster[];
  interpretations: SegmentInterpretation[];
  assignments: CompleteSegmentationAssignment[];
}

interface InternalTrainingResult {
  preparedData: PreparedSegmentationData;

  dataset: SegmentationDatasetSummary;
  model: SegmentationModelSummary;
  scaler: StandardScalerModel;

  clusters: SegmentationClusterSummary[];
  assignments: SegmentationAssignment[];

  centroids: NumericMatrix;
}

function round(
  value: number,
  decimals: number,
): number {
  return Number(value.toFixed(decimals));
}

function buildCharacteristics(
  values: number[],
  featureNames: readonly SegmentationFeatureName[],
): Record<SegmentationFeatureName, number> {
  if (values.length !== featureNames.length) {
    throw new Error(
      "La cantidad de valores del cliente no coincide con las variables del modelo.",
    );
  }

  return Object.fromEntries(
    featureNames.map(
      (featureName, index) => [
        featureName,
        values[index],
      ],
    ),
  ) as Record<SegmentationFeatureName, number>;
}

/**
 * Ejecuta el entrenamiento base y construye la información
 * compartida por la vista previa y la segmentación completa.
 */
async function runSegmentationTraining(): Promise<
  InternalTrainingResult
> {
  const preparedData =
    await prepareSegmentationData();

  const result = trainStandardizedKMeans(
    preparedData.matrix,
    TRAINING_OPTIONS,
  );

  if (
    result.labels.length !==
    preparedData.rows.length
  ) {
    throw new Error(
      "La cantidad de etiquetas generadas no coincide con la cantidad de clientes.",
    );
  }

  if (
    result.centroids.length !==
    NUMBER_OF_CLUSTERS
  ) {
    throw new Error(
      `K-Means debía generar ${NUMBER_OF_CLUSTERS} centroides y generó ${result.centroids.length}.`,
    );
  }

  const clusterCounts =
    countClusterMembers(
      result.labels,
      NUMBER_OF_CLUSTERS,
    );

  const distancesByCluster = Array.from(
    {
      length: NUMBER_OF_CLUSTERS,
    },
    () => [] as number[],
  );

  const assignments: SegmentationAssignment[] =
    result.labels.map((cluster, index) => {
      const standardizedPoint =
        result.standardizedData[index];

      const centroid =
        result.centroids[cluster];

      const sourceRow =
        preparedData.rows[index];

      if (
        !standardizedPoint ||
        !centroid ||
        !sourceRow
      ) {
        throw new Error(
          `No fue posible calcular la asignación del cliente en la posición ${index}.`,
        );
      }

      const distanceToCentroid = Math.sqrt(
        squaredEuclideanDistance(
          standardizedPoint,
          centroid,
        ),
      );

      distancesByCluster[cluster].push(
        distanceToCentroid,
      );

      return {
        userId: sourceRow.usuarioId,
        cluster,

        distanceToCentroid: round(
          distanceToCentroid,
          6,
        ),
      };
    });

  const clusters: SegmentationClusterSummary[] =
    clusterCounts.map(
      (customerCount, cluster) => {
        const distances =
          distancesByCluster[cluster];

        const centroid =
          result.centroids[cluster];

        if (
          customerCount === 0 ||
          distances.length === 0 ||
          !centroid
        ) {
          throw new Error(
            `El clúster ${cluster} quedó vacío o no tiene centroide.`,
          );
        }

        const totalDistance =
          distances.reduce(
            (sum, distance) =>
              sum + distance,
            0,
          );

        return {
          cluster,
          customerCount,

          percentage: round(
            (
              customerCount /
              preparedData.rows.length
            ) * 100,
            2,
          ),

          averageDistanceToCentroid:
            round(
              totalDistance /
                distances.length,
              6,
            ),

          minimumDistanceToCentroid:
            round(
              Math.min(...distances),
              6,
            ),

          maximumDistanceToCentroid:
            round(
              Math.max(...distances),
              6,
            ),

          centroid: centroid.map(
            (value) =>
              round(value, 8),
          ),
        };
      },
    );

  return {
    preparedData,

    dataset: {
      totalRecords:
        preparedData.rows.length,

      featureCount:
        preparedData.featureNames.length,

      featureNames:
        preparedData.featureNames,
    },

    model: {
      algorithm: "K-Means",
      clusterCount:
        NUMBER_OF_CLUSTERS,

      inertia: round(
        result.inertia,
        6,
      ),

      iterations:
        result.iterations,

      converged:
        result.converged,
    },

    scaler: {
      mean: result.scaler.mean.map(
        (value) =>
          round(value, 8),
      ),

      scale: result.scaler.scale.map(
        (value) =>
          round(value, 8),
      ),
    },

    clusters,
    assignments,

    /*
     * Los centroides se conservan sin redondear para que
     * la interpretación use la máxima precisión disponible.
     */
    centroids:
      result.centroids.map(
        (centroid) => [...centroid],
      ),
  };
}

/**
 * Entrenamiento de diagnóstico.
 *
 * Devuelve solamente diez asignaciones y no modifica
 * PostgreSQL.
 */
export async function trainSegmentationPreview(): Promise<
  SegmentationTrainingPreview
> {
  const training =
    await runSegmentationTraining();

  return {
    dataset: training.dataset,
    model: training.model,
    scaler: training.scaler,
    clusters: training.clusters,

    sampleAssignments:
      training.assignments.slice(0, 10),
  };
}

/**
 * Entrena e interpreta la segmentación completa.
 *
 * Devuelve una asignación por cada cliente activo.
 * No guarda nada; persistencia-segmentacion.ts utiliza
 * este resultado para ejecutar la transacción.
 */
export async function trainCompleteSegmentation(): Promise<
  CompleteSegmentationTraining
> {
  const training =
    await runSegmentationTraining();

  const interpretations =
    interpretClusters({
      centroids:
        training.centroids,

      featureNames:
        training.preparedData.featureNames,

      scaler:
        training.scaler,
    });

  const interpretationByCluster =
    new Map<
      number,
      SegmentInterpretation
    >(
      interpretations.map(
        (interpretation) => [
          interpretation.cluster,
          interpretation,
        ],
      ),
    );

  const clusters: CompleteSegmentationCluster[] =
    training.clusters.map(
      (cluster) => {
        const interpretation =
          interpretationByCluster.get(
            cluster.cluster,
          );

        if (!interpretation) {
          throw new Error(
            `No existe interpretación para el clúster ${cluster.cluster}.`,
          );
        }

        return {
          ...cluster,

          segment: {
            key:
              interpretation.key,

            name:
              interpretation.name,

            description:
              interpretation.description,

            recommendedAction:
              interpretation.recommendedAction,
          },

          rawCentroid:
            interpretation.rawCentroid,
        };
      },
    );

  const assignments: CompleteSegmentationAssignment[] =
    training.assignments.map(
      (assignment, index) => {
        const interpretation =
          interpretationByCluster.get(
            assignment.cluster,
          );

        const sourceValues =
          training.preparedData.matrix[index];

        if (!interpretation) {
          throw new Error(
            `No existe interpretación para el clúster ${assignment.cluster}.`,
          );
        }

        if (!sourceValues) {
          throw new Error(
            `No existen características para el cliente ${assignment.userId}.`,
          );
        }

        return {
          ...assignment,

          segmentKey:
            interpretation.key,

          segmentName:
            interpretation.name,

          segmentDescription:
            interpretation.description,

          recommendedAction:
            interpretation.recommendedAction,

          characteristics:
            buildCharacteristics(
              sourceValues,
              training.preparedData.featureNames,
            ),
        };
      },
    );

  if (
    assignments.length !==
    training.dataset.totalRecords
  ) {
    throw new Error(
      "La segmentación completa no contiene una asignación por cada cliente.",
    );
  }

  const uniqueUsers = new Set(
    assignments.map(
      (assignment) =>
        assignment.userId,
    ),
  );

  if (
    uniqueUsers.size !==
    assignments.length
  ) {
    throw new Error(
      "La segmentación completa contiene usuarios duplicados.",
    );
  }

  return {
    dataset:
      training.dataset,

    model:
      training.model,

    scaler:
      training.scaler,

    imputation:
      training.preparedData.imputation,

    clusters,
    interpretations,
    assignments,
  };
}