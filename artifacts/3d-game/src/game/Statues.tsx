import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { MoneyBotModel, type MoneyBotAnim } from "./MoneyBotModel";

type Pose = "hero" | "thinker" | "wave" | "salute" | "point";

interface StatueProps {
  position: [number, number, number];
  rotation?: number;
  pose?: Pose;
  plaque: string;
}

// Each named "pose" maps to one of the GLB's baked animations so the
// hand-of-fame line-up reads with variety.
const POSE_TO_ANIM: Record<Pose, MoneyBotAnim> = {
  hero: "Idle",
  salute: "RightHand",
  wave: "LeftHand",
  thinker: "Idle",
  point: "UpPoint",
};

function Statue({ position, rotation = 0, pose = "hero", plaque }: StatueProps) {
  const glowRef = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 1.5 + position[0]) * 0.15;
      glowRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 1.5 + position[0]) * 0.08);
    }
  });

  // Deterministic per-statue phase offset (0..1) so identical animations
  // don't beat in unison across the 8-statue ensemble.
  const phase = (((position[0] * 13 + position[2] * 7) % 100) + 100) / 100;

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
      {/* Official MoneyBot model on top of the pedestal */}
      <group position={[0, 2, 0]}>
        <MoneyBotModel scale={1.5} animation={POSE_TO_ANIM[pose]} phase={phase} />
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
