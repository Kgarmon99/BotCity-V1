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
      args={[60, 60, "#4ade80", "#16a34a"]}
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

const coinPositions: [number, number, number][] = [
  [3, 1.2, -3], [-3, 1.2, 3], [5, 1.2, 5], [-5, 1.2, -5],
  [0, 1.5, -15], [-15, 1.5, 0], [15, 1.5, 0], [0, 1.5, 15],
  [12, 1.2, 12], [-12, 1.2, -12], [12, 1.2, -12], [-12, 1.2, 12],
];

const spirePositions: { pos: [number, number, number]; height: number }[] = [
  { pos: [-14, 0, -14], height: 4 },
  { pos: [-16, 0, 6], height: 5 },
  { pos: [14, 0, -16], height: 4.5 },
  { pos: [16, 0, 12], height: 5.5 },
  { pos: [-19, 0, -6], height: 4 },
  { pos: [12, 0, 18], height: 4.5 },
  { pos: [-9, 0, 18], height: 5 },
  { pos: [19, 0, -10], height: 4.5 },
  { pos: [4, 0, 21], height: 3.5 },
  { pos: [-21, 0, 9], height: 4 },
  { pos: [-14, 0, 14], height: 4 },
  { pos: [14, 0, 4], height: 4.5 },
];

const distantTowers: { pos: [number, number, number]; height: number; color: string }[] = [
  { pos: [-30, 0, -25], height: 12, color: "#22c55e" },
  { pos: [30, 0, -25], height: 15, color: "#4ade80" },
  { pos: [-30, 0, 25], height: 13, color: "#fbbf24" },
  { pos: [30, 0, 25], height: 11, color: "#22c55e" },
  { pos: [-35, 0, 0], height: 16, color: "#16a34a" },
  { pos: [35, 0, 0], height: 14, color: "#4ade80" },
  { pos: [0, 0, -35], height: 18, color: "#22c55e" },
  { pos: [0, 0, 35], height: 15, color: "#fbbf24" },
];

const lampPositions: [number, number, number][] = [
  [-4, 0, -4], [4, 0, -4], [-4, 0, 4], [4, 0, 4],
  [0, 0, -10], [0, 0, 10], [-10, 0, 0], [10, 0, 0],
  [-8, 0, -8], [8, 0, -8], [-8, 0, 8], [8, 0, 8],
];

const dollarHolos: [number, number, number][] = [
  [-8, 4, -8], [8, 5, -8], [-8, 4.5, 8], [8, 5, 8],
  [0, 6, -18], [0, 6, 18], [-18, 5, 0], [18, 5, 0],
];

const particlePositions: [number, number, number][] = Array.from({ length: 30 }).map((_, i) => [
  Math.cos((i / 30) * Math.PI * 2) * (8 + (i % 5) * 2),
  2 + (i % 4),
  Math.sin((i / 30) * Math.PI * 2) * (8 + (i % 5) * 2),
]);

export default function World() {
  return (
    <group>
      {/* Dark emerald ground */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#042f1f" roughness={0.4} metalness={0.5} />
      </mesh>

      {/* Glowing green grid overlay */}
      <GridFloor />

      {/* Neon green roads */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <planeGeometry args={[3, 50]} />
        <meshStandardMaterial
          color="#052e16"
          emissive="#22c55e"
          emissiveIntensity={0.6}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <planeGeometry args={[50, 3]} />
        <meshStandardMaterial
          color="#052e16"
          emissive="#4ade80"
          emissiveIntensity={0.6}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>

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

      {/* Neon green lamps */}
      {lampPositions.map((pos, i) => (
        <NeonLamp key={`lamp-${i}`} pos={pos} />
      ))}

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

      {/* Boundary glowing rails */}
      {[-23, 23].map((x) => (
        <mesh key={`fx${x}`} position={[x, 0.5, 0]} castShadow>
          <boxGeometry args={[0.15, 1, 46]} />
          <meshStandardMaterial color="#052e16" emissive="#22c55e" emissiveIntensity={1.2} toneMapped={false} />
        </mesh>
      ))}
      {[-23, 23].map((z) => (
        <mesh key={`fz${z}`} position={[0, 0.5, z]} castShadow>
          <boxGeometry args={[46, 1, 0.15]} />
          <meshStandardMaterial color="#052e16" emissive="#4ade80" emissiveIntensity={1.2} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}
