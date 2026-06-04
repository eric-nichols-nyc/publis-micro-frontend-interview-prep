import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  label: string;
};

type State = {
  hasError: boolean;
};

export class RemoteErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[${this.props.label}] remote error`, error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="remote-fallback" role="alert">
          <h3>{this.props.label} unavailable</h3>
          <p>
            The shell is still running. Other micro-frontends can load
            normally.
          </p>
          <button
            className="remote-fallback__retry"
            onClick={() => this.setState({ hasError: false })}
            type="button"
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
