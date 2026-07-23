import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();

  return NextResponse.json({
    autenticado: Boolean(session?.user),
    usuario: session?.user
      ? {
          id: session.user.id,
          nombre: session.user.nombre,
          rol: session.user.rol,
        }
      : null,
  });
}
