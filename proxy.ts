/* proxy.ts */

import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { jwtVerify } from "jose";

type UserJWTPayload = {
  id: string;
  email: string;
  role: "CLIENT" | "ADMIN" | "SUPER_ADMIN" | "MASTER";
};

if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET não configurado.");

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

/* FUNCTION TO EXTRACT AND VALIDATE JWT PAYLOAD */
async function getPayload(req: NextRequest): Promise<UserJWTPayload | null> {
  const token = req.cookies.get("token")?.value;
  
  if (!token) 
    return null;

  try {
    const { payload } = await jwtVerify(token, secret);

    if (typeof payload.id !== "string" || 
        typeof payload.email !== "string" || 
        (payload.role !== "CLIENT" && 
          payload.role !== "ADMIN" && 
          payload.role !== "SUPER_ADMIN" &&
          payload.role !== "MASTER"
        ))
      return null;

    return {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };
  } catch {
    return null;
  }
}

/* PROTECTED ROUTES CONFIGURATION */
const routeProtection = {
  /* API ROUTES THAT REQUIRE AUTHENTICATION (USER OR ADMIN) */
  apiAuthenticated: [
    "/api/passenger",
    "/api/profile",
  ],
  
  /* API ROUTES THAT REQUIRE ADMIN ROLE */
  apiAdminOnly: [
    "/api/events/[id]",
    "/api/events/active",
    "/api/events/create",
    "/api/admin/",
  ],

  apiMasterOnly: [
    "/api/events/active",
    "/api/events/create",
    "/api/master/",
  ],
  
  /* PUBLIC API ROUTES (NO AUTHENTICATION REQUIRED) */
  apiPublic: [
    "/api/auth/admin/login",
    "/api/auth/master/login",
    "/api/auth/master/register",
    "/api/auth/client/login",
    "/api/auth/client/register",
    "/api/auth/logout",
    "/api/auth/password",
    "/api/events",
  ],

  /* CLIENT PAGES THAT REQUIRE AUTHENTICATION (USER OR ADMIN) */
  pagesAuthenticated: [
    "/client/checkout",
    "/client/my-events",
    "/client/companions",
    "/client/payments",
    "/client/password/reset-password",
    "/client/profile",
  ],

  /* ALL ADMIN PANEL PAGES ARE ADMIN ONLY */
  pagesAdminOnly: [
    "/admin",
  ],

  pagesMasterOnly: [
    "/master",
  ],

  /* PUBLIC CLIENT PAGES (NO AUTHENTICATION REQUIRED) */
  pagesPublic: [
    "/admin/login",
    "/master/login",
    "/master/register",
    "/master/password/forgot-password",
    "/client/login",
    "/client/register",
    "/client/password/forgot-password",
    "/client/events",
  ]
};

/* CHECK IF API ROUTE REQUIRES AUTHENTICATION */
function apiRequiresAuth(pathname: string): boolean {
  return routeProtection.apiAuthenticated.some(route => pathname.startsWith(route));
};

/* CHECK IF API ROUTE IS ADMIN ONLY */
function apiRequiresAdmin(pathname: string): boolean {
  return routeProtection.apiAdminOnly.some(route => pathname.startsWith(route));
};

function apiRequiresMaster(pathname: string): boolean {
  return routeProtection.apiMasterOnly.some(route => pathname.startsWith(route));
};

/* CHECK IF IT IS A PUBLIC API ROUTE */
function isPublicApiRoute(pathname: string): boolean {
  return routeProtection.apiPublic.some(route => pathname.startsWith(route));
};

/* CHECK IF PAGE REQUIRES AUTHENTICATION */
function pageRequiresAuth(pathname: string): boolean {
  return routeProtection.pagesAuthenticated.some(route => pathname.startsWith(route));
};

/* CHECK IF PAGE IS ADMIN ONLY */
function pageRequiresAdmin(pathname: string): boolean {
  if (pathname.startsWith("/admin/login")) return false;
  return routeProtection.pagesAdminOnly.some(route => pathname.startsWith(route));
};

