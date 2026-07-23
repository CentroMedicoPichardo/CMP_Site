import type {
  NumericMatrix,
  StandardScalerModel,
} from "@/lib/analytics/kmeans";

import type {
  SegmentationFeatureName,
} from "@/lib/analytics/segmentacion-clientes";

export type SegmentKey =
  | "alto_valor"
  | "inactivo"
  | "ocasional"
  | "incidencias";

export interface SegmentInterpretation {
  cluster: number;
  key: SegmentKey;
  name: string;
  description: string;
  recommendedAction: string;
  rawCentroid: Record<SegmentationFeatureName, number>;
}

export interface InterpretClustersInput {
  centroids: NumericMatrix;
  featureNames: readonly SegmentationFeatureName[];
  scaler: StandardScalerModel;
}

const SEGMENT_METADATA: Record<
  SegmentKey,
  Pick<
    SegmentInterpretation,
    "name" | "description" | "recommendedAction"
  >
> = {
  alto_valor: {
    name: "Clientes de alto valor",
    description:
      "Clientes con mayor frecuencia de compra, gasto, variedad y conversión.",
    recommendedAction:
      "Aplicar estrategias de fidelización, beneficios exclusivos y cursos avanzados.",
  },

  inactivo: {
    name: "Clientes inactivos",
    description:
      "Clientes con alta recencia y baja actividad comercial reciente.",
    recommendedAction:
      "Aplicar campañas de reactivación y promociones de retorno.",
  },

  ocasional: {
    name: "Clientes ocasionales",
    description:
      "Clientes con comportamiento intermedio y compras esporádicas.",
    recommendedAction:
      "Enviar promociones y recomendaciones para aumentar la frecuencia de compra.",
  },

  incidencias: {
    name: "Clientes con incidencias de compra",
    description:
      "Clientes con mayor presencia de cancelaciones, rechazos o expiraciones.",
    recommendedAction:
      "Dar seguimiento a pagos, vencimientos y posibles problemas durante la compra.",
  },
};

function validateInput({
  centroids,
  featureNames,
  scaler,
}: InterpretClustersInput): void {
  if (centroids.length !== 4) {
    throw new Error(
      `Se esperaban 4 centroides y se recibieron ${centroids.length}.`,
    );
  }

  if (featureNames.length === 0) {
    throw new Error(
      "La lista de variables de segmentación está vacía.",
    );
  }

  if (
    scaler.mean.length !== featureNames.length ||
    scaler.scale.length !== featureNames.length
  ) {
    throw new Error(
      "Las medias y escalas no coinciden con la cantidad de variables.",
    );
  }

  for (let cluster = 0; cluster < centroids.length; cluster += 1) {
    if (centroids[cluster].length !== featureNames.length) {
      throw new Error(
        `El centroide ${cluster} no tiene ${featureNames.length} variables.`,
      );
    }
  }
}

function getFeatureIndex(
  featureNames: readonly SegmentationFeatureName[],
  feature: SegmentationFeatureName,
): number {
  const index = featureNames.indexOf(feature);

  if (index === -1) {
    throw new Error(
      `La variable "${feature}" no existe en el modelo.`,
    );
  }

  return index;
}

function standardizedValue(
  centroids: NumericMatrix,
  featureNames: readonly SegmentationFeatureName[],
  cluster: number,
  feature: SegmentationFeatureName,
): number {
  return centroids[cluster][
    getFeatureIndex(featureNames, feature)
  ];
}

function selectHighestScore(
  candidates: number[],
  score: (cluster: number) => number,
): number {
  if (candidates.length === 0) {
    throw new Error(
      "No existen clústeres disponibles para interpretar.",
    );
  }

  return candidates.reduce((bestCluster, currentCluster) =>
    score(currentCluster) > score(bestCluster)
      ? currentCluster
      : bestCluster,
  );
}

function removeCluster(
  clusters: number[],
  selectedCluster: number,
): number[] {
  return clusters.filter(
    (cluster) => cluster !== selectedCluster,
  );
}

