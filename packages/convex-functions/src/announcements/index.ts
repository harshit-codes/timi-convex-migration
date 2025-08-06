// Announcements functions for Convex
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create announcement
export const createAnnouncement = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    type: v.string(), // info, warning, alert
    priority: v.number(),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    audience: v.string(), // all, premium, free
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const isActive = (!args.startDate || args.startDate <= now) && 
                    (!args.endDate || args.endDate >= now);
    
    const announcementId = await ctx.db.insert("announcements", {
      title: args.title,
      content: args.content,
      type: args.type,
      priority: args.priority,
      startDate: args.startDate,
      endDate: args.endDate,
      isActive: isActive,
      audience: args.audience,
      createdAt: now,
      updatedAt: now,
    });
    return announcementId;
  },
});

// Update announcement
export const updateAnnouncement = mutation({
  args: {
    announcementId: v.id("announcements"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    type: v.optional(v.string()),
    priority: v.optional(v.number()),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
    audience: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const updateData: any = {
      updatedAt: Date.now(),
    };
    
    if (args.title !== undefined) updateData.title = args.title;
    if (args.content !== undefined) updateData.content = args.content;
    if (args.type !== undefined) updateData.type = args.type;
    if (args.priority !== undefined) updateData.priority = args.priority;
    if (args.startDate !== undefined) updateData.startDate = args.startDate;
    if (args.endDate !== undefined) updateData.endDate = args.endDate;
    if (args.isActive !== undefined) updateData.isActive = args.isActive;
    if (args.audience !== undefined) updateData.audience = args.audience;
    
    await ctx.db.patch(args.announcementId, updateData);
  },
});

// Get active announcements
export const getActiveAnnouncements = query({
  args: {
    audience: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    let query = ctx.db.query("announcements")
      .withIndex("by_active", q => q.eq("isActive", true))
      .filter(q => 
        q.and(
          q.or(
            q.eq(q.field("startDate"), null),
            q.lte(q.field("startDate"), now)
          ),
          q.or(
            q.eq(q.field("endDate"), null),
            q.gte(q.field("endDate"), now)
          )
        )
      )
      .order("desc");

    if (args.audience) {
      query = query.filter(q => 
        q.or(
          q.eq(q.field("audience"), "all"),
          q.eq(q.field("audience"), args.audience)
        )
      );
    }
    
    return await query.collect();
  },
});

// Get all announcements
export const getAllAnnouncements = query({
  handler: async (ctx) => {
    return await ctx.db.query("announcements")
      .order("desc")
      .collect();
  },
});

// Get announcement by ID
export const getAnnouncementById = query({
  args: {
    announcementId: v.id("announcements"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.announcementId);
  },
});
