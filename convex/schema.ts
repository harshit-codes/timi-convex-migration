import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Define Clerk user ID type for foreign key references
const clerkUserId = v.string();

export default defineSchema({
  // User table with basic information and Clerk integration
  users: defineTable({
    clerkId: v.string(), // Clerk's user ID
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    createdAt: v.number(), // Unix timestamp
    updatedAt: v.number(), // Unix timestamp
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"]),

  // User profiles for additional information
  profiles: defineTable({
    userId: clerkUserId, // References users.clerkId
    bio: v.optional(v.string()),
    timezone: v.optional(v.string()),
    locale: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user_id", ["userId"]),

  // User settings for customization
  settings: defineTable({
    userId: clerkUserId, // References users.clerkId
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
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user_id", ["userId"]),

  // Extension data tracking
  extensionData: defineTable({
    userId: clerkUserId,
    version: v.optional(v.string()),
    lastSyncAt: v.optional(v.number()),
    syncStatus: v.optional(v.string()),
    dailyUsage: v.optional(v.number()),
    featuresUsed: v.optional(v.array(v.string())),
    customData: v.optional(v.string()), // JSON string
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user_id", ["userId"]),

  // User activity logging
  activities: defineTable({
    userId: clerkUserId,
    action: v.string(),
    resource: v.string(),
    metadata: v.optional(v.string()), // JSON string
    source: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_user_id", ["userId"])
    .index("by_action", ["action"])
    .index("by_date", ["createdAt"]),

  // User sessions tracking
  sessions: defineTable({
    userId: clerkUserId,
    deviceId: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
    location: v.optional(v.string()),
    source: v.optional(v.string()),
    startedAt: v.number(),
    endedAt: v.optional(v.number()),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user_id", ["userId"])
    .index("by_active", ["isActive"])
    .index("by_date", ["startedAt"]),

  // Announcements
  announcements: defineTable({
    title: v.string(),
    content: v.string(),
    type: v.string(), // info, warning, alert
    priority: v.number(),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    isActive: v.boolean(),
    audience: v.string(), // all, premium, free
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_active", ["isActive"])
    .index("by_priority", ["priority"]),

  // System metrics
  metrics: defineTable({
    name: v.string(),
    value: v.number(),
    unit: v.string(),
    tags: v.optional(v.string()), // JSON string
    timestamp: v.number(),
    period: v.optional(v.string()), // daily, hourly, etc.
  })
    .index("by_name", ["name"])
    .index("by_timestamp", ["timestamp"]),
});
