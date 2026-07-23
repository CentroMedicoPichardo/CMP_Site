/**
 * Implementación de StandardScaler y K-Means sin dependencias externas.
 *
 * Configuración equivalente a la libreta de segmentación:
 * - k = 4
 * - init = "random"
 * - max_iter = 300
 * - n_init = 10
 * - tol = 1e-4
 * - random_state = 0
 */

export type NumericMatrix = number[][];

export interface StandardScalerModel {
  mean: number[];
  scale: number[];
}

export interface StandardizationResult {
  data: NumericMatrix;
  scaler: StandardScalerModel;
}

export interface KMeansOptions {
  k?: number;
  maxIterations?: number;
  tolerance?: number;
  nInit?: number;
  seed?: number;
}

export interface KMeansResult {
  labels: number[];
  centroids: NumericMatrix;
  inertia: number;
  iterations: number;
  converged: boolean;
}

export interface StandardizedKMeansResult extends KMeansResult {
  standardizedData: NumericMatrix;
  scaler: StandardScalerModel;
}

export const DEFAULT_KMEANS_OPTIONS: Required<KMeansOptions> = {
  k: 4,
  maxIterations: 300,
  tolerance: 1e-4,
  nInit: 10,
  seed: 0,
};

const EPSILON = 1e-12;

/**
 * Valida que la matriz tenga filas, columnas y valores numéricos finitos.
 */
function validateMatrix(matrix: NumericMatrix): void {
  if (!Array.isArray(matrix) || matrix.length === 0) {
    throw new Error("La matriz de datos no puede estar vacía.");
  }

  const columnCount = matrix[0]?.length ?? 0;

  if (columnCount === 0) {
    throw new Error("La matriz debe contener al menos una variable.");
  }

  for (let rowIndex = 0; rowIndex < matrix.length; rowIndex += 1) {
    const row = matrix[rowIndex];

    if (!Array.isArray(row) || row.length !== columnCount) {
      throw new Error(
        `La fila ${rowIndex} no tiene el mismo número de variables que las demás.`,
      );
    }

    for (let columnIndex = 0; columnIndex < row.length; columnIndex += 1) {
      if (!Number.isFinite(row[columnIndex])) {
        throw new Error(
          `El valor de la fila ${rowIndex}, columna ${columnIndex} no es un número finito.`,
        );
      }
    }
  }
}

/**
 * Generador pseudoaleatorio determinista.
 * Permite repetir resultados usando la misma semilla.
 */
function createSeededRandom(seed: number): () => number {
  let state = seed >>> 0;

  return () => {
    state += 0x6d2b79f5;

    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);

    return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296;
  };
}

function cloneMatrix(matrix: NumericMatrix): NumericMatrix {
  return matrix.map((row) => [...row]);
}

