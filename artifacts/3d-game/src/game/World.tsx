import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

// Floating coin component
function Coin({ pos, delay }: { pos: [number, number, number]; delay: number }) {
  const ref = useRef<THREE.Group>(null!);
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime + delay;
      ref.current.position.y = pos[1] + Math.sin(t * 2) * 0.3;
      ref.current.rotation.y = t * 2;
    }
  });
  return (
    <group ref={ref} position={pos}>
      <mesh castShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.08, 16]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.95} roughness={0.1} emissive="#fbbf24" emissiveIntensity={0.5} />
      </mesh>
      <Text
        position={[0, 0, 0.05]}
        fontSize={0.4}
        color="#78350f"
        anchorX="center"
        anchorY="middle"
      >
        $
      </Text>
    </group>
  );
}

// Floating dollar sign hologram
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
        color="#22d3ee"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#a855f7"
      >
        $
      </Text>
    </group>
  );
}

// Data spire (replaces trees)
function DataSpire({ pos, height, hue }: { pos: [number, number, number]; height: number; hue: string }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (ref.current) {
      const mat = ref.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.4 + Math.sin(state.clock.elapsedTime * 2 + pos[0]) * 0.2;
    }
  });
  return (
    <group position={pos}>
      <mesh ref={ref} position={[0, height / 2, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.4, height, 6]} />
        <meshStandardMaterial
          color="#1e1b4b"
          emissive={hue}
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[0, height + 0.3, 0]}>
        <sphereGeometry args={[0.2, 12, 12]} />
        <meshStandardMaterial color={hue} emissive={hue} emissiveIntensity={1.5} />
      </mesh>
      <pointLight position={[0, height + 0.3, 0]} intensity={0.8} distance={6} color={hue} />
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
          color="#0f172a"
          emissive={color}
          emissiveIntensity={0.3}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      {/* Glowing windows */}
      {Array.from({ length: Math.floor(height / 1.5) }).map((_, i) => (
        <mesh key={i} position={[0, 1 + i * 1.5, 1.27]}>
          <boxGeometry args={[1.8, 0.4, 0.05]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} />
        </mesh>
      ))}
      <mesh position={[0, height + 0.3, 0]}>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2} />
      </mesh>
    </group>
  );
}