function inverseTransformCentroid(
  centroid: number[],
  featureNames: readonly SegmentationFeatureName[],
  scaler: StandardScalerModel,
): Record<SegmentationFeatureName, number> {
  return Object.fromEntries(
    featureNames.map((feature, index) => [
      feature,
      Number(
        (
          centroid[index] * scaler.scale[index] +
          scaler.mean[index]
        ).toFixed(2),
      ),
    ]),
  ) as Record<SegmentationFeatureName, number>;
}

/**
 * Interpreta automáticamente los números de clúster.
 *
 * K-Means no asigna significado a 0, 1, 2 o 3. Esta función usa
 * los centroides estandarizados para identificar perfiles y evita
 * depender de una numeración fija.
 */
export function interpretClusters(
  input: InterpretClustersInput,
): SegmentInterpretation[] {
  validateInput(input);

  const {
    centroids,
    featureNames,
    scaler,
  } = input;

  let availableClusters = centroids.map(
    (_, cluster) => cluster,
  );

  const incidenceScore = (cluster: number) =>
    standardizedValue(
      centroids,
      featureNames,
      cluster,
      "compras_canceladas",
    ) +
    standardizedValue(
      centroids,
      featureNames,
      cluster,
      "compras_rechazadas",
    ) +
    standardizedValue(
      centroids,
      featureNames,
      cluster,
      "compras_expiradas",
    ) +
    0.5 *
      standardizedValue(
        centroids,
        featureNames,
        cluster,
        "compras_pendientes",
      );

  const incidenceCluster = selectHighestScore(
    availableClusters,
    incidenceScore,
  );

  availableClusters = removeCluster(
    availableClusters,
    incidenceCluster,
  );

  const inactiveScore = (cluster: number) =>
    1.5 *
      standardizedValue(
        centroids,
        featureNames,
        cluster,
        "dias_desde_ultima_compra",
      ) -
    standardizedValue(
      centroids,
      featureNames,
      cluster,
      "total_compras_validas",
    ) -
    standardizedValue(
      centroids,
      featureNames,
      cluster,
      "total_gastado",
    ) -
    standardizedValue(
      centroids,
      featureNames,
      cluster,
      "tasa_conversion",
    );

  const inactiveCluster = selectHighestScore(
    availableClusters,
    inactiveScore,
  );

  availableClusters = removeCluster(
    availableClusters,
    inactiveCluster,
  );

  const highValueScore = (cluster: number) =>
    standardizedValue(
      centroids,
      featureNames,
      cluster,
      "total_compras_validas",
    ) +
    standardizedValue(
      centroids,
      featureNames,
      cluster,
      "total_gastado",
    ) +
    0.75 *
      standardizedValue(
        centroids,
        featureNames,
        cluster,
        "ticket_promedio",
      ) +
    0.5 *
      standardizedValue(
        centroids,
        featureNames,
        cluster,
        "cursos_distintos",
      ) +
    0.5 *
      standardizedValue(
        centroids,
        featureNames,
        cluster,
        "tasa_conversion",
      ) -
    0.5 *
      standardizedValue(
        centroids,
        featureNames,
        cluster,
        "dias_desde_ultima_compra",
      );

  const highValueCluster = selectHighestScore(
    availableClusters,
    highValueScore,
  );

  availableClusters = removeCluster(
    availableClusters,
    highValueCluster,
  );

  const occasionalCluster = availableClusters[0];

  if (occasionalCluster === undefined) {
    throw new Error(
      "No fue posible identificar el clúster ocasional.",
    );
  }

  const assignments = new Map<number, SegmentKey>([
    [highValueCluster, "alto_valor"],
    [inactiveCluster, "inactivo"],
    [occasionalCluster, "ocasional"],
    [incidenceCluster, "incidencias"],
  ]);

  return centroids.map((centroid, cluster) => {
    const key = assignments.get(cluster);

    if (!key) {
      throw new Error(
        `No se pudo interpretar el clúster ${cluster}.`,
      );
    }

    return {
      cluster,
      key,
      ...SEGMENT_METADATA[key],
      rawCentroid: inverseTransformCentroid(
        centroid,
        featureNames,
        scaler,
      ),
    };
  });
}