function mean(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

/**
 * Ajusta StandardScaler usando desviación estándar poblacional (ddof = 0),
 * igual que sklearn.preprocessing.StandardScaler.
 */
export function fitStandardScaler(matrix: NumericMatrix): StandardScalerModel {
  validateMatrix(matrix);

  const rowCount = matrix.length;
  const columnCount = matrix[0].length;
  const means = new Array<number>(columnCount).fill(0);
  const scales = new Array<number>(columnCount).fill(0);

  for (const row of matrix) {
    for (let columnIndex = 0; columnIndex < columnCount; columnIndex += 1) {
      means[columnIndex] += row[columnIndex];
    }
  }

  for (let columnIndex = 0; columnIndex < columnCount; columnIndex += 1) {
    means[columnIndex] /= rowCount;
  }

  for (const row of matrix) {
    for (let columnIndex = 0; columnIndex < columnCount; columnIndex += 1) {
      const difference = row[columnIndex] - means[columnIndex];
      scales[columnIndex] += difference * difference;
    }
  }

  for (let columnIndex = 0; columnIndex < columnCount; columnIndex += 1) {
    const variance = scales[columnIndex] / rowCount;
    const standardDeviation = Math.sqrt(variance);

    // StandardScaler utiliza escala 1 para una variable constante.
    scales[columnIndex] =
      standardDeviation <= EPSILON ? 1 : standardDeviation;
  }

  return {
    mean: means,
    scale: scales,
  };
}

/**
 * Aplica un StandardScaler previamente ajustado.
 */
export function transformWithStandardScaler(
  matrix: NumericMatrix,
  scaler: StandardScalerModel,
): NumericMatrix {
  validateMatrix(matrix);

  const columnCount = matrix[0].length;

  if (
    scaler.mean.length !== columnCount ||
    scaler.scale.length !== columnCount
  ) {
    throw new Error(
      "El StandardScaler no contiene el mismo número de variables que la matriz.",
    );
  }

  if (scaler.scale.some((value) => !Number.isFinite(value) || value <= 0)) {
    throw new Error("El StandardScaler contiene escalas inválidas.");
  }

  return matrix.map((row) =>
    row.map(
      (value, columnIndex) =>
        (value - scaler.mean[columnIndex]) / scaler.scale[columnIndex],
    ),
  );
}

/**
 * Ajusta y aplica StandardScaler en una sola operación.
 */
export function fitTransformStandardScaler(
  matrix: NumericMatrix,
): StandardizationResult {
  const scaler = fitStandardScaler(matrix);

  return {
    scaler,
    data: transformWithStandardScaler(matrix, scaler),
  };
}

/**
 * Distancia euclidiana al cuadrado.
 * Evita calcular la raíz cuadrada durante las comparaciones.
 */
export function squaredEuclideanDistance(
  pointA: number[],
  pointB: number[],
): number {
  if (pointA.length !== pointB.length) {
    throw new Error("Los vectores deben tener la misma dimensión.");
  }

  let total = 0;

  for (let index = 0; index < pointA.length; index += 1) {
    const difference = pointA[index] - pointB[index];
    total += difference * difference;
  }

  return total;
}

/**
 * Obtiene el índice del centroide más cercano a un punto.
 */
export function findNearestCentroid(
  point: number[],
  centroids: NumericMatrix,
): { cluster: number; squaredDistance: number } {
  if (centroids.length === 0) {
    throw new Error("Debe existir al menos un centroide.");
  }

  let nearestCluster = 0;
  let nearestDistance = squaredEuclideanDistance(point, centroids[0]);

  for (let clusterIndex = 1; clusterIndex < centroids.length; clusterIndex += 1) {
    const distance = squaredEuclideanDistance(
      point,
      centroids[clusterIndex],
    );

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestCluster = clusterIndex;
    }
  }

  return {
    cluster: nearestCluster,
    squaredDistance: nearestDistance,
  };
}

/**
 * Asigna cada registro al centroide más cercano.
 */
export function assignPointsToCentroids(
  matrix: NumericMatrix,
  centroids: NumericMatrix,
): { labels: number[]; squaredDistances: number[]; inertia: number } {
  validateMatrix(matrix);
  validateMatrix(centroids);

  if (matrix[0].length !== centroids[0].length) {
    throw new Error(
      "Los registros y los centroides deben tener la misma dimensión.",
    );
  }

  const labels = new Array<number>(matrix.length);
  const squaredDistances = new Array<number>(matrix.length);
  let inertia = 0;

  for (let rowIndex = 0; rowIndex < matrix.length; rowIndex += 1) {
    const nearest = findNearestCentroid(matrix[rowIndex], centroids);

    labels[rowIndex] = nearest.cluster;
    squaredDistances[rowIndex] = nearest.squaredDistance;
    inertia += nearest.squaredDistance;
  }

  return {
    labels,
    squaredDistances,
    inertia,
  };
}

/**
 * Inicialización aleatoria con puntos distintos del dataset,
 * equivalente conceptualmente a init="random".
 */
function initializeRandomCentroids(
  matrix: NumericMatrix,
  k: number,
  random: () => number,
): NumericMatrix {
  const indexes = Array.from({ length: matrix.length }, (_, index) => index);

  // Fisher-Yates parcial: solo necesitamos seleccionar k índices.
  for (let index = 0; index < k; index += 1) {
    const swapIndex =
      index + Math.floor(random() * (indexes.length - index));

    [indexes[index], indexes[swapIndex]] = [indexes[swapIndex], indexes[index]];
  }

  return indexes.slice(0, k).map((index) => [...matrix[index]]);
}

/**
 * Recalcula los centroides y reubica puntos cuando queda un clúster vacío.
 */
