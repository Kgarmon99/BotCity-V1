import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface BuildingSpec {
  pos: [number, number, number];
  rotY: number;
  w: number;
  d: number;
  h: number;
  shape: "box" | "tower" | "dome" | "pyramid" | "cylinder";
  color: string;
  beaconColor: string;
}

function CityBuilding({ pos, rotY, w, d, h, shape, color, beaconColor }: BuildingSpec) {
  const beaconRef = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (beaconRef.current) {
      const mat = beaconRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 1.5 + Math.sin(state.clock.elapsedTime * 2 + pos[0]) * 0.8;
    }
  });

  const windows = Math.max(1, Math.floor(h / 1.6));

  return (
    <group position={pos} rotation={[0, rotY, 0]}>
      {/* Base trim */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[w + 0.2, 0.1, d + 0.2]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} toneMapped={false} />
      </mesh>

      {/* Main body */}
      {shape === "box" && (
        <mesh castShadow receiveShadow position={[0, h / 2, 0]}>
          <boxGeometry args={[w, h, d]} />
          <meshStandardMaterial color="#021410" emissive={color} emissiveIntensity={0.25} metalness={0.75} roughness={0.3} />
        </mesh>
      )}
      {shape === "tower" && (
        <>
          <mesh castShadow receiveShadow position={[0, h / 2, 0]}>
            <boxGeometry args={[w, h, d]} />
            <meshStandardMaterial color="#021410" emissive={color} emissiveIntensity={0.25} metalness={0.8} roughness={0.25} />
          </mesh>
          <mesh castShadow position={[0, h + 0.6, 0]}>
            <boxGeometry args={[w * 0.6, 1.2, d * 0.6]} />
            <meshStandardMaterial color="#021410" emissive={color} emissiveIntensity={0.4} metalness={0.8} />
          </mesh>
        </>
      )}
      {shape === "dome" && (
        <>
          <mesh castShadow receiveShadow position={[0, h / 2, 0]}>
            <cylinderGeometry args={[w / 2, w / 2, h, 12]} />
            <meshStandardMaterial color="#021410" emissive={color} emissiveIntensity={0.25} metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh castShadow position={[0, h, 0]}>
            <sphereGeometry args={[w / 2, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#021410" emissive={color} emissiveIntensity={0.4} metalness={0.85} roughness={0.2} />
          </mesh>
        </>
      )}
      {shape === "pyramid" && (
        <mesh castShadow receiveShadow position={[0, h / 2, 0]}>
          <coneGeometry args={[w * 0.7, h, 4]} />
          <meshStandardMaterial color="#021410" emissive={color} emissiveIntensity={0.3} metalness={0.85} roughness={0.25} />
        </mesh>
      )}
      {shape === "cylinder" && (
        <mesh castShadow receiveShadow position={[0, h / 2, 0]}>
          <cylinderGeometry args={[w / 2, w / 2 + 0.3, h, 12]} />
          <meshStandardMaterial color="#021410" emissive={color} emissiveIntensity={0.3} metalness={0.85} roughness={0.25} />
        </mesh>
      )}

      {/* Glowing window bands on front and back (faces the road via rotY) */}
      {(shape === "box" || shape === "tower" || shape === "dome") &&
        Array.from({ length: windows }).map((_, i) => (
          <mesh key={i} position={[0, 1 + i * 1.6, d / 2 + 0.02]}>
            <boxGeometry args={[w * 0.7, 0.3, 0.05]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.4} toneMapped={false} />
          </mesh>
        ))}
      {(shape === "box" || shape === "tower") &&
        Array.from({ length: windows }).map((_, i) => (
          <mesh key={`b-${i}`} position={[0, 1 + i * 1.6, -d / 2 - 0.02]}>
            <boxGeometry args={[w * 0.7, 0.3, 0.05]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.4} toneMapped={false} />
          </mesh>
        ))}

      {/* Door on the front (facing road) */}
      {(shape === "box" || shape === "tower" || shape === "dome") && (
        <>
          <mesh position={[0, 0.7, d / 2 + 0.03]} castShadow>
            <boxGeometry args={[Math.min(0.9, w * 0.25), 1.4, 0.06]} />
            <meshStandardMaterial color="#021410" emissive={color} emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[0, 1.5, d / 2 + 0.04]}>
            <boxGeometry args={[Math.min(1.1, w * 0.3), 0.06, 0.04]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} toneMapped={false} />
          </mesh>
        </>
      )}

      {/* Beacon */}
      <mesh ref={beaconRef} position={[0, h + (shape === "tower" ? 1.5 : shape === "pyramid" ? 0.3 : 0.6), 0]}>
        <sphereGeometry args={[0.25, 12, 12]} />
        <meshStandardMaterial color={beaconColor} emissive={beaconColor} emissiveIntensity={2} toneMapped={false} />
      </mesh>
    </group>
  );
}

