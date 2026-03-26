// src/app/api/usuarios/[id]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { usuarios } from "@/lib/schema/index";
import { eq } from "drizzle-orm";
import { withAudit, getClientIp, getCurrentUserEmail } from "@/lib/db-audit";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const clientIp = getClientIp(request);
    const userEmail = await getCurrentUserEmail();

    console.log("🔵 PATCH - Actualizando usuario ID:", id);
    console.log("🔵 PATCH - Usuario que realiza el cambio:", userEmail);
    console.log("🔵 PATCH - IP:", clientIp);
    console.log("🔵 PATCH - Datos recibidos:", body);

    // Validar que rolId sea un número
    if (!body.rolId || isNaN(Number(body.rolId))) {
      return NextResponse.json(
        { error: "El rolId es requerido y debe ser un número" },
        { status: 400 }
      );
    }

    // Actualizar el rol del usuario con contexto de auditoría
    const actualizado = await withAudit(userEmail, clientIp, async () => {
      return await db
        .update(usuarios)
        .set({ rolId: body.rolId })
        .where(eq(usuarios.id, Number(id)))
        .returning();
    });

    if (actualizado.length === 0) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    console.log("🟢 PATCH - Usuario actualizado:", actualizado[0]);
    return NextResponse.json(actualizado[0]);
  } catch (error: any) {
    console.error("🔴 Error en PATCH usuario:", error);
    return NextResponse.json(
      { error: error.message || "Error interno al actualizar" },
      { status: 500 }
    );
  }
}