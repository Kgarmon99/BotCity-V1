# [Project name]

_Replace the heading above with the project's name, and this line with one sentence describing what this app does for users._

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- **BotCity 3D game**: `artifacts/3d-game/`
  - City-wide constants (player bound, road grid, quarters, reserved lots): `src/game/cityConstants.ts` — single source of truth, consumed by `Player.tsx`, `RoadGrid.tsx`, `Traffic.tsx`, `MiniMap.tsx`, `DayNightCycle.tsx`, `ExpansionQuarters.tsx`.
  - Existing kiosk definitions: `BUILDING_DEFS` in `src/game/GameScene.tsx`.
  - HUD section model (Objectives panel): `BUILDING_SECTIONS` in `src/game/HUD.tsx`.
  - Outer-ring expansion (6 quarters / 30 reserved lots for upcoming financial-ed kiosks): `src/game/ExpansionQuarters.tsx`.
  - **City Editor (drag-to-rearrange Build Mode)**: `src/game/CityEditor.tsx` + `src/game/buildingLayout.ts`. Layout overrides live in `gameStore.cityLayout` (persisted to `localStorage["botcity.cityLayout.v1"]`). Anywhere a building's position is consumed (GameScene collision/interact + render, KioskDecor plinth + prop, MiniMap) goes through `effectiveXZ(def.position, id, cityLayout, selectedBuildingId, hoverPos)`. Snap grid is 2u (matches roads). Toggle with `B` or HUD button; player input is frozen, FollowCamera bails (`if (editMode) return;` in its useFrame), and CityEditor mounts a high top-down `OrthographicCamera` (`makeDefault`) with WASD/arrow pan + wheel zoom (clamped `ZOOM_MIN`/`MAX`).
  - **BotStock Exchange landmark** (NYSE-style pavilion: 8 columns, pediment, charging-bull statue, rooftop bell tower, ticker tape, stock-chart screens): `StockExchange()` in `src/game/NewDistricts.tsx`, anchored at (-75, 0, 35) with kiosk `botstockex` at (-75, 1.5, 41) in BUILDING_DEFS. HUD entry under "Finance" section. Wired via `useLinkedOffset("botstockex")` so it follows the kiosk in Build Mode.
  - **Kiosk plinths live in `KioskDecor`, not `ExpansionQuarters`**: each outer-ring kiosk renders its own dark-tile + quarter-color ring at its effective position, so the plinth follows the kiosk during Build Mode. `ExpansionQuarters` only renders quarter signposts now.

## Architecture decisions

- **One source of truth for the city map.** Player bound, road grid, reserved lots, and MiniMap extent are all derived from `cityConstants.ts`. Bumping `PLAYER_BOUND` or editing `ROAD_XS`/`ROAD_ZS` propagates automatically.
- **Outer ring is ±115 / ±150**, not ±81 / ±108 — existing kiosks already reach |x|,|z| ≈ 92, so the original spec coordinates would have bisected them.
- **Empty HUD sections render as "soon"** with a placeholder line; they intentionally do not count toward the 0/N progress denominator until Task #2 adds kiosks.

## Product

_Describe the high-level user-facing capabilities of this app once they exist._

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
