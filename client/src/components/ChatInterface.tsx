import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { chatApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, Loader2 } from "lucide-react";

interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp?: Date;
  createdAt?: Date | null;
  taskId?: string;
}

interface ChatInterfaceProps {
  onSendMessage?: (message: string) => void;
  isLoading?: boolean;
  className?: string;
}

export default function ChatInterface({ onSendMessage, isLoading = false, className }: ChatInterfaceProps) {
  const [message, setMessage] = useState("");
  // Fetch chat messages from API
  const { data: chatMessages = [] } = useQuery({
    queryKey: ["/api/chat/messages"],
    queryFn: () => chatApi.getMessages(50),
  });

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  // Update local messages when API data changes
  useEffect(() => {
    if (chatMessages.length === 0) {
      setMessages([
        {
          id: "welcome",
          content: "Hello! I'm your AI assistant for the eRupi Pilot Program. I can help you create, update, complete, or remove tasks. I can also add remarks and track activities. What would you like to do?",
          role: "assistant",
          createdAt: new Date(),
        } as ChatMessage
      ]);
    } else {
      setMessages(chatMessages.map(msg => ({
        ...msg,
        timestamp: msg.createdAt
      })) as any);
    }
  }, [chatMessages]);

  const queryClient = useQueryClient();

  const sendMessageMutation = useMutation({
    mutationFn: (content: string) => chatApi.sendMessage(content),
    onSuccess: (response) => {
      // Update messages with both user and AI response
      setMessages(prev => [
        ...prev.filter(m => m.id !== "temp-user"),
        {
          ...response.userMessage,
          timestamp: response.userMessage.createdAt
        } as any,
        {
          ...response.aiMessage,
          timestamp: response.aiMessage.createdAt
        } as any
      ]);
      
      // Invalidate queries to refresh task data
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/chat/messages"] });
    },
    onError: (error) => {
      console.error("Failed to send message:", error);
      setMessages(prev => prev.filter(m => m.id !== "temp-user"));
    },
  });
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!message.trim() || sendMessageMutation.isPending) return;

    const userContent = message.trim();
    
    // Add temporary user message for immediate feedback
    const tempUserMessage: ChatMessage = {
      id: "temp-user",
      content: userContent,
      role: "user",
      createdAt: new Date(),
    };
    
    setMessages(prev => [...prev, tempUserMessage as any]);
    
    // Send message to AI
    sendMessageMutation.mutate(userContent);
    
    onSendMessage?.(userContent);
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className={`flex flex-col h-full ${className || ""}`} data-testid="chat-interface">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          AI Task Assistant
          <Badge variant="secondary" className="ml-auto">
            GPT-5 Powered
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex flex-col flex-1 gap-4 p-4">
        <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                data-testid={`message-${msg.role}-${msg.id}`}
              >
                <div className={`flex gap-2 max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    {msg.role === "user" ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  
                  <div
                    className={`rounded-lg px-3 py-2 ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {sendMessageMutation.isPending && (
              <div className="flex gap-3 justify-start">
                <div className="flex gap-2 max-w-[80%]">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="rounded-lg px-3 py-2 bg-muted">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex gap-2">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me to create, update, or manage tasks..."
            className="flex-1 min-h-[44px] max-h-32 resize-none"
            disabled={sendMessageMutation.isPending}
            data-testid="input-chat-message"
          />
          <Button
            onClick={handleSend}
            disabled={!message.trim() || sendMessageMutation.isPending}
            size="icon"
            data-testid="button-send-message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          Try: "Create a new task for mall partnership" or "Update task 1 status to completed"
        </div>
      </CardContent>
    </Card>
  );
}