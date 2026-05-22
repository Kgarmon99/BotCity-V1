import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("[BotCity ErrorBoundary]", error, info.componentStack);
  }

  reset = () => {
    this.setState({ error: null });
  };

  reload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.error) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="h-screen w-full flex items-center justify-center bg-gradient-to-b from-slate-950 via-emerald-950 to-slate-950 px-6">
          <div className="max-w-md w-full bg-slate-950/70 border border-amber-500/30 rounded-2xl p-6 text-center backdrop-blur-sm">
            <div className="text-4xl mb-3" aria-hidden>🤖💥</div>
            <h2 className="text-xl font-black text-white mb-2">BotCity hit a snag</h2>
            <p className="text-emerald-100/70 text-sm mb-4">
              The 3D scene crashed while rendering. Your progress is safe — try
              reloading. If it keeps happening, try a smaller browser window or
              close other tabs to free up GPU memory.
            </p>
            <div className="text-left bg-slate-900/60 border border-slate-700/50 rounded-lg px-3 py-2 mb-4 font-mono text-[11px] text-rose-300/80 max-h-32 overflow-auto">
              {this.state.error.message || String(this.state.error)}
            </div>
            <div className="flex gap-2 justify-center">
              <button
                onClick={this.reset}
                className="px-4 py-2 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-100 text-sm font-bold hover:bg-emerald-500/30 transition-colors"
              >
                Try again
              </button>
              <button
                onClick={this.reload}
                className="px-4 py-2 rounded-lg bg-amber-400 text-slate-950 text-sm font-black hover:bg-amber-300 transition-colors"
              >
                Reload
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
