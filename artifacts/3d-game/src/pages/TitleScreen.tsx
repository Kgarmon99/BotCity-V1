import { useGameStore } from "../game/gameStore";

const FEATURES = [
  { emoji: "💼", title: "Earn Income", desc: "Visit WorkCorp to collect your paycheck and learn about W-2s" },
  { emoji: "🛒", title: "Find Deductions", desc: "Shop at TaxMart — choose what qualifies as a tax deduction" },
  { emoji: "🏦", title: "Learn Tax Law", desc: "Visit First Bank for lessons on brackets and effective rates" },
  { emoji: "📋", title: "File Your Taxes", desc: "Head to the IRS Office to file and see your refund or bill" },
];

export default function TitleScreen() {
  const startGame = useGameStore((s) => s.startGame);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-slate-950 via-emerald-950 to-slate-950 flex items-center justify-center">
      {/* Ambient glow orbs */}
      <div className="pointer-events-none absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-amber-400/15 blur-3xl" />

      <div className="relative text-center max-w-xl px-6 py-10">
        <div className="text-7xl mb-4 drop-shadow-[0_0_30px_rgba(34,197,94,0.5)]">💰</div>
        <h1 className="text-5xl font-black text-white mb-2 tracking-tight">
          Tax Quest <span className="text-amber-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.5)]">3D</span>
        </h1>
        <p className="text-emerald-200/80 text-lg mb-8 leading-relaxed">
          Explore BotCity, earn income, discover deductions, and file your first tax return.
        </p>

        <div className="grid grid-cols-2 gap-3 mb-7 text-left">
          {FEATURES.map(({ emoji, title, desc }) => (
            <div
              key={title}
              className="bg-slate-950/60 border border-emerald-500/20 rounded-xl p-4 backdrop-blur-sm hover:border-emerald-400/40 transition-colors"
            >
              <div className="text-2xl mb-1.5">{emoji}</div>
              <div className="font-bold text-white text-sm mb-1">{title}</div>
              <div className="text-emerald-200/60 text-xs leading-relaxed">{desc}</div>
            </div>
          ))}
        </div>

        <div className="bg-amber-500/10 border border-amber-400/30 rounded-xl p-4 mb-6 text-left backdrop-blur-sm">
          <div className="font-bold text-amber-300 mb-1.5 text-sm uppercase tracking-[0.16em]">How to Play</div>
          <div className="text-amber-100/80 text-sm space-y-1">
            <div>
              <kbd className="inline-block px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-400/40 font-mono text-[11px] text-amber-200 mr-1">
                WASD
              </kbd>
              or arrow keys to move around BotCity
            </div>
            <div>
              Walk up to a building and press{" "}
              <kbd className="inline-block px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-400/40 font-mono text-[11px] text-amber-200 mx-0.5">
                E
              </kbd>{" "}
              to enter
            </div>
            <div>Visit all 4 buildings and file your taxes to complete the level</div>
          </div>
        </div>

        <button
          onClick={startGame}
          className="bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-black text-xl py-4 px-12 rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_40px_-4px_rgba(251,191,36,0.6)] hover:shadow-[0_0_60px_-4px_rgba(251,191,36,0.8)]"
        >
          Start Playing →
        </button>
        <p className="text-emerald-200/40 text-xs mt-4">No real taxes required 😄</p>
      </div>
    </div>
  );
}
