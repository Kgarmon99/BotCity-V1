import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

// ─────────────────────────────────────────────────────────────────────
// 4 new districts at the middle-ring corners (±27, ±27).
// Middle ring blocks span x or z = 19.1..34.9 (and mirrors), so each
// district fits comfortably with ~7-unit clearance to the nearest road.
// Removed fillers: (±27, ∓23) and (±23, ∓27) in CityBuildings.tsx.
// ─────────────────────────────────────────────────────────────────────

// ===== Stadium @ (-27, 0, -27) =======================================
function Stadium() {
  const lightRef = useRef<THREE.Mesh>(null!);
  useFrame((s) => {
    if (lightRef.current) {
      const t = s.clock.elapsedTime;
      const mat = lightRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 1.6 + Math.sin(t * 5) * 0.6;
    }
  });
  return (
    <group position={[-27, 0, -27]}>
      {/* Outer ring of stands — open-topped cylinder shell */}
      <mesh position={[0, 1.6, 0]} castShadow>
        <cylinderGeometry args={[5, 5.5, 3.2, 32, 1, true]} />
        <meshStandardMaterial
          color="#1e293b"
          emissive="#3b82f6"
          emissiveIntensity={0.3}
          metalness={0.55}
          roughness={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Inner seats ring */}
      <mesh position={[0, 1.05, 0]}>
        <cylinderGeometry args={[4.2, 4.5, 2.1, 32, 1, true]} />
        <meshStandardMaterial
          color="#dc2626"
          emissive="#dc2626"
          emissiveIntensity={0.55}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Green field */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <circleGeometry args={[4, 32]} />
        <meshStandardMaterial color="#15803d" emissive="#22c55e" emissiveIntensity={0.45} />
      </mesh>
      {/* Center circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[0.9, 1, 32]} />
        <meshStandardMaterial color="#fde047" emissive="#fde047" emissiveIntensity={1.4} toneMapped={false} />
      </mesh>
      {/* Floodlight pylons at 4 corners */}
      {[[-4.2, -4.2], [4.2, -4.2], [-4.2, 4.2], [4.2, 4.2]].map(([x, z], i) => (
        <group key={`fl-${i}`} position={[x, 0, z]}>
          <mesh position={[0, 4, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.16, 8, 8]} />
            <meshStandardMaterial color="#0b1220" metalness={0.8} />
          </mesh>
          <mesh position={[0, 8.2, 0]}>
            <boxGeometry args={[0.85, 0.45, 0.35]} />
            <meshStandardMaterial
              color="#fef3c7"
              emissive="#fbbf24"
              emissiveIntensity={2.4}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}
      {/* Jumbotron suspended over center */}
      <mesh position={[0, 6.5, 0]}>
        <boxGeometry args={[2.6, 1.6, 2.6]} />
        <meshStandardMaterial color="#0b1220" emissive="#22c55e" emissiveIntensity={0.5} />
      </mesh>
      <mesh ref={lightRef} position={[0, 6.5, 1.31]}>
        <planeGeometry args={[2.3, 1.3]} />
        <meshStandardMaterial
          color="#22c55e"
          emissive="#22c55e"
          emissiveIntensity={1.8}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Stadium sign over the south entrance */}
      <Text
        position={[0, 4.4, 5.6]}
        fontSize={0.5}
        color="#fde047"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.04}
        outlineColor="#dc2626"
      >
        🏟️ BOTSTADIUM
      </Text>
    </group>
  );
}

