// Session management functions for Convex
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new session
export const createSession = mutation({
  args: {
    userId: v.string(),
    deviceId: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
    location: v.optional(v.string()),
    source: v.optional(v.string()),
    startedAt: v.number(),
  },
  handler: async (ctx, args) => {
    const sessionId = await ctx.db.insert("sessions", {
      userId: args.userId,
      deviceId: args.deviceId,
      userAgent: args.userAgent,
      ipAddress: args.ipAddress,
      location: args.location,
      source: args.source,
      startedAt: args.startedAt,
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return sessionId;
  },
});

// End a session
export const endSession = mutation({
  args: {
    sessionId: v.id("sessions"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.sessionId, {
      isActive: false,
      endedAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Get active sessions for user
export const getActiveSessions = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.query("sessions")
      .withIndex("by_user_id", q => q.eq("userId", args.userId))
      .filter(q => q.eq(q.field("isActive"), true))
      .collect();
  },
});

// Get all sessions for user
export const getUserSessions = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.query("sessions")
      .withIndex("by_user_id", q => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

// Get session by ID
export const getSessionById = query({
  args: {
    sessionId: v.id("sessions"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.sessionId);
  },
});
