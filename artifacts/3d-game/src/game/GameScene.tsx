import { lazy, Suspense, useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import Player from "./Player";
import Building, { BuildingData } from "./Building";
import CityEditor from "./CityEditor";
import { effectiveXZ } from "./buildingLayout";
import { BUILDING_DEFS } from "./buildingDefs";
import World from "./World";
import FollowCamera from "./FollowCamera";
import HUD from "./HUD";
import DialogModal from "./DialogModal";
import Skybox from "./Skybox";
import Weather from "./Weather";
import { fogForWeather } from "./weatherFog";
import Traffic from "./Traffic";
import RoadGrid from "./RoadGrid";
import DayNightCycle from "./DayNightCycle";
import River from "./River";
import { useGameStore } from "./gameStore";
import { DIALOGS } from "./dialogs";

const NPCBots = lazy(() => import("./NPCBots"));
const CitizenBots = lazy(() => import("./CitizenBots"));
const Billboards = lazy(() => import("./Billboards"));
const CityDetails = lazy(() => import("./CityDetails"));
const Statues = lazy(() => import("./Statues"));
const CityBuildings = lazy(() => import("./CityBuildings"));
const CityExpansion = lazy(() => import("./CityExpansion"));
const Landmarks = lazy(() => import("./Landmarks"));
const CityDistricts = lazy(() => import("./CityDistricts"));
const CityDistrictsExtra = lazy(() => import("./CityDistrictsExtra"));
const NewDistricts = lazy(() => import("./NewDistricts"));
const ExpansionQuarters = lazy(() => import("./ExpansionQuarters"));
const KioskDecor = lazy(() => import("./KioskDecor"));
const CityHallPlaza = lazy(() => import("./CityHallPlaza"));
const CityMedia = lazy(() => import("./CityMedia"));
const DistrictGateways = lazy(() => import("./DistrictGateways"));
const Particles = lazy(() => import("./Particles"));
const Blimp = lazy(() => import("./Blimp"));
const Streetscape = lazy(() => import("./Streetscape"));
const BuildingAccents = lazy(() => import("./BuildingAccents"));
const ObservationTower = lazy(() => import("./ObservationTower"));
const AmbientLife = lazy(() => import("./AmbientLife"));
const BotLand = lazy(() => import("./BotLand"));
const GroundDetails = lazy(() => import("./GroundDetails"));
const StreetFurniture = lazy(() => import("./StreetFurniture"));

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

function useSceneryStage() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setStage(1), 150),
      window.setTimeout(() => setStage(2), 700),
      window.setTimeout(() => setStage(3), 1400),
      window.setTimeout(() => setStage(4), 2300),
      window.setTimeout(() => setStage(5), 3400),
    ];
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, []);

  return stage;
}

function DeferredScenery({ stage }: { stage: number }) {
  return (
    <Suspense fallback={null}>
      {stage >= 1 && (
        <>
          <GroundDetails />
          <StreetFurniture />
          <CityDetails />
          <CityBuildings />
          <Streetscape />
          <Billboards />
        </>
      )}
      {stage >= 2 && (
        <>
          <CityExpansion />
          <NewDistricts />
          <ExpansionQuarters />
          <DistrictGateways />
          <KioskDecor />
        </>
      )}
      {stage >= 3 && (
        <CityDistricts />
      )}
      {stage >= 4 && (
        <>
          <CityDistrictsExtra />
          <BuildingAccents />
          <CityHallPlaza />
          <CityMedia />
          <BotLand />
        </>
      )}
      {stage >= 5 && (
        <>
          <Particles />
          <ObservationTower />
          <AmbientLife />
          <Blimp />
          <Statues />
          <Landmarks />
          <NPCBots />
          <CitizenBots />
        </>
      )}
    </Suspense>
  );
}

