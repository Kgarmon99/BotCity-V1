import { useRef } from "react";
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
  const trimRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    if (glowRef.current && isNear) {
      glowRef.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 3) * 0.04);
    }
    if (trimRef.current) {
      const mat = trimRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.8 + Math.sin(clock.elapsedTime * 2 + data.position[0]) * 0.3;
    }
  });

  const { label, position, color, roofColor, width, depth, height, emoji, visited } = data;
  const doorH = Math.min(1.8, height * 0.4);
  const doorW = Math.min(1.0, width * 0.2);

  return (
    <group position={position}>
      {/* Main building body */}
      <mesh castShadow receiveShadow ref={glowRef}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial
          color="#0f172a"
          emissive={color}
          emissiveIntensity={isNear ? 0.4 : 0.15}
          metalness={0.7}
          roughness={0.25}
        />
      </mesh>

      {/* Neon trim around base */}
      <mesh ref={trimRef} position={[0, -height / 2 + 0.1, 0]}>
        <boxGeometry args={[width + 0.15, 0.15, depth + 0.15]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} />
      </mesh>

      {/* Neon trim around top */}
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[width + 0.15, 0.1, depth + 0.15]} />
        <meshStandardMaterial color={roofColor} emissive={roofColor} emissiveIntensity={1.2} />
      </mesh>

      {/* Roof */}
      <mesh position={[0, height / 2 + 0.3, 0]} castShadow>
        <boxGeometry args={[width + 0.3, 0.5, depth + 0.3]} />
        <meshStandardMaterial color="#0f172a" emissive={roofColor} emissiveIntensity={0.3} metalness={0.8} />
      </mesh>

      {/* Glowing windows */}
      {Array.from({ length: Math.max(1, Math.floor(height / 2)) }).map((_, i) => (
        <group key={i}>
          <mesh position={[width / 3, -height / 2 + 1.5 + i * 1.8, depth / 2 + 0.02]}>
            <boxGeometry args={[0.6, 0.4, 0.05]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} />
          </mesh>
          <mesh position={[-width / 3, -height / 2 + 1.5 + i * 1.8, depth / 2 + 0.02]}>
            <boxGeometry args={[0.6, 0.4, 0.05]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} />
          </mesh>
        </group>
      ))}

      {/* Door */}
      <mesh position={[0, -height / 2 + doorH / 2, depth / 2 + 0.01]} castShadow>
        <boxGeometry args={[doorW, doorH, 0.05]} />
        <meshStandardMaterial color="#0f172a" emissive={color} emissiveIntensity={0.6} />
      </mesh>

      {/* Door light strip above */}
      <mesh position={[0, -height / 2 + doorH + 0.15, depth / 2 + 0.02]}>
        <boxGeometry args={[doorW + 0.2, 0.06, 0.05]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
      </mesh>

      {/* Visited checkmark */}
      {visited && (
        <group position={[0, height / 2 + 1.1, 0]}>
          <mesh>
            <sphereGeometry args={[0.3, 12, 12]} />
            <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={1} />
          </mesh>
          <Text position={[0, 0, 0.31]} fontSize={0.35} color="#ffffff" anchorX="center" anchorY="middle">
            ✓
          </Text>
        </group>
      )}

      {/* "Press E" prompt when near */}
      {isNear && (
        <group position={[0, height / 2 + 1.8, 0]}>
          <mesh>
            <planeGeometry args={[2.5, 0.55]} />
            <meshBasicMaterial color="#000000" transparent opacity={0.85} />
          </mesh>
          <Text
            position={[0, 0, 0.01]}
            fontSize={0.32}
            color="#fbbf24"
            anchorX="center"
            anchorY="middle"
          >
            ⚡ Press E to enter
          </Text>
        </group>
      )}

      {/* Building label */}
      <Text
        position={[0, height / 2 + 0.7, depth / 2 + 0.3]}
        fontSize={0.45}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.06}
        outlineColor={color}
      >
        {emoji} {label}
      </Text>
    </group>
  );
}
