import type { 
  Lead, 
  Meeting, 
  Activity, 
  Campaign, 
  SystemStats,
  DashboardMetrics,
  EnrichedActivity 
} from "@shared/schema";

interface AirtableRecord {
  id: string;
  fields: Record<string, any>;
  createdTime: string;
}

interface AirtableResponse {
  records: AirtableRecord[];
  offset?: string;
}

export class AirtableService {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor() {
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    
    if (!apiKey || !baseId) {
      throw new Error('AIRTABLE_API_KEY and AIRTABLE_BASE_ID must be set');
    }

    this.baseUrl = `https://api.airtable.com/v0/${baseId}`;
    this.headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  private async fetchRecords(tableName: string, params?: Record<string, string>): Promise<AirtableRecord[]> {
    try {
      // Encode table name for URL
      const encodedTableName = encodeURIComponent(tableName);
      const url = new URL(`${this.baseUrl}/${encodedTableName}`);
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          url.searchParams.append(key, value);
        });
      }

      console.log(`Fetching from Airtable: ${url.toString()}`);

      const response = await fetch(url.toString(), {
        headers: this.headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Airtable API error response:`, errorText);
        throw new Error(`Airtable API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data: AirtableResponse = await response.json();
      console.log(`Successfully fetched ${data.records.length} records from ${tableName}`);
      return data.records;
    } catch (error) {
      console.error(`Error fetching ${tableName}:`, error);
      throw error;
    }
  }

  async getLeads(): Promise<Lead[]> {
    try {
      // Try the specific table name first
      let records;
      try {
        records = await this.fetchRecords('L1 - Enriched Leads');
      } catch (tableError) {
        console.log('L1 - Enriched Leads table not found, trying Leads table');
        records = await this.fetchRecords('Leads');
      }
      
      return records.map(record => {
        const fields = record.fields;
        return {
          id: record.id,
          name: fields.Name || fields.name || fields['Lead Name'] || 'Unknown',
          email: fields.Email || fields.email || fields['Email Address'] || '',
          phone: fields.Phone || fields.phone || fields['Phone Number'] || null,
          company: fields.Company || fields.company || fields['Company Name'] || null,
          status: fields.Status || fields.status || fields['Lead Status'] || 'new',
          stage: fields.Stage || fields.stage || fields['Pipeline Stage'] || 'lead',
          value: fields.Value || fields.value || fields['Deal Value'] || fields['Potential Value'] || null,
          source: fields.Source || fields.source || fields['Lead Source'] || null,
          assignedTo: fields['Assigned To'] || fields.assignedTo || fields['Sales Rep'] || null,
          createdAt: new Date(record.createdTime),
          updatedAt: new Date(fields['Updated At'] || fields.updatedAt || fields['Last Modified'] || record.createdTime),
          lastContactedAt: fields['Last Contacted'] || fields.lastContactedAt || fields['Last Contact Date'] ? 
            new Date(fields['Last Contacted'] || fields.lastContactedAt || fields['Last Contact Date']) : null,
          notes: fields.Notes || fields.notes || fields.Comments || null,
          metadata: this.parseMetadata(fields)
        };
      });
    } catch (error) {
      console.error('Error fetching leads from Airtable:', error);
      return [];
    }
  }

  private parseMetadata(fields: Record<string, any>) {
    // Try to parse JSON metadata first
    if (fields.Metadata) {
      try {
        return JSON.parse(fields.Metadata);
      } catch (e) {
        // If JSON parsing fails, continue with fallback
      }
    }
    
    // Create metadata from individual fields
    return {
      priority: fields.Priority || fields.priority || fields['Lead Priority'] || 'medium',
      industry: fields.Industry || fields.industry || null,
      leadScore: fields['Lead Score'] || fields.leadScore || null,
      tags: fields.Tags || fields.tags || null
    };
  }

  async getMeetings(): Promise<Meeting[]> {
    try {
      const records = await this.fetchRecords('Meetings');
      
      return records.map(record => {
        const fields = record.fields;
        return {
          id: record.id,
          leadId: fields['Lead ID'] || fields.leadId || '',
          title: fields.Title || fields.title || 'Meeting',
          scheduledAt: new Date(fields['Scheduled At'] || fields.scheduledAt),
          duration: fields.Duration || fields.duration || 30,
          status: fields.Status || fields.status || 'scheduled',
          meetingType: fields.Type || fields.meetingType || 'discovery',
          notes: fields.Notes || fields.notes || null,
          createdAt: new Date(record.createdTime),
          updatedAt: new Date(fields['Updated At'] || fields.updatedAt || record.createdTime),
        };
      });
    } catch (error) {
      console.error('Error fetching meetings from Airtable:', error);
      return [];
    }
  }

  async getActivities(limit?: number): Promise<Activity[]> {
    try {
      const params: Record<string, string> = {
        'sort[0][field]': 'Created At',
        'sort[0][direction]': 'desc'
      };
      
      if (limit) {
        params.maxRecords = limit.toString();
      }

      const records = await this.fetchRecords('Activities', params);
      
      return records.map(record => {
        const fields = record.fields;
        return {
          id: record.id,
          leadId: fields['Lead ID'] || fields.leadId || null,
          type: fields.Type || fields.type || 'note',
          description: fields.Description || fields.description || '',
          status: fields.Status || fields.status || 'completed',
          metadata: fields.Metadata ? JSON.parse(fields.Metadata) : null,
          createdAt: new Date(record.createdTime),
        };
      });
    } catch (error) {
      console.error('Error fetching activities from Airtable:', error);
      return [];
    }
  }

