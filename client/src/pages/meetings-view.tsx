import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Search, 
  Filter,
  Grid3X3,
  List,
  Video,
  Phone,
  Users,
  TrendingUp,
  CheckCircle,
  XCircle,
  RotateCcw,
  Eye,
  Edit,
  Sun,
  Moon,
  Menu,
  Building,
  Mail,
  User,
  Target,
  Lightbulb,
  FileText,
  AlertCircle,
  Star
} from "lucide-react";
import { useTheme } from "@/components/ui/theme-provider";
import { format, isToday, isTomorrow, parseISO } from "date-fns";

// Mock meeting data
const mockMeetings = [
  {
    id: "1",
    date: "2025-01-14T10:00:00Z",
    lead: { name: "Sarah Chen", company: "TechCorp", avatar: "SC", score: "Hot" },
    type: "Demo Call",
    status: "Scheduled",
    duration: 45,
    agenda: "Product demo, pricing discussion, technical requirements review",
    notes: "Interested in enterprise features, budget approved for Q1",
    insights: ["Looking for API integration capabilities", "Concerned about data security", "Timeline: implement by March"],
    painPoints: ["Current solution lacks automation", "Manual processes taking 20hrs/week"],
    objections: ["Price point concerns", "Integration complexity"],
    outcome: null
  },
  {
    id: "2", 
    date: "2025-01-14T14:30:00Z",
    lead: { name: "Mike Johnson", company: "DataFlow", avatar: "MJ", score: "Warm" },
    type: "Discovery Call",
    status: "Scheduled",
    duration: 30,
    agenda: "Understand current workflow, identify pain points, qualify budget",
    notes: "Mid-size company, growing fast, looking to scale operations",
    insights: ["Team of 50+ people", "Annual revenue $10M+", "Tech-forward leadership"],
    painPoints: ["Data silos across departments", "Reporting takes days instead of hours"],
    objections: ["Need buy-in from CTO", "Current contract expires in 6 months"],
    outcome: null
  },
  {
    id: "3",
    date: "2025-01-13T16:00:00Z",
    lead: { name: "Emily Rodriguez", company: "CloudSync", avatar: "ER", score: "Hot" },
    type: "Closing Call",
    status: "Completed",
    duration: 60,
    agenda: "Final pricing negotiation, contract terms, implementation timeline",
    notes: "Ready to move forward, some concerns about onboarding timeline",
    insights: ["Decision maker present", "Budget approved", "Urgent need - competitor pressuring"],
    painPoints: ["Losing customers due to slow service", "Manual processes causing errors"],
    objections: ["Onboarding timeline too long", "Training requirements"],
    outcome: "Deal Won - $50k ARR"
  },
  {
    id: "4",
    date: "2025-01-12T11:00:00Z", 
    lead: { name: "David Park", company: "AI Solutions", avatar: "DP", score: "Cold" },
    type: "Intro Call",
    status: "No-Show",
    duration: 30,
    agenda: "Company introduction, understand their needs, qualify opportunity",
    notes: "Reached out via LinkedIn, expressed interest in automation",
    insights: ["Small team", "Early stage startup", "Bootstrap funded"],
    painPoints: ["Limited resources", "Need to automate to scale"],
    objections: ["Budget constraints", "Not ready to commit"],
    outcome: null
  },
  {
    id: "5",
    date: "2025-01-15T09:00:00Z",
    lead: { name: "Lisa Wang", company: "FinTech Pro", avatar: "LW", score: "Hot" },
    type: "Technical Deep Dive",
    status: "Scheduled",
    duration: 90,
    agenda: "API documentation review, security compliance, integration planning",
    notes: "Technical team wants deep dive before commitment",
    insights: ["Security is top priority", "Complex integration needs", "Large enterprise deal"],
    painPoints: ["Compliance requirements", "Legacy system integration"],
    objections: ["Security audit required", "Long procurement process"],
    outcome: null
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Scheduled": return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400";
    case "Completed": return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400";
    case "No-Show": return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400";
    case "Rescheduled": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400";
    case "Cancelled": return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400";
    default: return "bg-slate-100 text-slate-700 dark:bg-slate-900/20 dark:text-slate-400";
  }
};

const getScoreColor = (score: string) => {
  switch (score) {
    case "Hot": return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400";
    case "Warm": return "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400";
    case "Cold": return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400";
    default: return "bg-slate-100 text-slate-700 dark:bg-slate-900/20 dark:text-slate-400";
  }
};

