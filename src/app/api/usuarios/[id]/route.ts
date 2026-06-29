// src/app/api/usuarios/[id]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { usuarios, roles } from "@/lib/schema/index";
import { eq } from "drizzle-orm";
import { withUserEmail } from "@/lib/db-with-user";
import { requireApiRole } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireApiRole("admin");

  if (error || !session) {
    return error;
  }

  try {
    const { id } = await params;
    const usuarioId = Number(id);

    if (!Number.isFinite(usuarioId) || usuarioId <= 0) {
      return NextResponse.json(
        { error: "El ID del usuario no es válido" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const rolId = Number(body.rolId);

    if (!Number.isFinite(rolId) || rolId <= 0) {
      return NextResponse.json(
        { error: "El rolId es requerido y debe ser un número válido" },
        { status: 400 }
      );
    }

    const rolExiste = await db.query.roles.findFirst({
      where: eq(roles.id, rolId),
    });

    if (!rolExiste) {
      return NextResponse.json(
        { error: "El rol seleccionado no existe" },
        { status: 400 }
      );
    }

    const userEmail = session.user.correo;

    const actualizado = await withUserEmail(userEmail, async () => {
      return await db
        .update(usuarios)
        .set({ rolId })
        .where(eq(usuarios.id, usuarioId))
        .returning({
          id: usuarios.id,
          nombre: usuarios.nombre,
          apellidoPaterno: usuarios.apellidoPaterno,
          apellidoMaterno: usuarios.apellidoMaterno,
          correo: usuarios.correo,
          telefono: usuarios.telefono,
          rolId: usuarios.rolId,
          activo: usuarios.activo,
        });
    });

    if (actualizado.length === 0) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(actualizado[0]);
  } catch (error) {
    console.error("Error en PATCH usuario:", error);

    return NextResponse.json(
      { error: "Error interno al actualizar usuario" },
      { status: 500 }
    );
  }
}