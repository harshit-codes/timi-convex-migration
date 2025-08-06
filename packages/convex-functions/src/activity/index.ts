// Activity tracking functions for Convex
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Log user activity
export const logActivity = mutation({
  args: {
    userId: v.string(),
    action: v.string(),
    resource: v.string(),
    metadata: v.optional(v.string()), // JSON string
    source: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const activityId = await ctx.db.insert("activities", {
      userId: args.userId,
      action: args.action,
      resource: args.resource,
      metadata: args.metadata,
      source: args.source,
      ipAddress: args.ipAddress,
      userAgent: args.userAgent,
      createdAt: Date.now(),
    });
    return activityId;
  },
});

// Get activities for user
export const getUserActivities = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.query("activities")
      .withIndex("by_user_id", q => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

// Get activities by action type
export const getActivitiesByAction = query({
  args: {
    action: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.query("activities")
      .withIndex("by_action", q => q.eq("action", args.action))
      .order("desc")
      .collect();
  },
});

// Get recent activities
export const getRecentActivities = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 100;
    return await ctx.db.query("activities")
      .order("desc")
      .take(limit);
  },
});
