// Both Clerk and Convex have provider components that are required to provide authentication
// and client context.
// Typically, you'd replace <ConvexProvider> with <ConvexProviderWithClerk>,
// but with Next.js App Router, things are a bit more complex.
// <ConvexProviderWithClerk> calls ConvexReactClient() to get Convex's client,
//  so it must be used in a Client Component. Your app/layout.tsx, where you would use <ConvexProviderWithClerk>,
//  is a Server Component, and a Server Component cannot contain Client Component code.
//  To solve this, you must first create a wrapper Client Component around <ConvexProviderWithClerk>.
/**
 * This file defines a client-side provider component that wraps your application
 * with both Clerk (for authentication) and Convex (for real-time backend) providers.
 * 
 * The reason for this setup is that Next.js App Router's root layout is a Server Component,
 * but both Clerk and Convex require Client Components for their context providers.
 * 
 * This wrapper ensures that authentication and Convex's client context are available
 * to all child components in your app.
 */

"use client"; // This directive tells Next.js that this file is a Client Component.

/**
 * ReactNode is a type from React that represents any node that can be rendered:
 * strings, numbers, JSX, fragments, etc.
 */
import { ReactNode } from "react";

/**
 * ConvexReactClient is the main client for interacting with your Convex backend.
 * It is initialized with your Convex deployment's URL, which is provided via an environment variable.
 * 
 */
import { ConvexReactClient } from "convex/react";

/**
 * ConvexProviderWithClerk is a special provider that integrates Convex with Clerk authentication.
 * It ensures that Convex queries and mutations are automatically authenticated with Clerk's session.
 * 
 */
import { ConvexProviderWithClerk } from "convex/react-clerk";

/**
 * ClerkProvider is the main context provider for Clerk authentication.
 * It should wrap your app to provide authentication state and helpers.
 * 
 * useAuth is a Clerk hook that provides authentication information and helpers.
 * It is passed to ConvexProviderWithClerk so Convex can use Clerk's authentication.
 * 
 */
import { ClerkProvider, useAuth } from "@clerk/nextjs";

/**
 * Create a single instance of ConvexReactClient.
 * 
 * process.env.NEXT_PUBLIC_CONVEX_URL is an environment variable that should contain
 * the URL of your Convex deployment. The exclamation mark (!) tells TypeScript that
 * this value will always be defined.
 */
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

/**
 * ConvexClientProvider is a React component that wraps its children with both
 * ClerkProvider and ConvexProviderWithClerk.
 * 
 * @param children - The React children that will have access to Clerk and Convex contexts.
 * 
 * The ClerkProvider is given the publishableKey from your environment variables.
 * The ConvexProviderWithClerk is given the Convex client and the useAuth hook from Clerk.
 * 
 * This ensures that all child components can use both Clerk and Convex hooks and context.
 */
export default function ConvexClientProvider({children}: {children: ReactNode;}) {
  // The providers must be returned as part of the component's JSX.
  // Note: The original code was missing a return statement.
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}


// The Flow:
// User logs in → Clerk creates a session
// Frontend makes Convex call → Convex gets Clerk token automatically
// Convex function runs → ctx.auth.getUserIdentity() returns user info
// You can use the user info → identity.subject is the Clerk user ID
// Why This Works:
// The ConvexProviderWithClerk component automatically handles the authentication flow between Clerk and Convex. 
// You don't need to manually pass tokens or handle authentication - it's all done behind the scenes.
