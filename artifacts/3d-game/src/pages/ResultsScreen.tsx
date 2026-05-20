import { useGameStore } from "../game/gameStore";
import { calculateTax } from "../game/types";

export default function ResultsScreen() {
  const { income, deductions, withheld, finalRefund, finalOwed, purchases, score, restart } = useGameStore();
  const { tax, effectiveRate, bracket } = calculateTax(income, deductions);
  const standardDeduction = 14600;
  const totalDeductions = standardDeduction + deductions;
  const taxableIncome = Math.max(0, income - totalDeductions);

  const deductiblePurchases = purchases.filter((p) => p.deductible);
  const nonDeductiblePurchases = purchases.filter((p) => !p.deductible);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-6">
          <div className="text-6xl mb-3">{finalRefund > 0 ? "🎉" : "📬"}</div>
          <h1 className="text-4xl font-black text-white mb-2">
            {finalRefund > 0 ? "Congrats! You get a refund!" : "You owe some taxes!"}
          </h1>
          <p className="text-gray-400">Your Form 1040 has been submitted to the IRS.</p>
        </div>

        {/* Big result */}
        <div
          className={`rounded-2xl p-6 text-center mb-6 ${
            finalRefund > 0
              ? "bg-green-900/40 border border-green-500/40"
              : "bg-orange-900/40 border border-orange-500/40"
          }`}
        >
          <div className={`text-5xl font-black mb-1 ${finalRefund > 0 ? "text-green-400" : "text-orange-400"}`}>
            {finalRefund > 0 ? `+$${finalRefund.toLocaleString()}` : `-$${finalOwed.toLocaleString()}`}
          </div>
          <div className="text-sm text-gray-300">
            {finalRefund > 0
              ? "Refund — the IRS will send this to your bank!"
              : "Due by April 15th — don't be late or there are penalties!"}
          </div>
        </div>

        {/* Tax return breakdown */}
        <div className="bg-gray-900 border border-white/10 rounded-2xl p-5 mb-6">
          <div className="font-bold text-yellow-400 uppercase text-xs tracking-wider mb-4">Form 1040 Summary</div>
          <div className="space-y-2 text-sm">
            {[
              { label: "Gross Income (from W-2)", value: `$${income.toLocaleString()}`, color: "text-green-400" },
              { label: "Standard Deduction", value: `-$${standardDeduction.toLocaleString()}`, color: "text-blue-400" },
              { label: "Itemized Deductions", value: deductions > 0 ? `-$${deductions.toLocaleString()}` : "$0", color: "text-blue-400" },
              { label: "Taxable Income", value: `$${taxableIncome.toLocaleString()}`, color: "text-white" },
              { label: `Tax Rate (${bracket} bracket)`, value: `Effective ${effectiveRate}%`, color: "text-orange-400" },
              { label: "Total Tax Liability", value: `$${tax.toLocaleString()}`, color: "text-red-400" },
              { label: "Federal Tax Withheld", value: `$${withheld.toLocaleString()}`, color: "text-purple-400" },
              { label: finalRefund > 0 ? "Refund" : "Amount Owed", value: finalRefund > 0 ? `$${finalRefund.toLocaleString()}` : `$${finalOwed.toLocaleString()}`, color: finalRefund > 0 ? "text-green-400 font-bold" : "text-orange-400 font-bold" },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex justify-between items-center py-1 border-b border-white/5 last:border-0">
                <span className="text-gray-400">{label}</span>
                <span className={`font-mono ${color}`}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* What you learned */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {deductiblePurchases.length > 0 && (
            <div className="bg-blue-900/30 border border-blue-500/30 rounded-xl p-4">
              <div className="font-bold text-blue-300 text-sm mb-2">✅ Smart Deductions</div>
              {deductiblePurchases.map((p) => (
                <div key={p.id} className="text-xs text-blue-200 mb-1">
                  • {p.name} (saved ~${Math.round(p.deductibleAmount * 0.12)})
                </div>
              ))}
            </div>
          )}
          {nonDeductiblePurchases.length > 0 && (
            <div className="bg-red-900/30 border border-red-500/30 rounded-xl p-4">
              <div className="font-bold text-red-300 text-sm mb-2">❌ Not Deductible</div>
              {nonDeductiblePurchases.map((p) => (
                <div key={p.id} className="text-xs text-red-200 mb-1">
                  • {p.name} (no tax benefit)
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Key lesson */}
        <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-xl p-4 mb-6">
          <div className="font-bold text-yellow-300 mb-2">💡 Key Tax Lesson</div>
          <p className="text-yellow-100/80 text-sm leading-relaxed">
            Tax brackets are <strong>marginal</strong> — you only pay the higher rate on income <em>above</em> that bracket's threshold.
            Your income of ${income.toLocaleString()} put you in the <strong>{bracket} bracket</strong>, but your effective (average) rate was only <strong>{effectiveRate}%</strong> because lower income was taxed at lower rates!
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <div className="bg-yellow-400/20 border border-yellow-400/40 rounded-xl px-6 py-3 text-center">
            <div className="text-yellow-400 font-black text-2xl">{score}</div>
            <div className="text-yellow-200 text-xs">Final Score</div>
          </div>
          <button
            onClick={restart}
            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-xl transition-colors"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
}
