import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { usuarios, roles } from "@/lib/schema/index";
import { eq, asc } from "drizzle-orm";

export async function GET() {
  try {
    // 🛡️ Traemos usuarios con el nombre de su rol (Join)
    // NO traemos la contraseña por seguridad
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
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}