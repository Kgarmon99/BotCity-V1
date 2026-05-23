// ════════════════════════════════════════════════════════════════════
// City-wide constants. Single source of truth for player bounds, road
// grid, and the reserved lot/quarter layout that Task #2 will populate
// with ~30 financial-ed kiosks.
//
// Coordinate notes:
//  • +X = east, +Z = south. Player at y=0 plane.
//  • Existing kiosks live within |x|,|z| ≤ 92.
//  • Inner road grid (legacy): x/z ∈ {0, ±27, ±54}.
//  • Outer ring (tightened): x/z ∈ {±120, ±150}.
//  • New financial-ed kiosks ring the city at ±103 — just outside the
//    existing kiosk footprint and 5u clear of the inner ring road.
//  • Player clamp: ±160 (10u buffer outside outer ring road at ±150).
//  • Ground plane is 500×500 in World.tsx, so the whole expansion fits.
// ════════════════════════════════════════════════════════════════════

export const PLAYER_BOUND = 160;

/** Half-extent used by RoadGrid for road length (full road = HALF×2). */
export const ROAD_HALF = PLAYER_BOUND;

/** Vertical roads run along the z-axis. Listed left → right. */
export const ROAD_XS = [-150, -120, -54, -27, 0, 27, 54, 120, 150] as const;

/** Horizontal roads run along the x-axis. Listed north → south. */
export const ROAD_ZS = [-150, -120, -54, -27, 0, 27, 54, 120, 150] as const;

/** Outer ring road coordinates (added in Task #1, tightened in Task #8). */
export const OUTER_RING_INNER = 120;
export const OUTER_RING_OUTER = 150;

/** MiniMap world extent — derives from player bound + small margin so the
 *  player icon never touches the radar edge before the clamp engages. */
export const MINIMAP_EXTENT = PLAYER_BOUND + 5;

/** Road styling lookup, keyed by |coord|. Used by RoadGrid so coordinates
 *  and widths stay in sync with ROAD_XS/ROAD_ZS. */
export const ROAD_STYLE: Record<number, { width: number; color: string }> = {
  0:   { width: 3,   color: "#22c55e" }, // main avenue
  27:  { width: 2.2, color: "#4ade80" }, // secondary
  54:  { width: 2.2, color: "#86efac" }, // secondary outer
  120: { width: 2.6, color: "#a7f3d0" }, // inner ring (new)
  150: { width: 2.6, color: "#fef3c7" }, // outer ring (new)
};

/** Width of a reserved kiosk lot (square). */
export const LOT_SIZE = 8;

export interface Quarter {
  /** Stable id — used as a key & as a section anchor in HUD. */
  id: string;
  /** Short display name shown on the in-world signpost. */
  name: string;
  /** Emoji prefixed on the signpost and in the HUD section. */
  emoji: string;
  /** HUD section title (matches `name` for now). */
  hudTitle: string;
  /** Themed accent color used by the signpost emissive material. */
  color: string;
  /** Signpost world position [x, y, z] — anchored to inner-corner side. */
  signpost: [number, number, number];
  /** Optional rotation (y-axis) so signpost faces the city center. */
  signpostRotY: number;
  /** Reserved lot centers (y is always 0). */
  lots: Array<{ id: string; position: [number, number] }>;
}

// ── Lot layouts ─────────────────────────────────────────────────────
// Corner quarters: 5 lots in a + pattern centered on the corner.
// Strip quarters: 5 lots in a row at the strip midline (z=±103 or
//   x=±103), spaced to avoid existing inner roads at x/z ∈ {0,±27,±54}.

function plusLots(cx: number, cz: number, prefix: string): Quarter["lots"] {
  // 8u offsets keep lots clear of the inner ring road at ±120 and the
  // existing inner-city kiosks at |x|,|z| ≈ 92.
  return [
    { id: `${prefix}-c`, position: [cx, cz] },
    { id: `${prefix}-n`, position: [cx, cz - 8] },
    { id: `${prefix}-s`, position: [cx, cz + 8] },
    { id: `${prefix}-e`, position: [cx + 8, cz] },
    { id: `${prefix}-w`, position: [cx - 8, cz] },
  ];
}

