import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  MessageSquare, 
  Users, 
  TrendingUp, 
  Eye, 
  Edit, 
  Play, 
  Pause, 
  Calendar,
  Target,
  BarChart3,
  Activity,
  Clock,
  Mail,
  MousePointer,
  CheckCircle,
  ArrowRight,
  ArrowDown,
  Sun,
  Moon,
  Menu,
  Plus,
  Filter,
  Search
} from "lucide-react";
import { useTheme } from "@/components/ui/theme-provider";
import { format, parseISO } from "date-fns";

// Mock campaign data
const mockCampaigns = [
  {
    id: "1",
    name: "Warm Lead Education Series",
    type: "Educational",
    description: "Multi-touch educational sequence for warm leads showing interest but not ready to buy",
    status: "Active",
    targetSegment: "Warm Leads",
    startDate: "2024-12-01T00:00:00Z",
    endDate: "2025-03-01T00:00:00Z",
    goal: "Book Meeting",
    leadsInCampaign: 145,
    openRate: 67.3,
    clickRate: 23.8,
    conversionRate: 8.2,
    steps: [
      { id: 1, name: "Welcome & Problem Validation", type: "Email", leads: 145, opens: 98, clicks: 35, conversions: 12, day: 0 },
      { id: 2, name: "Industry Case Study", type: "Email", leads: 133, opens: 89, clicks: 42, conversions: 18, day: 3 },
      { id: 3, name: "Product Demo Video", type: "Email", leads: 115, opens: 77, clicks: 31, conversions: 15, day: 7 },
      { id: 4, name: "Social Proof & Testimonials", type: "Email", leads: 100, opens: 68, clicks: 28, conversions: 11, day: 14 },
      { id: 5, name: "Meeting Booking CTA", type: "Email", leads: 89, opens: 60, clicks: 25, conversions: 12, day: 21 }
    ]
  },
  {
    id: "2", 
    name: "Cold Lead Re-engagement",
    type: "Re-engagement",
    description: "Automated sequence to re-activate cold leads who haven't engaged recently",
    status: "Active",
    targetSegment: "Cold Leads",
    startDate: "2024-11-15T00:00:00Z",
    endDate: "2025-02-15T00:00:00Z",
    goal: "Reactivate",
    leadsInCampaign: 89,
    openRate: 45.2,
    clickRate: 12.4,
    conversionRate: 4.5,
    steps: [
      { id: 1, name: "We Miss You - Value Reminder", type: "Email", leads: 89, opens: 40, clicks: 12, conversions: 4, day: 0 },
      { id: 2, name: "New Feature Announcement", type: "Email", leads: 85, opens: 38, clicks: 15, conversions: 6, day: 5 },
      { id: 3, name: "Limited Time Offer", type: "Email", leads: 79, opens: 35, clicks: 11, conversions: 3, day: 12 },
      { id: 4, name: "Final Attempt - Unsubscribe Warning", type: "Email", leads: 76, opens: 32, clicks: 8, conversions: 1, day: 21 }
    ]
  },
  {
    id: "3",
    name: "Hot Lead Closing Sequence", 
    type: "Closing",
    description: "High-touch sequence for hot leads ready to make a decision",
    status: "Active",
    targetSegment: "Hot Leads",
    startDate: "2024-12-15T00:00:00Z",
    endDate: "2025-01-31T00:00:00Z",
    goal: "Close Deal",
    leadsInCampaign: 34,
    openRate: 89.1,
    clickRate: 45.6,
    conversionRate: 35.3,
    steps: [
      { id: 1, name: "Personalized ROI Calculator", type: "Email", leads: 34, opens: 31, clicks: 18, conversions: 12, day: 0 },
      { id: 2, name: "Implementation Timeline", type: "Email", leads: 22, opens: 20, clicks: 14, conversions: 8, day: 2 },
      { id: 3, name: "Closing Call Invitation", type: "Email", leads: 14, opens: 13, clicks: 10, conversions: 8, day: 5 }
    ]
  },
  {
    id: "4",
    name: "Product Launch Teaser",
    type: "Announcement", 
    description: "Build excitement for upcoming product features with existing customers",
    status: "Paused",
    targetSegment: "Existing Customers",
    startDate: "2025-01-01T00:00:00Z",
    endDate: "2025-02-28T00:00:00Z",
    goal: "Generate Interest",
    leadsInCampaign: 0,
    openRate: 0,
    clickRate: 0,
    conversionRate: 0,
    steps: [
      { id: 1, name: "Coming Soon Announcement", type: "Email", leads: 0, opens: 0, clicks: 0, conversions: 0, day: 0 },
      { id: 2, name: "Behind the Scenes Preview", type: "Email", leads: 0, opens: 0, clicks: 0, conversions: 0, day: 7 },
      { id: 3, name: "Early Access Invitation", type: "Email", leads: 0, opens: 0, clicks: 0, conversions: 0, day: 14 }
    ]
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active": return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400";
    case "Paused": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400";
    case "Draft": return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400";
    default: return "bg-slate-100 text-slate-700 dark:bg-slate-900/20 dark:text-slate-400";
  }
};

