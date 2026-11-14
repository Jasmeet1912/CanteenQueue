import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Optimistic auth check (cookie only). Real checks also happen in each page/action.
const key = new TextEncoder().encode(process.env.AUTH_SECRET ?? "dev-only-secret-change-me");

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const token = req.cookies.get("session")?.value;

  let role: string | null = null;
  if (token) {
    try {
      role = (await jwtVerify(token, key)).payload.role as string;
    } catch {}
  }

  const needsLogin = ["/checkout", "/orders", "/vendor", "/counter"].some((p) => path.startsWith(p));
  const vendorOnly = path.startsWith("/vendor") || path.startsWith("/counter");

  if (needsLogin && !role) return NextResponse.redirect(new URL("/login", req.url));
  if (vendorOnly && role !== "VENDOR") return NextResponse.redirect(new URL("/", req.url));
  return NextResponse.next();
}

export const config = {
  matcher: ["/checkout/:path*", "/orders/:path*", "/vendor/:path*", "/counter/:path*"],
};
