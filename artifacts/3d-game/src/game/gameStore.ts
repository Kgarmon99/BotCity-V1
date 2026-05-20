import { create } from "zustand";
import { GameState, DialogContent, PurchaseOption, TaxDocument, calculateTax } from "./types";

export type CameraMode = 0 | 1 | 2 | 3 | 4;

export type WeatherMode = "clear" | "rain" | "snow" | "fog";
const WEATHER_CYCLE: WeatherMode[] = ["clear", "rain", "snow", "fog"];

interface GameStore extends GameState {
  cameraMode: CameraMode;
  setCameraMode: (m: CameraMode) => void;
  cycleCamera: () => void;
  weather: WeatherMode;
  setWeather: (w: WeatherMode) => void;
  cycleWeather: () => void;
  startGame: () => void;
  openDialog: (dialog: DialogContent) => void;
  closeDialog: () => void;
  earnIncome: (amount: number, withheld: number) => void;
  makePurchase: (item: PurchaseOption) => void;
  visitBuilding: (id: string) => void;
  collectDocument: (doc: TaxDocument) => void;
  fileTaxes: () => void;
  restart: () => void;
}

const initialState: GameState = {
  screen: "title",
  income: 0,
  deductions: 0,
  withheld: 0,
  purchases: [],
  visitedBuildings: [],
  documents: [],
  level: 1,
  score: 0,
  dialog: null,
  dialogOpenTick: 0,
  taxFiled: false,
  finalRefund: 0,
  finalOwed: 0,
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,
  cameraMode: 0,

  setCameraMode: (cameraMode) => set({ cameraMode }),
  cycleCamera: () =>
    set((s) => ({ cameraMode: (((s.cameraMode + 1) % 5) as CameraMode) })),

  weather: "clear",
  setWeather: (weather) => set({ weather }),
  cycleWeather: () =>
    set((s) => ({
      weather:
        WEATHER_CYCLE[(WEATHER_CYCLE.indexOf(s.weather) + 1) % WEATHER_CYCLE.length],
    })),

  startGame: () => set({ ...initialState, screen: "game" }),

  openDialog: (dialog) =>
    set((s) => ({ dialog, dialogOpenTick: s.dialogOpenTick + 1 })),

  collectDocument: (doc) =>
    set((s) =>
      s.documents.some((d) => d.id === doc.id)
        ? s
        : { documents: [...s.documents, doc], score: s.score + 5 },
    ),

  closeDialog: () => set({ dialog: null }),

  earnIncome: (amount, withheld) =>
    set((s) => ({
      income: s.income + amount,
      withheld: s.withheld + withheld,
      score: s.score + 10,
    })),

  makePurchase: (item) =>
    set((s) => ({
      deductions: s.deductions + item.deductibleAmount,
      purchases: [...s.purchases, item],
      score: s.score + (item.deductible ? 15 : 5),
    })),

  visitBuilding: (id) =>
    set((s) => ({
      visitedBuildings: s.visitedBuildings.includes(id)
        ? s.visitedBuildings
        : [...s.visitedBuildings, id],
    })),

  fileTaxes: () => {
    const { income, deductions, withheld } = get();
    const { tax } = calculateTax(income, deductions);
    const owed = tax - withheld;
    const refund = owed < 0 ? Math.abs(owed) : 0;
    const finalOwed = owed > 0 ? owed : 0;
    set({
      taxFiled: true,
      finalRefund: refund,
      finalOwed,
      screen: "results",
      score: get().score + 50,
    });
  },

  restart: () => set({ ...initialState }),
}));
