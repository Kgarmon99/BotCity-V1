import { useRef, useState, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import Player from "./Player";
import Building, { BuildingData } from "./Building";
import World from "./World";
import FollowCamera from "./FollowCamera";
import HUD from "./HUD";
import DialogModal from "./DialogModal";
import Skybox from "./Skybox";
import NPCBots from "./NPCBots";
import CitizenBots from "./CitizenBots";
import Billboards from "./Billboards";
import MoneyRain from "./MoneyRain";
import Weather, { fogForWeather } from "./Weather";
import Traffic from "./Traffic";
import CityDetails from "./CityDetails";
import Statues from "./Statues";
import CityBuildings from "./CityBuildings";
import CityExpansion from "./CityExpansion";
import Landmarks from "./Landmarks";
import CityDistricts from "./CityDistricts";
import CityDistrictsExtra from "./CityDistrictsExtra";
import NewDistricts from "./NewDistricts";
import ExpansionQuarters from "./ExpansionQuarters";
import KioskDecor from "./KioskDecor";
import CityHallPlaza from "./CityHallPlaza";
import Blimp from "./Blimp";
import RoadGrid from "./RoadGrid";
import Streetscape from "./Streetscape";
import BuildingAccents from "./BuildingAccents";
import DayNightCycle from "./DayNightCycle";
import River from "./River";
import ObservationTower from "./ObservationTower";
import AmbientLife from "./AmbientLife";
import DistrictDetails from "./DistrictDetails";
import { useGameStore } from "./gameStore";
import { DIALOGS } from "./dialogs";

export const BUILDING_DEFS: Omit<BuildingData, "visited" | "available">[] = [
  {
    id: "workcorp",
    label: "WorkCorp",
    position: [12, 3, -15],
    color: "#60a5fa",
    roofColor: "#3b82f6",
    width: 5,
    depth: 4,
    height: 6,
    emoji: "💼",
  },
  {
    id: "taxmart",
    label: "TaxMart",
    position: [-13.5, 2, -12],
    color: "#fbbf24",
    roofColor: "#f59e0b",
    width: 6,
    depth: 5,
    height: 4,
    emoji: "🛒",
  },
  {
    id: "firstbank",
    label: "First Bank",
    position: [13.5, 2.5, 13.5],
    color: "#a78bfa",
    roofColor: "#8b5cf6",
    width: 5,
    depth: 4,
    height: 5,
    emoji: "🏦",
  },
  {
    id: "irs",
    label: "IRS Office",
    position: [-13.5, 3, 13.5],
    color: "#f87171",
    roofColor: "#ef4444",
    width: 5,
    depth: 4,
    height: 6,
    emoji: "📋",
  },
  {
    id: "botusouth",
    label: "BotU South Campus",
    // SW inner-block corner — mirror of BotU North across the E-W avenue.
    // Footprint x[-17.5..-12.5] z[11.5..16.5]. Clear of irs (-9,9 → south edge
    // z=11 ⇒ 0.5u gap), and 0.4u from the south secondary road band.
    position: [-22.5, 3.5, 21],
    color: "#0ea5e9",
    roofColor: "#fbbf24",
    width: 5,
    depth: 5,
    height: 7,
    emoji: "🎓",
  },
  {
    id: "botunorth",
    label: "BotU North Campus",
    // NW inner-block corner — clear of roads (main x/z=0, secondary ±18) and
    // other buildings. Paired with botusouth across the south road for a
    // north/south split-campus university.
    position: [-21, 4, -21],
    color: "#22c55e",
    roofColor: "#fbbf24",
    width: 5,
    depth: 5,
    height: 8,
    emoji: "🎓",
  },
  {
    id: "bottrain",
    label: "BotTrain Station",
    // SE inner block. Building footprint x=12..16, z=10..14. Tracks run east-west
    // at z=15.5 (north of station; clear of secondary street at z=18 / 16.9..19.1).
    position: [21, 2.5, 18],
    color: "#fb923c",
    roofColor: "#7c2d12",
    width: 4,
    depth: 4,
    height: 5,
    emoji: "🚆",
  },
  {
    id: "botplane",
    label: "BotPlane International",
    // Real airports take a lot of land, so BotPlane has been pushed to
    // the far SW outskirts. The whole airport district (Runway/Airplane/
    // TakeoffPlane/ControlTower/AirportExpansion) is wrapped in a
    // (-15, 0, +5) translation group in CityExpansion's default export,
    // so the kiosk + every airport feature shift together. Kiosk world
    // coord = (-75, 67.5) + (-15, +5) = (-90, 72.5). Terminal at world
    // (-65, 50); runway 2 east edge at world x=-40 (clears BotShops).
    position: [-90, 3, 72.5],
    color: "#38bdf8",
    roofColor: "#0c4a6e",
    width: 10,
    depth: 6,
    height: 4,
    emoji: "✈️",
  },
  // ─── Middle-ring district kiosks (entry markers for the 4 new districts) ───
  // Each kiosk sits at the south edge of its district at z = ∓20.5, in the
  // 2-unit gap between the secondary street z=±18 band (16.9..19.1 / -19.1..-16.9)
  // and the district structure starting at z = ∓21.5.
  {
    id: "botstadium",
    label: "BotStadium",
    position: [-40.5, 1.5, -30.75],
    color: "#dc2626",
    roofColor: "#fde047",
    width: 1.8,
    depth: 1.8,
    height: 3,
    emoji: "🏟️",
  },
  {
    id: "botmarket",
    label: "BotMarket",
    position: [40.5, 1.5, -30.75],
    color: "#f97316",
    roofColor: "#fde68a",
    width: 1.8,
    depth: 1.8,
    height: 3,
    emoji: "🛍️",
  },
  {
    id: "botbeach",
    label: "BotBeach Boardwalk",
    // Moved out of the inner-middle-ring kiosk position (27, 20.5) — beaches
    // belong on the edge of the world, not in the middle of the city. The
    // boardwalk pavilion now sits ON the giant east-edge beach at (44, *, 25),
    // with the sand strip and ocean rendered in CityDistricts.Beach().
    position: [66, 1.5, 37.5],
    color: "#22d3ee",
    roofColor: "#fcd34d",
    width: 3,
    depth: 3,
    height: 2.5,
    emoji: "🏖️",
  },
  {
    id: "botshops",
    label: "BotShops",
    position: [-40.5, 1.5, 30.75],
    color: "#a855f7",
    roofColor: "#f9a8d4",
    width: 1.8,
    depth: 1.8,
    height: 3,
    emoji: "🏪",
  },
  {
    id: "moneybottowers",
    label: "MoneyBot Towers",
    // NE inner block corner — the only inner quadrant still empty.
    // Block bounds x∈[1,16], z∈[-16,-1]; workcorp occupies x[5.5..10.5],
    // z[-12..-8] in the SW of the block, and CityBuildings fillers sit
    // at (14,-5) and (5,-14). Tower footprint x[11..15], z[-15..-11] —
    // clears workcorp by 0.5u and stays inside secondary streets (±18).
    // Door faces +z (south, toward main avenue z=0).
    position: [19.5, 6, -19.5],
    color: "#1e293b",
    roofColor: "#fbbf24",
    width: 4,
    depth: 4,
    height: 12,
    emoji: "🏢",
  },
  {
    id: "botfarm",
    label: "BotFarm",
    // Far NW corner — outside the outer ring streets (±36), away from all
    // other buildings. Door faces +z (south, toward the city) so players
    // approach from the secondary/main avenues. Surrounded by crop fields
    // and a silo rendered in CityDistricts.tsx.
    position: [-60, 2, -61.5],
    color: "#dc2626",
    roofColor: "#fef3c7",
    width: 5,
    depth: 4,
    height: 4,
    emoji: "🚜",
  },
  {
    id: "botdealer",
    label: "BotDealer",
    // North middle-ring, replaces the removed filler at (-9, -27). Showroom
    // footprint x=-11.5..-6.5, z=-29..-25. Parking lot + cars rendered south
    // of the building in CityDistricts.tsx (z = -26..-22).
    position: [-13.5, 2.5, -40.5],
    color: "#22d3ee",
    roofColor: "#fde047",
    width: 5,
    depth: 4,
    height: 5,
    emoji: "🚗",
  },
  // ─── Cardinal-axis middle ring (offset from the main avenues at x=0/z=0) ───
  // Sit in the band between secondary streets (±18) and the outer ring (±36),
  // offset 5u from the axis so they don't block the main avenues themselves.
  {
    id: "bothospital",
    label: "BotHospital",
    // North middle ring, east half. botdealer occupies x[-11.5..-6.5] z[-29..-25];
    // hospital at x=5 keeps a 5.5u gap. Footprint x[2.5..7.5] z[-29..-25].
    position: [7.5, 2.5, -40.5],
    color: "#ef4444",
    roofColor: "#fecaca",
    width: 5,
    depth: 4,
    height: 5,
    emoji: "🏥",
  },
  {
    id: "botretirement",
    label: "BotRetirement Plaza",
    // South middle ring. Empty band; place west of S-N axis so it doesn't sit
    // on the central avenue (x=0). Footprint x[-7.5..-2.5] z[25..29].
    position: [-7.5, 2.5, 40.5],
    color: "#7c3aed",
    roofColor: "#fde68a",
    width: 5,
    depth: 4,
    height: 5,
    emoji: "🏛️",
  },
  {
    id: "botcrypto",
    label: "BotCrypto Exchange",
    // East middle ring. Avoid main E-W avenue at z=0 by offsetting north.
    // Footprint x[24.5..29.5] z[-7..-3].
    position: [40.5, 2.5, -7.5],
    color: "#f59e0b",
    roofColor: "#78350f",
    width: 5,
    depth: 4,
    height: 6,
    emoji: "₿",
  },
  {
    id: "moneybotgaminghq",
    label: "MoneyBot Gaming HQ",
    // West middle ring, mirror of BotCrypto (at +27, -5). Offset north to
    // clear the main E-W avenue at z=0. Footprint x[-29.5..-24.5] z[-7..-3].
    // Tall corporate-HQ tower — neon purple body, cyan accent — visible from
    // anywhere in the city, mirroring MoneyBotTowers on the east side.
    position: [-40.5, 5, -7.5],
    color: "#a855f7",
    roofColor: "#22d3ee",
    width: 5,
    depth: 4,
    height: 10,
    emoji: "🎮",
  },
  {
    id: "botcharity",
    label: "BotCharity Center",
    // West middle ring. Offset south to clear the main avenue at z=0.
    // Footprint x[-29.5..-24.5] z[3..7].
    position: [-40.5, 2.5, 7.5],
    color: "#ec4899",
    roofColor: "#fce7f3",
    width: 5,
    depth: 4,
    height: 5,
    emoji: "❤️",
  },
  // ─── Outer suburbs ring (±55, offset 6u from main avenues) ─────────────
  // Beyond the middle ring sits the expanded "suburbs" — four landmarks
  // covering tax topics that weren't yet represented (home ownership,
  // brokerage, dependents/CTC, and 1099 gig work). Each is bigger than
  // the kiosks to read as a "destination" from far away.
  {
    id: "bothaus",
    label: "BotHaus",
    // North suburbs. Offset +6 in x to clear the N-S avenue at x=0.
    // Footprint x[3..9] z[-58..-52].
    position: [9, 3, -82.5],
    color: "#0ea5e9",
    roofColor: "#fde047",
    width: 6,
    depth: 6,
    height: 6,
    emoji: "🏠",
  },
  {
    id: "botbroker",
    label: "BotBroker",
    // East suburbs (financial district). Offset -6 in z to clear the E-W
    // avenue at z=0. Footprint x[52..58] z[-9..-3].
    position: [82.5, 3, -9],
    color: "#1e3a8a",
    roofColor: "#fbbf24",
    width: 6,
    depth: 6,
    height: 8,
    emoji: "📈",
  },
  {
    id: "botkids",
    label: "BotKids",
    // South suburbs (family district). Offset -6 in x to clear x=0.
    // Footprint x[-9..-3] z[52..58].
    position: [-9, 3, 82.5],
    color: "#f97316",
    roofColor: "#86efac",
    width: 6,
    depth: 6,
    height: 5,
    emoji: "🧒",
  },
  {
    id: "botgigs",
    label: "BotGigs",
    // West suburbs (gig economy hub). Offset +6 in z to clear z=0.
    // Footprint x[-58..-52] z[3..9].
    position: [-82.5, 3, 9],
    color: "#a855f7",
    roofColor: "#fde047",
    width: 6,
    depth: 6,
    height: 6,
    emoji: "🛵",
  },
  // ─── Family services (south middle ring) ─────────────────────────────
  // Opposite BotRetirement (at x=-5, z=27) across the main N-S avenue,
  // LittleBots DayCare occupies the empty east half of the south middle
  // ring. Footprint x[9.5..14.5] z[25..29]. A short, cheerful one-story
  // building keyed to the BotKids "Family" district.
  {
    id: "littlebots",
    label: "LittleBots DayCare",
    position: [18, 1.8, 40.5],
    color: "#fb7185",
    roofColor: "#fef3c7",
    width: 5,
    depth: 4,
    height: 3,
    emoji: "🧸",
  },
  // ─── Edge attractions ──────────────────────────────────────────────────
  // Far NE corner — a rocket launch pad with periodic lift-offs animated
  // in CityDistricts.RocketStation(). Way out past all the suburbs so the
  // smoke/fire/exhaust doesn't visually crowd downtown. Nearest neighbor
  // is botbroker at (55, -6), 44u south.
  {
    id: "botrocket",
    label: "BotRocket Station",
    position: [75, 3, -75],
    color: "#cbd5e1",
    roofColor: "#ef4444",
    width: 4,
    depth: 4,
    height: 5,
    emoji: "🚀",
  },
  // ─── Culture & history district (corner museums) ──────────────────────
  // Three museums sit at the outer corners of the inner-block intersections
  // (±22, ±27), each one DIRECTLY BEHIND a thematically-matched Hall of Fame
  // statue at (±22, ±22) — so walking past a statue leads the eye into the
  // matching museum. NE/SE/SW corners are filled; the NE has the Tech
  // museum (Founder statue), NE-mirror (the SE corner) is intentionally
  // skipped because no 4th museum was requested.
  {
    id: "bothistory",
    label: "Bot History Museum",
    // NW: behind MOMOBOT "The Founder" statue. Footprint x[-24..-20] z[-29..-25].
    position: [-33, 2.5, -40.5],
    color: "#94a3b8",
    roofColor: "#22d3ee",
    width: 4,
    depth: 4,
    height: 5,
    emoji: "🤖",
  },
  {
    id: "eduhistory",
    label: "Education History Museum",
    // NE: behind Prof. Ledgerington statue. Footprint x[20..24] z[-29..-25].
    position: [33, 2.5, -40.5],
    color: "#fde68a",
    roofColor: "#92400e",
    width: 4,
    depth: 4,
    height: 5,
    emoji: "📚",
  },
  {
    id: "finhistory",
    label: "Finance History Museum",
    // SW: behind Mayor Bytecoin statue. Footprint x[-24..-20] z[25..29].
    position: [-33, 2.5, 40.5],
    color: "#f8fafc",
    roofColor: "#fbbf24",
    width: 4,
    depth: 4,
    height: 5,
    emoji: "💰",
  },
  // ─── Civic centerpiece ─────────────────────────────────────────────────
  // BotCityHall is the urban-design anchor for the city. White marble +
  // gold dome, placed at the N middle ring east of the main avenue so it
  // reads as a destination from the spawn camera (which looks +Z → north).
  //
  // Footprint x[10.5..15.5] z[-33..-27]. Clears bothospital east edge at
  // x=7.5 (3u gap) and the secondary street at x=18 (2.5u gap on west
  // sidewalk). A civic plaza decoration sits south of the building —
  // see CityHallPlaza.tsx.
  // ─── Industry & specialty-tax districts ─────────────────────────────
  // Four destination buildings spread around the outer envelope (player
  // bound is ±64), each anchoring a tax topic that wasn't yet represented:
  //   tariffs/customs, gambling W-2G, mining depletion, charitable trusts.
  // Visual decorations (docks, neon signs, mineshafts, animal pens) are
  // rendered in CityDistricts.tsx alongside the existing districts.
  {
    id: "botport",
    label: "BotPort Harbor",
    // Far SE coast. Footprint x[47..53] z[45.5..50.5]. Closest neighbor is
    // BotBeach boardwalk at (44, 25) — 23u north. Player bound ±64 → east
    // edge at 53 leaves 11u for the sea/docks rendered in CityDistricts.
    position: [75, 2, 72],
    color: "#0c4a6e",
    roofColor: "#fbbf24",
    width: 6,
    depth: 5,
    height: 4,
    emoji: "⚓",
  },
  {
    id: "botcasino",
    label: "BotCasino",
    // NE outer area, off the avenue grid. Footprint x[32.5..37.5] z[-42..-38].
    // Closest neighbor BotRocket (50, -50) is 18u away — both spectacle
    // landmarks but well separated. BotBroker (55, -6) is 39u south.
    position: [52.5, 4, -60],
    color: "#7c2d12",
    roofColor: "#fde047",
    width: 5,
    depth: 4,
    height: 7,
    emoji: "🎰",
  },
  {
    id: "botmine",
    label: "BotMine & Quarry",
    // Far NW. Expanded into a full mining & quarry complex. Building
    // footprint now 7×4 h5 → world x[-78.5..-71.5], z[-39.5..-35.5].
    // Surrounding decor envelope: x[-94..-60], z[-49.5..-29.5] (see
    // CityDistricts.Mine() for the full breakdown). Player bound ±98.
    position: [-75, 2.5, -37.5],
    color: "#44403c",
    roofColor: "#a16207",
    width: 7,
    depth: 4,
    height: 5,
    emoji: "⛏️",
  },
  {
    id: "botzoo",
    label: "BotZoo & Park",
    // S edge near the BotKids family district. Footprint x[-18..-12] z[56..60].
    // BotKids at (-6, 55) is 10u east — reads as an adjacent attraction.
    // Player bound ±64 → south edge at 60 leaves 4u for the entrance arch.
    position: [-22.5, 2.5, 87],
    color: "#15803d",
    roofColor: "#fde047",
    width: 6,
    depth: 4,
    height: 5,
    emoji: "🦒",
  },
  {
    id: "botcityhall",
    label: "BotCityHall",
    position: [19.5, 5, -45],
    color: "#f1f5f9",
    roofColor: "#fbbf24",
    width: 5,
    depth: 6,
    height: 8,
    emoji: "🏛️",
  },
  {
    // BotSoccer Stadium — kiosk sign at south entrance of the soccer plaza
    // (-27, 0, -55). Mirrors the BotStadium kiosk pattern: tiny sign cube
    // that triggers the dialog; the field + stands + lights are rendered
    // by CityDistricts.SoccerStadium. Stadium center is x=-27 (block
    // interior, clear of x=-36 and x=-18 road bands ±1.1u); kiosk sits
    // just south of the south stand at z=-48.
    id: "botsoccer",
    label: "BotSoccer Stadium",
    position: [-40.5, 1.5, -76],
    color: "#22c55e",
    roofColor: "#ffffff",
    width: 1.8,
    depth: 1.8,
    height: 3,
    emoji: "⚽",
  },
  {
    // BotHoops Arena — kiosk sign at south entrance of the basketball
    // arena at (27, 0, 27). Claims the previously-FREE SE middle-ring
    // corner. Clearance: 7u to littlebots (12,27), 2.9u to z=18 road
    // band, 2.9u to z=36 road band.
    id: "botbasketball",
    label: "BotHoops Arena",
    position: [40.5, 1.5, 34],
    color: "#f97316",
    roofColor: "#7c2d12",
    width: 1.8,
    depth: 1.8,
    height: 3,
    emoji: "🏀",
  },
  {
    // BotGallery — full building in the Art District. Relocated from
    // world (-75, 40.5) to (-75, -10): the open NW band between BotGigs
    // (-82.5, 9) and BotMine (-75, -37.5). Old spot is now airport-
    // adjacent after the airport's SW shift. Surrounding sculpture
    // garden + mural walls rendered by CityDistricts.ArtDistrict (its
    // <group position> matches this kiosk z). Clear of z=0 main road
    // sidewalk by 2.1u (kiosk depth 4 → fp z[-12,-8]).
    id: "botgallery",
    label: "BotGallery",
    position: [-75, 2.5, -10],
    color: "#f1f5f9",
    roofColor: "#fbbf24",
    width: 5,
    depth: 4,
    height: 5,
    emoji: "🎨",
  },
  {
    // BotFashion District — moved out of the SW airport corner (was at
    // (-40.5, 59.25), right against R3 and the helipad apron). Now sits
    // inland from the beach — fashion shopping a short walk west of the
    // sand. Plaza at (40.5, 64) in CityDistricts.FashionDistrict; kiosk
    // here is the south-entrance trigger in the gap between the z=54
    // road band (z_max=55.1) and the plaza's south edge at z=59.
    id: "botfashion",
    label: "BotFashion District",
    position: [40.5, 1.5, 56.5],
    color: "#ec4899",
    roofColor: "#f9a8d4",
    width: 1.8,
    depth: 1.8,
    height: 3,
    emoji: "👗",
  },
  // ─── Education Row — three K-12 schools along z=75, far-north band ─────
  // Players already have BotU North/South (universities) and LittleBots
  // (daycare). These three fill the K-12 gap and form a visible "school
  // row" along the north edge of the map.
  // Progressive sizing: Elementary (smallest) → Middle → High (largest),
  // reflecting the K-12 grade progression. Footprints:
  //   bothigh         9×6 h8 → x[17.5,26.5], z[72,78]
  //   botmiddle       7×5 h6 → x[36.5,43.5], z[72.5,77.5]
  //   botelementary   5×4 h4 → x[52.5,57.5], z[73,77]
  // Gaps: High↔Middle 10u, Middle↔Elementary 9u (kiosk envelopes only).
  {
    id: "bothigh",
    label: "Bot High School",
    position: [22, 4, 75],
    color: "#475569",
    roofColor: "#f59e0b",
    width: 9,
    depth: 6,
    height: 8,
    emoji: "🎓",
  },
  {
    id: "botmiddle",
    label: "Bot Middle School",
    position: [40, 3, 75],
    color: "#0ea5e9",
    roofColor: "#f87171",
    width: 7,
    depth: 5,
    height: 6,
    emoji: "🏫",
  },
  {
    id: "botelementary",
    label: "Bot Elementary",
    position: [55, 2, 75],
    color: "#fde68a",
    roofColor: "#ef4444",
    width: 5,
    depth: 4,
    height: 4,
    emoji: "✏️",
  },
  // ─── Civic plaza @ z=-47 ──────────────────────────────────────────────
  // BotPolice + BotFire form a civic plaza flanking BotCityHall (19.5,-45).
  // Police at (33,-47) → fp x[30.5,35.5] z[-49,-45]. Fire at (48,-47) →
  // fp x[45.5,50.5] z[-49,-45]. Gap between kiosks = 10u (shared plaza,
  // see CityDistricts.CivicSafetyComplex translated by (-12,+35)).
  // Clearances:
  //   • cityhall (19.5,-45) fp x[17,22] z[-48,-42]: 8.5u east in x.
  //   • eduhistory (33,-40.5) fp x[31,35] z[-42.5,-38.5]: 4.5u south of
  //     police in z (z gap = -45 − (-42.5)). x overlap fine.
  //   • botcasino (52.5,-60) fp x[50,55] z[-62,-58]: 9u south of fire
  //     in z; 0.5u x overlap [50,50.5] but no actual collision (z clear).
  //   • Road z=-54 sidewalk z[-52.5,-51.7]: plaza shrunk 20×14→20×8 so
  //     its north edge z=-51 sits 0.7u south of the sidewalk; south edge
  //     z=-43 sits 0.5u north of eduhistory floor (z[-42.5,-34.5]).
  {
    id: "botpolice",
    label: "BotPolice Precinct",
    position: [33, 2.5, -47],
    color: "#1e3a8a",
    roofColor: "#94a3b8",
    width: 5,
    depth: 4,
    height: 5,
    emoji: "🚓",
  },
  {
    id: "botfire",
    label: "BotFire Station",
    position: [48, 2.5, -47],
    color: "#b91c1c",
    roofColor: "#f8fafc",
    width: 5,
    depth: 4,
    height: 5,
    emoji: "🚒",
  },
  // ─── BotGolf clubhouse @ (-62, 0, 75) ──────────────────────────────────
  // Clubhouse building. The fairway / greens / driving range are rendered
  // by CityDistricts.GolfCourse to the west and south of the clubhouse.
  {
    id: "botgolf",
    label: "BotGolf Country Club",
    // Relocated to the NW quadrant near BotFarm (-60,-61.5) — out of
    // the airport's footprint entirely. Decor anchor in CityDistricts
    // Extra.GolfCourse moves in tandem to (-38, 0, -85).
    position: [-58, 3, -85],
    color: "#ecfccb",
    roofColor: "#15803d",
    width: 5,
    depth: 4,
    height: 5,
    emoji: "⛳",
  },
  // ─── BotNational Park visitor center @ (-92, 0, -78) ──────────────────
  // Far SW corner. The mountains, pines and lake are rendered by
  // CityDistricts.NationalPark around this anchor.
  {
    id: "botpark",
    label: "BotNational Park",
    position: [-92, 3, -78],
    color: "#78350f",
    roofColor: "#14532d",
    width: 5,
    depth: 4,
    height: 4,
    emoji: "🏔️",
  },
  // ─── BotCourt kiosk @ (85, 0, -36) ──────────────────────────────────
  // South entrance of the tax-court plaza. District at (85, 0, -42) fp
  // x[73,97] z[-52,-32]; kiosk sits just south of plaza edge at z=-30.
  {
    id: "botcourt",
    label: "BotCourt (Tax Court)",
    position: [85, 1.5, -30],
    color: "#cbd5e1",
    roofColor: "#fbbf24",
    width: 1.8,
    depth: 1.8,
    height: 3,
    emoji: "⚖️",
  },
  // ─── BotInsurance kiosk @ (-85, 0, 87) ──────────────────────────────
  // South entrance, just outside Insurance plaza at z[89,105]. Sits in
  // the 4u gap between Airport/NatPark south edge (z=85) and the
  // Insurance plaza north edge (z=89).
  {
    id: "botinsurance",
    label: "BotInsurance HQ",
    position: [-85, 1.5, 87],
    color: "#1e40af",
    roofColor: "#f59e0b",
    width: 1.8,
    depth: 1.8,
    height: 3,
    emoji: "🛡️",
  },
  // ─── BotEnergy kiosk @ (41, 0, 85.5) ────────────────────────────────
  // North entrance to the solar/EV/wind plaza at z[87, 105]. Sits in
  // the 3u gap between MiddleSchool south edge (z=84) and the BotEnergy
  // plaza north edge (z=87).
  {
    id: "botenergy",
    label: "BotEnergy",
    position: [41, 1.5, 85.5],
    color: "#16a34a",
    roofColor: "#fbbf24",
    width: 1.8,
    depth: 1.8,
    height: 3,
    emoji: "⚡",
  },
  // ─── BotFactory kiosk @ (-15, 0, -63) ───────────────────────────────
  // South entrance to factory yard at z[-81, -65]. North of the yard;
  // gap to z=-54 secondary road sidewalk (-55.1) is 7.9u.
  {
    id: "botfactory",
    label: "BotFactory",
    position: [-15, 1.5, -63],
    color: "#7c2d12",
    roofColor: "#fbbf24",
    width: 1.8,
    depth: 1.8,
    height: 3,
    emoji: "🏭",
  },
  // ════════════════════════════════════════════════════════════════════
  // Task #2 — outer-ring financial-ed kiosks. 30 entries, 5 per quarter.
  // Positions match reserved lots in cityConstants.QUARTERS so each kiosk
  // sits on its themed paved square from ExpansionQuarters.ReservedLot.
  // Standard kiosk footprint: 1.8×1.8×3, y=1.5 — same as botstadium, etc.
  // Body/roof colors are themed to the quarter signpost color.
  // ════════════════════════════════════════════════════════════════════
  // ── Foundations 🧠 (cyan #22d3ee), centered (-90, -90) — pulled inward toward city ──
  { id: "botmint",        label: "BotMint",              position: [-90, 1.5, -90], color: "#22d3ee", roofColor: "#fbbf24", width: 1.8, depth: 1.8, height: 3, emoji: "💵" },
  { id: "botbudget",      label: "BotBudget Cafe",       position: [-90, 1.5, -98], color: "#06b6d4", roofColor: "#fde047", width: 1.8, depth: 1.8, height: 3, emoji: "📒" },
  { id: "botsavings",     label: "BotSavings Plaza",     position: [-90, 1.5, -82], color: "#0891b2", roofColor: "#fbbf24", width: 1.8, depth: 1.8, height: 3, emoji: "🐷" },
  { id: "botcreditbureau",label: "BotCredit Bureau",     position: [-82, 1.5, -90], color: "#0e7490", roofColor: "#22d3ee", width: 1.8, depth: 1.8, height: 3, emoji: "📇" },
  { id: "botbehavioral",  label: "BotBehavioral Lab",    position: [-98, 1.5, -90], color: "#155e75", roofColor: "#67e8f9", width: 1.8, depth: 1.8, height: 3, emoji: "🧠" },
  // ── Borrowing & Credit 💳 (pink #f472b6), centered (103, -103) ──
  { id: "botmortgage",    label: "BotMortgage Bank",     position: [103, 1.5, -103], color: "#f472b6", roofColor: "#fde047", width: 1.8, depth: 1.8, height: 3, emoji: "🏘️" },
  { id: "botstudentaid",  label: "BotStudentAid Office", position: [103, 1.5, -111], color: "#ec4899", roofColor: "#fef3c7", width: 1.8, depth: 1.8, height: 3, emoji: "🎓" },
  { id: "botautoloans",   label: "BotAuto Loans",        position: [103, 1.5, -95], color: "#db2777", roofColor: "#fbbf24", width: 1.8, depth: 1.8, height: 3, emoji: "🚙" },
  { id: "botpayday",      label: "BotPayday & Pawn",     position: [111, 1.5, -103], color: "#be185d", roofColor: "#fde047", width: 1.8, depth: 1.8, height: 3, emoji: "⏱️" },
  { id: "botbankruptcy",  label: "BotBankruptcy Court",  position: [95, 1.5, -103], color: "#9d174d", roofColor: "#f9a8d4", width: 1.8, depth: 1.8, height: 3, emoji: "⚖️" },
  // ── Investing 📈 (amber #fbbf24), centered (103, 103) ──
  { id: "botindex",       label: "BotIndex Funds",       position: [103, 1.5, 103], color: "#fbbf24", roofColor: "#1e3a8a", width: 1.8, depth: 1.8, height: 3, emoji: "📊" },
  { id: "botreit",        label: "BotREIT Tower",        position: [103, 1.5, 95], color: "#f59e0b", roofColor: "#7c2d12", width: 1.8, depth: 1.8, height: 4, emoji: "🏢" },
  { id: "botcommodities", label: "BotCommodities Pit",   position: [103, 1.5, 111], color: "#d97706", roofColor: "#fde047", width: 1.8, depth: 1.8, height: 3, emoji: "🌾" },
  { id: "botventure",     label: "BotVenture Capital",   position: [111, 1.5, 103], color: "#b45309", roofColor: "#22d3ee", width: 1.8, depth: 1.8, height: 3, emoji: "🚀" },
  { id: "botbonds",       label: "BotBonds Desk",        position: [95, 1.5, 103], color: "#92400e", roofColor: "#fde68a", width: 1.8, depth: 1.8, height: 3, emoji: "🧾" },
  // ── Life Events 💍 (purple #a78bfa), centered (-103, 135) — pushed south, away from airport ──
  { id: "botchapel",      label: "BotChapel",            position: [-103, 1.5, 135], color: "#a78bfa", roofColor: "#fbbf24", width: 1.8, depth: 1.8, height: 4, emoji: "💒" },
  { id: "botmaternity",   label: "BotMaternity Ward",    position: [-103, 1.5, 127], color: "#8b5cf6", roofColor: "#fce7f3", width: 1.8, depth: 1.8, height: 3, emoji: "👶" },
  { id: "botestate",      label: "BotEstate Office",     position: [-103, 1.5, 143], color: "#7c3aed", roofColor: "#1f2937", width: 1.8, depth: 1.8, height: 3, emoji: "⚰️" },
  { id: "bothealthplan",  label: "BotHealthPlan Clinic", position: [-95, 1.5, 135], color: "#6d28d9", roofColor: "#f8fafc", width: 1.8, depth: 1.8, height: 3, emoji: "🩺" },
  { id: "botdivorce",     label: "BotDivorce Mediation", position: [-111, 1.5, 135], color: "#5b21b6", roofColor: "#fda4af", width: 1.8, depth: 1.8, height: 3, emoji: "💔" },
  // ── Consumer & Behavioral 🛒 (green #34d399), strip z=-103 ──
  { id: "botconsumer",    label: "BotConsumer Protection",position: [-95, 1.5, -103], color: "#34d399", roofColor: "#1e293b", width: 1.8, depth: 1.8, height: 3, emoji: "🛡️" },
  { id: "botads",         label: "BotAds & Marketing",    position: [-40, 1.5, -103], color: "#10b981", roofColor: "#fbbf24", width: 1.8, depth: 1.8, height: 3, emoji: "📺" },
  { id: "botthrift",      label: "BotThrift & Resale",    position: [-13, 1.5, -103], color: "#059669", roofColor: "#fde68a", width: 1.8, depth: 1.8, height: 3, emoji: "♻️" },
  { id: "botgiving",      label: "BotGiving Foundation",  position: [40,  1.5, -103], color: "#047857", roofColor: "#fbbf24", width: 1.8, depth: 1.8, height: 3, emoji: "🎁" },
  { id: "botfintech",     label: "BotFinTech Hub",        position: [95,  1.5, -103], color: "#065f46", roofColor: "#22d3ee", width: 1.8, depth: 1.8, height: 3, emoji: "📱" },
  // ── Macro & Money 🌐 (orange #fb923c), strip z=103 ──
  { id: "botecon",        label: "BotEcon Lab",           position: [-95, 1.5, 103], color: "#fb923c", roofColor: "#1e3a8a", width: 1.8, depth: 1.8, height: 3, emoji: "🧪" },
  { id: "botforex",       label: "BotForex Exchange",     position: [-40, 1.5, 103], color: "#f97316", roofColor: "#fde047", width: 1.8, depth: 1.8, height: 3, emoji: "💱" },
  { id: "bottrade",       label: "BotTrade Hall",         position: [-13, 1.5, 103], color: "#ea580c", roofColor: "#22d3ee", width: 1.8, depth: 1.8, height: 3, emoji: "🌐" },
  { id: "botinflation",   label: "BotInflation Park",     position: [40,  1.5, 103], color: "#c2410c", roofColor: "#fef3c7", width: 1.8, depth: 1.8, height: 3, emoji: "🎈" },
  { id: "botpolicy",      label: "BotPolicyHall",         position: [95,  1.5, 103], color: "#9a3412", roofColor: "#fbbf24", width: 1.8, depth: 1.8, height: 4, emoji: "🏛️" },
];

const INTERACT_RADIUS = 4.5;

// Tall wayfinding beacon — sits on top of a building and pulses so the
// player can spot the building from anywhere in the city.
function WayfindingBeacon({
  position,
  label,
  color,
}: {
  position: [number, number, number];
  label: string;
  color: string;
}) {
  const beamRef = useRef<THREE.Mesh>(null!);
  const orbRef = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (beamRef.current) {
      const mat = beamRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.35 + Math.sin(t * 2) * 0.15;
    }
    if (orbRef.current) {
      orbRef.current.scale.setScalar(1 + Math.sin(t * 3) * 0.18);
      const mat = orbRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 2.2 + Math.sin(t * 3) * 0.8;
    }
  });
  const [x, baseY, z] = position;
  const beamHeight = 22;
  const beamCenterY = baseY + beamHeight / 2;
  const orbY = baseY + beamHeight + 0.4;
  return (
    <group>
      {/* Vertical light beam */}
      <mesh ref={beamRef} position={[x, beamCenterY, z]}>
        <cylinderGeometry args={[0.18, 0.45, beamHeight, 10, 1, true]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      {/* Pulsing orb at the top */}
      <mesh ref={orbRef} position={[x, orbY, z]}>
        <sphereGeometry args={[0.55, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.4} toneMapped={false} />
      </mesh>
      {/* Floating label high above */}
      <Text
        position={[x, orbY + 1.2, z]}
        fontSize={0.9}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.08}
        outlineColor={color}
      >
        🎓 {label}
      </Text>
    </group>
  );
}

