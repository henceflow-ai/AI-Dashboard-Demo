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
import { randomUUID } from "crypto";
import { airtableService } from "./airtable";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Lead methods
  getLeads(): Promise<Lead[]>;
  getLead(id: string): Promise<Lead | undefined>;
  createLead(lead: InsertLead): Promise<Lead>;
  updateLead(id: string, lead: Partial<InsertLead>): Promise<Lead | undefined>;

  // Meeting methods
  getMeetings(): Promise<Meeting[]>;
  getMeetingsByLeadId(leadId: string): Promise<Meeting[]>;
  createMeeting(meeting: InsertMeeting): Promise<Meeting>;

  // Activity methods
  getActivities(limit?: number): Promise<Activity[]>;
  getRecentActivities(limit?: number): Promise<EnrichedActivity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;

  // Campaign methods
  getCampaigns(): Promise<Campaign[]>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;

  // System stats methods
  getSystemStats(): Promise<SystemStats[]>;
  createSystemStats(stats: InsertSystemStats): Promise<SystemStats>;

  // Dashboard methods
  getDashboardMetrics(): Promise<DashboardMetrics>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private leads: Map<string, Lead>;
  private meetings: Map<string, Meeting>;
  private activities: Map<string, Activity>;
  private campaigns: Map<string, Campaign>;
  private systemStats: Map<string, SystemStats>;

  constructor() {
    this.users = new Map();
    this.leads = new Map();
    this.meetings = new Map();
    this.activities = new Map();
    this.campaigns = new Map();
    this.systemStats = new Map();
    
    // Initialize with some sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample leads
    const sampleLeads: Lead[] = [
      {
        id: randomUUID(),
        name: "Sarah Johnson",
        email: "sarah@techcorp.com",
        phone: "+1-555-0123",
        company: "TechCorp Solutions",
        status: "contacted",
        stage: "prospect",
        value: "45000.00",
        source: "referral",
        assignedTo: null,
        createdAt: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
        updatedAt: new Date(),
        lastContactedAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        notes: "High-value prospect, interested in enterprise solution",
        metadata: { priority: "high" }
      },
      {
        id: randomUUID(),
        name: "Mike Chen",
        email: "mike@startupinc.com",
        phone: "+1-555-0124",
        company: "Startup Inc",
        status: "contacted",
        stage: "lead",
        value: "12000.00",
        source: "website",
        assignedTo: null,
        createdAt: new Date(Date.now() - 10 * 60 * 1000),
        updatedAt: new Date(),
        lastContactedAt: new Date(Date.now() - 5 * 60 * 1000),
        notes: "Interested in basic package",
        metadata: { priority: "medium" }
      },
      {
        id: randomUUID(),
        name: "Alex Rodriguez",
        email: "alex@bigcorp.com",
        phone: "+1-555-0125",
        company: "Big Corp",
        status: "meeting_booked",
        stage: "opportunity",
        value: "75000.00",
        source: "cold_outreach",
        assignedTo: null,
        createdAt: new Date(Date.now() - 30 * 60 * 1000),
        updatedAt: new Date(),
        lastContactedAt: new Date(Date.now() - 12 * 60 * 1000),
        notes: "Meeting scheduled for product demo",
        metadata: { priority: "high" }
      }
    ];

    sampleLeads.forEach(lead => this.leads.set(lead.id, lead));

    // Sample activities
    const sampleActivities: Activity[] = [
      {
        id: randomUUID(),
        leadId: sampleLeads[0].id,
        type: "lead_added",
        description: `New lead ${sampleLeads[0].name} added to pipeline`,
        status: "completed",
        metadata: { category: "Lead Generation" },
        createdAt: new Date(Date.now() - 2 * 60 * 1000)
      },
      {
        id: randomUUID(),
        leadId: sampleLeads[1].id,
        type: "call",
        description: `AI completed call with ${sampleLeads[1].name}`,
        status: "completed",
        metadata: { category: "Outreach", duration: 180 },
        createdAt: new Date(Date.now() - 5 * 60 * 1000)
      },
      {
        id: randomUUID(),
        leadId: sampleLeads[2].id,
        type: "meeting",
        description: `Meeting scheduled with ${sampleLeads[2].name}`,
        status: "completed",
        metadata: { category: "Meeting" },
        createdAt: new Date(Date.now() - 12 * 60 * 1000)
      },
      {
        id: randomUUID(),
        leadId: randomUUID(),
        type: "call",
        description: "Call attempt failed for Jennifer Davis",
        status: "failed",
        metadata: { category: "Error", reason: "number_disconnected" },
        createdAt: new Date(Date.now() - 18 * 60 * 1000)
      },
      {
        id: randomUUID(),
        leadId: sampleLeads[0].id,
        type: "deal_closed",
        description: `Deal closed with ${sampleLeads[0].company} - $45,000`,
        status: "completed",
        metadata: { category: "Conversion", value: 45000 },
        createdAt: new Date(Date.now() - 23 * 60 * 1000)
      }
    ];

    sampleActivities.forEach(activity => this.activities.set(activity.id, activity));
  }

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
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Lead methods
  async getLeads(): Promise<Lead[]> {
    return Array.from(this.leads.values());
  }

  async getLead(id: string): Promise<Lead | undefined> {
    return this.leads.get(id);
  }

  async createLead(insertLead: InsertLead): Promise<Lead> {
    const id = randomUUID();
    const lead: Lead = {
      ...insertLead,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.leads.set(id, lead);
    return lead;
  }

  async updateLead(id: string, leadUpdate: Partial<InsertLead>): Promise<Lead | undefined> {
    const lead = this.leads.get(id);
    if (!lead) return undefined;

    const updatedLead: Lead = {
      ...lead,
      ...leadUpdate,
      updatedAt: new Date(),
    };
    this.leads.set(id, updatedLead);
    return updatedLead;
  }

  // Meeting methods
  async getMeetings(): Promise<Meeting[]> {
    return Array.from(this.meetings.values());
  }

  async getMeetingsByLeadId(leadId: string): Promise<Meeting[]> {
    return Array.from(this.meetings.values()).filter(
      (meeting) => meeting.leadId === leadId
    );
  }

  async createMeeting(insertMeeting: InsertMeeting): Promise<Meeting> {
    const id = randomUUID();
    const meeting: Meeting = {
      ...insertMeeting,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.meetings.set(id, meeting);
    return meeting;
  }

  // Activity methods
  async getActivities(limit?: number): Promise<Activity[]> {
    const activities = Array.from(this.activities.values())
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
    
    return limit ? activities.slice(0, limit) : activities;
  }

  async getRecentActivities(limit: number = 5): Promise<EnrichedActivity[]> {
    const activities = await this.getActivities(limit);
    
    return activities.map(activity => {
      const lead = activity.leadId ? this.leads.get(activity.leadId) : undefined;
      const timeAgo = this.getTimeAgo(activity.createdAt!);
      const category = activity.metadata?.category || 'General';
      
      return {
        ...activity,
        leadName: lead?.name,
        timeAgo,
        category
      };
    });
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = randomUUID();
    const activity: Activity = {
      ...insertActivity,
      id,
      createdAt: new Date(),
    };
    this.activities.set(id, activity);
    return activity;
  }

  // Campaign methods
  async getCampaigns(): Promise<Campaign[]> {
    return Array.from(this.campaigns.values());
  }

  async createCampaign(insertCampaign: InsertCampaign): Promise<Campaign> {
    const id = randomUUID();
    const campaign: Campaign = {
      ...insertCampaign,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.campaigns.set(id, campaign);
    return campaign;
  }

  // System stats methods
  async getSystemStats(): Promise<SystemStats[]> {
    return Array.from(this.systemStats.values());
  }

  async createSystemStats(insertStats: InsertSystemStats): Promise<SystemStats> {
    const id = randomUUID();
    const stats: SystemStats = {
      ...insertStats,
      id,
      date: new Date(),
    };
    this.systemStats.set(id, stats);
    return stats;
  }

  // Dashboard methods
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const leads = Array.from(this.leads.values());
    const meetings = Array.from(this.meetings.values());
    
    const totalLeads = leads.length;
    const contactedLeads = leads.filter(lead => 
      ['contacted', 'qualified', 'meeting_booked', 'closed'].includes(lead.status)
    ).length;
    const meetingsBooked = meetings.filter(meeting => 
      meeting.status === 'scheduled'
    ).length;
    
    const potentialDealsValue = leads
      .filter(lead => lead.value)
      .reduce((sum, lead) => sum + parseFloat(lead.value || '0'), 0);
    
    // Generate pipeline data for the last 12 months
    const pipelineData = this.generatePipelineData();
    
    return {
      totalLeads: 2847,
      contactedLeads: 1924,
      meetingsBooked: 342,
      potentialDeals: '$1.2M',
      callsToday: 147,
      meetingsScheduled: 23,
      showRate: '78.5%',
      pipelineData
    };
  }

  private generatePipelineData() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return months.map(month => ({
      month,
      totalLeads: Math.floor(Math.random() * 1000) + 1200,
      contacted: Math.floor(Math.random() * 800) + 750,
      meetingsBooked: Math.floor(Math.random() * 200) + 105
    }));
  }

  private getTimeAgo(date: Date): string {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes === 1) return '1 minute ago';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours === 1) return '1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '1 day ago';
    return `${diffInDays} days ago`;
  }
}

import { AirtableStorage } from "./airtable-storage";

// Use Airtable storage if API keys are available, otherwise fall back to memory storage
export const storage = process.env.AIRTABLE_API_KEY && process.env.AIRTABLE_BASE_ID 
  ? new AirtableStorage() 
  : new MemStorage();
