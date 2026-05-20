import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

const messages = [
  "💰 PAY YOUR\n  TAXES",
  "📈 BotCity\nINVESTS!",
  "🤖 BE A\nGOOD BOT",
  "💵 W-2 = YOUR\n  INCOME",
  "🏦 BANK\n  ON IT",
  "⚡ TAX SEASON\n IS NOW",
];

interface BillboardProps {
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
  msgIndex: number;
}

function Billboard({ position, rotation, color, msgIndex }: BillboardProps) {
  const [currentMsg, setCurrentMsg] = useState(msgIndex % messages.length);
  const frameRef = useRef<THREE.Mesh>(null!);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentMsg((c) => (c + 1) % messages.length);
    }, 3500 + (msgIndex % 3) * 700);
    return () => clearInterval(id);
  }, [msgIndex]);

  useFrame((state) => {
    if (frameRef.current) {
      const mat = frameRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 1.2 + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.5;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Post */}
      <mesh position={[0, -2, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 4, 8]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} />
      </mesh>
      {/* Frame */}
      <mesh ref={frameRef} position={[0, 0, 0]}>
        <boxGeometry args={[3.5, 2.2, 0.15]} />
        <meshStandardMaterial color="#052e16" emissive={color} emissiveIntensity={1.2} metalness={0.5} />
      </mesh>
      {/* Inner glowing panel */}
      <mesh position={[0, 0, 0.09]}>
        <boxGeometry args={[3.2, 1.9, 0.02]} />
        <meshStandardMaterial color="#020617" emissive={color} emissiveIntensity={0.4} />
      </mesh>
      {/* Text */}
      <Text
        position={[0, 0, 0.12]}
        fontSize={0.32}
        color={color}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
        maxWidth={3}
        textAlign="center"
      >
        {messages[currentMsg]}
      </Text>
    </group>
  );
}

const billboards: BillboardProps[] = [
  { position: [-12, 3, -12], rotation: [0, Math.PI / 4, 0], color: "#4ade80", msgIndex: 0 },
  { position: [12, 3, -12], rotation: [0, -Math.PI / 4, 0], color: "#fbbf24", msgIndex: 1 },
  { position: [-12, 3, 12], rotation: [0, (3 * Math.PI) / 4, 0], color: "#22c55e", msgIndex: 2 },
  { position: [12, 3, 12], rotation: [0, -(3 * Math.PI) / 4, 0], color: "#86efac", msgIndex: 3 },
  { position: [0, 3, -20], rotation: [0, 0, 0], color: "#4ade80", msgIndex: 4 },
  { position: [0, 3, 20], rotation: [0, Math.PI, 0], color: "#fbbf24", msgIndex: 5 },
];

export default function Billboards() {
  return (
    <group>
      {billboards.map((b, i) => (
        <Billboard key={`bb-${i}`} {...b} />
      ))}
    </group>
  );
}
