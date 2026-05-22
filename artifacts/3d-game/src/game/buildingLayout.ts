import { BUILDING_DEFS } from "./GameScene";
import { useGameStore } from "./gameStore";

export const GRID_SNAP = 2;
const LS_KEY = "botcity.cityLayout.v1";

export type LayoutOverrides = Record<string, [number, number]>;

export function snap(v: number): number {
  return Math.round(v / GRID_SNAP) * GRID_SNAP;
}

export function loadLayout(): LayoutOverrides {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    const out: LayoutOverrides = {};
    for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
      if (
        Array.isArray(v) &&
        v.length === 2 &&
        typeof v[0] === "number" &&
        typeof v[1] === "number"
      ) {
        out[k] = [v[0], v[1]];
      }
    }
    return out;
  } catch {
    return {};
  }
}

export function saveLayout(layout: LayoutOverrides): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LS_KEY, JSON.stringify(layout));
  } catch {
    /* quota / private mode — silently ignore */
  }
}

/** Resolve a building id's effective [x, z] given the override map and an
 *  optional in-flight pickup (selected id + hover position). */
export function effectiveXZ(
  defPos: readonly [number, number, number],
  id: string,
  overrides: LayoutOverrides,
  selectedId: string | null,
  hoverPos: [number, number] | null,
): [number, number] {
  if (selectedId === id && hoverPos) return hoverPos;
  const o = overrides[id];
  if (o) return o;
  return [defPos[0], defPos[2]];
}

/** Live delta (current effective position minus the def's default position)
 *  for a given kiosk id. Decoration components paired with a kiosk add this
 *  to their own anchor `<group position>` so the whole structure (field,
 *  stands, etc.) translates with the kiosk as the user drags it in Build
 *  Mode. Returns [0, 0, 0] if the kiosk has no override and is not the one
 *  currently being carried. */
export function useLinkedOffset(kioskId: string): [number, number, number] {
  const cityLayout = useGameStore((s) => s.cityLayout);
  const selectedId = useGameStore((s) => s.selectedBuildingId);
  const hoverPos = useGameStore((s) => s.hoverPos);
  const def = BUILDING_DEFS.find((b) => b.id === kioskId);
  if (!def) return [0, 0, 0];
  const [ex, ez] = effectiveXZ(def.position, kioskId, cityLayout, selectedId, hoverPos);
  return [ex - def.position[0], 0, ez - def.position[2]];
}

/** Get effective [x, y, z] for a building id by looking up its def. */
export function effectivePos(
  id: string,
  overrides: LayoutOverrides,
  selectedId: string | null,
  hoverPos: [number, number] | null,
): [number, number, number] | null {
  const def = BUILDING_DEFS.find((b) => b.id === id);
  if (!def) return null;
  const [x, z] = effectiveXZ(def.position, id, overrides, selectedId, hoverPos);
  return [x, def.position[1], z];
}
