/**
 * Interviews Module - Core Interview Management System
 * 
 * This file handles all interview-related operations for the platform.
 * Interviews are the core feature that connects candidates with recruiters.
 *  
 * Key Features:
 * - Create new interviews
 * - Retrieve interviews (all, user-specific, by ID)
 * - Update interview status and details
 * - Real-time interview management
 * - Automatic user association and permissions
 * 
 * Database Schema:
 * - Interviews are linked to candidates and recruiters
 * - Status tracking (scheduled, in-progress, completed)
 * - Timestamps for start and end times
 * - Real-time updates for all participants
 */

import { mutation, query } from "./_generated/server";
import { v } from "convex/values"; //validator

/**
 * Get All Interviews Query
 * 
 * Retrieves all interviews in the system.
 * Used for admin dashboards and overview pages.
 * 
 * @returns Array of all interview objects
 * 
 * Performance:
 * - Returns all interviews (use with caution for large datasets)
 * - Real-time updates when interviews are created/updated
 * - Consider pagination for production use
 */
export const getAllInterviews = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if(!identity){
            throw new Error("Unauthorized");
        }
        const interviews = await ctx.db.query("interviews").collect();
        return interviews;
    }
});

/**
 * Get My Interviews Query
 * 
 * Retrieves interviews for the current authenticated user.
 * Shows different interviews based on user role (candidate vs recruiter).
 * 
 * @returns Array of interviews where current user is participant
 * 
 * User Experience:
 * - Candidates see interviews they're invited to
 * - Recruiters see interviews they've created
 * - Real-time updates for status changes
 */
export const getMyInterviews = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if(!identity){
            throw new Error("Unauthorized");
        }
        const interviews = await ctx.db.query("interviews")
        .withIndex("by_candidate_id", (q) => q.eq("candidateId", identity.subject))
        .collect();
        return interviews;
    }
});

export const getInterviewByStreamCallId = query({
    args: { streamCallId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db.query("interviews")
        .withIndex("by_stream_call_id", (q) => q.eq("streamCallId", args.streamCallId))
        .first();
    }
});

/**
 * Create Interview Mutation
 * 
 * Allows recruiters to create new interviews and assign candidates.
 * This mutation automatically associates the interview with the current user.
 * 
 * @param title - Interview title/description
 * @param candidateId - Clerk ID of the candidate
 * @param startTime - Scheduled start time (timestamp)
 * @param duration - Interview duration in minutes
 * 
 * Flow:
 * 1. Recruiter creates interview
 * 2. Interview is saved with "scheduled" status
 * 3. Real-time updates notify all participants
 * 4. Candidate can view and join the interview
 */
export const createInterview = mutation({
    args: {
        title: v.string(),
        description: v.optional(v.string()),
        startTime: v.number(),
        status: v.string(),
        streamCallId: v.string(),
        candidateId: v.string(),
        interviewerIds: v.array(v.string()),
    },
    handler: async (ctx, args) => {
       const identity = await ctx.auth.getUserIdentity();
       if(!identity){
        throw new Error("Unauthorized");
       }
       return await ctx.db.insert("interviews", {
        ...args,
        interviewerIds: args.interviewerIds.join(","), // Convert array to comma-separated string
       });
    }
});

/**
 * Update Interview Status Mutation
 * 
 * Allows participants to update interview status (scheduled → in-progress → completed).
 * Automatically sets end time when interview is completed.
 * 
 * @param id - Interview ID to update
 * @param status - New status (scheduled, in-progress, completed)
 * 
 * Status Flow:
 * - scheduled: Interview is created but not started
 * - in-progress: Interview is currently happening
 * - completed: Interview is finished (endTime is set automatically)
 * 
 * Real-time Updates:
 * - All participants receive immediate status updates
 * - UI automatically reflects new status
 * - End time is recorded for completed interviews
 */
export const updateInterview = mutation({
        args: {
            id: v.id("interviews"),
            status: v.string(),
        },
        handler: async (ctx, args) => {
            const identity = await ctx.auth.getUserIdentity();
            if(!identity){
                throw new Error("Unauthorized");
            }
            return await ctx.db.patch(args.id, {
                status: args.status,
                ...(args.status === "completed" ? {endTime: Date.now()} : {}),
                // Why This Logic?
                // During interview: Only track status changes
                // When completed: Also record the exact completion time
                // Automatic: No need to manually set endTime - it's automatic when status becomes "completed"
            });
        }
    });


        // QUERIES - For Reading Data
        // When to Use Queries:
        // Reading data from the database
        // Fetching user information, lists, details
        // Searching for specific records
        // Getting real-time updates
        // MUTATIONS - For Writing Data
        // When to Use Mutations:
// Creating new records
// Updating existing records
// Deleting records
// Modifying database state





// // When a user is logged in, this returns: by ctx.auth.getUserIdentity()

//     subject: "user_2abc123def456", // Clerk user ID
//     tokenIdentifier: "user_2abc123def456",
//     name: "John Doe",
//     email: "john@example.com",
//     picture: "https://...",
//     // ... other user info
//   }
  
  // When no user is logged in, this returns null