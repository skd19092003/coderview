/**
 * Users Module - User Management and Authentication Integration
 * 
 * This file handles user-related operations and synchronization with Clerk authentication.
 * Users are automatically created when they sign up through Clerk, and this module
 * ensures the Convex database stays in sync with Clerk's user data.
 * 
 * Key Features:
 * - Automatic user creation via webhooks
 * - User data synchronization
 * - Duplicate prevention
 * - Role-based user management (candidate, recruiter)
 * 
 * Database Schema:
 * - Users are linked to Clerk via clerkId
 * - Each user has a role (candidate or recruiter)
 * - Profile information (name, email, image) is synced from Clerk
 * - Indexed by clerkId for fast lookups
 */

// Automatic Integration
// When you use ConvexProviderWithClerk, Convex automatically:
// Gets the user's authentication token from Clerk
// Passes it to your Convex functions
// Makes ctx.auth available in your functions

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Sync User Mutation
 * 
 * Creates or updates user records in Convex database when users sign up through Clerk.
 * This mutation is called automatically by the Clerk webhook when a new user is created.
 * 
 * @param clerkId - Unique identifier from Clerk authentication
 * @param email - User's email address
 * @param name - User's display name
 * @param image - Optional profile image URL
 * 
 * Flow:
 * 1. User signs up in Clerk
 * 2. Clerk webhook calls this mutation
 * 3. Check if user already exists (prevent duplicates)
 * 4. Create new user or skip if exists
 * 5. Assign default role as "candidate"
 * 
 * Duplicate Prevention:
 * - Uses database index for fast lookups
 * - Checks by clerkId before creating
 * - Returns existing user ID if found
 * - Prevents multiple user records for same Clerk user
 * 
 * Role Assignment:
 * - New users are assigned "candidate" role by default
 * - Role can be updated later through admin interface
 * - Supports "candidate" and "recruiter" roles
 */
export const syncUser = mutation({
    args: {
        clerkId: v.string(),           // Clerk's unique user identifier
        email: v.string(),             // User's email address
        name: v.string(),              // User's display name
        image: v.optional(v.string()), // Optional profile image URL
    },
    handler: async (ctx, args) => {
        // Use the database index for efficient user lookup
        // This prevents duplicate user creation
        const existingUser = await ctx.db.query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .first();
        
        // If user already exists, return the existing user ID
        // This prevents duplicate user records
        if(existingUser) {
            console.log("User already exists:", existingUser._id);
            return existingUser._id;
        }
        
        // If user doesn't exist, create new user record
        console.log("Creating new user with clerkId:", args.clerkId);
        const newUserId = await ctx.db.insert("users", { 
            ...args,                    // Spread all provided arguments
            role: "candidate"           // Assign default role
        });
        console.log("New user created with ID:", newUserId);
        return newUserId;
    }
});

export const getUsers = query({//query build with access to auth thru ctx
    handler: async (ctx: any) => {
        const identity = await ctx.auth.getUserIdentity(); 
        //this is going to be the authentication , here auth refers to clerk
        if(!identity){ 
            throw new Error("Unauthorized, user is not authenticated");
        }
        //fetch all users from the database
        const users = await ctx.db.query("users").collect();
        return users;
    }
})

export const getUserByClerkId = query({
    args: { clerkId: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db.query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
        .first();
        return user;
    }
})

