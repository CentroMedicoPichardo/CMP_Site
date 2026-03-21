import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {

  const rol = request.cookies.get("rol")?.value;

  const { pathname } = request.nextUrl;

  /* RUTAS CLIENTE */
  if (pathname.startsWith("/client")) {

    if (rol !== "cliente") {
      return NextResponse.redirect(new URL("/acceder", request.url));
    }

  }

  /* RUTAS ADMIN */
  if (pathname.startsWith("/admin")) {

    if (rol !== "admin") {
      return NextResponse.redirect(new URL("/acceder", request.url));
    }

  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/client/:path*",
    "/admin/:path*",
  ],
};