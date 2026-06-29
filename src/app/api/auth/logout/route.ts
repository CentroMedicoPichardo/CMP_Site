// src/app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({
    message: "Sesión cerrada correctamente",
  });

  const cookieOptions = {
    path: "/",
    maxAge: 0,
  };

  response.cookies.set(AUTH_COOKIE_NAME, "", {
    ...cookieOptions,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  response.cookies.set("token", "", cookieOptions);
  response.cookies.set("rol", "", cookieOptions);
  response.cookies.set("user", "", cookieOptions);

  return response;
}