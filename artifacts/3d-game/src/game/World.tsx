import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

// Floating coin with green aura
function Coin({ pos, delay }: { pos: [number, number, number]; delay: number }) {
  const ref = useRef<THREE.Group>(null!);
  const auraRef = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime + delay;
      ref.current.position.y = pos[1] + Math.sin(t * 2) * 0.3;
      ref.current.rotation.y = t * 2;
    }
    if (auraRef.current) {
      const t = state.clock.elapsedTime + delay;
      auraRef.current.scale.setScalar(1 + Math.sin(t * 3) * 0.2);
      (auraRef.current.material as THREE.MeshBasicMaterial).opacity = 0.4 + Math.sin(t * 3) * 0.2;
    }
  });
  return (
    <group ref={ref} position={pos}>
      <mesh ref={auraRef}>
        <sphereGeometry args={[0.7, 16, 16]} />
        <meshBasicMaterial color="#22c55e" transparent opacity={0.4} />
      </mesh>
      <mesh castShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.08, 16]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.95} roughness={0.1} emissive="#fbbf24" emissiveIntensity={0.7} />
      </mesh>
      <Text position={[0, 0, 0.05]} fontSize={0.4} color="#15803d" anchorX="center" anchorY="middle">
        $
      </Text>
    </group>
  );
}

// Floating green dollar hologram
function DollarHolo({ pos, scale = 1 }: { pos: [number, number, number]; scale?: number }) {
  const ref = useRef<THREE.Group>(null!);
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = pos[1] + Math.sin(state.clock.elapsedTime * 0.8 + pos[0]) * 0.4;
      ref.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });
  return (
    <group ref={ref} position={pos} scale={scale}>
      <Text
        fontSize={1.5}
        color="#4ade80"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.06}
        outlineColor="#fbbf24"
      >
        $
      </Text>
    </group>
  );
}

// Data spire — emerald crystal pillar
function DataSpire({ pos, height }: { pos: [number, number, number]; height: number }) {
  const ref = useRef<THREE.Mesh>(null!);
  const auraRef = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (ref.current) {
      const mat = ref.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.6 + Math.sin(state.clock.elapsedTime * 2 + pos[0]) * 0.3;
    }
    if (auraRef.current) {
      const t = state.clock.elapsedTime + pos[0];
      auraRef.current.scale.set(
        1 + Math.sin(t * 1.5) * 0.1,
        1,
        1 + Math.sin(t * 1.5) * 0.1
      );
      (auraRef.current.material as THREE.MeshBasicMaterial).opacity = 0.15 + Math.sin(t * 1.5) * 0.08;
    }
  });
  return (
    <group position={pos}>
      {/* Aura cylinder around spire */}
      <mesh ref={auraRef} position={[0, height / 2, 0]}>
        <cylinderGeometry args={[0.9, 1.2, height + 0.5, 12]} />
        <meshBasicMaterial color="#22c55e" transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={ref} position={[0, height / 2, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.4, height, 6]} />
        <meshStandardMaterial
          color="#052e16"
          emissive="#22c55e"
          emissiveIntensity={0.7}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[0, height + 0.3, 0]}>
        <octahedronGeometry args={[0.3]} />
        <meshStandardMaterial color="#86efac" emissive="#22c55e" emissiveIntensity={2} toneMapped={false} />
      </mesh>
    </group>
  );
}

// Distant holographic skyscraper
function DistantTower({ pos, height, color }: { pos: [number, number, number]; height: number; color: string }) {
  return (
    <group position={pos}>
      <mesh castShadow position={[0, height / 2, 0]}>
        <boxGeometry args={[2.5, height, 2.5]} />
        <meshStandardMaterial
          color="#022c22"
          emissive={color}
          emissiveIntensity={0.4}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      {Array.from({ length: Math.floor(height / 1.5) }).map((_, i) => (
        <mesh key={i} position={[0, 1 + i * 1.5, 1.27]}>
          <boxGeometry args={[1.8, 0.4, 0.05]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} />
        </mesh>
      ))}
      <mesh position={[0, height + 0.3, 0]}>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshStandardMaterial color="#4ade80" emissive="#4ade80" emissiveIntensity={2.5} toneMapped={false} />
      </mesh>
    </group>
  );
}

