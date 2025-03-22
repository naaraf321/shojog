"use client";

import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Error Boundary caught an error:", error, errorInfo);
  }

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      if (fallback) {
        return fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="p-6 max-w-md mx-auto bg-card rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-primary mb-4">Something went wrong</h2>
            <p className="text-muted-foreground mb-4">An error occurred while rendering this component.</p>
            {error && (
              <div className="p-4 bg-destructive/10 rounded-md text-destructive mb-4">
                <p className="font-mono text-sm">{error.message}</p>
              </div>
            )}
            <button onClick={() => this.setState({ hasError: false, error: null })} className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md">
              Try again
            </button>
          </div>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