// ===== Market @ (27, 0, -27) =========================================
function MarketStall({
  x,
  z,
  color,
  rotY = 0,
}: {
  x: number;
  z: number;
  color: string;
  rotY?: number;
}) {
  return (
    <group position={[x, 0, z]} rotation={[0, rotY, 0]}>
      {/* Counter */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[1.8, 1.2, 1.2]} />
        <meshStandardMaterial color="#3f3f46" roughness={0.7} />
      </mesh>
      {/* Posts */}
      {[
        [-0.85, -0.55],
        [0.85, -0.55],
        [-0.85, 0.55],
        [0.85, 0.55],
      ].map(([px, pz], i) => (
        <mesh key={`p-${i}`} position={[px, 1.05, pz]}>
          <boxGeometry args={[0.08, 1.7, 0.08]} />
          <meshStandardMaterial color="#1c1917" />
        </mesh>
      ))}
      {/* Striped awning */}
      <mesh position={[0, 1.95, 0]} castShadow>
        <boxGeometry args={[2.1, 0.1, 1.5]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.55}
        />
      </mesh>
      {/* Awning trim glow */}
      <mesh position={[0, 1.89, 0]}>
        <boxGeometry args={[2.15, 0.04, 0.2]} />
        <meshStandardMaterial
          color="#fef3c7"
          emissive="#fef3c7"
          emissiveIntensity={1.4}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function Market() {
  return (
    <group position={[27, 0, -27]}>
      {/* Plaza tiled floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <planeGeometry args={[11, 11]} />
        <meshStandardMaterial color="#451a03" emissive="#d97706" emissiveIntensity={0.18} />
      </mesh>
      {/* Stalls in a ring around the kiosk */}
      <MarketStall x={-3.8} z={-3.8} color="#ef4444" />
      <MarketStall x={3.8} z={-3.8} color="#facc15" />
      <MarketStall x={-3.8} z={3.8} color="#34d399" />
      <MarketStall x={3.8} z={3.8} color="#a78bfa" />
      <MarketStall x={0} z={-4.2} color="#f97316" rotY={Math.PI / 2} />
      <MarketStall x={0} z={4.2} color="#06b6d4" rotY={Math.PI / 2} />
      {/* Wooden crates scattered around */}
      {[
        [-2.4, 0.4, -1.6],
        [2.4, 0.4, -1.6],
        [-2.4, 0.4, 1.6],
        [2.4, 0.4, 1.6],
        [-2.4, 1.0, -1.6],
      ].map(([x, y, z], i) => (
        <mesh key={`crate-${i}`} position={[x, y, z]} castShadow>
          <boxGeometry args={[0.55, 0.6, 0.55]} />
          <meshStandardMaterial color="#92400e" roughness={0.9} />
        </mesh>
      ))}
      {/* Market sign over the south entrance */}
      <Text
        position={[0, 3.2, 5.4]}
        fontSize={0.5}
        color="#fde68a"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.04}
        outlineColor="#b45309"
      >
        🛍️ BOTMARKET
      </Text>
    </group>
  );
}

// ===== Beach @ (27, 0, 27) ===========================================
function PalmTree({ x, z, scale = 1 }: { x: number; z: number; scale?: number }) {
  return (
    <group position={[x, 0, z]} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 2, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.24, 4, 8]} />
        <meshStandardMaterial color="#78350f" roughness={0.9} />
      </mesh>
      {/* Fronds */}
      {[0, Math.PI / 3, (2 * Math.PI) / 3, Math.PI, (4 * Math.PI) / 3, (5 * Math.PI) / 3].map(
        (angle, i) => (
          <mesh
            key={`frond-${i}`}
            position={[Math.cos(angle) * 0.55, 4, Math.sin(angle) * 0.55]}
            rotation={[0, angle, -Math.PI / 4]}
            castShadow
          >
            <coneGeometry args={[0.32, 1.6, 6]} />
            <meshStandardMaterial color="#16a34a" emissive="#22c55e" emissiveIntensity={0.4} />
          </mesh>
        )
      )}
      {/* Coconut cluster */}
      <mesh position={[0, 4, 0]}>
        <sphereGeometry args={[0.22, 8, 8]} />
        <meshStandardMaterial color="#3f3f46" />
      </mesh>
    </group>
  );
}

