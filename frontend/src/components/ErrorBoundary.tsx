import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };

  public static getDerivedStateFromError() {
    return { hasError: true };
  }

  public componentDidCatch(_error: Error, _errorInfo: ErrorInfo) {}

  public render() {
    if (this.state.hasError) {
      return (
        <div className="card p-8">
          <h2 className="mb-2 text-2xl">Something spilled a little.</h2>
          <p className="text-sm text-nourish-muted">Refresh the page and we should be back in good shape.</p>
        </div>
      );
    }

    return this.props.children;
  }
}
