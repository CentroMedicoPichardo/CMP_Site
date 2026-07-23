import { NextResponse } from "next/server";

import {
  getActiveSegmentationSummary,
} from "@/lib/analytics/consulta-segmentacion";

import { requireApiRole } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const { session, error } =
    await requireApiRole("admin");

  if (error) {
    return error;
  }

  if (!session) {
    return NextResponse.json(
      {
        ok: false,
        message: "No autenticado.",
      },
      {
        status: 401,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }

  try {
    const summary =
      await getActiveSegmentationSummary();

    if (!summary) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "No existe un modelo activo de segmentación de clientes.",
          data: null,
        },
        {
          status: 404,
          headers: {
            "Cache-Control": "no-store",
          },
        },
      );
    }

    return NextResponse.json(
      {
        ok: true,
        message:
          "Resumen de segmentación obtenido correctamente.",

        requestedBy: {
          userId: session.user.id,
          name: session.user.nombreCompleto,
        },

        generatedAt: new Date().toISOString(),

        data: summary,
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
      "Error consultando el resumen de segmentación:",
      error,
    );

    return NextResponse.json(
      {
        ok: false,
        message:
          error instanceof Error
            ? error.message
            : "No fue posible consultar el resumen de segmentación.",
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