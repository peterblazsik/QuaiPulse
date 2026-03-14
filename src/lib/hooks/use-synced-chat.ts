"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { trpc } from "@/lib/trpc/client";
import { useChatStore, type ChatMessage } from "@/lib/stores/chat-store";

const LS_KEY = "quaipulse-chat";

export function useSyncedChat() {
  const { data: session } = useSession();
  const migrated = useRef(false);
  const utils = trpc.useUtils();
  const query = trpc.chat.list.useQuery(undefined, {
    enabled: !!session?.user?.id,
  });
  const createMut = trpc.chat.create.useMutation({
    onSuccess: () => utils.chat.list.invalidate(),
  });
  const clearMut = trpc.chat.clear.useMutation({
    onSuccess: () => utils.chat.list.invalidate(),
  });

  useEffect(() => {
    if (!session?.user?.id || migrated.current) return;
    if (query.isLoading) return;

    const serverData = query.data;

    if (!serverData || serverData.length === 0) {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          const state = parsed.state ?? parsed;
          const messages: ChatMessage[] = state.messages ?? [];
          for (const m of messages) {
            createMut.mutate({
              role: m.role,
              content: m.content,
            });
          }
          localStorage.removeItem(LS_KEY);
        } catch { /* */ }
      }
    } else {
      const messages: ChatMessage[] = serverData.map((m) => ({
        id: m.id,
        role: m.role as ChatMessage["role"],
        content: m.content,
        timestamp: m.createdAt instanceof Date ? m.createdAt.toISOString() : m.createdAt,
      }));
      useChatStore.setState({ messages });
      localStorage.removeItem(LS_KEY);
    }

    migrated.current = true;
  }, [session?.user?.id, query.isLoading, query.data, createMut, utils]);

  return {
    isLoading: query.isLoading,
    createMessage: createMut.mutate,
    clearMessages: clearMut.mutate,
  };
}
