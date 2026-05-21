import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { MoneyBotModel } from "./MoneyBotModel";
import { sound } from "./sound";

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

// ===== Beach — east edge of the world ================================
// A real beach with a vast ocean. Sand strip runs along the east edge of
// the inhabited area (x ∈ [37..52]) from z = 5 down to z = 65, and the
// ocean extends beyond it from x ≈ 53 out to x ≈ 72 (the playable ground
// ends at ±75). Stays clear of botbroker at (55, -6) by ~11u north.
// ===================================================================
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

function OceanWaves() {
  // Subtle shimmer on the giant water plane — modulates emissive intensity
  // so the ocean reads as "alive" without paying the cost of a real shader.
  const ref = useRef<THREE.MeshStandardMaterial>(null!);
  useFrame((state) => {
    if (ref.current) {
      ref.current.emissiveIntensity = 0.55 + Math.sin(state.clock.elapsedTime * 0.7) * 0.2;
    }
  });
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[62.5, 0.05, 25]}>
      <planeGeometry args={[20, 130, 1, 1]} />
      <meshStandardMaterial
        ref={ref}
        color="#0e7490"
        emissive="#22d3ee"
        emissiveIntensity={0.6}
        transparent
        opacity={0.9}
        roughness={0.25}
        metalness={0.4}
      />
    </mesh>
  );
}

function BeachChair({ x, z, rot = 0 }: { x: number; z: number; rot?: number }) {
  return (
    <group position={[x, 0, z]} rotation={[0, rot, 0]}>
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[0.55, 0.08, 1.2]} />
        <meshStandardMaterial color="#1e3a8a" emissive="#3b82f6" emissiveIntensity={0.25} />
      </mesh>
      <mesh position={[0, 0.7, -0.4]} rotation={[Math.PI / 4, 0, 0]} castShadow>
        <boxGeometry args={[0.55, 0.08, 0.6]} />
        <meshStandardMaterial color="#1e3a8a" emissive="#3b82f6" emissiveIntensity={0.25} />
      </mesh>
    </group>
  );
}

function Surfboard({ x, z, color, rot = 0 }: { x: number; z: number; color: string; rot?: number }) {
  return (
    <group position={[x, 0, z]} rotation={[0, rot, 0]}>
      <mesh position={[0, 0.7, 0]} rotation={[0, 0, -Math.PI / 2.3]} castShadow>
        <capsuleGeometry args={[0.18, 1.6, 6, 12]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} roughness={0.4} />
      </mesh>
    </group>
  );
}

