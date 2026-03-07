"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string; // ISO string for serialization
}

interface ChatStore {
  messages: ChatMessage[];
  addMessage: (msg: ChatMessage) => void;
  updateMessage: (id: string, content: string) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      messages: [],
      addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
      updateMessage: (id, content) =>
        set((s) => ({
          messages: s.messages.map((m) => (m.id === id ? { ...m, content } : m)),
        })),
      clearMessages: () => set({ messages: [] }),
    }),
    { name: "quaipulse-chat" }
  )
);
