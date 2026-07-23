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
  usuarios,
} from "@/lib/schema";

const SEGMENTATION_MODEL_TYPE =
  "Segmentación de clientes";

export interface SegmentedClientResult {
  userId: number;
  fullName: string;
  initials: string;
  cluster: number;
  segmentKey: string;
  segmentName: string;
  validPurchases: number;
  totalSpent: number;
  conversionRate: number;
  lastPurchaseAt: string | null;
  suggestedAction: string | null;
  distanceToCentroid: number | null;
}

interface GetSegmentedClientsOptions {
  segmentKey?: string;
  limit?: number;
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

function getJsonString(
  value: unknown,
  key: string,
): string | null {
  if (!isRecord(value)) {
    return null;
  }

  const result = value[key];

  return typeof result === "string"
    ? result
    : null;
}

function buildInitials(
  firstName: string,
  paternalSurname: string,
): string {
  return `${firstName.charAt(0)}${paternalSurname.charAt(0)}`.toUpperCase();
}

export async function getSegmentedClients({
  segmentKey = "todos",
  limit = 6,
}: GetSegmentedClientsOptions = {}): Promise<
  SegmentedClientResult[]
> {
  const safeLimit = Math.min(
    Math.max(
      Number.isInteger(limit) ? limit : 6,
      1,
    ),
    50,
  );

  const [activeModel] = await db
    .select({
      id: modelosMl.idModelo,
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
    return [];
  }

  const filters = [
    eq(
      segmentosClientes.modeloId,
      Number(activeModel.id),
    ),
    eq(
      segmentosClientes.vigente,
      true,
    ),
  ];

  if (
    segmentKey !== "todos" &&
    segmentKey.trim() !== ""
  ) {
    filters.push(
      sql`${segmentosClientes.caracteristicasUsuario}->>'segmentKey' = ${segmentKey}`,
    );
  }

  const rows = await db
    .select({
      userId: usuarios.id,
      firstName: usuarios.nombre,
      paternalSurname:
        usuarios.apellidoPaterno,
      maternalSurname:
        usuarios.apellidoMaterno,

      cluster:
        segmentosClientes.numeroSegmento,
      segmentName:
        segmentosClientes.nombreSegmento,
      characteristics:
        segmentosClientes.caracteristicasUsuario,
      distanceToCentroid:
        segmentosClientes.distanciaCentroide,

      validPurchases:
        datasetSegmentacionClientes
          .totalComprasValidas,
      totalSpent:
        datasetSegmentacionClientes.totalGastado,
      conversionRate:
        datasetSegmentacionClientes.tasaConversion,
      lastPurchaseAt:
        datasetSegmentacionClientes
          .fechaUltimaCompra,
    })
    .from(segmentosClientes)
    .innerJoin(
      usuarios,
      eq(
        segmentosClientes.usuarioId,
        usuarios.id,
      ),
    )
    .leftJoin(
      datasetSegmentacionClientes,
      eq(
        datasetSegmentacionClientes.usuarioId,
        usuarios.id,
      ),
    )
    .where(and(...filters))
    .orderBy(
      desc(
        datasetSegmentacionClientes.totalGastado,
      ),
      asc(
        segmentosClientes.distanciaCentroide,
      ),
    )
    .limit(safeLimit);

  return rows.map((row) => {
    const segmentKeyFromJson =
      getJsonString(
        row.characteristics,
        "segmentKey",
      ) ?? `cluster_${row.cluster}`;

    const recommendedAction =
      getJsonString(
        row.characteristics,
        "recommendedAction",
      );

    const fullName = [
      row.firstName,
      row.paternalSurname,
      row.maternalSurname,
    ]
      .filter(Boolean)
      .join(" ");

    return {
      userId: row.userId,
      fullName,
      initials: buildInitials(
        row.firstName,
        row.paternalSurname,
      ),
      cluster: row.cluster,
      segmentKey: segmentKeyFromJson,
      segmentName: row.segmentName,
      validPurchases:
        row.validPurchases ?? 0,
      totalSpent: Number(
        row.totalSpent ?? 0,
      ),
      conversionRate: Number(
        row.conversionRate ?? 0,
      ),
      lastPurchaseAt:
        row.lastPurchaseAt,
      suggestedAction:
        recommendedAction,
      distanceToCentroid:
        row.distanceToCentroid === null
          ? null
          : Number(
              row.distanceToCentroid,
            ),
    };
  });
}
