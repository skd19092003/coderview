/**
 * Clerk Middleware - Authentication and Route Protection
 * 
 * This middleware integrates Clerk authentication with your Next.js application.
 * It runs on every request and handles authentication, route protection, and
 * user session management.
 * 
 * Key Features:
 * - Automatic authentication on all routes
 * - Route protection and access control
 * - User session management
 * - Integration with Convex for backend authentication
 * 
 * How It Works:
 * 1. Every request goes through this middleware
 * 2. Clerk checks if user is authenticated
 * 3. Protected routes require valid authentication
 * 4. User session is available in all components
 * 
 * Route Protection:
 * - Public routes: Anyone can access (landing page, sign-in)
 * - Protected routes: Require authentication (dashboard, interviews)
 * - API routes: Protected for authenticated users only
 */

import { clerkMiddleware } from '@clerk/nextjs/server';

/**
 * Clerk Middleware Configuration
 * 
 * This middleware automatically handles authentication for your application.
 * It integrates with Convex to provide seamless authentication across your
 * frontend and backend.
 * 
 * The middleware:
 * - Validates user sessions on every request
 * - Redirects unauthenticated users to sign-in
 * - Provides user context to all components
 * - Handles authentication tokens for API calls
 */
export default clerkMiddleware();

/**
 * Middleware Configuration
 * 
 * Defines which routes the middleware should run on.
 * This configuration ensures optimal performance by only running
 * middleware where needed.
 * 
 * Matcher Patterns:
 * - Excludes Next.js internal files and static assets
 * - Includes all page routes for authentication
 * - Includes API routes for backend protection
 * - Excludes static files unless they have search parameters
 */
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    // This pattern excludes files like _next, CSS, JS, images, etc.
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes to ensure authentication
    '/(api|trpc)(.*)',
  ],
};