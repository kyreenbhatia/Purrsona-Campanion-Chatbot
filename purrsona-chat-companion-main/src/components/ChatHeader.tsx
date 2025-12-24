const ChatHeader = () => {
  return (
    <header className="flex items-center gap-4 p-4 bg-card/90 backdrop-blur-sm border-b border-border/50">
      <div className="relative">
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shadow-soft animate-float">
          <span className="text-2xl">🐱</span>
        </div>
        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-mint rounded-full border-2 border-card" />
      </div>
      
      <div className="flex-1">
        <h1 className="text-lg font-bold text-foreground">Purrsona</h1>
        <p className="text-sm text-muted-foreground">Your supportive cat bestie 💕</p>
      </div>

      <div className="flex gap-1">
        <span className="text-lg animate-bounce-gentle" style={{ animationDelay: "0s" }}>🌸</span>
        <span className="text-lg animate-bounce-gentle" style={{ animationDelay: "0.2s" }}>✨</span>
        <span className="text-lg animate-bounce-gentle" style={{ animationDelay: "0.4s" }}>💖</span>
      </div>
    </header>
  );
};

export default ChatHeader;
