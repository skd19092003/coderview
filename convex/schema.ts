import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * This file defines the Convex database schema for your application.
 *
 * - `defineSchema` is used to declare the overall database schema.
 * - `defineTable` is used to define the structure of a specific table (here, the 'users' table).
 * - `v` provides type validators for each field in the table.
 */ 
export default defineSchema({
  /**
   * The 'users' table stores information about each user in the application.
   * Each field is validated for its type using Convex's validators.
   */
  users: defineTable({
    clerkId: v.string(),
    name: v.string(),   
    email: v.string(),  
    image: v.optional(v.string()),  
    role: v.union(v.literal("candidate"), v.literal("interviewer")), 
  }).index("by_clerk_id", ["clerkId"]), //here we are indexing the clerkId to make it faster to search for a user by their clerkId
 
  interviews: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    startTime: v.number(),
    endTime: v.optional(v.number()), //30mis 45mins dont really know so optional
    status: v.string(),
    streamCallId: v.string(),
    candidateId: v.string(),
    interviewerIds: v.string(),
}).index("by_candidate_id", ["candidateId"]).index("by_stream_call_id", ["streamCallId"]),
  //index is used to make it faster to search for a interview by its candidateId
  //this is a unique index, so no two interviews can have the same candidateId
  //this is a compound index, so no two interviews can have the same candidateId and interviewerIds
  

  comments: defineTable({
    content: v.string(),
    rating: v.number(),
    interviewerId: v.string(), //this is a reference to the interviewer that the comment belongs to 
    interviewId: v.id("interviews"), //this is a reference to the interview that the comment belongs to 
  }).index("by_interview_id", ["interviewId"]),
  //this is a compound index, so no two comments can have the same interviewId and interviewerId


});