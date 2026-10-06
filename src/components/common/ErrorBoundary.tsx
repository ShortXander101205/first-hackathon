'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorFallback } from './ErrorFallback';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((props: { error: Error | null; resetError: () => void }) => ReactNode);
  onReset?: () => void;
  title?: string;
  message?: string;
  resetLabel?: string;
  componentName?: string;
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

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log sanitized error information for diagnostics without exposing sensitive student data
    console.error(
      `[PathLess ErrorBoundary] Caught error in ${this.props.componentName || 'Component'}:`,
      error.message,
      errorInfo.componentStack
    );
  }

  resetError = (): void => {
    if (this.props.onReset) {
      this.props.onReset();
    }
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (typeof this.props.fallback === 'function') {
        return this.props.fallback({
          error: this.state.error,
          resetError: this.resetError,
        });
      }

      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallback
          title={this.props.title}
          message={this.props.message}
          resetLabel={this.props.resetLabel}
          onReset={this.resetError}
        />
      );
    }

    return this.props.children;
  }
}
