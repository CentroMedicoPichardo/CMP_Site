// src/app/api/auth/check-email/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { usuariosInSeguridad } from "@/lib/schema/index"; // 👈 Importar correctamente
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email requerido" }, { status: 400 });
    }

    const existingUser = await db.select()
      .from(usuariosInSeguridad)
      .where(eq(usuariosInSeguridad.correo, email));

    return NextResponse.json({
      disponible: existingUser.length === 0,
    });
  } catch (error) {
    console.error("Error verificando email:", error);
    return NextResponse.json(
      { error: "Error al verificar email" },
      { status: 500 }
    );
  }
}