  async getCampaigns(): Promise<Campaign[]> {
    try {
      const records = await this.fetchRecords('Campaigns');
      
      return records.map(record => {
        const fields = record.fields;
        return {
          id: record.id,
          name: fields.Name || fields.name || 'Campaign',
          type: fields.Type || fields.type || 'email',
          status: fields.Status || fields.status || 'active',
          targetSegment: fields['Target Segment'] || fields.targetSegment || null,
          createdAt: new Date(record.createdTime),
          updatedAt: new Date(fields['Updated At'] || fields.updatedAt || record.createdTime),
        };
      });
    } catch (error) {
      console.error('Error fetching campaigns from Airtable:', error);
      return [];
    }
  }

  async getSystemStats(): Promise<SystemStats[]> {
    try {
      const records = await this.fetchRecords('System Stats', {
        'sort[0][field]': 'Date',
        'sort[0][direction]': 'desc'
      });
      
      return records.map(record => {
        const fields = record.fields;
        return {
          id: record.id,
          date: new Date(fields.Date || record.createdTime),
          callsCompleted: fields['Calls Completed'] || fields.callsCompleted || 0,
          meetingsScheduled: fields['Meetings Scheduled'] || fields.meetingsScheduled || 0,
          emailsSent: fields['Emails Sent'] || fields.emailsSent || 0,
          responseRate: fields['Response Rate'] || fields.responseRate || null,
          showRate: fields['Show Rate'] || fields.showRate || null,
          conversionRate: fields['Conversion Rate'] || fields.conversionRate || null,
        };
      });
    } catch (error) {
      console.error('Error fetching system stats from Airtable:', error);
      return [];
    }
  }

  async getDashboardMetrics(): Promise<DashboardMetrics> {
    try {
      const [leads, meetings, activities, stats] = await Promise.all([
        this.getLeads(),
        this.getMeetings(),
        this.getActivities(),
        this.getSystemStats()
      ]);

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

      const potentialDeals = potentialDealsValue > 1000000 
        ? `$${(potentialDealsValue / 1000000).toFixed(1)}M`
        : potentialDealsValue > 1000
        ? `$${(potentialDealsValue / 1000).toFixed(1)}K`
        : `$${potentialDealsValue.toLocaleString()}`;

      // Get today's stats
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayStats = stats.find(stat => {
        const statDate = new Date(stat.date);
        statDate.setHours(0, 0, 0, 0);
        return statDate.getTime() === today.getTime();
      });

      const callsToday = todayStats?.callsCompleted || 0;
      const meetingsScheduled = todayStats?.meetingsScheduled || 0;
      const showRate = todayStats?.showRate ? `${todayStats.showRate}%` : '0%';

      // Generate pipeline data from recent activities/leads
      const pipelineData = this.generatePipelineData(leads, activities);

      return {
        totalLeads,
        contactedLeads,
        meetingsBooked,
        potentialDeals,
        callsToday,
        meetingsScheduled,
        showRate,
        pipelineData
      };
    } catch (error) {
      console.error('Error calculating dashboard metrics:', error);
      // Return fallback metrics if Airtable fails
      return {
        totalLeads: 0,
        contactedLeads: 0,
        meetingsBooked: 0,
        potentialDeals: '$0',
        callsToday: 0,
        meetingsScheduled: 0,
        showRate: '0%',
        pipelineData: []
      };
    }
  }

  async getRecentActivities(limit: number = 5): Promise<EnrichedActivity[]> {
    try {
      const [activities, leads] = await Promise.all([
        this.getActivities(limit),
        this.getLeads()
      ]);

      const leadMap = new Map(leads.map(lead => [lead.id, lead]));

      return activities.map(activity => {
        const lead = activity.leadId ? leadMap.get(activity.leadId) : undefined;
        const timeAgo = this.getTimeAgo(activity.createdAt!);
        const category = (activity.metadata as any)?.category || this.getCategoryFromType(activity.type);

        return {
          ...activity,
          leadName: lead?.name,
          timeAgo,
          category
        };
      });
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      return [];
    }
  }

  private generatePipelineData(leads: Lead[], activities: Activity[]) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    // Generate data for last 12 months based on actual lead creation dates
    const pipelineData = months.map((month, index) => {
      const monthIndex = (currentMonth - 11 + index + 12) % 12;
      const year = new Date().getFullYear() - (currentMonth - 11 + index < 0 ? 1 : 0);
      
      const monthLeads = leads.filter(lead => {
        if (!lead.createdAt) return false;
        const leadDate = new Date(lead.createdAt);
        return leadDate.getMonth() === monthIndex && leadDate.getFullYear() === year;
      });

      const monthContacted = monthLeads.filter(lead => 
        ['contacted', 'qualified', 'meeting_booked', 'closed'].includes(lead.status)
      );

      const monthMeetings = monthLeads.filter(lead => 
        lead.status === 'meeting_booked'
      );

      return {
        month: months[monthIndex],
        totalLeads: monthLeads.length,
        contacted: monthContacted.length,
        meetingsBooked: monthMeetings.length
      };
    });

    return pipelineData;
  }

  private getCategoryFromType(type: string): string {
    switch (type) {
      case 'lead_added':
        return 'Lead Generation';
      case 'call':
        return 'Outreach';
      case 'meeting':
        return 'Meeting';
      case 'deal_closed':
        return 'Conversion';
      case 'email':
        return 'Email';
      default:
        return 'General';
    }
  }

  private getTimeAgo(date: Date | null): string {
    if (!date) return 'Unknown';
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

export const airtableService = new AirtableService();