// Strip-quarter lots: positions must match each quarter's actual built
// kiosks in GameScene.BUILDING_DEFS so every kiosk sits on its themed
// plinth. A few entries in Consumer & Macro had to drift off the strip
// midline to avoid colliding with inner-city districts (BotEnergy,
// BotFactory, Foundations plus-pattern); the lot list mirrors that.
function explicitLots(
  prefix: string,
  positions: ReadonlyArray<[number, number]>,
): Quarter["lots"] {
  return positions.map((p, i) => ({ id: `${prefix}-${i + 1}`, position: p }));
}

export const QUARTERS: Quarter[] = [
  {
    id: "foundations",
    name: "Foundations",
    emoji: "🧠",
    hudTitle: "Foundations",
    color: "#22d3ee",
    signpost: [-22, 0, -91],
    signpostRotY: -Math.PI / 2, // faces east toward the cluster
    // Tucked just north of BotThrift & Resale (-13, -103) on the Consumer strip,
    // threading between BotThrift to the south and BotFactory Yard's south edge
    // (z=-81) to the north. Well clear of the expanded BotNational Park (east
    // edge x=-80) and the Golf Course (west edge x=-24).
    lots: plusLots(-13, -91, "fnd"),
  },
  {
    id: "borrowing",
    name: "Borrowing & Credit",
    emoji: "💳",
    hudTitle: "Borrowing & Credit",
    color: "#f472b6",
    signpost: [117, 0, -117],
    signpostRotY: -Math.PI / 4, // faces center (SW)
    lots: plusLots(103, -103, "bor"),
  },
  {
    id: "investing",
    name: "Investing",
    emoji: "📈",
    hudTitle: "Investing",
    color: "#fbbf24",
    signpost: [117, 0, 117],
    signpostRotY: (3 * Math.PI) / 4, // faces center (NW)
    lots: plusLots(103, 103, "inv"),
  },
  {
    id: "lifeevents",
    name: "Life Events",
    emoji: "💍",
    hudTitle: "Life Events",
    color: "#a78bfa",
    signpost: [-117, 0, 142],
    signpostRotY: -(3 * Math.PI) / 4, // faces center (NE)
    // Pushed south into the outer-ring band so kiosks are 50u clear of
    // BotPlane International airport (south edge ~z=85).
    lots: plusLots(-103, 135, "life"),
  },
  {
    id: "consumer",
    name: "Consumer & Behavioral",
    emoji: "🛒",
    hudTitle: "Consumer & Behavioral",
    color: "#34d399",
    signpost: [0, 0, -117],
    signpostRotY: Math.PI, // faces south (toward center)
    lots: explicitLots("csm", [
      [-95, -103], // botconsumer
      [-13, -103], // botthrift
      [40, -103],  // botgiving
      [95, -103],  // botfintech
      [3, -91],    // botads (drifted north onto Foundations row to avoid BotFactory)
    ]),
  },
  {
    id: "macro",
    name: "Macro & Money",
    emoji: "🌐",
    hudTitle: "Macro & Money",
    color: "#fb923c",
    signpost: [0, 0, 117],
    signpostRotY: 0, // faces north (toward center)
    lots: explicitLots("mac", [
      [-40, 103],  // botforex
      [-13, 103],  // bottrade
      [22, 103],   // botinflation (shifted from 40 — BotEnergy collision)
      [95, 103],   // botpolicy
      [70, -103],  // botecon (relocated to opposite strip to avoid landmark crowding)
    ]),
  },
  {
    id: "ai",
    name: "AI & Bots",
    emoji: "🤖",
    hudTitle: "AI & Bots",
    color: "#06b6d4",
    signpost: [142, 0, -142],
    signpostRotY: -Math.PI / 4, // faces center (SW)
    lots: explicitLots("ai", [
      [130, -130],  // botaihq
      [138, -130],  // botmlab
      [130, -122],  // botdatacenter
      [138, -122],  // botrobotics
      [134, -138],  // botautomation
    ]),
  },
];

/** Flat list of all reserved lots — used for visualization. */
export const RESERVED_LOTS = QUARTERS.flatMap((q) =>
  q.lots.map((l) => ({ ...l, quarter: q.id, color: q.color })),
);
