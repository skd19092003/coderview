/**
 * HTTP Actions for Convex - Webhook Handler for Clerk Integration
 * 
 * This file handles HTTP requests from external services (like Clerk) to your Convex backend.
 * It's used to synchronize user data between Clerk (authentication) and Convex (database).
 * 
 * Key Concepts:
 * - HTTP Actions: Convex functions that can receive HTTP requests
 * - Webhooks: Automated HTTP requests sent by external services when events occur
 * - Svix: A service that handles webhook delivery and verification
 * - Clerk Integration: Syncs user creation events with your Convex database
 */ 

import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
// Import Svix for webhook verification - ensures requests are really from Clerk
import { Webhook } from "svix";
// Import Clerk's webhook event types for type safety
import { WebhookEvent } from "@clerk/nextjs/server";
// Import Convex API to call our database functions
import { api } from "./_generated/api";

// Create an HTTP router to handle different webhook endpoints
const http = httpRouter();

/**
 * Clerk Webhook Endpoint
 * 
 * This endpoint receives webhook notifications from Clerk when user events occur.
 * The webhook URL is: https://your-convex-deployment.convex.site/clerk-webhook
 * 
 * Flow:
 * 1. User signs up in Clerk
 * 2. Clerk sends webhook to this endpoint
 * 3. We verify the webhook is authentic using Svix
 * 4. We create/update user in Convex database
 * 5. User can now use your app with full functionality
 */
http.route({
  path: "/clerk-webhook", // The URL path that Clerk will call
  method: "POST", // Only accept POST requests
  handler: httpAction(async (ctx: any, request: any) => {
    // Step 1: Get the webhook secret from environment variables
    // This secret is used to verify that the request is really from Clerk
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if(!webhookSecret){
        throw new Error("missing clerk webhook secret environment variable");
    }

    // Step 2: Extract Svix headers from the request
    // These headers are used to verify the webhook signature
    const svix_id = request.headers.get("svix-id");
    const svix_timestamp = request.headers.get("svix-timestamp");
    const svix_signature = request.headers.get("svix-signature");
    
    // Step 3: Validate that all required headers are present
    if(!svix_id || !svix_timestamp || !svix_signature){
       return new Response("missing svix headers", {status: 400});
    }

    // Step 4: Parse the webhook payload
    const payload = await request.json();
    const body = JSON.stringify(payload);

    // Step 5: Create Svix webhook instance for verification
    const wh = new Webhook(webhookSecret);
    
    // Step 6: Verify the webhook signature to ensure it's from Clerk
    let evt: WebhookEvent;
    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent;
    }catch(err){
        console.error(err);
        return new Response("invalid svix payload", {status: 400});
    } 

    // Step 7: Handle different webhook event types
    const eventType = evt.type;
    console.log("Webhook event type:", eventType); // Log for debugging
    
    // Step 8: Handle user creation events
    if(eventType === "user.created"){
        // Extract user data from the webhook payload
        const {id, email_addresses, first_name, last_name, image_url} = evt.data;
        
        // Get the primary email address (first one in the array)
        const email = email_addresses[0].email_address;
        
        // Combine first and last name, handle missing names gracefully
        const name = `${first_name || ""} ${last_name || ""}`.trim();
        
        console.log("Creating user:", { id, email, name, image_url }); // Log for debugging
         
        // Step 9: Create user in Convex database
        try{
            // Call our Convex mutation to sync user data
            const result = await ctx.runMutation(api.users.syncUser, {
               clerkId: id,        // Clerk's user ID
                email,             // User's email
                name,              // User's display name
                image: image_url,  // User's profile image
            });
            console.log("User created successfully:", result); // Log for debugging
        }catch(err){
            console.error("Error creating user:", err);
            return new Response("error creating user", {status: 500});
        }
    }

    // Step 10: Return success response
    return new Response("webhook processed successfully", {status: 200});
  }),
});

// Export the HTTP router so Convex can use it
export default http;