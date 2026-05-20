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
    </group>
  );
}
