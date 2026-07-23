import { NextResponse } from "next/server";

import {
  getSegmentedClients,
} from "../../../../../lib/analytics/consulta-clientes-segmentados";

import { requireApiRole } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
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
        data: null,
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
    const url = new URL(request.url);

    const segmentKey =
      url.searchParams.get("segmento") ??
      "todos";

    const parsedLimit = Number(
      url.searchParams.get("limite") ?? "6",
    );

    const limit = Number.isInteger(parsedLimit)
      ? parsedLimit
      : 6;

    const clients =
      await getSegmentedClients({
        segmentKey,
        limit,
      });

    return NextResponse.json(
      {
        ok: true,
        message:
          "Clientes segmentados obtenidos correctamente.",
        data: {
          total: clients.length,
          limit: Math.min(
            Math.max(limit, 1),
            50,
          ),
          segmentKey,
          clients,
        },
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
      "Error consultando clientes segmentados:",
      error,
    );

    return NextResponse.json(
      {
        ok: false,
        message:
          error instanceof Error
            ? error.message
            : "No fue posible consultar los clientes segmentados.",
        data: null,
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