function Beach() {
  // Sand strip footprint: x[37..52], z[5..65]. Pavilion (botbeach kiosk)
  // sits inside this at (44, 25).
  return (
    <group>
      {/* Giant sand strip along the east edge */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[44.5, 0.03, 35]}>
        <planeGeometry args={[15, 60]} />
        <meshStandardMaterial
          color="#fef3c7"
          emissive="#fcd34d"
          emissiveIntensity={0.18}
          roughness={0.95}
        />
      </mesh>
      {/* Wet-sand band where the surf laps the shore */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[51.5, 0.04, 30]}>
        <planeGeometry args={[2, 70]} />
        <meshStandardMaterial
          color="#d4a574"
          emissive="#fbbf24"
          emissiveIntensity={0.3}
          roughness={0.85}
        />
      </mesh>
      {/* The ocean — huge animated water plane reaching the world edge */}
      <OceanWaves />
      {/* Distant waves / breakers — a couple of darker emissive strips */}
      {[58, 65, 70].map((wx) => (
        <mesh
          key={`wave-${wx}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[wx, 0.07, 25]}
        >
          <planeGeometry args={[0.4, 110]} />
          <meshStandardMaterial
            color="#67e8f9"
            emissive="#a5f3fc"
            emissiveIntensity={0.9}
            transparent
            opacity={0.6}
            toneMapped={false}
          />
        </mesh>
      ))}
      {/* Palms scattered along the back of the beach */}
      <PalmTree x={39} z={10} scale={1.1} />
      <PalmTree x={38} z={20} />
      <PalmTree x={39} z={30} scale={1.15} />
      <PalmTree x={38} z={40} scale={0.95} />
      <PalmTree x={39} z={50} scale={1.05} />
      <PalmTree x={38} z={60} />
      <PalmTree x={42} z={5} scale={0.9} />
      <PalmTree x={43} z={64} scale={1.1} />
      {/* Umbrellas spread across the sand */}
      <BeachUmbrella x={45} z={15} color="#ef4444" />
      <BeachUmbrella x={47} z={22} color="#f97316" />
      <BeachUmbrella x={46} z={32} color="#facc15" />
      <BeachUmbrella x={48} z={42} color="#ec4899" />
      <BeachUmbrella x={45} z={55} color="#22c55e" />
      <BeachUmbrella x={47} z={60} color="#a855f7" />
      {/* Beach chairs facing the ocean */}
      <BeachChair x={49} z={18} rot={-Math.PI / 2} />
      <BeachChair x={49} z={28} rot={-Math.PI / 2} />
      <BeachChair x={49} z={38} rot={-Math.PI / 2} />
      <BeachChair x={49} z={48} rot={-Math.PI / 2} />
      <BeachChair x={49} z={58} rot={-Math.PI / 2} />
      {/* Surfboards staked into the sand */}
      <Surfboard x={41} z={15} color="#22d3ee" rot={0.3} />
      <Surfboard x={42} z={45} color="#f97316" rot={-0.2} />
      <Surfboard x={41} z={58} color="#ec4899" rot={0.4} />
      {/* Beach balls */}
      <mesh position={[46, 0.42, 50]} castShadow>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#dc2626" emissive="#fde047" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[44, 0.35, 35]} castShadow>
        <sphereGeometry args={[0.33, 16, 16]} />
        <meshStandardMaterial color="#22d3ee" emissive="#a855f7" emissiveIntensity={0.5} />
      </mesh>
      {/* Big oceanfront sign */}
      <Text
        position={[40, 4.5, 35]}
        rotation={[0, Math.PI / 2, 0]}
        fontSize={1.1}
        color="#0c4a6e"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.08}
        outlineColor="#fde68a"
      >
        🏖️ BOTBEACH
      </Text>
    </group>
  );
}

// ===== Rocket Station — far NE edge (50, 0, -50) =====================
// A periodic-launch pad way out in the empty NE corner. The rocket loops
// through idle → ignition → ascent → reset on a ~28-second cycle.
function RocketStation() {
  const rocketRef = useRef<THREE.Group>(null!);
  const flameRef = useRef<THREE.Mesh>(null!);
  const smokeRef = useRef<THREE.Mesh>(null!);
  const lightRef = useRef<THREE.PointLight>(null!);

  const CYCLE = 28; // seconds — full loop
  const IGNITE_AT = 18;
  const LIFTOFF_AT = 20;
  const APOGEE_AT = 28;
  const MAX_ALT = 80;

  useFrame((state) => {
    const t = state.clock.elapsedTime % CYCLE;
    let y = 0;
    let flameScale = 0;
    let smokeScale = 0;
    let lightIntensity = 0;
    if (t < IGNITE_AT) {
      // Idle
      y = 0;
      flameScale = 0;
      smokeScale = 0;
    } else if (t < LIFTOFF_AT) {
      // Ignition — flames build, smoke billows, rocket still on pad
      const k = (t - IGNITE_AT) / (LIFTOFF_AT - IGNITE_AT); // 0..1
      flameScale = k * 1.2;
      smokeScale = k * 2.5;
      lightIntensity = k * 8;
      y = Math.sin(state.clock.elapsedTime * 30) * 0.02 * k; // rumble
    } else if (t < APOGEE_AT) {
      // Ascent — quadratic so it accelerates upward
      const k = (t - LIFTOFF_AT) / (APOGEE_AT - LIFTOFF_AT); // 0..1
      y = k * k * MAX_ALT;
      flameScale = 1.3 + Math.sin(state.clock.elapsedTime * 25) * 0.2;
      smokeScale = 2.8;
      lightIntensity = 10;
    }
    if (rocketRef.current) rocketRef.current.position.y = y;
    // Rocket roar tracks flame intensity — silent on idle, ramps with
    // ignition, full roar during ascent, then fades on reset.
    sound.setRocket(Math.min(1, flameScale));
    if (flameRef.current) {
      flameRef.current.scale.set(flameScale, flameScale * 2, flameScale);
      flameRef.current.visible = flameScale > 0.05;
    }
    if (smokeRef.current) {
      smokeRef.current.scale.setScalar(Math.max(smokeScale, 0.001));
      smokeRef.current.visible = smokeScale > 0.05;
      const mat = smokeRef.current.material as THREE.MeshStandardMaterial;
      mat.opacity = Math.min(0.7, smokeScale * 0.3);
    }
    if (lightRef.current) lightRef.current.intensity = lightIntensity;
  });

  return (
    <group position={[50, 0, -50]}>
      {/* Concrete launch pad */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]} receiveShadow>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#3f3f46" roughness={0.9} />
      </mesh>
      {/* Pad ring (scorch ring around the launch point) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <ringGeometry args={[1.8, 3.2, 32]} />
        <meshStandardMaterial color="#18181b" emissive="#f97316" emissiveIntensity={0.3} />
      </mesh>
      {/* Flame trench (cross-shaped) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
        <planeGeometry args={[0.6, 6]} />
        <meshStandardMaterial color="#0b1220" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, Math.PI / 2]} position={[0, 0.06, 0]}>
        <planeGeometry args={[0.6, 6]} />
        <meshStandardMaterial color="#0b1220" />
      </mesh>
      {/* Gantry / launch tower — 4 leg trusses */}
      {[
        [1.4, 1.4],
        [-1.4, 1.4],
        [1.4, -1.4],
        [-1.4, -1.4],
      ].map(([gx, gz], i) => (
        <mesh key={`leg-${i}`} position={[gx, 6, gz]} castShadow>
          <boxGeometry args={[0.15, 12, 0.15]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.4} metalness={0.7} />
        </mesh>
      ))}
      {/* Cross bracing rings */}
      {[2, 5, 8, 11].map((cy) => (
        <group key={`brace-${cy}`} position={[0, cy, 0]}>
          <mesh position={[0, 0, 1.4]}>
            <boxGeometry args={[2.8, 0.1, 0.1]} />
            <meshStandardMaterial color="#92400e" emissive="#fbbf24" emissiveIntensity={0.4} />
          </mesh>
          <mesh position={[0, 0, -1.4]}>
            <boxGeometry args={[2.8, 0.1, 0.1]} />
            <meshStandardMaterial color="#92400e" emissive="#fbbf24" emissiveIntensity={0.4} />
          </mesh>
          <mesh position={[1.4, 0, 0]}>
            <boxGeometry args={[0.1, 0.1, 2.8]} />
            <meshStandardMaterial color="#92400e" emissive="#fbbf24" emissiveIntensity={0.4} />
          </mesh>
          <mesh position={[-1.4, 0, 0]}>
            <boxGeometry args={[0.1, 0.1, 2.8]} />
            <meshStandardMaterial color="#92400e" emissive="#fbbf24" emissiveIntensity={0.4} />
          </mesh>
        </group>
      ))}
      {/* Service walkway to rocket */}
      <mesh position={[0.75, 6, 0]}>
        <boxGeometry args={[1.5, 0.1, 0.4]} />
        <meshStandardMaterial color="#a16207" emissive="#fbbf24" emissiveIntensity={0.3} />
      </mesh>
      {/* THE ROCKET — animated via rocketRef.position.y */}
      <group ref={rocketRef} position={[0, 0, 0]}>
        {/* Main stage */}
        <mesh position={[0, 5, 0]} castShadow>
          <cylinderGeometry args={[0.75, 0.85, 10, 24]} />
          <meshStandardMaterial color="#f8fafc" emissive="#e2e8f0" emissiveIntensity={0.2} metalness={0.4} roughness={0.4} />
        </mesh>
        {/* Black stripes (orbital insignia band) */}
        <mesh position={[0, 7.5, 0]}>
          <cylinderGeometry args={[0.78, 0.78, 0.4, 24]} />
          <meshStandardMaterial color="#0b1220" />
        </mesh>
        {/* Red BotCity flag stripe */}
        <mesh position={[0, 3, 0]}>
          <cylinderGeometry args={[0.82, 0.86, 0.6, 24]} />
          <meshStandardMaterial color="#dc2626" emissive="#ef4444" emissiveIntensity={0.6} />
        </mesh>
        {/* Nose cone */}
        <mesh position={[0, 11, 0]} castShadow>
          <coneGeometry args={[0.75, 2.4, 24]} />
          <meshStandardMaterial color="#dc2626" emissive="#ef4444" emissiveIntensity={0.6} metalness={0.5} />
        </mesh>
        {/* Fins (4) */}
        {[0, 1, 2, 3].map((i) => (
          <mesh
            key={`fin-${i}`}
            position={[
              Math.cos((i * Math.PI) / 2) * 1,
              0.6,
              Math.sin((i * Math.PI) / 2) * 1,
            ]}
            rotation={[0, (i * Math.PI) / 2, 0]}
            castShadow
          >
            <boxGeometry args={[0.08, 1.2, 1]} />
            <meshStandardMaterial color="#475569" emissive="#1e293b" emissiveIntensity={0.4} />
          </mesh>
        ))}
        {/* Engine bell */}
        <mesh position={[0, -0.35, 0]} castShadow>
          <cylinderGeometry args={[0.55, 0.85, 0.7, 24]} />
          <meshStandardMaterial color="#27272a" metalness={0.85} roughness={0.3} />
        </mesh>
        {/* Flame — invisible by default, scaled up during ignition+ascent */}
        <mesh ref={flameRef} position={[0, -1.6, 0]} visible={false}>
          <coneGeometry args={[0.65, 2.2, 16, 1, true]} />
          <meshStandardMaterial
            color="#fde047"
            emissive="#f97316"
            emissiveIntensity={4}
            transparent
            opacity={0.85}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </mesh>
      </group>
      {/* Ground-level smoke billow during ignition (stays on the pad) */}
      <mesh ref={smokeRef} position={[0, 0.6, 0]} visible={false}>
        <sphereGeometry args={[1.3, 16, 12]} />
        <meshStandardMaterial
          color="#e5e7eb"
          emissive="#f3f4f6"
          emissiveIntensity={0.3}
          transparent
          opacity={0.4}
          roughness={1}
        />
      </mesh>
      {/* Ignition firelight (off when idle) */}
      <pointLight ref={lightRef} position={[0, 1, 0]} color="#f97316" distance={20} intensity={0} />
      {/* Big station sign */}
      <Text
        position={[0, 1.4, -5.5]}
        fontSize={0.9}
        color="#f97316"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.07}
        outlineColor="#0b1220"
      >
        🚀 BOTROCKET STATION
      </Text>
      <Text
        position={[0, 0.7, -5.5]}
        fontSize={0.32}
        color="#fbbf24"
        anchorX="center"
        anchorY="middle"
      >
        — Launches every 28 seconds —
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

// ===== BotFarm @ (-40, 0, -41) =======================================
// Far NW corner, outside the outer-ring streets. Barn is rendered by
// Building.tsx via BUILDING_DEFS at (-40, 2, -41), footprint w=5 d=4 →
// world x∈[-42.5,-37.5], z∈[-43,-39]. All farm decorations MUST stay
// inside the corner envelope:
//   world x ∈ [-44, -37.1]   (±44 player bound and clear of outer
//   world z ∈ [-44, -37.1]    street at x/z = -36, band -37.1..-34.9)
// → local x ∈ [-4, +2.9], local z ∈ [-3, +3.9] (group origin at -40,-41).
// Nearest landmarks: outer-ring building at (-41,-23) is 18u north; the
// statue at (-36,-36) sits at the road intersection, outside our zone.
function Farm() {
  const scarecrowRef = useRef<THREE.Mesh>(null!);
  const beaconRef = useRef<THREE.Mesh>(null!);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (scarecrowRef.current) {
      // Lazy turn — scarecrow swivels gently like it's surveying the field.
      scarecrowRef.current.rotation.y = Math.sin(t * 0.6) * 0.4;
    }
    if (beaconRef.current) {
      const mat = beaconRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 1.4 + Math.sin(t * 2.4) * 0.6;
    }
  });
  return (
    <group position={[-40, 0, -41]}>
      {/* ── Soil patch under the barn (darker brown so the barn pops) ── */}
      {/* 5×4 (matches barn footprint) → world x[-42.5,-37.5], z[-43,-39] */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[5, 4]} />
        <meshStandardMaterial color="#3f2a1d" emissive="#7c2d12" emissiveIntensity={0.12} />
      </mesh>

      {/* ── Crop fields surrounding the barn ───────────────────────── */}
      {/* South field — leafy green crops, between barn front and street.
          local z[+2.2,+3.8] → world z[-38.8,-37.2] ✓ (street starts -37.1) */}
      <group position={[0, 0, 3]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
          <planeGeometry args={[5, 1.6]} />
          <meshStandardMaterial color="#365314" emissive="#65a30d" emissiveIntensity={0.25} />
        </mesh>
        {/* Green crop rows (depth 1.4 keeps within field) */}
        {[-2, -1, 0, 1, 2].map((rx) => (
          <mesh key={`south-row-${rx}`} position={[rx * 0.85, 0.16, 0]}>
            <boxGeometry args={[0.35, 0.32, 1.4]} />
            <meshStandardMaterial color="#16a34a" emissive="#22c55e" emissiveIntensity={0.4} />
          </mesh>
        ))}
      </group>

      {/* North field — corn-yellow rows behind the barn.
          local z[-3,-2] → world z[-44,-43] ✓ (right at -44 bound) */}
      <group position={[0, 0, -2.5]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
          <planeGeometry args={[5, 1]} />
          <meshStandardMaterial color="#854d0e" emissive="#a16207" emissiveIntensity={0.2} />
        </mesh>
        {/* Yellow corn rows (depth 0.9 keeps within field) */}
        {[-2, -1, 0, 1, 2].map((rx) => (
          <mesh key={`north-row-${rx}`} position={[rx * 0.85, 0.18, 0]}>
            <boxGeometry args={[0.2, 0.4, 0.9]} />
            <meshStandardMaterial color="#fde047" emissive="#facc15" emissiveIntensity={0.5} toneMapped={false} />
          </mesh>
        ))}
      </group>

      {/* West field — fresh-tilled earth with sprouts.
          local x[-3.95,-2.55], z[-1.9,+1.9] → world x[-43.95,-42.55],
          z[-42.9,-39.1] ✓ (gap of 0.05 from barn left edge at -42.5) */}
      <group position={[-3.25, 0, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
          <planeGeometry args={[1.4, 3.8]} />
          <meshStandardMaterial color="#451a03" emissive="#78350f" emissiveIntensity={0.15} />
        </mesh>
        {/* Sprout dots — 3 cols × 4 rows, kept inside the 1.4×3.8 plot */}
        {Array.from({ length: 12 }).map((_, i) => {
          const x = ((i % 3) - 1) * 0.4;
          const z = (Math.floor(i / 3) - 1.5) * 0.8;
          return (
            <mesh key={`sprout-${i}`} position={[x, 0.12, z]}>
              <sphereGeometry args={[0.08, 6, 6]} />
              <meshStandardMaterial color="#4ade80" emissive="#22c55e" emissiveIntensity={0.6} />
            </mesh>
          );
        })}
      </group>

      {/* ── Silo — gray cylinder with conical roof, NW of the barn ── */}
      {/* local center (-3.15, -1.7), max radius 0.78 → world x min
          ≈-43.93 ✓ (≥0.05u margin from -44 bound); right edge ≈-42.37,
          clears barn left edge at -42.5 by 0.13u */}
      <group position={[-3.15, 0, -1.7]}>
        <mesh position={[0, 2.2, 0]} castShadow>
          <cylinderGeometry args={[0.7, 0.7, 4.4, 16]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.4} roughness={0.55} />
        </mesh>
        {/* Hoop bands (outer radius 0.72+0.04 = 0.76) */}
        {[0.6, 1.5, 2.4, 3.3, 4.2].map((y, i) => (
          <mesh key={`band-${i}`} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.72, 0.04, 6, 24]} />
            <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.35} />
          </mesh>
        ))}
        {/* Conical roof (radius 0.78) */}
        <mesh position={[0, 4.85, 0]} castShadow>
          <coneGeometry args={[0.78, 0.8, 16]} />
          <meshStandardMaterial color="#475569" metalness={0.5} roughness={0.4} />
        </mesh>
        {/* Beacon */}
        <mesh ref={beaconRef} position={[0, 5.45, 0]}>
          <sphereGeometry args={[0.12, 10, 10]} />
          <meshStandardMaterial color="#fde047" emissive="#fde047" emissiveIntensity={2} toneMapped={false} />
        </mesh>
      </group>

      {/* ── Scarecrow in the south field ───────────────────────────── */}
      {/* local (1.4, 0, 3), shirt width 0.55 → world x[-39.3,-38.3],
          z≈-38 ✓ (well inside corner envelope) */}
      <group position={[1.4, 0, 3]}>
        {/* Post */}
        <mesh position={[0, 0.9, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 1.8, 6]} />
          <meshStandardMaterial color="#78350f" roughness={0.8} />
        </mesh>
        {/* Crossbar (arms) */}
        <mesh position={[0, 1.4, 0]}>
          <boxGeometry args={[1.1, 0.06, 0.06]} />
          <meshStandardMaterial color="#78350f" roughness={0.8} />
        </mesh>
        {/* Shirt — turns with scarecrow */}
        <mesh ref={scarecrowRef} position={[0, 1.15, 0]} castShadow>
          <boxGeometry args={[0.55, 0.55, 0.25]} />
          <meshStandardMaterial color="#16a34a" emissive="#22c55e" emissiveIntensity={0.25} />
        </mesh>
        {/* Head — straw-stuffed pillow */}
        <mesh position={[0, 1.7, 0]} castShadow>
          <sphereGeometry args={[0.22, 12, 12]} />
          <meshStandardMaterial color="#fde68a" emissive="#fbbf24" emissiveIntensity={0.3} />
        </mesh>
        {/* Hat */}
        <mesh position={[0, 1.95, 0]} castShadow>
          <coneGeometry args={[0.28, 0.3, 12]} />
          <meshStandardMaterial color="#451a03" roughness={0.7} />
        </mesh>
      </group>

      {/* ── Wooden fence: 4 posts + 2 horizontal rails on the south edge ── */}
      {/* local z=+3.85 → world z=-37.15 (just inside street edge -37.1) */}
      {[-2, -0.7, 0.7, 2].map((fx, i) => (
        <mesh key={`fence-post-${i}`} position={[fx, 0.4, 3.85]} castShadow>
          <boxGeometry args={[0.12, 0.8, 0.12]} />
          <meshStandardMaterial color="#78350f" roughness={0.85} />
        </mesh>
      ))}
      <mesh position={[0, 0.55, 3.85]}>
        <boxGeometry args={[4.2, 0.08, 0.06]} />
        <meshStandardMaterial color="#92400e" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.25, 3.85]}>
        <boxGeometry args={[4.2, 0.08, 0.06]} />
        <meshStandardMaterial color="#92400e" roughness={0.8} />
      </mesh>

      {/* ── Big neon farm sign above the barn ─────────────────────── */}
      <Text
        position={[0, 5.4, 2.2]}
        fontSize={0.45}
        color="#fde047"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.04}
        outlineColor="#b91c1c"
      >
        🚜 BOTFARM 🌽
      </Text>
      <Text
        position={[0, 4.95, 2.2]}
        fontSize={0.2}
        color="#86efac"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#0b1220"
      >
        Schedule F · Fresh Crops · Section 179
      </Text>
    </group>
  );
}

// ===== MoneyBot Towers @ (13, 0, -13) ================================
// Futuristic HQ for MoneyBot Inc., occupying the NE inner block. Main
// interactive tower comes from BUILDING_DEFS (slate body, gold roof, h=12,
// footprint world x[11..15], z[-15..-11]). This component adds the second
// tower, sky bridge, rotating ring, holographic $ logo, plaza, and
// glowing facade chevrons. Decoration envelope:
//   world x ∈ [9.5, 16.5]  (clears workcorp east edge at 10.5; stays
//   world z ∈ [-16.5, -9.5] inside secondary streets at ±18 / ±16.9)
// → local x ∈ [-3.5, +3.5], local z ∈ [-3.5, +3.5]
function MoneyBotTowers() {
  const ringRef = useRef<THREE.Group>(null!);
  const logoRef = useRef<THREE.Group>(null!);
  const bridgeRef = useRef<THREE.Mesh>(null!);

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    // Slow horizontal ring spin around tower crown
    if (ringRef.current) ringRef.current.rotation.y = t * 0.4;
    // Holo logo bobs gently and spins to stay legible from every side
    if (logoRef.current) {
      logoRef.current.position.y = 15 + Math.sin(t * 1.2) * 0.3;
      logoRef.current.rotation.y = t * 0.7;
    }
    // Bridge underside pulses like a data stream
    if (bridgeRef.current) {
      const mat = bridgeRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 1.4 + Math.sin(t * 3) * 0.8;
    }
  });

  return (
    <group position={[13, 0, -13]}>
      {/* ── Plaza tiles around the towers (6×7 dark glass) ─────────── */}
      {/* Center local (+0.7, 0, -0.2), size 6×7 → world x[10.7,16.7] ✓
          (clears workcorp east edge at 10.5 by 0.2u), z[-16.7,-9.7] ✓
          (≥0.2u margin from secondary street at z=-16.9). */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.7, 0.02, -0.2]}>
        <planeGeometry args={[6, 7]} />
        <meshStandardMaterial
          color="#0f172a"
          emissive="#22c55e"
          emissiveIntensity={0.1}
          metalness={0.65}
          roughness={0.35}
        />
      </mesh>
      {/* Glowing grid lines on the plaza */}
      {[-2, 0.7, 3.4].map((u, i) => (
        <mesh key={`grid-x-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[u, 0.04, -0.2]}>
          <planeGeometry args={[0.05, 7]} />
          <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={1.2} toneMapped={false} />
        </mesh>
      ))}
      {[-2.7, -0.2, 2.3].map((v, i) => (
        <mesh key={`grid-z-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[0.7, 0.04, v]}>
          <planeGeometry args={[6, 0.05]} />
          <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={1.2} toneMapped={false} />
        </mesh>
      ))}

      {/* ── Vertical glow chevrons on main tower's south face ──────── */}
      {/* Main tower has depth=4 → front face at local z=+2. Chevrons sit
          0.05u proud to avoid z-fighting with the building skin. */}
      {[1, 3, 5, 7, 9, 11].map((y, i) => (
        <mesh key={`chev-${i}`} position={[0, y, 2.05]}>
          <boxGeometry args={[2.6, 0.18, 0.05]} />
          <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={1.3} toneMapped={false} />
        </mesh>
      ))}

      {/* ── Secondary tower — smaller, NE of main ──────────────────── */}
      {/* local (2.5, 0, -2.5) center, w=2, d=2 → footprint local
          x[1.5,3.5], z[-3.5,-1.5] → world x[14.5,16.5] ✓, z[-16.5,-14.5] ✓ */}
      <group position={[2.5, 0, -2.5]}>
        {/* Glass body */}
        <mesh position={[0, 4, 0]} castShadow>
          <boxGeometry args={[2, 8, 2]} />
          <meshStandardMaterial color="#1e293b" metalness={0.75} roughness={0.2} />
        </mesh>
        {/* Reflective window strip wraps the tower */}
        {[1, 3, 5, 7].map((y, i) => (
          <mesh key={`s-win-${i}`} position={[0, y, 1.01]}>
            <boxGeometry args={[1.8, 0.6, 0.04]} />
            <meshStandardMaterial color="#0ea5e9" emissive="#22d3ee" emissiveIntensity={0.7} metalness={0.8} roughness={0.15} />
          </mesh>
        ))}
        {/* Gold crown cap */}
        <mesh position={[0, 8.25, 0]}>
          <boxGeometry args={[2.3, 0.4, 2.3]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.7} metalness={0.6} roughness={0.3} />
        </mesh>
        {/* Cyan spire */}
        <mesh position={[0, 9.5, 0]}>
          <coneGeometry args={[0.3, 2, 6]} />
          <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={1.6} toneMapped={false} />
        </mesh>
        {/* Spire beacon */}
        <mesh position={[0, 10.6, 0]}>
          <sphereGeometry args={[0.12, 10, 10]} />
          <meshStandardMaterial color="#fde047" emissive="#fde047" emissiveIntensity={2.4} toneMapped={false} />
        </mesh>
      </group>

      {/* ── Sky bridge between the two towers ──────────────────────── */}
      {/* Diagonal between (0,0,0) and (2.5,0,-2.5). Midpoint (1.25,7.5,
          -1.25), rotated -π/4 around y so the box length aligns with the
          diagonal. Length 3.5 reaches into both tower bodies, hiding the
          end caps for a clean docked look. */}
      <group position={[1.25, 7.5, -1.25]} rotation={[0, -Math.PI / 4, 0]}>
        <mesh castShadow>
          <boxGeometry args={[3.5, 0.6, 0.8]} />
          <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.25} />
        </mesh>
        {/* Glowing underbelly — pulses like data flowing across */}
        <mesh ref={bridgeRef} position={[0, -0.32, 0]}>
          <boxGeometry args={[3.3, 0.05, 0.55]} />
          <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={1.4} toneMapped={false} />
        </mesh>
        {/* Side window strip */}
        <mesh position={[0, 0.05, 0.42]}>
          <boxGeometry args={[3.2, 0.25, 0.04]} />
          <meshStandardMaterial color="#0ea5e9" emissive="#22d3ee" emissiveIntensity={0.6} />
        </mesh>
      </group>

      {/* ── Rotating gold halo around main tower crown ─────────────── */}
      {/* Group y=13.2 sits 1.2u above tower roof (y=12). Torus radius
          2.8 → world x ∈ [10.2, 15.8] at y=13.2. Workcorp top is y=6,
          so no collision in 3D even though x=10.2 < workcorp east 10.5 */}
      <group ref={ringRef} position={[0, 13.2, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.8, 0.12, 10, 48]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#fbbf24"
            emissiveIntensity={1.6}
            metalness={0.75}
            roughness={0.2}
            toneMapped={false}
          />
        </mesh>
        {/* Two satellite nodes ride the ring for a stronger motion cue */}
        {[0, Math.PI].map((a, i) => (
          <mesh key={`sat-${i}`} position={[Math.cos(a) * 2.8, 0, Math.sin(a) * 2.8]}>
            <sphereGeometry args={[0.2, 12, 12]} />
            <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={2} toneMapped={false} />
          </mesh>
        ))}
      </group>

      {/* ── Official MoneyBot statue atop the towers ───────────────── */}
      {/* The logoRef group bobs and slowly rotates (handled in useFrame
          above). Inside: a glowing emerald pedestal disk and the real
          MoneyBot character GLB scaled up, playing the "UpPoint" anim
          like a HQ mascot pointing skyward. */}
      <group ref={logoRef} position={[0, 15, 0]}>
        {/* Glowing pedestal halo under the statue's feet */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
          <ringGeometry args={[1.4, 1.8, 36]} />
          <meshStandardMaterial
            color="#22c55e"
            emissive="#22c55e"
            emissiveIntensity={2.2}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </mesh>
        {/* The actual MoneyBot character — pointing up like a HQ mascot */}
        <MoneyBotModel scale={2.4} animation="UpPoint" />
      </group>

      {/* ── MONEYBOT TOWERS sign band above the main entrance ──────── */}
      <Text
        position={[0, 13.7, 2.1]}
        fontSize={0.5}
        color="#22c55e"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.04}
        outlineColor="#0b1220"
      >
        🏢 MONEYBOT TOWERS
      </Text>
      <Text
        position={[0, 13.1, 2.1]}
        fontSize={0.22}
        color="#fde047"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#0b1220"
      >
        Global HQ · Where the Money Lives
      </Text>
    </group>
  );
}

// ===== BotPort Harbor @ (50, 0, 48) =====================================
// Far SE coast. Harbor building is rendered by Building.tsx via BUILDING_DEFS
// at (50, 2, 48), footprint 6×5 → world x[47..53], z[45.5..50.5]. The
// decorations sit BETWEEN the harbor and the world edge (player bound ±64),
// so all props live east of x=53 (the "water" side) and immediately south.
//   world envelope used: x ∈ [47, 63], z ∈ [43, 62.5]
//   → local x ∈ [-3, +13], local z ∈ [-5, +14.5] (origin at 50, 48)
function Port() {
  const waveRef = useRef<THREE.Mesh>(null!);
  const beaconRef = useRef<THREE.Mesh>(null!);
  const ship1Ref = useRef<THREE.Group>(null!);
  const ship2Ref = useRef<THREE.Group>(null!);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    // Subtle vertical bob to sell the water surface.
    if (waveRef.current) {
      const mat = waveRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.18 + Math.sin(t * 1.3) * 0.06;
    }
    // Lighthouse beacon pulse.
    if (beaconRef.current) {
      const mat = beaconRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 2.2 + Math.sin(t * 2.5) * 1.4;
    }
    // Ships rock gently in place — small rotation around Z (roll).
    if (ship1Ref.current) ship1Ref.current.rotation.z = Math.sin(t * 0.7) * 0.04;
    if (ship2Ref.current) ship2Ref.current.rotation.z = Math.sin(t * 0.7 + 1.4) * 0.05;
  });
  return (
    <group position={[50, 0, 48]}>
      {/* ── Sea surface — wide plane east of the building (x≥4 local).
          Spans local x[4, 13] z[-5, 14], i.e. world x[54..63] z[43..62] */}
      <mesh ref={waveRef} rotation={[-Math.PI / 2, 0, 0]} position={[8.5, 0.04, 4.5]}>
        <planeGeometry args={[9, 19, 6, 6]} />
        <meshStandardMaterial color="#075985" emissive="#0ea5e9" emissiveIntensity={0.2} />
      </mesh>

      {/* ── Dock — wooden pier extending east from the harbor */}
      {/* Local center (3.5, 0.18, 0), 5×3 → world x[51..56] z[46.5..49.5] */}
      <mesh position={[3.5, 0.18, 0]}>
        <boxGeometry args={[5, 0.35, 3]} />
        <meshStandardMaterial color="#78350f" roughness={0.9} />
      </mesh>
      {/* Plank seams */}
      {[-1.5, -0.5, 0.5, 1.5].map((dx) => (
        <mesh key={`plank-${dx}`} position={[3.5 + dx, 0.36, 0]}>
          <boxGeometry args={[0.05, 0.02, 3]} />
          <meshStandardMaterial color="#451a03" />
        </mesh>
      ))}
      {/* Mooring bollards (3 short cylinders along the dock edge) */}
      {[-1.5, 0.5, 2.5].map((dx, i) => (
        <mesh key={`bollard-${i}`} position={[3.5 + dx, 0.55, 1.4]}>
          <cylinderGeometry args={[0.18, 0.22, 0.7, 8]} />
          <meshStandardMaterial color="#0f172a" metalness={0.5} roughness={0.5} />
        </mesh>
      ))}

      {/* ── Cargo ship #1 — red hull with container stack, moored north */}
      <group ref={ship1Ref} position={[8, 0.5, -2]}>
        {/* Hull */}
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[5, 0.8, 1.6]} />
          <meshStandardMaterial color="#b91c1c" metalness={0.3} roughness={0.6} />
        </mesh>
        {/* Bow taper (a small wedge) */}
        <mesh position={[2.8, 0.3, 0]} rotation={[0, 0, 0]}>
          <coneGeometry args={[0.85, 1.2, 4]} />
        </mesh>
        {/* Container stack (3×2 grid of bright boxes) */}
        {[-1.5, -0.5, 0.5, 1.5].map((cx) =>
          [-0.4, 0.4].map((cz) => (
            <mesh key={`c1-${cx}-${cz}`} position={[cx, 1.05, cz]}>
              <boxGeometry args={[0.85, 0.55, 0.65]} />
              <meshStandardMaterial
                color={["#0ea5e9", "#f97316", "#22c55e", "#fde047"][((cx + 1.5) * 2 + (cz > 0 ? 1 : 0)) % 4]}
                emissive="#000"
              />
            </mesh>
          ))
        )}
        {/* Bridge (small white cube near stern) */}
        <mesh position={[-2.2, 1.1, 0]}>
          <boxGeometry args={[0.7, 0.8, 1.2]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
      </group>

      {/* ── Cargo ship #2 — blue hull, smaller, south of dock */}
      <group ref={ship2Ref} position={[9, 0.5, 6]}>
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[4, 0.7, 1.4]} />
          <meshStandardMaterial color="#1d4ed8" metalness={0.3} roughness={0.6} />
        </mesh>
        {[-1.2, 0, 1.2].map((cx) => (
          <mesh key={`c2-${cx}`} position={[cx, 1, 0]}>
            <boxGeometry args={[0.95, 0.55, 0.85]} />
            <meshStandardMaterial color={cx === 0 ? "#fbbf24" : "#a855f7"} />
          </mesh>
        ))}
        <mesh position={[-1.6, 1.05, 0]}>
          <boxGeometry args={[0.6, 0.8, 1]} />
          <meshStandardMaterial color="#f1f5f9" />
        </mesh>
      </group>

      {/* ── Gantry crane — sits on the dock, hoists containers off ships */}
      <group position={[3.5, 0, 0]}>
        {/* 4 vertical legs */}
        {[[-1.8, -1], [1.8, -1], [-1.8, 1], [1.8, 1]].map(([lx, lz], i) => (
          <mesh key={`leg-${i}`} position={[lx, 2.5, lz]}>
            <boxGeometry args={[0.18, 5, 0.18]} />
            <meshStandardMaterial color="#fde047" emissive="#fde047" emissiveIntensity={0.3} toneMapped={false} />
          </mesh>
        ))}
        {/* Top beam */}
        <mesh position={[0, 5, 0]}>
          <boxGeometry args={[4, 0.25, 0.25]} />
          <meshStandardMaterial color="#fde047" emissive="#fde047" emissiveIntensity={0.3} toneMapped={false} />
        </mesh>
        {/* Trolley + hanging container */}
        <mesh position={[0.8, 4.8, 0]}>
          <boxGeometry args={[0.4, 0.3, 0.5]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0.8, 3.6, 0]}>
          <boxGeometry args={[0.04, 2, 0.04]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>
        <mesh position={[0.8, 2.7, 0]}>
          <boxGeometry args={[0.85, 0.55, 0.65]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
      </group>

      {/* ── Lighthouse — red+white stripes, at the very SE corner */}
      <group position={[10.5, 0, 11]}>
        {/* Base */}
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.85, 1, 1, 12]} />
          <meshStandardMaterial color="#cbd5e1" />
        </mesh>
        {/* Tower with banded look (alternating cylinders) */}
        {[0, 1, 2, 3].map((i) => (
          <mesh key={`band-${i}`} position={[0, 1.3 + i * 0.7, 0]}>
            <cylinderGeometry args={[0.55, 0.6, 0.7, 12]} />
            <meshStandardMaterial color={i % 2 === 0 ? "#f8fafc" : "#dc2626"} />
          </mesh>
        ))}
        {/* Lantern room */}
        <mesh position={[0, 4.4, 0]}>
          <cylinderGeometry args={[0.45, 0.45, 0.7, 12]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        {/* Pulsing beacon */}
        <mesh ref={beaconRef} position={[0, 4.5, 0]}>
          <sphereGeometry args={[0.3, 12, 12]} />
          <meshStandardMaterial color="#fde047" emissive="#fde047" emissiveIntensity={2.5} toneMapped={false} />
        </mesh>
        {/* Roof cone */}
        <mesh position={[0, 4.95, 0]}>
          <coneGeometry args={[0.5, 0.5, 12]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
      </group>

      {/* ── Big harbor sign on the dock side facing the city */}
      <Text
        position={[0, 5.5, -3]}
        fontSize={0.55}
        color="#fde047"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#0c4a6e"
      >
        ⚓ BOTPORT HARBOR
      </Text>
      <Text
        position={[0, 4.95, -3]}
        fontSize={0.24}
        color="#bae6fd"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#0b1220"
      >
        Cargo · Customs · HTS Classification
      </Text>
    </group>
  );
}

// ===== BotCasino @ (35, 0, -40) ========================================
// NE outer area. Casino building at (35, 4, -40), footprint 5×4 →
// world x[32.5..37.5], z[-42..-38]. Decorations live around the building:
//   world envelope used: x ∈ [29, 41], z ∈ [-45, -33.7]
//   → local x ∈ [-6, +6], local z ∈ [-5, +6.3] (origin at 35, -40)
//   The roulette table (center local z=5.2, radius 1.1) is the southernmost
//   prop; nothing else within 35u south of casino, so 6.3 is safe.
function Casino() {
  const signRef = useRef<THREE.Mesh>(null!);
  const wheelRef = useRef<THREE.Mesh>(null!);
  const bulb1Ref = useRef<THREE.Mesh>(null!);
  const bulb2Ref = useRef<THREE.Mesh>(null!);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (signRef.current) {
      const mat = signRef.current.material as THREE.MeshStandardMaterial;
      // Sign flickers between bright neon states.
      mat.emissiveIntensity = 2.2 + Math.sin(t * 3.1) * 1.1;
    }
    if (wheelRef.current) wheelRef.current.rotation.y = t * 1.8;
    // Two staggered blinking bulbs.
    if (bulb1Ref.current) {
      const mat = bulb1Ref.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = (Math.floor(t * 3) % 2) * 3;
    }
    if (bulb2Ref.current) {
      const mat = bulb2Ref.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = (Math.floor(t * 3 + 1.5) % 2) * 3;
    }
  });
  return (
    <group position={[35, 0, -40]}>
      {/* ── Red carpet leading south to the door */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 3.5]}>
        <planeGeometry args={[2.5, 5]} />
        <meshStandardMaterial color="#7f1d1d" emissive="#dc2626" emissiveIntensity={0.4} />
      </mesh>
      {/* Star pavement around carpet */}
      {[
        [-3, 4], [3, 4], [-4, 1], [4, 1], [-3, -2], [3, -2],
      ].map(([sx, sz], i) => (
        <mesh key={`star-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[sx, 0.05, sz]}>
          <circleGeometry args={[0.4, 5]} />
          <meshStandardMaterial color="#fde047" emissive="#fde047" emissiveIntensity={0.8} toneMapped={false} />
        </mesh>
      ))}

      {/* ── Giant rooftop neon sign (above the building) */}
      <mesh ref={signRef} position={[0, 9.5, 0]}>
        <boxGeometry args={[5, 1.6, 0.3]} />
        <meshStandardMaterial color="#dc2626" emissive="#ef4444" emissiveIntensity={2.5} toneMapped={false} />
      </mesh>
      <Text
        position={[0, 9.5, 0.18]}
        fontSize={1}
        color="#fde047"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.06}
        outlineColor="#7f1d1d"
      >
        🎰 CASINO
      </Text>
      {/* Blinking marquee bulbs flanking the sign */}
      <mesh ref={bulb1Ref} position={[-2.8, 9.5, 0.2]}>
        <sphereGeometry args={[0.18, 10, 10]} />
        <meshStandardMaterial color="#fde047" emissive="#fde047" emissiveIntensity={3} toneMapped={false} />
      </mesh>
      <mesh ref={bulb2Ref} position={[2.8, 9.5, 0.2]}>
        <sphereGeometry args={[0.18, 10, 10]} />
        <meshStandardMaterial color="#fde047" emissive="#fde047" emissiveIntensity={3} toneMapped={false} />
      </mesh>

      {/* ── Slot machines flanking the entrance (two of them) */}
      {[[-2.2, 2.8], [2.2, 2.8]].map(([sx, sz], i) => (
        <group key={`slot-${i}`} position={[sx, 0, sz]}>
          {/* Body */}
          <mesh position={[0, 0.9, 0]}>
            <boxGeometry args={[0.8, 1.8, 0.5]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.4} roughness={0.4} />
          </mesh>
          {/* Reel window */}
          <mesh position={[0, 1.2, 0.27]}>
            <boxGeometry args={[0.55, 0.45, 0.05]} />
            <meshStandardMaterial color="#0f172a" emissive="#22d3ee" emissiveIntensity={0.6} />
          </mesh>
          {/* Cherry decoration */}
          <mesh position={[0, 1.75, 0.28]}>
            <sphereGeometry args={[0.12, 8, 8]} />
            <meshStandardMaterial color="#dc2626" emissive="#ef4444" emissiveIntensity={0.8} toneMapped={false} />
          </mesh>
          {/* Lever */}
          <mesh position={[0.55, 1.1, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.6, 6]} />
            <meshStandardMaterial color="#dc2626" />
          </mesh>
          <mesh position={[0.55, 1.45, 0]}>
            <sphereGeometry args={[0.12, 10, 10]} />
            <meshStandardMaterial color="#fde047" metalness={0.7} />
          </mesh>
        </group>
      ))}

      {/* ── Spinning roulette wheel on a table near the entrance */}
      <group position={[0, 0, 5.2]}>
        {/* Table */}
        <mesh position={[0, 0.7, 0]}>
          <cylinderGeometry args={[1.1, 1.1, 0.2, 16]} />
          <meshStandardMaterial color="#14532d" emissive="#16a34a" emissiveIntensity={0.2} />
        </mesh>
        {/* Wheel — rotates around its Y axis */}
        <mesh ref={wheelRef} position={[0, 0.85, 0]}>
          <cylinderGeometry args={[0.85, 0.85, 0.12, 18]} />
          <meshStandardMaterial color="#7c2d12" metalness={0.5} roughness={0.5} />
        </mesh>
        {/* Alternating red/black wedges on top of the wheel */}
        {Array.from({ length: 18 }).map((_, i) => {
          const ang = (i / 18) * Math.PI * 2;
          return (
            <mesh
              key={`wedge-${i}`}
              position={[Math.cos(ang) * 0.6, 0.92, Math.sin(ang) * 0.6]}
            >
              <boxGeometry args={[0.18, 0.04, 0.18]} />
              <meshStandardMaterial color={i % 2 === 0 ? "#dc2626" : "#0f172a"} />
            </mesh>
          );
        })}
        {/* Center hub */}
        <mesh position={[0, 0.95, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.08, 10]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.8} />
        </mesh>
      </group>

      {/* ── Velvet rope stanchions flanking the carpet */}
      {[[-1.5, 1], [1.5, 1], [-1.5, 5], [1.5, 5]].map(([rx, rz], i) => (
        <mesh key={`rope-${i}`} position={[rx, 0.55, rz]}>
          <cylinderGeometry args={[0.08, 0.08, 1.1, 8]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

// ===== Underground BotMine @ (-50, 0, -25) ==============================
// Far W edge. Mine building at (-50, 1.5, -25), footprint 5×3 →
// world x[-52.5..-47.5], z[-26.5..-23.5]. The decorations sit around
// the building, mostly south where the rail-cart line runs into the
// open mine pit. Player bound is ±64 so the west prop edge stops at
// x ≈ -55. Local origin (-50, -25).
function Mine() {
  const cartRef = useRef<THREE.Group>(null!);
  const oreRef = useRef<THREE.Mesh>(null!);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    // Cart shuttles back and forth on its rail (E-W).
    if (cartRef.current) {
      const phase = (Math.sin(t * 0.6) + 1) / 2; // 0..1
      cartRef.current.position.x = -3 + phase * 4.5;
    }
    // Gold ore glows like it's freshly extracted.
    if (oreRef.current) {
      const mat = oreRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.8 + Math.sin(t * 2) * 0.3;
    }
  });
  return (
    <group position={[-50, 0, -25]}>
      {/* ── Dirt patch under the entire district ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.5, 0.02, 0]}>
        <planeGeometry args={[10, 8]} />
        <meshStandardMaterial color="#3f2a1d" emissive="#7c2d12" emissiveIntensity={0.08} />
      </mesh>

      {/* ── Mineshaft entrance — dark arch on the south face of the building */}
      <group position={[0, 0, 2.2]}>
        {/* Frame uprights (timber X-frame look) */}
        <mesh position={[-1.1, 1.2, 0]}>
          <boxGeometry args={[0.25, 2.4, 0.25]} />
          <meshStandardMaterial color="#451a03" roughness={0.95} />
        </mesh>
        <mesh position={[1.1, 1.2, 0]}>
          <boxGeometry args={[0.25, 2.4, 0.25]} />
          <meshStandardMaterial color="#451a03" roughness={0.95} />
        </mesh>
        {/* Lintel */}
        <mesh position={[0, 2.5, 0]}>
          <boxGeometry args={[2.6, 0.3, 0.3]} />
          <meshStandardMaterial color="#451a03" roughness={0.95} />
        </mesh>
        {/* Black opening — the pit */}
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[2, 2.3, 0.05]} />
          <meshStandardMaterial color="#0b0a08" emissive="#000" />
        </mesh>
        {/* Single warm bulb hanging inside the shaft */}
        <mesh position={[0, 2.1, 0.1]}>
          <sphereGeometry args={[0.12, 10, 10]} />
          <meshStandardMaterial color="#fde68a" emissive="#fbbf24" emissiveIntensity={2} toneMapped={false} />
        </mesh>
      </group>

      {/* ── Rail track — runs E-W south of the entrance, two parallel rails */}
      {[-0.18, 0.18].map((rz, i) => (
        <mesh key={`rail-${i}`} position={[-0.5, 0.12, 3.7 + rz]}>
          <boxGeometry args={[8, 0.06, 0.1]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.4} />
        </mesh>
      ))}
      {/* Wooden ties under the rails */}
      {[-4, -3, -2, -1, 0, 1, 2, 3].map((tx, i) => (
        <mesh key={`tie-${i}`} position={[-0.5 + tx * 0.5, 0.07, 3.7]}>
          <boxGeometry args={[0.3, 0.06, 0.6]} />
          <meshStandardMaterial color="#451a03" />
        </mesh>
      ))}

      {/* ── Mine cart — small wagon riding the rails */}
      <group ref={cartRef} position={[0, 0.4, 3.7]}>
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[0.9, 0.4, 0.6]} />
          <meshStandardMaterial color="#78350f" metalness={0.3} roughness={0.7} />
        </mesh>
        {/* Iron bands */}
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[0.94, 0.42, 0.04]} />
          <meshStandardMaterial color="#0f172a" metalness={0.7} />
        </mesh>
        {/* Wheels */}
        {[[-0.3, 0.3], [0.3, 0.3], [-0.3, -0.3], [0.3, -0.3]].map(([wx, wz], i) => (
          <mesh key={`wheel-${i}`} position={[wx, 0, wz]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.13, 0.13, 0.08, 10]} />
            <meshStandardMaterial color="#1f2937" metalness={0.6} />
          </mesh>
        ))}
        {/* Ore lump on top (one chunk of glowing gold) */}
        <mesh position={[0, 0.55, 0]}>
          <dodecahedronGeometry args={[0.18, 0]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fde047" emissiveIntensity={0.7} toneMapped={false} />
        </mesh>
      </group>

      {/* ── Ore pile — pyramid of glowing rocks south-west of the shaft.
          The lead chunk holds the animated ref; the smaller chunks are
          static decoration. */}
      <mesh ref={oreRef} position={[-3.5, 0.3, 2]}>
        <dodecahedronGeometry args={[0.45, 0]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fde047" emissiveIntensity={0.8} toneMapped={false} />
      </mesh>
      <mesh position={[-3.1, 0.25, 1.7]}>
        <dodecahedronGeometry args={[0.32, 0]} />
        <meshStandardMaterial color="#a16207" emissive="#facc15" emissiveIntensity={0.5} toneMapped={false} />
      </mesh>
      <mesh position={[-3.8, 0.22, 2.4]}>
        <dodecahedronGeometry args={[0.28, 0]} />
        <meshStandardMaterial color="#854d0e" emissive="#fbbf24" emissiveIntensity={0.5} toneMapped={false} />
      </mesh>

      {/* ── Conveyor belt — short angled ramp from pit toward sorting area */}
      <group position={[2.8, 0, 1.4]} rotation={[0, -0.4, 0]}>
        <mesh position={[0, 0.45, 0]} rotation={[0, 0, 0.18]}>
          <boxGeometry args={[2.5, 0.12, 0.8]} />
          <meshStandardMaterial color="#1f2937" metalness={0.4} roughness={0.6} />
        </mesh>
        {/* End rollers */}
        {[-1.2, 1.2].map((rx, i) => (
          <mesh key={`roller-${i}`} position={[rx, 0.45 + rx * 0.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.16, 0.16, 0.85, 12]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.7} />
          </mesh>
        ))}
        {/* Support legs */}
        <mesh position={[-1.2, 0.1, 0]}>
          <boxGeometry args={[0.1, 0.2, 0.85]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
        <mesh position={[1.2, 0.3, 0]}>
          <boxGeometry args={[0.1, 0.7, 0.85]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
      </group>

      {/* ── Crossed pickaxes sign above the entrance */}
      <Text
        position={[0, 4.2, 2.2]}
        fontSize={0.45}
        color="#fde047"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.04}
        outlineColor="#451a03"
      >
        ⛏️ BOTMINE
      </Text>
      <Text
        position={[0, 3.75, 2.2]}
        fontSize={0.2}
        color="#fef3c7"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#0b1220"
      >
        Copper · Lithium · Depletion Allowance
      </Text>
    </group>
  );
}

// ===== BotZoo & Park @ (-15, 0, 58) ====================================
// S edge near BotKids. Zoo gate building at (-15, 2.5, 58), footprint 6×4 →
// world x[-18..-12], z[56..60]. Park lawn + animal pens fan out NORTH of
// the gate (the south side is the world edge). Player bound ±64 → north
// envelope stops near z=48.
//   world envelope used: x ∈ [-22, -8], z ∈ [49, 60]
//   → local x ∈ [-7, +7], local z ∈ [-9, +2] (origin at -15, 58)
function Zoo() {
  const giraffeRef = useRef<THREE.Group>(null!);
  const monkeyRef = useRef<THREE.Mesh>(null!);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    // Giraffe head bobs slowly like it's chewing leaves.
    if (giraffeRef.current) {
      giraffeRef.current.rotation.x = Math.sin(t * 0.8) * 0.18;
    }
    // Monkey hops in place.
    if (monkeyRef.current) {
      monkeyRef.current.position.y = 0.6 + Math.abs(Math.sin(t * 2.5)) * 0.35;
    }
  });
  return (
    <group position={[-15, 0, 58]}>
      {/* ── Park lawn ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -3.5]}>
        <planeGeometry args={[13, 10]} />
        <meshStandardMaterial color="#166534" emissive="#22c55e" emissiveIntensity={0.18} />
      </mesh>

      {/* ── Tall entrance arch over the gate */}
      <group position={[0, 0, 1.6]}>
        {/* Left column */}
        <mesh position={[-3, 2.5, 0]}>
          <boxGeometry args={[0.45, 5, 0.45]} />
          <meshStandardMaterial color="#15803d" emissive="#22c55e" emissiveIntensity={0.18} />
        </mesh>
        {/* Right column */}
        <mesh position={[3, 2.5, 0]}>
          <boxGeometry args={[0.45, 5, 0.45]} />
          <meshStandardMaterial color="#15803d" emissive="#22c55e" emissiveIntensity={0.18} />
        </mesh>
        {/* Curved top — half-torus arching in X-Y plane between the columns
            (no rotation: default torus already sits in X-Y, so the half-arc
            sweeps from +X up over the top to -X like a rainbow). */}
        <mesh position={[0, 5, 0]}>
          <torusGeometry args={[3, 0.25, 8, 24, Math.PI]} />
          <meshStandardMaterial color="#fde047" emissive="#fbbf24" emissiveIntensity={0.6} toneMapped={false} />
        </mesh>
        {/* Hanging sign */}
        <Text
          position={[0, 5, 0.3]}
          fontSize={0.55}
          color="#15803d"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor="#fde047"
        >
          🦒 BOTZOO & PARK
        </Text>
        <Text
          position={[0, 4.4, 0.3]}
          fontSize={0.2}
          color="#bbf7d0"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#0b1220"
        >
          Conservation Easement · Charitable Trust Funded
        </Text>
      </group>

      {/* ── Giraffe pen (NW) ── */}
      <group position={[-4.5, 0, -4]}>
        {/* Body */}
        <mesh position={[0, 1.4, 0]}>
          <boxGeometry args={[1.4, 0.9, 0.7]} />
          <meshStandardMaterial color="#fbbf24" />
        </mesh>
        {/* Spots (a few dark patches) */}
        {[[-0.4, 1.5, 0.36], [0.3, 1.3, 0.36], [-0.1, 1.6, 0.36], [0.5, 1.5, 0.36]].map(([x, y, z], i) => (
          <mesh key={`spot-${i}`} position={[x, y, z]}>
            <boxGeometry args={[0.18, 0.18, 0.02]} />
            <meshStandardMaterial color="#7c2d12" />
          </mesh>
        ))}
        {/* Legs */}
        {[[-0.5, -0.3], [0.5, -0.3], [-0.5, 0.3], [0.5, 0.3]].map(([lx, lz], i) => (
          <mesh key={`gleg-${i}`} position={[lx, 0.5, lz]}>
            <boxGeometry args={[0.16, 1, 0.16]} />
            <meshStandardMaterial color="#fbbf24" />
          </mesh>
        ))}
        {/* Neck + head — bobs */}
        <group ref={giraffeRef} position={[0.6, 1.8, 0]}>
          <mesh position={[0, 0.7, 0]}>
            <boxGeometry args={[0.28, 1.6, 0.28]} />
            <meshStandardMaterial color="#fbbf24" />
          </mesh>
          <mesh position={[0.2, 1.55, 0]}>
            <boxGeometry args={[0.55, 0.35, 0.32]} />
            <meshStandardMaterial color="#fbbf24" />
          </mesh>
          {/* Ossicones */}
          <mesh position={[0.05, 1.85, 0.1]}>
            <cylinderGeometry args={[0.04, 0.04, 0.2, 6]} />
            <meshStandardMaterial color="#7c2d12" />
          </mesh>
          <mesh position={[0.05, 1.85, -0.1]}>
            <cylinderGeometry args={[0.04, 0.04, 0.2, 6]} />
            <meshStandardMaterial color="#7c2d12" />
          </mesh>
        </group>
      </group>

      {/* ── Elephant pen (NE) ── */}
      <group position={[4.5, 0, -4]}>
        {/* Body */}
        <mesh position={[0, 0.95, 0]}>
          <boxGeometry args={[1.7, 1.1, 1.1]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>
        {/* Head */}
        <mesh position={[0.95, 1.05, 0]}>
          <boxGeometry args={[0.6, 0.8, 0.85]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>
        {/* Trunk */}
        <mesh position={[1.4, 0.6, 0]}>
          <boxGeometry args={[0.7, 0.22, 0.22]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>
        {/* Ears */}
        <mesh position={[0.95, 1.3, 0.5]}>
          <boxGeometry args={[0.04, 0.5, 0.45]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
        <mesh position={[0.95, 1.3, -0.5]}>
          <boxGeometry args={[0.04, 0.5, 0.45]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
        {/* Legs */}
        {[[-0.6, -0.4], [0.5, -0.4], [-0.6, 0.4], [0.5, 0.4]].map(([lx, lz], i) => (
          <mesh key={`eleg-${i}`} position={[lx, 0.2, lz]}>
            <boxGeometry args={[0.3, 0.5, 0.3]} />
            <meshStandardMaterial color="#64748b" />
          </mesh>
        ))}
      </group>

      {/* ── Monkey perched on a low platform (center, hopping) ── */}
      <group position={[0, 0, -5.5]}>
        {/* Platform/rock */}
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.7, 0.85, 0.5, 10]} />
          <meshStandardMaterial color="#78716c" />
        </mesh>
        {/* Monkey body — hops */}
        <mesh ref={monkeyRef} position={[0, 0.6, 0]}>
          <sphereGeometry args={[0.35, 12, 12]} />
          <meshStandardMaterial color="#78350f" />
        </mesh>
        {/* Face patch (anchored to monkey position via a constant offset) */}
        <mesh position={[0, 0.65, 0.3]}>
          <sphereGeometry args={[0.15, 10, 10]} />
          <meshStandardMaterial color="#fef3c7" />
        </mesh>
      </group>

      {/* ── Conservation-easement tree cluster (NE corner — protected forest) ── */}
      {[
        [-6, -7, 1.4],
        [-5.2, -7.6, 1.2],
        [-6.5, -8.1, 1.5],
        [5.5, -7.5, 1.3],
        [6.3, -8, 1.5],
      ].map(([tx, tz, h], i) => (
        <group key={`tree-${i}`} position={[tx as number, 0, tz as number]}>
          {/* Trunk */}
          <mesh position={[0, (h as number) / 2, 0]}>
            <cylinderGeometry args={[0.12, 0.16, h as number, 6]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
          {/* Crown */}
          <mesh position={[0, (h as number) + 0.4, 0]}>
            <sphereGeometry args={[0.7, 10, 10]} />
            <meshStandardMaterial color="#15803d" emissive="#22c55e" emissiveIntensity={0.2} />
          </mesh>
        </group>
      ))}

      {/* ── White picket fence segments along the lawn edge ── */}
      {[-5, -3, 3, 5].map((fx, i) => (
        <group key={`fence-${i}`} position={[fx, 0, -0.6]}>
          {[-0.3, 0, 0.3].map((px, j) => (
            <mesh key={`picket-${i}-${j}`} position={[px, 0.35, 0]}>
              <boxGeometry args={[0.08, 0.7, 0.06]} />
              <meshStandardMaterial color="#f8fafc" />
            </mesh>
          ))}
          {/* Top rail */}
          <mesh position={[0, 0.55, 0]}>
            <boxGeometry args={[0.9, 0.05, 0.05]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ===== Soccer Stadium @ (-27, 0, -55) ================================
// Pitch 12x7 + grandstands on long sides + corner floodlight pylons +
// jumbotron. Center moved to x=-27 (block interior) so envelope clears
// both x=-36 and x=-18 road bands (±1.1u). South stand south edge at
// world z=-49.5; botsoccer kiosk at z=-48 sits just south with 0.6u gap.
function SoccerStadium() {
  const jumboRef = useRef<THREE.Mesh>(null!);
  useFrame((s) => {
    if (jumboRef.current) {
      const mat = jumboRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 1.4 + Math.sin(s.clock.elapsedTime * 4) * 0.5;
    }
  });
  return (
    <group position={[-27, 0, -55]}>
      {/* Pitch — green grass rectangle (12 wide x 7 deep) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]} receiveShadow>
        <planeGeometry args={[12, 7]} />
        <meshStandardMaterial color="#15803d" emissive="#22c55e" emissiveIntensity={0.4} />
      </mesh>
      {/* Center circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
        <ringGeometry args={[0.9, 1.0, 24]} />
        <meshStandardMaterial color="#f8fafc" emissive="#f8fafc" emissiveIntensity={1.2} toneMapped={false} />
      </mesh>
      {/* Halfway line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.055, 0]}>
        <planeGeometry args={[0.1, 7]} />
        <meshStandardMaterial color="#f8fafc" emissive="#f8fafc" emissiveIntensity={1} toneMapped={false} />
      </mesh>
      {/* Goals — chunky white box frames at both ends */}
      {[-6, 6].map((gx) => (
        <group key={`goal-${gx}`} position={[gx, 0, 0]}>
          {/* Posts */}
          {[-1.2, 1.2].map((pz) => (
            <mesh key={`post-${pz}`} position={[0, 0.8, pz]} castShadow>
              <cylinderGeometry args={[0.08, 0.08, 1.6, 6]} />
              <meshStandardMaterial color="#f8fafc" />
            </mesh>
          ))}
          {/* Crossbar */}
          <mesh position={[0, 1.6, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 2.4, 6]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
          {/* Net — translucent plane behind goal, tilted back */}
          <mesh
            position={[gx > 0 ? 0.5 : -0.5, 0.8, 0]}
            rotation={[0, gx > 0 ? -0.35 : 0.35, 0]}
          >
            <planeGeometry args={[2.4, 1.6]} />
            <meshStandardMaterial color="#e5e7eb" transparent opacity={0.35} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}
      {/* Grandstands — boxes on N and S sidelines, width 13 (env x[-33.5..-20.5]) */}
      {[-1, 1].map((dir) => (
        <group key={`stand-${dir}`} position={[0, 0, dir * 4.5]}>
          {/* Lower tier */}
          <mesh position={[0, 0.6, 0]} castShadow>
            <boxGeometry args={[13, 1.2, 1.2]} />
            <meshStandardMaterial color="#1e293b" emissive="#3b82f6" emissiveIntensity={0.35} />
          </mesh>
          {/* Upper tier (set back) */}
          <mesh position={[0, 1.8, dir * 0.4]} castShadow>
            <boxGeometry args={[13, 1.2, 1.0]} />
            <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={0.55} />
          </mesh>
          {/* Roof canopy */}
          <mesh position={[0, 2.8, dir * 0.45]} castShadow>
            <boxGeometry args={[13.4, 0.18, 1.4]} />
            <meshStandardMaterial color="#0b1220" metalness={0.5} />
          </mesh>
        </group>
      ))}
      {/* Floodlight pylons at 4 corners (env x[-33.5..-20.5]) */}
      {[[-6.5, -5.5], [6.5, -5.5], [-6.5, 5.5], [6.5, 5.5]].map(([x, z], i) => (
        <group key={`fl-${i}`} position={[x, 0, z]}>
          <mesh position={[0, 4.5, 0]} castShadow>
            <cylinderGeometry args={[0.12, 0.2, 9, 8]} />
            <meshStandardMaterial color="#0b1220" metalness={0.8} />
          </mesh>
          <mesh position={[0, 9.3, 0]}>
            <boxGeometry args={[1.1, 0.5, 0.4]} />
            <meshStandardMaterial
              color="#fef3c7"
              emissive="#fde047"
              emissiveIntensity={2.6}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}
      {/* Jumbotron suspended at the north end */}
      <mesh position={[0, 5.5, -6.2]} castShadow>
        <boxGeometry args={[3.4, 2, 0.4]} />
        <meshStandardMaterial color="#0b1220" />
      </mesh>
      <mesh ref={jumboRef} position={[0, 5.5, -5.98]}>
        <planeGeometry args={[3.1, 1.7]} />
        <meshStandardMaterial
          color="#22c55e"
          emissive="#22c55e"
          emissiveIntensity={1.6}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Stadium name sign over the south entrance (toward the kiosk at z=-48) */}
      <Text
        position={[0, 4.6, 6.2]}
        fontSize={0.5}
        color="#bbf7d0"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.04}
        outlineColor="#15803d"
      >
        ⚽ BOTSOCCER STADIUM
      </Text>
    </group>
  );
}

// ===== Basketball Arena @ (27, 0, 27) ================================
// Domed indoor arena: tapered cylinder shell + glowing emissive dome cap +
// glass entrance + a small outdoor practice half-court tucked beside the
// south entrance so players can SEE basketball even though the arena
// interior is implicit. Footprint dome radius 5 → envelope ~10x10 plus
// the half-court strip extending ~3u south.
function BasketballArena() {
  const domeRef = useRef<THREE.Mesh>(null!);
  useFrame((s) => {
    if (domeRef.current) {
      const mat = domeRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.5 + Math.sin(s.clock.elapsedTime * 1.4) * 0.18;
    }
  });
  return (
    <group position={[27, 0, 27]}>
      {/* Cylindrical arena wall */}
      <mesh position={[0, 2, 0]} castShadow>
        <cylinderGeometry args={[5, 5.3, 4, 28]} />
        <meshStandardMaterial color="#7c2d12" emissive="#f97316" emissiveIntensity={0.35} metalness={0.4} roughness={0.55} />
      </mesh>
      {/* Glowing geodesic-feel dome (half-sphere) */}
      <mesh ref={domeRef} position={[0, 4, 0]} castShadow>
        <sphereGeometry args={[5, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#f97316"
          emissive="#fb923c"
          emissiveIntensity={0.55}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      {/* Dome seam rings — three thin emissive bands for that arena look */}
      {[1.4, 2.7, 3.8].map((y, i) => (
        <mesh key={`band-${i}`} position={[0, 4 + y, 0]}>
          <torusGeometry args={[Math.sqrt(Math.max(0.01, 25 - y * y)), 0.06, 8, 32]} />
          <meshStandardMaterial color="#fde047" emissive="#fde047" emissiveIntensity={1.4} toneMapped={false} />
        </mesh>
      ))}
      {/* Glass entrance facing south (toward the kiosk at z=20.5) */}
      <mesh position={[0, 1.4, 5.05]}>
        <boxGeometry args={[2.4, 2.8, 0.15]} />
        <meshStandardMaterial
          color="#0ea5e9"
          emissive="#22d3ee"
          emissiveIntensity={1.2}
          metalness={0.5}
          roughness={0.2}
          transparent
          opacity={0.7}
        />
      </mesh>
      {/* Top finial — basketball-orange sphere with a thin seam ring */}
      <mesh position={[0, 9.2, 0]}>
        <sphereGeometry args={[0.45, 16, 12]} />
        <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={1.1} toneMapped={false} />
      </mesh>
      {/* Outdoor half-court tucked SW of the arena entrance */}
      <group position={[-5, 0, 5.5]}>
        {/* Court surface */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]} receiveShadow>
          <planeGeometry args={[4.5, 3.2]} />
          <meshStandardMaterial color="#b45309" emissive="#f97316" emissiveIntensity={0.25} />
        </mesh>
        {/* Free-throw line */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, -0.4]}>
          <planeGeometry args={[2, 0.06]} />
          <meshStandardMaterial color="#f8fafc" emissive="#f8fafc" emissiveIntensity={1} toneMapped={false} />
        </mesh>
        {/* Hoop pole + backboard + rim */}
        <group position={[0, 0, -1.4]}>
          <mesh position={[0, 1.5, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.1, 3, 6]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} />
          </mesh>
          <mesh position={[0, 2.9, 0.18]} castShadow>
            <boxGeometry args={[1.2, 0.8, 0.06]} />
            <meshStandardMaterial color="#f8fafc" emissive="#f8fafc" emissiveIntensity={0.6} />
          </mesh>
          <mesh position={[0, 2.55, 0.45]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.2, 0.03, 6, 16]} />
            <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={1.4} toneMapped={false} />
          </mesh>
        </group>
        {/* Basketball on the court */}
        <mesh position={[0.5, 0.25, 0.6]} castShadow>
          <sphereGeometry args={[0.22, 14, 10]} />
          <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={0.5} roughness={0.6} />
        </mesh>
      </group>
      {/* Arena name sign over the south entrance */}
      <Text
        position={[0, 5.8, 5.2]}
        fontSize={0.5}
        color="#fed7aa"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.04}
        outlineColor="#7c2d12"
      >
        🏀 BOTHOOPS ARENA
      </Text>
    </group>
  );
}

// ===== Art District @ around (-50, 0, 27) ============================
// Surrounds the BotGallery building (rendered by BUILDING_DEFS) with a
// sculpture garden + mural walls + painters' easels. The gallery itself
// occupies x[-52.5..-47.5], z[25..29]; decor sits in a ring around it
// from x[-58..-42], z[20..34], clear of z=18 road (5.5u south) and
// z=36 road (1.7u north of the district sign).
function ArtDistrict() {
  const torusRef = useRef<THREE.Mesh>(null!);
  useFrame((s) => {
    if (torusRef.current) torusRef.current.rotation.y = s.clock.elapsedTime * 0.3;
  });
  return (
    <group position={[-50, 0, 27]}>
      {/* Polished marble plaza floor around the gallery */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]} receiveShadow>
        <planeGeometry args={[14, 12]} />
        <meshStandardMaterial color="#1e1b4b" emissive="#c084fc" emissiveIntensity={0.2} metalness={0.3} roughness={0.4} />
      </mesh>
      {/* SCULPTURE 1 — abstract spinning torus on a pedestal (SW) */}
      <group position={[-5, 0, 4]}>
        <mesh position={[0, 0.6, 0]} castShadow>
          <boxGeometry args={[1.2, 1.2, 1.2]} />
          <meshStandardMaterial color="#0f172a" roughness={0.4} />
        </mesh>
        <mesh ref={torusRef} position={[0, 1.8, 0]} rotation={[Math.PI / 3, 0, 0]} castShadow>
          <torusKnotGeometry args={[0.45, 0.14, 64, 12]} />
          <meshStandardMaterial color="#f59e0b" emissive="#fbbf24" emissiveIntensity={0.7} metalness={0.85} roughness={0.2} />
        </mesh>
      </group>
      {/* SCULPTURE 2 — giant red cube balanced on a corner (SE) */}
      <group position={[5, 0, 4]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <cylinderGeometry args={[0.7, 0.85, 0.8, 12]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0, 1.7, 0]} rotation={[0.6, 0.6, 0]} castShadow>
          <boxGeometry args={[1.2, 1.2, 1.2]} />
          <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={0.45} metalness={0.4} />
        </mesh>
      </group>
      {/* SCULPTURE 3 — blue sphere on a tall plinth (NW) */}
      <group position={[-5, 0, -4]}>
        <mesh position={[0, 1, 0]} castShadow>
          <boxGeometry args={[0.6, 2, 0.6]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <mesh position={[0, 2.6, 0]} castShadow>
          <sphereGeometry args={[0.55, 24, 18]} />
          <meshStandardMaterial color="#0ea5e9" emissive="#22d3ee" emissiveIntensity={0.55} metalness={0.7} roughness={0.25} />
        </mesh>
      </group>
      {/* MURAL WALL — large painted wall behind the gallery (north) */}
      <group position={[0, 0, -5.5]}>
        <mesh position={[0, 1.5, 0]} castShadow>
          <boxGeometry args={[10, 3, 0.3]} />
          <meshStandardMaterial color="#fef3c7" />
        </mesh>
        {/* Mural splashes */}
        {[
          { x: -3, c: "#ec4899" },
          { x: -1, c: "#22d3ee" },
          { x: 1, c: "#a855f7" },
          { x: 3, c: "#f97316" },
        ].map(({ x, c }, i) => (
          <mesh key={`splash-${i}`} position={[x, 1.5, 0.16]}>
            <circleGeometry args={[0.7, 18]} />
            <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.7} toneMapped={false} />
          </mesh>
        ))}
      </group>
      {/* PAINTER'S EASEL — small art-class touch near the entrance */}
      <group position={[5, 0, -4]} rotation={[0, -0.4, 0]}>
        {/* Tripod legs */}
        {[-0.25, 0.25].map((lx, i) => (
          <mesh key={`leg-${i}`} position={[lx, 0.7, 0.1]} rotation={[0, 0, lx > 0 ? -0.15 : 0.15]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 1.5, 6]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
        ))}
        <mesh position={[0, 0.7, -0.15]} rotation={[0.15, 0, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 1.5, 6]} />
          <meshStandardMaterial color="#78350f" />
        </mesh>
        {/* Canvas */}
        <mesh position={[0, 1.2, 0.12]} castShadow>
          <boxGeometry args={[0.9, 1.1, 0.06]} />
          <meshStandardMaterial color="#fef9c3" />
        </mesh>
        <mesh position={[0, 1.2, 0.155]}>
          <planeGeometry args={[0.7, 0.9]} />
          <meshStandardMaterial color="#7c3aed" emissive="#a855f7" emissiveIntensity={0.4} toneMapped={false} />
        </mesh>
      </group>
      {/* District sign — south side, facing the world */}
      <Text
        position={[0, 4.2, 6.2]}
        fontSize={0.5}
        color="#fde047"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.04}
        outlineColor="#7c3aed"
      >
        🎨 ART DISTRICT
      </Text>
    </group>
  );
}

// ===== Fashion District @ (-27, 0, 45) ================================
// Runway plaza south of BotShops (-27, 27). Long lit catwalk down the
// middle + mannequins on platforms + boutique kiosks framing the
// runway + a glowing "FASHION" sign overhead. Plaza footprint 12x10
// centered at (-27, 45) → x[-33..-21], clear of x=-36 road (3u west)
// and x=-18 road (1.9u east). botfashion kiosk is the south-entrance
// trigger at (-27, 39.5).
function FashionMannequin({ x, z, color }: { x: number; z: number; color: string }) {
  return (
    <group position={[x, 0, z]}>
      {/* Platform */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.55, 0.3, 16]} />
        <meshStandardMaterial color="#0f172a" emissive="#f9a8d4" emissiveIntensity={0.4} metalness={0.5} />
      </mesh>
      {/* Torso */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.22, 1.4, 14]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.45} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 1.95, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.12, 0.2, 8]} />
        <meshStandardMaterial color="#fafaf9" />
      </mesh>
      {/* Head — featureless mannequin sphere */}
      <mesh position={[0, 2.2, 0]} castShadow>
        <sphereGeometry args={[0.2, 18, 14]} />
        <meshStandardMaterial color="#fafaf9" metalness={0.3} roughness={0.4} />
      </mesh>
    </group>
  );
}

function FashionDistrict() {
  const signRef = useRef<THREE.Mesh>(null!);
  useFrame((s) => {
    if (signRef.current) {
      const mat = signRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 1.4 + Math.sin(s.clock.elapsedTime * 3) * 0.4;
    }
  });
  return (
    <group position={[-27, 0, 45]}>
      {/* Plaza floor — dark with magenta glow (12 wide x 10 deep) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]} receiveShadow>
        <planeGeometry args={[12, 10]} />
        <meshStandardMaterial color="#1f1233" emissive="#ec4899" emissiveIntensity={0.18} />
      </mesh>
      {/* Lit runway — long emissive strip running N-S down the middle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
        <planeGeometry args={[2, 8]} />
        <meshStandardMaterial color="#fce7f3" emissive="#f9a8d4" emissiveIntensity={1.1} toneMapped={false} />
      </mesh>
      {/* Runway edge lights — small glowing studs lining each side */}
      {[-4, -2.5, -1, 0.5, 2, 3.5].map((z, i) => (
        <group key={`lights-${i}`}>
          <mesh position={[-1.05, 0.1, z]}>
            <sphereGeometry args={[0.08, 8, 6]} />
            <meshStandardMaterial color="#fde047" emissive="#fde047" emissiveIntensity={1.8} toneMapped={false} />
          </mesh>
          <mesh position={[1.05, 0.1, z]}>
            <sphereGeometry args={[0.08, 8, 6]} />
            <meshStandardMaterial color="#fde047" emissive="#fde047" emissiveIntensity={1.8} toneMapped={false} />
          </mesh>
        </group>
      ))}
      {/* Mannequins down the catwalk — alternating sides, alternating colors */}
      <FashionMannequin x={-1.5} z={-2.5} color="#ec4899" />
      <FashionMannequin x={1.5} z={-1} color="#7c3aed" />
      <FashionMannequin x={-1.5} z={0.5} color="#f97316" />
      <FashionMannequin x={1.5} z={2} color="#22d3ee" />
      {/* Boutique kiosks framing the runway (E and W sides) */}
      {[[-5, -2.5, "#ec4899", "💄"], [5, -2.5, "#a855f7", "👠"], [-5, 2.5, "#0ea5e9", "👜"], [5, 2.5, "#f97316", "🧢"]].map(([x, z, c, em], i) => (
        <group key={`booth-${i}`} position={[x as number, 0, z as number]}>
          <mesh position={[0, 1.1, 0]} castShadow>
            <boxGeometry args={[2, 2.2, 1.6]} />
            <meshStandardMaterial color="#0f172a" emissive={c as string} emissiveIntensity={0.45} metalness={0.4} />
          </mesh>
          {/* Roof awning */}
          <mesh position={[0, 2.35, 0]} castShadow>
            <boxGeometry args={[2.3, 0.18, 1.9]} />
            <meshStandardMaterial color={c as string} emissive={c as string} emissiveIntensity={0.9} />
          </mesh>
          {/* Window */}
          <mesh position={[0, 1.3, 0.81]}>
            <planeGeometry args={[1.4, 0.9]} />
            <meshStandardMaterial color={c as string} emissive={c as string} emissiveIntensity={1.6} toneMapped={false} />
          </mesh>
          <Text
            position={[0, 1.3, 0.815]}
            fontSize={0.55}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.04}
            outlineColor={c as string}
          >
            {em as string}
          </Text>
        </group>
      ))}
      {/* Big glowing "FASHION" arch sign over the south entrance */}
      <mesh position={[0, 4.4, 4.6]} castShadow>
        <boxGeometry args={[7.5, 1.1, 0.25]} />
        <meshStandardMaterial color="#0b1220" />
      </mesh>
      <mesh ref={signRef} position={[0, 4.4, 4.73]}>
        <planeGeometry args={[7.2, 0.9]} />
        <meshStandardMaterial
          color="#f9a8d4"
          emissive="#ec4899"
          emissiveIntensity={1.6}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <Text
        position={[0, 4.4, 4.74]}
        fontSize={0.55}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.04}
        outlineColor="#831843"
      >
        👗 FASHION DISTRICT
      </Text>
      {/* Sign support posts */}
      {[-3.4, 3.4].map((x, i) => (
        <mesh key={`post-${i}`} position={[x, 2.2, 4.6]} castShadow>
          <cylinderGeometry args={[0.12, 0.14, 4.4, 8]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

export default function CityDistricts() {
  return (
    <group>
      <Stadium />
      <Market />
      <Beach />
      <RocketStation />
      <ShopsCluster />
      <Dealer />
      <Farm />
      <MoneyBotTowers />
      <Port />
      <Casino />
      <Mine />
      <Zoo />
      <GamingHQCrown />
      <SoccerStadium />
      <BasketballArena />
      <ArtDistrict />
      <FashionDistrict />
    </group>
  );
}

// ===== MoneyBot Gaming HQ rooftop crown @ (-27, *, -5) =================
// The HQ building itself (h=10, top at y=10) is rendered by Building.tsx from
// the BUILDING_DEFS entry. This component decorates the rooftop to make it
// feel like a real corporate HQ rather than a tall plain box: a glowing twin-
// ring antenna with a blinking aviation beacon, plus illuminated "MBG • HQ"
// ledge signs on the north and south building faces.
//   local x ∈ [-2.5, +2.5], local z ∈ [-2.1, +2.1], y ∈ [10, 13.3]
function GamingHQCrown() {
  const beaconRef = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (beaconRef.current) {
      const t = state.clock.elapsedTime;
      const mat = beaconRef.current.material as THREE.MeshStandardMaterial;
      // Slow ~1.5 Hz aviation-style blink, 0.4 → 2.0 emissive intensity.
      mat.emissiveIntensity = 1.2 + Math.sin(t * 3) * 0.8;
    }
  });
  return (
    <group position={[-27, 0, -5]}>
      {/* Antenna pole rising from rooftop */}
      <mesh position={[0, 11.5, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.1, 3, 6]} />
        <meshStandardMaterial color="#475569" metalness={0.85} />
      </mesh>
      {/* Glowing antenna rings */}
      <mesh position={[0, 11, 0]}>
        <torusGeometry args={[0.42, 0.04, 6, 16]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={1.2} toneMapped={false} />
      </mesh>
      <mesh position={[0, 12, 0]}>
        <torusGeometry args={[0.3, 0.04, 6, 16]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={1.2} toneMapped={false} />
      </mesh>
      {/* Blinking red aviation beacon (top y = 13 + 0.2 = 13.2 ≤ cap) */}
      <mesh ref={beaconRef} position={[0, 13, 0]}>
        <sphereGeometry args={[0.2, 12, 10]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.5} toneMapped={false} />
      </mesh>
      {/* South-facing rooftop ledge sign (toward city center). Back of the
          sign sits at z=+2 (facade), so center = 2 - depth/2 = 1.91. */}
      <mesh position={[0, 10.5, 1.91]} castShadow>
        <boxGeometry args={[3.6, 0.95, 0.18]} />
        <meshStandardMaterial color="#1e1b4b" />
      </mesh>
      <Text position={[0, 10.5, 2.001]} fontSize={0.55} color="#22d3ee" anchorX="center" anchorY="middle">
        MBG • HQ
      </Text>
      {/* North-facing mirror sign */}
      <mesh position={[0, 10.5, -1.91]} castShadow>
        <boxGeometry args={[3.6, 0.95, 0.18]} />
        <meshStandardMaterial color="#1e1b4b" />
      </mesh>
      <Text
        position={[0, 10.5, -2.001]}
        rotation={[0, Math.PI, 0]}
        fontSize={0.55}
        color="#22d3ee"
        anchorX="center"
        anchorY="middle"
      >
        MBG • HQ
      </Text>
    </group>
  );
}
