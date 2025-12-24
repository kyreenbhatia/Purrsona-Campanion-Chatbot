import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { Mood } from "@/hooks/useMoodDetection";

interface EmojiPopupProps {
  mood: Mood;
  show: boolean;
  onComplete?: () => void;
}

const EMOJI_CONFIG: Record<Mood, { emoji: string; duration: number; animation: string }> = {
  affection: { emoji: "💗", duration: 600, animation: "animate-popup-gentle" },
  comfort: { emoji: "🐾", duration: 1000, animation: "animate-popup-slow" },
  humor: { emoji: "😹", duration: 400, animation: "animate-popup-quick" },
  happy: { emoji: "✨", duration: 400, animation: "animate-popup-quick" },
  neutral: { emoji: "", duration: 0, animation: "" },
};

const EmojiPopup = ({ mood, show, onComplete }: EmojiPopupProps) => {
  const [visible, setVisible] = useState(false);
  const config = EMOJI_CONFIG[mood];

  useEffect(() => {
    if (show && config.emoji) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onComplete?.();
      }, config.duration + 200);
      return () => clearTimeout(timer);
    }
  }, [show, config, onComplete]);

  if (!visible || !config.emoji) return null;

  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
      <span 
        className={cn(
          "text-6xl md:text-8xl select-none",
          config.animation
        )}
      >
        {config.emoji}
      </span>
    </div>
  );
};

export default EmojiPopup;
