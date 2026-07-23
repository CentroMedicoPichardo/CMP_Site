export type SegmentKey =
  | "alto_valor"
  | "inactivo"
  | "ocasional"
  | "incidencias"
  | string;

export interface SegmentDistribution {
  cluster: number;
  segmentKey: SegmentKey;
  segmentName: string;
  description: string | null;
  recommendedAction: string | null;
  customerCount: number;
  percentage: number;
  averageDistanceToCentroid: number;
}

export interface SegmentationSummary {
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

  metrics: {
    inertia: number | null;
    iterations: number | null;
    converged: boolean | null;
  };

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

  distribution: SegmentDistribution[];
}

export interface SummaryResponse {
  ok: boolean;
  message: string;
  generatedAt?: string;
  data: SegmentationSummary | null;
}

export interface RecalculationResponse {
  ok: boolean;
  message: string;
  result?: {
    modelId: number;
    modelVersion: string;
    totalCustomers: number;
    totalAssignmentsInserted: number;
    previousModelsDeactivated: number;
    previousAssignmentsDeactivated: number;
    trainedAt: string;
  };
}

export interface SegmentedClient {
  userId: number;
  fullName: string;
  initials: string;
  cluster: number;
  segmentKey: SegmentKey;
  segmentName: string;
  validPurchases: number;
  totalSpent: number;
  conversionRate: number;
  lastPurchaseAt: string | null;
  suggestedAction: string | null;
  distanceToCentroid: number | null;
}

export interface SegmentedClientsResponse {
  ok: boolean;
  message: string;
  data: {
    total: number;
    limit: number;
    segmentKey: string;
    clients: SegmentedClient[];
  } | null;
}
