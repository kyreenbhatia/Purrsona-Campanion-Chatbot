import { useRef, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import ChatHeader from "@/components/ChatHeader";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import WelcomeMessage from "@/components/WelcomeMessage";
import EmojiPopup from "@/components/EmojiPopup";
import CatRituals from "@/components/CatRituals";
import { useChat } from "@/hooks/useChat";
import type { Mood } from "@/hooks/useMoodDetection";

const RITUAL_MOOD_MAP: Record<string, Mood> = {
  "🐾": "comfort",
  "💙": "comfort", 
  "💗": "affection",
};

const Index = () => {
  const { messages, isLoading, sendMessage, popupMood, showPopup, triggerPopup, clearPopup } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleRitual = useCallback((emoji: string) => {
    const mood = RITUAL_MOOD_MAP[emoji] || "affection";
    triggerPopup(mood);
  }, [triggerPopup]);

  return (
    <>
      <Helmet>
        <title>Purrsona - Your Supportive Cat Bestie 🐱</title>
        <meta
          name="description"
          content="Chat with Purrsona, your supportive and playful AI cat best friend. Get comfort, encouragement, and friendly conversation anytime!"
        />
      </Helmet>

      <EmojiPopup 
        mood={popupMood || "neutral"} 
        show={showPopup} 
        onComplete={clearPopup} 
      />

      <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
        <div className="w-full max-w-2xl h-[90vh] max-h-[800px] flex flex-col bg-card/95 backdrop-blur-sm rounded-3xl shadow-soft overflow-hidden border border-border/30">
          <ChatHeader />

          <CatRituals onRitual={handleRitual} />

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-6 space-y-4"
          >
            {messages.length === 0 ? (
              <WelcomeMessage />
            ) : (
              <>
                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    content={message.content}
                    isBot={message.role === "assistant"}
                    mood={message.mood}
                  />
                ))}
                {isLoading && messages[messages.length - 1]?.role === "user" && (
                  <ChatMessage content="" isBot isLoading />
                )}
              </>
            )}
          </div>

          <ChatInput onSend={sendMessage} disabled={isLoading} />
        </div>
      </div>
    </>
  );
};

export default Index;
