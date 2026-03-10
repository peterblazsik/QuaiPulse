"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Bot, Send, Sparkles, User, AlertCircle, Square, Copy, Check, Trash2, Database } from "lucide-react";
import { useChatStore, type ChatMessage } from "@/lib/stores/chat-store";
import { buildStoreContext } from "@/lib/ai/store-context";
import dynamic from "next/dynamic";

const Markdown = dynamic(() => import("react-markdown"), { ssr: false });

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const SUGGESTION_CHIPS = [
  "What should I focus on this week?",
  "Am I on track with my budget?",
  "Compare my top 3 neighborhoods with real scores",
  "Which checklist items are most urgent right now?",
  "Draft an apartment application email in German",
  "Optimize my Katie visit schedule for cheaper flights",
  "What gym should I join given my knee issues?",
  "How much tax would I save in Rüschlikon vs the city?",
];

const WELCOME_MESSAGE = `I'm Pulse, your personal Zurich relocation advisor. I have **live access to all your app data** — budget, neighborhood rankings, checklist progress, apartment pipeline, subscriptions, dossier status, and more.

**I can help with:**
- Personalized neighborhood recommendations based on your actual priority weights
- Budget analysis using your real numbers and tax municipality
- "What should I focus on?" based on your checklist progress and deadlines
- Apartment strategy referencing your saved listings
- Katie visit optimization with your planned dates
- Swiss admin, insurance, and tax questions

Every answer is tailored to *your* data, not generic advice. Ask me anything.`;

export default function AIPage() {
  const chatStore = useChatStore();
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
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const hydratedRef = useRef(false);

  // Hydrate from persisted store on mount
  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;
    const stored = useChatStore.getState().messages;
    if (stored.length > 0) {
      const welcome: Message = {
        id: "welcome",
        role: "assistant",
        content: WELCOME_MESSAGE,
        timestamp: new Date(),
      };
      const restored: Message[] = stored.map((m) => ({
        ...m,
        timestamp: new Date(m.timestamp),
      }));
      setMessages([welcome, ...restored]);
    }
  }, []);

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
        // Build live store context for personalized AI responses
        let storeContext = "";
        try {
          storeContext = buildStoreContext();
        } catch {
          // Stores may not be hydrated yet — send without context
        }

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history, storeContext }),
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
        // Persist non-welcome messages to store
        setMessages((prev) => {
          const toStore: ChatMessage[] = prev
            .filter((m) => m.id !== "welcome" && m.content.length > 0)
            .map((m) => ({
              id: m.id,
              role: m.role,
              content: m.content,
              timestamp: m.timestamp.toISOString(),
            }));
          useChatStore.setState({ messages: toStore });
          return prev;
        });
      }
    },
    [input, isStreaming, messages]
  );

  const handleClear = useCallback(() => {
    chatStore.clearMessages();
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: WELCOME_MESSAGE,
        timestamp: new Date(),
      },
    ]);
    setError(null);
  }, [chatStore]);

  const handleCopy = useCallback(async (msgId: string, content: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-var(--header-height)-var(--status-bar-height)-48px)]">
      {/* Header */}
      <div className="shrink-0 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-accent-primary/20 flex items-center justify-center">
              <Bot className="h-4 w-4 text-accent-primary" />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold text-text-primary">
                Pulse AI
              </h1>
              <p className="text-[10px] text-text-muted flex items-center gap-1">
                <Database className="h-2.5 w-2.5 text-success" />
                Live data access — powered by Gemini
              </p>
            </div>
          </div>
          {messages.length > 1 && (
            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 text-[10px] px-3 py-1.5 rounded-lg border border-border-default bg-bg-secondary text-text-muted hover:border-danger/40 hover:text-danger transition-colors"
              title="Clear conversation"
            >
              <Trash2 className="h-3 w-3" />
              Clear
            </button>
          )}
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
                  : "bg-success/20"
              }`}
            >
              {msg.role === "assistant" ? (
                <Bot className="h-3.5 w-3.5 text-accent-primary" />
              ) : (
                <User className="h-3.5 w-3.5 text-success" />
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
              <div className="text-xs text-text-secondary leading-relaxed prose-sm [&_strong]:text-text-primary [&_code]:bg-bg-tertiary [&_code]:px-1 [&_code]:rounded [&_code]:text-accent-primary [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_li]:mt-1 [&_p]:mt-1 [&_p:first-child]:mt-0 [&_a]:text-accent-primary [&_a]:underline">
                <Markdown>{msg.content}</Markdown>
                {msg.role === "assistant" && msg.content === "" && isStreaming && (
                  <span className="inline-block h-3 w-1.5 bg-accent-primary animate-pulse rounded-sm" />
                )}
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-[10px] text-text-muted">
                  {msg.timestamp.toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                {msg.role === "assistant" && msg.content.length > 0 && (
                  <button
                    onClick={() => handleCopy(msg.id, msg.content)}
                    className="text-text-muted hover:text-text-secondary transition-colors p-0.5"
                    title="Copy message"
                  >
                    {copiedId === msg.id ? (
                      <Check className="h-3 w-3 text-success" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                )}
              </div>
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
        <textarea
          rows={1}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Ask Pulse anything about your Zurich move..."
          className="flex-1 rounded-xl border border-border-default bg-bg-secondary px-4 py-3 text-xs text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none transition-colors resize-none overflow-hidden"
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