// Neon lamp
function NeonLamp({ pos }: { pos: [number, number, number] }) {
  const torusRef = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (torusRef.current) {
      const mat = torusRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 1.8 + Math.sin(state.clock.elapsedTime * 2 + pos[0]) * 0.6;
    }
  });
  return (
    <group position={pos}>
      <mesh position={[0, 1.75, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 3.5, 6]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} />
      </mesh>
      <mesh ref={torusRef} position={[0, 3.6, 0]}>
        <torusGeometry args={[0.35, 0.06, 8, 24]} />
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={2} toneMapped={false} />
      </mesh>
    </group>
  );
}

// Floating particle orb
function ParticleOrb({ pos, delay }: { pos: [number, number, number]; delay: number }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime + delay;
      ref.current.position.y = pos[1] + Math.sin(t * 1.2) * 1.5;
      ref.current.position.x = pos[0] + Math.sin(t * 0.7) * 0.8;
      ref.current.position.z = pos[2] + Math.cos(t * 0.9) * 0.8;
    }
  });
  return (
    <mesh ref={ref} position={pos}>
      <sphereGeometry args={[0.12, 12, 12]} />
      <meshStandardMaterial color="#86efac" emissive="#22c55e" emissiveIntensity={3} toneMapped={false} />
    </mesh>
  );
}

// Glowing grid floor with pulse
function GridFloor() {
  const gridRef = useRef<THREE.GridHelper>(null!);
  useFrame((state) => {
    if (gridRef.current) {
      const mat = gridRef.current.material as THREE.Material & { opacity?: number };
      if (mat.opacity !== undefined) {
        mat.opacity = 0.5 + Math.sin(state.clock.elapsedTime) * 0.15;
      }
    }
  });
  return (
    <gridHelper
      ref={gridRef}
      args={[340, 340, "#4ade80", "#16a34a"]}
      position={[0, 0.01, 0]}
    />
  );
}

// Central pulsing aura ring in plaza
function PlazaAura() {
  const ref1 = useRef<THREE.Mesh>(null!);
  const ref2 = useRef<THREE.Mesh>(null!);
  const ref3 = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref1.current) {
      ref1.current.scale.setScalar(1 + Math.sin(t * 2) * 0.1);
      (ref1.current.material as THREE.MeshBasicMaterial).opacity = 0.6 + Math.sin(t * 2) * 0.2;
    }
    if (ref2.current) {
      ref2.current.scale.setScalar(1 + Math.sin(t * 1.5 + 0.5) * 0.15);
      (ref2.current.material as THREE.MeshBasicMaterial).opacity = 0.3 + Math.sin(t * 1.5 + 0.5) * 0.15;
    }
    if (ref3.current) {
      ref3.current.rotation.y = t * 0.3;
    }
  });
  return (
    <group>
      <mesh ref={ref1} position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3, 4, 64]} />
        <meshBasicMaterial color="#22c55e" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={ref2} position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[4.5, 6, 64]} />
        <meshBasicMaterial color="#86efac" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={ref3} position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2, 2.5, 32]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
      <pointLight position={[0, 1, 0]} intensity={3} distance={15} color="#22c55e" />
    </group>
  );
}

// All decorative positions are kept off the road grid:
//   main avenues at x=0 and z=0 (width 3), secondary streets at x/z=±18 (width 2.2).
// Items are placed inside city blocks or in safe diagonal corridors.

const coinPositions: [number, number, number][] = [
  [4, 1.2, -4], [-4, 1.2, 4], [5, 1.2, 5], [-5, 1.2, -5],
  [12, 1.2, 12], [-12, 1.2, -12], [12, 1.2, -12], [-12, 1.2, 12],
  [22, 1.5, -22], [-22, 1.5, 22], [22, 1.5, 22], [-22, 1.5, -22],
];

