import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Phone, 
  Calendar, 
  MessageSquare, 
  UserX, 
  CheckCircle, 
  XCircle, 
  Trophy,
  Sun,
  Moon,
  Menu,
  TrendingUp,
  BarChart3,
  Clock
} from "lucide-react";
import { useTheme } from "@/components/ui/theme-provider";

// Mock data for pipeline stages
const pipelineStages = [
  { id: 1, name: "Lead Enriched", icon: Users, color: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400", count: 145 },
  { id: 2, name: "Initial AI Call Done", icon: Phone, color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400", count: 89 },
  { id: 3, name: "Meeting Booked", icon: Calendar, color: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400", count: 67 },
  { id: 4, name: "In Nurture Campaign", icon: MessageSquare, color: "bg-pink-100 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400", count: 45 },
  { id: 5, name: "Meeting No Show-up", icon: UserX, color: "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400", count: 23 },
  { id: 6, name: "Meeting Finished", icon: CheckCircle, color: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400", count: 34 },
  { id: 7, name: "No More Interested", icon: XCircle, color: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400", count: 12 },
  { id: 8, name: "Deal Won", icon: Trophy, color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400", count: 18 }
];

// Mock lead data with expanded dataset for each stage
const mockLeadsByStage = {
  "Lead Enriched": [
    { id: "1", name: "Sarah Chen", company: "TechCorp", avatar: "SC", email: "sarah@techcorp.com", score: "Hot", addedDate: "2025-01-14" },
    { id: "2", name: "Mike Johnson", company: "DataFlow", avatar: "MJ", email: "mike@dataflow.com", score: "Warm", addedDate: "2025-01-14" },
    { id: "3", name: "Alex Kumar", company: "CloudTech", avatar: "AK", email: "alex@cloudtech.com", score: "Cold", addedDate: "2025-01-13" },
    { id: "4", name: "Emma Wilson", company: "DevCorp", avatar: "EW", email: "emma@devcorp.com", score: "Hot", addedDate: "2025-01-13" },
    { id: "5", name: "John Smith", company: "StartupXYZ", avatar: "JS", email: "john@startupxyz.com", score: "Warm", addedDate: "2025-01-12" },
  ],
  "Initial AI Call Done": [
    { id: "6", name: "Lisa Park", company: "InnovateLabs", avatar: "LP", email: "lisa@innovate.com", score: "Hot", addedDate: "2025-01-13" },
    { id: "7", name: "David Chen", company: "TechSolutions", avatar: "DC", email: "david@techsol.com", score: "Warm", addedDate: "2025-01-12" },
    { id: "8", name: "Maria Garcia", company: "FinanceHub", avatar: "MG", email: "maria@financehub.com", score: "Hot", addedDate: "2025-01-12" },
  ],
  "Meeting Booked": [
    { id: "9", name: "Robert Brown", company: "ScaleUp Inc", avatar: "RB", email: "robert@scaleup.com", score: "Hot", addedDate: "2025-01-11" },
    { id: "10", name: "Jennifer Lee", company: "GrowthCo", avatar: "JL", email: "jen@growthco.com", score: "Warm", addedDate: "2025-01-11" },
  ],
  "In Nurture Campaign": [
    { id: "11", name: "Steven Davis", company: "Enterprise Ltd", avatar: "SD", email: "steven@enterprise.com", score: "Warm", addedDate: "2025-01-10" },
    { id: "12", name: "Rachel Kim", company: "SaaS Solutions", avatar: "RK", email: "rachel@saas.com", score: "Cold", addedDate: "2025-01-10" },
  ],
  "Meeting No Show-up": [
    { id: "13", name: "Tom Anderson", company: "MissedCorp", avatar: "TA", email: "tom@missed.com", score: "Cold", addedDate: "2025-01-09" },
  ],
  "Meeting Finished": [
    { id: "14", name: "Amy Johnson", company: "CompleteCorp", avatar: "AJ", email: "amy@complete.com", score: "Hot", addedDate: "2025-01-08" },
    { id: "15", name: "Chris Wilson", company: "DoneCorp", avatar: "CW", email: "chris@done.com", score: "Warm", addedDate: "2025-01-07" },
  ],
  "No More Interested": [
    { id: "16", name: "Sam Taylor", company: "NotInterestedInc", avatar: "ST", email: "sam@notint.com", score: "Cold", addedDate: "2025-01-06" },
  ],
  "Deal Won": [
    { id: "17", name: "Emily Rodriguez", company: "CloudSync", avatar: "ER", email: "emily@cloudsync.com", score: "Hot", addedDate: "2025-01-05" },
    { id: "18", name: "James Wilson", company: "StartupX", avatar: "JW", email: "james@startupx.com", score: "Hot", addedDate: "2025-01-04" },
  ]
};

// Mock lead data for animation
const mockLeads = [
  { id: "1", name: "Sarah Chen", company: "TechCorp", stage: "Lead Enriched", avatar: "SC", progress: 12.5 },
  { id: "2", name: "Mike Johnson", company: "DataFlow", stage: "Initial AI Call Done", avatar: "MJ", progress: 25 },
  { id: "3", name: "Emily Rodriguez", company: "CloudSync", stage: "Meeting Booked", avatar: "ER", progress: 37.5 },
  { id: "4", name: "David Park", company: "AI Solutions", stage: "In Nurture Campaign", avatar: "DP", progress: 50 },
  { id: "5", name: "Lisa Wang", company: "FinTech Pro", stage: "Meeting Finished", avatar: "LW", progress: 75 },
  { id: "6", name: "James Wilson", company: "StartupX", stage: "Deal Won", avatar: "JW", progress: 100 },
];

// Funnel data for conversion visualization
const funnelData = [
  { stage: "Lead Enriched", count: 145, percentage: 100 },
  { stage: "Initial AI Call Done", count: 89, percentage: 61.4 },
  { stage: "Meeting Booked", count: 67, percentage: 46.2 },
  { stage: "In Nurture Campaign", count: 45, percentage: 31.0 },
  { stage: "Meeting Finished", count: 34, percentage: 23.4 },
  { stage: "Deal Won", count: 18, percentage: 12.4 }
];

export default function PipelineStages() {
  const { theme, toggleTheme } = useTheme();
  const [selectedStage, setSelectedStage] = useState<number | null>(null);
  const [selectedStageName, setSelectedStageName] = useState<string | null>(null);
  const [animatingLeads, setAnimatingLeads] = useState<string[]>([]);
  const [hoveredFunnelStage, setHoveredFunnelStage] = useState<string | null>(null);

  // Simulate lead movement animation
  useEffect(() => {
    const interval = setInterval(() => {
      const randomLead = mockLeads[Math.floor(Math.random() * mockLeads.length)];
      setAnimatingLeads(prev => [...prev, randomLead.id]);
      
      setTimeout(() => {
        setAnimatingLeads(prev => prev.filter(id => id !== randomLead.id));
      }, 2000);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStageIcon = (stage: typeof pipelineStages[0]) => {
    const Icon = stage.icon;
    return <Icon className="h-5 w-5" />;
  };

  const getScoreColor = (score: string) => {
    switch (score) {
      case "Hot": return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400";
      case "Warm": return "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400";
      case "Cold": return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400";
      default: return "bg-slate-100 text-slate-700 dark:bg-slate-900/20 dark:text-slate-400";
    }
  };

  const handleStageClick = (stageId: number, stageName: string) => {
    setSelectedStage(stageId);
    setSelectedStageName(stageName);
  };

  return (
    <div className="flex-1 overflow-y-auto" data-testid="pipeline-stages">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700" data-testid="header">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" className="lg:hidden p-2" data-testid="mobile-menu-button">
              <Menu className="h-5 w-5" />
            </Button>
            <div className="ml-4 lg:ml-0">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white" data-testid="page-title">
                Pipeline Stages
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400" data-testid="page-subtitle">
                Track leads through your automated sales journey
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

      <div className="p-6 space-y-8">
        {/* Progress Flow Timeline */}
        <Card className="bg-white dark:bg-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Sales Process Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-8 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-700 rounded-full" />
              <div className="absolute top-8 left-0 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full" style={{ width: '60%' }} />
              
              {/* Stage Nodes */}
              <div className="relative flex justify-between items-start">
                {pipelineStages.map((stage, index) => (
                  <div key={stage.id} className="flex flex-col items-center min-w-0 flex-1">
                    <div 
                      className={`w-16 h-16 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${
                        selectedStage === stage.id ? 'ring-4 ring-blue-200 dark:ring-blue-800' : ''
                      } ${stage.color} hover:scale-110`}
                      onClick={() => setSelectedStage(selectedStage === stage.id ? null : stage.id)}
                      data-testid={`stage-node-${stage.id}`}
                    >
                      {getStageIcon(stage)}
                    </div>
                    <div className="mt-3 text-center">
                      <p className="text-xs font-medium text-slate-900 dark:text-white leading-tight max-w-20">
                        {stage.name}
                      </p>
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {stage.count}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conversion Funnel Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Conversion Funnel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-2 py-4">
                {funnelData.map((item, index) => (
                  <div
                    key={index}
                    className="relative cursor-pointer group"
                    onMouseEnter={() => setHoveredFunnelStage(item.stage)}
                    onMouseLeave={() => setHoveredFunnelStage(null)}
                    onClick={() => handleStageClick(pipelineStages.find(s => s.name === item.stage)?.id || 1, item.stage)}
                  >
                    {/* Funnel Shape */}
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 group-hover:opacity-80 relative flex items-center justify-center text-white font-medium text-sm"
                      style={{
                        width: `${Math.max(item.percentage * 3, 120)}px`,
                        height: '60px',
                        clipPath: index === funnelData.length - 1 
                          ? 'polygon(10% 0%, 90% 0%, 90% 100%, 10% 100%)'  // Rectangle for last item
                          : 'polygon(15% 0%, 85% 0%, 90% 100%, 10% 100%)', // Trapezoid for others
                        backgroundColor: `hsl(${220 + index * 20}, 70%, ${60 - index * 5}%)`
                      }}
                    >
                      <div className="text-center px-2">
                        <div className="font-bold text-lg">{item.count}</div>
                        <div className="text-xs opacity-90 truncate">{item.stage}</div>
                      </div>
                    </div>
                    
                    {/* Hover Tooltip */}
                    {hoveredFunnelStage === item.stage && (
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-10">
                        <div className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-3 py-2 rounded-lg text-xs font-medium shadow-lg">
                          {item.count} leads ({item.percentage.toFixed(1)}%)
                          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-900 dark:bg-slate-100 rotate-45"></div>
                        </div>
                      </div>
                    )}
                    
                    {/* Connection Arrow */}
                    {index < funnelData.length - 1 && (
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-slate-300 dark:border-t-slate-600"></div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Stage Details */}
          <Card className="bg-white dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                {selectedStage ? 
                  pipelineStages.find(s => s.id === selectedStage)?.name || 'Stage Details' : 
                  'Stage Performance'
                }
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedStage && selectedStageName ? (
                <div className="space-y-4">
                  <div className="text-center p-4 border-b border-slate-200 dark:border-slate-700">
                    <div className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center ${
                      pipelineStages.find(s => s.id === selectedStage)?.color
                    }`}>
                      {getStageIcon(pipelineStages.find(s => s.id === selectedStage)!)}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      {selectedStageName}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {mockLeadsByStage[selectedStageName as keyof typeof mockLeadsByStage]?.length || 0} leads
                    </p>
                  </div>
                  
                  {/* Scrollable Lead List */}
                  <div className="h-64 overflow-y-auto space-y-2">
                    {mockLeadsByStage[selectedStageName as keyof typeof mockLeadsByStage]?.map((lead) => (
                      <div key={lead.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {lead.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white text-sm">
                              {lead.name}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {lead.company}
                            </p>
                            <p className="text-xs text-slate-400 dark:text-slate-500">
                              {lead.email}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getScoreColor(lead.score)} variant="secondary">
                            {lead.score}
                          </Badge>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {lead.addedDate}
                          </p>
                        </div>
                      </div>
                    )) || (
                      <div className="text-center py-8">
                        <p className="text-slate-500 dark:text-slate-400">No leads found in this stage</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 dark:text-slate-400">
                    Click on a stage in the funnel to view leads
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Lead Movement Tracking */}
        <Card className="bg-white dark:bg-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Live Lead Movement Tracker
            </CardTitle>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Real-time visualization of leads moving through your sales pipeline
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Movement Legend */}
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-slate-700 dark:text-slate-300">Currently Moving</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-slate-700 dark:text-slate-300">Completed Stage</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
                    <span className="text-sm text-slate-700 dark:text-slate-300">Waiting</span>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  Updates every 30 seconds
                </Badge>
              </div>

              {/* Pipeline Flow Visualization */}
              <div className="relative">
                {/* Progress Path */}
                <div className="flex items-center justify-between mb-8">
                  {pipelineStages.slice(0, 6).map((stage, index) => (
                    <div key={stage.id} className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                        index <= 3 ? 'bg-green-500' : index === 4 ? 'bg-blue-500 animate-pulse' : 'bg-slate-400'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="text-xs text-center mt-2 max-w-20 leading-tight">
                        <p className="font-medium text-slate-900 dark:text-white">{stage.name}</p>
                        <p className="text-slate-500 dark:text-slate-400">{stage.count} leads</p>
                      </div>
                      {index < 5 && (
                        <div className="absolute top-6 w-full h-0.5 bg-slate-200 dark:bg-slate-600" 
                             style={{ 
                               left: `${(100 / 5) * index + (100 / 5 / 2)}%`, 
                               width: `${100 / 5}%`,
                               backgroundColor: index < 3 ? '#22c55e' : '#e2e8f0'
                             }} />
                      )}
                    </div>
                  ))}
                </div>

                {/* Active Lead Movement Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {mockLeads.slice(0, 4).map((lead, index) => (
                    <div
                      key={lead.id}
                      className={`p-3 bg-white dark:bg-slate-700 rounded-lg border-2 transition-all duration-500 ${
                        animatingLeads.includes(lead.id) 
                          ? 'border-blue-500 shadow-lg scale-105' 
                          : 'border-slate-200 dark:border-slate-600'
                      }`}
                      data-testid={`movement-lead-${lead.id}`}
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/10 text-primary text-sm">
                            {lead.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white text-sm">
                            {lead.name}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {lead.company}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-600 dark:text-slate-400">Current Stage:</span>
                          <Badge variant="outline" className="text-xs">
                            {lead.stage}
                          </Badge>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-1000 ${
                              animatingLeads.includes(lead.id) 
                                ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                                : 'bg-gradient-to-r from-green-500 to-blue-500'
                            }`}
                            style={{ width: `${lead.progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-center text-slate-500 dark:text-slate-400">
                          {lead.progress}% Complete
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Movement Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">24</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Leads moved today</p>
                </div>
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">2.3</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Avg days per stage</p>
                </div>
                <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">85%</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Pipeline velocity</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}