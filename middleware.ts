import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC = ["/login", "/health", "/robots.txt", "/api/demo-login"];

export function middleware(req: NextRequest) {
  if (process.env.CAPTURE_OPEN === "1") {
    return NextResponse.next();
  }
  const { pathname } = req.nextUrl;
  if (PUBLIC.some((p) => pathname === p || pathname.startsWith("/health") || pathname.startsWith("/api/demo-login"))) {
    return NextResponse.next();
  }
  if (req.cookies.get("ricedax_demo")?.value === "ok") {
    return NextResponse.next();
  }
  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
