// src/app/api/dashboard/stats/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  usuarios,
  medicos,
  cursos,
  publicaciones,
  servicios,
} from "@/lib/schema/index";
import { sql, eq } from "drizzle-orm";
import { requireApiRole } from "@/lib/auth";

function obtenerConteo(resultado: { count: number }[] | undefined) {
  const valor = Number(resultado?.[0]?.count ?? 0);
  return Number.isFinite(valor) ? valor : 0;
}

export async function GET() {
  const { error } = await requireApiRole("admin");

  if (error) {
    return error;
  }

  try {
    const [uCount, mCount, cCount, bCount, sCount] = await Promise.all([
      db
        .select({
          count: sql<number>`cast(count(*) as integer)`,
        })
        .from(usuarios)
        .where(eq(usuarios.activo, true)),

      db
        .select({
          count: sql<number>`cast(count(*) as integer)`,
        })
        .from(medicos)
        .where(eq(medicos.activo, true)),

      db
        .select({
          count: sql<number>`cast(count(*) as integer)`,
        })
        .from(cursos)
        .where(eq(cursos.activo, true)),

      db
        .select({
          count: sql<number>`cast(count(*) as integer)`,
        })
        .from(publicaciones)
        .where(eq(publicaciones.activo, true)),

      db
        .select({
          count: sql<number>`cast(count(*) as integer)`,
        })
        .from(servicios)
        .where(eq(servicios.activo, true)),
    ]);

    return NextResponse.json({
      usuarios: obtenerConteo(uCount),
      medicos: obtenerConteo(mCount),
      cursos: obtenerConteo(cCount),
      blog: obtenerConteo(bCount),
      servicios: obtenerConteo(sCount),
    });
  } catch (error) {
    console.error("Error en dashboard stats:", error);

    return NextResponse.json(
      { error: "Error al obtener estadísticas del dashboard" },
      { status: 500 }
    );
  }
}