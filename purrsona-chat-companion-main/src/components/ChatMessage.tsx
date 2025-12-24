import { cn } from "@/lib/utils";
import type { Mood } from "@/hooks/useMoodDetection";
import { getMoodGradient } from "@/hooks/useMoodDetection";

interface ChatMessageProps {
  content: string;
  isBot: boolean;
  isLoading?: boolean;
  mood?: Mood;
}

const ChatMessage = ({ content, isBot, isLoading, mood = "neutral" }: ChatMessageProps) => {
  const bubbleGradient = isBot ? getMoodGradient(mood) : "gradient-user-bubble";
  
  return (
    <div
      className={cn(
        "flex gap-3 animate-fade-in-up",
        isBot ? "justify-start" : "justify-end"
      )}
    >
      {isBot && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shadow-bubble animate-bounce-gentle">
          <span className="text-xl">🐱</span>
        </div>
      )}
      
      <div
        className={cn(
          "max-w-[75%] px-5 py-3 rounded-bubble shadow-bubble transition-all duration-300",
          bubbleGradient,
          isBot
            ? "text-foreground rounded-tl-lg"
            : "text-primary-foreground rounded-tr-lg"
        )}
      >
        {isLoading ? (
          <div className="flex gap-1.5 py-1">
            <span className="w-2 h-2 rounded-full bg-current typing-dot" />
            <span className="w-2 h-2 rounded-full bg-current typing-dot" />
            <span className="w-2 h-2 rounded-full bg-current typing-dot" />
          </div>
        ) : (
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{content}</p>
        )}
      </div>

      {!isBot && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center shadow-bubble">
          <span className="text-xl">💬</span>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
