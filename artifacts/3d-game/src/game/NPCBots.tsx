import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface NPCProps {
  centerX: number;
  centerZ: number;
  radius: number;
  speed: number;
  phase: number;
  scale?: number;
  color: string;
  emissive: string;
}

function NPC({ centerX, centerZ, radius, speed, phase, scale = 0.7, color, emissive }: NPCProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const bodyRef = useRef<THREE.Group>(null!);
  const lArmRef = useRef<THREE.Mesh>(null!);
  const rArmRef = useRef<THREE.Mesh>(null!);
  const lLegRef = useRef<THREE.Mesh>(null!);
  const rLegRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + phase;
    const x = centerX + Math.cos(t) * radius;
    const z = centerZ + Math.sin(t) * radius;
    if (groupRef.current) {
      groupRef.current.position.x = x;
      groupRef.current.position.z = z;
      const nextX = centerX + Math.cos(t + 0.05) * radius;
      const nextZ = centerZ + Math.sin(t + 0.05) * radius;
      const dx = nextX - x;
      const dz = nextZ - z;
      groupRef.current.rotation.y = Math.atan2(dx, dz);
    }
    if (bodyRef.current) {
      bodyRef.current.position.y = 0.5 * scale + Math.abs(Math.sin(t * 8)) * 0.08;
    }
    const swing = Math.sin(t * 8) * 0.6;
    if (lArmRef.current) lArmRef.current.rotation.x = swing;
    if (rArmRef.current) rArmRef.current.rotation.x = -swing;
    if (lLegRef.current) lLegRef.current.rotation.x = swing * 0.8;
    if (rLegRef.current) rLegRef.current.rotation.x = -swing * 0.8;
  });

  return (
    <group ref={groupRef} scale={scale}>
      <group ref={bodyRef}>
        {/* Torso */}
        <mesh castShadow>
          <boxGeometry args={[0.5, 0.7, 0.35]} />
          <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={0.5} metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Head */}
        <mesh position={[0, 0.55, 0]} castShadow>
          <boxGeometry args={[0.4, 0.4, 0.4]} />
          <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={0.4} metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Eye visor */}
        <mesh position={[0, 0.57, 0.21]}>
          <boxGeometry args={[0.28, 0.08, 0.02]} />
          <meshStandardMaterial color={emissive} emissive={emissive} emissiveIntensity={2} toneMapped={false} />
        </mesh>
        {/* Antenna */}
        <mesh position={[0, 0.85, 0]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={2} toneMapped={false} />
        </mesh>
        {/* Arms */}
        <mesh ref={lArmRef} position={[-0.3, 0.1, 0]} castShadow>
          <boxGeometry args={[0.1, 0.5, 0.1]} />
          <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={0.3} metalness={0.7} />
        </mesh>
        <mesh ref={rArmRef} position={[0.3, 0.1, 0]} castShadow>
          <boxGeometry args={[0.1, 0.5, 0.1]} />
          <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={0.3} metalness={0.7} />
        </mesh>
      </group>
      {/* Legs */}
      <mesh ref={lLegRef} position={[-0.13, 0.2, 0]} castShadow>
        <boxGeometry args={[0.15, 0.4, 0.15]} />
        <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={0.3} metalness={0.7} />
      </mesh>
      <mesh ref={rLegRef} position={[0.13, 0.2, 0]} castShadow>
        <boxGeometry args={[0.15, 0.4, 0.15]} />
        <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={0.3} metalness={0.7} />
      </mesh>
      {/* Ground aura */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 0.7, 16]} />
        <meshBasicMaterial color={emissive} transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// All NPCs use the BotCity emerald palette with amber accent bots for variety —
// chassis is dark slate/emerald, visor/aura emits a green or gold glow.
const npcs: NPCProps[] = [
  // Plaza orbiters
  { centerX: 0, centerZ: 0, radius: 9,  speed:  0.30, phase: 0,   color: "#064e3b", emissive: "#22c55e" },
  { centerX: 0, centerZ: 0, radius: 11, speed: -0.25, phase: 2,   color: "#0f172a", emissive: "#86efac" },
  { centerX: 0, centerZ: 0, radius: 13, speed:  0.20, phase: 4,   color: "#052e16", emissive: "#fbbf24" },
  // Block-corner stragglers
  { centerX: -8, centerZ: -8, radius: 4,   speed:  0.40, phase: 1,   scale: 0.6,  color: "#022c22", emissive: "#4ade80" },
  { centerX:  8, centerZ:  8, radius: 4,   speed: -0.40, phase: 3,   scale: 0.6,  color: "#0f172a", emissive: "#fcd34d" },
  { centerX: -8, centerZ:  8, radius: 3.5, speed:  0.50, phase: 1.5, scale: 0.55, color: "#064e3b", emissive: "#86efac" },
  { centerX:  8, centerZ: -8, radius: 3.5, speed: -0.50, phase: 2.5, scale: 0.55, color: "#052e16", emissive: "#22c55e" },
];

export default function NPCBots() {
  return (
    <group>
      {npcs.map((n, i) => (
        <NPC key={`npc-${i}`} {...n} />
      ))}
    </group>
  );
}
