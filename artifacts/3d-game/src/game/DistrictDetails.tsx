// =====================================================================
// DistrictDetails — DEPRECATED stub.
//
// This file previously rendered orphan decor (palms, lifeguard tower,
// volleyball net, surfboards near old BotBeach at (44,25); crop rows +
// scarecrow + barn near old BotFarm at (-40,-41); minecart near old
// BotMine at (-50,-25); cargo dock near old BotPort at (54,46)). Every
// one of those landmarks has since moved on the map and grown a much
// richer canonical decoration in CityDistricts.tsx:
//   • BotBeach  → (66, 37.5) — handled by Beach()  in CityDistricts.tsx
//   • BotFarm   → (-60, -61.5) — handled by Farm() in CityDistricts.tsx
//   • BotMine   → (-75, -37.5) — handled by Mine() in CityDistricts.tsx
//   • BotPort   → (75, 72)  — handled by Port() in CityDistricts.tsx
//
// The component is kept as a no-op so the GameScene import doesn't have
// to change in the same PR as the cleanup; it can be removed later.
// =====================================================================

export default function DistrictDetails() {
  return null;
}