const getSegmentColor = (segment: string) => {
  switch (segment) {
    case "Hot Leads": return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400";
    case "Warm Leads": return "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400";
    case "Cold Leads": return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400";
    case "Existing Customers": return "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400";
    default: return "bg-slate-100 text-slate-700 dark:bg-slate-900/20 dark:text-slate-400";
  }
};

const getCampaignTypeIcon = (type: string) => {
  switch (type) {
    case "Educational": return <MessageSquare className="h-5 w-5" />;
    case "Re-engagement": return <Activity className="h-5 w-5" />;
    case "Closing": return <Target className="h-5 w-5" />;
    case "Announcement": return <Mail className="h-5 w-5" />;
    default: return <MessageSquare className="h-5 w-5" />;
  }
};

export default function NurtureCampaigns() {
  const { theme, toggleTheme } = useTheme();
  const [selectedCampaign, setSelectedCampaign] = useState<typeof mockCampaigns[0] | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [segmentFilter, setSegmentFilter] = useState("all");

  const filteredCampaigns = mockCampaigns.filter(campaign => {
    const matchesStatus = statusFilter === "all" || campaign.status.toLowerCase() === statusFilter;
    const matchesSegment = segmentFilter === "all" || campaign.targetSegment.toLowerCase().includes(segmentFilter);
    return matchesStatus && matchesSegment;
  });

  const activeCampaigns = mockCampaigns.filter(c => c.status === "Active").length;
  const totalLeads = mockCampaigns.reduce((sum, c) => sum + c.leadsInCampaign, 0);
  const avgOpenRate = mockCampaigns.reduce((sum, c) => sum + c.openRate, 0) / mockCampaigns.length;
  const avgConversionRate = mockCampaigns.reduce((sum, c) => sum + c.conversionRate, 0) / mockCampaigns.length;

  return (
    <div className="flex-1 overflow-y-auto" data-testid="nurture-campaigns">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" className="lg:hidden p-2">
              <Menu className="h-5 w-5" />
            </Button>
            <div className="ml-4 lg:ml-0">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Nurture Campaigns
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Manage automated lead nurturing sequences
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">

            <Button variant="ghost" size="sm" onClick={toggleTheme} className="p-2">
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{activeCampaigns}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Active Campaigns</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalLeads}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Total Leads</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{avgOpenRate.toFixed(1)}%</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Avg Response Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{avgConversionRate.toFixed(1)}%</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Avg Conversion</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>

          <Select value={segmentFilter} onValueChange={setSegmentFilter}>
            <SelectTrigger className="w-48">
              <Users className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Segments</SelectItem>
              <SelectItem value="hot">Hot Leads</SelectItem>
              <SelectItem value="warm">Warm Leads</SelectItem>
              <SelectItem value="cold">Cold Leads</SelectItem>
              <SelectItem value="existing">Existing Customers</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Campaign Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCampaigns.map((campaign) => (
            <Card key={campaign.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getSegmentColor(campaign.targetSegment)}`}>
                      {getCampaignTypeIcon(campaign.type)}
                    </div>
                    <div>
                      <CardTitle className="text-lg leading-tight">{campaign.name}</CardTitle>
                      <p className="text-sm text-slate-500 mt-1">{campaign.type}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(campaign.status)} variant="secondary">
                    {campaign.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                  {campaign.description}
                </p>

                <div className="flex items-center justify-between text-sm">
                  <div>
                    <p className="text-slate-500">Target</p>
                    <Badge className={getSegmentColor(campaign.targetSegment)} variant="outline">
                      {campaign.targetSegment}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-500">Goal</p>
                    <p className="font-medium text-slate-900 dark:text-white">{campaign.goal}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-500">Duration</p>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {format(parseISO(campaign.startDate), "MMM d")} - {format(parseISO(campaign.endDate), "MMM d")}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">Leads</p>
                    <p className="font-medium text-slate-900 dark:text-white">{campaign.leadsInCampaign}</p>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Open Rate</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">{campaign.openRate.toFixed(1)}%</span>
                  </div>
                  <Progress value={campaign.openRate} className="h-2" />
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500">Click Rate</p>
                      <p className="font-medium text-slate-900 dark:text-white">{campaign.clickRate.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Conversion</p>
                      <p className="font-medium text-slate-900 dark:text-white">{campaign.conversionRate.toFixed(1)}%</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      {campaign.status === "Active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                  </div>
                  
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedCampaign(campaign)}
                        className="group-hover:bg-primary group-hover:text-primary-foreground"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="w-[800px] max-w-[90vw]">
                      <CampaignDetailView campaign={selectedCampaign} />
                    </SheetContent>
                  </Sheet>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// Campaign Detail View Component
function CampaignDetailView({ campaign }: { campaign: typeof mockCampaigns[0] | null }) {
  if (!campaign) return null;

  const totalClicks = campaign.steps.reduce((sum, step) => sum + step.clicks, 0);
  const totalConversions = campaign.steps.reduce((sum, step) => sum + step.conversions, 0);

  return (
    <div className="space-y-6">
      <SheetHeader>
        <SheetTitle className="text-xl">{campaign.name}</SheetTitle>
      </SheetHeader>

      {/* Campaign Summary */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {getCampaignTypeIcon(campaign.type)}
              Campaign Overview
            </CardTitle>
            <div className="flex items-center space-x-3">
              <Badge className={getStatusColor(campaign.status)}>
                {campaign.status}
              </Badge>
              <Switch 
                checked={campaign.status === "Active"} 
                disabled={campaign.status === "Draft"}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-700 dark:text-slate-300">{campaign.description}</p>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-slate-500">Target Segment</p>
              <Badge className={getSegmentColor(campaign.targetSegment)} variant="outline">
                {campaign.targetSegment}
              </Badge>
            </div>
            <div>
              <p className="text-slate-500">Goal</p>
              <p className="font-medium text-slate-900 dark:text-white">{campaign.goal}</p>
            </div>
            <div>
              <p className="text-slate-500">Duration</p>
              <p className="font-medium text-slate-900 dark:text-white">
                {format(parseISO(campaign.startDate), "MMM d")} - {format(parseISO(campaign.endDate), "MMM d")}
              </p>
            </div>
            <div>
              <p className="text-slate-500">Leads</p>
              <p className="font-medium text-slate-900 dark:text-white">{campaign.leadsInCampaign}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Journey Map Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Campaign Journey Flow
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {campaign.steps.map((step, index) => (
              <div key={step.id} className="relative">
                <div className="flex items-center space-x-4">
                  {/* Step Circle */}
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    <span className="text-blue-700 dark:text-blue-400 font-semibold">{step.id}</span>
                  </div>
                  
                  {/* Step Content */}
                  <div className="flex-1 bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white">{step.name}</h4>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-slate-600 dark:text-slate-400">
                          <span>Day {step.day}</span>
                          <span>•</span>
                          <span>{step.type}</span>
                        </div>
                      </div>
                      
                      {/* Step Metrics */}
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div className="text-center">
                          <p className="font-medium text-slate-900 dark:text-white">{step.leads}</p>
                          <p className="text-slate-500">Leads</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-slate-900 dark:text-white">{step.opens}</p>
                          <p className="text-slate-500">Opens</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-slate-900 dark:text-white">{step.clicks}</p>
                          <p className="text-slate-500">Clicks</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-slate-900 dark:text-white">{step.conversions}</p>
                          <p className="text-slate-500">Converts</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress Bars */}
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Open Rate</span>
                          <span>{((step.opens / step.leads) * 100).toFixed(1)}%</span>
                        </div>
                        <Progress value={(step.opens / step.leads) * 100} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Click Rate</span>
                          <span>{((step.clicks / step.opens) * 100).toFixed(1)}%</span>
                        </div>
                        <Progress value={(step.clicks / step.opens) * 100} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Conversion</span>
                          <span>{((step.conversions / step.leads) * 100).toFixed(1)}%</span>
                        </div>
                        <Progress value={(step.conversions / step.leads) * 100} className="h-2" />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Flow Arrow */}
                {index < campaign.steps.length - 1 && (
                  <div className="flex items-center justify-center my-2">
                    <ArrowDown className="h-6 w-6 text-slate-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Step Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {campaign.steps.map((step) => (
                <div key={step.id} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Step {step.id}: {step.name.substring(0, 20)}...</span>
                    <span>{((step.opens / step.leads) * 100).toFixed(1)}% / {((step.clicks / step.opens) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 transition-all duration-500"
                          style={{ width: `${(step.opens / step.leads) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Open Rate</p>
                    </div>
                    <div>
                      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-2 bg-green-500 transition-all duration-500"
                          style={{ width: `${(step.clicks / step.opens) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Click Rate</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Conversion Funnel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{campaign.leadsInCampaign}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Starting Leads</p>
              </div>
              
              <div className="flex items-center justify-center">
                <ArrowDown className="h-6 w-6 text-slate-400" />
              </div>
              
              <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{totalClicks}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Clicks</p>
              </div>
              
              <div className="flex items-center justify-center">
                <ArrowDown className="h-6 w-6 text-slate-400" />
              </div>
              
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{totalConversions}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Conversions</p>
              </div>
              
              <div className="text-center pt-4 border-t border-slate-200 dark:border-slate-700">
                <p className="text-lg font-semibold text-slate-900 dark:text-white">
                  {((totalConversions / campaign.leadsInCampaign) * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Overall Conversion Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}