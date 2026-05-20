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
import CityDetails from "./CityDetails";
import Statues from "./Statues";
import CityBuildings from "./CityBuildings";
import CityExpansion from "./CityExpansion";
import CityDistricts from "./CityDistricts";
import Blimp from "./Blimp";
import RoadGrid from "./RoadGrid";
import { useGameStore } from "./gameStore";
import { DIALOGS } from "./dialogs";

export const BUILDING_DEFS: Omit<BuildingData, "visited" | "available">[] = [
  {
    id: "workcorp",
    label: "WorkCorp",
    position: [8, 3, -10],
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
    position: [-9, 2, -8],
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
    position: [9, 2.5, 9],
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
    position: [-9, 3, 9],
    color: "#f87171",
    roofColor: "#ef4444",
    width: 5,
    depth: 4,
    height: 6,
    emoji: "📋",
  },
  {
    id: "university",
    label: "MoneyBot University",
    // NW inner-block corner — clear of roads (main x/z=0, secondary ±18) and other buildings.
    position: [-14, 4, -14],
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
    position: [14, 2.5, 12],
    color: "#fb923c",
    roofColor: "#7c2d12",
    width: 4,
    depth: 4,
    height: 5,
    emoji: "🚆",
  },
  {
    id: "botplane",
    label: "BotPlane Airport",
    // SW inner block. Building footprint x=-16..-12, z=10..14. Runway runs east-west
    // at z=15.5 alongside the terminal (clear of streets at x=-18 and z=18).
    position: [-14, 2.5, 12],
    color: "#38bdf8",
    roofColor: "#0c4a6e",
    width: 4,
    depth: 4,
    height: 5,
    emoji: "✈️",
  },
  // ─── Middle-ring district kiosks (entry markers for the 4 new districts) ───
  // Each kiosk sits at the south edge of its district at z = ∓20.5, in the
  // 2-unit gap between the secondary street z=±18 band (16.9..19.1 / -19.1..-16.9)
  // and the district structure starting at z = ∓21.5.
  {
    id: "botstadium",
    label: "BotStadium",
    position: [-27, 1.5, -20.5],
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
    position: [27, 1.5, -20.5],
    color: "#f97316",
    roofColor: "#fde68a",
    width: 1.8,
    depth: 1.8,
    height: 3,
    emoji: "🛍️",
  },
  {
    id: "botbeach",
    label: "BotBeach",
    position: [27, 1.5, 20.5],
    color: "#22d3ee",
    roofColor: "#fcd34d",
    width: 1.8,
    depth: 1.8,
    height: 3,
    emoji: "🏖️",
  },
  {
    id: "botshops",
    label: "BotShops",
    position: [-27, 1.5, 20.5],
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
    position: [13, 6, -13],
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
    position: [-40, 2, -41],
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
    position: [-9, 2.5, -27],
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
    position: [5, 2.5, -27],
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
    position: [-5, 2.5, 27],
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
    position: [27, 2.5, -5],
    color: "#f59e0b",
    roofColor: "#78350f",
    width: 5,
    depth: 4,
    height: 6,
    emoji: "₿",
  },
  {
    id: "botcharity",
    label: "BotCharity Center",
    // West middle ring. Offset south to clear the main avenue at z=0.
    // Footprint x[-29.5..-24.5] z[3..7].
    position: [-27, 2.5, 5],
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
    position: [6, 3, -55],
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
    position: [55, 3, -6],
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
    position: [-6, 3, 55],
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
    position: [-55, 3, 6],
    color: "#a855f7",
    roofColor: "#fde047",
    width: 6,
    depth: 6,
    height: 6,
    emoji: "🛵",
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
  const { visitedBuildings, openDialog, income, deductions, withheld, dialog } = useGameStore();

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
          <color attach="background" args={["#021410"]} />
          <fog attach="fog" args={["#052e16", 55, 160]} />

          <ambientLight intensity={0.45} color="#22c55e" />
          <directionalLight
            position={[15, 20, 10]}
            intensity={0.7}
            color="#86efac"
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-far={120}
            shadow-camera-left={-30}
            shadow-camera-right={30}
            shadow-camera-top={30}
            shadow-camera-bottom={-30}
          />
          <hemisphereLight args={["#4ade80", "#16a34a", 0.6]} />
          <pointLight position={[0, 8, 0]} intensity={2} color="#fbbf24" distance={20} />

          <FollowCamera target={playerPos} />
          <Skybox />
          <World />
          <RoadGrid />
          <CityDetails />
          <CityBuildings />
          <CityExpansion />
          <CityDistricts />
          <Blimp />
          <Statues />
          <Billboards />
          <NPCBots />
          <CitizenBots />
          <MoneyRain />

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
            position={[-14, 8, -14]}
            label="MoneyBot U"
            color="#fbbf24"
          />


          <Player onPositionChange={handlePositionChange} onInteract={handleInteract} isMoving={playerMoving} />
        </Canvas>
      </div>
    </>
  );
}
