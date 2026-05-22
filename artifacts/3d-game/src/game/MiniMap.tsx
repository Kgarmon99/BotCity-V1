import { useEffect, useRef, useState } from "react";
import { useGameStore } from "./gameStore";
import { BUILDING_DEFS } from "./GameScene";
import { effectiveXZ } from "./buildingLayout";
import { playerTracker } from "./playerTracker";
import { MINIMAP_EXTENT, ROAD_XS, ROAD_ZS, ROAD_STYLE, QUARTERS } from "./cityConstants";

// Mini-map / objectives radar.
//
// Radar extent is derived from PLAYER_BOUND (+5) via cityConstants so the
// radar bound stays in sync with the player movement clamp and outer ring
// of roads. Road grid lines and quarter labels are also driven from the
// shared constants so the radar can never drift from the rendered city.
const WORLD_EXTENT = MINIMAP_EXTENT;
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
  const cityLayout = useGameStore((s) => s.cityLayout);
  const selectedBuildingId = useGameStore((s) => s.selectedBuildingId);
  const hoverPos = useGameStore((s) => s.hoverPos);
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
              {/* Full road grid: every vertical (x = const) and horizontal
                  (z = const) road from ROAD_XS / ROAD_ZS, including the new
                  outer ring. Color/width derive from ROAD_STYLE so the radar
                  matches the rendered city in 3D. */}
              {ROAD_XS.map((x) => {
                const { px } = worldToRadar(x, 0);
                const style = ROAD_STYLE[Math.abs(x)];
                const op = x === 0 ? 0.42 : Math.abs(x) >= 115 ? 0.3 : 0.18;
                return (
                  <line
                    key={`vr-${x}`}
                    x1={px}
                    y1={0}
                    x2={px}
                    y2={RADAR_SIZE}
                    stroke={style.color}
                    strokeOpacity={op}
                    strokeWidth={x === 0 ? 1.4 : 0.8}
                  />
                );
              })}
              {ROAD_ZS.map((z) => {
                const { py } = worldToRadar(0, z);
                const style = ROAD_STYLE[Math.abs(z)];
                const op = z === 0 ? 0.42 : Math.abs(z) >= 115 ? 0.3 : 0.18;
                return (
                  <line
                    key={`hr-${z}`}
                    x1={0}
                    y1={py}
                    x2={RADAR_SIZE}
                    y2={py}
                    stroke={style.color}
                    strokeOpacity={op}
                    strokeWidth={z === 0 ? 1.4 : 0.8}
                  />
                );
              })}

              {/* Quarter labels: one tag per outer-ring quarter so the player
                  can see at a glance which content pack lives where. */}
              {QUARTERS.map((q) => {
                const { px, py } = worldToRadar(q.signpost[0], q.signpost[2]);
                return (
                  <g key={`q-${q.id}`} style={{ pointerEvents: "none" }}>
                    <text
                      x={px}
                      y={py}
                      fontSize={8}
                      textAnchor="middle"
                      fill={q.color}
                      fillOpacity={0.85}
                      fontWeight="bold"
                      style={{ letterSpacing: "0.02em" }}
                    >
                      {q.emoji}
                    </text>
                  </g>
                );
              })}
              {/* Cardinal compass labels — sit just inside the outer ring so
                  the player can tell at a glance which way is which. World
                  +Z is south on the radar (see worldToRadar comment). */}
              {[
                { x: RADAR_SIZE / 2, y: 9, label: "N" },
                { x: RADAR_SIZE / 2, y: RADAR_SIZE - 5, label: "S" },
                { x: 7, y: RADAR_SIZE / 2 + 3, label: "W" },
                { x: RADAR_SIZE - 7, y: RADAR_SIZE / 2 + 3, label: "E" },
              ].map((c) => (
                <text
                  key={c.label}
                  x={c.x}
                  y={c.y}
                  fontSize={9}
                  fontWeight="bold"
                  textAnchor="middle"
                  fill="rgba(134,239,172,0.7)"
                  style={{ pointerEvents: "none", letterSpacing: "0.05em" }}
                >
                  {c.label}
                </text>
              ))}

              {/* Building blips: amber & pulsing if unvisited, dim green
                  with a check if done. Stadiums/etc all use the same
                  rendering — emoji floats above for instant recognition. */}
              {BUILDING_DEFS.map((b) => {
                const visited = visitedBuildings.includes(b.id);
                const [bx, bz] = effectiveXZ(b.position, b.id, cityLayout, selectedBuildingId, hoverPos);
                const { px, py } = worldToRadar(bx, bz);
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
