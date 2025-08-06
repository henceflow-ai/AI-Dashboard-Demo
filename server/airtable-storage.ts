import { 
  type User, 
  type InsertUser, 
  type Lead, 
  type InsertLead,
  type Meeting,
  type InsertMeeting,
  type Activity,
  type InsertActivity,
  type Campaign,
  type InsertCampaign,
  type SystemStats,
  type InsertSystemStats,
  type DashboardMetrics,
  type EnrichedActivity
} from "@shared/schema";
import { airtableService } from "./airtable";
import type { IStorage } from "./storage";

export class AirtableStorage implements IStorage {
  // User methods - keeping simple memory storage for users since they're for authentication
  private users: Map<string, User> = new Map();

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = { ...insertUser, id: crypto.randomUUID() };
    this.users.set(user.id, user);
    return user;
  }

  // Lead methods - using Airtable
  async getLeads(): Promise<Lead[]> {
    return await airtableService.getLeads();
  }

  async getLead(id: string): Promise<Lead | undefined> {
    const leads = await airtableService.getLeads();
    return leads.find(lead => lead.id === id);
  }

  async createLead(lead: InsertLead): Promise<Lead> {
    // Note: For creating new leads, you'd need to implement POST to Airtable
    // For now, we'll throw an error since this is read-only
    throw new Error("Creating leads through Airtable not implemented yet");
  }

  async updateLead(id: string, leadUpdate: Partial<InsertLead>): Promise<Lead | undefined> {
    // Note: For updating leads, you'd need to implement PATCH to Airtable
    // For now, we'll throw an error since this is read-only
    throw new Error("Updating leads through Airtable not implemented yet");
  }

  // Meeting methods - using Airtable
  async getMeetings(): Promise<Meeting[]> {
    return await airtableService.getMeetings();
  }

  async getMeetingsByLeadId(leadId: string): Promise<Meeting[]> {
    const meetings = await airtableService.getMeetings();
    return meetings.filter(meeting => meeting.leadId === leadId);
  }

  async createMeeting(insertMeeting: InsertMeeting): Promise<Meeting> {
    // Note: For creating meetings, you'd need to implement POST to Airtable
    throw new Error("Creating meetings through Airtable not implemented yet");
  }

  // Activity methods - using Airtable
  async getActivities(limit?: number): Promise<Activity[]> {
    return await airtableService.getActivities(limit);
  }

  async getRecentActivities(limit: number = 5): Promise<EnrichedActivity[]> {
    return await airtableService.getRecentActivities(limit);
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    // Note: For creating activities, you'd need to implement POST to Airtable
    throw new Error("Creating activities through Airtable not implemented yet");
  }

  // Campaign methods - using Airtable
  async getCampaigns(): Promise<Campaign[]> {
    return await airtableService.getCampaigns();
  }

  async createCampaign(insertCampaign: InsertCampaign): Promise<Campaign> {
    // Note: For creating campaigns, you'd need to implement POST to Airtable
    throw new Error("Creating campaigns through Airtable not implemented yet");
  }

  // System stats methods - using Airtable
  async getSystemStats(): Promise<SystemStats[]> {
    return await airtableService.getSystemStats();
  }

  async createSystemStats(insertStats: InsertSystemStats): Promise<SystemStats> {
    // Note: For creating system stats, you'd need to implement POST to Airtable
    throw new Error("Creating system stats through Airtable not implemented yet");
  }

  // Dashboard methods - using Airtable
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    return await airtableService.getDashboardMetrics();
  }
}