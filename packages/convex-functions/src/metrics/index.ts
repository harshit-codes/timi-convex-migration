// Metrics functions for Convex
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Log a metric
export const logMetric = mutation({
  args: {
    name: v.string(),
    value: v.number(),
    unit: v.string(),
    tags: v.optional(v.string()), // JSON string
    timestamp: v.number(),
    period: v.optional(v.string()), // daily, hourly, etc.
  },
  handler: async (ctx, args) => {
    const metricId = await ctx.db.insert("metrics", {
      name: args.name,
      value: args.value,
      unit: args.unit,
      tags: args.tags,
      timestamp: args.timestamp,
      period: args.period,
    });
    return metricId;
  },
});

// Get metrics by name
export const getMetricsByName = query({
  args: {
    name: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 100;
    return await ctx.db.query("metrics")
      .withIndex("by_name", q => q.eq("name", args.name))
      .order("desc")
      .take(limit);
  },
});

// Get metrics by time range
export const getMetricsByTimeRange = query({
  args: {
    name: v.string(),
    startTime: v.number(),
    endTime: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.query("metrics")
      .withIndex("by_name", q => q.eq("name", args.name))
      .filter(q => 
        q.and(
          q.gte(q.field("timestamp"), args.startTime),
          q.lte(q.field("timestamp"), args.endTime)
        )
      )
      .order("asc")
      .collect();
  },
});

// Get recent metrics
export const getRecentMetrics = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 100;
    return await ctx.db.query("metrics")
      .order("desc")
      .take(limit);
  },
});
