import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Bot,
  User,
  Mic,
  MicOff,
  Send,
  Phone,
  Calendar,
  TrendingUp,
  Users,
  MessageSquare,
  Target,
  Clock,
  Lightbulb,
  Zap,
  Sun,
  Moon,
  Menu,
  ExternalLink,
  Play,
  AlertCircle,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import { useTheme } from "@/components/ui/theme-provider";

// Mock chat messages
const mockMessages = [
  {
    id: "1",
    type: "ai" as const,
    content: "Good morning! I've analyzed your pipeline and found 3 hot leads that need immediate attention. Would you like me to show you their details?",
    timestamp: new Date(Date.now() - 5 * 60000),
    cards: [
      {
        type: "lead",
        data: { name: "Sarah Chen", company: "TechCorp", score: "Hot", lastContact: "2 days ago" }
      }
    ]
  },
  {
    id: "2",
    type: "user" as const,
    content: "Show me all hot leads from last week",
    timestamp: new Date(Date.now() - 4 * 60000)
  },
  {
    id: "3",
    type: "ai" as const,
    content: "I found 12 hot leads from last week. Here are the top 3 that converted to meetings:",
    timestamp: new Date(Date.now() - 3 * 60000),
    cards: [
      {
        type: "stats",
        data: { title: "Hot Leads Performance", value: "12 leads", conversion: "25% meeting rate" }
      }
    ],
    actions: [
      { label: "View Full Pipeline", action: "pipeline" },
      { label: "Start Outreach", action: "outreach" }
    ]
  },
  {
    id: "4",
    type: "user" as const,
    content: "Book a meeting with Sarah Chen for Thursday at 2 PM",
    timestamp: new Date(Date.now() - 2 * 60000)
  },
  {
    id: "5",
    type: "ai" as const,
    content: "I've scheduled a meeting with Sarah Chen for Thursday at 2:00 PM. Meeting invite sent and calendar updated. I've also prepared talking points based on her recent interactions.",
    timestamp: new Date(Date.now() - 1 * 60000),
    cards: [
      {
        type: "meeting",
        data: { 
          title: "Demo Call - Sarah Chen", 
          date: "Thursday 2:00 PM", 
          duration: "45 mins",
          company: "TechCorp"
        }
      }
    ],
    actions: [
      { label: "View Meeting Details", action: "meeting" },
      { label: "Prepare Agenda", action: "agenda" }
    ]
  }
];

// Mock AI recommendations
const mockRecommendations = [
  {
    id: "1",
    type: "urgent" as const,
    title: "3 Hot leads are uncontacted",
    description: "Sarah Chen, Mike Johnson, and Lisa Wang haven't been contacted in 3+ days",
    action: "Call them now",
    priority: "high" as const
  },
  {
    id: "2", 
    type: "insight" as const,
    title: "Optimal calling time discovered",
    description: "Your conversion rate is 14% higher when calling between 3-5 PM",
    action: "Schedule calls",
    priority: "medium" as const
  },
  {
    id: "3",
    type: "performance" as const,
    title: "Campaign optimization needed",
    description: "Cold Lead Re-engagement campaign is underperforming — try changing subject line",
    action: "Optimize campaign",
    priority: "low" as const
  }
];

// Mock context suggestions
const mockContextSuggestions = [
  { type: "lead", title: "Emily Rodriguez", subtitle: "No contact in 7 days", action: "Call now" },
  { type: "meeting", title: "David Park follow-up", subtitle: "Meeting completed yesterday", action: "Send proposal" },
  { type: "campaign", title: "Warm Lead Education", subtitle: "67% open rate", action: "View performance" },
  { type: "lead", title: "James Wilson", subtitle: "Hot lead, budget approved", action: "Schedule demo" },
];

// Mock shortcuts
const mockShortcuts = [
  { label: "Start Lead Qualification", icon: Target, action: "qualify" },
  { label: "Generate Weekly Summary", icon: TrendingUp, action: "summary" },
  { label: "Run New Campaign", icon: Zap, action: "campaign" },
  { label: "Schedule Follow-ups", icon: Calendar, action: "followup" }
];

