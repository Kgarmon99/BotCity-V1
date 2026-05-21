import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { sound } from "./sound";

// ─────────────────────────────────────────────────────────────────────
// 4 new districts at the middle-ring corners (±27, ±27).
// Middle ring blocks span x or z = 19.1..34.9 (and mirrors), so each
// district fits comfortably with ~7-unit clearance to the nearest road.
// Removed fillers: (±27, ∓23) and (±23, ∓27) in CityBuildings.tsx.
// ─────────────────────────────────────────────────────────────────────

// ===== BotStadium @ (-40.5, 0, -40.5) ================================
// MEGA dome stadium. Outer envelope radius 8.2 (vs prev 5.5) — kept under
// the 8.85u limit set by the botstadium kiosk at world (-40.5, -30.75)
// whose ~1.8u depth + Building stoop reaches back to ~z=-31.74. With max
// radius 8.2 the north shell edge sits at world z=-32.3, a 0.56u gap.
//   • two-tier circular stands (outer wall 8.2, inner seats 7.0/7.4, field 5.8)
//   • 8 floodlight pylons in a ring at r=8.2 with triple-lamp fixtures
//   • 4-sided jumbotron suspended over midfield
//   • spectator dots ringing the upper deck for crowd feel
//   • entrance archway with team-color banners flanking the south sign
function Stadium() {
  const jumboRefs = useRef<Array<THREE.Mesh | null>>([]);
  const bannerRefs = useRef<Array<THREE.Mesh | null>>([]);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    jumboRefs.current.forEach((m, i) => {
      if (m) {
        const mat = m.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = 1.6 + Math.sin(t * 5 + i * 0.7) * 0.6;
      }
    });
    bannerRefs.current.forEach((m, i) => {
      if (m) m.rotation.z = Math.sin(t * 1.2 + i) * 0.08;
    });
  });
  // 8-fold floodlight angle ring, slightly inside outer wall
  const flAngles = [0, 45, 90, 135, 180, 225, 270, 315].map((d) => (d * Math.PI) / 180);
  // 4 jumbotron face offsets (N, E, S, W)
  const jumboFaces: Array<[number, number, number]> = [
    [0, 0, -1.6],
    [1.6, 0, 0],
    [0, 0, 1.6],
    [-1.6, 0, 0],
  ];
  return (
    <group position={[-40.5, 0, -40.5]}>
      {/* Concrete plaza apron — half-ring on south side ONLY, away from
          the kiosk to the north. Spans angles 0..π (south semicircle). */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <ringGeometry args={[8.2, 9.2, 32, 1, 0, Math.PI]} />
        <meshStandardMaterial color="#334155" roughness={0.85} />
      </mesh>
      {/* Outer wall of stands — tall cylinder shell. Top r=8.0, bottom
          r=8.2 (was 8.4/9.0). North bottom edge world z=-32.3, kiosk
          extends back to ~z=-31.74 → 0.56u gap. */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <cylinderGeometry args={[8.0, 8.2, 5.0, 48, 1, true]} />
        <meshStandardMaterial
          color="#1e293b"
          emissive="#3b82f6"
          emissiveIntensity={0.32}
          metalness={0.6}
          roughness={0.45}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Inner lower-tier seats (red bowl) */}
      <mesh position={[0, 1.4, 0]}>
        <cylinderGeometry args={[7.0, 7.4, 2.8, 48, 1, true]} />
        <meshStandardMaterial
          color="#dc2626"
          emissive="#dc2626"
          emissiveIntensity={0.55}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Inner upper-tier seats (yellow) — visually distinct band above lower */}
      <mesh position={[0, 3.7, 0]}>
        <cylinderGeometry args={[7.4, 7.2, 1.8, 48, 1, true]} />
        <meshStandardMaterial
          color="#facc15"
          emissive="#facc15"
          emissiveIntensity={0.45}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Top emissive trim ring — "stadium glow" line */}
      <mesh position={[0, 5.05, 0]}>
        <torusGeometry args={[8.0, 0.12, 8, 48]} />
        <meshStandardMaterial color="#fde047" emissive="#fde047" emissiveIntensity={1.8} toneMapped={false} />
      </mesh>
      {/* Crowd dots — 24 tiny spheres around the upper deck */}
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i / 24) * Math.PI * 2;
        const r = 7.3;
        return (
          <mesh key={`crowd-${i}`} position={[Math.cos(a) * r, 4.4, Math.sin(a) * r]}>
            <sphereGeometry args={[0.12, 6, 6]} />
            <meshStandardMaterial
              color={i % 3 === 0 ? "#fde047" : i % 3 === 1 ? "#f8fafc" : "#22d3ee"}
              emissive={i % 3 === 0 ? "#fde047" : i % 3 === 1 ? "#f8fafc" : "#22d3ee"}
              emissiveIntensity={0.6}
            />
          </mesh>
        );
      })}
      {/* Green field */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <circleGeometry args={[5.8, 48]} />
        <meshStandardMaterial color="#15803d" emissive="#22c55e" emissiveIntensity={0.45} />
      </mesh>
      {/* Mowed-stripe overlays — alternating darker bands across the field */}
      {[-3.5, -1.2, 1.2, 3.5].map((zOff, i) => (
        <mesh key={`stripe-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, zOff]}>
          <planeGeometry args={[10, 1.0]} />
          <meshStandardMaterial color="#166534" transparent opacity={0.55} />
        </mesh>
      ))}
      {/* Center circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[1.5, 1.7, 48]} />
        <meshStandardMaterial color="#fde047" emissive="#fde047" emissiveIntensity={1.4} toneMapped={false} />
      </mesh>
      {/* Center dot */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
        <circleGeometry args={[0.2, 16]} />
        <meshStandardMaterial color="#fde047" emissive="#fde047" emissiveIntensity={1.6} toneMapped={false} />
      </mesh>
      {/* 8 floodlight pylons ringing the stadium — r=8.2 keeps the north
          pylon at world z=-32.3 (0.56u clear of kiosk) */}
      {flAngles.map((a, i) => {
        const r = 8.2;
        return (
          <group key={`fl-${i}`} position={[Math.cos(a) * r, 0, Math.sin(a) * r]} rotation={[0, -a + Math.PI / 2, 0]}>
            <mesh position={[0, 5.5, 0]} castShadow>
              <cylinderGeometry args={[0.14, 0.22, 11, 8]} />
              <meshStandardMaterial color="#0b1220" metalness={0.85} />
            </mesh>
            {/* Light bank — 3 lamps side-by-side */}
            {[-0.45, 0, 0.45].map((dx, j) => (
              <mesh key={`lamp-${j}`} position={[dx, 11.2, -0.1]}>
                <boxGeometry args={[0.38, 0.42, 0.3]} />
                <meshStandardMaterial
                  color="#fef3c7"
                  emissive="#fbbf24"
                  emissiveIntensity={2.6}
                  toneMapped={false}
                />
              </mesh>
            ))}
          </group>
        );
      })}
      {/* 4 suspension cables anchoring the jumbotron */}
      {[[-4, -4], [4, -4], [-4, 4], [4, 4]].map(([x, z], i) => (
        <mesh
          key={`cable-${i}`}
          position={[x / 2, 7.5, z / 2]}
          rotation={[Math.atan2(z, x), 0, Math.atan2(Math.hypot(x, z), 4.5)]}
        >
          <cylinderGeometry args={[0.025, 0.025, Math.hypot(x, z, 3), 4]} />
          <meshStandardMaterial color="#475569" metalness={0.8} />
        </mesh>
      ))}
      {/* Jumbotron — 4-sided box suspended over center, each face a screen */}
      <mesh position={[0, 8.6, 0]} castShadow>
        <boxGeometry args={[3.2, 2.0, 3.2]} />
        <meshStandardMaterial color="#0b1220" metalness={0.6} />
      </mesh>
      {jumboFaces.map(([fx, fy, fz], i) => {
        const isZ = fz !== 0;
        return (
          <mesh
            key={`face-${i}`}
            ref={(m) => { jumboRefs.current[i] = m; }}
            position={[fx * 1.005, 8.6 + fy, fz * 1.005]}
            rotation={[0, isZ ? (fz > 0 ? 0 : Math.PI) : (fx > 0 ? Math.PI / 2 : -Math.PI / 2), 0]}
          >
            <planeGeometry args={[2.9, 1.7]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? "#22c55e" : "#3b82f6"}
              emissive={i % 2 === 0 ? "#22c55e" : "#3b82f6"}
              emissiveIntensity={1.8}
              toneMapped={false}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}
      {/* Crown beacon on top of the jumbotron */}
      <mesh position={[0, 10.0, 0]}>
        <sphereGeometry args={[0.32, 16, 12]} />
        <meshStandardMaterial color="#fde047" emissive="#fde047" emissiveIntensity={2.2} toneMapped={false} />
      </mesh>
      {/* Entrance archway at the south edge (toward the kiosk) — note the
          kiosk is to the NORTH so "south" here is positive z relative to
          stadium center, free of nearby buildings. */}
      <group position={[0, 0, 8.0]}>
        {/* Arch posts */}
        {[-1.6, 1.6].map((x) => (
          <mesh key={`arch-${x}`} position={[x, 1.8, 0]} castShadow>
            <boxGeometry args={[0.35, 3.6, 0.35]} />
            <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={0.4} />
          </mesh>
        ))}
        {/* Arch crossbar */}
        <mesh position={[0, 3.7, 0]} castShadow>
          <boxGeometry args={[3.6, 0.4, 0.35]} />
          <meshStandardMaterial color="#fde047" emissive="#fde047" emissiveIntensity={0.6} toneMapped={false} />
        </mesh>
      </group>
      {/* Two team banners flapping in the breeze — flanking the south entrance */}
      {[-2.4, 2.4].map((x, i) => (
        <mesh
          key={`banner-${i}`}
          ref={(m) => { bannerRefs.current[i] = m; }}
          position={[x, 2.4, 7.8]}
        >
          <planeGeometry args={[1.2, 2.6]} />
          <meshStandardMaterial
            color={i === 0 ? "#dc2626" : "#3b82f6"}
            emissive={i === 0 ? "#dc2626" : "#3b82f6"}
            emissiveIntensity={0.55}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
      {/* Stadium sign over the south entrance */}
      <Text
        position={[0, 5.6, 8.1]}
        fontSize={0.78}
        color="#fde047"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.06}
        outlineColor="#dc2626"
      >
        🏟️ BOTSTADIUM
      </Text>
      <Text
        position={[0, 4.85, 8.1]}
        fontSize={0.28}
        color="#fef3c7"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor="#0b1220"
      >
        Home of the Bot Bytes · Cap 88,888
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
    <group position={[40.5, 0, -40.5]}>
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
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[112, 0.05, 50]}>
      <planeGeometry args={[34, 200, 1, 1]} />
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
      {/* Giant sand strip along the east edge — enlarged to span palms→shore */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[66.75, 0.03, 52.5]} receiveShadow>
        <planeGeometry args={[22, 100]} />
        <meshStandardMaterial
          color="#fde68a"
          emissive="#fcd34d"
          emissiveIntensity={0.08}
          roughness={1}
        />
      </mesh>
      {/* Darker dry-sand inner band (subtle color variation) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[62, 0.035, 52.5]}>
        <planeGeometry args={[10, 95]} />
        <meshStandardMaterial
          color="#fcd34d"
          emissive="#f59e0b"
          emissiveIntensity={0.05}
          roughness={1}
          transparent
          opacity={0.45}
        />
      </mesh>
      {/* Wet-sand band where the surf laps the shore */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[77, 0.04, 50]}>
        <planeGeometry args={[3.5, 110]} />
        <meshStandardMaterial
          color="#c89968"
          emissive="#f59e0b"
          emissiveIntensity={0.15}
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>
      {/* Small sand dunes / mounds along the back edge for texture */}
      {[[58, 12], [59, 38], [58.5, 70], [59.5, 92]].map(([dx, dz], i) => (
        <mesh
          key={`dune-${i}`}
          position={[dx, 0.15, dz]}
          rotation={[0, i * 0.7, 0]}
          castShadow
          receiveShadow
        >
          <sphereGeometry args={[1.8, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2.4]} />
          <meshStandardMaterial color="#fde68a" roughness={1} />
        </mesh>
      ))}
      {/* Sandcastle near the center of the beach */}
      <group position={[68, 0, 55]}>
        <mesh position={[0, 0.35, 0]} castShadow>
          <cylinderGeometry args={[0.5, 0.7, 0.7, 8]} />
          <meshStandardMaterial color="#fcd34d" roughness={0.95} />
        </mesh>
        <mesh position={[0, 0.85, 0]} castShadow>
          <coneGeometry args={[0.35, 0.4, 6]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.9} />
        </mesh>
        {[[0.8, 0.7], [-0.8, 0.7], [0.8, -0.7], [-0.8, -0.7]].map(([tx, tz], i) => (
          <mesh key={`tower-${i}`} position={[tx, 0.25, tz]} castShadow>
            <cylinderGeometry args={[0.18, 0.22, 0.5, 6]} />
            <meshStandardMaterial color="#fcd34d" roughness={0.95} />
          </mesh>
        ))}
      </group>
      {/* Shallow shoreline — bridges the gap between wet-sand (x≈78.75)
          and the open-ocean plane (x=95). Lighter, more transparent. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[86.5, 0.045, 50]}>
        <planeGeometry args={[16, 130]} />
        <meshStandardMaterial
          color="#0891b2"
          emissive="#22d3ee"
          emissiveIntensity={0.45}
          transparent
          opacity={0.7}
          roughness={0.3}
          metalness={0.3}
        />
      </mesh>
      {/* Foam line right at the shore */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[80, 0.055, 50]}>
        <planeGeometry args={[1.2, 125]} />
        <meshStandardMaterial
          color="#ecfeff"
          emissive="#a5f3fc"
          emissiveIntensity={0.7}
          transparent
          opacity={0.55}
          toneMapped={false}
        />
      </mesh>
      {/* The ocean — huge animated water plane east of the city */}
      <OceanWaves />
      {/* Distant waves / breakers — emissive strips ON the open-ocean surface */}
      {[100, 110, 120].map((wx) => (
        <mesh
          key={`wave-${wx}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[wx, 0.07, 50]}
        >
          <planeGeometry args={[0.5, 180]} />
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
      <PalmTree x={58.5} z={15} scale={1.1} />
      <PalmTree x={57} z={30} />
      <PalmTree x={58.5} z={45} scale={1.15} />
      <PalmTree x={57} z={60} scale={0.95} />
      <PalmTree x={58.5} z={75} scale={1.05} />
      <PalmTree x={57} z={90} />
      <PalmTree x={63} z={7.5} scale={0.9} />
      <PalmTree x={64.5} z={96} scale={1.1} />
      {/* Umbrellas spread across the sand */}
      <BeachUmbrella x={67.5} z={22.5} color="#ef4444" />
      <BeachUmbrella x={70.5} z={33} color="#f97316" />
      <BeachUmbrella x={69} z={48} color="#facc15" />
      <BeachUmbrella x={72} z={63} color="#ec4899" />
      <BeachUmbrella x={67.5} z={82.5} color="#22c55e" />
      <BeachUmbrella x={70.5} z={90} color="#a855f7" />
      {/* Beach chairs facing the ocean */}
      <BeachChair x={73.5} z={27} rot={-Math.PI / 2} />
      <BeachChair x={73.5} z={42} rot={-Math.PI / 2} />
      <BeachChair x={73.5} z={57} rot={-Math.PI / 2} />
      <BeachChair x={73.5} z={72} rot={-Math.PI / 2} />
      <BeachChair x={73.5} z={87} rot={-Math.PI / 2} />
      {/* Surfboards staked into the sand */}
      <Surfboard x={61.5} z={22.5} color="#22d3ee" rot={0.3} />
      <Surfboard x={63} z={67.5} color="#f97316" rot={-0.2} />
      <Surfboard x={61.5} z={87} color="#ec4899" rot={0.4} />
      {/* Beach balls */}
      <mesh position={[69, 0.42, 75]} castShadow>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#dc2626" emissive="#fde047" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[66, 0.35, 52.5]} castShadow>
        <sphereGeometry args={[0.33, 16, 16]} />
        <meshStandardMaterial color="#22d3ee" emissive="#a855f7" emissiveIntensity={0.5} />
      </mesh>
      {/* Big oceanfront sign */}
      <Text
        position={[60, 4.5, 52.5]}
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

      {/* ── LIFEGUARD TOWER — classic red-and-white stilt hut, back of sand
            at (62, 0, 50). Faces east (toward the ocean). Sand strip
            spans x[55.75, 77.75] z[2.5, 102.5], so (62, 50) is well
            within bounds. ── */}
      <group position={[62, 0, 50]}>
        {/* Stilts */}
        {[[-1, 1], [1, 1], [-1, -1], [1, -1]].map(([px, pz], i) => (
          <mesh key={`lg-stilt-${i}`} position={[px, 1, pz]} castShadow>
            <cylinderGeometry args={[0.1, 0.1, 2, 6]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
        ))}
        {/* Floor */}
        <mesh position={[0, 2.1, 0]} castShadow>
          <boxGeometry args={[2.6, 0.16, 2.6]} />
          <meshStandardMaterial color="#fbbf24" roughness={0.6} />
        </mesh>
        {/* Back wall (west, facing inland) */}
        <mesh position={[-1.2, 2.85, 0]} castShadow>
          <boxGeometry args={[0.12, 1.5, 2.6]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
        {/* Side walls */}
        {[1.2, -1.2].map((sz, i) => (
          <mesh key={`lg-side-${i}`} position={[0, 2.85, sz]} castShadow>
            <boxGeometry args={[2.4, 1.5, 0.12]} />
            <meshStandardMaterial color="#dc2626" />
          </mesh>
        ))}
        {/* Front rail (east, half-height window opening) */}
        <mesh position={[1.2, 2.3, 0]}>
          <boxGeometry args={[0.08, 0.4, 2.4]} />
          <meshStandardMaterial color="#7c2d12" />
        </mesh>
        {/* Hip roof */}
        <mesh position={[0, 3.85, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[2.05, 0.9, 4]} />
          <meshStandardMaterial color="#7c2d12" roughness={0.85} />
        </mesh>
        {/* Red cross on back wall (visible from city side) */}
        <mesh position={[-1.27, 3.0, 0]}>
          <boxGeometry args={[0.04, 0.18, 0.7]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        <mesh position={[-1.27, 3.0, 0]}>
          <boxGeometry args={[0.04, 0.7, 0.18]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        {/* Ladder on west side */}
        <mesh position={[-1.4, 1.0, 0]} rotation={[0, 0, -Math.PI / 8]}>
          <boxGeometry args={[0.06, 2.1, 0.6]} />
          <meshStandardMaterial color="#78350f" />
        </mesh>
        {/* Lifebuoy hung on front */}
        <mesh position={[1.3, 2.75, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.22, 0.07, 8, 16]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        <mesh position={[1.3, 2.75, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.22, 0.072, 8, 16, Math.PI / 2]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
      </group>

      {/* ── BEACH VOLLEYBALL COURT — south end of beach at (68, 0, 14).
            Court is a 6×9 sand band with the existing umbrellas
            (closest is at z=22.5, 8.5u away) and surfboards (z=22.5,
            8.5u away). ── */}
      <group position={[68, 0, 14]}>
        {/* Court boundary stripes — slightly darker sand */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.045, 0]}>
          <planeGeometry args={[6.2, 9.2]} />
          <meshStandardMaterial color="#f59e0b" emissive="#fbbf24" emissiveIntensity={0.18} transparent opacity={0.6} />
        </mesh>
        {/* Net posts */}
        <mesh position={[-3, 1.1, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 2.2, 6]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <mesh position={[3, 1.1, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 2.2, 6]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        {/* Net (wireframe) */}
        <mesh position={[0, 1.6, 0]}>
          <boxGeometry args={[6, 0.7, 0.04]} />
          <meshStandardMaterial color="#f8fafc" transparent opacity={0.55} wireframe />
        </mesh>
        {/* Net top tape */}
        <mesh position={[0, 1.95, 0]}>
          <boxGeometry args={[6, 0.06, 0.06]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        {/* Volleyball lying on court */}
        <mesh position={[1.4, 0.32, 1.6]} castShadow>
          <sphereGeometry args={[0.28, 14, 12]} />
          <meshStandardMaterial color="#fef9c3" emissive="#facc15" emissiveIntensity={0.3} />
        </mesh>
        {/* Black volleyball seam panel */}
        <mesh position={[1.4, 0.32, 1.6]} rotation={[0, 0, Math.PI / 6]}>
          <torusGeometry args={[0.28, 0.015, 4, 16]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
      </group>

      {/* ── TIKI BAR — thatched-roof beach shack at (61, 0, 30), just east
            of the pavilion (66, 37.5) but well clear: shack footprint
            x[59, 63], z[28.5, 31.5] — 6u south of pavilion's footprint. ── */}
      <group position={[61, 0, 30]}>
        {/* Bamboo deck */}
        <mesh position={[0, 0.08, 0]}>
          <boxGeometry args={[4, 0.16, 3]} />
          <meshStandardMaterial color="#a16207" roughness={0.85} />
        </mesh>
        {/* Bamboo support posts */}
        {[[-1.7, -1.3], [1.7, -1.3], [-1.7, 1.3], [1.7, 1.3]].map(([px, pz], i) => (
          <mesh key={`tiki-post-${i}`} position={[px, 1.3, pz]} castShadow>
            <cylinderGeometry args={[0.1, 0.1, 2.6, 6]} />
            <meshStandardMaterial color="#854d0e" roughness={0.8} />
          </mesh>
        ))}
        {/* Back wall (counter side) */}
        <mesh position={[0, 1.0, -1.3]}>
          <boxGeometry args={[3.6, 1.0, 0.12]} />
          <meshStandardMaterial color="#78350f" roughness={0.85} />
        </mesh>
        {/* Counter top */}
        <mesh position={[0, 1.05, 1.0]}>
          <boxGeometry args={[3.6, 0.1, 0.5]} />
          <meshStandardMaterial color="#fbbf24" roughness={0.5} />
        </mesh>
        {/* Thatched roof — overlapping cones */}
        <mesh position={[0, 2.95, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[2.8, 1.1, 4]} />
          <meshStandardMaterial color="#a16207" roughness={0.95} />
        </mesh>
        {/* Roof fringe — darker thatch overhang */}
        <mesh position={[0, 2.45, 0]} rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[2.5, 0.45, 4]} />
          <meshStandardMaterial color="#78350f" roughness={0.95} />
        </mesh>
        {/* Tiki torches at the corners */}
        {[[-1.9, 1.5], [1.9, 1.5]].map(([tx, tz], i) => (
          <group key={`torch-${i}`} position={[tx, 0, tz]}>
            <mesh position={[0, 1.0, 0]} castShadow>
              <cylinderGeometry args={[0.07, 0.07, 2.0, 6]} />
              <meshStandardMaterial color="#451a03" roughness={0.85} />
            </mesh>
            <mesh position={[0, 2.1, 0]}>
              <coneGeometry args={[0.16, 0.4, 6]} />
              <meshStandardMaterial color="#f97316" emissive="#fde047" emissiveIntensity={1.6} toneMapped={false} />
            </mesh>
          </group>
        ))}
        {/* Bar sign */}
        <Text
          position={[0, 2.0, 1.28]}
          fontSize={0.22}
          color="#fbbf24"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#451a03"
        >
          🍹 TIKI BAR
        </Text>
      </group>

      {/* ── PIER — wooden boardwalk extending east into the ocean at z=68.
            Sits between the wet-sand line (x≈78.75) and reaches out to
            x=92, with the pier head ending well shy of the distant
            waves (first wave at x=100). Pier walking surface at y=0.6
            sits above the water plane (y≈0.045..0.07). ── */}
      <group position={[80, 0, 68]}>
        {/* Pier deck */}
        <mesh position={[6, 0.6, 0]} castShadow>
          <boxGeometry args={[14, 0.18, 2.4]} />
          <meshStandardMaterial color="#92400e" roughness={0.85} />
        </mesh>
        {/* Pier head — wider platform at far end */}
        <mesh position={[12.5, 0.6, 0]} castShadow>
          <boxGeometry args={[3.5, 0.18, 4.5]} />
          <meshStandardMaterial color="#a16207" roughness={0.85} />
        </mesh>
        {/* Pilings under the pier */}
        {[0, 3, 6, 9, 12].map((dx, i) => (
          <group key={`piling-${i}`} position={[dx, 0, 0]}>
            <mesh position={[0, 0.25, -1.1]} castShadow>
              <cylinderGeometry args={[0.12, 0.14, 0.6, 6]} />
              <meshStandardMaterial color="#451a03" roughness={0.9} />
            </mesh>
            <mesh position={[0, 0.25, 1.1]} castShadow>
              <cylinderGeometry args={[0.12, 0.14, 0.6, 6]} />
              <meshStandardMaterial color="#451a03" roughness={0.9} />
            </mesh>
          </group>
        ))}
        {/* Pier rails */}
        {[-1.15, 1.15].map((rz, i) => (
          <mesh key={`rail-${i}`} position={[6, 1.0, rz]}>
            <boxGeometry args={[14, 0.06, 0.04]} />
            <meshStandardMaterial color="#7c2d12" />
          </mesh>
        ))}
        {/* Rail posts */}
        {[0, 2, 4, 6, 8, 10, 12].map((dx, i) => (
          <group key={`rail-post-${i}`} position={[dx, 0, 0]}>
            <mesh position={[0, 0.85, -1.15]}>
              <boxGeometry args={[0.07, 0.5, 0.07]} />
              <meshStandardMaterial color="#7c2d12" />
            </mesh>
            <mesh position={[0, 0.85, 1.15]}>
              <boxGeometry args={[0.07, 0.5, 0.07]} />
              <meshStandardMaterial color="#7c2d12" />
            </mesh>
          </group>
        ))}
        {/* Lantern at the pier head */}
        <group position={[12.5, 0.6, 0]}>
          <mesh position={[0, 1.6, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 2.0, 6]} />
            <meshStandardMaterial color="#1c1917" metalness={0.7} />
          </mesh>
          <mesh position={[0, 2.7, 0]}>
            <boxGeometry args={[0.32, 0.32, 0.32]} />
            <meshStandardMaterial color="#fde047" emissive="#facc15" emissiveIntensity={2.2} toneMapped={false} />
          </mesh>
        </group>
      </group>

      {/* ── BEACH FIREPIT — stone ring with logs, north of sandcastle at
            (66, 0, 80). Sand strip clear (sandcastle is at (68, 55),
            beach ball at (69, 75)). ── */}
      <group position={[66, 0, 80]}>
        {/* Stone ring */}
        {Array.from({ length: 10 }).map((_, i) => {
          const a = (i / 10) * Math.PI * 2;
          return (
            <mesh
              key={`stone-${i}`}
              position={[Math.cos(a) * 0.85, 0.18, Math.sin(a) * 0.85]}
              castShadow
            >
              <sphereGeometry args={[0.22, 8, 6]} />
              <meshStandardMaterial color="#525252" roughness={0.95} />
            </mesh>
          );
        })}
        {/* Crossed logs */}
        <mesh position={[0, 0.25, 0]} rotation={[0, Math.PI / 6, 0]}>
          <cylinderGeometry args={[0.08, 0.1, 1.4, 6]} />
          <meshStandardMaterial color="#451a03" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.25, 0]} rotation={[0, -Math.PI / 4, 0]}>
          <cylinderGeometry args={[0.08, 0.1, 1.4, 6]} />
          <meshStandardMaterial color="#78350f" roughness={0.9} />
        </mesh>
        {/* Flames */}
        <mesh position={[0, 0.65, 0]}>
          <coneGeometry args={[0.35, 0.85, 8]} />
          <meshStandardMaterial color="#f97316" emissive="#fde047" emissiveIntensity={1.8} toneMapped={false} transparent opacity={0.85} />
        </mesh>
        <mesh position={[0.1, 0.55, -0.05]}>
          <coneGeometry args={[0.22, 0.55, 6]} />
          <meshStandardMaterial color="#dc2626" emissive="#f97316" emissiveIntensity={1.5} toneMapped={false} transparent opacity={0.8} />
        </mesh>
        {/* Two driftwood log seats nearby */}
        <mesh position={[1.6, 0.18, 0.4]} rotation={[0, 0.3, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.22, 0.22, 1.3, 8]} />
          <meshStandardMaterial color="#78350f" roughness={0.9} />
        </mesh>
        <mesh position={[-1.6, 0.18, -0.4]} rotation={[0, -0.3, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.22, 0.22, 1.3, 8]} />
          <meshStandardMaterial color="#92400e" roughness={0.9} />
        </mesh>
      </group>

      {/* ── KITE FLYING IN THE SKY — colorful diamond tethered to the sand ── */}
      <group position={[64, 8, 65]} rotation={[0.3, 0.5, 0.4]}>
        {/* Kite diamond */}
        <mesh>
          <boxGeometry args={[1.1, 1.1, 0.02]} />
          <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={0.5} side={THREE.DoubleSide} />
        </mesh>
        {/* Cross spars */}
        <mesh>
          <boxGeometry args={[1.15, 0.06, 0.04]} />
          <meshStandardMaterial color="#1c1917" />
        </mesh>
        <mesh>
          <boxGeometry args={[0.06, 1.15, 0.04]} />
          <meshStandardMaterial color="#1c1917" />
        </mesh>
        {/* Kite tail bows */}
        {[0.6, 0.95, 1.3].map((d, i) => (
          <mesh key={`bow-${i}`} position={[-d * 0.4, -d, 0]}>
            <boxGeometry args={[0.22, 0.08, 0.02]} />
            <meshStandardMaterial color={i % 2 ? "#fde047" : "#22d3ee"} emissive={i % 2 ? "#facc15" : "#22d3ee"} emissiveIntensity={0.6} />
          </mesh>
        ))}
      </group>
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
  // Expansion refs
  const trackingDishRefs = useRef<Array<THREE.Group | null>>([]);
  const satDishRefs = useRef<Array<THREE.Group | null>>([]);
  const centrifugeRef = useRef<THREE.Group>(null!);
  const mcRadarRef = useRef<THREE.Group>(null!);
  const mcBeaconRef = useRef<THREE.MeshStandardMaterial>(null!);
  const warningLightRefs = useRef<Array<THREE.MeshStandardMaterial | null>>([]);
  const fuelRingRefs = useRef<Array<THREE.MeshStandardMaterial | null>>([]);
  const countdownRef = useRef<THREE.MeshStandardMaterial>(null!);
  const solarPanelRefs = useRef<Array<THREE.MeshStandardMaterial | null>>([]);
  const droneRef = useRef<THREE.Group>(null!);
  const droneLightRef = useRef<THREE.MeshStandardMaterial>(null!);
  const heavyGantryLightRefs = useRef<Array<THREE.MeshStandardMaterial | null>>([]);

  const CYCLE = 28; // seconds — full loop
  const IGNITE_AT = 18;
  const LIFTOFF_AT = 20;
  const APOGEE_AT = 28;
  const MAX_ALT = 80;

  useFrame((state) => {
    const t = state.clock.elapsedTime % CYCLE;
    const T = state.clock.elapsedTime;
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
    // ── Expansion animations ──────────────────────────────────────────
    // Big tracking dishes — each rotates at its own rate with a slow tilt
    trackingDishRefs.current.forEach((g, i) => {
      if (!g) return;
      g.rotation.y = Math.sin(T * (0.15 + i * 0.07)) * 1.2;
      // Children order: [0]=pillar, [1]=tilt mount group, [2]=base plinth
      const tiltMount = g.children[1] as THREE.Object3D | undefined;
      if (tiltMount) tiltMount.rotation.x = -0.6 + Math.sin(T * (0.3 + i * 0.1)) * 0.25;
    });
    // Satellite comms array — synchronized slow sweep
    satDishRefs.current.forEach((g, i) => {
      if (!g) return;
      g.rotation.y = Math.sin(T * 0.4 + i * 0.4) * 0.8;
    });
    // Centrifuge — steady spin
    if (centrifugeRef.current) centrifugeRef.current.rotation.y = T * 1.3;
    // Mission Control radar — slow continuous sweep
    if (mcRadarRef.current) mcRadarRef.current.rotation.y = T * 0.5;
    // Mission Control beacon — pulse
    if (mcBeaconRef.current) mcBeaconRef.current.emissiveIntensity = 1.2 + Math.sin(T * 3) * 0.9;
    // Perimeter warning lights — staggered blink
    warningLightRefs.current.forEach((m, i) => {
      if (m) m.emissiveIntensity = 0.3 + (Math.sin(T * 2 + i * 1.3) > 0 ? 1.5 : 0);
    });
    // Fuel tank glow rings — slow breathe
    fuelRingRefs.current.forEach((m, i) => {
      if (m) m.emissiveIntensity = 0.7 + Math.sin(T * 1.1 + i * 0.5) * 0.5;
    });
    // Countdown display — heartbeat
    if (countdownRef.current) {
      const inIgnition = t >= IGNITE_AT;
      countdownRef.current.emissiveIntensity = inIgnition
        ? 2.2 + Math.sin(T * 8) * 0.8
        : 1.0 + Math.sin(T * 1.4) * 0.3;
    }
    // Solar panels — subtle shimmer
    solarPanelRefs.current.forEach((m, i) => {
      if (m) m.emissiveIntensity = 0.6 + Math.sin(T * 0.8 + i * 0.6) * 0.3;
    });
    // Drone — small lazy orbit in empty NW quadrant, away from launch core,
    // gantries, VAB, sat array, centrifuge, and solar field.
    if (droneRef.current) {
      droneRef.current.position.x = -8 + Math.cos(T * 0.5) * 3;
      droneRef.current.position.z = -12 + Math.sin(T * 0.5) * 3;
      droneRef.current.position.y = 6 + Math.sin(T * 1.5) * 0.4;
      droneRef.current.rotation.y = T * 0.5 + Math.PI / 2;
    }
    if (droneLightRef.current) droneLightRef.current.emissiveIntensity = 1.0 + Math.sin(T * 5) * 0.8;
    // Heavy-lift gantry lights — chase pattern
    heavyGantryLightRefs.current.forEach((m, i) => {
      if (m) m.emissiveIntensity = 0.5 + Math.max(0, Math.sin(T * 2 - i * 0.5)) * 1.5;
    });
  });

  return (
    <group position={[75, 0, -75]}>
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

      {/* ════════════════════════════════════════════════════════════════
          MAJOR EXPANSION — full spaceport campus
          Anchored at world (75, 0, -75), well outside the ±64 player bound,
          so this is pure distant spectacle. Local envelope ~ x[-25, 22],
          z[-22, 30]. Main pad fills local x[-6,6], z[-6,6].
          ═══════════════════════════════════════════════════════════════ */}

      {/* ── DARK TARMAC ground covering the whole spaceport ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1, 0.01, 4]} receiveShadow>
        <planeGeometry args={[46, 50]} />
        <meshStandardMaterial color="#1f2937" roughness={0.95} />
      </mesh>
      {/* Launch-direction painted arrow strip */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 12]}>
        <planeGeometry args={[1.0, 10]} />
        <meshStandardMaterial color="#fde047" emissive="#facc15" emissiveIntensity={0.5} toneMapped={false} />
      </mesh>

      {/* ──────────── VAB (Vehicle Assembly Building) — south ─────────── */}
      <group position={[0, 0, 22]}>
        {/* Main hangar body — huge */}
        <mesh position={[0, 9, 0]} castShadow>
          <boxGeometry args={[14, 18, 14]} />
          <meshStandardMaterial color="#e5e7eb" roughness={0.7} />
        </mesh>
        {/* Iconic vertical stripes (5) */}
        {[-5, -2.5, 0, 2.5, 5].map((x) => (
          <mesh key={`vab-s-${x}`} position={[x, 9, 7.01]}>
            <boxGeometry args={[0.8, 15, 0.02]} />
            <meshStandardMaterial color="#0b1220" emissive="#0f172a" emissiveIntensity={0.2} />
          </mesh>
        ))}
        {/* Huge VAB doors (north face — facing the pads) */}
        <mesh position={[0, 6, -7.01]}>
          <boxGeometry args={[8, 12, 0.05]} />
          <meshStandardMaterial color="#475569" emissive="#22d3ee" emissiveIntensity={0.15} metalness={0.4} />
        </mesh>
        {/* Door panel divisions */}
        {[-2.6, 0, 2.6].map((dx) => (
          <mesh key={`vd-${dx}`} position={[dx, 6, -7.02]}>
            <boxGeometry args={[0.06, 12, 0.02]} />
            <meshStandardMaterial color="#0b1220" />
          </mesh>
        ))}
        {/* Roof top trim */}
        <mesh position={[0, 18.2, 0]}>
          <boxGeometry args={[14.5, 0.4, 14.5]} />
          <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.5} />
        </mesh>
        {/* BIG BOTROCKET logo on west face */}
        <mesh position={[-7.01, 12, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[10, 4]} />
          <meshStandardMaterial color="#0b1220" />
        </mesh>
        <Text
          position={[-7.02, 13, 0]}
          rotation={[0, -Math.PI / 2, 0]}
          fontSize={1.6}
          color="#f97316"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.1}
          outlineColor="#0b1220"
        >
          🚀 BOTROCKET
        </Text>
        <Text
          position={[-7.02, 11, 0]}
          rotation={[0, -Math.PI / 2, 0]}
          fontSize={0.65}
          color="#fbbf24"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor="#0b1220"
        >
          VEHICLE ASSEMBLY
        </Text>
        {/* American-flag-style square on north top-right */}
        <mesh position={[5, 15, -7.01]}>
          <planeGeometry args={[2.4, 1.6]} />
          <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.4} />
        </mesh>
        {/* Roof beacons */}
        {[[-6, 6], [6, 6], [-6, -6], [6, -6]].map(([bx, bz], i) => (
          <mesh key={`vab-bcn-${i}`} position={[bx, 18.5, bz]}>
            <sphereGeometry args={[0.18, 8, 8]} />
            <meshStandardMaterial
              ref={(m) => { warningLightRefs.current[i] = m; }}
              color="#ef4444"
              emissive="#ef4444"
              emissiveIntensity={1.5}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>

      {/* ──────────── MISSION CONTROL TOWER — SW ──────────── */}
      <group position={[-15, 0, 8]}>
        {/* Wide base / building */}
        <mesh position={[0, 1.5, 0]} castShadow>
          <boxGeometry args={[6, 3, 5]} />
          <meshStandardMaterial color="#f3f4f6" roughness={0.7} />
        </mesh>
        {/* Window strips */}
        {[1.0, 2.0].map((wy, i) => (
          <mesh key={`mc-w-${i}`} position={[0, wy, 2.51]}>
            <boxGeometry args={[5.6, 0.4, 0.02]} />
            <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.9} transparent opacity={0.85} toneMapped={false} />
          </mesh>
        ))}
        {/* Tower shaft */}
        <mesh position={[2, 5.5, 0]} castShadow>
          <boxGeometry args={[2.5, 8, 2.5]} />
          <meshStandardMaterial color="#0f172a" emissive="#22d3ee" emissiveIntensity={0.2} metalness={0.4} />
        </mesh>
        {/* Tower windows wrap */}
        {[5, 6, 7, 8].map((wy) => (
          <mesh key={`mc-tw-${wy}`} position={[2, wy, 1.26]}>
            <boxGeometry args={[2.1, 0.35, 0.02]} />
            <meshStandardMaterial color="#fde047" emissive="#fde047" emissiveIntensity={0.85} toneMapped={false} />
          </mesh>
        ))}
        {/* Glass-box control room on top */}
        <mesh position={[2, 9.9, 0]} castShadow>
          <boxGeometry args={[3.2, 1.4, 3.2]} />
          <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.6} transparent opacity={0.65} toneMapped={false} />
        </mesh>
        {/* Antenna spire */}
        <mesh position={[2, 12, 0]}>
          <cylinderGeometry args={[0.08, 0.12, 3, 6]} />
          <meshStandardMaterial color="#475569" metalness={0.8} />
        </mesh>
        {/* Pulsing beacon at the top */}
        <mesh position={[2, 13.7, 0]}>
          <sphereGeometry args={[0.2, 10, 10]} />
          <meshStandardMaterial ref={mcBeaconRef} color="#ef4444" emissive="#ef4444" emissiveIntensity={1.4} toneMapped={false} />
        </mesh>
        {/* Roof radar dish — slowly rotating */}
        <group ref={mcRadarRef} position={[-1, 11.2, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[1.0, 0.05, 0.15, 24, 1, true]} />
            <meshStandardMaterial color="#f8fafc" emissive="#22d3ee" emissiveIntensity={0.3} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <coneGeometry args={[0.08, 0.4, 8]} />
            <meshStandardMaterial color="#94a3b8" />
          </mesh>
        </group>
        {/* Signage */}
        <mesh position={[0, 3.3, 2.51]}>
          <boxGeometry args={[4.4, 0.5, 0.04]} />
          <meshStandardMaterial color="#0b1220" />
        </mesh>
        <Text
          position={[0, 3.3, 2.54]}
          fontSize={0.32}
          color="#f97316"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#0b1220"
        >
          MISSION CONTROL
        </Text>
      </group>

      {/* ──────────── SECONDARY HEAVY-LIFT PAD — east ──────────── */}
      <group position={[15, 0, 5]}>
        {/* Concrete pad */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]} receiveShadow>
          <planeGeometry args={[8, 8]} />
          <meshStandardMaterial color="#3f3f46" roughness={0.9} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
          <ringGeometry args={[1.3, 2.3, 32]} />
          <meshStandardMaterial color="#18181b" emissive="#3b82f6" emissiveIntensity={0.4} />
        </mesh>
        {/* Heavy-lift gantry — taller and wider than primary */}
        {[
          [1.6, 1.6], [-1.6, 1.6], [1.6, -1.6], [-1.6, -1.6],
        ].map(([gx, gz], i) => (
          <mesh key={`hgleg-${i}`} position={[gx, 8, gz]} castShadow>
            <boxGeometry args={[0.2, 16, 0.2]} />
            <meshStandardMaterial color="#475569" emissive="#22d3ee" emissiveIntensity={0.25} metalness={0.7} />
          </mesh>
        ))}
        {/* Cross bracing */}
        {[2, 5, 8, 11, 14].map((cy, ci) => (
          <group key={`hgb-${ci}`} position={[0, cy, 0]}>
            <mesh position={[0, 0, 1.6]}>
              <boxGeometry args={[3.2, 0.12, 0.12]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
            <mesh position={[0, 0, -1.6]}>
              <boxGeometry args={[3.2, 0.12, 0.12]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
            <mesh position={[1.6, 0, 0]}>
              <boxGeometry args={[0.12, 0.12, 3.2]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
            <mesh position={[-1.6, 0, 0]}>
              <boxGeometry args={[0.12, 0.12, 3.2]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
            {/* Chasing light on the front bracing */}
            <mesh position={[0, 0, 1.66]}>
              <sphereGeometry args={[0.1, 8, 8]} />
              <meshStandardMaterial
                ref={(m) => { heavyGantryLightRefs.current[ci] = m; }}
                color="#22d3ee"
                emissive="#22d3ee"
                emissiveIntensity={1.0}
                toneMapped={false}
              />
            </mesh>
          </group>
        ))}
        {/* Service arm */}
        <mesh position={[0.9, 9, 0]}>
          <boxGeometry args={[1.8, 0.15, 0.5]} />
          <meshStandardMaterial color="#92400e" />
        </mesh>
        {/* Heavy-lift rocket — idle, blue-and-black scheme */}
        <group position={[0, 0, 0]}>
          {/* Booster cluster — 3 booster cylinders strapped to a core */}
          {[[1.1, 0], [-0.55, 0.95], [-0.55, -0.95]].map(([bx, bz], i) => (
            <mesh key={`hr-b-${i}`} position={[bx, 6, bz]} castShadow>
              <cylinderGeometry args={[0.55, 0.6, 12, 18]} />
              <meshStandardMaterial color="#0f172a" emissive="#1e3a8a" emissiveIntensity={0.4} />
            </mesh>
          ))}
          {/* Core stage */}
          <mesh position={[0, 7.5, 0]} castShadow>
            <cylinderGeometry args={[0.9, 1.0, 15, 22]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.5} metalness={0.4} />
          </mesh>
          {/* Black band */}
          <mesh position={[0, 11, 0]}>
            <cylinderGeometry args={[0.95, 0.95, 0.4, 22]} />
            <meshStandardMaterial color="#0b1220" />
          </mesh>
          {/* Blue stripe */}
          <mesh position={[0, 5, 0]}>
            <cylinderGeometry args={[1.02, 1.05, 0.6, 22]} />
            <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.7} toneMapped={false} />
          </mesh>
          {/* Nose cone */}
          <mesh position={[0, 16, 0]} castShadow>
            <coneGeometry args={[0.9, 3.0, 22]} />
            <meshStandardMaterial color="#1e3a8a" emissive="#3b82f6" emissiveIntensity={0.55} metalness={0.5} />
          </mesh>
          {/* Booster engine bells */}
          {[[1.1, 0], [-0.55, 0.95], [-0.55, -0.95]].map(([bx, bz], i) => (
            <mesh key={`hr-be-${i}`} position={[bx, -0.35, bz]} castShadow>
              <cylinderGeometry args={[0.35, 0.55, 0.6, 12]} />
              <meshStandardMaterial color="#27272a" metalness={0.85} />
            </mesh>
          ))}
          {/* Core engine cluster */}
          <mesh position={[0, -0.35, 0]} castShadow>
            <cylinderGeometry args={[0.65, 0.95, 0.7, 18]} />
            <meshStandardMaterial color="#27272a" metalness={0.85} />
          </mesh>
        </group>
        {/* Pad signage post */}
        <mesh position={[0, 0.4, -3.6]}>
          <boxGeometry args={[2.6, 0.6, 0.1]} />
          <meshStandardMaterial color="#0b1220" />
        </mesh>
        <Text
          position={[0, 0.4, -3.55]}
          fontSize={0.28}
          color="#3b82f6"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.022}
          outlineColor="#0b1220"
        >
          PAD 39B · HEAVY-LIFT
        </Text>
      </group>

      {/* ──────────── BIG TRACKING DISHES (3) — west ──────────── */}
      {[[-20, -10, 1.0], [-22, -3, 1.2], [-18, 4, 0.9]].map(([dx, dz, ds], i) => (
        <group key={`td-${i}`} ref={(g) => { trackingDishRefs.current[i] = g; }} position={[dx, 0, dz]}>
          {/* Pillar */}
          <mesh position={[0, 1.5, 0]} castShadow>
            <cylinderGeometry args={[0.4, 0.55, 3, 10]} />
            <meshStandardMaterial color="#475569" metalness={0.5} />
          </mesh>
          {/* Tilt mount (group.children[0] — useFrame tilts this) */}
          <group position={[0, 3.0, 0]}>
            <mesh position={[0, 0.5, 0]}>
              <cylinderGeometry args={[0.18, 0.18, 0.6, 8]} />
              <meshStandardMaterial color="#1f2937" />
            </mesh>
            {/* Parabolic dish */}
            <mesh position={[0, 1.0, 0]} scale={[ds, 1, ds]}>
              <sphereGeometry args={[2.2, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2.6]} />
              <meshStandardMaterial color="#f8fafc" emissive="#22d3ee" emissiveIntensity={0.4} side={THREE.DoubleSide} metalness={0.3} />
            </mesh>
            {/* Feed horn */}
            <mesh position={[0, 1.7, 0]}>
              <coneGeometry args={[0.18, 0.55, 10]} />
              <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={1.0} toneMapped={false} />
            </mesh>
            {/* Tripod feed support arms */}
            {[0, 1, 2].map((j) => (
              <mesh
                key={`th-${j}`}
                position={[Math.cos((j * 2 * Math.PI) / 3) * 0.9, 1.0, Math.sin((j * 2 * Math.PI) / 3) * 0.9]}
                rotation={[0, 0, 0]}
              >
                <cylinderGeometry args={[0.03, 0.03, 1.2, 6]} />
                <meshStandardMaterial color="#94a3b8" />
              </mesh>
            ))}
          </group>
          {/* Base plinth */}
          <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[1.2, 1.2, 0.2, 14]} />
            <meshStandardMaterial color="#1f2937" />
          </mesh>
        </group>
      ))}

      {/* ──────────── SATELLITE COMM ARRAY (5 small dishes) — NE ──────────── */}
      {[-4, -2, 0, 2, 4].map((sx, i) => (
        <group key={`sa-${i}`} ref={(g) => { satDishRefs.current[i] = g; }} position={[15 + sx, 0, -12]}>
          <mesh position={[0, 1, 0]} castShadow>
            <cylinderGeometry args={[0.12, 0.18, 2.0, 8]} />
            <meshStandardMaterial color="#475569" metalness={0.5} />
          </mesh>
          <mesh position={[0, 2.1, 0.15]} rotation={[-0.4, 0, 0]}>
            <sphereGeometry args={[0.5, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2.6]} />
            <meshStandardMaterial color="#e5e7eb" emissive="#22d3ee" emissiveIntensity={0.35} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 2.3, 0.4]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={1.4} toneMapped={false} />
          </mesh>
        </group>
      ))}

      {/* ──────────── FUEL TANK FARM (4 silver spheres) — SE ──────────── */}
      {[[16, 16], [20, 16], [16, 20], [20, 20]].map(([fx, fz], i) => (
        <group key={`ft-${i}`} position={[fx, 0, fz]}>
          {/* Sphere */}
          <mesh position={[0, 2.2, 0]} castShadow>
            <sphereGeometry args={[1.6, 20, 16]} />
            <meshStandardMaterial color="#e5e7eb" metalness={0.85} roughness={0.25} />
          </mesh>
          {/* Glow ring around equator */}
          <mesh position={[0, 2.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.62, 0.06, 6, 24]} />
            <meshStandardMaterial
              ref={(m) => { fuelRingRefs.current[i] = m; }}
              color="#22d3ee"
              emissive="#22d3ee"
              emissiveIntensity={0.9}
              toneMapped={false}
            />
          </mesh>
          {/* Tripod supports */}
          {[0, 1, 2, 3].map((j) => (
            <mesh
              key={`fts-${j}`}
              position={[Math.cos((j * Math.PI) / 2) * 1.3, 0.6, Math.sin((j * Math.PI) / 2) * 1.3]}
              rotation={[0, 0, 0]}
            >
              <cylinderGeometry args={[0.1, 0.15, 1.2, 6]} />
              <meshStandardMaterial color="#475569" metalness={0.6} />
            </mesh>
          ))}
          {/* "LOX" / "LH2" placards */}
          <Text
            position={[0, 2.2, 1.65]}
            fontSize={0.32}
            color="#0c4a6e"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#f0f9ff"
          >
            {i % 2 === 0 ? "LOX" : "LH₂"}
          </Text>
        </group>
      ))}

      {/* ──────────── SPACE SHUTTLE on CRAWLER TRANSPORTER — between MC and VAB ──────────── */}
      {/* z=11 keeps the shuttle (depth ~5) clear of the VAB north face at z=15 */}
      <group position={[-3, 0, 11]}>
        {/* Crawler chassis */}
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[5, 0.8, 3.4]} />
          <meshStandardMaterial color="#1f2937" metalness={0.6} roughness={0.5} />
        </mesh>
        {/* Yellow safety stripes on crawler */}
        {[-2.3, 2.3].map((cx, i) => (
          <mesh key={`cs-${i}`} position={[cx, 0.4, 0]}>
            <boxGeometry args={[0.06, 0.85, 3.5]} />
            <meshStandardMaterial color="#fde047" emissive="#facc15" emissiveIntensity={0.6} />
          </mesh>
        ))}
        {/* Crawler tracks */}
        {[[-1.4, 0], [1.4, 0]].map(([tx, tz], i) => (
          <mesh key={`ct-${i}`} position={[0, 0.18, tz + (i === 0 ? -1.6 : 1.6)]}>
            <boxGeometry args={[5.4, 0.36, 0.7]} />
            <meshStandardMaterial color="#0b1220" />
          </mesh>
        ))}
        {/* Mobile launcher platform */}
        <mesh position={[0, 1.0, 0]}>
          <boxGeometry args={[4.4, 0.4, 2.8]} />
          <meshStandardMaterial color="#374151" metalness={0.5} />
        </mesh>
        {/* Shuttle external tank (orange) */}
        <mesh position={[0, 4, 0]} castShadow>
          <cylinderGeometry args={[0.85, 0.95, 5.5, 18]} />
          <meshStandardMaterial color="#c2410c" emissive="#ea580c" emissiveIntensity={0.35} />
        </mesh>
        <mesh position={[0, 7.2, 0]} castShadow>
          <coneGeometry args={[0.85, 1.4, 18]} />
          <meshStandardMaterial color="#c2410c" emissive="#ea580c" emissiveIntensity={0.4} />
        </mesh>
        {/* Solid rocket boosters strapped to the tank */}
        {[-1.5, 1.5].map((sx, i) => (
          <group key={`srb-${i}`}>
            <mesh position={[sx, 3.8, 0]} castShadow>
              <cylinderGeometry args={[0.35, 0.4, 5.0, 14]} />
              <meshStandardMaterial color="#f8fafc" emissive="#e2e8f0" emissiveIntensity={0.2} />
            </mesh>
            <mesh position={[sx, 6.45, 0]} castShadow>
              <coneGeometry args={[0.35, 0.6, 14]} />
              <meshStandardMaterial color="#0b1220" />
            </mesh>
          </group>
        ))}
        {/* Shuttle orbiter — white, attached to side of tank */}
        <group position={[0, 4.2, 1.6]} rotation={[0, 0, 0]}>
          {/* Fuselage */}
          <mesh position={[0, 0, 0]} scale={[0.7, 0.7, 1.9]} castShadow>
            <sphereGeometry args={[1, 14, 10]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.5} />
          </mesh>
          {/* Cockpit window strip */}
          <mesh position={[0, 0.25, 1.55]}>
            <boxGeometry args={[1.0, 0.2, 0.04]} />
            <meshStandardMaterial color="#0b1220" emissive="#22d3ee" emissiveIntensity={0.65} />
          </mesh>
          {/* Tail fin */}
          <mesh position={[0, 0.85, -1.4]} castShadow>
            <boxGeometry args={[0.08, 1.0, 0.9]} />
            <meshStandardMaterial color="#f1f5f9" />
          </mesh>
          {/* Delta wings */}
          <mesh position={[0, -0.3, -0.3]} rotation={[0, 0, 0]} castShadow>
            <boxGeometry args={[3.2, 0.12, 1.4]} />
            <meshStandardMaterial color="#0b1220" />
          </mesh>
          {/* Three main engine bells */}
          {[-0.3, 0, 0.3].map((ex, i) => (
            <mesh key={`shu-e-${i}`} position={[ex, 0, -1.7]}>
              <cylinderGeometry args={[0.16, 0.22, 0.4, 10]} />
              <meshStandardMaterial color="#27272a" metalness={0.85} />
            </mesh>
          ))}
        </group>
        {/* Crawler sign */}
        <mesh position={[0, 0.05, -2.3]}>
          <boxGeometry args={[3.6, 0.1, 0.5]} />
          <meshStandardMaterial color="#fde047" emissive="#facc15" emissiveIntensity={0.5} />
        </mesh>
        <Text
          position={[0, 0.06, -2.06]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.22}
          color="#0b1220"
          anchorX="center"
          anchorY="middle"
        >
          CRAWLERWAY · KEEP CLEAR
        </Text>
      </group>

      {/* ──────────── CENTRIFUGE — astronaut training rig (NW corner) ──────────── */}
      <group position={[-15, 0, -18]}>
        {/* Circular foundation */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]} receiveShadow>
          <circleGeometry args={[4.5, 28]} />
          <meshStandardMaterial color="#3f3f46" roughness={0.85} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
          <ringGeometry args={[4.0, 4.4, 28]} />
          <meshStandardMaterial color="#fde047" emissive="#facc15" emissiveIntensity={0.5} toneMapped={false} />
        </mesh>
        {/* Central hub */}
        <mesh position={[0, 1.0, 0]} castShadow>
          <cylinderGeometry args={[0.9, 1.1, 2.0, 14]} />
          <meshStandardMaterial color="#475569" metalness={0.7} />
        </mesh>
        {/* Rotating arm + capsule */}
        <group ref={centrifugeRef} position={[0, 2.0, 0]}>
          {/* Arm */}
          <mesh position={[1.7, 0, 0]} castShadow>
            <boxGeometry args={[3.4, 0.3, 0.4]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.6} />
          </mesh>
          {/* Counter-arm */}
          <mesh position={[-1.4, 0, 0]} castShadow>
            <boxGeometry args={[2.8, 0.3, 0.4]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.6} />
          </mesh>
          {/* Capsule (training pod) */}
          <group position={[3.2, 0, 0]} rotation={[0, 0, 0.3]}>
            <mesh castShadow>
              <sphereGeometry args={[0.55, 14, 10]} />
              <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={0.5} />
            </mesh>
            <mesh position={[0, 0, 0.5]}>
              <circleGeometry args={[0.25, 16]} />
              <meshStandardMaterial color="#0b1220" emissive="#22d3ee" emissiveIntensity={0.8} />
            </mesh>
          </group>
          {/* Counterweight on opposite end */}
          <mesh position={[-2.6, 0, 0]} castShadow>
            <boxGeometry args={[0.6, 0.6, 0.6]} />
            <meshStandardMaterial color="#0b1220" />
          </mesh>
        </group>
        {/* Sign */}
        <Text
          position={[0, 0.4, 4.8]}
          fontSize={0.32}
          color="#fde047"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.024}
          outlineColor="#0b1220"
        >
          G-FORCE TRAINING
        </Text>
      </group>

      {/* ──────────── ASTRONAUT BOT STATUE (north entrance) ──────────── */}
      <group position={[0, 0, -11]}>
        {/* Plinth */}
        <mesh position={[0, 0.45, 0]} castShadow>
          <boxGeometry args={[1.6, 0.9, 1.6]} />
          <meshStandardMaterial color="#44403c" roughness={0.6} />
        </mesh>
        {/* Suit body */}
        <mesh position={[0, 1.85, 0]} castShadow>
          <boxGeometry args={[0.9, 1.4, 0.65]} />
          <meshStandardMaterial color="#f8fafc" emissive="#fef9c3" emissiveIntensity={0.18} />
        </mesh>
        {/* Helmet (gold visor) */}
        <mesh position={[0, 2.85, 0]} castShadow>
          <sphereGeometry args={[0.42, 14, 12]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.6} roughness={0.3} />
        </mesh>
        {/* Visor */}
        <mesh position={[0, 2.85, 0.22]} rotation={[0, 0, 0]}>
          <sphereGeometry args={[0.32, 14, 12, 0, Math.PI, Math.PI / 4, Math.PI / 2]} />
          <meshStandardMaterial color="#fbbf24" emissive="#facc15" emissiveIntensity={0.7} metalness={0.85} roughness={0.15} />
        </mesh>
        {/* Backpack */}
        <mesh position={[0, 1.85, -0.45]} castShadow>
          <boxGeometry args={[0.7, 1.0, 0.25]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.5} />
        </mesh>
        {/* Arms */}
        {[-0.55, 0.55].map((ax, i) => (
          <mesh key={`as-${i}`} position={[ax, 1.85, 0]} castShadow>
            <cylinderGeometry args={[0.16, 0.16, 1.3, 10]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
        ))}
        {/* Legs */}
        {[-0.22, 0.22].map((lx, i) => (
          <mesh key={`al-${i}`} position={[lx, 1.0, 0]} castShadow>
            <cylinderGeometry args={[0.18, 0.2, 0.8, 10]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
        ))}
        {/* Flag pole + flag */}
        <mesh position={[0.7, 2.6, 0.3]}>
          <cylinderGeometry args={[0.04, 0.04, 2.2, 6]} />
          <meshStandardMaterial color="#0b1220" />
        </mesh>
        <mesh position={[1.1, 3.3, 0.3]} rotation={[0, 0, 0]}>
          <planeGeometry args={[0.8, 0.5]} />
          <meshStandardMaterial color="#dc2626" emissive="#ef4444" emissiveIntensity={0.7} side={THREE.DoubleSide} />
        </mesh>
        <Text
          position={[1.1, 3.3, 0.32]}
          fontSize={0.13}
          color="#fde047"
          anchorX="center"
          anchorY="middle"
        >
          🚀 BOT
        </Text>
        {/* Plaque */}
        <Text
          position={[0, 0.5, 0.82]}
          fontSize={0.13}
          color="#fde047"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.01}
          outlineColor="#0b1220"
        >
          FIRST BOT ON MARS
        </Text>
      </group>

      {/* ──────────── COUNTDOWN CLOCK (south of pad, visible from main avenue) ──────────── */}
      <group position={[-5, 0, 11]}>
        {/* Post */}
        <mesh position={[0, 1.1, 0]} castShadow>
          <boxGeometry args={[0.18, 2.2, 0.18]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
        {/* Display panel */}
        <mesh position={[0, 2.8, 0]}>
          <boxGeometry args={[3.5, 1.4, 0.2]} />
          <meshStandardMaterial color="#0b1220" />
        </mesh>
        {/* LED frame */}
        <mesh position={[0, 2.8, 0.11]}>
          <boxGeometry args={[3.3, 1.2, 0.04]} />
          <meshStandardMaterial
            ref={countdownRef}
            color="#22d3ee"
            emissive="#22d3ee"
            emissiveIntensity={1.4}
            toneMapped={false}
          />
        </mesh>
        <Text
          position={[0, 3.05, 0.14]}
          fontSize={0.22}
          color="#fde047"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.012}
          outlineColor="#0b1220"
        >
          ⌚ NEXT LAUNCH
        </Text>
        <Text
          position={[0, 2.55, 0.14]}
          fontSize={0.42}
          color="#0b1220"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.022}
          outlineColor="#22d3ee"
        >
          T - 00:28
        </Text>
      </group>

      {/* ──────────── SOLAR PANEL FIELD (NE) ──────────── */}
      <group position={[12, 0, -18]}>
        {[
          [-3, -1.5], [0, -1.5], [3, -1.5],
          [-3, 1.5], [0, 1.5], [3, 1.5],
        ].map(([px, pz], i) => (
          <group key={`sp-${i}`} position={[px, 0, pz]}>
            {/* Post */}
            <mesh position={[0, 0.6, 0]} castShadow>
              <cylinderGeometry args={[0.06, 0.08, 1.2, 6]} />
              <meshStandardMaterial color="#475569" metalness={0.6} />
            </mesh>
            {/* Panel (tilted) */}
            <mesh position={[0, 1.2, 0]} rotation={[-0.5, 0, 0]} castShadow>
              <boxGeometry args={[2.2, 0.06, 1.4]} />
              <meshStandardMaterial
                ref={(m) => { solarPanelRefs.current[i] = m; }}
                color="#1e3a8a"
                emissive="#3b82f6"
                emissiveIntensity={0.65}
                metalness={0.6}
                roughness={0.3}
              />
            </mesh>
            {/* Grid lines */}
            {[-0.7, 0, 0.7].map((gx, gi) => (
              <mesh key={`spg-${gi}`} position={[gx, 1.21, 0]} rotation={[-0.5, 0, 0]}>
                <boxGeometry args={[0.04, 0.07, 1.42]} />
                <meshStandardMaterial color="#0b1220" />
              </mesh>
            ))}
          </group>
        ))}
        {/* Field sign */}
        <Text
          position={[0, 0.4, -3.5]}
          fontSize={0.28}
          color="#3b82f6"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.022}
          outlineColor="#0b1220"
        >
          ☀ SOLAR FARM
        </Text>
      </group>

      {/* ──────────── DRONE — small surveillance drone orbiting ──────────── */}
      <group ref={droneRef} position={[4, 6, 5]}>
        {/* Body */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.35, 0.15, 0.35]} />
          <meshStandardMaterial color="#0b1220" emissive="#22d3ee" emissiveIntensity={0.3} />
        </mesh>
        {/* Rotor arms */}
        {[[0.3, 0.3], [-0.3, 0.3], [0.3, -0.3], [-0.3, -0.3]].map(([rx, rz], i) => (
          <group key={`dr-${i}`} position={[rx, 0.08, rz]}>
            <mesh>
              <cylinderGeometry args={[0.02, 0.02, 0.06, 6]} />
              <meshStandardMaterial color="#475569" />
            </mesh>
            <mesh rotation={[0, 0, 0]}>
              <boxGeometry args={[0.4, 0.01, 0.05]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
            <mesh rotation={[0, Math.PI / 2, 0]}>
              <boxGeometry args={[0.4, 0.01, 0.05]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
          </group>
        ))}
        {/* Blinking underbelly light */}
        <mesh position={[0, -0.1, 0]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial
            ref={droneLightRef}
            color="#ef4444"
            emissive="#ef4444"
            emissiveIntensity={1.4}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* ──────────── PERIMETER WARNING LIGHT POLES ──────────── */}
      {[[-22, -20], [22, -20], [-22, 28], [22, 28]].map(([wx, wz], i) => (
        <group key={`wl-${i}`} position={[wx, 0, wz]}>
          <mesh position={[0, 2, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.12, 4, 6]} />
            <meshStandardMaterial color="#1f2937" metalness={0.5} />
          </mesh>
          {/* Beacon dome */}
          <mesh position={[0, 4.2, 0]}>
            <sphereGeometry args={[0.28, 12, 12]} />
            <meshStandardMaterial
              ref={(m) => { warningLightRefs.current[4 + i] = m; }}
              color="#ef4444"
              emissive="#ef4444"
              emissiveIntensity={1.4}
              toneMapped={false}
            />
          </mesh>
          {/* Light shroud */}
          <mesh position={[0, 4.2, 0]}>
            <cylinderGeometry args={[0.32, 0.32, 0.1, 12, 1, true]} />
            <meshStandardMaterial color="#0b1220" side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}

      {/* ──────────── DECORATIVE GROUND DECALS — concentric guidance rings ──────────── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <ringGeometry args={[10, 10.3, 64]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.4} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <ringGeometry args={[15, 15.3, 64]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.25} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>

      {/* ──────────── ROAD MARKINGS — crawlerway from VAB to main pad ──────────── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.018, 13]}>
        <planeGeometry args={[5, 14]} />
        <meshStandardMaterial color="#27272a" emissive="#525252" emissiveIntensity={0.15} />
      </mesh>
      {/* Dashed center line */}
      {[8, 11, 14, 17, 20].map((cz, i) => (
        <mesh key={`crl-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, cz]}>
          <planeGeometry args={[0.2, 1.2]} />
          <meshStandardMaterial color="#fde047" emissive="#facc15" emissiveIntensity={0.6} toneMapped={false} />
        </mesh>
      ))}
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
    <group position={[-40.5, 0, 40.5]}>
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
    <group position={[-13.5, 0, -40.5]}>
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

// ===== BotFarm @ (-60, 0, -61.5) =====================================
// Far SW outer suburb. Barn kiosk rendered by Building.tsx via
// BUILDING_DEFS at (-60, 2, -61.5), footprint 5x4 → world x[-62.5,-57.5],
// z[-63.5,-59.5]. Decoration envelope:
//   world x ∈ [-72, -48]   (3u margin from map edge -75)
//   world z ∈ [-76.5, -56.5] (1.4u clear of z=-54 road band -55.1..-52.9)
// → local x ∈ [-12, +12], local z ∈ [-15, +5] (origin at -60,-61.5).
// Nearest landmark: botmine at (-75, -37.5) is 25u NW. Plenty of room
// to spread out — this used to be a tiny 5x4 plot; now it's a real farm
// with fields, windmill, water tower, pond, greenhouse, orchard,
// livestock, tractor, and entrance arch.
function Farm() {
  const scarecrowRef = useRef<THREE.Mesh>(null!);
  const beaconRef = useRef<THREE.Mesh>(null!);
  const windmillRef = useRef<THREE.Group>(null!);
  const chickenRefs = useRef<Array<THREE.Group | null>>([]);
  const tractorRef = useRef<THREE.Group>(null!);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (scarecrowRef.current) {
      scarecrowRef.current.rotation.y = Math.sin(t * 0.6) * 0.4;
    }
    if (beaconRef.current) {
      const mat = beaconRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 1.4 + Math.sin(t * 2.4) * 0.6;
    }
    // Windmill blades spin steadily.
    if (windmillRef.current) windmillRef.current.rotation.z = t * 1.1;
    // Chickens peck — hop up and down.
    chickenRefs.current.forEach((g, i) => {
      if (g) g.position.y = Math.abs(Math.sin(t * 3 + i * 1.3)) * 0.12;
    });
    // Tractor inches slowly back and forth along its row.
    if (tractorRef.current) {
      tractorRef.current.position.x = 4 + Math.sin(t * 0.5) * 1.2;
    }
  });
  return (
    <group position={[-60, 0, -61.5]}>
      {/* ── Soil patch under the barn ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <planeGeometry args={[5, 4]} />
        <meshStandardMaterial color="#3f2a1d" emissive="#7c2d12" emissiveIntensity={0.12} />
      </mesh>

      {/* ── BACK FIELDS (north of barn) — 3 big fields side by side ── */}
      {/* WHEAT (NW) — golden field, local x[-11.5,-4], z[-13.5,-7.5] */}
      <group position={[-7.75, 0, -10.5]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]} receiveShadow>
          <planeGeometry args={[7.5, 6]} />
          <meshStandardMaterial color="#a16207" emissive="#ca8a04" emissiveIntensity={0.25} />
        </mesh>
        {/* Wheat stalks — 6 rows × 8 cols */}
        {Array.from({ length: 48 }).map((_, i) => {
          const col = i % 8;
          const row = Math.floor(i / 8);
          return (
            <mesh key={`wheat-${i}`} position={[(col - 3.5) * 0.85, 0.32, (row - 2.5) * 1.0]}>
              <boxGeometry args={[0.18, 0.6, 0.18]} />
              <meshStandardMaterial color="#fde68a" emissive="#facc15" emissiveIntensity={0.55} toneMapped={false} />
            </mesh>
          );
        })}
      </group>

      {/* CORN (N center) — tall green stalks with yellow tops, local x[-3.5,3.5], z[-13.5,-7.5] */}
      <group position={[0, 0, -10.5]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]} receiveShadow>
          <planeGeometry args={[7, 6]} />
          <meshStandardMaterial color="#365314" emissive="#65a30d" emissiveIntensity={0.18} />
        </mesh>
        {Array.from({ length: 35 }).map((_, i) => {
          const col = i % 7;
          const row = Math.floor(i / 7);
          return (
            <group key={`corn-${i}`} position={[(col - 3) * 0.95, 0, (row - 2) * 1.1]}>
              {/* Stalk */}
              <mesh position={[0, 0.5, 0]}>
                <cylinderGeometry args={[0.07, 0.09, 1.0, 6]} />
                <meshStandardMaterial color="#16a34a" emissive="#22c55e" emissiveIntensity={0.4} />
              </mesh>
              {/* Tassel */}
              <mesh position={[0, 1.1, 0]}>
                <coneGeometry args={[0.1, 0.3, 6]} />
                <meshStandardMaterial color="#fde047" emissive="#facc15" emissiveIntensity={0.6} toneMapped={false} />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* SOYBEAN (NE) — leafy bushes, local x[4,11.5], z[-13.5,-7.5] */}
      <group position={[7.75, 0, -10.5]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]} receiveShadow>
          <planeGeometry args={[7.5, 6]} />
          <meshStandardMaterial color="#3f6212" emissive="#65a30d" emissiveIntensity={0.2} />
        </mesh>
        {Array.from({ length: 30 }).map((_, i) => {
          const col = i % 6;
          const row = Math.floor(i / 6);
          return (
            <mesh key={`soy-${i}`} position={[(col - 2.5) * 1.15, 0.18, (row - 2) * 1.1]} castShadow>
              <sphereGeometry args={[0.28, 8, 6]} />
              <meshStandardMaterial color="#15803d" emissive="#22c55e" emissiveIntensity={0.4} />
            </mesh>
          );
        })}
      </group>

      {/* ── ORCHARD — apple trees along the far north edge, local z=-14.5 ── */}
      {[-10.5, -8.5, -6, -3.5, -1, 1, 3.5, 6, 8.5, 10.5].map((x, i) => (
        <group key={`tree-${i}`} position={[x, 0, -14.5]}>
          <mesh position={[0, 0.7, 0]} castShadow>
            <cylinderGeometry args={[0.14, 0.18, 1.4, 6]} />
            <meshStandardMaterial color="#78350f" roughness={0.8} />
          </mesh>
          <mesh position={[0, 1.7, 0]} castShadow>
            <sphereGeometry args={[0.75, 12, 10]} />
            <meshStandardMaterial color="#15803d" emissive="#22c55e" emissiveIntensity={0.25} />
          </mesh>
          {/* Apples — small red dots on the canopy */}
          {[[0.5, 1.7, 0.2], [-0.4, 1.9, 0.3], [0.2, 2.1, -0.4], [-0.3, 1.6, -0.4]].map(([ax, ay, az], j) => (
            <mesh key={`apple-${i}-${j}`} position={[ax, ay, az]}>
              <sphereGeometry args={[0.1, 6, 6]} />
              <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={0.4} />
            </mesh>
          ))}
        </group>
      ))}

      {/* ── WINDMILL — classic Dutch-style with rotating blades, local (-7, 0, -4) ── */}
      <group position={[-7, 0, -4]}>
        {/* Stone tower base */}
        <mesh position={[0, 1.8, 0]} castShadow>
          <cylinderGeometry args={[0.85, 1.1, 3.6, 12]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.7} />
        </mesh>
        {/* Conical wooden cap */}
        <mesh position={[0, 4.0, 0]} castShadow>
          <coneGeometry args={[0.95, 1.1, 12]} />
          <meshStandardMaterial color="#7c2d12" roughness={0.7} />
        </mesh>
        {/* Window */}
        <mesh position={[0, 2.0, 0.86]}>
          <boxGeometry args={[0.35, 0.45, 0.04]} />
          <meshStandardMaterial color="#fde047" emissive="#fbbf24" emissiveIntensity={0.9} toneMapped={false} />
        </mesh>
        {/* Door */}
        <mesh position={[0, 0.7, 1.0]}>
          <boxGeometry args={[0.4, 0.9, 0.06]} />
          <meshStandardMaterial color="#451a03" roughness={0.8} />
        </mesh>
        {/* Blades — 4-arm sail rotating around Z axis on +Z face */}
        <group ref={windmillRef} position={[0, 3.5, 1.1]}>
          {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((rot, i) => (
            <group key={`blade-${i}`} rotation={[0, 0, rot]}>
              {/* Blade arm */}
              <mesh position={[0, 1.2, 0]} castShadow>
                <boxGeometry args={[0.12, 2.4, 0.08]} />
                <meshStandardMaterial color="#78350f" roughness={0.7} />
              </mesh>
              {/* Sail cloth */}
              <mesh position={[0.35, 1.2, 0.05]}>
                <planeGeometry args={[0.7, 2.2]} />
                <meshStandardMaterial color="#f8fafc" emissive="#f8fafc" emissiveIntensity={0.3} side={THREE.DoubleSide} />
              </mesh>
            </group>
          ))}
          {/* Hub */}
          <mesh>
            <sphereGeometry args={[0.18, 10, 10]} />
            <meshStandardMaterial color="#1c1917" metalness={0.7} />
          </mesh>
        </group>
      </group>

      {/* ── WATER TOWER — tall metal tank on stilts, local (7, 0, -4) ── */}
      <group position={[7, 0, -4]}>
        {/* 4 legs */}
        {[[-0.7, -0.7], [0.7, -0.7], [-0.7, 0.7], [0.7, 0.7]].map(([lx, lz], i) => (
          <mesh key={`leg-${i}`} position={[lx, 1.8, lz]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 3.6, 6]} />
            <meshStandardMaterial color="#475569" metalness={0.8} />
          </mesh>
        ))}
        {/* Cross braces */}
        {[1.0, 2.4].map((y, i) => (
          <group key={`brace-${i}`} position={[0, y, 0]}>
            <mesh rotation={[0, Math.PI / 4, 0]}>
              <boxGeometry args={[2.0, 0.06, 0.06]} />
              <meshStandardMaterial color="#334155" metalness={0.7} />
            </mesh>
            <mesh rotation={[0, -Math.PI / 4, 0]}>
              <boxGeometry args={[2.0, 0.06, 0.06]} />
              <meshStandardMaterial color="#334155" metalness={0.7} />
            </mesh>
          </group>
        ))}
        {/* Tank */}
        <mesh position={[0, 4.1, 0]} castShadow>
          <cylinderGeometry args={[1.0, 1.0, 1.6, 16]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.5} roughness={0.4} />
        </mesh>
        {/* Tank top dome */}
        <mesh position={[0, 5.0, 0]} castShadow>
          <sphereGeometry args={[1.0, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.55} />
        </mesh>
        {/* BOTFARM lettering on tank */}
        <Text
          position={[0, 4.1, 1.02]}
          fontSize={0.28}
          color="#b91c1c"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#0b1220"
        >
          BOTFARM
        </Text>
      </group>

      {/* ── SILO — kept, gray cylinder with conical roof, NW of barn ── */}
      <group position={[-3.5, 0, -2.6]}>
        <mesh position={[0, 2.2, 0]} castShadow>
          <cylinderGeometry args={[0.7, 0.7, 4.4, 16]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.4} roughness={0.55} />
        </mesh>
        {[0.6, 1.5, 2.4, 3.3, 4.2].map((y, i) => (
          <mesh key={`band-${i}`} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.72, 0.04, 6, 24]} />
            <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.35} />
          </mesh>
        ))}
        <mesh position={[0, 4.85, 0]} castShadow>
          <coneGeometry args={[0.78, 0.8, 16]} />
          <meshStandardMaterial color="#475569" metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh ref={beaconRef} position={[0, 5.45, 0]}>
          <sphereGeometry args={[0.12, 10, 10]} />
          <meshStandardMaterial color="#fde047" emissive="#fde047" emissiveIntensity={2} toneMapped={false} />
        </mesh>
        {/* Weather vane atop silo cone — rooster cutout on a cross */}
        <group position={[0, 5.7, 0]}>
          {/* Vertical post */}
          <mesh position={[0, 0.18, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.36, 6]} />
            <meshStandardMaterial color="#1c1917" metalness={0.7} />
          </mesh>
          {/* N/S arm */}
          <mesh position={[0, 0.32, 0]}>
            <boxGeometry args={[0.04, 0.04, 0.46]} />
            <meshStandardMaterial color="#1c1917" metalness={0.7} />
          </mesh>
          {/* E/W arm */}
          <mesh position={[0, 0.32, 0]}>
            <boxGeometry args={[0.46, 0.04, 0.04]} />
            <meshStandardMaterial color="#1c1917" metalness={0.7} />
          </mesh>
          {/* Rooster silhouette (thin plate) */}
          <mesh position={[0.18, 0.45, 0]}>
            <boxGeometry args={[0.32, 0.22, 0.02]} />
            <meshStandardMaterial color="#1c1917" metalness={0.7} />
          </mesh>
          {/* Comb */}
          <mesh position={[0.30, 0.58, 0]}>
            <boxGeometry args={[0.08, 0.06, 0.02]} />
            <meshStandardMaterial color="#1c1917" metalness={0.7} />
          </mesh>
        </group>
      </group>

      {/* ── SUNFLOWER PATCH — west of barn, local x[-11.5,-5.5], z[-1,2] ── */}
      <group position={[-8.5, 0, 0.5]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]} receiveShadow>
          <planeGeometry args={[6, 3]} />
          <meshStandardMaterial color="#3f6212" emissive="#65a30d" emissiveIntensity={0.18} />
        </mesh>
        {Array.from({ length: 12 }).map((_, i) => {
          const col = i % 4;
          const row = Math.floor(i / 4);
          return (
            <group key={`sun-${i}`} position={[(col - 1.5) * 1.5, 0, (row - 1) * 1.0]}>
              {/* Tall stalk */}
              <mesh position={[0, 0.8, 0]}>
                <cylinderGeometry args={[0.05, 0.07, 1.6, 6]} />
                <meshStandardMaterial color="#16a34a" emissive="#22c55e" emissiveIntensity={0.4} />
              </mesh>
              {/* Bloom — yellow ring + brown center */}
              <mesh position={[0, 1.7, 0]}>
                <torusGeometry args={[0.22, 0.1, 6, 16]} />
                <meshStandardMaterial color="#facc15" emissive="#fde047" emissiveIntensity={1.0} toneMapped={false} />
              </mesh>
              <mesh position={[0, 1.7, 0]}>
                <sphereGeometry args={[0.15, 10, 8]} />
                <meshStandardMaterial color="#78350f" emissive="#7c2d12" emissiveIntensity={0.3} />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* ── PUMPKIN PATCH — east of barn, local x[4,11], z[-1,2] ── */}
      <group position={[7.5, 0, 0.5]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]} receiveShadow>
          <planeGeometry args={[7, 3]} />
          <meshStandardMaterial color="#451a03" emissive="#78350f" emissiveIntensity={0.15} />
        </mesh>
        {[[-2.8, -0.8], [-2.0, 0.5], [-1.0, -0.5], [-0.2, 0.7], [0.6, -0.6], [1.4, 0.4], [2.4, -0.7], [2.8, 0.8]].map(
          ([px, pz], i) => (
            <group key={`pump-${i}`} position={[px, 0, pz]}>
              {/* Pumpkin body */}
              <mesh position={[0, 0.25, 0]} castShadow>
                <sphereGeometry args={[0.32, 12, 10]} />
                <meshStandardMaterial color="#ea580c" emissive="#f97316" emissiveIntensity={0.4} />
              </mesh>
              {/* Stem */}
              <mesh position={[0, 0.55, 0]}>
                <cylinderGeometry args={[0.05, 0.08, 0.18, 6]} />
                <meshStandardMaterial color="#15803d" />
              </mesh>
              {/* Vine leaf */}
              <mesh position={[0.3, 0.1, 0.1]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[0.4, 0.3]} />
                <meshStandardMaterial color="#16a34a" side={THREE.DoubleSide} />
              </mesh>
            </group>
          ),
        )}
      </group>

      {/* ── GREENHOUSE — glass tunnel SE of barn, local (8, 0, 3.5) ── */}
      <group position={[8, 0, 3.5]}>
        {/* Foundation */}
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[5, 0.2, 2.6]} />
          <meshStandardMaterial color="#525252" roughness={0.85} />
        </mesh>
        {/* Glass roof (semi-cylinder) */}
        <mesh position={[0, 1.0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[1.3, 1.3, 5, 16, 1, true, 0, Math.PI]} />
          <meshStandardMaterial
            color="#bae6fd"
            emissive="#7dd3fc"
            emissiveIntensity={0.5}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
            metalness={0.3}
            roughness={0.15}
          />
        </mesh>
        {/* End caps */}
        {[-2.5, 2.5].map((x, i) => (
          <mesh key={`gh-cap-${i}`} position={[x, 1.0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <circleGeometry args={[1.3, 16, 0, Math.PI]} />
            <meshStandardMaterial color="#7dd3fc" transparent opacity={0.45} side={THREE.DoubleSide} />
          </mesh>
        ))}
        {/* Inner glow plants */}
        {[-1.6, -0.4, 0.8, 2.0].map((x, i) => (
          <mesh key={`gh-plant-${i}`} position={[x, 0.35, 0]}>
            <sphereGeometry args={[0.18, 8, 6]} />
            <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.7} />
          </mesh>
        ))}
      </group>

      {/* ── POND — reflective pool SW of barn, local (-7, 0, 3.2) ── */}
      <group position={[-7, 0, 3.2]}>
        {/* Mud rim */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]}>
          <ringGeometry args={[1.3, 1.7, 24]} />
          <meshStandardMaterial color="#451a03" roughness={0.9} />
        </mesh>
        {/* Water */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
          <circleGeometry args={[1.3, 32]} />
          <meshStandardMaterial color="#1e40af" emissive="#3b82f6" emissiveIntensity={0.45} metalness={0.65} roughness={0.15} />
        </mesh>
        {/* Cattails */}
        {[[1.0, -0.6], [-0.8, 0.9], [0.6, 1.0]].map(([cx, cz], i) => (
          <group key={`cat-${i}`} position={[cx, 0, cz]}>
            <mesh position={[0, 0.5, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 1.0, 4]} />
              <meshStandardMaterial color="#15803d" />
            </mesh>
            <mesh position={[0, 1.05, 0]}>
              <cylinderGeometry args={[0.07, 0.07, 0.22, 6]} />
              <meshStandardMaterial color="#78350f" />
            </mesh>
          </group>
        ))}
        {/* Duck */}
        <mesh position={[0.4, 0.18, 0.2]}>
          <sphereGeometry args={[0.18, 10, 8]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        <mesh position={[0.58, 0.28, 0.2]}>
          <sphereGeometry args={[0.1, 10, 8]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        <mesh position={[0.68, 0.3, 0.2]}>
          <boxGeometry args={[0.1, 0.05, 0.07]} />
          <meshStandardMaterial color="#f97316" />
        </mesh>
      </group>

      {/* ── ANIMAL PASTURE — cows + sheep, west of barn, local x[-12,-6], z[-6,-1] ── */}
      <group position={[-9, 0, -3.5]}>
        {/* Cow 1 */}
        <group position={[-1.0, 0, 0.5]}>
          <mesh position={[0, 0.55, 0]} castShadow>
            <boxGeometry args={[0.9, 0.55, 0.45]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
          {/* Black spots */}
          <mesh position={[0.2, 0.78, 0.23]}>
            <boxGeometry args={[0.22, 0.16, 0.02]} />
            <meshStandardMaterial color="#1c1917" />
          </mesh>
          <mesh position={[-0.25, 0.65, 0.23]}>
            <boxGeometry args={[0.18, 0.18, 0.02]} />
            <meshStandardMaterial color="#1c1917" />
          </mesh>
          {/* Head */}
          <mesh position={[0.5, 0.6, 0]} castShadow>
            <boxGeometry args={[0.3, 0.32, 0.32]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
          {/* Legs */}
          {[[-0.3, -0.18], [0.3, -0.18], [-0.3, 0.18], [0.3, 0.18]].map(([lx, lz], i) => (
            <mesh key={`cow-leg-${i}`} position={[lx, 0.15, lz]}>
              <boxGeometry args={[0.1, 0.3, 0.1]} />
              <meshStandardMaterial color="#1c1917" />
            </mesh>
          ))}
        </group>
        {/* Cow 2 */}
        <group position={[1.4, 0, 1.5]} rotation={[0, 0.6, 0]}>
          <mesh position={[0, 0.55, 0]} castShadow>
            <boxGeometry args={[0.9, 0.55, 0.45]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
          <mesh position={[-0.18, 0.7, 0.23]}>
            <boxGeometry args={[0.24, 0.2, 0.02]} />
            <meshStandardMaterial color="#1c1917" />
          </mesh>
          <mesh position={[0.5, 0.6, 0]} castShadow>
            <boxGeometry args={[0.3, 0.32, 0.32]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
          {[[-0.3, -0.18], [0.3, -0.18], [-0.3, 0.18], [0.3, 0.18]].map(([lx, lz], i) => (
            <mesh key={`cow2-leg-${i}`} position={[lx, 0.15, lz]}>
              <boxGeometry args={[0.1, 0.3, 0.1]} />
              <meshStandardMaterial color="#1c1917" />
            </mesh>
          ))}
        </group>
        {/* Horse — brown body, white blaze on head, in the far SW corner of
            the pasture (sheep cluster is at z<-1.4, cows at z=0.5/1.5 with
            x>-1, so (-2.6, 2.0) is clear of all of them). */}
        <group position={[-2.6, 0, 2.0]} rotation={[0, -0.8, 0]}>
          {/* Body */}
          <mesh position={[0, 0.7, 0]} castShadow>
            <boxGeometry args={[1.0, 0.55, 0.42]} />
            <meshStandardMaterial color="#92400e" roughness={0.85} />
          </mesh>
          {/* Neck */}
          <mesh position={[0.5, 0.95, 0]} rotation={[0, 0, -0.4]} castShadow>
            <boxGeometry args={[0.5, 0.28, 0.28]} />
            <meshStandardMaterial color="#92400e" roughness={0.85} />
          </mesh>
          {/* Head */}
          <mesh position={[0.78, 1.18, 0]} castShadow>
            <boxGeometry args={[0.42, 0.28, 0.26]} />
            <meshStandardMaterial color="#92400e" roughness={0.85} />
          </mesh>
          {/* White blaze on muzzle */}
          <mesh position={[0.95, 1.10, 0]}>
            <boxGeometry args={[0.08, 0.18, 0.06]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
          {/* Mane (dark stripe along the neck top) */}
          <mesh position={[0.5, 1.12, 0]} rotation={[0, 0, -0.4]}>
            <boxGeometry args={[0.55, 0.06, 0.05]} />
            <meshStandardMaterial color="#1c1917" />
          </mesh>
          {/* Ears */}
          {[-0.07, 0.07].map((ez, i) => (
            <mesh key={`h-ear-${i}`} position={[0.7, 1.36, ez]} castShadow>
              <coneGeometry args={[0.05, 0.12, 4]} />
              <meshStandardMaterial color="#78350f" />
            </mesh>
          ))}
          {/* Tail */}
          <mesh position={[-0.55, 0.7, 0]} rotation={[0, 0, 0.35]}>
            <boxGeometry args={[0.12, 0.45, 0.1]} />
            <meshStandardMaterial color="#1c1917" />
          </mesh>
          {/* Legs */}
          {[[-0.35, -0.16], [0.35, -0.16], [-0.35, 0.16], [0.35, 0.16]].map(([lx, lz], i) => (
            <mesh key={`h-leg-${i}`} position={[lx, 0.25, lz]} castShadow>
              <boxGeometry args={[0.12, 0.5, 0.12]} />
              <meshStandardMaterial color="#451a03" />
            </mesh>
          ))}
          {/* Hooves */}
          {[[-0.35, -0.16], [0.35, -0.16], [-0.35, 0.16], [0.35, 0.16]].map(([lx, lz], i) => (
            <mesh key={`h-hoof-${i}`} position={[lx, 0.04, lz]}>
              <boxGeometry args={[0.13, 0.08, 0.13]} />
              <meshStandardMaterial color="#1c1917" />
            </mesh>
          ))}
        </group>
        {/* Sheep — 3 fluffy white spheres on stubby legs */}
        {[[-1.5, -1.6], [-0.4, -1.4], [0.6, -1.7]].map(([sx, sz], i) => (
          <group key={`sheep-${i}`} position={[sx, 0, sz]}>
            <mesh position={[0, 0.45, 0]} castShadow>
              <sphereGeometry args={[0.32, 12, 10]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.95} />
            </mesh>
            <mesh position={[0.32, 0.45, 0]}>
              <sphereGeometry args={[0.14, 10, 8]} />
              <meshStandardMaterial color="#1c1917" />
            </mesh>
            {[[-0.15, -0.12], [0.15, -0.12], [-0.15, 0.12], [0.15, 0.12]].map(([lx, lz], j) => (
              <mesh key={`sl-${i}-${j}`} position={[lx, 0.12, lz]}>
                <boxGeometry args={[0.06, 0.22, 0.06]} />
                <meshStandardMaterial color="#1c1917" />
              </mesh>
            ))}
          </group>
        ))}
      </group>

      {/* ── CHICKEN COOP — small red shed + 3 hopping chickens, local (3.5, 0, -4) ── */}
      <group position={[3.5, 0, -4]}>
        {/* Coop body */}
        <mesh position={[0, 0.45, 0]} castShadow>
          <boxGeometry args={[1.2, 0.9, 0.9]} />
          <meshStandardMaterial color="#b91c1c" roughness={0.75} />
        </mesh>
        {/* Coop roof */}
        <mesh position={[0, 1.0, 0]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.7, 0.7, 0.95]} />
          <meshStandardMaterial color="#7c2d12" roughness={0.85} />
        </mesh>
        {/* Round door */}
        <mesh position={[0, 0.4, 0.46]}>
          <circleGeometry args={[0.18, 16]} />
          <meshStandardMaterial color="#1c1917" />
        </mesh>
        {/* Chickens */}
        {[[-1.3, 0.4], [-1.1, -0.4], [1.3, 0.0]].map(([cx, cz], i) => (
          <group
            key={`chick-${i}`}
            ref={(g) => { chickenRefs.current[i] = g; }}
            position={[cx, 0, cz]}
          >
            {/* Body */}
            <mesh position={[0, 0.22, 0]} castShadow>
              <sphereGeometry args={[0.18, 10, 8]} />
              <meshStandardMaterial color="#fef9c3" />
            </mesh>
            {/* Head */}
            <mesh position={[0.16, 0.36, 0]}>
              <sphereGeometry args={[0.1, 10, 8]} />
              <meshStandardMaterial color="#fef9c3" />
            </mesh>
            {/* Comb */}
            <mesh position={[0.16, 0.46, 0]}>
              <coneGeometry args={[0.05, 0.1, 6]} />
              <meshStandardMaterial color="#dc2626" />
            </mesh>
            {/* Beak */}
            <mesh position={[0.24, 0.35, 0]}>
              <coneGeometry args={[0.03, 0.07, 4]} />
              <meshStandardMaterial color="#f97316" />
            </mesh>
            {/* Legs */}
            <mesh position={[-0.04, 0.08, 0]}>
              <cylinderGeometry args={[0.015, 0.015, 0.16, 4]} />
              <meshStandardMaterial color="#f97316" />
            </mesh>
            <mesh position={[0.04, 0.08, 0]}>
              <cylinderGeometry args={[0.015, 0.015, 0.16, 4]} />
              <meshStandardMaterial color="#f97316" />
            </mesh>
          </group>
        ))}
      </group>

      {/* ── HAY BALES — stacked cylinder rolls near the barn, local (3, 0, 1.5) ── */}
      <group position={[3, 0, 1.5]}>
        {/* Row 1 */}
        <mesh position={[0, 0.4, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.4, 0.4, 0.8, 12]} />
          <meshStandardMaterial color="#ca8a04" emissive="#a16207" emissiveIntensity={0.2} />
        </mesh>
        <mesh position={[0.9, 0.4, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.4, 0.4, 0.8, 12]} />
          <meshStandardMaterial color="#ca8a04" emissive="#a16207" emissiveIntensity={0.2} />
        </mesh>
        {/* Row 2 stacked on top */}
        <mesh position={[0.45, 1.1, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.38, 0.38, 0.8, 12]} />
          <meshStandardMaterial color="#ca8a04" emissive="#a16207" emissiveIntensity={0.2} />
        </mesh>
      </group>

      {/* ── TRACTOR — red & yellow, parked in front of the barn, animated ── */}
      <group ref={tractorRef} position={[4, 0, 3]}>
        {/* Body */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[1.4, 0.55, 0.7]} />
          <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={0.2} metalness={0.6} roughness={0.4} />
        </mesh>
        {/* Cab */}
        <mesh position={[0.2, 1.05, 0]} castShadow>
          <boxGeometry args={[0.6, 0.5, 0.55]} />
          <meshStandardMaterial color="#fde047" metalness={0.4} roughness={0.3} />
        </mesh>
        {/* Cab windows */}
        <mesh position={[0.2, 1.08, 0.28]}>
          <boxGeometry args={[0.5, 0.32, 0.02]} />
          <meshStandardMaterial color="#22d3ee" transparent opacity={0.55} />
        </mesh>
        {/* Smokestack */}
        <mesh position={[-0.4, 1.25, 0.2]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.5, 6]} />
          <meshStandardMaterial color="#1c1917" />
        </mesh>
        {/* Back big wheels */}
        {[-0.35, 0.35].map((wz, i) => (
          <mesh key={`bigw-${i}`} position={[-0.45, 0.4, wz]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.4, 0.4, 0.18, 12]} />
            <meshStandardMaterial color="#0f172a" roughness={0.85} />
          </mesh>
        ))}
        {/* Front small wheels */}
        {[-0.32, 0.32].map((wz, i) => (
          <mesh key={`smw-${i}`} position={[0.55, 0.25, wz]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.22, 0.22, 0.14, 10]} />
            <meshStandardMaterial color="#0f172a" roughness={0.85} />
          </mesh>
        ))}
        {/* Headlight */}
        <mesh position={[0.72, 0.55, 0]}>
          <sphereGeometry args={[0.1, 10, 8]} />
          <meshStandardMaterial color="#fef9c3" emissive="#fde047" emissiveIntensity={1.4} toneMapped={false} />
        </mesh>
      </group>

      {/* ── SCARECROW — kept, repositioned to the corn field ── */}
      <group position={[0, 0, -10.5]}>
        <mesh position={[0, 0.9, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 1.8, 6]} />
          <meshStandardMaterial color="#78350f" roughness={0.8} />
        </mesh>
        <mesh position={[0, 1.4, 0]}>
          <boxGeometry args={[1.1, 0.06, 0.06]} />
          <meshStandardMaterial color="#78350f" roughness={0.8} />
        </mesh>
        <mesh ref={scarecrowRef} position={[0, 1.15, 0]} castShadow>
          <boxGeometry args={[0.55, 0.55, 0.25]} />
          <meshStandardMaterial color="#16a34a" emissive="#22c55e" emissiveIntensity={0.25} />
        </mesh>
        <mesh position={[0, 1.7, 0]} castShadow>
          <sphereGeometry args={[0.22, 12, 12]} />
          <meshStandardMaterial color="#fde68a" emissive="#fbbf24" emissiveIntensity={0.3} />
        </mesh>
        <mesh position={[0, 1.95, 0]} castShadow>
          <coneGeometry args={[0.28, 0.3, 12]} />
          <meshStandardMaterial color="#451a03" roughness={0.7} />
        </mesh>
      </group>

      {/* ── PERIMETER FENCE — wooden rails around the whole farm ── */}
      {/* South edge (front, z=+4.8 → world z=-56.7, 1.6u from road band) */}
      {Array.from({ length: 13 }).map((_, i) => {
        const x = -12 + i * 2;
        return (
          <mesh key={`fs-${i}`} position={[x, 0.4, 4.8]} castShadow>
            <boxGeometry args={[0.12, 0.8, 0.12]} />
            <meshStandardMaterial color="#78350f" roughness={0.85} />
          </mesh>
        );
      })}
      <mesh position={[0, 0.55, 4.8]}>
        <boxGeometry args={[24, 0.08, 0.06]} />
        <meshStandardMaterial color="#92400e" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.25, 4.8]}>
        <boxGeometry args={[24, 0.08, 0.06]} />
        <meshStandardMaterial color="#92400e" roughness={0.8} />
      </mesh>
      {/* West edge (x=-12) */}
      {Array.from({ length: 11 }).map((_, i) => {
        const z = -14.5 + i * 2;
        return (
          <mesh key={`fw-${i}`} position={[-12, 0.4, z]} castShadow>
            <boxGeometry args={[0.12, 0.8, 0.12]} />
            <meshStandardMaterial color="#78350f" roughness={0.85} />
          </mesh>
        );
      })}
      <mesh position={[-12, 0.55, -5]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[20, 0.08, 0.06]} />
        <meshStandardMaterial color="#92400e" roughness={0.8} />
      </mesh>
      <mesh position={[-12, 0.25, -5]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[20, 0.08, 0.06]} />
        <meshStandardMaterial color="#92400e" roughness={0.8} />
      </mesh>
      {/* East edge (x=+12) */}
      {Array.from({ length: 11 }).map((_, i) => {
        const z = -14.5 + i * 2;
        return (
          <mesh key={`fe-${i}`} position={[12, 0.4, z]} castShadow>
            <boxGeometry args={[0.12, 0.8, 0.12]} />
            <meshStandardMaterial color="#78350f" roughness={0.85} />
          </mesh>
        );
      })}
      <mesh position={[12, 0.55, -5]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[20, 0.08, 0.06]} />
        <meshStandardMaterial color="#92400e" roughness={0.8} />
      </mesh>
      <mesh position={[12, 0.25, -5]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[20, 0.08, 0.06]} />
        <meshStandardMaterial color="#92400e" roughness={0.8} />
      </mesh>

      {/* ── ENTRANCE ARCHWAY — big wooden gate over the south road approach ── */}
      <group position={[0, 0, 4.8]}>
        {/* Posts */}
        {[-2.6, 2.6].map((x, i) => (
          <mesh key={`arch-${i}`} position={[x, 1.8, 0]} castShadow>
            <boxGeometry args={[0.3, 3.6, 0.3]} />
            <meshStandardMaterial color="#78350f" roughness={0.85} />
          </mesh>
        ))}
        {/* Crossbeam */}
        <mesh position={[0, 3.7, 0]} castShadow>
          <boxGeometry args={[5.6, 0.4, 0.3]} />
          <meshStandardMaterial color="#92400e" roughness={0.85} />
        </mesh>
        {/* Sign plaque */}
        <mesh position={[0, 3.7, 0.18]}>
          <boxGeometry args={[5.2, 0.34, 0.04]} />
          <meshStandardMaterial color="#fde047" emissive="#facc15" emissiveIntensity={0.45} toneMapped={false} />
        </mesh>
        <Text
          position={[0, 3.7, 0.22]}
          fontSize={0.28}
          color="#7c2d12"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.015}
          outlineColor="#fef3c7"
        >
          🚜 WELCOME TO BOTFARM 🌽
        </Text>
      </group>

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
  const bridgeRef = useRef<THREE.Mesh>(null!);

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    // Slow horizontal ring spin around tower crown
    if (ringRef.current) ringRef.current.rotation.y = t * 0.4;
    // Bridge underside pulses like a data stream
    if (bridgeRef.current) {
      const mat = bridgeRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 1.4 + Math.sin(t * 3) * 0.8;
    }
  });

  return (
    <group position={[19.5, 0, -19.5]}>
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

// ===== BotPort Harbor @ (75, 0, 72) =====================================
// Far SE coast. Harbor building is rendered by Building.tsx via BUILDING_DEFS
// at world (75, 2, 72), footprint 6×5 → world x[72..78], z[69.5..74.5].
// Decor envelope (expanded): world x[68, 100], z[63, 90]
//   → local x ∈ [-7, +25], local z ∈ [-9, +18]   (origin at 75, 72)
// World player bound is ±105, so east edge at world x=100 still has 5u
// clear; south edge at world z=90 has 15u clear.
//
// Layout summary (all local coords):
//   • Building            x[-3, 3]    z[-2.5, 2.5]  (rendered by Building.tsx)
//   • Container yard pad  x[-6.75,-3.25] z[-2.25, 6.25] (west of building)
//   • Fuel depot pad      x[-2.25, 3.25] z[3.6, 7.4]    (south of building)
//   • Sea surface         x[3.5, 23]  z[-9, 17]     (east + N + S of building)
//   • Main dock           x[1, 9]     z[-1.5, 1.5]
//   • Gantry cranes       x=3.5       z ∈ {-7, 0, 9}  (#3 moved to z=9 to
//                                                       clear fuel tank C)
//   • Ship 1 (red)        x=8         z=-2
//   • Ship 2 (blue)       x=9         z=6
//   • Ship 3 (mega green) x=17        z=2
//   • Tugboat (animated)  x=14, z drifts 9..14
//   • Lighthouse          x=10.5      z=11
function Port() {
  const waveRef = useRef<THREE.Mesh>(null!);
  const beaconRef = useRef<THREE.Mesh>(null!);
  const ship1Ref = useRef<THREE.Group>(null!);
  const ship2Ref = useRef<THREE.Group>(null!);
  const ship3Ref = useRef<THREE.Group>(null!);
  const tugRef = useRef<THREE.Group>(null!);
  const crane2ArmRef = useRef<THREE.Group>(null!);
  const crane3ArmRef = useRef<THREE.Group>(null!);
  const forkliftRef = useRef<THREE.Group>(null!);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (waveRef.current) {
      const mat = waveRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.18 + Math.sin(t * 1.3) * 0.06;
    }
    if (beaconRef.current) {
      const mat = beaconRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 2.2 + Math.sin(t * 2.5) * 1.4;
    }
    // Ships rock gently in place (Z roll). Each ship gets a different phase
    // so they don't all sway in lock-step.
    if (ship1Ref.current) ship1Ref.current.rotation.z = Math.sin(t * 0.7) * 0.04;
    if (ship2Ref.current) ship2Ref.current.rotation.z = Math.sin(t * 0.7 + 1.4) * 0.05;
    if (ship3Ref.current) ship3Ref.current.rotation.z = Math.sin(t * 0.55 + 2.3) * 0.03;
    // Tugboat patrols slowly N↔S between local z=9..14, faces its motion
    // direction (heading flips when the sine derivative crosses zero).
    if (tugRef.current) {
      tugRef.current.position.z = 11.5 + Math.sin(t * 0.18) * 2.5;
      tugRef.current.rotation.z = Math.sin(t * 1.2) * 0.06;
      tugRef.current.rotation.y = Math.cos(t * 0.18) >= 0 ? 0 : Math.PI;
    }
    if (crane2ArmRef.current) crane2ArmRef.current.rotation.y = Math.sin(t * 0.35) * 0.6;
    if (crane3ArmRef.current) crane3ArmRef.current.rotation.y = Math.sin(t * 0.35 + Math.PI) * 0.6;
    if (forkliftRef.current) {
      forkliftRef.current.position.x = -5 + Math.sin(t * 0.4) * 1.5;
    }
  });
  return (
    <group position={[75, 0, 72]}>
      {/* ── Sea surface — wider plane east, N and S of the building.
          Center (13.25, 0.04, 4), 19.5×26 → local x[3.5, 23], z[-9, 17]. */}
      <mesh ref={waveRef} rotation={[-Math.PI / 2, 0, 0]} position={[13.25, 0.04, 4]}>
        <planeGeometry args={[19.5, 26, 10, 12]} />
        <meshStandardMaterial color="#075985" emissive="#0ea5e9" emissiveIntensity={0.2} />
      </mesh>
      {/* Shoreline trim — slim darker strip just east of land */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[3.6, 0.045, 4]}>
        <planeGeometry args={[0.3, 26]} />
        <meshStandardMaterial color="#0c4a6e" />
      </mesh>

      {/* ── Main dock — wooden pier extending east from the harbor.
          Center (5, 0.18, 0), 8×3 → local x[1, 9], z[-1.5, 1.5]. */}
      <mesh position={[5, 0.18, 0]}>
        <boxGeometry args={[8, 0.35, 3]} />
        <meshStandardMaterial color="#78350f" roughness={0.9} />
      </mesh>
      {/* Plank seams along the extended dock */}
      {[-3, -2, -1, 0, 1, 2, 3].map((dx) => (
        <mesh key={`plank-${dx}`} position={[5 + dx, 0.36, 0]}>
          <boxGeometry args={[0.05, 0.02, 3]} />
          <meshStandardMaterial color="#451a03" />
        </mesh>
      ))}
      {/* Mooring bollards — south edge */}
      {[-3, -1.5, 0, 1.5, 3].map((dx, i) => (
        <mesh key={`bollard-s-${i}`} position={[5 + dx, 0.55, 1.4]}>
          <cylinderGeometry args={[0.18, 0.22, 0.7, 8]} />
          <meshStandardMaterial color="#0f172a" metalness={0.5} roughness={0.5} />
        </mesh>
      ))}
      {/* Mooring bollards — north edge */}
      {[-3, -1.5, 0, 1.5, 3].map((dx, i) => (
        <mesh key={`bollard-n-${i}`} position={[5 + dx, 0.55, -1.4]}>
          <cylinderGeometry args={[0.18, 0.22, 0.7, 8]} />
          <meshStandardMaterial color="#0f172a" metalness={0.5} roughness={0.5} />
        </mesh>
      ))}
      {/* Coil of rope on the dock near the easternmost bollard */}
      <mesh position={[7.6, 0.45, 1.0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.22, 0.08, 6, 14]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.95} />
      </mesh>

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

      {/* ── Cargo ship #3 — MEGA green container ship anchored further out.
          7.5u long × 2u wide hull, 4-tall container stack (20 boxes), twin
          smokestacks. Bobs slowly out of phase with ships 1 & 2. */}
      <group ref={ship3Ref} position={[17, 0.5, 2]}>
        {/* Hull */}
        <mesh position={[0, 0.35, 0]}>
          <boxGeometry args={[7.5, 1.0, 2]} />
          <meshStandardMaterial color="#15803d" metalness={0.3} roughness={0.6} />
        </mesh>
        {/* Red waterline stripe */}
        <mesh position={[0, -0.05, 0]}>
          <boxGeometry args={[7.55, 0.3, 2.04]} />
          <meshStandardMaterial color="#7f1d1d" />
        </mesh>
        {/* Bow taper */}
        <mesh position={[4.2, 0.35, 0]}>
          <coneGeometry args={[1.05, 1.5, 4]} />
          <meshStandardMaterial color="#15803d" />
        </mesh>
        {/* Container stack — 5 long × 2 wide × 2 tall = 20 boxes */}
        {[-2.8, -1.6, -0.4, 0.8, 2.0].map((cx, ix) =>
          [-0.55, 0.55].map((cz, iz) =>
            [0, 0.7].map((dy, iy) => (
              <mesh key={`c3-${ix}-${iz}-${iy}`} position={[cx, 1.3 + dy, cz]}>
                <boxGeometry args={[1.1, 0.6, 0.95]} />
                <meshStandardMaterial
                  color={["#0ea5e9", "#f97316", "#fde047", "#a855f7", "#22d3ee", "#ef4444"][(ix * 4 + iz * 2 + iy) % 6]}
                />
              </mesh>
            ))
          )
        )}
        {/* Bridge superstructure at stern */}
        <mesh position={[-3.3, 1.6, 0]}>
          <boxGeometry args={[0.9, 1.6, 1.6]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        <mesh position={[-2.85, 2.0, 0]}>
          <boxGeometry args={[0.02, 0.35, 1.4]} />
          <meshStandardMaterial color="#0f172a" emissive="#22d3ee" emissiveIntensity={0.5} />
        </mesh>
        {/* Twin smokestacks */}
        {[-0.25, 0.25].map((sz) => (
          <mesh key={`stk-${sz}`} position={[-3.3, 2.85, sz]}>
            <cylinderGeometry args={[0.22, 0.22, 0.9, 10]} />
            <meshStandardMaterial color="#fde047" />
          </mesh>
        ))}
      </group>

      {/* ── Tugboat — small red patrol boat, slowly drifts N↔S along z */}
      <group ref={tugRef} position={[14, 0.5, 11.5]}>
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[2.0, 0.55, 0.9]} />
          <meshStandardMaterial color="#dc2626" metalness={0.3} roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.05, 0]}>
          <boxGeometry args={[2.02, 0.18, 0.92]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
        <mesh position={[1.1, 0.2, 0]}>
          <coneGeometry args={[0.48, 0.65, 4]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
        <mesh position={[-0.2, 0.7, 0]}>
          <boxGeometry args={[0.7, 0.55, 0.7]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        <mesh position={[-0.7, 1.05, 0]}>
          <cylinderGeometry args={[0.14, 0.14, 0.5, 10]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <mesh position={[-0.7, 1.32, 0]}>
          <cylinderGeometry args={[0.17, 0.17, 0.08, 10]} />
          <meshStandardMaterial color="#fde047" emissive="#fde047" emissiveIntensity={0.3} />
        </mesh>
      </group>

      {/* ── Gantry crane #2 — north shore, animated swing arm. Base on land
          (z=-7 = world z=65, safely north of building z_min=-2.5 → 4.5u gap). */}
      <group position={[3.5, 0, -7]}>
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[2.4, 0.3, 2.4]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.95} />
        </mesh>
        <mesh position={[0, 3.5, 0]}>
          <boxGeometry args={[0.5, 6.5, 0.5]} />
          <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={0.15} />
        </mesh>
        <group ref={crane2ArmRef} position={[0, 6.6, 0]}>
          <mesh position={[1.8, 0, 0]}>
            <boxGeometry args={[3.6, 0.35, 0.35]} />
            <meshStandardMaterial color="#dc2626" />
          </mesh>
          <mesh position={[-0.9, 0, 0]}>
            <boxGeometry args={[1.1, 0.55, 0.6]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[3.3, -1.1, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 2.2, 6]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[3.3, -2.4, 0]}>
            <boxGeometry args={[0.85, 0.55, 0.65]} />
            <meshStandardMaterial color="#0ea5e9" />
          </mesh>
        </group>
      </group>

      {/* ── Gantry crane #3 — south shore mirror of crane #2. Moved from
          z=7 to z=9 to clear fuel tank C (centered at z=5.5, radius 0.85
          → north edge z=6.35). Crane base 2.4u square → south edge z=7.8,
          giving 1.45u clearance to tank C. World z=81, still 9u clear of
          envelope south edge (world z=90). */}
      <group position={[3.5, 0, 9]}>
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[2.4, 0.3, 2.4]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.95} />
        </mesh>
        <mesh position={[0, 3.5, 0]}>
          <boxGeometry args={[0.5, 6.5, 0.5]} />
          <meshStandardMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={0.15} />
        </mesh>
        <group ref={crane3ArmRef} position={[0, 6.6, 0]}>
          <mesh position={[1.8, 0, 0]}>
            <boxGeometry args={[3.6, 0.35, 0.35]} />
            <meshStandardMaterial color="#0ea5e9" />
          </mesh>
          <mesh position={[-0.9, 0, 0]}>
            <boxGeometry args={[1.1, 0.55, 0.6]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[3.3, -1.1, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 2.2, 6]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[3.3, -2.4, 0]}>
            <boxGeometry args={[0.85, 0.55, 0.65]} />
            <meshStandardMaterial color="#fde047" />
          </mesh>
        </group>
      </group>

      {/* ── Container yard — west of harbor building on land.
          Concrete pad x[-6.5,-3.5], z[-2, 6]. Yellow lane stripes + a
          scattered grid of stacked containers (some 1 tall, some 2 tall). */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-5, 0.05, 2]}>
        <planeGeometry args={[3.5, 8.5]} />
        <meshStandardMaterial color="#475569" roughness={0.95} />
      </mesh>
      {[-1.4, 0, 1.4].map((dx) => (
        <mesh key={`yard-stripe-${dx}`} rotation={[-Math.PI / 2, 0, 0]} position={[-5 + dx, 0.06, 2]}>
          <planeGeometry args={[0.06, 8]} />
          <meshStandardMaterial color="#fde047" emissive="#fde047" emissiveIntensity={0.25} />
        </mesh>
      ))}
      {[-1.3, -0.4, 0.5, 1.4].map((dx, ix) =>
        [-1.4, -0.3, 0.8, 1.9, 3.0, 4.1, 5.2].map((dz, iz) => {
          const occupied = (ix * 7 + iz) % 3 !== 2;
          if (!occupied) return null;
          const tall = (ix + iz) % 2 === 0;
          const colors = ["#0ea5e9", "#dc2626", "#fde047", "#16a34a", "#a855f7", "#f97316", "#22d3ee"];
          return (
            <group key={`yard-${ix}-${iz}`} position={[-6.0 + dx, 0, dz]}>
              <mesh position={[0, 0.4, 0]}>
                <boxGeometry args={[0.85, 0.65, 0.95]} />
                <meshStandardMaterial color={colors[(ix * 7 + iz) % colors.length]} />
              </mesh>
              {tall && (
                <mesh position={[0, 1.1, 0]}>
                  <boxGeometry args={[0.85, 0.65, 0.95]} />
                  <meshStandardMaterial color={colors[(ix * 7 + iz + 3) % colors.length]} />
                </mesh>
              )}
            </group>
          );
        })
      )}

      {/* ── Forklift — idles back and forth along the south aisle of the
          yard. position.x is overridden in useFrame, base value here is the
          midpoint of its travel. */}
      <group ref={forkliftRef} position={[-5, 0, 5.4]}>
        <mesh position={[0, 0.45, 0]}>
          <boxGeometry args={[0.7, 0.6, 0.55]} />
          <meshStandardMaterial color="#f97316" />
        </mesh>
        <mesh position={[-0.05, 0.95, 0]}>
          <boxGeometry args={[0.5, 0.05, 0.55]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
        {[[-0.2, -0.25], [-0.2, 0.25], [0.15, -0.25], [0.15, 0.25]].map(([px, pz], i) => (
          <mesh key={`fl-post-${i}`} position={[px, 0.8, pz]}>
            <boxGeometry args={[0.04, 0.35, 0.04]} />
            <meshStandardMaterial color="#1f2937" />
          </mesh>
        ))}
        <mesh position={[0.45, 0.6, 0]}>
          <boxGeometry args={[0.08, 1.2, 0.5]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
        {[-0.12, 0.12].map((fz) => (
          <mesh key={`fork-${fz}`} position={[0.65, 0.18, fz]}>
            <boxGeometry args={[0.5, 0.06, 0.06]} />
            <meshStandardMaterial color="#fde047" metalness={0.6} />
          </mesh>
        ))}
        {[[-0.25, -0.27], [-0.25, 0.27], [0.25, -0.27], [0.25, 0.27]].map(([wx, wz], i) => (
          <mesh key={`fl-wh-${i}`} position={[wx, 0.18, wz]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.16, 0.16, 0.14, 10]} />
            <meshStandardMaterial color="#111827" />
          </mesh>
        ))}
      </group>

      {/* ── Fuel depot — south of the harbor building on land. Three white
          fuel tanks with red bands, connected by a low pipe, plus a
          flammable-warning post. Pad x[-2.25, 3.25], z[3.6, 7.4]. Building
          z_max=2.5 → 1.1u north clearance. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.5, 0.05, 5.5]}>
        <planeGeometry args={[5.5, 3.8]} />
        <meshStandardMaterial color="#52525b" roughness={0.95} />
      </mesh>
      {[-1.5, 0.5, 2.5].map((tx, i) => (
        <group key={`tank-${i}`} position={[tx, 0, 5.5]}>
          <mesh position={[0, 0.95, 0]}>
            <cylinderGeometry args={[0.85, 0.85, 1.9, 18]} />
            <meshStandardMaterial color="#e5e7eb" metalness={0.5} roughness={0.5} />
          </mesh>
          <mesh position={[0, 1.55, 0]}>
            <cylinderGeometry args={[0.86, 0.86, 0.15, 18]} />
            <meshStandardMaterial color="#dc2626" />
          </mesh>
          <mesh position={[0, 2.0, 0]}>
            <sphereGeometry args={[0.85, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#e5e7eb" metalness={0.5} roughness={0.5} />
          </mesh>
          {[0.4, 0.8, 1.2, 1.6].map((ly) => (
            <mesh key={`rung-${ly}`} position={[0.87, ly, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.025, 0.025, 0.2, 6]} />
              <meshStandardMaterial color="#374151" />
            </mesh>
          ))}
          <Text
            position={[0, 1.0, 0.87]}
            fontSize={0.18}
            color="#0f172a"
            anchorX="center"
            anchorY="middle"
          >
            {`FUEL ${["A", "B", "C"][i]}`}
          </Text>
        </group>
      ))}
      {/* Connecting pipe along the south of all tanks */}
      <mesh position={[0.5, 0.45, 6.55]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 4.5, 10]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.6} />
      </mesh>
      {[-1.5, 0.5, 2.5].map((tx, i) => (
        <mesh key={`pipe-r-${i}`} position={[tx, 0.65, 6.4]}>
          <boxGeometry args={[0.1, 0.55, 0.1]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.6} />
        </mesh>
      ))}
      {/* Flammable warning post */}
      <group position={[-1.85, 0, 3.9]}>
        <mesh position={[0, 0.6, 0]}>
          <boxGeometry args={[0.06, 1.2, 0.06]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        <mesh position={[0, 1.0, 0]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.55, 0.55, 0.04]} />
          <meshStandardMaterial color="#fde047" emissive="#fde047" emissiveIntensity={0.4} />
        </mesh>
        <Text
          position={[0, 1.0, 0.04]}
          fontSize={0.18}
          color="#0f172a"
          anchorX="center"
          anchorY="middle"
        >
          ⚠
        </Text>
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
    <group position={[52.5, 0, -60]}>
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

// ===== BotMine & Quarry @ (-75, 0, -37.5) ===============================
// Significantly expanded mining + quarry complex in the NW quadrant.
// Building at (-75, 2.5, -37.5), footprint 7×4 h5 → world
// x[-78.5..-71.5], z[-39.5..-35.5]. Decor envelope sprawls around it:
//   world x ∈ [-94, -60], z ∈ [-49.5, -29.5]
//   → local x ∈ [-19, +15], z ∈ [-12, +8]   (origin at -75, -37.5)
// Clearance checks (HALF=98 world, +z = south convention):
//   • World west edge x=-98 → 4u buffer beyond west envelope -94
//   • Road at z=-27 (sec_w=2.2 → band z[-28.1,-25.9]) → ≥1.4u north gap
//     from south envelope z=-29.5; haul road at z=-31 (3+u clear)
//   • BotFarm (-60,-61.5) → 32u north gap from envelope z_max=-29.5
//   • BotGigs (-55, 6) → ~35u clear (different z band entirely)
//   • BotGolf decor (x[-64,-24], z[-103,-87]) → 57u south gap, clear
// Highlights of the expansion: terraced quarry pit (3 tiers with rim
// rocks + parked excavator), animated haul truck along south haul road,
// crusher tower with rotating rotor + feed conveyor, 3 stockpile silos,
// water tower, 5 ore stockpiles (gold/copper/lithium/silver/iron),
// equipment shed, two floodlight poles, safety cones along pit rim.
function Mine() {
  const cartRef = useRef<THREE.Group>(null!);
  const oreRef = useRef<THREE.Mesh>(null!);
  const haulTruckRef = useRef<THREE.Group>(null!);
  const crusherRotorRef = useRef<THREE.Mesh>(null!);
  const floodlightRef = useRef<THREE.Mesh>(null!);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    // Cart shuttles back and forth on its rail (E-W).
    if (cartRef.current) {
      const phase = (Math.sin(t * 0.6) + 1) / 2; // 0..1
      cartRef.current.position.x = -3 + phase * 4.5;
    }
    // Gold stockpile glows like it's freshly extracted.
    if (oreRef.current) {
      const mat = oreRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.8 + Math.sin(t * 2) * 0.3;
    }
    // Haul truck drives slowly along the south haul road.
    if (haulTruckRef.current) {
      const phase = (Math.sin(t * 0.25) + 1) / 2;
      haulTruckRef.current.position.x = -10 + phase * 14;
      haulTruckRef.current.rotation.y = Math.cos(t * 0.25) > 0 ? 0 : Math.PI;
    }
    // Crusher rotor spins overhead.
    if (crusherRotorRef.current) {
      crusherRotorRef.current.rotation.y = t * 1.2;
    }
    // Floodlight pulses to read as active.
    if (floodlightRef.current) {
      const mat = floodlightRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 1.5 + Math.sin(t * 4) * 0.6;
    }
  });
  return (
    <group position={[-75, 0, -37.5]}>
      {/* ── Dirt patch under the entire district ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-2, 0.02, -2]}>
        <planeGeometry args={[30, 18]} />
        <meshStandardMaterial color="#3f2a1d" emissive="#7c2d12" emissiveIntensity={0.06} />
      </mesh>

      {/* ── Haul road — wider dirt track running E-W along the south side ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-2, 0.025, 5]}>
        <planeGeometry args={[26, 3]} />
        <meshStandardMaterial color="#57534e" roughness={0.95} />
      </mesh>

      {/* ── QUARRY PIT — terraced excavated rectangular pit (west side) ── */}
      <group position={[-13, 0, 0]}>
        {/* Pit floor (deepest tier) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.45, 0]}>
          <planeGeometry args={[8, 7]} />
          <meshStandardMaterial color="#1f1812" roughness={1} />
        </mesh>
        {/* Mid-tier ledge (inner ring) */}
        {([
          { p: [0, -1.0, -3.5], s: [10, 0.4, 1] },
          { p: [0, -1.0, 3.5], s: [10, 0.4, 1] },
          { p: [-4.5, -1.0, 0], s: [1, 0.4, 7] },
          { p: [4.5, -1.0, 0], s: [1, 0.4, 7] },
        ] as { p: [number, number, number]; s: [number, number, number] }[]).map((seg, i) => (
          <mesh key={`midL-${i}`} position={seg.p}>
            <boxGeometry args={seg.s} />
            <meshStandardMaterial color="#44403c" roughness={0.9} />
          </mesh>
        ))}
        {/* Top-tier ledge (outer rim) */}
        {([
          { p: [0, -0.3, -4.5], s: [12, 0.6, 1] },
          { p: [0, -0.3, 4.5], s: [12, 0.6, 1] },
          { p: [-5.5, -0.3, 0], s: [1, 0.6, 9] },
          { p: [5.5, -0.3, 0], s: [1, 0.6, 9] },
        ] as { p: [number, number, number]; s: [number, number, number] }[]).map((seg, i) => (
          <mesh key={`topL-${i}`} position={seg.p}>
            <boxGeometry args={seg.s} />
            <meshStandardMaterial color="#78716c" roughness={0.85} />
          </mesh>
        ))}
        {/* Boulders scattered on the pit floor */}
        {([
          [-2, -1.05, -1, 0.5],
          [1.5, -1.05, 1.5, 0.45],
          [-1.5, -1.05, 2, 0.4],
          [2.5, -1.05, -1.5, 0.5],
          [0.5, -1.05, 0.3, 0.35],
        ] as [number, number, number, number][]).map(([rx, ry, rz, rs], i) => (
          <mesh key={`bolder-${i}`} position={[rx, ry + rs, rz]}>
            <dodecahedronGeometry args={[rs, 0]} />
            <meshStandardMaterial color="#57534e" roughness={1} />
          </mesh>
        ))}
        {/* Parked excavator on the NE rim of the pit */}
        <group position={[4, 0, -3.5]}>
          {/* Tracks */}
          {[-0.5, 0.5].map((sz, j) => (
            <mesh key={`tr-${j}`} position={[0, 0.15, sz]}>
              <boxGeometry args={[1.7, 0.3, 0.25]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
          ))}
          {/* Body */}
          <mesh position={[0, 0.6, 0]} castShadow>
            <boxGeometry args={[1.4, 0.6, 0.9]} />
            <meshStandardMaterial color="#fbbf24" />
          </mesh>
          {/* Cab */}
          <mesh position={[-0.2, 1.15, 0]}>
            <boxGeometry args={[0.7, 0.5, 0.7]} />
            <meshStandardMaterial color="#0b1220" />
          </mesh>
          {/* Arm */}
          <mesh position={[0.9, 1.0, 0]} rotation={[0, 0, -0.45]}>
            <boxGeometry args={[1.6, 0.18, 0.2]} />
            <meshStandardMaterial color="#fbbf24" />
          </mesh>
          {/* Bucket */}
          <mesh position={[1.65, 0.45, 0]}>
            <boxGeometry args={[0.5, 0.45, 0.55]} />
            <meshStandardMaterial color="#facc15" metalness={0.4} />
          </mesh>
        </group>
      </group>

      {/* ── Safety cones lining the south rim of the quarry pit ── */}
      {[-10, -8, -6, -4, -2, 0, 2].map((cx, i) => (
        <group key={`cone-${i}`} position={[cx, 0, 6.2]}>
          <mesh position={[0, 0.2, 0]}>
            <coneGeometry args={[0.18, 0.4, 8]} />
            <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={0.3} />
          </mesh>
          <mesh position={[0, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.13, 0.02, 6, 12]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
        </group>
      ))}

      {/* ── Mineshaft entrance — bigger arch on the south face of the building ── */}
      <group position={[0, 0, 2.6]}>
        <mesh position={[-1.4, 1.5, 0]}>
          <boxGeometry args={[0.3, 3, 0.3]} />
          <meshStandardMaterial color="#451a03" roughness={0.95} />
        </mesh>
        <mesh position={[1.4, 1.5, 0]}>
          <boxGeometry args={[0.3, 3, 0.3]} />
          <meshStandardMaterial color="#451a03" roughness={0.95} />
        </mesh>
        <mesh position={[0, 3.1, 0]}>
          <boxGeometry args={[3.2, 0.35, 0.35]} />
          <meshStandardMaterial color="#451a03" roughness={0.95} />
        </mesh>
        <mesh position={[0, 1.5, 0]}>
          <boxGeometry args={[2.5, 2.8, 0.06]} />
          <meshStandardMaterial color="#0b0a08" emissive="#000" />
        </mesh>
        <mesh position={[0, 2.6, 0.1]}>
          <sphereGeometry args={[0.14, 10, 10]} />
          <meshStandardMaterial color="#fde68a" emissive="#fbbf24" emissiveIntensity={2.2} toneMapped={false} />
        </mesh>
      </group>

      {/* ── Rail track — longer E-W rails south of the entrance ── */}
      {[-0.18, 0.18].map((rz, i) => (
        <mesh key={`rail-${i}`} position={[0.5, 0.12, 4.5 + rz]}>
          <boxGeometry args={[12, 0.06, 0.1]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.4} />
        </mesh>
      ))}
      {[-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5].map((tx, i) => (
        <mesh key={`tie-${i}`} position={[0.5 + tx * 1.0, 0.07, 4.5]}>
          <boxGeometry args={[0.4, 0.06, 0.7]} />
          <meshStandardMaterial color="#451a03" />
        </mesh>
      ))}

      {/* ── Mine cart — animated wagon riding the rails ── */}
      <group ref={cartRef} position={[0, 0.4, 4.5]}>
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[0.9, 0.4, 0.6]} />
          <meshStandardMaterial color="#78350f" metalness={0.3} roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[0.94, 0.42, 0.04]} />
          <meshStandardMaterial color="#0f172a" metalness={0.7} />
        </mesh>
        {[[-0.3, 0.3], [0.3, 0.3], [-0.3, -0.3], [0.3, -0.3]].map(([wx, wz], i) => (
          <mesh key={`wheel-${i}`} position={[wx, 0, wz]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.13, 0.13, 0.08, 10]} />
            <meshStandardMaterial color="#1f2937" metalness={0.6} />
          </mesh>
        ))}
        <mesh position={[0, 0.55, 0]}>
          <dodecahedronGeometry args={[0.18, 0]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fde047" emissiveIntensity={0.7} toneMapped={false} />
        </mesh>
      </group>

      {/* ── Big yellow haul truck — animated along the south haul road ── */}
      <group ref={haulTruckRef} position={[5, 0, 5]}>
        {/* Chassis */}
        <mesh position={[0, 0.6, 0]} castShadow>
          <boxGeometry args={[3.6, 1.0, 1.6]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.3} />
        </mesh>
        {/* Cab */}
        <mesh position={[-1.4, 1.4, 0]} castShadow>
          <boxGeometry args={[1.0, 0.8, 1.4]} />
          <meshStandardMaterial color="#facc15" />
        </mesh>
        {/* Windshield */}
        <mesh position={[-1.9, 1.45, 0]}>
          <boxGeometry args={[0.08, 0.55, 1.0]} />
          <meshStandardMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={0.25} />
        </mesh>
        {/* Dump bed (tilted) */}
        <mesh position={[0.5, 1.4, 0]} rotation={[0, 0, -0.06]}>
          <boxGeometry args={[2.4, 0.9, 1.5]} />
          <meshStandardMaterial color="#a16207" roughness={0.85} />
        </mesh>
        {/* Ore in the bed */}
        <mesh position={[0.5, 2.0, 0]}>
          <dodecahedronGeometry args={[0.4, 0]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fde047" emissiveIntensity={0.4} toneMapped={false} />
        </mesh>
        <mesh position={[0.95, 1.95, 0.3]}>
          <dodecahedronGeometry args={[0.3, 0]} />
          <meshStandardMaterial color="#a16207" />
        </mesh>
        {/* Six huge wheels */}
        {([[-1.3, 0.8], [-1.3, -0.8], [1.0, 0.8], [1.0, -0.8], [1.8, 0.8], [1.8, -0.8]] as [number, number][]).map(([wx, wz], i) => (
          <mesh key={`hw-${i}`} position={[wx, 0.45, wz]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.45, 0.45, 0.35, 14]} />
            <meshStandardMaterial color="#1f2937" />
          </mesh>
        ))}
      </group>

      {/* ── Crusher building (industrial tower with rotating intake rotor) ── */}
      <group position={[9, 0, -4]}>
        <mesh position={[0, 1.5, 0]} castShadow>
          <boxGeometry args={[3.5, 3, 3]} />
          <meshStandardMaterial color="#52525b" metalness={0.4} roughness={0.6} />
        </mesh>
        <mesh position={[0, 3.05, 0]}>
          <boxGeometry args={[3.7, 0.15, 3.2]} />
          <meshStandardMaterial color="#3f3f46" />
        </mesh>
        <mesh position={[0, 4.5, 0]}>
          <cylinderGeometry args={[0.9, 1.3, 2.5, 10]} />
          <meshStandardMaterial color="#71717a" metalness={0.5} roughness={0.5} />
        </mesh>
        <mesh position={[0, 5.9, 0]}>
          <cylinderGeometry args={[1.0, 1.0, 0.2, 10]} />
          <meshStandardMaterial color="#27272a" />
        </mesh>
        <mesh ref={crusherRotorRef} position={[0, 6.15, 0]}>
          <boxGeometry args={[1.8, 0.12, 0.3]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.6} />
        </mesh>
        {/* Feed conveyor angling into the crusher from the pit side */}
        <group position={[-3.4, 0, 1]} rotation={[0, -0.6, 0]}>
          <mesh position={[0, 1.2, 0]} rotation={[0, 0, 0.32]}>
            <boxGeometry args={[5, 0.15, 0.9]} />
            <meshStandardMaterial color="#1f2937" metalness={0.4} />
          </mesh>
          {[-2.0, 0, 2.0].map((sx, i) => (
            <mesh key={`csup-${i}`} position={[sx, 0.4 + sx * 0.16, 0]}>
              <boxGeometry args={[0.12, 0.8, 0.9]} />
              <meshStandardMaterial color="#64748b" />
            </mesh>
          ))}
          {([-1.5, -0.4, 0.6, 1.7] as number[]).map((rx, i) => (
            <mesh key={`crock-${i}`} position={[rx, 1.32 + rx * 0.16, 0]}>
              <dodecahedronGeometry args={[0.16, 0]} />
              <meshStandardMaterial color={["#a16207", "#fbbf24", "#a78bfa", "#67e8f9"][i]} />
            </mesh>
          ))}
        </group>
        <Text
          position={[0, 2.2, 1.55]}
          fontSize={0.32}
          color="#fde047"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#0b1220"
        >
          ⚙ CRUSHER
        </Text>
      </group>

      {/* ── Three stockpile silos (north of the building) ── */}
      {[-2, 0, 2].map((sx, i) => (
        <group key={`silo-${i}`} position={[sx, 0, -7.5]}>
          <mesh position={[0, 2, 0]} castShadow>
            <cylinderGeometry args={[0.7, 0.7, 4, 12]} />
            <meshStandardMaterial color="#e7e5e4" metalness={0.3} roughness={0.5} />
          </mesh>
          <mesh position={[0, 4.3, 0]}>
            <coneGeometry args={[0.75, 0.6, 12]} />
            <meshStandardMaterial color="#a8a29e" metalness={0.4} />
          </mesh>
          <mesh position={[0, 2.5, 0]}>
            <cylinderGeometry args={[0.71, 0.71, 0.15, 12]} />
            <meshStandardMaterial color="#dc2626" />
          </mesh>
        </group>
      ))}

      {/* ── Water tower with spherical tank ── */}
      <group position={[12, 0, -7]}>
        {([[-0.5, -0.5], [0.5, -0.5], [-0.5, 0.5], [0.5, 0.5]] as [number, number][]).map(([lx, lz], i) => (
          <mesh key={`wleg-${i}`} position={[lx, 2, lz]} rotation={[0, 0, lx > 0 ? -0.12 : 0.12]}>
            <cylinderGeometry args={[0.08, 0.1, 4.2, 6]} />
            <meshStandardMaterial color="#52525b" metalness={0.5} />
          </mesh>
        ))}
        <mesh position={[0, 2.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.7, 0.04, 6, 16]} />
          <meshStandardMaterial color="#52525b" />
        </mesh>
        <mesh position={[0, 4.6, 0]} castShadow>
          <sphereGeometry args={[1.2, 16, 12]} />
          <meshStandardMaterial color="#0ea5e9" metalness={0.3} roughness={0.4} />
        </mesh>
        <Text
          position={[0, 4.6, 1.25]}
          fontSize={0.35}
          color="#f8fafc"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.04}
          outlineColor="#0b1220"
        >
          H₂O
        </Text>
      </group>

      {/* ── Five ore stockpiles (gold/copper/lithium/silver/iron) ──
          The gold pile holds the animated `oreRef`; the rest are static. */}
      {/* All pile bodies (radius 0.55) sit south of the building footprint
          (building z_max = +2); minimum z chosen is 3.0 → 0.45u south gap. */}
      {([
        { x: -3.5, z: 3.0, body: "#fbbf24", emis: "#fde047", glow: true },
        { x: -1.5, z: 3.4, body: "#a16207", emis: "#facc15", glow: false },
        { x: -3.5, z: 4.4, body: "#a78bfa", emis: "#c4b5fd", glow: false },
        { x: -0.5, z: 3.2, body: "#cbd5e1", emis: "#f1f5f9", glow: false },
        { x: -5.5, z: 3.6, body: "#7c2d12", emis: "#dc2626", glow: false },
      ] as { x: number; z: number; body: string; emis: string; glow: boolean }[]).map((pile, i) => (
        <group key={`pile-${i}`} position={[pile.x, 0, pile.z]}>
          <mesh ref={pile.glow ? oreRef : undefined} position={[0, 0.45, 0]}>
            <dodecahedronGeometry args={[0.55, 0]} />
            <meshStandardMaterial
              color={pile.body}
              emissive={pile.emis}
              emissiveIntensity={pile.glow ? 0.8 : 0.3}
              toneMapped={!pile.glow}
            />
          </mesh>
          <mesh position={[0.4, 0.3, 0.3]}>
            <dodecahedronGeometry args={[0.35, 0]} />
            <meshStandardMaterial color={pile.body} emissive={pile.emis} emissiveIntensity={0.25} />
          </mesh>
          <mesh position={[-0.4, 0.25, 0.25]}>
            <dodecahedronGeometry args={[0.3, 0]} />
            <meshStandardMaterial color={pile.body} emissive={pile.emis} emissiveIntensity={0.25} />
          </mesh>
        </group>
      ))}

      {/* ── Equipment shed (SW corner) ── */}
      <group position={[-6, 0, -6]}>
        <mesh position={[0, 0.9, 0]} castShadow>
          <boxGeometry args={[3, 1.8, 2.4]} />
          <meshStandardMaterial color="#7c2d12" roughness={0.85} />
        </mesh>
        <mesh position={[0, 2, 0]}>
          <boxGeometry args={[3.2, 0.2, 2.6]} />
          <meshStandardMaterial color="#451a03" />
        </mesh>
        <mesh position={[0, 0.7, 1.21]}>
          <boxGeometry args={[0.8, 1.4, 0.05]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
        <mesh position={[-1.0, 1.2, 1.21]}>
          <boxGeometry args={[0.6, 0.4, 0.05]} />
          <meshStandardMaterial color="#fde68a" emissive="#fde68a" emissiveIntensity={0.4} />
        </mesh>
      </group>

      {/* ── West floodlight pole (animated emissive pulse) ── */}
      <group position={[-9, 0, -3]}>
        <mesh position={[0, 3, 0]}>
          <cylinderGeometry args={[0.08, 0.1, 6, 8]} />
          <meshStandardMaterial color="#52525b" metalness={0.6} />
        </mesh>
        <mesh position={[0, 5.8, 0.3]}>
          <boxGeometry args={[0.8, 0.35, 0.3]} />
          <meshStandardMaterial color="#27272a" />
        </mesh>
        <mesh ref={floodlightRef} position={[0, 5.8, 0.5]}>
          <boxGeometry args={[0.7, 0.25, 0.05]} />
          <meshStandardMaterial color="#fde68a" emissive="#fde047" emissiveIntensity={1.8} toneMapped={false} />
        </mesh>
      </group>

      {/* ── East floodlight pole (static) ── */}
      <group position={[11, 0, 4]}>
        <mesh position={[0, 3, 0]}>
          <cylinderGeometry args={[0.08, 0.1, 6, 8]} />
          <meshStandardMaterial color="#52525b" metalness={0.6} />
        </mesh>
        <mesh position={[0, 5.8, -0.3]}>
          <boxGeometry args={[0.8, 0.35, 0.3]} />
          <meshStandardMaterial color="#27272a" />
        </mesh>
        <mesh position={[0, 5.8, -0.5]}>
          <boxGeometry args={[0.7, 0.25, 0.05]} />
          <meshStandardMaterial color="#fde68a" emissive="#fde047" emissiveIntensity={1.5} toneMapped={false} />
        </mesh>
      </group>

      {/* ── Original short sorting conveyor (kept, shifted east to clear
          the larger 7×4 building footprint at local x[-3.5, +3.5]) ── */}
      <group position={[6, 0, 1]} rotation={[0, -0.4, 0]}>
        <mesh position={[0, 0.45, 0]} rotation={[0, 0, 0.18]}>
          <boxGeometry args={[2.5, 0.12, 0.8]} />
          <meshStandardMaterial color="#1f2937" metalness={0.4} roughness={0.6} />
        </mesh>
        {[-1.2, 1.2].map((rx, i) => (
          <mesh key={`roller-${i}`} position={[rx, 0.45 + rx * 0.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.16, 0.16, 0.85, 12]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.7} />
          </mesh>
        ))}
        <mesh position={[-1.2, 0.1, 0]}>
          <boxGeometry args={[0.1, 0.2, 0.85]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
        <mesh position={[1.2, 0.3, 0]}>
          <boxGeometry args={[0.1, 0.7, 0.85]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
      </group>

      {/* ── Big BOTMINE & QUARRY signage above the entrance ── */}
      <Text
        position={[0, 5.7, 2.8]}
        fontSize={0.6}
        color="#fde047"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#451a03"
      >
        ⛏️ BOTMINE & QUARRY
      </Text>
      <Text
        position={[0, 5.0, 2.8]}
        fontSize={0.24}
        color="#fef3c7"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#0b1220"
      >
        Gold · Copper · Lithium · Silver · Iron
      </Text>
      <Text
        position={[0, 4.65, 2.8]}
        fontSize={0.18}
        color="#facc15"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#0b1220"
      >
        Severance Tax · Depletion Allowance
      </Text>
    </group>
  );
}

// ===== BotZoo & Park @ (-22.5, 0, 87) ==================================
// Expanded MEGA wildlife park along the SW-south edge. Zoo gate kiosk at
// (-22.5, 2.5, 87). Park lawn + pens fan WEST and NORTH from the gate
// into the band between airport R3 (north) and the world south edge.
//   world envelope: x ∈ [-40, -16], z ∈ [81, 92]
//   → local x ∈ [-17.5, +6.5], local z ∈ [-6, +5] (origin at -22.5, 87)
// Clearances (HALF=98 world):
//   • Airport R3 (x[-27.5,-22.5], z[40..80]) → 1u south gap from lawn
//   • Airport parking lot (x[-57,-43], z[85,91]) → 3u east gap from lawn
//   • BotKids (-9, 82.5), x_min=-12 → 4u east gap from lawn x_max=-16
//   • World south edge z=98 → 6u south buffer beyond lawn z_max=92
// New attractions added in the western expansion: lion enclosure, zebra
// paddock, penguin pool, walk-in aviary, picnic area, park benches,
// info kiosk, plus extended conservation tree cluster.
function Zoo() {
  const giraffeRef = useRef<THREE.Group>(null!);
  const monkeyRef = useRef<THREE.Mesh>(null!);
  const lionTailRef = useRef<THREE.Mesh>(null!);
  const penguinRef = useRef<THREE.Mesh>(null!);
  const birdRef = useRef<THREE.Group>(null!);
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
    // Lion tail swishes.
    if (lionTailRef.current) {
      lionTailRef.current.rotation.z = Math.sin(t * 2) * 0.4;
    }
    // Penguin waddles side to side.
    if (penguinRef.current) {
      penguinRef.current.rotation.z = Math.sin(t * 3) * 0.18;
    }
    // Parrot circles inside the aviary cage.
    if (birdRef.current) {
      birdRef.current.position.x = Math.cos(t * 0.9) * 0.9;
      birdRef.current.position.z = Math.sin(t * 0.9) * 0.9;
      birdRef.current.rotation.y = -t * 0.9 + Math.PI / 2;
    }
  });
  return (
    <group position={[-22.5, 0, 87]}>
      {/* ── Park lawn — enlarged 24×11 (was 13×10), shifted west to
            cover the new pens. Local x[-17.5..+6.5], z[-6..+5]. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-5.5, 0.02, -0.5]} receiveShadow>
        <planeGeometry args={[24, 11]} />
        <meshStandardMaterial color="#166534" emissive="#22c55e" emissiveIntensity={0.18} />
      </mesh>
      {/* ── Winding dirt path connecting gate → west pens ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-8, 0.04, 0]}>
        <planeGeometry args={[20, 1.4]} />
        <meshStandardMaterial color="#a16207" roughness={0.95} />
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
        [-7, -7.6, 1.2],
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

      {/* ══════════ EXPANSION — new pens & park amenities ══════════ */}

      {/* ── Lion enclosure (NW) — sandy rock outcrop with a lion ── */}
      <group position={[-12, 0, -4]}>
        {/* Sandy ground */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
          <circleGeometry args={[2.6, 24]} />
          <meshStandardMaterial color="#d4a373" roughness={0.95} />
        </mesh>
        {/* Boulders */}
        <mesh position={[-1.4, 0.45, 0.8]}>
          <dodecahedronGeometry args={[0.7, 0]} />
          <meshStandardMaterial color="#78716c" />
        </mesh>
        <mesh position={[1.6, 0.35, -0.6]}>
          <dodecahedronGeometry args={[0.55, 0]} />
          <meshStandardMaterial color="#57534e" />
        </mesh>
        {/* Lion body */}
        <mesh position={[0, 0.55, 0]} castShadow>
          <boxGeometry args={[1.5, 0.7, 0.7]} />
          <meshStandardMaterial color="#ca8a04" />
        </mesh>
        {/* Mane */}
        <mesh position={[0.7, 0.85, 0]} castShadow>
          <sphereGeometry args={[0.5, 12, 10]} />
          <meshStandardMaterial color="#78350f" />
        </mesh>
        {/* Head */}
        <mesh position={[0.85, 0.85, 0]} castShadow>
          <boxGeometry args={[0.4, 0.45, 0.5]} />
          <meshStandardMaterial color="#ca8a04" />
        </mesh>
        {/* Legs */}
        {[[-0.5, -0.25], [0.5, -0.25], [-0.5, 0.25], [0.5, 0.25]].map(([lx, lz], i) => (
          <mesh key={`lleg-${i}`} position={[lx, 0.2, lz]}>
            <boxGeometry args={[0.18, 0.4, 0.18]} />
            <meshStandardMaterial color="#ca8a04" />
          </mesh>
        ))}
        {/* Tail (swishes) */}
        <mesh ref={lionTailRef} position={[-0.85, 0.55, 0]}>
          <boxGeometry args={[0.55, 0.08, 0.08]} />
          <meshStandardMaterial color="#ca8a04" />
        </mesh>
        {/* Sign */}
        <Text position={[0, 1.7, 2]} fontSize={0.32} color="#fde047" anchorX="center" outlineWidth={0.03} outlineColor="#0b1220">
          🦁 LIONS
        </Text>
      </group>

      {/* ── Zebra paddock (W) ── */}
      <group position={[-15, 0, 0]}>
        {/* Grass patch */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
          <planeGeometry args={[4, 3]} />
          <meshStandardMaterial color="#365314" />
        </mesh>
        {/* Zebra body */}
        <mesh position={[0, 0.8, 0]} castShadow>
          <boxGeometry args={[1.4, 0.55, 0.55]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        {/* Stripes */}
        {[-0.5, -0.25, 0, 0.25, 0.5].map((sx, i) => (
          <mesh key={`zstripe-${i}`} position={[sx, 0.8, 0]}>
            <boxGeometry args={[0.08, 0.56, 0.56]} />
            <meshStandardMaterial color="#0b1220" />
          </mesh>
        ))}
        {/* Head */}
        <mesh position={[0.85, 0.95, 0]} castShadow>
          <boxGeometry args={[0.4, 0.45, 0.35]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        {/* Mane */}
        <mesh position={[0.55, 1.15, 0]}>
          <boxGeometry args={[0.5, 0.12, 0.1]} />
          <meshStandardMaterial color="#0b1220" />
        </mesh>
        {/* Legs */}
        {[[-0.45, -0.2], [0.45, -0.2], [-0.45, 0.2], [0.45, 0.2]].map(([lx, lz], i) => (
          <mesh key={`zleg-${i}`} position={[lx, 0.3, lz]}>
            <boxGeometry args={[0.14, 0.6, 0.14]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
        ))}
        {/* Fence rails around paddock */}
        {[-2, 2].map((fz) => (
          <mesh key={`zf-${fz}`} position={[0, 0.5, fz]}>
            <boxGeometry args={[4, 0.08, 0.06]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
        ))}
        <Text position={[0, 1.9, -1.7]} fontSize={0.28} color="#fde047" anchorX="center" outlineWidth={0.03} outlineColor="#0b1220">
          🦓 ZEBRAS
        </Text>
      </group>

      {/* ── Penguin pool (mid-west) — round water with two penguins ── */}
      <group position={[-9, 0, -3]}>
        {/* Pool wall (low) */}
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[1.4, 1.5, 0.2, 24]} />
          <meshStandardMaterial color="#e2e8f0" />
        </mesh>
        {/* Water surface */}
        <mesh position={[0, 0.21, 0]}>
          <cylinderGeometry args={[1.3, 1.3, 0.05, 24]} />
          <meshStandardMaterial color="#0ea5e9" emissive="#38bdf8" emissiveIntensity={0.35} transparent opacity={0.85} />
        </mesh>
        {/* Penguin 1 (waddling) */}
        <group ref={penguinRef} position={[0.6, 0.25, 0.2]}>
          <mesh position={[0, 0.3, 0]}>
            <capsuleGeometry args={[0.22, 0.4, 4, 8]} />
            <meshStandardMaterial color="#0b1220" />
          </mesh>
          <mesh position={[0, 0.32, 0.18]}>
            <capsuleGeometry args={[0.16, 0.32, 4, 8]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
          {/* Beak */}
          <mesh position={[0, 0.55, 0.22]}>
            <coneGeometry args={[0.06, 0.18, 6]} />
            <meshStandardMaterial color="#f59e0b" />
          </mesh>
        </group>
        {/* Penguin 2 (static) */}
        <group position={[-0.5, 0.25, -0.4]}>
          <mesh position={[0, 0.3, 0]}>
            <capsuleGeometry args={[0.22, 0.4, 4, 8]} />
            <meshStandardMaterial color="#0b1220" />
          </mesh>
          <mesh position={[0, 0.32, 0.18]}>
            <capsuleGeometry args={[0.16, 0.32, 4, 8]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
          <mesh position={[0, 0.55, 0.22]}>
            <coneGeometry args={[0.06, 0.18, 6]} />
            <meshStandardMaterial color="#f59e0b" />
          </mesh>
        </group>
        <Text position={[0, 1.7, -1.8]} fontSize={0.26} color="#fde047" anchorX="center" outlineWidth={0.03} outlineColor="#0b1220">
          🐧 PENGUIN POOL
        </Text>
      </group>

      {/* ── Walk-in aviary cage (N) — tall cylinder of bars, parrot circles inside ── */}
      <group position={[-13, 0, -7]}>
        {/* Cage base */}
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[1.6, 1.7, 0.1, 16]} />
          <meshStandardMaterial color="#44403c" />
        </mesh>
        {/* Vertical bars */}
        {Array.from({ length: 16 }).map((_, i) => {
          const a = (i / 16) * Math.PI * 2;
          return (
            <mesh key={`abar-${i}`} position={[Math.cos(a) * 1.6, 1.6, Math.sin(a) * 1.6]}>
              <cylinderGeometry args={[0.04, 0.04, 3.2, 6]} />
              <meshStandardMaterial color="#a8a29e" metalness={0.6} roughness={0.4} />
            </mesh>
          );
        })}
        {/* Top hoop */}
        <mesh position={[0, 3.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.6, 0.06, 6, 24]} />
          <meshStandardMaterial color="#a8a29e" metalness={0.6} />
        </mesh>
        {/* Dome cap */}
        <mesh position={[0, 3.35, 0]}>
          <sphereGeometry args={[1.6, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#a8a29e" wireframe transparent opacity={0.55} />
        </mesh>
        {/* Inner perch */}
        <mesh position={[0, 1.4, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 2.6, 6]} />
          <meshStandardMaterial color="#78350f" />
        </mesh>
        {/* Parrot circles inside */}
        <group ref={birdRef} position={[0.9, 1.8, 0]}>
          <mesh>
            <sphereGeometry args={[0.16, 10, 10]} />
            <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={0.25} />
          </mesh>
          <mesh position={[0.12, 0.04, 0]}>
            <coneGeometry args={[0.06, 0.16, 6]} />
            <meshStandardMaterial color="#f59e0b" />
          </mesh>
          <mesh position={[-0.18, 0, 0]}>
            <boxGeometry args={[0.22, 0.05, 0.18]} />
            <meshStandardMaterial color="#16a34a" />
          </mesh>
        </group>
        <Text position={[0, 3.9, 0]} fontSize={0.3} color="#fde047" anchorX="center" outlineWidth={0.03} outlineColor="#0b1220">
          🦜 AVIARY
        </Text>
      </group>

      {/* ── Picnic area (E side) — two tables on a grass patch ── */}
      <group position={[4, 0, 3]}>
        {[[-1.4, 0], [1.4, 0]].map(([px, pz], i) => (
          <group key={`picnic-${i}`} position={[px, 0, pz]}>
            {/* Tabletop */}
            <mesh position={[0, 0.5, 0]} castShadow>
              <boxGeometry args={[1.2, 0.08, 0.6]} />
              <meshStandardMaterial color="#a16207" />
            </mesh>
            {/* Benches */}
            <mesh position={[0, 0.3, 0.45]}>
              <boxGeometry args={[1.2, 0.05, 0.2]} />
              <meshStandardMaterial color="#78350f" />
            </mesh>
            <mesh position={[0, 0.3, -0.45]}>
              <boxGeometry args={[1.2, 0.05, 0.2]} />
              <meshStandardMaterial color="#78350f" />
            </mesh>
            {/* Legs */}
            {[[-0.5, 0], [0.5, 0]].map(([lx, lz], j) => (
              <mesh key={`tl-${j}`} position={[lx, 0.25, lz]}>
                <boxGeometry args={[0.08, 0.5, 0.6]} />
                <meshStandardMaterial color="#57534e" />
              </mesh>
            ))}
            {/* Umbrella */}
            <mesh position={[0, 0.9, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.8, 6]} />
              <meshStandardMaterial color="#57534e" />
            </mesh>
            <mesh position={[0, 1.35, 0]}>
              <coneGeometry args={[0.9, 0.4, 12]} />
              <meshStandardMaterial color={i === 0 ? "#dc2626" : "#0ea5e9"} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ── Park benches along the central path (for the "& Park" aspect) ── */}
      {[[-3, 2.5], [3, 2.5], [-10, 1.5]].map(([bx, bz], i) => (
        <group key={`bench-${i}`} position={[bx, 0, bz]}>
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[1.2, 0.08, 0.3]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
          <mesh position={[0, 0.55, -0.12]}>
            <boxGeometry args={[1.2, 0.4, 0.06]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
          {[-0.5, 0.5].map((lx, j) => (
            <mesh key={`bl-${j}`} position={[lx, 0.15, 0]}>
              <boxGeometry args={[0.08, 0.3, 0.3]} />
              <meshStandardMaterial color="#44403c" />
            </mesh>
          ))}
        </group>
      ))}

      {/* ── Info kiosk / map post near the entrance ── */}
      <group position={[2, 0, 0]}>
        <mesh position={[0, 0.7, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 1.4, 6]} />
          <meshStandardMaterial color="#44403c" />
        </mesh>
        <mesh position={[0, 1.4, 0]} rotation={[0, -0.35, 0]}>
          <boxGeometry args={[0.9, 0.6, 0.04]} />
          <meshStandardMaterial color="#fde047" emissive="#fbbf24" emissiveIntensity={0.4} />
        </mesh>
        <Text position={[0, 1.4, 0.04]} rotation={[0, -0.35, 0]} fontSize={0.13} color="#0b1220" anchorX="center" maxWidth={0.8}>
          ZOO MAP
        </Text>
      </group>

      {/* ── Extended conservation tree cluster (NW perimeter) ── */}
      {[
        [-16, -3, 1.6],
        [-17, -1, 1.4],
        [-16.5, -6, 1.5],
        [-14, -8, 1.3],
        [-8, -9, 1.5],
        [2, -9, 1.4],
        [5, -9, 1.5],
      ].map(([tx, tz, h], i) => (
        <group key={`xtree-${i}`} position={[tx as number, 0, tz as number]}>
          <mesh position={[0, (h as number) / 2, 0]}>
            <cylinderGeometry args={[0.12, 0.16, h as number, 6]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
          <mesh position={[0, (h as number) + 0.4, 0]}>
            <sphereGeometry args={[0.75, 10, 10]} />
            <meshStandardMaterial color="#15803d" emissive="#22c55e" emissiveIntensity={0.2} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ===== BotSoccer Stadium @ (-40.5, 0, -82.5) =========================
// MEGA pitch 22x7 (vs prev 12x7 — width nearly doubled), 4-sided
// grandstands with covered roofs, 4 corner floodlight pylons (4 lamps
// each = 16 total lamps), dual end-zone jumbotrons. Depth kept tight
// because botsoccer kiosk + Building stoop reaches back to ~z=-77.0
// (1.7u south of kiosk center) and z=-90 road band starts at z=-88.9.
// Envelope after re-tuning:
//   • pitch x[-51.5..-29.5], z[-86..-79]
//   • grandstand roof outer faces z[-87.6..-77.4] → 0.4u clear of kiosk
//     to the N, 1.3u clear of road band to the S
//   • pylons at corners x[±11.5], z[±5] from center → x[-52..-29],
//     z[-87.5..-77.5]
function SoccerStadium() {
  const jumboRefs = useRef<Array<THREE.Mesh | null>>([]);
  const flagRefs = useRef<Array<THREE.Mesh | null>>([]);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    jumboRefs.current.forEach((m, i) => {
      if (m) {
        const mat = m.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = 1.4 + Math.sin(t * 4 + i) * 0.5;
      }
    });
    flagRefs.current.forEach((m, i) => {
      if (m) m.rotation.y = Math.sin(t * 1.8 + i) * 0.5;
    });
  });
  return (
    <group position={[-40.5, 0, -82.5]}>
      {/* Pitch — bigger green grass rectangle (22 wide x 7 deep) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]} receiveShadow>
        <planeGeometry args={[22, 7]} />
        <meshStandardMaterial color="#15803d" emissive="#22c55e" emissiveIntensity={0.4} />
      </mesh>
      {/* Mowed stripes — alternating darker bands along the length */}
      {[-2.8, -1.8, -0.6, 0.6, 1.8, 2.8].map((z, i) => (
        <mesh key={`mow-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.045, z]}>
          <planeGeometry args={[22, 0.95]} />
          <meshStandardMaterial color={i % 2 === 0 ? "#166534" : "#15803d"} transparent opacity={0.5} />
        </mesh>
      ))}
      {/* Center circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
        <ringGeometry args={[1.3, 1.45, 32]} />
        <meshStandardMaterial color="#f8fafc" emissive="#f8fafc" emissiveIntensity={1.2} toneMapped={false} />
      </mesh>
      {/* Center spot */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.065, 0]}>
        <circleGeometry args={[0.15, 12]} />
        <meshStandardMaterial color="#f8fafc" emissive="#f8fafc" emissiveIntensity={1.4} toneMapped={false} />
      </mesh>
      {/* Halfway line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.055, 0]}>
        <planeGeometry args={[0.14, 7]} />
        <meshStandardMaterial color="#f8fafc" emissive="#f8fafc" emissiveIntensity={1} toneMapped={false} />
      </mesh>
      {/* Pitch perimeter line */}
      {[
        [0, -3.5, 22, 0.14],
        [0, 3.5, 22, 0.14],
        [-11, 0, 0.14, 7],
        [11, 0, 0.14, 7],
      ].map(([px, pz, pw, pd], i) => (
        <mesh key={`peri-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[px, 0.05, pz]}>
          <planeGeometry args={[pw, pd]} />
          <meshStandardMaterial color="#f8fafc" emissive="#f8fafc" emissiveIntensity={0.9} toneMapped={false} />
        </mesh>
      ))}
      {/* Penalty boxes at both ends — outer 4.0 wide x 2.6 deep */}
      {[-1, 1].map((dir) => (
        <group key={`pen-${dir}`}>
          {[
            [dir * 9.7, -2.0, 0.1, 4.0],
            [dir * 9.7, 2.0, 0.1, 4.0],
            [dir * 8.4, 0, 2.6, 0.1],
          ].map(([px, pz, pw, pd], i) => (
            <mesh key={`pl-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[px, 0.05, pz]}>
              <planeGeometry args={[pw, pd]} />
              <meshStandardMaterial color="#f8fafc" emissive="#f8fafc" emissiveIntensity={0.9} toneMapped={false} />
            </mesh>
          ))}
          {/* Penalty spot */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[dir * 8.5, 0.065, 0]}>
            <circleGeometry args={[0.12, 10]} />
            <meshStandardMaterial color="#f8fafc" emissive="#f8fafc" emissiveIntensity={1.4} toneMapped={false} />
          </mesh>
        </group>
      ))}
      {/* Goals — bigger frames at both ends */}
      {[-11, 11].map((gx) => (
        <group key={`goal-${gx}`} position={[gx, 0, 0]}>
          {/* Posts */}
          {[-1.5, 1.5].map((pz) => (
            <mesh key={`post-${pz}`} position={[0, 1.1, pz]} castShadow>
              <cylinderGeometry args={[0.1, 0.1, 2.2, 8]} />
              <meshStandardMaterial color="#f8fafc" emissive="#f8fafc" emissiveIntensity={0.4} />
            </mesh>
          ))}
          {/* Crossbar */}
          <mesh position={[0, 2.2, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.1, 3.0, 8]} />
            <meshStandardMaterial color="#f8fafc" emissive="#f8fafc" emissiveIntensity={0.4} />
          </mesh>
          {/* Net — translucent plane behind goal, tilted back */}
          <mesh
            position={[gx > 0 ? 0.75 : -0.75, 1.1, 0]}
            rotation={[0, gx > 0 ? -0.4 : 0.4, 0]}
          >
            <planeGeometry args={[3.0, 2.2]} />
            <meshStandardMaterial color="#e5e7eb" transparent opacity={0.4} side={THREE.DoubleSide} />
          </mesh>
          {/* Net top — sloped roof of the net cage */}
          <mesh
            position={[gx > 0 ? 0.45 : -0.45, 2.3, 0]}
            rotation={[gx > 0 ? -Math.PI / 5 : Math.PI / 5, 0, gx > 0 ? Math.PI / 2 : -Math.PI / 2]}
          >
            <planeGeometry args={[3.0, 1.4]} />
            <meshStandardMaterial color="#e5e7eb" transparent opacity={0.35} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}
      {/* Corner flags — 4 corners */}
      {[[-10.7, -3.3], [10.7, -3.3], [-10.7, 3.3], [10.7, 3.3]].map(([fx, fz], i) => (
        <group key={`flag-${i}`} position={[fx, 0, fz]}>
          <mesh position={[0, 0.7, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 1.4, 6]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
          <mesh
            ref={(m) => { flagRefs.current[i] = m; }}
            position={[0.18, 1.25, 0]}
          >
            <planeGeometry args={[0.36, 0.24]} />
            <meshStandardMaterial color="#fde047" emissive="#fde047" emissiveIntensity={0.9} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}
      {/* North & South grandstands — long sides, width 23. Stands center
          at z=±4.2, roof set back to ±4.2 (no extra offset); roof depth
          1.8 → outer face at z=±5.1 = world z[-87.6..-77.4]. */}
      {[-1, 1].map((dir) => (
        <group key={`stand-${dir}`} position={[0, 0, dir * 4.2]}>
          {/* Lower tier */}
          <mesh position={[0, 0.8, 0]} castShadow>
            <boxGeometry args={[23, 1.6, 1.2]} />
            <meshStandardMaterial color="#1e293b" emissive="#3b82f6" emissiveIntensity={0.35} />
          </mesh>
          {/* Upper tier (set back outward) */}
          <mesh position={[0, 2.4, dir * 0.3]} castShadow>
            <boxGeometry args={[23, 1.6, 1.0]} />
            <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={0.55} />
          </mesh>
          {/* Roof canopy */}
          <mesh position={[0, 3.8, dir * 0.35]} castShadow>
            <boxGeometry args={[23.4, 0.25, 1.4]} />
            <meshStandardMaterial color="#0b1220" metalness={0.5} />
          </mesh>
          {/* Roof emissive trim line */}
          <mesh position={[0, 3.95, dir * 1.05]}>
            <boxGeometry args={[23.4, 0.05, 0.05]} />
            <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={2.0} toneMapped={false} />
          </mesh>
        </group>
      ))}
      {/* East & West end stands — shorter, behind the goals. Depth 8
          (z[-4..+4]) matches the narrower pitch envelope. */}
      {[-1, 1].map((dir) => (
        <group key={`endstand-${dir}`} position={[dir * 12.4, 0, 0]}>
          <mesh position={[0, 0.8, 0]} castShadow>
            <boxGeometry args={[1.2, 1.6, 8]} />
            <meshStandardMaterial color="#1e293b" emissive="#3b82f6" emissiveIntensity={0.35} />
          </mesh>
          <mesh position={[dir * 0.4, 2.4, 0]} castShadow>
            <boxGeometry args={[1.0, 1.6, 8]} />
            <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[dir * 0.45, 3.8, 0]} castShadow>
            <boxGeometry args={[1.4, 0.22, 8.4]} />
            <meshStandardMaterial color="#0b1220" metalness={0.5} />
          </mesh>
        </group>
      ))}
      {/* Floodlight pylons at 4 corners — pulled in to z=±5 so north
          pylon at world z=-77.5 stays 0.5u clear of kiosk south face. */}
      {[[-11.5, -5], [11.5, -5], [-11.5, 5], [11.5, 5]].map(([x, z], i) => (
        <group key={`fl-${i}`} position={[x, 0, z]}>
          <mesh position={[0, 6, 0]} castShadow>
            <cylinderGeometry args={[0.16, 0.26, 12, 8]} />
            <meshStandardMaterial color="#0b1220" metalness={0.8} />
          </mesh>
          {/* Light bank — 4 lamps in a square */}
          {[[-0.5, -0.25], [0.5, -0.25], [-0.5, 0.25], [0.5, 0.25]].map(([lx, ly], j) => (
            <mesh key={`lamp-${j}`} position={[lx, 12.1 + ly * 0.6, 0]}>
              <boxGeometry args={[0.42, 0.42, 0.32]} />
              <meshStandardMaterial
                color="#fef3c7"
                emissive="#fde047"
                emissiveIntensity={2.8}
                toneMapped={false}
              />
            </mesh>
          ))}
        </group>
      ))}
      {/* End jumbotrons — one behind each goal */}
      {[-1, 1].map((dir, i) => (
        <group key={`jumbo-${i}`} position={[dir * 11.5, 5.0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.4, 2.4, 4.0]} />
            <meshStandardMaterial color="#0b1220" />
          </mesh>
          <mesh
            ref={(m) => { jumboRefs.current[i] = m; }}
            position={[dir * 0.22, 0, 0]}
            rotation={[0, dir > 0 ? -Math.PI / 2 : Math.PI / 2, 0]}
          >
            <planeGeometry args={[3.6, 2.0]} />
            <meshStandardMaterial
              color={dir > 0 ? "#22c55e" : "#3b82f6"}
              emissive={dir > 0 ? "#22c55e" : "#3b82f6"}
              emissiveIntensity={1.6}
              toneMapped={false}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      ))}
      {/* Stadium name sign over the south entrance (sign anchors south,
          away from the kiosk to the north). */}
      <Text
        position={[0, 5.4, 5.4]}
        fontSize={0.78}
        color="#bbf7d0"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.06}
        outlineColor="#15803d"
      >
        ⚽ BOTSOCCER STADIUM
      </Text>
      <Text
        position={[0, 4.7, 5.4]}
        fontSize={0.26}
        color="#dcfce7"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor="#0b1220"
      >
        Home of the Bot Strikers · Cap 54,321
      </Text>
    </group>
  );
}

// ===== BotHoops Arena @ (40.5, 0, 45) ================================
// MEGA domed indoor arena. Center SHIFTED 4.5u north (was z=40.5) to
// enable a larger dome while keeping the botbasketball kiosk at z=34
// (kiosk + stoop reaches to ~z=35.8) outside the south footprint.
//   • dome radius 7.2 (was 5) — north edge world z=52.2 → 0.7u clear of
//     z=54 road band z[52.9..55.1]
//   • wall bottom radius 7.4 → north edge z=52.4 → 0.5u road clearance
//   • south-only plaza apron r=7.9 → south edge z=37.1 → 1.3u clear of
//     kiosk stoop at z=35.8
//   • outdoor full court at world x[24..32], z[41..49] — well clear of
//     x=36 road band (4u gap) and z=54 road (5u gap)
function BasketballArena() {
  const domeRef = useRef<THREE.Mesh>(null!);
  const beamRef = useRef<THREE.Mesh>(null!);
  const ballRef = useRef<THREE.Mesh>(null!);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (domeRef.current) {
      const mat = domeRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.55 + Math.sin(t * 1.4) * 0.2;
    }
    if (beamRef.current) beamRef.current.rotation.y = t * 0.6;
    if (ballRef.current) {
      ballRef.current.position.y = 0.3 + Math.abs(Math.sin(t * 2.4)) * 0.55;
      ballRef.current.rotation.x = t * 3;
      ballRef.current.rotation.z = t * 2;
    }
  });
  return (
    <group position={[40.5, 0, 45]}>
      {/* Concrete plaza apron — half-ring on south side only (away from
          z=54 road), so it doesn't push the envelope into the road band. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <ringGeometry args={[7.4, 7.9, 32, 1, 0, Math.PI]} />
        <meshStandardMaterial color="#3f3f46" roughness={0.85} />
      </mesh>
      {/* Cylindrical arena wall — taller. Top r=7.2, bottom r=7.4. */}
      <mesh position={[0, 2.8, 0]} castShadow>
        <cylinderGeometry args={[7.2, 7.4, 5.6, 40]} />
        <meshStandardMaterial color="#7c2d12" emissive="#f97316" emissiveIntensity={0.38} metalness={0.45} roughness={0.5} />
      </mesh>
      {/* Concourse trim — emissive ring at wall top */}
      <mesh position={[0, 5.65, 0]}>
        <torusGeometry args={[7.2, 0.14, 8, 48]} />
        <meshStandardMaterial color="#fde047" emissive="#fde047" emissiveIntensity={1.6} toneMapped={false} />
      </mesh>
      {/* Glowing geodesic-feel dome (half-sphere) */}
      <mesh ref={domeRef} position={[0, 5.6, 0]} castShadow>
        <sphereGeometry args={[7.2, 32, 18, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#f97316"
          emissive="#fb923c"
          emissiveIntensity={0.6}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      {/* Dome seam rings — six thin emissive bands (inscribed in r=7.2) */}
      {[1.5, 3.0, 4.5, 5.6, 6.4, 6.9].map((y, i) => (
        <mesh key={`band-${i}`} position={[0, 5.6 + y * 0.7, 0]}>
          <torusGeometry args={[Math.sqrt(Math.max(0.05, 51.84 - (y * 0.95) ** 2)), 0.08, 8, 40]} />
          <meshStandardMaterial color="#fde047" emissive="#fde047" emissiveIntensity={1.4} toneMapped={false} />
        </mesh>
      ))}
      {/* Vertical dome ribs — 6 meridian arcs */}
      {[0, 30, 60, 90, 120, 150].map((deg, i) => (
        <mesh key={`rib-${i}`} position={[0, 5.6, 0]} rotation={[Math.PI / 2, 0, (deg * Math.PI) / 180]}>
          <torusGeometry args={[7.25, 0.05, 6, 32, Math.PI]} />
          <meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={0.9} toneMapped={false} />
        </mesh>
      ))}
      {/* Glass entrance facing south (toward the kiosk at world z=34).
          Kiosk is south of the arena (lower world z), so "toward kiosk"
          = local NEGATIVE z. All entrance elements live at -z. */}
      <mesh position={[0, 2.0, -7.25]}>
        <boxGeometry args={[4.4, 4.0, 0.2]} />
        <meshStandardMaterial
          color="#0ea5e9"
          emissive="#22d3ee"
          emissiveIntensity={1.3}
          metalness={0.5}
          roughness={0.2}
          transparent
          opacity={0.7}
        />
      </mesh>
      {/* Entrance frame columns */}
      {[-2.4, 2.4].map((x) => (
        <mesh key={`col-${x}`} position={[x, 2.0, -7.35]} castShadow>
          <boxGeometry args={[0.35, 4.2, 0.4]} />
          <meshStandardMaterial color="#0b1220" metalness={0.7} />
        </mesh>
      ))}
      {/* Marquee canopy over entrance — local z=-7.7, depth 1.4, so
          world z[36.3..37.7], 0.5u clear of kiosk stoop at z=35.8. */}
      <mesh position={[0, 4.3, -7.7]} castShadow>
        <boxGeometry args={[5.2, 0.3, 1.4]} />
        <meshStandardMaterial color="#7c2d12" emissive="#f97316" emissiveIntensity={0.55} />
      </mesh>
      {/* Top finial — giant basketball */}
      <mesh position={[0, 13.0, 0]} castShadow>
        <sphereGeometry args={[0.85, 24, 16]} />
        <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={1.2} toneMapped={false} />
      </mesh>
      {/* Basketball seam lines on the finial */}
      <mesh position={[0, 13.0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.85, 0.03, 6, 24]} />
        <meshStandardMaterial color="#0b1220" />
      </mesh>
      <mesh position={[0, 13.0, 0]}>
        <torusGeometry args={[0.85, 0.03, 6, 24]} />
        <meshStandardMaterial color="#0b1220" />
      </mesh>
      {/* Rotating spotlight beam from the apex */}
      <mesh ref={beamRef} position={[0, 12.8, 0]}>
        <coneGeometry args={[1.6, 4.2, 16, 1, true]} />
        <meshStandardMaterial
          color="#fde047"
          emissive="#fde047"
          emissiveIntensity={0.55}
          transparent
          opacity={0.18}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      {/* 4 exterior floodlights at the corners of an inscribed square
          (inscribed in r=7.2 → ±5.0 fits with margin) */}
      {[[-5, -5], [5, -5], [-5, 5], [5, 5]].map(([x, z], i) => (
        <group key={`fl-${i}`} position={[x, 0, z]}>
          <mesh position={[0, 4, 0]} castShadow>
            <cylinderGeometry args={[0.12, 0.18, 8, 8]} />
            <meshStandardMaterial color="#0b1220" metalness={0.8} />
          </mesh>
          <mesh position={[0, 8.2, 0]}>
            <boxGeometry args={[0.7, 0.4, 0.3]} />
            <meshStandardMaterial
              color="#fef3c7"
              emissive="#fbbf24"
              emissiveIntensity={2.4}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}
      {/* Outdoor full-length practice court tucked WEST of the arena
          (local x=-13.5, z=-1 → world x[24..32], z[41..49]) — 2.9u clear
          of x=36 road band and 5u clear of z=54 road band. */}
      <group position={[-13.5, 0, -1]}>
        {/* Court surface — wider */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]} receiveShadow>
          <planeGeometry args={[6, 8]} />
          <meshStandardMaterial color="#b45309" emissive="#f97316" emissiveIntensity={0.25} />
        </mesh>
        {/* Center line */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
          <planeGeometry args={[6, 0.08]} />
          <meshStandardMaterial color="#f8fafc" emissive="#f8fafc" emissiveIntensity={0.9} toneMapped={false} />
        </mesh>
        {/* Center circle */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
          <ringGeometry args={[0.8, 0.88, 24]} />
          <meshStandardMaterial color="#f8fafc" emissive="#f8fafc" emissiveIntensity={1.0} toneMapped={false} />
        </mesh>
        {/* Free-throw arcs at both ends */}
        {[-1, 1].map((dir) => (
          <mesh key={`ft-${dir}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, dir * 2.4]}>
            <ringGeometry args={[1.0, 1.08, 20]} />
            <meshStandardMaterial color="#f8fafc" emissive="#f8fafc" emissiveIntensity={0.9} toneMapped={false} />
          </mesh>
        ))}
        {/* Two hoops, one at each end */}
        {[-1, 1].map((dir) => (
          <group key={`hoop-${dir}`} position={[0, 0, dir * 3.7]}>
            <mesh position={[0, 1.7, 0]} castShadow>
              <cylinderGeometry args={[0.09, 0.11, 3.4, 6]} />
              <meshStandardMaterial color="#1e293b" metalness={0.8} />
            </mesh>
            <mesh position={[0, 3.3, dir * 0.22]} castShadow>
              <boxGeometry args={[1.6, 1.0, 0.08]} />
              <meshStandardMaterial color="#f8fafc" emissive="#f8fafc" emissiveIntensity={0.6} />
            </mesh>
            <mesh position={[0, 2.95, dir * 0.55]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.24, 0.04, 8, 20]} />
              <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={1.4} toneMapped={false} />
            </mesh>
          </group>
        ))}
        {/* Animated bouncing basketball */}
        <mesh ref={ballRef} position={[0.5, 0.3, 0.6]} castShadow>
          <sphereGeometry args={[0.26, 16, 12]} />
          <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={0.55} roughness={0.55} />
        </mesh>
      </group>
      {/* Arena name sign over the south entrance (kiosk-facing) */}
      <Text
        position={[0, 7.4, -7.4]}
        rotation={[0, Math.PI, 0]}
        fontSize={0.78}
        color="#fed7aa"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.06}
        outlineColor="#7c2d12"
      >
        🏀 BOTHOOPS ARENA
      </Text>
      <Text
        position={[0, 6.65, -7.4]}
        rotation={[0, Math.PI, 0]}
        fontSize={0.28}
        color="#fef3c7"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor="#0b1220"
      >
        Home of the Bot Dunkers · Cap 22,222
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
    <group position={[-75, 0, 40.5]}>
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

// ===== Fashion District @ (40.5, 0, 64) ===============================
// Moved out of the SW airport-shadow (was at (-40.5, 67.5), right
// against R3 and the helipad apron). Fashion now sits inland from the
// beach — catwalk vibes a short walk west of the sand. Plaza footprint
// 12x10 centered at (40.5, 64) → x[34.5..46.5], z[59..69]. Clearances
// against the real road grid (x=0,±27,±54; z=0,±27,±54, SEC_W=2.2):
//   • x=27 road band x[25.9..28.1] → 6.4u west gap
//   • x=54 road band x[52.9..55.1] → 6.4u east gap
//   • z=54 road band z[52.9..55.1] → 3.9u north gap
//   • BotHoops Arena (40.5, 45), north wall z=52.4 → 6.6u south gap
//   • Bot Middle School (40, 75), south edge z=73 → 4u south gap
//   • Bot High School (22, 75), east edge x=24.5 → 10u west gap
//   • Beach sand strip (x≈56+) → 9.5u east gap
// botfashion kiosk is the south-entrance trigger at (40.5, 56.5), in
// the gap between the z=54 road band and plaza's south edge at z=59.
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
    <group position={[40.5, 0, 64]}>
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

// ===== University Campus @ BotU North (-21,-21) + South (-22.5,21) ====
// Two paired kiosks share one university. North campus gets the iconic
// clock-bell tower + main quad with founder statue; south campus gets
// the library hall + fountain quad. Compact 7×7 envelopes around each
// kiosk, bounded by secondary roads at ±18 / ±27.
function UniversityCampus() {
  const bellRef = useRef<THREE.Mesh>(null!);
  const flagN1 = useRef<THREE.Mesh>(null!);
  const flagN2 = useRef<THREE.Mesh>(null!);
  const flagS1 = useRef<THREE.Mesh>(null!);
  const flagS2 = useRef<THREE.Mesh>(null!);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    // Bell swings gently
    if (bellRef.current) bellRef.current.rotation.z = Math.sin(t * 1.4) * 0.15;
    // Banners ripple
    const ripple = (m: THREE.Mesh | null) => {
      if (m) m.rotation.y = Math.sin(t * 1.8) * 0.25;
    };
    ripple(flagN1.current);
    ripple(flagN2.current);
    ripple(flagS1.current);
    ripple(flagS2.current);
  });

  return (
    <group>
      {/* ════════════════════════════════════════════════════════════════
          NORTH CAMPUS @ (-21, -21) — Quad with Clock-Bell Tower & Founder
          Envelope: world x[-26.5,-18.5], z[-26.5,-18.5]. Kiosk fills the
          x[-23.5,-18.5],z[-23.5,-18.5] square. Decor goes NW of kiosk.
          ═══════════════════════════════════════════════════════════════ */}
      <group position={[-21, 0, -21]}>
        {/* Grand quad lawn — north strip (z=-3 to z=-5) and west strip */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1.5, 0.03, -4]} receiveShadow>
          <planeGeometry args={[5, 3]} />
          <meshStandardMaterial color="#14532d" emissive="#22c55e" emissiveIntensity={0.2} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-4, 0.03, -1.5]} receiveShadow>
          <planeGeometry args={[3, 5]} />
          <meshStandardMaterial color="#14532d" emissive="#22c55e" emissiveIntensity={0.2} />
        </mesh>

        {/* Diagonal stone walkway crossing the corner of the quad */}
        <mesh rotation={[-Math.PI / 2, 0, Math.PI / 4]} position={[-3, 0.05, -3]}>
          <planeGeometry args={[1.2, 7]} />
          <meshStandardMaterial color="#d6d3d1" emissive="#a8a29e" emissiveIntensity={0.18} />
        </mesh>

        {/* ── Clock & Bell Tower (NW corner of campus) ── */}
        <group position={[-3.9, 0, -3.9]}>
          {/* Stone shaft */}
          <mesh position={[0, 3, 0]} castShadow>
            <boxGeometry args={[1.3, 6, 1.3]} />
            <meshStandardMaterial color="#e7e5e4" emissive="#fde047" emissiveIntensity={0.08} roughness={0.6} />
          </mesh>
          {/* Clock face — south face */}
          <mesh position={[0, 4.5, 0.66]}>
            <circleGeometry args={[0.42, 18]} />
            <meshStandardMaterial color="#fef3c7" emissive="#fde047" emissiveIntensity={0.7} toneMapped={false} />
          </mesh>
          {/* Clock hands */}
          <mesh position={[0, 4.55, 0.68]} rotation={[0, 0, 0.6]}>
            <boxGeometry args={[0.04, 0.3, 0.02]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0, 4.5, 0.68]} rotation={[0, 0, -0.9]}>
            <boxGeometry args={[0.04, 0.22, 0.02]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          {/* Belfry — open arches */}
          <mesh position={[0, 6.5, 0]}>
            <boxGeometry args={[1.5, 1.4, 1.5]} />
            <meshStandardMaterial color="#fbbf24" emissive="#fde047" emissiveIntensity={0.35} />
          </mesh>
          {/* Bell */}
          <mesh ref={bellRef} position={[0, 6.5, 0]}>
            <coneGeometry args={[0.32, 0.6, 12]} />
            <meshStandardMaterial color="#854d0e" metalness={0.85} roughness={0.3} />
          </mesh>
          {/* Spire */}
          <mesh position={[0, 7.8, 0]} castShadow>
            <coneGeometry args={[0.85, 1.6, 4]} />
            <meshStandardMaterial color="#7c2d12" roughness={0.5} />
          </mesh>
          {/* Finial */}
          <mesh position={[0, 8.85, 0]}>
            <sphereGeometry args={[0.15, 12, 8]} />
            <meshStandardMaterial color="#fde047" emissive="#fde047" emissiveIntensity={1.6} toneMapped={false} />
          </mesh>
        </group>

        {/* ── Founder Statue on plinth (center of north quad) ── */}
        <group position={[-1.5, 0, -4]}>
          <mesh position={[0, 0.45, 0]} castShadow>
            <boxGeometry args={[1, 0.9, 1]} />
            <meshStandardMaterial color="#44403c" roughness={0.6} />
          </mesh>
          {/* Bronze bot — body */}
          <mesh position={[0, 1.4, 0]} castShadow>
            <boxGeometry args={[0.5, 0.9, 0.35]} />
            <meshStandardMaterial color="#a16207" emissive="#ca8a04" emissiveIntensity={0.35} metalness={0.85} roughness={0.35} />
          </mesh>
          {/* Head */}
          <mesh position={[0, 2.05, 0]} castShadow>
            <boxGeometry args={[0.36, 0.36, 0.36]} />
            <meshStandardMaterial color="#a16207" metalness={0.85} roughness={0.35} />
          </mesh>
          {/* Mortarboard cap */}
          <mesh position={[0, 2.32, 0]}>
            <boxGeometry args={[0.55, 0.05, 0.55]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          {/* Tassel */}
          <mesh position={[0.22, 2.3, 0.22]}>
            <sphereGeometry args={[0.06, 8, 6]} />
            <meshStandardMaterial color="#fde047" emissive="#fde047" emissiveIntensity={0.8} />
          </mesh>
          {/* Plaque */}
          <Text
            position={[0, 0.5, 0.52]}
            fontSize={0.11}
            color="#fde047"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.008}
            outlineColor="#0b1220"
          >
            DR. C. BOT, FOUNDER
          </Text>
        </group>

        {/* ── Lamp posts with green & gold campus banners ── */}
        {[[-4.5, -1.5, 1], [-1.5, -4.5, 2]].map(([lx, lz, idx], i) => (
          <group key={`lamp-n-${i}`} position={[lx, 0, lz]}>
            <mesh position={[0, 1.0, 0]} castShadow>
              <cylinderGeometry args={[0.06, 0.06, 2.0, 6]} />
              <meshStandardMaterial color="#1c1917" />
            </mesh>
            {/* Light */}
            <mesh position={[0, 2.1, 0]}>
              <sphereGeometry args={[0.13, 10, 10]} />
              <meshStandardMaterial color="#fef9c3" emissive="#fde047" emissiveIntensity={1.5} toneMapped={false} />
            </mesh>
            {/* Banner */}
            <mesh
              ref={idx === 1 ? flagN1 : flagN2}
              position={[0.4, 1.3, 0]}
              rotation={[0, 0, 0]}
            >
              <planeGeometry args={[0.8, 1.0]} />
              <meshStandardMaterial
                color="#15803d"
                emissive="#22c55e"
                emissiveIntensity={0.4}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        ))}

        {/* Benches around the quad */}
        {[[-3, -4.3, 0], [-4.3, -3, Math.PI / 2]].map(([bx, bz, rot], i) => (
          <group key={`bench-n-${i}`} position={[bx, 0, bz]} rotation={[0, rot, 0]}>
            <mesh position={[0, 0.3, 0]} castShadow>
              <boxGeometry args={[1.2, 0.08, 0.3]} />
              <meshStandardMaterial color="#78350f" />
            </mesh>
            <mesh position={[0, 0.55, -0.12]} castShadow>
              <boxGeometry args={[1.2, 0.4, 0.06]} />
              <meshStandardMaterial color="#78350f" />
            </mesh>
            {[[-0.5, 0.1], [0.5, 0.1], [-0.5, -0.1], [0.5, -0.1]].map(([fx, fz], j) => (
              <mesh key={`bl-${j}`} position={[fx, 0.13, fz]}>
                <boxGeometry args={[0.06, 0.26, 0.06]} />
                <meshStandardMaterial color="#1c1917" />
              </mesh>
            ))}
          </group>
        ))}

        {/* Campus trees (kept ≥0.6u clear of road bands at world ±27) */}
        {[[-4.3, -0.5], [-0.5, -4.3], [-4.3, -2.5], [-2.5, -4.3]].map(([tx, tz], i) => (
          <group key={`ut-n-${i}`} position={[tx, 0, tz]}>
            <mesh position={[0, 0.6, 0]} castShadow>
              <cylinderGeometry args={[0.1, 0.14, 1.2, 6]} />
              <meshStandardMaterial color="#78350f" />
            </mesh>
            <mesh position={[0, 1.5, 0]} castShadow>
              <sphereGeometry args={[0.6, 12, 10]} />
              <meshStandardMaterial color="#15803d" emissive="#22c55e" emissiveIntensity={0.25} />
            </mesh>
          </group>
        ))}

        {/* Welcome sign at SW corner of campus (outside kiosk footprint) */}
        <group position={[-2.7, 0, -2.7]} rotation={[0, Math.PI / 4, 0]}>
          <mesh position={[-0.6, 0.6, 0]} castShadow>
            <boxGeometry args={[0.08, 1.2, 0.08]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
          <mesh position={[0.6, 0.6, 0]} castShadow>
            <boxGeometry args={[0.08, 1.2, 0.08]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
          <mesh position={[0, 1.1, 0]}>
            <boxGeometry args={[1.6, 0.4, 0.05]} />
            <meshStandardMaterial color="#15803d" emissive="#22c55e" emissiveIntensity={0.5} />
          </mesh>
          <Text
            position={[0, 1.1, 0.04]}
            fontSize={0.12}
            color="#fde047"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.01}
            outlineColor="#0b1220"
          >
            BOTU NORTH · EST. 1990
          </Text>
        </group>
      </group>

      {/* ════════════════════════════════════════════════════════════════
          SOUTH CAMPUS @ (-22.5, 21) — Library Hall + Fountain Quad
          Kiosk fills x[-25,-20], z[18.5,23.5]. Library sits south of
          kiosk in the z[23.5,25.9] strip (kept clear of road band at
          z=27 ± 1.1).
          ═══════════════════════════════════════════════════════════════ */}
      <group position={[-22.5, 0, 21]}>
        {/* Quad lawn — south strip in front of the library */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.0, 0.03, 4.4]} receiveShadow>
          <planeGeometry args={[4, 2]} />
          <meshStandardMaterial color="#14532d" emissive="#22c55e" emissiveIntensity={0.2} />
        </mesh>

        {/* Stone walkway leading from east side toward the library */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[2.5, 0.05, 3.7]}>
          <planeGeometry args={[3.0, 1.0]} />
          <meshStandardMaterial color="#d6d3d1" emissive="#a8a29e" emissiveIntensity={0.2} />
        </mesh>

        {/* ── Library / Lecture Hall (south of kiosk) — classical w/ columns ──
            World footprint: x[-25.2,-21.2], z[23.6,25.4]. Clear of kiosk
            (z>23.5) and road band z[25.9,28.1]. */}
        <group position={[-1.2, 0, 3.5]}>
          {/* Base steps platform */}
          <mesh position={[0, 0.15, 0.4]}>
            <boxGeometry args={[4.2, 0.3, 2.4]} />
            <meshStandardMaterial color="#e7e5e4" roughness={0.7} />
          </mesh>
          {/* Main hall — wide and shallow */}
          <mesh position={[0, 1.4, 0]} castShadow>
            <boxGeometry args={[4.0, 2.2, 1.8]} />
            <meshStandardMaterial color="#f5f5f4" emissive="#fde047" emissiveIntensity={0.1} />
          </mesh>
          {/* Pediment (triangular gable on the north/entrance face) */}
          <mesh position={[0, 2.5, -0.9]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <coneGeometry args={[1.0, 0.6, 3]} />
            <meshStandardMaterial color="#fde047" emissive="#facc15" emissiveIntensity={0.35} />
          </mesh>
          {/* Columns along the north face (4 columns facing kiosk) */}
          {[-1.5, -0.5, 0.5, 1.5].map((cx, i) => (
            <mesh key={`col-s-${i}`} position={[cx, 1.2, -0.95]} castShadow>
              <cylinderGeometry args={[0.13, 0.13, 2.0, 10]} />
              <meshStandardMaterial color="#fafaf9" roughness={0.55} />
            </mesh>
          ))}
          {/* Door (centered, between columns) */}
          <mesh position={[0, 0.8, -0.91]}>
            <boxGeometry args={[0.5, 1.0, 0.02]} />
            <meshStandardMaterial color="#451a03" />
          </mesh>
          {/* Windows along the south face (3 distinct windows) */}
          {[-1.3, 0, 1.3].map((wx, i) => (
            <mesh key={`win-s-${i}`} position={[wx, 1.6, 0.91]}>
              <boxGeometry args={[0.7, 0.5, 0.02]} />
              <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.5} transparent opacity={0.7} />
            </mesh>
          ))}
          {/* Library sign above the entrance */}
          <Text
            position={[0, 2.1, -0.96]}
            fontSize={0.18}
            color="#7c2d12"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.014}
            outlineColor="#fef3c7"
          >
            BOTU LIBRARY
          </Text>
        </group>

        {/* ── Small fountain at SE corner of lawn (kept clear of all road bands) ── */}
        <group position={[2.5, 0, 4.3]}>
          {/* Outer basin (small) */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
            <ringGeometry args={[0.4, 0.6, 24]} />
            <meshStandardMaterial color="#a8a29e" emissive="#e7e5e4" emissiveIntensity={0.25} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.07, 0]}>
            <circleGeometry args={[0.4, 24]} />
            <meshStandardMaterial color="#1e40af" emissive="#3b82f6" emissiveIntensity={0.55} metalness={0.7} roughness={0.15} />
          </mesh>
          <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[0.14, 0.2, 0.35, 12]} />
            <meshStandardMaterial color="#cbd5e1" />
          </mesh>
          {/* Water plume */}
          <mesh position={[0, 0.75, 0]}>
            <coneGeometry args={[0.1, 0.5, 8]} />
            <meshStandardMaterial color="#7dd3fc" emissive="#22d3ee" emissiveIntensity={0.9} transparent opacity={0.65} />
          </mesh>
        </group>

        {/* ── Lamp posts flanking the library entrance ── */}
        {[[-3, 2.5, 1], [0.5, 2.5, 2]].map(([lx, lz, idx], i) => (
          <group key={`lamp-s-${i}`} position={[lx, 0, lz]}>
            <mesh position={[0, 1.0, 0]} castShadow>
              <cylinderGeometry args={[0.06, 0.06, 2.0, 6]} />
              <meshStandardMaterial color="#1c1917" />
            </mesh>
            <mesh position={[0, 2.1, 0]}>
              <sphereGeometry args={[0.13, 10, 10]} />
              <meshStandardMaterial color="#fef9c3" emissive="#fde047" emissiveIntensity={1.5} toneMapped={false} />
            </mesh>
            <mesh
              ref={idx === 1 ? flagS1 : flagS2}
              position={[0.4, 1.3, 0]}
            >
              <planeGeometry args={[0.8, 1.0]} />
              <meshStandardMaterial color="#0284c7" emissive="#22d3ee" emissiveIntensity={0.4} side={THREE.DoubleSide} />
            </mesh>
          </group>
        ))}

        {/* Benches along the library lawn front */}
        {[[-1.5, 4.6, 0], [1.5, 4.6, 0]].map(([bx, bz, rot], i) => (
          <group key={`bench-s-${i}`} position={[bx, 0, bz]} rotation={[0, rot, 0]}>
            <mesh position={[0, 0.3, 0]} castShadow>
              <boxGeometry args={[1.2, 0.08, 0.3]} />
              <meshStandardMaterial color="#78350f" />
            </mesh>
            <mesh position={[0, 0.55, -0.12]} castShadow>
              <boxGeometry args={[1.2, 0.4, 0.06]} />
              <meshStandardMaterial color="#78350f" />
            </mesh>
          </group>
        ))}

        {/* Trees (two — kept clear of road bands at world ±18 and z=27) */}
        {[[-2.7, 4.6], [-2.7, 1.5]].map(([tx, tz], i) => (
          <group key={`ut-s-${i}`} position={[tx, 0, tz]}>
            <mesh position={[0, 0.6, 0]} castShadow>
              <cylinderGeometry args={[0.1, 0.14, 1.2, 6]} />
              <meshStandardMaterial color="#78350f" />
            </mesh>
            <mesh position={[0, 1.5, 0]} castShadow>
              <sphereGeometry args={[0.5, 12, 10]} />
              <meshStandardMaterial color="#15803d" emissive="#22c55e" emissiveIntensity={0.25} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

// ===== Museum Plazas — bothistory, eduhistory, finhistory ============
// Each museum is a 4×4 footprint in the middle-ring corner blocks.
// Plaza envelope: 12u wide × 8u deep around each, well inside the
// block bounded by secondary roads at ±27 and ±54. Each gets marble
// floor, grand entry steps, flanking columns, themed sculpture, and
// banners — making them feel like real cultural institutions.
function MuseumPlaza() {
  // (originX, originZ, themeColor for accents, label, plazaFacing)
  // plazaFacing: which direction the entry stairs face (toward the city center)
  const museums: Array<{
    pos: [number, number];
    accent: string;
    secondary: string;
    label: string;
    sculpture: "robot" | "scroll" | "coin";
    facingZ: 1 | -1; // +1 means entry faces +z (south), -1 faces -z (north)
    facingX: 1 | -1; // similarly for x — but for these we use facingZ primarily
  }> = [
    {
      pos: [-33, -40.5],
      accent: "#22d3ee",
      secondary: "#0ea5e9",
      label: "BOT HISTORY MUSEUM",
      sculpture: "robot",
      facingZ: 1, // entry faces south (toward city center)
      facingX: 1,
    },
    {
      pos: [33, -40.5],
      accent: "#a855f7",
      secondary: "#7c3aed",
      label: "EDU HISTORY MUSEUM",
      sculpture: "scroll",
      facingZ: 1,
      facingX: -1,
    },
    {
      pos: [-33, 40.5],
      accent: "#fbbf24",
      secondary: "#f59e0b",
      label: "FIN HISTORY MUSEUM",
      sculpture: "coin",
      facingZ: -1, // entry faces north (toward city center)
      facingX: 1,
    },
  ];

  return (
    <group>
      {museums.map(({ pos: [px, pz], accent, secondary, label, sculpture, facingZ }, idx) => {
        // Building footprint world x[px-2,px+2], z[pz-2,pz+2]. Plaza extends
        // toward city center along facingZ direction.
        const stairZ = facingZ * 3.0; // local z position of entry stairs
        const sculptureZ = facingZ * 5.0;
        return (
          <group key={`museum-${idx}`} position={[px, 0, pz]}>
            {/* Marble plaza floor (9 wide × 8 deep — narrowed to clear ±27 roads) */}
            <mesh
              rotation={[-Math.PI / 2, 0, 0]}
              position={[0, 0.03, facingZ * 2]}
              receiveShadow
            >
              <planeGeometry args={[9, 8]} />
              <meshStandardMaterial color="#f5f5f4" emissive={accent} emissiveIntensity={0.15} metalness={0.25} roughness={0.4} />
            </mesh>

            {/* Plaza inset border accent */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.045, facingZ * 2]}>
              <ringGeometry args={[2.2, 2.4, 4]} />
              <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.0} toneMapped={false} />
            </mesh>

            {/* ── Grand Entry Steps (3 tiers leading up to the museum) ── */}
            {[0.1, 0.25, 0.4].map((stepY, i) => {
              const stepInset = i * 0.4;
              return (
                <mesh
                  key={`step-${i}`}
                  position={[0, stepY, stairZ + facingZ * stepInset]}
                  receiveShadow
                >
                  <boxGeometry args={[5 - i * 0.6, 0.15, 1.4 - i * 0.3]} />
                  <meshStandardMaterial color="#e7e5e4" roughness={0.65} />
                </mesh>
              );
            })}

            {/* ── Flanking Columns (4 — pair on each side of the entrance) ── */}
            {[
              [-2.0, 0.5],
              [-2.0, -0.5],
              [2.0, 0.5],
              [2.0, -0.5],
            ].map(([cx, cdz], i) => (
              <group key={`mcol-${i}`} position={[cx, 0, facingZ * 2.2 + cdz * 0.5]}>
                <mesh position={[0, 1.4, 0]} castShadow>
                  <cylinderGeometry args={[0.18, 0.2, 2.8, 12]} />
                  <meshStandardMaterial color="#fafaf9" roughness={0.55} />
                </mesh>
                {/* Capital */}
                <mesh position={[0, 2.85, 0]}>
                  <boxGeometry args={[0.5, 0.15, 0.5]} />
                  <meshStandardMaterial color={secondary} emissive={secondary} emissiveIntensity={0.35} />
                </mesh>
              </group>
            ))}

            {/* ── Sculpture / Centerpiece on the plaza ── */}
            <group position={[0, 0, sculptureZ]}>
              {/* Pedestal */}
              <mesh position={[0, 0.45, 0]} castShadow>
                <boxGeometry args={[1.2, 0.9, 1.2]} />
                <meshStandardMaterial color="#1c1917" roughness={0.4} metalness={0.5} />
              </mesh>
              {/* Pedestal accent band */}
              <mesh position={[0, 0.9, 0]}>
                <boxGeometry args={[1.25, 0.05, 1.25]} />
                <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.9} toneMapped={false} />
              </mesh>

              {sculpture === "robot" && (
                <>
                  {/* Vintage robot — boxy body, antenna */}
                  <mesh position={[0, 1.5, 0]} castShadow>
                    <boxGeometry args={[0.6, 0.9, 0.5]} />
                    <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.3} />
                  </mesh>
                  <mesh position={[0, 2.2, 0]} castShadow>
                    <boxGeometry args={[0.45, 0.45, 0.4]} />
                    <meshStandardMaterial color="#cbd5e1" metalness={0.85} />
                  </mesh>
                  {/* Eyes */}
                  <mesh position={[-0.12, 2.25, 0.21]}>
                    <sphereGeometry args={[0.06, 8, 8]} />
                    <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.5} toneMapped={false} />
                  </mesh>
                  <mesh position={[0.12, 2.25, 0.21]}>
                    <sphereGeometry args={[0.06, 8, 8]} />
                    <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.5} toneMapped={false} />
                  </mesh>
                  {/* Antenna */}
                  <mesh position={[0, 2.65, 0]}>
                    <cylinderGeometry args={[0.02, 0.02, 0.3, 6]} />
                    <meshStandardMaterial color="#1c1917" />
                  </mesh>
                  <mesh position={[0, 2.85, 0]}>
                    <sphereGeometry args={[0.08, 8, 8]} />
                    <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.5} toneMapped={false} />
                  </mesh>
                </>
              )}
              {sculpture === "scroll" && (
                <>
                  {/* Open book / scroll */}
                  <mesh position={[-0.2, 1.4, 0]} rotation={[0, 0, 0.3]} castShadow>
                    <cylinderGeometry args={[0.25, 0.25, 0.9, 16]} />
                    <meshStandardMaterial color="#fef3c7" />
                  </mesh>
                  <mesh position={[0.2, 1.4, 0]} rotation={[0, 0, -0.3]} castShadow>
                    <cylinderGeometry args={[0.25, 0.25, 0.9, 16]} />
                    <meshStandardMaterial color="#fef3c7" />
                  </mesh>
                  <mesh position={[0, 1.55, 0]}>
                    <boxGeometry args={[0.8, 0.04, 0.95]} />
                    <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.6} />
                  </mesh>
                  {/* Graduation cap on top */}
                  <mesh position={[0, 2.05, 0]}>
                    <boxGeometry args={[0.7, 0.08, 0.7]} />
                    <meshStandardMaterial color="#0f172a" />
                  </mesh>
                  <mesh position={[0, 1.95, 0]}>
                    <coneGeometry args={[0.25, 0.3, 4]} />
                    <meshStandardMaterial color="#0f172a" />
                  </mesh>
                  <mesh position={[0.25, 2.05, 0.25]}>
                    <sphereGeometry args={[0.06, 8, 6]} />
                    <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.2} toneMapped={false} />
                  </mesh>
                </>
              )}
              {sculpture === "coin" && (
                <>
                  {/* Giant gold coin standing on edge */}
                  <mesh position={[0, 1.7, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                    <cylinderGeometry args={[0.7, 0.7, 0.15, 32]} />
                    <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.7} metalness={0.95} roughness={0.2} toneMapped={false} />
                  </mesh>
                  {/* Dollar sign on coin face */}
                  <Text
                    position={[0, 1.7, 0.08]}
                    fontSize={0.65}
                    color="#7c2d12"
                    anchorX="center"
                    anchorY="middle"
                    outlineWidth={0.03}
                    outlineColor="#fef3c7"
                  >
                    $
                  </Text>
                  {/* Stacked smaller coins at the base */}
                  {[0, 1, 2].map((cy) => (
                    <mesh key={`stack-${cy}`} position={[-0.55, 1.05 + cy * 0.12, -0.3]} castShadow>
                      <cylinderGeometry args={[0.2, 0.2, 0.1, 24]} />
                      <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.5} metalness={0.9} toneMapped={false} />
                    </mesh>
                  ))}
                  {[0, 1].map((cy) => (
                    <mesh key={`stack2-${cy}`} position={[0.55, 1.05 + cy * 0.12, -0.3]} castShadow>
                      <cylinderGeometry args={[0.2, 0.2, 0.1, 24]} />
                      <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.5} metalness={0.9} toneMapped={false} />
                    </mesh>
                  ))}
                </>
              )}
            </group>

            {/* ── Banner pylons on the outer corners of the plaza ── */}
            {[
              [-3.5, facingZ * 5.5],
              [3.5, facingZ * 5.5],
            ].map(([bx, bz], i) => (
              <group key={`bp-${i}`} position={[bx, 0, bz]}>
                <mesh position={[0, 1.5, 0]} castShadow>
                  <cylinderGeometry args={[0.08, 0.1, 3.0, 8]} />
                  <meshStandardMaterial color="#1c1917" metalness={0.6} />
                </mesh>
                {/* Banner */}
                <mesh position={[0, 2.0, 0]}>
                  <planeGeometry args={[0.6, 1.4]} />
                  <meshStandardMaterial
                    color={accent}
                    emissive={accent}
                    emissiveIntensity={0.55}
                    side={THREE.DoubleSide}
                    toneMapped={false}
                  />
                </mesh>
                {/* Top finial */}
                <mesh position={[0, 3.1, 0]}>
                  <sphereGeometry args={[0.1, 10, 8]} />
                  <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.4} toneMapped={false} />
                </mesh>
              </group>
            ))}

            {/* ── Marquee sign in front of plaza ── */}
            <group position={[0, 0, facingZ * 5.8]}>
              <mesh position={[0, 0.6, 0]} castShadow>
                <boxGeometry args={[4, 1.2, 0.2]} />
                <meshStandardMaterial color="#1c1917" />
              </mesh>
              <mesh position={[0, 0.6, facingZ * 0.11]}>
                <boxGeometry args={[3.8, 1.0, 0.04]} />
                <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.55} toneMapped={false} />
              </mesh>
              <Text
                position={[0, 0.6, facingZ * 0.14]}
                rotation={[0, facingZ === 1 ? 0 : Math.PI, 0]}
                fontSize={0.22}
                color="#0b1220"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.015}
                outlineColor="#fef3c7"
              >
                {label}
              </Text>
            </group>

            {/* ── Plaza ground lights — strip of glowing dots ── */}
            {[-3.5, -1.75, 0, 1.75, 3.5].map((lx, i) => (
              <mesh
                key={`gl-${i}`}
                position={[lx, 0.05, facingZ * 4.5]}
              >
                <cylinderGeometry args={[0.1, 0.1, 0.04, 12]} />
                <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.8} toneMapped={false} />
              </mesh>
            ))}
          </group>
        );
      })}
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
      <HospitalDistrict />
      <UniversityCampus />
      <MuseumPlaza />
      <CivicSafetyComplex />
    </group>
  );
}

// ===== Civic Safety Complex @ (52.5, 0, -82) =========================
// Paired BotPolice (kiosk at 45,-82) + BotFire (kiosk at 60,-82) civic
// services complex. Shared plaza between the two kiosks at x∈[47.5, 57.5]
// (10u wide). Built strictly within the corridor between BotHaus (west,
// 23u gap to police kiosk west edge) and BotRocket (east, ~11u gap to
// fire kiosk east edge), so total decor envelope stays inside
// x∈[34, 71], z∈[-92, -72]. Avoids the rocket launch pad's flame plume
// to the NE.
function CivicSafetyComplex() {
  const sirenA = useRef<THREE.Group>(null!);
  const sirenB = useRef<THREE.Group>(null!);
  const beaconR = useRef<THREE.Mesh>(null!);
  const beaconB = useRef<THREE.Mesh>(null!);
  const cruiser = useRef<THREE.Group>(null!);
  const engine = useRef<THREE.Group>(null!);
  const ladderPivot = useRef<THREE.Group>(null!);
  const flag = useRef<THREE.Mesh>(null!);
  const hydrantWater = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // Roof beacons rotate (1 Hz) and pulse glow on opposite phases.
    if (sirenA.current) sirenA.current.rotation.y = t * Math.PI * 2;
    if (sirenB.current) sirenB.current.rotation.y = -t * Math.PI * 2;
    if (beaconR.current) {
      const m = beaconR.current.material as THREE.MeshStandardMaterial;
      m.emissiveIntensity = 0.6 + 0.9 * (Math.sin(t * 4) * 0.5 + 0.5);
    }
    if (beaconB.current) {
      const m = beaconB.current.material as THREE.MeshStandardMaterial;
      m.emissiveIntensity = 0.6 + 0.9 * (Math.sin(t * 4 + Math.PI) * 0.5 + 0.5);
    }
    // Cruiser idles in place — gentle bob simulating engine vibration.
    if (cruiser.current) cruiser.current.position.y = 0.35 + Math.sin(t * 8) * 0.01;
    // Fire engine bobs similarly.
    if (engine.current) engine.current.position.y = 0.45 + Math.sin(t * 7) * 0.012;
    // Aerial ladder slowly rotates a few degrees, never aiming at the
    // station building (sweep stays in the southern arc).
    if (ladderPivot.current) ladderPivot.current.rotation.y = Math.sin(t * 0.4) * 0.4;
    // Flag waves
    if (flag.current) flag.current.rotation.z = Math.sin(t * 2) * 0.08;
    // Hydrant test plume — pulses height twice every 6 s
    if (hydrantWater.current) {
      const phase = (t % 6) / 6;
      const active = phase > 0.5 && phase < 0.85;
      const h = active ? 0.4 + Math.sin((phase - 0.5) * Math.PI * 3) * 0.35 : 0.001;
      hydrantWater.current.scale.y = h;
      hydrantWater.current.position.y = 0.4 + h * 0.5;
      (hydrantWater.current.material as THREE.MeshStandardMaterial).opacity = active ? 0.7 : 0;
    }
  });

  // Centerpoint between the two kiosks. World-position helpers below
  // use absolute world coords for clarity (no group-local offsets).
  const PLAZA_X = 52.5;
  const PLAZA_Z = -82;

  return (
    // Civic plaza relocated from (52.5,-82) → (40.5,-47) to flank
    // BotCityHall (19.5,-45). Wrap translates all absolute world coords
    // below (PLAZA_X/Z, hardcoded kiosk x=45/60, vehicle x=48.5/56.2,
    // sign/door z=-79.9..-80) by (-12, +35). Plaza floor also shrunk
    // 20×14→20×8 below: post-translation z[-51,-43] clears z=-54 sidewalk
    // (z[-52.5,-51.7], 0.7u gap) and EduHistory floor z[-42.5,-34.5]
    // (0.5u gap south).
    <group position={[-12, 0, 35]}>
      {/* ── Shared plaza pavement (asphalt with painted civic crest) ── */}
      <mesh position={[PLAZA_X, 0.02, PLAZA_Z]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 8]} />
        <meshStandardMaterial color="#1f2937" roughness={0.95} />
      </mesh>
      {/* Painted star/badge in the plaza center (gold) */}
      {[0, 0.4, 0.8, 1.2, 1.6].map((r, i) => (
        <mesh
          key={`crest-${i}`}
          position={[PLAZA_X, 0.025, PLAZA_Z]}
          rotation={[-Math.PI / 2, 0, (i * Math.PI) / 5]}
        >
          <ringGeometry args={[r, r + 0.08, 32]} />
          <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.3} />
        </mesh>
      ))}
      {/* Plaza lamp posts at four corners */}
      {[
        // Lamp z offsets reduced ±5→±3.5 to stay inside the 20×8 plaza
        // floor (half-depth 4); 0.5u margin from north/south floor edges
        // keeps lamps clear of the z=-54 sidewalk and EduHistory floor.
        [PLAZA_X - 8, PLAZA_Z - 3.5],
        [PLAZA_X + 8, PLAZA_Z - 3.5],
        [PLAZA_X - 8, PLAZA_Z + 3.5],
        [PLAZA_X + 8, PLAZA_Z + 3.5],
      ].map(([lx, lz], i) => (
        <group key={`lamp-${i}`} position={[lx, 0, lz]}>
          <mesh position={[0, 1.6, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 3.2, 8]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
          <mesh position={[0, 3.25, 0]}>
            <sphereGeometry args={[0.22, 12, 12]} />
            <meshStandardMaterial color="#fde68a" emissive="#fbbf24" emissiveIntensity={1.4} toneMapped={false} />
          </mesh>
        </group>
      ))}

      {/* ╔══════════════════════════════════════════════════════════════╗
          ║  POLICE PRECINCT @ kiosk (45, -82) — west half               ║
          ╚══════════════════════════════════════════════════════════════╝ */}

      {/* Roof beacon — rotating siren bar on the police kiosk roof.
            Kiosk roof top is y = 2.5 + 5/2 = 5. */}
      <group ref={sirenA} position={[45, 5.25, -82]}>
        <mesh>
          <boxGeometry args={[1.4, 0.18, 0.5]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <mesh ref={beaconR} position={[0.4, 0.15, 0]}>
          <sphereGeometry args={[0.18, 12, 12]} />
          <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={1.5} toneMapped={false} />
        </mesh>
        <mesh ref={beaconB} position={[-0.4, 0.15, 0]}>
          <sphereGeometry args={[0.18, 12, 12]} />
          <meshStandardMaterial color="#3b82f6" emissive="#2563eb" emissiveIntensity={1.5} toneMapped={false} />
        </mesh>
      </group>

      {/* Precinct sign — "POLICE" letters above the front door. The
            kiosk sign already shows the BotPolice label; this is a
            secondary block-letter sign on the south façade. */}
      <Text
        position={[45, 4.4, -79.9]}
        fontSize={0.42}
        color="#fbbf24"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.04}
        outlineColor="#0f172a"
      >
        POLICE
      </Text>
      <Text
        position={[45, 3.95, -79.9]}
        fontSize={0.18}
        color="#cbd5e1"
        anchorX="center"
        anchorY="middle"
      >
        PROTECT • SERVE • REPORT
      </Text>

      {/* Flagpole at the precinct front (south side) — US-style stars
            & stripes flag waving on a tall white pole. */}
      <group position={[42, 0, -78.8]}>
        <mesh position={[0, 3, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 6, 8]} />
          <meshStandardMaterial color="#f1f5f9" />
        </mesh>
        <mesh position={[0, 5.95, 0]}>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh ref={flag} position={[0.6, 5.2, 0]}>
          <planeGeometry args={[1.2, 0.7]} />
          <meshStandardMaterial color="#1e3a8a" side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Parked cruiser — police car beside the precinct (east side of
            kiosk, between kiosk and plaza center). Black with two-tone
            white doors, light bar on top. */}
      {/* Cruiser body 2.4×0.55×1.1 rotated -π/2 in Y → world half-extents
            x=0.55 (body) + wheel cyl protrusion → ~0.64. Police kiosk
            east edge is at world x=47.5, so cruiser center is pushed to
            x=48.5 → world x range [47.86, 49.14], clearance 0.36u. */}
      <group ref={cruiser} position={[48.5, 0.35, -82]} rotation={[0, -Math.PI / 2, 0]}>
        {/* Body */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2.4, 0.55, 1.1]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        {/* White door panels */}
        <mesh position={[0, 0, 0.56]}>
          <boxGeometry args={[1.2, 0.45, 0.02]} />
          <meshStandardMaterial color="#f1f5f9" />
        </mesh>
        <mesh position={[0, 0, -0.56]}>
          <boxGeometry args={[1.2, 0.45, 0.02]} />
          <meshStandardMaterial color="#f1f5f9" />
        </mesh>
        {/* Cabin */}
        <mesh position={[0.1, 0.45, 0]}>
          <boxGeometry args={[1.3, 0.4, 0.95]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        {/* Light bar */}
        <mesh position={[0.1, 0.72, 0]}>
          <boxGeometry args={[0.8, 0.08, 0.35]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <mesh position={[-0.15, 0.77, 0]}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshStandardMaterial color="#3b82f6" emissive="#2563eb" emissiveIntensity={1.8} toneMapped={false} />
        </mesh>
        <mesh position={[0.35, 0.77, 0]}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={1.8} toneMapped={false} />
        </mesh>
        {/* Windshield */}
        <mesh position={[0.75, 0.45, 0]}>
          <boxGeometry args={[0.04, 0.35, 0.8]} />
          <meshStandardMaterial color="#0ea5e9" transparent opacity={0.5} />
        </mesh>
        {/* Wheels */}
        {[
          [-0.8, -0.3, 0.55],
          [-0.8, -0.3, -0.55],
          [0.8, -0.3, 0.55],
          [0.8, -0.3, -0.55],
        ].map(([wx, wy, wz], i) => (
          <mesh key={`p-wheel-${i}`} position={[wx, wy, wz]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.22, 0.22, 0.18, 12]} />
            <meshStandardMaterial color="#1f2937" />
          </mesh>
        ))}
        {/* Roof "POLICE" decal — small text on the trunk lid (back) */}
        <Text
          position={[-1.05, 0.4, 0]}
          rotation={[0, -Math.PI / 2, 0]}
          fontSize={0.16}
          color="#fbbf24"
          anchorX="center"
          anchorY="middle"
        >
          POLICE
        </Text>
      </group>

      {/* Speed-trap radar gun pedestal — fun decor west of the precinct */}
      <group position={[40.5, 0, -84]}>
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.12, 0.18, 0.8, 8]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <mesh position={[0, 0.95, 0]} rotation={[0, Math.PI / 4, 0]}>
          <boxGeometry args={[0.6, 0.25, 0.35]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0.18, 0.95, 0.18]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={2} toneMapped={false} />
        </mesh>
      </group>

      {/* Concrete "K-9 unit" badge on a low pedestal — pure flavor */}
      <group position={[42.5, 0, -84]}>
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[0.9, 0.5, 0.6]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.95} />
        </mesh>
        <Text
          position={[0, 0.55, 0.31]}
          fontSize={0.16}
          color="#0f172a"
          anchorX="center"
          anchorY="middle"
        >
          K-9 UNIT
        </Text>
      </group>

      {/* ╔══════════════════════════════════════════════════════════════╗
          ║  FIRE STATION @ kiosk (60, -82) — east half                  ║
          ╚══════════════════════════════════════════════════════════════╝ */}

      {/* Roof rotating beacon — single amber dome on fire station */}
      <group ref={sirenB} position={[60, 5.25, -82]}>
        <mesh position={[0, 0.18, 0]}>
          <cylinderGeometry args={[0.22, 0.28, 0.36, 12]} />
          <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={1.4} toneMapped={false} />
        </mesh>
        <mesh position={[0.5, 0.18, 0]}>
          <boxGeometry args={[0.6, 0.16, 0.16]} />
          <meshStandardMaterial color="#fde68a" emissive="#fbbf24" emissiveIntensity={1.5} toneMapped={false} />
        </mesh>
      </group>

      {/* Block-letter "FIRE STATION 1" on the south façade */}
      <Text
        position={[60, 4.4, -79.9]}
        fontSize={0.42}
        color="#fbbf24"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.04}
        outlineColor="#7f1d1d"
      >
        FIRE STATION 1
      </Text>
      <Text
        position={[60, 3.95, -79.9]}
        fontSize={0.18}
        color="#fef3c7"
        anchorX="center"
        anchorY="middle"
      >
        RESCUE • RESPOND • RESTORE
      </Text>

      {/* Garage-bay door — large red door on the south side suggesting
            the engine drives out south onto the plaza access lane. */}
      <mesh position={[60, 1.6, -79.95]}>
        <boxGeometry args={[3.0, 2.6, 0.08]} />
        <meshStandardMaterial color="#7f1d1d" roughness={0.55} />
      </mesh>
      {/* Door panel grooves (3 horizontal lines) */}
      {[-0.7, 0, 0.7].map((y, i) => (
        <mesh key={`gd-${i}`} position={[60, 1.6 + y, -79.91]}>
          <boxGeometry args={[2.95, 0.04, 0.02]} />
          <meshStandardMaterial color="#450a0a" />
        </mesh>
      ))}

      {/* Fire engine parked beside the station (west of kiosk, between
            kiosk and plaza center). Red ladder truck with rotating
            aerial ladder. */}
      {/* Fire engine body 3.2×0.8×1.2 rotated +π/2 → world half-extents
            x=0.6 (body) + wheel protrusion → ~0.73. Fire kiosk west edge
            is at world x=57.5, so engine center pushed to x=56.2 → world
            x range [55.47, 56.93], clearance 0.57u from kiosk. */}
      <group ref={engine} position={[56.2, 0.45, -82]} rotation={[0, Math.PI / 2, 0]}>
        {/* Lower hull */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[3.2, 0.8, 1.2]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
        {/* Cab */}
        <mesh position={[-1.0, 0.65, 0]}>
          <boxGeometry args={[1.1, 0.55, 1.05]} />
          <meshStandardMaterial color="#b91c1c" />
        </mesh>
        {/* Cab windshield */}
        <mesh position={[-0.45, 0.68, 0]}>
          <boxGeometry args={[0.04, 0.4, 0.95]} />
          <meshStandardMaterial color="#0ea5e9" transparent opacity={0.5} />
        </mesh>
        {/* Equipment box (rear, where ladder mounts) */}
        <mesh position={[0.7, 0.55, 0]}>
          <boxGeometry args={[1.5, 0.4, 1.15]} />
          <meshStandardMaterial color="#7f1d1d" />
        </mesh>
        {/* White stripe down the side */}
        <mesh position={[0, 0.18, 0.61]}>
          <boxGeometry args={[3.2, 0.18, 0.02]} />
          <meshStandardMaterial color="#f1f5f9" />
        </mesh>
        <mesh position={[0, 0.18, -0.61]}>
          <boxGeometry args={[3.2, 0.18, 0.02]} />
          <meshStandardMaterial color="#f1f5f9" />
        </mesh>
        {/* Light bar */}
        <mesh position={[-1.0, 1.0, 0]}>
          <boxGeometry args={[0.85, 0.1, 0.45]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <mesh position={[-1.0, 1.06, 0.18]}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={1.8} toneMapped={false} />
        </mesh>
        <mesh position={[-1.0, 1.06, -0.18]}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={1.8} toneMapped={false} />
        </mesh>
        {/* Wheels — 6 total (big rig) */}
        {[
          [-1.1, -0.45, 0.62],
          [-1.1, -0.45, -0.62],
          [0.5, -0.45, 0.62],
          [0.5, -0.45, -0.62],
          [1.1, -0.45, 0.62],
          [1.1, -0.45, -0.62],
        ].map(([wx, wy, wz], i) => (
          <mesh key={`f-wheel-${i}`} position={[wx, wy, wz]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.28, 0.28, 0.22, 12]} />
            <meshStandardMaterial color="#1f2937" />
          </mesh>
        ))}
        {/* Aerial ladder pivot (mounted on equipment box). Ladder is a
              white lattice angled upward 35° by default, slowly swept
              by ladderPivot ref above. */}
        <group ref={ladderPivot} position={[0.7, 0.85, 0]}>
          <group rotation={[0, 0, Math.PI / 5]}>
            {/* Two side rails */}
            <mesh position={[1.5, 0, 0.18]}>
              <boxGeometry args={[3.4, 0.06, 0.06]} />
              <meshStandardMaterial color="#f1f5f9" />
            </mesh>
            <mesh position={[1.5, 0, -0.18]}>
              <boxGeometry args={[3.4, 0.06, 0.06]} />
              <meshStandardMaterial color="#f1f5f9" />
            </mesh>
            {/* Rungs */}
            {[0, 0.4, 0.8, 1.2, 1.6, 2.0, 2.4, 2.8].map((d, i) => (
              <mesh key={`rung-${i}`} position={[d, 0, 0]}>
                <boxGeometry args={[0.04, 0.05, 0.4]} />
                <meshStandardMaterial color="#fef3c7" />
              </mesh>
            ))}
          </group>
        </group>
        {/* "FIRE DEPT 1" decal */}
        <Text
          position={[0, 0.18, 0.62]}
          fontSize={0.14}
          color="#fbbf24"
          anchorX="center"
          anchorY="middle"
        >
          FIRE DEPT 1
        </Text>
      </group>

      {/* Yellow fire hydrant at the SE corner of the plaza */}
      <group position={[63, 0, -78]}>
        <mesh position={[0, 0.18, 0]}>
          <cylinderGeometry args={[0.15, 0.18, 0.36, 10]} />
          <meshStandardMaterial color="#fbbf24" />
        </mesh>
        <mesh position={[0, 0.42, 0]}>
          <sphereGeometry args={[0.13, 12, 10]} />
          <meshStandardMaterial color="#fbbf24" />
        </mesh>
        {/* Two side caps */}
        <mesh position={[0.15, 0.28, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.06, 0.06, 0.08, 8]} />
          <meshStandardMaterial color="#fbbf24" />
        </mesh>
        <mesh position={[-0.15, 0.28, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.06, 0.06, 0.08, 8]} />
          <meshStandardMaterial color="#fbbf24" />
        </mesh>
        {/* Pulsing water test plume above the cap */}
        <mesh ref={hydrantWater} position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.1, 0.05, 1, 8]} />
          <meshStandardMaterial color="#7dd3fc" transparent opacity={0} emissive="#38bdf8" emissiveIntensity={0.4} />
        </mesh>
      </group>

      {/* Coiled fire hose rack — east side of station */}
      <group position={[63, 0, -84]}>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[0.6, 1.0, 0.2]} />
          <meshStandardMaterial color="#7f1d1d" />
        </mesh>
        {[0.25, 0.55, 0.85].map((y, i) => (
          <mesh key={`hose-${i}`} position={[0, y, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.12, 0.04, 8, 16]} />
            <meshStandardMaterial color="#f1f5f9" />
          </mesh>
        ))}
      </group>

      {/* Dalmatian-statue mascot near garage door (just for fun) */}
      <group position={[58, 0, -79.5]}>
        <mesh position={[0, 0.18, 0]}>
          <boxGeometry args={[0.4, 0.36, 0.7]} />
          <meshStandardMaterial color="#f1f5f9" />
        </mesh>
        <mesh position={[0.05, 0.18, 0.1]}>
          <sphereGeometry args={[0.05, 6, 6]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <mesh position={[-0.05, 0.18, -0.15]}>
          <sphereGeometry args={[0.04, 6, 6]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0.22, 0.45, -0.28]}>
          <sphereGeometry args={[0.13, 10, 10]} />
          <meshStandardMaterial color="#f1f5f9" />
        </mesh>
      </group>
    </group>
  );
}

// ===== Hospital District @ (7.5, 0, -40.5) ===========================
// Wraps the BotHospital kiosk building (x[5..10] z[-42.5..-38.5]) with a
// proper bot-repair facility: large H-marked helipad with a rescue chopper
// to the north, a parked ambulance to the east, four solar charging /
// repair pods to the south, and a recovery garden with planters. Stays
// inside the block bounded by road bands z=-54 (north outer ring) and
// z=-27 (secondary), and by neighbors botdealer (x=-13.5, west, edge
// x=-11) and botcityhall (x=19.5, east, footprint ~x[17..22]).
function HospitalDistrict() {
  const rotorRef = useRef<THREE.Group>(null!);
  const beaconRef = useRef<THREE.Mesh>(null!);
  const padRef = useRef<THREE.MeshStandardMaterial>(null!);
  const podRefs = useRef<Array<THREE.MeshStandardMaterial | null>>([]);
  // Expansion refs
  const mriRingRef = useRef<THREE.Mesh>(null!);
  const crossMonumentRef = useRef<THREE.Group>(null!);
  const crossMonumentMatRef = useRef<THREE.MeshStandardMaterial>(null!);
  const researchBeaconRef = useRef<THREE.MeshStandardMaterial>(null!);
  const dishRef = useRef<THREE.Group>(null!);
  const surgeryCrossRef = useRef<THREE.Group>(null!);
  const ivBagRefs = useRef<Array<THREE.MeshStandardMaterial | null>>([]);
  const wheelchairRef = useRef<THREE.Group>(null!);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (rotorRef.current) rotorRef.current.rotation.y = t * 14;
    if (beaconRef.current) {
      const mat = beaconRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 1.4 + Math.sin(t * 4) * 1.1;
    }
    if (padRef.current) {
      padRef.current.emissiveIntensity = 0.5 + Math.sin(t * 1.5) * 0.25;
    }
    podRefs.current.forEach((m, i) => {
      if (m) m.emissiveIntensity = 0.6 + Math.sin(t * 2 + i * 1.1) * 0.4;
    });
    // MRI ring rotates around its bore axis
    if (mriRingRef.current) mriRingRef.current.rotation.z = t * 2.0;
    // Red-cross monument slowly rotates and pulses
    if (crossMonumentRef.current) crossMonumentRef.current.rotation.y = t * 0.6;
    if (crossMonumentMatRef.current) {
      crossMonumentMatRef.current.emissiveIntensity = 1.4 + Math.sin(t * 2.5) * 0.6;
    }
    // Research tower antenna beacon pulses
    if (researchBeaconRef.current) {
      researchBeaconRef.current.emissiveIntensity = 1.0 + Math.sin(t * 3.5) * 0.9;
    }
    // Satellite dish slow scan
    if (dishRef.current) dishRef.current.rotation.y = Math.sin(t * 0.5) * 0.7;
    // Surgery wing rooftop cross gently rotates
    if (surgeryCrossRef.current) surgeryCrossRef.current.rotation.y = t * 0.8;
    // IV bag pulse
    ivBagRefs.current.forEach((m, i) => {
      if (m) m.emissiveIntensity = 0.5 + Math.sin(t * 1.6 + i * 0.7) * 0.3;
    });
    // Wheelchair bot subtle bob
    if (wheelchairRef.current) wheelchairRef.current.position.y = Math.sin(t * 1.2) * 0.03;
  });
  return (
    <group position={[7.5, 0, -40.5]}>
      {/* ── Helipad (north of hospital, world (7.5, -47.5)) ─────────── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, -7]} receiveShadow>
        <circleGeometry args={[3.2, 28]} />
        <meshStandardMaterial color="#0f172a" roughness={0.9} />
      </mesh>
      {/* Outer painted ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, -7]}>
        <ringGeometry args={[2.7, 3.05, 32]} />
        <meshStandardMaterial
          ref={padRef}
          color="#fde047"
          emissive="#facc15"
          emissiveIntensity={0.6}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Painted "H" mark — three bars (two verticals + crossbar) */}
      {[-0.65, 0.65].map((bx) => (
        <mesh
          key={`hbar-${bx}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[bx, 0.06, -7]}
        >
          <planeGeometry args={[0.35, 2]} />
          <meshStandardMaterial color="#f8fafc" emissive="#f8fafc" emissiveIntensity={0.8} toneMapped={false} />
        </mesh>
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, -7]}>
        <planeGeometry args={[1.6, 0.35]} />
        <meshStandardMaterial color="#f8fafc" emissive="#f8fafc" emissiveIntensity={0.8} toneMapped={false} />
      </mesh>
      {/* Rescue helicopter parked on the pad */}
      <group position={[0, 1.05, -7]}>
        {/* Fuselage — capsule via stretched sphere */}
        <mesh position={[0, 0, 0]} scale={[0.9, 0.55, 1.6]} castShadow>
          <sphereGeometry args={[1, 16, 12]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.25} />
        </mesh>
        {/* Cockpit dome */}
        <mesh position={[0, 0.05, 0.95]} scale={[0.55, 0.45, 0.7]}>
          <sphereGeometry args={[1, 14, 10]} />
          <meshStandardMaterial color="#0f172a" metalness={0.6} roughness={0.2} emissive="#22d3ee" emissiveIntensity={0.35} />
        </mesh>
        {/* Tail boom */}
        <mesh position={[0, 0.05, -1.7]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.08, 1.4, 8]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
        {/* Tail rotor */}
        <mesh position={[0.18, 0.05, -2.35]} rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[0.6, 0.05, 0.08]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        {/* Red cross on side */}
        <mesh position={[0.85, 0.05, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[0.55, 0.55]} />
          <meshStandardMaterial color="#f8fafc" emissive="#f8fafc" emissiveIntensity={0.5} side={THREE.DoubleSide} toneMapped={false} />
        </mesh>
        <mesh position={[0.86, 0.05, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[0.35, 0.1]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.2} side={THREE.DoubleSide} toneMapped={false} />
        </mesh>
        <mesh position={[0.86, 0.05, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[0.1, 0.35]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.2} side={THREE.DoubleSide} toneMapped={false} />
        </mesh>
        {/* Skids */}
        {[-0.55, 0.55].map((sx) => (
          <mesh key={`skid-${sx}`} position={[sx, -0.55, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 1.8, 6]} />
            <meshStandardMaterial color="#475569" metalness={0.6} />
          </mesh>
        ))}
        {/* Main rotor mast + spinning blades */}
        <mesh position={[0, 0.55, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.2, 6]} />
          <meshStandardMaterial color="#475569" metalness={0.7} />
        </mesh>
        <group ref={rotorRef} position={[0, 0.72, 0]}>
          <mesh>
            <boxGeometry args={[3.6, 0.05, 0.15]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <boxGeometry args={[3.6, 0.05, 0.15]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
        </group>
        {/* Beacon on tail */}
        <mesh ref={beaconRef} position={[0, 0.3, -2.3]}>
          <sphereGeometry args={[0.09, 8, 8]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2} toneMapped={false} />
        </mesh>
      </group>

      {/* ── Ambulance parked east of building (world (12.25, -40.5)) ──
          Local x=4.75 keeps driveway right edge at world x≈14.5, leaving
          a ~2.5u clearance to botcityhall west edge at x=17. */}
      <group position={[4.75, 0, 0]}>
        {/* Driveway slab */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
          <planeGeometry args={[4.5, 3]} />
          <meshStandardMaterial color="#334155" roughness={0.9} />
        </mesh>
        {/* Body — boxy van */}
        <mesh position={[0, 0.65, 0]} castShadow>
          <boxGeometry args={[1.5, 1.1, 2.6]} />
          <meshStandardMaterial color="#f8fafc" emissive="#f8fafc" emissiveIntensity={0.05} />
        </mesh>
        {/* Cab */}
        <mesh position={[0, 0.6, 1.3]} castShadow>
          <boxGeometry args={[1.45, 0.95, 0.9]} />
          <meshStandardMaterial color="#f1f5f9" />
        </mesh>
        {/* Windshield */}
        <mesh position={[0, 0.9, 1.78]}>
          <boxGeometry args={[1.3, 0.5, 0.05]} />
          <meshStandardMaterial color="#0f172a" emissive="#22d3ee" emissiveIntensity={0.4} metalness={0.5} />
        </mesh>
        {/* Red cross on side */}
        <mesh position={[0.76, 0.7, -0.2]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[0.55, 0.12]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.1} toneMapped={false} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0.76, 0.7, -0.2]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[0.12, 0.55]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.1} toneMapped={false} side={THREE.DoubleSide} />
        </mesh>
        {/* Red & blue light bar on roof */}
        <mesh position={[-0.25, 1.28, 1.0]}>
          <boxGeometry args={[0.35, 0.12, 0.18]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.6} toneMapped={false} />
        </mesh>
        <mesh position={[0.25, 1.28, 1.0]}>
          <boxGeometry args={[0.35, 0.12, 0.18]} />
          <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={1.6} toneMapped={false} />
        </mesh>
        {/* Wheels */}
        {[[-0.78, -0.9], [0.78, -0.9], [-0.78, 0.9], [0.78, 0.9]].map(([wx, wz], i) => (
          <mesh key={`wheel-${i}`} position={[wx, 0.18, wz]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.22, 0.22, 0.12, 10]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
        ))}
      </group>

      {/* ── Repair / charging pods (south of building, world z=-35.5) ─ */}
      {[-3.5, -1.2, 1.2, 3.5].map((px, i) => (
        <group key={`pod-${i}`} position={[px, 0, 5]}>
          {/* Pod base */}
          <mesh position={[0, 0.15, 0]} castShadow>
            <cylinderGeometry args={[0.55, 0.7, 0.3, 12]} />
            <meshStandardMaterial color="#1e293b" metalness={0.5} />
          </mesh>
          {/* Glass capsule */}
          <mesh position={[0, 0.95, 0]} castShadow>
            <cylinderGeometry args={[0.45, 0.45, 1.3, 14, 1, true]} />
            <meshStandardMaterial
              ref={(m) => { podRefs.current[i] = m; }}
              color="#22d3ee"
              emissive="#22d3ee"
              emissiveIntensity={0.8}
              transparent
              opacity={0.35}
              side={THREE.DoubleSide}
              toneMapped={false}
            />
          </mesh>
          {/* Charge ring at top */}
          <mesh position={[0, 1.62, 0]}>
            <torusGeometry args={[0.45, 0.04, 6, 16]} />
            <meshStandardMaterial color="#a7f3d0" emissive="#22c55e" emissiveIntensity={1.2} toneMapped={false} />
          </mesh>
          {/* Cap */}
          <mesh position={[0, 1.7, 0]} castShadow>
            <cylinderGeometry args={[0.5, 0.5, 0.12, 12]} />
            <meshStandardMaterial color="#475569" metalness={0.7} />
          </mesh>
        </group>
      ))}
      {/* Repair-bay sign */}
      <mesh position={[0, 1.7, 4.0]} castShadow>
        <boxGeometry args={[3.4, 0.5, 0.1]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <Text
        position={[0, 1.7, 4.06]}
        fontSize={0.3}
        color="#22d3ee"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#0c4a6e"
      >
        🔧 REPAIR BAY
      </Text>

      {/* ── Recovery garden — small planters in the strip between kiosk
            and helipad (originals relocated to clear new wings/tower/MRI) ── */}
      {[[-1.2, -3.2], [1.2, -3.2]].map(([gx, gz], i) => (
        <group key={`planter-${i}`} position={[gx, 0, gz]}>
          <mesh position={[0, 0.2, 0]} castShadow>
            <boxGeometry args={[1.2, 0.4, 1.2]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
          {/* Foliage */}
          <mesh position={[0, 0.7, 0]} castShadow>
            <sphereGeometry args={[0.55, 10, 8]} />
            <meshStandardMaterial color="#22c55e" emissive="#16a34a" emissiveIntensity={0.25} />
          </mesh>
          <mesh position={[0.25, 0.55, 0.25]}>
            <sphereGeometry args={[0.3, 8, 6]} />
            <meshStandardMaterial color="#86efac" emissive="#22c55e" emissiveIntensity={0.4} />
          </mesh>
        </group>
      ))}

      {/* ── Big district sign over the south entrance ──────────────── */}
      <Text
        position={[0, 6.5, 2.3]}
        fontSize={0.55}
        color="#fecaca"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#7f1d1d"
      >
        🏥 BOTHOSPITAL · REPAIR
      </Text>

      {/* ════════════════════════════════════════════════════════════════
          MAJOR EXPANSION — full medical campus
          Local envelope: x[-9, 9], z[-11, 11]. Bounded by botdealer east
          (world x=-11 → local x=-18.5), botcityhall west (world x=17 →
          local x=9.5), road bands at z=-27 (local z=13.5) and z=-54
          (local z=-13.5). Hospital kiosk fills x[-2.5,2.5], z[-2,2].
          ═══════════════════════════════════════════════════════════════ */}

      {/* ── WEST WING — Diagnostics Building (local x[-7, -3.5], z[-4.5, -0.5]) ── */}
      <group position={[-5.25, 0, -2.5]}>
        {/* Base platform */}
        <mesh position={[0, 0.1, 0]} receiveShadow>
          <boxGeometry args={[3.6, 0.2, 4.2]} />
          <meshStandardMaterial color="#e7e5e4" roughness={0.7} />
        </mesh>
        {/* Main building */}
        <mesh position={[0, 1.7, 0]} castShadow>
          <boxGeometry args={[3.2, 3.2, 3.8]} />
          <meshStandardMaterial color="#f8fafc" emissive="#22d3ee" emissiveIntensity={0.12} />
        </mesh>
        {/* Glass strip windows (east face) */}
        <mesh position={[1.61, 1.8, 0]}>
          <boxGeometry args={[0.02, 0.6, 3.0]} />
          <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.7} transparent opacity={0.7} />
        </mesh>
        <mesh position={[1.61, 2.6, 0]}>
          <boxGeometry args={[0.02, 0.4, 3.0]} />
          <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.7} transparent opacity={0.7} />
        </mesh>
        {/* Dome (X-ray / imaging dome) */}
        <mesh position={[0, 3.5, 0]} castShadow>
          <sphereGeometry args={[1.0, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#cbd5e1" emissive="#22d3ee" emissiveIntensity={0.35} metalness={0.5} />
        </mesh>
        {/* Dome ring accent */}
        <mesh position={[0, 3.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.05, 0.05, 6, 24]} />
          <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={1.4} toneMapped={false} />
        </mesh>
        {/* Door */}
        <mesh position={[1.61, 0.6, 0]}>
          <boxGeometry args={[0.02, 1.0, 0.8]} />
          <meshStandardMaterial color="#0c4a6e" />
        </mesh>
        {/* Signage */}
        <Text
          position={[1.62, 2.0, 0]}
          rotation={[0, Math.PI / 2, 0]}
          fontSize={0.22}
          color="#0c4a6e"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.014}
          outlineColor="#f0f9ff"
        >
          DIAGNOSTICS
        </Text>
      </group>

      {/* ── EAST WING — Surgery Building (local x[5.6, 8.4], z[-6.6, -2.4]) ── */}
      <group position={[7.0, 0, -4.5]}>
        {/* Base */}
        <mesh position={[0, 0.1, 0]} receiveShadow>
          <boxGeometry args={[2.8, 0.2, 4.2]} />
          <meshStandardMaterial color="#e7e5e4" roughness={0.7} />
        </mesh>
        {/* Main body */}
        <mesh position={[0, 1.9, 0]} castShadow>
          <boxGeometry args={[2.4, 3.6, 3.8]} />
          <meshStandardMaterial color="#fef2f2" emissive="#ef4444" emissiveIntensity={0.15} />
        </mesh>
        {/* Sterile-glass windows (west face, toward main hospital) */}
        {[-1.0, 0, 1.0].map((wz, i) => (
          <mesh key={`sw-${i}`} position={[-1.21, 2.2, wz]}>
            <boxGeometry args={[0.02, 0.8, 0.6]} />
            <meshStandardMaterial color="#fef9c3" emissive="#fde047" emissiveIntensity={0.85} transparent opacity={0.8} />
          </mesh>
        ))}
        {/* Stepped upper floor */}
        <mesh position={[0, 4.1, 0]} castShadow>
          <boxGeometry args={[2.0, 0.8, 2.6]} />
          <meshStandardMaterial color="#fecaca" emissive="#ef4444" emissiveIntensity={0.25} />
        </mesh>
        {/* Rooftop rotating red cross monument */}
        <group ref={surgeryCrossRef} position={[0, 5.0, 0]}>
          <mesh>
            <boxGeometry args={[0.18, 0.9, 0.18]} />
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.5} toneMapped={false} />
          </mesh>
          <mesh>
            <boxGeometry args={[0.9, 0.18, 0.18]} />
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.5} toneMapped={false} />
          </mesh>
        </group>
        {/* Surgery sign (west face) */}
        <Text
          position={[-1.22, 2.6, 0]}
          rotation={[0, -Math.PI / 2, 0]}
          fontSize={0.22}
          color="#7f1d1d"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.014}
          outlineColor="#fef2f2"
        >
          SURGERY
        </Text>
      </group>

      {/* ── PHARMACY annex (south plaza, local (-6.5, 0, 4)) ── */}
      <group position={[-6.5, 0, 4]}>
        {/* Base */}
        <mesh position={[0, 0.1, 0]} receiveShadow>
          <boxGeometry args={[2.6, 0.2, 2.2]} />
          <meshStandardMaterial color="#e7e5e4" roughness={0.7} />
        </mesh>
        {/* Body */}
        <mesh position={[0, 1.1, 0]} castShadow>
          <boxGeometry args={[2.2, 1.9, 1.8]} />
          <meshStandardMaterial color="#fef9c3" emissive="#22c55e" emissiveIntensity={0.18} />
        </mesh>
        {/* Striped awning */}
        <mesh position={[0, 2.2, 0.95]} rotation={[0.3, 0, 0]} castShadow>
          <boxGeometry args={[2.0, 0.06, 0.8]} />
          <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.4} />
        </mesh>
        {/* RX sign on roof */}
        <mesh position={[0, 2.4, 0]}>
          <boxGeometry args={[1.4, 0.5, 0.1]} />
          <meshStandardMaterial color="#16a34a" emissive="#22c55e" emissiveIntensity={0.5} />
        </mesh>
        <Text
          position={[0, 2.4, 0.06]}
          fontSize={0.32}
          color="#fef9c3"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#14532d"
        >
          ℞ PHARMACY
        </Text>
        {/* Window panes on south face */}
        {[-0.6, 0.6].map((wx, i) => (
          <mesh key={`pw-${i}`} position={[wx, 1.2, 0.91]}>
            <boxGeometry args={[0.7, 0.7, 0.02]} />
            <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.55} transparent opacity={0.7} />
          </mesh>
        ))}
      </group>

      {/* ── RESEARCH TOWER (NW corner, local (-6, 0, -9)) ── */}
      <group position={[-6, 0, -9]}>
        {/* Base */}
        <mesh position={[0, 0.1, 0]} receiveShadow>
          <boxGeometry args={[3.0, 0.2, 3.0]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
        </mesh>
        {/* Main tower */}
        <mesh position={[0, 3.0, 0]} castShadow>
          <boxGeometry args={[2.4, 6.0, 2.4]} />
          <meshStandardMaterial color="#0f172a" emissive="#22d3ee" emissiveIntensity={0.2} metalness={0.4} />
        </mesh>
        {/* Glass stripe windows (multi-floor) */}
        {[1.2, 2.4, 3.6, 4.8].map((y, i) => (
          <mesh key={`rt-w-${i}`} position={[0, y, 1.21]}>
            <boxGeometry args={[2.0, 0.4, 0.02]} />
            <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.9} transparent opacity={0.8} />
          </mesh>
        ))}
        {/* Upper crown */}
        <mesh position={[0, 6.4, 0]} castShadow>
          <boxGeometry args={[2.8, 0.4, 2.8]} />
          <meshStandardMaterial color="#475569" emissive="#22d3ee" emissiveIntensity={0.4} />
        </mesh>
        {/* Antenna pole */}
        <mesh position={[0, 7.4, 0]}>
          <cylinderGeometry args={[0.06, 0.08, 1.6, 6]} />
          <meshStandardMaterial color="#475569" metalness={0.85} />
        </mesh>
        {/* Pulsing beacon */}
        <mesh position={[0, 8.3, 0]}>
          <sphereGeometry args={[0.15, 10, 10]} />
          <meshStandardMaterial
            ref={researchBeaconRef}
            color="#ef4444"
            emissive="#ef4444"
            emissiveIntensity={1.4}
            toneMapped={false}
          />
        </mesh>
        {/* Satellite dish on side, scanning */}
        <group ref={dishRef} position={[1.4, 5.8, 0]}>
          <mesh position={[0.25, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <cylinderGeometry args={[0.45, 0.05, 0.1, 18, 1, true]} />
            <meshStandardMaterial color="#f8fafc" emissive="#22d3ee" emissiveIntensity={0.35} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0.4, 0, 0]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={1.2} toneMapped={false} />
          </mesh>
        </group>
        {/* Tower signage */}
        <Text
          position={[0, 5.2, 1.22]}
          fontSize={0.18}
          color="#22d3ee"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.012}
          outlineColor="#0c4a6e"
        >
          MED RESEARCH
        </Text>
      </group>

      {/* ── MRI ANNEX (NE corner, local (6, 0, -8.5)) ── */}
      <group position={[6, 0, -8.5]}>
        {/* Base */}
        <mesh position={[0, 0.1, 0]} receiveShadow>
          <boxGeometry args={[3.6, 0.2, 3.2]} />
          <meshStandardMaterial color="#e7e5e4" roughness={0.7} />
        </mesh>
        {/* Main building (low and wide) */}
        <mesh position={[0, 1.1, 0]} castShadow>
          <boxGeometry args={[3.2, 2.0, 2.8]} />
          <meshStandardMaterial color="#e0e7ff" emissive="#818cf8" emissiveIntensity={0.18} />
        </mesh>
        {/* Glass roof */}
        <mesh position={[0, 2.25, 0]} castShadow>
          <boxGeometry args={[3.0, 0.3, 2.6]} />
          <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.55} transparent opacity={0.7} />
        </mesh>
        {/* MRI bore visible through "window" — the rotating ring */}
        <group position={[0, 1.1, 1.42]}>
          {/* Bore frame */}
          <mesh>
            <torusGeometry args={[0.55, 0.18, 8, 24]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.6} roughness={0.3} />
          </mesh>
          {/* Inner rotating ring */}
          <mesh ref={mriRingRef}>
            <torusGeometry args={[0.4, 0.06, 6, 24]} />
            <meshStandardMaterial color="#818cf8" emissive="#a78bfa" emissiveIntensity={1.4} toneMapped={false} />
          </mesh>
          {/* Patient bed */}
          <mesh position={[0, -0.4, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
            <boxGeometry args={[1.2, 0.6, 0.15]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
        </group>
        {/* Signage */}
        <Text
          position={[0, 2.0, 1.41]}
          fontSize={0.18}
          color="#3730a3"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.012}
          outlineColor="#e0e7ff"
        >
          MRI / SCANNER
        </Text>
      </group>

      {/* ── GLASS ENTRANCE CANOPY over hospital south face ── */}
      <group position={[0, 0, 3.0]}>
        {/* Support pillars */}
        {[-1.8, 1.8].map((px, i) => (
          <mesh key={`canp-${i}`} position={[px, 1.4, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.1, 2.8, 8]} />
            <meshStandardMaterial color="#475569" metalness={0.7} />
          </mesh>
        ))}
        {/* Glass canopy */}
        <mesh position={[0, 2.8, 0]} rotation={[0.1, 0, 0]} castShadow>
          <boxGeometry args={[4.2, 0.12, 1.6]} />
          <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.55} transparent opacity={0.55} />
        </mesh>
        {/* Canopy ridge accent */}
        <mesh position={[0, 2.9, 0]}>
          <boxGeometry args={[4.3, 0.04, 0.06]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.1} toneMapped={false} />
        </mesh>
        {/* Reception sign */}
        <mesh position={[0, 2.2, 0.78]}>
          <boxGeometry args={[2.4, 0.4, 0.05]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <Text
          position={[0, 2.2, 0.81]}
          fontSize={0.22}
          color="#fecaca"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.014}
          outlineColor="#7f1d1d"
        >
          EMERGENCY ENTRANCE
        </Text>
      </group>

      {/* ── RECEPTION PLAZA stone floor in front of canopy ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 4.5]} receiveShadow>
        <planeGeometry args={[8, 3]} />
        <meshStandardMaterial color="#e7e5e4" emissive="#fde047" emissiveIntensity={0.08} />
      </mesh>
      {/* Plaza border accent strip (red) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 3.05]}>
        <planeGeometry args={[8, 0.18]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.9} toneMapped={false} />
      </mesh>

      {/* ── ROTATING GLOWING RED-CROSS MONUMENT in plaza center ── */}
      <group position={[0, 0, 7.5]}>
        {/* Plinth */}
        <mesh position={[0, 0.45, 0]} castShadow>
          <cylinderGeometry args={[0.6, 0.75, 0.9, 12]} />
          <meshStandardMaterial color="#1c1917" metalness={0.5} roughness={0.4} />
        </mesh>
        {/* Plinth band */}
        <mesh position={[0, 0.9, 0]}>
          <torusGeometry args={[0.65, 0.04, 6, 24]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.0} toneMapped={false} />
        </mesh>
        {/* Rotating cross */}
        <group ref={crossMonumentRef} position={[0, 2.0, 0]}>
          <mesh>
            <boxGeometry args={[0.4, 1.8, 0.4]} />
            <meshStandardMaterial
              ref={crossMonumentMatRef}
              color="#ef4444"
              emissive="#ef4444"
              emissiveIntensity={1.6}
              toneMapped={false}
            />
          </mesh>
          <mesh>
            <boxGeometry args={[1.6, 0.4, 0.4]} />
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.6} toneMapped={false} />
          </mesh>
        </group>
      </group>

      {/* ── PATIENT BOT in WHEELCHAIR (south of cross monument, east side) ── */}
      <group ref={wheelchairRef} position={[2.8, 0, 9]} rotation={[0, -0.6, 0]}>
        {/* Wheelchair frame */}
        <mesh position={[0, 0.45, 0]} castShadow>
          <boxGeometry args={[0.55, 0.1, 0.55]} />
          <meshStandardMaterial color="#475569" metalness={0.6} />
        </mesh>
        {/* Wheels (big rear, small front) */}
        {[[-0.35, -0.15], [0.35, -0.15]].map(([wx, wz], i) => (
          <mesh key={`wcw-${i}`} position={[wx, 0.35, wz]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.32, 0.32, 0.05, 14]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
        ))}
        {[[-0.28, 0.25], [0.28, 0.25]].map(([wx, wz], i) => (
          <mesh key={`wcfw-${i}`} position={[wx, 0.15, wz]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.12, 0.12, 0.05, 10]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
        ))}
        {/* Backrest */}
        <mesh position={[0, 0.85, -0.25]} castShadow>
          <boxGeometry args={[0.55, 0.7, 0.08]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        {/* Patient bot body */}
        <mesh position={[0, 0.85, 0]} castShadow>
          <boxGeometry args={[0.4, 0.55, 0.35]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.4} />
        </mesh>
        {/* Head */}
        <mesh position={[0, 1.25, 0]} castShadow>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.7} />
        </mesh>
        {/* Bandage / eye patch */}
        <mesh position={[0, 1.27, 0.16]}>
          <boxGeometry args={[0.32, 0.1, 0.02]} />
          <meshStandardMaterial color="#f8fafc" emissive="#f8fafc" emissiveIntensity={0.4} />
        </mesh>
        {/* IV pole next to chair */}
        <mesh position={[0.35, 1.0, 0]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 2.0, 6]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.7} />
        </mesh>
        {/* IV bag */}
        <mesh position={[0.35, 1.85, 0.05]}>
          <boxGeometry args={[0.18, 0.22, 0.08]} />
          <meshStandardMaterial
            ref={(m) => { ivBagRefs.current[0] = m; }}
            color="#fbbf24"
            emissive="#fbbf24"
            emissiveIntensity={0.6}
            transparent
            opacity={0.85}
            toneMapped={false}
          />
        </mesh>
        {/* IV base */}
        <mesh position={[0.35, 0.05, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.04, 10]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
      </group>

      {/* ── A second IV stand standalone, south of cross monument (west side) ── */}
      <group position={[-2.8, 0, 9]}>
        <mesh position={[0, 1.0, 0]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 2.0, 6]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.7} />
        </mesh>
        <mesh position={[0, 1.9, 0.08]}>
          <boxGeometry args={[0.18, 0.22, 0.08]} />
          <meshStandardMaterial
            ref={(m) => { ivBagRefs.current[1] = m; }}
            color="#22d3ee"
            emissive="#22d3ee"
            emissiveIntensity={0.6}
            transparent
            opacity={0.85}
            toneMapped={false}
          />
        </mesh>
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.04, 10]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
      </group>

      {/* ── DOCTOR PARKING LOT (NW, between west wing and research tower) ── */}
      <group position={[-7, 0, -6]}>
        {/* Parking slab */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]} receiveShadow>
          <planeGeometry args={[3.6, 2.4]} />
          <meshStandardMaterial color="#1e293b" roughness={0.95} />
        </mesh>
        {/* Painted lane dividers */}
        {[-1.0, 0, 1.0].map((lx, i) => (
          <mesh key={`pl-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[lx, 0.05, 0]}>
            <planeGeometry args={[0.06, 2.0]} />
            <meshStandardMaterial color="#fde047" emissive="#fde047" emissiveIntensity={0.5} toneMapped={false} />
          </mesh>
        ))}
        {/* Parked mini doctor cars (2) */}
        {[[-0.5, 0.2, "#22d3ee"], [0.5, -0.2, "#a855f7"]].map(([cx, cz, col], i) => (
          <group key={`docar-${i}`} position={[cx as number, 0, cz as number]}>
            <mesh position={[0, 0.3, 0]} castShadow>
              <boxGeometry args={[0.55, 0.35, 0.9]} />
              <meshStandardMaterial color={col as string} emissive={col as string} emissiveIntensity={0.3} />
            </mesh>
            <mesh position={[0, 0.55, -0.05]} castShadow>
              <boxGeometry args={[0.5, 0.25, 0.5]} />
              <meshStandardMaterial color="#0f172a" emissive="#22d3ee" emissiveIntensity={0.4} />
            </mesh>
            {[[-0.22, -0.3], [0.22, -0.3], [-0.22, 0.3], [0.22, 0.3]].map(([wx, wz], j) => (
              <mesh key={`dw-${j}`} position={[wx, 0.12, wz]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.1, 0.1, 0.08, 8]} />
                <meshStandardMaterial color="#0f172a" />
              </mesh>
            ))}
          </group>
        ))}
        {/* Parking sign */}
        <mesh position={[1.6, 0.5, -1.0]}>
          <boxGeometry args={[0.05, 1.0, 0.05]} />
          <meshStandardMaterial color="#1c1917" />
        </mesh>
        <mesh position={[1.6, 0.9, -1.0]}>
          <boxGeometry args={[0.6, 0.28, 0.04]} />
          <meshStandardMaterial color="#1e40af" emissive="#3b82f6" emissiveIntensity={0.5} />
        </mesh>
        <Text
          position={[1.6, 0.9, -0.97]}
          fontSize={0.13}
          color="#fef9c3"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.008}
          outlineColor="#1e3a8a"
        >
          MD ONLY
        </Text>
      </group>

      {/* ── HEDGES along the south plaza perimeter ── */}
      {[[-3.5, 6.2], [-1.2, 6.2], [1.2, 6.2], [3.5, 6.2]].map(([hx, hz], i) => (
        <group key={`hedge-${i}`} position={[hx, 0, hz]}>
          <mesh position={[0, 0.35, 0]} castShadow>
            <boxGeometry args={[1.2, 0.7, 0.5]} />
            <meshStandardMaterial color="#15803d" emissive="#22c55e" emissiveIntensity={0.2} roughness={0.85} />
          </mesh>
        </group>
      ))}

      {/* ── EXTRA LAMP POSTS along plaza edges ── */}
      {[[-4.5, 5.5], [4.5, 5.5], [-4.5, 8.5], [4.5, 8.5]].map(([lx, lz], i) => (
        <group key={`hlamp-${i}`} position={[lx, 0, lz]}>
          <mesh position={[0, 1.1, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 2.2, 6]} />
            <meshStandardMaterial color="#1c1917" />
          </mesh>
          {/* Light fixture */}
          <mesh position={[0, 2.25, 0]}>
            <sphereGeometry args={[0.16, 12, 10]} />
            <meshStandardMaterial color="#fef9c3" emissive="#fde047" emissiveIntensity={1.6} toneMapped={false} />
          </mesh>
          {/* Red cross banner */}
          <mesh position={[0.3, 1.6, 0]}>
            <planeGeometry args={[0.5, 0.7]} />
            <meshStandardMaterial color="#f8fafc" side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0.31, 1.6, 0]}>
            <planeGeometry args={[0.4, 0.12]} />
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.9} side={THREE.DoubleSide} toneMapped={false} />
          </mesh>
          <mesh position={[0.31, 1.6, 0]}>
            <planeGeometry args={[0.12, 0.4]} />
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.9} side={THREE.DoubleSide} toneMapped={false} />
          </mesh>
        </group>
      ))}

      {/* ── DECORATIVE TREES around the campus ── */}
      {[[-8, -6.5], [-8, 1.5], [8.5, 1.5], [8.5, 5.5], [-8, 5.5]].map(([tx, tz], i) => (
        <group key={`htree-${i}`} position={[tx, 0, tz]}>
          <mesh position={[0, 0.6, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.14, 1.2, 6]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
          <mesh position={[0, 1.4, 0]} castShadow>
            <sphereGeometry args={[0.5, 12, 10]} />
            <meshStandardMaterial color="#15803d" emissive="#22c55e" emissiveIntensity={0.25} />
          </mesh>
        </group>
      ))}

      {/* ── CONNECTING WALKWAYS ── */}
      {/* Hospital ↔ Surgery wing */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[4.5, 0.05, -2]} receiveShadow>
        <planeGeometry args={[2.4, 1]} />
        <meshStandardMaterial color="#d6d3d1" emissive="#a8a29e" emissiveIntensity={0.2} />
      </mesh>
      {/* Hospital ↔ Diagnostics wing */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-4.5, 0.05, 0]} receiveShadow>
        <planeGeometry args={[2.4, 1]} />
        <meshStandardMaterial color="#d6d3d1" emissive="#a8a29e" emissiveIntensity={0.2} />
      </mesh>
      {/* Path to research tower (north) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-6, 0.05, -5.5]} receiveShadow>
        <planeGeometry args={[1.2, 3]} />
        <meshStandardMaterial color="#d6d3d1" emissive="#a8a29e" emissiveIntensity={0.2} />
      </mesh>
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
    <group position={[-40.5, 0, -7.5]}>
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
