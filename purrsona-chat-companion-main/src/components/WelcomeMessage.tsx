const WelcomeMessage = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mb-6 shadow-glow animate-float">
        <span className="text-5xl">🐱</span>
      </div>
      
      <h2 className="text-2xl font-bold text-foreground mb-2">
        Hewwo! I'm Purrsona~ 💕
      </h2>
      
      <p className="text-muted-foreground max-w-sm leading-relaxed">
        I'm your supportive cat bestie, here to chat, listen, and make you smile! 
        Tell me anything - I'm all ears (and whiskers)! 🐾✨
      </p>

      <div className="flex gap-3 mt-6">
        <span className="px-4 py-2 rounded-full bg-lavender text-sm font-medium text-foreground">
          🌸 Supportive
        </span>
        <span className="px-4 py-2 rounded-full bg-mint text-sm font-medium text-foreground">
          ✨ Playful
        </span>
        <span className="px-4 py-2 rounded-full bg-peach text-sm font-medium text-foreground">
          💗 Caring
        </span>
      </div>
    </div>
  );
};

export default WelcomeMessage;