const spirePositions: { pos: [number, number, number]; height: number }[] = [
  // Inner blocks — placed diagonally inside the 4 quadrants
  { pos: [-14, 0, -14], height: 4 },
  { pos: [-15, 0,  5], height: 5 },
  { pos: [ 14, 0, -15], height: 4.5 },
  { pos: [ 15, 0,  12], height: 5.5 },
  { pos: [-15, 0, -5], height: 4 },
  { pos: [ 12, 0,  15], height: 4.5 },
  { pos: [-12, 0,  15], height: 5 },
  { pos: [ 15, 0, -10], height: 4.5 },
  // Mid-ring accent spires (in blocks, off all roads)
  { pos: [ 4, 0,  22], height: 3.5 },
  { pos: [-22, 0,  9], height: 4 },
  { pos: [-13, 0,  13], height: 4 },
  { pos: [ 13, 0,  4], height: 4.5 },
];

const distantTowers: { pos: [number, number, number]; height: number; color: string }[] = [
  // Pushed beyond outer ring (x/z = ±36 streets) and off main axes
  { pos: [-44, 0, -32], height: 14, color: "#22c55e" },
  { pos: [ 44, 0, -32], height: 17, color: "#4ade80" },
  { pos: [-44, 0,  32], height: 15, color: "#86efac" },
  { pos: [ 44, 0,  32], height: 13, color: "#22c55e" },
  { pos: [-44, 0, -12], height: 18, color: "#16a34a" },
  { pos: [ 44, 0,  12], height: 16, color: "#4ade80" },
  { pos: [-32, 0, -44], height: 19, color: "#22c55e" },
  { pos: [ 32, 0,  44], height: 17, color: "#86efac" },
];

const lampPositions: [number, number, number][] = [
  // Sit in block interiors near the plaza, not on roads
  [-4, 0, -4], [4, 0, -4], [-4, 0, 4], [4, 0, 4],
  [-8, 0, -8], [8, 0, -8], [-8, 0, 8], [8, 0, 8],
  [-14, 0, -4], [14, 0, -4], [-14, 0, 4], [14, 0, 4],
];

const dollarHolos: [number, number, number][] = [
  // Float high above block centers (off road centerlines)
  [-8, 4, -8], [8, 5, -8], [-8, 4.5, 8], [8, 5, 8],
  [-22, 6, -22], [22, 6, -22], [-22, 6, 22], [22, 6, 22],
];

// Particles ring around the plaza; nudge any sample that lands on a main avenue
// (|x|<=1.5 or |z|<=1.5) outward so they never overlap the road grid.
const particlePositions: [number, number, number][] = Array.from({ length: 30 }).map((_, i) => {
  const angle = (i / 30) * Math.PI * 2 + Math.PI / 12;
  const r = 8 + (i % 5) * 2; // 8..16 — always inside the ±18 secondary streets
  let x = Math.cos(angle) * r;
  let z = Math.sin(angle) * r;
  if (Math.abs(x) < 2) x = (x >= 0 ? 1 : -1) * 2;
  if (Math.abs(z) < 2) z = (z >= 0 ? 1 : -1) * 2;
  return [x, 2 + (i % 4), z];
});

// ─── Terrain: ring of mountains, hills, and far ridges around the city ───
// All features sit OUTSIDE the player bound (±105) and INSIDE the ground
// plane edge (±170). Placement is deterministic (no randomness at runtime
// so positions don't shift between renders).
type TerrainFeature = {
  pos: [number, number, number];
  baseR: number;
  topR: number;
  height: number;
  color: string;
  peakColor?: string;
};

// Pseudo-random but deterministic jitter from an integer index.
function jitter(i: number, salt: number): number {
  const v = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return v - Math.floor(v); // 0..1
}

const mountainPalette = ["#1e3a2e", "#22463a", "#1a3326", "#264a3b", "#1f3d30"];
const peakPalette = ["#a7c4b5", "#c8d8cd", "#9fb8aa", "#b8cdc0"];
const hillPalette = ["#1f4332", "#28543f", "#1b3a2b", "#2e6049", "#224836"];

