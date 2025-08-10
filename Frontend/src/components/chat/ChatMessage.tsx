import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Calendar } from "lucide-react";

interface ChatMessageProps {
  message: {
    id: string;
    content: string;
    role: "user" | "assistant" | "system";
    timestamp: Date;
    isTyping?: boolean;
    fullContent?: string;
  };
  onShowCitations?: (sources: any[]) => void;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [displayedContent, setDisplayedContent] = useState(message.content);
  const animationFrameRef = useRef<number | null>(null);
  const isUser = message.role === "user";
  const isSystem = message.role === "system";
  const isAssistant = message.role === "assistant";

  // Handle typing effect for assistant messages
  useEffect(() => {
    if (message.isTyping && message.fullContent) {
      const startTime = Date.now();
      const typingSpeed = 30; // characters per second
      const fullText = message.fullContent;
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const charactersToShow = Math.min(
          Math.floor((elapsed / 1000) * typingSpeed), 
          fullText.length
        );
        
        const currentText = fullText.substring(0, charactersToShow);
        setDisplayedContent(currentText);
        
        if (charactersToShow < fullText.length) {
          animationFrameRef.current = requestAnimationFrame(animate);
        }
      };
      
      animationFrameRef.current = requestAnimationFrame(animate);
      
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    } else {
      // Not typing, just display the content
      setDisplayedContent(message.content);
    }
  }, [message.isTyping, message.fullContent, message.content]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div
      className={cn(
        "flex w-full mb-4 sm:mb-6 font-sans",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[90%] sm:max-w-[85%] space-y-2 sm:space-y-3",
          isUser && "items-end"
        )}
      >
        {/* Avatar and Name - Mobile Compact */}
        {!isUser && (
          <div className="flex items-center gap-2 mb-1 px-1">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-primary to-research-green flex items-center justify-center flex-shrink-0">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full"></div>
            </div>
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">
              {isSystem ? "System" : "IIPC Assistant"}
            </span>
          </div>
        )}

        {/* Message Bubble */}
        <Card
          className={cn(
            "p-3 sm:p-6 shadow-md sm:shadow-lg transition-all duration-300 relative",
            // User messages - right aligned, primary color
            isUser && "bg-gradient-to-r from-primary to-primary-dark text-primary-foreground border-0 rounded-2xl rounded-br-md",
            // Assistant messages - left aligned, solid background
            isAssistant && "bg-background border border-border/50 rounded-2xl rounded-bl-md hover:shadow-lg",
            // System messages - special styling
            isSystem && "bg-gradient-to-r from-muted/30 to-muted/10 text-muted-foreground border border-muted rounded-2xl"
          )}
        >
          {/* Message Content */}
          <div className={cn(
            "prose prose-sm sm:prose-lg max-w-none leading-relaxed",
            isUser && "text-primary-foreground prose-invert",
            isAssistant && "text-foreground",
            isSystem && "text-muted-foreground prose-muted"
          )}>
            <p className={cn(
              "text-sm sm:text-base leading-relaxed m-0",
              // Fix for URL wrapping - use break-words and break-all for long URLs
              "whitespace-pre-wrap break-words [word-break:break-word] hyphens-auto",
              // Additional CSS for better URL handling
              "[overflow-wrap:anywhere]"
            )}>
              {displayedContent}
              {message.isTyping && (
                <span className="inline-block w-2 h-4 bg-current ml-1 animate-pulse" />
              )}
            </p>
          </div>
        </Card>

        {/* Timestamp */}
        <div
          className={cn(
            "text-xs sm:text-sm text-muted-foreground/70 flex items-center gap-1 px-1",
            isUser ? "justify-end" : "justify-start"
          )}
        >
          <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
}