// City block layout. Streets run at x=0,±18,±36 and z=0,±18,±36.
// Buildings sit inside blocks and have rotY so the "front" (door + brightest windows) faces the nearest road.
// A building at z<0 with door facing south (+z) → rotY = 0
// A building at z>0 with door facing north (-z) → rotY = π
// A building at x<0 with door facing east (+x) → rotY = -π/2
// A building at x>0 with door facing west (-x) → rotY = π/2

const buildings: BuildingSpec[] = [
  // INNER RING — buildings inside the 4 inner blocks, facing the main avenues
  // NW inner block (x<0, z<0): need to leave room for taxmart at (-9,-8)
  { pos: [-14, 0, -5],  rotY:  Math.PI / 2, w: 2.6, d: 3, h: 6, shape: "tower",    color: "#22d3ee", beaconColor: "#67e8f9" }, // faces east (+x toward main avenue x=0)
  { pos: [-5,  0, -14], rotY: 0,            w: 3, d: 2.6, h: 7, shape: "box",      color: "#a78bfa", beaconColor: "#c4b5fd" }, // faces south (+z toward main avenue z=0)

  // NE inner block (x>0, z<0): workcorp at (8,-10)
  { pos: [14, 0, -5],   rotY: -Math.PI / 2, w: 2.6, d: 3, h: 6, shape: "dome",      color: "#fbbf24", beaconColor: "#fde047" },
  { pos: [5,  0, -14],  rotY: 0,            w: 3, d: 2.6, h: 7, shape: "tower",    color: "#22c55e", beaconColor: "#4ade80" },

  // SW inner block (x<0, z>0): irs at (-9,9); BotPlane terminal + runway occupy the
  // z=10..16 strip so the inner filler at (-5, 14) was removed.
  { pos: [-14, 0, 5],   rotY:  Math.PI / 2, w: 2.6, d: 3, h: 6, shape: "cylinder", color: "#f472b6", beaconColor: "#f9a8d4" },

  // SE inner block (x>0, z>0): firstbank at (9,9); BotTrain station + tracks occupy
  // the z=10..16 strip so the inner filler at (5, 14) was removed.
  { pos: [14, 0, 5],    rotY: -Math.PI / 2, w: 2.6, d: 3, h: 6, shape: "tower",    color: "#22d3ee", beaconColor: "#67e8f9" },

  // MIDDLE RING — between secondary streets (±18) and outer ring (±36)
  // All offsets avoid main avenues (x=0, z=0) and secondary streets (x=±18, z=±18)
  // The four corners (±27, ±27) host the new districts (Stadium / Market / Beach /
  // Shops), so the adjacent fillers at (±27, ∓23) and (±23, ∓27) were removed
  // to clear room for them. See CityDistricts.tsx.
  // West column (x ≈ -27): face east (rotY = π/2) toward x=-18 street
  { pos: [-27, 0,  -9], rotY:  Math.PI / 2, w: 3.5, d: 4, h: 12, shape: "tower",   color: "#22c55e", beaconColor: "#4ade80" },
  { pos: [-27, 0,   9], rotY:  Math.PI / 2, w: 3.5, d: 4, h: 8,  shape: "dome",    color: "#f472b6", beaconColor: "#f9a8d4" },
  // East column (x ≈ 27)
  { pos: [ 27, 0,  -9], rotY: -Math.PI / 2, w: 3.5, d: 4, h: 9,  shape: "pyramid", color: "#22d3ee", beaconColor: "#67e8f9" },
  { pos: [ 27, 0,   9], rotY: -Math.PI / 2, w: 3.5, d: 4, h: 12, shape: "tower",   color: "#34d399", beaconColor: "#6ee7b7" },
  // North row (z ≈ -27): face south (rotY = 0).
  // The (-9, -27) filler was removed to make room for BotDealer showroom + lot
  // (see CityDistricts.tsx and BUILDING_DEFS in GameScene.tsx).
  { pos: [  9, 0, -27], rotY: 0,            w: 4, d: 3.5, h: 12, shape: "tower",   color: "#a78bfa", beaconColor: "#c4b5fd" },
  // South row (z ≈ 27). The (9, 27) filler was removed to clear the site
  // for LittleBots DayCare (see BUILDING_DEFS in GameScene.tsx).
  { pos: [ -9, 0,  27], rotY: Math.PI,      w: 4, d: 3.5, h: 11, shape: "box",     color: "#f472b6", beaconColor: "#f9a8d4" },

  // OUTER RING — beyond ±36 streets — taller skyscrapers, facing inward
  // West outer (x ≈ -41)
  { pos: [-41, 0, -23], rotY:  Math.PI / 2, w: 5, d: 5, h: 16, shape: "tower", color: "#22d3ee", beaconColor: "#67e8f9" },
  { pos: [-41, 0,  -9], rotY:  Math.PI / 2, w: 5, d: 5, h: 20, shape: "tower", color: "#22c55e", beaconColor: "#4ade80" },
  { pos: [-41, 0,   9], rotY:  Math.PI / 2, w: 5, d: 5, h: 18, shape: "tower", color: "#a78bfa", beaconColor: "#c4b5fd" },
  { pos: [-41, 0,  23], rotY:  Math.PI / 2, w: 5, d: 5, h: 14, shape: "dome",  color: "#f472b6", beaconColor: "#f9a8d4" },
  // East outer
  { pos: [ 41, 0, -23], rotY: -Math.PI / 2, w: 5, d: 5, h: 18, shape: "tower",   color: "#fbbf24", beaconColor: "#fde047" },
  { pos: [ 41, 0,  -9], rotY: -Math.PI / 2, w: 5, d: 5, h: 22, shape: "tower",   color: "#22c55e", beaconColor: "#4ade80" },
  { pos: [ 41, 0,   9], rotY: -Math.PI / 2, w: 5, d: 5, h: 16, shape: "pyramid", color: "#f472b6", beaconColor: "#f9a8d4" },
  { pos: [ 41, 0,  23], rotY: -Math.PI / 2, w: 5, d: 5, h: 19, shape: "tower",   color: "#34d399", beaconColor: "#6ee7b7" },
  // North outer
  { pos: [-23, 0, -41], rotY: 0, w: 5, d: 5, h: 17, shape: "tower", color: "#22d3ee", beaconColor: "#67e8f9" },
  { pos: [ -9, 0, -41], rotY: 0, w: 5, d: 5, h: 24, shape: "tower", color: "#22c55e", beaconColor: "#4ade80" },
  { pos: [  9, 0, -41], rotY: 0, w: 5, d: 5, h: 21, shape: "box",   color: "#fbbf24", beaconColor: "#fde047" },
  { pos: [ 23, 0, -41], rotY: 0, w: 5, d: 5, h: 16, shape: "dome",  color: "#a78bfa", beaconColor: "#c4b5fd" },
  // South outer
  { pos: [-23, 0,  41], rotY: Math.PI, w: 5, d: 5, h: 16, shape: "cylinder", color: "#a78bfa", beaconColor: "#c4b5fd" },
  { pos: [ -9, 0,  41], rotY: Math.PI, w: 5, d: 5, h: 23, shape: "tower",    color: "#22c55e", beaconColor: "#4ade80" },
  { pos: [  9, 0,  41], rotY: Math.PI, w: 5, d: 5, h: 17, shape: "dome",     color: "#34d399", beaconColor: "#6ee7b7" },
  { pos: [ 23, 0,  41], rotY: Math.PI, w: 5, d: 5, h: 20, shape: "tower",    color: "#fbbf24", beaconColor: "#fde047" },
];

export default function CityBuildings() {
  return (
    <group>
      {buildings.map((b, i) => (
        <CityBuilding key={`cb-${i}`} {...b} />
      ))}
    </group>
  );
}
