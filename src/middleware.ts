import { NextResponse } from "next/server";

/**
 * Middleware to add required security headers for WebContainer to work
 * WebContainer uses SharedArrayBuffer which requires these headers
 */
export function middleware() {
  const response = NextResponse.next();

  // Add security headers for SharedArrayBuffer support
  response.headers.set("Cross-Origin-Embedder-Policy", "require-corp");
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");

  return response;
}

// Apply middleware to all routes
export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
