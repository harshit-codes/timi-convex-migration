// Extension data functions for Convex
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Sync extension data
export const syncExtensionData = mutation({
  args: {
    userId: v.string(),
    version: v.optional(v.string()),
    lastSyncAt: v.optional(v.number()),
    syncStatus: v.optional(v.string()),
    dailyUsage: v.optional(v.number()),
    featuresUsed: v.optional(v.array(v.string())),
    customData: v.optional(v.string()), // JSON string
  },
  handler: async (ctx, args) => {
    // Check if extension data already exists for this user
    const existingData = await ctx.db.query("extensionData")
      .withIndex("by_user_id", q => q.eq("userId", args.userId))
      .unique();

    if (existingData) {
      // Update existing record
      await ctx.db.patch(existingData._id, {
        version: args.version,
        lastSyncAt: args.lastSyncAt,
        syncStatus: args.syncStatus,
        dailyUsage: args.dailyUsage,
        featuresUsed: args.featuresUsed,
        customData: args.customData,
        updatedAt: Date.now(),
      });
      return existingData._id;
    } else {
      // Create new record
      const dataId = await ctx.db.insert("extensionData", {
        userId: args.userId,
        version: args.version,
        lastSyncAt: args.lastSyncAt,
        syncStatus: args.syncStatus,
        dailyUsage: args.dailyUsage,
        featuresUsed: args.featuresUsed,
        customData: args.customData,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      return dataId;
    }
  },
});

// Get extension data for user
export const getExtensionData = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.query("extensionData")
      .withIndex("by_user_id", q => q.eq("userId", args.userId))
      .unique();
  },
});

// Get all extension data (for admin purposes)
export const getAllExtensionData = query({
  handler: async (ctx) => {
    return await ctx.db.query("extensionData").collect();
  },
});
