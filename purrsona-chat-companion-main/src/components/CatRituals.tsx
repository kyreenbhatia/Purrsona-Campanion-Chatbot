import { useState } from "react";
import { cn } from "@/lib/utils";

interface CatRitualsProps {
  onRitual: (ritual: string) => void;
}

interface Ritual {
  id: string;
  label: string;
  emoji: string;
  animation: string;
  popupEmoji: string;
}

const RITUALS: Ritual[] = [
  { id: "stretch", label: "Stretch", emoji: "🐱", animation: "animate-stretch", popupEmoji: "🐾" },
  { id: "yawn", label: "Yawn", emoji: "😽", animation: "animate-yawn", popupEmoji: "💙" },
  { id: "pet", label: "Pet me!", emoji: "🐈", animation: "animate-pet", popupEmoji: "💗" },
];

const CatRituals = ({ onRitual }: CatRitualsProps) => {
  const [activeRitual, setActiveRitual] = useState<string | null>(null);

  const handleRitual = (ritual: Ritual) => {
    setActiveRitual(ritual.id);
    onRitual(ritual.popupEmoji);
    
    setTimeout(() => setActiveRitual(null), 800);
  };

  return (
    <div className="flex gap-2 justify-center py-2">
      {RITUALS.map((ritual) => (
        <button
          key={ritual.id}
          onClick={() => handleRitual(ritual)}
          className={cn(
            "px-3 py-1.5 rounded-full text-sm font-medium",
            "bg-muted/50 hover:bg-muted transition-all duration-200",
            "border border-border/50 hover:border-primary/30",
            "flex items-center gap-1.5",
            activeRitual === ritual.id && ritual.animation
          )}
        >
          <span className={cn(
            "text-base transition-transform duration-300",
            activeRitual === ritual.id && "scale-125"
          )}>
            {ritual.emoji}
          </span>
          <span className="text-muted-foreground">{ritual.label}</span>
        </button>
      ))}
    </div>
  );
};

export default CatRituals;
