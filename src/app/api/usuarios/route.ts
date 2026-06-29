// src/app/api/usuarios/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { usuarios, roles } from "@/lib/schema/index";
import { eq, asc } from "drizzle-orm";
import { requireApiRole } from "@/lib/auth";

export async function GET() {
  const { error } = await requireApiRole("admin");

  if (error) {
    return error;
  }

  try {
    const data = await db
      .select({
        id: usuarios.id,
        nombre: usuarios.nombre,
        apellidoPaterno: usuarios.apellidoPaterno,
        apellidoMaterno: usuarios.apellidoMaterno,
        correo: usuarios.correo,
        telefono: usuarios.telefono,
        rolId: usuarios.rolId,
        rolNombre: roles.nombre,
        activo: usuarios.activo,
      })
      .from(usuarios)
      .leftJoin(roles, eq(usuarios.rolId, roles.id))
      .orderBy(asc(usuarios.id));

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error en GET usuarios:", error);

    return NextResponse.json(
      { error: "Error interno al obtener usuarios" },
      { status: 500 }
    );
  }
}