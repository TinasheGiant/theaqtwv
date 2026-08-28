import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Aqutewave Application Error Caught:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleClearAndReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.warn(e);
    }
    window.location.href = window.location.pathname;
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div
          id="aqutewave-error-fallback"
          className="min-h-screen bg-[#050608] text-white flex flex-col items-center justify-center p-6 text-center select-none"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          <div className="max-w-lg w-full bg-[#0a0c10] border border-amber-500/30 rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(212,175,55,0.15)] flex flex-col items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.2)]">
              <ShieldAlert className="w-8 h-8 text-amber-400 animate-pulse" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] tracking-[0.25em] uppercase text-amber-400 font-bold font-mono">
                AQUTEWAVE RECOVERY PROTOCOL
              </span>
              <h1 className="text-2xl font-bold text-white tracking-wide">
                System Interface Recovery
              </h1>
              <p className="text-xs text-gray-400 leading-relaxed">
                The application encountered an unexpected runtime state. Click below to refresh or restore standard configurations.
              </p>
            </div>

            {this.state.error && (
              <div className="w-full text-left p-3 rounded-xl bg-black/60 border border-red-500/20 text-red-300 text-[11px] font-mono overflow-auto max-h-28">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                onClick={this.handleReload}
                id="btn-error-reload"
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold text-xs tracking-wider uppercase transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Portal
              </button>
              <button
                onClick={this.handleClearAndReset}
                id="btn-error-reset"
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 font-semibold text-xs tracking-wider uppercase transition-all cursor-pointer"
              >
                <Home className="w-4 h-4" />
                Reset & Home
              </button>
            </div>

            <div className="pt-2 border-t border-white/5 w-full flex items-center justify-between text-[10px] text-gray-500 font-mono">
              <span>Aqutewave Zimbabwe</span>
              <span>fullstackphp.aqutewave.co.zw</span>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
