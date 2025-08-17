import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Bot, 
  User, 
  Send, 
  Mic, 
  MicOff, 
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Menu,
  MessageSquare,
  Trash2,
  Settings
} from "lucide-react";
import { useTheme } from "@/components/ui/theme-provider";
import { format } from "date-fns";

// Mock chat messages
const initialMessages = [
  {
    id: "1",
    type: "ai" as const,
    content: "Hello! I'm your HR AI Assistant. How can I help you today?",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  }
];

// Context suggestions for chat
const contextSuggestions = [
  "How many candidates do we have?",
  "Show me top candidates",
  "What's our hiring status?"
];

export default function AIAssistant() {
  const { theme, toggleTheme } = useTheme();
  const [messages, setMessages] = useState(initialMessages);
  const [inputMessage, setInputMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newUserMessage = {
      id: Date.now().toString(),
      type: "user" as const,
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        type: "ai" as const,
        content: "I understand your question. Let me help you with that information from your HR data.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
    inputRef.current?.focus();
  };

  const toggleVoiceListening = () => {
    setIsListening(!isListening);
  };

  const clearChat = () => {
    setMessages(initialMessages);
  };

  const formatTime = (date: Date) => {
    return format(date, "h:mm a");
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
                AI Assistant
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Chat with your intelligent HR assistant or use voice commands
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm">
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" onClick={toggleTheme} className="p-2">
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content - Two Column Layout */}
      <div className="h-[calc(100vh-80px)] flex">
        {/* Left Side - Chat Interface */}
        <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-900">
          {/* Chat Header */}
          <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8 bg-green-100 dark:bg-green-900/20">
                  <AvatarFallback className="bg-green-100 dark:bg-green-900/20">
                    <Bot className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-slate-900 dark:text-white">AI Assistant</h3>
                  <p className="text-xs text-green-600 dark:text-green-400">Online</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={clearChat} data-testid="clear-chat">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Chat Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex items-start space-x-3 max-w-[80%] ${message.type === "user" ? "flex-row-reverse space-x-reverse" : ""}`}>
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className={message.type === "ai" ? "bg-green-100 dark:bg-green-900/20" : "bg-blue-100 dark:bg-blue-900/20"}>
                        {message.type === "ai" ? (
                          <Bot className="h-4 w-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`rounded-lg p-3 ${
                      message.type === "ai" 
                        ? "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700" 
                        : "bg-blue-600 text-white"
                    }`}>
                      <p className={`text-sm ${message.type === "ai" ? "text-slate-700 dark:text-slate-300" : "text-white"}`}>
                        {message.content}
                      </p>
                      <p className={`text-xs mt-1 ${
                        message.type === "ai" 
                          ? "text-slate-500 dark:text-slate-400" 
                          : "text-blue-100"
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-3 max-w-[80%]">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className="bg-green-100 dark:bg-green-900/20">
                        <Bot className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Context Suggestions */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <div className="flex flex-wrap gap-2 mb-3">
              {contextSuggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-xs"
                  data-testid={`suggestion-${index}`}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>

          {/* Chat Input */}
          <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
            <div className="flex space-x-2">
              <Input
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about your HR data..."
                className="flex-1"
                data-testid="chat-input"
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                data-testid="send-message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Right Side - Voice Widget */}
        <div className="w-96 bg-slate-50 dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 flex flex-col">
          {/* Voice Header */}
          <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8 bg-purple-100 dark:bg-purple-900/20">
                <AvatarFallback className="bg-purple-100 dark:bg-purple-900/20">
                  <Volume2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white">Voice Mode</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Coming soon</p>
              </div>
              <Button variant="ghost" size="sm" className="ml-auto">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Voice Interface */}
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="text-center mb-8">
              <div className="relative">
                {/* Large Microphone Button */}
                <Button
                  variant={isListening ? "default" : "outline"}
                  size="lg"
                  className={`w-32 h-32 rounded-full ${
                    isListening 
                      ? "bg-purple-600 hover:bg-purple-700 text-white animate-pulse" 
                      : "bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700"
                  }`}
                  onClick={toggleVoiceListening}
                  data-testid="voice-button"
                >
                  {isListening ? (
                    <MicOff className="h-12 w-12" />
                  ) : (
                    <Mic className="h-12 w-12" />
                  )}
                </Button>

                {/* Pulse animation when listening */}
                {isListening && (
                  <div className="absolute inset-0 rounded-full border-4 border-purple-400 animate-ping" />
                )}
              </div>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-2">
                Voice Assistant
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                {isListening 
                  ? "Listening... Speak now" 
                  : "Voice features will be available soon"
                }
              </p>

              {/* Status indicator */}
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    voiceEnabled ? "bg-green-500" : "bg-slate-400"
                  }`} />
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {voiceEnabled ? "Voice Enabled" : "Voice Disabled"}
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Coming Soon
                </p>
              </div>
            </div>

            {/* Audio Waveform Placeholder */}
            {isListening && (
              <div className="flex items-center justify-center space-x-1 mb-6">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-purple-500 rounded-full animate-pulse"
                    style={{
                      height: `${Math.random() * 24 + 8}px`,
                      animationDelay: `${i * 100}ms`,
                      animationDuration: '1s'
                    }}
                  />
                ))}
              </div>
            )}

            {/* Voice Controls */}
            <div className="space-y-3 w-full max-w-xs">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                data-testid="toggle-voice"
              >
                {voiceEnabled ? (
                  <>
                    <VolumeX className="h-4 w-4 mr-2" />
                    Disable Voice
                  </>
                ) : (
                  <>
                    <Volume2 className="h-4 w-4 mr-2" />
                    Enable Voice
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}