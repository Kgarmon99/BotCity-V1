import { useGameStore } from "../game/gameStore";

export default function TitleScreen() {
  const startGame = useGameStore((s) => s.startGame);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center">
      <div className="text-center max-w-xl px-6">
        <div className="text-7xl mb-4">💰</div>
        <h1 className="text-5xl font-black text-white mb-2 tracking-tight">
          Tax Quest <span className="text-yellow-400">3D</span>
        </h1>
        <p className="text-blue-300 text-lg mb-8 leading-relaxed">
          Explore Tax Town, earn income, discover deductions, and file your first tax return!
        </p>

        <div className="grid grid-cols-2 gap-4 mb-8 text-left">
          {[
            { emoji: "💼", title: "Earn Income", desc: "Visit WorkCorp to collect your paycheck and learn about W-2s" },
            { emoji: "🛒", title: "Find Deductions", desc: "Shop at TaxMart — choose what qualifies as a tax deduction!" },
            { emoji: "🏦", title: "Learn Tax Law", desc: "Visit First Bank for lessons on brackets and effective rates" },
            { emoji: "📋", title: "File Your Taxes", desc: "Head to the IRS Office to file and see your refund or bill" },
          ].map(({ emoji, title, desc }) => (
            <div key={title} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="text-2xl mb-1">{emoji}</div>
              <div className="font-bold text-white text-sm mb-1">{title}</div>
              <div className="text-gray-400 text-xs">{desc}</div>
            </div>
          ))}
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6 text-left">
          <div className="font-bold text-yellow-300 mb-1">How to Play</div>
          <div className="text-yellow-100/80 text-sm space-y-1">
            <div>🕹️ <strong>WASD</strong> or <strong>Arrow Keys</strong> to move around Tax Town</div>
            <div>🚪 Walk up to a building and press <strong>E</strong> to enter and interact</div>
            <div>🎯 Visit all 4 buildings and file your taxes to complete the level!</div>
          </div>
        </div>

        <button
          onClick={startGame}
          className="bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xl py-4 px-12 rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-yellow-400/30"
        >
          Start Playing →
        </button>
        <p className="text-gray-600 text-xs mt-4">No real taxes required 😄</p>
      </div>
    </div>
  );
}
