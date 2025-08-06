// User management functions for Convex
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new user
export const createUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      firstName: args.firstName,
      lastName: args.lastName,
      imageUrl: args.imageUrl,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return userId;
  },
});

// Get user by Clerk ID
export const getUserByClerkId = query({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.query("users")
      .withIndex("by_clerk_id", q => q.eq("clerkId", args.clerkId))
      .unique();
  },
});

// Update user
export const updateUser = mutation({
  args: {
    clerkId: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.query("users")
      .withIndex("by_clerk_id", q => q.eq("clerkId", args.clerkId))
      .unique();
    
    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, {
      firstName: args.firstName,
      lastName: args.lastName,
      imageUrl: args.imageUrl,
      updatedAt: Date.now(),
    });
  },
});

// Create user profile
export const createProfile = mutation({
  args: {
    userId: v.string(),
    bio: v.optional(v.string()),
    timezone: v.optional(v.string()),
    locale: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if profile already exists
    const existingProfile = await ctx.db.query("profiles")
      .withIndex("by_user_id", q => q.eq("userId", args.userId))
      .unique();

    if (existingProfile) {
      throw new Error("Profile already exists for this user");
    }

    const profileId = await ctx.db.insert("profiles", {
      userId: args.userId,
      bio: args.bio,
      timezone: args.timezone,
      locale: args.locale,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return profileId;
  },
});

// Update user profile
export const updateProfile = mutation({
  args: {
    userId: v.string(),
    bio: v.optional(v.string()),
    timezone: v.optional(v.string()),
    locale: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db.query("profiles")
      .withIndex("by_user_id", q => q.eq("userId", args.userId))
      .unique();
    
    if (!profile) {
      throw new Error("Profile not found");
    }

    await ctx.db.patch(profile._id, {
      bio: args.bio,
      timezone: args.timezone,
      locale: args.locale,
      updatedAt: Date.now(),
    });
  },
});

// Get user profile
export const getProfile = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.query("profiles")
      .withIndex("by_user_id", q => q.eq("userId", args.userId))
      .unique();
  },
});

// Create user settings
export const createSettings = mutation({
  args: {
    userId: v.string(),
    autoSync: v.boolean(),
    notifications: v.boolean(),
    darkMode: v.boolean(),
    emailNotifications: v.boolean(),
    marketingEmails: v.boolean(),
    dataExportFormat: v.string(),
    sessionTimeout: v.number(),
    profileVisibility: v.string(),
    dataSharing: v.boolean(),
    analyticsOptOut: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Check if settings already exist
    const existingSettings = await ctx.db.query("settings")
      .withIndex("by_user_id", q => q.eq("userId", args.userId))
      .unique();

    if (existingSettings) {
      throw new Error("Settings already exist for this user");
    }

    const settingsId = await ctx.db.insert("settings", {
      userId: args.userId,
      autoSync: args.autoSync,
      notifications: args.notifications,
      darkMode: args.darkMode,
      emailNotifications: args.emailNotifications,
      marketingEmails: args.marketingEmails,
      dataExportFormat: args.dataExportFormat,
      sessionTimeout: args.sessionTimeout,
      profileVisibility: args.profileVisibility,
      dataSharing: args.dataSharing,
      analyticsOptOut: args.analyticsOptOut,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return settingsId;
  },
});

// Update user settings
export const updateSettings = mutation({
  args: {
    userId: v.string(),
    autoSync: v.optional(v.boolean()),
    notifications: v.optional(v.boolean()),
    darkMode: v.optional(v.boolean()),
    emailNotifications: v.optional(v.boolean()),
    marketingEmails: v.optional(v.boolean()),
    dataExportFormat: v.optional(v.string()),
    sessionTimeout: v.optional(v.number()),
    profileVisibility: v.optional(v.string()),
    dataSharing: v.optional(v.boolean()),
    analyticsOptOut: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const settings = await ctx.db.query("settings")
      .withIndex("by_user_id", q => q.eq("userId", args.userId))
      .unique();
    
    if (!settings) {
      throw new Error("Settings not found");
    }

    await ctx.db.patch(settings._id, {
      autoSync: args.autoSync ?? settings.autoSync,
      notifications: args.notifications ?? settings.notifications,
      darkMode: args.darkMode ?? settings.darkMode,
      emailNotifications: args.emailNotifications ?? settings.emailNotifications,
      marketingEmails: args.marketingEmails ?? settings.marketingEmails,
      dataExportFormat: args.dataExportFormat ?? settings.dataExportFormat,
      sessionTimeout: args.sessionTimeout ?? settings.sessionTimeout,
      profileVisibility: args.profileVisibility ?? settings.profileVisibility,
      dataSharing: args.dataSharing ?? settings.dataSharing,
      analyticsOptOut: args.analyticsOptOut ?? settings.analyticsOptOut,
      updatedAt: Date.now(),
    });
  },
});

// Get user settings
export const getSettings = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.query("settings")
      .withIndex("by_user_id", q => q.eq("userId", args.userId))
      .unique();
  },
});
