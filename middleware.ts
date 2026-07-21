import { NextResponse, type NextRequest } from "next/server";
import { decode } from "@auth/core/jwt";
import { getModuleForPath, canAccess } from "@/lib/rbac-core";

const protectedRoutes = [
  "/dashboard", "/students", "/teachers", "/fees", "/results",
  "/attendance", "/reports", "/notifications", "/settings", "/users",
  "/parent", "/classes", "/subjects", "/exams", "/scholarships",
  "/roles", "/announcements",
];

const authRoutes = ["/login", "/forgot-password", "/reset-password"];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (!isProtectedRoute && !isAuthRoute) {
    return NextResponse.next();
  }

  const token = await getTokenFromCookies(request);

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isProtectedRoute && token) {
    const role = (token as Record<string, unknown>).role as string | undefined;
    if (role) {
      const module = getModuleForPath(pathname);
      if (module && !canAccess(role, module)) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  }

  return NextResponse.next();
}

async function getTokenFromCookies(request: NextRequest): Promise<unknown | null> {
  const cookieHeader = request.headers.get("cookie") ?? "";

  const tokenStr = extractCookie(cookieHeader, "__Secure-authjs.session-token")
    ?? extractCookie(cookieHeader, "authjs.session-token");

  if (!tokenStr) return null;

  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
  if (!secret) return null;

  try {
    const salt = cookieHeader.includes("__Secure-authjs.session-token")
      ? "__Secure-authjs.session-token"
      : "authjs.session-token";
    return await decode({ token: tokenStr, secret, salt });
  } catch {
    return null;
  }
}

function extractCookie(cookieHeader: string, name: string): string | null {
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
