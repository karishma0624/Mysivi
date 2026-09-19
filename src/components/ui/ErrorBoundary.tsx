import { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import { Button } from './Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white border border-[#ECE9F8] rounded-[20px] p-6 text-center shadow-card space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#FFEDEF] text-[#EF4444] flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-ink">Something unexpected occurred</h2>
              <p className="text-xs text-body mt-1">
                {this.state.error?.message || 'An error happened while rendering this component.'}
              </p>
            </div>
            <div className="pt-2">
              <Button
                variant="primary"
                size="sm"
                icon={<RefreshCw className="w-3.5 h-3.5" />}
                onClick={this.handleReset}
              >
                Reload Growth Lab
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