function recomputeCentroids(
  matrix: NumericMatrix,
  labels: number[],
  squaredDistances: number[],
  k: number,
): { centroids: NumericMatrix; labels: number[] } {
  const columnCount = matrix[0].length;
  const adjustedLabels = [...labels];
  const sums = Array.from({ length: k }, () =>
    new Array<number>(columnCount).fill(0),
  );
  const counts = new Array<number>(k).fill(0);

  const addPoint = (cluster: number, point: number[], multiplier: 1 | -1) => {
    counts[cluster] += multiplier;

    for (let columnIndex = 0; columnIndex < columnCount; columnIndex += 1) {
      sums[cluster][columnIndex] += multiplier * point[columnIndex];
    }
  };

  for (let rowIndex = 0; rowIndex < matrix.length; rowIndex += 1) {
    addPoint(adjustedLabels[rowIndex], matrix[rowIndex], 1);
  }

  for (let emptyCluster = 0; emptyCluster < k; emptyCluster += 1) {
    if (counts[emptyCluster] > 0) {
      continue;
    }

    let replacementIndex = -1;
    let greatestDistance = -Infinity;

    for (let rowIndex = 0; rowIndex < matrix.length; rowIndex += 1) {
      const currentCluster = adjustedLabels[rowIndex];

      // Evita dejar vacío el clúster donante.
      if (
        counts[currentCluster] > 1 &&
        squaredDistances[rowIndex] > greatestDistance
      ) {
        replacementIndex = rowIndex;
        greatestDistance = squaredDistances[rowIndex];
      }
    }

    if (replacementIndex === -1) {
      throw new Error(
        "No fue posible reparar un clúster vacío durante el entrenamiento.",
      );
    }

    const previousCluster = adjustedLabels[replacementIndex];
    const replacementPoint = matrix[replacementIndex];

    addPoint(previousCluster, replacementPoint, -1);
    adjustedLabels[replacementIndex] = emptyCluster;
    addPoint(emptyCluster, replacementPoint, 1);
  }

  const centroids = sums.map((clusterSums, clusterIndex) =>
    clusterSums.map((sum) => sum / counts[clusterIndex]),
  );

  return {
    centroids,
    labels: adjustedLabels,
  };
}

function calculateCenterShift(
  previousCentroids: NumericMatrix,
  nextCentroids: NumericMatrix,
): number {
  let totalShift = 0;

  for (let clusterIndex = 0; clusterIndex < previousCentroids.length; clusterIndex += 1) {
    totalShift += squaredEuclideanDistance(
      previousCentroids[clusterIndex],
      nextCentroids[clusterIndex],
    );
  }

  return totalShift;
}

/**
 * Umbral equivalente al criterio utilizado por scikit-learn:
 * media de las varianzas por variable multiplicada por tol.
 */
function calculateToleranceThreshold(
  matrix: NumericMatrix,
  tolerance: number,
): number {
  const columnCount = matrix[0].length;
  const variances = new Array<number>(columnCount).fill(0);
  const means = new Array<number>(columnCount).fill(0);

  for (const row of matrix) {
    for (let columnIndex = 0; columnIndex < columnCount; columnIndex += 1) {
      means[columnIndex] += row[columnIndex];
    }
  }

  for (let columnIndex = 0; columnIndex < columnCount; columnIndex += 1) {
    means[columnIndex] /= matrix.length;
  }

  for (const row of matrix) {
    for (let columnIndex = 0; columnIndex < columnCount; columnIndex += 1) {
      const difference = row[columnIndex] - means[columnIndex];
      variances[columnIndex] += difference * difference;
    }
  }

  for (let columnIndex = 0; columnIndex < columnCount; columnIndex += 1) {
    variances[columnIndex] /= matrix.length;
  }

  return mean(variances) * tolerance;
}

function runSingleKMeans(
  matrix: NumericMatrix,
  options: Required<KMeansOptions>,
  seed: number,
): KMeansResult {
  const random = createSeededRandom(seed);
  const toleranceThreshold = calculateToleranceThreshold(
    matrix,
    options.tolerance,
  );

  let centroids = initializeRandomCentroids(matrix, options.k, random);
  let labels = new Array<number>(matrix.length).fill(-1);
  let iterations = 0;
  let converged = false;

  for (let iteration = 1; iteration <= options.maxIterations; iteration += 1) {
    iterations = iteration;

    const assignment = assignPointsToCentroids(matrix, centroids);
    const recomputed = recomputeCentroids(
      matrix,
      assignment.labels,
      assignment.squaredDistances,
      options.k,
    );

    const centerShift = calculateCenterShift(
      centroids,
      recomputed.centroids,
    );

    const labelsUnchanged = recomputed.labels.every(
      (label, index) => label === labels[index],
    );

    labels = recomputed.labels;
    centroids = recomputed.centroids;

    if (labelsUnchanged || centerShift <= toleranceThreshold) {
      converged = true;
      break;
    }
  }

  // Asignación final con los centroides definitivos.
  const finalAssignment = assignPointsToCentroids(matrix, centroids);

  return {
    labels: finalAssignment.labels,
    centroids,
    inertia: finalAssignment.inertia,
    iterations,
    converged,
  };
}

