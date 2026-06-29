// src/app/api/roles/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { roles } from "@/lib/schema/index";
import { asc } from "drizzle-orm";
import { requireApiRole } from "@/lib/auth";

export async function GET() {
  const { error } = await requireApiRole("admin");

  if (error) {
    return error;
  }

  try {
    const data = await db
      .select({
        id: roles.id,
        nombre: roles.nombre,
      })
      .from(roles)
      .orderBy(asc(roles.id));

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error en GET roles:", error);

    return NextResponse.json(
      { error: "No se pudieron cargar los roles" },
      { status: 500 }
    );
  }
}