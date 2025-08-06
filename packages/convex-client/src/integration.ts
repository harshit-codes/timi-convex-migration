// Client-side integration example for Convex
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

// Initialize the Convex client
const convex = new ConvexHttpClient(process.env.CONVEX_URL!);

// User management functions
export async function createUser(clerkId: string, email: string, firstName?: string, lastName?: string, imageUrl?: string) {
  return await convex.mutation(api.users.createUser, {
    clerkId,
    email,
    firstName,
    lastName,
    imageUrl,
  });
}

export async function getUserByClerkId(clerkId: string) {
  return await convex.query(api.users.getUserByClerkId, { clerkId });
}

export async function updateUser(clerkId: string, updates: { firstName?: string; lastName?: string; imageUrl?: string }) {
  return await convex.mutation(api.users.updateUser, {
    clerkId,
    ...updates,
  });
}

// Profile functions
export async function createProfile(userId: string, bio?: string, timezone?: string, locale?: string) {
  return await convex.mutation(api.users.createProfile, {
    userId,
    bio,
    timezone,
    locale,
  });
}

export async function getProfile(userId: string) {
  return await convex.query(api.users.getProfile, { userId });
}

// Settings functions
export async function createSettings(userId: string, settings: {
  autoSync: boolean;
  notifications: boolean;
  darkMode: boolean;
  emailNotifications: boolean;
  marketingEmails: boolean;
  dataExportFormat: string;
  sessionTimeout: number;
  profileVisibility: string;
  dataSharing: boolean;
  analyticsOptOut: boolean;
}) {
  return await convex.mutation(api.users.createSettings, {
    userId,
    ...settings,
  });
}

export async function getSettings(userId: string) {
  return await convex.query(api.users.getSettings, { userId });
}

export async function updateSettings(userId: string, updates: Partial<{
  autoSync: boolean;
  notifications: boolean;
  darkMode: boolean;
  emailNotifications: boolean;
  marketingEmails: boolean;
  dataExportFormat: string;
  sessionTimeout: number;
  profileVisibility: string;
  dataSharing: boolean;
  analyticsOptOut: boolean;
}>) {
  return await convex.mutation(api.users.updateSettings, {
    userId,
    ...updates,
  });
}

// Extension data functions
export async function syncExtensionData(userId: string, data: {
  version?: string;
  lastSyncAt?: number;
  syncStatus?: string;
  dailyUsage?: number;
  featuresUsed?: string[];
  customData?: string;
}) {
  return await convex.mutation(api.extension.syncExtensionData, {
    userId,
    ...data,
  });
}

export async function getExtensionData(userId: string) {
  return await convex.query(api.extension.getExtensionData, { userId });
}

// Activity functions
export async function logActivity(userId: string, activity: {
  action: string;
  resource: string;
  metadata?: string;
  source?: string;
  ipAddress?: string;
  userAgent?: string;
}) {
  return await convex.mutation(api.activity.logActivity, {
    userId,
    ...activity,
  });
}

export async function getUserActivities(userId: string) {
  return await convex.query(api.activity.getUserActivities, { userId });
}

// Session functions
export async function createSession(userId: string, session: {
  deviceId?: string;
  userAgent?: string;
  ipAddress?: string;
  location?: string;
  source?: string;
  startedAt: number;
}) {
  return await convex.mutation(api.sessions.createSession, {
    userId,
    ...session,
  });
}

export async function endSession(sessionId: string) {
  return await convex.mutation(api.sessions.endSession, { sessionId });
}

export async function getUserSessions(userId: string) {
  return await convex.query(api.sessions.getUserSessions, { userId });
}

// Announcement functions
export async function getActiveAnnouncements(audience?: string) {
  return await convex.query(api.announcements.getActiveAnnouncements, { audience });
}

// Metrics functions
export async function logMetric(metric: {
  name: string;
  value: number;
  unit: string;
  tags?: string;
  timestamp: number;
  period?: string;
}) {
  return await convex.mutation(api.metrics.logMetric, metric);
}

export async function getMetricsByName(name: string, limit?: number) {
  return await convex.query(api.metrics.getMetricsByName, { name, limit });
}