const getMeetingTypeIcon = (type: string) => {
  switch (type) {
    case "Demo Call": return <Video className="h-4 w-4" />;
    case "Discovery Call": return <Search className="h-4 w-4" />;
    case "Closing Call": return <Target className="h-4 w-4" />;
    case "Intro Call": return <Phone className="h-4 w-4" />;
    case "Technical Deep Dive": return <Users className="h-4 w-4" />;
    default: return <CalendarIcon className="h-4 w-4" />;
  }
};

export default function MeetingsView() {
  const { theme, toggleTheme } = useTheme();
  const [view, setView] = useState<"calendar" | "table">("table");
  const [dateRange, setDateRange] = useState("today");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMeeting, setSelectedMeeting] = useState<typeof mockMeetings[0] | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const filteredMeetings = mockMeetings.filter(meeting => {
    const matchesSearch = meeting.lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         meeting.lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         meeting.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || meeting.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const todaysMeetings = mockMeetings.filter(meeting => isToday(parseISO(meeting.date)));
  const upcomingMeetings = mockMeetings.filter(meeting => new Date(meeting.date) > new Date());

  return (
    <div className="flex-1 overflow-y-auto" data-testid="meetings-view">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" className="lg:hidden p-2">
              <Menu className="h-5 w-5" />
            </Button>
            <div className="ml-4 lg:ml-0">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Meetings View
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Manage all scheduled and past meetings
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={toggleTheme} className="p-2">
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Today's Meetings Highlight */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-blue-900 dark:text-blue-100 flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Today's Meetings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todaysMeetings.length > 0 ? (
              <div className="space-y-3">
                {todaysMeetings.map((meeting) => (
                  <div key={meeting.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-8 bg-blue-500 rounded-full" />
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {format(parseISO(meeting.date), "h:mm a")} - {meeting.lead.name}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {meeting.type} • {meeting.lead.company}
                        </p>
                      </div>
                    </div>
                    <Badge className={getScoreColor(meeting.lead.score)}>
                      {meeting.lead.score}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-blue-700 dark:text-blue-300">No meetings scheduled for today</p>
            )}
          </CardContent>
        </Card>

        {/* Top Bar Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-3">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="no-show">No-Show</SelectItem>
                <SelectItem value="rescheduled">Rescheduled</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search meetings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant={view === "table" ? "default" : "outline"}
              size="sm"
              onClick={() => setView("table")}
            >
              <List className="h-4 w-4 mr-2" />
              Table
            </Button>
            <Button
              variant={view === "calendar" ? "default" : "outline"}
              size="sm"
              onClick={() => setView("calendar")}
            >
              <Grid3X3 className="h-4 w-4 mr-2" />
              Calendar
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Tabs value={view} onValueChange={(v) => setView(v as "calendar" | "table")}>
              {/* Table View */}
              <TabsContent value="table" className="mt-0">
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-slate-50 dark:bg-slate-800">
                          <tr>
                            <th className="text-left p-4 font-medium text-slate-900 dark:text-white">Date & Time</th>
                            <th className="text-left p-4 font-medium text-slate-900 dark:text-white">Lead</th>
                            <th className="text-left p-4 font-medium text-slate-900 dark:text-white">Type</th>
                            <th className="text-left p-4 font-medium text-slate-900 dark:text-white">Status</th>
                            <th className="text-left p-4 font-medium text-slate-900 dark:text-white">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredMeetings.map((meeting) => (
                            <tr key={meeting.id} className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                              <td className="p-4">
                                <div className="flex items-center space-x-2">
                                  <Clock className="h-4 w-4 text-slate-400" />
                                  <div>
                                    <p className="font-medium text-slate-900 dark:text-white">
                                      {format(parseISO(meeting.date), "MMM d")}
                                    </p>
                                    <p className="text-sm text-slate-500">
                                      {format(parseISO(meeting.date), "h:mm a")}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center space-x-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                                      {meeting.lead.avatar}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium text-slate-900 dark:text-white">
                                      {meeting.lead.name}
                                    </p>
                                    <p className="text-sm text-slate-500">
                                      {meeting.lead.company}
                                    </p>
                                  </div>
                                  <Badge className={getScoreColor(meeting.lead.score)} variant="secondary">
                                    {meeting.lead.score}
                                  </Badge>
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center space-x-2">
                                  {getMeetingTypeIcon(meeting.type)}
                                  <span className="text-sm text-slate-900 dark:text-white">
                                    {meeting.type}
                                  </span>
                                </div>
                              </td>
                              <td className="p-4">
                                <Badge className={getStatusColor(meeting.status)} variant="secondary">
                                  {meeting.status}
                                </Badge>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center space-x-2">
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => setSelectedMeeting(meeting)}
                                      >
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                      <MeetingDetailsPopup meeting={selectedMeeting} />
                                    </DialogContent>
                                  </Dialog>
                                  {meeting.status === "Scheduled" && (
                                    <Button variant="ghost" size="sm">
                                      <CheckCircle className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Calendar View */}
              <TabsContent value="calendar" className="mt-0">
                <Card>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          className="rounded-md border"
                        />
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                          {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a date"}
                        </h3>
                        {selectedDate && (
                          <div className="space-y-3">
                            {mockMeetings
                              .filter(meeting => 
                                selectedDate && 
                                format(parseISO(meeting.date), "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
                              )
                              .map((meeting) => (
                                <div key={meeting.id} className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                      <div className={`w-3 h-3 rounded-full ${
                                        meeting.lead.score === "Hot" ? "bg-red-500" :
                                        meeting.lead.score === "Warm" ? "bg-orange-500" : "bg-blue-500"
                                      }`} />
                                      <div>
                                        <p className="font-medium text-slate-900 dark:text-white">
                                          {format(parseISO(meeting.date), "h:mm a")} - {meeting.lead.name}
                                        </p>
                                        <p className="text-sm text-slate-500">
                                          {meeting.type} • {meeting.lead.company}
                                        </p>
                                      </div>
                                    </div>
                                    <Badge className={getStatusColor(meeting.status)} variant="secondary">
                                      {meeting.status}
                                    </Badge>
                                  </div>
                                </div>
                              ))
                            }
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Performance Metrics Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  This Week
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">12</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Meetings Booked</p>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">85%</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Show Rate</p>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">60%</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Conversion Rate</p>
                </div>
              </CardContent>
            </Card>


          </div>
        </div>
      </div>
    </div>
  );
}

// Meeting Details Popup Component
function MeetingDetailsPopup({ meeting }: { meeting: typeof mockMeetings[0] | null }) {
  if (!meeting) return null;

  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle className="text-xl">Meeting Details</DialogTitle>
      </DialogHeader>

      {/* Lead Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5" />
            Lead Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary/10 text-primary">
                {meeting.lead.avatar}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">{meeting.lead.name}</h3>
              <p className="text-slate-600 dark:text-slate-400">{meeting.lead.company}</p>
              <Badge className={getScoreColor(meeting.lead.score)} variant="secondary">
                {meeting.lead.score} Lead
              </Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-500">Meeting Type</p>
              <p className="font-medium text-slate-900 dark:text-white">{meeting.type}</p>
            </div>
            <div>
              <p className="text-slate-500">Duration</p>
              <p className="font-medium text-slate-900 dark:text-white">{meeting.duration} mins</p>
            </div>
            <div>
              <p className="text-slate-500">Date & Time</p>
              <p className="font-medium text-slate-900 dark:text-white">
                {format(parseISO(meeting.date), "MMM d, h:mm a")}
              </p>
            </div>
            <div>
              <p className="text-slate-500">Status</p>
              <Badge className={getStatusColor(meeting.status)} variant="secondary">
                {meeting.status}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meeting Agenda */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Meeting Agenda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-700 dark:text-slate-300">{meeting.agenda}</p>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            AI Insights & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Key Insights
            </h4>
            <ul className="space-y-1">
              {meeting.insights.map((insight, index) => (
                <li key={index} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                  <Star className="h-3 w-3 mt-1 text-blue-500" />
                  {insight}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Pain Points
            </h4>
            <ul className="space-y-1">
              {meeting.painPoints.map((pain, index) => (
                <li key={index} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                  <XCircle className="h-3 w-3 mt-1 text-red-500" />
                  {pain}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              Likely Objections & Responses
            </h4>
            <ul className="space-y-1">
              {meeting.objections.map((objection, index) => (
                <li key={index} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                  <AlertCircle className="h-3 w-3 mt-1 text-orange-500" />
                  {objection}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-700 dark:text-slate-300">{meeting.notes}</p>
          {meeting.outcome && (
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <p className="font-semibold text-green-800 dark:text-green-400">Outcome:</p>
              <p className="text-green-700 dark:text-green-300">{meeting.outcome}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}