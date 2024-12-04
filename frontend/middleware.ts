import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Define protected routes that require authentication
const protectedRoutes = [
  "/",
  "/admin",
  "/profile",
  "/settings",
  // Add other protected routes here
];

// Define public routes that should be accessible without authentication
const publicRoutes = [
  "/login",
  "/register",
  "/img/*",
  // Add other public routes here
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path starts with /img/
  if (pathname.startsWith("/img/")) {
    return NextResponse.next();
  }
  // Allow public routes without authentication
  if (publicRoutes.includes(pathname)) {
    // If user is already logged in and tries to access login/register pages,
    // redirect them to dashboard
    const token = request.cookies.get("token")?.value;
    if (token) {
      try {
        // Verify the token
        const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
        await jwtVerify(token, secret);

        // If token is valid and user tries to access login page, redirect to dashboard
        return NextResponse.redirect(new URL("/", request.url));
      } catch (error) {
        // If token is invalid, remove it
        const response = NextResponse.next();
        response.cookies.delete("token");
        return response;
      }
    }
    return NextResponse.next();
  }

  // Check if the route requires authentication
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname.startsWith(route) || pathname === route
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;

  // If no token is present, redirect to login
  if (!token) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("token");
    return response;
  }

  try {
    // Verify the token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    await jwtVerify(token, secret);

    // If token is valid, allow the request
    return NextResponse.next();
  } catch (error) {
    // If token is invalid, redirect to login
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("token");
    return response;
  }
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
