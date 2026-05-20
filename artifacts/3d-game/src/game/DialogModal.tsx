import { useGameStore } from "./gameStore";
import { PurchaseOption } from "./types";

export default function DialogModal() {
  const { dialog, closeDialog, earnIncome, makePurchase, visitBuilding, fileTaxes, purchases, income } = useGameStore();

  if (!dialog) return null;

  const alreadyBought = (id: string) => purchases.some((p) => p.id === id);

  const handleAction = () => {
    if (dialog.action === "earn") {
      earnIncome(48000, 6200);
      visitBuilding("workcorp");
      closeDialog();
    } else if (dialog.action === "file") {
      fileTaxes();
    } else if (dialog.action === "bank") {
      visitBuilding("firstbank");
      closeDialog();
    } else if (dialog.action === "study") {
      visitBuilding("university");
      closeDialog();
    } else if (dialog.action === "train") {
      visitBuilding("bottrain");
      closeDialog();
    } else if (dialog.action === "plane") {
      visitBuilding("botplane");
      closeDialog();
    } else if (dialog.action === "stadium") {
      visitBuilding("botstadium");
      closeDialog();
    } else if (dialog.action === "market") {
      visitBuilding("botmarket");
      closeDialog();
    } else if (dialog.action === "beach") {
      visitBuilding("botbeach");
      closeDialog();
    } else if (dialog.action === "shops") {
      visitBuilding("botshops");
      closeDialog();
    } else if (dialog.action === "farm") {
      visitBuilding("botfarm");
      closeDialog();
    } else if (dialog.action === "tower") {
      visitBuilding("moneybottowers");
      closeDialog();
    } else {
      closeDialog();
    }
  };

  const handlePurchase = (item: PurchaseOption) => {
    if (alreadyBought(item.id)) return;
    makePurchase(item);
    // Mark the active building visited on first purchase (works for TaxMart,
    // BotDealer, and any future option-based dialog).
    const bid = dialog.buildingId;
    if (bid && !useGameStore.getState().visitedBuildings.includes(bid)) {
      visitBuilding(bid);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-[fadeIn_0.15s_ease-out]">
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 text-white rounded-2xl shadow-2xl shadow-emerald-900/40 max-w-2xl w-full max-h-[85vh] overflow-hidden border border-emerald-500/20 flex flex-col">
        {/* Header band */}
        <div className="px-6 py-4 border-b border-emerald-500/15 bg-gradient-to-r from-emerald-900/30 via-slate-900 to-amber-900/20">
          <h2 className="text-xl font-bold text-white tracking-tight">{dialog.title}</h2>
        </div>

        <div className="p-6 overflow-y-auto">
          <p className="text-emerald-100/80 text-sm whitespace-pre-line leading-relaxed mb-4">
            {dialog.body}
          </p>

          {dialog.options && (
            <div className="space-y-2.5 mb-4">
              <div className="text-[11px] font-semibold text-amber-300/90 uppercase tracking-[0.18em]">
                Available Items — Click to purchase & learn
              </div>
              {dialog.options.map((item) => {
                const bought = alreadyBought(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => handlePurchase(item)}
                    disabled={bought}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                      bought
                        ? "border-emerald-500/30 bg-emerald-900/15 opacity-60 cursor-not-allowed"
                        : item.deductible
                        ? "border-emerald-500/30 bg-emerald-900/10 hover:bg-emerald-900/30 hover:border-emerald-400/50 hover:shadow-[0_0_20px_-8px_rgba(34,197,94,0.6)] cursor-pointer"
                        : "border-rose-500/30 bg-rose-900/10 hover:bg-rose-900/25 hover:border-rose-400/50 cursor-pointer"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="min-w-0">
                        <div className="font-semibold text-sm text-white">{item.name}</div>
                        <div className="text-xs mt-0.5 text-emerald-100/60 leading-relaxed">{item.reason}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className={`text-sm font-mono font-bold tabular-nums ${item.deductible ? "text-emerald-400" : "text-rose-400"}`}>
                          {item.deductible ? `Save ~$${Math.round(item.deductibleAmount * 0.12)}` : "No benefit"}
                        </div>
                        <div className="text-[11px] text-emerald-200/50 mt-0.5">
                          {item.deductible ? `Deductible: $${item.deductibleAmount}` : "Not deductible"}
                        </div>
                        {bought && <div className="text-[11px] text-emerald-400 font-bold mt-0.5">✓ Purchased</div>}
                      </div>
                    </div>
                    <div className={`mt-2 inline-block text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      item.deductible
                        ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                        : "bg-slate-700/60 text-emerald-200/70 border border-emerald-500/10"
                    }`}>
                      {item.category}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-emerald-500/15 bg-slate-950/60 flex gap-3 justify-end">
          <button
            onClick={closeDialog}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-emerald-500/10 text-sm font-semibold transition-colors"
          >
            Close
          </button>
          {dialog.action && (
            <button
              onClick={handleAction}
              disabled={dialog.action === "earn" && income > 0}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                dialog.action === "earn" && income > 0
                  ? "bg-slate-700 cursor-not-allowed opacity-60 text-emerald-200/60"
                  : dialog.action === "file"
                  ? "bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-[0_0_20px_-4px_rgba(251,191,36,0.6)] hover:shadow-[0_0_28px_-4px_rgba(251,191,36,0.8)]"
                  : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_20px_-4px_rgba(34,197,94,0.6)] hover:shadow-[0_0_28px_-4px_rgba(34,197,94,0.8)]"
              }`}
            >
              {dialog.action === "earn"
                ? income > 0
                  ? "Already Collected"
                  : "Collect $48,000 Paycheck"
                : dialog.action === "file"
                ? "File My Taxes!"
                : dialog.action === "study"
                ? "Lesson Complete 🎓"
                : dialog.action === "train"
                ? "All Aboard 🚆"
                : dialog.action === "plane"
                ? "Cleared for Takeoff ✈️"
                : dialog.action === "stadium"
                ? "Game Over 🏟️"
                : dialog.action === "market"
                ? "Cha-ching 🛍️"
                : dialog.action === "beach"
                ? "Back to Work 🏖️"
                : dialog.action === "shops"
                ? "Open for Business 🏪"
                : dialog.action === "farm"
                ? "Yeehaw 🚜"
                : dialog.action === "tower"
                ? "Back to HQ 🏢"
                : "Got it!"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
