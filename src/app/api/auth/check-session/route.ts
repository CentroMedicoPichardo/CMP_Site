// src/app/api/auth/check-session/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { ok: false, message: "No hay sesión activa" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        usuario: session.user,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { ok: false, message: "Error interno" },
      { status: 500 }
    );
  }
}