export default function GameScene() {
  const playerPos = useRef(new THREE.Vector3(0, 0, 0));
  const playerMoving = useRef(false);
  const [nearBuilding, setNearBuilding] = useState<string | null>(null);
  const { visitedBuildings, openDialog, income, deductions, withheld, dialog, weather } = useGameStore();
  const fogParams = fogForWeather(weather);

  const handlePositionChange = useCallback(
    (pos: THREE.Vector3) => {
      playerPos.current.copy(pos);
      let closest: string | null = null;
      let closestDist = Infinity;
      for (const b of BUILDING_DEFS) {
        const bPos = new THREE.Vector3(b.position[0], 0, b.position[2]);
        const dist = new THREE.Vector3(pos.x, 0, pos.z).distanceTo(bPos);
        if (dist < INTERACT_RADIUS && dist < closestDist) {
          closest = b.id;
          closestDist = dist;
        }
      }
      setNearBuilding(closest);
    },
    []
  );

  const handleInteract = useCallback(
    (pos: THREE.Vector3) => {
      if (dialog) return;
      for (const b of BUILDING_DEFS) {
        const bPos = new THREE.Vector3(b.position[0], 0, b.position[2]);
        const dist = new THREE.Vector3(pos.x, 0, pos.z).distanceTo(bPos);
        if (dist < INTERACT_RADIUS) {
          const dialogFn = DIALOGS[b.id];
          if (dialogFn) {
            openDialog(dialogFn({ income, deductions, withheld, visitedBuildings }));
          }
          break;
        }
      }
    },
    [dialog, openDialog, income, deductions, withheld, visitedBuildings]
  );

  const buildings: BuildingData[] = BUILDING_DEFS.map((b) => ({
    ...b,
    visited: visitedBuildings.includes(b.id),
    available: true,
  }));

  return (
    <>
      <HUD />
      <DialogModal />
      <div className="w-full h-screen">
        <Canvas
          shadows
          camera={{ position: [0, 10, 14], fov: 55 }}
          gl={{ antialias: true }}
        >
          <color attach="background" args={[fogParams.background]} />
          <fog attach="fog" args={[fogParams.color, fogParams.near, fogParams.far]} />

          {/* Day/night cycle owns ambient, directional, and hemisphere
              lights so they can be interpolated by sun phase. */}
          <DayNightCycle />
          <pointLight position={[0, 8, 0]} intensity={2} color="#fbbf24" distance={20} />

          <FollowCamera target={playerPos} />
          <Skybox />
          <World />
          <RoadGrid />
          <CityDetails />
          <CityBuildings />
          <CityExpansion />
          <CityDistricts />
          <CityDistrictsExtra />
          <NewDistricts />
          <ExpansionQuarters />
          <KioskDecor />
          <Streetscape />
          <BuildingAccents />
          <DistrictDetails />
          <River />
          <ObservationTower />
          <AmbientLife />
          <CityHallPlaza />
          <Blimp />
          <Statues />
          <Landmarks />
          <Billboards />
          <NPCBots />
          <CitizenBots />
          <MoneyRain />
          <Weather mode={weather} />
          <Traffic />

          {buildings.map((b) => (
            <Building
              key={b.id}
              data={b}
              playerPos={playerPos.current}
              isNear={nearBuilding === b.id}
            />
          ))}

          {/* Wayfinding beacon for the tucked-away University building */}
          <WayfindingBeacon
            position={[-47.25, 8, -47.25]}
            label="MoneyBot U"
            color="#fbbf24"
          />


          <Player onPositionChange={handlePositionChange} onInteract={handleInteract} isMoving={playerMoving} />
        </Canvas>
      </div>
    </>
  );
}
