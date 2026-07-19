import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getModuleForPath, canAccess } from "@/lib/rbac";

const protectedRoutes = [
  "/dashboard", "/students", "/teachers", "/fees", "/results",
  "/attendance", "/reports", "/notifications", "/settings", "/users",
  "/parent", "/classes", "/subjects", "/exams", "/scholarships",
  "/roles", "/announcements",
];

const authRoutes = ["/login", "/forgot-password", "/reset-password"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isProtectedRoute && session) {
    const module = getModuleForPath(pathname);
    if (module && !canAccess(session.user.role, module)) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
