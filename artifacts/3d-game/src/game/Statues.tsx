import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

type Pose = "hero" | "thinker" | "wave" | "salute" | "point";

interface StatueProps {
  position: [number, number, number];
  rotation?: number;
  pose?: Pose;
  plaque: string;
}

// Static MoneyBot rendered in the same color palette as the playable bot
function StatueMoneyBot({ pose = "hero" }: { pose?: Pose }) {
  // Arm and leg poses
  const poses = {
    hero:    { armL: [0, 0, -0.15], armR: [0, 0,  0.15], legL: [0, 0, 0], legR: [0, 0, 0] },
    salute:  { armL: [0, 0, -0.15], armR: [-2.0, 0, 0.4], legL: [0, 0, 0], legR: [0, 0, 0] },
    wave:    { armL: [0, 0, -0.15], armR: [-2.4, 0, 0.6], legL: [0, 0, 0], legR: [0, 0, 0] },
    thinker: { armL: [0, 0, -0.15], armR: [-1.4, 0, 0.5], legL: [0.3, 0, 0], legR: [0, 0, 0] },
    point:   { armL: [0, 0, -0.15], armR: [-1.6, 0, 0], legL: [0, 0, 0], legR: [0, 0, 0] },
  } as const;
  const p = poses[pose];

  return (
    <group scale={1.6}>
      {/* Torso */}
      <mesh castShadow position={[0, 0.55, 0]}>
        <boxGeometry args={[0.7, 0.9, 0.45]} />
        <meshStandardMaterial color="#15803d" emissive="#22c55e" emissiveIntensity={0.4} metalness={0.7} roughness={0.25} />
      </mesh>
      {/* Belly panel */}
      <mesh position={[0, 0.5, 0.23]}>
        <boxGeometry args={[0.45, 0.55, 0.02]} />
        <meshStandardMaterial color="#052e16" emissive="#86efac" emissiveIntensity={0.4} />
      </mesh>
      {/* Gold $ chest emblem */}
      <Text position={[0, 0.65, 0.25]} fontSize={0.32} color="#fbbf24" anchorX="center" anchorY="middle" outlineWidth={0.02} outlineColor="#000000">
        $
      </Text>
      {/* Shoulder bolts */}
      <mesh position={[0.38, 0.9, 0]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial color="#86efac" emissive="#86efac" emissiveIntensity={0.8} metalness={0.9} />
      </mesh>
      <mesh position={[-0.38, 0.9, 0]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial color="#86efac" emissive="#86efac" emissiveIntensity={0.8} metalness={0.9} />
      </mesh>
      {/* Head */}
      <mesh castShadow position={[0, 1.25, 0]}>
        <boxGeometry args={[0.55, 0.5, 0.5]} />
        <meshStandardMaterial color="#166534" emissive="#22c55e" emissiveIntensity={0.35} metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Eye visor */}
      <mesh position={[0, 1.27, 0.26]}>
        <boxGeometry args={[0.42, 0.18, 0.02]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.1, 1.27, 0.28]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshStandardMaterial color="#bbf7d0" emissive="#22c55e" emissiveIntensity={2} toneMapped={false} />
      </mesh>
      <mesh position={[0.1, 1.27, 0.28]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshStandardMaterial color="#bbf7d0" emissive="#22c55e" emissiveIntensity={2} toneMapped={false} />
      </mesh>
      {/* Mouth grille */}
      <mesh position={[0, 1.12, 0.26]}>
        <boxGeometry args={[0.2, 0.04, 0.02]} />
        <meshStandardMaterial color="#86efac" emissive="#86efac" emissiveIntensity={0.6} />
      </mesh>
      {/* Antenna */}
      <mesh position={[0, 1.6, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.25, 6]} />
        <meshStandardMaterial color="#374151" metalness={0.9} />
      </mesh>
      <mesh position={[0, 1.75, 0]}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={2} toneMapped={false} />
      </mesh>
      {/* Head fins */}
      <mesh position={[0.3, 1.25, 0]} rotation={[0, 0, -Math.PI / 8]}>
        <boxGeometry args={[0.04, 0.18, 0.3]} />
        <meshStandardMaterial color="#86efac" emissive="#22c55e" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[-0.3, 1.25, 0]} rotation={[0, 0, Math.PI / 8]}>
        <boxGeometry args={[0.04, 0.18, 0.3]} />
        <meshStandardMaterial color="#86efac" emissive="#22c55e" emissiveIntensity={0.6} />
      </mesh>
      {/* Left Arm */}
      <group position={[-0.38, 0.8, 0]} rotation={p.armL as [number, number, number]}>
        <mesh castShadow position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.5, 8]} />
          <meshStandardMaterial color="#166534" emissive="#22c55e" emissiveIntensity={0.3} metalness={0.8} />
        </mesh>
        <mesh castShadow position={[0, -0.6, 0]}>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshStandardMaterial color="#15803d" emissive="#86efac" emissiveIntensity={0.5} metalness={0.9} />
        </mesh>
      </group>
      {/* Right Arm */}
      <group position={[0.38, 0.8, 0]} rotation={p.armR as [number, number, number]}>
        <mesh castShadow position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.5, 8]} />
          <meshStandardMaterial color="#166534" emissive="#22c55e" emissiveIntensity={0.3} metalness={0.8} />
        </mesh>
        <mesh castShadow position={[0, -0.6, 0]}>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshStandardMaterial color="#15803d" emissive="#86efac" emissiveIntensity={0.5} metalness={0.9} />
        </mesh>
      </group>
      {/* Left Leg */}
      <group position={[-0.18, 0.3, 0]} rotation={p.legL as [number, number, number]}>
        <mesh castShadow position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.5, 8]} />
          <meshStandardMaterial color="#166534" emissive="#22c55e" emissiveIntensity={0.3} metalness={0.8} />
        </mesh>
        <mesh castShadow position={[0, -0.43, 0.05]}>
          <boxGeometry args={[0.22, 0.12, 0.3]} />
          <meshStandardMaterial color="#0f172a" emissive="#22c55e" emissiveIntensity={0.4} metalness={0.85} />
        </mesh>
      </group>
      {/* Right Leg */}
      <group position={[0.18, 0.3, 0]} rotation={p.legR as [number, number, number]}>
        <mesh castShadow position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.5, 8]} />
          <meshStandardMaterial color="#166534" emissive="#22c55e" emissiveIntensity={0.3} metalness={0.8} />
        </mesh>
        <mesh castShadow position={[0, -0.43, 0.05]}>
          <boxGeometry args={[0.22, 0.12, 0.3]} />
          <meshStandardMaterial color="#0f172a" emissive="#22c55e" emissiveIntensity={0.4} metalness={0.85} />
        </mesh>
      </group>
    </group>
  );
}

