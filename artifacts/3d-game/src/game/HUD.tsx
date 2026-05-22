import { useGameStore } from "./gameStore";
import { calculateTax } from "./types";
import { sound } from "./sound";
import { useEffect, useState } from "react";
import TouchControls from "./TouchControls";
import MiniMap from "./MiniMap";

// Objectives checklist — every kiosk in the city, grouped by theme.
// Sections render as small headers in the HUD so the 49-item list
// is scannable. Adding a new kiosk? Drop it into the matching section
// (or add a new section). IDs must match BUILDING_DEFS in GameScene.
function CityEditorControls() {
  const editMode = useGameStore((s) => s.editMode);
  const toggleEditMode = useGameStore((s) => s.toggleEditMode);
  const resetCityLayout = useGameStore((s) => s.resetCityLayout);
  const cityLayout = useGameStore((s) => s.cityLayout);
  const selectedBuildingId = useGameStore((s) => s.selectedBuildingId);
  const cancelPickup = useGameStore((s) => s.cancelPickup);
  const overrideCount = Object.keys(cityLayout).length;
  return (
    <>
      <button
        type="button"
        onClick={toggleEditMode}
        className={`pointer-events-auto text-xs rounded-xl px-3 py-2 border backdrop-blur-md transition-colors ${
          editMode
            ? "bg-cyan-500/90 text-slate-950 border-cyan-200 shadow-[0_0_24px_-6px_rgba(34,211,238,0.9)] hover:bg-cyan-400"
            : "bg-slate-950/80 text-white border-cyan-500/30 shadow-[0_0_24px_-12px_rgba(34,211,238,0.5)] hover:bg-slate-900/90"
        }`}
        title="Toggle Build Mode (B). Click a building to pick it up, click again to drop."
      >
        {editMode ? "🏗️ Building… (B)" : "🏗️ Build Mode (B)"}
      </button>
      {editMode && overrideCount > 0 && (
        <button
          type="button"
          onClick={() => {
            if (window.confirm("Reset the entire city layout to its original design?")) {
              resetCityLayout();
            }
          }}
          className="pointer-events-auto bg-slate-950/80 text-rose-200 text-xs rounded-xl px-3 py-2 border border-rose-500/40 backdrop-blur-md hover:bg-rose-950/60 transition-colors"
          title="Restore every building to its starting position"
        >
          ♻️ Reset Layout ({overrideCount})
        </button>
      )}
      {editMode && selectedBuildingId && (
        <button
          type="button"
          onClick={cancelPickup}
          className="pointer-events-auto bg-slate-950/80 text-amber-200 text-xs rounded-xl px-3 py-2 border border-amber-500/40 backdrop-blur-md hover:bg-amber-950/60 transition-colors"
          title="Put the building back where it was (Esc)"
        >
          ✖ Cancel pickup (Esc)
        </button>
      )}
    </>
  );
}

function CityEditorBanner() {
  const editMode = useGameStore((s) => s.editMode);
  const selectedBuildingId = useGameStore((s) => s.selectedBuildingId);
  if (!editMode) return null;
  return (
    <div className="pointer-events-none fixed top-20 left-1/2 -translate-x-1/2 z-20">
      <div className="bg-cyan-500/95 text-slate-950 rounded-full px-5 py-2 text-sm font-semibold border border-cyan-200 shadow-[0_0_30px_-6px_rgba(34,211,238,0.9)] backdrop-blur">
        {selectedBuildingId
          ? `🏗️ Carrying ${selectedBuildingId} — click to drop · WASD/drag pan · Scroll zoom · Esc cancel`
          : "🏗️ Build Mode — WASD or right-drag pan · Scroll zoom · Click a building to pick it up · B/Esc to exit"}
      </div>
    </div>
  );
}