// Footprint-safe constants. The map ground is 500×500 centered at origin
// (edge at ±250). The city extends further than the player bound:
//   • ocean plane reaches x≈129 (CityDistricts.tsx)
//   • Eiffel Tower & St. Louis Arch are at radial distance ≈170
// CITY_EDGE=185 gives ~15u buffer past the landmarks; MAP_EDGE=248 keeps
// terrain footprints just inside the ground plane.
const CITY_EDGE = 185;
const MAP_EDGE = 248;

// Lower rolling foothills — innermost terrain band, just outside the city.
// baseR 6..11, r 196..211 → footprint range ~[185, 222]. 48 around.
const hillPositions: TerrainFeature[] = Array.from({ length: 48 }).map((_, i) => {
  const angle = (i / 48) * Math.PI * 2 + jitter(i, 5) * 0.13;
  const baseR = 6 + jitter(i, 8) * 5;         // 6..11
  const r = 196 + jitter(i, 6) * 15;          // 196..211
  const height = 4 + jitter(i, 7) * 6;        // 4..10
  return {
    pos: [Math.cos(angle) * r, 0, Math.sin(angle) * r],
    baseR,
    topR: baseR * 0.55,                       // domes, not points
    height,
    color: hillPalette[i % hillPalette.length]!,
  };
});

// Tall jagged mountains — middle ring. baseR 9..15, r 214..232 →
// footprint range ~[199, 247]. 36 around the circle.
const mountainPositions: TerrainFeature[] = Array.from({ length: 36 }).map((_, i) => {
  const angle = (i / 36) * Math.PI * 2 + jitter(i, 1) * 0.16;
  const baseR = 9 + jitter(i, 4) * 6;         // 9..15
  const r = 214 + jitter(i, 2) * 18;          // 214..232
  const height = 18 + jitter(i, 3) * 18;      // 18..36
  return {
    pos: [Math.cos(angle) * r, 0, Math.sin(angle) * r],
    baseR,
    topR: baseR * 0.12,
    height,
    color: mountainPalette[i % mountainPalette.length]!,
    peakColor: peakPalette[i % peakPalette.length]!,
  };
});

// Distant backdrop ridges — far ring. baseR 10..14, r 222..232 →
// footprint range ~[208, 246]. Wide and low for silhouette. 28 around.
const farRidgePositions: TerrainFeature[] = Array.from({ length: 28 }).map((_, i) => {
  const angle = (i / 28) * Math.PI * 2 + jitter(i, 9) * 0.22;
  const baseR = 10 + jitter(i, 12) * 4;       // 10..14
  const r = 222 + jitter(i, 10) * 10;         // 222..232
  const height = 22 + jitter(i, 11) * 14;     // 22..36
  return {
    pos: [Math.cos(angle) * r, 0, Math.sin(angle) * r],
    baseR,
    topR: baseR * 0.18,
    height,
    color: "#162a22",
    peakColor: "#7fa091",
  };
});

// Sanity asserts (dev-only): catch any future retuning that would violate
// city or map edges. These run once at module load.
if (typeof process !== "undefined" && process.env?.NODE_ENV !== "production") {
  for (const f of [...hillPositions, ...mountainPositions, ...farRidgePositions]) {
    const r = Math.hypot(f.pos[0], f.pos[2]);
    if (r - f.baseR < CITY_EDGE - 0.01 || r + f.baseR > MAP_EDGE + 0.01) {
      // eslint-disable-next-line no-console
      console.warn("[Terrain] feature footprint out of bounds", { r, baseR: f.baseR });
    }
  }
}

function Mountain({ feature, withPeak }: { feature: TerrainFeature; withPeak: boolean }) {
  const { pos, baseR, topR, height, color, peakColor } = feature;
  // Bury bottom 0.2u below ground so the open bottom edge is hidden, and
  // there's no coplanar surface to z-fight with the ground plane at y=0.
  const sink = 0.2;
  const peakH = height * 0.22;
  return (
    <group position={pos}>
      <mesh position={[0, (height - sink) / 2, 0]} castShadow receiveShadow>
        {/* openEnded=true (6th arg) removes top & bottom caps. */}
        <cylinderGeometry args={[topR, baseR, height, 7, 1, true]} />
        <meshStandardMaterial
          color={color}
          roughness={0.95}
          metalness={0.05}
          flatShading
          side={THREE.DoubleSide}
        />
      </mesh>
      {withPeak && peakColor && (
        <mesh position={[0, height - sink - peakH / 2, 0]}>
          <cylinderGeometry
            args={[topR * 0.9, topR + (baseR - topR) * (peakH / height) * 0.9, peakH, 7, 1]}
          />
          <meshStandardMaterial color={peakColor} roughness={0.7} flatShading />
        </mesh>
      )}
    </group>
  );
}

