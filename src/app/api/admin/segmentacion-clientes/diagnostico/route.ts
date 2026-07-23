import { NextResponse } from "next/server";

import { requireApiRole } from "@/lib/auth";
import { prepareSegmentationData } from "@/lib/analytics/segmentacion-clientes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const { error } = await requireApiRole("admin");

  if (error) {
    return error;
  }

  try {
    const data = await prepareSegmentationData();

    const expectedFeatureCount = data.featureNames.length;

    const invalidRows = data.matrix
      .map((values, index) => ({
        index,
        usuarioId: data.rows[index]?.usuarioId,
        variableCount: values.length,
        hasInvalidValues: values.some(
          (value) => !Number.isFinite(value),
        ),
      }))
      .filter(
        (row) =>
          row.variableCount !== expectedFeatureCount ||
          row.hasInvalidValues,
      );

    const sample = data.rows.slice(0, 3).map((row, index) => {
      const values = data.matrix[index];

      return {
        idRegistro: row.idRegistro.toString(),
        usuarioId: row.usuarioId,
        variables: Object.fromEntries(
          data.featureNames.map((featureName, featureIndex) => [
            featureName,
            values[featureIndex],
          ]),
        ),
      };
    });

    return NextResponse.json(
      {
        ok: invalidRows.length === 0,
        message:
          invalidRows.length === 0
            ? "El dataset de segmentación está listo para entrenar K-Means."
            : "Se encontraron filas inválidas en la matriz de segmentación.",
        summary: {
          totalRegistros: data.rows.length,
          totalFilasMatriz: data.matrix.length,
          variablesPorCliente: expectedFeatureCount,
          filasInvalidas: invalidRows.length,
        },
        featureNames: data.featureNames,
        imputation: data.imputation,
        invalidRows: invalidRows.slice(0, 20),
        sample,
      },
      {
        status: invalidRows.length === 0 ? 200 : 422,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    console.error(
      "Error comprobando el dataset de segmentación:",
      error,
    );

    return NextResponse.json(
      {
        ok: false,
        message:
          error instanceof Error
            ? error.message
            : "No fue posible comprobar el dataset de segmentación.",
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