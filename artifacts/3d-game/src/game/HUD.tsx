import { useGameStore } from "./gameStore";
import { calculateTax } from "./types";

export default function HUD() {
  const { income, deductions, withheld, visitedBuildings, score } = useGameStore();
  const { tax, effectiveRate, bracket } = calculateTax(income, deductions);
  const standardDeduction = 14600;
  const totalDed = standardDeduction + deductions;
  const taxableIncome = Math.max(0, income - totalDed);
  const estimatedRefund = withheld - tax;

  const buildings = ["workcorp", "taxmart", "firstbank", "irs"];
  const completed = buildings.filter((b) => visitedBuildings.includes(b)).length;

  return (
    <div className="fixed top-0 left-0 right-0 pointer-events-none z-10 p-4">
      <div className="flex gap-3 flex-wrap">
        {/* Finance Panel */}
        <div className="bg-black/80 text-white rounded-xl p-4 min-w-[200px] border border-white/10 backdrop-blur">
          <div className="text-xs font-bold text-yellow-400 uppercase tracking-wider mb-3">
            Tax Return Summary
          </div>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between gap-6">
              <span className="text-gray-400">Gross Income</span>
              <span className="font-mono text-green-400">${income.toLocaleString()}</span>
            </div>
            <div className="flex justify-between gap-6">
              <span className="text-gray-400">Total Deductions</span>
              <span className="font-mono text-blue-400">-${totalDed.toLocaleString()}</span>
            </div>
            <div className="border-t border-white/10 pt-1.5">
              <div className="flex justify-between gap-6">
                <span className="text-gray-400">Taxable Income</span>
                <span className="font-mono">${taxableIncome.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex justify-between gap-6">
              <span className="text-gray-400">Tax Bracket</span>
              <span className="font-mono text-orange-400">{bracket}</span>
            </div>
            <div className="flex justify-between gap-6">
              <span className="text-gray-400">Tax Owed</span>
              <span className="font-mono text-red-400">${tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between gap-6">
              <span className="text-gray-400">Withheld</span>
              <span className="font-mono text-purple-400">${withheld.toLocaleString()}</span>
            </div>
            <div className="border-t border-white/10 pt-1.5">
              <div className="flex justify-between gap-6">
                <span className="font-bold">
                  {estimatedRefund >= 0 ? "Est. Refund" : "Amount Owed"}
                </span>
                <span
                  className={`font-mono font-bold ${
                    estimatedRefund >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  ${Math.abs(estimatedRefund).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Panel */}
        <div className="bg-black/80 text-white rounded-xl p-4 border border-white/10 backdrop-blur">
          <div className="text-xs font-bold text-yellow-400 uppercase tracking-wider mb-3">
            Progress
          </div>
          <div className="space-y-2 text-sm">
            {[
              { id: "workcorp", emoji: "💼", label: "Visit WorkCorp" },
              { id: "taxmart", emoji: "🛒", label: "Visit TaxMart" },
              { id: "firstbank", emoji: "🏦", label: "Visit First Bank" },
              { id: "irs", emoji: "📋", label: "File at IRS Office" },
            ].map(({ id, emoji, label }) => (
              <div key={id} className="flex items-center gap-2">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                    visitedBuildings.includes(id)
                      ? "bg-green-500"
                      : "bg-gray-700"
                  }`}
                >
                  {visitedBuildings.includes(id) ? "✓" : "○"}
                </span>
                <span className={visitedBuildings.includes(id) ? "line-through text-gray-500" : ""}>
                  {emoji} {label}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-2 border-t border-white/10">
            <div className="text-xs text-gray-400">Score: <span className="text-yellow-400 font-bold">{score}</span></div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="fixed bottom-4 left-4 bg-black/70 text-white text-xs rounded-lg p-3 border border-white/10 backdrop-blur">
        <div className="font-bold text-yellow-400 mb-1">Controls</div>
        <div>WASD / Arrow Keys — Move</div>
        <div>E — Enter building</div>
      </div>
    </div>
  );
}
