import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AuthActions } from "@/app/(auth)/utils";
import { protectedRoutes, roleBasedRoutes, roles, urls } from "./types/const";


export async function middleware(request: NextRequest) {
  const { isTokenExpired, removeTokens, logout } = AuthActions();
  const cookieStore = request.cookies;
  const accessToken = cookieStore.get("accessToken");
  const role = cookieStore.get("userRoleToken");
  const { pathname } = request.nextUrl;

  if (pathname === urls.login) {
    removeTokens();
    return NextResponse.next();
  }

  if (!accessToken || isTokenExpired(accessToken.value) || !role) {
    logout();
    return NextResponse.redirect(new URL(urls.login, request.url));
  }

  const allowedRoutes = roleBasedRoutes[role.value] || [];

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    // if (pathname === urls.dashboard && role.value !== roles.client) return NextResponse.redirect(new URL(urls.espace_client, request.url));


    const hasAccess = allowedRoutes.some((route) => pathname.startsWith(route));
    if (!hasAccess) {
      return NextResponse.redirect(new URL(urls.not_fount, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/espace-client/:path*"],
};
