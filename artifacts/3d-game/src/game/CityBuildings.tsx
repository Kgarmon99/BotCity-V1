import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface BuildingSpec {
  pos: [number, number, number];
  w: number;
  d: number;
  h: number;
  shape: "box" | "tower" | "dome" | "pyramid" | "cylinder";
  color: string;
  beaconColor: string;
}

function CityBuilding({ pos, w, d, h, shape, color, beaconColor }: BuildingSpec) {
  const beaconRef = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (beaconRef.current) {
      const mat = beaconRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 1.5 + Math.sin(state.clock.elapsedTime * 2 + pos[0]) * 0.8;
    }
  });

  const windows = Math.max(1, Math.floor(h / 1.6));

  return (
    <group position={pos}>
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

      {/* Glowing window bands */}
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

      {/* Beacon */}
      <mesh ref={beaconRef} position={[0, h + (shape === "tower" ? 1.5 : shape === "pyramid" ? 0.3 : 0.6), 0]}>
        <sphereGeometry args={[0.25, 12, 12]} />
        <meshStandardMaterial color={beaconColor} emissive={beaconColor} emissiveIntensity={2} toneMapped={false} />
      </mesh>
    </group>
  );
}

// Outer-ring decorative buildings filling out the city. Avoid the interactive 4 (around ±9) and statue spots.
const buildings: BuildingSpec[] = [
  // Inner ring extra structures
  { pos: [-18, 0, -2], w: 3, d: 3, h: 8, shape: "tower", color: "#22d3ee", beaconColor: "#67e8f9" },
  { pos: [18, 0, -2], w: 3, d: 3, h: 9, shape: "tower", color: "#a78bfa", beaconColor: "#c4b5fd" },
  { pos: [-18, 0, 14], w: 3.5, d: 3.5, h: 7, shape: "dome", color: "#fbbf24", beaconColor: "#fde047" },
  { pos: [18, 0, 14], w: 3, d: 3, h: 7, shape: "pyramid", color: "#22c55e", beaconColor: "#4ade80" },
  { pos: [-18, 0, -14], w: 3, d: 3, h: 8, shape: "cylinder", color: "#f472b6", beaconColor: "#f9a8d4" },
  { pos: [18, 0, -14], w: 3, d: 3, h: 6, shape: "dome", color: "#34d399", beaconColor: "#6ee7b7" },

  // Outer ring — taller skyscrapers
  { pos: [-28, 0, -12], w: 4, d: 4, h: 14, shape: "tower", color: "#22d3ee", beaconColor: "#67e8f9" },
  { pos: [-28, 0, 4], w: 3.5, d: 3.5, h: 12, shape: "box", color: "#a78bfa", beaconColor: "#c4b5fd" },
  { pos: [-28, 0, 16], w: 4, d: 4, h: 16, shape: "tower", color: "#22c55e", beaconColor: "#4ade80" },
  { pos: [28, 0, -12], w: 3.5, d: 3.5, h: 13, shape: "tower", color: "#fbbf24", beaconColor: "#fde047" },
  { pos: [28, 0, 4], w: 4, d: 4, h: 11, shape: "dome", color: "#f472b6", beaconColor: "#f9a8d4" },
  { pos: [28, 0, 16], w: 3.5, d: 3.5, h: 15, shape: "tower", color: "#34d399", beaconColor: "#6ee7b7" },

  { pos: [-12, 0, -28], w: 4, d: 4, h: 14, shape: "tower", color: "#22d3ee", beaconColor: "#67e8f9" },
  { pos: [4, 0, -28], w: 3.5, d: 3.5, h: 12, shape: "pyramid", color: "#fbbf24", beaconColor: "#fde047" },
  { pos: [16, 0, -28], w: 4, d: 4, h: 16, shape: "tower", color: "#a78bfa", beaconColor: "#c4b5fd" },
  { pos: [-12, 0, 28], w: 3.5, d: 3.5, h: 13, shape: "cylinder", color: "#22c55e", beaconColor: "#4ade80" },
  { pos: [4, 0, 28], w: 4, d: 4, h: 11, shape: "box", color: "#f472b6", beaconColor: "#f9a8d4" },
  { pos: [16, 0, 28], w: 3.5, d: 3.5, h: 15, shape: "tower", color: "#34d399", beaconColor: "#6ee7b7" },

  // Far outer ring — mega skyline
  { pos: [-38, 0, -28], w: 5, d: 5, h: 20, shape: "tower", color: "#22d3ee", beaconColor: "#67e8f9" },
  { pos: [38, 0, -28], w: 5, d: 5, h: 22, shape: "tower", color: "#fbbf24", beaconColor: "#fde047" },
  { pos: [-38, 0, 28], w: 5, d: 5, h: 18, shape: "tower", color: "#a78bfa", beaconColor: "#c4b5fd" },
  { pos: [38, 0, 28], w: 5, d: 5, h: 24, shape: "tower", color: "#22c55e", beaconColor: "#4ade80" },
  { pos: [-38, 0, 0], w: 4, d: 4, h: 18, shape: "dome", color: "#f472b6", beaconColor: "#f9a8d4" },
  { pos: [38, 0, 0], w: 4, d: 4, h: 19, shape: "pyramid", color: "#34d399", beaconColor: "#6ee7b7" },
  { pos: [0, 0, -38], w: 5, d: 5, h: 23, shape: "tower", color: "#22c55e", beaconColor: "#4ade80" },
  { pos: [0, 0, 38], w: 5, d: 5, h: 21, shape: "tower", color: "#fbbf24", beaconColor: "#fde047" },
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
