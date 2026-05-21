import { useEffect, useRef, useState } from "react";
import { useGameStore } from "./gameStore";
import { BUILDING_DEFS } from "./GameScene";
import { playerTracker } from "./playerTracker";

// Mini-map / objectives radar.
//
// World extent: the player is clamped to ±44 in x/z (see Player.tsx), and the
// outermost buildings (botfarm) sit at ±41. We map this ±48 box to a square
// SVG so blips always fit comfortably inside the radar even at the edge.

const WORLD_EXTENT = 110;
const RADAR_SIZE = 168; // px

function worldToRadar(wx: number, wz: number) {
  // Player +Z = "back" in this game, but we draw with screen +Y = down.
  // World +Z (south) → radar +Y (down) ✓. World +X (east) → radar +X ✓.
  const px = ((wx + WORLD_EXTENT) / (WORLD_EXTENT * 2)) * RADAR_SIZE;
  const py = ((wz + WORLD_EXTENT) / (WORLD_EXTENT * 2)) * RADAR_SIZE;
  return { px, py };
}

export default function MiniMap() {
  const visitedBuildings = useGameStore((s) => s.visitedBuildings);
  // Persisted collapse so the player can hide the radar to free up screen
  // real estate on mobile.
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem("botcity:miniMap") === "0";
    } catch {
      return false;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem("botcity:miniMap", collapsed ? "0" : "1");
    } catch {
      /* ignore */
    }
  }, [collapsed]);

  // Player position is updated at 60Hz in Player.tsx — re-render the radar
  // at ~20Hz so the blip moves smoothly without thrashing React.
  const [, force] = useState(0);
  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef(0);
  useEffect(() => {
    if (collapsed) return;
    const loop = (t: number) => {
      if (t - lastTickRef.current >= 50) {
        lastTickRef.current = t;
        force((n) => (n + 1) % 1000);
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [collapsed]);

  const { px: pPx, py: pPy } = worldToRadar(playerTracker.x, playerTracker.z);
  // Yaw arrow head — point in the player's facing direction. Player.tsx
  // computes yaw as atan2(vel.x, vel.z), where forward is -Z. So at yaw=0
  // the player faces -Z (north on the radar).
  const arrowLen = 9;
  const ax = pPx + Math.sin(playerTracker.yaw) * arrowLen;
  const ay = pPy + Math.cos(playerTracker.yaw) * arrowLen;

  return (
    <div
      className="fixed top-4 right-16 z-20 pointer-events-auto"
      style={{ width: collapsed ? "auto" : RADAR_SIZE + 8 }}
    >
      <div className="bg-slate-950/85 rounded-2xl border border-emerald-500/20 backdrop-blur-md shadow-[0_0_30px_-10px_rgba(34,197,94,0.4)] overflow-hidden">
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] font-bold text-amber-300/90 hover:bg-slate-900/60 transition-colors"
          title={collapsed ? "Show radar" : "Hide radar"}
        >
          <span>🗺️ Radar</span>
          <span className="text-emerald-300/80 font-mono normal-case tracking-normal">
            {collapsed ? "▾" : "▴"}
          </span>
        </button>
        {!collapsed && (
          <div className="px-1 pb-1">
            <svg
              width={RADAR_SIZE}
              height={RADAR_SIZE}
              viewBox={`0 0 ${RADAR_SIZE} ${RADAR_SIZE}`}
              className="block rounded-xl bg-emerald-950/40"
            >
              {/* Concentric range rings give a sense of distance. */}
              <circle cx={RADAR_SIZE / 2} cy={RADAR_SIZE / 2} r={RADAR_SIZE / 2 - 2} fill="none" stroke="rgba(34,197,94,0.18)" />
              <circle cx={RADAR_SIZE / 2} cy={RADAR_SIZE / 2} r={(RADAR_SIZE / 2 - 2) * 0.66} fill="none" stroke="rgba(34,197,94,0.12)" />
              <circle cx={RADAR_SIZE / 2} cy={RADAR_SIZE / 2} r={(RADAR_SIZE / 2 - 2) * 0.33} fill="none" stroke="rgba(34,197,94,0.08)" />
              {/* Main avenue crosshairs (N-S + E-W) — purely cosmetic, matches
                  the city's grid so the radar feels like a real map. */}
              <line x1={RADAR_SIZE / 2} y1="0" x2={RADAR_SIZE / 2} y2={RADAR_SIZE} stroke="rgba(34,197,94,0.1)" />
              <line x1="0" y1={RADAR_SIZE / 2} x2={RADAR_SIZE} y2={RADAR_SIZE / 2} stroke="rgba(34,197,94,0.1)" />

              {/* Building blips: amber & pulsing if unvisited, dim green
                  with a check if done. Stadiums/etc all use the same
                  rendering — emoji floats above for instant recognition. */}
              {BUILDING_DEFS.map((b) => {
                const visited = visitedBuildings.includes(b.id);
                const { px, py } = worldToRadar(b.position[0], b.position[2]);
                return (
                  <g key={b.id}>
                    <circle
                      cx={px}
                      cy={py}
                      r={visited ? 4 : 5}
                      fill={visited ? "rgba(34,197,94,0.55)" : "rgba(251,191,36,0.95)"}
                      stroke={visited ? "rgba(34,197,94,0.9)" : "rgba(254,243,199,1)"}
                      strokeWidth={visited ? 0.8 : 1.2}
                    >
                      {!visited && (
                        <animate
                          attributeName="r"
                          values="5;7;5"
                          dur="1.8s"
                          repeatCount="indefinite"
                        />
                      )}
                    </circle>
                    {!visited && (
                      <circle
                        cx={px}
                        cy={py}
                        r={6}
                        fill="none"
                        stroke="rgba(251,191,36,0.55)"
                        strokeWidth={1}
                      >
                        <animate attributeName="r" values="6;13;6" dur="1.8s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.7;0;0.7" dur="1.8s" repeatCount="indefinite" />
                      </circle>
                    )}
                    <text
                      x={px}
                      y={py - 8}
                      fontSize={9}
                      textAnchor="middle"
                      style={{ pointerEvents: "none" }}
                    >
                      {b.emoji}
                    </text>
                  </g>
                );
              })}

              {/* Player blip + facing arrow */}
              <line
                x1={pPx}
                y1={pPy}
                x2={ax}
                y2={ay}
                stroke="rgba(134,239,172,0.95)"
                strokeWidth={2}
                strokeLinecap="round"
              />
              <circle
                cx={pPx}
                cy={pPy}
                r={4}
                fill="#22c55e"
                stroke="white"
                strokeWidth={1.5}
              />
            </svg>
            <div className="mt-1 px-1.5 flex items-center justify-between text-[9.5px] text-emerald-200/70 uppercase tracking-wider">
              <span className="flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-amber-400" />
                To visit
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                You
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
