import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(request: NextRequest) {
  if (
    PUBLIC_FILE.test(request.nextUrl.pathname) ||
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/api") ||
    request.nextUrl.pathname === "/"
  ) {
    return NextResponse.next();
  }

  // TODO: aplicar regras de autorização multi-tenant baseadas na sessão
  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*", "/admin/:path*"],
};
