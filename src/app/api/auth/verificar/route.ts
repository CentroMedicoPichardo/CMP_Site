// src/app/api/auth/verificar/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({
        loggedIn: false,
      });
    }

    return NextResponse.json({
      loggedIn: true,
      usuario: session.user,
    });
  } catch {
    return NextResponse.json({
      loggedIn: false,
    });
  }
}