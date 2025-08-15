import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Play, 
  Pause, 
  Settings, 
  Zap, 
  ArrowRight, 
  Clock, 
  Filter,
  Plus,
  Activity,
  Bot,
  Phone,
  Mail,
  Calendar,
  Target,
  Users,
  TrendingUp,
  Database,
  Workflow,
  Timer,
  RotateCcw,
  Eye,
  Edit,
  Sun,
  Moon,
  RefreshCw
} from "lucide-react";
import { useTheme } from "@/components/ui/theme-provider";
import { format } from "date-fns";

// Mock automation data
const mockAutomations = [
  {
    id: "auto-001",
    name: "Lead Enrichment → AI Call → Meeting Booking",
    purpose: "Qualify new leads and book meetings automatically",
    status: "active" as const,
    lastExecuted: new Date(Date.now() - 1000 * 60 * 15),
    nextRun: new Date(Date.now() + 1000 * 60 * 30),
    runsToday: 24,
    successRate: 85,
    totalProcessed: 342,
    category: "Lead Processing",
    triggers: ["New lead added", "Lead status changed to 'Warm'"],
    steps: ["Lead Enrichment", "AI Phone Call", "Meeting Booking", "CRM Update"],
    icon: Target,
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
  },
  {
    id: "auto-002", 
    name: "Cold Lead Re-engagement Campaign",
    purpose: "Re-activate cold leads through personalized nurture sequences",
    status: "active" as const,
    lastExecuted: new Date(Date.now() - 1000 * 60 * 5),
    nextRun: new Date(Date.now() + 1000 * 60 * 60 * 2),
    runsToday: 12,
    successRate: 67,
    totalProcessed: 128,
    category: "Nurturing",
    triggers: ["Lead inactive for 30 days", "Scheduled interval"],
    steps: ["Lead Segmentation", "Content Generation", "Email Campaign", "Follow-up Tracking"],
    icon: Mail,
    color: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
  },
  {
    id: "auto-003",
    name: "Meeting Follow-up & Proposal Generation", 
    purpose: "Generate personalized proposals after completed meetings",
    status: "paused" as const,
    lastExecuted: new Date(Date.now() - 1000 * 60 * 60 * 3),
    nextRun: null,
    runsToday: 8,
    successRate: 92,
    totalProcessed: 67,
    category: "Post-Meeting",
    triggers: ["Meeting marked as 'Completed'", "Manual trigger"],
    steps: ["Meeting Summary", "Proposal Generation", "Document Creation", "Email Delivery"],
    icon: Calendar,
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400"
  },
  {
    id: "auto-004",
    name: "Hot Lead Priority Notification",
    purpose: "Immediately notify sales team when leads become hot",
    status: "active" as const,
    lastExecuted: new Date(Date.now() - 1000 * 60 * 2),
    nextRun: new Date(Date.now() + 1000 * 60 * 5),
    runsToday: 18,
    successRate: 100,
    totalProcessed: 45,
    category: "Notifications",
    triggers: ["Lead score > 80", "High engagement detected"],
    steps: ["Score Analysis", "Team Notification", "Calendar Booking", "Priority Tagging"],
    icon: Zap,
    color: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
  },
  {
    id: "auto-005",
    name: "Weekly Performance Report Generator",
    purpose: "Generate comprehensive sales performance analytics",
    status: "active" as const,
    lastExecuted: new Date(Date.now() - 1000 * 60 * 60 * 24),
    nextRun: new Date(Date.now() + 1000 * 60 * 60 * 24 * 6),
    runsToday: 1,
    successRate: 100,
    totalProcessed: 8,
    category: "Reporting",
    triggers: ["Weekly schedule", "Month-end trigger"],
    steps: ["Data Collection", "Analysis Processing", "Report Generation", "Distribution"],
    icon: TrendingUp,
    color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400"
  },
  {
    id: "auto-006",
    name: "Data Sync & Lead Scoring Update",
    purpose: "Keep all systems synchronized with latest lead data",
    status: "active" as const,
    lastExecuted: new Date(Date.now() - 1000 * 60 * 10),
    nextRun: new Date(Date.now() + 1000 * 60 * 20),
    runsToday: 48,
    successRate: 98,
    totalProcessed: 1247,
    category: "Data Management",
    triggers: ["Every 30 minutes", "Data change detected"],
    steps: ["Data Extraction", "Lead Scoring", "CRM Update", "Validation Check"],
    icon: Database,
    color: "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400"
  }
];