function pageRequiresMaster(pathname: string): boolean {
  if (pathname.startsWith("/master/login")) return false;
  return routeProtection.pagesMasterOnly.some(route => pathname.startsWith(route));
};

/* CHECK IF PAGE IS PUBLIC */
function isPublicPage(pathname: string): boolean {
  return routeProtection.pagesPublic.some(route => pathname.startsWith(route));
};

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  /* ========== PAGES ROUTE PROTECTION ========== */

  /* ALLOW PUBLIC PAGES */
  if (isPublicPage(pathname)) return NextResponse.next();
  
  /* FULL ADMIN PANEL PROTECTION */
  if (pageRequiresAdmin(pathname)) {
    const user = await getPayload(req);

    if (!user) return NextResponse.redirect(new URL("/admin/login", req.url));

    if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") return NextResponse.redirect(new URL("/client", req.url));

    return NextResponse.next();
  };

  /* FULL MASTER PANEL PROTECTION */
  if (pageRequiresMaster(pathname)) {
    const user = await getPayload(req);

    if (!user) return NextResponse.redirect(new URL("/master/login", req.url));

    if (user.role !== "MASTER") return NextResponse.redirect(new URL("/client", req.url));

    return NextResponse.next();
  };

  /* AUTHENTICATED CLIENT PAGES PROTECTION */
  if (pageRequiresAuth(pathname)) {
    const user = await getPayload(req);
    if (!user) return NextResponse.redirect(new URL("/client/login", req.url));

    return NextResponse.next();
  };

  /* ========== API ROUTE PROTECTION ========== */

  /* ALLOW PUBLIC API ROUTES FOR GET REQUESTS */
  if (isPublicApiRoute(pathname) && req.method === "GET") return NextResponse.next();

  /* SPECIAL PROTECTION FOR PRODUCTS (POST, PUT, DELETE ADMIN ONLY) */
  if (pathname.startsWith("/api/products") && req.method !== "GET") {
    const user = await getPayload(req);

    if (!user) return NextResponse.json({ error: "Authentication Required." }, { status: 401 });

    if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") 
      return NextResponse.json({ error: "Only Administrators can modify products." }, { status: 403 });

    return NextResponse.next();
  };

  /* PROTECTION FOR API ROUTES THAT REQUIRE ADMIN */
  if (apiRequiresAdmin(pathname)) {
    const user = await getPayload(req);

    if (!user) return NextResponse.json({ error: "Authentication Required." }, { status: 401 });

    if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") 
      return NextResponse.json({ error: "ACCESS DENIED. ADMIN PRIVILEGES REQUIRED." }, { status: 403 });

    return NextResponse.next();
  };

  /* PROTECTION FOR API ROUTES THAT REQUIRE MASTER */
  if (apiRequiresMaster(pathname)) {
    const user = await getPayload(req);

    if (!user) return NextResponse.json({ error: "Authentication Required." }, { status: 401 });

    if (user.role !== "MASTER") 
      return NextResponse.json({ error: "ACCESS DENIED. MASTER PRIVILEGES REQUIRED."}, { status: 403 });

    return NextResponse.next();
  };

  /* PROTECTION FOR API ROUTES THAT REQUIRE AUTHENTICATION ONLY */
  if (apiRequiresAuth(pathname)) {
    const user = await getPayload(req);

    if (!user) return NextResponse.json({ error: "Authentication Required." }, { status: 401 });

    return NextResponse.next();
  };

  return NextResponse.next();
};

export const config = {
  matcher: [
    /* FULL ADMIN PANEL PROTECTION */
    "/admin/:path*",
    
    /* AUTHENTICATED CLIENT PAGES PROTECTION */
    "/client/profile/:path*",
    "/client/payments/:path*",
    
    /* API ROUTES PROTECTION */
    "/api/auth/:path*",
    "/api/trips/:path*",
    "/api/profile/:path*",
    "/api/admin/:path*",
  ]
};