function Statue({ position, rotation = 0, pose = "hero", plaque }: StatueProps) {
  const glowRef = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 1.5 + position[0]) * 0.15;
      glowRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 1.5 + position[0]) * 0.08);
    }
  });

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Green aura halo */}
      <mesh ref={glowRef} position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.4, 2.2, 32]} />
        <meshBasicMaterial color="#22c55e" transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>
      {/* Pedestal base */}
      <mesh castShadow receiveShadow position={[0, 0.4, 0]}>
        <boxGeometry args={[2.4, 0.8, 2.4]} />
        <meshStandardMaterial color="#052e16" emissive="#22c55e" emissiveIntensity={0.25} metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Gold trim ring */}
      <mesh position={[0, 0.82, 0]}>
        <boxGeometry args={[2.5, 0.06, 2.5]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={1.2} metalness={1} toneMapped={false} />
      </mesh>
      {/* Pedestal column */}
      <mesh castShadow receiveShadow position={[0, 1.4, 0]}>
        <boxGeometry args={[1.6, 1.2, 1.6]} />
        <meshStandardMaterial color="#052e16" emissive="#22c55e" emissiveIntensity={0.2} metalness={0.7} roughness={0.35} />
      </mesh>
      {/* Plaque */}
      <mesh position={[0, 1.4, 0.81]}>
        <boxGeometry args={[1.2, 0.5, 0.04]} />
        <meshStandardMaterial color="#020617" emissive="#22c55e" emissiveIntensity={0.4} metalness={0.6} />
      </mesh>
      <Text
        position={[0, 1.55, 0.84]}
        fontSize={0.13}
        color="#86efac"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.1}
        textAlign="center"
      >
        {plaque}
      </Text>
      <Text
        position={[0, 1.28, 0.84]}
        fontSize={0.07}
        color="#fbbf24"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.1}
        textAlign="center"
      >
        — MoneyBot Hall of Fame —
      </Text>
      {/* Statue on top */}
      <group position={[0, 2, 0]}>
        <StatueMoneyBot pose={pose} />
      </group>
      {/* Green up-light */}
      <pointLight position={[0, 3, 0]} intensity={1.5} color="#22c55e" distance={8} />
    </group>
  );
}

// Statues placed at major intersections — facing the city center
const statues: StatueProps[] = [
  // 4 corner intersections of inner blocks
  { position: [-18, 0, -18], rotation:  Math.PI / 4,           pose: "hero",    plaque: "MOMOBOT\nThe Founder" },
  { position: [ 18, 0, -18], rotation: -Math.PI / 4,           pose: "salute",  plaque: "GENERAL\nGEARWORTH" },
  { position: [-18, 0,  18], rotation:  Math.PI * 3 / 4,       pose: "thinker", plaque: "PROF.\nLEDGERINGTON" },
  { position: [ 18, 0,  18], rotation: -Math.PI * 3 / 4,       pose: "wave",    plaque: "MAYOR\nBYTECOIN" },
  // 4 cardinal end-of-avenue statues, facing inward
  { position: [  0, 0, -36], rotation: 0,                      pose: "point",   plaque: "THE\nFIRST BOT" },
  { position: [  0, 0,  36], rotation: Math.PI,                pose: "salute",  plaque: "BOT OF\nLIBERTY" },
  { position: [-36, 0,   0], rotation:  Math.PI / 2,           pose: "wave",    plaque: "AUDITOR\nPRIME" },
  { position: [ 36, 0,   0], rotation: -Math.PI / 2,           pose: "thinker", plaque: "GOVERNOR\nSILICONIA" },
];

export default function Statues() {
  return (
    <group>
      {statues.map((s, i) => (
        <Statue key={`statue-${i}`} {...s} />
      ))}
    </group>
  );
}
