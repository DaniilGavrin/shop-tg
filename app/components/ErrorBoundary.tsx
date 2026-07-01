'use client';
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  name?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[ErrorBoundary: ${this.props.name || 'Unknown'}]`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-xl border border-red-500/50 bg-red-900/20 p-4 my-4">
          <p className="text-red-400 font-bold mb-2">️ Компонент сломался: {this.props.name}</p>
          <pre className="text-xs text-red-300 bg-black/40 p-3 rounded overflow-auto max-h-40">
            {this.state.error?.message || 'Неизвестная ошибка'}
          </pre>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-3 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-sm rounded transition"
          >
            Попробовать снова
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}