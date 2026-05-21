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
import CityDistricts from "./CityDistricts";
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
    // Real airports take a lot of land, so BotPlane has been moved out of the
    // inner-block grid and given an entire corner of the map. Terminal sits on
    // the far SW edge at (-50, *, 45); a 35-unit runway runs E-W behind it at
    // z=55, with apron + hangars rendered in CityExpansion. Empty corner —
    // nearest neighbors are botfarm at (-40, -41) (86u north) and botgigs at
    // (-55, 6) (39u north).
    position: [-75, 3, 67.5],
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
    label: "Underground BotMine",
    // Far W edge. Footprint x[-52.5..-47.5] z[-26.5..-23.5]. Player bound
    // ±64 → west edge at -52.5 leaves 11.5u for the mineshaft entrance
    // and ore piles. BotGigs at (-55, 6) is 31u south; nothing else
    // within 60u.
    position: [-75, 1.5, -37.5],
    color: "#44403c",
    roofColor: "#a16207",
    width: 5,
    depth: 3,
    height: 3,
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
    position: [-40.5, 1.5, -72],
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
    position: [40.5, 1.5, 30.75],
    color: "#f97316",
    roofColor: "#7c2d12",
    width: 1.8,
    depth: 1.8,
    height: 3,
    emoji: "🏀",
  },
  {
    // BotGallery — full building in the Art District at (-50, 0, 27),
    // far west, clear of z=18 and z=36 road bands (±1.1u each, both
    // 5.5u+ away). Surrounding sculpture garden + mural walls rendered
    // by CityDistricts.ArtDistrict. White modern facade w/ gold roof
    // accent matches museum-row siblings (bothistory, eduhistory).
    id: "botgallery",
    label: "BotGallery",
    position: [-75, 2.5, 40.5],
    color: "#f1f5f9",
    roofColor: "#fbbf24",
    width: 5,
    depth: 4,
    height: 5,
    emoji: "🎨",
  },
  {
    // BotFashion District — kiosk sign at south entrance of the runway
    // plaza at (-27, 0, 45). Plaza center x=-27 sits in the block
    // interior between x=-36 and x=-18 road bands. South of BotShops
    // (-27, 27) by 18u; north of BotKids (-6, 55) by 13u. Clears z=36
    // road band by 2.4u.
    id: "botfashion",
    label: "BotFashion District",
    position: [-40.5, 1.5, 59.25],
    color: "#ec4899",
    roofColor: "#f9a8d4",
    width: 1.8,
    depth: 1.8,
    height: 3,
    emoji: "👗",
  },
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
          <Streetscape />
          <BuildingAccents />
          <DistrictDetails />
          <River />
          <ObservationTower />
          <AmbientLife />
          <CityHallPlaza />
          <Blimp />
          <Statues />
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
