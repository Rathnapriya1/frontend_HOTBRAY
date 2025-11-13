import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // Run Clerk middleware for all routes except static assets and Next internals
    "/((?!_next|.*\\..*).*)",
  ],
};