function Hill({ feature }: { feature: TerrainFeature }) {
  const { baseR, color } = feature;
  return (
    <mesh castShadow receiveShadow>
      {/* Half-sphere dome; parent <group> applies the vertical squash. */}
      <sphereGeometry args={[baseR, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshStandardMaterial color={color} roughness={0.9} metalness={0.05} flatShading />
    </mesh>
  );
}

// Animated water fountain in the central plaza
function Fountain() {
  const waterRef = useRef<THREE.Mesh>(null!);
  const rippleRefs = useRef<THREE.Mesh[]>([]);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (waterRef.current) {
      const mat = waterRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.3 + Math.sin(t * 2) * 0.1;
    }
    rippleRefs.current.forEach((ref, i) => {
      if (ref) {
        const scale = 1 + Math.sin(t * 3 + i * 1.5) * 0.15;
        ref.scale.setScalar(scale);
        (ref.material as THREE.MeshBasicMaterial).opacity = 0.3 - (scale - 1) * 0.5;
      }
    });
  });
  return (
    <group position={[0, 0.1, 0]}>
      {/* Water pool */}
      <mesh ref={waterRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[2.2, 32]} />
        <meshStandardMaterial
          color="#064e3b"
          emissive="#22c55e"
          emissiveIntensity={0.3}
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.85}
        />
      </mesh>
      {/* Ripples */}
      {[0, 1, 2].map((i) => (
        <mesh
          key={`ripple-${i}`}
          ref={(el) => { if (el) rippleRefs.current[i] = el; }}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.03 + i * 0.01, 0]}
        >
          <ringGeometry args={[0.5 + i * 0.4, 0.7 + i * 0.4, 32]} />
          <meshBasicMaterial color="#4ade80" transparent opacity={0.2} side={THREE.DoubleSide} />
        </mesh>
      ))}
      {/* Central jet */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.08, 0.2, 2.4, 8]} />
        <meshStandardMaterial
          color="#22c55e"
          emissive="#4ade80"
          emissiveIntensity={1.5}
          transparent
          opacity={0.4}
        />
      </mesh>
      <pointLight position={[0, 1, 0]} intensity={2} distance={8} color="#22c55e" />
    </group>
  );
}

