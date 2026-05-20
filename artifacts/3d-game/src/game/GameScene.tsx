import { useRef, useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import Player from "./Player";
import Building, { BuildingData } from "./Building";
import World from "./World";
import FollowCamera from "./FollowCamera";
import HUD from "./HUD";
import DialogModal from "./DialogModal";
import { useGameStore } from "./gameStore";
import { DIALOGS } from "./dialogs";

const BUILDING_DEFS: Omit<BuildingData, "visited" | "available">[] = [
  {
    id: "workcorp",
    label: "WorkCorp",
    position: [8, 3, -10],
    color: "#2563eb",
    roofColor: "#1e40af",
    width: 5,
    depth: 4,
    height: 6,
    emoji: "💼",
  },
  {
    id: "taxmart",
    label: "TaxMart",
    position: [-9, 2, -8],
    color: "#dc2626",
    roofColor: "#991b1b",
    width: 6,
    depth: 5,
    height: 4,
    emoji: "🛒",
  },
  {
    id: "firstbank",
    label: "First Bank",
    position: [9, 2.5, 9],
    color: "#d97706",
    roofColor: "#92400e",
    width: 5,
    depth: 4,
    height: 5,
    emoji: "🏦",
  },
  {
    id: "irs",
    label: "IRS Office",
    position: [-9, 3, 9],
    color: "#7c3aed",
    roofColor: "#4c1d95",
    width: 5,
    depth: 4,
    height: 6,
    emoji: "📋",
  },
];

const INTERACT_RADIUS = 4.5;

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
          <fog attach="fog" args={["#052e16", 28, 70]} />

          <ambientLight intensity={0.45} color="#22c55e" />
          <directionalLight
            position={[15, 20, 10]}
            intensity={0.7}
            color="#86efac"
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-far={80}
            shadow-camera-left={-30}
            shadow-camera-right={30}
            shadow-camera-top={30}
            shadow-camera-bottom={-30}
          />
          <hemisphereLight args={["#4ade80", "#16a34a", 0.6]} />
          <pointLight position={[0, 8, 0]} intensity={2} color="#fbbf24" distance={20} />

          <FollowCamera target={playerPos} />
          <World />

          {buildings.map((b) => (
            <Building
              key={b.id}
              data={b}
              playerPos={playerPos.current}
              isNear={nearBuilding === b.id}
            />
          ))}

          <Player onPositionChange={handlePositionChange} onInteract={handleInteract} isMoving={playerMoving} />
        </Canvas>
      </div>
    </>
  );
}