export default function AIAssistant() {
  const { theme, toggleTheme } = useTheme();
  const [messages, setMessages] = useState(mockMessages);
  const [inputValue, setInputValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      type: "user" as const,
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        type: "ai" as const,
        content: "I understand you want to " + inputValue.toLowerCase() + ". Let me help you with that. Here's what I found:",
        timestamp: new Date(),
        cards: [
          {
            type: "stats",
            data: { title: "Quick Result", value: "Processing...", conversion: "Analysis complete" }
          }
        ],
        actions: [
          { label: "View Details", action: "details" },
          { label: "Take Action", action: "action" }
        ]
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    // In a real implementation, this would start/stop speech recognition
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400";
      case "medium": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "low": return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400";
      default: return "bg-slate-100 text-slate-700 dark:bg-slate-900/20 dark:text-slate-400";
    }
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case "urgent": return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "insight": return <Lightbulb className="h-5 w-5 text-yellow-500" />;
      case "performance": return <TrendingUp className="h-5 w-5 text-blue-500" />;
      default: return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
  };

  return (
    <div className="flex-1 overflow-hidden" data-testid="ai-assistant">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" className="lg:hidden p-2">
              <Menu className="h-5 w-5" />
            </Button>
            <div className="ml-4 lg:ml-0">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                <Bot className="h-8 w-8 text-primary" />
                AI Assistant
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Your intelligent sales automation companion
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={toggleTheme} className="p-2">
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      <div className="flex h-[calc(100vh-120px)]">
        {/* Main Chat Panel */}
        <div className="flex-1 flex flex-col">
          {/* Chat Messages */}
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-4 max-w-4xl mx-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.type === "ai" && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className={`max-w-[70%] ${message.type === "user" ? "order-first" : ""}`}>
                    <div
                      className={`p-4 rounded-lg ${
                        message.type === "user"
                          ? "bg-primary text-primary-foreground ml-auto"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                      }`}
                    >
                      <p>{message.content}</p>
                    </div>
                    
                    {/* Cards */}
                    {message.cards && (
                      <div className="mt-3 space-y-2">
                        {message.cards.map((card, index) => (
                          <Card key={index} className="bg-white dark:bg-slate-700">
                            <CardContent className="p-3">
                              {card.type === "lead" && (
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium">{card.data.name}</p>
                                    <p className="text-sm text-slate-500">{card.data.company}</p>
                                  </div>
                                  <div className="text-right">
                                    <Badge variant="destructive">{card.data.score}</Badge>
                                    <p className="text-xs text-slate-500 mt-1">{card.data.lastContact}</p>
                                  </div>
                                </div>
                              )}
                              
                              {card.type === "stats" && (
                                <div className="text-center">
                                  <h4 className="font-medium">{card.data.title}</h4>
                                  <p className="text-2xl font-bold text-primary mt-1">{card.data.value}</p>
                                  <p className="text-sm text-slate-500">{card.data.conversion}</p>
                                </div>
                              )}
                              
                              {card.type === "meeting" && (
                                <div className="flex items-center gap-3">
                                  <Calendar className="h-8 w-8 text-primary" />
                                  <div>
                                    <p className="font-medium">{card.data.title}</p>
                                    <p className="text-sm text-slate-500">
                                      {card.data.date} • {card.data.duration}
                                    </p>
                                    <p className="text-sm text-slate-500">{card.data.company}</p>
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    {message.actions && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {message.actions.map((action, index) => (
                          <Button key={index} variant="outline" size="sm" className="text-xs">
                            {action.label}
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </Button>
                        ))}
                      </div>
                    )}
                    
                    <p className="text-xs text-slate-400 mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  
                  {message.type === "user" && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-4">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Chat Input */}
          <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <div className="max-w-4xl mx-auto flex gap-4">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about your sales pipeline..."
                  className="pr-12"
                />
                <Button
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Voice Input Button */}
              <Button
                variant={isListening ? "destructive" : "outline"}
                size="icon"
                onClick={toggleVoiceInput}
                className="relative"
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                {isListening && (
                  <div className="absolute inset-0 rounded-lg border-2 border-red-400 animate-pulse" />
                )}
              </Button>
            </div>
            
            {isListening && (
              <div className="max-w-4xl mx-auto mt-4 p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                <div className="flex items-center justify-center space-x-2">
                  <Mic className="h-5 w-5 text-red-600" />
                  <span className="text-red-700 dark:text-red-400">Listening... Speak now</span>
                  <div className="flex space-x-1">
                    <div className="w-1 h-4 bg-red-500 rounded-full animate-pulse" />
                    <div className="w-1 h-6 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: "0.1s" }} />
                    <div className="w-1 h-5 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
                    <div className="w-1 h-7 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: "0.3s" }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - AI Context Panel */}
        <div className="w-80 border-l border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
          <div className="p-6 space-y-6">
            {/* Context Suggestions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Smart Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockContextSuggestions.map((suggestion, index) => (
                    <div key={index} className="p-3 bg-white dark:bg-slate-800 rounded-lg border">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white text-sm">
                            {suggestion.title}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {suggestion.subtitle}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm" className="text-xs p-1">
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Shortcuts */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {mockShortcuts.map((shortcut, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="h-auto p-3 flex flex-col items-center text-center"
                    >
                      <shortcut.icon className="h-5 w-5 mb-2" />
                      <span className="text-xs leading-tight">{shortcut.label}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-slate-600 dark:text-slate-400">Meeting booked with Sarah Chen</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="text-slate-600 dark:text-slate-400">Campaign analysis completed</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full" />
                    <span className="text-slate-600 dark:text-slate-400">3 new hot leads identified</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* AI Recommendations Bottom Panel */}
      <div className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            Daily AI Recommendations
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {mockRecommendations.map((rec) => (
              <Card key={rec.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {getRecommendationIcon(rec.type)}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-slate-900 dark:text-white text-sm">
                          {rec.title}
                        </h4>
                        <Badge className={getPriorityColor(rec.priority)} variant="secondary">
                          {rec.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {rec.description}
                      </p>
                      <Button variant="outline" size="sm" className="mt-3">
                        {rec.action}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}