// Neon lamp (replaces simple lamps)
function NeonLamp({ pos, color }: { pos: [number, number, number]; color: string }) {
  return (
    <group position={pos}>
      <mesh position={[0, 1.75, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 3.5, 6]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} />
      </mesh>
      <mesh position={[0, 3.6, 0]}>
        <torusGeometry args={[0.35, 0.06, 8, 24]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
      </mesh>
      <pointLight position={[0, 3.5, 0]} intensity={2} distance={10} color={color} />
    </group>
  );
}

// Grid floor with glowing lines
function GridFloor() {
  const gridRef = useRef<THREE.GridHelper>(null!);
  useFrame((state) => {
    if (gridRef.current) {
      const mat = gridRef.current.material as THREE.Material & { opacity?: number };
      if (mat.opacity !== undefined) {
        mat.opacity = 0.4 + Math.sin(state.clock.elapsedTime) * 0.1;
      }
    }
  });
  return (
    <gridHelper
      ref={gridRef}
      args={[60, 60, "#22d3ee", "#7c3aed"]}
      position={[0, 0.01, 0]}
    />
  );
}

const coinPositions: [number, number, number][] = [
  [3, 1.2, -3], [-3, 1.2, 3], [5, 1.2, 5], [-5, 1.2, -5],
  [0, 1.2, -15], [-15, 1.2, 0], [15, 1.2, 0], [0, 1.2, 15],
  [12, 1.2, 12], [-12, 1.2, -12], [12, 1.2, -12], [-12, 1.2, 12],
];

const spirePositions: { pos: [number, number, number]; height: number; hue: string }[] = [
  { pos: [-14, 0, -14], height: 4, hue: "#22d3ee" },
  { pos: [-16, 0, 6], height: 5, hue: "#a855f7" },
  { pos: [14, 0, -16], height: 4.5, hue: "#22d3ee" },
  { pos: [16, 0, 12], height: 5.5, hue: "#a855f7" },
  { pos: [-19, 0, -6], height: 4, hue: "#a855f7" },
  { pos: [12, 0, 18], height: 4.5, hue: "#22d3ee" },
  { pos: [-9, 0, 18], height: 5, hue: "#a855f7" },
  { pos: [19, 0, -10], height: 4.5, hue: "#22d3ee" },
  { pos: [4, 0, 21], height: 3.5, hue: "#22d3ee" },
  { pos: [-21, 0, 9], height: 4, hue: "#a855f7" },
];

const distantTowers: { pos: [number, number, number]; height: number; color: string }[] = [
  { pos: [-30, 0, -25], height: 12, color: "#22d3ee" },
  { pos: [30, 0, -25], height: 15, color: "#a855f7" },
  { pos: [-30, 0, 25], height: 13, color: "#fbbf24" },
  { pos: [30, 0, 25], height: 11, color: "#ec4899" },
  { pos: [-35, 0, 0], height: 16, color: "#22d3ee" },
  { pos: [35, 0, 0], height: 14, color: "#a855f7" },
  { pos: [0, 0, -35], height: 18, color: "#fbbf24" },
  { pos: [0, 0, 35], height: 15, color: "#ec4899" },
];

const lampPositions: { pos: [number, number, number]; color: string }[] = [
  { pos: [-4, 0, -4], color: "#22d3ee" },
  { pos: [4, 0, -4], color: "#a855f7" },
  { pos: [-4, 0, 4], color: "#a855f7" },
  { pos: [4, 0, 4], color: "#22d3ee" },
  { pos: [0, 0, -10], color: "#ec4899" },
  { pos: [0, 0, 10], color: "#ec4899" },
  { pos: [-10, 0, 0], color: "#fbbf24" },
  { pos: [10, 0, 0], color: "#fbbf24" },
];

const dollarHolos: [number, number, number][] = [
  [-8, 4, -8], [8, 5, -8], [-8, 4.5, 8], [8, 5, 8],
  [0, 6, -18], [0, 6, 18], [-18, 5, 0], [18, 5, 0],
];

export default function World() {
  const groundRef = useRef<THREE.Mesh>(null!);

  return (
    <group>
      {/* Dark cyber ground */}
      <mesh ref={groundRef} receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#0b0b1f" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Glowing grid overlay */}
      <GridFloor />

      {/* Neon roads (cross pattern) */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <planeGeometry args={[3, 50]} />
        <meshStandardMaterial
          color="#1e1b4b"
          emissive="#22d3ee"
          emissiveIntensity={0.4}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <planeGeometry args={[50, 3]} />
        <meshStandardMaterial
          color="#1e1b4b"
          emissive="#a855f7"
          emissiveIntensity={0.4}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>

      {/* Central plaza */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[2.5, 4, 32]} />
        <meshStandardMaterial
          color="#1e1b4b"
          emissive="#fbbf24"
          emissiveIntensity={0.5}
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>

      {/* BotCity sign hologram in center plaza */}
      <Text
        position={[0, 4.5, 0]}
        fontSize={0.7}
        color="#22d3ee"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.04}
        outlineColor="#a855f7"
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
        outlineColor="#000000"
      >
        ✦ MoneyVerse Hub ✦
      </Text>

      {/* Data spires (replace trees) */}
      {spirePositions.map((s, i) => (
        <DataSpire key={`spire-${i}`} pos={s.pos} height={s.height} hue={s.hue} />
      ))}

      {/* Neon lamps */}
      {lampPositions.map((l, i) => (
        <NeonLamp key={`lamp-${i}`} pos={l.pos} color={l.color} />
      ))}

      {/* Floating coins */}
      {coinPositions.map((pos, i) => (
        <Coin key={`coin-${i}`} pos={pos} delay={i * 0.3} />
      ))}

      {/* Floating dollar holograms */}
      {dollarHolos.map((pos, i) => (
        <DollarHolo key={`holo-${i}`} pos={pos} scale={0.8 + (i % 3) * 0.3} />
      ))}

      {/* Distant skyline towers */}
      {distantTowers.map((t, i) => (
        <DistantTower key={`tower-${i}`} pos={t.pos} height={t.height} color={t.color} />
      ))}

      {/* Boundary glowing rails */}
      {[-23, 23].map((x) => (
        <mesh key={`fx${x}`} position={[x, 0.5, 0]} castShadow>
          <boxGeometry args={[0.15, 1, 46]} />
          <meshStandardMaterial color="#1e1b4b" emissive="#22d3ee" emissiveIntensity={0.8} />
        </mesh>
      ))}
      {[-23, 23].map((z) => (
        <mesh key={`fz${z}`} position={[0, 0.5, z]} castShadow>
          <boxGeometry args={[46, 1, 0.15]} />
          <meshStandardMaterial color="#1e1b4b" emissive="#a855f7" emissiveIntensity={0.8} />
        </mesh>
      ))}
    </group>
  );
}
