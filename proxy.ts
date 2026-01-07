// proxy.ts
import { auth } from "@/lib/auth";

export default auth((req) => {
  // req.auth akan ada kalau user sudah login (session valid)
  if (!req.auth) {
    const loginUrl = new URL("/sign-in", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.href);
    return Response.redirect(loginUrl);
  }
});

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/settings/:path*"],
};
