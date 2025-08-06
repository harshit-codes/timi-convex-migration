// Comprehensive data migration script from Prisma/PostgreSQL to Convex
// This script should be run once during migration

import { ConvexHttpClient } from "convex/browser";
import { PrismaClient } from "@prisma/client";

// Initialize clients
const convex = new ConvexHttpClient(process.env.CONVEX_URL!);
const prisma = new PrismaClient();

async function migrateUsers() {
  console.log("Migrating users...");
  const users = await prisma.user.findMany({
    include: {
      profile: true,
      settings: true,
    }
  });
  
  let migratedCount = 0;
  for (const user of users) {
    try {
      // Migrate user
      await convex.mutation("users:createUser", {
        clerkId: user.id, // Assuming Prisma user ID maps to Clerk ID
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        createdAt: user.createdAt.getTime(),
        updatedAt: user.updatedAt.getTime(),
      });
      
      console.log(`Migrated user: ${user.id}`);
      
      // Migrate profile if exists
      if (user.profile) {
        await convex.mutation("users:createProfile", {
          userId: user.id,
          bio: user.profile.bio,
          timezone: user.profile.timezone,
          locale: user.profile.locale,
          createdAt: user.profile.createdAt.getTime(),
          updatedAt: user.profile.updatedAt.getTime(),
        });
        
        console.log(`Migrated profile for user: ${user.id}`);
      }
      
      // Migrate settings if exists
      if (user.settings) {
        await convex.mutation("users:createSettings", {
          userId: user.id,
          autoSync: user.settings.autoSync,
          notifications: user.settings.notifications,
          darkMode: user.settings.darkMode,
          emailNotifications: user.settings.emailNotifications,
          marketingEmails: user.settings.marketingEmails,
          dataExportFormat: user.settings.dataExportFormat,
          sessionTimeout: user.settings.sessionTimeout,
          profileVisibility: user.settings.profileVisibility,
          dataSharing: user.settings.dataSharing,
          analyticsOptOut: user.settings.analyticsOptOut,
          createdAt: user.settings.createdAt.getTime(),
          updatedAt: user.settings.updatedAt.getTime(),
        });
        
        console.log(`Migrated settings for user: ${user.id}`);
      }
      
      migratedCount++;
    } catch (error) {
      console.error(`Failed to migrate user ${user.id}:`, error);
    }
  }
  
  console.log(`Migrated ${migratedCount} out of ${users.length} users`);
}

async function migrateExtensionData() {
  console.log("Migrating extension data...");
  const extensionDataList = await prisma.extensionData.findMany();
  
  let migratedCount = 0;
  for (const data of extensionDataList) {
    try {
      await convex.mutation("extension:syncExtensionData", {
        userId: data.userId,
        version: data.version,
        lastSyncAt: data.lastSyncAt?.getTime(),
        syncStatus: data.syncStatus as any,
        dailyUsage: data.dailyUsage,
        featuresUsed: data.featuresUsed,
        customData: data.customData ? JSON.stringify(data.customData) : undefined,
      });
      
      console.log(`Migrated extension data for user: ${data.userId}`);
      migratedCount++;
    } catch (error) {
      console.error(`Failed to migrate extension data for user ${data.userId}:`, error);
    }
  }
  
  console.log(`Migrated ${migratedCount} out of ${extensionDataList.length} extension data records`);
}

async function migrateActivities() {
  console.log("Migrating user activities...");
  const activities = await prisma.userActivity.findMany();
  
  let migratedCount = 0;
  for (const activity of activities) {
    try {
      await convex.mutation("activity:logActivity", {
        userId: activity.userId,
        action: activity.action,
        resource: activity.resource,
        metadata: activity.metadata ? JSON.stringify(activity.metadata) : undefined,
        source: activity.source,
        ipAddress: activity.ipAddress,
        userAgent: activity.userAgent,
        createdAt: activity.createdAt.getTime(),
      });
      
      console.log(`Migrated activity for user: ${activity.userId}`);
      migratedCount++;
    } catch (error) {
      console.error(`Failed to migrate activity for user ${activity.userId}:`, error);
    }
  }
  
  console.log(`Migrated ${migratedCount} out of ${activities.length} activities`);
}

async function migrateSessions() {
  console.log("Migrating user sessions...");
  const sessions = await prisma.userSession.findMany();
  
  let migratedCount = 0;
  for (const session of sessions) {
    try {
      await convex.mutation("sessions:createSession", {
        userId: session.userId,
        deviceId: session.deviceId,
        userAgent: session.userAgent,
        ipAddress: session.ipAddress,
        location: session.location,
        source: session.source,
        startedAt: session.startedAt.getTime(),
        createdAt: session.createdAt.getTime(),
        updatedAt: session.updatedAt.getTime(),
      });
      
      // End session if it was ended in the original data
      if (session.endedAt && session.isActive === false) {
        // Note: This would require a slight modification to the Convex function
        // to allow setting endedAt and isActive during creation
        console.log(`Session for user ${session.userId} needs to be ended`);
      }
      
      console.log(`Migrated session for user: ${session.userId}`);
      migratedCount++;
    } catch (error) {
      console.error(`Failed to migrate session for user ${session.userId}:`, error);
    }
  }
  
  console.log(`Migrated ${migratedCount} out of ${sessions.length} sessions`);
}

async function migrateAnnouncements() {
  console.log("Migrating announcements...");
  const announcements = await prisma.announcement.findMany();
  
  let migratedCount = 0;
  for (const announcement of announcements) {
    try {
      await convex.mutation("announcements:createAnnouncement", {
        title: announcement.title,
        content: announcement.content,
        type: announcement.type,
        priority: announcement.priority,
        startDate: announcement.startDate?.getTime(),
        endDate: announcement.endDate?.getTime(),
        audience: announcement.audience,
      });
      
      console.log(`Migrated announcement: ${announcement.id}`);
      migratedCount++;
    } catch (error) {
      console.error(`Failed to migrate announcement ${announcement.id}:`, error);
    }
  }
  
  console.log(`Migrated ${migratedCount} out of ${announcements.length} announcements`);
}

async function migrateSystemMetrics() {
  console.log("Migrating system metrics...");
  const metrics = await prisma.systemMetric.findMany();
  
  let migratedCount = 0;
  for (const metric of metrics) {
    try {
      await convex.mutation("metrics:logMetric", {
        name: metric.name,
        value: metric.value,
        unit: metric.unit,
        tags: metric.tags ? JSON.stringify(metric.tags) : undefined,
        timestamp: metric.timestamp.getTime(),
        period: metric.period,
      });
      
      console.log(`Migrated metric: ${metric.name}`);
      migratedCount++;
    } catch (error) {
      console.error(`Failed to migrate metric ${metric.name}:`, error);
    }
  }
  
  console.log(`Migrated ${migratedCount} out of ${metrics.length} metrics`);
}

async function migrateAllData() {
  console.log("Starting data migration...");
  
  try {
    await migrateUsers();
    await migrateExtensionData();
    await migrateActivities();
    await migrateSessions();
    await migrateAnnouncements();
    await migrateSystemMetrics();
    
    console.log("Data migration completed successfully!");
  } catch (error) {
    console.error("Data migration failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration
// migrateAllData();
