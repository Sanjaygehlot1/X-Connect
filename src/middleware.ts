'use server'
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const url = request.nextUrl;
    if (
      token &&
      (url.pathname.startsWith('/signin') ||
        url.pathname.startsWith('/signup') ||
        url.pathname.startsWith('/verify') ||
        url.pathname === '/')
    ) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  
    if (!token && url.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/signin', request.url));
    }
  
    return NextResponse.next();
  }

export const config = { 
    matcher: [
        "/dashboard",
        "/",
        "/signup",
        "/signin",
        "/verify/:path*"
    ]
 }