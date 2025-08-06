# Airtable Setup Guide for AI Sales Dashboard

## Overview
This guide will help you set up your Airtable base to work with the AI Sales Dashboard. The dashboard will pull real data from your Airtable tables and display it in the analytics interface.

## Required Tables and Fields

### 1. Leads Table
**Table Name:** `Leads`

| Field Name | Field Type | Description | Required |
|------------|------------|-------------|----------|
| Name | Single line text | Lead's full name | ✓ |
| Email | Email | Lead's email address | ✓ |
| Phone | Phone number | Lead's phone number | |
| Company | Single line text | Lead's company name | |
| Status | Single select | Lead status (new, contacted, qualified, meeting_booked, closed, lost) | ✓ |
| Stage | Single select | Pipeline stage (lead, prospect, opportunity, deal) | ✓ |
| Value | Currency | Potential deal value | |
| Source | Single select | Lead source (website, referral, cold_outreach, etc.) | |
| Assigned To | Single line text | Assigned sales rep | |
| Last Contacted | Date | When lead was last contacted | |
| Notes | Long text | Additional notes about the lead | |
| Priority | Single select | Priority level (low, medium, high) | |

**Status Options:**
- new
- contacted
- qualified
- meeting_booked
- closed
- lost

**Stage Options:**
- lead
- prospect
- opportunity
- deal

### 2. Meetings Table
**Table Name:** `Meetings`

| Field Name | Field Type | Description | Required |
|------------|------------|-------------|----------|
| Lead ID | Single line text | ID linking to lead record | ✓ |
| Title | Single line text | Meeting title | ✓ |
| Scheduled At | Date & time | When meeting is scheduled | ✓ |
| Duration | Number | Meeting duration in minutes | |
| Status | Single select | Meeting status (scheduled, completed, cancelled, no_show) | ✓ |
| Type | Single select | Meeting type (discovery, demo, closing, follow_up) | |
| Notes | Long text | Meeting notes | |

**Status Options:**
- scheduled
- completed
- cancelled
- no_show

**Type Options:**
- discovery
- demo
- closing
- follow_up

### 3. Activities Table
**Table Name:** `Activities`

| Field Name | Field Type | Description | Required |
|------------|------------|-------------|----------|
| Lead ID | Single line text | ID linking to lead record | |
| Type | Single select | Activity type | ✓ |
| Description | Long text | Activity description | ✓ |
| Status | Single select | Activity status (completed, pending, failed) | |
| Created At | Date & time | When activity was created | ✓ |

**Type Options:**
- lead_added
- call
- email
- meeting
- deal_closed
- note

**Status Options:**
- completed
- pending
- failed

### 4. Campaigns Table
**Table Name:** `Campaigns`

| Field Name | Field Type | Description | Required |
|------------|------------|-------------|----------|
| Name | Single line text | Campaign name | ✓ |
| Type | Single select | Campaign type (email, sms, call, mixed) | ✓ |
| Status | Single select | Campaign status (active, paused, completed) | ✓ |
| Target Segment | Single line text | Target audience segment | |

### 5. System Stats Table
**Table Name:** `System Stats`

| Field Name | Field Type | Description | Required |
|------------|------------|-------------|----------|
| Date | Date | Date of the stats | ✓ |
| Calls Completed | Number | Number of calls completed | |
| Meetings Scheduled | Number | Number of meetings scheduled | |
| Emails Sent | Number | Number of emails sent | |
| Response Rate | Percent | Response rate percentage | |
| Show Rate | Percent | Meeting show rate percentage | |
| Conversion Rate | Percent | Lead conversion rate | |

## Setup Steps

### Step 1: Create Your Airtable Base
1. Go to [Airtable.com](https://airtable.com) and create a new base
2. Name your base (e.g., "AI Sales Dashboard")

### Step 2: Create Tables
1. Create each of the 5 tables listed above
2. Add all the required fields with the correct field types
3. Set up the single select options as specified

### Step 3: Add Sample Data
Add some sample data to test the integration:

**Sample Leads:**
- Sarah Johnson, sarah@techcorp.com, TechCorp Solutions, contacted, prospect, $45,000
- Mike Chen, mike@startup.com, Startup Inc, new, lead, $12,000
- Alex Rodriguez, alex@bigcorp.com, Big Corp, meeting_booked, opportunity, $75,000

**Sample Activities:**
- "New lead Sarah Johnson added to pipeline", lead_added, completed
- "AI completed call with Mike Chen", call, completed
- "Meeting scheduled with Alex Rodriguez", meeting, completed

### Step 4: Get Your API Credentials
1. **API Key:** Go to [Airtable Account](https://airtable.com/account) → Developer hub → Personal access tokens → Create new token
   - Give it a name like "AI Dashboard"
   - Add scope: `data.records:read` for your base
   - Copy the token (starts with `pat...`)

2. **Base ID:** Go to your base → Help → API documentation
   - The Base ID will be shown at the top (starts with `app...`)

### Step 5: Add Credentials to Replit
1. In your Replit project, go to Secrets (lock icon in sidebar)
2. Add two secrets:
   - `AIRTABLE_API_KEY`: Your personal access token
   - `AIRTABLE_BASE_ID`: Your base ID

### Step 6: Test the Integration
1. Restart your application
2. The dashboard should now pull data from your Airtable base
3. Navigate to different pages to see your real data

## Field Mapping Reference

The dashboard expects specific field names. Make sure your Airtable fields match exactly:

### Leads Table Fields:
- `Name` → Lead name
- `Email` → Lead email
- `Phone` → Lead phone
- `Company` → Lead company
- `Status` → Lead status
- `Stage` → Pipeline stage
- `Value` → Deal value
- `Source` → Lead source
- `Priority` → Lead priority

### Alternative Field Names:
If you prefer different field names, the system also accepts lowercase versions:
- `name`, `email`, `phone`, `company`, `status`, `stage`, `value`, `source`

## Troubleshooting

### Common Issues:
1. **No data showing:** Check that your API key has the correct permissions
2. **Missing leads:** Verify your table is named exactly "Leads"
3. **API errors:** Check your Base ID is correct (starts with "app")

### Error Messages:
- `Airtable API error: 401` → API key is invalid
- `Airtable API error: 404` → Base ID is incorrect or table doesn't exist
- `No replacement was performed` → Table or field names don't match

## Advanced Features

### Custom Fields:
You can add additional fields to your tables. The dashboard will ignore fields it doesn't recognize.

### Formulas:
You can use Airtable formulas for calculated fields like:
- Lead score calculations
- Days since last contact
- Revenue projections

### Views:
Create different views in Airtable to organize your data:
- Hot leads (high priority)
- Recent activities
- This month's meetings

The dashboard will pull all records regardless of the view, but views help you manage data in Airtable.