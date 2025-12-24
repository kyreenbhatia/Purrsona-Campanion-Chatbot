export type Mood = "affection" | "comfort" | "humor" | "happy" | "neutral";

interface MoodResult {
  mood: Mood;
  shouldTriggerPopup: boolean;
}

const AFFECTION_KEYWORDS = ["love you", "appreciate you", "thank you", "grateful", "❤️", "💗", "💕", "🥰", "you're the best", "means a lot"];
const COMFORT_KEYWORDS = ["sad", "lonely", "depressed", "anxious", "stressed", "tired", "exhausted", "bad day", "crying", "hurt", "scared", "worried", "overwhelmed", "i feel", "struggling"];
const HUMOR_KEYWORDS = ["haha", "lol", "lmao", "joke", "funny", "😂", "🤣", "😹", "tell me a joke", "make me laugh", "that's hilarious"];
const HAPPY_KEYWORDS = ["happy", "excited", "amazing", "great", "awesome", "yay", "woohoo", "celebrate", "proud", "did it", "finished", "accomplished", "✨", "🎉"];

export const detectMood = (message: string): Mood => {
  const lower = message.toLowerCase();
  
  if (AFFECTION_KEYWORDS.some(k => lower.includes(k))) return "affection";
  if (COMFORT_KEYWORDS.some(k => lower.includes(k))) return "comfort";
  if (HUMOR_KEYWORDS.some(k => lower.includes(k))) return "humor";
  if (HAPPY_KEYWORDS.some(k => lower.includes(k))) return "happy";
  return "neutral";
};

// Popup cooldown tracker
const popupCooldowns: Record<string, number> = {};
const COOLDOWN_MESSAGES = 3;

export const shouldShowPopup = (mood: Mood, messageIndex: number): MoodResult => {
  const cooldownKey = mood;
  const lastShown = popupCooldowns[cooldownKey] || -COOLDOWN_MESSAGES;
  
  if (mood === "neutral") {
    return { mood, shouldTriggerPopup: false };
  }
  
  // Check cooldown
  if (messageIndex - lastShown < COOLDOWN_MESSAGES) {
    return { mood, shouldTriggerPopup: false };
  }
  
  // Humor has 50-70% chance
  if (mood === "humor") {
    const shouldShow = Math.random() < 0.6;
    if (shouldShow) popupCooldowns[cooldownKey] = messageIndex;
    return { mood, shouldTriggerPopup: shouldShow };
  }
  
  // Other moods trigger normally
  popupCooldowns[cooldownKey] = messageIndex;
  return { mood, shouldTriggerPopup: true };
};

export const getMoodGradient = (mood: Mood): string => {
  switch (mood) {
    case "affection":
      return "gradient-bubble-affection";
    case "comfort":
      return "gradient-bubble-comfort";
    case "humor":
    case "happy":
      return "gradient-bubble-happy";
    default:
      return "gradient-bubble";
  }
};
