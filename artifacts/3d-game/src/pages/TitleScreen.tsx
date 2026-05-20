import { useGameStore } from "../game/gameStore";

const FEATURES = [
  {
    emoji: "💼",
    title: "Earn",
    desc: "Collect your paycheck at WorkCorp",
    accent: "from-sky-500/10 to-emerald-500/5 border-emerald-500/25",
  },
  {
    emoji: "🛒",
    title: "Shop",
    desc: "Find deductions at TaxMart",
    accent: "from-amber-500/12 to-emerald-500/5 border-amber-400/30",
  },
  {
    emoji: "🏦",
    title: "Brackets",
    desc: "Study brackets at First Bank",
    accent: "from-violet-500/10 to-emerald-500/5 border-emerald-500/25",
  },
  {
    emoji: "🎓",
    title: "Loans",
    desc: "Master student loans at MoneyBot U",
    accent: "from-emerald-500/15 to-amber-500/10 border-emerald-400/35",
  },
  {
    emoji: "🚆",
    title: "Commute",
    desc: "Commute vs travel at BotTrain",
    accent: "from-orange-500/12 to-emerald-500/5 border-orange-400/30",
  },
  {
    emoji: "✈️",
    title: "Travel",
    desc: "Write off business trips at BotPlane",
    accent: "from-sky-500/12 to-emerald-500/5 border-sky-400/30",
  },
  {
    emoji: "🚗",
    title: "Buy a Car",
    desc: "EV credits & Section 179 at BotDealer",
    accent: "from-cyan-500/12 to-amber-500/5 border-cyan-400/30",
  },
  {
    emoji: "🏟️",
    title: "Entertain",
    desc: "TCJA & gambling at BotStadium",
    accent: "from-red-500/12 to-amber-500/5 border-red-400/30",
  },
  {
    emoji: "🛍️",
    title: "SE Tax",
    desc: "Self-employment at BotMarket",
    accent: "from-amber-500/12 to-emerald-500/5 border-amber-400/30",
  },
  {
    emoji: "🏖️",
    title: "Vacation",
    desc: "Personal vs business at BotBeach",
    accent: "from-cyan-500/12 to-emerald-500/5 border-cyan-400/30",
  },
  {
    emoji: "🏪",
    title: "Hobby?",
    desc: "Hobby vs business at BotShops",
    accent: "from-fuchsia-500/12 to-emerald-500/5 border-fuchsia-400/30",
  },
  {
    emoji: "📋",
    title: "File",
    desc: "Submit your return at the IRS",
    accent: "from-rose-500/10 to-emerald-500/5 border-emerald-500/25",
  },
];

export default function TitleScreen() {
  const startGame = useGameStore((s) => s.startGame);

  return (
    <div className="h-screen overflow-y-auto bg-gradient-to-b from-slate-950 via-emerald-950 to-slate-950">
      {/* Ambient glow orbs */}
      <div className="pointer-events-none fixed top-1/4 -left-32 w-[28rem] h-[28rem] rounded-full bg-emerald-500/15 blur-3xl" />
      <div className="pointer-events-none fixed bottom-1/4 -right-32 w-[28rem] h-[28rem] rounded-full bg-amber-400/10 blur-3xl" />
      {/* Subtle grid backdrop */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34,197,94,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.6) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative min-h-full flex items-start sm:items-center justify-center px-6 py-8">
        <div className="text-center w-full max-w-2xl">
          {/* Branding row */}
          <div className="inline-flex items-center gap-3 mb-1">
            <span className="text-4xl drop-shadow-[0_0_24px_rgba(34,197,94,0.5)]" aria-hidden>
              💰
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-none">
              BotCity{" "}
              <span className="text-amber-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.6)]">v1</span>
            </h1>
          </div>

          {/* Eyebrow */}
          <div className="text-[11px] font-bold tracking-[0.3em] text-emerald-300/80 uppercase mb-2">
            A Tax-Filing Adventure
          </div>

          <p className="text-emerald-100/75 text-base mb-6 leading-relaxed max-w-md mx-auto">
            Explore an emerald city of bots, earn income, find deductions, and
            file your first tax return.
          </p>

          {/* Feature row — 7 stops, 4-up grid wraps to 2 rows */}
          <div className="grid grid-cols-4 gap-2 mb-5 text-left">
            {FEATURES.map(({ emoji, title, desc, accent }, i) => (
              <div
                key={title}
                className={`relative bg-slate-950/60 border rounded-xl p-2.5 backdrop-blur-sm bg-gradient-to-b ${accent} hover:border-emerald-400/40 transition-colors`}
              >
                <div className="absolute top-2 right-2 text-[10px] font-mono text-emerald-300/40">
                  0{i + 1}
                </div>
                <div className="text-xl mb-1">{emoji}</div>
                <div className="font-bold text-white text-[13px] leading-tight">{title}</div>
                <div className="text-emerald-200/60 text-[11px] leading-snug mt-0.5">
                  {desc}
                </div>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="bg-slate-950/60 border border-emerald-500/20 rounded-xl px-4 py-3 mb-6 backdrop-blur-sm text-sm flex items-center justify-center gap-x-5 gap-y-2 flex-wrap">
            <div className="flex items-center gap-2 text-emerald-100/80">
              <kbd className="px-1.5 py-0.5 rounded bg-emerald-900/50 border border-emerald-500/30 font-mono text-[10px] text-emerald-200">
                WASD
              </kbd>
              <span className="text-xs">Move</span>
            </div>
            <span className="text-emerald-500/30">•</span>
            <div className="flex items-center gap-2 text-emerald-100/80">
              <kbd className="px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-400/40 font-mono text-[10px] text-amber-200">
                E
              </kbd>
              <span className="text-xs">Enter building</span>
            </div>
            <span className="text-emerald-500/30">•</span>
            <div className="flex items-center gap-2 text-emerald-100/80">
              <span className="text-amber-300 text-sm">🎯</span>
              <span className="text-xs">Visit all 4 to win</span>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={startGame}
            className="group relative bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-black text-lg py-3.5 px-10 rounded-2xl transition-all transform hover:scale-[1.03] active:scale-95 shadow-[0_0_40px_-4px_rgba(251,191,36,0.6)] hover:shadow-[0_0_60px_-4px_rgba(251,191,36,0.8)]"
          >
            <span className="inline-flex items-center gap-2">
              Start Playing
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </span>
          </button>
          <p className="text-emerald-200/40 text-[11px] mt-3">No real taxes required 😄</p>
        </div>
      </div>
    </div>
  );
}
