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

// Mock lead data
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
  const [animatingLeads, setAnimatingLeads] = useState<string[]>([]);

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
              {/* Progress Line - Professional Style */}
              <div className="absolute top-8 left-0 right-0 h-2 bg-slate-200 dark:bg-slate-700 rounded-full shadow-inner" />
              <div className="absolute top-8 left-0 h-2 bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 rounded-full shadow-md" style={{ width: '60%' }} />
              
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
              <div className="space-y-4">
                {funnelData.map((item, index) => (
                  <div 
                    key={item.stage}
                    className="relative cursor-pointer group"
                    onClick={() => setSelectedStage(pipelineStages.find(s => s.name === item.stage)?.id || null)}
                    data-testid={`funnel-stage-${index}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {item.stage}
                      </span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {item.count} leads ({item.percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="h-8 bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 group-hover:opacity-80"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
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
              {selectedStage ? (
                <div className="space-y-4">
                  <div className="text-center p-6">
                    <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
                      pipelineStages.find(s => s.id === selectedStage)?.color
                    }`}>
                      {getStageIcon(pipelineStages.find(s => s.id === selectedStage)!)}
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {pipelineStages.find(s => s.id === selectedStage)?.count}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">leads in this stage</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                      <p className="text-sm text-slate-500 dark:text-slate-400">Avg. Time</p>
                      <p className="font-semibold text-slate-900 dark:text-white">2.3 days</p>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                      <p className="text-sm text-slate-500 dark:text-slate-400">Success Rate</p>
                      <p className="font-semibold text-slate-900 dark:text-white">67%</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 dark:text-slate-400">
                    Click on a stage to view detailed metrics
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Animated Lead Journey */}
        <Card className="bg-white dark:bg-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Live Lead Movement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative overflow-hidden">
              {/* Journey Path */}
              <div className="relative h-32 mb-6">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 120">
                  <path
                    d="M 50 60 Q 200 20 350 60 T 650 60 T 750 60"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    className="text-slate-300 dark:text-slate-600"
                  />
                </svg>
                
                {/* Animated Lead Cards */}
                {mockLeads.slice(0, 4).map((lead, index) => (
                  <div
                    key={lead.id}
                    className={`absolute transition-all duration-2000 ease-in-out ${
                      animatingLeads.includes(lead.id) ? 'animate-pulse' : ''
                    }`}
                    style={{
                      left: `${(lead.progress / 100) * 85 + 5}%`,
                      top: `${40 + Math.sin(index) * 10}px`,
                      transform: animatingLeads.includes(lead.id) ? 'translateX(50px)' : 'translateX(0)'
                    }}
                    data-testid={`journey-lead-${lead.id}`}
                  >
                    <div className="bg-white dark:bg-slate-700 rounded-lg shadow-lg p-3 border border-slate-200 dark:border-slate-600 min-w-32">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs bg-primary/10 text-primary">
                            {lead.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-slate-900 dark:text-white truncate">
                            {lead.name}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {lead.company}
                          </p>
                        </div>
                      </div>
                      <Progress value={lead.progress} className="mt-2 h-1" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                Watch your leads progress through the automation pipeline
              </p>
              <Badge variant="outline" className="text-xs">
                Real-time updates every 30 seconds
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}