function BeachUmbrella({ x, z, color }: { x: number; z: number; color: string }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 1.5, 8]} />
        <meshStandardMaterial color="#1c1917" />
      </mesh>
      <mesh position={[0, 1.55, 0]}>
        <coneGeometry args={[0.85, 0.4, 12]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function Beach() {
  return (
    <group position={[27, 0, 27]}>
      {/* Sand patch */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <planeGeometry args={[11, 11]} />
        <meshStandardMaterial
          color="#fef3c7"
          emissive="#fcd34d"
          emissiveIntensity={0.22}
          roughness={0.95}
        />
      </mesh>
      {/* Water strip along east side (toward outer street) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[4.8, 0.05, 0]}>
        <planeGeometry args={[2.5, 11]} />
        <meshStandardMaterial
          color="#0e7490"
          emissive="#22d3ee"
          emissiveIntensity={0.7}
          transparent
          opacity={0.85}
        />
      </mesh>
      {/* Palms */}
      <PalmTree x={-3.5} z={-3.5} />
      <PalmTree x={3.2} z={-3.5} scale={1.1} />
      <PalmTree x={-3.5} z={3.5} scale={0.9} />
      <PalmTree x={-4.2} z={0} />
      {/* Umbrellas */}
      <BeachUmbrella x={1.5} z={-1.5} color="#ef4444" />
      <BeachUmbrella x={-1} z={2} color="#f97316" />
      <BeachUmbrella x={2.5} z={2.5} color="#facc15" />
      {/* Beach ball */}
      <mesh position={[0.8, 0.42, -3]} castShadow>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#dc2626" emissive="#fde047" emissiveIntensity={0.5} />
      </mesh>
      {/* Beach sign */}
      <Text
        position={[0, 3.2, 5.4]}
        fontSize={0.5}
        color="#0c4a6e"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.04}
        outlineColor="#fde68a"
      >
        🏖️ BOTBEACH
      </Text>
    </group>
  );
}

// ===== BotShops cluster @ (-27, 0, 27) ===============================
function Shop({
  x,
  z,
  emoji,
  color,
  label,
}: {
  x: number;
  z: number;
  emoji: string;
  color: string;
  label: string;
}) {
  return (
    <group position={[x, 0, z]}>
      {/* Body */}
      <mesh position={[0, 1.25, 0]} castShadow>
        <boxGeometry args={[2.2, 2.5, 2.2]} />
        <meshStandardMaterial
          color="#0b1220"
          emissive={color}
          emissiveIntensity={0.45}
          metalness={0.5}
          roughness={0.4}
        />
      </mesh>
      {/* Roof cap */}
      <mesh position={[0, 2.6, 0]} castShadow>
        <boxGeometry args={[2.4, 0.2, 2.4]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} />
      </mesh>
      {/* Door */}
      <mesh position={[0, 0.8, 1.12]}>
        <boxGeometry args={[0.7, 1.4, 0.06]} />
        <meshStandardMaterial color="#0b1220" emissive={color} emissiveIntensity={0.55} />
      </mesh>
      {/* Window */}
      <mesh position={[0, 1.85, 1.12]}>
        <boxGeometry args={[1.4, 0.4, 0.06]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.6}
          toneMapped={false}
        />
      </mesh>
      {/* Emoji sign above the roof */}
      <Text
        position={[0, 3.25, 1.2]}
        fontSize={0.55}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.04}
        outlineColor={color}
      >
        {emoji}
      </Text>
      {/* Tiny label under emoji */}
      <Text
        position={[0, 2.85, 1.21]}
        fontSize={0.2}
        color={color}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.015}
        outlineColor="#0b1220"
      >
        {label}
      </Text>
    </group>
  );
}

function ShopsCluster() {
  return (
    <group position={[-27, 0, 27]}>
      {/* Plaza floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <planeGeometry args={[11, 11]} />
        <meshStandardMaterial color="#1e1b4b" emissive="#a855f7" emissiveIntensity={0.2} />
      </mesh>
      <Shop x={-3.5} z={-3.5} emoji="☕" color="#a16207" label="COFFEE" />
      <Shop x={3.5} z={-3.5} emoji="📚" color="#7c3aed" label="BOOKS" />
      <Shop x={-3.5} z={3.5} emoji="🍩" color="#ec4899" label="BAKERY" />
      <Shop x={3.5} z={3.5} emoji="💻" color="#0ea5e9" label="TECH" />
      <Shop x={0} z={-4.2} emoji="🎮" color="#22d3ee" label="GAMES" />
      <Shop x={0} z={4.2} emoji="🌸" color="#f43f5e" label="FLORIST" />
      {/* District sign */}
      <Text
        position={[0, 4.6, 5.4]}
        fontSize={0.5}
        color="#e9d5ff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.04}
        outlineColor="#7c3aed"
      >
        🏪 BOTSHOPS PLAZA
      </Text>
    </group>
  );
}