const flowConnections = [
  { from: "Lead Database", to: "Lead Enrichment", active: true },
  { from: "Lead Enrichment", to: "AI Voice Call", active: true },
  { from: "AI Voice Call", to: "Meeting Booking", active: true },
  { from: "Meeting Booking", to: "CRM Update", active: false },
  { from: "Lead Database", to: "Lead Scoring", active: true },
  { from: "Lead Scoring", to: "Nurture Campaign", active: true },
  { from: "Nurture Campaign", to: "Follow-up Tracking", active: true },
  { from: "Meeting Booking", to: "Proposal Generation", active: false },
  { from: "Proposal Generation", to: "Email Delivery", active: false }
];

const mockTriggerConditions = [
  { field: "Lead Status", operator: "equals", value: "Warm" },
  { field: "Last Contact", operator: "older_than", value: "7 days" },
  { field: "Lead Score", operator: "greater_than", value: "80" }
];

export default function AutomationControl() {
  const { theme, toggleTheme } = useTheme();
  const [automations, setAutomations] = useState(mockAutomations);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedAutomation, setSelectedAutomation] = useState<string | null>(null);
  const [isFlowView, setIsFlowView] = useState(false);

  const toggleAutomation = (id: string) => {
    setAutomations(prev => prev.map(automation => 
      automation.id === id 
        ? { ...automation, status: automation.status === 'active' ? 'paused' as const : 'active' as const }
        : automation
    ));
  };

  const runAutomation = (id: string) => {
    setAutomations(prev => prev.map(automation => 
      automation.id === id 
        ? { 
            ...automation, 
            lastExecuted: new Date(),
            runsToday: automation.runsToday + 1,
            totalProcessed: automation.totalProcessed + 1
          }
        : automation
    ));
  };

  const filteredAutomations = selectedCategory === "all" 
    ? automations 
    : automations.filter(auto => auto.category.toLowerCase() === selectedCategory.toLowerCase());

  const categories = ["all", ...Array.from(new Set(automations.map(a => a.category)))];
  const activeCount = automations.filter(a => a.status === 'active').length;
  const totalRuns = automations.reduce((sum, a) => sum + a.runsToday, 0);
  const avgSuccessRate = Math.round(automations.reduce((sum, a) => sum + a.successRate, 0) / automations.length);

  return (
    <div className="flex-1 overflow-hidden" data-testid="automation-control">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Automation Control Center
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Mission control for your AI automation workflows
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{activeCount}</p>
                <p className="text-xs text-slate-500">Active</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalRuns}</p>
                <p className="text-xs text-slate-500">Runs Today</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{avgSuccessRate}%</p>
                <p className="text-xs text-slate-500">Success Rate</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={toggleTheme}>
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      <div className="h-[calc(100vh-80px)] bg-slate-50 dark:bg-slate-900">
        <Tabs defaultValue="dashboard" className="h-full flex flex-col">
          <div className="px-6 py-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="dashboard">Status Board</TabsTrigger>
              <TabsTrigger value="flows">Flow Visualizer</TabsTrigger>
              <TabsTrigger value="triggers">Triggers & Rules</TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-hidden">
            {/* Status Board */}
            <TabsContent value="dashboard" className="h-full overflow-auto p-6">
              {/* Filters */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category === "all" ? "All Categories" : category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Advanced Filters
                  </Button>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Automation
                </Button>
              </div>

              {/* Automation Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAutomations.map((automation) => (
                  <Card key={automation.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${automation.color}`}>
                            <automation.icon className="h-5 w-5" />
                          </div>
                          <div>
                            <Badge variant="outline" className="text-xs mb-2">
                              {automation.category}
                            </Badge>
                            <CardTitle className="text-lg font-semibold leading-tight">
                              {automation.name}
                            </CardTitle>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={automation.status === 'active' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {automation.status === 'active' ? '✅ Active' : '⏸ Paused'}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                        {automation.purpose}
                      </p>
                    </CardHeader>
                    
                    <CardContent>
                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <p className="text-lg font-bold text-slate-900 dark:text-white">
                            {automation.runsToday}
                          </p>
                          <p className="text-xs text-slate-500">Runs Today</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-green-600">
                            {automation.successRate}%
                          </p>
                          <p className="text-xs text-slate-500">Success Rate</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-slate-900 dark:text-white">
                            {automation.totalProcessed}
                          </p>
                          <p className="text-xs text-slate-500">Total Processed</p>
                        </div>
                      </div>

                      {/* Timing Info */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500">Last executed:</span>
                          <span className="font-medium">
                            {format(automation.lastExecuted, "MMM d, h:mm a")}
                          </span>
                        </div>
                        {automation.nextRun && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500">Next run:</span>
                            <span className="font-medium text-blue-600">
                              {format(automation.nextRun, "MMM d, h:mm a")}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Controls */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={automation.status === 'active'}
                            onCheckedChange={() => toggleAutomation(automation.id)}
                          />
                          <Label className="text-sm">
                            {automation.status === 'active' ? 'Active' : 'Paused'}
                          </Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => runAutomation(automation.id)}
                            disabled={automation.status === 'paused'}
                          >
                            <Play className="h-3 w-3 mr-1" />
                            Run Now
                          </Button>
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="ghost">
                                <Settings className="h-3 w-3" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Automation Settings</DialogTitle>
                              </DialogHeader>
                              <AutomationSettings automation={automation} />
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Flow Visualizer */}
            <TabsContent value="flows" className="h-full overflow-auto p-6">
              <div className="max-w-6xl mx-auto">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                    Automation Flow Map
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Visual representation of how your automations connect and flow data
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8">
                  <FlowVisualizer connections={flowConnections} />
                </div>
              </div>
            </TabsContent>

            {/* Triggers & Rules */}
            <TabsContent value="triggers" className="h-full overflow-auto p-6">
              <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                    Trigger & Rule Management
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Configure when and how your automations should execute
                  </p>
                </div>

                <TriggerRuleEditor automations={automations} />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

// Automation Settings Component
function AutomationSettings({ automation }: { automation: typeof mockAutomations[0] }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Automation Steps</h3>
        <div className="space-y-3">
          {automation.steps.map((step, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-medium">
                {index + 1}
              </div>
              <span className="font-medium">{step}</span>
              {index < automation.steps.length - 1 && (
                <ArrowRight className="h-4 w-4 text-slate-400 ml-auto" />
              )}
            </div>
          ))}
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-lg font-medium mb-4">Trigger Conditions</h3>
        <div className="space-y-2">
          {automation.triggers.map((trigger, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <Zap className="h-4 w-4 text-amber-500" />
              <span>{trigger}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Flow Visualizer Component
function FlowVisualizer({ connections }: { connections: typeof flowConnections }) {
  const nodes = Array.from(new Set([...connections.map(c => c.from), ...connections.map(c => c.to)]));
  
  return (
    <div className="relative">
      <div className="grid grid-cols-4 gap-8 items-center">
        {/* Input Layer */}
        <div className="space-y-4">
          <h4 className="font-medium text-center text-slate-700 dark:text-slate-300">Input Sources</h4>
          <div className="space-y-3">
            <FlowNode name="Lead Database" type="source" active={true} />
            <FlowNode name="CRM System" type="source" active={true} />
          </div>
        </div>

        {/* Processing Layer */}
        <div className="space-y-4">
          <h4 className="font-medium text-center text-slate-700 dark:text-slate-300">Processing</h4>
          <div className="space-y-3">
            <FlowNode name="Lead Enrichment" type="process" active={true} />
            <FlowNode name="Lead Scoring" type="process" active={true} />
            <FlowNode name="AI Voice Call" type="process" active={true} />
          </div>
        </div>

        {/* Action Layer */}
        <div className="space-y-4">
          <h4 className="font-medium text-center text-slate-700 dark:text-slate-300">Actions</h4>
          <div className="space-y-3">
            <FlowNode name="Meeting Booking" type="action" active={true} />
            <FlowNode name="Nurture Campaign" type="action" active={true} />
            <FlowNode name="Follow-up Tracking" type="action" active={true} />
          </div>
        </div>

        {/* Output Layer */}
        <div className="space-y-4">
          <h4 className="font-medium text-center text-slate-700 dark:text-slate-300">Outputs</h4>
          <div className="space-y-3">
            <FlowNode name="CRM Update" type="output" active={false} />
            <FlowNode name="Email Delivery" type="output" active={false} />
            <FlowNode name="Proposal Generation" type="output" active={false} />
          </div>
        </div>
      </div>

      {/* Connection Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {connections.map((connection, index) => (
          <line
            key={index}
            x1="25%" y1="50%" x2="75%" y2="50%"
            stroke={connection.active ? "#3b82f6" : "#cbd5e1"}
            strokeWidth="2"
            strokeDasharray={connection.active ? "none" : "5,5"}
            className={connection.active ? "animate-pulse" : ""}
          />
        ))}
      </svg>
    </div>
  );
}

function FlowNode({ name, type, active }: { name: string; type: string; active: boolean }) {
  const getIcon = () => {
    switch (type) {
      case 'source': return <Database className="h-4 w-4" />;
      case 'process': return <Bot className="h-4 w-4" />;
      case 'action': return <Zap className="h-4 w-4" />;
      case 'output': return <Target className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className={`
      p-3 rounded-lg border text-center cursor-pointer transition-all hover:scale-105
      ${active 
        ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800' 
        : 'bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700'
      }
    `}>
      <div className={`
        mx-auto mb-2 p-2 rounded-full w-fit
        ${active 
          ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' 
          : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
        }
      `}>
        {getIcon()}
      </div>
      <p className="text-xs font-medium text-slate-700 dark:text-slate-300">{name}</p>
      {active && (
        <div className="mt-2 w-2 h-2 bg-green-400 rounded-full mx-auto animate-pulse" />
      )}
    </div>
  );
}

// Trigger Rule Editor Component
function TriggerRuleEditor({ automations }: { automations: typeof mockAutomations }) {
  const [selectedAutomation, setSelectedAutomation] = useState(automations[0].id);
  const selectedAuto = automations.find(a => a.id === selectedAutomation);

  return (
    <div className="space-y-6">
      {/* Automation Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Select Automation to Configure</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedAutomation} onValueChange={setSelectedAutomation}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {automations.map(automation => (
                <SelectItem key={automation.id} value={automation.id}>
                  {automation.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Trigger Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Trigger Settings</CardTitle>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Configure when this automation should execute
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label>Trigger Type</Label>
              <Select defaultValue="event">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="event">Event-based</SelectItem>
                  <SelectItem value="schedule">Scheduled</SelectItem>
                  <SelectItem value="manual">Manual only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Execution Schedule</Label>
              <Select defaultValue="realtime">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realtime">Real-time</SelectItem>
                  <SelectItem value="hourly">Every hour</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rule Conditions */}
      <Card>
        <CardHeader>
          <CardTitle>Rule Conditions</CardTitle>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Define the conditions that must be met for this automation to run
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockTriggerConditions.map((condition, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                <Select defaultValue={condition.field}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lead Status">Lead Status</SelectItem>
                    <SelectItem value="Lead Score">Lead Score</SelectItem>
                    <SelectItem value="Last Contact">Last Contact</SelectItem>
                    <SelectItem value="Email Engagement">Email Engagement</SelectItem>
                  </SelectContent>
                </Select>

                <Select defaultValue={condition.operator}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equals">equals</SelectItem>
                    <SelectItem value="greater_than">greater than</SelectItem>
                    <SelectItem value="less_than">less than</SelectItem>
                    <SelectItem value="older_than">older than</SelectItem>
                  </SelectContent>
                </Select>

                <Input 
                  defaultValue={condition.value}
                  className="flex-1"
                  placeholder="Value"
                />

                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <Button variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Condition
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}