type BuildingItem = { id: string; emoji: string; label: string };
type BuildingSection = { title: string; emoji: string; items: BuildingItem[] };
const BUILDING_SECTIONS: BuildingSection[] = [
  {
    title: "Civic & Justice",
    emoji: "🏛️",
    items: [
      { id: "botcityhall", emoji: "🏛️", label: "BotCityHall" },
      { id: "irs", emoji: "📋", label: "IRS Office" },
      { id: "botpolice", emoji: "🚓", label: "BotPolice Precinct" },
      { id: "botfire", emoji: "🚒", label: "BotFire Station" },
      { id: "botcourt", emoji: "⚖️", label: "BotCourt (Tax Court)" },
    ],
  },
  {
    title: "Work & Business",
    emoji: "💼",
    items: [
      { id: "workcorp", emoji: "💼", label: "WorkCorp" },
      { id: "moneybottowers", emoji: "🏢", label: "MoneyBot Towers" },
      { id: "botgigs", emoji: "🛵", label: "BotGigs" },
      { id: "botfactory", emoji: "🏭", label: "BotFactory" },
    ],
  },
  {
    title: "Finance",
    emoji: "💰",
    items: [
      { id: "firstbank", emoji: "🏦", label: "First Bank" },
      { id: "botbroker", emoji: "📈", label: "BotBroker" },
      { id: "botcrypto", emoji: "₿", label: "BotCrypto" },
    ],
  },
  {
    title: "Health & Insurance",
    emoji: "🏥",
    items: [
      { id: "bothospital", emoji: "🏥", label: "BotHospital" },
      { id: "botinsurance", emoji: "🛡️", label: "BotInsurance HQ" },
    ],
  },
  {
    title: "Family & Home",
    emoji: "👨‍👩‍👧",
    items: [
      { id: "botkids", emoji: "🧒", label: "BotKids" },
      { id: "littlebots", emoji: "🧸", label: "LittleBots DayCare" },
      { id: "botcharity", emoji: "❤️", label: "BotCharity" },
      { id: "botretirement", emoji: "🏛️", label: "BotRetirement" },
      { id: "bothaus", emoji: "🏠", label: "BotHaus" },
    ],
  },
  {
    title: "Retail & Services",
    emoji: "🛒",
    items: [
      { id: "taxmart", emoji: "🛒", label: "TaxMart" },
      { id: "botmarket", emoji: "🛍️", label: "BotMarket" },
      { id: "botshops", emoji: "🏪", label: "BotShops" },
      { id: "botdealer", emoji: "🚗", label: "BotDealer" },
    ],
  },
  {
    title: "Schools & Universities",
    emoji: "🎓",
    items: [
      { id: "botelementary", emoji: "🏫", label: "BotElementary" },
      { id: "botmiddle", emoji: "🏫", label: "BotMiddle School" },
      { id: "bothigh", emoji: "🏫", label: "BotHigh School" },
      { id: "botunorth", emoji: "🎓", label: "BotU North Campus" },
      { id: "botusouth", emoji: "🎓", label: "BotU South Campus" },
    ],
  },
  {
    title: "Museums & Galleries",
    emoji: "🖼️",
    items: [
      { id: "bothistory", emoji: "🤖", label: "Bot History Museum" },
      { id: "eduhistory", emoji: "📚", label: "Education History Museum" },
      { id: "finhistory", emoji: "💰", label: "Finance History Museum" },
      { id: "botgallery", emoji: "🎨", label: "BotGallery" },
    ],
  },
  {
    title: "Entertainment",
    emoji: "🎭",
    items: [
      { id: "botfashion", emoji: "👗", label: "BotFashion District" },
      { id: "moneybotgaminghq", emoji: "🎮", label: "MoneyBot Gaming HQ" },
      { id: "botcasino", emoji: "🎰", label: "BotCasino" },
    ],
  },
  {
    title: "Media",
    emoji: "📡",
    items: [
      { id: "moneybotnews", emoji: "📰", label: "MoneyBot News" },
      { id: "moneybotradio", emoji: "📻", label: "MoneyBot Radio" },
      { id: "moneybotcomic", emoji: "💥", label: "MoneyBot ComicShop" },
    ],
  },
  {
    title: "Defense",
    emoji: "🪖",
    items: [
      { id: "militarybase", emoji: "🪖", label: "Anti-Broke Military Base" },
    ],
  },
  {
    title: "Sports",
    emoji: "⚽",
    items: [
      { id: "botstadium", emoji: "🏟️", label: "BotStadium" },
      { id: "botsoccer", emoji: "⚽", label: "BotSoccer Stadium" },
      { id: "botbasketball", emoji: "🏀", label: "BotHoops Arena" },
      { id: "botgolf", emoji: "⛳", label: "BotGolf Course" },
    ],
  },
  {
    title: "Transit",
    emoji: "🚆",
    items: [
      { id: "bottrain", emoji: "🚆", label: "BotTrain" },
      { id: "botplane", emoji: "✈️", label: "BotPlane International" },
      { id: "botrocket", emoji: "🚀", label: "BotRocket Station" },
    ],
  },
  {
    title: "Nature & Leisure",
    emoji: "🌳",
    items: [
      { id: "botbeach", emoji: "🏖️", label: "BotBeach" },
      { id: "botfarm", emoji: "🚜", label: "BotFarm" },
      { id: "botzoo", emoji: "🦒", label: "BotZoo" },
      { id: "botpark", emoji: "🏔️", label: "BotNational Park" },
    ],
  },
  {
    title: "Industry & Specialty",
    emoji: "⚓",
    items: [
      { id: "botport", emoji: "⚓", label: "BotPort Harbor" },
      { id: "botmine", emoji: "⛏️", label: "BotMine" },
      { id: "botenergy", emoji: "⚡", label: "BotEnergy" },
    ],
  },
  // ── New outer-ring quarters (reserved for Task #2 content packs) ──
  // These render with an empty item list until kiosks are added. The
  // section header shows a "coming soon" hint instead of a 0/0 count.
  {
    title: "Foundations",
    emoji: "🧠",
    items: [
      { id: "botmint",         emoji: "💵", label: "BotMint" },
      { id: "botbudget",       emoji: "📒", label: "BotBudget Cafe" },
      { id: "botsavings",      emoji: "🐷", label: "BotSavings Plaza" },
      { id: "botcreditbureau", emoji: "📇", label: "BotCredit Bureau" },
      { id: "botbehavioral",   emoji: "🧠", label: "BotBehavioral Lab" },
    ],
  },
  {
    title: "Borrowing & Credit",
    emoji: "💳",
    items: [
      { id: "botmortgage",   emoji: "🏘️", label: "BotMortgage Bank" },
      { id: "botstudentaid", emoji: "🎓", label: "BotStudentAid" },
      { id: "botautoloans",  emoji: "🚙", label: "BotAuto Loans" },
      { id: "botpayday",     emoji: "⏱️", label: "BotPayday & Pawn" },
      { id: "botbankruptcy", emoji: "⚖️", label: "BotBankruptcy Court" },
    ],
  },
  {
    title: "Investing",
    emoji: "📈",
    items: [
      { id: "botindex",       emoji: "📊", label: "BotIndex Funds" },
      { id: "botreit",        emoji: "🏢", label: "BotREIT Tower" },
      { id: "botcommodities", emoji: "🌾", label: "BotCommodities Pit" },
      { id: "botventure",     emoji: "🚀", label: "BotVenture Capital" },
      { id: "botbonds",       emoji: "🧾", label: "BotBonds Desk" },
    ],
  },
  {
    title: "Life Events",
    emoji: "💍",
    items: [
      { id: "botchapel",     emoji: "💒", label: "BotChapel" },
      { id: "botmaternity",  emoji: "👶", label: "BotMaternity Ward" },
      { id: "botestate",     emoji: "⚰️", label: "BotEstate Office" },
      { id: "bothealthplan", emoji: "🩺", label: "BotHealthPlan Clinic" },
      { id: "botdivorce",    emoji: "💔", label: "BotDivorce Mediation" },
    ],
  },
  {
    title: "Consumer & Behavioral",
    emoji: "🛒",
    items: [
      { id: "botconsumer", emoji: "🛡️", label: "BotConsumer Protection" },
      { id: "botads",      emoji: "📺", label: "BotAds & Marketing" },
      { id: "botthrift",   emoji: "♻️", label: "BotThrift & Resale" },
      { id: "botgiving",   emoji: "🎁", label: "BotGiving Foundation" },
      { id: "botfintech",  emoji: "📱", label: "BotFinTech Hub" },
    ],
  },
  {
    title: "Macro & Money",
    emoji: "🌐",
    items: [
      { id: "botecon",      emoji: "🧪", label: "BotEcon Lab" },
      { id: "botforex",     emoji: "💱", label: "BotForex Exchange" },
      { id: "bottrade",     emoji: "🌐", label: "BotTrade Hall" },
      { id: "botinflation", emoji: "🎈", label: "BotInflation Park" },
      { id: "botpolicy",    emoji: "🏛️", label: "BotPolicyHall" },
    ],
  },
];

