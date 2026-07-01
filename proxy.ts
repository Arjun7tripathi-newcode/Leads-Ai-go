import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

// Next.js 16 requires proxy.ts to export an explicit function named `proxy`.
// Re-exports of constants are not recognized by the static analyzer.
export async function proxy(request: NextRequest) {
  // @ts-expect-error – NextAuth's auth() accepts NextRequest in proxy context
  return auth(request);
}

export const config = {
  // Protect only dashboard routes. Public routes (/, /login, /signup, /api) pass through.
  matcher: ["/dashboard/:path*"],
};
