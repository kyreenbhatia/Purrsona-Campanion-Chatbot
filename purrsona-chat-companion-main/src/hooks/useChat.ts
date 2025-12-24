import { useState, useCallback } from "react";
import { toast } from "sonner";
import { detectMood, shouldShowPopup, type Mood } from "./useMoodDetection";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  mood?: Mood;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [popupMood, setPopupMood] = useState<Mood | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  const triggerPopup = useCallback((mood: Mood) => {
    setPopupMood(mood);
    setShowPopup(true);
  }, []);

  const clearPopup = useCallback(() => {
    setShowPopup(false);
    setPopupMood(null);
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    const detectedMood = detectMood(content);
    const { shouldTriggerPopup } = shouldShowPopup(detectedMood, messages.length);
    
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      mood: detectedMood,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Trigger popup based on user message mood
    if (shouldTriggerPopup) {
      setTimeout(() => triggerPopup(detectedMood), 500);
    }

    let assistantContent = "";

    const updateAssistant = (chunk: string, mood: Mood) => {
      assistantContent += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, content: assistantContent } : m
          );
        }
        return [
          ...prev,
          { id: crypto.randomUUID(), role: "assistant", content: assistantContent, mood },
        ];
      });
    };

    try {
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to get response");
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) updateAssistant(content, detectedMood);
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      // Final flush
      if (buffer.trim()) {
        for (let raw of buffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) updateAssistant(content, detectedMood);
          } catch {
            /* ignore */
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Oops! Something went wrong, meow~ 🐱"
      );
      // Remove the loading message if error occurred before response
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && !last.content) {
          return prev.slice(0, -1);
        }
        return prev;
      });
    } finally {
      setIsLoading(false);
    }
  }, [messages, triggerPopup]);

  return { 
    messages, 
    isLoading, 
    sendMessage, 
    popupMood, 
    showPopup, 
    triggerPopup, 
    clearPopup 
  };
};
