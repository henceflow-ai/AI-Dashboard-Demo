import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Bot, 
  User, 
  Send, 
  Mic, 
  MicOff, 
  Volume2,
  VolumeX,
  Zap,
  Users,
  TrendingUp,
  FileText,
  Clock,
  Target,
  Mail,
  Phone,
  Calendar,
  Lightbulb,
  Sun,
  Moon,
  Menu,
  MessageSquare,
  Activity
} from "lucide-react";
import { useTheme } from "@/components/ui/theme-provider";
import { format } from "date-fns";

// Mock chat messages
const mockMessages = [
  {
    id: "1",
    type: "ai" as const,
    content: "Hello! I'm your AI sales assistant. I've been analyzing your pipeline and I have some insights to share. How can I help you today?",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    suggestions: ["Show pipeline insights", "Generate weekly report", "Review hot leads"]
  },
  {
    id: "2", 
    type: "user" as const,
    content: "What's the status of my hot leads?",
    timestamp: new Date(Date.now() - 1000 * 60 * 3),
  },
  {
    id: "3",
    type: "ai" as const,
    content: "I found 5 hot leads that need immediate attention:\n\n• Sarah Chen (TechCorp) - Meeting scheduled for tomorrow\n• Lisa Wang (FinTech Pro) - Waiting for technical deep dive\n• Emily Rodriguez (CloudSync) - Ready for closing call\n• Mike Thompson (DataFlow) - Follow-up needed after demo\n• James Wilson (StartupX) - Contract review in progress\n\nWould you like me to prioritize these or schedule follow-up actions?",
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
    suggestions: ["Schedule follow-ups", "Generate lead reports", "Book meetings"]
  }
];

// Mock context suggestions
const contextSuggestions = [
  {
    id: "1",
    icon: Clock,
    title: "Leads Need Follow-up",
    description: "12 leads haven't been contacted in 7+ days",
    color: "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400",
    action: "Show overdue leads"
  },
  {
    id: "2", 
    icon: Target,
    title: "Hot Leads Alert",
    description: "5 hot leads need immediate attention",
    color: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
    action: "Review hot leads"
  },
  {
    id: "3",
    icon: TrendingUp,
    title: "Campaign Performance",
    description: "Warm Lead Education campaign performing 23% above average",
    color: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400", 
    action: "View campaign insights"
  },
  {
    id: "4",
    icon: FileText,
    title: "Weekly Summary",
    description: "Generate this week's performance report",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
    action: "Generate weekly summary"
  },
  {
    id: "5",
    icon: Calendar,
    title: "Meeting Prep",
    description: "3 meetings tomorrow need preparation",
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
    action: "Prepare meetings"
  },
  {
    id: "6",
    icon: Mail,
    title: "Email Templates",
    description: "Generate personalized follow-up emails",
    color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400",
    action: "Create email templates"
  }
];

