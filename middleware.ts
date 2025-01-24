import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AuthActions } from "@/app/(auth)/utils";

export async function middleware(request: NextRequest) {
  const { isTokenExpired } = AuthActions();
  const cookieStore = request.cookies;
  const accessToken = cookieStore.get("accessToken");

  if (request.nextUrl.pathname === "/login") {
    return NextResponse.next();
  }

  if (!accessToken || isTokenExpired(accessToken.value)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|auth|_next/static|_next/image|.*\\.png$).*)"],
};