const BUILDINGS: BuildingItem[] = BUILDING_SECTIONS.flatMap((s) => s.items);

interface RowProps {
  label: string;
  value: string;
  tone?: "neutral" | "good" | "warn" | "bad" | "muted";
  bold?: boolean;
}

function Row({ label, value, tone = "neutral", bold = false }: RowProps) {
  const toneClass = {
    neutral: "text-emerald-100",
    good: "text-emerald-400",
    warn: "text-amber-400",
    bad: "text-rose-400",
    muted: "text-emerald-200/60",
  }[tone];
  return (
    <div className="flex justify-between gap-6">
      <span className="text-emerald-200/60">{label}</span>
      <span className={`font-mono tabular-nums ${toneClass} ${bold ? "font-bold" : ""}`}>{value}</span>
    </div>
  );
}

function PanelHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-bold text-amber-300/90 uppercase tracking-[0.18em] mb-3">
      {children}
    </div>
  );
}

export default function HUD() {
  const { income, deductions, withheld, visitedBuildings, score, documents } = useGameStore();
  const { tax, bracket } = calculateTax(income, deductions);
  const standardDeduction = 14600;
  const totalDed = standardDeduction + deductions;
  const taxableIncome = Math.max(0, income - totalDed);
  const estimatedRefund = withheld - tax;

  const completed = BUILDINGS.filter((b) => visitedBuildings.includes(b.id)).length;
  const progressPct = (completed / BUILDINGS.length) * 100;

  // Lets the player hide all three top panels (Tax Summary, Objectives,
  // Form 1040) to reclaim the screen. Persisted across reloads so the
  // preference sticks. `H` toggles too.
  const [panelsHidden, setPanelsHidden] = useState<boolean>(() => {
    try {
      return localStorage.getItem("botcity:panelsHidden") === "1";
    } catch {
      return false;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem("botcity:panelsHidden", panelsHidden ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, [panelsHidden]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.key === "h" || e.key === "H") setPanelsHidden((v) => !v);
      // City editor: B toggles, Escape cancels pickup (or exits if nothing held).
      if (e.key === "b" || e.key === "B") {
        useGameStore.getState().toggleEditMode();
      }
      if (e.key === "Escape") {
        const s = useGameStore.getState();
        if (s.editMode) {
          if (s.selectedBuildingId) s.cancelPickup();
          else s.setEditMode(false);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 pointer-events-none z-10 p-4">
      <CityEditorBanner />
      {/* Hide/Show panels toggle — always visible so the player can bring
          the HUD back. Sits top-left so it's adjacent to where the panels
          appear (and pairs with the SoundToggle on top-right). */}
      <div className="flex gap-2 mb-3 flex-wrap">
        <button
          type="button"
          onClick={() => setPanelsHidden((v) => !v)}
          className="pointer-events-auto bg-slate-950/80 text-white text-xs rounded-xl px-3 py-2 border border-emerald-500/20 backdrop-blur-md shadow-[0_0_24px_-12px_rgba(34,197,94,0.5)] hover:bg-slate-900/90 transition-colors"
          title={panelsHidden ? "Show HUD panels (H)" : "Hide HUD panels (H)"}
        >
          {panelsHidden ? "👁️ Show HUD" : "🙈 Hide HUD"}
        </button>
        <CityEditorControls />
      </div>
      <div className={`flex gap-3 flex-wrap transition-opacity ${panelsHidden ? "hidden" : ""}`}>
        {/* Finance Panel */}
        <div className="bg-slate-950/85 text-white rounded-2xl p-4 min-w-[230px] border border-emerald-500/20 backdrop-blur-md shadow-[0_0_30px_-10px_rgba(34,197,94,0.4)]">
          <PanelHeader>Tax Return Summary</PanelHeader>
          <div className="space-y-1.5 text-sm">
            <Row label="Gross Income" value={`$${income.toLocaleString()}`} tone="good" />
            <Row label="Total Deductions" value={`-$${totalDed.toLocaleString()}`} tone="muted" />
            <div className="border-t border-emerald-500/10 pt-1.5">
              <Row label="Taxable Income" value={`$${taxableIncome.toLocaleString()}`} />
            </div>
            <Row label="Tax Bracket" value={bracket} tone="warn" />
            <Row label="Tax Owed" value={`$${tax.toLocaleString()}`} tone="bad" />
            <Row label="Withheld" value={`$${withheld.toLocaleString()}`} tone="muted" />
            <div className="border-t border-emerald-500/10 pt-1.5">
              <Row
                label={estimatedRefund >= 0 ? "Est. Refund" : "Amount Owed"}
                value={`$${Math.abs(estimatedRefund).toLocaleString()}`}
                tone={estimatedRefund >= 0 ? "good" : "bad"}
                bold
              />
            </div>
          </div>
        </div>

        {/* Progress Panel */}
        <div className="bg-slate-950/85 text-white rounded-2xl p-4 min-w-[230px] border border-emerald-500/20 backdrop-blur-md shadow-[0_0_30px_-10px_rgba(34,197,94,0.4)]">
          <div className="flex items-baseline justify-between mb-3">
            <PanelHeader>Objectives</PanelHeader>
            <div className="text-[11px] font-mono text-emerald-300/80">
              {completed}/{BUILDINGS.length}
            </div>
          </div>
          {/* Progress bar */}
          <div className="h-1.5 w-full rounded-full bg-emerald-900/40 overflow-hidden mb-3">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 transition-all duration-500 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="space-y-3 text-sm max-h-[55vh] overflow-y-auto pr-1">
            {BUILDING_SECTIONS.map((section, idx) => {
              const sectionCompleted = section.items.filter((b) =>
                visitedBuildings.includes(b.id),
              ).length;
              const sectionTotal = section.items.length;
              const sectionEmpty = sectionTotal === 0;
              const sectionDone = !sectionEmpty && sectionCompleted === sectionTotal;
              const dividerCls = idx > 0 ? "pt-2 border-t border-emerald-500/15" : "";
              return (
                <div key={section.title} className={`space-y-1.5 ${dividerCls}`}>
                  {/* Section header */}
                  <div className="flex items-baseline justify-between gap-2">
                    <div
                      className={`text-[10px] uppercase tracking-[0.16em] font-semibold ${
                        sectionEmpty
                          ? "text-emerald-300/40"
                          : sectionDone
                          ? "text-amber-300/70"
                          : "text-emerald-300/70"
                      }`}
                    >
                      <span className="mr-1">{section.emoji}</span>
                      {section.title}
                    </div>
                    <div className="text-[10px] font-mono text-emerald-300/50 tabular-nums">
                      {sectionEmpty ? "soon" : `${sectionCompleted}/${sectionTotal}`}
                    </div>
                  </div>
                  {/* Empty-section placeholder */}
                  {sectionEmpty && (
                    <div className="text-[10px] italic text-emerald-200/40 pl-1">
                      Kiosks coming soon…
                    </div>
                  )}
                  {/* Section items */}
                  <div className="space-y-1.5">
                    {section.items.map(({ id, emoji, label }) => {
                      const done = visitedBuildings.includes(id);
                      return (
                        <div key={id} className="flex items-center gap-2.5">
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors flex-shrink-0 ${
                              done
                                ? "bg-emerald-500 text-slate-950 shadow-[0_0_8px_rgba(34,197,94,0.6)]"
                                : "bg-emerald-950/60 border border-emerald-500/30 text-emerald-300/40"
                            }`}
                          >
                            {done ? "✓" : "○"}
                          </span>
                          <span className={done ? "line-through text-emerald-200/40" : "text-emerald-100"}>
                            <span className="mr-1">{emoji}</span>
                            {label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 pt-2 border-t border-emerald-500/10 flex justify-between items-baseline">
            <span className="text-[11px] text-emerald-200/60 uppercase tracking-wider">Score</span>
            <span className="text-amber-300 font-bold font-mono tabular-nums">{score}</span>
          </div>
        </div>

        {/* Documents / 1040 Backpack Panel */}
        <DocumentsPanel docs={documents} income={income} deductions={deductions} withheld={withheld} tax={tax} />
      </div>

      <SoundToggle />
      <WeatherToggle />
      <MiniMap />
      <TouchControls />

      {/* Controls */}
      <div className="fixed bottom-4 left-4 bg-slate-950/80 text-white text-xs rounded-xl px-3.5 py-3 border border-emerald-500/20 backdrop-blur-md shadow-[0_0_24px_-12px_rgba(34,197,94,0.5)]">
        <div className="font-bold text-amber-300/90 mb-1.5 uppercase tracking-[0.18em] text-[10px]">Controls</div>
        <div className="flex items-center gap-2 text-emerald-100">
          <kbd className="px-1.5 py-0.5 rounded bg-emerald-900/50 border border-emerald-500/30 font-mono text-[10px]">WASD</kbd>
          <span className="text-emerald-200/60">Move</span>
        </div>
        <div className="flex items-center gap-2 text-emerald-100 mt-1">
          <kbd className="px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-400/40 font-mono text-[10px] text-amber-300">E</kbd>
          <span className="text-emerald-200/60">Enter building</span>
        </div>
        <div className="flex items-center gap-2 text-emerald-100 mt-1">
          <kbd className="px-1.5 py-0.5 rounded bg-cyan-500/20 border border-cyan-400/40 font-mono text-[10px] text-cyan-300">C</kbd>
          <span className="text-emerald-200/60">Camera view</span>
        </div>
        <div className="flex items-center gap-2 text-emerald-100 mt-1">
          <kbd className="px-1.5 py-0.5 rounded bg-rose-500/20 border border-rose-400/40 font-mono text-[10px] text-rose-300">SPACE</kbd>
          <span className="text-emerald-200/60">Ride BotMobile 🚗</span>
        </div>
        <OrbitHint />
      </div>
      <CameraModeIndicator />
    </div>
  );
}

// ── Documents / Form 1040 backpack ─────────────────────────────────────────
// Shows the player which IRS forms they've collected and previews how the
// 1040 lines fill in. Educational, not a real calculator — the live numbers
// pull from the existing tax math so it stays consistent with the summary.
interface DocsPanelProps {
  docs: { id: string; code: string; label: string; icon: string; line: string }[];
  income: number;
  deductions: number;
  withheld: number;
  tax: number;
}

function DocumentsPanel({ docs, income, deductions, withheld, tax }: DocsPanelProps) {
  // Mirror `calculateTax` in types.ts — extra deductions stack ON TOP of the
  // standard deduction. Keeping the math in sync prevents the Form 1040
  // preview from disagreeing with the live tax summary above.
  const standardDeduction = 14600;
  const totalDeduction = standardDeduction + deductions;
  const taxable = Math.max(0, income - totalDeduction);
  const net = withheld - tax;
  return (
    <div className="bg-slate-950/85 text-white rounded-2xl p-4 min-w-[230px] max-w-[260px] border border-amber-500/20 backdrop-blur-md shadow-[0_0_30px_-10px_rgba(251,191,36,0.4)]">
      <PanelHeader>📋 Form 1040 — Live Preview</PanelHeader>
      <div className="space-y-1 text-[12px]">
        <FormLine line="1a" label="Wages (W-2)" value={income} />
        <FormLine line="11" label="AGI" value={income} />
        <FormLine line="12" label="Std. ded." value={-standardDeduction} />
        {deductions > 0 && <FormLine line="12b" label="Other ded." value={-deductions} />}
        <div className="border-t border-amber-500/15 pt-1">
          <FormLine line="15" label="Taxable income" value={taxable} bold />
        </div>
        <FormLine line="16" label="Tax" value={-tax} />
        <FormLine line="25a" label="Withheld" value={withheld} />
        <div className="border-t border-amber-500/15 pt-1">
          <FormLine
            line={net >= 0 ? "34" : "37"}
            label={net >= 0 ? "Refund" : "Owe"}
            value={Math.abs(net)}
            bold
            highlight={net >= 0 ? "good" : "bad"}
          />
        </div>
      </div>
      <div className="mt-3 pt-2 border-t border-amber-500/15">
        <div className="text-[10px] uppercase tracking-[0.18em] text-amber-300/80 font-bold mb-1.5">
          Backpack ({docs.length})
        </div>
        {docs.length === 0 ? (
          <div className="text-[11px] text-emerald-200/40 italic">
            Visit buildings to collect IRS documents…
          </div>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {docs.map((d) => (
              <div
                key={d.id}
                title={`${d.code} — ${d.label} (Line ${d.line})`}
                className="px-2 py-1 rounded-md bg-amber-900/20 border border-amber-500/30 text-[10px] font-mono text-amber-200 flex items-center gap-1"
              >
                <span>{d.icon}</span>
                <span>{d.code}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FormLine({
  line,
  label,
  value,
  bold = false,
  highlight,
}: {
  line: string;
  label: string;
  value: number;
  bold?: boolean;
  highlight?: "good" | "bad";
}) {
  const tone =
    highlight === "good"
      ? "text-emerald-400"
      : highlight === "bad"
      ? "text-rose-400"
      : value < 0
      ? "text-emerald-200/60"
      : "text-emerald-100";
  const sign = value < 0 ? "-" : "";
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="text-emerald-200/45 font-mono text-[10px] w-7 shrink-0">{line}</span>
      <span className="text-emerald-200/70 flex-1 truncate">{label}</span>
      <span className={`font-mono tabular-nums ${tone} ${bold ? "font-bold" : ""}`}>
        {sign}${Math.abs(value).toLocaleString()}
      </span>
    </div>
  );
}

// Cycles the city weather: clear ☀️ → rain 🌧 → snow ❄️ → fog 🌫
function WeatherToggle() {
  const weather = useGameStore((s) => s.weather);
  const cycleWeather = useGameStore((s) => s.cycleWeather);
  const icon =
    weather === "rain" ? "🌧️" : weather === "snow" ? "❄️" : weather === "fog" ? "🌫️" : "☀️";
  const label =
    weather === "rain"
      ? "Rain"
      : weather === "snow"
      ? "Snow"
      : weather === "fog"
      ? "Fog"
      : "Clear";
  return (
    <button
      type="button"
      onClick={cycleWeather}
      className="fixed top-16 right-4 z-20 pointer-events-auto bg-slate-950/80 text-white text-xs rounded-xl px-3 py-2 border border-emerald-500/20 backdrop-blur-md shadow-[0_0_24px_-12px_rgba(34,197,94,0.5)] hover:bg-slate-900/90 transition-colors flex items-center gap-1.5"
      title={`Weather: ${label} — click to cycle`}
    >
      <span>{icon}</span>
      <span className="text-emerald-200/70 hidden sm:inline">{label}</span>
    </button>
  );
}

function SoundToggle() {
  const [muted, setMuted] = useState<boolean>(() => sound.isMuted());
  useEffect(() => {
    sound.setMuted(muted);
  }, [muted]);
  return (
    <button
      type="button"
      onClick={() => setMuted((m) => !m)}
      className="fixed top-4 right-4 z-20 pointer-events-auto bg-slate-950/80 text-white text-xs rounded-xl px-3 py-2 border border-emerald-500/20 backdrop-blur-md shadow-[0_0_24px_-12px_rgba(34,197,94,0.5)] hover:bg-slate-900/90 transition-colors"
      title={muted ? "Unmute sound" : "Mute sound"}
    >
      {muted ? "🔇" : "🔊"}
    </button>
  );
}

const CAMERA_MODES = [
  { label: "Chase",     icon: "🎯" },
  { label: "Cinematic", icon: "🎬" },
  { label: "Aerial",    icon: "🛰️" },
  { label: "Side-Iso",  icon: "📐" },
  { label: "Orbit",     icon: "🔄" },
] as const;

// Only shown while Orbit camera mode is active.
function OrbitHint() {
  const cameraMode = useGameStore((s) => s.cameraMode);
  if (cameraMode !== 4) return null;
  return (
    <>
      <div className="flex items-center gap-2 text-emerald-100 mt-1">
        <kbd className="px-1.5 py-0.5 rounded bg-purple-500/20 border border-purple-400/40 font-mono text-[10px] text-purple-200">DRAG</kbd>
        <span className="text-emerald-200/60">Look around 360°</span>
      </div>
      <div className="flex items-center gap-2 text-emerald-100 mt-1">
        <kbd className="px-1.5 py-0.5 rounded bg-purple-500/20 border border-purple-400/40 font-mono text-[10px] text-purple-200">SCROLL</kbd>
        <span className="text-emerald-200/60">Zoom in / out</span>
      </div>
    </>
  );
}

function CameraModeIndicator() {
  const cameraMode = useGameStore((s) => s.cameraMode);
  const setCameraMode = useGameStore((s) => s.setCameraMode);
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-slate-950/80 text-white text-xs rounded-xl px-3 py-2 border border-cyan-500/25 backdrop-blur-md shadow-[0_0_24px_-12px_rgba(34,211,238,0.5)] flex items-center gap-2">
      <span className="font-bold text-cyan-300/90 uppercase tracking-[0.18em] text-[10px] mr-1">View</span>
      {CAMERA_MODES.map((m, i) => {
        const active = cameraMode === i;
        return (
          <button
            key={m.label}
            type="button"
            onClick={() => setCameraMode(i as 0 | 1 | 2 | 3 | 4)}
            className={
              "px-2 py-1 rounded font-mono text-[10px] border transition-colors " +
              (active
                ? "bg-cyan-500/30 border-cyan-400/60 text-cyan-100 shadow-[0_0_12px_-2px_rgba(34,211,238,0.7)]"
                : "bg-slate-900/60 border-slate-700/60 text-emerald-200/70 hover:bg-slate-800/80 hover:text-cyan-200")
            }
          >
            <span className="mr-1">{m.icon}</span>
            {m.label}
            <span className={"ml-1.5 opacity-60 " + (active ? "text-cyan-200" : "")}>
              {i + 1}
            </span>
          </button>
        );
      })}
    </div>
  );
}