export default function AIAssistant() {
  const { theme, toggleTheme } = useTheme();
  const [messages, setMessages] = useState(mockMessages);
  const [inputMessage, setInputMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [waveform, setWaveform] = useState(Array(20).fill(0));
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Simulate waveform animation when listening
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isListening) {
      interval = setInterval(() => {
        setWaveform(prev => prev.map(() => Math.random() * 100));
      }, 150);
    } else {
      setWaveform(Array(20).fill(0));
    }
    return () => clearInterval(interval);
  }, [isListening]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newUserMessage = {
      id: Date.now().toString(),
      type: "user" as const,
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        type: "ai" as const,
        content: generateAIResponse(inputMessage),
        timestamp: new Date(),
        suggestions: ["Follow up", "Schedule meeting", "Generate report"]
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
    inputRef.current?.focus();
  };

  const handleContextClick = (action: string) => {
    setInputMessage(action);
    inputRef.current?.focus();
  };

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  const toggleSpeaking = () => {
    setIsSpeaking(!isSpeaking);
  };

  const generateAIResponse = (input: string) => {
    const responses = [
      `I've analyzed your request: "${input}". Let me provide some insights based on your current pipeline data...`,
      `Based on your sales data, here's what I found regarding "${input}". Would you like me to take any specific actions?`,
      `Great question! I've processed "${input}" and here are my recommendations based on your current lead status and campaign performance.`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
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
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                AI Expert Assistant
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Your intelligent sales automation partner
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 dark:bg-green-900/20">
              <Activity className="h-3 w-3 mr-1" />
              Active
            </Badge>
            <Button variant="ghost" size="sm" onClick={toggleTheme} className="p-2">
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Main Chat Panel (70%) */}
        <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-900">
          {/* Chat Messages */}
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6 max-w-4xl mx-auto">
              {messages.map((message) => (
                <div key={message.id} className={`flex items-start space-x-4 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarFallback className={message.type === 'ai' ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : 'bg-slate-100 dark:bg-slate-700'}>
                      {message.type === 'ai' ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className={`flex-1 max-w-[80%] ${message.type === 'user' ? 'text-right' : ''}`}>
                    <div className={`rounded-lg p-4 ${
                      message.type === 'ai' 
                        ? 'bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700' 
                        : 'bg-blue-600 text-white ml-auto inline-block'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-line">
                        {message.content}
                      </p>
                      
                      {/* AI Message Suggestions */}
                      {message.type === 'ai' && message.suggestions && (
                        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-200 dark:border-slate-600">
                          {message.suggestions.map((suggestion, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="text-xs"
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <p className="text-xs text-slate-500 mt-2">
                      {format(message.timestamp, "h:mm a")}
                    </p>
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex items-start space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                      <Bot className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Chat Input */}
          <div className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center space-x-3">
                <div className="flex-1 relative">
                  <Input
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask me anything about your sales pipeline..."
                    className="pr-12 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                    data-testid="chat-input"
                  />
                  <Button
                    size="sm"
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim()}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                    data-testid="send-message"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Voice Interaction Panel */}
          <div className="border-t border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Mic className="h-5 w-5" />
                  Voice Assistant
                </h3>
                <div className="flex items-center space-x-2">
                  <Badge variant={isSpeaking ? "default" : "secondary"} className="text-xs">
                    {isSpeaking ? "Speaking" : "Ready"}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-6">
                {/* Waveform Visualization */}
                <div className="flex-1 max-w-md">
                  <div className="flex items-end justify-center space-x-1 h-16 bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                    {waveform.map((height, index) => (
                      <div
                        key={index}
                        className={`w-2 rounded-full transition-all duration-150 ${
                          isListening ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'
                        }`}
                        style={{ 
                          height: isListening ? `${Math.max(height, 10)}%` : '10%',
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Voice Controls */}
                <div className="flex space-x-3">
                  <Button
                    size="lg"
                    variant={isListening ? "default" : "outline"}
                    onClick={toggleListening}
                    className={`h-16 w-16 rounded-full ${
                      isListening 
                        ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                        : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600'
                    }`}
                    data-testid="voice-input-toggle"
                  >
                    {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                  </Button>

                  <Button
                    size="lg"
                    variant={isSpeaking ? "default" : "outline"}
                    onClick={toggleSpeaking}
                    className="h-16 w-16 rounded-full"
                    data-testid="voice-output-toggle"
                  >
                    {isSpeaking ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
                  </Button>
                </div>
              </div>

              {/* Voice Status */}
              <div className="text-center mt-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {isListening 
                    ? "🎤 Listening... Speak now" 
                    : isSpeaking 
                    ? "🔊 AI is speaking..." 
                    : "Click the microphone to start voice interaction"
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Context Suggestions Sidebar (30%) */}
        <div className="w-96 bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 flex flex-col">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Quick Actions
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Context-aware suggestions based on your data
            </p>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-3">
              {contextSuggestions.map((suggestion) => (
                <Card 
                  key={suggestion.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow group"
                  onClick={() => handleContextClick(suggestion.action)}
                  data-testid={`context-suggestion-${suggestion.id}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${suggestion.color} group-hover:scale-110 transition-transform`}>
                        <suggestion.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-slate-900 dark:text-white text-sm leading-tight">
                          {suggestion.title}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                          {suggestion.description}
                        </p>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="mt-2 h-6 px-2 text-xs group-hover:bg-slate-100 dark:group-hover:bg-slate-700"
                        >
                          <Zap className="h-3 w-3 mr-1" />
                          Quick Ask
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}