export default function SceneLoader({ label = "Building BotCity…" }: { label?: string }) {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-b from-slate-950 via-emerald-950 to-slate-950">
      <div className="text-center">
        <div className="inline-flex items-center gap-3 mb-4">
          <span className="text-3xl drop-shadow-[0_0_24px_rgba(34,197,94,0.5)]" aria-hidden>
            💰
          </span>
          <span className="text-2xl font-black text-white tracking-tight">
            BotCity <span className="text-amber-400">v1</span>
          </span>
        </div>
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse [animation-delay:150ms]" />
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse [animation-delay:300ms]" />
        </div>
        <p className="text-emerald-200/70 text-sm">{label}</p>
      </div>
    </div>
  );
}
