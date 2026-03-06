import { Bot } from "lucide-react";

export default function AIPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <Bot className="h-12 w-12 text-accent-primary" />
      <h2 className="mt-4 font-display text-2xl font-semibold text-text-primary">
        AI Chat - Pulse
      </h2>
      <p className="mt-2 max-w-md text-sm text-text-tertiary">
        Context-aware Claude assistant with personalized recommendations.
        Coming in Phase 8.
      </p>
    </div>
  );
}
