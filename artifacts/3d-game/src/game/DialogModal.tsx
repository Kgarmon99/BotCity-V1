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
    } else {
      closeDialog();
    }
  };

  const handlePurchase = (item: PurchaseOption) => {
    if (alreadyBought(item.id)) return;
    makePurchase(item);
    if (!useGameStore.getState().visitedBuildings.includes("taxmart")) {
      visitBuilding("taxmart");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-gray-900 text-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto border border-white/10">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-3">{dialog.title}</h2>
          <p className="text-gray-300 text-sm whitespace-pre-line leading-relaxed mb-4">{dialog.body}</p>

          {dialog.options && (
            <div className="space-y-3 mb-4">
              <div className="text-sm font-semibold text-yellow-400 uppercase tracking-wider">
                Available Items — Click to purchase & learn
              </div>
              {dialog.options.map((item) => {
                const bought = alreadyBought(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => handlePurchase(item)}
                    disabled={bought}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      bought
                        ? "border-green-500/40 bg-green-900/20 opacity-60 cursor-not-allowed"
                        : item.deductible
                        ? "border-blue-500/40 bg-blue-900/20 hover:bg-blue-900/40 cursor-pointer"
                        : "border-red-500/40 bg-red-900/20 hover:bg-red-900/40 cursor-pointer"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-semibold text-sm">{item.name}</span>
                        <div className="text-xs mt-0.5 text-gray-400">{item.reason}</div>
                      </div>
                      <div className="text-right ml-3 shrink-0">
                        <div className={`text-sm font-mono font-bold ${item.deductible ? "text-green-400" : "text-red-400"}`}>
                          {item.deductible ? `Save: $${Math.round(item.deductibleAmount * 0.12)}` : "No tax benefit"}
                        </div>
                        <div className="text-xs text-gray-400">
                          {item.deductible ? `Deductible: $${item.deductibleAmount}` : "Not deductible"}
                        </div>
                        {bought && <div className="text-xs text-green-400 font-bold mt-0.5">✓ Purchased</div>}
                      </div>
                    </div>
                    <div className={`mt-1 inline-block text-xs px-2 py-0.5 rounded-full ${
                      item.deductible ? "bg-blue-800 text-blue-200" : "bg-gray-700 text-gray-300"
                    }`}>
                      {item.category}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex gap-3 justify-end mt-4">
            <button
              onClick={closeDialog}
              className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm font-semibold transition-colors"
            >
              Close
            </button>
            {dialog.action && (
              <button
                onClick={handleAction}
                disabled={dialog.action === "earn" && income > 0}
                className={`px-5 py-2 rounded-lg text-sm font-bold transition-colors ${
                  dialog.action === "earn" && income > 0
                    ? "bg-gray-600 cursor-not-allowed opacity-60"
                    : dialog.action === "file"
                    ? "bg-blue-600 hover:bg-blue-500"
                    : "bg-green-600 hover:bg-green-500"
                }`}
              >
                {dialog.action === "earn"
                  ? income > 0
                    ? "Already Collected"
                    : "Collect $48,000 Paycheck"
                  : dialog.action === "file"
                  ? "File My Taxes!"
                  : "Got it!"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
