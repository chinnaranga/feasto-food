import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    // Clear potentially corrupted local state / storage triggers before reload
    try {
      localStorage.removeItem('feasto-cart');
    } catch (e) {
      console.error(e);
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-secondary-bg text-text-primary text-center">
          <div className="w-16 h-16 bg-red-500/5 border border-red-500/10 rounded-2xl flex items-center justify-center text-error-main mb-6 shadow-soft">
            <AlertTriangle size={28} />
          </div>
          <h1 className="text-2xl font-black font-heading tracking-tight mb-3">Something went wrong</h1>
          <p className="text-text-secondary max-w-sm mb-8 text-xs leading-relaxed">
            An unexpected client-side error occurred. We have logged the diagnostic details. Please try reloading the page or reset state.
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={() => window.location.reload()}
              className="rounded-xl px-5 font-bold"
            >
              Reload Page
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={this.handleReset}
              className="rounded-xl px-5 font-bold"
            >
              Reset Session
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
