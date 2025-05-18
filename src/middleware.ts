import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the origin
  const origin = request.headers.get("origin") || "*";
  
  // Only run middleware on API routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    // Handle OPTIONS request for preflight
    if (request.method === "OPTIONS") {
      const response = new NextResponse(null, { status: 200 });
      response.headers.set("Access-Control-Allow-Origin", origin);
      response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
      response.headers.set("Access-Control-Max-Age", "86400");
      return response;
    }

    // Add CORS headers to the actual response
    const response = NextResponse.next();
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return response;
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};