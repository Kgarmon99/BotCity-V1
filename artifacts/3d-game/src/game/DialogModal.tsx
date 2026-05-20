import { useEffect, useRef } from "react";
import { useGameStore } from "./gameStore";
import { PurchaseOption, TaxDocument } from "./types";
import { sound } from "./sound";

// IRS form granted per building when the player completes its interaction.
// Documents accumulate in the player's "backpack" and preview the lines of
// Form 1040 they feed in the HUD.
const BUILDING_DOCS: Record<string, TaxDocument> = {
  workcorp: { id: "w2-workcorp", code: "W-2", label: "Wages from WorkCorp", icon: "💼", line: "1a" },
  taxmart: { id: "rcpt-taxmart", code: "Receipts", label: "Itemized deductions", icon: "🧾", line: "12" },
  firstbank: { id: "pub17", code: "Pub. 17", label: "How taxes work", icon: "📖", line: "—" },
  university: { id: "1098e", code: "1098-E", label: "Student loan interest", icon: "🎓", line: "21" },
  bottrain: { id: "commuter", code: "Commuter", label: "Transit benefit summary", icon: "🚆", line: "—" },
  botplane: { id: "trav-log", code: "Travel log", label: "Business trip ledger", icon: "✈️", line: "Sch C" },
  botstadium: { id: "w2g", code: "W-2G", label: "Gambling winnings", icon: "🎰", line: "8b" },
  botmarket: { id: "1099k", code: "1099-K", label: "Marketplace sales", icon: "🛍️", line: "Sch C" },
  botbeach: { id: "homeoffice", code: "8829", label: "Home office worksheet", icon: "🏖️", line: "Sch C" },
  botshops: { id: "schc", code: "Sch C", label: "Profit or loss from business", icon: "🏪", line: "3" },
  botfarm: { id: "schf", code: "Sch F", label: "Farm profit & loss", icon: "🚜", line: "6" },
  moneybottowers: { id: "k1", code: "K-1", label: "Pass-through income", icon: "🏢", line: "5" },
  botdealer: { id: "ev-cert", code: "8936", label: "Clean vehicle credit", icon: "🚗", line: "20" },
  bothospital: { id: "1099sa", code: "1099-SA", label: "HSA distributions", icon: "🏥", line: "Sch 1" },
  botretirement: { id: "5498", code: "5498", label: "IRA contributions", icon: "🏛️", line: "20" },
  botcrypto: { id: "1099b", code: "1099-B", label: "Crypto cap gains", icon: "₿", line: "Sch D" },
  botcharity: { id: "donation", code: "Donation", label: "Charity receipts", icon: "❤️", line: "11" },
  bothaus: { id: "1098", code: "1098", label: "Mortgage interest statement", icon: "🏠", line: "Sch A" },
  botbroker: { id: "1099div", code: "1099-DIV/B", label: "Dividends & cap gains", icon: "📈", line: "Sch D" },
  botkids: { id: "ctc", code: "CTC", label: "Child Tax Credit worksheet", icon: "🧒", line: "19" },
  botgigs: { id: "1099nec", code: "1099-NEC", label: "Self-employment income", icon: "🛵", line: "Sch C" },
  irs: { id: "1040", code: "1040", label: "Filed federal return", icon: "📋", line: "—" },
};

export default function DialogModal() {
  const {
    dialog,
    closeDialog,
    earnIncome,
    makePurchase,
    visitBuilding,
    fileTaxes,
    collectDocument,
    purchases,
    income,
  } = useGameStore();

  // Play an open chirp the first time a given dialog appears (not on rerender).
  const lastDialogId = useRef<string | null>(null);
  useEffect(() => {
    if (dialog && dialog.buildingId !== lastDialogId.current) {
      lastDialogId.current = dialog.buildingId;
      sound.open();
    } else if (!dialog) {
      lastDialogId.current = null;
    }
  }, [dialog]);

  if (!dialog) return null;

  const alreadyBought = (id: string) => purchases.some((p) => p.id === id);

  // Mark visited, grant the building's IRS document, and play a closing SFX.
  const completeBuilding = (id: string) => {
    visitBuilding(id);
    const doc = BUILDING_DOCS[id];
    if (doc) {
      collectDocument(doc);
      sound.doc();
    }
  };

  // Buildings whose only "action" is to read the lesson and leave — they all
  // do the same thing (mark visited + grant document + close). Centralizing
  // the mapping keeps the switch below from being 14 near-identical branches.
  const LESSON_ACTIONS: Record<string, string> = {
    bank: "firstbank",
    study: "university",
    train: "bottrain",
    plane: "botplane",
    stadium: "botstadium",
    market: "botmarket",
    beach: "botbeach",
    shops: "botshops",
    farm: "botfarm",
    tower: "moneybottowers",
    hospital: "bothospital",
    charity: "botcharity",
    crypto: "botcrypto",
    retirement: "botretirement",
    haus: "bothaus",
    broker: "botbroker",
    kids: "botkids",
    gigs: "botgigs",
  };

  const handleAction = () => {
    if (!dialog.action) {
      sound.close();
      closeDialog();
      return;
    }
    if (dialog.action === "earn") {
      earnIncome(48000, 6200);
      completeBuilding("workcorp");
      sound.coin();
      closeDialog();
      return;
    }
    if (dialog.action === "file") {
      // Player files — grant the 1040 document and a triumphant fanfare.
      const doc = BUILDING_DOCS.irs;
      if (doc) collectDocument(doc);
      sound.fanfare();
      fileTaxes();
      return;
    }
    const buildingId = LESSON_ACTIONS[dialog.action];
    if (buildingId) {
      completeBuilding(buildingId);
      closeDialog();
      return;
    }
    sound.close();
    closeDialog();
  };

  const handleClose = () => {
    sound.close();
    closeDialog();
  };

  const handlePurchase = (item: PurchaseOption) => {
    if (alreadyBought(item.id)) return;
    makePurchase(item);
    if (item.deductible) sound.coin();
    else sound.bad();
    // Mark the active building visited on first purchase (works for TaxMart,
    // BotDealer, and any future option-based dialog).
    const bid = dialog.buildingId;
    if (bid && !useGameStore.getState().visitedBuildings.includes(bid)) {
      completeBuilding(bid);
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
            onClick={handleClose}
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
              {actionButtonLabel(dialog.action, income)}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Friendly per-action button labels. Kept as a lookup to avoid a long chain
// of ternaries in the JSX.
const ACTION_LABELS: Record<string, string> = {
  bank: "Got it 📖",
  study: "Lesson Complete 🎓",
  train: "All Aboard 🚆",
  plane: "Cleared for Takeoff ✈️",
  stadium: "Game Over 🏟️",
  market: "Cha-ching 🛍️",
  beach: "Back to Work 🏖️",
  shops: "Open for Business 🏪",
  farm: "Yeehaw 🚜",
  tower: "Back to HQ 🏢",
  hospital: "Feel Better 🏥",
  charity: "Thank You ❤️",
  crypto: "HODL ₿",
  retirement: "Save & Grow 🏛️",
  haus: "Home Sweet Home 🏠",
  broker: "Bull Run 📈",
  kids: "Claim the Credit 🧒",
  gigs: "Quarterly Payment 🛵",
};

function actionButtonLabel(action: string, income: number): string {
  if (action === "earn") {
    return income > 0 ? "Already Collected" : "Collect $48,000 Paycheck";
  }
  if (action === "file") return "File My Taxes!";
  return ACTION_LABELS[action] ?? "Got it!";
}