export default function GameScene() {
  const playerPos = useRef(new THREE.Vector3(0, 0, 0));
  const playerMoving = useRef(false);
  const [nearBuilding, setNearBuilding] = useState<string | null>(null);
  const nearBuildingRef = useRef<string | null>(null);
  const { visitedBuildings, openDialog, income, deductions, withheld, dialog, weather } = useGameStore();
  const editMode = useGameStore((s) => s.editMode);
  const sceneryStage = useSceneryStage();
  const fogParams = fogForWeather(weather);
  // In Build Mode the camera sits high above the city (y≈360). The normal
  // fog far plane (110u) would swallow everything, so push fog way out and
  // clear the sky tint so the user can actually see the whole city.
  const sceneFog = editMode
    ? { color: "#0b1220", near: 200, far: 900, background: "#0b1220" }
    : fogParams;

  const cityLayout = useGameStore((s) => s.cityLayout);
  const selectedBuildingId = useGameStore((s) => s.selectedBuildingId);
  const hoverPos = useGameStore((s) => s.hoverPos);

  const handlePositionChange = useCallback(
    (pos: THREE.Vector3) => {
      playerPos.current.copy(pos);
      // Use a live snapshot (no re-render dep) so this stable callback still
      // sees the latest overrides without recreating Player on each drop.
      const { cityLayout: layout, selectedBuildingId: sel, hoverPos: hp } =
        useGameStore.getState();
      let closest: string | null = null;
      let closestDistSq = Infinity;
      for (const b of BUILDING_DEFS) {
        const [bx, bz] = effectiveXZ(b.position, b.id, layout, sel, hp);
        const dx = pos.x - bx;
        const dz = pos.z - bz;
        const distSq = dx * dx + dz * dz;
        if (distSq < INTERACT_RADIUS * INTERACT_RADIUS && distSq < closestDistSq) {
          closest = b.id;
          closestDistSq = distSq;
        }
      }
      if (nearBuildingRef.current !== closest) {
        nearBuildingRef.current = closest;
        setNearBuilding(closest);
      }
    },
    []
  );

  const handleInteract = useCallback(
    (pos: THREE.Vector3) => {
      if (dialog) return;
      const { cityLayout: layout, selectedBuildingId: sel, hoverPos: hp } =
        useGameStore.getState();
      for (const b of BUILDING_DEFS) {
        const [bx, bz] = effectiveXZ(b.position, b.id, layout, sel, hp);
        const dx = pos.x - bx;
        const dz = pos.z - bz;
        if (dx * dx + dz * dz < INTERACT_RADIUS * INTERACT_RADIUS) {
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

  const buildings: BuildingData[] = useMemo(() => BUILDING_DEFS.map((b) => {
    const [bx, bz] = effectiveXZ(b.position, b.id, cityLayout, selectedBuildingId, hoverPos);
    return {
      ...b,
      position: [bx, b.position[1], bz] as [number, number, number],
      visited: visitedBuildings.includes(b.id),
      available: true,
    };
  }), [cityLayout, hoverPos, selectedBuildingId, visitedBuildings]);

  return (
    <>
      <HUD />
      <DialogModal />
      <div className="w-full h-screen">
        <Canvas
          shadows={false}
          camera={{ position: [0, 10, 14], fov: 55, near: 0.5, far: 175 }}
          gl={{ antialias: false, powerPreference: "high-performance" }}
          dpr={[0.75, 1]}
          performance={{ min: 0.35 }}
          onCreated={({ gl }) => {
            // Cap pixel ratio defensively on retina/4K displays where
            // ~3000 draw calls × 4× pixel cost can crash the WebGL
            // context.
            gl.setPixelRatio(Math.min(window.devicePixelRatio, 1));
          }}
        >
          <color attach="background" args={[sceneFog.background]} />
          <fog attach="fog" args={[sceneFog.color, sceneFog.near, sceneFog.far]} />

          {/* Day/night cycle owns ambient, directional, and hemisphere
              lights so they can be interpolated by sun phase. */}
          <DayNightCycle />
          <pointLight position={[0, 8, 0]} intensity={2} color="#fbbf24" distance={20} />

          <FollowCamera target={playerPos} />
          <Skybox />
          <World />
          <RoadGrid />
          <River />
          <Weather mode={weather} />
          <Traffic />

          <DeferredScenery stage={sceneryStage} />

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


          <CityEditor />
          <Player onPositionChange={handlePositionChange} onInteract={handleInteract} isMoving={playerMoving} />
        </Canvas>
      </div>
    </>
  );
}
