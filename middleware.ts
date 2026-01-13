import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;

  const protectedRoutes = ["/dashboard", "/skills", "/profile"];
  const authRoutes = ["/login", "/register"];

  const { pathname } = req.nextUrl;

  const isProtected = protectedRoutes.some((r) => pathname.startsWith(r));
  const isAuth = authRoutes.some((r) => pathname.startsWith(r));

  // Protected routes
  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Login or Register while authenticated
  if (isAuth && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/skills/:path*", "/profile/:path*", "/login", "/register"],
};
