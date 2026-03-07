"use client";

import { Component } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallbackTitle?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-xl border border-danger/30 bg-danger/5 p-6 text-center">
          <AlertCircle className="h-8 w-8 text-danger mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-text-primary mb-1">
            {this.props.fallbackTitle ?? "Something went wrong"}
          </h3>
          <p className="text-xs text-text-muted mb-4 max-w-md mx-auto">
            {this.state.error?.message ?? "An unexpected error occurred."}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="inline-flex items-center gap-1.5 rounded-lg bg-accent-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-accent-hover transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
