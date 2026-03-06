"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Bot, Send, Sparkles, User, AlertCircle, Square } from "lucide-react";

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

const WELCOME_MESSAGE = `I'm Pulse, your Zurich relocation AI assistant. I have full context on your profile, priorities, budget, and neighborhood rankings.

**I can help with:**
- Neighborhood comparisons and deep-dives
- Apartment hunting strategy and application letters
- Budget optimization and what-if scenarios
- Katie visit planning and logistics
- Swiss admin, insurance, and tax questions
- Social life recommendations

Ask me anything about your move to Zurich. I know your constraints (knee, Katie visits, budget) and preferences (gym, chess, AI meetups) intimately.`;

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: WELCOME_MESSAGE,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleStop = useCallback(() => {
    abortRef.current?.abort();
    setIsStreaming(false);
  }, []);

  const handleSend = useCallback(
    async (text?: string) => {
      const content = text ?? input.trim();
      if (!content || isStreaming) return;

      setError(null);

      const userMsg: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content,
        timestamp: new Date(),
      };

      const assistantId = `assistant-${Date.now()}`;
      const assistantMsg: Message = {
        id: assistantId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setInput("");
      setIsStreaming(true);

      // Build conversation history (exclude welcome message)
      const history = [...messages.filter((m) => m.id !== "welcome"), userMsg].map(
        (m) => ({ role: m.role, content: m.content })
      );

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error ?? `HTTP ${res.status}`);
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No response stream");

        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const payload = line.slice(6);
            if (payload === "[DONE]") break;

            try {
              const parsed = JSON.parse(payload);
              if (parsed.error) throw new Error(parsed.error);
              if (parsed.text) {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId
                      ? { ...m, content: m.content + parsed.text }
                      : m
                  )
                );
              }
            } catch {
              // skip malformed chunks
            }
          }
        }
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") {
          // User cancelled — keep partial response
        } else {
          const message =
            err instanceof Error ? err.message : "Unknown error";
          setError(message);
          // Remove empty assistant message on error
          setMessages((prev) =>
            prev.filter((m) => m.id !== assistantId || m.content.length > 0)
          );
        }
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [input, isStreaming, messages]
  );

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
              Context-aware assistant for your Zurich move — powered by Gemini
            </p>
          </div>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="shrink-0 mb-3 rounded-lg border border-danger/30 bg-danger/10 px-4 py-2 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-danger shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-danger font-medium">Error</p>
            <p className="text-[11px] text-text-secondary mt-0.5">{error}</p>
          </div>
        </div>
      )}

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
                {msg.role === "assistant" && msg.content === "" && isStreaming && (
                  <span className="inline-block h-3 w-1.5 bg-accent-primary animate-pulse rounded-sm" />
                )}
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
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder="Ask Pulse anything about your Zurich move..."
          className="flex-1 rounded-xl border border-border-default bg-bg-secondary px-4 py-3 text-xs text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none transition-colors"
          disabled={isStreaming}
        />
        {isStreaming ? (
          <button
            onClick={handleStop}
            className="shrink-0 rounded-xl bg-danger/80 px-4 py-3 text-white hover:bg-danger transition-colors"
            title="Stop generating"
          >
            <Square className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="shrink-0 rounded-xl bg-accent-primary px-4 py-3 text-white hover:bg-accent-hover disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
