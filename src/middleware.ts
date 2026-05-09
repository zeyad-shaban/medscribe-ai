import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);

export default clerkMiddleware(async (auth, req) => {
  // not authorized
  const {userId} = await auth();
  const loggedIn = !!userId
  
  if (isProtectedRoute(req) && !loggedIn)
    return NextResponse.redirect(new URL("/", req.url))

  if (req.nextUrl.pathname == "/" && loggedIn)
    return NextResponse.redirect(new URL("/dashboard", req.url));
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