// Firefly particles that drift around the city
function Fireflies() {
  const refs = useRef<THREE.Mesh[]>([]);
  const positions = useMemo(() =>
    Array.from({ length: 40 }, () => ({
      x: (Math.random() - 0.5) * 80,
      y: 1 + Math.random() * 8,
      z: (Math.random() - 0.5) * 80,
      speed: 0.3 + Math.random() * 0.7,
      offset: Math.random() * Math.PI * 2,
    })),
  []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    refs.current.forEach((ref, i) => {
      if (ref) {
        const p = positions[i];
        ref.position.x = p.x + Math.sin(t * p.speed + p.offset) * 3;
        ref.position.y = p.y + Math.sin(t * p.speed * 0.7 + p.offset) * 1.5;
        ref.position.z = p.z + Math.cos(t * p.speed + p.offset) * 3;
        (ref.material as THREE.MeshStandardMaterial).emissiveIntensity =
          1.5 + Math.sin(t * 4 + p.offset) * 1;
      }
    });
  });

  return (
    <group>
      {positions.map((_, i) => (
        <mesh
          key={`firefly-${i}`}
          ref={(el) => { if (el) refs.current[i] = el; }}
        >
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#fbbf24"
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

// Street lamp with actual point light
function StreetLamp({ pos }: { pos: [number, number, number] }) {
  const lightRef = useRef<THREE.PointLight>(null!);
  const bulbRef = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (lightRef.current) {
      lightRef.current.intensity = 1.5 + Math.sin(t * 2 + pos[0]) * 0.3;
    }
    if (bulbRef.current) {
      (bulbRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        2 + Math.sin(t * 2 + pos[0]) * 0.5;
    }
  });
  return (
    <group position={pos}>
      <mesh position={[0, 1.75, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 3.5, 6]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} />
      </mesh>
      <mesh ref={bulbRef} position={[0, 3.6, 0]}>
        <torusGeometry args={[0.35, 0.06, 8, 24]} />
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={2} toneMapped={false} />
      </mesh>
      <pointLight
        ref={lightRef}
        position={[0, 3.2, 0]}
        intensity={1.5}
        distance={12}
        color="#22c55e"
        castShadow={false}
      />
    </group>
  );
}

function Terrain() {
  return (
    <group>
      {hillPositions.map((f, i) => (
        <group key={`hill-${i}`} position={f.pos} scale={[1, f.height / f.baseR, 1]}>
          <Hill feature={f} />
        </group>
      ))}
      {mountainPositions.map((f, i) => (
        <Mountain key={`mtn-${i}`} feature={f} withPeak />
      ))}
      {farRidgePositions.map((f, i) => (
        <Mountain key={`far-${i}`} feature={f} withPeak />
      ))}
    </group>
  );
}

export default function World() {
  return (
    <group>
      {/* Dark emerald ground — expanded to 500×500 so there's room for the
          terrain ring outside ALL city decor (ocean at x~129, landmarks at
          radial ~170, etc.). */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[500, 500]} />
        <meshStandardMaterial color="#042f1f" roughness={0.4} metalness={0.5} />
      </mesh>

      {/* Glowing green grid overlay */}
      <GridFloor />

      {/* Central plaza with aura */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[2.5, 4, 32]} />
        <meshStandardMaterial
          color="#052e16"
          emissive="#fbbf24"
          emissiveIntensity={0.7}
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>
      <PlazaAura />

      {/* BotCity hologram */}
      <Text
        position={[0, 4.5, 0]}
        fontSize={0.7}
        color="#4ade80"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.04}
        outlineColor="#fbbf24"
      >
        BOTCITY
      </Text>
      <Text
        position={[0, 3.7, 0]}
        fontSize={0.3}
        color="#fbbf24"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#15803d"
      >
        ✦ MoneyVerse Hub ✦
      </Text>

      {/* Data spires */}
      {spirePositions.map((s, i) => (
        <DataSpire key={`spire-${i}`} pos={s.pos} height={s.height} />
      ))}

      {/* Street lamps with real light casting */}
      {lampPositions.map((pos, i) => (
        <StreetLamp key={`lamp-${i}`} pos={pos} />
      ))}

      {/* Central fountain */}
      <Fountain />

      {/* Firefly particles */}
      <Fireflies />

      {/* Floating coins */}
      {coinPositions.map((pos, i) => (
        <Coin key={`coin-${i}`} pos={pos} delay={i * 0.3} />
      ))}

      {/* Floating dollar holograms */}
      {dollarHolos.map((pos, i) => (
        <DollarHolo key={`holo-${i}`} pos={pos} scale={0.8 + (i % 3) * 0.3} />
      ))}

      {/* Floating particle orbs */}
      {particlePositions.map((pos, i) => (
        <ParticleOrb key={`orb-${i}`} pos={pos} delay={i * 0.2} />
      ))}

      {/* Distant skyline */}
      {distantTowers.map((t, i) => (
        <DistantTower key={`tower-${i}`} pos={t.pos} height={t.height} color={t.color} />
      ))}

      {/* (Boundary glowing rails removed per user request — the green
          fence at ±65 was cutting straight through outer districts that
          have since expanded past it: airport, BotPark, BotMine, etc.) */}

      {/* ─── Surrounding terrain — mountains, foothills, and far ranges ───
          Ring of land features OUTSIDE the player bound (±105) and inside
          the ground plane edge (±170), so the city visibly ends in
          terrain instead of an endless grid. */}
      <Terrain />
    </group>
  );
}
