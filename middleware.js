import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedRoutes = ["/home", "/select-role"];

export async function middleware(req) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    const { pathname } = req.nextUrl;

    if (!protectedRoutes.some((route) => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    if (!token) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    if (pathname.startsWith("/select-role") && token?.role) {
        return NextResponse.redirect(new URL("/home", req.url));
    }

    if (pathname.startsWith("/home") && !token?.role) {
        return NextResponse.redirect(new URL("/select-role", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/home/:path*", "/select-role/:path*"],
};
