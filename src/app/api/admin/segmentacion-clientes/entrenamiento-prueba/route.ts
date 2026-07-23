import { NextResponse } from "next/server";

import {
  interpretClusters,
} from "@/lib/analytics/interpretacion-segmentos";

import {
  SEGMENTATION_FEATURE_NAMES,
} from "@/lib/analytics/segmentacion-clientes";

import {
  trainSegmentationPreview,
} from "@/lib/analytics/entrenamiento-segmentacion";

import { requireApiRole } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const { session, error } = await requireApiRole("admin");

  if (error || !session) {
    return error;
  }

  const startedAt = performance.now();

  try {
    const training = await trainSegmentationPreview();

    const interpretations = interpretClusters({
      centroids: training.clusters.map(
        (cluster) => cluster.centroid,
      ),
      featureNames: SEGMENTATION_FEATURE_NAMES,
      scaler: training.scaler,
    });

    const interpretationByCluster = new Map(
      interpretations.map((interpretation) => [
        interpretation.cluster,
        interpretation,
      ]),
    );

    const clusters = training.clusters.map((cluster) => {
      const interpretation =
        interpretationByCluster.get(cluster.cluster);

      if (!interpretation) {
        throw new Error(
          `No existe interpretación para el clúster ${cluster.cluster}.`,
        );
      }

      return {
        ...cluster,
        segment: {
          key: interpretation.key,
          name: interpretation.name,
          description: interpretation.description,
          recommendedAction:
            interpretation.recommendedAction,
        },
        rawCentroid: interpretation.rawCentroid,
      };
    });

    const sampleAssignments =
      training.sampleAssignments.map((assignment) => {
        const interpretation =
          interpretationByCluster.get(
            assignment.cluster,
          );

        if (!interpretation) {
          throw new Error(
            `No existe interpretación para el clúster ${assignment.cluster}.`,
          );
        }

        return {
          ...assignment,
          segmentKey: interpretation.key,
          segmentName: interpretation.name,
        };
      });

    const elapsedMilliseconds = Number(
      (performance.now() - startedAt).toFixed(2),
    );

    return NextResponse.json(
      {
        ok: true,
        message:
          "K-Means se entrenó e interpretó correctamente en memoria. No se guardaron cambios en la base de datos.",

        executedBy: {
          userId: session.user.id,
          name: session.user.nombreCompleto,
        },

        execution: {
          elapsedMilliseconds,
          persisted: false,
        },

        dataset: training.dataset,
        model: training.model,
        scaler: training.scaler,
        clusters,
        sampleAssignments,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    console.error(
      "Error durante el entrenamiento e interpretación de K-Means:",
      error,
    );

    return NextResponse.json(
      {
        ok: false,
        message:
          error instanceof Error
            ? error.message
            : "No fue posible entrenar e interpretar K-Means.",
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }
}