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
  const isRefund = finalRefund > 0;

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-slate-950 via-emerald-950 to-slate-950 flex items-center justify-center p-6">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-emerald-500/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-amber-400/15 blur-3xl" />

      <div className="relative max-w-2xl w-full">
        <div className="text-center mb-6">
          <div className="text-6xl mb-3 drop-shadow-[0_0_30px_rgba(34,197,94,0.5)]">
            {isRefund ? "🎉" : "📬"}
          </div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
            {isRefund ? "Congrats! You get a refund!" : "You owe some taxes!"}
          </h1>
          <p className="text-emerald-200/60">Your Form 1040 has been submitted to the IRS.</p>
        </div>

        {/* Big result */}
        <div
          className={`rounded-2xl p-6 text-center mb-6 border backdrop-blur-sm ${
            isRefund
              ? "bg-emerald-900/30 border-emerald-500/40 shadow-[0_0_40px_-12px_rgba(34,197,94,0.5)]"
              : "bg-amber-900/30 border-amber-500/40 shadow-[0_0_40px_-12px_rgba(251,191,36,0.5)]"
          }`}
        >
          <div className={`text-5xl font-black mb-1 font-mono tabular-nums ${isRefund ? "text-emerald-400" : "text-amber-400"}`}>
            {isRefund ? `+$${finalRefund.toLocaleString()}` : `-$${finalOwed.toLocaleString()}`}
          </div>
          <div className="text-sm text-emerald-100/70">
            {isRefund
              ? "Refund — the IRS will send this to your bank!"
              : "Due by April 15th — don't be late or there are penalties!"}
          </div>
        </div>

        {/* Tax return breakdown */}
        <div className="bg-slate-950/70 border border-emerald-500/20 rounded-2xl p-5 mb-6 backdrop-blur-sm">
          <div className="font-bold text-amber-300/90 uppercase text-[11px] tracking-[0.18em] mb-4">
            Form 1040 Summary
          </div>
          <div className="space-y-2 text-sm">
            {[
              { label: "Gross Income (from W-2)", value: `$${income.toLocaleString()}`, color: "text-emerald-400" },
              { label: "Standard Deduction", value: `-$${standardDeduction.toLocaleString()}`, color: "text-emerald-200/70" },
              { label: "Itemized Deductions", value: deductions > 0 ? `-$${deductions.toLocaleString()}` : "$0", color: "text-emerald-200/70" },
              { label: "Taxable Income", value: `$${taxableIncome.toLocaleString()}`, color: "text-white" },
              { label: `Tax Rate (${bracket} bracket)`, value: `Effective ${effectiveRate}%`, color: "text-amber-400" },
              { label: "Total Tax Liability", value: `$${tax.toLocaleString()}`, color: "text-rose-400" },
              { label: "Federal Tax Withheld", value: `$${withheld.toLocaleString()}`, color: "text-emerald-200/70" },
              {
                label: isRefund ? "Refund" : "Amount Owed",
                value: isRefund ? `$${finalRefund.toLocaleString()}` : `$${finalOwed.toLocaleString()}`,
                color: isRefund ? "text-emerald-400 font-bold" : "text-amber-400 font-bold",
              },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex justify-between items-center py-1 border-b border-emerald-500/5 last:border-0">
                <span className="text-emerald-200/60">{label}</span>
                <span className={`font-mono tabular-nums ${color}`}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* What you learned */}
        {(deductiblePurchases.length > 0 || nonDeductiblePurchases.length > 0) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {deductiblePurchases.length > 0 && (
              <div className="bg-emerald-900/25 border border-emerald-500/30 rounded-xl p-4 backdrop-blur-sm">
                <div className="font-bold text-emerald-300 text-sm mb-2">✅ Smart Deductions</div>
                {deductiblePurchases.map((p) => (
                  <div key={p.id} className="text-xs text-emerald-100/80 mb-1">
                    • {p.name} <span className="text-emerald-300/70">(saved ~${Math.round(p.deductibleAmount * 0.12)})</span>
                  </div>
                ))}
              </div>
            )}
            {nonDeductiblePurchases.length > 0 && (
              <div className="bg-rose-900/20 border border-rose-500/30 rounded-xl p-4 backdrop-blur-sm">
                <div className="font-bold text-rose-300 text-sm mb-2">❌ Not Deductible</div>
                {nonDeductiblePurchases.map((p) => (
                  <div key={p.id} className="text-xs text-rose-100/80 mb-1">
                    • {p.name} <span className="text-rose-300/60">(no tax benefit)</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Key lesson */}
        <div className="bg-amber-500/10 border border-amber-400/30 rounded-xl p-4 mb-6 backdrop-blur-sm">
          <div className="font-bold text-amber-300 mb-2">💡 Key Tax Lesson</div>
          <p className="text-amber-100/80 text-sm leading-relaxed">
            Tax brackets are <strong>marginal</strong> — you only pay the higher rate on income{" "}
            <em>above</em> that bracket's threshold. Your income of ${income.toLocaleString()} put you in the{" "}
            <strong>{bracket} bracket</strong>, but your effective (average) rate was only{" "}
            <strong>{effectiveRate}%</strong> because lower income was taxed at lower rates.
          </p>
        </div>

        <div className="flex gap-4 justify-center items-stretch">
          <div className="bg-amber-400/15 border border-amber-400/40 rounded-xl px-6 py-3 text-center backdrop-blur-sm shadow-[0_0_24px_-8px_rgba(251,191,36,0.5)]">
            <div className="text-amber-400 font-black text-2xl font-mono tabular-nums">{score}</div>
            <div className="text-amber-200/80 text-xs uppercase tracking-wider">Final Score</div>
          </div>
          <button
            onClick={restart}
            className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 px-8 rounded-xl transition-all shadow-[0_0_24px_-6px_rgba(34,197,94,0.6)] hover:shadow-[0_0_32px_-6px_rgba(34,197,94,0.8)] hover:scale-[1.02] active:scale-[0.98]"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
}
