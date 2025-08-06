import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Dashboard metrics endpoint
  app.get("/api/dashboard/metrics", async (req, res) => {
    try {
      const metrics = await storage.getDashboardMetrics();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard metrics" });
    }
  });

  // Recent activities endpoint
  app.get("/api/dashboard/activities", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 5;
      const activities = await storage.getRecentActivities(limit);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch recent activities" });
    }
  });

  // Test Airtable connection
  app.get("/api/test-airtable", async (req, res) => {
    try {
      const apiKey = process.env.AIRTABLE_API_KEY;
      const baseId = process.env.AIRTABLE_BASE_ID;
      
      if (!apiKey || !baseId) {
        return res.json({ 
          status: "error", 
          message: "Missing API credentials",
          hasApiKey: !!apiKey,
          hasBaseId: !!baseId
        });
      }

      // Test basic API access
      const baseUrl = `https://api.airtable.com/v0/${baseId}`;
      const response = await fetch(`${baseUrl}/L1%20-%20Enriched%20Leads?maxRecords=1`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        return res.json({
          status: "error",
          statusCode: response.status,
          message: response.statusText,
          details: errorText
        });
      }

      const data = await response.json();
      res.json({
        status: "success",
        message: "Airtable connection successful",
        recordCount: data.records?.length || 0,
        sampleRecord: data.records?.[0] || null
      });
    } catch (error) {
      res.json({
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Leads endpoints
  app.get("/api/leads", async (req, res) => {
    try {
      const leads = await storage.getLeads();
      res.json(leads);
    } catch (error) {
      console.error("Error in /api/leads:", error);
      res.status(500).json({ 
        error: "Failed to fetch leads",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/leads/:id", async (req, res) => {
    try {
      const lead = await storage.getLead(req.params.id);
      if (!lead) {
        return res.status(404).json({ error: "Lead not found" });
      }
      res.json(lead);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch lead" });
    }
  });

  // Meetings endpoints
  app.get("/api/meetings", async (req, res) => {
    try {
      const meetings = await storage.getMeetings();
      res.json(meetings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch meetings" });
    }
  });

  // Campaigns endpoints
  app.get("/api/campaigns", async (req, res) => {
    try {
      const campaigns = await storage.getCampaigns();
      res.json(campaigns);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch campaigns" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