/**
 * Entrena K-Means y conserva la mejor ejecución de nInit,
 * es decir, la de menor inercia.
 */
export function trainKMeans(
  matrix: NumericMatrix,
  customOptions: KMeansOptions = {},
): KMeansResult {
  validateMatrix(matrix);

  const options: Required<KMeansOptions> = {
    ...DEFAULT_KMEANS_OPTIONS,
    ...customOptions,
  };

  if (!Number.isInteger(options.k) || options.k < 2) {
    throw new Error("k debe ser un número entero mayor o igual a 2.");
  }

  if (options.k > matrix.length) {
    throw new Error(
      "k no puede ser mayor que la cantidad de registros disponibles.",
    );
  }

  if (!Number.isInteger(options.maxIterations) || options.maxIterations < 1) {
    throw new Error("maxIterations debe ser un entero mayor o igual a 1.");
  }

  if (!Number.isInteger(options.nInit) || options.nInit < 1) {
    throw new Error("nInit debe ser un entero mayor o igual a 1.");
  }

  if (!Number.isFinite(options.tolerance) || options.tolerance < 0) {
    throw new Error("tolerance debe ser un número mayor o igual a 0.");
  }

  let bestResult: KMeansResult | null = null;

  for (let initialization = 0; initialization < options.nInit; initialization += 1) {
    const runSeed = options.seed + initialization * 9_973;
    const result = runSingleKMeans(matrix, options, runSeed);

    if (!bestResult || result.inertia < bestResult.inertia) {
      bestResult = result;
    }
  }

  if (!bestResult) {
    throw new Error("No fue posible entrenar el modelo K-Means.");
  }

  return {
    ...bestResult,
    centroids: cloneMatrix(bestResult.centroids),
    labels: [...bestResult.labels],
  };
}

/**
 * Flujo completo usado por el módulo administrativo:
 * 1. Ajusta StandardScaler.
 * 2. Estandariza los datos.
 * 3. Entrena K-Means.
 */
export function trainStandardizedKMeans(
  matrix: NumericMatrix,
  options: KMeansOptions = {},
): StandardizedKMeansResult {
  const standardization = fitTransformStandardScaler(matrix);
  const result = trainKMeans(standardization.data, options);

  return {
    ...result,
    standardizedData: standardization.data,
    scaler: standardization.scaler,
  };
}

/**
 * Asigna un nuevo registro usando un modelo ya entrenado.
 */
export function predictCluster(
  rawPoint: number[],
  scaler: StandardScalerModel,
  centroids: NumericMatrix,
): {
  cluster: number;
  distanceToCentroid: number;
  standardizedPoint: number[];
} {
  if (rawPoint.length === 0 || rawPoint.some((value) => !Number.isFinite(value))) {
    throw new Error("El registro a predecir contiene valores inválidos.");
  }

  const [standardizedPoint] = transformWithStandardScaler(
    [rawPoint],
    scaler,
  );

  const nearest = findNearestCentroid(standardizedPoint, centroids);

  return {
    cluster: nearest.cluster,
    distanceToCentroid: Math.sqrt(nearest.squaredDistance),
    standardizedPoint,
  };
}

/**
 * Devuelve el número de registros asignados a cada clúster.
 */
export function countClusterMembers(labels: number[], k: number): number[] {
  if (!Number.isInteger(k) || k < 1) {
    throw new Error("k debe ser un entero mayor o igual a 1.");
  }

  const counts = new Array<number>(k).fill(0);

  for (const label of labels) {
    if (!Number.isInteger(label) || label < 0 || label >= k) {
      throw new Error(`Se encontró una etiqueta de clúster inválida: ${label}.`);
    }

    counts[label] += 1;
  }

  return counts;
}