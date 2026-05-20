import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

export interface BuildingData {
  id: string;
  label: string;
  position: [number, number, number];
  color: string;
  roofColor: string;
  width: number;
  depth: number;
  height: number;
  emoji: string;
  visited: boolean;
  available: boolean;
}

interface BuildingProps {
  data: BuildingData;
  playerPos: THREE.Vector3;
  isNear: boolean;
}

export default function Building({ data, isNear }: BuildingProps) {
  const glowRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    if (glowRef.current && isNear) {
      glowRef.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 3) * 0.04);
    }
  });

  const { id, label, position, color, roofColor, width, depth, height, emoji, visited } = data;
  const doorH = Math.min(1.6, height * 0.4);
  const doorW = Math.min(0.9, width * 0.2);

  return (
    <group position={position}>
      <mesh castShadow receiveShadow ref={glowRef}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial
          color={color}
          emissive={isNear ? color : "#000000"}
          emissiveIntensity={isNear ? 0.15 : 0}
        />
      </mesh>

      <mesh position={[0, height / 2 + 0.25, 0]} castShadow>
        <boxGeometry args={[width + 0.3, 0.5, depth + 0.3]} />
        <meshStandardMaterial color={roofColor} />
      </mesh>

      <mesh
        position={[0, -height / 2 + doorH / 2, depth / 2 + 0.01]}
        castShadow
      >
        <boxGeometry args={[doorW, doorH, 0.05]} />
        <meshStandardMaterial color="#5c3d1e" />
      </mesh>

      {visited && (
        <mesh position={[0, height / 2 + 0.9, 0]}>
          <sphereGeometry args={[0.25, 8, 8]} />
          <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.6} />
        </mesh>
      )}

      {isNear && (
        <Text
          position={[0, height / 2 + 1.5, 0]}
          fontSize={0.45}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.06}
          outlineColor="#000000"
        >
          Press E to enter
        </Text>
      )}

      <Text
        position={[0, height / 2 + 0.9, depth / 2 + 0.3]}
        fontSize={0.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.07}
        outlineColor="#000000"
      >
        {emoji} {label}
      </Text>
    </group>
  );
}
