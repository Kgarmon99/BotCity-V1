export type Screen = "title" | "game" | "results";

export interface PurchaseOption {
  id: string;
  name: string;
  cost: number;
  deductible: boolean;
  deductibleAmount: number;
  reason: string;
  category: string;
}

export interface DialogContent {
  buildingId: string;
  title: string;
  body: string;
  options?: PurchaseOption[];
  action?:
    | "earn"
    | "file"
    | "bank"
    | "study"
    | "train"
    | "plane"
    | "stadium"
    | "market"
    | "beach"
    | "shops"
    | "farm"
    | "tower"
    | "hospital"
    | "charity"
    | "crypto"
    | "retirement"
    | "haus"
    | "broker"
    | "kids"
    | "gigs"
    | "cityhall";
  amount?: number;
}

export interface TaxDocument {
  /** Unique id (e.g. "w2-workcorp"). */
  id: string;
  /** IRS form name shown on the document tile ("W-2"). */
  code: string;
  /** Short human label ("Wages from WorkCorp"). */
  label: string;
  /** Emoji glyph for the document tile. */
  icon: string;
  /** Which 1040 line / area the document feeds. */
  line: string;
}

export interface GameState {
  screen: Screen;
  income: number;
  deductions: number;
  withheld: number;
  purchases: PurchaseOption[];
  visitedBuildings: string[];
  documents: TaxDocument[];
  level: number;
  score: number;
  dialog: DialogContent | null;
  /** Monotonic counter — every dialog open bumps this so the camera can
      trigger a one-shot cinematic FOV punch without depending on identity. */
  dialogOpenTick: number;
  taxFiled: boolean;
  finalRefund: number;
  finalOwed: number;
}

export const TAX_BRACKETS = [
  { min: 0, max: 11600, rate: 0.1, label: "10%" },
  { min: 11600, max: 47150, rate: 0.12, label: "12%" },
  { min: 47150, max: 100525, rate: 0.22, label: "22%" },
  { min: 100525, max: 191950, rate: 0.24, label: "24%" },
];

export function calculateTax(income: number, deductions: number): { tax: number; effectiveRate: number; bracket: string } {
  const standardDeduction = 14600;
  const totalDeductions = Math.max(standardDeduction, deductions + standardDeduction);
  const taxableIncome = Math.max(0, income - totalDeductions);

  let tax = 0;
  let bracket = TAX_BRACKETS[0].label;

  for (const b of TAX_BRACKETS) {
    if (taxableIncome > b.min) {
      const taxable = Math.min(taxableIncome, b.max) - b.min;
      tax += taxable * b.rate;
      bracket = b.label;
    }
  }

  const effectiveRate = income > 0 ? (tax / income) * 100 : 0;
  return { tax: Math.round(tax), effectiveRate: Math.round(effectiveRate * 10) / 10, bracket };
}
