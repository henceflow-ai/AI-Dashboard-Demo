import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const leads = pgTable("leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  company: text("company"),
  status: text("status").notNull().default("new"), // new, contacted, qualified, meeting_booked, closed, lost
  stage: text("stage").notNull().default("lead"), // lead, prospect, opportunity, deal
  value: decimal("value", { precision: 10, scale: 2 }),
  source: text("source"),
  assignedTo: varchar("assigned_to"),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
  lastContactedAt: timestamp("last_contacted_at"),
  notes: text("notes"),
  metadata: jsonb("metadata"),
});

export const meetings = pgTable("meetings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  leadId: varchar("lead_id").notNull(),
  title: text("title").notNull(),
  scheduledAt: timestamp("scheduled_at").notNull(),
  duration: integer("duration").default(30), // minutes
  status: text("status").notNull().default("scheduled"), // scheduled, completed, cancelled, no_show
  meetingType: text("meeting_type").default("discovery"), // discovery, demo, closing, follow_up
  notes: text("notes"),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

export const activities = pgTable("activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  leadId: varchar("lead_id"),
  type: text("type").notNull(), // call, email, meeting, note, status_change
  description: text("description").notNull(),
  status: text("status").default("completed"), // completed, pending, failed
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const campaigns = pgTable("campaigns", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // email, sms, call, mixed
  status: text("status").notNull().default("active"), // active, paused, completed
  targetSegment: text("target_segment"),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

export const systemStats = pgTable("system_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: timestamp("date").notNull().default(sql`now()`),
  callsCompleted: integer("calls_completed").default(0),
  meetingsScheduled: integer("meetings_scheduled").default(0),
  emailsSent: integer("emails_sent").default(0),
  responseRate: decimal("response_rate", { precision: 5, scale: 2 }),
  showRate: decimal("show_rate", { precision: 5, scale: 2 }),
  conversionRate: decimal("conversion_rate", { precision: 5, scale: 2 }),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMeetingSchema = createInsertSchema(meetings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true,
});

export const insertCampaignSchema = createInsertSchema(campaigns).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSystemStatsSchema = createInsertSchema(systemStats).omit({
  id: true,
  date: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;

export type InsertMeeting = z.infer<typeof insertMeetingSchema>;
export type Meeting = typeof meetings.$inferSelect;

export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;

export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type Campaign = typeof campaigns.$inferSelect;

export type InsertSystemStats = z.infer<typeof insertSystemStatsSchema>;
export type SystemStats = typeof systemStats.$inferSelect;

// Dashboard metrics type
export interface DashboardMetrics {
  totalLeads: number;
  contactedLeads: number;
  meetingsBooked: number;
  potentialDeals: string;
  callsToday: number;
  meetingsScheduled: number;
  showRate: string;
  pipelineData: Array<{
    month: string;
    totalLeads: number;
    contacted: number;
    meetingsBooked: number;
  }>;
}

// Recent activity with enriched data
export interface EnrichedActivity extends Activity {
  leadName?: string;
  timeAgo: string;
  category: string;
}
