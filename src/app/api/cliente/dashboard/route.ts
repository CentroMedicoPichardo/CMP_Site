import { NextResponse } from "next/server";

import { requireApiRole } from "@/lib/auth";
import { obtenerDashboardCliente } from "@/lib/cliente-dashboard/obtener-dashboard-cliente";

export const dynamic = "force-dynamic";

export async function GET() {
  const { session, error } = await requireApiRole("cliente");

  if (error || !session) {
    return error;
  }

  try {
    const dashboard = await obtenerDashboardCliente(session);

    return NextResponse.json(dashboard, {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (errorValue: unknown) {
    console.error(
      "Error cargando el dashboard del cliente:",
      errorValue,
    );

    return NextResponse.json(
      {
        success: false,
        error: "No fue posible cargar el resumen de tu cuenta.",
      },
      { status: 500 },
    );
  }
}
