import { describe, it, expect, beforeEach } from "vitest";
import { useChatStore, type ChatMessage } from "../chat-store";

describe("useChatStore", () => {
  beforeEach(() => {
    useChatStore.setState({ messages: [] });
  });

  describe("initial state", () => {
    it("should start with an empty messages array", () => {
      const { messages } = useChatStore.getState();
      expect(messages).toEqual([]);
    });
  });

  describe("addMessage", () => {
    it("should add a message to the array", () => {
      const { addMessage } = useChatStore.getState();
      const msg: ChatMessage = {
        id: "msg-1",
        role: "user",
        content: "Hello, Claude!",
        timestamp: new Date().toISOString(),
      };

      addMessage(msg);

      const { messages } = useChatStore.getState();
      expect(messages).toHaveLength(1);
      expect(messages[0]).toEqual(msg);
    });

    it("should append messages in order", () => {
      const { addMessage } = useChatStore.getState();

      const msg1: ChatMessage = {
        id: "msg-1",
        role: "user",
        content: "First message",
        timestamp: "2026-07-01T10:00:00Z",
      };
      const msg2: ChatMessage = {
        id: "msg-2",
        role: "assistant",
        content: "Second message",
        timestamp: "2026-07-01T10:00:01Z",
      };

      addMessage(msg1);
      addMessage(msg2);

      const { messages } = useChatStore.getState();
      expect(messages).toHaveLength(2);
      expect(messages[0].id).toBe("msg-1");
      expect(messages[1].id).toBe("msg-2");
    });

    it("should handle both user and assistant roles", () => {
      const { addMessage } = useChatStore.getState();

      addMessage({
        id: "u1",
        role: "user",
        content: "Question",
        timestamp: "2026-07-01T10:00:00Z",
      });
      addMessage({
        id: "a1",
        role: "assistant",
        content: "Answer",
        timestamp: "2026-07-01T10:00:01Z",
      });

      const { messages } = useChatStore.getState();
      expect(messages[0].role).toBe("user");
      expect(messages[1].role).toBe("assistant");
    });
  });

  describe("updateMessage", () => {
    it("should update the content of a message by id", () => {
      const { addMessage } = useChatStore.getState();
      addMessage({
        id: "msg-1",
        role: "assistant",
        content: "Initial...",
        timestamp: "2026-07-01T10:00:00Z",
      });

      const { updateMessage } = useChatStore.getState();
      updateMessage("msg-1", "Updated response with full content.");

      const { messages } = useChatStore.getState();
      expect(messages[0].content).toBe("Updated response with full content.");
    });

    it("should preserve other fields when updating content", () => {
      const { addMessage } = useChatStore.getState();
      const original: ChatMessage = {
        id: "msg-1",
        role: "assistant",
        content: "Original",
        timestamp: "2026-07-01T10:00:00Z",
      };
      addMessage(original);

      const { updateMessage } = useChatStore.getState();
      updateMessage("msg-1", "New content");

      const { messages } = useChatStore.getState();
      expect(messages[0].role).toBe("assistant");
      expect(messages[0].timestamp).toBe("2026-07-01T10:00:00Z");
      expect(messages[0].id).toBe("msg-1");
    });

    it("should not modify other messages when updating one", () => {
      const { addMessage } = useChatStore.getState();
      addMessage({
        id: "msg-1",
        role: "user",
        content: "Hello",
        timestamp: "2026-07-01T10:00:00Z",
      });
      addMessage({
        id: "msg-2",
        role: "assistant",
        content: "Hi there",
        timestamp: "2026-07-01T10:00:01Z",
      });

      const { updateMessage } = useChatStore.getState();
      updateMessage("msg-2", "Updated greeting");

      const { messages } = useChatStore.getState();
      expect(messages[0].content).toBe("Hello");
      expect(messages[1].content).toBe("Updated greeting");
    });

    it("should do nothing when id does not exist", () => {
      const { addMessage } = useChatStore.getState();
      addMessage({
        id: "msg-1",
        role: "user",
        content: "Hello",
        timestamp: "2026-07-01T10:00:00Z",
      });

      const { updateMessage } = useChatStore.getState();
      updateMessage("non-existent", "Should not appear");

      const { messages } = useChatStore.getState();
      expect(messages).toHaveLength(1);
      expect(messages[0].content).toBe("Hello");
    });
  });

  describe("clearMessages", () => {
    it("should empty the messages array", () => {
      const { addMessage } = useChatStore.getState();
      addMessage({
        id: "msg-1",
        role: "user",
        content: "Hello",
        timestamp: "2026-07-01T10:00:00Z",
      });
      addMessage({
        id: "msg-2",
        role: "assistant",
        content: "Hi",
        timestamp: "2026-07-01T10:00:01Z",
      });

      expect(useChatStore.getState().messages).toHaveLength(2);

      const { clearMessages } = useChatStore.getState();
      clearMessages();

      const { messages } = useChatStore.getState();
      expect(messages).toEqual([]);
    });

    it("should be safe to call on an already empty store", () => {
      const { clearMessages } = useChatStore.getState();
      clearMessages();

      const { messages } = useChatStore.getState();
      expect(messages).toEqual([]);
    });
  });
});
