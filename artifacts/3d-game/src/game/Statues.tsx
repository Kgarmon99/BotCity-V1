import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

interface StatueProps {
  position: [number, number, number];
  rotation?: number;
  pose?: "hero" | "thinker" | "wave" | "salute";
  plaque: string;
  pedestalColor?: string;
}

function StatueBot({ pose = "hero" }: { pose?: StatueProps["pose"] }) {
  const goldMat = (intensity = 0.4) => (
    <meshStandardMaterial
      color="#a16207"
      emissive="#fbbf24"
      emissiveIntensity={intensity}
      metalness={1}
      roughness={0.15}
    />
  );
  const darkGoldMat = (
    <meshStandardMaterial color="#78350f" emissive="#f59e0b" emissiveIntensity={0.3} metalness={1} roughness={0.2} />
  );

  // Arm/leg poses per stance
  const armL =
    pose === "wave" ? { rot: [0, 0, -2.4] as [number, number, number] }
      : pose === "salute" ? { rot: [0, 0, -1.6] as [number, number, number] }
      : pose === "thinker" ? { rot: [-1.2, 0, -0.3] as [number, number, number] }
      : { rot: [0, 0, -0.15] as [number, number, number] };
  const armR =
    pose === "wave" ? { rot: [0, 0, 0.15] as [number, number, number] }
      : pose === "salute" ? { rot: [0, 0, 0.15] as [number, number, number] }
      : pose === "thinker" ? { rot: [0, 0, 0.15] as [number, number, number] }
      : { rot: [0, 0, 0.15] as [number, number, number] };

  return (
    <group scale={1.6}>
      {/* Torso */}
      <mesh castShadow position={[0, 0.55, 0]}>
        <boxGeometry args={[0.7, 0.9, 0.45]} />
        {goldMat(0.35)}
      </mesh>
      {/* Belly emblem */}
      <mesh position={[0, 0.5, 0.23]}>
        <boxGeometry args={[0.45, 0.55, 0.02]} />
        {darkGoldMat}
      </mesh>
      <Text position={[0, 0.6, 0.25]} fontSize={0.35} color="#fef3c7" anchorX="center" anchorY="middle" outlineWidth={0.02} outlineColor="#78350f">
        $
      </Text>
      {/* Shoulder bolts */}
      <mesh position={[0.38, 0.9, 0]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        {goldMat(0.5)}
      </mesh>
      <mesh position={[-0.38, 0.9, 0]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        {goldMat(0.5)}
      </mesh>
      {/* Head */}
      <mesh castShadow position={[0, 1.25, 0]}>
        <boxGeometry args={[0.55, 0.5, 0.5]} />
        {goldMat(0.3)}
      </mesh>
      <mesh position={[0, 1.27, 0.26]}>
        <boxGeometry args={[0.42, 0.18, 0.02]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      {/* Eyes (frozen) */}
      <mesh position={[-0.1, 1.27, 0.28]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshStandardMaterial color="#fef3c7" emissive="#fbbf24" emissiveIntensity={1.5} toneMapped={false} />
      </mesh>
      <mesh position={[0.1, 1.27, 0.28]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshStandardMaterial color="#fef3c7" emissive="#fbbf24" emissiveIntensity={1.5} toneMapped={false} />
      </mesh>
      {/* Antenna */}
      <mesh position={[0, 1.6, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.25, 6]} />
        {darkGoldMat}
      </mesh>
      <mesh position={[0, 1.75, 0]}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={2.5} toneMapped={false} />
      </mesh>
      {/* Head fins */}
      <mesh position={[0.3, 1.25, 0]} rotation={[0, 0, -Math.PI / 8]}>
        <boxGeometry args={[0.04, 0.18, 0.3]} />
        {goldMat(0.4)}
      </mesh>
      <mesh position={[-0.3, 1.25, 0]} rotation={[0, 0, Math.PI / 8]}>
        <boxGeometry args={[0.04, 0.18, 0.3]} />
        {goldMat(0.4)}
      </mesh>
      {/* Arms (posed) */}
      <group position={[-0.38, 0.8, 0]} rotation={armL.rot}>
        <mesh castShadow position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.5, 8]} />
          {goldMat(0.3)}
        </mesh>
        <mesh castShadow position={[0, -0.6, 0]}>
          <sphereGeometry args={[0.12, 12, 12]} />
          {goldMat(0.5)}
        </mesh>
      </group>
      <group position={[0.38, 0.8, 0]} rotation={armR.rot}>
        <mesh castShadow position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.5, 8]} />
          {goldMat(0.3)}
        </mesh>
        <mesh castShadow position={[0, -0.6, 0]}>
          <sphereGeometry args={[0.12, 12, 12]} />
          {goldMat(0.5)}
        </mesh>
      </group>
      {/* Legs */}
      <mesh castShadow position={[-0.18, 0.15, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.5, 8]} />
        {goldMat(0.3)}
      </mesh>
      <mesh castShadow position={[0.18, 0.15, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.5, 8]} />
        {goldMat(0.3)}
      </mesh>
      {/* Feet */}
      <mesh castShadow position={[-0.18, -0.13, 0.05]}>
        <boxGeometry args={[0.22, 0.12, 0.3]} />
        {darkGoldMat}
      </mesh>
      <mesh castShadow position={[0.18, -0.13, 0.05]}>
        <boxGeometry args={[0.22, 0.12, 0.3]} />
        {darkGoldMat}
      </mesh>
    </group>
  );
}

function Statue({ position, rotation = 0, pose = "hero", plaque, pedestalColor = "#052e16" }: StatueProps) {
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
      {/* Aura halo on ground */}
      <mesh ref={glowRef} position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.4, 2.2, 32]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>
      {/* Pedestal base */}
      <mesh castShadow receiveShadow position={[0, 0.4, 0]}>
        <boxGeometry args={[2.4, 0.8, 2.4]} />
        <meshStandardMaterial color={pedestalColor} emissive="#22c55e" emissiveIntensity={0.25} metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Pedestal top trim */}
      <mesh position={[0, 0.82, 0]}>
        <boxGeometry args={[2.5, 0.06, 2.5]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={1.2} metalness={1} toneMapped={false} />
      </mesh>
      {/* Pedestal column */}
      <mesh castShadow receiveShadow position={[0, 1.4, 0]}>
        <boxGeometry args={[1.6, 1.2, 1.6]} />
        <meshStandardMaterial color={pedestalColor} emissive="#22c55e" emissiveIntensity={0.2} metalness={0.7} roughness={0.35} />
      </mesh>
      {/* Plaque */}
      <mesh position={[0, 1.4, 0.81]}>
        <boxGeometry args={[1.2, 0.5, 0.04]} />
        <meshStandardMaterial color="#020617" emissive="#fbbf24" emissiveIntensity={0.4} metalness={0.6} />
      </mesh>
      <Text
        position={[0, 1.55, 0.84]}
        fontSize={0.13}
        color="#fbbf24"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.1}
        textAlign="center"
      >
        {plaque}
      </Text>
      <Text
        position={[0, 1.28, 0.84]}
        fontSize={0.08}
        color="#86efac"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.1}
        textAlign="center"
      >
        — BotCity Founders' Council —
      </Text>
      {/* Statue itself on top */}
      <group position={[0, 2, 0]}>
        <StatueBot pose={pose} />
      </group>
      {/* Spotlight from below to lift the gold */}
      <pointLight position={[0, 3, 0]} intensity={1.5} color="#fbbf24" distance={8} />
    </group>
  );
}

const statues: StatueProps[] = [
  { position: [-20, 0, -20], rotation: Math.PI / 4, pose: "hero", plaque: "MOMOBOT\nThe Founder" },
  { position: [20, 0, -20], rotation: -Math.PI / 4, pose: "salute", plaque: "GENERAL\nGEARWORTH" },
  { position: [-20, 0, 20], rotation: (3 * Math.PI) / 4, pose: "thinker", plaque: "PROF.\nLEDGERINGTON" },
  { position: [20, 0, 20], rotation: -(3 * Math.PI) / 4, pose: "wave", plaque: "MAYOR\nBYTECOIN" },
  { position: [0, 0, -30], rotation: 0, pose: "hero", plaque: "THE\nFIRST BOT" },
  { position: [0, 0, 30], rotation: Math.PI, pose: "salute", plaque: "BOT OF\nLIBERTY" },
  { position: [-30, 0, 0], rotation: Math.PI / 2, pose: "wave", plaque: "AUDITOR\nPRIME" },
  { position: [30, 0, 0], rotation: -Math.PI / 2, pose: "thinker", plaque: "GOVERNOR\nSILICONIA" },
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
