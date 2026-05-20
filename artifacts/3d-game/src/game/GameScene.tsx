import { useRef, useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { Sky } from "@react-three/drei";
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
          <color attach="background" args={["#87ceeb"]} />
          <fog attach="fog" args={["#c7e9f9", 40, 80]} />

          <Sky sunPosition={[100, 30, 100]} turbidity={0.3} rayleigh={0.5} />

          <ambientLight intensity={0.7} />
          <directionalLight
            position={[15, 20, 10]}
            intensity={1.5}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-far={80}
            shadow-camera-left={-30}
            shadow-camera-right={30}
            shadow-camera-top={30}
            shadow-camera-bottom={-30}
          />
          <hemisphereLight args={["#87ceeb", "#4ade80", 0.4]} />

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

          <Player onPositionChange={handlePositionChange} onInteract={handleInteract} />
        </Canvas>
      </div>
    </>
  );
}
