import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Phone, 
  Mail, 
  Building, 
  Calendar, 
  DollarSign,
  Star,
  Clock,
  User,
  Menu,
  Moon,
  Sun
} from "lucide-react";
import { useTheme } from "@/components/ui/theme-provider";
import type { Lead } from "@shared/schema";

export default function LeadInsights() {
  const { theme, toggleTheme } = useTheme();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();

  const { data: leads, isLoading, refetch } = useQuery<Lead[]>({
    queryKey: ["/api/leads"],
    refetchInterval: 30000, // Refresh every 30 seconds for real-time updates
  });

  const filteredLeads = leads?.filter(lead => 
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Select first lead by default
  if (leads && leads.length > 0 && !selectedLead) {
    setSelectedLead(leads[0]);
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
      case "contacted":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400";
      case "qualified":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400";
      case "meeting_booked":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400";
      case "closed":
        return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400";
      case "lost":
        return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "lead":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400";
      case "prospect":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400";
      case "opportunity":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400";
      case "deal":
        return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Not available";
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(date));
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto">
        <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <Button variant="ghost" size="sm" className="lg:hidden p-2" data-testid="mobile-menu-button">
                <Menu className="h-5 w-5" />
              </Button>
              <div className="ml-4 lg:ml-0">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Lead Insights</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">Review and manage your lead pipeline</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="p-2"
              data-testid="theme-toggle"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </header>

        <div className="flex h-[calc(100vh-81px)]">
          <div className="w-80 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 animate-pulse">
            <div className="p-4 space-y-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3 p-3">
                  <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 bg-slate-50 dark:bg-slate-900 animate-pulse">
            <div className="p-8 space-y-6">
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
              <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto" data-testid="lead-insights">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700" data-testid="header">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" className="lg:hidden p-2" data-testid="mobile-menu-button">
              <Menu className="h-5 w-5" />
            </Button>
            <div className="ml-4 lg:ml-0">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white" data-testid="page-title">
                Lead Insights
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400" data-testid="page-subtitle">
                Review and manage your lead pipeline
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="p-2"
            data-testid="theme-toggle"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      <div className="flex h-[calc(100vh-81px)]">
        {/* Left Sidebar - Leads List */}
        <div className="w-80 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col" data-testid="leads-sidebar">
          {/* Search and Filters */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white" data-testid="leads-title">
                Leads
              </h2>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" data-testid="filter-button">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" data-testid="more-options">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="search-input"
              />
            </div>

            <div className="mt-3 text-xs text-slate-500 dark:text-slate-400" data-testid="leads-count">
              {filteredLeads.length} leads found
            </div>
          </div>

          {/* Leads List */}
          <div className="flex-1 overflow-y-auto" data-testid="leads-list">
            {filteredLeads.map((lead, index) => (
              <div
                key={lead.id}
                onClick={() => setSelectedLead(lead)}
                className={`flex items-center space-x-3 p-4 cursor-pointer border-b border-slate-100 dark:border-slate-700 transition-colors ${
                  selectedLead?.id === lead.id
                    ? "bg-primary/5 border-l-2 border-l-primary"
                    : "hover:bg-slate-50 dark:hover:bg-slate-700"
                }`}
                data-testid={`lead-item-${index}`}
              >
                <Avatar className="h-10 w-10" data-testid={`lead-avatar-${index}`}>
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                    {getInitials(lead.name)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate" data-testid={`lead-name-${index}`}>
                      {lead.name}
                    </p>
                    {(lead.metadata as any)?.priority === "high" && (
                      <Star className="h-3 w-3 text-amber-500 ml-1" data-testid={`lead-priority-${index}`} />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate" data-testid={`lead-company-${index}`}>
                    {lead.company || "No company"}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${getStatusColor(lead.status)}`}
                      data-testid={`lead-status-${index}`}
                    >
                      {lead.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Lead Details */}
        <div className="flex-1 bg-slate-50 dark:bg-slate-900 overflow-y-auto" data-testid="lead-details">
          {selectedLead ? (
            <div className="p-8" data-testid="selected-lead-details">
              {/* Lead Header */}
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20" data-testid="selected-lead-avatar">
                    <AvatarFallback className="bg-primary/10 text-primary text-xl font-medium">
                      {getInitials(selectedLead.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white" data-testid="selected-lead-name">
                      {selectedLead.name}
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400" data-testid="selected-lead-company">
                      {selectedLead.company || "No company"}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge 
                        className={`${getStageColor(selectedLead.stage)}`}
                        data-testid="selected-lead-stage"
                      >
                        {selectedLead.stage}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button variant="outline" data-testid="edit-lead-button">
                  Edit
                </Button>
              </div>

              {/* Lead Information Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Contact Information */}
                <Card className="bg-white dark:bg-slate-800" data-testid="contact-info-card">
                  <CardHeader>
                    <CardTitle className="text-lg text-slate-900 dark:text-white">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3" data-testid="contact-email">
                      <Mail className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">Email</span>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">{selectedLead.email}</span>
                    </div>
                    {selectedLead.phone && (
                      <div className="flex items-center space-x-3" data-testid="contact-phone">
                        <Phone className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">Phone</span>
                        <span className="text-sm font-medium text-slate-900 dark:text-white">{selectedLead.phone}</span>
                      </div>
                    )}
                    {selectedLead.company && (
                      <div className="flex items-center space-x-3" data-testid="contact-company">
                        <Building className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">Company</span>
                        <span className="text-sm font-medium text-slate-900 dark:text-white">{selectedLead.company}</span>
                      </div>
                    )}
                    {selectedLead.source && (
                      <div className="flex items-center space-x-3" data-testid="contact-source">
                        <User className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">Source</span>
                        <span className="text-sm font-medium text-slate-900 dark:text-white">{selectedLead.source}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Lead Details */}
                <Card className="bg-white dark:bg-slate-800" data-testid="lead-details-card">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg text-slate-900 dark:text-white">Lead Details</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => refetch()}>
                      Refresh Data
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {(selectedLead.metadata as any)?.firstName && (
                      <div className="flex items-center space-x-3" data-testid="lead-firstname">
                        <User className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">First Name</span>
                        <span className="text-sm font-medium text-slate-900 dark:text-white">{(selectedLead.metadata as any).firstName}</span>
                      </div>
                    )}
                    {(selectedLead.metadata as any)?.lastName && (
                      <div className="flex items-center space-x-3" data-testid="lead-lastname">
                        <User className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">Last Name</span>
                        <span className="text-sm font-medium text-slate-900 dark:text-white">{(selectedLead.metadata as any).lastName}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-3" data-testid="lead-created">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">Created</span>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {formatDate(selectedLead.createdAt)}
                      </span>
                    </div>
                    {selectedLead.lastContactedAt && (
                      <div className="flex items-center space-x-3" data-testid="lead-last-contacted">
                        <Clock className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">Last Contacted</span>
                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                          {formatDate(selectedLead.lastContactedAt)}
                        </span>
                      </div>
                    )}
                    {selectedLead.value && (
                      <div className="flex items-center space-x-3" data-testid="lead-value">
                        <DollarSign className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">Potential Value</span>
                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                          ${parseFloat(selectedLead.value).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {(selectedLead.metadata as any)?.priority && (
                      <div className="flex items-center space-x-3" data-testid="lead-priority">
                        <Star className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">Priority</span>
                        <span className="text-sm font-medium text-slate-900 dark:text-white capitalize">
                          {(selectedLead.metadata as any).priority}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Notes Section */}
              {selectedLead.notes && (
                <Card className="bg-white dark:bg-slate-800" data-testid="notes-card">
                  <CardHeader>
                    <CardTitle className="text-lg text-slate-900 dark:text-white">Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600 dark:text-slate-400" data-testid="lead-notes">
                      {selectedLead.notes}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* All Airtable Data - Dynamic Display */}
              {selectedLead.metadata && Object.keys(selectedLead.metadata).length > 0 && (
                <Card className="bg-white dark:bg-slate-800" data-testid="airtable-data-card">
                  <CardHeader>
                    <CardTitle className="text-lg text-slate-900 dark:text-white">All Airtable Data</CardTitle>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Live data from your L1 - Enriched Leads table
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {Object.entries(selectedLead.metadata)
                        .filter(([key, value]) => value !== null && value !== undefined && value !== '')
                        .map(([key, value]) => (
                          <div key={key} className="flex items-start space-x-3" data-testid={`metadata-${key}`}>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                {key.replace(/_/g, ' ')}
                              </p>
                              <p className="text-sm font-medium text-slate-900 dark:text-white mt-1 break-words">
                                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <User className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No Lead Selected</h3>
                <p className="text-slate-500 dark:text-slate-400">Select a lead from the list to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}