import { auth } from "@/lib/auth";

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Allow auth routes, login page, static assets, and public API routes
  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/trpc") ||
    pathname.startsWith("/api/weather") ||
    pathname.startsWith("/api/currency") ||
    pathname === "/login" ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname === "/theme-init.js" ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|webp|json|xml|txt|webmanifest)$/)
  ) {
    return;
  }

  // Block unauthenticated API requests with 401
  if (pathname.startsWith("/api/") && !req.auth) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Redirect unauthenticated users to login
  if (!req.auth) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return Response.redirect(loginUrl);
  }
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
