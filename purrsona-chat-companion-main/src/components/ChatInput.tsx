import { useState, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex gap-3 items-end p-4 bg-card/80 backdrop-blur-sm border-t border-border/50">
      <div className="flex-1 relative">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message to Purrsona... 🐱"
          disabled={disabled}
          className="w-full min-h-[52px] max-h-32 px-5 py-3.5 rounded-bubble bg-background border border-border/60 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none text-foreground placeholder:text-muted-foreground transition-all duration-200"
          rows={1}
        />
      </div>
      <Button
        onClick={handleSend}
        disabled={!message.trim() || disabled}
        variant="send"
        size="icon"
        className="h-[52px] w-[52px] rounded-full"
      >
        <Send className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default ChatInput;