// ===== BotDealer @ (-9, 0, -27) ======================================
// Showroom is rendered by Building.tsx via BUILDING_DEFS; this component
// adds the parking lot, cars, flagpole, and signage around it. Cars sit
// south of the showroom in a parking lot from z=-26..-22.
export function BotMobile({
  pos,
  color,
  accent,
  taillight = "#ef4444",
}: {
  pos: [number, number, number];
  color: string;
  accent: string;
  taillight?: string;
}) {
  return (
    <group position={pos}>
      {/* Lower body */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[2, 0.55, 1.05]} />
        <meshStandardMaterial
          color={color}
          emissive={accent}
          emissiveIntensity={0.35}
          metalness={0.75}
          roughness={0.3}
        />
      </mesh>
      {/* Cabin / canopy */}
      <mesh position={[-0.1, 0.95, 0]} castShadow>
        <boxGeometry args={[1.2, 0.5, 0.92]} />
        <meshStandardMaterial
          color="#0b1220"
          emissive={accent}
          emissiveIntensity={0.55}
          metalness={0.5}
          roughness={0.35}
        />
      </mesh>
      {/* Front headlight bar */}
      <mesh position={[1.01, 0.45, 0]}>
        <boxGeometry args={[0.04, 0.12, 0.75]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={2.2}
          toneMapped={false}
        />
      </mesh>
      {/* Rear taillight bar */}
      <mesh position={[-1.01, 0.45, 0]}>
        <boxGeometry args={[0.04, 0.12, 0.75]} />
        <meshStandardMaterial
          color={taillight}
          emissive={taillight}
          emissiveIntensity={1.8}
          toneMapped={false}
        />
      </mesh>
      {/* Wheels */}
      {[
        [-0.7, -0.55],
        [0.7, -0.55],
        [-0.7, 0.55],
        [0.7, 0.55],
      ].map(([wx, wz], i) => (
        <mesh
          key={`wheel-${i}`}
          position={[wx, 0.22, wz]}
          rotation={[Math.PI / 2, 0, 0]}
          castShadow
        >
          <cylinderGeometry args={[0.22, 0.22, 0.18, 12]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

function Dealer() {
  const flagRef = useRef<THREE.Mesh>(null!);
  useFrame((s) => {
    if (flagRef.current) {
      flagRef.current.rotation.y = Math.sin(s.clock.elapsedTime * 1.6) * 0.25;
    }
  });
  return (
    <group position={[-9, 0, -27]}>
      {/* Parking lot tarmac — south of the showroom */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 3]}>
        <planeGeometry args={[7.5, 4]} />
        <meshStandardMaterial color="#1f2937" emissive="#4ade80" emissiveIntensity={0.12} />
      </mesh>
      {/* Parking line stripes (3 bays for 3 cars) */}
      {[-2.4, -0.8, 0.8, 2.4].map((x, i) => (
        <mesh
          key={`line-${i}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[x, 0.05, 3]}
        >
          <planeGeometry args={[0.08, 3.6]} />
          <meshStandardMaterial
            color="#fde047"
            emissive="#fde047"
            emissiveIntensity={1.5}
            toneMapped={false}
          />
        </mesh>
      ))}
      {/* 3 BotMobiles on display */}
      <BotMobile pos={[-1.6, 0, 3.5]} color="#22d3ee" accent="#67e8f9" />
      <BotMobile pos={[0, 0, 3.5]} color="#dc2626" accent="#fde047" />
      <BotMobile pos={[1.6, 0, 3.5]} color="#a78bfa" accent="#22c55e" />
      {/* Flagpole + waving flag */}
      <mesh position={[3.6, 4, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 8, 6]} />
        <meshStandardMaterial color="#0b1220" metalness={0.85} />
      </mesh>
      <mesh ref={flagRef} position={[3.6, 7.4, 0]}>
        <group position={[0.5, 0, 0]}>
          <mesh>
            <boxGeometry args={[1, 0.7, 0.04]} />
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#fbbf24"
              emissiveIntensity={1.2}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      </mesh>
      {/* Big neon dealer sign above the lot */}
      <Text
        position={[0, 5.8, 2.6]}
        fontSize={0.45}
        color="#fde047"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.04}
        outlineColor="#dc2626"
      >
        🚗 BOTDEALER 🚗
      </Text>
      <Text
        position={[0, 5.3, 2.6]}
        fontSize={0.22}
        color="#22d3ee"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#0b1220"
      >
        BotMobiles · 0% APR · No Money Down
      </Text>
    </group>
  );
}

export default function CityDistricts() {
  return (
    <group>
      <Stadium />
      <Market />
      <Beach />
      <ShopsCluster />
      <Dealer />
    </group>
  );
}
