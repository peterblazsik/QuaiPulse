"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, Sparkles, User } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const SUGGESTION_CHIPS = [
  "Compare Enge vs Wiedikon for my lifestyle",
  "Draft an apartment application email in German",
  "Best strategy for apartment hunting in Zurich?",
  "Explain the Swiss rental dossier process",
  "Suggest a weekend itinerary for Katie's first visit",
  "What gym should I join given my knee issues?",
  "Cheapest health insurance options in Zurich?",
  "How does the Swiss tax system work?",
];

const MOCK_RESPONSES: Record<string, string> = {
  default: `I'm Pulse, your Zurich relocation AI assistant. I have full context on your profile, priorities, budget, and neighborhood rankings.

**I can help with:**
- Neighborhood comparisons and deep-dives
- Apartment hunting strategy and application letters
- Budget optimization and what-if scenarios
- Katie visit planning and logistics
- Swiss admin, insurance, and tax questions
- Social life recommendations

Ask me anything about your move to Zurich. I know your constraints (knee, Katie visits, budget) and preferences (gym, chess, AI meetups) intimately.

*Note: I'm currently in demo mode. Connect your Anthropic API key in Settings to enable live Claude responses.*`,
};

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: MOCK_RESPONSES.default,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (text?: string) => {
    const content = text ?? input.trim();
    if (!content) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Mock response after delay
    setTimeout(() => {
      const response: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: `Great question about "${content.slice(0, 50)}${content.length > 50 ? "..." : ""}".

This is a demo response. In production, I would:

1. **Analyze your context** — current neighborhood rankings, budget state, saved apartments
2. **Pull relevant data** — scores, rent ranges, venue proximity
3. **Generate a personalized answer** using Claude with your full profile as system context

To enable live AI responses, add your \`ANTHROPIC_API_KEY\` in the Settings page.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, response]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-var(--header-height)-var(--status-bar-height)-48px)]">
      {/* Header */}
      <div className="shrink-0 mb-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-accent-primary/20 flex items-center justify-center">
            <Bot className="h-4 w-4 text-accent-primary" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold text-text-primary">
              Pulse AI
            </h1>
            <p className="text-[10px] text-text-muted">
              Context-aware assistant for your Zurich move
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            {/* Avatar */}
            <div
              className={`shrink-0 h-7 w-7 rounded-lg flex items-center justify-center ${
                msg.role === "assistant"
                  ? "bg-accent-primary/20"
                  : "bg-emerald-500/20"
              }`}
            >
              {msg.role === "assistant" ? (
                <Bot className="h-3.5 w-3.5 text-accent-primary" />
              ) : (
                <User className="h-3.5 w-3.5 text-emerald-400" />
              )}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[75%] rounded-xl px-4 py-3 ${
                msg.role === "assistant"
                  ? "bg-bg-secondary border border-border-default"
                  : "bg-accent-primary/15 border border-accent-primary/25"
              }`}
            >
              <div className="text-xs text-text-secondary leading-relaxed whitespace-pre-wrap prose-sm">
                {msg.content.split("\n").map((line, i) => {
                  // Basic markdown rendering
                  const boldParsed = line.replace(
                    /\*\*(.*?)\*\*/g,
                    '<strong class="text-text-primary">$1</strong>'
                  );
                  const codeParsed = boldParsed.replace(
                    /`(.*?)`/g,
                    '<code class="bg-bg-tertiary px-1 rounded text-accent-primary">$1</code>'
                  );
                  return (
                    <span
                      key={i}
                      dangerouslySetInnerHTML={{ __html: codeParsed }}
                    />
                  );
                }).reduce((prev, curr, i) => (
                  <>
                    {prev}
                    {i > 0 && <br />}
                    {curr}
                  </>
                ))}
              </div>
              <p className="text-[9px] text-text-muted mt-2">
                {msg.timestamp.toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div className="h-7 w-7 rounded-lg bg-accent-primary/20 flex items-center justify-center shrink-0">
              <Bot className="h-3.5 w-3.5 text-accent-primary" />
            </div>
            <div className="rounded-xl bg-bg-secondary border border-border-default px-4 py-3">
              <div className="flex gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-text-muted animate-bounce [animation-delay:0ms]" />
                <span className="h-1.5 w-1.5 rounded-full bg-text-muted animate-bounce [animation-delay:150ms]" />
                <span className="h-1.5 w-1.5 rounded-full bg-text-muted animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* Suggestion chips */}
      {messages.length <= 1 && (
        <div className="shrink-0 flex flex-wrap gap-2 mb-3">
          {SUGGESTION_CHIPS.slice(0, 4).map((chip) => (
            <button
              key={chip}
              onClick={() => handleSend(chip)}
              className="flex items-center gap-1.5 text-[10px] px-3 py-1.5 rounded-lg border border-border-default bg-bg-secondary text-text-secondary hover:border-accent-primary/40 hover:text-accent-primary transition-colors"
            >
              <Sparkles className="h-2.5 w-2.5" />
              {chip}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="shrink-0 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask Pulse anything about your Zurich move..."
          className="flex-1 rounded-xl border border-border-default bg-bg-secondary px-4 py-3 text-xs text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none transition-colors"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim()}
          className="shrink-0 rounded-xl bg-accent-primary px-4 py-3 text-white hover:bg-accent-hover disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
