/**
 * Comments Module - Interview Feedback System
 * 
 * This file handles all comment-related operations for the interview platform.
 * Comments are used to provide feedback and ratings for interviews.
 * 
 * Key Features:
 * - Add comments with ratings to interviews
 * - Retrieve all comments for a specific interview
 * - Automatic user authentication and identification
 * - Real-time updates through Convex
 * 
 * Database Schema:
 * - Comments are linked to interviews via interviewId
 * - Each comment includes content, rating, and interviewer information
 * - Comments are automatically associated with the authenticated user
 */

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
//mutation in convex is used to add or modify documents in the database

/**
 * Add Comment Mutation
 * 
 * Allows authenticated users to add comments and ratings to interviews.
 * This mutation automatically associates the comment with the current user.
 * 
 * @param interviewId - The ID of the interview to comment on
 * @param content - The text content of the comment
 * @param rating - Numeric rating (typically 1-5 stars)
 * 
 * Flow:
 * 1. User submits comment form
 * 2. Frontend calls this mutation
 * 3. Convex verifies user authentication
 * 4. Comment is saved to database
 * 5. Real-time updates are sent to all clients
 */
export const addComment = mutation({
    args:{
        interviewId: v.id("interviews"),
        content: v.string(),
        rating: v.number(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();//getuseridentity is a function that returns the user identity from the auth provider
        if(!identity){
            throw new Error("Unauthorized");
        }
        return await ctx.db.insert("comments", {
            interviewId: args.interviewId,
            content: args.content,
            rating: args.rating,
            interviewerId: identity.subject,
        });
    }
});

/**
 * Get Comments Query
 * 
 * Retrieves all comments for a specific interview.
 * This query is used to display feedback on interview pages.
 * 
 * @param interviewId - The ID of the interview to get comments for
 * @returns Array of comment objects with content, rating, and user info
 * 
 * Performance:
 * - Uses database index for efficient querying
 * - Returns comments in chronological order
 * - Real-time updates when new comments are added
 */
export const getComments = query({
    args: { interviewId: v.id("interviews") },
    handler: async (ctx, args) => {
        const comments = await ctx.db.query("comments")
        .withIndex("by_interview_id", (q) => q.eq("interviewId", args.interviewId))
        .collect();
        return comments;
    }
});

