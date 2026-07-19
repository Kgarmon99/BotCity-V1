import type { WeatherMode } from "./gameStore";

export interface WeatherFog {
  color: string;
  near: number;
  far: number;
  background: string;
}

/**
 * Returns the `<fog>` args + scene background color for the current weather.
 */
export function fogForWeather(mode: WeatherMode): WeatherFog {
  switch (mode) {
    case "rain":
      return { color: "#1e293b", near: 25, far: 110, background: "#020617" };
    case "snow":
      return { color: "#cbd5e1", near: 20, far: 95, background: "#1e293b" };
    case "fog":
      return { color: "#475569", near: 8, far: 55, background: "#334155" };
    case "clear":
    default:
      return { color: "#052e16", near: 55, far: 160, background: "#021410" };
  }
}
