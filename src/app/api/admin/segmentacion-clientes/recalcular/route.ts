import { NextResponse } from "next/server";

import { requireApiRole } from "@/lib/auth";
import {
  trainAndPersistSegmentation,
} from "@/lib/analytics/persistencia-segmentacion";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RecalculationRequestBody {
  confirm?: boolean;
}

export async function POST(request: Request) {
  const { session, error } = await requireApiRole("admin");

  if (error || !session) {
    return error;
  }

  try {
    let body: RecalculationRequestBody;

    try {
      body = (await request.json()) as RecalculationRequestBody;
    } catch {
      return NextResponse.json(
        {
          ok: false,
          message:
            "El cuerpo de la solicitud debe ser JSON válido.",
        },
        { status: 400 },
      );
    }

    if (body.confirm !== true) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Debes enviar { \"confirm\": true } para ejecutar y guardar la segmentación.",
        },
        { status: 400 },
      );
    }

    const startedAt = performance.now();

    const result = await trainAndPersistSegmentation(
      session.user.id,
    );

    const elapsedMilliseconds = Number(
      (performance.now() - startedAt).toFixed(2),
    );

    return NextResponse.json(
      {
        ok: true,
        message:
          "La segmentación se entrenó y guardó correctamente.",
        executedBy: {
          userId: session.user.id,
          name: session.user.nombreCompleto,
        },
        execution: {
          elapsedMilliseconds,
          persisted: true,
        },
        result,
      },
      {
        status: 201,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    console.error(
      "Error al recalcular y guardar la segmentación:",
      error,
    );

    return NextResponse.json(
      {
        ok: false,
        message:
          error instanceof Error
            ? error.message
            : "No fue posible recalcular y guardar la segmentación.",
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